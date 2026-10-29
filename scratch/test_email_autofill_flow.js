const storage = {
  smatbot_clients_data: JSON.stringify([
    {
      id: 1,
      name: 'Arpit Padhy',
      email: 'arpitpadhy19@gmail.com',
      company_name: 'Arpit Technologies',
      phone_number: '+91-8591876630',
      zoho_customer_id: 'ZC-901820',
      gst_number: '36AACCF6679F1ZD',
      billing_address: {
        attention: 'Arpit Padhy',
        line1: '2nd Floor, Ashoka HiTech Chambers',
        line2: 'Road No. 2, opp. KBR Park',
        city: 'Hyderabad',
        state: 'Telangana',
        pin: '500034',
        phone: '+91-8591876630'
      }
    },
    {
      id: 2,
      name: 'Balaji',
      email: 'balaji@smatbot.com',
      company_name: 'smatbot',
      phone_number: '+91-9705736759',
      zoho_customer_id: 'ZC-566987',
      gst_number: '36AACCF6679F1ZD'
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
      className: ''
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

console.log('--- TEST SUITE: EMAIL-FIRST AUTO-FILL & FIELD CLEARING ON NEW EMAIL ---');

// Test 1: Verify onEmailInputChange is exposed
console.log('1. onEmailInputChange function export:');
console.log('   - window.smatApp.onEmailInputChange exists:', typeof window.smatApp.onEmailInputChange === 'function');
console.log('   - window.smatApp.clearZohoCustomerFormFields exists:', typeof window.smatApp.clearZohoCustomerFormFields === 'function');

// Test 2: Enter existing client email (arpitpadhy19@gmail.com)
console.log('2. Entering existing email "arpitpadhy19@gmail.com":');
window.smatApp.onEmailInputChange('arpitpadhy19@gmail.com');

const firstNameEl = getEl('#cust-first-name');
const lastNameEl = getEl('#cust-last-name');
const companyEl = getEl('#cust-company-name');
const phoneEl = getEl('#cust-phone');
const badgeEl = getEl('#cust-email-badge');
const chipEl = getEl('.badge-cust-chip');

console.log('   - First Name auto-filled:', firstNameEl.value);
console.log('   - Last Name auto-filled:', lastNameEl.value);
console.log('   - Company Name auto-filled:', companyEl.value);
console.log('   - Phone auto-filled:', phoneEl.value);
console.log('   - Header chip updated:', chipEl.textContent);
console.log('   - Auto-fill badge HTML:', badgeEl.innerHTML);
console.log('   - Auto-fill badge displayed:', badgeEl.style.display);

if (firstNameEl.value !== 'Arpit' || lastNameEl.value !== 'Padhy') {
  console.error('❌ Existing client auto-fill failed!');
  process.exit(1);
}

// Test 3: Enter new unknown email -> ALL FIELDS BELOW MUST BE CLEARED!
console.log('3. Entering new/unknown email "newclient@example.com":');
window.smatApp.onEmailInputChange('newclient@example.com');
console.log('   - Badge for new client:', badgeEl.innerHTML);
console.log('   - First Name after new email (must be empty):', JSON.stringify(firstNameEl.value));
console.log('   - Last Name after new email (must be empty):', JSON.stringify(lastNameEl.value));
console.log('   - Company Name after new email (must be empty):', JSON.stringify(companyEl.value));
console.log('   - Phone after new email (must be empty):', JSON.stringify(phoneEl.value));
console.log('   - Header chip after new email:', chipEl.textContent);

if (firstNameEl.value !== '' || lastNameEl.value !== '' || companyEl.value !== '' || phoneEl.value !== '') {
  console.error('❌ Fields were NOT cleared when entering new client email!');
  process.exit(1);
}

// Test 4: Verify render HTML layout order and clean initial state
const mount = getEl('#mount');
window.smatApp.renderZohoEditCustomerView(mount);
const html = mount.innerHTML;
const emailIdx = html.indexOf('id="cust-email"');
const primaryContactIdx = html.indexOf('id="cust-first-name"');
const displayNameIdx = html.indexOf('id="cust-display-name-select"');

console.log('4. HTML layout order verification:');
console.log('   - Email input index:', emailIdx);
console.log('   - Primary Contact index:', primaryContactIdx);
console.log('   - Display Name index:', displayNameIdx);
console.log('   - Is Email FIRST before Primary Contact and Display Name?', emailIdx < primaryContactIdx && emailIdx < displayNameIdx);

// Check that initial render without explicit clientId doesn't force Arpit Padhy or Balaji defaults
const hasNoForcedDefaultName = !html.includes('value="Balaji"') && !html.includes('value="Arpit"');
console.log('   - Fresh page load has NO forced default client name:', hasNoForcedDefaultName);

if (emailIdx < primaryContactIdx && emailIdx < displayNameIdx && hasNoForcedDefaultName) {
  console.log('\n🎉 ALL EMAIL AUTO-FILL & NEW CLIENT CLEARING TESTS PASSED 100%!');
} else {
  console.error('\n❌ Layout order or initial clean state check failed!');
  process.exit(1);
}
