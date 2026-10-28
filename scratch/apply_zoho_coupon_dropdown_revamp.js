// Script to revamp the Coupon dropdown to match user's reference screenshot
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

// 1. Ensure couponsData includes the reference coupons from the screenshot along with existing ones
const targetCouponsDataStart = "  let couponsData = [";
const newCouponsDataItems = `  let couponsData = [
    {
      id: 101,
      product: 'SmatBot',
      name: 'ismail2',
      code: 'test_ismail2',
      status: 'Active',
      discount_value: '90%',
      discount_by: 'Percentage',
      redemption_type: 'One-Time',
      associate_plans: 'All Plans',
      associate_addons: 'All Recurring Addons',
      max_redemption: 100,
      valid_upto: '31/12/2026'
    },
    {
      id: 102,
      product: 'SmatBot',
      name: 'ismail_99',
      code: '99_ismail',
      status: 'Active',
      discount_value: '99%',
      discount_by: 'Percentage',
      redemption_type: 'One-Time',
      associate_plans: 'All Plans',
      associate_addons: 'All Recurring Addons',
      max_redemption: 100,
      valid_upto: '31/12/2026'
    },
    {
      id: 103,
      product: 'SmatBot',
      name: 'ismail_test',
      code: 'test_ismail',
      status: 'Active',
      discount_value: '90%',
      discount_by: 'Percentage',
      redemption_type: 'One-Time',
      associate_plans: 'All Plans',
      associate_addons: 'All Recurring Addons',
      max_redemption: 100,
      valid_upto: '31/12/2026'
    },
    {
      id: 104,
      product: 'SmatBot',
      name: 'SWAPNIL95',
      code: 'SWAPNIL95',
      status: 'Active',
      discount_value: '95%',
      discount_by: 'Percentage',
      redemption_type: 'One-Time',
      associate_plans: 'All Plans',
      associate_addons: 'All Recurring Addons',
      max_redemption: 100,
      valid_upto: '31/12/2026'
    },
    {
      id: 105,
      product: 'SmatBot',
      name: 'SWAPNIL98',
      code: 'SWAPNIL98',
      status: 'Active',
      discount_value: '98%',
      discount_by: 'Percentage',
      redemption_type: 'One-Time',
      associate_plans: 'All Plans',
      associate_addons: 'All Recurring Addons',
      max_redemption: 100,
      valid_upto: '31/12/2026'
    },
    {
      id: 106,
      product: 'SmatBot',
      name: 'TESTCOUPONCHANGE',
      code: 'TESTCOUPONCHANGE',
      status: 'Active',
      discount_value: '20%',
      discount_by: 'Percentage',
      redemption_type: 'One-Time',
      associate_plans: 'All Plans',
      associate_addons: 'All Recurring Addons',
      max_redemption: 100,
      valid_upto: '31/12/2026'
    },
    {
      id: 107,
      product: 'SmatBot',
      name: 'TESTCOUPONCHANGEUnlimited',
      code: 'TESTCOUPONCHANGEUnlimited',
      status: 'Active',
      discount_value: '',
      discount_by: 'Percentage',
      redemption_type: 'Unlimited',
      associate_plans: 'All Plans',
      associate_addons: 'All Recurring Addons',
      max_redemption: 9999,
      valid_upto: '31/12/2026'
    },`;

if (!appJs.includes('name: \'ismail_test\'')) {
  appJs = appJs.replace(targetCouponsDataStart, newCouponsDataItems);
  console.log('✓ Added reference coupons to couponsData');
} else {
  console.log('Reference coupons already in couponsData');
}

// 2. Update the Coupon section table row markup
const oldCouponRow = `                      <!-- COUPON Searchable Dropdown / Input (Screenshot 1 Match) -->
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
                      </td>`;

const newCouponRow = `                      <!-- COUPON Searchable Dropdown / Input (Exact Match to User Screenshots) -->
                      <td style="padding:0.5rem 0.75rem; border-right:1px solid #E5E7EB; position:relative;">
                        <div id="zoho-coupon-search-wrapper" style="position:relative; width:100%;">
                          <button type="button" 
                                  id="zoho-coupon-trigger-btn"
                                  onclick="event.stopPropagation(); window.smatApp.toggleZohoCouponDropdown(event)"
                                  style="display:flex; align-items:center; justify-content:space-between; width:100%; border:none; outline:none; background:transparent; font-size:0.83rem; color:#1F2937; cursor:pointer; padding:2px 0; text-align:left;">
                            <span id="zoho-coupon-selected-label" style="font-weight:\${selectedZohoCoupon ? '600' : '400'}; color:\${selectedZohoCoupon ? '#1E293B' : '#94A3B8'};">
                              \${selectedZohoCoupon ? escapeHtml(selectedZohoCoupon.name) : 'Enter at least 3 characters to search'}
                            </span>
                            <span id="zoho-coupon-chevron" style="color:#2563EB; font-size:0.75rem; margin-left:6px; display:inline-flex; align-items:center; transition:transform 0.2s;">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </span>
                          </button>

                          <!-- Coupon Search Popover / Dropdown (Screenshot Match with Search Header) -->
                          <div id="zoho-coupon-popover" class="zoho-coupon-popover" style="display:none; position:absolute; top:calc(100% + 4px); left:0; width:100%; min-width:320px; z-index:99999; background:#FFFFFF; border:1px solid #CBD5E1; border-radius:6px; box-shadow:0 12px 28px rgba(0,0,0,0.18); overflow:hidden; text-align:left;">
                            <!-- Search Header (Exact Match to Screenshot) -->
                            <div style="padding:8px 10px 6px 10px; border-bottom:1px solid #F1F5F9;">
                              <div style="display:flex; align-items:center; gap:6px; border:1.5px solid #3B82F6; border-radius:5px; padding:4px 8px; background:#FFFFFF;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                <input type="text" id="zoho-coupon-search-filter" placeholder="Search" oninput="window.smatApp.filterZohoCoupons(this.value)" style="border:none; outline:none; font-size:0.82rem; width:100%; color:#1E293B; background:transparent;" />
                              </div>
                            </div>

                            <!-- Scrollable Coupon Items List -->
                            <div id="zoho-coupon-results-list" style="max-height:220px; overflow-y:auto; padding:4px 6px;"></div>
                          </div>
                        </div>
                      </td>`;

if (appJs.includes(oldCouponRow)) {
  appJs = appJs.replace(oldCouponRow, newCouponRow);
  console.log('✓ Updated Coupon Table Row Markup with Trigger & Search Header');
} else {
  console.log('Coupon Table Row Markup already updated or not matched');
}

// 3. Update the Coupon helper functions to format items as [name]/[code] [[discount_value]]
const oldCouponFunctions = `  function openZohoCouponDropdown() {
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
  }`;

const newCouponFunctions = `  function openZohoCouponDropdown() {
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
    renderZohoCouponResults();
    setTimeout(() => {
      const searchInp = document.getElementById('zoho-coupon-search-filter');
      if (searchInp) {
        searchInp.value = '';
        searchInp.focus();
      }
    }, 50);
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

  function filterZohoCoupons(query) {
    renderZohoCouponResults(query);
  }

  function renderZohoCouponResults(query = '') {
    const container = document.getElementById('zoho-coupon-results-list');
    if (!container) return;
    const q = (query || '').toLowerCase().trim();

    const availableCoupons = (typeof couponsData !== 'undefined' ? couponsData : []).filter(c => {
      if (!q) return true;
      const nameMatch = (c.name || '').toLowerCase().includes(q);
      const codeMatch = (c.code || '').toLowerCase().includes(q);
      const valMatch = (c.discount_value || '').toLowerCase().includes(q);
      return nameMatch || codeMatch || valMatch;
    });

    if (availableCoupons.length === 0) {
      container.innerHTML = \`<div style="padding:12px 10px; font-size:0.8rem; color:#94A3B8; text-align:center;">No coupons found</div>\`;
      return;
    }

    container.innerHTML = availableCoupons.map(c => {
      const isSel = selectedZohoCoupon && (selectedZohoCoupon.id === c.id || selectedZohoCoupon.code === c.code);
      const valClean = c.discount_value ? c.discount_value.replace(/\[|\]/g, '') : '';
      const displayLabel = \`\${c.name}/\${c.code}\${valClean ? \` [\${valClean}]\` : ''}\`;

      return \`
        <div class="zoho-coupon-option \${isSel ? 'selected' : ''}" 
             onclick="event.stopPropagation(); window.smatApp.selectZohoCoupon(\${c.id})"
             style="display:flex; align-items:center; justify-content:space-between; gap:8px; padding:7px 10px; margin-bottom:2px; border-radius:4px; cursor:pointer; font-size:0.83rem; transition:background 0.15s, color 0.15s;">
          <span style="font-weight:\${isSel ? '600' : '500'}; line-height:1.2;">\${escapeHtml(displayLabel)}</span>
          \${isSel ? \`
            <span class="zoho-coupon-check" style="flex-shrink:0;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.8"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </span>
          \` : ''}
        </div>
      \`;
    }).join('');
  }

  function selectZohoCoupon(couponId) {
    const found = (typeof couponsData !== 'undefined' ? couponsData : []).find(c => c.id === couponId || c.id === Number(couponId));
    if (!found) return;
    selectedZohoCoupon = found;
    const labelSpan = document.getElementById('zoho-coupon-selected-label');
    const codeDisp = document.getElementById('zoho-coupon-code-disp');
    const valDisp = document.getElementById('zoho-coupon-value-disp');
    if (labelSpan) {
      labelSpan.innerText = found.name;
      labelSpan.style.color = '#1E293B';
      labelSpan.style.fontWeight = '600';
    }
    if (codeDisp) codeDisp.value = found.code;
    if (valDisp) valDisp.value = found.discount_value;
    closeZohoCouponDropdown();
    updateZohoSubCalculations();
  }

  function clearZohoCoupon() {
    selectedZohoCoupon = null;
    const labelSpan = document.getElementById('zoho-coupon-selected-label');
    const codeDisp = document.getElementById('zoho-coupon-code-disp');
    const valDisp = document.getElementById('zoho-coupon-value-disp');
    if (labelSpan) {
      labelSpan.innerText = 'Enter at least 3 characters to search';
      labelSpan.style.color = '#94A3B8';
      labelSpan.style.fontWeight = '400';
    }
    if (codeDisp) codeDisp.value = '';
    if (valDisp) valDisp.value = '';
    closeZohoCouponDropdown();
    updateZohoSubCalculations();
  }`;

if (appJs.includes(oldCouponFunctions)) {
  appJs = appJs.replace(oldCouponFunctions, newCouponFunctions);
  console.log('✓ Updated Coupon Functions with exact [name]/[code] [[value]] format');
} else {
  console.error('Error: oldCouponFunctions not found');
  process.exit(1);
}

// 4. Update exported functions on window.smatApp
appJs = appJs.replace(
  'onZohoCouponInput,',
  'filterZohoCoupons,'
);
console.log('✓ Updated window.smatApp export with filterZohoCoupons');

// 5. Append CSS for zoho-coupon-option to styles.css if not already present
const newCouponCss = `
/* ========================================================================= */
/* ZOHO COUPON SEARCHABLE DROPDOWN (EXACT SCREENSHOT MATCH)                  */
/* ========================================================================= */
.zoho-coupon-option {
  color: #1E293B;
}

.zoho-coupon-option:hover {
  background: #3B82F6 !important;
  color: #FFFFFF !important;
}

.zoho-coupon-option:hover .zoho-coupon-check svg {
  stroke: #FFFFFF !important;
}

.zoho-coupon-option.selected {
  background: #EEF2F6;
  font-weight: 600;
}

#zoho-coupon-results-list::-webkit-scrollbar {
  width: 6px;
}

#zoho-coupon-results-list::-webkit-scrollbar-track {
  background: #F8FAFC;
}

#zoho-coupon-results-list::-webkit-scrollbar-thumb {
  background: #CBD5E1;
  border-radius: 3px;
}
`;

if (!stylesCss.includes('ZOHO COUPON SEARCHABLE DROPDOWN')) {
  stylesCss += newCouponCss;
  console.log('✓ Appended coupon dropdown styles to styles.css');
}

// 6. Bump cache busting version to v=10.9 in index.html
indexHtml = indexHtml.replace(/app\.js\?v=[0-9.]+/g, 'app.js?v=10.9');
indexHtml = indexHtml.replace(/styles\.css\?v=[0-9.]+/g, 'styles.css?v=10.9');
console.log('✓ Bumped cache busting version to v=10.9');

// Convert back to CRLF if original was CRLF
if (isCRLF) {
  appJs = appJs.replace(/\n/g, '\r\n');
}

// Save files
fs.writeFileSync(appJsPath, appJs, 'utf8');
fs.writeFileSync(stylesCssPath, stylesCss, 'utf8');
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');

console.log('ALL ZOHO COUPON DROPDOWN UPDATES APPLIED SUCCESSFULLY!');
