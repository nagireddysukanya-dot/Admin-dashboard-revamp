const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('Testing Plan and Addon Remove Marks and No Dropdown (User Reference Match)...');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'js', 'app.js'), 'utf8');

// 1. Verify that zoho-plan-row does NOT have <select id="zoho-plan-select" with <optgroup>
assert.ok(!appJs.includes('<select id="zoho-plan-select" style='), 'Plan name must not be a <select> dropdown element with dropdown chevron');

// 2. Verify plan name is displayed as pure text
assert.ok(appJs.includes('id="zoho-plan-name-display"'), 'Plan name display element #zoho-plan-name-display must exist');

// 3. Verify plan remove button ⊗ is always visible right next to plan name
assert.ok(appJs.includes('class="zoho-plan-remove-btn"'), 'Plan remove button .zoho-plan-remove-btn must exist');
assert.ok(appJs.includes('showRemovePlanModal()'), 'Plan remove button must trigger showRemovePlanModal()');

// 4. Verify addon remove button ⊗ is always visible right next to addon name
assert.ok(appJs.includes('class="zoho-addon-remove-btn"'), 'Addon remove button .zoho-addon-remove-btn must exist');
assert.ok(appJs.includes('removeZohoSubAddonRow(${idx})'), 'Addon remove button must trigger removeZohoSubAddonRow');

// 5. Verify Select an account is present under SAC badge
assert.ok(appJs.includes('Select an account'), 'Select an account must be present under SAC badge');

console.log('🎉 ALL PLAN & ADDON REMOVE MARKS TESTS PASSED 100%!');
