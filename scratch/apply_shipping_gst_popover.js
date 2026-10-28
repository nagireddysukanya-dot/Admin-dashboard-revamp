const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');
let norm = appContent.replace(/\r\n/g, '\n');

// 1. Target the Shipping Recipient GST Details block
const oldShippingGstBlock = `                <!-- Shipping Recipient GST Details -->
                <div>
                  <div style="display:flex; align-items:center; gap:6px; font-size:0.75rem; font-weight:700; color:#6B7280; text-transform:uppercase; margin-bottom:0.35rem;">
                    <span>SHIPPING RECIPIENT GST DETAILS</span>
                    <span style="cursor:pointer; display:inline-flex; align-items:center;" title="Edit Shipping GST"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></span>
                  </div>
                  <div style="color:#4B5563;">GSTIN: <span style="color:#111827; font-weight:500;">\${escapeHtml(currClient.gst_number || '')}</span></div>
                  <div style="color:#4B5563;">Business Legal Name: <span style="color:#111827; font-weight:500;">\${escapeHtml(currClient.legal_name || '')}</span></div>
                </div>`;

const newShippingGstBlock = `                <!-- Shipping Recipient GST Details -->
                <div style="position:relative;" class="zoho-ship-gst-wrap">
                  <div style="display:flex; align-items:center; gap:6px; font-size:0.75rem; font-weight:700; color:#6B7280; text-transform:uppercase; margin-bottom:0.35rem;">
                    <span>SHIPPING RECIPIENT GST DETAILS</span>
                    <span class="zoho-ship-gst-trigger" onclick="event.stopPropagation(); window.smatApp.toggleShippingGstPopover(event)" style="cursor:pointer; display:inline-flex; align-items:center;" title="Edit Shipping GST">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </span>
                  </div>
                  <div style="color:#4B5563;">GSTIN: <span id="zoho-shipping-gstin-display" style="color:#111827; font-weight:500;">\${escapeHtml(currClient.gst_number || '')}</span></div>
                  <div style="color:#4B5563;">Business Legal Name: <span id="zoho-shipping-legal-name-display" style="color:#111827; font-weight:500;">\${escapeHtml(currClient.legal_name || '')}</span></div>

                  <!-- Shipping Recipient GST Details Popover (Screenshot 1 Match) -->
                  <div id="zoho-ship-gst-popover" class="zoho-ship-gst-popover" style="display:none; position:absolute; bottom:calc(100% + 10px); left:-10px; z-index:9999; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:8px; box-shadow:0 12px 30px rgba(0,0,0,0.18); width:310px; padding:14px 16px;">
                    <!-- Bottom-pointing triangle arrow -->
                    <div style="position:absolute; bottom:-6px; left:160px; width:10px; height:10px; background:#FFFFFF; border-right:1px solid #E5E7EB; border-bottom:1px solid #E5E7EB; transform:rotate(45deg);"></div>

                    <!-- Header with Red Close Button -->
                    <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:8px; border-bottom:1px solid #E5E7EB; margin-bottom:12px;">
                      <div style="font-size:0.95rem; font-weight:600; color:#1E293B;">Shipping Recipient GST Details</div>
                      <button type="button" onclick="event.stopPropagation(); window.smatApp.closeShippingGstPopover()" style="border:none; background:none; color:#EF4444; font-size:1.15rem; font-weight:700; cursor:pointer; line-height:1; padding:0 2px;" title="Close">✕</button>
                    </div>

                    <!-- GSTIN and is Unregistered Person? -->
                    <div style="margin-bottom:12px;">
                      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                        <label style="font-size:0.83rem; font-weight:500; color:#4B5563;">GSTIN</label>
                        <label style="display:inline-flex; align-items:center; gap:5px; font-size:0.8rem; color:#4B5563; cursor:pointer;">
                          <input type="checkbox" id="zoho-ship-unregistered-check" style="accent-color:#2563EB; width:14px; height:14px;" onchange="window.smatApp.onShippingGstUnregChange(this.checked)" />
                          <span>is Unregistered Person?</span>
                        </label>
                      </div>
                      <input type="text" id="zoho-ship-gstin-input" value="\${escapeHtml(currClient.gst_number || '')}" placeholder="" style="width:100%; border:1px solid #CBD5E1; border-radius:4px; padding:6px 10px; font-size:0.86rem; color:#1E293B; outline:none;" />
                    </div>

                    <!-- Business Legal Name -->
                    <div style="margin-bottom:12px;">
                      <label style="display:block; font-size:0.83rem; font-weight:500; color:#4B5563; margin-bottom:5px;">Business Legal Name</label>
                      <input type="text" id="zoho-ship-legal-name-input" value="\${escapeHtml(currClient.legal_name || '')}" placeholder="" style="width:100%; border:1px solid #CBD5E1; border-radius:4px; padding:6px 10px; font-size:0.86rem; color:#1E293B; outline:none;" />
                    </div>

                    <!-- Business Trade Name -->
                    <div style="margin-bottom:14px;">
                      <label style="display:block; font-size:0.83rem; font-weight:500; color:#4B5563; margin-bottom:5px;">Business Trade Name</label>
                      <input type="text" id="zoho-ship-trade-name-input" value="\${escapeHtml(currClient.trade_name || currClient.company_name || '')}" placeholder="" style="width:100%; border:1px solid #CBD5E1; border-radius:4px; padding:6px 10px; font-size:0.86rem; color:#1E293B; outline:none;" />
                    </div>

                    <!-- Actions -->
                    <div style="display:flex; gap:8px; padding-top:10px; border-top:1px solid #F1F5F9;">
                      <button type="button" onclick="event.stopPropagation(); window.smatApp.saveShippingGstPreferences()" style="background:#2563EB; color:#FFFFFF; border:none; border-radius:4px; padding:6px 16px; font-size:0.84rem; font-weight:600; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,0.05);">Update</button>
                      <button type="button" onclick="event.stopPropagation(); window.smatApp.closeShippingGstPopover()" style="background:#FFFFFF; border:1px solid #D1D5DB; color:#374151; border-radius:4px; padding:6px 14px; font-size:0.84rem; font-weight:500; cursor:pointer;">Cancel</button>
                    </div>
                  </div>
                </div>`;

if (norm.includes(oldShippingGstBlock)) {
  norm = norm.replace(oldShippingGstBlock, newShippingGstBlock);
  console.log('Replaced Shipping Recipient GST Details with Popover');
} else {
  console.error('Could not find oldShippingGstBlock in app.js');
}

// 2. Add helper functions
const shippingGstFunctions = `
  function toggleShippingGstPopover(evt) {
    if (evt) evt.stopPropagation();
    const pop = document.getElementById('zoho-ship-gst-popover');
    if (!pop) return;
    const isCurrentlyOpen = pop.style.display === 'block';
    closeAllMorePopovers();
    closeGstPreferencesPopover();
    document.querySelectorAll('.zoho-addr-popover').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.zoho-sac-popover').forEach(p => p.style.display = 'none');
    if (!isCurrentlyOpen) {
      pop.style.display = 'block';
    } else {
      pop.style.display = 'none';
    }
  }

  function closeShippingGstPopover() {
    const pop = document.getElementById('zoho-ship-gst-popover');
    if (pop) pop.style.display = 'none';
  }

  function onShippingGstUnregChange(isUnreg) {
    const gstinInput = document.getElementById('zoho-ship-gstin-input');
    if (gstinInput) {
      if (isUnreg) {
        gstinInput.disabled = true;
        gstinInput.style.background = '#F9FAFB';
        gstinInput.value = '';
      } else {
        gstinInput.disabled = false;
        gstinInput.style.background = '#FFFFFF';
      }
    }
  }

  function saveShippingGstPreferences() {
    const isUnreg = document.getElementById('zoho-ship-unregistered-check')?.checked;
    const gstin = isUnreg ? '' : (document.getElementById('zoho-ship-gstin-input')?.value || '');
    const legalName = document.getElementById('zoho-ship-legal-name-input')?.value || '';
    const tradeName = document.getElementById('zoho-ship-trade-name-input')?.value || '';

    const currClient = clientsData.find(c => c.id === zohoSubscriptionClientId || c.id === Number(zohoSubscriptionClientId)) || clientsData[0];
    if (currClient) {
      currClient.gst_number = gstin;
      currClient.legal_name = legalName;
      currClient.trade_name = tradeName;
    }

    const gstinDisp = document.getElementById('zoho-shipping-gstin-display');
    if (gstinDisp) gstinDisp.innerText = gstin;
    const legalDisp = document.getElementById('zoho-shipping-legal-name-display');
    if (legalDisp) legalDisp.innerText = legalName;

    closeShippingGstPopover();
  }
`;

const targetBeforeHelper = `  function closeAllMorePopovers() {`;
if (norm.includes(targetBeforeHelper)) {
  norm = norm.replace(targetBeforeHelper, shippingGstFunctions + '\n' + targetBeforeHelper);
  console.log('Added Shipping GST popover helper functions');
}

// 3. Add to outside click listener
const oldOutsideCheck = `      // 3. GST Preferences popover close on tap anywhere outside
      if (!e.target.closest('.zoho-gst-pref-popover') && !e.target.closest('.zoho-gst-pref-trigger')) {
        closeGstPreferencesPopover();
      }`;

const newOutsideCheck = `      // 3. GST Preferences popover close on tap anywhere outside
      if (!e.target.closest('.zoho-gst-pref-popover') && !e.target.closest('.zoho-gst-pref-trigger')) {
        closeGstPreferencesPopover();
      }

      // 4. Shipping GST Popover close on tap anywhere outside
      if (!e.target.closest('.zoho-ship-gst-popover') && !e.target.closest('.zoho-ship-gst-trigger')) {
        closeShippingGstPopover();
      }`;

if (norm.includes(oldOutsideCheck)) {
  norm = norm.replace(oldOutsideCheck, newOutsideCheck);
  console.log('Updated outside click listener to close Shipping GST popover');
}

// 4. Add methods to export list
const oldExport = `    toggleGstPreferencesPopover,
    closeGstPreferencesPopover,
    saveGstPreferences,`;

const newExport = `    toggleGstPreferencesPopover,
    closeGstPreferencesPopover,
    saveGstPreferences,
    toggleShippingGstPopover,
    closeShippingGstPopover,
    onShippingGstUnregChange,
    saveShippingGstPreferences,`;

if (norm.includes(oldExport)) {
  norm = norm.replace(oldExport, newExport);
  console.log('Exported Shipping GST functions to window.smatApp');
}

fs.writeFileSync(appPath, norm.replace(/\n/g, '\r\n'), 'utf8');
console.log('frontend/js/app.js updated successfully with Shipping GST popover!');
