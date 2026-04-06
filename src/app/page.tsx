import { buildRegistryView } from '../lib/data/build-registry-view'
import RegistryExplorerClient from '../components/registry/registry-explorer-client'

export default function HomePage() {
  const { entities, summary } = buildRegistryView()
  const archiveCoverage = entities.length > 0
    ? Math.round((entities.filter((item) => item.archived_url).length / entities.length) * 100)
    : 0

  return (
    <main>
      <RegistryExplorerClient
        entities={entities}
        summary={summary}
        archiveCoverage={archiveCoverage}
      />
    </main>
  )
}
