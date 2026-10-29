const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
const stylesCssPath = path.join(__dirname, '..', 'frontend', 'css', 'styles.css');
const indexHtmlPath = path.join(__dirname, '..', 'frontend', 'index.html');

let appJsRaw = fs.readFileSync(appJsPath, 'utf8');
const isCRLF = appJsRaw.includes('\r\n');
let appJs = appJsRaw.replace(/\r\n/g, '\n');

console.log('--- Implementing Zoho 10 Plans Searchable Dropdown & Dynamic States ---');

// 1. Define the 10 exact plans matching the user's screenshots
const zohoPlansArrayCode = `
  // 10 Official Zoho Subscription Plans (Exact match to User Screenshots 1, 2, 3)
  const ZOHO_SUBSCRIPTION_PLANS = [
    {
      id: 'starter_nm_without_wa',
      name: 'Starter New Monthly (Without WA)',
      code: 'MonthlyStarterwithoutwhatsapp',
      price: 1890,
      cycle: 'per month',
      sac: '998314',
      taxRate: 18,
      taxLabel: 'GST18 [18%]'
    },
    {
      id: 'pro_nm_with_wa',
      name: 'Pro New Monthly (With WhatsApp)',
      code: 'ProNewMonthlyWithWhatsApp',
      price: 6500,
      cycle: 'per month',
      sac: '998314',
      taxRate: 18,
      taxLabel: 'GST18 [18%]'
    },
    {
      id: 'pro_nm_without_wa',
      name: 'Pro New Monthly (without whatsapp)',
      code: 'ProNewPlanMonthlyWithoutWhatsapp',
      price: 5500,
      cycle: 'per month',
      sac: '998314',
      taxRate: 18,
      taxLabel: 'GST18 [18%]'
    },
    {
      id: 'pro_ny_without_wa',
      name: 'Pro New Yearly (Without WhatsApp)',
      code: 'ProNewYearlyWithoutWhatsApp',
      price: 60000,
      cycle: 'per year',
      sac: '998314',
      taxRate: 18,
      taxLabel: 'GST18 [18%]'
    },
    {
      id: 'pro_ny_with_wa',
      name: 'Pro New Yearly (With WhatsApp)',
      code: 'ProNewYearlyWithWhatsApp',
      price: 72000,
      cycle: 'per year',
      sac: '998314',
      taxRate: 18,
      taxLabel: 'GST18 [18%]'
    },
    {
      id: 'starter_nm_with_wa',
      name: 'Starter New Monthly (With WhatsApp)',
      code: 'StarterNewMonthlyWithWhatsApp',
      price: 2490,
      cycle: 'per month',
      sac: '998314',
      taxRate: 18,
      taxLabel: 'GST18 [18%]'
    },
    {
      id: 'starter_ny_without_wa',
      name: 'Starter New Yearly (Without Whatsapp)',
      code: 'StarterNewYearlyWithoutWhatsapp',
      price: 18900,
      cycle: 'per year',
      sac: '998314',
      taxRate: 18,
      taxLabel: 'GST18 [18%]'
    },
    {
      id: 'starter_ny_with_wa',
      name: 'Starter New Yearly (With Whatsapp)',
      code: 'StarterNewYearlyWithWhatsapp',
      price: 24900,
      cycle: 'per year',
      sac: '998314',
      taxRate: 18,
      taxLabel: 'GST18 [18%]'
    },
    {
      id: 'test_plan',
      name: 'test plan',
      code: 'test',
      price: 100,
      cycle: 'per month',
      sac: '998314',
      taxRate: 18,
      taxLabel: 'GST18 [18%]'
    },
    {
      id: 'testapichange',
      name: 'TESTAPICHANGE',
      code: 'TESTAPICHANGE',
      price: 500,
      cycle: 'per month',
      sac: '998314',
      taxRate: 18,
      taxLabel: 'GST18 [18%]'
    }
  ];
  let zohoSelectedPlan = null;
`;

// Insert ZOHO_SUBSCRIPTION_PLANS before ALL_ZOHO_COUPONS or near top of modal logic
const planTaxGroupsMarker = 'const ALL_ZOHO_PLAN_TAX_GROUPS = [';
if (!appJs.includes('const ZOHO_SUBSCRIPTION_PLANS = [')) {
  if (appJs.includes(planTaxGroupsMarker)) {
    appJs = appJs.replace(planTaxGroupsMarker, zohoPlansArrayCode + '\n  ' + planTaxGroupsMarker);
    console.log('✓ Inserted ZOHO_SUBSCRIPTION_PLANS data');
  } else {
    console.error('planTaxGroupsMarker not found');
    process.exit(1);
  }
}

// 2. Add Helper Functions for Searchable Plan Dropdown
const planDropdownHelpers = `
  function renderZohoPlanNameCell(plan) {
    if (plan) {
      // Screenshot 2: Plan is selected
      return \`
        <div style="display:flex; gap:0.75rem;">
          <div style="width:38px; height:38px; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:4px; display:flex; align-items:center; justify-content:center; color:#94A3B8; flex-shrink:0;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </div>
          <div style="flex:1;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
              <span id="zoho-plan-name-display" style="font-weight:600; color:#0F172A; font-size:0.88rem;">\${escapeHtml(plan.name)}</span>
              <span class="zoho-plan-clear-btn" onclick="event.stopPropagation(); window.smatApp.clearZohoPlan()" style="color:#94A3B8; cursor:pointer; display:inline-flex; align-items:center; transition:color 0.15s;" title="Remove Plan" onmouseover="this.style.color='#EF4444'" onmouseout="this.style.color='#94A3B8'">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </span>
            </div>
            <input type="hidden" id="zoho-plan-select" value="\${escapeHtml(plan.id)}" />

            <!-- Plan Description Input (Screenshot 2) -->
            <input type="text" id="zoho-plan-desc" placeholder="Add description to your plan" style="width:100%; border:1px solid #E2E8F0; background:#FFFFFF; padding:4px 8px; font-size:0.8rem; color:#4B5563; border-radius:4px; margin-top:4px; outline:none; transition:border-color 0.15s;" onfocus="this.style.borderColor='#3B82F6'" onblur="this.style.borderColor='#E2E8F0'" />

            <!-- SAC Code Badge & Popover (User Screenshot Match) -->
            <div class="zoho-sac-badge-wrap" style="position:relative; display:inline-flex; align-items:center; gap:5px; margin-top:6px;">
              <span style="background:#059669; color:#FFFFFF; font-size:0.68rem; font-weight:700; padding:1px 5px; border-radius:3px; letter-spacing:0.3px;">SERVICE</span>
              <span style="font-size:0.75rem; color:#2563EB; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:3px;" onclick="event.stopPropagation(); window.smatApp.toggleSacPopover('plan', 0, event)" title="Click to edit SAC code">
                SAC: <span id="zoho-plan-sac-text">\${plan.sac || '998314'}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </span>

              <!-- Top-pointed Popover -->
              <div id="zoho-sac-popover-plan" class="zoho-sac-popover" style="display:none; position:absolute; top:calc(100% + 8px); left:0; z-index:9999; background:#FFFFFF; border:1px solid #D1D5DB; border-radius:6px; box-shadow:0 12px 28px rgba(0,0,0,0.15); padding:12px 14px; min-width:280px; text-align:left;">
                <div style="position:absolute; top:-6px; left:48px; width:10px; height:10px; background:#FFFFFF; border-left:1px solid #E5E7EB; border-top:1px solid #E5E7EB; transform:rotate(45deg);"></div>
                <div style="font-size:0.84rem; font-weight:600; color:#374151; margin-bottom:8px;">SAC</div>
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
                  <select id="zoho-sac-select-plan" style="flex:1; border:1.5px solid #3B82F6; border-radius:4px; padding:6px 10px; font-size:0.86rem; color:#111827; outline:none; background:#FFFFFF; cursor:pointer;">
                    <option value="998314" selected>998314</option>
                    <option value="998313">998313 - IT Consulting & Support</option>
                    <option value="998315">998315 - Hosting & Infrastructure</option>
                    <option value="998319">998319 - Other IT Services</option>
                    <option value="998311">998311 - Telecommunications</option>
                  </select>
                  <span style="color:#2563EB; cursor:pointer;" title="Search SAC Code">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </span>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <button type="button" onclick="window.smatApp.saveSacCode('plan', 0)" style="background:#2563EB; color:#FFFFFF; border:none; border-radius:4px; padding:4px 14px; font-size:0.8rem; font-weight:600; cursor:pointer;">Save</button>
                  <button type="button" onclick="window.smatApp.closeSacPopover('plan', 0)" style="background:#F3F4F6; color:#374151; border:1px solid #E5E7EB; border-radius:4px; padding:4px 12px; font-size:0.8rem; cursor:pointer;">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      \`;
    } else {
      // Screenshot 1 & 3: Empty state / Dropdown open
      return \`
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <div style="width:38px; height:38px; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:4px; display:flex; align-items:center; justify-content:center; color:#94A3B8; flex-shrink:0;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </div>
          <div id="zoho-plan-picker-wrapper" style="position:relative; flex:1;">
            <input type="text" id="zoho-plan-search-input" placeholder="Type or click to select a plan." onclick="event.stopPropagation(); window.smatApp.openPlanDropdown(event)" oninput="window.smatApp.filterPlanDropdown(this.value)" autocomplete="off" style="width:100%; border:1.5px solid #3B82F6; border-radius:4px; padding:7px 12px; font-size:0.85rem; color:#1E293B; outline:none; background:#FFFFFF; cursor:text; box-shadow:0 0 0 2px rgba(59,130,246,0.15);" />
            <input type="hidden" id="zoho-plan-select" value="" />

            <!-- Searchable Dropdown Popover (Exact Match to User Screenshots 1, 2, 3) -->
            <div id="zoho-plan-dropdown-popover" class="zoho-plan-dropdown-popover" style="display:block; position:absolute; top:calc(100% + 4px); left:0; width:100%; min-width:340px; z-index:99999; background:#FFFFFF; border:1px solid #CBD5E1; border-radius:6px; box-shadow:0 12px 28px rgba(0,0,0,0.18); overflow:hidden;">
              <div id="zoho-plan-dropdown-list" style="max-height:240px; overflow-y:auto;">
              </div>
            </div>
          </div>
        </div>
      \`;
    }
  }

  function renderPlanDropdownItems(query = '') {
    const listEl = document.getElementById('zoho-plan-dropdown-list');
    if (!listEl) return;
    const q = (query || '').toLowerCase().trim();
    const filtered = ZOHO_SUBSCRIPTION_PLANS.filter(p => {
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      listEl.innerHTML = '<div style="padding:14px; text-align:center; color:#94A3B8; font-size:0.82rem;">No matching plans found</div>';
      return;
    }

    listEl.innerHTML = filtered.map((plan, idx) => \`
      <div class="zoho-plan-option-item \${idx === 0 ? 'active' : ''}" onclick="event.stopPropagation(); window.smatApp.selectZohoPlan('\${plan.id}')" style="padding:10px 14px; cursor:pointer; border-bottom:1px solid #F1F5F9; transition:all 0.12s ease;">
        <div class="zoho-plan-opt-name" style="font-weight:600; font-size:0.86rem; color:#1E293B;">\${escapeHtml(plan.name)}</div>
        <div class="zoho-plan-opt-code" style="font-size:0.76rem; color:#64748B; margin-top:2px;">Code: \${escapeHtml(plan.code)}</div>
      </div>
    \`).join('');
  }

  function openPlanDropdown(event) {
    if (event) event.stopPropagation();
    closeAllMorePopovers();
    closePlanTaxDropdown();
    closeDiscountPrefDropdown();
    const popover = document.getElementById('zoho-plan-dropdown-popover');
    const input = document.getElementById('zoho-plan-search-input');
    if (popover) {
      popover.style.display = 'block';
      renderPlanDropdownItems(input ? input.value : '');
    }
    if (input) {
      input.style.borderColor = '#3B82F6';
      input.style.boxShadow = '0 0 0 2px rgba(59,130,246,0.15)';
    }
  }

  function closePlanDropdown() {
    const popover = document.getElementById('zoho-plan-dropdown-popover');
    if (popover) popover.style.display = 'none';
    const input = document.getElementById('zoho-plan-search-input');
    if (input) {
      input.style.borderColor = '#CBD5E1';
      input.style.boxShadow = 'none';
    }
  }

  function filterPlanDropdown(query) {
    const popover = document.getElementById('zoho-plan-dropdown-popover');
    if (popover) popover.style.display = 'block';
    renderPlanDropdownItems(query);
  }

  function selectZohoPlan(planId) {
    const plan = ZOHO_SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) return;
    zohoSelectedPlan = plan;

    // 1. Re-render name cell into Screenshot 2 layout
    const nameCell = document.getElementById('zoho-plan-name-cell');
    if (nameCell) {
      nameCell.innerHTML = renderZohoPlanNameCell(plan);
    }

    // 2. Set Price input
    const priceInput = document.getElementById('zoho-plan-price');
    if (priceInput) priceInput.value = plan.price;

    // 3. Set Quantity input
    const qtyInput = document.getElementById('zoho-plan-qty');
    if (qtyInput) qtyInput.value = 1;

    // 4. Set Tax if not customized
    const taxLabel = document.getElementById('zoho-plan-tax-label');
    const taxHidden = document.getElementById('zoho-plan-tax');
    if (taxLabel && taxHidden) {
      taxLabel.innerText = plan.taxLabel;
      taxHidden.value = plan.taxRate;
      zohoSelectedPlanTaxRate = plan.taxRate;
      zohoSelectedPlanTaxLabel = plan.taxLabel;
    }

    // 5. Set Row Amount display
    const amountEl = document.getElementById('zoho-plan-row-amount');
    if (amountEl) {
      amountEl.innerHTML = \`
        <div style="font-weight:700; color:#111827; font-size:0.92rem;">Rs. \${plan.price.toLocaleString('en-IN')}.00</div>
        <div style="font-size:0.74rem; color:#6B7280; margin-top:2px;">\${plan.cycle}</div>
      \`;
    }

    closePlanDropdown();
    updateZohoSubCalculations();
  }

  function clearZohoPlan() {
    zohoSelectedPlan = null;

    // 1. Re-render name cell into Screenshot 1 & 3 layout
    const nameCell = document.getElementById('zoho-plan-name-cell');
    if (nameCell) {
      nameCell.innerHTML = renderZohoPlanNameCell(null);
    }

    // 2. Reset Price input to 0.00
    const priceInput = document.getElementById('zoho-plan-price');
    if (priceInput) priceInput.value = '0.00';

    // 3. Reset Tax to Select a Tax
    const taxLabel = document.getElementById('zoho-plan-tax-label');
    const taxHidden = document.getElementById('zoho-plan-tax');
    if (taxLabel && taxHidden) {
      taxLabel.innerText = 'Select a Tax';
      taxHidden.value = '0';
      zohoSelectedPlanTaxRate = 0;
      zohoSelectedPlanTaxLabel = 'Select a Tax';
    }

    // 4. Reset Row Amount display to Rs. 0.00
    const amountEl = document.getElementById('zoho-plan-row-amount');
    if (amountEl) {
      amountEl.innerHTML = \`
        <div style="font-weight:700; color:#111827; font-size:0.92rem;">Rs. 0.00</div>
        <div style="font-size:0.74rem; color:#6B7280; margin-top:2px;">per month</div>
      \`;
    }

    updateZohoSubCalculations();
    renderPlanDropdownItems('');
    const input = document.getElementById('zoho-plan-search-input');
    if (input) {
      input.focus();
    }
  }
`;

// Insert helpers before openPlanModal or near helper functions
const insertHelpersMarker = 'function showRemovePlanModal() {';
if (!appJs.includes('function selectZohoPlan(')) {
  if (appJs.includes(insertHelpersMarker)) {
    appJs = appJs.replace(insertHelpersMarker, planDropdownHelpers + '\n  ' + insertHelpersMarker);
    console.log('✓ Inserted plan dropdown helper functions');
  } else {
    console.error('insertHelpersMarker not found');
    process.exit(1);
  }
}

// 3. Export new functions on window.smatApp
const exportTarget = 'toggleDrawerAccordion,';
const newExports = `toggleDrawerAccordion,
    openPlanDropdown,
    closePlanDropdown,
    filterPlanDropdown,
    selectZohoPlan,
    clearZohoPlan,
    renderPlanDropdownItems,`;

if (!appJs.includes('selectZohoPlan,')) {
  appJs = appJs.replace(exportTarget, newExports);
  console.log('✓ Exported plan dropdown functions on window.smatApp');
}

// 4. Update the Plan row in openPlanModal to use renderZohoPlanNameCell
// Find matchedPlan determination in openPlanModal
const matchedPlanSearch = `const currentPlanName = matchedPlan ? matchedPlan.label : (client.plan_name || 'Pro - Monthly (₹6,500)');`;
const newMatchedPlanLogic = `const currentPlanName = matchedPlan ? matchedPlan.label : (client.plan_name || 'Pro New Monthly (With WhatsApp)');
    // Match against official 10 Zoho subscription plans
    zohoSelectedPlan = ZOHO_SUBSCRIPTION_PLANS.find(p => p.name.toLowerCase() === currentPlanName.toLowerCase() || p.id === 'pro_nm_with_wa') || ZOHO_SUBSCRIPTION_PLANS[1];`;

if (appJs.includes(matchedPlanSearch) && !appJs.includes('zohoSelectedPlan = ZOHO_SUBSCRIPTION_PLANS.find')) {
  appJs = appJs.replace(matchedPlanSearch, newMatchedPlanLogic);
  console.log('✓ Initialized zohoSelectedPlan in openPlanModal');
}

// Replace the <td> of Plan Thumbnail & Name in zoho-plan-row
const oldTdStart = '<!-- Plan Thumbnail & Name & SAC Badge -->';
const oldTdEnd = '<!-- Quantity -->';
const tdStartIdx = appJs.indexOf(oldTdStart);
const tdEndIdx = appJs.indexOf(oldTdEnd, tdStartIdx);

if (tdStartIdx !== -1 && tdEndIdx !== -1) {
  const newTdHtml = `<!-- Plan Thumbnail & Name & SAC Badge (Dynamic Searchable Dropdown) -->
                    <td id="zoho-plan-name-cell" style="padding:1rem;">
                      \${renderZohoPlanNameCell(zohoSelectedPlan)}
                    </td>

                    `;
  appJs = appJs.substring(0, tdStartIdx) + newTdHtml + appJs.substring(tdEndIdx);
  console.log('✓ Replaced plan name cell with dynamic renderZohoPlanNameCell');
} else {
  console.error('Could not locate plan name cell in zoho-plan-row');
  process.exit(1);
}

// Also update the row amount display container to have id="zoho-plan-row-amount"
const oldAmountDisplay = `<div style="text-align:right;">
                          <div id="zoho-plan-row-amount" style="font-weight:700; color:#111827; font-size:0.92rem;">Rs. \${matchedPlan.price.toLocaleString('en-IN')}.00</div>
                          <div style="font-size:0.74rem; color:#6B7280; margin-top:2px;">\${matchedPlan.cycle}</div>
                        </div>`;

const newAmountDisplay = `<div style="text-align:right;" id="zoho-plan-row-amount">
                          <div style="font-weight:700; color:#111827; font-size:0.92rem;">Rs. \${(zohoSelectedPlan ? zohoSelectedPlan.price : matchedPlan.price).toLocaleString('en-IN')}.00</div>
                          <div style="font-size:0.74rem; color:#6B7280; margin-top:2px;">\${zohoSelectedPlan ? zohoSelectedPlan.cycle : matchedPlan.cycle}</div>
                        </div>`;

if (appJs.includes(oldAmountDisplay)) {
  appJs = appJs.replace(oldAmountDisplay, newAmountDisplay);
  console.log('✓ Updated plan row amount display');
}

// Outside click handler to close plan dropdown
const outsideClickMarker = 'if (!e.target.closest(\'#zoho-plan-tax-wrapper\')) {';
const newOutsideClick = `if (!e.target.closest('#zoho-plan-picker-wrapper')) {
      closePlanDropdown();
    }
    if (!e.target.closest('#zoho-plan-tax-wrapper')) {`;

if (!appJs.includes('closePlanDropdown();') && appJs.includes(outsideClickMarker)) {
  appJs = appJs.replace(outsideClickMarker, newOutsideClick);
  console.log('✓ Added outside click handler for plan dropdown');
}

// Write back app.js
fs.writeFileSync(appJsPath, isCRLF ? appJs.replace(/\n/g, '\r\n') : appJs, 'utf8');
console.log('✓ Saved updated frontend/js/app.js');

// 5. Append CSS for zoho plan dropdown in styles.css
let stylesCss = fs.readFileSync(stylesCssPath, 'utf8');
const planDropdownCss = `
/* ========================================================================= */
/* ZOHO PLAN SEARCHABLE DROPDOWN POPOVER (EXACT MATCH TO USER SCREENSHOTS)   */
/* ========================================================================= */
.zoho-plan-dropdown-popover {
  border-radius: 6px;
  background: #FFFFFF;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border: 1px solid #CBD5E1;
}

.zoho-plan-option-item {
  padding: 10px 14px;
  cursor: pointer;
  border-bottom: 1px solid #F1F5F9;
  transition: all 0.12s ease;
  user-select: none;
}

.zoho-plan-option-item:last-child {
  border-bottom: none;
}

.zoho-plan-option-item:hover,
.zoho-plan-option-item.active {
  background: #2563EB !important;
}

.zoho-plan-option-item:hover .zoho-plan-opt-name,
.zoho-plan-option-item.active .zoho-plan-opt-name {
  color: #FFFFFF !important;
}

.zoho-plan-option-item:hover .zoho-plan-opt-code,
.zoho-plan-option-item.active .zoho-plan-opt-code {
  color: #DBEAFE !important;
}
`;

if (!stylesCss.includes('zoho-plan-dropdown-popover')) {
  stylesCss += planDropdownCss;
  fs.writeFileSync(stylesCssPath, stylesCss, 'utf8');
  console.log('✓ Appended plan dropdown styles to styles.css');
}

// 6. Bump cache version to v=12.1 in index.html
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/app\.js\?v=[0-9.]+/g, 'app.js?v=12.1');
indexHtml = indexHtml.replace(/styles\.css\?v=[0-9.]+/g, 'styles.css?v=12.1');
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('✓ Bumped cache version in frontend/index.html to v=12.1');
