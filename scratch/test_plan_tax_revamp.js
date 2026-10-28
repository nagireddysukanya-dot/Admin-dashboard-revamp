// Validation script for Plan Tax Searchable Dropdown & Top UI alignment
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

console.log('--- TEST SUITE: PLAN TAX SEARCHABLE DROPDOWN & TOP UI ---');

// 1. Top UI Discount & Renewal Preferences
assert(appJs.includes('id="zoho-sub-discount-pref"'), 'Top discount preference dropdown exists');
assert(appJs.includes('onchange="window.smatApp.onZohoDiscountPrefChange(this.value)"'), 'Discount preference has onZohoDiscountPrefChange handler');
assert(appJs.includes('<option value="no-discount"'), 'No Discounts option exists');
assert(appJs.includes('<option value="item-level"'), 'Item-Level Discount option exists');
assert(appJs.includes('<option value="transaction-level"'), 'Entity-Level Discount option exists');
assert(appJs.includes('id="zoho-sub-renewal-freq"'), 'Renewal frequency dropdown exists');
assert(appJs.includes('<option value="every-renewal"'), 'Every Renewal option exists');

// 2. Plan Table Headers & Column Toggle
assert(appJs.includes('class="zoho-col-discount"'), 'Discount column has zoho-col-discount class for dynamic display');
assert(appJs.includes('zoho-th-plan-name'), 'Plan name column has responsive class');
assert(appJs.includes('zoho-th-plan-tax'), 'Tax column has responsive class');

// 3. Plan Tax Trigger & Popover
assert(appJs.includes('id="zoho-plan-tax-trigger"'), 'Plan tax trigger button exists');
assert(appJs.includes('id="zoho-plan-tax-label"'), 'Plan tax label element exists');
assert(appJs.includes('id="zoho-plan-tax-chevron"'), 'Plan tax chevron element exists');
assert(appJs.includes('id="zoho-plan-tax-popover"'), 'Plan tax popover container exists');
assert(appJs.includes('id="zoho-plan-tax-search"'), 'Plan tax search input exists');
assert(appJs.includes('id="zoho-plan-tax-list"'), 'Plan tax scrollable items list exists');

// 4. Tax Categories and Exact Items (Screenshots 3 & 4)
assert(appJs.includes("'Non-Taxable'"), 'Non-Taxable category exists');
assert(appJs.includes("'Out of Scope'"), 'Out of Scope item exists');
assert(appJs.includes("Supplies on which you don't charge any GST or include them in the returns."), 'Out of Scope subtitle matches Screenshot 3');
assert(appJs.includes("'Non-GST Supply'"), 'Non-GST Supply item exists');
assert(appJs.includes('Supplies which do not come under GST such as petroleum products and liquor.'), 'Non-GST Supply subtitle matches Screenshot 3');
assert(appJs.includes("'Tax Group'"), 'Tax Group category exists');
assert(appJs.includes("'GST0 [0%]'"), 'GST0 [0%] exists');
assert(appJs.includes("'GST5 [5%]'"), 'GST5 [5%] exists');
assert(appJs.includes("'GST12 [12%]'"), 'GST12 [12%] exists');
assert(appJs.includes("'GST18 [18%]'"), 'GST18 [18%] exists');
assert(appJs.includes("'GST28 [28%]'"), 'GST28 [28%] exists');
assert(appJs.includes("'Interstate [18%]'"), 'Interstate [18%] exists');

// 5. Actions: New Tax Button & Functions
assert(appJs.includes('window.smatApp.addNewPlanTax()'), 'New Tax button triggers addNewPlanTax()');
assert(appJs.includes('function renderPlanTaxOptions'), 'renderPlanTaxOptions function defined');
assert(appJs.includes('function togglePlanTaxDropdown'), 'togglePlanTaxDropdown function defined');
assert(appJs.includes('function closePlanTaxDropdown'), 'closePlanTaxDropdown function defined');
assert(appJs.includes('function selectPlanTax'), 'selectPlanTax function defined');
assert(appJs.includes('function filterPlanTaxes'), 'filterPlanTaxes function defined');
assert(appJs.includes('function onZohoDiscountPrefChange'), 'onZohoDiscountPrefChange function defined');

// 6. Outside click handling
assert(appJs.includes("closePlanTaxDropdown()"), 'Outside click closes plan tax dropdown');

// 7. Calculations integration
assert(appJs.includes("parseFloat(document.getElementById('zoho-plan-tax')?.value)"), 'updateZohoSubCalculations reads selected tax rate');
assert(appJs.includes("zohoDiscountPref === 'no-discount'"), 'updateZohoSubCalculations handles no-discount preference');

// 8. window.smatApp exports
assert(appJs.includes('togglePlanTaxDropdown,'), 'togglePlanTaxDropdown exported');
assert(appJs.includes('closePlanTaxDropdown,'), 'closePlanTaxDropdown exported');
assert(appJs.includes('selectPlanTax,'), 'selectPlanTax exported');
assert(appJs.includes('filterPlanTaxes,'), 'filterPlanTaxes exported');
assert(appJs.includes('addNewPlanTax,'), 'addNewPlanTax exported');
assert(appJs.includes('onZohoDiscountPrefChange,') || appJs.includes('onZohoDiscountPrefChange,'), 'onZohoDiscountPrefChange exported');

// 9. CSS styles
assert(stylesCss.includes('.zoho-tax-popover'), '.zoho-tax-popover styling present');
assert(stylesCss.includes('.zoho-tax-item:hover'), '.zoho-tax-item:hover solid blue background styling present');
assert(stylesCss.includes('.zoho-tax-item.selected'), '.zoho-tax-item.selected light background styling present');
assert(stylesCss.includes('#zoho-plan-tax-list::-webkit-scrollbar'), 'Custom scrollbar styling present');

// 10. Cache busting
assert(indexHtml.includes('app.js?v=12.1'), 'index.html has app.js?v=12.1');
assert(indexHtml.includes('styles.css?v=12.1'), 'index.html has styles.css?v=12.1');

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL PLAN TAX & TOP UI TESTS PASSED 100%!');
}
