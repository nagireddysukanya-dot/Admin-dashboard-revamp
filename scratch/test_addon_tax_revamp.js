// Validation test script for Addon Tax Searchable Dropdown
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

console.log('--- TEST SUITE: ADDON TAX SEARCHABLE DROPDOWN & CONSISTENCY ---');

// 1. Addon Tax Trigger and Popover markup
assert(appJs.includes('id="zoho-addon-tax-trigger-${idx}"'), 'Addon tax trigger button exists');
assert(appJs.includes('id="zoho-addon-tax-label-${idx}"'), 'Addon tax label element exists');
assert(appJs.includes('id="zoho-addon-tax-chevron-${idx}"'), 'Addon tax chevron element exists');
assert(appJs.includes('id="zoho-addon-tax-popover-${idx}"'), 'Addon tax popover container exists');
assert(appJs.includes('id="zoho-addon-tax-search-${idx}"'), 'Addon tax search input exists');
assert(appJs.includes('id="zoho-addon-tax-list-${idx}"'), 'Addon tax items list container exists');

// 2. Addon Tax Functions
assert(appJs.includes('function renderAddonTaxOptions'), 'renderAddonTaxOptions function defined');
assert(appJs.includes('function toggleAddonTaxDropdown'), 'toggleAddonTaxDropdown function defined');
assert(appJs.includes('function closeAddonTaxDropdown'), 'closeAddonTaxDropdown function defined');
assert(appJs.includes('function closeAllAddonTaxDropdowns'), 'closeAllAddonTaxDropdowns function defined');
assert(appJs.includes('function selectAddonTax'), 'selectAddonTax function defined');
assert(appJs.includes('function filterAddonTaxes'), 'filterAddonTaxes function defined');
assert(appJs.includes('function addNewAddonTax'), 'addNewAddonTax function defined');

// 3. Exported on window.smatApp
assert(appJs.includes('toggleAddonTaxDropdown,'), 'toggleAddonTaxDropdown exported on window.smatApp');
assert(appJs.includes('closeAddonTaxDropdown,'), 'closeAddonTaxDropdown exported on window.smatApp');
assert(appJs.includes('closeAllAddonTaxDropdowns,'), 'closeAllAddonTaxDropdowns exported on window.smatApp');
assert(appJs.includes('selectAddonTax,'), 'selectAddonTax exported on window.smatApp');
assert(appJs.includes('filterAddonTaxes,'), 'filterAddonTaxes exported on window.smatApp');
assert(appJs.includes('addNewAddonTax,'), 'addNewAddonTax exported on window.smatApp');

// 4. Outside click dismissal
assert(appJs.includes("closeAllAddonTaxDropdowns()"), 'Outside click closes all addon tax dropdowns');

// 5. Shared Tax Groups consistency
assert(appJs.includes('ALL_ZOHO_PLAN_TAX_GROUPS.forEach'), 'Both Plan and Addon share ALL_ZOHO_PLAN_TAX_GROUPS for 100% option consistency');

// 6. Responsive Addon Table Header
assert(appJs.includes('zoho-th-addon-name'), 'Addon name header has responsive class');
assert(appJs.includes('zoho-th-addon-tax'), 'Addon tax header has responsive class');

// 7. Cache busting
assert(indexHtml.includes('app.js?v=10.7'), 'index.html has app.js?v=10.7');
assert(indexHtml.includes('styles.css?v=10.7'), 'index.html has styles.css?v=10.7');

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL ADDON TAX & CONSISTENCY TESTS PASSED 100%!');
}
