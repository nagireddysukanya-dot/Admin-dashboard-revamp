// Validation test script to confirm marked fields removal in both reference view and plan modal
const fs = require('fs');
const path = require('path');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'js', 'app.js'), 'utf8');
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'index.html'), 'utf8');

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${testName}`);
    failed++;
  }
}

console.log('--- TEST SUITE: CONFIRM REMOVAL OF MARKED FIELDS ---');

// 1. Confirmed REMOVED fields in Reference View
assert(!appJs.includes('id="zoho-sub-ref"'), 'Reference view: Reference Number field is completely removed');
assert(!appJs.includes('id="zoho-sub-gst"'), 'Reference view: GST Number field is completely removed');
assert(!appJs.includes('id="zoho-sub-paymode-offline"'), 'Reference view: Payment Mode checkbox is completely removed');
assert(!appJs.includes('id="zoho-sub-terms"'), 'Reference view: Payment Terms dropdown is completely removed');
assert(!appJs.includes('id="zoho-sub-razorpay"'), 'Reference view: Razorpay online payment checkbox is completely removed');
assert(!appJs.includes('id="zoho-sub-prorate"'), 'Reference view: Proration Preference is completely removed');

// 2. Confirmed REMOVED fields in Plan Modal
assert(!appJs.includes('id="modal-sub-ref"'), 'Plan modal: Reference Number field is completely removed');
assert(!appJs.includes('id="modal-sub-gst"'), 'Plan modal: GST Number field is completely removed');
assert(!appJs.includes('id="modal-sub-offline-pay"'), 'Plan modal: Payment Mode checkbox is completely removed');
assert(!appJs.includes('id="modal-sub-terms"'), 'Plan modal: Payment Terms dropdown is completely removed');
assert(!appJs.includes('id="modal-sub-razorpay"'), 'Plan modal: Razorpay online payment checkbox is completely removed');
assert(!appJs.includes('id="modal-sub-prorate"'), 'Plan modal: Proration Preference is completely removed');

// 3. Confirmed REMOVED fields for "Other Preferences"
assert(!appJs.includes('Other Preferences'), '"Other Preferences" is completely removed');
assert(!appJs.includes('Invoice Template'), '"Invoice Template" is completely removed');
assert(!appJs.includes('Round Off Preference'), '"Round Off Preference" is completely removed');
assert(!appJs.includes('Customer Notes'), '"Customer Notes" is completely removed');
assert(!appJs.includes('Prorate Charges & Credits'), '"Prorate Charges & Credits" is completely removed');

// 4. Confirmed KEPT fields
assert(appJs.includes('id="zoho-sub-num"'), 'Reference view: Subscription Number* is kept');
assert(appJs.includes('id="zoho-sub-sales"'), 'Reference view: Salesperson is kept');
assert(appJs.includes('id="modal-sub-number"'), 'Plan modal: Subscription Number* is kept');
assert(appJs.includes('id="modal-sub-sales"'), 'Plan modal: Salesperson is kept');
assert(appJs.includes('SECTION 3: SUBSCRIPTION TERM'), 'Subscription Term section header is kept');
assert(appJs.includes('SECTION 5: POINT 3 LIVE FINAL BILLING SUMMARY CARD'), 'Reference view: Live Final Billing Summary card is kept');

// 5. Cache version
assert(indexHtml.includes('app.js?v=12.1'), 'index.html bumped to app.js?v=12.1');
assert(indexHtml.includes('styles.css?v=12.1'), 'index.html bumped to styles.css?v=12.1');

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL REMOVED FIELDS CONFIRMED 100% IN BOTH VIEW AND MODAL!');
}
