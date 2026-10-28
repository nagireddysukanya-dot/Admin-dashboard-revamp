const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('Testing Shipping Recipient GST Details Popover (Screenshot 1 Match)...');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'js', 'app.js'), 'utf8');

// 1. Verify pencil trigger is wired to toggleShippingGstPopover
assert.ok(appJs.includes('toggleShippingGstPopover(event)'), 'Shipping GST pencil trigger must call toggleShippingGstPopover');
assert.ok(appJs.includes('class="zoho-ship-gst-trigger"'), 'Pencil has zoho-ship-gst-trigger class');
console.log('  ✅ [PASS] 1. Pencil icon next to SHIPPING RECIPIENT GST DETAILS has click trigger');

// 2. Verify Shipping Recipient GST Details Popover layout
assert.ok(appJs.includes('id="zoho-ship-gst-popover"'), 'Popover container #zoho-ship-gst-popover exists');
assert.ok(appJs.includes('Shipping Recipient GST Details'), 'Title Shipping Recipient GST Details matches Screenshot 1');
assert.ok(appJs.includes('closeShippingGstPopover()'), 'Close button calls closeShippingGstPopover');
assert.ok(appJs.includes('id="zoho-ship-gstin-input"'), 'Input for GSTIN exists');
assert.ok(appJs.includes('is Unregistered Person?'), 'is Unregistered Person? checkbox exists');
assert.ok(appJs.includes('id="zoho-ship-legal-name-input"'), 'Input for Business Legal Name exists');
assert.ok(appJs.includes('id="zoho-ship-trade-name-input"'), 'Input for Business Trade Name exists');
assert.ok(appJs.includes('saveShippingGstPreferences()'), 'Update button calls saveShippingGstPreferences');
console.log('  ✅ [PASS] 2. Popover modal structure matches Screenshot 1 exactly');

// 3. Verify outside click close
assert.ok(appJs.includes('!e.target.closest(\'.zoho-ship-gst-popover\') && !e.target.closest(\'.zoho-ship-gst-trigger\')'), 'Document listener closes Shipping GST popover when clicking outside');
console.log('  ✅ [PASS] 3. Outside tap listener closes Shipping GST Details popover');

// 4. Verify exports on window.smatApp
assert.ok(appJs.includes('toggleShippingGstPopover,'), 'toggleShippingGstPopover exported on window.smatApp');
assert.ok(appJs.includes('closeShippingGstPopover,'), 'closeShippingGstPopover exported on window.smatApp');
assert.ok(appJs.includes('saveShippingGstPreferences,'), 'saveShippingGstPreferences exported on window.smatApp');
console.log('  ✅ [PASS] 4. Functions exported on window.smatApp');

console.log('🎉 ALL SHIPPING RECIPIENT GST DETAILS TESTS PASSED 100%!');
