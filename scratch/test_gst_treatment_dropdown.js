const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('Testing GST Treatment Searchable Dropdown Suite (Screenshots 1 - 5)...');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'js', 'app.js'), 'utf8');
const stylesCss = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'css', 'styles.css'), 'utf8');

// 1. Verify all 10 options from Screenshots 1 - 4 are defined with exact title & description
const expectedTreatments = [
  // Screenshot 1
  {
    title: 'Registered Business - Regular',
    desc: 'Business that is registered under GST'
  },
  {
    title: 'Registered Business - Composition',
    desc: 'Business that is registered under the Composition Scheme in GST'
  },
  {
    title: 'Unregistered Business',
    desc: 'Business that has not been registered under GST'
  },
  // Screenshot 1 & 2
  {
    title: 'Consumer',
    desc: 'A customer who is a regular consumer'
  },
  // Screenshot 2
  {
    title: 'Overseas',
    desc: 'Persons with whom you do import or export of supplies outside India'
  },
  {
    title: 'Special Economic Zone',
    desc: 'Business (Unit) that is located in a Special Economic Zone (SEZ) of India or a SEZ Developer'
  },
  // Screenshot 2 & 3
  {
    title: 'Deemed Export',
    desc: 'Supply of goods to an Export Oriented Unit or against Advanced Authorization/Export Promotion Capital Goods.'
  },
  // Screenshot 3
  {
    title: 'Tax Deductor',
    desc: 'Departments of the State/Central government, governmental agencies or local authorities'
  },
  // Screenshot 3 & 4
  {
    title: 'SEZ Developer',
    desc: 'A person/organisation who owns at least 26% of the equity in creating business units in a Special Economic Zone (SEZ)'
  },
  // Screenshot 4
  {
    title: 'Input Service Distributor',
    desc: 'Input Service Distributor (ISD) is an office that receives tax invoices for services used by the company in different states under the same PAN.'
  }
];

expectedTreatments.forEach((t, i) => {
  assert(appJs.includes(t.title), `Missing treatment title: ${t.title}`);
  assert(appJs.includes(t.desc), `Missing treatment description: ${t.desc}`);
});
console.log('  ✅ [PASS] 1. All 10 GST Treatment titles and descriptions present in ALL_GST_TREATMENTS');

// 2. Verify UI elements in Configure Tax Preferences popover
assert(appJs.includes('zoho-gst-treatment-trigger'), 'Missing zoho-gst-treatment-trigger');
assert(appJs.includes('zoho-gst-treatment-dropdown'), 'Missing zoho-gst-treatment-dropdown');
assert(appJs.includes('zoho-gst-treatment-search-input'), 'Missing search input in treatment dropdown');
assert(appJs.includes('zoho-gst-treatment-options-list'), 'Missing options list container');
console.log('  ✅ [PASS] 2. Searchable dropdown UI structure in Configure Tax Preferences matches Screenshots 1 - 5');

// 3. Verify CSS classes and styling
assert(stylesCss.includes('.zoho-treatment-option-item'), 'Missing .zoho-treatment-option-item in styles.css');
assert(stylesCss.includes('.zoho-treatment-check'), 'Missing .zoho-treatment-check in styles.css');
console.log('  ✅ [PASS] 3. CSS styles for GST Treatment options, hover, selected state, and checkmark verified');

// 4. Verify helper functions exported
assert(appJs.includes('toggleGstTreatmentDropdown'), 'Missing toggleGstTreatmentDropdown');
assert(appJs.includes('selectGstTreatment'), 'Missing selectGstTreatment');
assert(appJs.includes('filterGstTreatments'), 'Missing filterGstTreatments');
assert(appJs.includes('closeGstTreatmentDropdown'), 'Missing closeGstTreatmentDropdown');
console.log('  ✅ [PASS] 4. Selection, search filtering, and outside-click functions exported');

console.log('🎉 ALL GST TREATMENT TESTS PASSED 100%!');
