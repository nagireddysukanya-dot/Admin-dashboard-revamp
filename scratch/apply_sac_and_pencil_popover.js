const fs = require('fs');

let content = fs.readFileSync('frontend/js/app.js', 'utf8');

// 1. Replace Plan SAC badge in renderZohoSubscriptionView
const oldPlanSac = `                          <!-- SAC Code Badge (Screenshot 2) -->
                          <div style="margin-top:6px; display:inline-flex; align-items:center; gap:4px;">
                            <span style="background:#059669; color:#FFFFFF; font-size:0.68rem; font-weight:700; padding:1px 5px; border-radius:3px;">SERVICE</span>
                            <span style="font-size:0.75rem; color:#2563EB; font-weight:600;">SAC: 998314 ✏️</span>
                          </div>`;

const newPlanSac = `                          <!-- SAC Code Badge & Popover (User Screenshot Match) -->
                          <div class="zoho-sac-badge-wrap" style="position:relative; display:inline-flex; align-items:center; gap:5px; margin-top:6px;">
                            <span style="background:#059669; color:#FFFFFF; font-size:0.68rem; font-weight:700; padding:1px 5px; border-radius:3px; letter-spacing:0.3px;">SERVICE</span>
                            <span style="font-size:0.75rem; color:#2563EB; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:3px;" onclick="event.stopPropagation(); window.smatApp.toggleSacPopover('plan', 0, event)" title="Click to edit SAC code">
                              SAC: <span id="zoho-plan-sac-text">998314</span>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                            </span>

                            <!-- Top-pointed Popover (Exact Match to User Screenshot) -->
                            <div id="zoho-sac-popover-plan" class="zoho-sac-popover" style="display:none; position:absolute; top:calc(100% + 8px); left:0; z-index:1050; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:6px; box-shadow:0 8px 24px rgba(0,0,0,0.12); padding:12px 14px; min-width:270px; text-align:left;">
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
                          </div>`;

// 2. Replace Add-on SAC badge in renderZohoSubscriptionView
const oldAddonSac = `                              <div style="display:inline-flex; align-items:center; gap:4px;">
                                <span style="background:#059669; color:#FFFFFF; font-size:0.68rem; font-weight:700; padding:1px 5px; border-radius:3px;">SERVICE</span>
                                <span style="font-size:0.75rem; color:#2563EB; font-weight:600;">SAC: 998314 ✏️</span>
                              </div>`;

const newAddonSac = `                              <div class="zoho-sac-badge-wrap" style="position:relative; display:inline-flex; align-items:center; gap:5px;">
                                <span style="background:#059669; color:#FFFFFF; font-size:0.68rem; font-weight:700; padding:1px 5px; border-radius:3px; letter-spacing:0.3px;">SERVICE</span>
                                <span style="font-size:0.75rem; color:#2563EB; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:3px;" onclick="event.stopPropagation(); window.smatApp.toggleSacPopover('addon', \${idx}, event)" title="Click to edit SAC code">
                                  SAC: <span id="zoho-addon-sac-text-\${idx}">\${addon.sac || '998314'}</span>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                </span>

                                <!-- Top-pointed Popover (Exact Match to User Screenshot) -->
                                <div id="zoho-sac-popover-addon-\${idx}" class="zoho-sac-popover" style="display:none; position:absolute; top:calc(100% + 8px); left:0; z-index:1050; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:6px; box-shadow:0 8px 24px rgba(0,0,0,0.12); padding:12px 14px; min-width:270px; text-align:left;">
                                  <div style="position:absolute; top:-6px; left:48px; width:10px; height:10px; background:#FFFFFF; border-left:1px solid #E5E7EB; border-top:1px solid #E5E7EB; transform:rotate(45deg);"></div>
                                  <div style="font-size:0.84rem; font-weight:600; color:#374151; margin-bottom:8px;">SAC</div>
                                  <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
                                    <select id="zoho-sac-select-addon-\${idx}" style="flex:1; border:1.5px solid #3B82F6; border-radius:4px; padding:6px 10px; font-size:0.86rem; color:#111827; outline:none; background:#FFFFFF; cursor:pointer;">
                                      <option value="998314" \${addon.sac === '998314' || !addon.sac ? 'selected' : ''}>998314</option>
                                      <option value="998313" \${addon.sac === '998313' ? 'selected' : ''}>998313 - IT Consulting & Support</option>
                                      <option value="998315" \${addon.sac === '998315' ? 'selected' : ''}>998315 - Hosting & Infrastructure</option>
                                      <option value="998319" \${addon.sac === '998319' ? 'selected' : ''}>998319 - Other IT Services</option>
                                      <option value="998311" \${addon.sac === '998311' ? 'selected' : ''}>998311 - Telecommunications</option>
                                    </select>
                                    <span style="color:#2563EB; cursor:pointer;" title="Search SAC Code">
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                    </span>
                                  </div>
                                  <div style="display:flex; align-items:center; gap:8px;">
                                    <button type="button" onclick="window.smatApp.saveSacCode('addon', \${idx})" style="background:#2563EB; color:#FFFFFF; border:none; border-radius:4px; padding:4px 14px; font-size:0.8rem; font-weight:600; cursor:pointer;">Save</button>
                                    <button type="button" onclick="window.smatApp.closeSacPopover('addon', \${idx})" style="background:#F3F4F6; color:#374151; border:1px solid #E5E7EB; border-radius:4px; padding:4px 12px; font-size:0.8rem; cursor:pointer;">Close</button>
                                  </div>
                                </div>
                              </div>`;

// 3. Replace other pencil icons with the SVG outline pencil in renderZohoSubscriptionView
const oldBillingPencil = `<span style="cursor:pointer; font-size:0.85rem;" title="Edit Billing Address">✏️</span>`;
const newBillingPencil = `<span style="cursor:pointer; display:inline-flex; align-items:center;" title="Edit Billing Address"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></span>`;

const oldShippingPencil = `<span style="cursor:pointer; font-size:0.85rem;" title="Edit Shipping Address">✏️</span>`;
const newShippingPencil = `<span style="cursor:pointer; display:inline-flex; align-items:center;" title="Edit Shipping Address"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></span>`;

const oldGstDetailsPencil = `<span>BILLING RECIPIENT GST DETAILS</span>
                    <span style="cursor:pointer;">✏️</span>`;
const newGstDetailsPencil = `<span>BILLING RECIPIENT GST DETAILS</span>
                    <span style="cursor:pointer; display:inline-flex; align-items:center;" title="Edit GST Details"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></span>`;

const oldGstTreatmentPencil = `GST Treatment: <span style="font-weight:600; color:#111827;">\${escapeHtml(currClient.gst_treatment || 'Unregistered Business')}</span> ✏️`;
const newGstTreatmentPencil = `GST Treatment: <span style="font-weight:600; color:#111827;">\${escapeHtml(currClient.gst_treatment || 'Unregistered Business')}</span> <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="cursor:pointer; vertical-align:middle;" title="Edit GST Treatment"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`;

const oldShipGstPencil = `<span>SHIPPING RECIPIENT GST DETAILS</span>
                    <span style="cursor:pointer;">✏️</span>`;
const newShipGstPencil = `<span>SHIPPING RECIPIENT GST DETAILS</span>
                    <span style="cursor:pointer; display:inline-flex; align-items:center;" title="Edit Shipping GST"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></span>`;

// 4. Add the SAC Popover methods
const newSacFunctions = `  function toggleSacPopover(type, idx, evt) {
    if (evt) evt.stopPropagation();
    const popId = type === 'plan' ? 'zoho-sac-popover-plan' : \`zoho-sac-popover-addon-\${idx}\`;
    const pop = document.getElementById(popId);
    if (!pop) return;
    const isCurrentlyOpen = pop.style.display === 'block';
    document.querySelectorAll('.zoho-sac-popover').forEach(p => p.style.display = 'none');
    if (!isCurrentlyOpen) {
      pop.style.display = 'block';
    }
  }

  function closeSacPopover(type, idx) {
    const popId = type === 'plan' ? 'zoho-sac-popover-plan' : \`zoho-sac-popover-addon-\${idx}\`;
    const pop = document.getElementById(popId);
    if (pop) pop.style.display = 'none';
  }

  function saveSacCode(type, idx) {
    if (type === 'plan') {
      const sel = document.getElementById('zoho-sac-select-plan');
      if (sel) {
        const val = sel.value;
        const txt = document.getElementById('zoho-plan-sac-text');
        if (txt) txt.innerText = val;
      }
      closeSacPopover('plan');
    } else {
      const sel = document.getElementById(\`zoho-sac-select-addon-\${idx}\`);
      if (sel && zohoSubAddons[idx]) {
        const val = sel.value;
        zohoSubAddons[idx].sac = val;
        const txt = document.getElementById(\`zoho-addon-sac-text-\${idx}\`);
        if (txt) txt.innerText = val;
      }
      closeSacPopover('addon', idx);
    }
  }
`;

let normContent = content.replace(/\r\n/g, '\n');

normContent = normContent.replace(oldPlanSac.replace(/\r\n/g, '\n'), newPlanSac.replace(/\r\n/g, '\n'));
normContent = normContent.replace(oldAddonSac.replace(/\r\n/g, '\n'), newAddonSac.replace(/\r\n/g, '\n'));
normContent = normContent.replace(oldBillingPencil.replace(/\r\n/g, '\n'), newBillingPencil.replace(/\r\n/g, '\n'));
normContent = normContent.replace(oldShippingPencil.replace(/\r\n/g, '\n'), newShippingPencil.replace(/\r\n/g, '\n'));
normContent = normContent.replace(oldGstDetailsPencil.replace(/\r\n/g, '\n'), newGstDetailsPencil.replace(/\r\n/g, '\n'));
normContent = normContent.replace(oldGstTreatmentPencil.replace(/\r\n/g, '\n'), newGstTreatmentPencil.replace(/\r\n/g, '\n'));
normContent = normContent.replace(oldShipGstPencil.replace(/\r\n/g, '\n'), newShipGstPencil.replace(/\r\n/g, '\n'));

// Inject new SAC functions right before addZohoSubAddonRow
const anchor = '  function addZohoSubAddonRow() {';
if (normContent.includes(anchor)) {
  normContent = normContent.replace(anchor, newSacFunctions + '\n' + anchor);
}

// Expose on window.smatApp
const smatAppReturn = '    addZohoSubAddonRow,';
if (normContent.includes(smatAppReturn)) {
  normContent = normContent.replace(smatAppReturn, `    toggleSacPopover,\n    closeSacPopover,\n    saveSacCode,\n` + smatAppReturn);
}

fs.writeFileSync('frontend/js/app.js', normContent.replace(/\n/g, '\r\n'), 'utf8');
console.log('Successfully added SAC popovers and SVG pencil icons matching screenshot!');
