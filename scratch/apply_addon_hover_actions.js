const fs = require('fs');
const path = require('path');

// 1. Update frontend/css/styles.css
const cssPath = path.join(__dirname, '..', 'frontend', 'css', 'styles.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

const hoverCssBlock = `
/* Zoho Addons Row Hover Actions (Screenshot 1 & 2 Match) */
.zoho-addon-table-row {
  transition: background-color 0.15s ease;
}

.zoho-addon-table-row:hover {
  background-color: #FAFAFA;
}

.zoho-addon-table-row .zoho-addon-row-actions {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-left: 0.45rem;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s ease, visibility 0.15s ease;
}

.zoho-addon-table-row:hover .zoho-addon-row-actions,
.zoho-addon-table-row:focus-within .zoho-addon-row-actions {
  opacity: 1;
  visibility: visible;
}

.zoho-btn-row-more {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid #D1D5DB;
  background: #FFFFFF;
  color: #6B7280;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 11px;
  line-height: 1;
  padding: 0;
  transition: all 0.15s ease;
}

.zoho-btn-row-more:hover {
  background: #F3F4F6;
  border-color: #9CA3AF;
  color: #1F2937;
}

.zoho-btn-row-delete {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid #FCA5A5;
  background: #FFFFFF;
  color: #DC2626;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  padding: 0;
  transition: all 0.15s ease;
}

.zoho-btn-row-delete:hover {
  background: #FEF2F2;
  border-color: #EF4444;
  color: #B91C1C;
}
`;

if (!cssContent.includes('.zoho-addon-row-actions')) {
  cssContent += '\n' + hoverCssBlock;
  fs.writeFileSync(cssPath, cssContent, 'utf8');
  console.log('Added .zoho-addon-row-actions hover styles to frontend/css/styles.css');
} else {
  console.log('Hover styles already present in styles.css');
}

// 2. Update frontend/js/app.js
const appPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

// Ensure <tr has class="zoho-addon-table-row"
const oldTr = `<tr style="border-bottom:1px solid #F3F4F6; vertical-align:top;" id="zoho-addon-row-\${idx}">`;
const newTr = `<tr class="zoho-addon-table-row" style="border-bottom:1px solid #F3F4F6; vertical-align:top;" id="zoho-addon-row-\${idx}">`;

if (appContent.includes(oldTr)) {
  appContent = appContent.replace(oldTr, newTr);
  console.log('Added zoho-addon-table-row class to addon tr in app.js');
}

// Update the actions buttons to be inside .zoho-addon-row-actions
const oldAmountDiv = `<div id="zoho-addon-amount-\${idx}" style="font-weight:700; color:#111827; font-size:0.9rem;">
                            Rs. \${isRowEmpty ? '0.00' : (addon.price * addon.qty).toLocaleString('en-IN') + '.00'}
                          </div>
                          <button type="button" style="width:24px; height:24px; border-radius:50%; border:1px solid #E5E7EB; background:#FFFFFF; color:#6B7280; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; font-size:11px; padding:0;" title="More options">···</button>
                          <button type="button" onclick="window.smatApp.removeZohoSubAddonRow(\${idx})" style="width:22px; height:22px; border-radius:50%; border:1px solid #FCA5A5; background:#FEF2F2; color:#DC2626; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; font-size:11px; font-weight:700; padding:0;" title="Delete row">✕</button>`;

const newAmountDiv = `<div id="zoho-addon-amount-\${idx}" style="font-weight:700; color:#111827; font-size:0.9rem;">
                            Rs. \${isRowEmpty ? '0.00' : (addon.price * addon.qty).toLocaleString('en-IN') + '.00'}
                          </div>
                          <div class="zoho-addon-row-actions">
                            <button type="button" class="zoho-btn-row-more" title="More options">···</button>
                            <button type="button" class="zoho-btn-row-delete" onclick="window.smatApp.removeZohoSubAddonRow(\${idx})" title="Delete row">✕</button>
                          </div>`;

let normApp = appContent.replace(/\r\n/g, '\n');
const normOldAmountDiv = oldAmountDiv.replace(/\r\n/g, '\n');
const normNewAmountDiv = newAmountDiv.replace(/\r\n/g, '\n');

if (normApp.includes(normOldAmountDiv)) {
  normApp = normApp.replace(normOldAmountDiv, normNewAmountDiv);
  fs.writeFileSync(appPath, normApp.replace(/\n/g, '\r\n'), 'utf8');
  console.log('Successfully wrapped action buttons inside .zoho-addon-row-actions in app.js');
} else {
  console.error('Could not find oldAmountDiv in app.js');
}
