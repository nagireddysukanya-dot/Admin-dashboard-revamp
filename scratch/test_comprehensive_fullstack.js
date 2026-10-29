const http = require('http');

async function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({ statusCode: res.statusCode, headers: res.headers, body: json });
      });
    });
    req.on('error', (err) => reject(err));
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runBackendTests() {
  console.log('\n========================================');
  console.log('🧪 RUNNING BACKEND API TEST SUITE (18 ENDPOINTS)');
  console.log('========================================');

  let passed = 0;
  let failed = 0;

  function assert(testName, condition, detail = '') {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}: ${detail}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const health = await makeRequest({ host: 'localhost', port: 5000, path: '/api/health', method: 'GET' });
    assert('1. GET /api/health', health.statusCode === 200 && health.body.status === 'healthy');

    // 2. Auth Login
    const login = await makeRequest(
      { host: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { email: 'admin@smatbot.com', password: 'password123' }
    );
    assert('2. POST /api/auth/login with credentials', login.statusCode === 200 && login.body.success && login.body.token);

    // 3. Auth Me
    const authMe = await makeRequest({ host: 'localhost', port: 5000, path: '/api/auth/me', method: 'GET' });
    assert('3. GET /api/auth/me', authMe.statusCode === 200 && authMe.body.success && authMe.body.user);

    // 4. Clients List
    const clients = await makeRequest({ host: 'localhost', port: 5000, path: '/api/clients', method: 'GET' });
    assert('4. GET /api/clients', clients.statusCode === 200 && clients.body.success && Array.isArray(clients.body.clients) && clients.body.totalCount > 0);

    // 5. Clients Filter by search
    const clientSearch = await makeRequest({ host: 'localhost', port: 5000, path: '/api/clients?search=Arpit', method: 'GET' });
    assert('5. GET /api/clients?search=Arpit', clientSearch.statusCode === 200 && clientSearch.body.clients.some(c => c.name.includes('Arpit')));

    // 6. Clients Filter by customer type
    const clientTypeFilter = await makeRequest({ host: 'localhost', port: 5000, path: '/api/clients?customerTypes=Direct', method: 'GET' });
    assert('6. GET /api/clients?customerTypes=Direct', clientTypeFilter.statusCode === 200 && clientTypeFilter.body.clients.length > 0);

    // 7. Client by ID
    const singleClient = await makeRequest({ host: 'localhost', port: 5000, path: '/api/clients/1', method: 'GET' });
    assert('7. GET /api/clients/1', singleClient.statusCode === 200 && singleClient.body.success && singleClient.body.client.id === 1);

    // 8. Client Create
    const newClientPayload = {
      name: 'Fullstack Test Client',
      email: 'test_client_' + Date.now() + '@smatbot.com',
      phone_number: '+91-9988776655',
      customer_type: 'Direct'
    };
    const createClient = await makeRequest(
      { host: 'localhost', port: 5000, path: '/api/clients', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      newClientPayload
    );
    assert('8. POST /api/clients (create client)', createClient.statusCode === 201 && createClient.body.success && createClient.body.client.name === newClientPayload.name);
    const createdClientId = createClient.body.client?.id;

    // 9. Client Update
    if (createdClientId) {
      const updateClient = await makeRequest(
        { host: 'localhost', port: 5000, path: `/api/clients/${createdClientId}`, method: 'PUT', headers: { 'Content-Type': 'application/json' } },
        { name: 'Fullstack Test Client (Updated)' }
      );
      assert('9. PUT /api/clients/:id', updateClient.statusCode === 200 && updateClient.body.success && updateClient.body.client.name.includes('Updated'));
    }

    // 10. Impersonate Client
    const impersonate = await makeRequest(
      { host: 'localhost', port: 5000, path: '/api/clients/1/impersonate', method: 'POST' }
    );
    assert('10. POST /api/clients/1/impersonate', impersonate.statusCode === 200 && impersonate.body.success && impersonate.body.impersonationToken);

    // 11. GSTIN Live Verification API
    const gstinCheck = await makeRequest({ host: 'localhost', port: 5000, path: '/api/clients/gstin/36AAACS1429B1Z8', method: 'GET' });
    assert('11. GET /api/clients/gstin/36AAACS1429B1Z8', gstinCheck.statusCode === 200 && gstinCheck.body.success && gstinCheck.body.profile.legal_name.includes('SMATBOT'));

    // 12. Bot Migrations List
    const botMigrations = await makeRequest({ host: 'localhost', port: 5000, path: '/api/bots/migrations', method: 'GET' });
    assert('12. GET /api/bots/migrations', botMigrations.statusCode === 200 && botMigrations.body.success && Array.isArray(botMigrations.body.migrations));

    // 13. Bot Migration Execute
    const migrateExec = await makeRequest(
      { host: 'localhost', port: 5000, path: '/api/bots/migrate', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { sourceClientId: 1, targetClientId: 2, botName: 'Fullstack Test Bot' }
    );
    assert('13. POST /api/bots/migrate', migrateExec.statusCode === 201 && migrateExec.body.success && migrateExec.body.migration);
    const migId = migrateExec.body.migration?.id;

    // 14. Bot Migration Rollback
    if (migId) {
      const rollback = await makeRequest(
        { host: 'localhost', port: 5000, path: `/api/bots/migrations/${migId}/rollback`, method: 'POST' }
      );
      assert('14. POST /api/bots/migrations/:id/rollback', rollback.statusCode === 200 && rollback.body.success && rollback.body.migration.status === 'Rolled Back');
    }

    // 15. Users List
    const users = await makeRequest({ host: 'localhost', port: 5000, path: '/api/users', method: 'GET' });
    assert('15. GET /api/users', users.statusCode === 200 && users.body.success && users.body.users.length > 0);

    // 16. Plans Definitions
    const plans = await makeRequest({ host: 'localhost', port: 5000, path: '/api/plans', method: 'GET' });
    assert('16. GET /api/plans', plans.statusCode === 200 && plans.body.success && plans.body.plans.length >= 4);

    // 17. Plans Calculate Price
    const calcPrice = await makeRequest(
      { host: 'localhost', port: 5000, path: '/api/plans/calculate-price', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { planName: 'Pro', durationMonths: 12, currency: 'INR' }
    );
    assert('17. POST /api/plans/calculate-price', calcPrice.statusCode === 200 && calcPrice.body.success && calcPrice.body.grandTotal > 0);

    // 18. Plans Autopay Toggle
    const autopay = await makeRequest(
      { host: 'localhost', port: 5000, path: '/api/plans/autopay-toggle', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { clientId: 1, enableAutoPay: true }
    );
    assert('18. POST /api/plans/autopay-toggle', autopay.statusCode === 200 && autopay.body.success);

  } catch (err) {
    console.error('Fatal backend test error:', err);
    failed++;
  }

  console.log(`Backend Tests Summary: ${passed} Passed, ${failed} Failed`);
  return failed === 0;
}

function runFrontendTests() {
  console.log('\n========================================');
  console.log('🖥️  RUNNING FRONTEND VIEW & ROUTING SUITE');
  console.log('========================================');

  let passed = 0;
  let failed = 0;

  function assert(testName, condition, detail = '') {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}: ${detail}`);
      failed++;
    }
  }

  // Setup Browser/DOM Simulation
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
        { value: '[TS] - Telangana', text: '[TS] - Telangana' },
        { value: '[AP] - Andhra Pradesh', text: '[AP] - Andhra Pradesh' },
        { value: 'Hyderabad', text: 'Hyderabad' },
        { value: 'Telangana', text: 'Telangana' }
      ],
      getAttribute: (a) => (a === 'data-tab' ? 'other-details' : ''),
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

  // Initialize frontend app state
  window.smatApp.init();

  // Test 1: Navigation to 'overview'
  try {
    window.smatApp.navigateTo('overview', false);
    assert('1. navigateTo("overview") renders Operations Command Center', viewportEl.innerHTML.includes('command-center-container'));
  } catch (e) {
    assert('1. navigateTo("overview")', false, e.message);
  }

  // Test 2: Navigation to 'client-details'
  try {
    window.smatApp.navigateTo('client-details', false);
    assert('2. navigateTo("client-details") renders Client Details Directory', viewportEl.innerHTML.includes('client-data-table') || viewportEl.innerHTML.includes('client-details-collapsible-panel'));
  } catch (e) {
    assert('2. navigateTo("client-details")', false, e.message);
  }

  // Test 3: Navigation to 'client-details-profile'
  try {
    window.smatApp.navigateTo('client-details-profile', false);
    assert('3. navigateTo("client-details-profile") renders client profile', viewportEl.innerHTML.includes('client-profile') || viewportEl.innerHTML.includes('modular-card') || viewportEl.innerHTML.includes('Client Details Profile'));
  } catch (e) {
    assert('3. navigateTo("client-details-profile")', false, e.message);
  }

  // Test 4: Navigation to 'impersonation'
  try {
    window.smatApp.navigateTo('impersonation', false);
    assert('4. navigateTo("impersonation") renders Impersonation Console', viewportEl.innerHTML.includes('impersonation') || viewportEl.innerHTML.includes('Console'));
  } catch (e) {
    assert('4. navigateTo("impersonation")', false, e.message);
  }

  // Test 5: Navigation to 'chatbots'
  try {
    window.smatApp.navigateTo('chatbots', false);
    assert('5. navigateTo("chatbots") renders Bot Migration Engine', viewportEl.innerHTML.includes('Bot Migration') || viewportEl.innerHTML.includes('chatbot'));
  } catch (e) {
    assert('5. navigateTo("chatbots")', false, e.message);
  }

  // Test 6: Navigation to 'users'
  try {
    window.smatApp.navigateTo('users', false);
    assert('6. navigateTo("users") renders Team & RBAC Management', viewportEl.innerHTML.includes('Team') || viewportEl.innerHTML.includes('User'));
  } catch (e) {
    assert('6. navigateTo("users")', false, e.message);
  }

  // Test 7: Navigation to 'subscriptions'
  try {
    window.smatApp.navigateTo('subscriptions', false);
    assert('7. navigateTo("subscriptions") renders Active Client Subscriptions', viewportEl.innerHTML.includes('Active Client Subscriptions') || viewportEl.innerHTML.includes('subscriptions-container'));
  } catch (e) {
    assert('7. navigateTo("subscriptions")', false, e.message);
  }

  // Test 8: Navigation to 'renewals'
  try {
    window.smatApp.navigateTo('renewals', false);
    assert('8. navigateTo("renewals") renders Subscription Renewals', viewportEl.innerHTML.includes('Renewals') || viewportEl.innerHTML.includes('renewals'));
  } catch (e) {
    assert('8. navigateTo("renewals")', false, e.message);
  }

  // Test 9: Navigation to 'partners'
  try {
    window.smatApp.navigateTo('partners', false);
    assert('9. navigateTo("partners") renders Channel Partners', viewportEl.innerHTML.includes('Partners') || viewportEl.innerHTML.includes('Agency'));
  } catch (e) {
    assert('9. navigateTo("partners")', false, e.message);
  }

  // Test 10: Navigation to 'coupons'
  try {
    window.smatApp.navigateTo('coupons', false);
    assert('10. navigateTo("coupons") renders Coupons & Vouchers', viewportEl.innerHTML.includes('Coupons') || viewportEl.innerHTML.includes('Discount'));
  } catch (e) {
    assert('10. navigateTo("coupons")', false, e.message);
  }

  // Test 11: Navigation to 'edit-customer' (All User-Specified Features Verified)
  try {
    window.smatApp.navigateTo('edit-customer', false);
    const html = viewportEl.innerHTML;

    assert('11a. Edit Customer has "Other Details" tab', html.includes('Other Details'));
    assert('11b. Edit Customer has "Address" tab', html.includes('Address'));
    assert('11c. Edit Customer DOES NOT have "Contact Persons" tab', !html.includes('Contact Persons'));
    assert('11d. Edit Customer DOES NOT have "Custom Fields*" tab', !html.includes('Custom Fields*'));
    assert('11e. Edit Customer DOES NOT have "Remarks" tab', !html.includes('Remarks (For Internal Use)'));
    assert('11f. Edit Customer DOES NOT have "All changes are validated and synced..." text', !html.includes('All changes are validated and synced with Zoho Billing API'));
    assert('11g. Edit Customer has Save button', html.includes('id="btn-save-customer"'));
    assert('11h. Edit Customer has Save and Subscribe button', html.includes('id="btn-save-subscribe-customer"'));
    assert('11i. Edit Customer has Cancel button', html.includes('id="btn-cancel-customer"'));
    assert('11j. Edit Customer Address Learn More redirects to Zoho bulk-update-address URL', html.includes('href="https://www.zoho.com/in/billing/kb/customers/bulk-update-address.html" target="_blank"'));
    assert('11k. Edit Customer has GSTIN prefill popover with Title & Fetch button', html.includes('id="gst-prefill-popover"') && html.includes('Prefill Customer Details From the GST Portal'));
  } catch (e) {
    assert('11. navigateTo("edit-customer")', false, e.message);
  }

  // Test 12: Interactive Phone Duplicate Detection
  try {
    const isDup1 = window.smatApp.checkPhoneDuplicates('9705736759');
    const isDup2 = window.smatApp.checkPhoneDuplicates('8591876630');
    assert('12a. Phone duplicate detection correctly identifies duplicate number 9705736759', isDup1 === true);
    assert('12b. Phone duplicate detection correctly identifies unique number 8591876630', isDup2 === false);
  } catch (e) {
    assert('12. Phone duplicate detection', false, e.message);
  }

  // Test 13: Expandable More Details Toggle
  try {
    window.smatApp.toggleMoreCustomerDetails();
    assert('13. toggleMoreCustomerDetails executes cleanly', true);
  } catch (e) {
    assert('13. toggleMoreCustomerDetails', false, e.message);
  }

  // Test 14: Tab switching between Other Details and Address
  try {
    window.smatApp.setZohoEditTab('address');
    window.smatApp.setZohoEditTab('other-details');
    assert('14. setZohoEditTab switches between valid tabs cleanly', true);
  } catch (e) {
    assert('14. setZohoEditTab', false, e.message);
  }

  console.log(`Frontend Tests Summary: ${passed} Passed, ${failed} Failed`);
  return failed === 0;
}

async function main() {
  const beOk = await runBackendTests();
  const feOk = runFrontendTests();

  console.log('\n========================================');
  console.log('🏁 FINAL E2E FULLSTACK TEST REPORT');
  console.log('========================================');
  if (beOk && feOk) {
    console.log('🎉 100% OF ALL BACKEND APIS & ALL FRONTEND VIEWS/FEATURES PASSED WITHOUT ANY ISSUES!');
  } else {
    console.error('⚠️ Some tests failed. Please inspect the logs above.');
    process.exit(1);
  }
}

main();
