// Script to apply Addon Tax Searchable Dropdown matching Plan Tax and user reference
const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
const indexHtmlPath = path.join(__dirname, '..', 'frontend', 'index.html');

let appJsRaw = fs.readFileSync(appJsPath, 'utf8');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const isCRLF = appJsRaw.includes('\r\n');
let appJs = appJsRaw.replace(/\r\n/g, '\n');

console.log('Original app.js length:', appJs.length, 'isCRLF:', isCRLF);

// 1. Update zohoSubAddons initial taxLabel if not already
if (!appJs.includes("taxLabel: 'GST18 [18%]'")) {
  appJs = appJs.replace(
    "taxRate: 18,\n      isEmpty: false",
    "taxRate: 18,\n      taxLabel: 'GST18 [18%]',\n      isEmpty: false"
  );
  console.log('✓ Updated initial zohoSubAddons taxLabel');
}

// 2. Update Addons Table Header TH classes for responsive widths
const oldAddonHeader = `                  <tr style="background:#F9FAFB; border-bottom:1px solid #E5E7EB; color:#6B7280; font-size:0.75rem; font-weight:700; text-transform:uppercase;">
                    <th style="padding:0.65rem 1rem; text-align:left; width:36%;">ADDON NAME</th>
                    <th style="padding:0.65rem 0.75rem; text-align:center; width:12%;">QUANTITY</th>
                    <th style="padding:0.65rem 0.75rem; text-align:right; width:14%;">PRICE</th>
                    <th class="zoho-col-discount" style="padding:0.65rem 0.75rem; text-align:center; width:14%; display:\${zohoDiscountPref === 'no-discount' ? 'none' : 'table-cell'};">DISCOUNT</th>
                    <th style="padding:0.65rem 0.75rem; text-align:left; width:12%;">TAX</th>
                    <th style="padding:0.65rem 1rem; text-align:right; width:12%;">AMOUNT</th>
                  </tr>`;

const newAddonHeader = `                  <tr style="background:#F9FAFB; border-bottom:1px solid #E5E7EB; color:#6B7280; font-size:0.75rem; font-weight:700; text-transform:uppercase;">
                    <th class="zoho-th-addon-name" style="padding:0.65rem 1rem; text-align:left; width:\${zohoDiscountPref === 'no-discount' ? '40%' : '34%'};">ADDON NAME</th>
                    <th class="zoho-th-addon-qty" style="padding:0.65rem 0.75rem; text-align:center; width:\${zohoDiscountPref === 'no-discount' ? '15%' : '12%'};">QUANTITY</th>
                    <th class="zoho-th-addon-price" style="padding:0.65rem 0.75rem; text-align:right; width:\${zohoDiscountPref === 'no-discount' ? '15%' : '14%'};">PRICE</th>
                    <th class="zoho-col-discount" style="padding:0.65rem 0.75rem; text-align:center; width:14%; display:\${zohoDiscountPref === 'no-discount' ? 'none' : 'table-cell'};">DISCOUNT</th>
                    <th class="zoho-th-addon-tax" style="padding:0.65rem 0.75rem; text-align:left; width:\${zohoDiscountPref === 'no-discount' ? '15%' : '13%'};">TAX</th>
                    <th class="zoho-th-addon-amount" style="padding:0.65rem 1rem; text-align:right; width:\${zohoDiscountPref === 'no-discount' ? '15%' : '13%'};">AMOUNT</th>
                  </tr>`;

if (appJs.includes(oldAddonHeader)) {
  appJs = appJs.replace(oldAddonHeader, newAddonHeader);
  console.log('✓ Updated Addons Table Header TH');
} else {
  console.log('Addons Table Header TH already updated');
}

// 3. Replace Addon Row Tax cell with custom searchable dropdown if old select still present
const oldAddonTaxCell = `                      <!-- Tax (Screenshot 1: "Select a Tax ▾" for empty, GST18 for filled) -->
                      <td style="padding:1rem 0.75rem;">
                        <select id="zoho-addon-tax-\${idx}" style="border:1px solid #D1D5DB; border-radius:4px; padding:4px; font-size:0.8rem; width:100%; color:#4B5563;" onchange="window.smatApp.updateZohoSubCalculations()">
                          \${isRowEmpty ? \`<option value="0" selected>Select a Tax</option>\` : ''}
                          <option value="18" \${addon.taxRate === 18 ? 'selected' : ''}>GST18 [18%]</option>
                          <option value="12" \${addon.taxRate === 12 ? 'selected' : ''}>GST12 [12%]</option>
                          <option value="5" \${addon.taxRate === 5 ? 'selected' : ''}>GST5 [5%]</option>
                          <option value="0" \${addon.taxRate === 0 && !isRowEmpty ? 'selected' : ''}>None [0%]</option>
                        </select>
                      </td>`;

const newAddonTaxCell = `                      <!-- Tax: Custom Searchable Dropdown (Screenshots 1 & 2 Match) -->
                      <td style="padding:1rem 0.75rem; position:relative;">
                        <div id="zoho-addon-tax-wrapper-\${idx}" style="position:relative; width:100%; min-width:130px;">
                          <button type="button" id="zoho-addon-tax-trigger-\${idx}" onclick="event.stopPropagation(); window.smatApp.toggleAddonTaxDropdown(\${idx}, event)" style="display:flex; align-items:center; justify-content:space-between; width:100%; border:1px solid #CBD5E1; border-radius:4px; padding:5px 8px; background:#FFFFFF; font-size:0.82rem; color:#1E293B; cursor:pointer; text-align:left; transition:all 0.15s; user-select:none;">
                            <span id="zoho-addon-tax-label-\${idx}" style="font-weight:500;">\${addon.taxLabel || (isRowEmpty ? 'Select a Tax' : 'GST18 [18%]')}</span>
                            <span id="zoho-addon-tax-chevron-\${idx}" style="color:#2563EB; font-size:0.75rem; margin-left:4px; display:inline-flex; align-items:center; transition:transform 0.2s;">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </span>
                          </button>
                          <input type="hidden" id="zoho-addon-tax-\${idx}" value="\${addon.taxRate !== undefined ? addon.taxRate : (isRowEmpty ? 0 : 18)}" />

                          <!-- Searchable Popover Dropdown (Screenshots 1 & 2 Match) -->
                          <div id="zoho-addon-tax-popover-\${idx}" class="zoho-tax-popover zoho-addon-tax-popover" style="display:none; position:absolute; top:calc(100% + 4px); left:0; width:260px; z-index:99999; background:#FFFFFF; border:1px solid #CBD5E1; border-radius:6px; box-shadow:0 12px 28px rgba(0,0,0,0.18); overflow:hidden; text-align:left;">
                            <!-- Search Bar (Screenshot 2 Match) -->
                            <div style="padding:8px 10px 6px 10px; border-bottom:1px solid #F1F5F9;">
                              <div style="display:flex; align-items:center; gap:6px; border:1.5px solid #3B82F6; border-radius:5px; padding:4px 8px; background:#FFFFFF;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                <input type="text" id="zoho-addon-tax-search-\${idx}" placeholder="Search" oninput="window.smatApp.filterAddonTaxes(\${idx}, this.value)" style="border:none; outline:none; font-size:0.82rem; width:100%; color:#1E293B; background:transparent;" />
                              </div>
                            </div>

                            <!-- Categories & Items (Screenshot 2 Match) -->
                            <div id="zoho-addon-tax-list-\${idx}" style="max-height:220px; overflow-y:auto; padding:4px 6px;"></div>

                            <!-- Fixed Bottom Action: New Tax (Screenshot 2 Match) -->
                            <div style="border-top:1px solid #F1F5F9; padding:8px 12px; background:#FFFFFF;">
                              <div onclick="event.stopPropagation(); window.smatApp.addNewAddonTax(\${idx})" style="display:inline-flex; align-items:center; gap:6px; color:#2563EB; font-size:0.82rem; font-weight:600; cursor:pointer; user-select:none;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#2563EB"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
                                <span>New Tax</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>`;

if (appJs.includes(oldAddonTaxCell)) {
  appJs = appJs.replace(oldAddonTaxCell, newAddonTaxCell);
  console.log('✓ Updated Addon Row Tax Cell with Popover');
} else {
  console.log('Addon Row Tax Cell already updated');
}

// 4. Add Addon Tax Dropdown helper functions
const targetBeforeOnZohoAddonChange = `  function onZohoAddonChange(idx, val) {`;
const addonTaxFunctions = `  function renderAddonTaxOptions(idx, query = '') {
    const container = document.getElementById(\`zoho-addon-tax-list-\${idx}\`);
    if (!container) return;
    const q = (query || '').toLowerCase().trim();
    let html = '';
    const currentAddon = zohoSubAddons[idx] || {};
    const selectedLabel = currentAddon.taxLabel || 'GST18 [18%]';

    ALL_ZOHO_PLAN_TAX_GROUPS.forEach(group => {
      const matchingItems = group.items.filter(item => {
        if (!q) return true;
        return item.label.toLowerCase().includes(q) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(q));
      });

      if (matchingItems.length > 0) {
        html += \`<div style="font-size:0.75rem; font-weight:700; color:#475569; padding:6px 8px 3px 8px; user-select:none;">\${escapeHtml(group.category)}</div>\`;
        matchingItems.forEach(item => {
          const isSelected = (item.label === selectedLabel);
          html += \`
            <div class="zoho-tax-item \${isSelected ? 'selected' : ''}" 
                 onclick="event.stopPropagation(); window.smatApp.selectAddonTax(\${idx}, '\${escapeHtml(item.label)}', \${item.rate})"
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

  function toggleAddonTaxDropdown(idx, evt) {
    if (evt) evt.stopPropagation();
    const pop = document.getElementById(\`zoho-addon-tax-popover-\${idx}\`);
    const trigger = document.getElementById(\`zoho-addon-tax-trigger-\${idx}\`);
    const chevron = document.getElementById(\`zoho-addon-tax-chevron-\${idx}\`);
    if (!pop) return;
    const isCurrentlyOpen = pop.style.display === 'block';

    closeAllMorePopovers();
    closeGstPreferencesPopover();
    closeShippingGstPopover();
    closeSupplyStateDropdown();
    closePlanAccountDropdown();
    closePlanTaxDropdown();
    closeAllAddonTaxDropdowns();

    if (!isCurrentlyOpen) {
      pop.style.display = 'block';
      if (trigger) {
        trigger.style.borderColor = '#3B82F6';
        trigger.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.15)';
      }
      if (chevron) chevron.style.transform = 'rotate(180deg)';
      renderAddonTaxOptions(idx);
      setTimeout(() => {
        const inp = document.getElementById(\`zoho-addon-tax-search-\${idx}\`);
        if (inp) {
          inp.value = '';
          inp.focus();
        }
      }, 50);
    } else {
      closeAddonTaxDropdown(idx);
    }
  }

  function closeAddonTaxDropdown(idx) {
    const pop = document.getElementById(\`zoho-addon-tax-popover-\${idx}\`);
    const trigger = document.getElementById(\`zoho-addon-tax-trigger-\${idx}\`);
    const chevron = document.getElementById(\`zoho-addon-tax-chevron-\${idx}\`);
    if (pop) pop.style.display = 'none';
    if (trigger) {
      trigger.style.borderColor = '#CBD5E1';
      trigger.style.boxShadow = 'none';
    }
    if (chevron) chevron.style.transform = 'rotate(0deg)';
  }

  function closeAllAddonTaxDropdowns() {
    document.querySelectorAll('.zoho-addon-tax-popover').forEach(p => p.style.display = 'none');
    document.querySelectorAll('[id^="zoho-addon-tax-trigger-"]').forEach(t => {
      t.style.borderColor = '#CBD5E1';
      t.style.boxShadow = 'none';
    });
    document.querySelectorAll('[id^="zoho-addon-tax-chevron-"]').forEach(c => {
      c.style.transform = 'rotate(0deg)';
    });
  }

  function selectAddonTax(idx, label, rate) {
    if (zohoSubAddons[idx]) {
      zohoSubAddons[idx].taxLabel = label;
      zohoSubAddons[idx].taxRate = rate;
    }
    const labelEl = document.getElementById(\`zoho-addon-tax-label-\${idx}\`);
    const hiddenInput = document.getElementById(\`zoho-addon-tax-\${idx}\`);
    if (labelEl) labelEl.innerText = label;
    if (hiddenInput) hiddenInput.value = rate;
    closeAddonTaxDropdown(idx);
    updateZohoSubCalculations();
  }

  function filterAddonTaxes(idx, query) {
    renderAddonTaxOptions(idx, query);
  }

  function addNewAddonTax(idx) {
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
    selectAddonTax(idx, label, rate);
  }

`;

if (!appJs.includes('renderAddonTaxOptions')) {
  if (!appJs.includes(targetBeforeOnZohoAddonChange)) {
    console.error('Error: targetBeforeOnZohoAddonChange not found');
    process.exit(1);
  }
  appJs = appJs.replace(targetBeforeOnZohoAddonChange, addonTaxFunctions + targetBeforeOnZohoAddonChange);
  console.log('✓ Added addon tax functions');
}

// 5. Update onZohoDiscountPrefChange to also adjust Addons table column widths
const oldPrefChange = `    document.querySelectorAll('.zoho-th-plan-amount').forEach(el => el.style.width = isNoDiscount ? '15%' : '13%');
    updateZohoSubCalculations();`;

const newPrefChange = `    document.querySelectorAll('.zoho-th-plan-amount').forEach(el => el.style.width = isNoDiscount ? '15%' : '13%');
    document.querySelectorAll('.zoho-th-addon-name').forEach(el => el.style.width = isNoDiscount ? '40%' : '34%');
    document.querySelectorAll('.zoho-th-addon-qty').forEach(el => el.style.width = isNoDiscount ? '15%' : '12%');
    document.querySelectorAll('.zoho-th-addon-price').forEach(el => el.style.width = isNoDiscount ? '15%' : '14%');
    document.querySelectorAll('.zoho-th-addon-tax').forEach(el => el.style.width = isNoDiscount ? '15%' : '13%');
    document.querySelectorAll('.zoho-th-addon-amount').forEach(el => el.style.width = isNoDiscount ? '15%' : '13%');
    updateZohoSubCalculations();`;

if (appJs.includes(oldPrefChange)) {
  appJs = appJs.replace(oldPrefChange, newPrefChange);
  console.log('✓ Updated onZohoDiscountPrefChange for addons');
}

// 6. Update addZohoSubAddonRow default taxLabel
appJs = appJs.replace(
  "taxRate: 0,\n      isEmpty: true",
  "taxRate: 18,\n      taxLabel: 'GST18 [18%]',\n      isEmpty: true"
);
console.log('✓ Updated addZohoSubAddonRow default taxLabel');

// 7. Update onZohoAddonChange to set taxLabel
appJs = appJs.replace(
  "taxRate: 18,\n    zohoSubAddons[idx].isEmpty = false;",
  "taxRate: 18,\n    zohoSubAddons[idx].taxLabel = 'GST18 [18%]';\n    zohoSubAddons[idx].isEmpty = false;"
);
console.log('✓ Updated onZohoAddonChange taxLabel');

// 8. Update outside click listener for addon tax popovers
const oldOutsideClick = `      // 6. Plan Tax popover close on tap anywhere outside
      if (!e.target.closest('#zoho-plan-tax-popover') && !e.target.closest('#zoho-plan-tax-trigger')) {
        closePlanTaxDropdown();
      }
    };`;

const newOutsideClick = `      // 6. Plan Tax popover close on tap anywhere outside
      if (!e.target.closest('#zoho-plan-tax-popover') && !e.target.closest('#zoho-plan-tax-trigger')) {
        closePlanTaxDropdown();
      }

      // 7. Addon Tax popover close on tap anywhere outside
      if (!e.target.closest('.zoho-addon-tax-popover') && !e.target.closest('[id^="zoho-addon-tax-trigger-"]')) {
        closeAllAddonTaxDropdowns();
      }
    };`;

if (appJs.includes(oldOutsideClick)) {
  appJs = appJs.replace(oldOutsideClick, newOutsideClick);
  console.log('✓ Added addon tax outside-click dismissal');
}

// 9. Export addon tax functions on window.smatApp
const oldExport = `    togglePlanTaxDropdown,
    closePlanTaxDropdown,
    selectPlanTax,
    filterPlanTaxes,
    addNewPlanTax,`;

const newExport = `    togglePlanTaxDropdown,
    closePlanTaxDropdown,
    selectPlanTax,
    filterPlanTaxes,
    addNewPlanTax,
    toggleAddonTaxDropdown,
    closeAddonTaxDropdown,
    closeAllAddonTaxDropdowns,
    selectAddonTax,
    filterAddonTaxes,
    addNewAddonTax,`;

if (appJs.includes(oldExport)) {
  appJs = appJs.replace(oldExport, newExport);
  console.log('✓ Exported addon tax functions on window.smatApp');
}

// 10. Bump cache busting version to v=10.7 in index.html
indexHtml = indexHtml.replace(/app\.js\?v=[0-9.]+/g, 'app.js?v=10.7');
indexHtml = indexHtml.replace(/styles\.css\?v=[0-9.]+/g, 'styles.css?v=10.7');
console.log('✓ Bumped cache busting version to v=10.7');

// Convert back to CRLF if original was CRLF
if (isCRLF) {
  appJs = appJs.replace(/\n/g, '\r\n');
}

// Save files
fs.writeFileSync(appJsPath, appJs, 'utf8');
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');

console.log('ALL ADDON TAX UPDATES APPLIED SUCCESSFULLY!');
