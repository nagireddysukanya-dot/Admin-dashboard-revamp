const storage = {
  smatbot_admin_logged_in: 'true'
};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; }
};

global.window = {
  location: { hash: '' },
  addEventListener: () => {}
};

const elements = {};
function getEl(sel) {
  if (!elements[sel]) {
    elements[sel] = {
      innerHTML: '',
      style: { display: '', width: '' },
      classList: {
        _list: [],
        add: function(c) { if (!this._list.includes(c)) this._list.push(c); },
        remove: function(c) { this._list = this._list.filter(x => x !== c); },
        contains: function(c) { return this._list.includes(c); }
      },
      textContent: '',
      value: '',
      scrollWidth: 1650,
      scrollLeft: 0,
      setAttribute: () => {},
      getAttribute: () => null
    };
  }
  return elements[sel];
}

global.document = {
  body: { classList: { remove: () => {}, add: () => {} } },
  addEventListener: () => {},
  querySelector: (sel) => getEl(sel),
  querySelectorAll: () => [],
  getElementById: (id) => getEl('#' + id)
};

require('../frontend/js/app.js');

console.log('=== TEST: TOP SCROLLBAR & FIXED BOTTOM PAGINATION VALIDATION ===\n');

// Navigate to client-details
window.smatApp.navigateTo('client-details');
const appMount = getEl('#route-viewport');
const html = appMount.innerHTML;

const checks = [
  { name: 'Table card container with top scroll class', pass: html.includes('table-card-container') && html.includes('table-card-with-top-scroll') },
  { name: 'Top horizontal scrollbar element present', pass: html.includes('table-top-scrollbar-wrapper') && html.includes('table-top-scrollbar') },
  { name: 'Top scrollbar track element present', pass: html.includes('table-top-scrollbar-track') },
  { name: 'Table scroll container present', pass: html.includes('table-scroll-container') },
  { name: 'Client data table present inside scroll container', pass: html.includes('client-data-table') && html.includes('clients-main-table') },
  { name: 'Bottom pagination footer present', pass: html.includes('client-table-pagination-footer') },
  { name: 'Page size selector present with options', pass: html.includes('page-size-select') && html.includes('value="10"') },
  { name: 'Page size label "records per page" present', pass: html.includes('pagination-per-page-label') && html.includes('records per page') },
  { name: 'Center entries counter info present', pass: html.includes('pagination-center-info') && html.includes('Showing') && html.includes('clients') },
  { name: 'Pagination navigation numbers list present', pass: html.includes('pagination-numbers-list') },
  { name: 'window.smatApp.syncTableScroll exported', pass: typeof window.smatApp.syncTableScroll === 'function' },
  { name: 'window.smatApp.initTableScrollbarSync exported', pass: typeof window.smatApp.initTableScrollbarSync === 'function' }
];

let allPassed = true;
checks.forEach((c, idx) => {
  const status = c.pass ? '✅ PASS' : '❌ FAIL';
  console.log(`${idx + 1}. [${status}] ${c.name}`);
  if (!c.pass) allPassed = false;
});

// Test scroll sync call
try {
  window.smatApp.syncTableScroll('top');
  window.smatApp.syncTableScroll('table');
  window.smatApp.initTableScrollbarSync();
  console.log('\nScroll Sync Execution: ✅ Passed without exceptions');
} catch (e) {
  console.error('\nScroll Sync Execution Error:', e.message);
  allPassed = false;
}

if (allPassed) {
  console.log('\n🎉 ALL CHECKS PASSED! TOP SCROLLBAR & REFINED BOTTOM PAGINATION ARE FULLY OPERATIONAL!');
  process.exit(0);
} else {
  console.error('\n❌ Verification failed!');
  process.exit(1);
}
