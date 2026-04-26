import { MONITOR_NAMES } from '../core/constants.mjs';
import { createFinding, createMonitorResult } from '../core/finding-utils.mjs';

export async function runMonitoringHealthWatch(context, { startedAt } = {}) {
  const started_at = startedAt || new Date().toISOString();
  const findings = [];

  const canonical = context?.canonicalData;
  if (!canonical) {
    findings.push(createFinding({
      monitor: 'monitoring-health-watch',
      severity: 'critical',
      category: 'canonical_load_missing',
      title: 'Canonical data was not loaded',
      summary: 'The monitoring runner did not provide canonical data to the health monitor.',
      recommended_action: 'fix_monitoring_workflow',
      confidence: 'high',
    }));
  } else {
    const counts = {
      entities: canonical.entities?.length || 0,
      events: canonical.events?.length || 0,
      evidence: canonical.evidence?.length || 0,
    };

    if (counts.entities === 0 || counts.events === 0 || counts.evidence === 0) {
      findings.push(createFinding({
        monitor: 'monitoring-health-watch',
        severity: 'high',
        category: 'canonical_data_empty_or_missing',
        title: 'Canonical data appears empty or incomplete',
        summary: `entities=${counts.entities}, events=${counts.events}, evidence=${counts.evidence}`,
        recommended_action: 'inspect_canonical_data_paths',
        confidence: 'high',
      }));
    }
  }

  const expectedReports = MONITOR_NAMES.length;
  if (expectedReports < 6) {
    findings.push(createFinding({
      monitor: 'monitoring-health-watch',
      severity: 'medium',
      category: 'monitor_registry_incomplete',
      title: 'Monitor registry has fewer monitors than expected',
      summary: `Registered monitors: ${expectedReports}`,
      recommended_action: 'inspect_monitoring_constants',
      confidence: 'medium',
    }));
  }

  return createMonitorResult({
    monitor: 'monitoring-health-watch',
    started_at,
    finished_at: new Date().toISOString(),
    findings,
    candidates: [],
    errors: [],
    extra: {
      checked: {
        canonical_data_loaded: Boolean(canonical),
        registered_monitors: MONITOR_NAMES,
      },
    },
  });
}
