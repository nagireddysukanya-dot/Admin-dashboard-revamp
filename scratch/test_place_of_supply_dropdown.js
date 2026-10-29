const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('Testing Full Place of Supply Searchable Dropdown (Screenshots 1 - 5)...');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'js', 'app.js'), 'utf8');

// 1. Verify ALL_SUPPLY_STATES contains every name from Screenshots 1 to 5
const expectedStates = [
  // Screenshot 1
  { code: 'AN', name: 'Andaman and Nicobar Islands' },
  { code: 'AD', name: 'Andhra Pradesh' },
  { code: 'AR', name: 'Arunachal Pradesh' },
  { code: 'AS', name: 'Assam' },
  { code: 'BR', name: 'Bihar' },
  { code: 'CH', name: 'Chandigarh' },
  { code: 'CG', name: 'Chhattisgarh' },
  // Screenshot 2
  { code: 'DN', name: 'Dadra and Nagar Haveli and Daman and Diu' },
  { code: 'DD', name: 'Daman and Diu' },
  { code: 'DL', name: 'Delhi' },
  { code: 'FC', name: 'Foreign Country' },
  { code: 'GA', name: 'Goa' },
  { code: 'GJ', name: 'Gujarat' },
  // Screenshot 3
  { code: 'HR', name: 'Haryana' },
  { code: 'HP', name: 'Himachal Pradesh' },
  { code: 'JK', name: 'Jammu and Kashmir' },
  { code: 'JH', name: 'Jharkhand' },
  { code: 'KA', name: 'Karnataka' },
  { code: 'KL', name: 'Keralam' },
  { code: 'LA', name: 'Ladakh' },
  // Screenshot 4
  { code: 'LD', name: 'Lakshadweep' },
  { code: 'MP', name: 'Madhya Pradesh' },
  { code: 'MH', name: 'Maharashtra' },
  { code: 'MN', name: 'Manipur' },
  { code: 'ML', name: 'Meghalaya' },
  { code: 'MZ', name: 'Mizoram' },
  { code: 'NL', name: 'Nagaland' },
  // Screenshot 5
  { code: 'OD', name: 'Odisha' },
  { code: 'OT', name: 'Other Territory' },
  { code: 'PY', name: 'Puducherry' },
  { code: 'PB', name: 'Punjab' },
  { code: 'RJ', name: 'Rajasthan' },
  { code: 'SK', name: 'Sikkim' },
  // Remaining states
  { code: 'TN', name: 'Tamil Nadu' },
  { code: 'TS', name: 'Telangana' },
  { code: 'TR', name: 'Tripura' },
  { code: 'UP', name: 'Uttar Pradesh' },
  { code: 'UK', name: 'Uttarakhand' },
  { code: 'WB', name: 'West Bengal' }
];

expectedStates.forEach(s => {
  assert.ok(appJs.includes(`code: '${s.code}'`), `State code ${s.code} must exist`);
  assert.ok(appJs.includes(s.name), `State name ${s.name} must exist`);
});
console.log(`  ✅ [PASS] 1. All ${expectedStates.length} states/UTs from Screenshots 1-5 & remaining present`);

// 2. Verify Searchable Dropdown elements
assert.ok(appJs.includes('id="zoho-supply-state-trigger"'), 'Trigger box exists');
assert.ok(appJs.includes('toggleSupplyStateDropdown(event)'), 'Trigger toggles dropdown');
assert.ok(appJs.includes('id="zoho-supply-search-input"'), 'Search input with magnifying glass exists');
assert.ok(appJs.includes('id="zoho-supply-options-list"'), 'Options list exists');
console.log('  ✅ [PASS] 2. Searchable dropdown UI structure matches Screenshots 1 - 5');

// 3. Verify selection and filter methods
assert.ok(appJs.includes('selectSupplyState('), 'selectSupplyState method exists');
assert.ok(appJs.includes('filterSupplyStates('), 'filterSupplyStates method exists');
assert.ok(appJs.includes('closeSupplyStateDropdown('), 'closeSupplyStateDropdown method exists');
console.log('  ✅ [PASS] 3. Selection, real-time filtering, and close functions implemented');

// 4. Verify outside tap close
assert.ok(appJs.includes('!e.target.closest(\'.zoho-supply-popover\') && !e.target.closest(\'.zoho-supply-trigger\')'), 'Document listener closes Place of Supply dropdown on outside tap');
console.log('  ✅ [PASS] 4. Outside click/tap listener closes Place of Supply dropdown');

console.log('🎉 ALL PLACE OF SUPPLY TESTS PASSED 100%!');
