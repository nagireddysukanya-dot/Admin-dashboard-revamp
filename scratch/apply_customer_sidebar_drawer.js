const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
const stylesCssPath = path.join(__dirname, '..', 'frontend', 'css', 'styles.css');
const indexHtmlPath = path.join(__dirname, '..', 'frontend', 'index.html');

let appJsRaw = fs.readFileSync(appJsPath, 'utf8');
const isCRLF = appJsRaw.includes('\r\n');
let appJs = appJsRaw.replace(/\r\n/g, '\n');

console.log('--- Implementing Customer Right Sidebar Tab & Slide-over Drawer ---');

// 1. Add the Customer Sidebar Tab Button and Drawer HTML inside renderZohoSubscriptionReferenceView
const sidebarTabAndDrawerHtml = `
      <!-- ========================================================================= -->
      <!-- ZOHO CUSTOMER SIDEBAR TAB & SLIDE-OVER DRAWER (EXACT MATCH TO SCREENSHOTS)-->
      <!-- ========================================================================= -->
      <!-- Docked Right Tab Button (Screenshot 1) -->
      <div id="zoho-customer-sidebar-tab" 
           onclick="window.smatApp.toggleCustomerSidebar()" 
           title="Click to view Customer Details">
        <span style="max-width:130px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
          \${escapeHtml(currClient.name)} - \${escapeHtml((currClient.email || '').substring(0, 10))}...
        </span>
        <span style="font-size:0.75rem; color:#94A3B8; font-weight:700;">&gt;</span>
      </div>

      <!-- Backdrop -->
      <div id="zoho-customer-sidebar-backdrop" 
           onclick="window.smatApp.closeCustomerSidebar()"></div>

      <!-- Slide-over Drawer (Screenshot 2) -->
      <div id="zoho-customer-sidebar-drawer">
        <!-- Header -->
        <div style="padding:16px 20px; background:#FFFFFF; border-bottom:1px solid #E2E8F0;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div style="display:flex; align-items:center; gap:12px;">
              <!-- Avatar [ D ] -->
              <div style="width:40px; height:40px; background:#F1F5F9; color:#475569; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1.15rem; flex-shrink:0;">
                \${(currClient.name || 'D').charAt(0).toUpperCase()}
              </div>
              <div>
                <div style="font-size:0.75rem; color:#64748B; font-weight:500;">Customer</div>
                <div style="display:flex; align-items:center; gap:6px; margin-top:2px;">
                  <span style="font-weight:700; font-size:0.95rem; color:#0F172A; max-width:210px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                    \${escapeHtml(currClient.name)} - \${escapeHtml((currClient.email || '').substring(0, 10))}...
                  </span>
                  <!-- External Link Icon with Tooltip -->
                  <div class="zoho-cust-link-wrapper" style="position:relative; display:inline-flex; align-items:center;">
                    <a href="javascript:void(0)" onclick="window.smatApp.navigateTo('client-details')" style="color:#2563EB; display:inline-flex; align-items:center; text-decoration:none;" title="View in Customers module">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <!-- Red Close Button ✕ -->
            <button type="button" onclick="window.smatApp.closeCustomerSidebar()" style="background:none; border:none; color:#EF4444; font-size:1.2rem; cursor:pointer; line-height:1; padding:4px;" title="Close">✕</button>
          </div>

          <!-- Document / Company & Email Rows -->
          <div style="margin-top:14px; display:flex; flex-direction:column; gap:5px; font-size:0.83rem; color:#475569;">
            <div style="display:flex; align-items:center; gap:8px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <span>\${escapeHtml(bAddress.company || currClient.company_name || 'feso')}</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <span>\${escapeHtml(currClient.email || 'suryadesigner1234@gmail.com')}</span>
            </div>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div style="padding:0 20px; background:#FFFFFF; border-bottom:1px solid #E2E8F0; display:flex; gap:20px;">
          <div style="padding:10px 0; font-size:0.86rem; font-weight:700; color:#1E293B; border-bottom:2px solid #2563EB; cursor:pointer;">Details</div>
          <div style="padding:10px 0; font-size:0.86rem; font-weight:500; color:#64748B; cursor:pointer; display:flex; align-items:center; gap:6px;">
            <span>Unpaid Invoices</span>
            <span style="background:#E2E8F0; color:#475569; font-size:0.72rem; font-weight:700; padding:1px 6px; border-radius:10px;">18</span>
          </div>
          <div style="padding:10px 0; font-size:0.86rem; font-weight:500; color:#64748B; cursor:pointer;">Activity Log</div>
        </div>

        <!-- Drawer Content Body -->
        <div style="padding:16px 20px; display:flex; flex-direction:column; gap:14px; overflow-y:auto; flex:1;">
          <!-- Metric Cards Row -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <!-- Outstanding Receivables -->
            <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:8px; padding:12px 10px; text-align:center;">
              <div style="color:#F59E0B; margin-bottom:4px; display:flex; justify-content:center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="#F59E0B"/><line x1="12" y1="9" x2="12" y2="13" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="17" r="1.2" fill="#FFFFFF"/></svg>
              </div>
              <div style="font-size:0.72rem; color:#64748B; margin-bottom:4px;">Outstanding Receivables</div>
              <div style="font-size:1.1rem; font-weight:700; color:#0F172A;">Rs.25,045.24</div>
            </div>

            <!-- Unused Credits -->
            <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:8px; padding:12px 10px; text-align:center;">
              <div style="color:#10B981; margin-bottom:4px; display:flex; justify-content:center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><circle cx="12" cy="12" r="9"></circle><path d="M9 12l2 2 4-4"></path></svg>
              </div>
              <div style="font-size:0.72rem; color:#64748B; margin-bottom:4px;">Unused Credits</div>
              <div style="font-size:1.1rem; font-weight:700; color:#0F172A;">Rs.0.00</div>
            </div>
          </div>

          <!-- Contact Details Card (Screenshot 2 Match) -->
          <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:8px; padding:16px 18px;">
            <div style="font-weight:700; font-size:0.88rem; color:#0F172A; margin-bottom:14px;">Contact Details</div>
            <div style="display:flex; flex-direction:column; gap:10px; font-size:0.83rem;">
              <div style="display:flex; justify-content:space-between;"><span style="color:#64748B;">Customer Type</span><span style="font-weight:600; color:#0F172A;">Business</span></div>
              <div style="display:flex; justify-content:space-between;"><span style="color:#64748B;">Currency</span><span style="font-weight:600; color:#0F172A;">\${currClient.currency_type || 'INR'}</span></div>
              <div style="display:flex; justify-content:space-between;"><span style="color:#64748B;">Payment Terms</span><span style="font-weight:600; color:#0F172A;">Due on Receipt</span></div>
              <div style="display:flex; justify-content:space-between;"><span style="color:#64748B;">Portal Status</span><span style="color:#64748B;">Disabled</span></div>
              <div style="display:flex; justify-content:space-between;"><span style="color:#64748B;">GST Treatment</span><span style="font-weight:600; color:#0F172A;">\${currClient.gst_treatment || 'Unregistered Business'}</span></div>
              <div style="display:flex; justify-content:space-between;"><span style="color:#64748B;">Place of Supply</span><span style="font-weight:600; color:#0F172A;">\${currClient.place_of_supply || 'Telangana'}</span></div>
              <div style="display:flex; justify-content:space-between;"><span style="color:#64748B;">Tax Preference</span><span style="font-weight:600; color:#0F172A;">Taxable</span></div>
              <div style="display:flex; justify-content:space-between;"><span style="color:#64748B;">Source</span><span style="font-weight:600; color:#0F172A;">API</span></div>
              <div style="display:flex; justify-content:space-between;"><span style="color:#64748B;">Type of Account</span><span style="font-weight:600; color:#0F172A;">Direct Customer</span></div>
              <div style="display:flex; justify-content:space-between;"><span style="color:#64748B;">expiry_emails</span><span style="font-weight:600; color:#0F172A;">Yes</span></div>
            </div>
          </div>

          <!-- Contact Persons Card (Screenshot 2 Match) -->
          <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:8px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="if(typeof showToast==='function') showToast('Contact Person: \${escapeHtml(currClient.name)} (\${escapeHtml(currClient.email || '')})')">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-weight:600; font-size:0.86rem; color:#0F172A;">Contact Persons</span>
              <span style="background:#E2E8F0; color:#475569; font-size:0.72rem; font-weight:700; padding:1px 6px; border-radius:10px;">1</span>
            </div>
            <span style="color:#64748B; font-size:0.85rem;">&gt;</span>
          </div>
        </div>
      </div>
`;

// Insert sidebarTabAndDrawerHtml right after `<div class="zoho-sub-fullpage-wrap" ...>`
const targetFullpageStart = '<div class="zoho-sub-fullpage-wrap" style="background:#FFFFFF; min-height:100vh; padding-bottom:5rem;">';
if (!appJs.includes(targetFullpageStart)) {
  console.error('targetFullpageStart not found in app.js!');
  process.exit(1);
}

appJs = appJs.replace(targetFullpageStart, targetFullpageStart + '\n' + sidebarTabAndDrawerHtml);
console.log('✓ Added Customer Sidebar Tab & Drawer to subscription reference view');

// 2. Add JavaScript helper functions for opening/closing sidebar
const jsHelperFunctions = `
  // =========================================================================
  // ZOHO CUSTOMER RIGHT SIDEBAR TAB & DRAWER TOGGLE (SCREENSHOTS 1 & 2)
  // =========================================================================
  function openCustomerSidebar() {
    const drawer = document.getElementById('zoho-customer-sidebar-drawer');
    const backdrop = document.getElementById('zoho-customer-sidebar-backdrop');
    if (drawer) drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
  }

  function closeCustomerSidebar() {
    const drawer = document.getElementById('zoho-customer-sidebar-drawer');
    const backdrop = document.getElementById('zoho-customer-sidebar-backdrop');
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
  }

  function toggleCustomerSidebar() {
    const drawer = document.getElementById('zoho-customer-sidebar-drawer');
    if (drawer && drawer.classList.contains('open')) {
      closeCustomerSidebar();
    } else {
      openCustomerSidebar();
    }
  }
`;

// Insert jsHelperFunctions before toggleDiscountPrefDropdown
const toggleDiscountMarker = 'function toggleDiscountPrefDropdown(e) {';
if (!appJs.includes(toggleDiscountMarker)) {
  console.error('toggleDiscountMarker not found in app.js!');
  process.exit(1);
}
appJs = appJs.replace(toggleDiscountMarker, jsHelperFunctions + '\n  ' + toggleDiscountMarker);
console.log('✓ Added Customer Sidebar toggle helper functions');

// 3. Export on window.smatApp
const exportTarget = '    toggleDiscountPrefDropdown,';
const newExports = `    openCustomerSidebar,
    closeCustomerSidebar,
    toggleCustomerSidebar,
    toggleDiscountPrefDropdown,`;

appJs = appJs.replace(exportTarget, newExports);
console.log('✓ Exported customer sidebar functions on window.smatApp');

// Write back app.js
fs.writeFileSync(appJsPath, isCRLF ? appJs.replace(/\n/g, '\r\n') : appJs, 'utf8');
console.log('✓ Saved app.js');

// 4. Append CSS styles for tab and drawer to styles.css
let stylesCss = fs.readFileSync(stylesCssPath, 'utf8');
const sidebarCss = `
/* ========================================================================= */
/* ZOHO CUSTOMER SIDEBAR TAB & SLIDE-OVER DRAWER (SCREENSHOTS 1 & 2 MATCH)   */
/* ========================================================================= */
#zoho-customer-sidebar-tab {
  position: fixed;
  right: 0;
  top: 155px;
  z-index: 9999;
  background: #334155;
  color: #FFFFFF;
  padding: 6px 10px 6px 14px;
  border-radius: 6px 0 0 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: -2px 4px 12px rgba(0, 0, 0, 0.18);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
}

#zoho-customer-sidebar-tab:hover {
  background: #1E293B;
  padding-right: 14px;
  box-shadow: -4px 6px 16px rgba(0, 0, 0, 0.25);
}

#zoho-customer-sidebar-backdrop {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.35);
  backdrop-filter: blur(1.5px);
  z-index: 99999;
  transition: opacity 0.25s ease;
}

#zoho-customer-sidebar-backdrop.open {
  display: block;
}

#zoho-customer-sidebar-drawer {
  position: fixed;
  top: 0;
  right: -420px;
  width: 380px;
  max-width: 92vw;
  height: 100vh;
  background: #F8FAFC;
  box-shadow: -6px 0 35px rgba(0, 0, 0, 0.2);
  z-index: 100000;
  display: flex;
  flex-direction: column;
  transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

#zoho-customer-sidebar-drawer.open {
  right: 0;
}

.zoho-cust-link-wrapper:hover::after {
  content: "View in Customers module";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 6px;
  background: #1E293B;
  color: #FFFFFF;
  font-size: 0.72rem;
  font-weight: 500;
  white-space: nowrap;
  padding: 4px 8px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  z-index: 100010;
  pointer-events: none;
}
`;

if (!stylesCss.includes('zoho-customer-sidebar-tab')) {
  stylesCss += sidebarCss;
  fs.writeFileSync(stylesCssPath, stylesCss, 'utf8');
  console.log('✓ Appended sidebar styles to styles.css');
}

// 5. Bump cache version to v=11.6 in index.html
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/app\.js\?v=[0-9.]+/g, 'app.js?v=11.6');
indexHtml = indexHtml.replace(/styles\.css\?v=[0-9.]+/g, 'styles.css?v=11.6');
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('✓ Bumped frontend/index.html cache version to v=11.6');
