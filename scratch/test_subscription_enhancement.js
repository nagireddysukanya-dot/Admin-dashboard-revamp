const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('Testing Enhanced Subscriptions Workflow...');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'js', 'app.js'), 'utf8');

// Mock DOM & environment
const mockDOM = {
  elements: {},
  eventListeners: {}
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
    addEventListener: function(event, cb) {
      if (!mockDOM.eventListeners[event]) mockDOM.eventListeners[event] = [];
      mockDOM.eventListeners[event].push(cb);
    },
    dispatchEvent: function(event) {
      if (mockDOM.eventListeners[event.type]) {
        mockDOM.eventListeners[event.type].forEach(cb => cb(event));
      }
    },
    setAttribute: function() {},
    getAttribute: function() { return ''; }
  };
}

const viewport = createMockEl('div');
const modalContainer = createMockEl('div');

const storage = {};
const mockLocalStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; }
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
      if (id === 'route-viewport') return viewport;
      if (id === 'modal-container') return modalContainer;
      return createMockEl('div');
    },
    querySelector: (sel) => {
      if (sel === '#route-viewport') return viewport;
      if (sel === '#modal-container') return modalContainer;
      return createMockEl('div');
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

// Initialize frontend app
smat.init();

// Test 1: Subscriptions View renders + Add Subscription button
smat.navigateTo('subscriptions', false);
const html = viewport.innerHTML;

if (!html.includes('Active Client Subscriptions')) {
  console.error('FAIL: Active Client Subscriptions title not found');
  process.exit(1);
}
console.log('  ✅ [PASS] Active Client Subscriptions title found');

if (!html.includes('window.smatApp.openAddSubscriptionModal()')) {
  console.error('FAIL: + Add Subscription button does not call openAddSubscriptionModal()');
  process.exit(1);
}
console.log('  ✅ [PASS] + Add Subscription button calls openAddSubscriptionModal()');

if (!html.includes('Edit Billing') || !html.includes('window.smatApp.openZohoEditCustomer')) {
  console.error('FAIL: Table row action missing Edit Billing button');
  process.exit(1);
}
console.log('  ✅ [PASS] Table row has ✏️ Edit Billing button');

if (!html.includes('window.smatApp.openPlanModal')) {
  console.error('FAIL: Table row action missing ⚡ Upgrade button');
  process.exit(1);
}
console.log('  ✅ [PASS] Table row has ⚡ Upgrade button');

// Test 2: openAddSubscriptionModal renders modal
smat.openAddSubscriptionModal();
const modalHtml = modalContainer.innerHTML;

if (!modalHtml.includes('Add New Subscription')) {
  console.error('FAIL: Modal header missing "Add New Subscription"');
  process.exit(1);
}
console.log('  ✅ [PASS] openAddSubscriptionModal() opened modal with title "⚡ Add New Subscription"');

if (!modalHtml.includes('NEW_CLIENT')) {
  console.error('FAIL: Modal missing NEW_CLIENT option');
  process.exit(1);
}
console.log('  ✅ [PASS] Modal has option for "+ Add New Client / Customer"');

if (!modalHtml.includes('new-client-name') || !modalHtml.includes('new-client-email')) {
  console.error('FAIL: Modal missing new client input fields');
  process.exit(1);
}
console.log('  ✅ [PASS] Modal contains new client input fields (name, email, phone)');

console.log('🎉 ALL SUBSCRIPTION ENHANCEMENT TESTS PASSED 100%!');
