const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('Testing Disabled Customer Name Selection in Change Subscription...');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'js', 'app.js'), 'utf8');
const stylesCss = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'css', 'styles.css'), 'utf8');

// 1. Verify zoho-sub-client-select has disabled attribute
assert.ok(appJs.includes('id="zoho-sub-client-select" class="zoho-select-dropdown" disabled'), 'Select element must be disabled');

// 2. Verify cursor: not-allowed styling
assert.ok(appJs.includes('cursor:not-allowed') || appJs.includes('cursor: not-allowed'), 'Customer select must have not-allowed cursor');

// 3. Verify CSS rules for disabled customer select
assert.ok(stylesCss.includes('zoho-customer-disabled-wrap') || stylesCss.includes('#zoho-sub-client-select:disabled'), 'styles.css must have disabled customer styles');

console.log('🎉 ALL DISABLED CUSTOMER NAME TESTS PASSED 100%!');
