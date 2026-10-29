const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- TEST SUITE: CHANGE SUBSCRIPTION RELOAD & CLIENT PERSISTENCE ---');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'js', 'app.js'), 'utf8');
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'index.html'), 'utf8');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  [FAIL] ${name}:`, err.message);
    failed++;
  }
}

// 1. openZohoSubscription persists client ID to localStorage & state
test('openZohoSubscription stores client id to localStorage and synchronizes selectedClientId', () => {
  assert(appJs.includes("localStorage.setItem('smatbot_zoho_subscription_client_id', String(zohoSubscriptionClientId))"),
    'Must persist smatbot_zoho_subscription_client_id in openZohoSubscription');
  assert(appJs.includes("selectedClientId = zohoSubscriptionClientId;"),
    'Must synchronize selectedClientId with zohoSubscriptionClientId in openZohoSubscription');
});

// 2. navigateTo synchronizes URL hash with client ID for change-subscription
test('navigateTo updates window.location.hash with #change-subscription?id=...', () => {
  assert(appJs.includes("const targetHash = (effId !== undefined && effId !== null) ? `#${route}?id=${effId}` : `#${route}`;"),
    'Must update targetHash with ?id= in navigateTo for change-subscription');
});

// 3. resolveInitialRoute extracts client id from hash or localStorage on reload
test('resolveInitialRoute parses ?id= from change-subscription hash', () => {
  assert(appJs.includes("rawHash.startsWith('change-subscription')"),
    'resolveInitialRoute must handle change-subscription in hash');
  assert(appJs.includes("localStorage.getItem('smatbot_zoho_subscription_client_id')"),
    'resolveInitialRoute must check saved zoho client ID from localStorage');
});

// 4. Global hashchange listener handles change-subscription
test('hashchange listener includes change-subscription', () => {
  assert(appJs.includes("targetRoute === 'change-subscription'"),
    'hashchange listener must handle change-subscription');
});

// 5. Initial declaration of zohoSubscriptionClientId reads from localStorage
test('zohoSubscriptionClientId is initialized from localStorage with fallback to 0', () => {
  assert(appJs.includes("localStorage.getItem('smatbot_zoho_subscription_client_id') || localStorage.getItem('smatbot_selected_client_id')"),
    'zohoSubscriptionClientId declaration must check localStorage');
});

// 6. renderZohoSubscriptionView guards and synchronizes client
test('renderZohoSubscriptionView resolves currClient using zohoSubscriptionClientId or selectedClientId', () => {
  assert(appJs.includes("const currClient = clientsData.find(c => c.id === zohoSubscriptionClientId || String(c.id) === String(zohoSubscriptionClientId))"),
    'Must resolve currClient using zohoSubscriptionClientId');
});

// 7. Cache version bumped to v=12.5
test('Cache bust version bumped to v=12.5 in index.html', () => {
  assert(indexHtml.includes('app.js?v=12.5'), 'app.js must be v=12.5');
  assert(indexHtml.includes('styles.css?v=12.5'), 'styles.css must be v=12.5');
});

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL CHANGE SUBSCRIPTION RELOAD PERSISTENCE TESTS PASSED 100%!');
}
