const PRE_B1_EVENT_TYPE_OVERRIDES = new Map([
  ['hei_ev_000679', 'rebrand'],
])

export function restorePreB1LineageEvents(events) {
  return events.map((event) => {
    const eventType = PRE_B1_EVENT_TYPE_OVERRIDES.get(event.id)
    return eventType ? { ...event, event_type: eventType } : event
  })
}
