const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- TEST SUITE: ZOHO 10 PLANS SEARCHABLE DROPDOWN & DYNAMIC STATES ---');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'js', 'app.js'), 'utf8');
const stylesCss = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'css', 'styles.css'), 'utf8');
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

// 1. All 10 Plans and Codes matching User Screenshots 1, 2, 3
const EXPECTED_PLANS = [
  { name: 'Starter New Monthly (Without WA)', code: 'MonthlyStarterwithoutwhatsapp' },
  { name: 'Pro New Monthly (With WhatsApp)', code: 'ProNewMonthlyWithWhatsApp' },
  { name: 'Pro New Monthly (without whatsapp)', code: 'ProNewPlanMonthlyWithoutWhatsapp' },
  { name: 'Pro New Yearly (Without WhatsApp)', code: 'ProNewYearlyWithoutWhatsApp' },
  { name: 'Pro New Yearly (With WhatsApp)', code: 'ProNewYearlyWithWhatsApp' },
  { name: 'Starter New Monthly (With WhatsApp)', code: 'StarterNewMonthlyWithWhatsApp' },
  { name: 'Starter New Yearly (Without Whatsapp)', code: 'StarterNewYearlyWithoutWhatsapp' },
  { name: 'Starter New Yearly (With Whatsapp)', code: 'StarterNewYearlyWithWhatsapp' },
  { name: 'test plan', code: 'test' },
  { name: 'TESTAPICHANGE', code: 'TESTAPICHANGE' }
];

EXPECTED_PLANS.forEach(p => {
  test(`Plan "${p.name}" with code "${p.code}" exists`, () => {
    assert(appJs.includes(p.name), `Missing plan name: ${p.name}`);
    assert(appJs.includes(p.code), `Missing plan code: ${p.code}`);
  });
});

// 2. Searchable Input & Dropdown Popover Elements (Screenshot 1 & 3)
test('Plan search input exists with placeholder "Type or click to select a plan."', () => {
  assert(appJs.includes('placeholder="Type or click to select a plan."'), 'Missing plan search input placeholder');
  assert(appJs.includes('id="zoho-plan-search-input"'), 'Missing id zoho-plan-search-input');
});

test('Plan dropdown popover container exists', () => {
  assert(appJs.includes('id="zoho-plan-dropdown-popover"'), 'Missing id zoho-plan-dropdown-popover');
  assert(appJs.includes('id="zoho-plan-dropdown-list"'), 'Missing id zoho-plan-dropdown-list');
});

// 3. Selected Plan UI Elements (Screenshot 2)
test('Selected plan view contains title, clear button, description and SAC badge', () => {
  assert(appJs.includes('id="zoho-plan-name-display"'), 'Missing plan title display element');
  assert(appJs.includes('class="zoho-plan-clear-btn"'), 'Missing clear button class');
  assert(appJs.includes('placeholder="Add description to your plan"'), 'Missing description placeholder');
  assert(appJs.includes('SAC: <span id="zoho-plan-sac-text"'), 'Missing SAC text container');
});

// 4. JS Helper Functions
test('Plan dropdown helper functions exist', () => {
  assert(appJs.includes('function renderZohoPlanNameCell'), 'Missing renderZohoPlanNameCell');
  assert(appJs.includes('function renderPlanDropdownItems'), 'Missing renderPlanDropdownItems');
  assert(appJs.includes('function openPlanDropdown'), 'Missing openPlanDropdown');
  assert(appJs.includes('function closePlanDropdown'), 'Missing closePlanDropdown');
  assert(appJs.includes('function filterPlanDropdown'), 'Missing filterPlanDropdown');
  assert(appJs.includes('function selectZohoPlan'), 'Missing selectZohoPlan');
  assert(appJs.includes('function clearZohoPlan'), 'Missing clearZohoPlan');
});

// 5. Function Exports
test('Plan dropdown functions exported on window.smatApp', () => {
  assert(appJs.includes('openPlanDropdown,'), 'Missing openPlanDropdown export');
  assert(appJs.includes('closePlanDropdown,'), 'Missing closePlanDropdown export');
  assert(appJs.includes('filterPlanDropdown,'), 'Missing filterPlanDropdown export');
  assert(appJs.includes('selectZohoPlan,'), 'Missing selectZohoPlan export');
  assert(appJs.includes('clearZohoPlan,'), 'Missing clearZohoPlan export');
});

// 6. CSS Styling (Solid Blue Hover with White Text)
test('CSS styles defined for plan dropdown and blue hover state', () => {
  assert(stylesCss.includes('.zoho-plan-dropdown-popover'), 'Missing .zoho-plan-dropdown-popover');
  assert(stylesCss.includes('.zoho-plan-option-item'), 'Missing .zoho-plan-option-item');
  assert(stylesCss.includes('background: #2563EB !important;'), 'Missing hover solid blue background');
  assert(stylesCss.includes('color: #FFFFFF !important;'), 'Missing hover white text color');
});

// 7. Cache busting version
test('Cache version bumped to v=12.1 in index.html', () => {
  assert(indexHtml.includes('app.js?v=12.1'), 'app.js is not v=12.1');
  assert(indexHtml.includes('styles.css?v=12.1'), 'styles.css is not v=12.1');
});

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL ZOHO 10 PLANS SEARCHABLE DROPDOWN TESTS PASSED 100%!');
}
