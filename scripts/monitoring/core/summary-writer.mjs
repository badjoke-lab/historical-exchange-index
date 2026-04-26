import { SEVERITIES } from './constants.mjs';

function flattenFindings(results) {
  return results.flatMap((result) => (result.findings || []).map((finding) => ({ ...finding, monitor: finding.monitor || result.monitor })));
}

function flattenCandidates(results) {
  return results.flatMap((result) => (result.candidates || []).map((candidate) => ({ ...candidate, monitor: candidate.monitor || result.monitor })));
}

function sectionList(items, render, emptyText = 'None.') {
  if (!items.length) {
    return `- ${emptyText}`;
  }
  return items.map(render).join('\n');
}

function findResult(results, monitor) {
  return results.find((result) => result.monitor === monitor) || null;
}

export function buildSummaryMarkdown({ runId, mode, startedAt, finishedAt, results, hasMeaningfulFindings }) {
  const findings = flattenFindings(results);
  const candidates = flattenCandidates(results);
  const aCandidates = candidates.filter((candidate) => candidate.candidate_class === 'A');
  const bCandidates = candidates.filter((candidate) => candidate.candidate_class === 'B');
  const criticalHigh = findings.filter((finding) => ['critical', 'high'].includes(finding.severity));
  const dataQuality = findings.filter((finding) => finding.monitor === 'evidence-and-record-quality-watch');
  const siteSeo = findings.filter((finding) => finding.monitor === 'site-and-seo-watch');
  const watchlistFindings = findings.filter((finding) => finding.monitor === 'monitoring-health-watch' && finding.category?.includes('watchlist'));
  const monitoringHealth = findResult(results, 'monitoring-health-watch');
  const watchlistState = monitoringHealth?.watchlist_state || null;

  const severityCounts = Object.fromEntries(SEVERITIES.map((severity) => [severity, 0]));
  for (const finding of findings) {
    if (severityCounts[finding.severity] !== undefined) {
      severityCounts[finding.severity] += 1;
    }
  }

  const suggestedActions = [];
  if (criticalHigh.length) {
    suggestedActions.push('Review critical/high alerts before accepting new staging work.');
  }
  if (aCandidates.length) {
    suggestedActions.push('Review A candidates and decide whether to promote them to manual staging packages.');
  }
  if (bCandidates.length) {
    suggestedActions.push('Keep B candidates in watchlist or downgrade/resolve them after review.');
  }
  if (watchlistFindings.length) {
    suggestedActions.push('Review watchlist-state findings and update staging or resolution files as needed.');
  }
  if (!suggestedActions.length) {
    suggestedActions.push('No operator action required.');
  }

  return `# HEI Auto Monitoring Report - ${runId.slice(0, 8)}

## Run

- run_id: ${runId}
- mode: ${mode}
- started_at: ${startedAt}
- finished_at: ${finishedAt}
- meaningful_findings: ${hasMeaningfulFindings ? 'yes' : 'no'}

## Counts

- monitors: ${results.length}
- findings: ${findings.length}
- candidates: ${candidates.length}
- critical: ${severityCounts.critical}
- high: ${severityCounts.high}
- medium: ${severityCounts.medium}
- low: ${severityCounts.low}

## A candidates

${sectionList(aCandidates, (candidate) => `- ${candidate.canonical_name || candidate.headline || candidate.candidate_id} — ${candidate.next_action || 'review'}`)}

## B candidates

${sectionList(bCandidates, (candidate) => `- ${candidate.canonical_name || candidate.headline || candidate.candidate_id} — ${candidate.next_action || 'watchlist'}`)}

## Critical / high alerts

${sectionList(criticalHigh, (finding) => `- [${finding.severity}] ${finding.title} (${finding.monitor}) — ${finding.recommended_action || 'review'}`)}

## Data quality

${sectionList(dataQuality, (finding) => `- [${finding.severity}] ${finding.title} — ${finding.recommended_action || 'review'}`)}

## Watchlist state

${watchlistState ? `- watchlist_files: ${watchlistState.watchlist_files}\n- watchlist_candidates: ${watchlistState.watchlist_candidates}\n- class_A: ${watchlistState.watchlist_class_counts?.A || 0}\n- class_B: ${watchlistState.watchlist_class_counts?.B || 0}\n- class_C: ${watchlistState.watchlist_class_counts?.C || 0}\n- manual_staging_packages: ${watchlistState.manual_staging_packages}\n- resolution_files: ${watchlistState.resolution_files}` : '- Not available.'}

${sectionList(watchlistFindings, (finding) => `- [${finding.severity}] ${finding.title} — ${finding.recommended_action || 'review'}`)}

## Site / SEO

${sectionList(siteSeo, (finding) => `- [${finding.severity}] ${finding.title} — ${finding.recommended_action || 'review'}`)}

## Suggested operator actions

${suggestedActions.map((action, index) => `${index + 1}. ${action}`).join('\n')}
`;
}
