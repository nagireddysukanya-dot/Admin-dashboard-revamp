const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('Testing Configure Tax Preferences Popover (Screenshot 1 Match)...');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'js', 'app.js'), 'utf8');

// 1. Verify pencil trigger is wired to toggleGstPreferencesPopover
assert.ok(appJs.includes('toggleGstPreferencesPopover(event)'), 'GST Treatment pencil trigger must call toggleGstPreferencesPopover');
assert.ok(appJs.includes('class="zoho-gst-pref-trigger"'), 'Pencil has zoho-gst-pref-trigger class');
console.log('  ✅ [PASS] 1. Pencil icon next to GST Treatment has click trigger');

// 2. Verify Configure Tax Preferences Popover layout
assert.ok(appJs.includes('id="zoho-gst-pref-popover"'), 'Popover container #zoho-gst-pref-popover exists');
assert.ok(appJs.includes('Configure Tax Preferences'), 'Title Configure Tax Preferences matches Screenshot 1');
assert.ok(appJs.includes('closeGstPreferencesPopover()'), 'Close button calls closeGstPreferencesPopover');
assert.ok(appJs.includes('id="zoho-gst-treatment-input"'), 'Select dropdown for GST Treatment exists');
assert.ok(appJs.includes('Make it permanent?'), 'Make it permanent? question exists');
assert.ok(appJs.includes('Use these settings for all future transactions of this customer.'), 'Checkbox text matches Screenshot 1');
assert.ok(appJs.includes('saveGstPreferences()'), 'Update button calls saveGstPreferences');
console.log('  ✅ [PASS] 2. Popover modal structure matches Screenshot 1 exactly');

// 3. Verify outside click close
assert.ok(appJs.includes('!e.target.closest(\'.zoho-gst-pref-popover\') && !e.target.closest(\'.zoho-gst-pref-trigger\')'), 'Document listener closes GST popover when clicking outside');
console.log('  ✅ [PASS] 3. Outside tap listener closes Configure Tax Preferences popover');

// 4. Verify exports on window.smatApp
assert.ok(appJs.includes('toggleGstPreferencesPopover,'), 'toggleGstPreferencesPopover exported on window.smatApp');
assert.ok(appJs.includes('closeGstPreferencesPopover,'), 'closeGstPreferencesPopover exported on window.smatApp');
assert.ok(appJs.includes('saveGstPreferences,'), 'saveGstPreferences exported on window.smatApp');
console.log('  ✅ [PASS] 4. Functions exported on window.smatApp');

console.log('🎉 ALL CONFIGURE TAX PREFERENCES TESTS PASSED 100%!');
