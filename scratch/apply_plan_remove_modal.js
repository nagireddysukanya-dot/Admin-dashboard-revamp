const fs = require('fs');
const path = require('path');

// 1. Update frontend/css/styles.css
const cssPath = path.join(__dirname, '..', 'frontend', 'css', 'styles.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

const modalCss = `
/* Zoho Plan Removal Confirmation Modal Animation (User Screenshot Match) */
@keyframes zohoSlideDown {
  from {
    opacity: 0;
    transform: translate(-50%, -24px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.zoho-plan-remove-modal {
  animation: zohoSlideDown 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}
`;

if (!cssContent.includes('zohoSlideDown')) {
  cssContent += '\n' + modalCss;
  fs.writeFileSync(cssPath, cssContent, 'utf8');
  console.log('Added zohoSlideDown animation to styles.css');
}

// 2. Update frontend/js/app.js
const appPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');
let norm = appContent.replace(/\r\n/g, '\n');

// 2a. Add modal markup to renderZohoSubscriptionView
const modalMarkup = `      <!-- Plan Removal Warning Confirmation Modal (Exact Match to User Reference Screenshot) -->
      <div id="zoho-plan-remove-modal-backdrop" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(15,23,42,0.25); z-index:100000; backdrop-filter:blur(1px);" onclick="window.smatApp.closeRemovePlanModal()">
        <div id="zoho-plan-remove-modal" class="zoho-plan-remove-modal" onclick="event.stopPropagation()" style="position:fixed; top:24px; left:50%; transform:translateX(-50%); background:#FFFFFF; border-radius:8px; box-shadow:0 14px 40px rgba(0,0,0,0.22); width:90%; max-width:540px; padding:22px 26px; z-index:100001; border:1px solid #E2E8F0;">
          <div style="display:flex; gap:16px; align-items:flex-start;">
            <!-- Yellow Warning Triangle Icon (Screenshot Match) -->
            <div style="flex-shrink:0; margin-top:2px;">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="#F59E0B"/>
                <line x1="12" y1="9" x2="12" y2="13" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/>
                <circle cx="12" cy="17" r="1.2" fill="#FFFFFF"/>
              </svg>
            </div>

            <!-- Warning Text (Screenshot Match) -->
            <div style="font-size:0.92rem; color:#374151; line-height:1.55;">
              If you remove this plan, any custom changes you've made to the plan price, reporting tags or other such subscription configurations will be discarded.
            </div>
          </div>

          <!-- Action Buttons (Screenshot Match) -->
          <div style="display:flex; gap:10px; margin-top:20px; margin-left:46px;">
            <button type="button" onclick="event.stopPropagation(); window.smatApp.proceedRemovePlan()" style="background:#2563EB; color:#FFFFFF; border:none; border-radius:4px; padding:7px 20px; font-size:0.86rem; font-weight:500; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,0.05); transition:background 0.15s;" onmouseover="this.style.background='#1D4ED8'" onmouseout="this.style.background='#2563EB'">Proceed</button>
            <button type="button" onclick="event.stopPropagation(); window.smatApp.closeRemovePlanModal()" style="background:#FFFFFF; color:#374151; border:1px solid #D1D5DB; border-radius:4px; padding:7px 18px; font-size:0.86rem; font-weight:500; cursor:pointer; transition:background 0.15s;" onmouseover="this.style.background='#F9FAFB'" onmouseout="this.style.background='#FFFFFF'">Cancel</button>
          </div>
        </div>
      </div>
`;

const insertModalAtStart = `<div class="zoho-sub-fullpage-wrap" style="background:#FFFFFF; min-height:100vh; padding-bottom:5rem;">`;

if (norm.includes(insertModalAtStart) && !norm.includes('zoho-plan-remove-modal-backdrop')) {
  norm = norm.replace(insertModalAtStart, insertModalAtStart + '\n' + modalMarkup);
  console.log('Inserted Plan Removal confirmation modal markup in app.js');
}

// 2b. Add helper functions
const modalHelperFns = `
  function showRemovePlanModal() {
    closeAllMorePopovers();
    closeGstPreferencesPopover();
    closeShippingGstPopover();
    closeSupplyStateDropdown();
    const backdrop = document.getElementById('zoho-plan-remove-modal-backdrop');
    if (backdrop) backdrop.style.display = 'block';
  }

  function closeRemovePlanModal() {
    const backdrop = document.getElementById('zoho-plan-remove-modal-backdrop');
    if (backdrop) backdrop.style.display = 'none';
  }

  function proceedRemovePlan() {
    const descInp = document.getElementById('zoho-plan-desc');
    if (descInp) descInp.value = '';
    const qtyInp = document.getElementById('zoho-plan-qty');
    if (qtyInp) qtyInp.value = 1;
    const discInp = document.getElementById('zoho-plan-disc-val');
    if (discInp) discInp.value = 0;
    
    // Recalculate billing
    updateZohoSubCalculations();
    closeRemovePlanModal();
    if (typeof showToast === 'function') {
      showToast('Plan custom configurations have been reset.');
    }
  }
`;

const insertBeforePlanChange = `  function onZohoPlanChange(val) {`;
if (norm.includes(insertBeforePlanChange) && !norm.includes('function showRemovePlanModal()')) {
  norm = norm.replace(insertBeforePlanChange, modalHelperFns + '\n' + insertBeforePlanChange);
  console.log('Added Plan removal modal helper functions in app.js');
}

// 2c. Export in window.smatApp
const exportTarget = `    updateZohoSubCalculations,`;
const exportWithModal = `    showRemovePlanModal,
    closeRemovePlanModal,
    proceedRemovePlan,
    updateZohoSubCalculations,`;

if (norm.includes(exportTarget) && !norm.includes('showRemovePlanModal,')) {
  norm = norm.replace(exportTarget, exportWithModal);
  console.log('Exported Plan removal modal functions in app.js');
}

fs.writeFileSync(appPath, norm.replace(/\n/g, '\r\n'), 'utf8');
console.log('Plan removal modal applied successfully!');
