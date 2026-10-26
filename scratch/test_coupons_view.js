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

console.log('=== TEST: VERIFYING TOP METRICS RESTORED & COUPONS TABLE CLEAN ===');

window.smatApp.navigateTo('coupons');
const viewport = getEl('#route-viewport');
const html = viewport.innerHTML;

console.log('1. Checking Top Metrics Overview Cards:');
console.log('   - TOTAL COUPONS card:', html.includes('TOTAL COUPONS') ? '✅ Present' : '❌ Missing');
console.log('   - ACTIVE PROMOTIONS card:', html.includes('ACTIVE PROMOTIONS') ? '✅ Present' : '❌ Missing');
console.log('   - TOTAL REDEMPTIONS card (Claimed by customers):', html.includes('TOTAL REDEMPTIONS') && html.includes('Claimed by customers') ? '✅ Present' : '❌ Missing');

console.log('2. Checking Header Title & Action buttons:');
console.log('   - Title "Discount Coupons & Vouchers":', html.includes('Discount Coupons & Vouchers') ? '✅ Present' : '❌ Missing');
console.log('   - Subtitle "Generate promotional discount codes":', html.includes('Generate promotional discount codes') ? '✅ Present' : '❌ Missing');
console.log('   - Filter dropdown button:', html.includes('All Coupons') ? '✅ Present' : '❌ Missing');
console.log('   - "New" button:', html.includes('openAddCouponModal') ? '✅ Present' : '❌ Missing');

console.log('3. Checking Table & Requested Coupons:');
console.log('   - 30PERCENTADD:', html.includes('30PERCENTADD') ? '✅ Present' : '❌ Missing');
console.log('   - 50PERCENTADD:', html.includes('50PERCENTADD') ? '✅ Present' : '❌ Missing');
console.log('   - 90PERCENTADD:', html.includes('90PERCENTADD') ? '✅ Present' : '❌ Missing');
console.log('   - ACTIONS column present:', html.includes('>ACTIONS</th>') ? '✅ Present' : '❌ Missing');
console.log('   - Eye icon button present:', html.includes('btn-action-view-coupon') ? '✅ Present' : '❌ Missing');

console.log('4. Checking Footer & Pagination:');
console.log('   - Total Count View:', html.includes('Total Count:') && html.includes('View') ? '✅ Present' : '❌ Missing');
console.log('   - 25 per page dropdown:', html.includes('25 per page') ? '✅ Present' : '❌ Missing');
console.log('   - Page navigation (1 - 25):', html.includes('1 - 25') ? '✅ Present' : '❌ Missing');

if (html.includes('TOTAL REDEMPTIONS') && html.includes('TOTAL COUPONS') && html.includes('ACTIVE PROMOTIONS') && html.includes('30PERCENTADD') && html.includes('>ACTIONS</th>') && html.includes('btn-action-view-coupon')) {
  console.log('\n🎉 ALL METRICS RESTORED & COUPONS TABLE HAS ACTIONS EYE COLUMN!');
} else {
  console.error('\n❌ Verification failed');
  process.exit(1);
}
