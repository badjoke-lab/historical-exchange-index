import HomeHubClient from '../components/home/home-hub-client'
import { buildRegistryView } from '../lib/data/build-registry-view'

export default function HomePage() {
  const { entities, summary } = buildRegistryView()
  const archiveCoverage = entities.length > 0
    ? Math.round((entities.filter((item) => item.archived_url).length / entities.length) * 100)
    : 0

  return (
    <HomeHubClient
      entities={entities}
      summary={summary}
      archiveCoverage={archiveCoverage}
    />
  )
}
