import { buildIncidentTimeline } from '../data/build-incident-timeline'

export const INCIDENT_PAGE_SIZE = 25

export function incidentPageCount() {
  return Math.max(1, Math.ceil(buildIncidentTimeline().length / INCIDENT_PAGE_SIZE))
}

export function incidentPageHref(pageNumber: number) {
  return pageNumber <= 1 ? '/incidents/' : `/incidents/page/${pageNumber}/`
}
