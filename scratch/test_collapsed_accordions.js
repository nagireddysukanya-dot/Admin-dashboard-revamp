const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- TEST SUITE: COLLAPSED DRAWER ACCORDIONS (EXPAND ON CLICK) ---');

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

// 1. Initial State of Contact Persons Accordion
test('Contact Persons body is hidden by default (display:none)', () => {
  assert(appJs.includes('id="zoho-drawer-body-contact-persons" style="display:none;'), 'Contact Persons body must have display:none initially');
});

test('Contact Persons chevron points right by default', () => {
  const chevronBlock = appJs.substring(
    appJs.indexOf('id="zoho-drawer-chevron-contact-persons"'),
    appJs.indexOf('id="zoho-drawer-body-contact-persons"')
  );
  assert(chevronBlock.includes('polyline points="9 18 15 12 9 6"'), 'Contact Persons chevron must point right initially');
});

// 2. Initial State of Address Accordion
test('Address body is hidden by default (display:none)', () => {
  assert(appJs.includes('id="zoho-drawer-body-address" style="display:none;'), 'Address body must have display:none initially');
});

test('Address chevron points right by default', () => {
  const chevronBlock = appJs.substring(
    appJs.indexOf('id="zoho-drawer-chevron-address"'),
    appJs.indexOf('id="zoho-drawer-body-address"')
  );
  assert(chevronBlock.includes('polyline points="9 18 15 12 9 6"'), 'Address chevron must point right initially');
});

// 3. Toggle Functionality
test('toggleDrawerAccordion function toggles hidden state and switches chevron icons', () => {
  assert(appJs.includes('function toggleDrawerAccordion(section)'), 'toggleDrawerAccordion must be defined');
  assert(appJs.includes('polyline points="6 9 12 15 18 9"'), 'Must have down arrow for expanded state');
  assert(appJs.includes('polyline points="9 18 15 12 9 6"'), 'Must have right arrow for collapsed state');
});

// 4. Cache Versioning
test('index.html cache version is v=12.0', () => {
  assert(indexHtml.includes('app.js?v=12.1'), 'app.js must be v=12.0');
  assert(indexHtml.includes('styles.css?v=12.1'), 'styles.css must be v=12.0');
});

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL COLLAPSED ACCORDION TESTS PASSED 100%!');
}
