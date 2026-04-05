import { buildRegistryView } from './build-registry-view'

export function buildStatsLite() {
  return buildRegistryView().summary
}
