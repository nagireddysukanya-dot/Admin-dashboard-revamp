const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('Testing Separated Monthly & Yearly Plans Implementation...');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'js', 'app.js'), 'utf8');

const storage = {};
const mockLocalStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; }
};

function createMockEl(tag = 'div') {
  const el = {
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
  return el;
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

// 1. Verify optgroups exist
if (!modalHtml.includes('MONTHLY PLANS') || !modalHtml.includes('YEARLY PLANS')) {
  console.error('FAIL: Missing Monthly or Yearly optgroups in plan-tier-select');
  process.exit(1);
}
console.log('  ✅ [PASS] 1. Distinct optgroups for MONTHLY PLANS and YEARLY PLANS exist');

// 2. Verify separate options exist
const requiredOptions = [
  'Pro_Monthly', 'Broadcast_Monthly', 'Standard_Monthly', 'AI_Monthly',
  'Pro_Yearly', 'Broadcast_Yearly', 'Standard_Yearly', 'AI_Yearly'
];

for (const opt of requiredOptions) {
  if (!modalHtml.includes(`value="${opt}"`)) {
    console.error(`FAIL: Missing separate option value "${opt}"`);
    process.exit(1);
  }
}
console.log('  ✅ [PASS] 2. All 8 separate Monthly and Yearly options are present');

// 3. Verify confusing combined option text is gone
if (modalHtml.includes('Pro (₹6,500/mo | ₹72,000/yr)')) {
  console.error('FAIL: Confusing combined text still found in modal');
  process.exit(1);
}
console.log('  ✅ [PASS] 3. Confusing combined text (e.g. ₹6,500/mo | ₹72,000/yr) removed completely');

// 4. Test submitting a Yearly plan creates client with Yearly billing cycle
const planSelect = elementsMap['#plan-tier-select'] || createMockEl('select');
planSelect.value = 'AI_Yearly';
elementsMap['#plan-tier-select'] = planSelect;

const durationSelect = elementsMap['#plan-duration-select'] || createMockEl('select');
durationSelect.value = '12';
elementsMap['#plan-duration-select'] = durationSelect;

const clientTargetSelect = elementsMap['#plan-target-client'] || createMockEl('select');
clientTargetSelect.value = 'NEW_CLIENT';
elementsMap['#plan-target-client'] = clientTargetSelect;

const nameInput = elementsMap['#new-client-name'] || createMockEl('input');
nameInput.value = 'Apex AI Labs';
elementsMap['#new-client-name'] = nameInput;

const emailInput = elementsMap['#new-client-email'] || createMockEl('input');
emailInput.value = 'finance@apexai.io';
elementsMap['#new-client-email'] = emailInput;

// Trigger submit
const form = elementsMap['#plan-activation-form'] || createMockEl('form');
form.dispatchEvent({ type: 'submit', preventDefault: () => {} });

// Check created client
const savedData = JSON.parse(mockLocalStorage.getItem('smatbot_clients_data') || '[]');
const newClient = savedData.find(c => c.email === 'finance@apexai.io');

if (!newClient) {
  console.error('FAIL: New client not saved to localStorage');
  process.exit(1);
}
if (newClient.plan_name !== 'AI') {
  console.error(`FAIL: Expected clean plan_name 'AI', got '${newClient.plan_name}'`);
  process.exit(1);
}
if (newClient.billing_cycle !== 'Yearly') {
  console.error(`FAIL: Expected billing_cycle 'Yearly', got '${newClient.billing_cycle}'`);
  process.exit(1);
}
console.log(`  ✅ [PASS] 4. Submitting 'AI_Yearly' creates client with clean plan_name 'AI' and billing_cycle 'Yearly'`);

console.log('🎉 ALL SEPARATED MONTHLY & YEARLY PLAN TESTS PASSED 100%!');
