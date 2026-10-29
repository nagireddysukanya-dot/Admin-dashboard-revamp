const fs = require('fs');
const path = require('path');

console.log('Testing Zoho Subscription Reference Implementation (Screenshots 1 to 4)...');

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
    innerText: '',
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
    options: [
      { value: '[TS] - Telangana', text: '[TS] - Telangana' }
    ],
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

const viewportEl = createMockElement('#route-viewport');
elements['#route-viewport'] = viewportEl;
elements['route-viewport'] = viewportEl;

global.document = {
  body: { classList: { remove: () => {}, add: () => {} } },
  addEventListener: () => {},
  querySelector: (sel) => getEl(sel),
  querySelectorAll: (sel) => [getEl(sel)],
  getElementById: (id) => getEl('#' + id)
};

// Load app.js
delete require.cache[require.resolve('../frontend/js/app.js')];
require('../frontend/js/app.js');

const smat = global.window.smatApp;
smat.init();

// Test: openZohoSubscription(10)
smat.openZohoSubscription(10);
const viewportHtml = viewportEl.innerHTML;

function assert(condition, msg) {
  if (!condition) {
    console.error('❌ [FAIL]: ' + msg);
    process.exit(1);
  } else {
    console.log('  ✅ [PASS]: ' + msg);
  }
}

// Screenshot 1 Checks:
assert(viewportHtml.includes('Change Subscription'), 'Page title "Change Subscription" rendered');
assert(viewportHtml.includes('Customer Name*'), 'Mandatory "Customer Name*" field rendered');
assert(viewportHtml.includes('deepak - suryadesigner1234@gmail.com'), 'Customer deepak - suryadesigner1234@gmail.com prefilled in dropdown');
assert(viewportHtml.includes('zoho-btn-search'), 'Customer search glass button [ 🔍 ] rendered');
assert(viewportHtml.includes('INR'), 'Currency badge [ 🟢 INR ] rendered');
assert(viewportHtml.includes('BILLING ADDRESS'), 'BILLING ADDRESS card rendered');
assert(viewportHtml.includes('feso'), 'Company feso rendered in billing address');
assert(viewportHtml.includes('Hyderabad 500034'), 'Hyderabad 500034 rendered in billing address');
assert(viewportHtml.includes('SHIPPING ADDRESS'), 'SHIPPING ADDRESS card rendered');
assert(viewportHtml.includes('E-MAIL TO'), 'E-MAIL TO row rendered');
assert(viewportHtml.includes('New Contact Person'), '+ New Contact Person button rendered');
assert(viewportHtml.includes('BILLING RECIPIENT GST DETAILS'), 'BILLING RECIPIENT GST DETAILS rendered');
assert(viewportHtml.includes('Unregistered Business'), 'GST Treatment: Unregistered Business rendered');
assert(viewportHtml.includes('Place of Supply*'), 'Place of Supply* dropdown rendered');
assert(viewportHtml.includes('[TS] - Telangana'), '[TS] - Telangana option rendered');
assert(viewportHtml.includes('Select Product*'), 'Select Product* rendered');
assert(viewportHtml.includes('SmatBot'), 'Product SmatBot rendered');

// Screenshot 2 Checks:
assert(viewportHtml.includes('Item-Level'), 'Discount preference "Item-Level" dropdown rendered');
assert(viewportHtml.includes('Every Renewal'), 'Renewal frequency "Every Renewal" dropdown rendered');
assert(viewportHtml.includes('PLAN NAME'), 'PLAN NAME table header rendered');
assert(viewportHtml.includes('Starter New Monthly (Without WA)'), 'Plan "Starter New Monthly (Without WA)" option rendered');
assert(viewportHtml.includes('Add description to your plan'), 'Plan description input rendered');
assert(viewportHtml.includes('SERVICE') && viewportHtml.includes('SAC: 998314'), 'Green SERVICE SAC: 998314 badge rendered on plan');
assert(viewportHtml.includes('zoho-plan-price'), 'Editable Plan Price input rendered');
assert(viewportHtml.includes('zoho-plan-disc-val'), 'Plan Discount input (%/₹) rendered (Point 1)');
assert(viewportHtml.includes('GST18 [18%]'), 'GST18 [18%] tax option rendered');
assert(viewportHtml.includes('Extra Chats OC NM'), 'Addon "Extra Chats OC NM" rendered');
assert(viewportHtml.includes('1 UNIT : 1000 CHATS ( Excluding WhatsApp )'), 'Addon description rendered');
assert(viewportHtml.includes('zoho-addon-disc-val-0'), 'Add-on Discount input (%/₹) rendered (Point 2)');

// Screenshot 3 Checks:
assert(viewportHtml.includes('Add New Row'), '+ Add New Row button rendered');
assert(viewportHtml.includes('Subscription Term'), 'Subscription Term section header rendered');
assert(viewportHtml.includes('Subscription Number*'), 'Subscription Number* field rendered');
assert(viewportHtml.includes('SUB-01083'), 'SUB-01083 prefilled in subscription number');
assert(viewportHtml.includes('Reference Number'), 'Reference Number field rendered');
assert(viewportHtml.includes('Salesperson'), 'Salesperson dropdown rendered');
assert(viewportHtml.includes('Rahul Sharma'), 'Salesperson Rahul Sharma rendered');
assert(viewportHtml.includes('GST Number'), 'GST Number field rendered');

// Screenshot 4 Checks:
assert(viewportHtml.includes('Collect payment offline'), 'Payment Mode: "Collect payment offline" checkbox rendered');
assert(viewportHtml.includes('Due on Receipt'), 'Payment Terms: "Due on Receipt" rendered');
assert(viewportHtml.includes('Razorpay'), 'Online payment option "Razorpay" rendered');
assert(viewportHtml.includes('Prorate Charges & Credits'), 'Proration preference rendered');
assert(viewportHtml.includes('Standard Template'), 'Invoice Template: Standard Template rendered');
assert(viewportHtml.includes('No Rounding'), 'Round Off: No Rounding rendered');
assert(viewportHtml.includes('Thank you for the payment. You just made our day.'), 'Customer Notes prefilled message rendered');
assert(viewportHtml.includes('3. Live Final Billing Summary'), 'Point 3 Live Final Billing Breakdown card rendered');
assert(viewportHtml.includes('Continue'), 'Primary Continue button rendered');
assert(viewportHtml.includes('Cancel'), 'Secondary Cancel button rendered');

console.log('\n🎉 ALL 32 REFERENCE SCREENSHOT CHECKS PASSED 100%!');
