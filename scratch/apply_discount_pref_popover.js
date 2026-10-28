const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
const stylesCssPath = path.join(__dirname, '..', 'frontend', 'css', 'styles.css');
const indexHtmlPath = path.join(__dirname, '..', 'frontend', 'index.html');

let appJsRaw = fs.readFileSync(appJsPath, 'utf8');
const isCRLF = appJsRaw.includes('\r\n');
let appJs = appJsRaw.replace(/\r\n/g, '\n');

// 1. Replace the static select with the searchable popover in renderZohoSubscriptionReferenceView
const targetSelectorBlock = `                <!-- Discount preference selector (Screenshots 1 & 2 Match) -->
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
                </div>`;

const newSearchableBlock = `                <!-- Discount preference selector (Exact Match to User Screenshot) -->
                <div id="zoho-discount-pref-wrapper" style="position:relative; display:inline-block;">
                  <button type="button" id="zoho-discount-pref-trigger" onclick="event.stopPropagation(); window.smatApp.toggleDiscountPrefDropdown(event)" style="display:inline-flex; align-items:center; gap:6px; border:1px solid #CBD5E1; border-radius:6px; padding:5px 10px; background:#FFFFFF; cursor:pointer; font-size:0.82rem; color:#374151; box-shadow:0 1px 2px rgba(0,0,0,0.02); font-weight:500; transition:all 0.15s;">
                    <span style="color:#64748B; display:inline-flex; align-items:center;">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <circle cx="9.5" cy="9.5" r=".5" fill="currentColor"></circle>
                        <circle cx="14.5" cy="14.5" r=".5" fill="currentColor"></circle>
                      </svg>
                    </span>
                    <span id="zoho-discount-pref-label">\${zohoDiscountPref === 'transaction-level' ? 'Transaction-Level' : (zohoDiscountPref === 'item-level' ? 'Item-Level' : 'No Discounts')}</span>
                    <span id="zoho-discount-pref-chevron" style="font-size:0.7rem; color:#6B7280; transition:transform 0.2s;">▾</span>
                  </button>

                  <!-- Native select kept for test compatibility & state change -->
                  <select id="zoho-sub-discount-pref" onchange="window.smatApp.onZohoDiscountPrefChange(this.value)" style="display:none;">
                    <option value="no-discount" \${zohoDiscountPref === 'no-discount' ? 'selected' : ''}>No Discounts</option>
                    <option value="item-level" \${zohoDiscountPref === 'item-level' ? 'selected' : ''}>(%) Item-Level Discount</option>
                    <option value="transaction-level" \${zohoDiscountPref === 'transaction-level' ? 'selected' : ''}>Entity-Level Discount</option>
                  </select>

                  <!-- Popover Dropdown (Exact Match to User Screenshot) -->
                  <div id="zoho-discount-pref-popover" class="zoho-discount-popover" style="display:none; position:absolute; top:calc(100% + 4px); left:0; width:210px; background:#FFFFFF; border:1px solid #E2E8F0; border-radius:8px; box-shadow:0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1); z-index:99999; padding:8px 6px;">
                    <!-- Search Input (Search icon + input inside blue outlined rounded box) -->
                    <div style="padding:0 4px 8px 4px;">
                      <div style="display:flex; align-items:center; gap:6px; border:1.5px solid #3B82F6; border-radius:6px; padding:5px 8px; background:#FFFFFF; box-shadow:0 0 0 2px rgba(59,130,246,0.15);">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input type="text" id="zoho-discount-pref-search" placeholder="Search" oninput="window.smatApp.filterDiscountPrefOptions(this.value)" style="border:none; outline:none; font-size:0.82rem; width:100%; color:#1E293B; background:transparent; padding:0;" />
                      </div>
                    </div>

                    <!-- Category Title -->
                    <div style="padding:2px 8px 6px 8px; font-size:0.8rem; font-weight:700; color:#475569;">
                      Discount Preference
                    </div>

                    <!-- List of Options -->
                    <div id="zoho-discount-pref-list" style="display:flex; flex-direction:column; gap:2px;">
                    </div>
                  </div>
                </div>`;

if (!appJs.includes(targetSelectorBlock)) {
  console.error('targetSelectorBlock not found in app.js!');
  process.exit(1);
}

appJs = appJs.replace(targetSelectorBlock, newSearchableBlock);
console.log('✓ Replaced discount preference HTML block');

// 2. Add the JS functions for Discount Preference Dropdown
const functionsBlock = `
  // =========================================================================
  // ZOHO DISCOUNT PREFERENCE SEARCHABLE DROPDOWN (EXACT USER SCREENSHOT MATCH)
  // =========================================================================
  const ZOHO_DISCOUNT_PREF_OPTIONS = [
    { id: 'no-discount', label: 'No Discounts' },
    { id: 'item-level', label: 'Item-Level' },
    { id: 'transaction-level', label: 'Transaction-Level' }
  ];

  function renderDiscountPrefOptions(filterText = '') {
    const listEl = document.getElementById('zoho-discount-pref-list');
    if (!listEl) return;
    const term = (filterText || '').toLowerCase().trim();
    const filtered = ZOHO_DISCOUNT_PREF_OPTIONS.filter(o => o.label.toLowerCase().includes(term));
    if (filtered.length === 0) {
      listEl.innerHTML = '<div style="padding:8px 12px; font-size:0.8rem; color:#94A3B8; text-align:center;">No matches found</div>';
      return;
    }
    listEl.innerHTML = filtered.map(opt => {
      const isSelected = zohoDiscountPref === opt.id;
      return \`
        <div class="zoho-discount-option-item \${isSelected ? 'selected' : ''}" 
             onclick="window.smatApp.selectDiscountPref('\${opt.id}')"
             style="\${isSelected ? 'background:#2563EB; color:#FFFFFF; font-weight:500;' : ''}">
          <span>\${escapeHtml(opt.label)}</span>
          \${isSelected ? '<span class="zoho-discount-check" style="font-size:0.85rem; font-weight:700;">✓</span>' : ''}
        </div>
      \`;
    }).join('');
  }

  function toggleDiscountPrefDropdown(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    const pop = document.getElementById('zoho-discount-pref-popover');
    if (!pop) return;
    const isVisible = pop.style.display === 'block';
    if (isVisible) {
      closeDiscountPrefDropdown();
    } else {
      closeAllMorePopovers();
      closeGstPreferencesPopover();
      closeShippingGstPopover();
      closeSupplyStateDropdown();
      closePlanAccountDropdown();
      closePlanTaxDropdown();
      closeAllAddonTaxDropdowns();
      closeZohoCouponDropdown();

      pop.style.display = 'block';
      const trigger = document.getElementById('zoho-discount-pref-trigger');
      if (trigger) {
        trigger.style.borderColor = '#3B82F6';
        trigger.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.15)';
      }
      const chevron = document.getElementById('zoho-discount-pref-chevron');
      if (chevron) chevron.style.transform = 'rotate(180deg)';
      
      const searchInput = document.getElementById('zoho-discount-pref-search');
      if (searchInput) {
        searchInput.value = '';
        setTimeout(() => searchInput.focus(), 50);
      }
      renderDiscountPrefOptions();
    }
  }

  function closeDiscountPrefDropdown() {
    const pop = document.getElementById('zoho-discount-pref-popover');
    if (!pop) return;
    pop.style.display = 'none';
    const trigger = document.getElementById('zoho-discount-pref-trigger');
    if (trigger) {
      trigger.style.borderColor = '#CBD5E1';
      trigger.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
    }
    const chevron = document.getElementById('zoho-discount-pref-chevron');
    if (chevron) chevron.style.transform = 'rotate(0deg)';
  }

  function selectDiscountPref(val) {
    zohoDiscountPref = val;
    const opt = ZOHO_DISCOUNT_PREF_OPTIONS.find(o => o.id === val);
    const labelEl = document.getElementById('zoho-discount-pref-label');
    if (labelEl && opt) {
      labelEl.textContent = opt.label;
    }
    const sel = document.getElementById('zoho-sub-discount-pref');
    if (sel) sel.value = val;
    closeDiscountPrefDropdown();
    onZohoDiscountPrefChange(val);
  }

  function filterDiscountPrefOptions(val) {
    renderDiscountPrefOptions(val);
  }
`;

// Insert functionsBlock right before onZohoDiscountPrefChange
const onZohoMarker = 'function onZohoDiscountPrefChange(pref) {';
if (!appJs.includes(onZohoMarker)) {
  console.error('onZohoMarker not found in app.js!');
  process.exit(1);
}
appJs = appJs.replace(onZohoMarker, functionsBlock + '\n  ' + onZohoMarker);
console.log('✓ Added helper functions');

// 3. Update outside click handler
const outsideClickMarker = `      // 8. Coupon popover close on tap anywhere outside
      if (!e.target.closest('#zoho-coupon-search-wrapper')) {
        closeZohoCouponDropdown();
      }`;

const newOutsideClick = `      // 8. Coupon popover close on tap anywhere outside
      if (!e.target.closest('#zoho-coupon-search-wrapper')) {
        closeZohoCouponDropdown();
      }

      // 9. Discount Preference popover close on tap anywhere outside
      if (!e.target.closest('#zoho-discount-pref-popover') && !e.target.closest('#zoho-discount-pref-trigger')) {
        closeDiscountPrefDropdown();
      }`;

if (appJs.includes(outsideClickMarker)) {
  appJs = appJs.replace(outsideClickMarker, newOutsideClick);
  console.log('✓ Added outside click handler for discount preference');
}

// 4. Update window.smatApp exports
const exportMarker = '    onZohoDiscountPrefChange,';
const newExports = `    toggleDiscountPrefDropdown,
    closeDiscountPrefDropdown,
    selectDiscountPref,
    filterDiscountPrefOptions,
    renderDiscountPrefOptions,
    onZohoDiscountPrefChange,`;

if (appJs.includes(exportMarker)) {
  appJs = appJs.replace(exportMarker, newExports);
  console.log('✓ Added exports to window.smatApp');
}

// Write back app.js
fs.writeFileSync(appJsPath, isCRLF ? appJs.replace(/\n/g, '\r\n') : appJs, 'utf8');
console.log('✓ Wrote frontend/js/app.js');

// 5. Append CSS to styles.css
let stylesCss = fs.readFileSync(stylesCssPath, 'utf8');
const discountCss = `
/* ========================================================================= */
/* ZOHO DISCOUNT PREFERENCE SEARCHABLE POPOVER (USER SCREENSHOT MATCH)       */
/* ========================================================================= */
.zoho-discount-popover {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  padding: 8px 6px;
  min-width: 200px;
  z-index: 99999;
}

.zoho-discount-option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 12px;
  font-size: 0.84rem;
  color: #334155;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.12s ease, color 0.12s ease;
  user-select: none;
  margin-bottom: 2px;
}

.zoho-discount-option-item:hover {
  background: #2563EB !important;
  color: #FFFFFF !important;
}

.zoho-discount-option-item:hover .zoho-discount-check {
  color: #FFFFFF !important;
}

.zoho-discount-option-item.selected {
  background: #2563EB;
  color: #FFFFFF;
  font-weight: 500;
}

.zoho-discount-option-item.selected .zoho-discount-check {
  display: inline-block;
  color: #FFFFFF;
  font-weight: 700;
  font-size: 0.85rem;
}
`;

if (!stylesCss.includes('zoho-discount-popover')) {
  stylesCss += discountCss;
  fs.writeFileSync(stylesCssPath, stylesCss, 'utf8');
  console.log('✓ Appended styles to frontend/css/styles.css');
}

// 6. Bump cache busting version in index.html to v=11.3
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/app\.js\?v=[0-9.]+/g, 'app.js?v=11.3');
indexHtml = indexHtml.replace(/styles\.css\?v=[0-9.]+/g, 'styles.css?v=11.3');
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('✓ Bumped cache busting version to v=11.3 in index.html');
