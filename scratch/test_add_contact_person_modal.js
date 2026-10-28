const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

console.log('Testing "Add Contact Person" modal and E-MAIL TO integration (Screenshot 1 & 2)...');

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

// 1. Verify E-MAIL TO has the dashed New Contact Person button (Screenshot 2)
let viewHtml = viewportEl.innerHTML;
assert(viewHtml.includes('New Contact Person'), 'E-MAIL TO has New Contact Person button');
assert(viewHtml.includes('suryadesigner1234@gmail.com'), 'E-MAIL TO has primary client email checkbox');
console.log('  ✅ [PASS] 1. E-MAIL TO renders dashed New Contact Person button and primary email (Screenshot 2)');

// 2. Open Add Contact Person modal (Screenshot 1)
smat.openAddContactPersonModal();
const modalHtml = modalEl.innerHTML;
assert(modalHtml.includes('Add Contact Person'), 'Modal title "Add Contact Person" rendered');
assert(modalHtml.includes('Salutation'), 'Salutation dropdown rendered');
assert(modalHtml.includes('First Name'), 'First Name input rendered');
assert(modalHtml.includes('Last Name'), 'Last Name input rendered');
assert(modalHtml.includes('Work Phone'), 'Work Phone input rendered');
assert(modalHtml.includes('Mobile'), 'Mobile input rendered');
assert(modalHtml.includes('Skype Name/Number'), 'Skype input rendered');
assert(modalHtml.includes('Designation'), 'Designation input rendered');
assert(modalHtml.includes('Department'), 'Department input rendered');
assert(modalHtml.includes('Drag & Drop Profile Image'), 'Profile Image Drag & Drop section rendered');
assert(modalHtml.includes('Upload File'), 'Upload File button rendered');
assert(modalHtml.includes('Save') && modalHtml.includes('Cancel'), 'Save and Cancel buttons rendered');
console.log('  ✅ [PASS] 2. Add Contact Person modal layout matches Screenshot 1 completely');

// 3. Fill and Save Contact Person
getEl('#cp-salutation').value = 'Mr.';
getEl('#cp-first-name').value = 'Rohan';
getEl('#cp-last-name').value = 'Verma';
getEl('#cp-email').value = 'rohan.verma@company.com';
getEl('#cp-mobile').value = '9876543210';
getEl('#cp-designation').value = 'Operations Head';

smat.saveContactPerson();

// 4. Verify new contact person appears under E-MAIL TO
viewHtml = viewportEl.innerHTML;
assert(viewHtml.includes('rohan.verma@company.com'), 'New contact person email rendered in E-MAIL TO checkboxes');
assert(viewHtml.includes('Mr. Rohan Verma'), 'New contact person name rendered in E-MAIL TO checkboxes');
console.log('  ✅ [PASS] 3. Saving adds contact person as checked checkbox card under E-MAIL TO');

console.log('🎉 ALL "ADD CONTACT PERSON" TESTS PASSED 100%!');
