const fs = require('fs');
const assert = require('assert');

console.log('Testing Place of Supply Dropdown Styling and Checkmark...');

const appJs = fs.readFileSync('frontend/js/app.js', 'utf8');
const stylesCss = fs.readFileSync('frontend/css/styles.css', 'utf8');

assert(stylesCss.includes('.zoho-supply-option-item'), 'CSS must include .zoho-supply-option-item');
assert(stylesCss.includes('.zoho-supply-option-item.selected'), 'CSS must style selected item');
assert(stylesCss.includes('.zoho-supply-check'), 'CSS must style checkmark');
assert(stylesCss.includes('#3B82F6'), 'CSS must have solid blue hover background');
assert(appJs.includes('<span class="zoho-supply-check">✓</span>'), 'app.js must render checkmark for selected state');

// Verify all 6 states in the screenshot are present
const tailStates = ['SK', 'TN', 'TS', 'TR', 'UP', 'UK', 'WB'];
tailStates.forEach(code => {
  assert(appJs.includes(`code: '${code}'`), `State code ${code} must be present in ALL_SUPPLY_STATES`);
});

console.log('🎉 ALL PLACE OF SUPPLY STYLING AND TAIL STATES TESTS PASSED 100%!');
