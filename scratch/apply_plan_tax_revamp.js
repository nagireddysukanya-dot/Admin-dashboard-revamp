// Scratch script to apply Plan Tax Searchable Dropdown and Top UI alignment to frontend/js/app.js and frontend/css/styles.css
const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
const stylesCssPath = path.join(__dirname, '..', 'frontend', 'css', 'styles.css');
const indexHtmlPath = path.join(__dirname, '..', 'frontend', 'index.html');

let appJsRaw = fs.readFileSync(appJsPath, 'utf8');
let stylesCss = fs.readFileSync(stylesCssPath, 'utf8');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const isCRLF = appJsRaw.includes('\r\n');
let appJs = appJsRaw.replace(/\r\n/g, '\n');

console.log('Original app.js length:', appJs.length, 'isCRLF:', isCRLF);

// 1. Add ALL_ZOHO_PLAN_TAX_GROUPS and state variables right after zohoSelectedPlanAccount if not already added
const targetState = "let zohoSelectedPlanAccount = '';";
const replacementState = `let zohoSelectedPlanAccount = '';
  let zohoDiscountPref = 'no-discount';
  let zohoSelectedPlanTaxLabel = 'GST18 [18%]';
  let zohoSelectedPlanTaxRate = 18;

  const ALL_ZOHO_PLAN_TAX_GROUPS = [
    {
      category: 'Non-Taxable',
      items: [
        {
          id: 'out-of-scope',
          label: 'Out of Scope',
          name: 'Out of Scope',
          rate: 0,
          subtitle: "Supplies on which you don't charge any GST or include them in the returns."
        },
        {
          id: 'non-gst-supply',
          label: 'Non-GST Supply',
          name: 'Non-GST Supply',
          rate: 0,
          subtitle: 'Supplies which do not come under GST such as petroleum products and liquor.'
        }
      ]
    },
    {
      category: 'Tax Group',
      items: [
        { id: 'gst0', label: 'GST0 [0%]', name: 'GST0', rate: 0 },
        { id: 'gst5', label: 'GST5 [5%]', name: 'GST5', rate: 5 },
        { id: 'gst12', label: 'GST12 [12%]', name: 'GST12', rate: 12 },
        { id: 'gst18', label: 'GST18 [18%]', name: 'GST18', rate: 18 },
        { id: 'gst28', label: 'GST28 [28%]', name: 'GST28', rate: 28 },
        { id: 'interstate18', label: 'Interstate [18%]', name: 'Interstate', rate: 18 }
      ]
    }
  ];`;

if (!appJs.includes('ALL_ZOHO_PLAN_TAX_GROUPS')) {
  if (!appJs.includes(targetState)) {
    console.error('Error: targetState not found in app.js');
    process.exit(1);
  }
  appJs = appJs.replace(targetState, replacementState);
  console.log('✓ Added tax data and state variables');
} else {
  console.log('tax data already added');
}

// 2. Replace Plan header and top discount/renewal controls
const oldPlanHeader = `            <!-- Plan Header & Preferences -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <h2 style="font-size:1.15rem; font-weight:700; color:#111827; margin:0;">Plan</h2>
              <div style="display:flex; align-items:center; gap:0.6rem;">
                <select id="zoho-sub-discount-pref" class="zoho-select-dropdown" style="max-width:140px; padding:0.35rem 0.65rem; font-size:0.8rem;">
                  <option value="item-level" selected>(%) Item-Level Discount (sep)</option>
                  <option value="transaction-level">Transactional Level</option>
                  <option value="no-discount">No Discount</option>
                </select>
                <select id="zoho-sub-renewal-freq" class="zoho-select-dropdown" style="max-width:140px; padding:0.35rem 0.65rem; font-size:0.8rem;">
                  <option value="every-renewal" selected>Every Renewal</option>
                  <option value="one-time">One-Time Only</option>
                </select>
              </div>
            </div>`;

const newPlanHeader = `            <!-- Plan Header & Preferences (Exact Match to Screenshots 1 & 2) -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <h2 style="font-size:1.15rem; font-weight:700; color:#111827; margin:0;">Plan</h2>
              <div style="display:flex; align-items:center; gap:0.6rem;">
                <!-- Discount preference selector (Screenshots 1 & 2 Match) -->
                <div style="display:inline-flex; align-items:center; border:1px solid #CBD5E1; border-radius:6px; padding:0 8px; background:#FFFFFF; box-shadow:0 1px 2px rgba(0,0,0,0.02);">
                  <span style="color:#64748B; display:inline-flex; align-items:center; margin-right:4px;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <circle cx="9.5" cy="9.5" r=".5" fill="currentColor"></circle>
                      <circle cx="14.5" cy="14.5" r=".5" fill="currentColor"></circle>
                    </svg>
                  </span>
                  <select id="zoho-sub-discount-pref" onchange="window.smatApp.onZohoDiscountPrefChange(this.value)" style="border:none; outline:none; font-size:0.82rem; color:#374151; background:transparent; cursor:pointer; padding:6px 2px; font-weight:500; min-width:125px;">
                    <option value="no-discount" \${zohoDiscountPref === 'no-discount' ? 'selected' : ''}>No Discounts</option>
                    <option value="item-level" \${zohoDiscountPref === 'item-level' ? 'selected' : ''}>(%) Item-Level Discount</option>
                    <option value="transaction-level" \${zohoDiscountPref === 'transaction-level' ? 'selected' : ''}>Entity-Level Discount</option>
                  </select>
                </div>

                <!-- Renewal frequency selector (Screenshots 1 & 2 Match) -->
                <select id="zoho-sub-renewal-freq" style="border:1px solid #CBD5E1; border-radius:6px; padding:6px 12px; font-size:0.82rem; color:#374151; background:#FFFFFF; outline:none; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,0.02); font-weight:500;">
                  <option value="every-renewal" selected>Every Renewal</option>
                  <option value="one-time">One-Time Only</option>
                </select>
              </div>
            </div>`;

if (appJs.includes(oldPlanHeader)) {
  appJs = appJs.replace(oldPlanHeader, newPlanHeader);
  console.log('✓ Updated Plan Header & Top Controls');
} else {
  console.log('Plan Header already updated or not matched');
}

// 3. Update Plan Table headers with dynamic widths and discount column toggle
const oldPlanTh = `                  <tr style="background:#F9FAFB; border-bottom:1px solid #E5E7EB; color:#6B7280; font-size:0.75rem; font-weight:700; text-transform:uppercase;">
                    <th style="padding:0.65rem 1rem; text-align:left; width:36%;">PLAN NAME</th>
                    <th style="padding:0.65rem 0.75rem; text-align:center; width:12%;">QUANTITY</th>
                    <th style="padding:0.65rem 0.75rem; text-align:right; width:14%;">PRICE</th>
                    <th style="padding:0.65rem 0.75rem; text-align:center; width:14%;">DISCOUNT</th>
                    <th style="padding:0.65rem 0.75rem; text-align:left; width:12%;">TAX</th>
                    <th style="padding:0.65rem 1rem; text-align:right; width:12%;">AMOUNT</th>
                  </tr>`;

const newPlanTh = `                  <tr style="background:#F9FAFB; border-bottom:1px solid #E5E7EB; color:#6B7280; font-size:0.75rem; font-weight:700; text-transform:uppercase;">
                    <th class="zoho-th-plan-name" style="padding:0.65rem 1rem; text-align:left; width:\${zohoDiscountPref === 'no-discount' ? '40%' : '34%'};">PLAN NAME</th>
                    <th class="zoho-th-plan-qty" style="padding:0.65rem 0.75rem; text-align:center; width:\${zohoDiscountPref === 'no-discount' ? '15%' : '12%'};">QUANTITY</th>
                    <th class="zoho-th-plan-price" style="padding:0.65rem 0.75rem; text-align:right; width:\${zohoDiscountPref === 'no-discount' ? '15%' : '14%'};">PRICE</th>
                    <th class="zoho-col-discount" style="padding:0.65rem 0.75rem; text-align:center; width:14%; display:\${zohoDiscountPref === 'no-discount' ? 'none' : 'table-cell'};">DISCOUNT</th>
                    <th class="zoho-th-plan-tax" style="padding:0.65rem 0.75rem; text-align:left; width:\${zohoDiscountPref === 'no-discount' ? '15%' : '13%'};">TAX</th>
                    <th class="zoho-th-plan-amount" style="padding:0.65rem 1rem; text-align:right; width:\${zohoDiscountPref === 'no-discount' ? '15%' : '13%'};">AMOUNT</th>
                  </tr>`;

if (appJs.includes(oldPlanTh)) {
  appJs = appJs.replace(oldPlanTh, newPlanTh);
  console.log('✓ Updated Plan Table TH');
} else {
  console.log('Plan Table TH already updated or not matched');
}

// 4. Update Plan Table Row Discount & Tax cells
const oldPlanRowDiscAndTax = `                    <!-- Point 1: Plan Discount (% / ₹) (Screenshot 2) -->
                    <td style="padding:1rem 0.75rem; text-align:center;">
                      <div style="display:inline-flex; align-items:center; gap:2px; border:1px solid #D1D5DB; border-radius:4px; padding:1px 4px; background:#FFFFFF;">
                        <input type="number" id="zoho-plan-disc-val" value="0" min="0" style="width:45px; border:none; text-align:center; font-size:0.85rem; outline:none;" oninput="window.smatApp.updateZohoSubCalculations()" />
                        <select id="zoho-plan-disc-type" style="border:none; background:none; font-size:0.8rem; color:#4B5563; outline:none; cursor:pointer;" onchange="window.smatApp.updateZohoSubCalculations()">
                          <option value="percent">% ⌄</option>
                          <option value="flat">₹ ⌄</option>
                        </select>
                      </div>
                    </td>

                    <!-- Tax (Screenshot 2) -->
                    <td style="padding:1rem 0.75rem;">
                      <select id="zoho-plan-tax" style="border:1px solid #D1D5DB; border-radius:4px; padding:4px; font-size:0.8rem; width:100%;" onchange="window.smatApp.updateZohoSubCalculations()">
                        <option value="18" selected>GST18 [18%]</option>
                        <option value="12">GST12 [12%]</option>
                        <option value="5">GST5 [5%]</option>
                        <option value="0">None [0%]</option>
                      </select>
                    </td>`;

const newPlanRowDiscAndTax = `                    <!-- Point 1: Plan Discount (% / ₹) (Screenshots 1 & 2) -->
                    <td class="zoho-col-discount" style="padding:1rem 0.75rem; text-align:center; display:\${zohoDiscountPref === 'no-discount' ? 'none' : 'table-cell'};">
                      <div style="display:inline-flex; align-items:center; gap:2px; border:1px solid #D1D5DB; border-radius:4px; padding:1px 4px; background:#FFFFFF;">
                        <input type="number" id="zoho-plan-disc-val" value="0" min="0" style="width:45px; border:none; text-align:center; font-size:0.85rem; outline:none;" oninput="window.smatApp.updateZohoSubCalculations()" />
                        <select id="zoho-plan-disc-type" style="border:none; background:none; font-size:0.8rem; color:#4B5563; outline:none; cursor:pointer;" onchange="window.smatApp.updateZohoSubCalculations()">
                          <option value="percent">% ⌄</option>
                          <option value="flat">₹ ⌄</option>
                        </select>
                      </div>
                    </td>

                    <!-- Tax: Custom Searchable Dropdown (Screenshots 2, 3, 4 Match) -->
                    <td style="padding:1rem 0.75rem; position:relative;">
                      <div id="zoho-plan-tax-wrapper" style="position:relative; width:100%; min-width:130px;">
                        <button type="button" id="zoho-plan-tax-trigger" onclick="event.stopPropagation(); window.smatApp.togglePlanTaxDropdown(event)" style="display:flex; align-items:center; justify-content:space-between; width:100%; border:1px solid #CBD5E1; border-radius:4px; padding:5px 8px; background:#FFFFFF; font-size:0.82rem; color:#1E293B; cursor:pointer; text-align:left; transition:all 0.15s; user-select:none;">
                          <span id="zoho-plan-tax-label" style="font-weight:500;">\${zohoSelectedPlanTaxLabel || 'GST18 [18%]'}</span>
                          <span id="zoho-plan-tax-chevron" style="color:#2563EB; font-size:0.75rem; margin-left:4px; display:inline-flex; align-items:center; transition:transform 0.2s;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                          </span>
                        </button>
                        <input type="hidden" id="zoho-plan-tax" value="\${zohoSelectedPlanTaxRate !== undefined ? zohoSelectedPlanTaxRate : 18}" />

                        <!-- Searchable Popover Dropdown (Screenshots 3 & 4 Match) -->
                        <div id="zoho-plan-tax-popover" class="zoho-tax-popover" style="display:none; position:absolute; top:calc(100% + 4px); left:0; width:260px; z-index:99999; background:#FFFFFF; border:1px solid #CBD5E1; border-radius:6px; box-shadow:0 12px 28px rgba(0,0,0,0.18); overflow:hidden; text-align:left;">
                          <!-- Search Bar (Screenshot 3 Match) -->
                          <div style="padding:8px 10px 6px 10px; border-bottom:1px solid #F1F5F9;">
                            <div style="display:flex; align-items:center; gap:6px; border:1.5px solid #3B82F6; border-radius:5px; padding:4px 8px; background:#FFFFFF;">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                              <input type="text" id="zoho-plan-tax-search" placeholder="Search" oninput="window.smatApp.filterPlanTaxes(this.value)" style="border:none; outline:none; font-size:0.82rem; width:100%; color:#1E293B; background:transparent;" />
                            </div>
                          </div>

                          <!-- Categories & Items (Screenshots 3 & 4 Match) -->
                          <div id="zoho-plan-tax-list" style="max-height:220px; overflow-y:auto; padding:4px 6px;"></div>

                          <!-- Fixed Bottom Action: New Tax (Screenshots 3 & 4 Match) -->
                          <div style="border-top:1px solid #F1F5F9; padding:8px 12px; background:#FFFFFF;">
                            <div onclick="event.stopPropagation(); window.smatApp.addNewPlanTax()" style="display:inline-flex; align-items:center; gap:6px; color:#2563EB; font-size:0.82rem; font-weight:600; cursor:pointer; user-select:none;">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="#2563EB"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
                              <span>New Tax</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>`;

if (appJs.includes(oldPlanRowDiscAndTax)) {
  appJs = appJs.replace(oldPlanRowDiscAndTax, newPlanRowDiscAndTax);
  console.log('✓ Updated Plan Row Discount & Tax cells');
} else {
  console.log('Plan Row Disc and Tax already updated or not matched');
}

// 5. Update Addons Table Header and Row Discount class
const oldAddonTh = `<th style="padding:0.65rem 0.75rem; text-align:center; width:14%;">DISCOUNT</th>`;
const newAddonTh = `<th class="zoho-col-discount" style="padding:0.65rem 0.75rem; text-align:center; width:14%; display:\${zohoDiscountPref === 'no-discount' ? 'none' : 'table-cell'};">DISCOUNT</th>`;
if (appJs.includes(oldAddonTh)) {
  appJs = appJs.replace(oldAddonTh, newAddonTh);
}

const oldAddonTd = `                      <!-- Point 2: Add-on Discount (% / ₹) (Screenshot 1 & 2) -->
                      <td style="padding:1rem 0.75rem; text-align:center;">`;
const newAddonTd = `                      <!-- Point 2: Add-on Discount (% / ₹) (Screenshot 1 & 2) -->
                      <td class="zoho-col-discount" style="padding:1rem 0.75rem; text-align:center; display:\${zohoDiscountPref === 'no-discount' ? 'none' : 'table-cell'};">`;
if (appJs.includes(oldAddonTd)) {
  appJs = appJs.replace(oldAddonTd, newAddonTd);
}
console.log('✓ Updated Addons Table Discount cells');

// 6. Add functions: renderPlanTaxOptions, togglePlanTaxDropdown, closePlanTaxDropdown, selectPlanTax, filterPlanTaxes, addNewPlanTax, onZohoDiscountPrefChange
const targetBeforeProceedRemove = `  function proceedRemovePlan() {`;
const newTaxFunctions = `  function renderPlanTaxOptions(query = '') {
    const container = document.getElementById('zoho-plan-tax-list');
    if (!container) return;
    const q = (query || '').toLowerCase().trim();
    let html = '';

    ALL_ZOHO_PLAN_TAX_GROUPS.forEach(group => {
      const matchingItems = group.items.filter(item => {
        if (!q) return true;
        return item.label.toLowerCase().includes(q) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(q));
      });

      if (matchingItems.length > 0) {
        html += \`<div style="font-size:0.75rem; font-weight:700; color:#475569; padding:6px 8px 3px 8px; user-select:none;">\${escapeHtml(group.category)}</div>\`;
        matchingItems.forEach(item => {
          const isSelected = (item.label === zohoSelectedPlanTaxLabel);
          html += \`
            <div class="zoho-tax-item \${isSelected ? 'selected' : ''}" 
                 onclick="event.stopPropagation(); window.smatApp.selectPlanTax('\${escapeHtml(item.label)}', \${item.rate})"
                 style="display:flex; align-items:flex-start; justify-content:space-between; gap:6px; padding:6px 8px; margin-bottom:2px; border-radius:4px; cursor:pointer;">
              <div style="flex:1;">
                <div style="font-size:0.83rem; font-weight:\${isSelected ? '600' : '500'}; line-height:1.2;">\${escapeHtml(item.label)}</div>
                \${item.subtitle ? \`<div class="zoho-tax-sub" style="font-size:0.72rem; color:#64748B; line-height:1.3; margin-top:2px;">\${escapeHtml(item.subtitle)}</div>\` : ''}
              </div>
              \${isSelected ? \`
                <div class="zoho-tax-check" style="flex-shrink:0; margin-left:8px; margin-top:2px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.8"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              \` : ''}
            </div>
          \`;
        });
      }
    });

    if (!html) {
      html = \`<div style="padding:12px 8px; text-align:center; color:#94A3B8; font-size:0.8rem;">No matching tax found</div>\`;
    }

    container.innerHTML = html;
  }

  function togglePlanTaxDropdown(evt) {
    if (evt) evt.stopPropagation();
    const pop = document.getElementById('zoho-plan-tax-popover');
    const trigger = document.getElementById('zoho-plan-tax-trigger');
    const chevron = document.getElementById('zoho-plan-tax-chevron');
    if (!pop) return;
    const isCurrentlyOpen = pop.style.display === 'block';

    closeAllMorePopovers();
    closeGstPreferencesPopover();
    closeShippingGstPopover();
    closeSupplyStateDropdown();
    closePlanAccountDropdown();

    if (!isCurrentlyOpen) {
      pop.style.display = 'block';
      if (trigger) {
        trigger.style.borderColor = '#3B82F6';
        trigger.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.15)';
      }
      if (chevron) chevron.style.transform = 'rotate(180deg)';
      renderPlanTaxOptions();
      setTimeout(() => {
        const inp = document.getElementById('zoho-plan-tax-search');
        if (inp) {
          inp.value = '';
          inp.focus();
        }
      }, 50);
    } else {
      closePlanTaxDropdown();
    }
  }

  function closePlanTaxDropdown() {
    const pop = document.getElementById('zoho-plan-tax-popover');
    const trigger = document.getElementById('zoho-plan-tax-trigger');
    const chevron = document.getElementById('zoho-plan-tax-chevron');
    if (pop) pop.style.display = 'none';
    if (trigger) {
      trigger.style.borderColor = '#CBD5E1';
      trigger.style.boxShadow = 'none';
    }
    if (chevron) chevron.style.transform = 'rotate(0deg)';
  }

  function selectPlanTax(label, rate) {
    zohoSelectedPlanTaxLabel = label;
    zohoSelectedPlanTaxRate = rate;
    const labelEl = document.getElementById('zoho-plan-tax-label');
    const hiddenInput = document.getElementById('zoho-plan-tax');
    if (labelEl) labelEl.innerText = label;
    if (hiddenInput) hiddenInput.value = rate;
    closePlanTaxDropdown();
    updateZohoSubCalculations();
  }

  function filterPlanTaxes(query) {
    renderPlanTaxOptions(query);
  }

  function addNewPlanTax() {
    const name = prompt('Enter new tax name (e.g. GST6):', 'GST6');
    if (!name) return;
    const rateStr = prompt('Enter tax rate percentage (e.g. 6):', '6');
    if (rateStr === null) return;
    const rate = parseFloat(rateStr) || 0;
    const label = \`\${name.trim()} [\${rate}%]\`;
    const taxGroup = ALL_ZOHO_PLAN_TAX_GROUPS.find(g => g.category === 'Tax Group');
    if (taxGroup) {
      taxGroup.items.push({ id: \`custom_\${Date.now()}\`, label, name: name.trim(), rate });
    }
    selectPlanTax(label, rate);
  }

  function onZohoDiscountPrefChange(pref) {
    zohoDiscountPref = pref;
    const isNoDiscount = pref === 'no-discount';
    document.querySelectorAll('.zoho-col-discount').forEach(el => {
      el.style.display = isNoDiscount ? 'none' : 'table-cell';
    });
    document.querySelectorAll('.zoho-th-plan-name').forEach(el => el.style.width = isNoDiscount ? '40%' : '34%');
    document.querySelectorAll('.zoho-th-plan-qty').forEach(el => el.style.width = isNoDiscount ? '15%' : '12%');
    document.querySelectorAll('.zoho-th-plan-price').forEach(el => el.style.width = isNoDiscount ? '15%' : '14%');
    document.querySelectorAll('.zoho-th-plan-tax').forEach(el => el.style.width = isNoDiscount ? '15%' : '13%');
    document.querySelectorAll('.zoho-th-plan-amount').forEach(el => el.style.width = isNoDiscount ? '15%' : '13%');
    updateZohoSubCalculations();
  }

`;

if (!appJs.includes('renderPlanTaxOptions')) {
  if (!appJs.includes(targetBeforeProceedRemove)) {
    console.error('Error: targetBeforeProceedRemove not found in app.js');
    process.exit(1);
  }
  appJs = appJs.replace(targetBeforeProceedRemove, newTaxFunctions + targetBeforeProceedRemove);
  console.log('✓ Added tax popover and discount preference logic');
}

// 7. Update updateZohoSubCalculations to respect discount preference and selected tax rate
const oldCalcTax = `    // 3. Combined Final Billing & 18% Tax (Point 3)
    const totalDiscounts = planDiscountAmt + totalAddonsDiscount;
    const taxableBase = Math.max(0, (planBase + totalAddonsBase) - totalDiscounts);
    const taxRate = 0.18;`;

const newCalcTax = `    // 3. Combined Final Billing & Selected Tax Rate
    const totalDiscounts = (zohoDiscountPref === 'no-discount') ? 0 : (planDiscountAmt + totalAddonsDiscount);
    const taxableBase = Math.max(0, (planBase + totalAddonsBase) - totalDiscounts);
    const planTaxVal = parseFloat(document.getElementById('zoho-plan-tax')?.value);
    const taxRate = !isNaN(planTaxVal) ? (planTaxVal / 100) : 0.18;`;

if (appJs.includes(oldCalcTax)) {
  appJs = appJs.replace(oldCalcTax, newCalcTax);
  console.log('✓ Updated updateZohoSubCalculations with selected tax rate & discount pref');
}

// 8. Add tax popover closing to outside click listener
const oldOutsideClick = `      // 5. Place of Supply popover close on tap anywhere outside
      if (!e.target.closest('.zoho-supply-popover') && !e.target.closest('.zoho-supply-trigger')) {
        closeSupplyStateDropdown();
      }
    };`;

const newOutsideClick = `      // 5. Place of Supply popover close on tap anywhere outside
      if (!e.target.closest('.zoho-supply-popover') && !e.target.closest('.zoho-supply-trigger')) {
        closeSupplyStateDropdown();
      }

      // 6. Plan Tax popover close on tap anywhere outside
      if (!e.target.closest('#zoho-plan-tax-popover') && !e.target.closest('#zoho-plan-tax-trigger')) {
        closePlanTaxDropdown();
      }
    };`;

if (appJs.includes(oldOutsideClick)) {
  appJs = appJs.replace(oldOutsideClick, newOutsideClick);
  console.log('✓ Added tax popover outside-click dismissal');
}

// 9. Export new functions on window.smatApp
const oldExportAnchor = `    proceedRemovePlan,
    updateZohoSubCalculations,`;

const newExportAnchor = `    proceedRemovePlan,
    togglePlanTaxDropdown,
    closePlanTaxDropdown,
    selectPlanTax,
    filterPlanTaxes,
    addNewPlanTax,
    onZohoDiscountPrefChange,
    updateZohoSubCalculations,`;

if (appJs.includes(oldExportAnchor)) {
  appJs = appJs.replace(oldExportAnchor, newExportAnchor);
  console.log('✓ Exported functions on window.smatApp');
}

// 10. Update styles.css with custom tax popover styling
const newCss = `
/* ========================================================================= */
/* ZOHO PLAN TAX SEARCHABLE POPOVER (SCREENSHOTS 3 & 4 MATCH)                */
/* ========================================================================= */
.zoho-tax-popover {
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
  border-radius: 6px;
  background: #FFFFFF;
}

.zoho-tax-item {
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  color: #1E293B;
}

.zoho-tax-item:hover {
  background: #3B82F6 !important;
  color: #FFFFFF !important;
}

.zoho-tax-item:hover .zoho-tax-sub {
  color: #E0E7FF !important;
}

.zoho-tax-item:hover .zoho-tax-check svg {
  stroke: #FFFFFF !important;
}

.zoho-tax-item.selected {
  background: #EEF2F6;
  font-weight: 600;
}

#zoho-plan-tax-list::-webkit-scrollbar {
  width: 6px;
}

#zoho-plan-tax-list::-webkit-scrollbar-track {
  background: #F8FAFC;
}

#zoho-plan-tax-list::-webkit-scrollbar-thumb {
  background: #CBD5E1;
  border-radius: 3px;
}
`;

if (!stylesCss.includes('ZOHO PLAN TAX SEARCHABLE POPOVER')) {
  stylesCss += newCss;
  console.log('✓ Appended tax styles to styles.css');
}

// 11. Bump cache busting version to v=10.6 in index.html
indexHtml = indexHtml.replace(/app\.js\?v=[0-9.]+/g, 'app.js?v=10.6');
indexHtml = indexHtml.replace(/styles\.css\?v=[0-9.]+/g, 'styles.css?v=10.6');
console.log('✓ Bumped cache busting version to v=10.6');

// Convert back to CRLF if original was CRLF
if (isCRLF) {
  appJs = appJs.replace(/\n/g, '\r\n');
}

// Save files
fs.writeFileSync(appJsPath, appJs, 'utf8');
fs.writeFileSync(stylesCssPath, stylesCss, 'utf8');
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');

console.log('ALL UPDATES APPLIED SUCCESSFULLY!');
