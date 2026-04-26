export const monitoringConfig = {
  mode: process.env.HEI_MONITORING_MODE || 'scheduled',
  shouldFailOnCanonicalChange: true,
};
