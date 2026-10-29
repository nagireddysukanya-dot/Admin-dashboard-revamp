// Validation test script for Zoho Coupon Searchable Dropdown Revamp
const fs = require('fs');
const path = require('path');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'js', 'app.js'), 'utf8');
const stylesCss = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'css', 'styles.css'), 'utf8');
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'index.html'), 'utf8');

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${testName}`);
    failed++;
  }
}

console.log('--- TEST SUITE: ZOHO COUPON SEARCHABLE DROPDOWN REVAMP ---');

// 1. Trigger and Search Header
assert(appJs.includes('id="zoho-coupon-trigger-btn"'), 'Coupon trigger button exists');
assert(appJs.includes('id="zoho-coupon-selected-label"'), 'Coupon selected label element exists');
assert(appJs.includes('id="zoho-coupon-search-filter"'), 'Search filter input in popover exists');
assert(appJs.includes('placeholder="Search"'), 'Search placeholder matches screenshot');

// 2. Exact [name]/[code] [[value]] formatting
assert(appJs.includes("displayLabel = `${c.name}/${c.code}${valClean ? ` [${valClean}]` : ''}`"), 'Item format exactly matches [name]/[code] [[val]]');
assert(appJs.includes('ismail_test'), 'ismail_test coupon present');
assert(appJs.includes('test_ismail'), 'test_ismail coupon code present');
assert(appJs.includes('SWAPNIL98'), 'SWAPNIL98 coupon present');
assert(appJs.includes('TESTCOUPONCHANGE'), 'TESTCOUPONCHANGE coupon present');
assert(appJs.includes('30PERCENTADD'), 'Existing 30PERCENTADD coupon present');
assert(appJs.includes('SMATDEEP15'), 'Existing SMATDEEP15 coupon present');

// 3. Selection and checkmark
assert(appJs.includes('zoho-coupon-check'), 'Checkmark icon present for selected coupon');
assert(appJs.includes('function selectZohoCoupon'), 'selectZohoCoupon function defined');
assert(appJs.includes('function filterZohoCoupons'), 'filterZohoCoupons function defined');
assert(appJs.includes('function clearZohoCoupon'), 'clearZohoCoupon function defined');

// 4. Exported functions
assert(appJs.includes('filterZohoCoupons,'), 'filterZohoCoupons exported on window.smatApp');
assert(appJs.includes('selectZohoCoupon,'), 'selectZohoCoupon exported on window.smatApp');
assert(appJs.includes('clearZohoCoupon,'), 'clearZohoCoupon exported on window.smatApp');

// 5. CSS hover and selection styles
assert(stylesCss.includes('.zoho-coupon-option:hover'), '.zoho-coupon-option:hover solid blue background styling present');
assert(stylesCss.includes('.zoho-coupon-option.selected'), '.zoho-coupon-option.selected light background styling present');

// 6. Cache busting
assert(indexHtml.includes('app.js?v=12.1'), 'index.html bumped to app.js?v=12.1');
assert(indexHtml.includes('styles.css?v=12.1'), 'index.html bumped to styles.css?v=12.1');

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL COUPON DROPDOWN REVAMP TESTS PASSED 100%!');
}
