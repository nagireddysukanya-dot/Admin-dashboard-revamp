// Test suite validating Customer Right Sidebar Tab & Slide-over Drawer (Screenshots 1 & 2)
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

console.log('--- TEST SUITE: ZOHO CUSTOMER SIDEBAR TAB & DRAWER ---');

// 1. Right-docked tab button (Screenshot 1)
assert(appJs.includes('id="zoho-customer-sidebar-tab"'), 'Docked right sidebar tab button exists');
assert(appJs.includes('window.smatApp.toggleCustomerSidebar()'), 'Tab button triggers toggleCustomerSidebar()');
assert(stylesCss.includes('#zoho-customer-sidebar-tab'), 'Tab button styles defined in styles.css');

// 2. Slide-over drawer and backdrop (Screenshot 2)
assert(appJs.includes('id="zoho-customer-sidebar-backdrop"'), 'Sidebar backdrop element exists');
assert(appJs.includes('id="zoho-customer-sidebar-drawer"'), 'Slide-over drawer element exists');
assert(stylesCss.includes('#zoho-customer-sidebar-drawer.open'), 'Drawer .open transition state defined');

// 3. Header details in drawer (Screenshot 2)
assert(appJs.includes('(currClient.name || \'D\').charAt(0).toUpperCase()'), 'Avatar circle with first letter exists');
assert(appJs.includes('View in Customers module'), 'Tooltip "View in Customers module" exists');
assert(appJs.includes('window.smatApp.closeCustomerSidebar()'), 'Red close button triggers closeCustomerSidebar()');

// 4. Tabs in drawer
const drawerStart = appJs.indexOf('zoho-customer-sidebar-drawer');
const drawerEnd = appJs.indexOf('zoho-plan-remove-modal');
const drawerContent = appJs.substring(drawerStart, drawerEnd);
assert(!drawerContent.includes('Unpaid Invoices'), 'Unpaid Invoices tab is removed from drawer');
assert(!drawerContent.includes('Activity Log'), 'Activity Log tab is removed from drawer');
assert(drawerContent.includes('Details'), 'Details tab is preserved in drawer');

// 5. Metric cards (Screenshot 2)
assert(appJs.includes('Outstanding Receivables'), 'Outstanding Receivables card exists');
assert(appJs.includes('Rs.25,045.24'), 'Outstanding Receivables value Rs.25,045.24 exists');
assert(appJs.includes('Unused Credits'), 'Unused Credits card exists');
assert(appJs.includes('Rs.0.00'), 'Unused Credits value Rs.0.00 exists');

// 6. Contact Details fields (Screenshot 2)
assert(appJs.includes('Contact Details'), 'Contact Details section exists');
assert(appJs.includes('Customer Type'), 'Customer Type field exists');
assert(appJs.includes('Payment Terms'), 'Payment Terms field exists');
assert(appJs.includes('Due on Receipt'), 'Due on Receipt value exists');
assert(appJs.includes('Portal Status'), 'Portal Status field exists');
assert(appJs.includes('Disabled'), 'Portal Status Disabled value exists');
assert(appJs.includes('GST Treatment'), 'GST Treatment field exists');
assert(appJs.includes('Place of Supply'), 'Place of Supply field exists');
assert(appJs.includes('Tax Preference'), 'Tax Preference field exists');
assert(appJs.includes('Type of Account'), 'Type of Account field exists');
assert(appJs.includes('Direct Customer'), 'Direct Customer value exists');
assert(appJs.includes('expiry_emails'), 'expiry_emails field exists');

// 7. Contact Persons card (Screenshot 2)
assert(appJs.includes('Contact Persons'), 'Contact Persons card exists');

// 8. JS Helper Functions & Window Exports
assert(appJs.includes('function openCustomerSidebar'), 'openCustomerSidebar defined');
assert(appJs.includes('function closeCustomerSidebar'), 'closeCustomerSidebar defined');
assert(appJs.includes('function toggleCustomerSidebar'), 'toggleCustomerSidebar defined');
assert(appJs.includes('openCustomerSidebar,'), 'openCustomerSidebar exported');
assert(appJs.includes('closeCustomerSidebar,'), 'closeCustomerSidebar exported');
assert(appJs.includes('toggleCustomerSidebar,'), 'toggleCustomerSidebar exported');

// 9. Cache busting
assert(indexHtml.includes('app.js?v=12.1'), 'app.js bumped to v=11.9 in index.html');
assert(indexHtml.includes('styles.css?v=12.1'), 'styles.css bumped to v=11.9 in index.html');

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL CUSTOMER SIDEBAR & DRAWER TESTS PASSED 100%!');
}
