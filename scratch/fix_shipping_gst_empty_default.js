const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
let content = fs.readFileSync(appPath, 'utf8');
let norm = content.replace(/\r\n/g, '\n');

// 1. In renderZohoSubscriptionView, change display and input values from currClient.gst_number to currClient.shipping_gstin
const oldBlock = `                  <div style="color:#4B5563;">GSTIN: <span id="zoho-shipping-gstin-display" style="color:#111827; font-weight:500;">\${escapeHtml(currClient.gst_number || '')}</span></div>
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
                    </div>`;

const newBlock = `                  <div style="color:#4B5563;">GSTIN: <span id="zoho-shipping-gstin-display" style="color:#111827; font-weight:500;">\${escapeHtml(currClient.shipping_gstin || '')}</span></div>
                  <div style="color:#4B5563;">Business Legal Name: <span id="zoho-shipping-legal-name-display" style="color:#111827; font-weight:500;">\${escapeHtml(currClient.shipping_legal_name || '')}</span></div>

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
                          <input type="checkbox" id="zoho-ship-unregistered-check" style="accent-color:#2563EB; width:14px; height:14px;" onchange="window.smatApp.onShippingGstUnregChange(this.checked)" \${currClient.shipping_is_unregistered ? 'checked' : ''} />
                          <span>is Unregistered Person?</span>
                        </label>
                      </div>
                      <input type="text" id="zoho-ship-gstin-input" value="\${escapeHtml(currClient.shipping_gstin || '')}" placeholder="" style="width:100%; border:1px solid #CBD5E1; border-radius:4px; padding:6px 10px; font-size:0.86rem; color:#1E293B; outline:none;" />
                    </div>

                    <!-- Business Legal Name -->
                    <div style="margin-bottom:12px;">
                      <label style="display:block; font-size:0.83rem; font-weight:500; color:#4B5563; margin-bottom:5px;">Business Legal Name</label>
                      <input type="text" id="zoho-ship-legal-name-input" value="\${escapeHtml(currClient.shipping_legal_name || '')}" placeholder="" style="width:100%; border:1px solid #CBD5E1; border-radius:4px; padding:6px 10px; font-size:0.86rem; color:#1E293B; outline:none;" />
                    </div>

                    <!-- Business Trade Name -->
                    <div style="margin-bottom:14px;">
                      <label style="display:block; font-size:0.83rem; font-weight:500; color:#4B5563; margin-bottom:5px;">Business Trade Name</label>
                      <input type="text" id="zoho-ship-trade-name-input" value="\${escapeHtml(currClient.shipping_trade_name || '')}" placeholder="" style="width:100%; border:1px solid #CBD5E1; border-radius:4px; padding:6px 10px; font-size:0.86rem; color:#1E293B; outline:none;" />
                    </div>`;

if (norm.includes(oldBlock)) {
  norm = norm.replace(oldBlock, newBlock);
  console.log('Replaced shipping GST template inputs with separate shipping_gstin fields (blank by default)');
} else {
  console.log('Warning: oldBlock not found in app.js');
}

// 2. Update toggleShippingGstPopover to populate from currClient.shipping_gstin
const oldToggleFn = `  function toggleShippingGstPopover(evt) {
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
  }`;

const newToggleFn = `  function toggleShippingGstPopover(evt) {
    if (evt) evt.stopPropagation();
    const pop = document.getElementById('zoho-ship-gst-popover');
    if (!pop) return;
    const isCurrentlyOpen = pop.style.display === 'block';
    closeAllMorePopovers();
    closeGstPreferencesPopover();
    document.querySelectorAll('.zoho-addr-popover').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.zoho-sac-popover').forEach(p => p.style.display = 'none');
    if (!isCurrentlyOpen) {
      const currClient = clientsData.find(c => c.id === zohoSubscriptionClientId || c.id === Number(zohoSubscriptionClientId)) || clientsData[0];
      const gstinInput = document.getElementById('zoho-ship-gstin-input');
      const legalInput = document.getElementById('zoho-ship-legal-name-input');
      const tradeInput = document.getElementById('zoho-ship-trade-name-input');
      const unregCheck = document.getElementById('zoho-ship-unregistered-check');
      if (currClient) {
        if (gstinInput) gstinInput.value = currClient.shipping_gstin || '';
        if (legalInput) legalInput.value = currClient.shipping_legal_name || '';
        if (tradeInput) tradeInput.value = currClient.shipping_trade_name || '';
        if (unregCheck) {
          unregCheck.checked = !!currClient.shipping_is_unregistered;
          onShippingGstUnregChange(unregCheck.checked);
        }
      }
      pop.style.display = 'block';
    } else {
      pop.style.display = 'none';
    }
  }`;

if (norm.includes(oldToggleFn)) {
  norm = norm.replace(oldToggleFn, newToggleFn);
  console.log('Updated toggleShippingGstPopover to populate separate shipping fields');
} else {
  console.log('Warning: oldToggleFn not found in app.js');
}

// 3. Update saveShippingGstPreferences to save to currClient.shipping_gstin etc.
const oldSaveFn = `  function saveShippingGstPreferences() {
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
  }`;

const newSaveFn = `  function saveShippingGstPreferences() {
    const isUnreg = document.getElementById('zoho-ship-unregistered-check')?.checked;
    const gstin = isUnreg ? '' : (document.getElementById('zoho-ship-gstin-input')?.value || '');
    const legalName = document.getElementById('zoho-ship-legal-name-input')?.value || '';
    const tradeName = document.getElementById('zoho-ship-trade-name-input')?.value || '';

    const currClient = clientsData.find(c => c.id === zohoSubscriptionClientId || c.id === Number(zohoSubscriptionClientId)) || clientsData[0];
    if (currClient) {
      currClient.shipping_is_unregistered = isUnreg;
      currClient.shipping_gstin = gstin;
      currClient.shipping_legal_name = legalName;
      currClient.shipping_trade_name = tradeName;
    }

    const gstinDisp = document.getElementById('zoho-shipping-gstin-display');
    if (gstinDisp) gstinDisp.innerText = gstin;
    const legalDisp = document.getElementById('zoho-shipping-legal-name-display');
    if (legalDisp) legalDisp.innerText = legalName;

    closeShippingGstPopover();
  }`;

if (norm.includes(oldSaveFn)) {
  norm = norm.replace(oldSaveFn, newSaveFn);
  console.log('Updated saveShippingGstPreferences to save separate shipping fields');
} else {
  console.log('Warning: oldSaveFn not found in app.js');
}

fs.writeFileSync(appPath, norm.replace(/\n/g, '\r\n'), 'utf8');
console.log('Successfully made Shipping Recipient GST Details empty by default!');
