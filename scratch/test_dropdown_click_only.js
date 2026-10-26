const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; }
};

global.window = {
  location: { hash: '' },
  addEventListener: () => {}
};

const dummyElem = {
  innerHTML: '',
  classList: { remove: () => {}, add: () => {} },
  value: ''
};

global.document = {
  body: { classList: { remove: () => {}, add: () => {} } },
  addEventListener: () => {},
  querySelector: () => dummyElem,
  querySelectorAll: () => []
};

require('../frontend/js/app.js');

const container = { innerHTML: '' };
window.smatApp.renderZohoEditCustomerView(container);

console.log('--- TEST: DROPDOWN HIDDEN BY DEFAULT ON PAGE OPEN ---');
// 1. Dropdown must NOT have 'show' class in innerHTML
const dropdownHasShowOnOpen = container.innerHTML.includes('matching-customers-card show');
console.log('1. Dropdown has show class on open (must be FALSE):', dropdownHasShowOnOpen);

// 2. Arrow must be '▼' on open
const arrowIsDownOnOpen = container.innerHTML.includes('matching-records-toggle-arrow">▼</span>');
console.log('2. Toggle arrow points down on open (must be TRUE):', arrowIsDownOnOpen);

// 3. Test toggle logic
let dropdownClasses = [];
const mockDropdown = {
  classList: {
    add: (cls) => dropdownClasses.push(cls),
    remove: (cls) => { dropdownClasses = dropdownClasses.filter(c => c !== cls); }
  }
};
const mockArrow = { textContent: '▼' };

global.$ = (sel) => {
  if (sel === '#matching-customers-dropdown') return mockDropdown;
  if (sel === '#matching-records-toggle-arrow') return mockArrow;
  return dummyElem;
};
global.$$ = () => [];

console.log('3. Simulating user click on View:');
window.smatApp.toggleMatchingRecordsDropdown(); // click to open
console.log('   - Dropdown has show after click:', dropdownClasses.includes('show'));
console.log('   - Arrow text after click:', mockArrow.textContent);

window.smatApp.toggleMatchingRecordsDropdown(); // click again to close
console.log('   - Dropdown has show after second click (must be FALSE):', dropdownClasses.includes('show'));
console.log('   - Arrow text after second click:', mockArrow.textContent);

if (!dropdownHasShowOnOpen && arrowIsDownOnOpen && !dropdownClasses.includes('show')) {
  console.log('✅ ALL TESTS PASSED: DROPDOWN OPENS ONLY ON USER CLICK!');
} else {
  console.error('❌ TEST FAILED');
  process.exit(1);
}
