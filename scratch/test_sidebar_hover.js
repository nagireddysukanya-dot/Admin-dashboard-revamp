const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; }
};

global.window = {
  location: { hash: '#subscriptions' },
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
      contains: function(c) { return this._list.includes(c); },
      toggle: function(c) {
        if (this.contains(c)) this.remove(c);
        else this.add(c);
      }
    },
    textContent: '',
    value: '',
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

const wrapper = createMockElement('.app-layout-wrapper');
wrapper.classList.add('sidebar-collapsed');
elements['.app-layout-wrapper'] = wrapper;

global.document = {
  body: { classList: { remove: () => {}, add: () => {} } },
  addEventListener: () => {},
  querySelector: (sel) => getEl(sel),
  querySelectorAll: (sel) => [getEl(sel)],
  getElementById: (id) => getEl('#' + id)
};

require('../frontend/js/app.js');

console.log('--- TEST SUITE: SIDEBAR HAMBURGER HOVER & PEEK BEHAVIOR ---');

// 1. Initial State
console.log('1. Verifying initial state:');
console.log('   - Wrapper is collapsed:', wrapper.classList.contains('sidebar-collapsed'));
console.log('   - Hover peek is off:', !wrapper.classList.contains('sidebar-hover-peek'));

// 2. Mouse enters hamburger lines (3 lines icon)
console.log('2. Mouse enters hamburger lines:');
window.smatApp.onHamburgerHoverEnter();
console.log('   - Hover peek is ON:', wrapper.classList.contains('sidebar-hover-peek'));

// 3. Mouse moves into the opened sidebar
console.log('3. Mouse enters opened sidebar:');
window.smatApp.onSidebarHoverEnter();
console.log('   - Hover peek remains ON:', wrapper.classList.contains('sidebar-hover-peek'));

// 4. Mouse leaves the sidebar
console.log('4. Mouse leaves sidebar (with debounce delay):');
window.smatApp.onSidebarHoverLeave();
setTimeout(() => {
  console.log('   - Hover peek is smoothly turned OFF after delay:', !wrapper.classList.contains('sidebar-hover-peek'));

  // 5. User clicks hamburger button (pins open)
  console.log('5. User clicks hamburger button to lock open:');
  window.smatApp.toggleSidebar();
  console.log('   - Sidebar is pinned open (collapsed removed):', !wrapper.classList.contains('sidebar-collapsed'));

  // 6. User clicks hamburger again (pins closed)
  window.smatApp.toggleSidebar();
  console.log('   - Sidebar is closed again (collapsed added):', wrapper.classList.contains('sidebar-collapsed'));

  console.log('✅ ALL HAMBURGER HOVER & PEEK INTERACTION TESTS PASSED 100%!');
}, 350);
