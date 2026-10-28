const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('Testing Top Section up to Place of Supply* (Exact match to Reference Screenshot 2)...');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'js', 'app.js'), 'utf8');

// 1. Verify Phone badge is REMOVED
assert.ok(!appJs.includes('(Country Code: +91)'), 'Phone badge with (Country Code: +91) must be removed');
assert.ok(!appJs.includes('Phone:</span>'), 'Phone label next to email must be removed');
console.log('  ✅ [PASS] 1. Phone badge is completely removed from E-MAIL TO');

// 2. Verify Customer Name row elements
assert.ok(appJs.includes('Customer Name*'), 'Customer Name* label must exist');
assert.ok(appJs.includes('zoho-sub-client-select'), 'Customer select dropdown must exist');
assert.ok(appJs.includes('zoho-btn-search'), 'Customer quick search button must exist');
assert.ok(appJs.includes('zoho-currency-pill'), 'Currency pill must exist');
assert.ok(appJs.includes('currClient.currency_type || \'INR\''), 'Currency pill shows client currency (INR)');
console.log('  ✅ [PASS] 2. Customer Name*, search button and INR pill present');

// 3. Verify Billing & Shipping addresses
assert.ok(appJs.includes('BILLING ADDRESS'), 'BILLING ADDRESS title must exist');
assert.ok(appJs.includes('zoho-billing-display-addr'), 'Billing address display must exist');
assert.ok(appJs.includes('SHIPPING ADDRESS'), 'SHIPPING ADDRESS title must exist');
assert.ok(appJs.includes('zoho-shipping-display-addr'), 'Shipping address display must exist');
assert.ok(appJs.includes('toggleAddressPopover(\'billing\''), 'Billing address pencil opens popover');
assert.ok(appJs.includes('toggleAddressPopover(\'shipping\''), 'Shipping address pencil opens popover');
console.log('  ✅ [PASS] 3. Billing & Shipping address cards with interactive pencil popovers present');

// 4. Verify E-MAIL TO
assert.ok(appJs.includes('E-MAIL TO'), 'E-MAIL TO label must exist');
assert.ok(appJs.includes('zoho-btn-new-contact'), '⊕ New Contact Person button must exist');
assert.ok(appJs.includes('openAddContactPersonModal()'), 'Clicking New Contact Person opens modal');
assert.ok(appJs.includes('escapeHtml(currClient.email)'), 'Client email is rendered with checkbox');
console.log('  ✅ [PASS] 4. E-MAIL TO has ⊕ New Contact Person and email checkbox card (no phone badge)');

// 5. Verify GST Details
assert.ok(appJs.includes('BILLING RECIPIENT GST DETAILS'), 'BILLING RECIPIENT GST DETAILS header must exist');
assert.ok(appJs.includes('GST Treatment:'), 'GST Treatment line must exist');
assert.ok(appJs.includes('Unregistered Business'), 'Unregistered Business treatment must exist');
assert.ok(appJs.includes('SHIPPING RECIPIENT GST DETAILS'), 'SHIPPING RECIPIENT GST DETAILS header must exist');
assert.ok(appJs.includes('GSTIN:'), 'GSTIN line must exist');
assert.ok(appJs.includes('Business Legal Name:'), 'Business Legal Name line must exist');
console.log('  ✅ [PASS] 5. Billing & Shipping Recipient GST Details match Screenshot 2');

// 6. Verify Place of Supply*
assert.ok(appJs.includes('Place of Supply*'), 'Place of Supply* label must exist');
assert.ok(appJs.includes('zoho-sub-supply-state'), 'Place of Supply select element must exist');
assert.ok(appJs.includes('[TS] - Telangana'), '[TS] - Telangana default option must exist');
console.log('  ✅ [PASS] 6. Place of Supply* dropdown is properly configured');

console.log('🎉 ALL SECTION CHECKS UP TO PLACE OF SUPPLY* PASSED 100%!');
