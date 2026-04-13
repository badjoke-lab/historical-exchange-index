export const SITE_NAME = 'Historical Exchange Index'
export const SITE_SHORT_NAME = 'HEI'
export const SITE_DESCRIPTION =
  'A quiet registry of crypto exchanges, active and gone. Archive-first, history-first, and evidence-aware.'
export const DEFAULT_SITE_URL = 'https://historical-exchange-index.pages.dev'
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '')

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ''
export const GSC_VERIFICATION_TOKEN = process.env.GSC_VERIFICATION_TOKEN ?? ''

export const CORRECTION_HREF =
  'https://github.com/badjoke-lab/historical-exchange-index/issues/new'
