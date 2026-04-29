export const CANONICAL_PATHS = [
  'data/entities.json',
  'data/events.json',
  'data/evidence.json',
];

export const OUTPUT_ROOT = 'data-staging/monitoring';
export const WATCHLIST_AUTO_ROOT = 'data-staging/watchlists/auto';
export const WATCHLIST_RESOLUTION_ROOT = 'data-staging/watchlists/resolution';

export const MONITOR_NAMES = [
  'candidate-discovery',
  'news-and-event-watch',
  'active-status-watch',
  'evidence-and-record-quality-watch',
  'evidence-health-watch',
  'site-and-seo-watch',
  'monitoring-health-watch',
];

export const SEVERITIES = ['critical', 'high', 'medium', 'low'];
export const CANDIDATE_CLASSES = ['A', 'B', 'C'];

export const TYPE_VALUES = ['cex', 'dex', 'hybrid'];
export const STATUS_VALUES = [
  'active',
  'limited',
  'inactive',
  'dead',
  'merged',
  'acquired',
  'rebranded',
  'unknown',
];
export const DEAD_SIDE_STATUSES = ['dead', 'merged', 'acquired', 'rebranded'];
export const ACTIVE_SIDE_STATUSES = ['active', 'limited', 'inactive'];
export const DEATH_REASON_VALUES = [
  'hack',
  'insolvency',
  'regulation',
  'scam_rug',
  'merger',
  'acquisition',
  'rebrand',
  'voluntary_shutdown',
  'chain_failure',
  'unknown',
];
export const OFFICIAL_URL_STATUS_VALUES = [
  'live_verified',
  'live_unverified',
  'partial',
  'offline',
  'dead_domain',
  'redirected',
  'repurposed',
  'unsafe',
  'unknown',
];

export const EVENT_TYPE_VALUES = [
  'launched',
  'rebranded',
  'acquired',
  'merged',
  'hack',
  'exploit',
  'withdrawal_suspended',
  'deposit_suspended',
  'trading_halted',
  'service_outage',
  'regulatory_action',
  'lawsuit',
  'bankruptcy_filed',
  'insolvency_declared',
  'shutdown_announced',
  'shutdown_effective',
  'reopened',
  'token_migration',
  'chain_shutdown_impact',
  'other',
];
export const IMPACT_LEVEL_VALUES = ['low', 'medium', 'high', 'critical'];
export const EVENT_STATUS_EFFECT_VALUES = ['none', 'active', 'limited', 'inactive', 'dead'];

export const SOURCE_TYPE_VALUES = [
  'official_statement',
  'official_blog',
  'official_social',
  'archive_capture',
  'news_article',
  'court_document',
  'regulatory_notice',
  'database_reference',
  'community_reference',
  'other',
];
export const RELIABILITY_VALUES = ['high', 'medium', 'low'];
export const CLAIM_SCOPE_VALUES = [
  'entity',
  'event',
  'status',
  'death_reason',
  'launch_date',
  'death_date',
  'url_history',
  'ownership',
];
