const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
const indexHtmlPath = path.join(__dirname, '..', 'frontend', 'index.html');

let appJsRaw = fs.readFileSync(appJsPath, 'utf8');
const isCRLF = appJsRaw.includes('\r\n');
let appJs = appJsRaw.replace(/\r\n/g, '\n');

console.log('--- Removing Unpaid Invoices and Activity Log Tabs ---');

// Target block in Navigation Tabs
const oldTabsBlock = `        <!-- Navigation Tabs -->
        <div style="padding:0 20px; background:#FFFFFF; border-bottom:1px solid #E2E8F0; display:flex; gap:20px;">
          <div style="padding:10px 0; font-size:0.86rem; font-weight:700; color:#1E293B; border-bottom:2px solid #2563EB; cursor:pointer;">Details</div>
          <div style="padding:10px 0; font-size:0.86rem; font-weight:500; color:#64748B; cursor:pointer; display:flex; align-items:center; gap:6px;">
            <span>Unpaid Invoices</span>
            <span style="background:#E2E8F0; color:#475569; font-size:0.72rem; font-weight:700; padding:1px 6px; border-radius:10px;">18</span>
          </div>
          <div style="padding:10px 0; font-size:0.86rem; font-weight:500; color:#64748B; cursor:pointer;">Activity Log</div>
        </div>`;

const newTabsBlock = `        <!-- Navigation Tabs -->
        <div style="padding:0 20px; background:#FFFFFF; border-bottom:1px solid #E2E8F0; display:flex; gap:20px;">
          <div style="padding:10px 0; font-size:0.86rem; font-weight:700; color:#1E293B; border-bottom:2px solid #2563EB; cursor:pointer;">Details</div>
        </div>`;

if (!appJs.includes(oldTabsBlock)) {
  console.error('Could not find oldTabsBlock in app.js!');
  process.exit(1);
}

appJs = appJs.replace(oldTabsBlock, newTabsBlock);
console.log('✓ Successfully removed Unpaid Invoices and Activity Log tabs');

// Write back app.js
fs.writeFileSync(appJsPath, isCRLF ? appJs.replace(/\n/g, '\r\n') : appJs, 'utf8');
console.log('✓ Saved frontend/js/app.js');

// Bump cache version in index.html to v=11.9
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/app\.js\?v=[0-9.]+/g, 'app.js?v=11.9');
indexHtml = indexHtml.replace(/styles\.css\?v=[0-9.]+/g, 'styles.css?v=11.9');
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('✓ Bumped cache version in frontend/index.html to v=11.9');
