import { buildStatsView } from '../../lib/stats/build-stats'

export const dynamic = 'force-static'
export const revalidate = false

export function GET() {
  const { history } = buildStatsView()
  return Response.json(history, {
    headers: {
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  })
}
