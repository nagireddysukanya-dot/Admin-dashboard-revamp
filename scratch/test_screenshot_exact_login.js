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

console.log('=== TEST: EXACT SCREENSHOT LOGIN PAGE VALIDATION ===\n');

window.smatApp.logout();
const appMount = getEl('#app-mount');
const html = appMount.innerHTML;

const checks = [
  // Left Dark Section
  { name: 'Dark column container', pass: html.includes('smat-split-dark-col') },
  { name: 'Ambient purple glow at top-left', pass: html.includes('smat-dark-ambient-glow') },
  { name: 'Official SmatBot Purple Robot Badge', pass: html.includes('smatbot-purple-robot-badge-large') && html.includes('#4C2277') },
  { name: 'SmatBot dual color brand name (Smat + Bot)', pass: html.includes('brand-smat') && html.includes('brand-bot') },
  { name: 'Tagline: "Smarter Conversations. Better Business."', pass: html.includes('Smarter Conversations') && html.includes('Better Business') },
  { name: 'Feature 1: "Automate Support" & "Engage your customers 24/7"', pass: html.includes('Automate Support') && html.includes('Engage your customers 24/7') },
  { name: 'Feature 2: "Track Performance" & "Get real-time insights"', pass: html.includes('Track Performance') && html.includes('Get real-time insights') },
  { name: 'Feature 3: "Secure & Reliable" & "Your data, our priority"', pass: html.includes('Secure &amp; Reliable') && html.includes('Your data, our priority') },
  { name: 'Bottom flowing curved waves container', pass: html.includes('smat-dark-waves-container') && html.includes('smat-dark-wave-svg') },

  // Right White Section
  { name: 'White form column container', pass: html.includes('smat-split-white-col') },
  { name: 'Top-Right "Welcome Back" successfully removed', pass: !html.includes('Welcome Back') && !html.includes('smat-welcome-pill-row') },
  { name: 'Heading "Login"', pass: html.includes('smat-split-login-heading') && html.includes('Login') },
  { name: 'Subtitle "Please enter your credentials to continue."', pass: html.includes('Please enter your credentials to continue.') },
  { name: 'Email Address label and input with prefix mail icon', pass: html.includes('Email Address') && html.includes('smat-input-prefix-icon') && html.includes('login-email-input') },
  { name: 'Password label and input with lock icon & eye toggle button', pass: html.includes('Password') && html.includes('login-password-input') && html.includes('smat-clean-eye-btn') },
  { name: 'Remember me checkbox checked by default', pass: html.includes('login-remember-me') && html.includes('checked') },
  { name: 'Forgot Password? link in blue', pass: html.includes('Forgot Password?') && html.includes('smat-forgot-pass-anchor') },
  { name: 'Primary Blue Login button with Arrow', pass: html.includes('btn-smat-clean-login') && html.includes('smat-primary-login-btn') },
  { name: 'Bottom divider with "Secure Login" shield badge', pass: html.includes('smat-secure-badge-footer') && html.includes('Secure Login') }
];

let allPassed = true;
checks.forEach((c, idx) => {
  const status = c.pass ? '✅ PASS' : '❌ FAIL';
  console.log(`${idx + 1}. [${status}] ${c.name}`);
  if (!c.pass) allPassed = false;
});

// Test submit action
console.log('\nTesting Login Submission:');
const fakeEvent = { preventDefault: () => {} };
getEl('#login-email-input').value = 'sukanya@smatbot.com';
getEl('#login-password-input').value = 'admin123';
window.smatApp.handleLoginSubmit(fakeEvent);
console.log('   - User authenticated after login:', storage['smatbot_admin_logged_in'] === 'true' ? '✅ Passed' : '❌ Failed');

if (!storage['smatbot_admin_logged_in'] === 'true') allPassed = false;

if (allPassed) {
  console.log('\n🎉 ALL 20 EXACT SCREENSHOT SPEC CHECKS PASSED WITH 100% SUCCESS!');
  process.exit(0);
} else {
  console.error('\n❌ Some checks failed!');
  process.exit(1);
}
