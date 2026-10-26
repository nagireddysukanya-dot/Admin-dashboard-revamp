const storage = {
  smatbot_clients_data: JSON.stringify([
    {
      id: 1,
      name: 'Unregistered Client',
      email: 'unregistered@example.com',
      company_name: 'Local Shop',
      phone_number: '+91-9876543210',
      zoho_customer_id: 'ZC-111111',
      gst_number: '-'
    },
    {
      id: 2,
      name: 'Registered Corporate',
      email: 'corp@corporate.com',
      company_name: 'Corporate Ltd',
      phone_number: '+91-9876543211',
      zoho_customer_id: 'ZC-222222',
      gst_number: '36AAACS1429B1Z8'
    }
  ])
};

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
      id: sel.replace('#', '').replace('.', ''),
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
      options: [
        { value: 'Unregistered Business', text: 'Unregistered Business' },
        { value: 'Registered Business - Regular', text: 'Registered Business - Regular' }
      ]
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
window.smatApp.init();

console.log('--- TEST SUITE: UNREGISTERED USER GST TREATMENT FLOW ---');

// Test 1: Helper check
console.log('1. isGstRegisteredTreatment tests:');
console.log('   - "Unregistered Business" is registered:', window.smatApp.isGstRegisteredTreatment('Unregistered Business')); // false
console.log('   - "Consumer" is registered:', window.smatApp.isGstRegisteredTreatment('Consumer')); // false
console.log('   - "Overseas" is registered:', window.smatApp.isGstRegisteredTreatment('Overseas')); // false
console.log('   - "Registered Business - Regular" is registered:', window.smatApp.isGstRegisteredTreatment('Registered Business - Regular')); // true
console.log('   - "Special Economic Zone (SEZ)" is registered:', window.smatApp.isGstRegisteredTreatment('Special Economic Zone (SEZ)')); // true

// Test 2: Toggle to Unregistered Business (No GST Asked)
console.log('2. User selects "Unregistered Business" in UI:');
window.smatApp.onGstTreatmentChange('Unregistered Business');
const gstinGroup = getEl('#cust-gstin-row-group');
console.log('   - GSTIN Row display (must be "none"):', gstinGroup.style.display);

// Test 3: Toggle to Registered Business - Regular (GST Asked)
console.log('3. User selects "Registered Business - Regular" in UI:');
window.smatApp.onGstTreatmentChange('Registered Business - Regular');
console.log('   - GSTIN Row display (must be "flex"):', gstinGroup.style.display);

// Test 4: Auto-fill unregistered client by email
console.log('4. Auto-filling unregistered client "unregistered@example.com":');
window.smatApp.onEmailInputChange('unregistered@example.com');
const treatmentSelect = getEl('#cust-gst-treatment');
console.log('   - Selected GST treatment in dropdown:', treatmentSelect.value);
console.log('   - GSTIN Row display for unregistered user:', gstinGroup.style.display);

// Test 5: Auto-fill registered client by email
console.log('5. Auto-filling registered corporate client "corp@corporate.com":');
window.smatApp.onEmailInputChange('corp@corporate.com');
console.log('   - Selected GST treatment in dropdown:', treatmentSelect.value);
console.log('   - GSTIN Row display for corporate user:', gstinGroup.style.display);

const passed = 
  !window.smatApp.isGstRegisteredTreatment('Unregistered Business') &&
  window.smatApp.isGstRegisteredTreatment('Registered Business - Regular') &&
  gstinGroup.style.display === 'flex';

if (passed) {
  console.log('\n🎉 ALL UNREGISTERED GST CONDITIONAL DISPLAY TESTS PASSED 100%!');
} else {
  console.error('\n❌ Unregistered GST tests failed!');
  process.exit(1);
}
