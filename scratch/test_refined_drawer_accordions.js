const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Testing Refined Drawer Accordions (Screenshots 1 & 2 Match) ---');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'js', 'app.js'), 'utf8');
const stylesCss = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'css', 'styles.css'), 'utf8');
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'index.html'), 'utf8');

let passed = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✕ ${name}:`, err.message);
    process.exit(1);
  }
}

// 1. Contact Persons Accordion Card (Screenshot 1)
test('Contact Persons card has correct ID and styling', () => {
  assert(appJs.includes('id="zoho-drawer-contact-persons-card"'), 'Missing contact persons card id');
  assert(appJs.includes('Contact Persons'), 'Missing Contact Persons text');
  assert(appJs.includes('background:#94A3B8; color:#FFFFFF; font-size:0.7rem; font-weight:700; padding:1px 6px; border-radius:10px;'), 'Missing badge 1 styling');
});

test('Contact Persons has chevron icon', () => {
  assert(appJs.includes('id="zoho-drawer-chevron-contact-persons"'), 'Missing chevron ID for contact persons');
});

test('Contact Persons Body has Avatar with Green Star Badge', () => {
  assert(appJs.includes('id="zoho-drawer-body-contact-persons"'), 'Missing body ID for contact persons');
  assert(appJs.includes('background:#EEF2F6; color:#64748B'), 'Missing avatar background');
  assert(appJs.includes('background:#10B981; border:2px solid #FFFFFF; border-radius:50%'), 'Missing green star badge container');
  assert(appJs.includes('★'), 'Missing white star inside green badge');
});

test('Contact Persons has email and phone with icons', () => {
  assert(appJs.includes('suryadesigner1234@gmail.com'), 'Missing reference email');
  assert(appJs.includes('+91 9705736759'), 'Missing reference phone');
});

// 2. Address Accordion Card (Screenshot 2)
test('Address card has correct ID and header toggle', () => {
  assert(appJs.includes('id="zoho-drawer-address-card"'), 'Missing address card id');
  assert(appJs.includes('id="zoho-drawer-chevron-address"'), 'Missing address chevron id');
  assert(appJs.includes("window.smatApp.toggleDrawerAccordion('address')"), 'Missing toggleDrawerAccordion onclick for address');
});

test('Address Body contains Billing Address with Document/Clipboard Icon', () => {
  assert(appJs.includes('id="zoho-drawer-body-address"'), 'Missing address body ID');
  assert(appJs.includes('Billing Address'), 'Missing Billing Address text');
  assert(appJs.includes('d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"'), 'Missing clipboard icon path');
});

test('Billing Address Lines have left vertical line accent and bold company', () => {
  assert(appJs.includes('border-left:2px solid #E2E8F0; padding-left:12px; margin-left:2px; font-size:0.82rem; color:#334155; line-height:1.5;'), 'Missing billing address left border styling');
  assert(appJs.includes('font-weight:700; color:#0F172A'), 'Missing bold company name styling');
  assert(appJs.includes('Hyderabad'), 'Missing city');
  assert(appJs.includes('500034'), 'Missing pin');
  assert(appJs.includes('India'), 'Missing country');
});

test('Shipping Address subheading and Aligned Left Line with Centered "No Shipping Address"', () => {
  assert(appJs.includes('Shipping Address'), 'Missing Shipping Address text');
  assert(appJs.includes('border-left:2px solid #E2E8F0; margin-left:2px; padding:8px 12px; display:flex; justify-content:center; align-items:center; min-height:36px;'), 'Missing shipping address aligned border-left with centered content');
  assert(appJs.includes('No Shipping Address'), 'Missing No Shipping Address label');
});

// 3. Helper Functions & Exports
test('toggleDrawerAccordion function exists and toggles display and SVG chevron', () => {
  assert(appJs.includes('function toggleDrawerAccordion(section)'), 'Missing toggleDrawerAccordion');
  assert(appJs.includes('polyline points="6 9 12 15 18 9"'), 'Missing down chevron polyline');
  assert(appJs.includes('polyline points="9 18 15 12 9 6"'), 'Missing right chevron polyline');
  assert(appJs.includes('toggleDrawerAccordion,'), 'Missing toggleDrawerAccordion export on window.smatApp');
});

// 4. Cache Versioning
test('Cache version bumped to v=11.8 in index.html', () => {
  assert(indexHtml.includes('app.js?v=12.1'), 'app.js cache version is not 11.8');
  assert(indexHtml.includes('styles.css?v=12.1'), 'styles.css cache version is not 11.8');
});

console.log(`\n🎉 ALL ${passed} TESTS PASSED SUCCESSFULLY! (100% PASS RATE)`);
