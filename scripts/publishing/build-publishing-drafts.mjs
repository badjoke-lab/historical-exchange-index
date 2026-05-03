import fs from 'node:fs/promises';
import path from 'node:path';

const MONITORING_ROOT = path.join('data-staging', 'monitoring');
const OUTPUT_ROOT = path.join('data-staging', 'publishing-drafts');
const INTERNAL_ONLY_MONITORS = new Set([
  'active-status-watch',
  'site-and-seo-watch',
  'monitoring-health-watch',
]);
const NOISE_ONLY_CATEGORIES = new Set([
  'official_site_dns_failure',
  'official_site_http_error',
  'official_site_redirected',
  'evidence_url_http_error',
  'evidence_url_dns_failure',
  'evidence_url_redirected',
  'candidate_discovery_source_empty',
  'news_rss_disabled',
  'regulatory_watch_disabled',
  'site_seo_checks_disabled',
]);
const FORBIDDEN_TERMS = [
  'dangerous',
  'dead soon',
  'will collapse',
  'bankrupt confirmed',
  'unsafe exchange',
  '詐欺',
  '危険',
  '死にそう',
  '破綻確定',
  '出金できないらしい',
  '飛んだ',
];

function parseArgs(argv) {
  const args = {
    monitoringDir: null,
    mode: 'dry-run',
    minPublishable: 1,
    includeReviewNeeded: true,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];
    if (arg === '--monitoring-dir') {
      args.monitoringDir = next;
      i += 1;
    } else if (arg === '--mode') {
      args.mode = next || args.mode;
      i += 1;
    } else if (arg === '--min-publishable') {
      args.minPublishable = Number.parseInt(next || '1', 10);
      i += 1;
    } else if (arg === '--include-review-needed') {
      args.includeReviewNeeded = next !== 'false';
      i += 1;
    }
  }

  return args;
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath, fallback = null) {
  if (!(await exists(filePath))) return fallback;
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

async function readText(filePath, fallback = '') {
  if (!(await exists(filePath))) return fallback;
  return fs.readFile(filePath, 'utf8');
}

async function findLatestMonitoringDir() {
  const entries = await fs.readdir(MONITORING_ROOT, { withFileTypes: true }).catch(() => []);
  const dirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => /^\d{8}$/.test(name))
    .sort();

  if (dirs.length === 0) return null;

  return path.join(MONITORING_ROOT, dirs.at(-1));
}

function normalizeMonitoringDir(input) {
  if (!input) return null;
  return input.replace(/\/$/, '');
}

function normalizeKey(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function getEntityKey(source) {
  const canonicalName = source.canonical_name || source.affected_entity;
  if (canonicalName) return normalizeKey(canonicalName);

  const title = String(source.title || source.headline || source.id || '');
  const newsCandidateMatch = title.match(/^News\/event candidate:\s*(.+)$/i);
  if (newsCandidateMatch) return normalizeKey(newsCandidateMatch[1]);

  return normalizeKey(title);
}

function shouldKeepExternalMotherlistItem(source) {
  return source?.source_category !== 'active_trading_venue_motherlist';
}

function makePublicationItem({ sourceMonitor, sourceFile, sourceType, source }) {
  const sourceId = source.finding_id || source.candidate_id || source.id || null;
  const title = source.title || source.headline || source.canonical_name || `${sourceMonitor} item`;
  const summary = source.summary || source.hei_relevance || source.description || 'Monitoring item requires review.';
  const sourceUrls = Array.isArray(source.source_urls) ? source.source_urls.filter(Boolean) : [];
  const category = source.category || source.source_category || source.record_shape || source.candidate_class || 'unknown';
  const candidateClass = source.candidate_class || null;
  const severity = source.severity || null;

  const item = {
    publication_item_id: null,
    source_monitor: sourceMonitor,
    source_file: sourceFile,
    source_type: sourceType,
    source_ids: sourceId ? [sourceId] : [],
    entity_key: getEntityKey(source),
    source_category: category,
    source_severity: severity,
    candidate_class: candidateClass,
    publishability: 'internal_only',
    recommended_type: 'no_publish',
    title,
    safe_summary: toSafeSummary(summary),
    public_status_label: 'Internal only',
    source_urls: sourceUrls,
    safety_notes: [],
    recommended_action: source.recommended_action || source.next_action || 'review',
    priority: 100,
  };

  applyPublishabilityRules(item, source);
  item.priority = publicationPriority(item, source);
  return item;
}

function applyPublishabilityRules(item, source) {
  const monitor = item.source_monitor;
  const category = item.source_category;
  const sourceUrls = item.source_urls;
  const candidateClass = item.candidate_class;
  const recommendedAction = String(item.recommended_action || '');

  if (INTERNAL_ONLY_MONITORS.has(monitor)) {
    item.publishability = 'internal_only';
    item.recommended_type = 'no_publish';
    item.public_status_label = 'Internal monitoring only';
    item.safety_notes.push(`${monitor} is not used for external publication in v1.`);
    return;
  }

  if (NOISE_ONLY_CATEGORIES.has(category)) {
    item.publishability = 'internal_only';
    item.recommended_type = 'no_publish';
    item.public_status_label = 'Internal monitoring only';
    item.safety_notes.push('Noise/control/status category is not publishable.');
    return;
  }

  if (monitor === 'candidate-discovery') {
    if (!shouldKeepExternalMotherlistItem(source)) {
      item.publishability = 'internal_only';
      item.recommended_type = 'no_publish';
      item.public_status_label = 'Internal active motherlist item';
      item.safety_notes.push('Active trading-venue motherlist candidates are useful for internal discovery but not external publishing drafts in v1.');
    } else if (candidateClass === 'A') {
      item.publishability = 'review_needed';
      item.recommended_type = 'research_note';
      item.public_status_label = 'A candidate / not canonical yet';
      item.safety_notes.push('Candidate discovery requires manual source review before publication.');
    } else if (candidateClass === 'B') {
      item.publishability = 'review_needed';
      item.recommended_type = 'research_note';
      item.public_status_label = 'B candidate / not canonical yet';
      item.safety_notes.push('Candidate discovery requires manual source review before publication.');
    } else {
      item.publishability = 'internal_only';
      item.recommended_type = 'no_publish';
      item.public_status_label = 'Internal only';
    }
    return;
  }

  if (monitor === 'news-and-event-watch') {
    if (sourceUrls.length > 0) {
      item.publishability = source.review_status === 'reviewed' ? 'publishable' : 'review_needed';
      item.recommended_type = 'weekly_watch';
      item.public_status_label = source.review_status === 'reviewed' ? 'Reviewed item' : 'News/event monitoring signal';
      item.safety_notes.push('News/event item should not be treated as a final HEI classification before review.');
    } else {
      item.publishability = 'internal_only';
      item.recommended_type = 'no_publish';
      item.public_status_label = 'Internal only';
      item.safety_notes.push('No public source URLs available.');
    }
    return;
  }

  if (monitor === 'evidence-and-record-quality-watch' || monitor === 'evidence-health-watch') {
    if (category.includes('coverage') || category.includes('aggregate')) {
      item.publishability = 'review_needed';
      item.recommended_type = 'evidence_report';
      item.public_status_label = 'Evidence coverage item';
      item.safety_notes.push('Only aggregate evidence/coverage information may be used externally.');
    } else {
      item.publishability = 'internal_only';
      item.recommended_type = 'no_publish';
      item.public_status_label = 'Internal only';
      item.safety_notes.push('Individual evidence health and record quality findings stay internal.');
    }
    return;
  }

  if (recommendedAction.includes('canonical') || source.review_status === 'reviewed') {
    item.publishability = 'publishable';
    item.recommended_type = 'registry_update';
    item.public_status_label = 'Reviewed HEI update';
    item.safety_notes.push('Marked as reviewed/canonical by source data.');
    return;
  }

  item.publishability = 'internal_only';
  item.recommended_type = 'no_publish';
  item.public_status_label = 'Internal only';
}

function publicationPriority(item, source) {
  if (item.publishability === 'publishable') return 0;
  if (item.source_monitor === 'news-and-event-watch' && item.source_type === 'candidate') return 4;
  if (item.source_monitor === 'news-and-event-watch' && item.candidate_class === 'A') return 5;
  if (item.source_monitor === 'news-and-event-watch') return 10;
  if (item.candidate_class === 'A') return 20;
  if (item.candidate_class === 'B') return 40;
  if (source?.historical_dead_strength === 'medium') return 45;
  return 100;
}

function sortPublicationItems(items) {
  return [...items].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return String(a.title).localeCompare(String(b.title));
  });
}

function dedupePublicationItems(items) {
  const sorted = sortPublicationItems(items);
  const seen = new Set();
  const out = [];

  for (const item of sorted) {
    const sourceKey = item.entity_key || item.title;
    const key = `${item.source_monitor}:${item.recommended_type}:${sourceKey}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }

  return out;
}

function toSafeSummary(value) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) return 'Monitoring item requires review.';
  let safe = text;
  for (const term of FORBIDDEN_TERMS) {
    const pattern = new RegExp(escapeRegExp(term), 'gi');
    safe = safe.replace(pattern, 'requires review');
  }
  return safe;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function assignPublicationIds(items, datePart) {
  return items.map((item, index) => ({
    ...item,
    publication_item_id: `pubitem_${datePart}_${String(index + 1).padStart(3, '0')}`,
  }));
}

function determineRecommendedType(items) {
  const publishable = sortPublicationItems(items.filter((item) => item.publishability === 'publishable'));
  const reviewNeeded = sortPublicationItems(items.filter((item) => item.publishability === 'review_needed'));
  const source = publishable[0] || reviewNeeded[0];
  return source?.recommended_type || 'no_publish';
}

function buildDecision({ runId, monitoringDir, generatedAt, items, minPublishable }) {
  const counts = {
    publishable: items.filter((item) => item.publishability === 'publishable').length,
    review_needed: items.filter((item) => item.publishability === 'review_needed').length,
    internal_only: items.filter((item) => item.publishability === 'internal_only').length,
    no_material: items.length === 0 ? 1 : 0,
  };
  const recommendedPublicationType = counts.publishable >= minPublishable
    ? determineRecommendedType(items.filter((item) => item.publishability === 'publishable'))
    : 'no_publish';
  const shouldPublish = counts.publishable >= minPublishable;
  const reasons = [];
  const nextActions = [];

  if (shouldPublish) {
    reasons.push(`Found ${counts.publishable} publishable item(s) after safety filtering.`);
    nextActions.push('Review generated draft before moving anything to content/updates.');
  } else if (counts.review_needed > 0) {
    reasons.push('No publishable items, but review-needed items exist.');
    nextActions.push('Manually verify review-needed items and add source review before publication.');
  } else if (!monitoringDir) {
    reasons.push('No monitoring run directory was found.');
    nextActions.push('Run HEI Monitoring first, then run publish:draft against that monitoring output.');
  } else {
    reasons.push('No publishable material after safety filtering.');
    nextActions.push('Do not publish this run.');
  }

  return {
    run_id: runId,
    source_monitoring_dir: monitoringDir || null,
    generated_at: generatedAt,
    should_publish: shouldPublish,
    recommended_publication_type: recommendedPublicationType,
    homepage_headliner_available: shouldPublish,
    x_post_available: shouldPublish,
    counts,
    reasons,
    next_actions: nextActions,
  };
}

function buildInternalReview({ dateLabel, decision, items }) {
  const publishable = sortPublicationItems(items.filter((item) => item.publishability === 'publishable'));
  const reviewNeeded = sortPublicationItems(items.filter((item) => item.publishability === 'review_needed'));
  const internalOnly = items.filter((item) => item.publishability === 'internal_only');
  const lines = [];

  lines.push(`# HEI Publishing Draft Review - ${dateLabel}`);
  lines.push('');
  lines.push('## Decision');
  lines.push(`- should_publish: ${decision.should_publish}`);
  lines.push(`- recommended type: ${decision.recommended_publication_type}`);
  lines.push(`- publishable: ${decision.counts.publishable}`);
  lines.push(`- review_needed: ${decision.counts.review_needed}`);
  lines.push(`- internal_only: ${decision.counts.internal_only}`);
  lines.push('');
  lines.push('## Publishable items');
  if (publishable.length === 0) lines.push('- None.');
  for (const item of publishable) {
    lines.push(`- ${item.title} — ${item.public_status_label}`);
  }
  lines.push('');
  lines.push('## Review needed');
  if (reviewNeeded.length === 0) lines.push('- None.');
  for (const item of reviewNeeded.slice(0, 20)) {
    lines.push(`- ${item.title} — ${item.public_status_label}; ${item.safe_summary}`);
  }
  if (reviewNeeded.length > 20) lines.push(`- ...and ${reviewNeeded.length - 20} more review-needed item(s).`);
  lines.push('');
  lines.push('## Internal only summary');
  const byMonitor = countBy(internalOnly, (item) => item.source_monitor);
  if (internalOnly.length === 0) lines.push('- None.');
  for (const [monitor, count] of Object.entries(byMonitor)) {
    lines.push(`- ${monitor}: ${count}`);
  }
  lines.push('');
  lines.push('## Safety notes');
  lines.push('- No raw monitoring output should be published.');
  lines.push('- Active status checks are internal only.');
  lines.push('- Review-needed items are not canonical HEI classifications.');
  lines.push('');
  lines.push('## Suggested next actions');
  decision.next_actions.forEach((action, index) => lines.push(`${index + 1}. ${action}`));
  lines.push('');

  return lines.join('\n');
}

function buildHomepageHeadliner({ dateLabel, decision, items }) {
  if (!decision.homepage_headliner_available) {
    return `---\nsafe_to_publish: false\nreason: no_publishable_material\n---\n\nNo homepage headliner for this run.\n`;
  }
  const first = sortPublicationItems(items).find((item) => item.publishability === 'publishable');
  return `---\ntype: ${decision.recommended_publication_type}\ndate: ${dateLabel}\nsafe_to_publish: true\n---\n\n## Latest from HEI\n\n${first.title}\n\n${first.safe_summary}\n`;
}

function buildUpdatesArticleDraft({ dateLabel, decision, items }) {
  const reviewNeeded = sortPublicationItems(items.filter((item) => item.publishability === 'review_needed'));
  const publishable = sortPublicationItems(items.filter((item) => item.publishability === 'publishable'));
  const safeToPublish = 'false';
  const type = decision.recommended_publication_type;
  const lines = [];

  lines.push('---');
  lines.push(`title: "HEI Publishing Draft - ${dateLabel}"`);
  lines.push(`date: "${dateLabel}"`);
  lines.push(`type: "${type}"`);
  lines.push(`safe_to_publish: ${safeToPublish}`);
  lines.push(`source_run_id: "${decision.run_id}"`);
  lines.push('---');
  lines.push('');
  lines.push(`# HEI Publishing Draft - ${dateLabel}`);
  lines.push('');
  lines.push('## Publication decision');
  lines.push(decision.should_publish
    ? 'Publishable material was found, but this draft still requires manual review before publication.'
    : 'No publishable material was found after safety filtering.');
  lines.push('');
  lines.push('## Publishable items');
  if (publishable.length === 0) lines.push('- None.');
  for (const item of publishable) {
    lines.push(`- ${item.title} — ${item.safe_summary}`);
  }
  lines.push('');
  lines.push('## Review-needed items');
  if (reviewNeeded.length === 0) lines.push('- None.');
  for (const item of reviewNeeded.slice(0, 20)) {
    lines.push(`- ${item.title} — ${item.public_status_label}; ${item.safe_summary}`);
  }
  lines.push('');
  lines.push('## Notes');
  lines.push('This draft is generated from internal monitoring output and is not public-ready.');
  lines.push('Monitoring signals are not final HEI classifications.');
  lines.push('');

  return lines.join('\n');
}

function buildXPostDrafts({ dateLabel, decision, items }) {
  if (!decision.x_post_available) {
    return `# X Post Drafts - ${dateLabel}\n\nNo X post draft generated for this run.\nReason: no publishable material after safety filtering.\n`;
  }
  const publishable = sortPublicationItems(items.filter((item) => item.publishability === 'publishable')).slice(0, 4);
  const lines = [];
  lines.push(`# X Post Drafts - ${dateLabel}`);
  lines.push('');
  lines.push('## Draft 1');
  lines.push('');
  lines.push(`HEI Publishing Update — ${dateLabel}`);
  lines.push('');
  lines.push('Reviewed HEI material is ready for editorial review:');
  for (const item of publishable) {
    lines.push(`- ${truncate(item.title, 70)}`);
  }
  lines.push('');
  lines.push('Full update:');
  lines.push('[URL]');
  lines.push('');
  lines.push('Note: Review before posting. Do not auto-post.');
  lines.push('');
  return lines.join('\n');
}

function buildSourceMap({ runId, items }) {
  return {
    run_id: runId,
    items: items.map((item) => ({
      publication_item_id: item.publication_item_id,
      draft_files: [
        'updates-article-draft.md',
        ...(item.publishability === 'publishable' ? ['homepage-headliner.md', 'x-post-drafts.md'] : []),
      ],
      source_monitor: item.source_monitor,
      source_file: item.source_file,
      source_ids: item.source_ids,
      source_urls: item.source_urls,
    })),
  };
}

function countBy(items, getKey) {
  return items.reduce((acc, item) => {
    const key = getKey(item) || 'unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function truncate(value, length) {
  const text = String(value || '');
  return text.length <= length ? text : `${text.slice(0, length - 1)}…`;
}

function makeNoMonitoringRun() {
  return {
    manifest: {
      run_id: 'no-monitoring-run',
      created_at: new Date().toISOString(),
      mode: 'publishing-draft-only',
      monitors: [],
    },
    summary: '',
    monitorReports: [],
  };
}

async function loadMonitoringRun(monitoringDir) {
  if (!monitoringDir) return makeNoMonitoringRun();

  const manifestPath = path.join(monitoringDir, 'manifest.json');
  const manifest = await readJson(manifestPath, null);
  if (!manifest) {
    throw new Error(`Missing manifest.json in ${monitoringDir}`);
  }

  const summary = await readText(path.join(monitoringDir, 'summary.md'), '');
  const entries = await fs.readdir(monitoringDir, { withFileTypes: true });
  const jsonFiles = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name.endsWith('.json') && name !== 'manifest.json')
    .sort();

  const monitorReports = [];
  for (const fileName of jsonFiles) {
    const filePath = path.join(monitoringDir, fileName);
    const report = await readJson(filePath, null);
    if (report && report.monitor) {
      monitorReports.push({ fileName, filePath, report });
    }
  }

  return { manifest, summary, monitorReports };
}

function collectPublicationItems(monitorReports) {
  const items = [];
  for (const { filePath, report } of monitorReports) {
    const sourceMonitor = report.monitor;
    for (const finding of report.findings || []) {
      items.push(makePublicationItem({
        sourceMonitor,
        sourceFile: filePath,
        sourceType: 'finding',
        source: finding,
      }));
    }
    for (const candidate of report.candidates || []) {
      items.push(makePublicationItem({
        sourceMonitor,
        sourceFile: filePath,
        sourceType: 'candidate',
        source: candidate,
      }));
    }
  }

  const datePart = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  return assignPublicationIds(dedupePublicationItems(items), datePart);
}

async function writeOutputs(outputDir, outputs) {
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, 'publication-decision.json'), `${JSON.stringify(outputs.decision, null, 2)}\n`);
  await fs.writeFile(path.join(outputDir, 'publication-items.json'), `${JSON.stringify(outputs.items, null, 2)}\n`);
  await fs.writeFile(path.join(outputDir, 'source-map.json'), `${JSON.stringify(outputs.sourceMap, null, 2)}\n`);
  await fs.writeFile(path.join(outputDir, 'internal-review.md'), outputs.internalReview);
  await fs.writeFile(path.join(outputDir, 'homepage-headliner.md'), outputs.homepageHeadliner);
  await fs.writeFile(path.join(outputDir, 'updates-article-draft.md'), outputs.updatesArticleDraft);
  await fs.writeFile(path.join(outputDir, 'x-post-drafts.md'), outputs.xPostDrafts);
}

async function main() {
  const args = parseArgs(process.argv);
  const monitoringDir = normalizeMonitoringDir(args.monitoringDir) || await findLatestMonitoringDir();
  const { manifest, monitorReports } = await loadMonitoringRun(monitoringDir);
  const runId = manifest.run_id || path.basename(monitoringDir || 'no-monitoring-run');
  const generatedAt = new Date().toISOString();
  const dateLabel = generatedAt.slice(0, 10);
  const outputDir = path.join(OUTPUT_ROOT, runId);
  const items = collectPublicationItems(monitorReports);
  const decision = buildDecision({
    runId,
    monitoringDir,
    generatedAt,
    items,
    minPublishable: args.minPublishable,
  });

  const outputs = {
    decision,
    items,
    sourceMap: buildSourceMap({ runId, items }),
    internalReview: buildInternalReview({ dateLabel, decision, items }),
    homepageHeadliner: buildHomepageHeadliner({ dateLabel, decision, items }),
    updatesArticleDraft: buildUpdatesArticleDraft({ dateLabel, decision, items }),
    xPostDrafts: buildXPostDrafts({ dateLabel, decision, items }),
  };

  await writeOutputs(outputDir, outputs);
  console.log(`HEI publishing draft generated: ${outputDir}`);
  console.log(`should_publish: ${decision.should_publish}`);
  console.log(`publishable: ${decision.counts.publishable}`);
  console.log(`review_needed: ${decision.counts.review_needed}`);
  console.log(`internal_only: ${decision.counts.internal_only}`);
}

main().catch((error) => {
  console.error(error?.stack || error?.message || error);
  process.exit(1);
});
