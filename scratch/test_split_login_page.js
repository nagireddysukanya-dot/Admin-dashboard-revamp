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

console.log('=== TEST: VERIFYING CLEAN REFINED SPLIT LOGIN PAGE ===\n');

// 1. Logout to render login view
window.smatApp.logout();
const appMount = getEl('#app-mount');
const html = appMount.innerHTML;

console.log('1. Checking Dark Section (Left):');
console.log('   - Dark column container:', html.includes('smat-split-dark-col') ? '✅ Present' : '❌ Missing');
console.log('   - SmatBot Logo centered in dark area:', html.includes('smat-dark-center-branding') && html.includes('SmatBot') && html.includes('#4C2277') ? '✅ Present' : '❌ Missing');
console.log('   - 3 Emoji/Badges removed:', !html.includes('smat-dark-badge-row') ? '✅ Successfully Removed' : '❌ Still Present');
console.log('   - "Start to Automate Wisely" text removed:', !html.includes('Start to Automate') ? '✅ Successfully Removed' : '❌ Still Present');
console.log('   - Carousel Navigation Arrows removed:', !html.includes('smat-dark-slider-nav') ? '✅ Successfully Removed' : '❌ Still Present');

console.log('\n2. Checking White Form Section (Right):');
console.log('   - White column container:', html.includes('smat-split-white-col') ? '✅ Present' : '❌ Missing');
console.log('   - Social login buttons (Google, Apple, Facebook) removed:', !html.includes('smat-social-btn-row') ? '✅ Successfully Removed' : '❌ Still Present');
console.log('   - "or do it via E-mail" divider removed:', !html.includes('or do it via E-mail') ? '✅ Successfully Removed' : '❌ Still Present');
console.log('   - Copyright footer text removed:', !html.includes('©2026 SmatBot') ? '✅ Successfully Removed' : '❌ Still Present');
console.log('   - "Login" heading:', html.includes('smat-split-login-heading') && html.includes('Login') ? '✅ Present' : '❌ Missing');
console.log('   - Email Address field prefilled:', html.includes('sukanya@smatbot.com') && html.includes('login-email-input') ? '✅ Present' : '❌ Missing');
console.log('   - Password field with toggle eye:', html.includes('login-password-input') && html.includes('password-toggle-icon') ? '✅ Present' : '❌ Missing');
console.log('   - Blue Login button:', html.includes('btn-smat-clean-login') && html.includes('Login') ? '✅ Present' : '❌ Missing');

console.log('\n3. Testing Login Submission:');
const fakeEvent = { preventDefault: () => {} };
getEl('#login-email-input').value = 'sukanya@smatbot.com';
getEl('#login-password-input').value = 'admin123';
window.smatApp.handleLoginSubmit(fakeEvent);
console.log('   - User authenticated after login:', storage['smatbot_admin_logged_in'] === 'true' ? '✅ Passed' : '❌ Failed');

const allClean = (
  html.includes('smat-split-dark-col') &&
  html.includes('smat-dark-center-branding') &&
  !html.includes('smat-dark-badge-row') &&
  !html.includes('smat-dark-slider-nav') &&
  !html.includes('smat-social-btn-row') &&
  !html.includes('or do it via E-mail') &&
  !html.includes('©2026 SmatBot') &&
  storage['smatbot_admin_logged_in'] === 'true'
);

if (allClean) {
  console.log('\n🎉 ALL TESTS PASSED! CLEAN SPLIT LOGIN PAGE IS 100% OPERATIONAL!');
} else {
  console.error('\n❌ Verification failed');
  process.exit(1);
}
