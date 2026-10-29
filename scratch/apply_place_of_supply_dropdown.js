const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');
let norm = appContent.replace(/\r\n/g, '\n');

// 1. Add ALL_SUPPLY_STATES array constant
const supplyStatesArrayCode = `
  const ALL_SUPPLY_STATES = [
    { code: 'AN', name: 'Andaman and Nicobar Islands' },
    { code: 'AD', name: 'Andhra Pradesh' },
    { code: 'AR', name: 'Arunachal Pradesh' },
    { code: 'AS', name: 'Assam' },
    { code: 'BR', name: 'Bihar' },
    { code: 'CH', name: 'Chandigarh' },
    { code: 'CG', name: 'Chhattisgarh' },
    { code: 'DN', name: 'Dadra and Nagar Haveli and Daman and Diu' },
    { code: 'DD', name: 'Daman and Diu' },
    { code: 'DL', name: 'Delhi' },
    { code: 'FC', name: 'Foreign Country' },
    { code: 'GA', name: 'Goa' },
    { code: 'GJ', name: 'Gujarat' },
    { code: 'HR', name: 'Haryana' },
    { code: 'HP', name: 'Himachal Pradesh' },
    { code: 'JK', name: 'Jammu and Kashmir' },
    { code: 'JH', name: 'Jharkhand' },
    { code: 'KA', name: 'Karnataka' },
    { code: 'KL', name: 'Keralam' },
    { code: 'LA', name: 'Ladakh' },
    { code: 'LD', name: 'Lakshadweep' },
    { code: 'MP', name: 'Madhya Pradesh' },
    { code: 'MH', name: 'Maharashtra' },
    { code: 'MN', name: 'Manipur' },
    { code: 'ML', name: 'Meghalaya' },
    { code: 'MZ', name: 'Mizoram' },
    { code: 'NL', name: 'Nagaland' },
    { code: 'OD', name: 'Odisha' },
    { code: 'OT', name: 'Other Territory' },
    { code: 'PY', name: 'Puducherry' },
    { code: 'PB', name: 'Punjab' },
    { code: 'RJ', name: 'Rajasthan' },
    { code: 'SK', name: 'Sikkim' },
    { code: 'TN', name: 'Tamil Nadu' },
    { code: 'TS', name: 'Telangana' },
    { code: 'TR', name: 'Tripura' },
    { code: 'UP', name: 'Uttar Pradesh' },
    { code: 'UK', name: 'Uttarakhand' },
    { code: 'WB', name: 'West Bengal' }
  ];
  let zohoSelectedSupplyState = 'TS';
`;

const insertAfterAvailableAddons = `  const AVAILABLE_ZOHO_ADDONS = [`;
if (norm.includes(insertAfterAvailableAddons) && !norm.includes('ALL_SUPPLY_STATES =')) {
  norm = norm.replace(insertAfterAvailableAddons, supplyStatesArrayCode + '\n' + insertAfterAvailableAddons);
  console.log('Added ALL_SUPPLY_STATES constant array');
}

// 2. Replace the Place of Supply* select element with the searchable dropdown UI
const oldPlaceOfSupply = `            <!-- 4. Place of Supply* (Screenshot 1) -->
            <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:center;">
              <label style="font-size:0.88rem; font-weight:600; color:#DC2626;">
                Place of Supply*
              </label>
              <div>
                <select id="zoho-sub-supply-state" class="zoho-select-dropdown" style="max-width:320px; font-size:0.85rem;">
                  <option value="TS" selected>[TS] - Telangana</option>
                  <option value="MH">[MH] - Maharashtra</option>
                  <option value="KA">[KA] - Karnataka</option>
                  <option value="DL">[DL] - Delhi</option>
                  <option value="TN">[TN] - Tamil Nadu</option>
                  <option value="AP">[AP] - Andhra Pradesh</option>
                  <option value="UP">[UP] - Uttar Pradesh</option>
                  <option value="GJ">[GJ] - Gujarat</option>
                  <option value="WB">[WB] - West Bengal</option>
                </select>
              </div>
            </div>`;

const newPlaceOfSupply = `            <!-- 4. Place of Supply* (Exact Match to User Reference Screenshots 1 - 5) -->
            <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:center;">
              <label style="font-size:0.88rem; font-weight:600; color:#DC2626;">
                Place of Supply*
              </label>
              <div style="position:relative; width:100%; max-width:320px;">
                <!-- Hidden select for compatibility -->
                <select id="zoho-sub-supply-state" style="display:none;">
                  \${ALL_SUPPLY_STATES.map(s => \`
                    <option value="\${s.code}" \${s.code === zohoSelectedSupplyState ? 'selected' : ''}>[\${s.code}] - \${s.name}</option>
                  \`).join('')}
                </select>

                <!-- Trigger box displaying currently selected state -->
                <div id="zoho-supply-state-trigger" class="zoho-supply-trigger" onclick="event.stopPropagation(); window.smatApp.toggleSupplyStateDropdown(event)" style="border:1px solid #CBD5E1; border-radius:4px; padding:7px 12px; font-size:0.86rem; color:#1E293B; background:#FFFFFF; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                  <span id="zoho-supply-state-display">[\${zohoSelectedSupplyState}] - \${(ALL_SUPPLY_STATES.find(s => s.code === zohoSelectedSupplyState) || { name: 'Telangana' }).name}</span>
                  <span style="font-size:0.75rem; color:#6B7280;">⌄</span>
                </div>

                <!-- Searchable Dropdown Popover (Exact Match to Screenshots 1 - 5) -->
                <div id="zoho-supply-state-popover" class="zoho-supply-popover" style="display:none; position:absolute; top:calc(100% + 4px); left:0; width:100%; z-index:9999; background:#FFFFFF; border:1px solid #CBD5E1; border-radius:6px; box-shadow:0 10px 25px rgba(0,0,0,0.15); padding:8px 0; overflow:hidden;">
                  <!-- Search input with magnifying glass (Screenshot Match) -->
                  <div style="padding:4px 10px 8px 10px; border-bottom:1px solid #F1F5F9;">
                    <div style="position:relative; display:flex; align-items:center;">
                      <span style="position:absolute; left:10px; color:#9CA3AF; display:inline-flex; align-items:center;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                      </span>
                      <input type="text" id="zoho-supply-search-input" placeholder="Search" oninput="window.smatApp.filterSupplyStates(this.value)" onclick="event.stopPropagation()" style="width:100%; border:1.5px solid #3B82F6; border-radius:4px; padding:6px 10px 6px 30px; font-size:0.84rem; color:#1E293B; outline:none;" />
                    </div>
                  </div>

                  <!-- Scrollable Options List -->
                  <div id="zoho-supply-options-list" style="max-height:220px; overflow-y:auto; padding:4px 0;">
                    \${ALL_SUPPLY_STATES.map(s => {
                      const isSel = s.code === zohoSelectedSupplyState;
                      return \`
                        <div class="zoho-supply-option-item" onclick="event.stopPropagation(); window.smatApp.selectSupplyState('\${s.code}')" style="padding:7px 12px; font-size:0.85rem; cursor:pointer; margin:1px 4px; border-radius:4px; \${isSel ? 'background:#3B82F6; color:#FFFFFF; font-weight:500;' : 'color:#374151;'}" onmouseover="if (!this.classList.contains('selected')) this.style.background='#F1F5F9'" onmouseout="if (!this.classList.contains('selected')) this.style.background='transparent'">
                          [\${s.code}] - \${s.name}
                        </div>
                      \`;
                    }).join('')}
                  </div>
                </div>
              </div>
            </div>`;

if (norm.includes(oldPlaceOfSupply)) {
  norm = norm.replace(oldPlaceOfSupply, newPlaceOfSupply);
  console.log('Replaced Place of Supply* with Searchable Dropdown');
} else {
  console.error('Could not find oldPlaceOfSupply in app.js');
}

// 3. Add helper functions
const supplyDropdownHelpers = `
  function renderSupplyStateOptions(list) {
    const container = document.getElementById('zoho-supply-options-list');
    if (!container) return;
    const states = list || ALL_SUPPLY_STATES;
    container.innerHTML = states.map(s => {
      const isSel = s.code === zohoSelectedSupplyState;
      return \`
        <div class="zoho-supply-option-item \${isSel ? 'selected' : ''}" onclick="event.stopPropagation(); window.smatApp.selectSupplyState('\${s.code}')" style="padding:7px 12px; font-size:0.85rem; cursor:pointer; margin:1px 4px; border-radius:4px; \${isSel ? 'background:#3B82F6; color:#FFFFFF; font-weight:500;' : 'color:#374151;'}" onmouseover="if (!this.classList.contains('selected')) this.style.background='#F1F5F9'" onmouseout="if (!this.classList.contains('selected')) this.style.background='transparent'">
          [\${s.code}] - \${s.name}
        </div>
      \`;
    }).join('');
  }

  function toggleSupplyStateDropdown(evt) {
    if (evt) evt.stopPropagation();
    const pop = document.getElementById('zoho-supply-state-popover');
    if (!pop) return;
    const isCurrentlyOpen = pop.style.display === 'block';
    closeAllMorePopovers();
    closeGstPreferencesPopover();
    closeShippingGstPopover();
    document.querySelectorAll('.zoho-addr-popover').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.zoho-sac-popover').forEach(p => p.style.display = 'none');

    if (!isCurrentlyOpen) {
      pop.style.display = 'block';
      renderSupplyStateOptions();
      setTimeout(() => {
        const inp = document.getElementById('zoho-supply-search-input');
        if (inp) {
          inp.value = '';
          inp.focus();
        }
      }, 50);
    } else {
      pop.style.display = 'none';
    }
  }

  function closeSupplyStateDropdown() {
    const pop = document.getElementById('zoho-supply-state-popover');
    if (pop) pop.style.display = 'none';
  }

  function selectSupplyState(code) {
    zohoSelectedSupplyState = code;
    const found = ALL_SUPPLY_STATES.find(s => s.code === code);
    const disp = document.getElementById('zoho-supply-state-display');
    if (disp && found) {
      disp.innerText = \`[\${found.code}] - \${found.name}\`;
    }
    const hiddenSelect = document.getElementById('zoho-sub-supply-state');
    if (hiddenSelect) {
      hiddenSelect.value = code;
    }
    closeSupplyStateDropdown();
  }

  function filterSupplyStates(query) {
    const q = (query || '').toLowerCase().trim();
    if (!q) {
      renderSupplyStateOptions(ALL_SUPPLY_STATES);
      return;
    }
    const filtered = ALL_SUPPLY_STATES.filter(s =>
      s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    );
    renderSupplyStateOptions(filtered);
  }
`;

const targetBeforeCloseMore = `  function closeAllMorePopovers() {`;
if (norm.includes(targetBeforeCloseMore)) {
  norm = norm.replace(targetBeforeCloseMore, supplyDropdownHelpers + '\n' + targetBeforeCloseMore);
  console.log('Added Place of Supply helper functions');
}

// 4. Update outside click listener to close Supply State popover
const oldOutsideCheck = `      // 4. Shipping GST Popover close on tap anywhere outside
      if (!e.target.closest('.zoho-ship-gst-popover') && !e.target.closest('.zoho-ship-gst-trigger')) {
        closeShippingGstPopover();
      }`;

const newOutsideCheck = `      // 4. Shipping GST Popover close on tap anywhere outside
      if (!e.target.closest('.zoho-ship-gst-popover') && !e.target.closest('.zoho-ship-gst-trigger')) {
        closeShippingGstPopover();
      }

      // 5. Place of Supply popover close on tap anywhere outside
      if (!e.target.closest('.zoho-supply-popover') && !e.target.closest('.zoho-supply-trigger')) {
        closeSupplyStateDropdown();
      }`;

if (norm.includes(oldOutsideCheck)) {
  norm = norm.replace(oldOutsideCheck, newOutsideCheck);
  console.log('Updated outside click listener to close Place of Supply popover');
}

// 5. Export functions to window.smatApp
const oldExport = `    toggleShippingGstPopover,
    closeShippingGstPopover,
    onShippingGstUnregChange,
    saveShippingGstPreferences,`;

const newExport = `    toggleShippingGstPopover,
    closeShippingGstPopover,
    onShippingGstUnregChange,
    saveShippingGstPreferences,
    toggleSupplyStateDropdown,
    closeSupplyStateDropdown,
    selectSupplyState,
    filterSupplyStates,`;

if (norm.includes(oldExport)) {
  norm = norm.replace(oldExport, newExport);
  console.log('Exported Place of Supply methods to window.smatApp');
}

fs.writeFileSync(appPath, norm.replace(/\n/g, '\r\n'), 'utf8');
console.log('frontend/js/app.js updated successfully with full Place of Supply searchable dropdown!');
