export type ProjectNetworkItem = {
  id: 'hub' | 'hei' | 'sog' | 'cya' | 'bir' | 'mag'
  name: string
  shortName: string
  url: string
  description: string
}

export const PROJECT_NETWORK: readonly ProjectNetworkItem[] = [
  {
    id: 'hub',
    name: 'BadJoke-Lab Hub',
    shortName: 'Hub',
    url: 'https://badjoke-lab.com/',
    description: 'Canonical directory for BadJoke-Lab public projects.',
  },
  {
    id: 'hei',
    name: 'Historical Exchange Index',
    shortName: 'HEI',
    url: 'https://hei.badjoke-lab.com/',
    description: 'Reviewed historical registry of crypto exchanges.',
  },
  {
    id: 'sog',
    name: 'Stable or Gone',
    shortName: 'SOG',
    url: 'https://www.stableorgone.com/',
    description: 'Evidence-backed stablecoin lifecycle registry.',
  },
  {
    id: 'cya',
    name: 'Crypto Yield Archive',
    shortName: 'CYA',
    url: 'https://cya.badjoke-lab.com/',
    description: 'Historical archive of crypto yield and lending platforms.',
  },
  {
    id: 'bir',
    name: 'Bridge Incident Registry',
    shortName: 'BIR',
    url: 'https://bir.badjoke-lab.com/',
    description: 'Registry of bridge incidents and their aftermath.',
  },
  {
    id: 'mag',
    name: 'Minted & Gone',
    shortName: 'MAG',
    url: 'https://mag.badjoke-lab.com/',
    description: 'Historical archive of NFT marketplaces.',
  },
] as const
