// Test script for Customer Drawer Accordions (Contact Persons with green star badge & Address)
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

console.log('--- TEST SUITE: CUSTOMER DRAWER ACCORDIONS (CONTACT PERSONS & ADDRESS) ---');

// 1. Contact Persons Card & Toggle
assert(appJs.includes('id="zoho-drawer-contact-persons-card"'), 'Contact persons card container exists');
assert(appJs.includes("toggleDrawerAccordion('contact-persons')"), 'Header click triggers toggleDrawerAccordion("contact-persons")');
assert(appJs.includes('id="zoho-drawer-chevron-contact-persons"'), 'Contact persons chevron indicator exists');

// 2. Green Star Badge & Avatar (Screenshot 1 Match)
assert(appJs.includes('background:#10B981; border:2px solid #FFFFFF; border-radius:50%'), 'Green star badge circle exists');
assert(appJs.includes('★'), 'Star icon inside badge exists');

// 3. Contact Email & Phone Rows
assert(appJs.includes('currClient.phone_number || \'+91 9705736759\''), 'Phone number row exists');

// 4. Address Accordion Card & Toggle (Screenshot 2 Match)
assert(appJs.includes('id="zoho-drawer-address-card"'), 'Address accordion card container exists');
assert(appJs.includes("toggleDrawerAccordion('address')"), 'Header click triggers toggleDrawerAccordion("address")');
assert(appJs.includes('id="zoho-drawer-chevron-address"'), 'Address chevron indicator exists');

// 5. Billing Address in Drawer
assert(appJs.includes('Billing Address'), 'Billing Address subheading exists');
assert(appJs.includes('border-left:2px solid #E2E8F0'), 'Subtle vertical accent line exists');

// 6. Shipping Address & "No Shipping Address" (Screenshot 2 Match)
assert(appJs.includes('Shipping Address'), 'Shipping Address subheading exists');
assert(appJs.includes('No Shipping Address'), '"No Shipping Address" fallback exists');

// 7. JS Function & Export
assert(appJs.includes('function toggleDrawerAccordion'), 'toggleDrawerAccordion function defined');
assert(appJs.includes('toggleDrawerAccordion,'), 'toggleDrawerAccordion exported on window.smatApp');

// 8. Cache version
assert(indexHtml.includes('app.js?v=12.1'), 'index.html bumped to app.js?v=12.1');
assert(indexHtml.includes('styles.css?v=12.1'), 'index.html bumped to styles.css?v=12.1');

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL DRAWER ACCORDION TESTS PASSED 100%!');
}
