const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- TEST SUITE: LEGACY MODAL & DRAWER BUTTON CLEANUP ---');

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

// 1. Drawer Footer: Plan / Add-ons button removed
test('Plan / Add-ons button is removed from drawer footer', () => {
  const drawerFooterIdx = appJs.indexOf('class="drawer-footer"');
  assert(drawerFooterIdx !== -1, 'drawer-footer not found');
  const drawerFooterSnippet = appJs.substring(drawerFooterIdx, drawerFooterIdx + 1200);
  assert(!drawerFooterSnippet.includes('⚡ Plan / Add-ons'), 'Drawer footer must NOT contain Plan / Add-ons');
  assert(drawerFooterSnippet.includes('1-Click Login'), 'Drawer footer must contain 1-Click Login');
  assert(drawerFooterSnippet.includes('Full Profile'), 'Drawer footer must contain Full Profile');
});

// 2. Legacy mock modal completely removed
test('Old "Client Subscription Management" modal text removed', () => {
  assert(!appJs.includes('Client Subscription Management'), 'Old Client Subscription Management modal text must be removed');
  assert(!appJs.includes('plan-activation-form'), 'Old plan-activation-form must be removed');
});

// 3. openPlanModal and openAddSubscriptionModal seamlessly route to openZohoSubscription
test('openPlanModal routes to openZohoSubscription', () => {
  assert(appJs.includes('function openPlanModal(clientId, defaultPlan, isAddSubscription = false) {'), 'openPlanModal must exist');
  const planModalSnippet = appJs.substring(
    appJs.indexOf('function openPlanModal'),
    appJs.indexOf('}', appJs.indexOf('function openPlanModal')) + 1
  );
  assert(planModalSnippet.includes('openZohoSubscription(clientId)'), 'openPlanModal must call openZohoSubscription');
});

test('openAddSubscriptionModal routes to openZohoSubscription', () => {
  const addModalSnippet = appJs.substring(
    appJs.indexOf('function openAddSubscriptionModal'),
    appJs.indexOf('}', appJs.indexOf('function openAddSubscriptionModal')) + 1
  );
  assert(addModalSnippet.includes('openZohoSubscription(null)'), 'openAddSubscriptionModal must call openZohoSubscription');
});

// 4. Cache Versioning
test('Cache version bumped to v=12.5 in index.html', () => {
  assert(indexHtml.includes('app.js?v=12.5'), 'app.js must be v=12.5 in index.html');
  assert(indexHtml.includes('styles.css?v=12.5'), 'styles.css must be v=12.5 in index.html');
});

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL LEGACY CLEANUP & DRAWER TESTS PASSED 100%!');
}
