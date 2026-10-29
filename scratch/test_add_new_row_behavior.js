const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

console.log('Testing "Add New Row" behavior matching Screenshot 1 vs Screenshot 2...');

const appJs = fs.readFileSync('frontend/js/app.js', 'utf8');

const elements = {};
function createMockEl(tag) {
  return {
    tagName: (tag || 'div').toUpperCase(),
    innerHTML: '',
    style: {},
    classList: {
      _list: [],
      add: function(c) { if (!this._list.includes(c)) this._list.push(c); },
      remove: function(c) { this._list = this._list.filter(x => x !== c); },
      contains: function(c) { return this._list.includes(c); }
    },
    value: '',
    options: [],
    innerText: '',
    focus: () => {}
  };
}

function getEl(sel) {
  if (!elements[sel]) elements[sel] = createMockEl('div');
  return elements[sel];
}

const viewportEl = createMockEl('div');
elements['#route-viewport'] = viewportEl;

const context = {
  window: {
    location: { hash: '' },
    addEventListener: () => {}
  },
  localStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  },
  document: {
    getElementById: (id) => getEl('#' + id),
    querySelector: (sel) => getEl(sel),
    querySelectorAll: () => [],
    addEventListener: () => {},
    body: createMockEl('body')
  },
  setTimeout: (fn) => setTimeout(fn, 0),
  clearTimeout: () => {},
  fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
};

vm.createContext(context);
vm.runInContext(appJs, context);

const smat = context.window.smatApp;
smat.init();
smat.openZohoSubscription(10);

// Check Initial State:
let html = viewportEl.innerHTML;
assert(html.includes('Extra Chats OC NM'), 'Initial row has Extra Chats OC NM');
assert(html.includes('Rs. 600.00'), 'Initial row amount is Rs. 600.00');
console.log('  ✅ [PASS] 1. Initial table contains Extra Chats OC NM (Rs. 600.00)');

// Test Clicking "Add New Row"
smat.addZohoSubAddonRow();
html = viewportEl.innerHTML;

// Verify Screenshot 1 requirements:
assert(html.includes('Type or click to select an addon.'), 'New row must display "Type or click to select an addon." placeholder');
assert(html.includes('Select a Tax'), 'New row must display "Select a Tax" placeholder');
assert(html.includes('0.00'), 'New row price and amount must default to 0.00');
assert(html.includes('···'), 'New row must contain three-dots button');
assert(html.includes('Delete row') || html.includes('removeZohoSubAddonRow(1)'), 'New row must contain delete button');

// Verify it DOES NOT auto-fill "+10,000 Conversations Quota" as selected (Screenshot 2 issue)
assert(!html.includes('Monthly conversational messages booster'), 'New row MUST NOT pre-populate description for +10,000 Conversations Quota');
assert(!html.includes('value="1500"'), 'New row MUST NOT pre-populate price 1500');
console.log('  ✅ [PASS] 2. Clicking Add New Row creates an empty row matching Screenshot 1 (NOT Screenshot 2 auto-populated row)');

// Test Selecting an addon in row 1
smat.onZohoAddonChange(1, '+10,000 Conversations Quota');
html = viewportEl.innerHTML;
assert(html.includes('+10,000 Conversations Quota'), 'Row 1 now populated with +10,000 Conversations Quota');
assert(html.includes('Monthly conversational messages booster'), 'Row 1 has description');
console.log('  ✅ [PASS] 3. Selecting an addon populates row details and price cleanly');

// Test Removing the row
smat.removeZohoSubAddonRow(1);
html = viewportEl.innerHTML;
assert(!html.includes('+10,000 Conversations Quota'), 'Row 1 removed successfully');
console.log('  ✅ [PASS] 4. Removing row deletes it and restores table state');

console.log('🎉 ALL "ADD NEW ROW" SCREENSHOT 1 TESTS PASSED 100%!');
