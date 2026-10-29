const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

console.log('Testing Discount & Final Billing Implementation (Points 1, 2, 3)...');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'js', 'app.js'), 'utf8');

const storage = {};
const mockLocalStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; }
};

function createMockEl(tag = 'div') {
  return {
    tagName: tag.toUpperCase(),
    innerHTML: '',
    innerText: '',
    textContent: '',
    value: '',
    style: {},
    classList: {
      classes: new Set(),
      add: function(c) { this.classes.add(c); },
      remove: function(c) { this.classes.delete(c); },
      contains: function(c) { return this.classes.has(c); }
    },
    _listeners: {},
    addEventListener: function(event, cb) {
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(cb);
    },
    dispatchEvent: function(event) {
      if (this._listeners[event.type]) {
        this._listeners[event.type].forEach(cb => cb(event));
      }
    },
    querySelector: function(sel) {
      return createMockEl('option');
    },
    setAttribute: function() {},
    getAttribute: function() { return ''; }
  };
}

const viewport = createMockEl('div');
const modalContainer = createMockEl('div');

const elementsMap = {
  '#route-viewport': viewport,
  '#modal-container': modalContainer
};

const context = {
  console: console,
  localStorage: mockLocalStorage,
  window: {
    location: { href: '', search: '', pathname: '/' },
    localStorage: mockLocalStorage,
    smatApp: {},
    addEventListener: () => {},
    scrollTo: () => {}
  },
  document: {
    addEventListener: () => {},
    getElementById: (id) => {
      const key = '#' + id;
      if (!elementsMap[key]) elementsMap[key] = createMockEl('div');
      return elementsMap[key];
    },
    querySelector: (sel) => {
      if (!elementsMap[sel]) elementsMap[sel] = createMockEl('div');
      return elementsMap[sel];
    },
    querySelectorAll: () => [],
    createElement: (tag) => createMockEl(tag),
    body: createMockEl('body')
  },
  fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }),
  setTimeout: (fn) => setTimeout(fn, 0),
  clearTimeout: () => {},
  setInterval: () => {},
  clearInterval: () => {}
};

vm.createContext(context);
vm.runInContext(appJs, context);

const smat = context.window.smatApp;
smat.init();

// Open Plan Modal
smat.openAddSubscriptionModal();
const modalHtml = modalContainer.innerHTML;

// 1. Verify Plan Discount inputs exist
assert(modalHtml.includes('id="plan-discount-type"'), 'Plan discount type dropdown must exist');
assert(modalHtml.includes('id="plan-discount-value"'), 'Plan discount value input must exist');
console.log('  ✅ [PASS] 1. Point 1: Plan Discount controls (% and Flat) exist in modal');

// 2. Verify Add-on Discount inputs exist
assert(modalHtml.includes('id="addon-discount-type"'), 'Addon discount type dropdown must exist');
assert(modalHtml.includes('id="addon-discount-value"'), 'Addon discount value input must exist');
console.log('  ✅ [PASS] 2. Point 2: Add-on Discount controls (% and Flat) exist in modal');

// 3. Verify Final Billing & Tax Summary section exists
assert(modalHtml.includes('Final Billing & Tax Summary'), 'Final Billing & Tax Summary header must exist');
assert(modalHtml.includes('SAC: 998314'), 'SAC: 998314 Software services badge must exist');
assert(modalHtml.includes('id="summary-taxable-price"'), 'Taxable price display must exist');
assert(modalHtml.includes('id="summary-tax-price"'), 'GST 18% tax price display must exist');
assert(modalHtml.includes('id="summary-final-total"'), 'Final total amount display must exist');
console.log('  ✅ [PASS] 3. Point 3: Live Final Billing breakdown (Plan + Addons - Discount + GST 18%) exists');

// 4. Test Submitting with Plan & Addon discounts and verifying calculation
const planSelect = elementsMap['#plan-tier-select'] || createMockEl('select');
planSelect.value = 'Pro_Monthly'; // Base: 6500
elementsMap['#plan-tier-select'] = planSelect;

const durationSelect = elementsMap['#plan-duration-select'] || createMockEl('select');
durationSelect.value = '1';
elementsMap['#plan-duration-select'] = durationSelect;

const chatsCheckbox = elementsMap['#addon-chats'] || createMockEl('input');
chatsCheckbox.checked = true; // +1500 chats
elementsMap['#addon-chats'] = chatsCheckbox;

const planDiscType = elementsMap['#plan-discount-type'] || createMockEl('select');
planDiscType.value = 'percent';
elementsMap['#plan-discount-type'] = planDiscType;

const planDiscVal = elementsMap['#plan-discount-value'] || createMockEl('input');
planDiscVal.value = '10'; // 10% of 6500 = 650 discount
elementsMap['#plan-discount-value'] = planDiscVal;

const clientTargetSelect = elementsMap['#plan-target-client'] || createMockEl('select');
clientTargetSelect.value = 'NEW_CLIENT';
elementsMap['#plan-target-client'] = clientTargetSelect;

const nameInput = elementsMap['#new-client-name'] || createMockEl('input');
nameInput.value = 'Billing Test Enterprises';
elementsMap['#new-client-name'] = nameInput;

const emailInput = elementsMap['#new-client-email'] || createMockEl('input');
emailInput.value = 'accounts@billingtest.com';
elementsMap['#new-client-email'] = emailInput;

// Trigger submit
const form = elementsMap['#plan-activation-form'] || createMockEl('form');
form.dispatchEvent({ type: 'submit', preventDefault: () => {} });

// Verify created client in localStorage
const savedData = JSON.parse(mockLocalStorage.getItem('smatbot_clients_data') || '[]');
const newClient = savedData.find(c => c.email === 'accounts@billingtest.com');

assert(newClient, 'New client must be created');
assert.strictEqual(newClient.plan_name, 'Pro', 'Plan name must be Pro');
assert(newClient.final_billing, 'final_billing metadata must be stored');

// Math verification:
// Base plan = 6500
// Addon = 1500
// Total gross = 8000
// Plan discount (10% of 6500) = 650
// Taxable = 8000 - 650 = 7350
// GST 18% = 7350 * 0.18 = 1323
// Final payable = 7350 + 1323 = 8673
assert.strictEqual(newClient.final_billing.base_plan_price, 6500, 'Base plan price should be 6500');
assert.strictEqual(newClient.final_billing.addons_subtotal, 1500, 'Addons subtotal should be 1500');
assert.strictEqual(newClient.final_billing.discount_deducted, 650, 'Discount deducted should be 650');
assert.strictEqual(newClient.final_billing.taxable_amount, 7350, 'Taxable amount should be 7350');
assert.strictEqual(newClient.final_billing.tax_gst18, 1323, 'GST 18% should be 1323');
assert.strictEqual(newClient.final_billing.final_payable, 8673, 'Final payable amount should be 8673');
assert.strictEqual(newClient.subscription_amount_display, '₹ 8,673.00', 'Formatted display amount should match');

console.log('  ✅ [PASS] 4. Mathematical accuracy: (6500 + 1500 - 650) + 18% GST = ₹ 8,673.00 stored in DB');
console.log('🎉 ALL DISCOUNT & FINAL BILLING TESTS PASSED 100%!');
