const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('Testing that Shipping Recipient GST Details is BLANK by default (Reference Screenshot Match)...');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'js', 'app.js'), 'utf8');

// 1. Verify that shipping GST display does NOT use currClient.gst_number
assert.ok(!appJs.includes('${escapeHtml(currClient.gst_number || \'\')}</span></div>\n                  <div style="color:#4B5563;">Business Legal Name:'), 'Shipping GSTIN display must not use client company gst_number');

// 2. Verify it uses currClient.shipping_gstin
assert.ok(appJs.includes('currClient.shipping_gstin'), 'Must use currClient.shipping_gstin');
assert.ok(appJs.includes('currClient.shipping_legal_name'), 'Must use currClient.shipping_legal_name');
assert.ok(appJs.includes('currClient.shipping_trade_name'), 'Must use currClient.shipping_trade_name');

// 3. Verify toggleShippingGstPopover populates from shipping_gstin (blank by default)
assert.ok(appJs.includes('gstinInput.value = currClient.shipping_gstin || \'\''), 'Popover GSTIN input must populate from shipping_gstin');

console.log('🎉 ALL BLANK DEFAULT SHIPPING GST TESTS PASSED 100%!');
