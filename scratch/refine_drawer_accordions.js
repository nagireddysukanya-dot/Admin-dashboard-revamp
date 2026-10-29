const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
const indexHtmlPath = path.join(__dirname, '..', 'frontend', 'index.html');

let appJsRaw = fs.readFileSync(appJsPath, 'utf8');
const isCRLF = appJsRaw.includes('\r\n');
let appJs = appJsRaw.replace(/\r\n/g, '\n');

console.log('--- Refining Drawer Contact Persons and Address Accordions ---');

// 1. Locate the current Contact Persons & Address accordion block in app.js
const startMarker = '<!-- Contact Persons Accordion Card (Exact Match to Screenshot 1) -->';
const endMarker = '<!-- Plan Removal Warning Confirmation Modal (Exact Match to User Reference Screenshot) -->';

const startIdx = appJs.indexOf(startMarker);
const endIdx = appJs.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not locate accordion block in app.js!');
  console.log('startIdx:', startIdx, 'endIdx:', endIdx);
  process.exit(1);
}

const refinedAccordionsHtml = `<!-- Contact Persons Accordion Card (Exact Match to Screenshot 1 & 2) -->
          <div id="zoho-drawer-contact-persons-card" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:8px; padding:12px 16px; transition:all 0.2s ease;">
            <!-- Header (Toggle) -->
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
            <div id="zoho-drawer-body-contact-persons" style="display:block; margin-top:12px; padding-top:12px; border-top:1px solid #F1F5F9;">
              <div style="display:flex; align-items:center; gap:12px;">
                <!-- Avatar with Green Star Badge (Screenshot 1) -->
                <div style="position:relative; flex-shrink:0;">
                  <div style="width:34px; height:34px; border-radius:50%; background:#EEF2F6; color:#64748B; display:flex; align-items:center; justify-content:center; font-weight:600; font-size:0.88rem;">
                    S
                  </div>
                  <!-- Green Circle with White Star Badge -->
                  <div style="position:absolute; bottom:-3px; right:-3px; width:15px; height:15px; background:#10B981; border:2px solid #FFFFFF; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#FFFFFF; font-size:8px; box-shadow:0 1px 2px rgba(0,0,0,0.1);">
                    ★
                  </div>
                </div>

                <!-- Contact Details Info -->
                <div style="display:flex; flex-direction:column; gap:4px; font-size:0.82rem; color:#475569;">
                  <div style="display:flex; align-items:center; gap:6px;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    <span>\${escapeHtml(currClient.email || 'suryadesigner1234@gmail.com')}</span>
                  </div>
                  <div style="display:flex; align-items:center; gap:6px;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                    <span>\${escapeHtml(currClient.phone_number || '+91 9705736759')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Address Accordion Card (Exact Match to Screenshot 2) -->
          <div id="zoho-drawer-address-card" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:8px; padding:12px 16px; transition:all 0.2s ease;">
            <!-- Header (Toggle) -->
            <div onclick="window.smatApp.toggleDrawerAccordion('address')" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer; user-select:none;">
              <span style="font-weight:600; font-size:0.86rem; color:#0F172A;">Address</span>
              <span id="zoho-drawer-chevron-address" style="display:inline-flex; align-items:center; color:#64748B;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </div>

            <!-- Body (Expanded) -->
            <div id="zoho-drawer-body-address" style="display:block; margin-top:12px; padding-top:12px; border-top:1px solid #F1F5F9;">
              <!-- Billing Address Subheading with Document/Clipboard Icon (Screenshot 2) -->
              <div style="display:flex; align-items:center; gap:6px; font-size:0.82rem; font-weight:500; color:#64748B; margin-bottom:10px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                <span>Billing Address</span>
              </div>

              <!-- Billing Address Lines with subtle vertical left line (Screenshot 2) -->
              <div style="border-left:2px solid #E2E8F0; padding-left:12px; margin-left:2px; font-size:0.82rem; color:#334155; line-height:1.5;">
                <div style="font-weight:700; color:#0F172A;">\${escapeHtml(bAddress.company || currClient.company_name || 'feso')}</div>
                <div>\${escapeHtml(bAddress.line1 || 'test')}</div>
                <div>\${escapeHtml(bAddress.line2 || 'test')}</div>
                <div>\${escapeHtml(bAddress.city || 'Hyderabad')} \${escapeHtml(bAddress.pin || '500034')}</div>
                <div>\${escapeHtml(bAddress.country || 'India')}</div>
              </div>

              <!-- Shipping Address Subheading (Clean spacing, no dashed divider) -->
              <div style="font-size:0.82rem; font-weight:500; color:#64748B; margin:16px 0 10px 0;">
                Shipping Address
              </div>

              <!-- Shipping Address Lines (Aligned vertical left line + Centered "No Shipping Address" - Screenshot 2) -->
              \${hasShipping ? \`
                <div style="border-left:2px solid #E2E8F0; padding-left:12px; margin-left:2px; font-size:0.82rem; color:#334155; line-height:1.5;">
                  <div style="font-weight:700; color:#0F172A;">\${escapeHtml(sAddress.company || currClient.company_name || '')}</div>
                  <div>\${escapeHtml(sAddress.line1 || '')}</div>
                  <div>\${escapeHtml(sAddress.line2 || '')}</div>
                  <div>\${escapeHtml(sAddress.city || '')} \${escapeHtml(sAddress.pin || '')}</div>
                  <div>\${escapeHtml(sAddress.country || '')}</div>
                </div>
              \` : \`
                <div style="border-left:2px solid #E2E8F0; margin-left:2px; padding:8px 12px; display:flex; justify-content:center; align-items:center; min-height:36px;">
                  <span style="color:#94A3B8; font-size:0.82rem;">No Shipping Address</span>
                </div>
              \`}
            </div>
          </div>
        </div>
      </div>

      `;

appJs = appJs.substring(0, startIdx) + refinedAccordionsHtml + appJs.substring(endIdx);
console.log('✓ Successfully replaced accordion block');

// 2. Refine toggleDrawerAccordion function to toggle SVG chevrons cleanly
const oldHelper = `  function toggleDrawerAccordion(section) {
    const body = document.getElementById(\`zoho-drawer-body-\${section}\`);
    const chevron = document.getElementById(\`zoho-drawer-chevron-\${section}\`);
    if (!body) return;
    const isHidden = body.style.display === 'none';
    body.style.display = isHidden ? 'block' : 'none';
    if (chevron) {
      chevron.innerText = isHidden ? '▾' : '>';
    }
  }`;

const newHelper = `  function toggleDrawerAccordion(section) {
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

if (appJs.includes(oldHelper)) {
  appJs = appJs.replace(oldHelper, newHelper);
  console.log('✓ Updated toggleDrawerAccordion helper to use SVG chevrons');
} else {
  console.log('Checking alternative format for toggleDrawerAccordion...');
  const altOldHelper = appJs.match(/function toggleDrawerAccordion\([\s\S]*?chevron\.innerText = isHidden \? '▾' : '>';[\s\S]*?\}/);
  if (altOldHelper) {
    appJs = appJs.replace(altOldHelper[0], newHelper.trim());
    console.log('✓ Replaced regex matched toggleDrawerAccordion');
  }
}

// Save app.js
fs.writeFileSync(appJsPath, isCRLF ? appJs.replace(/\n/g, '\r\n') : appJs, 'utf8');
console.log('✓ Saved updated frontend/js/app.js');

// 3. Bump version in index.html to v=11.8
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/app\.js\?v=[0-9.]+/g, 'app.js?v=11.8');
indexHtml = indexHtml.replace(/styles\.css\?v=[0-9.]+/g, 'styles.css?v=11.8');
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('✓ Bumped cache version in frontend/index.html to v=11.8');
