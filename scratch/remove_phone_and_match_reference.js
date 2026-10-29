const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
let content = fs.readFileSync(appJsPath, 'utf8');

// 1. Remove the Phone badge div from E-MAIL TO row
const phoneBadgeTarget = `<div style="display:inline-flex; align-items:center; gap:6px; font-size:0.84rem; color:#4B5563; background:#F8FAFC; border:1px solid #E2E8F0; padding:4px 10px; border-radius:4px;">
                  <span style="font-weight:600; color:#1E293B;">Phone:</span>
                  <span>\${escapeHtml(currClient.phone_number || '+91-9705736759')}</span>
                  <span style="color:#64748B; font-size:0.75rem;">(Country Code: +91)</span>
                </div>`;

// We also handle possible whitespace / line ending variations
const phoneBadgeRegex = /<div style="display:inline-flex; align-items:center; gap:6px; font-size:0\.84rem; color:#4B5563; background:#F8FAFC; border:1px solid #E2E8F0; padding:4px 10px; border-radius:4px;">\s*<span style="font-weight:600; color:#1E293B;">Phone:<\/span>\s*<span>\$\{escapeHtml\(currClient\.phone_number \|\| '\+91-9705736759'\)\}<\/span>\s*<span style="color:#64748B; font-size:0\.75rem;">\(Country Code: \+91\)<\/span>\s*<\/div>/g;

if (!phoneBadgeRegex.test(content)) {
  console.error('ERROR: Could not find phoneBadgeRegex in frontend/js/app.js');
  process.exit(1);
}

content = content.replace(phoneBadgeRegex, '');
console.log('Successfully removed Phone badge from E-MAIL TO');

// 2. Refine Currency Pill to exactly match Screenshot 2 [ 🟢 INR ]
// Match:
// <span class="zoho-currency-pill" style="background:#ECFDF5; border-color:#A7F3D0; color:#065F46;">
//   <span style="width:7px; height:7px; background:#10B981; border-radius:50%; display:inline-block;"></span> ${currClient.currency_type || 'INR'}
// </span>
const currencyPillRegex = /<span class="zoho-currency-pill" style="background:#ECFDF5; border-color:#A7F3D0; color:#065F46;">\s*<span style="width:7px; height:7px; background:#10B981; border-radius:50%; display:inline-block;"><\/span> \$\{currClient\.currency_type \|\| 'INR'\}\s*<\/span>/g;

const refinedCurrencyPill = `<span class="zoho-currency-pill" style="background:#FFFFFF; border:1px solid #CBD5E1; color:#111827; border-radius:4px; padding:3px 9px; font-size:0.8rem; font-weight:600; display:inline-flex; align-items:center; gap:5px;">
                    <span style="display:inline-flex; align-items:center; justify-content:center; width:12px; height:12px; border-radius:50%; border:2px solid #10B981; box-sizing:border-box;"><span style="width:4px; height:4px; background:#10B981; border-radius:50%;"></span></span> \${currClient.currency_type || 'INR'}
                  </span>`;

if (currencyPillRegex.test(content)) {
  content = content.replace(currencyPillRegex, refinedCurrencyPill);
  console.log('Refined Currency Pill to exact Screenshot 2 style');
} else {
  console.log('Currency Pill regex did not match, leaving as is or already styled.');
}

// 3. Remove duplicate pencil icon on BILLING RECIPIENT GST DETAILS title so pencil only appears on GST Treatment: Unregistered Business ✎
const billingGstTitleWithPencil = /<span>BILLING RECIPIENT GST DETAILS<\/span>\s*<span style="cursor:pointer; display:inline-flex; align-items:center;" title="Edit GST Details"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2\.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"><\/path><path d="M16\.5 3\.5a2\.121 2\.121 0 0 1 3 3L7 19l-4 1 1-4L16\.5 3\.5z"><\/path><\/svg><\/span>/g;

if (billingGstTitleWithPencil.test(content)) {
  content = content.replace(billingGstTitleWithPencil, '<span>BILLING RECIPIENT GST DETAILS</span>');
  console.log('Cleaned up BILLING RECIPIENT GST DETAILS title to match Screenshot 2');
}

// 4. Refine search button style to match Screenshot 2 light blue
const searchBtnRegex = /class="zoho-btn-search" style="background:#2563EB; border-color:#2563EB; padding:0\.5rem 0\.75rem;"/g;
if (searchBtnRegex.test(content)) {
  content = content.replace(searchBtnRegex, 'class="zoho-btn-search" style="background:#3B82F6; border:1px solid #3B82F6; border-radius:4px; padding:0.45rem 0.75rem; color:#FFFFFF; cursor:pointer;"');
  console.log('Refined search button to match Screenshot 2');
}

fs.writeFileSync(appJsPath, content, 'utf8');
console.log('Updated frontend/js/app.js successfully');
