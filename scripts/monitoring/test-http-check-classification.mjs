import { classifyStatus } from './adapters/http-check.mjs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const startUrl = 'https://example.test/';

assert(
  classifyStatus({
    status: 200,
    startUrl,
    finalUrl: startUrl,
    body: '<html><body><div>Parking is available near the exchange.</div><button>Swap</button></body></html>',
  }) === 'ok',
  'ordinary page text containing the word parking must not be classified as a parked domain',
);

assert(
  classifyStatus({
    status: 200,
    startUrl,
    finalUrl: startUrl,
    body: '<html><body>This domain is parked. Buy this domain.</body></html>',
  }) === 'parked_or_for_sale',
  'explicit parked-domain language must still be detected',
);

assert(
  classifyStatus({
    status: 200,
    startUrl,
    finalUrl: 'https://www.example.test/',
    body: '<html><body>Live exchange application</body></html>',
  }) === 'redirected',
  'healthy redirects must remain redirected',
);

console.log('HEI HTTP classification regression passed.');
