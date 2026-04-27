const ENABLE_REGULATORY_WATCH = process.env.HEI_MONITORING_ENABLE_REGULATORY_WATCH === '1';

export const REGULATORY_WATCH_ENABLED = ENABLE_REGULATORY_WATCH;

export const REGULATORY_AUTHORITIES = [
  {
    authority_id: 'us-sec',
    name: 'U.S. Securities and Exchange Commission',
    short_name: 'SEC',
    country_or_region: 'United States',
    domain: 'sec.gov',
  },
  {
    authority_id: 'us-cftc',
    name: 'Commodity Futures Trading Commission',
    short_name: 'CFTC',
    country_or_region: 'United States',
    domain: 'cftc.gov',
  },
  {
    authority_id: 'uk-fca',
    name: 'Financial Conduct Authority',
    short_name: 'FCA',
    country_or_region: 'United Kingdom',
    domain: 'fca.org.uk',
  },
  {
    authority_id: 'jp-fsa',
    name: 'Financial Services Agency',
    short_name: 'JFSA',
    country_or_region: 'Japan',
    domain: 'fsa.go.jp',
  },
  {
    authority_id: 'hk-sfc',
    name: 'Securities and Futures Commission',
    short_name: 'SFC Hong Kong',
    country_or_region: 'Hong Kong',
    domain: 'sfc.hk',
  },
  {
    authority_id: 'sg-mas',
    name: 'Monetary Authority of Singapore',
    short_name: 'MAS',
    country_or_region: 'Singapore',
    domain: 'mas.gov.sg',
  },
  {
    authority_id: 'us-ofac',
    name: 'Office of Foreign Assets Control',
    short_name: 'OFAC',
    country_or_region: 'United States',
    domain: 'treasury.gov',
  },
];

export const REGULATORY_QUERY_TEMPLATES = [
  {
    query_template: 'site:{domain} crypto exchange warning',
    category: 'regulatory',
    likely_event_types: ['regulatory_action'],
    signal: 'warning_list',
  },
  {
    query_template: 'site:{domain} crypto exchange enforcement action',
    category: 'regulatory',
    likely_event_types: ['regulatory_action', 'lawsuit'],
    signal: 'enforcement_action',
  },
  {
    query_template: 'site:{domain} virtual asset service provider exchange warning',
    category: 'regulatory',
    likely_event_types: ['regulatory_action'],
    signal: 'vasp_warning',
  },
  {
    query_template: 'site:{domain} crypto exchange license revoked OR registration cancelled',
    category: 'regulatory',
    likely_event_types: ['regulatory_action', 'shutdown_announced'],
    signal: 'license_or_registration_removed',
  },
  {
    query_template: 'site:{domain} crypto exchange sanctions OR sanctioned',
    category: 'regulatory',
    likely_event_types: ['regulatory_action'],
    signal: 'sanctions',
  },
];

function renderQuery(template, authority) {
  return template.replaceAll('{domain}', authority.domain);
}

export function getRegulatoryQueries() {
  const maxAuthorities = Number.parseInt(process.env.HEI_MONITORING_REGULATORY_AUTHORITY_LIMIT || String(REGULATORY_AUTHORITIES.length), 10);
  const maxQueries = Number.parseInt(process.env.HEI_MONITORING_REGULATORY_QUERY_LIMIT || '25', 10);
  const authorities = REGULATORY_AUTHORITIES.slice(0, Number.isFinite(maxAuthorities) ? maxAuthorities : REGULATORY_AUTHORITIES.length);
  const queries = [];

  for (const authority of authorities) {
    for (const template of REGULATORY_QUERY_TEMPLATES) {
      queries.push({
        query: renderQuery(template.query_template, authority),
        category: template.category,
        likely_event_types: template.likely_event_types,
        source_category: 'regulatory_source',
        regulatory_authority: authority.name,
        regulatory_authority_short_name: authority.short_name,
        regulatory_authority_id: authority.authority_id,
        regulatory_region: authority.country_or_region,
        regulatory_domain: authority.domain,
        regulatory_signal: template.signal,
      });
    }
  }

  return queries.slice(0, Number.isFinite(maxQueries) ? maxQueries : 25);
}

export function getRegulatorySourceSummary() {
  return {
    enabled: REGULATORY_WATCH_ENABLED,
    authorities_configured: REGULATORY_AUTHORITIES.length,
    query_templates: REGULATORY_QUERY_TEMPLATES.length,
  };
}
