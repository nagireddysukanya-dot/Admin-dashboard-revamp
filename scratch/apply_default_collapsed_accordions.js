const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
const indexHtmlPath = path.join(__dirname, '..', 'frontend', 'index.html');

let appJsRaw = fs.readFileSync(appJsPath, 'utf8');
const isCRLF = appJsRaw.includes('\r\n');
let appJs = appJsRaw.replace(/\r\n/g, '\n');

console.log('--- Setting Drawer Accordions to Collapsed by Default ---');

// 1. Update Contact Persons card
const cpTarget = `            <!-- Header (Toggle) -->
            <div onclick="window.smatApp.toggleDrawerAccordion('contact-persons')" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer; user-select:none;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-weight:600; font-size:0.86rem; color:#0F172A;">Contact Persons</span>
                <span style="background:#94A3B8; color:#FFFFFF; font-size:0.7rem; font-weight:700; padding:1px 6px; border-radius:10px; display:inline-flex; align-items:center; justify-content:center; min-width:18px;">1</span>
              </div>
              <span id="zoho-drawer-chevron-contact-persons" style="display:inline-flex; align-items:center; color:#64748B;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </div>

            <!-- Body (Expanded) -->
            <div id="zoho-drawer-body-contact-persons" style="display:block; margin-top:12px; padding-top:12px; border-top:1px solid #F1F5F9;">`;

const cpReplacement = `            <!-- Header (Toggle) -->
            <div onclick="window.smatApp.toggleDrawerAccordion('contact-persons')" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer; user-select:none;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-weight:600; font-size:0.86rem; color:#0F172A;">Contact Persons</span>
                <span style="background:#94A3B8; color:#FFFFFF; font-size:0.7rem; font-weight:700; padding:1px 6px; border-radius:10px; display:inline-flex; align-items:center; justify-content:center; min-width:18px;">1</span>
              </div>
              <span id="zoho-drawer-chevron-contact-persons" style="display:inline-flex; align-items:center; color:#64748B;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </span>
            </div>

            <!-- Body (Collapsed by Default - expands on click) -->
            <div id="zoho-drawer-body-contact-persons" style="display:none; margin-top:12px; padding-top:12px; border-top:1px solid #F1F5F9;">`;

if (!appJs.includes(cpTarget)) {
  console.error('cpTarget not found in app.js!');
  process.exit(1);
}
appJs = appJs.replace(cpTarget, cpReplacement);
console.log('✓ Set Contact Persons to collapsed by default with right chevron');

// 2. Update Address card
const addrTarget = `            <!-- Header (Toggle) -->
            <div onclick="window.smatApp.toggleDrawerAccordion('address')" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer; user-select:none;">
              <span style="font-weight:600; font-size:0.86rem; color:#0F172A;">Address</span>
              <span id="zoho-drawer-chevron-address" style="display:inline-flex; align-items:center; color:#64748B;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </div>

            <!-- Body (Expanded) -->
            <div id="zoho-drawer-body-address" style="display:block; margin-top:12px; padding-top:12px; border-top:1px solid #F1F5F9;">`;

const addrReplacement = `            <!-- Header (Toggle) -->
            <div onclick="window.smatApp.toggleDrawerAccordion('address')" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer; user-select:none;">
              <span style="font-weight:600; font-size:0.86rem; color:#0F172A;">Address</span>
              <span id="zoho-drawer-chevron-address" style="display:inline-flex; align-items:center; color:#64748B;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </span>
            </div>

            <!-- Body (Collapsed by Default - expands on click) -->
            <div id="zoho-drawer-body-address" style="display:none; margin-top:12px; padding-top:12px; border-top:1px solid #F1F5F9;">`;

if (!appJs.includes(addrTarget)) {
  console.error('addrTarget not found in app.js!');
  process.exit(1);
}
appJs = appJs.replace(addrTarget, addrReplacement);
console.log('✓ Set Address to collapsed by default with right chevron');

// 3. Ensure toggleDrawerAccordion has robust display toggle
const oldFn = `  function toggleDrawerAccordion(section) {
    const body = document.getElementById(\`zoho-drawer-body-\${section}\`);
    const chevron = document.getElementById(\`zoho-drawer-chevron-\${section}\`);
    if (!body) return;
    const isHidden = body.style.display === 'none';
    body.style.display = isHidden ? 'block' : 'none';
    if (chevron) {
      chevron.innerHTML = isHidden 
        ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>'
        : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>';
    }
  }`;

const newFn = `  function toggleDrawerAccordion(section) {
    const body = document.getElementById(\`zoho-drawer-body-\${section}\`);
    const chevron = document.getElementById(\`zoho-drawer-chevron-\${section}\`);
    if (!body) return;
    const isHidden = body.style.display === 'none' || (!body.style.display && window.getComputedStyle(body).display === 'none');
    body.style.display = isHidden ? 'block' : 'none';
    if (chevron) {
      chevron.innerHTML = isHidden 
        ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>'
        : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>';
    }
  }`;

if (appJs.includes(oldFn)) {
  appJs = appJs.replace(oldFn, newFn);
  console.log('✓ Updated toggleDrawerAccordion helper function');
}

// Write back app.js
fs.writeFileSync(appJsPath, isCRLF ? appJs.replace(/\n/g, '\r\n') : appJs, 'utf8');
console.log('✓ Saved frontend/js/app.js');

// Bump cache version in index.html to v=12.0
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/app\.js\?v=[0-9.]+/g, 'app.js?v=12.0');
indexHtml = indexHtml.replace(/styles\.css\?v=[0-9.]+/g, 'styles.css?v=12.0');
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('✓ Bumped cache version in frontend/index.html to v=12.0');
