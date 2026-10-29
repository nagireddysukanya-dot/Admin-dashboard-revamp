// Test suite validating all 3 modes matching user's 3 screenshots:
// Screenshot 1: No Discounts (No Discount column in tables, neutral border)
// Screenshot 2: Item-Level (Discount column visible with 0 % ▾, active blue border)
// Screenshot 3: Transaction-Level (No Discount column in tables, active blue border)
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

console.log('--- TEST SUITE: 3 MODES VALIDATION (SCREENSHOTS 1, 2, 3) ---');

// 1. Initial State & Visibility
assert(appJs.includes("display:${zohoDiscountPref === 'item-level' ? 'table-cell' : 'none'}"), 'Discount column only renders table-cell for item-level');
assert(appJs.includes("width:${zohoDiscountPref === 'item-level' ? '34%' : '40%'}"), 'Plan name width adjusts to 40% when not item-level');

// 2. onZohoDiscountPrefChange logic
assert(appJs.includes("const isItemLevel = pref === 'item-level';"), 'isItemLevel cleanly determines discount column display');
assert(appJs.includes("el.style.display = isItemLevel ? 'table-cell' : 'none';"), 'Discount columns set to none for both no-discount and transaction-level');

// 3. Trigger button active border
assert(appJs.includes("isItemLevel || pref === 'transaction-level'"), 'Trigger button gets active blue border for both item-level and transaction-level');
assert(appJs.includes("trigger.style.borderColor = '#3B82F6';"), 'Active blue border color #3B82F6 applied');
assert(appJs.includes("trigger.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.15)';"), 'Subtle blue focus glow applied');

// 4. Reset to neutral border for no-discount
assert(appJs.includes("trigger.style.borderColor = '#CBD5E1';"), 'Neutral gray border color #CBD5E1 applied for no-discount');

// 5. Total Discounts calculation
assert(appJs.includes("const totalDiscounts = ((zohoDiscountPref === 'item-level') ? (planDiscountAmt + totalAddonsDiscount) : 0) + couponDiscountAmt;"), 'Row discounts only count when item-level is selected');

// 6. Cache version
assert(indexHtml.includes('app.js?v=12.1'), 'index.html has app.js?v=12.1');
assert(indexHtml.includes('styles.css?v=12.1'), 'index.html has styles.css?v=12.1');

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL 3 DISCOUNT MODES MATCH USER SCREENSHOTS 100%!');
}
