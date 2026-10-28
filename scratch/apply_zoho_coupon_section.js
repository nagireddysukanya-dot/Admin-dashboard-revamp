// Script to add the Coupon section between Addons and Subscription Term
const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
const indexHtmlPath = path.join(__dirname, '..', 'frontend', 'index.html');

let appJsRaw = fs.readFileSync(appJsPath, 'utf8');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const isCRLF = appJsRaw.includes('\r\n');
let appJs = appJsRaw.replace(/\r\n/g, '\n');

console.log('Original app.js length:', appJs.length, 'isCRLF:', isCRLF);

// 1. Add selectedZohoCoupon state variable right above ALL_ZOHO_PLAN_TAX_GROUPS
if (!appJs.includes('let selectedZohoCoupon = null;')) {
  appJs = appJs.replace(
    "let zohoDiscountPref = 'no-discount';",
    "let zohoDiscountPref = 'no-discount';\n  let selectedZohoCoupon = null;"
  );
  console.log('✓ Added selectedZohoCoupon state variable');
}

// 2. Add Coupon Section HTML right between Addons and Section 3: Subscription Term
const targetAddonEnd = `            <!-- Add New Row Button (Screenshot 3) -->
            <div style="margin-bottom:2rem;">
              <button type="button" class="btn-table-action btn-action-secondary" onclick="window.smatApp.addZohoSubAddonRow()" style="font-size:0.84rem; display:inline-flex; align-items:center; gap:6px; color:#2563EB;">
                <span>⊕ Add New Row</span>
                <span style="font-size:0.75rem;">⌄</span>
              </button>
            </div>

          </div>

          <!-- SECTION 3: SUBSCRIPTION TERM (SCREENSHOT 3) -->`;

const newCouponSection = `            <!-- Add New Row Button (Screenshot 3) -->
            <div style="margin-bottom:2rem;">
              <button type="button" class="btn-table-action btn-action-secondary" onclick="window.smatApp.addZohoSubAddonRow()" style="font-size:0.84rem; display:inline-flex; align-items:center; gap:6px; color:#2563EB;">
                <span>⊕ Add New Row</span>
                <span style="font-size:0.75rem;">⌄</span>
              </button>
            </div>

          </div>

          <!-- SECTION 2.5: COUPON TABLE (EXACT MATCH TO USER REFERENCE SCREENSHOT 1) -->
          <div style="margin-top:2rem; margin-bottom:2rem; padding-top:1.5rem; border-top:1px solid #E5E7EB;">
            <h2 style="font-size:1.1rem; font-weight:700; color:#111827; margin:0 0 0.75rem 0;">Coupon</h2>
            <div style="display:flex; align-items:center; gap:12px; max-width:850px;">
              <div style="flex:1; border:1px solid #E5E7EB; border-radius:6px; overflow:visible; background:#FFFFFF; position:relative;">
                <table style="width:100%; border-collapse:collapse; font-size:0.85rem;">
                  <thead>
                    <tr style="background:#F9FAFB; border-bottom:1px solid #E5E7EB; color:#6B7280; font-size:0.75rem; font-weight:700; text-transform:uppercase;">
                      <th style="padding:0.65rem 1rem; text-align:left; width:45%; border-right:1px solid #E5E7EB;">COUPON</th>
                      <th style="padding:0.65rem 1rem; text-align:left; width:33%; border-right:1px solid #E5E7EB;">COUPON CODE</th>
                      <th style="padding:0.65rem 1rem; text-align:left; width:22%;">VALUE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="vertical-align:middle; background:#FFFFFF;">
                      <!-- COUPON Searchable Dropdown / Input (Screenshot 1 Match) -->
                      <td style="padding:0.5rem 0.75rem; border-right:1px solid #E5E7EB; position:relative;">
                        <div id="zoho-coupon-search-wrapper" style="position:relative; width:100%;">
                          <div style="display:flex; align-items:center; justify-content:space-between; width:100%; cursor:pointer;" onclick="window.smatApp.toggleZohoCouponDropdown(event)">
                            <input type="text" 
                                   id="zoho-coupon-search-input" 
                                   placeholder="Enter at least 3 characters to search" 
                                   value="\${selectedZohoCoupon ? escapeHtml(selectedZohoCoupon.name) : ''}"
                                   oninput="window.smatApp.onZohoCouponInput(this.value, event)"
                                   onclick="event.stopPropagation(); window.smatApp.openZohoCouponDropdown()"
                                   style="border:none; outline:none; font-size:0.83rem; color:#1F2937; width:100%; background:transparent; padding:2px 0;" />
                            <span id="zoho-coupon-chevron" style="color:#6B7280; font-size:0.75rem; margin-left:6px; pointer-events:none; transition:transform 0.2s;">⌵</span>
                          </div>

                          <!-- Coupon Search Popover / Dropdown (Screenshot 1 Match) -->
                          <div id="zoho-coupon-popover" class="zoho-coupon-popover" style="display:none; position:absolute; top:calc(100% + 6px); left:0; width:100%; min-width:320px; z-index:99999; background:#FFFFFF; border:1px solid #CBD5E1; border-radius:6px; box-shadow:0 12px 28px rgba(0,0,0,0.18); max-height:220px; overflow-y:auto; text-align:left;">
                            <div id="zoho-coupon-results-list" style="padding:4px 6px;"></div>
                          </div>
                        </div>
                      </td>

                      <!-- COUPON CODE -->
                      <td style="padding:0.5rem 1rem; border-right:1px solid #E5E7EB;">
                        <input type="text" id="zoho-coupon-code-disp" readonly placeholder="" value="\${selectedZohoCoupon ? escapeHtml(selectedZohoCoupon.code) : ''}" style="width:100%; border:none; outline:none; background:transparent; font-size:0.83rem; color:#1F2937;" />
                      </td>

                      <!-- VALUE -->
                      <td style="padding:0.5rem 1rem;">
                        <input type="text" id="zoho-coupon-value-disp" readonly placeholder="" value="\${selectedZohoCoupon ? escapeHtml(selectedZohoCoupon.discount_value) : ''}" style="width:100%; border:none; outline:none; background:transparent; font-size:0.83rem; color:#1F2937;" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Red ✕ Clear / Delete Button (Screenshot 1 Match) -->
              <span id="zoho-coupon-clear-btn" 
                    onclick="window.smatApp.clearZohoCoupon()" 
                    title="Remove Coupon" 
                    style="color:#EF4444; font-size:1.1rem; font-weight:700; cursor:pointer; user-select:none; padding:4px 6px; transition:transform 0.15s; display:inline-flex; align-items:center; justify-content:center;"
                    onmouseover="this.style.transform='scale(1.15)'"
                    onmouseout="this.style.transform='scale(1)'">
                ✕
              </span>
            </div>
          </div>

          <!-- SECTION 3: SUBSCRIPTION TERM (SCREENSHOT 3) -->`;

if (appJs.includes(targetAddonEnd)) {
  appJs = appJs.replace(targetAddonEnd, newCouponSection);
  console.log('✓ Added Coupon Section between Addons and Subscription Term');
} else {
  console.error('Error: targetAddonEnd not found in app.js');
  process.exit(1);
}

// 3. Add Coupon helper functions before proceedRemovePlan
const targetBeforeProceedRemove = `  function proceedRemovePlan() {`;
const couponFunctions = `  function openZohoCouponDropdown() {
    const pop = document.getElementById('zoho-coupon-popover');
    const chevron = document.getElementById('zoho-coupon-chevron');
    if (!pop) return;
    closeAllMorePopovers();
    closeGstPreferencesPopover();
    closeShippingGstPopover();
    closeSupplyStateDropdown();
    closePlanAccountDropdown();
    closePlanTaxDropdown();
    closeAllAddonTaxDropdowns();
    pop.style.display = 'block';
    if (chevron) chevron.style.transform = 'rotate(180deg)';
    renderZohoCouponResults(document.getElementById('zoho-coupon-search-input')?.value || '');
  }

  function toggleZohoCouponDropdown(evt) {
    if (evt) evt.stopPropagation();
    const pop = document.getElementById('zoho-coupon-popover');
    if (!pop) return;
    if (pop.style.display === 'block') {
      closeZohoCouponDropdown();
    } else {
      openZohoCouponDropdown();
    }
  }

  function closeZohoCouponDropdown() {
    const pop = document.getElementById('zoho-coupon-popover');
    const chevron = document.getElementById('zoho-coupon-chevron');
    if (pop) pop.style.display = 'none';
    if (chevron) chevron.style.transform = 'rotate(0deg)';
  }

  function onZohoCouponInput(query, evt) {
    if (evt) evt.stopPropagation();
    openZohoCouponDropdown();
    renderZohoCouponResults(query);
  }

  function renderZohoCouponResults(query = '') {
    const container = document.getElementById('zoho-coupon-results-list');
    if (!container) return;
    const q = (query || '').toLowerCase().trim();

    if (q.length < 3) {
      container.innerHTML = \`<div style="padding:10px 12px; font-size:0.8rem; color:#94A3B8; font-style:italic;">Enter at least 3 characters to search</div>\`;
      return;
    }

    const availableCoupons = (typeof couponsData !== 'undefined' ? couponsData : []).filter(c => {
      const nameMatch = (c.name || '').toLowerCase().includes(q);
      const codeMatch = (c.code || '').toLowerCase().includes(q);
      return nameMatch || codeMatch;
    });

    if (availableCoupons.length === 0) {
      container.innerHTML = \`<div style="padding:10px 12px; font-size:0.8rem; color:#94A3B8;">No coupons found for "\${escapeHtml(query)}"</div>\`;
      return;
    }

    container.innerHTML = availableCoupons.map(c => {
      const isSel = selectedZohoCoupon && selectedZohoCoupon.code === c.code;
      return \`
        <div class="zoho-tax-item \${isSel ? 'selected' : ''}" 
             onclick="event.stopPropagation(); window.smatApp.selectZohoCoupon(\${c.id})"
             style="display:flex; align-items:center; justify-content:space-between; padding:7px 10px; margin-bottom:2px; border-radius:4px; cursor:pointer;">
          <div>
            <div style="font-size:0.84rem; font-weight:600; color:#1E293B;">\${escapeHtml(c.name)}</div>
            <div style="font-size:0.74rem; color:#64748B;">Code: <span style="font-weight:600; color:#2563EB;">\${escapeHtml(c.code)}</span> • Value: \${escapeHtml(c.discount_value)}</div>
          </div>
          <span style="background:#EEF2F6; color:#2563EB; font-size:0.72rem; font-weight:700; padding:2px 6px; border-radius:3px;">\${escapeHtml(c.discount_value)}</span>
        </div>
      \`;
    }).join('');
  }

  function selectZohoCoupon(couponId) {
    const found = (typeof couponsData !== 'undefined' ? couponsData : []).find(c => c.id === couponId || c.id === Number(couponId));
    if (!found) return;
    selectedZohoCoupon = found;
    const inp = document.getElementById('zoho-coupon-search-input');
    const codeDisp = document.getElementById('zoho-coupon-code-disp');
    const valDisp = document.getElementById('zoho-coupon-value-disp');
    if (inp) inp.value = found.name;
    if (codeDisp) codeDisp.value = found.code;
    if (valDisp) valDisp.value = found.discount_value;
    closeZohoCouponDropdown();
    updateZohoSubCalculations();
  }

  function clearZohoCoupon() {
    selectedZohoCoupon = null;
    const inp = document.getElementById('zoho-coupon-search-input');
    const codeDisp = document.getElementById('zoho-coupon-code-disp');
    const valDisp = document.getElementById('zoho-coupon-value-disp');
    if (inp) inp.value = '';
    if (codeDisp) codeDisp.value = '';
    if (valDisp) valDisp.value = '';
    closeZohoCouponDropdown();
    updateZohoSubCalculations();
  }

`;

if (!appJs.includes('function selectZohoCoupon')) {
  appJs = appJs.replace(targetBeforeProceedRemove, couponFunctions + targetBeforeProceedRemove);
  console.log('✓ Added coupon helper functions');
}

// 4. Update outside click to close coupon popover
const oldOutsideClick = `      // 7. Addon Tax popover close on tap anywhere outside
      if (!e.target.closest('.zoho-addon-tax-popover') && !e.target.closest('[id^="zoho-addon-tax-trigger-"]')) {
        closeAllAddonTaxDropdowns();
      }
    };`;

const newOutsideClick = `      // 7. Addon Tax popover close on tap anywhere outside
      if (!e.target.closest('.zoho-addon-tax-popover') && !e.target.closest('[id^="zoho-addon-tax-trigger-"]')) {
        closeAllAddonTaxDropdowns();
      }

      // 8. Coupon popover close on tap anywhere outside
      if (!e.target.closest('#zoho-coupon-search-wrapper')) {
        closeZohoCouponDropdown();
      }
    };`;

if (appJs.includes(oldOutsideClick)) {
  appJs = appJs.replace(oldOutsideClick, newOutsideClick);
  console.log('✓ Added coupon popover outside click listener');
}

// 5. Update updateZohoSubCalculations to deduct coupon discount if present
const oldSummaryCalc = `    // 3. Combined Final Billing & Selected Tax Rate
    const totalDiscounts = (zohoDiscountPref === 'no-discount') ? 0 : (planDiscountAmt + totalAddonsDiscount);
    const taxableBase = Math.max(0, (planBase + totalAddonsBase) - totalDiscounts);`;

const newSummaryCalc = `    // 3. Combined Final Billing & Selected Tax Rate & Coupon
    let couponDiscountAmt = 0;
    if (selectedZohoCoupon && selectedZohoCoupon.discount_value) {
      const valStr = selectedZohoCoupon.discount_value;
      if (valStr.includes('%')) {
        const pct = parseFloat(valStr.replace(/[^0-9.]/g, '')) || 0;
        couponDiscountAmt = ((planBase + totalAddonsBase) * pct) / 100;
      } else {
        couponDiscountAmt = parseFloat(valStr.replace(/[^0-9.]/g, '')) || 0;
      }
    }
    const totalDiscounts = ((zohoDiscountPref === 'no-discount') ? 0 : (planDiscountAmt + totalAddonsDiscount)) + couponDiscountAmt;
    const taxableBase = Math.max(0, (planBase + totalAddonsBase) - totalDiscounts);`;

if (appJs.includes(oldSummaryCalc)) {
  appJs = appJs.replace(oldSummaryCalc, newSummaryCalc);
  console.log('✓ Updated updateZohoSubCalculations with coupon discount');
}

// 6. Export coupon functions on window.smatApp
const oldExport = `    addNewAddonTax,`;
const newExport = `    addNewAddonTax,
    openZohoCouponDropdown,
    toggleZohoCouponDropdown,
    closeZohoCouponDropdown,
    onZohoCouponInput,
    selectZohoCoupon,
    clearZohoCoupon,`;

if (appJs.includes(oldExport)) {
  appJs = appJs.replace(oldExport, newExport);
  console.log('✓ Exported coupon functions on window.smatApp');
}

// 7. Bump cache busting version to v=10.8 in index.html
indexHtml = indexHtml.replace(/app\.js\?v=[0-9.]+/g, 'app.js?v=10.8');
indexHtml = indexHtml.replace(/styles\.css\?v=[0-9.]+/g, 'styles.css?v=10.8');
console.log('✓ Bumped cache busting version to v=10.8');

// Convert back to CRLF if original was CRLF
if (isCRLF) {
  appJs = appJs.replace(/\n/g, '\r\n');
}

// Save files
fs.writeFileSync(appJsPath, appJs, 'utf8');
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');

console.log('ALL COUPON SECTION UPDATES APPLIED SUCCESSFULLY!');
