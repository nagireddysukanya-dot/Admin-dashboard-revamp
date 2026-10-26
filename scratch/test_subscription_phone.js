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

console.log('--- SUBSCRIPTION / EDIT CUSTOMER TEST ---');
const hasSinglePhone = container.innerHTML.includes('smat-single-phone-input-wrap');
const hasMatchingRecords = container.innerHTML.includes('Matching Customer Records');
const hasDeepakActive = container.innerHTML.includes('deepak - 21552 - deepaknew@gmail.com');
const hasMoveSmatbot = container.innerHTML.includes('smatbot old bots - 18905 - move@smatbot.com');
const hasWarningLine = container.innerHTML.includes('Mobile Number already exists');

console.log('1. Single Phone Input:', hasSinglePhone);
console.log('2. Matching Customer Records Card:', hasMatchingRecords);
console.log('3. Record 1 (Deepak Active):', hasDeepakActive);
console.log('4. Record 2 (SmatBot Old Bots):', hasMoveSmatbot);
console.log('5. Mobile Number already exists warning line:', hasWarningLine);

if (hasSinglePhone && hasMatchingRecords && hasDeepakActive && hasMoveSmatbot && hasWarningLine) {
  console.log('✅ ALL SUBSCRIPTION PHONE & MATCHING RECORDS CHECKS PASSED!');
} else {
  console.error('❌ CHECK FAILED!');
  process.exit(1);
}
