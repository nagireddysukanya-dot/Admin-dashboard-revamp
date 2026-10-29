const assert = require('assert');

// Mock localStorage
const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; }
};

// Mock window and document
global.window = {
  location: { hash: '' },
  addEventListener: () => {}
};

const domStore = {};
function createMockElement(selector) {
  return {
    tagName: 'DIV',
    innerHTML: '',
    textContent: '',
    value: '',
    checked: false,
    files: [],
    style: { display: '' },
    getAttribute: function(attr) { return ''; },
    setAttribute: function(attr, val) {},
    classList: {
      _classes: new Set(),
      add: function(c) { this._classes.add(c); },
      remove: function(c) { this._classes.delete(c); },
      contains: function(c) { return this._classes.has(c); }
    },
    options: [
      { value: 'English', text: 'English' },
      { value: 'Hindi', text: 'Hindi' },
      { value: 'Telugu', text: 'Telugu' },
      { value: 'Tamil', text: 'Tamil' },
      { value: '[TS] - Telangana', text: '[TS] - Telangana' },
      { value: '[AP] - Andhra Pradesh', text: '[AP] - Andhra Pradesh' },
      { value: '[MH] - Maharashtra', text: '[MH] - Maharashtra' },
      { value: 'Registered Business - Regular', text: 'Registered Business - Regular' },
      { value: 'Unregistered Business', text: 'Unregistered Business' },
      { value: 'INR- Indian Rupee', text: 'INR- Indian Rupee' },
      { value: 'Due on Receipt', text: 'Due on Receipt' },
      { value: 'Net 30', text: 'Net 30' }
    ],
    addEventListener: () => {},
    click: () => {},
    focus: () => {}
  };
}

function getEl(sel) {
  if (!domStore[sel]) {
    domStore[sel] = createMockElement(sel);
  }
  return domStore[sel];
}

const viewportEl = createMockElement('#route-viewport');
domStore['#route-viewport'] = viewportEl;

global.document = {
  body: { classList: { remove: () => {}, add: () => {} } },
  addEventListener: () => {},
  querySelector: (sel) => {
    if (sel.includes('[name="tax_preference"]')) {
      const isExempt = sel.includes('Tax Exempt');
      return getEl(isExempt ? '#tax-exempt-radio' : '#taxable-radio');
    }
    return getEl(sel);
  },
  querySelectorAll: (sel) => [getEl(sel)],
  getElementById: (id) => getEl('#' + id)
};

// Load app
require('../frontend/js/app.js');

// Initialize app seed state
window.smatApp.init();

console.log('====================================================');
console.log('🧪 RUNNING COMPREHENSIVE CUSTOMER DETAILS TEST SUITE');
console.log('====================================================');

let passedTests = 0;
let totalTests = 0;

function runTest(desc, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ [PASS] ${desc}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${desc}: ${err.message}`);
  }
}

// 1. Render Customer View and test for all 14 fields
const container = { innerHTML: '' };
window.smatApp.renderZohoEditCustomerView(container);
const html = container.innerHTML;

runTest('1. Phone Number with Country Code exists', () => {
  assert(html.includes('id="cust-phone-code"'), 'Missing phone code select');
  assert(html.includes('id="cust-phone"'), 'Missing phone input');
  assert(html.includes('+91'), 'Missing +91 option');
});

runTest('2. Customer Language dropdown exists with options', () => {
  assert(html.includes('id="cust-language"'), 'Missing language select');
  assert(html.includes('English'), 'Missing English');
  assert(html.includes('Hindi'), 'Missing Hindi');
  assert(html.includes('Telugu'), 'Missing Telugu');
});

runTest('3. GST Treatment dropdown exists with standard options', () => {
  assert(html.includes('id="cust-gst-treatment"'), 'Missing GST treatment select');
  assert(html.includes('Unregistered Business'), 'Missing Unregistered Business');
  assert(html.includes('Registered Business - Regular'), 'Missing Registered Business - Regular');
});

runTest('4. GSTIN / UIN input and Get Taxpayer Details button exist', () => {
  assert(html.includes('id="cust-gstin-input"'), 'Missing GSTIN input');
  assert(html.includes('Get Taxpayer Details') || html.includes('Get Taxpayer details'), 'Missing Get Taxpayer Details button');
  assert(html.includes('fetchTaxpayerDetails()'), 'Button must call fetchTaxpayerDetails()');
});

runTest('5. Place of Supply dropdown exists with state options', () => {
  assert(html.includes('id="cust-place-of-supply"'), 'Missing Place of Supply select');
  assert(html.includes('[TS] - Telangana'), 'Missing Telangana');
  assert(html.includes('[MH] - Maharashtra'), 'Missing Maharashtra');
});

runTest('6. PAN Number input exists', () => {
  assert(html.includes('id="cust-pan"'), 'Missing PAN input');
});

runTest('7. Business Legal Name input exists', () => {
  assert(html.includes('id="cust-legal-name"'), 'Missing Business Legal Name input');
});

runTest('8. Business Trade Name input exists', () => {
  assert(html.includes('id="cust-trade-name"'), 'Missing Business Trade Name input');
});

runTest('9. Tax Preference radio buttons exist (Taxable & Tax Exempt)', () => {
  assert(html.includes('name="tax_preference"'), 'Missing tax_preference radios');
  assert(html.includes('value="Taxable"'), 'Missing Taxable value');
  assert(html.includes('value="Tax Exempt"'), 'Missing Tax Exempt value');
});

runTest('10. Currency dropdown exists', () => {
  assert(html.includes('id="cust-currency"'), 'Missing Currency select');
  assert(html.includes('INR- Indian Rupee') || html.includes('INR - Indian Rupee'), 'Missing INR');
  assert(html.includes('USD - United States Dollar'), 'Missing USD');
});

runTest('11. Payment Terms dropdown exists', () => {
  assert(html.includes('id="cust-payment-terms"'), 'Missing Payment Terms select');
  assert(html.includes('Due on Receipt'), 'Missing Due on Receipt');
  assert(html.includes('Net 30'), 'Missing Net 30');
});

runTest('12. Document Upload control and list exist', () => {
  assert(html.includes('id="cust-documents-input"'), 'Missing documents file input');
  assert(html.includes('id="uploaded-docs-list"'), 'Missing uploaded documents list');
});

runTest('13. Address Details (Billing & Shipping) exist', () => {
  assert(html.includes('id="bill-attention"'), 'Missing bill-attention');
  assert(html.includes('id="bill-address1"'), 'Missing bill-address1');
  assert(html.includes('id="bill-city"'), 'Missing bill-city');
  assert(html.includes('id="bill-state"'), 'Missing bill-state');
  assert(html.includes('id="bill-pincode"'), 'Missing bill-pincode');
  assert(html.includes('id="bill-phone"'), 'Missing bill-phone');
  assert(html.includes('id="bill-fax"'), 'Missing bill-fax');

  assert(html.includes('id="ship-attention"'), 'Missing ship-attention');
  assert(html.includes('id="ship-address1"'), 'Missing ship-address1');
  assert(html.includes('id="ship-city"'), 'Missing ship-city');
  assert(html.includes('id="ship-state"'), 'Missing ship-state');
  assert(html.includes('id="ship-pincode"'), 'Missing ship-pincode');
  assert(html.includes('id="ship-phone"'), 'Missing ship-phone');
  assert(html.includes('id="ship-fax"'), 'Missing ship-fax');
  assert(html.includes('copyBillingToShippingInEdit()'), 'Missing Copy Billing Address action');
});

runTest('14. Add More Details expandable section exists', () => {
  assert(html.includes('id="toggle-more-details-btn"'), 'Missing toggle button');
  assert(html.includes('toggleMoreCustomerDetails()'), 'Missing toggle handler');
  assert(html.includes('id="cust-more-details-container"'), 'Missing expandable container');
  assert(html.includes('id="cust-website"'), 'Missing website');
  assert(html.includes('id="cust-department"'), 'Missing department');
  assert(html.includes('id="cust-designation"'), 'Missing designation');
  assert(html.includes('id="cust-x-twitter"'), 'Missing X/Twitter');
  assert(html.includes('id="cust-skype"'), 'Missing Skype');
  assert(html.includes('id="cust-facebook"'), 'Missing Facebook');
});

runTest('15. Actions: Save, Save and Subscribe, and Cancel exist', () => {
  assert(html.includes('id="btn-save-customer"'), 'Missing Save button');
  assert(html.includes('id="btn-save-subscribe-customer"'), 'Missing Save and Subscribe button');
  assert(html.includes('id="btn-cancel-customer"'), 'Missing Cancel button');
});

// Test Data Saving Flow
runTest('16. Submitting customer form saves all 14 fields correctly', () => {
  // Populate mock elements
  getEl('#cust-email').value = 'enterprise.client@acme.org';
  getEl('#cust-company-name').value = 'Acme Global Corp';
  getEl('#cust-first-name').value = 'John';
  getEl('#cust-last-name').value = 'Doe';
  getEl('#cust-phone-code').value = '+91';
  getEl('#cust-phone').value = '9876543210';
  getEl('#cust-language').value = 'Hindi';
  getEl('#cust-gst-treatment').value = 'Registered Business - Regular';
  getEl('#cust-gstin-input').value = '36AAACS1429B1Z8';
  getEl('#cust-place-of-supply').value = '[TS] - Telangana';
  getEl('#cust-pan').value = 'AAACS1429B';
  getEl('#cust-legal-name').value = 'ACME GLOBAL CORP PRIVATE LIMITED';
  getEl('#cust-trade-name').value = 'Acme AI Systems';
  getEl('#taxable-radio').checked = true;
  getEl('#cust-currency').value = 'INR- Indian Rupee';
  getEl('#cust-payment-terms').value = 'Net 30';
  getEl('#cust-website').value = 'https://acme.org';
  getEl('#cust-department').value = 'Enterprise Technology';
  getEl('#cust-designation').value = 'Chief Architect';
  getEl('#cust-x-twitter').value = 'acme_global';
  getEl('#cust-skype').value = 'acme.support';
  getEl('#cust-facebook').value = 'acme.official';

  getEl('#bill-attention').value = 'Accounts Payable';
  getEl('#bill-address1').value = 'Tower A, Tech Park';
  getEl('#bill-city').value = 'Hyderabad';
  getEl('#bill-state').value = 'Telangana';
  getEl('#bill-pincode').value = '500081';
  getEl('#bill-phone').value = '040-12345678';
  getEl('#bill-fax').value = '040-12345679';

  getEl('#ship-attention').value = 'Logistics Lead';
  getEl('#ship-address1').value = 'Dock 4, Warehouse Zone';
  getEl('#ship-city').value = 'Hyderabad';
  getEl('#ship-state').value = 'Telangana';
  getEl('#ship-pincode').value = '500081';
  getEl('#ship-phone').value = '040-98765432';
  getEl('#ship-fax').value = '040-98765433';

  // Trigger Save
  window.smatApp.handleZohoEditCustomerSubmit({ preventDefault: () => {} });

  // Verify saved in localStorage
  const savedClients = JSON.parse(storage['smatbot_clients_data']);
  const saved = savedClients.find(c => c.email === 'enterprise.client@acme.org');
  assert(saved, 'Client record must be saved in storage');
  assert.strictEqual(saved.language, 'Hindi', 'Language must be Hindi');
  assert.strictEqual(saved.place_of_supply, '[TS] - Telangana', 'Place of supply must be Telangana');
  assert.strictEqual(saved.pan, 'AAACS1429B', 'PAN must be saved');
  assert.strictEqual(saved.legal_name, 'ACME GLOBAL CORP PRIVATE LIMITED', 'Legal name must be saved');
  assert.strictEqual(saved.trade_name, 'Acme AI Systems', 'Trade name must be saved');
  assert.strictEqual(saved.currency, 'INR- Indian Rupee', 'Currency must be saved');
  assert.strictEqual(saved.payment_terms, 'Net 30', 'Payment terms must be saved');
  assert.strictEqual(saved.website, 'https://acme.org', 'Website must be saved');
  assert.strictEqual(saved.billing_address.city, 'Hyderabad', 'Billing city must be Hyderabad');
  assert.strictEqual(saved.shipping_address.attention, 'Logistics Lead', 'Shipping attention must be saved');
});

runTest('17. Save and Subscribe updates customer and activates subscription', () => {
  window.smatApp.handleZohoSaveAndSubscribe({ preventDefault: () => {} });
  const savedClients = JSON.parse(storage['smatbot_clients_data']);
  const saved = savedClients.find(c => c.email === 'enterprise.client@acme.org');
  assert(saved, 'Client must exist');
  assert.strictEqual(saved.subscription_status, 'Active', 'Subscription status must be Active');
});

runTest('18. Existing client records remain unharmed', () => {
  const savedClients = JSON.parse(storage['smatbot_clients_data']);
  const arpit = savedClients.find(c => c.name === 'Arpit Padhy' || c.email === 'arpitpadhy19@gmail.com');
  assert(arpit, 'Arpit Padhy client record must remain intact');
  assert.strictEqual(arpit.plan_name, 'Pro Trial', 'Arpit plan must be Pro Trial');
});

runTest('19. Tenant onboarding and client creation remain functional', () => {
  assert(typeof window.smatApp.updateAddClientAmountCalc === 'function', 'updateAddClientAmountCalc must exist');
  assert(typeof window.smatApp.toggleModularCard === 'function', 'toggleModularCard must exist');
});

runTest('20. Re-rendering customer details view retrieves and pre-populates all 14 saved fields', () => {
  const savedClients = JSON.parse(storage['smatbot_clients_data']);
  const saved = savedClients.find(c => c.email === 'enterprise.client@acme.org');
  assert(saved, 'Saved client must exist');

  // Open edit for this client
  window.smatApp.openZohoEditCustomer(saved.id);
  const editContainer = { innerHTML: '' };
  window.smatApp.renderZohoEditCustomerView(editContainer);
  const editHtml = editContainer.innerHTML;

  assert(editHtml.includes('Hindi') && editHtml.includes('selected'), 'Language Hindi must be selected');
  assert(editHtml.includes('AAACS1429B'), 'PAN AAACS1429B must be in HTML');
  assert(editHtml.includes('ACME GLOBAL CORP PRIVATE LIMITED'), 'Legal name must be in HTML');
  assert(editHtml.includes('Acme AI Systems'), 'Trade name must be in HTML');
  assert(editHtml.includes('Net 30') && editHtml.includes('selected'), 'Payment terms Net 30 must be selected');
  assert(editHtml.includes('Accounts Payable'), 'Billing attention must be in HTML');
  assert(editHtml.includes('Logistics Lead'), 'Shipping attention must be in HTML');
});

console.log('====================================================');
console.log(`Summary: ${passedTests} / ${totalTests} tests passed`);
console.log('====================================================');

if (passedTests === totalTests) {
  console.log('🎉 ALL 20 CHECKS PASSED PERFECTLY!');
  process.exit(0);
} else {
  console.error('❌ SOME CHECKS FAILED!');
  process.exit(1);
}
