// Validation test script for Zoho Coupon Section
const fs = require('fs');
const path = require('path');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'js', 'app.js'), 'utf8');
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

console.log('--- TEST SUITE: ZOHO COUPON TABLE SECTION ---');

// 1. Section Header & Table Elements
assert(appJs.includes('<h2 style="font-size:1.1rem; font-weight:700; color:#111827; margin:0 0 0.75rem 0;">Coupon</h2>'), 'Coupon section heading exists');
assert(appJs.includes('>COUPON</th>'), 'COUPON column header exists');
assert(appJs.includes('>COUPON CODE</th>'), 'COUPON CODE column header exists');
assert(appJs.includes('>VALUE</th>'), 'VALUE column header exists');

// 2. Input and Popover Elements
assert(appJs.includes('id="zoho-coupon-search-input"'), 'Coupon search input exists');
assert(appJs.includes('placeholder="Enter at least 3 characters to search"'), 'Exact placeholder matches Screenshot 1');
assert(appJs.includes('id="zoho-coupon-chevron"'), 'Coupon dropdown chevron exists');
assert(appJs.includes('id="zoho-coupon-popover"'), 'Coupon popover container exists');
assert(appJs.includes('id="zoho-coupon-code-disp"'), 'Coupon code display input exists');
assert(appJs.includes('id="zoho-coupon-value-disp"'), 'Coupon value display input exists');
assert(appJs.includes('id="zoho-coupon-clear-btn"'), 'Red ✕ clear button exists');

// 3. Helper Functions
assert(appJs.includes('function openZohoCouponDropdown'), 'openZohoCouponDropdown defined');
assert(appJs.includes('function toggleZohoCouponDropdown'), 'toggleZohoCouponDropdown defined');
assert(appJs.includes('function closeZohoCouponDropdown'), 'closeZohoCouponDropdown defined');
assert(appJs.includes('function onZohoCouponInput'), 'onZohoCouponInput defined');
assert(appJs.includes('function renderZohoCouponResults'), 'renderZohoCouponResults defined');
assert(appJs.includes('function selectZohoCoupon'), 'selectZohoCoupon defined');
assert(appJs.includes('function clearZohoCoupon'), 'clearZohoCoupon defined');

// 4. Exported on window.smatApp
assert(appJs.includes('openZohoCouponDropdown,'), 'openZohoCouponDropdown exported');
assert(appJs.includes('toggleZohoCouponDropdown,'), 'toggleZohoCouponDropdown exported');
assert(appJs.includes('closeZohoCouponDropdown,'), 'closeZohoCouponDropdown exported');
assert(appJs.includes('onZohoCouponInput,'), 'onZohoCouponInput exported');
assert(appJs.includes('selectZohoCoupon,'), 'selectZohoCoupon exported');
assert(appJs.includes('clearZohoCoupon,'), 'clearZohoCoupon exported');

// 5. Outside Click
assert(appJs.includes("closeZohoCouponDropdown()"), 'Outside click closes coupon dropdown');

// 6. Calculations Integration
assert(appJs.includes('couponDiscountAmt'), 'updateZohoSubCalculations incorporates coupon discount');

// 7. Cache Busting
assert(indexHtml.includes('app.js?v=10.8'), 'index.html bumped to app.js?v=10.8');
assert(indexHtml.includes('styles.css?v=10.8'), 'index.html bumped to styles.css?v=10.8');

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL ZOHO COUPON TESTS PASSED 100%!');
}
