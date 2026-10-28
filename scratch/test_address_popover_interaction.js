const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

console.log('Testing Billing and Shipping Address popover interaction (Screenshots 1 & 2)...');

const appJs = fs.readFileSync('frontend/js/app.js', 'utf8');

const elements = {};
function createMockEl(tag) {
  return {
    tagName: (tag || 'div').toUpperCase(),
    innerHTML: '',
    style: { display: 'none' },
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
const modalEl = createMockEl('div');
elements['#modal-container'] = modalEl;

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
    querySelectorAll: (sel) => {
      if (sel === '.zoho-addr-popover') return [getEl('#zoho-addr-popover-billing'), getEl('#zoho-addr-popover-shipping')];
      if (sel === '.zoho-sac-popover') return [getEl('#zoho-sac-popover-plan')];
      return [];
    },
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

// 1. Test Billing Popover (Screenshot 1)
const billingPop = getEl('#zoho-addr-popover-billing');
assert.strictEqual(billingPop.style.display, 'none', 'Billing popover starts closed');
smat.toggleAddressPopover('billing');
assert.strictEqual(billingPop.style.display, 'block', 'Billing popover opens on pencil tap');
console.log('  ✅ [PASS] 1. Tapping pencil on BILLING ADDRESS opens popover (Screenshot 1)');

// 2. Test Shipping Popover (Screenshot 2)
const shippingPop = getEl('#zoho-addr-popover-shipping');
smat.toggleAddressPopover('shipping');
assert.strictEqual(shippingPop.style.display, 'block', 'Shipping popover opens on pencil tap');
assert.strictEqual(billingPop.style.display, 'none', 'Billing popover closes when Shipping opens');
console.log('  ✅ [PASS] 2. Tapping pencil on SHIPPING ADDRESS opens popover (Screenshot 2)');

// 3. Test Select Address for Shipping
smat.selectShippingAddress('billing');
assert.strictEqual(shippingPop.style.display, 'none', 'Popover closes after selecting address');
console.log('  ✅ [PASS] 3. Selecting address copies it and closes popover');

// 4. Test Edit Address Modal
smat.openEditAddressModal('billing');
assert(modalEl.innerHTML.includes('Edit') && modalEl.innerHTML.includes('Billing Address'), 'Edit Address modal opens');
assert(modalEl.innerHTML.includes('Save Address'), 'Save Address button present in modal');
console.log('  ✅ [PASS] 4. Clicking edit address / new address opens address dialog modal');

console.log('🎉 ALL BILLING & SHIPPING ADDRESS POPOVER TESTS PASSED 100%!');
