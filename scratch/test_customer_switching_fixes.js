const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- TEST SUITE: CUSTOMER SAFETY LOCK & CLIENT DETAILS BUTTONS ---');

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

// 1. Customer Name Safety Lock in Change Subscription View
test('Customer Name select field is locked & disabled for safety', () => {
  assert(appJs.includes('id="zoho-sub-client-select"'), 'Missing id="zoho-sub-client-select"');
  const selectSnippet = appJs.substring(
    appJs.indexOf('id="zoho-sub-client-select"'),
    appJs.indexOf('</select>', appJs.indexOf('id="zoho-sub-client-select"'))
  );
  assert(selectSnippet.includes('disabled'), 'Customer select must be disabled to prevent accidental client change');
  assert(selectSnippet.includes('cursor:not-allowed'), 'Customer select must have cursor:not-allowed');
});

test('Customer Name field displays current client name and email safely', () => {
  assert(appJs.includes('${escapeHtml(currClient.name || \'Client #\' + currClient.id)} - ${escapeHtml(currClient.email || \'\')}'), 'Must display currClient name and email');
});

test('Search glass button in Change Subscription is disabled and muted', () => {
  const searchBtnSnippet = appJs.substring(
    appJs.indexOf('<!-- Quick Search Glass Button (Disabled / Muted) -->'),
    appJs.indexOf('<!-- Currency Pill', appJs.indexOf('<!-- Quick Search Glass Button (Disabled / Muted) -->'))
  );
  assert(searchBtnSnippet.includes('disabled'), 'Search button must be disabled');
  assert(searchBtnSnippet.includes('cursor:not-allowed'), 'Search button must have cursor:not-allowed');
});

// 2. Client Profile Details View
test('Subscriptions & Billing Center card has "⚡ Change Subscription" button', () => {
  assert(appJs.includes('window.smatApp.openZohoSubscription(${client.id})'), 'Missing openZohoSubscription button handler');
  assert(appJs.includes('Change Subscription'), 'Missing "Change Subscription" button label');
});

test('Active Plan & Quotas card has "⚡ Change Plan" button', () => {
  assert(appJs.includes('Change Plan'), 'Missing "Change Plan" button label');
});

// 3. Navigation and Client ID Synchronization
test('openZohoSubscription is exported on window.smatApp', () => {
  assert(appJs.includes('openZohoSubscription,'), 'openZohoSubscription must be exported');
});

// 4. Cache Versioning
test('Cache version bumped to v=12.4 in index.html', () => {
  assert(indexHtml.includes('app.js?v=12.4'), 'app.js must be v=12.4 in index.html');
  assert(indexHtml.includes('styles.css?v=12.4'), 'styles.css must be v=12.4 in index.html');
});

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL CUSTOMER SAFETY LOCK & CLIENT DETAILS BUTTON TESTS PASSED 100%!');
}
