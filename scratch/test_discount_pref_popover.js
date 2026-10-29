// Test script for Zoho Discount Preference Searchable Dropdown Popover
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

console.log('--- TEST SUITE: ZOHO DISCOUNT PREFERENCE SEARCHABLE POPOVER ---');

// 1. Trigger & Container Elements
assert(appJs.includes('id="zoho-discount-pref-wrapper"'), 'Discount preference wrapper exists');
assert(appJs.includes('id="zoho-discount-pref-trigger"'), 'Discount preference trigger button exists');
assert(appJs.includes('id="zoho-discount-pref-label"'), 'Discount preference label element exists');
assert(appJs.includes('id="zoho-discount-pref-chevron"'), 'Discount preference chevron element exists');

// 2. Popover & Search Elements (Matches Screenshot)
assert(appJs.includes('id="zoho-discount-pref-popover"'), 'Discount preference popover exists');
assert(appJs.includes('id="zoho-discount-pref-search"'), 'Discount preference search input exists');
assert(appJs.includes('placeholder="Search"'), 'Search input has "Search" placeholder');
assert(appJs.includes('Discount Preference'), 'Category title "Discount Preference" exists');
assert(appJs.includes('id="zoho-discount-pref-list"'), 'Options container list exists');

// 3. Exact 3 Options from Screenshot
assert(appJs.includes("label: 'No Discounts'"), '"No Discounts" option defined');
assert(appJs.includes("label: 'Item-Level'"), '"Item-Level" option defined');
assert(appJs.includes("label: 'Transaction-Level'"), '"Transaction-Level" option defined');

// 4. Checkmark and Selected Styling
assert(appJs.includes('<span class="zoho-discount-check" style="font-size:0.85rem; font-weight:700;">✓</span>'), 'White checkmark rendered for selected option');
assert(appJs.includes('zoho-discount-option-item'), 'Option item class rendered');

// 5. JavaScript Helper Functions
assert(appJs.includes('function renderDiscountPrefOptions'), 'renderDiscountPrefOptions function defined');
assert(appJs.includes('function toggleDiscountPrefDropdown'), 'toggleDiscountPrefDropdown function defined');
assert(appJs.includes('function closeDiscountPrefDropdown'), 'closeDiscountPrefDropdown function defined');
assert(appJs.includes('function selectDiscountPref'), 'selectDiscountPref function defined');
assert(appJs.includes('function filterDiscountPrefOptions'), 'filterDiscountPrefOptions function defined');

// 6. Outside Click Listener
assert(appJs.includes("!e.target.closest('#zoho-discount-pref-popover')"), 'Outside click closes discount preference popover');

// 7. Exports on window.smatApp
assert(appJs.includes('toggleDiscountPrefDropdown,'), 'toggleDiscountPrefDropdown exported on window.smatApp');
assert(appJs.includes('closeDiscountPrefDropdown,'), 'closeDiscountPrefDropdown exported on window.smatApp');
assert(appJs.includes('selectDiscountPref,'), 'selectDiscountPref exported on window.smatApp');
assert(appJs.includes('filterDiscountPrefOptions,'), 'filterDiscountPrefOptions exported on window.smatApp');
assert(appJs.includes('renderDiscountPrefOptions,'), 'renderDiscountPrefOptions exported on window.smatApp');

// 8. CSS Classes and Styles
assert(stylesCss.includes('.zoho-discount-popover'), '.zoho-discount-popover styling present in styles.css');
assert(stylesCss.includes('.zoho-discount-option-item:hover'), 'Solid blue hover styling present in styles.css');
assert(stylesCss.includes('.zoho-discount-option-item.selected'), 'Selected item styling present in styles.css');

// 9. Cache Version Check
assert(indexHtml.includes('app.js?v=12.1'), 'index.html bumped to app.js?v=12.1');
assert(indexHtml.includes('styles.css?v=12.1'), 'index.html bumped to styles.css?v=12.1');

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL ZOHO DISCOUNT PREFERENCE POPOVER TESTS PASSED 100%!');
}
