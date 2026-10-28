const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

console.log('Testing SAC popover and pencil click behavior...');

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
    querySelectorAll: (sel) => (sel === '.zoho-sac-popover' ? [getEl('#zoho-sac-popover-plan'), getEl('#zoho-sac-popover-addon-0')] : []),
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

const popoverEl = getEl('#zoho-sac-popover-plan');
assert.strictEqual(popoverEl.style.display, 'none', 'Popover starts closed');

// Toggle open
smat.toggleSacPopover('plan', 0);
assert.strictEqual(popoverEl.style.display, 'block', 'Popover opens on pencil/badge tap');
console.log('  ✅ [PASS] 1. Tapping pencil on SAC opens popover');

// Change SAC and save
const sel = getEl('#zoho-sac-select-plan');
sel.value = '998313';
const txt = getEl('#zoho-plan-sac-text');
smat.saveSacCode('plan', 0);
assert.strictEqual(txt.innerText, '998313', 'SAC code updated to 998313');
assert.strictEqual(popoverEl.style.display, 'none', 'Popover closed after Save');
console.log('  ✅ [PASS] 2. Saving SAC updates badge and closes popover');

// Toggle and close
smat.toggleSacPopover('plan', 0);
assert.strictEqual(popoverEl.style.display, 'block', 'Popover re-opened');
smat.closeSacPopover('plan', 0);
assert.strictEqual(popoverEl.style.display, 'none', 'Popover closed on Close click');
console.log('  ✅ [PASS] 3. Close button dismisses popover');

console.log('🎉 ALL SAC POPOVER TESTS PASSED 100%!');
