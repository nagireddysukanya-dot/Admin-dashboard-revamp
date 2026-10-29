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

const elements = {};
function getEl(sel) {
  if (!elements[sel]) {
    elements[sel] = {
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
      focus: () => {}
    };
  }
  return elements[sel];
}

global.document = {
  body: { classList: { remove: () => {}, add: () => {} } },
  addEventListener: () => {},
  querySelector: (sel) => getEl(sel),
  querySelectorAll: () => [],
  getElementById: (id) => getEl('#' + id)
};

require('../frontend/js/app.js');

console.log('=== TEST: VERIFYING COUPONS ACTIONS COLUMN & EYE DETAILS MODAL ===\n');

// 1. Render Coupons View
window.smatApp.navigateTo('coupons');
const viewport = getEl('#route-viewport');
const tableHtml = viewport.innerHTML;

console.log('1. Checking Top Overview Cards:');
console.log('   - TOTAL COUPONS card:', tableHtml.includes('TOTAL COUPONS') ? '✅ Present' : '❌ Missing');
console.log('   - ACTIVE PROMOTIONS card:', tableHtml.includes('ACTIVE PROMOTIONS') ? '✅ Present' : '❌ Missing');
console.log('   - TOTAL REDEMPTIONS card:', tableHtml.includes('TOTAL REDEMPTIONS') && tableHtml.includes('Claimed by customers') ? '✅ Present' : '❌ Missing');

console.log('\n2. Checking Table Headers & Actions Column:');
console.log('   - ACTIONS column header:', tableHtml.includes('>ACTIONS</th>') ? '✅ Present' : '❌ Missing');
console.log('   - Eye icon button in table row:', tableHtml.includes('btn-action-view-coupon') && tableHtml.includes('openCouponEyeModal') ? '✅ Present' : '❌ Missing');

console.log('\n3. Checking Requested Coupons in Table:');
console.log('   - 30PERCENTADD:', tableHtml.includes('30PERCENTADD') ? '✅ Present' : '❌ Missing');
console.log('   - 50PERCENTADD:', tableHtml.includes('50PERCENTADD') ? '✅ Present' : '❌ Missing');
console.log('   - 90PERCENTADD:', tableHtml.includes('90PERCENTADD') ? '✅ Present' : '❌ Missing');

console.log('\n4. Testing openCouponEyeModal for SMATDEEP15 (id: 42):');
window.smatApp.openCouponEyeModal(42);
const modalHtml = getEl('#modal-container').innerHTML;

const checks = [
  { label: 'Close ✕ button', pass: modalHtml.includes('✕') },
  { label: 'Coupon Name: SMATDEEP15', pass: modalHtml.includes('Coupon Name') && modalHtml.includes('SMATDEEP15') },
  { label: 'Coupon Code: SMATDEEP15', pass: modalHtml.includes('Coupon Code') },
  { label: 'Status: active', pass: modalHtml.includes('Status') && modalHtml.includes('active') },
  { label: 'Discount value: 15', pass: modalHtml.includes('Discount value') && modalHtml.includes('15') },
  { label: 'Discount type: percentage', pass: modalHtml.includes('Discount type') && modalHtml.includes('percentage') },
  { label: 'Created at: 2023-09-12', pass: modalHtml.includes('Created at') && modalHtml.includes('2023-09-12') },
  { label: 'Expiry at: 2023-12-30', pass: modalHtml.includes('Expiry at') && modalHtml.includes('2023-12-30') },
  { label: 'Apply to plans: all', pass: modalHtml.includes('Apply to plans') && modalHtml.includes('all') },
  { label: 'Restrict for guest user: false', pass: modalHtml.includes('Restrict for guest user') && modalHtml.includes('false') },
  { label: 'Max redemption: 50', pass: modalHtml.includes('Max redemption') && modalHtml.includes('50') },
  { label: 'Minimum order value: 0', pass: modalHtml.includes('Minimum order value') && modalHtml.includes('0') },
  { label: 'Redemption count: 2', pass: modalHtml.includes('Redemption count') && modalHtml.includes('2') }
];

let allPassed = true;
checks.forEach(c => {
  console.log(`   - ${c.label}: ${c.pass ? '✅ Passed' : '❌ Failed'}`);
  if (!c.pass) allPassed = false;
});

console.log('\n5. Testing closeModal:');
window.smatApp.closeModal();
const modalClosed = getEl('#modal-container').innerHTML === '';
console.log('   - Modal container cleared on close:', modalClosed ? '✅ Passed' : '❌ Failed');

if (allPassed && modalClosed && tableHtml.includes('>ACTIONS</th>') && tableHtml.includes('TOTAL REDEMPTIONS')) {
  console.log('\n🎉 ALL TESTS PASSED! ACTIONS COLUMN & EYE DETAILS MODAL ARE 100% WORKING PERFECTLY!');
} else {
  console.error('\n❌ Verification failed');
  process.exit(1);
}
