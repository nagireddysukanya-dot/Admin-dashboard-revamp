const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('Testing that Place of Supply dropdown opens ABOVE the input (paina)...');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'js', 'app.js'), 'utf8');
const stylesCss = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'css', 'styles.css'), 'utf8');

// 1. Verify CSS definition for .zoho-supply-popover
assert.ok(stylesCss.includes('.zoho-supply-popover'), 'styles.css must contain .zoho-supply-popover');
assert.ok(stylesCss.includes('bottom: calc(100% + 4px)'), 'styles.css must position popover above using bottom: calc(100% + 4px)');

// 2. Verify app.js markup
assert.ok(appJs.includes('id="zoho-supply-state-popover"'), 'app.js must contain #zoho-supply-state-popover');
assert.ok(appJs.includes('bottom:calc(100% + 4px)'), 'app.js inline style must position popover above using bottom:calc(100% + 4px)');
assert.ok(appJs.includes('z-index:99999'), 'app.js inline style must have highest z-index 99999');

console.log('🎉 ALL PLACE OF SUPPLY ABOVE POSITIONING TESTS PASSED 100%!');
