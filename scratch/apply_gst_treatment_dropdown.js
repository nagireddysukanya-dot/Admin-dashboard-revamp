const fs = require('fs');
const path = require('path');

// 1. Update frontend/css/styles.css
const cssPath = path.join(__dirname, '..', 'frontend', 'css', 'styles.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

const treatmentCss = `
/* Zoho Configure Tax Preferences - GST Treatment Dropdown (Screenshots 1 - 5) */
.zoho-treatment-option-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  cursor: pointer;
  margin: 2px 4px;
  border-radius: 4px;
  transition: all 0.12s ease;
}

.zoho-treatment-option-item .treatment-text-col {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.zoho-treatment-option-item .treatment-title {
  font-size: 0.85rem;
  font-weight: 500;
  color: #1E293B;
}

.zoho-treatment-option-item .treatment-desc {
  font-size: 0.74rem;
  color: #64748B;
  margin-top: 2px;
  line-height: 1.25;
}

.zoho-treatment-option-item:hover,
.zoho-treatment-option-item.selected {
  background: #3B82F6 !important;
  color: #FFFFFF !important;
}

.zoho-treatment-option-item:hover .treatment-title,
.zoho-treatment-option-item.selected .treatment-title {
  color: #FFFFFF !important;
}

.zoho-treatment-option-item:hover .treatment-desc,
.zoho-treatment-option-item.selected .treatment-desc {
  color: rgba(255, 255, 255, 0.9) !important;
}

.zoho-treatment-option-item.selected .zoho-treatment-check {
  display: inline-block;
  color: #FFFFFF;
  font-weight: 700;
  font-size: 0.95rem;
  margin-left: 8px;
}
`;

if (!cssContent.includes('.zoho-treatment-option-item')) {
  cssContent += '\n' + treatmentCss;
  fs.writeFileSync(cssPath, cssContent, 'utf8');
  console.log('Added GST Treatment dropdown styles to styles.css');
}

// 2. Update frontend/js/app.js
const appPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');
let norm = appContent.replace(/\r\n/g, '\n');

// 2a. Add ALL_GST_TREATMENTS array
const gstTreatmentsArrayCode = `
  const ALL_GST_TREATMENTS = [
    {
      title: 'Registered Business - Regular',
      desc: 'Business that is registered under GST'
    },
    {
      title: 'Registered Business - Composition',
      desc: 'Business that is registered under the Composition Scheme in GST'
    },
    {
      title: 'Unregistered Business',
      desc: 'Business that has not been registered under GST'
    },
    {
      title: 'Consumer',
      desc: 'A customer who is a regular consumer'
    },
    {
      title: 'Overseas',
      desc: 'Persons with whom you do import or export of supplies outside India'
    },
    {
      title: 'Special Economic Zone',
      desc: 'Business (Unit) that is located in a Special Economic Zone (SEZ) of India or a SEZ Developer'
    },
    {
      title: 'Deemed Export',
      desc: 'Supply of goods to an Export Oriented Unit or against Advanced Authorization/Export Promotion Capital Goods.'
    },
    {
      title: 'Tax Deductor',
      desc: 'Departments of the State/Central government, governmental agencies or local authorities'
    },
    {
      title: 'SEZ Developer',
      desc: 'A person/organisation who owns at least 26% of the equity in creating business units in a Special Economic Zone (SEZ)'
    },
    {
      title: 'Input Service Distributor',
      desc: 'Input Service Distributor (ISD) is an office that receives tax invoices for services used by the company in different states under the same PAN.'
    }
  ];
  let zohoSelectedGstTreatment = 'Unregistered Business';
`;

const insertAfterSupplyStates = `  let zohoSelectedSupplyState = 'TS';`;
if (norm.includes(insertAfterSupplyStates) && !norm.includes('ALL_GST_TREATMENTS =')) {
  norm = norm.replace(insertAfterSupplyStates, insertAfterSupplyStates + '\n' + gstTreatmentsArrayCode);
  console.log('Added ALL_GST_TREATMENTS array to app.js');
}

// 2b. In renderZohoSubscriptionView, update Configure Tax Preferences popover markup
const oldSelectBlock = `                      <!-- GST Treatment Select -->
                      <div style="margin-bottom:12px;">
                        <label style="display:block; font-size:0.83rem; font-weight:500; color:#4B5563; margin-bottom:5px;">GST Treatment</label>
                        <select id="zoho-gst-treatment-input" style="width:100%; border:1px solid #CBD5E1; border-radius:4px; padding:6px 10px; font-size:0.86rem; color:#1E293B; background:#FFFFFF; outline:none; cursor:pointer;">
                          <option value="Unregistered Business" \${(currClient.gst_treatment || 'Unregistered Business') === 'Unregistered Business' ? 'selected' : ''}>Unregistered Business</option>
                          <option value="Registered Business - Regular" \${currClient.gst_treatment === 'Registered Business - Regular' ? 'selected' : ''}>Registered Business - Regular</option>
                          <option value="Registered Business - Composition" \${currClient.gst_treatment === 'Registered Business - Composition' ? 'selected' : ''}>Registered Business - Composition</option>
                          <option value="Consumer" \${currClient.gst_treatment === 'Consumer' ? 'selected' : ''}>Consumer</option>
                          <option value="Overseas" \${currClient.gst_treatment === 'Overseas' ? 'selected' : ''}>Overseas</option>
                          <option value="Special Economic Zone" \${currClient.gst_treatment === 'Special Economic Zone' ? 'selected' : ''}>Special Economic Zone</option>
                          <option value="Deemed Export" \${currClient.gst_treatment === 'Deemed Export' ? 'selected' : ''}>Deemed Export</option>
                        </select>
                      </div>`;

const newSelectBlock = `                      <!-- GST Treatment Searchable Dropdown (Screenshots 1 - 5 Match) -->
                      <div style="position:relative; margin-bottom:12px;">
                        <label style="display:block; font-size:0.83rem; font-weight:500; color:#4B5563; margin-bottom:5px;">GST Treatment</label>
                        <div id="zoho-gst-treatment-trigger" onclick="window.smatApp.toggleGstTreatmentDropdown(event)" style="display:flex; justify-content:space-between; align-items:center; width:100%; border:1.5px solid #3B82F6; border-radius:6px; padding:6px 10px; font-size:0.86rem; color:#1E293B; background:#FFFFFF; cursor:pointer; box-sizing:border-box;">
                          <span id="zoho-gst-treatment-display-val">\${currClient.gst_treatment || 'Unregistered Business'}</span>
                          <svg id="zoho-gst-treatment-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transition:transform 0.2s;"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                        <input type="hidden" id="zoho-gst-treatment-input" value="\${currClient.gst_treatment || 'Unregistered Business'}" />

                        <!-- Searchable Popover Dropdown (Screenshots 1 - 4 Match) -->
                        <div id="zoho-gst-treatment-dropdown" class="zoho-gst-treatment-popover" style="display:none; position:absolute; top:calc(100% + 4px); left:0; width:100%; z-index:10000; background:#FFFFFF; border:1px solid #CBD5E1; border-radius:6px; box-shadow:0 10px 25px rgba(0,0,0,0.18); padding:8px 0; overflow:hidden;">
                          <!-- Search Box -->
                          <div style="padding:4px 8px 8px 8px;">
                            <div style="position:relative; display:flex; align-items:center;">
                              <span style="position:absolute; left:9px; top:50%; transform:translateY(-50%); display:flex; align-items:center; pointer-events:none; color:#94A3B8;">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                              </span>
                              <input type="text" id="zoho-gst-treatment-search-input" placeholder="Search" oninput="window.smatApp.filterGstTreatments(this.value)" onclick="event.stopPropagation()" style="width:100%; border:1.5px solid #3B82F6; border-radius:4px; padding:6px 10px 6px 28px; font-size:0.84rem; color:#1E293B; outline:none; box-sizing:border-box;" />
                            </div>
                          </div>

                          <!-- Scrollable Options List -->
                          <div id="zoho-gst-treatment-options-list" style="max-height:210px; overflow-y:auto; padding:2px 0;">
                            \${ALL_GST_TREATMENTS.map(t => {
                              const isSel = t.title === (currClient.gst_treatment || 'Unregistered Business');
                              return \`
                                <div class="zoho-treatment-option-item \${isSel ? 'selected' : ''}" onclick="event.stopPropagation(); window.smatApp.selectGstTreatment('\${t.title.replace(/'/g, "\\\\'")}')">
                                  <div class="treatment-text-col">
                                    <span class="treatment-title">\${t.title}</span>
                                    <span class="treatment-desc">\${t.desc}</span>
                                  </div>
                                  \${isSel ? '<span class="zoho-treatment-check">✓</span>' : ''}
                                </div>
                              \`;
                            }).join('')}
                          </div>
                        </div>
                      </div>`;

if (norm.includes(oldSelectBlock)) {
  norm = norm.replace(oldSelectBlock, newSelectBlock);
  console.log('Replaced GST Treatment select with custom searchable dropdown in app.js');
}

// Adjust width of zoho-gst-pref-popover to 325px if needed
norm = norm.replace('width:310px; padding:14px 16px;', 'width:325px; padding:14px 16px;');

// 2c. Add Helper functions for GST Treatment searchable dropdown
const helperFns = `
  function renderGstTreatmentOptions(list) {
    const container = document.getElementById('zoho-gst-treatment-options-list');
    if (!container) return;
    const treatments = list || ALL_GST_TREATMENTS;
    const currentVal = zohoSelectedGstTreatment || 'Unregistered Business';
    container.innerHTML = treatments.map(t => {
      const isSel = t.title === currentVal;
      return \`
        <div class="zoho-treatment-option-item \${isSel ? 'selected' : ''}" onclick="event.stopPropagation(); window.smatApp.selectGstTreatment('\${t.title.replace(/'/g, "\\\\'")}')">
          <div class="treatment-text-col">
            <span class="treatment-title">\${t.title}</span>
            <span class="treatment-desc">\${t.desc}</span>
          </div>
          \${isSel ? '<span class="zoho-treatment-check">✓</span>' : ''}
        </div>
      \`;
    }).join('');
  }

  function toggleGstTreatmentDropdown(evt) {
    if (evt) evt.stopPropagation();
    const dropdown = document.getElementById('zoho-gst-treatment-dropdown');
    const chevron = document.getElementById('zoho-gst-treatment-chevron');
    if (!dropdown) return;
    const isCurrentlyOpen = dropdown.style.display === 'block';

    if (!isCurrentlyOpen) {
      dropdown.style.display = 'block';
      if (chevron) chevron.style.transform = 'rotate(180deg)';
      renderGstTreatmentOptions();
      setTimeout(() => {
        const inp = document.getElementById('zoho-gst-treatment-search-input');
        if (inp) {
          inp.value = '';
          inp.focus();
        }
      }, 50);
    } else {
      closeGstTreatmentDropdown();
    }
  }

  function closeGstTreatmentDropdown() {
    const dropdown = document.getElementById('zoho-gst-treatment-dropdown');
    const chevron = document.getElementById('zoho-gst-treatment-chevron');
    if (dropdown) dropdown.style.display = 'none';
    if (chevron) chevron.style.transform = 'rotate(0deg)';
  }

  function selectGstTreatment(title) {
    zohoSelectedGstTreatment = title;
    const disp = document.getElementById('zoho-gst-treatment-display-val');
    if (disp) {
      disp.innerText = title;
    }
    const hiddenInp = document.getElementById('zoho-gst-treatment-input');
    if (hiddenInp) {
      hiddenInp.value = title;
    }
    closeGstTreatmentDropdown();
  }

  function filterGstTreatments(query) {
    const q = (query || '').toLowerCase().trim();
    if (!q) {
      renderGstTreatmentOptions();
      return;
    }
    const filtered = ALL_GST_TREATMENTS.filter(t =>
      t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
    );
    renderGstTreatmentOptions(filtered);
  }
`;

const insertBeforeToggleGstPref = `  function toggleGstPreferencesPopover(evt) {`;
if (norm.includes(insertBeforeToggleGstPref) && !norm.includes('function renderGstTreatmentOptions')) {
  norm = norm.replace(insertBeforeToggleGstPref, helperFns + '\n' + insertBeforeToggleGstPref);
  console.log('Added GST Treatment helper functions to app.js');
}

// 2d. Update toggleGstPreferencesPopover to set zohoSelectedGstTreatment and close inner dropdown
const oldToggleGstPref = `  function toggleGstPreferencesPopover(evt) {
    if (evt) evt.stopPropagation();
    const pop = document.getElementById('zoho-gst-pref-popover');
    if (!pop) return;
    const isCurrentlyOpen = pop.style.display === 'block';
    closeAllMorePopovers();
    document.querySelectorAll('.zoho-addr-popover').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.zoho-sac-popover').forEach(p => p.style.display = 'none');
    if (!isCurrentlyOpen) {
      pop.style.display = 'block';
    } else {
      pop.style.display = 'none';
    }
  }`;

const newToggleGstPref = `  function toggleGstPreferencesPopover(evt) {
    if (evt) evt.stopPropagation();
    const pop = document.getElementById('zoho-gst-pref-popover');
    if (!pop) return;
    const isCurrentlyOpen = pop.style.display === 'block';
    closeAllMorePopovers();
    closeGstTreatmentDropdown();
    document.querySelectorAll('.zoho-addr-popover').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.zoho-sac-popover').forEach(p => p.style.display = 'none');
    if (!isCurrentlyOpen) {
      const currClient = clientsData.find(c => c.id === zohoSubscriptionClientId || c.id === Number(zohoSubscriptionClientId)) || clientsData[0];
      if (currClient && currClient.gst_treatment) {
        zohoSelectedGstTreatment = currClient.gst_treatment;
        const disp = document.getElementById('zoho-gst-treatment-display-val');
        if (disp) disp.innerText = currClient.gst_treatment;
        const hiddenInp = document.getElementById('zoho-gst-treatment-input');
        if (hiddenInp) hiddenInp.value = currClient.gst_treatment;
      }
      pop.style.display = 'block';
    } else {
      pop.style.display = 'none';
    }
  }`;

if (norm.includes(oldToggleGstPref)) {
  norm = norm.replace(oldToggleGstPref, newToggleGstPref);
  console.log('Updated toggleGstPreferencesPopover in app.js');
}

// 2e. Update closeGstPreferencesPopover to also close inner dropdown
const oldCloseGstPref = `  function closeGstPreferencesPopover() {
    const pop = document.getElementById('zoho-gst-pref-popover');
    if (pop) pop.style.display = 'none';
  }`;

const newCloseGstPref = `  function closeGstPreferencesPopover() {
    const pop = document.getElementById('zoho-gst-pref-popover');
    if (pop) pop.style.display = 'none';
    closeGstTreatmentDropdown();
  }`;

if (norm.includes(oldCloseGstPref)) {
  norm = norm.replace(oldCloseGstPref, newCloseGstPref);
  console.log('Updated closeGstPreferencesPopover in app.js');
}

// 2f. In document click listener, handle clicks outside zoho-gst-treatment-dropdown
const oldOutsideClick = `      // 3. GST Preferences Popover close on tap anywhere outside
      const gstPrefPop = document.getElementById('zoho-gst-pref-popover');
      if (gstPrefPop && gstPrefPop.style.display === 'block' && !e.target.closest('#zoho-gst-pref-popover') && !e.target.closest('.zoho-gst-pref-trigger')) {
        closeGstPreferencesPopover();
      }`;

const newOutsideClick = `      // 3. GST Preferences Popover close on tap anywhere outside
      const gstPrefPop = document.getElementById('zoho-gst-pref-popover');
      if (gstPrefPop && gstPrefPop.style.display === 'block') {
        const gstTreatDropdown = document.getElementById('zoho-gst-treatment-dropdown');
        if (gstTreatDropdown && gstTreatDropdown.style.display === 'block' && !e.target.closest('#zoho-gst-treatment-dropdown') && !e.target.closest('#zoho-gst-treatment-trigger')) {
          closeGstTreatmentDropdown();
        }
        if (!e.target.closest('#zoho-gst-pref-popover') && !e.target.closest('.zoho-gst-pref-trigger')) {
          closeGstPreferencesPopover();
        }
      }`;

if (norm.includes(oldOutsideClick)) {
  norm = norm.replace(oldOutsideClick, newOutsideClick);
  console.log('Updated outside-click handling for GST Treatment dropdown in app.js');
}

// 2g. Export helper functions in window.smatApp
const oldExport = `    toggleGstPreferencesPopover,
    closeGstPreferencesPopover,
    saveGstPreferences,`;

const newExport = `    toggleGstPreferencesPopover,
    closeGstPreferencesPopover,
    saveGstPreferences,
    renderGstTreatmentOptions,
    toggleGstTreatmentDropdown,
    closeGstTreatmentDropdown,
    selectGstTreatment,
    filterGstTreatments,`;

if (norm.includes(oldExport)) {
  norm = norm.replace(oldExport, newExport);
  console.log('Exported GST treatment functions in app.js');
}

fs.writeFileSync(appPath, norm.replace(/\n/g, '\r\n'), 'utf8');
console.log('GST Treatment searchable dropdown applied successfully!');
