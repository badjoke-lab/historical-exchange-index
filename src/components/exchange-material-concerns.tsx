import type { EntityRecord } from '../lib/types/entity'
import type { EventRecord } from '../lib/types/event'
import type { EvidenceRecord } from '../lib/types/evidence'

function text(value: unknown) {
  return typeof value === 'string' ? value : ''
}

export default function ExchangeMaterialConcerns({entity,events,evidence}:{entity:EntityRecord;events:EventRecord[];evidence:EvidenceRecord[]}) {
  const eventText = events.map((event)=>`${text(event.event_type)} ${text(event.title)} ${text(event.description)}`).join(' ').toLowerCase()
  const notes = text(entity.notes).toLowerCase()
  const urlStatus = text(entity.official_url_status)
  const concerns: Array<[string,string]> = []

  if (/regulat|enforcement|warning|unregistered|license|registration/.test(eventText + ' ' + notes)) concerns.push(['Regulatory record','Material regulatory or registration-related record present'])
  if (/withdraw|suspend|freeze|halt|restriction/.test(eventText)) concerns.push(['Withdrawal / service restriction','Material restriction event recorded'])
  if (/bankrupt|insolven|liquidat|restructur|collapse|failure/.test(eventText)) concerns.push(['Insolvency / failure chain','Material failure event recorded'])
  if (/fraud|scam|misconduct/.test(eventText + ' ' + notes)) concerns.push(['Fraud / misconduct record','Review timeline and evidence for allegation-versus-finding strength'])
  if (['unsafe','repurposed','dead_domain'].includes(urlStatus)) concerns.push(['Domain / URL state',urlStatus.split('_').join(' ')])
  if (!text(entity.country_or_origin) || text(entity.country_or_origin).toLowerCase()==='unknown') concerns.push(['Operator / jurisdiction','Unresolved or conflicting in the canonical record'])
  if (evidence.length===0) concerns.push(['Evidence coverage','No linked evidence currently available'])

  return <section className="panel longform-panel" aria-labelledby="material-concerns-heading">
    <div className="section">
      <h4 id="material-concerns-heading">Material concerns / known unknowns</h4>
      <p className="muted" style={{lineHeight:1.7}}>Active status and canonical inclusion are lifecycle facts, not safety endorsements. Flags below are derived from reviewed records and do not constitute a proprietary safety score.</p>
      <div className="fact-grid">
        {concerns.length ? concerns.map(([label,value])=><div className="fact" key={label}><div className="k">{label}</div><div className="v">{value}</div></div>) : <div className="fact" style={{gridColumn:'1 / -1'}}><div className="k">Current derived flags</div><div className="v">None from the currently reviewed fields. This is not a finding of safety or a recommendation.</div></div>}
      </div>
    </div>
  </section>
}
