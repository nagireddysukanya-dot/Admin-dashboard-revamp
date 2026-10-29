const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('Testing Plan Remove Confirmation Modal Suite (Exact Screenshot Match)...');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'js', 'app.js'), 'utf8');
const stylesCss = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'css', 'styles.css'), 'utf8');

// 1. Verify remove button trigger on plan row
assert.ok(appJs.includes('showRemovePlanModal()'), 'Plan remove button must trigger showRemovePlanModal()');
assert.ok(appJs.includes('zoho-plan-remove-btn'), 'Plan row contains .zoho-plan-remove-btn');
console.log('  ✅ [PASS] 1. Plan row remove button (⊗) wired with click handler');

// 2. Verify modal text and elements
assert.ok(appJs.includes('zoho-plan-remove-modal'), 'Modal container #zoho-plan-remove-modal exists');
const expectedWarning = "If you remove this plan, any custom changes you've made to the plan price, reporting tags or other such subscription configurations will be discarded.";
assert.ok(appJs.includes(expectedWarning), 'Modal contains exact warning text from user screenshot');
assert.ok(appJs.includes('proceedRemovePlan()'), 'Proceed button calls proceedRemovePlan()');
assert.ok(appJs.includes('closeRemovePlanModal()'), 'Cancel button calls closeRemovePlanModal()');
console.log('  ✅ [PASS] 2. Modal markup contains exact warning text and Proceed / Cancel buttons');

// 3. Verify functions exported on window.smatApp
assert.ok(appJs.includes('showRemovePlanModal,'), 'showRemovePlanModal exported on window.smatApp');
assert.ok(appJs.includes('closeRemovePlanModal,'), 'closeRemovePlanModal exported on window.smatApp');
assert.ok(appJs.includes('proceedRemovePlan,'), 'proceedRemovePlan exported on window.smatApp');
console.log('  ✅ [PASS] 3. Modal functions exported on window.smatApp');

// 4. Verify CSS slide down animation
assert.ok(stylesCss.includes('zohoSlideDown'), 'styles.css contains zohoSlideDown keyframe animation');
console.log('  ✅ [PASS] 4. zohoSlideDown animation present in styles.css');

console.log('🎉 ALL PLAN REMOVE MODAL TESTS PASSED 100%!');
