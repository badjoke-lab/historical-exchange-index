export const EXTERNAL_LIST_SOURCES = [
  {
    name: 'manual-seed',
    type: 'static',
    description: 'Empty static seed for validating candidate-discovery plumbing. Populate in later PRs or generated reports.',
    items: [],
  },
];

export function getStaticExternalItems() {
  return EXTERNAL_LIST_SOURCES.flatMap((source) => {
    if (source.type !== 'static') return [];
    return (source.items || []).map((item) => ({
      ...item,
      source_name: source.name,
      source_type: source.type,
    }));
  });
}
