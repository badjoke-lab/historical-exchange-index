export const SITE_NAME = 'Historical Exchange Index'
export const SITE_SHORT_NAME = 'HEI'
export const SITE_DESCRIPTION =
  'A quiet registry of crypto exchanges, active and gone. Archive-first, history-first, and evidence-aware.'
export const DEFAULT_SITE_URL = 'https://historical-exchange-index.pages.dev'
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '')

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ''
export const GSC_VERIFICATION_TOKEN = process.env.GSC_VERIFICATION_TOKEN ?? ''

export const CONTACT_HREF =
  'https://docs.google.com/forms/d/e/1FAIpQLSf6NGsKIaGUzeGWUAyphOsv0XN3eSBebsASj_0g-qtZtNamWw/viewform'
export const ISSUES_HREF =
  'https://github.com/badjoke-lab/historical-exchange-index/issues/new'
export const DONATE_HREF = '/donate'
