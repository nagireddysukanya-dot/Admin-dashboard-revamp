const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('Testing Address Popover Gap Fix and Outside Tap to Close...');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'js', 'app.js'), 'utf8');

// 1. Verify popover positioning has NO large gap (uses top: 24px; left: 0;)
assert.ok(appJs.includes('id="zoho-addr-popover-billing" class="zoho-addr-popover" style="display:none; position:absolute; top:24px; left:0;'), 'Billing popover must be positioned at top:24px directly below header');
assert.ok(appJs.includes('id="zoho-addr-popover-shipping" class="zoho-addr-popover" style="display:none; position:absolute; top:24px; left:0;'), 'Shipping popover must be positioned at top:24px directly below header');
console.log('  ✅ [PASS] 1. Address popovers positioned directly below titles at top:24px (gap eliminated)');

// 2. Verify trigger elements have zoho-addr-trigger class
assert.ok(appJs.includes('class="zoho-addr-trigger" style="cursor:pointer; display:inline-flex; align-items:center;" title="Edit Billing Address"'), 'Billing pencil has zoho-addr-trigger class');
assert.ok(appJs.includes('class="zoho-addr-trigger" style="cursor:pointer; display:inline-flex; align-items:center;" title="Edit Shipping Address"'), 'Shipping pencil has zoho-addr-trigger class');
assert.ok(appJs.includes('class="zoho-addr-trigger" onclick="event.stopPropagation(); window.smatApp.toggleAddressPopover(\'shipping\', event)"'), 'New Address link has zoho-addr-trigger class');
console.log('  ✅ [PASS] 2. Triggers properly tagged with zoho-addr-trigger');

// 3. Verify handleOutsideClick closes popover on any outside tap
assert.ok(appJs.includes('!e.target.closest(\'.zoho-addr-popover\') && !e.target.closest(\'.zoho-addr-trigger\')'), 'Document listener closes address popover when click is outside popover and outside trigger');
assert.ok(appJs.includes('document.addEventListener(\'click\', handleOutsideClick)'), 'Click event listener attached');
assert.ok(appJs.includes('document.addEventListener(\'touchstart\', handleOutsideClick)'), 'Touchstart event listener attached for mobile/tablets');
console.log('  ✅ [PASS] 3. Global click & touchstart handlers close popover on outside tap');

console.log('🎉 ALL ADDRESS POPOVER GAP & OUTSIDE CLICK TESTS PASSED 100%!');
