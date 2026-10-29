const fs = require('fs');
const path = require('path');

// 1. Update frontend/css/styles.css
const cssPath = path.join(__dirname, '..', 'frontend', 'css', 'styles.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

const accountDropdownCss = `
/* Zoho Plan Account Drop-up Styles (Screenshots 3 - 7 Match) */
.zoho-account-group-header {
  font-size: 0.8rem;
  font-weight: 700;
  color: #1E293B;
  padding: 8px 12px 3px 12px;
  letter-spacing: 0.2px;
}

.zoho-account-option-item {
  padding: 6px 12px;
  font-size: 0.82rem;
  color: #374151;
  cursor: pointer;
  margin: 1px 4px;
  border-radius: 4px;
  transition: all 0.1s ease;
  line-height: 1.35;
}

.zoho-account-option-item.sub-item {
  padding-left: 24px;
  display: flex;
  align-items: center;
}

.zoho-account-option-item.sub-item .sub-bullet {
  margin-right: 6px;
  font-size: 0.95rem;
  line-height: 1;
}

.zoho-account-option-item:hover,
.zoho-account-option-item.selected {
  background: #3B82F6 !important;
  color: #FFFFFF !important;
}

.zoho-account-option-item:hover .sub-bullet,
.zoho-account-option-item.selected .sub-bullet {
  color: #FFFFFF !important;
}

.zoho-account-option-item.header-only {
  font-weight: 600;
  cursor: default;
  color: #475569;
}
.zoho-account-option-item.header-only:hover {
  background: transparent !important;
  color: #475569 !important;
}
`;

if (!cssContent.includes('.zoho-account-group-header')) {
  cssContent += '\n' + accountDropdownCss;
  fs.writeFileSync(cssPath, cssContent, 'utf8');
  console.log('Added Account drop-up styles to styles.css');
}

// 2. Update frontend/js/app.js
const appPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');
let norm = appContent.replace(/\r\n/g, '\n');

// 2a. Add ALL_ZOHO_ACCOUNTS constant array
const accountsDataCode = `
  const ALL_ZOHO_ACCOUNTS = [
    {
      group: 'Other Current Asset',
      items: [
        { name: 'Advance Tax' },
        { name: 'Employee Advance' },
        { name: 'Input Tax Credits', isHeader: true },
        { name: 'Input CGST', isSub: true },
        { name: 'Input IGST', isSub: true },
        { name: 'Input SGST', isSub: true },
        { name: 'Prepaid Expenses' },
        { name: 'Reverse Charge Tax Input but not due' },
        { name: 'TDS Receivable' }
      ]
    },
    {
      group: 'Fixed Asset',
      items: [
        { name: 'Furniture and Equipment' }
      ]
    },
    {
      group: 'Other Current Liability',
      items: [
        { name: '[ Payroll-004 ] Deductions Payable' },
        { name: 'Employee Reimbursements' },
        { name: 'GST Payable', isHeader: true },
        { name: 'Output CGST', isSub: true },
        { name: 'Output IGST', isSub: true },
        { name: 'Output SGST', isSub: true },
        { name: '[ Payroll-006 ] Hold Salary Payable' },
        { name: '[ Payroll-005 ] Net Salary Payable' },
        { name: 'Opening Balance Adjustments' },
        { name: '[ Payroll-002 ] Payroll Tax Payable' },
        { name: '[ Payroll-001 ] Reimbursements Payable' },
        { name: '[ Payroll-003 ] Statutory Deductions Payable' },
        { name: 'TDS Payable' },
        { name: 'Unearned Revenue' }
      ]
    },
    {
      group: 'Non Current Liability',
      items: [
        { name: 'Construction Loans' },
        { name: 'Mortgages' }
      ]
    },
    {
      group: 'Equity',
      items: [
        { name: 'Capital Stock' },
        { name: 'Distributions' },
        { name: 'Dividends Paid' },
        { name: 'Drawings' },
        { name: 'Investments' },
        { name: 'Opening Balance Offset' },
        { name: 'Owner\\'s Equity' }
      ]
    },
    {
      group: 'Income',
      items: [
        { name: 'Discount' },
        { name: 'General Income' },
        { name: 'Interest Income' },
        { name: 'Late Fee Income' },
        { name: 'Other Charges' },
        { name: 'Sales' },
        { name: 'Shipping Charge' }
      ]
    },
    {
      group: 'Expense',
      items: [
        { name: 'Advertising And Marketing' },
        { name: 'Automobile Expense' },
        { name: 'Bad Debt' },
        { name: 'Bank Fees and Charges' },
        { name: 'Consultant Expense' },
        { name: 'Contract Assets' },
        { name: 'Credit Card Charges' },
        { name: 'Depreciation And Amortisation' },
        { name: 'Depreciation Expense' },
        { name: 'Fuel/Mileage Expenses' },
        { name: 'IT and Internet Expenses' },
        { name: 'Janitorial Expense' },
        { name: 'Lodging' },
        { name: 'Meals and Entertainment' },
        { name: 'Merchandise' },
        { name: 'Office Supplies' },
        { name: 'Other Expenses' },
        { name: 'Parking' },
        { name: 'Postage' },
        { name: 'Printing and Stationery' },
        { name: 'Purchase Discounts' },
        { name: 'Raw Materials And Consumables' },
        { name: 'Rent Expense' },
        { name: 'Repairs and Maintenance' },
        { name: 'Salaries and Employee Wages' },
        { name: 'Telephone Expense' },
        { name: 'Transportation Expense' },
        { name: 'Travel Expense' },
        { name: 'Uncategorized' }
      ]
    },
    {
      group: 'Cost Of Goods Sold',
      items: [
        { name: 'Cost of Goods Sold' },
        { name: 'Job Costing' },
        { name: 'Labor' },
        { name: 'Materials' },
        { name: 'Subcontractor' }
      ]
    }
  ];
  let zohoSelectedPlanAccount = '';
`;

const insertAfterGstTreatments = `  let zohoSelectedGstTreatment = 'Unregistered Business';`;
if (norm.includes(insertAfterGstTreatments) && !norm.includes('ALL_ZOHO_ACCOUNTS =')) {
  norm = norm.replace(insertAfterGstTreatments, insertAfterGstTreatments + '\n' + accountsDataCode);
  console.log('Added ALL_ZOHO_ACCOUNTS array to app.js');
}

// 2b. Add the Additional Information Row right under zoho-plan-row
const oldPlanRowEnd = `                      <!-- Action Dots and Tooltip (Screenshot 1 & Screenshot 3 Match) -->
                      <div style="display:flex; align-items:center; justify-content:flex-end;">
                        <div id="zoho-plan-actions-wrap" class="zoho-plan-row-actions" style="position:relative;">
                          <button type="button" id="zoho-plan-more-btn" class="zoho-btn-row-more zoho-more-trigger" onclick="event.stopPropagation(); window.smatApp.togglePlanMoreTooltip(event)" title="More options">···</button>

                          <!-- Dark Tooltip Bubble (Screenshot 3 Match) -->
                          <div id="zoho-plan-more-tooltip" class="zoho-more-popover" style="display:none; position:absolute; right:calc(100% + 10px); top:50%; transform:translateY(-50%); z-index:9999; background:#1E293B; color:#FFFFFF; border-radius:6px; padding:7px 12px; font-size:0.78rem; font-weight:500; white-space:nowrap; box-shadow:0 8px 20px rgba(0,0,0,0.25);">
                            <!-- Right-pointing triangle arrow -->
                            <div style="position:absolute; right:-5px; top:50%; transform:translateY(-50%); width:0; height:0; border-top:5px solid transparent; border-bottom:5px solid transparent; border-left:5px solid #1E293B;"></div>
                            Click here to add additional information for this item.
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>`;

const newPlanRowEnd = `                      <!-- Action Dots and Tooltip (Screenshot 1 & Screenshot 3 Match) -->
                      <div style="display:flex; align-items:center; justify-content:flex-end;">
                        <div id="zoho-plan-actions-wrap" class="zoho-plan-row-actions" style="position:relative;">
                          <button type="button" id="zoho-plan-more-btn" class="zoho-btn-row-more zoho-more-trigger" onclick="event.stopPropagation(); window.smatApp.togglePlanMoreTooltip(event)" title="More options">···</button>

                          <!-- Dark Tooltip Bubble (Screenshot 3 Match) -->
                          <div id="zoho-plan-more-tooltip" class="zoho-more-popover" onclick="event.stopPropagation(); window.smatApp.showPlanAdditionalInfo()" style="display:none; position:absolute; right:calc(100% + 10px); top:50%; transform:translateY(-50%); z-index:9999; background:#1E293B; color:#FFFFFF; border-radius:6px; padding:7px 12px; font-size:0.78rem; font-weight:500; white-space:nowrap; box-shadow:0 8px 20px rgba(0,0,0,0.25); cursor:pointer;" title="Click to show additional information">
                            <!-- Right-pointing triangle arrow -->
                            <div style="position:absolute; right:-5px; top:50%; transform:translateY(-50%); width:0; height:0; border-top:5px solid transparent; border-bottom:5px solid transparent; border-left:5px solid #1E293B;"></div>
                            Click here to add additional information for this item.
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <!-- Additional Information Row: Select an account (Screenshot 2 Match) -->
                  <tr id="zoho-plan-additional-info-row" style="background:#FAFBFD; border-bottom:1px solid #E5E7EB;">
                    <td colspan="7" style="padding:10px 1.5rem 12px 1.5rem; position:relative;">
                      <div style="position:relative; display:inline-block;">
                        <!-- Select an account trigger button -->
                        <div id="zoho-plan-account-trigger" onclick="event.stopPropagation(); window.smatApp.togglePlanAccountDropdown(event)" style="display:inline-flex; align-items:center; gap:6px; border:1px solid #CBD5E1; border-radius:4px; padding:5px 10px; font-size:0.82rem; color:#475569; background:#FFFFFF; cursor:pointer; transition:all 0.15s; user-select:none;">
                          <span style="color:#64748B; display:inline-flex; align-items:center;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#64748B"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
                          </span>
                          <span id="zoho-plan-account-label">\${zohoSelectedPlanAccount || 'Select an account'}</span>
                          <span id="zoho-plan-account-chevron" style="font-size:0.7rem; color:#6B7280; transition:transform 0.2s;">▾</span>
                        </div>

                        <!-- Searchable Drop-up Menu (Exact Match to Screenshots 3 - 5 & Subsequent Screenshots) -->
                        <div id="zoho-plan-account-dropdown" class="zoho-account-dropup-popover" style="display:none; position:absolute; bottom:calc(100% + 6px); left:0; width:250px; max-height:280px; z-index:99999; background:#FFFFFF; border:1px solid #CBD5E1; border-radius:6px; box-shadow:0 -8px 25px rgba(0,0,0,0.18); overflow:hidden;">
                          <!-- Search Box -->
                          <div style="padding:6px 8px; border-bottom:1px solid #F1F5F9;">
                            <div style="position:relative; display:flex; align-items:center;">
                              <span style="position:absolute; left:8px; top:50%; transform:translateY(-50%); display:flex; align-items:center; pointer-events:none; color:#94A3B8;">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                              </span>
                              <input type="text" id="zoho-plan-account-search" placeholder="Search" oninput="window.smatApp.filterPlanAccounts(this.value)" onclick="event.stopPropagation()" style="width:100%; border:1.5px solid #3B82F6; border-radius:4px; padding:5px 8px 5px 26px; font-size:0.82rem; color:#1E293B; outline:none; box-sizing:border-box;" />
                            </div>
                          </div>

                          <!-- Scrollable Accounts List -->
                          <div id="zoho-plan-account-list" style="max-height:225px; overflow-y:auto; padding:4px 0;">
                            <!-- Populated dynamically -->
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>`;

if (norm.includes(oldPlanRowEnd)) {
  norm = norm.replace(oldPlanRowEnd, newPlanRowEnd);
  console.log('Added Additional Information Row with Select an account drop-up in app.js');
} else {
  console.log('Warning: oldPlanRowEnd not found in app.js');
}

// Remove the small temporary "Select an account" we added under SAC code in previous turn
const tempSacAccount = `                          <!-- Select an account (Screenshot Match) -->
                          <div style="margin-top:6px; display:inline-flex; align-items:center; gap:5px; font-size:0.75rem; color:#6B7280; cursor:pointer;" title="Select Account">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                            <span>Select an account</span>
                            <span style="font-size:0.7rem;">▾</span>
                          </div>`;

if (norm.includes(tempSacAccount)) {
  norm = norm.replace(tempSacAccount, '');
  console.log('Cleaned up temporary SAC select-account element in app.js');
}

// 2c. Add Helper functions for Plan Account drop-up
const accountHelperFns = `
  function renderPlanAccountOptions(filterText) {
    const container = document.getElementById('zoho-plan-account-list');
    if (!container) return;
    const query = (filterText || '').toLowerCase().trim();
    let html = '';

    ALL_ZOHO_ACCOUNTS.forEach(grp => {
      const matchingItems = grp.items.filter(it => {
        if (!query) return true;
        return it.name.toLowerCase().includes(query) || grp.group.toLowerCase().includes(query);
      });

      if (matchingItems.length > 0) {
        html += \`<div class="zoho-account-group-header">\${escapeHtml(grp.group)}</div>\`;
        matchingItems.forEach(it => {
          if (it.isHeader) {
            html += \`<div class="zoho-account-option-item header-only">\${escapeHtml(it.name)}</div>\`;
          } else if (it.isSub) {
            const isSel = it.name === zohoSelectedPlanAccount;
            html += \`
              <div class="zoho-account-option-item sub-item \${isSel ? 'selected' : ''}" onclick="event.stopPropagation(); window.smatApp.selectPlanAccount('\${it.name.replace(/'/g, "\\\\'")}')">
                <span class="sub-bullet">•</span> \${escapeHtml(it.name)}
              </div>
            \`;
          } else {
            const isSel = it.name === zohoSelectedPlanAccount;
            html += \`
              <div class="zoho-account-option-item \${isSel ? 'selected' : ''}" onclick="event.stopPropagation(); window.smatApp.selectPlanAccount('\${it.name.replace(/'/g, "\\\\'")}')">
                \${escapeHtml(it.name)}
              </div>
            \`;
          }
        });
      }
    });

    if (!html) {
      html = '<div style="padding:12px; text-align:center; color:#94A3B8; font-size:0.8rem;">No matching accounts found</div>';
    }

    container.innerHTML = html;
  }

  function showPlanAdditionalInfo() {
    const tooltip = document.getElementById('zoho-plan-more-tooltip');
    if (tooltip) tooltip.style.display = 'none';
    const row = document.getElementById('zoho-plan-additional-info-row');
    if (row) {
      row.style.display = 'table-row';
      row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function togglePlanAccountDropdown(evt) {
    if (evt) evt.stopPropagation();
    const dropdown = document.getElementById('zoho-plan-account-dropdown');
    const trigger = document.getElementById('zoho-plan-account-trigger');
    const chevron = document.getElementById('zoho-plan-account-chevron');
    if (!dropdown) return;
    const isCurrentlyOpen = dropdown.style.display === 'block';

    closeAllMorePopovers();
    closeGstPreferencesPopover();
    closeShippingGstPopover();
    closeSupplyStateDropdown();

    if (!isCurrentlyOpen) {
      dropdown.style.display = 'block';
      if (trigger) trigger.style.border = '1.5px solid #3B82F6';
      if (chevron) chevron.innerText = '▲';
      renderPlanAccountOptions();
      setTimeout(() => {
        const inp = document.getElementById('zoho-plan-account-search');
        if (inp) {
          inp.value = '';
          inp.focus();
        }
      }, 50);
    } else {
      closePlanAccountDropdown();
    }
  }

  function closePlanAccountDropdown() {
    const dropdown = document.getElementById('zoho-plan-account-dropdown');
    const trigger = document.getElementById('zoho-plan-account-trigger');
    const chevron = document.getElementById('zoho-plan-account-chevron');
    if (dropdown) dropdown.style.display = 'none';
    if (trigger) trigger.style.border = '1px solid #CBD5E1';
    if (chevron) chevron.innerText = '▾';
  }

  function selectPlanAccount(name) {
    zohoSelectedPlanAccount = name;
    const label = document.getElementById('zoho-plan-account-label');
    if (label) {
      label.innerText = name;
      label.style.fontWeight = '600';
      label.style.color = '#1E293B';
    }
    closePlanAccountDropdown();
  }

  function filterPlanAccounts(query) {
    renderPlanAccountOptions(query);
  }
`;

const insertBeforeShowRemovePlan = `  function showRemovePlanModal() {`;
if (norm.includes(insertBeforeShowRemovePlan) && !norm.includes('function renderPlanAccountOptions')) {
  norm = norm.replace(insertBeforeShowRemovePlan, accountHelperFns + '\n' + insertBeforeShowRemovePlan);
  console.log('Added Plan Account drop-up helper functions in app.js');
}

// 2d. In document click listener, handle clicks outside zoho-plan-account-dropdown
const oldOutsideClickPlan = `      // 5. Place of Supply popover close on tap anywhere outside
      const supplyPop = document.getElementById('zoho-supply-state-popover');
      if (supplyPop && supplyPop.style.display === 'block' && !e.target.closest('#zoho-supply-state-popover') && !e.target.closest('#zoho-supply-state-trigger')) {
        closeSupplyStateDropdown();
      }`;

const newOutsideClickPlan = `      // 5. Place of Supply popover close on tap anywhere outside
      const supplyPop = document.getElementById('zoho-supply-state-popover');
      if (supplyPop && supplyPop.style.display === 'block' && !e.target.closest('#zoho-supply-state-popover') && !e.target.closest('#zoho-supply-state-trigger')) {
        closeSupplyStateDropdown();
      }

      // 6. Plan Account drop-up close on tap anywhere outside
      const accountDropdown = document.getElementById('zoho-plan-account-dropdown');
      if (accountDropdown && accountDropdown.style.display === 'block' && !e.target.closest('#zoho-plan-account-dropdown') && !e.target.closest('#zoho-plan-account-trigger')) {
        closePlanAccountDropdown();
      }`;

if (norm.includes(oldOutsideClickPlan)) {
  norm = norm.replace(oldOutsideClickPlan, newOutsideClickPlan);
  console.log('Added outside click handling for Plan Account drop-up in app.js');
}

// 2e. Export functions in window.smatApp
const exportTargetAccount = `    closeSupplyStateDropdown,
    selectSupplyState,`;

const exportWithAccount = `    closeSupplyStateDropdown,
    selectSupplyState,
    showPlanAdditionalInfo,
    togglePlanAccountDropdown,
    closePlanAccountDropdown,
    selectPlanAccount,
    filterPlanAccounts,`;

if (norm.includes(exportTargetAccount) && !norm.includes('togglePlanAccountDropdown,')) {
  norm = norm.replace(exportTargetAccount, exportWithAccount);
  console.log('Exported Plan Account drop-up functions in app.js');
}

fs.writeFileSync(appPath, norm.replace(/\n/g, '\r\n'), 'utf8');
console.log('Plan Account drop-up applied successfully!');
