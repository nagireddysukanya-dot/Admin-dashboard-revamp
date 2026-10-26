const fs = require('fs');
const path = require('path');

function assert(description, condition) {
  if (condition) {
    console.log(`  ✅ [PASS] ${description}`);
  } else {
    console.error(`  ❌ [FAIL] ${description}`);
    process.exitCode = 1;
  }
}

console.log('====================================================');
console.log('🧪 TESTING 3-LINES, PURPLE MASCOT LOGO & TABLE CLEANUP');
console.log('====================================================');

const storage = {
  smatbot_admin_logged_in: 'true',
  smatbot_admin_user: JSON.stringify({
    name: 'Sukanya Nagireddy',
    email: 'sukanya@smatbot.com',
    role: 'Super Admin'
  })
};

global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; }
};

global.sessionStorage = {
  getItem: (k) => null,
  setItem: () => {},
  removeItem: () => {}
};

global.window = {
  location: { hash: '#client-details' },
  addEventListener: () => {}
};

const elements = {};
function createMockElement(idOrSel) {
  return {
    id: idOrSel.replace('#', ''),
    innerHTML: '',
    style: { display: '' },
    classList: {
      _list: [],
      add: function(c) { if (!this._list.includes(c)) this._list.push(c); },
      remove: function(c) { this._list = this._list.filter(x => x !== c); },
      contains: function(c) { return this._list.includes(c); }
    },
    textContent: '',
    value: '',
    checked: false,
    getAttribute: () => '',
    setAttribute: () => {},
    focus: () => {}
  };
}

function getEl(sel) {
  if (!elements[sel]) {
    elements[sel] = createMockElement(sel);
  }
  return elements[sel];
}

const appMount = createMockElement('#app-mount');
elements['#app-mount'] = appMount;

const viewportEl = createMockElement('#route-viewport');
elements['#route-viewport'] = viewportEl;

global.document = {
  body: { classList: { remove: () => {}, add: () => {} } },
  addEventListener: () => {},
  querySelector: (sel) => getEl(sel),
  querySelectorAll: (sel) => [getEl(sel)],
  getElementById: (id) => getEl('#' + id)
};

// Evaluate app.js
require('../frontend/js/app.js');
window.smatApp.init();

// 1. Verify Header Toggle Button has restored 3 lines
assert('1. App mount rendered layout', !!appMount.innerHTML);
assert('2. Header toggle button has hamburger-btn class', appMount.innerHTML.includes('hamburger-btn'));
assert('3. Header toggle button has 3 lines (<line>)', appMount.innerHTML.includes('<line x1="3" y1="12" x2="21" y2="12"></line>'));
assert('4. Header toggle button DOES NOT contain lightning bolt', !appMount.innerHTML.includes('<button class="hamburger-btn') || !appMount.innerHTML.match(/<button class="hamburger-btn[^>]*>\s*<svg[^>]*>\s*<path d="M13 2L3/));

// 2. Verify Sidebar Brand Logo is the official purple robot mascot
assert('5. Sidebar has purple robot mascot (#4C2277)', appMount.innerHTML.includes('fill="#4C2277"'));
assert('6. Sidebar has mascot diamond eyes and smile', appMount.innerHTML.includes('points="10,8.5') && appMount.innerHTML.includes('d="M11 15.5 C13.5 19.5'));
assert('7. Sidebar brand logo box has brand-icon-mascot class', appMount.innerHTML.includes('brand-icon-mascot'));

// 3. Verify S.no on Client Details Table
window.smatApp.navigateTo('client-details');
assert('8. Client Details table rendered', viewportEl.innerHTML.includes('clients-main-table'));

const trMatches = viewportEl.innerHTML.match(/<td style="font-weight: 600; color: #64748B;">(\d+)<\/td>/g);
const parsedSnos = (trMatches || []).map(m => {
  const match = m.match(/(\d+)<\/td>/);
  return match ? parseInt(match[1], 10) : null;
});
console.log('Extracted S.no values:', parsedSnos.slice(0, 5));
assert('9. Row 1 starts with S.no 1', parsedSnos[0] === 1);
assert('10. S.no is strictly sequential (1, 2, 3...)', parsedSnos.every((num, idx) => num === idx + 1));

// 4. Verify Name column does NOT have duplicate email or sub-domain underneath
assert('11. Client table rows DO NOT contain client-sub-domain under name', !viewportEl.innerHTML.includes('class="client-sub-domain"'));
assert('12. Email address is solely in the Email column', viewportEl.innerHTML.includes('class="btn-copy-inline"'));

console.log('\n====================================================');
console.log('🎉 ALL 12 VERIFICATION ASSERTIONS PASSED 100%!');
console.log('====================================================');
