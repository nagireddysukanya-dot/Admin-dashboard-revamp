const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
const indexHtmlPath = path.join(__dirname, '..', 'frontend', 'index.html');

let appJsRaw = fs.readFileSync(appJsPath, 'utf8');
const isCRLF = appJsRaw.includes('\r\n');
let appJs = appJsRaw.replace(/\r\n/g, '\n');

console.log('--- Applying Drawer Contact Persons & Address Accordions ---');

// 1. Target block to replace in the drawer
const targetContactPersonsBlock = `          <!-- Contact Persons Card (Screenshot 2 Match) -->
          <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:8px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="if(typeof showToast==='function') showToast('Contact Person: \${escapeHtml(currClient.name)} (\${escapeHtml(currClient.email || '')})')">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-weight:600; font-size:0.86rem; color:#0F172A;">Contact Persons</span>
              <span style="background:#E2E8F0; color:#475569; font-size:0.72rem; font-weight:700; padding:1px 6px; border-radius:10px;">1</span>
            </div>
            <span style="color:#64748B; font-size:0.85rem;">&gt;</span>
          </div>`;

const newAccordionsBlock = `          <!-- Contact Persons Accordion Card (Exact Match to Screenshot 1) -->
          <div id="zoho-drawer-contact-persons-card" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:8px; padding:12px 16px; transition:all 0.2s ease;">
            <!-- Header (Toggle) -->
            <div onclick="window.smatApp.toggleDrawerAccordion('contact-persons')" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer; user-select:none;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-weight:600; font-size:0.86rem; color:#0F172A;">Contact Persons</span>
                <span style="background:#E2E8F0; color:#475569; font-size:0.72rem; font-weight:700; padding:1px 6px; border-radius:10px;">1</span>
              </div>
              <span id="zoho-drawer-chevron-contact-persons" style="color:#64748B; font-size:0.8rem; transition:transform 0.2s;">▾</span>
            </div>

            <!-- Body (Expanded) -->
            <div id="zoho-drawer-body-contact-persons" style="display:block; margin-top:12px; padding-top:12px; border-top:1px solid #F1F5F9;">
              <div style="display:flex; align-items:flex-start; gap:12px;">
                <!-- Avatar with Green Star Badge (Screenshot 1) -->
                <div style="position:relative; flex-shrink:0;">
                  <div style="width:34px; height:34px; border-radius:50%; background:#EEF2F6; color:#64748B; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.88rem;">
                    \${(currClient.name ? currClient.name.charAt(0) : 'S').toUpperCase()}
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
              <span id="zoho-drawer-chevron-address" style="color:#64748B; font-size:0.8rem; transition:transform 0.2s;">▾</span>
            </div>

            <!-- Body (Expanded) -->
            <div id="zoho-drawer-body-address" style="display:block; margin-top:12px; padding-top:12px; border-top:1px solid #F1F5F9;">
              <!-- Billing Address Subheading -->
              <div style="display:flex; align-items:center; gap:6px; font-size:0.78rem; font-weight:600; color:#64748B; margin-bottom:8px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line></svg>
                <span>Billing Address</span>
              </div>

              <!-- Billing Address Lines with subtle vertical left line (Screenshot 2) -->
              <div style="border-left:2px solid #E2E8F0; padding-left:12px; margin-left:2px; font-size:0.82rem; color:#334155; line-height:1.45;">
                <div style="font-weight:700; color:#0F172A;">\${escapeHtml(bAddress.company || currClient.company_name || 'feso')}</div>
                <div>\${escapeHtml(bAddress.line1 || 'test')}</div>
                <div>\${escapeHtml(bAddress.line2 || 'test')}</div>
                <div>\${escapeHtml(bAddress.city || 'Hyderabad')} \${escapeHtml(bAddress.pin || '500034')}</div>
                <div>\${escapeHtml(bAddress.country || 'India')}</div>
              </div>

              <div style="margin:14px 0 10px 0; border-top:1px dashed #F1F5F9;"></div>

              <!-- Shipping Address Subheading -->
              <div style="font-size:0.78rem; font-weight:600; color:#64748B; margin-bottom:8px;">
                Shipping Address
              </div>

              <!-- Shipping Address Lines (or "No Shipping Address" if empty) -->
              \${hasShipping ? \`
                <div style="border-left:2px solid #E2E8F0; padding-left:12px; margin-left:2px; font-size:0.82rem; color:#334155; line-height:1.45;">
                  <div style="font-weight:700; color:#0F172A;">\${escapeHtml(sAddress.company || currClient.company_name || '')}</div>
                  <div>\${escapeHtml(sAddress.line1 || '')}</div>
                  <div>\${escapeHtml(sAddress.line2 || '')}</div>
                  <div>\${escapeHtml(sAddress.city || '')} \${escapeHtml(sAddress.pin || '')}</div>
                  <div>\${escapeHtml(sAddress.country || '')}</div>
                </div>
              \` : \`
                <div style="display:flex; align-items:center; justify-content:center; gap:8px; padding:10px 0; color:#94A3B8; font-size:0.82rem;">
                  <span style="border-left:2px solid #E2E8F0; height:14px;"></span>
                  <span>No Shipping Address</span>
                </div>
              \`}
            </div>
          </div>`;

if (!appJs.includes(targetContactPersonsBlock)) {
  console.error('Could not find targetContactPersonsBlock in app.js!');
  process.exit(1);
}

appJs = appJs.replace(targetContactPersonsBlock, newAccordionsBlock);
console.log('✓ Replaced Contact Persons card with both accordions');

// 2. Add toggleDrawerAccordion function
const accordionHelper = `
  function toggleDrawerAccordion(section) {
    const body = document.getElementById(\`zoho-drawer-body-\${section}\`);
    const chevron = document.getElementById(\`zoho-drawer-chevron-\${section}\`);
    if (!body) return;
    const isHidden = body.style.display === 'none';
    body.style.display = isHidden ? 'block' : 'none';
    if (chevron) {
      chevron.innerText = isHidden ? '▾' : '>';
    }
  }
`;

const openCustomerSidebarMarker = 'function openCustomerSidebar() {';
if (!appJs.includes(openCustomerSidebarMarker)) {
  console.error('openCustomerSidebarMarker not found in app.js!');
  process.exit(1);
}

appJs = appJs.replace(openCustomerSidebarMarker, accordionHelper + '\n  ' + openCustomerSidebarMarker);
console.log('✓ Added toggleDrawerAccordion function');

// 3. Export toggleDrawerAccordion on window.smatApp
appJs = appJs.replace(
  'toggleCustomerSidebar,',
  'toggleCustomerSidebar,\n    toggleDrawerAccordion,'
);
console.log('✓ Exported toggleDrawerAccordion on window.smatApp');

// Write back app.js
fs.writeFileSync(appJsPath, isCRLF ? appJs.replace(/\n/g, '\r\n') : appJs, 'utf8');
console.log('✓ Saved app.js');

// 4. Bump cache version to v=11.7 in index.html
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/app\.js\?v=[0-9.]+/g, 'app.js?v=11.7');
indexHtml = indexHtml.replace(/styles\.css\?v=[0-9.]+/g, 'styles.css?v=11.7');
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('✓ Bumped frontend/index.html to v=11.7');
