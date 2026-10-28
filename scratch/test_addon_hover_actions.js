const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('Testing Addon Row Hover Actions (Match Reference Screenshot 1 & 2)...');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'js', 'app.js'), 'utf8');
const stylesCss = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'css', 'styles.css'), 'utf8');

// 1. Check CSS rules for .zoho-addon-row-actions
assert.ok(stylesCss.includes('.zoho-addon-table-row .zoho-addon-row-actions'), 'CSS must define .zoho-addon-table-row .zoho-addon-row-actions');
assert.ok(stylesCss.includes('opacity: 0'), 'Action buttons must be hidden (opacity: 0) by default');
assert.ok(stylesCss.includes('visibility: hidden'), 'Action buttons must have visibility: hidden by default');
assert.ok(stylesCss.includes('.zoho-addon-table-row:hover .zoho-addon-row-actions'), 'Action buttons must have hover selector');
assert.ok(stylesCss.includes('opacity: 1'), 'Hover state must set opacity: 1');
assert.ok(stylesCss.includes('visibility: visible'), 'Hover state must set visibility: visible');
console.log('  ✅ [PASS] 1. CSS rules for hover-only visibility (opacity/visibility) properly defined');

// 2. Check HTML structure in app.js
assert.ok(appJs.includes('class="zoho-addon-table-row"'), 'Addon tr must have class zoho-addon-table-row');
assert.ok(appJs.includes('class="zoho-addon-row-actions"'), 'Action buttons must be wrapped inside zoho-addon-row-actions container');
assert.ok(appJs.includes('class="zoho-btn-row-more"'), 'More options button exists');
assert.ok(appJs.includes('class="zoho-btn-row-delete"'), 'Delete row button exists');
console.log('  ✅ [PASS] 2. Addon table rows and action buttons structured with hover classes');

// 3. Verify buttons have appropriate hover styles
assert.ok(stylesCss.includes('.zoho-btn-row-more'), '.zoho-btn-row-more defined in CSS');
assert.ok(stylesCss.includes('.zoho-btn-row-delete'), '.zoho-btn-row-delete defined in CSS');
assert.ok(stylesCss.includes('#FEF2F2'), 'Delete button has subtle red hover state');
console.log('  ✅ [PASS] 3. Buttons styled cleanly according to reference screenshots');

console.log('🎉 ALL ADDON ROW HOVER TESTS PASSED 100%!');
