const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../frontend/js/app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

// 1. Add toggleGSTPrefillPopover & executeGSTPrefillFromPopover
const prefillMarker = `  function prefillGSTDetails() {
    const gstinInput = document.getElementById('cust-gstin-input');
    if (gstinInput) {
      gstinInput.value = '36AACCF6679F1ZD';
    }
    fetchTaxpayerDetails();
  }`;

const popoverFunctions = `  let gstPrefillPopoverOpen = false;

  function toggleGSTPrefillPopover(forceState) {
    gstPrefillPopoverOpen = forceState !== undefined ? forceState : !gstPrefillPopoverOpen;
    const popover = document.getElementById('gst-prefill-popover');
    if (popover) {
      popover.style.display = gstPrefillPopoverOpen ? 'block' : 'none';
      if (gstPrefillPopoverOpen) {
        const input = document.getElementById('popover-gstin-input');
        if (input) {
          const currentGstin = document.getElementById('cust-gstin-input')?.value || '36AACCF6679F1ZD';
          if (!input.value) input.value = currentGstin;
          setTimeout(() => input.focus(), 50);
        }
      }
    }
  }

  function prefillGSTDetails() {
    toggleGSTPrefillPopover(true);
  }

  async function executeGSTPrefillFromPopover() {
    const popoverInput = document.getElementById('popover-gstin-input');
    const fetchBtn = document.getElementById('btn-popover-fetch');
    const gstin = (popoverInput ? popoverInput.value : '').trim().toUpperCase();

    if (!gstin) {
      showToast('⚠️ Please enter a GSTIN/UIN number to fetch.');
      return;
    }

    const mainInput = document.getElementById('cust-gstin-input');
    if (mainInput) mainInput.value = gstin;

    const origBtnText = fetchBtn ? fetchBtn.innerHTML : 'Fetch';
    if (fetchBtn) {
      fetchBtn.innerHTML = '⏳ Fetching...';
      fetchBtn.disabled = true;
    }

    try {
      await fetchTaxpayerDetails();
      toggleGSTPrefillPopover(false);
    } catch (err) {
      console.error(err);
    } finally {
      if (fetchBtn) {
        fetchBtn.innerHTML = origBtnText;
        fetchBtn.disabled = false;
      }
    }
  }`;

if (appContent.includes(prefillMarker)) {
  appContent = appContent.replace(prefillMarker, popoverFunctions);
  console.log('Successfully added GST Prefill popover functions!');
} else {
  console.error('prefillMarker not found in app.js!');
}

// 2. Update Banner HTML in renderZohoEditCustomerView to include popover card
const oldBanner = `        <!-- GST Quick Helper Banner -->
        <div class="modern-gst-banner-card zoho-gst-banner-row">
          <div class="gst-banner-left">
            <div class="gst-banner-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
            <div>
              <div class="gst-banner-heading">Automated GSTIN Verification</div>
              <div class="gst-banner-subtext">Prefill Customer details from the GST portal using the Customer's GSTIN.</div>
            </div>
          </div>
          <a href="javascript:void(0)" class="btn-gst-prefill-link gst-prefill-link" onclick="window.smatApp.prefillGSTDetails()">
            Prefill Details ›
          </a>
        </div>`;

const newBanner = `        <!-- GST Quick Helper Banner with Dropdown Popover (Exact Match to User Screenshot) -->
        <div class="modern-gst-banner-card zoho-gst-banner-row" style="position: relative;">
          <div class="gst-banner-left">
            <div class="gst-banner-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
            <div>
              <div class="gst-banner-heading">Automated GSTIN Verification</div>
              <div class="gst-banner-subtext">Prefill Customer details from the GST portal using the Customer's GSTIN.</div>
            </div>
          </div>
          <a href="javascript:void(0)" class="btn-gst-prefill-link gst-prefill-link" onclick="window.smatApp.toggleGSTPrefillPopover()">
            Prefill ›
          </a>

          <!-- Popover Card (Screenshot Match) -->
          <div id="gst-prefill-popover" class="gst-prefill-popover-card" style="display: \${gstPrefillPopoverOpen ? 'block' : 'none'};">
            <div class="gst-popover-header">
              <span class="gst-popover-title">Prefill Customer Details From the GST Portal</span>
              <button type="button" class="btn-close-gst-popover" onclick="window.smatApp.toggleGSTPrefillPopover(false)" title="Close">✕</button>
            </div>
            <div class="gst-popover-body">
              <span class="gst-popover-label">GSTIN/UIN*</span>
              <input type="text" id="popover-gstin-input" class="gst-popover-input" placeholder="Enter GSTIN/UIN" value="\${escapeHtml(gstin)}" onkeydown="if(event.key==='Enter'){event.preventDefault(); window.smatApp.executeGSTPrefillFromPopover();}" />
              <button type="button" id="btn-popover-fetch" class="btn-popover-fetch" onclick="window.smatApp.executeGSTPrefillFromPopover()">Fetch</button>
            </div>
          </div>
        </div>`;

if (appContent.includes(oldBanner)) {
  appContent = appContent.replace(oldBanner, newBanner);
  console.log('Successfully updated banner markup with Popover card!');
} else {
  console.error('oldBanner not found in app.js!');
}

// 3. Add to exports
if (!appContent.includes('toggleGSTPrefillPopover,')) {
  appContent = appContent.replace(
    'prefillGSTDetails,',
    'prefillGSTDetails,\n    toggleGSTPrefillPopover,\n    executeGSTPrefillFromPopover,'
  );
  console.log('Successfully exported popover functions in window.smatApp!');
}

fs.writeFileSync(appPath, appContent, 'utf8');
console.log('app.js successfully updated!');

// 4. Update styles.css
const stylesPath = path.join(__dirname, '../frontend/css/styles.css');
let stylesContent = fs.readFileSync(stylesPath, 'utf8');

const popoverCSS = `
/* GST PREFILL POPOVER CARD (Screenshot Match) */
.gst-prefill-popover-card {
  position: absolute;
  top: calc(100% + 8px);
  left: 20px;
  width: 520px;
  max-width: calc(100vw - 40px);
  background: #FFFFFF;
  border-radius: 6px;
  border: 1px solid #CBD5E1;
  box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.16), 0 4px 10px -2px rgba(0, 0, 0, 0.08);
  z-index: 1100;
  animation: popoverFadeIn 0.15s ease-out;
}

@keyframes popoverFadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.gst-popover-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px 8px;
  border-bottom: 1px solid #F3F4F6;
}

.gst-popover-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.btn-close-gst-popover {
  background: none;
  border: none;
  color: #EF4444;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  line-height: 1;
  transition: all 0.15s ease;
}

.btn-close-gst-popover:hover {
  background: #FEE2E2;
  color: #DC2626;
}

.gst-popover-body {
  padding: 14px 18px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.gst-popover-label {
  color: #DC2626;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}

.gst-popover-input {
  flex: 1;
  height: 34px;
  box-sizing: border-box;
  padding: 0 10px;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  font-size: 13.5px;
  color: #1F2937;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.gst-popover-input:focus {
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
}

.btn-popover-fetch {
  background: #2563EB;
  color: #FFFFFF;
  border: none;
  height: 34px;
  padding: 0 18px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;
  white-space: nowrap;
}

.btn-popover-fetch:hover {
  background: #1D4ED8;
}
`;

if (!stylesContent.includes('.gst-prefill-popover-card')) {
  stylesContent += popoverCSS;
  fs.writeFileSync(stylesPath, stylesContent, 'utf8');
  console.log('styles.css successfully updated with popover styling!');
}
