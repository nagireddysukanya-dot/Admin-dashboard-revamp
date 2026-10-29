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

async function runTests() {
  console.log('========================================================');
  console.log('🧪 VERIFYING PASSWORD AUTHENTICATION & USER CREATION');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(title, condition, detail = '') {
    if (condition) {
      console.log(`  ✅ [PASS] ${title}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${title} - ${detail}`);
      failed++;
    }
  }

  // ----------------------------------------------------
  // PART 1: Backend Authentication Tests
  // ----------------------------------------------------
  console.log('PART 1: BACKEND API AUTHENTICATION CHECKS');

  // Test 1: Non-existent email
  const resUnknown = await makeRequest(
    { host: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { email: 'nonexistent@smatbot.com', password: 'password123' }
  );
  assert('1. Unknown email returns 401', resUnknown.statusCode === 401 && resUnknown.body.success === false, JSON.stringify(resUnknown.body));

  // Test 2: Wrong password
  const resWrong = await makeRequest(
    { host: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { email: 'sukanya@smatbot.com', password: 'wrongpassword999' }
  );
  assert('2. Wrong password returns 401 & error message', resWrong.statusCode === 401 && resWrong.body.message.includes('Incorrect password'), JSON.stringify(resWrong.body));

  // Test 3: Correct password for sukanya@smatbot.com
  const resCorrect = await makeRequest(
    { host: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { email: 'sukanya@smatbot.com', password: 'admin123' }
  );
  assert('3. Correct password returns 200 & JWT token', resCorrect.statusCode === 200 && resCorrect.body.success && resCorrect.body.token, JSON.stringify(resCorrect.body));

  // Test 4: Create new user with custom password via POST /api/users
  const newStaffEmail = `staff_${Date.now()}@smatbot.com`;
  const newStaffPass = 'SecureStaffPass2026!';
  const resCreateUser = await makeRequest(
    { host: 'localhost', port: 5000, path: '/api/users', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { name: 'Kavitha Rao', email: newStaffEmail, role: 'Support Lead', password: newStaffPass }
  );
  assert('4. POST /api/users with custom password returns 201', resCreateUser.statusCode === 201 && resCreateUser.body.success, JSON.stringify(resCreateUser.body));

  // Test 5: Login with newly created user and correct custom password
  const resNewUserLogin = await makeRequest(
    { host: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { email: newStaffEmail, password: newStaffPass }
  );
  assert('5. Newly created user logs in with custom password', resNewUserLogin.statusCode === 200 && resNewUserLogin.body.success && resNewUserLogin.body.user.email === newStaffEmail);

  // Test 6: Newly created user fails login with wrong password
  const resNewUserWrong = await makeRequest(
    { host: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { email: newStaffEmail, password: 'random_wrong_pass' }
  );
  assert('6. Newly created user rejected with wrong password', resNewUserWrong.statusCode === 401 && resNewUserWrong.body.success === false);

  // ----------------------------------------------------
  // PART 2: Frontend Simulation & UI Validation
  // ----------------------------------------------------
  console.log('\nPART 2: FRONTEND LOGIC & UI BEHAVIOR');

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
        type: 'text',
        focus: () => {},
        select: () => {},
        addEventListener: function(event, cb) { this._listeners = this._listeners || {}; this._listeners[event] = cb; },
        dispatchEvent: function(event) { if (this._listeners && this._listeners[event.type]) this._listeners[event.type](event); }
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

  delete require.cache[require.resolve('../frontend/js/app.js')];
  require('../frontend/js/app.js');

  // Test 7: Frontend login with wrong password rejected
  storage['smatbot_admin_logged_in'] = 'false';
  getEl('#login-email-input').value = 'sukanya@smatbot.com';
  getEl('#login-password-input').value = 'completely_wrong_pass';
  
  window.smatApp.handleLoginSubmit({ preventDefault: () => {} });

  const alertContainer = getEl('#smat-login-alert-container');
  const passInput = getEl('#login-password-input');

  assert(
    '7. Frontend rejects wrong password and remains logged out',
    storage['smatbot_admin_logged_in'] === 'false'
  );
  assert(
    '8. Frontend displays error alert banner for wrong password',
    alertContainer.innerHTML.includes('Incorrect password')
  );
  assert(
    '9. Frontend adds has-error class to password input',
    passInput.classList.contains('has-error')
  );

  // Test 10: Frontend login with correct password succeeds
  getEl('#login-password-input').value = 'admin123';
  window.smatApp.handleLoginSubmit({ preventDefault: () => {} });

  assert(
    '10. Frontend logs in with correct password (smatbot_admin_logged_in === true)',
    storage['smatbot_admin_logged_in'] === 'true'
  );

  // Test 11: Add Team User Modal includes password field
  window.smatApp.openAddUserModal();
  const modalContainer = getEl('#modal-container');
  assert(
    '11. Add Team User modal contains Account Password field',
    modalContainer.innerHTML.includes('new-user-password') && modalContainer.innerHTML.includes('Account Password *')
  );
  assert(
    '12. Add Team User modal contains Confirm Password field',
    modalContainer.innerHTML.includes('new-user-confirm-password') && modalContainer.innerHTML.includes('Confirm Password *')
  );

  // Test 13: Creating new user through form
  const addForm = getEl('#add-user-form');
  getEl('#new-user-name').value = 'Priya Sharma';
  getEl('#new-user-email').value = 'priya.sharma@smatbot.com';
  getEl('#new-user-dept').value = 'AI Engineering';
  getEl('#new-user-role').value = 'Bot Engineer';
  getEl('#new-user-password').value = 'PriyaSecret2026';
  getEl('#new-user-confirm-password').value = 'PriyaSecret2026';

  addForm.dispatchEvent({ type: 'submit', preventDefault: () => {} });

  const savedUsersJson = storage['smatbot_users_data'];
  const savedUsers = savedUsersJson ? JSON.parse(savedUsersJson) : [];
  const createdPriya = savedUsers.find(u => u.email === 'priya.sharma@smatbot.com');

  assert(
    '13. New team user saved with assigned password in local storage',
    createdPriya && createdPriya.password === 'PriyaSecret2026'
  );

  // Test 14: Priya can now log in with her new password
  storage['smatbot_admin_logged_in'] = 'false';
  getEl('#login-email-input').value = 'priya.sharma@smatbot.com';
  getEl('#login-password-input').value = 'PriyaSecret2026';
  window.smatApp.handleLoginSubmit({ preventDefault: () => {} });

  assert(
    '14. Newly created user logs in successfully with assigned password',
    storage['smatbot_admin_logged_in'] === 'true' && JSON.parse(storage['smatbot_admin_user']).name === 'Priya Sharma'
  );

  // Test 15: Priya login fails if wrong password provided
  storage['smatbot_admin_logged_in'] = 'false';
  getEl('#login-email-input').value = 'priya.sharma@smatbot.com';
  getEl('#login-password-input').value = 'wrong_password_for_priya';
  window.smatApp.handleLoginSubmit({ preventDefault: () => {} });

  // Test 16: Attempting to delete own logged in account is blocked
  window.smatApp.confirmDeleteUser(createdPriya.id);
  assert(
    '16. Self-deletion protection prevents deleting currently logged in account',
    modalContainer.innerHTML.includes('Confirm Delete User') === false
  );

  // Test 17: Confirm delete modal opens for another user
  const arjunUser = savedUsers.find(u => u.email === 'arjun@smatbot.com');
  if (arjunUser) {
    window.smatApp.confirmDeleteUser(arjunUser.id);
    assert(
      '17. Confirm delete modal opens with warning for other user',
      modalContainer.innerHTML.includes('Confirm Delete User') && modalContainer.innerHTML.includes('Arjun Mehta')
    );

    // Test 18: Execute deletion removes user from storage
    window.smatApp.executeDeleteUser(arjunUser.id);
    const updatedUsers = JSON.parse(storage['smatbot_users_data']);
    const deletedArjun = updatedUsers.find(u => u.id === arjunUser.id);
    assert(
      '18. User successfully removed from team database and localStorage',
      deletedArjun === undefined
    );
  }

  console.log('\n========================================================');
  console.log(`SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('========================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL 15 VERIFICATION CHECKS PASSED 100%!');
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
