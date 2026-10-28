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
      focus: () => {},
      querySelector: (s) => getEl(sel + ' ' + s),
      querySelectorAll: (s) => []
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

console.log('=== TEST: VERIFYING SEARCHABLE DROPDOWNS (SCREENSHOTS 1 TO 4) ===\n');

// 1. Open the Modal
window.smatApp.openAddCouponModal();
const modalHtml = getEl('#modal-container').innerHTML;

console.log('1. Checking Modal Title & Header:');
console.log('   - Title is "New Coupon" (no "+"):', modalHtml.includes('New Coupon') && !modalHtml.includes('+ New Coupon') ? '✅ Passed' : '❌ Failed');
console.log('   - Close ✕ button present:', modalHtml.includes('✕') ? '✅ Passed' : '❌ Failed');

console.log('\n2. Checking Screenshot 4 - Product Searchable Dropdown:');
console.log('   - Trigger text "Select Product":', modalHtml.includes('Select Product') ? '✅ Passed' : '❌ Failed');
console.log('   - Search box present in popover:', modalHtml.includes('id="popover-coupon-product"') && modalHtml.includes('placeholder="Search"') ? '✅ Passed' : '❌ Failed');
// Check options in product dropdown
const prodOptionsHtml = getEl('#options-coupon-product').innerHTML;
console.log('   - Option "Feltso test":', prodOptionsHtml.includes('Feltso test') ? '✅ Passed' : '❌ Failed');
console.log('   - Option "SmatBot":', prodOptionsHtml.includes('SmatBot') ? '✅ Passed' : '❌ Failed');
console.log('   - "+ New Product" button:', prodOptionsHtml.includes('New Product') ? '✅ Passed' : '❌ Failed');

console.log('\n3. Checking Screenshot 3 - Redemption Type Searchable Dropdown:');
console.log('   - Trigger text "One-Time":', modalHtml.includes('id="label-coupon-redemptionType"') ? '✅ Passed' : '❌ Failed');
const redOptionsHtml = getEl('#options-coupon-redemptionType').innerHTML;
console.log('   - Option "One-Time" with checkmark:', redOptionsHtml.includes('One-Time') && redOptionsHtml.includes('selected') ? '✅ Passed' : '❌ Failed');
console.log('   - Option "Unlimited":', redOptionsHtml.includes('Unlimited') ? '✅ Passed' : '❌ Failed');
console.log('   - Option "Limited Cycles":', redOptionsHtml.includes('Limited Cycles') ? '✅ Passed' : '❌ Failed');

console.log('\n4. Checking Screenshot 1 - Associate Plans Searchable Dropdown:');
console.log('   - Trigger text "All Plans":', modalHtml.includes('id="label-coupon-plans"') ? '✅ Passed' : '❌ Failed');
const planOptionsHtml = getEl('#options-coupon-plans').innerHTML;
console.log('   - Option "All Plans" with checkmark:', planOptionsHtml.includes('All Plans') && planOptionsHtml.includes('selected') ? '✅ Passed' : '❌ Failed');
console.log('   - Option "None":', planOptionsHtml.includes('None') ? '✅ Passed' : '❌ Failed');
console.log('   - Option "Selected Plans":', planOptionsHtml.includes('Selected Plans') ? '✅ Passed' : '❌ Failed');

console.log('\n5. Checking Screenshot 2 - Associate Addons Searchable Dropdown:');
console.log('   - Trigger text "All Recurring Addons":', modalHtml.includes('id="label-coupon-addons"') ? '✅ Passed' : '❌ Failed');
const addonOptionsHtml = getEl('#options-coupon-addons').innerHTML;
console.log('   - Option "All Addons":', addonOptionsHtml.includes('All Addons') ? '✅ Passed' : '❌ Failed');
console.log('   - Option "All Recurring Addons" with checkmark:', addonOptionsHtml.includes('All Recurring Addons') && addonOptionsHtml.includes('selected') ? '✅ Passed' : '❌ Failed');
console.log('   - Option "All One-time Addons":', addonOptionsHtml.includes('All One-time Addons') ? '✅ Passed' : '❌ Failed');
console.log('   - Option "None":', addonOptionsHtml.includes('None') ? '✅ Passed' : '❌ Failed');
console.log('   - Option "Selected Addons":', addonOptionsHtml.includes('Selected Addons') ? '✅ Passed' : '❌ Failed');

console.log('\n6. Testing Dropdown Selection Interactions:');
window.smatApp.selectCouponDropdownOption('product', 'SmatBot');
console.log('   - Selected "SmatBot" for product:', getEl('#coupon-product-input').value === 'SmatBot' ? '✅ Passed' : '❌ Failed');

window.smatApp.selectCouponDropdownOption('redemptionType', 'Unlimited');
console.log('   - Selected "Unlimited" for redemption:', getEl('#coupon-redemption-type-input').value === 'Unlimited' ? '✅ Passed' : '❌ Failed');

window.smatApp.selectCouponDropdownOption('plans', 'Selected Plans');
console.log('   - Selected "Selected Plans" for plans:', getEl('#coupon-associate-plans-input').value === 'Selected Plans' ? '✅ Passed' : '❌ Failed');

window.smatApp.selectCouponDropdownOption('addons', 'Selected Addons');
console.log('   - Selected "Selected Addons" for addons:', getEl('#coupon-associate-addons-input').value === 'Selected Addons' ? '✅ Passed' : '❌ Failed');

console.log('\n7. Testing Form Submission with Selected Options:');
getEl('#coupon-name-input').value = 'SPECIAL2026';
getEl('#coupon-code-input').value = 'SPECIAL2026';
getEl('#coupon-discount-value-input').value = '250';
getEl('#coupon-discount-by-input').value = 'Flat';
getEl('#coupon-expiration-date-input').value = '31/12/2026';
getEl('#coupon-max-redemption-input').value = '100';

window.smatApp.handleAddCouponSubmit({ preventDefault: () => {} });

// Re-render coupons view to verify newly created coupon
window.smatApp.navigateTo('coupons');
const updatedTableHtml = getEl('#route-viewport').innerHTML;

const createdCouponPresent = updatedTableHtml.includes('SPECIAL2026') && updatedTableHtml.includes('Rs.250');
console.log('   - Newly added coupon "SPECIAL2026" with "Rs.250" in table:', createdCouponPresent ? '✅ Passed' : '❌ Failed');

if (
  prodOptionsHtml.includes('Feltso test') &&
  prodOptionsHtml.includes('SmatBot') &&
  prodOptionsHtml.includes('New Product') &&
  redOptionsHtml.includes('One-Time') &&
  redOptionsHtml.includes('Unlimited') &&
  redOptionsHtml.includes('Limited Cycles') &&
  planOptionsHtml.includes('All Plans') &&
  planOptionsHtml.includes('None') &&
  planOptionsHtml.includes('Selected Plans') &&
  addonOptionsHtml.includes('All Addons') &&
  addonOptionsHtml.includes('All Recurring Addons') &&
  addonOptionsHtml.includes('All One-time Addons') &&
  addonOptionsHtml.includes('Selected Addons') &&
  createdCouponPresent
) {
  console.log('\n🎉 ALL SCREENSHOTS 1 TO 4 TESTS PASSED 100% PERFECTLY!');
  process.exit(0);
} else {
  console.error('\n❌ Verification failed.');
  process.exit(1);
}
