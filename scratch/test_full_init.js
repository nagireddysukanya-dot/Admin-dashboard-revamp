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

const dummyElem = {
  innerHTML: '',
  classList: { remove: () => {}, add: () => {} },
  value: ''
};

global.document = {
  body: { classList: { remove: () => {}, add: () => {} } },
  addEventListener: (event, cb) => {
    if (event === 'DOMContentLoaded') global.domReady = cb;
  },
  querySelector: () => dummyElem,
  querySelectorAll: () => []
};

require('../frontend/js/app.js');

if (global.domReady) {
  global.domReady();
  console.log('✅ DOMContentLoaded init() executed successfully without any errors!');
  console.log('✅ Mounted HTML length:', dummyElem.innerHTML.length);
  if (dummyElem.innerHTML.includes('smatbot-purple-robot-badge')) {
    console.log('✅ Found official SmatBot purple robot badge!');
  }
  if (dummyElem.innerHTML.includes('Email Address') && dummyElem.innerHTML.includes('Password')) {
    console.log('✅ Found Email Address and Password inputs!');
  }
} else {
  console.error('domReady callback was not registered');
  process.exit(1);
}
