const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
let content = fs.readFileSync(appPath, 'utf8');
let norm = content.replace(/\r\n/g, '\n');

// 1. Replace the Plan select dropdown with plain text + permanent circled-cross remove icon
const oldPlanSelectBlock = `                          <div style="display:flex; align-items:center; justify-content:space-between;">
                            <select id="zoho-plan-select" style="font-weight:600; color:#111827; border:1px solid transparent; background:none; font-size:0.88rem; width:100%; outline:none; cursor:pointer;" onchange="window.smatApp.onZohoPlanChange(this.value)">
                              <optgroup label="── 📅 MONTHLY PLANS ──">
                                <option value="Starter New Monthly (Without WA)|1890" \${currentPlanName.includes('Starter') && !currentPlanName.includes('Yearly') ? 'selected' : ''}>Starter New Monthly (Without WA)</option>
                                <option value="Pro - Monthly|6500" \${currentPlanName.includes('Pro') && !currentPlanName.includes('Yearly') && !currentPlanName.includes('Trial') ? 'selected' : ''}>Pro - Monthly (₹6,500)</option>
                                <option value="Broadcast - Monthly|1499">Broadcast - Monthly (₹1,499)</option>
                                <option value="Standard - Monthly|3500">Standard - Monthly (₹3,500)</option>
                                <option value="AI Enterprise - Monthly|8999">AI Enterprise - Monthly (₹8,999)</option>
                              </optgroup>
                              <optgroup label="── ⭐ YEARLY PLANS (SAVE UP TO 20%) ──">
                                <option value="Starter New Yearly|18900">Starter New Yearly (₹18,900)</option>
                                <option value="Pro - Yearly|72000" \${currentPlanName.includes('Yearly') ? 'selected' : ''}>Pro - Yearly (₹72,000)</option>
                                <option value="Broadcast - Yearly|14500">Broadcast - Yearly (₹14,500)</option>
                                <option value="Standard - Yearly|35000">Standard - Yearly (₹35,000)</option>
                                <option value="AI Enterprise - Yearly|96000">AI Enterprise - Yearly (₹96,000)</option>
                              </optgroup>
                              <optgroup label="── EVALUATION / TRIAL ──">
                                <option value="Pro Trial|0" \${currentPlanName.includes('Trial') ? 'selected' : ''}>Pro Trial (₹0 / 14 Days)</option>
                              </optgroup>
                            </select>
                            <span class="zoho-plan-remove-btn" onclick="event.stopPropagation(); window.smatApp.showRemovePlanModal()" style="color:#9CA3AF; cursor:pointer; display:inline-flex; align-items:center; padding:2px; margin-left:8px; border-radius:50%; transition:all 0.15s;" title="Remove Plan" onmouseover="this.style.color='#EF4444'" onmouseout="this.style.color='#9CA3AF'">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                              </svg>
                            </span>
                          </div>`;

const newPlanSelectBlock = `                          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                            <span id="zoho-plan-name-display" style="font-weight:600; color:#111827; font-size:0.88rem;">\${escapeHtml(currentPlanName)}</span>
                            <span class="zoho-plan-remove-btn" onclick="event.stopPropagation(); window.smatApp.showRemovePlanModal()" style="color:#9CA3AF; cursor:pointer; display:inline-flex; align-items:center; transition:color 0.15s;" title="Remove Plan" onmouseover="this.style.color='#EF4444'" onmouseout="this.style.color='#9CA3AF'">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                              </svg>
                            </span>
                          </div>
                          <input type="hidden" id="zoho-plan-select" value="\${escapeHtml(currentPlanName)}" />`;

if (norm.includes(oldPlanSelectBlock)) {
  norm = norm.replace(oldPlanSelectBlock, newPlanSelectBlock);
  console.log('Replaced plan <select> with plain text and circled-cross remove icon in app.js');
} else {
  console.log('Warning: oldPlanSelectBlock not found in app.js');
}

// 2. Add "Select an account ▾" under SAC badge in Plan row
const oldSacWrapEnd = `                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>

                    <!-- Quantity -->`;

const newSacWrapEnd = `                              </div>
                            </div>
                          </div>
                          <!-- Select an account (Screenshot Match) -->
                          <div style="margin-top:6px; display:inline-flex; align-items:center; gap:5px; font-size:0.75rem; color:#6B7280; cursor:pointer;" title="Select Account">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                            <span>Select an account</span>
                            <span style="font-size:0.7rem;">▾</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <!-- Quantity -->`;

if (norm.includes(oldSacWrapEnd)) {
  norm = norm.replace(oldSacWrapEnd, newSacWrapEnd);
  console.log('Added Select an account under SAC code in app.js');
} else {
  console.log('Warning: oldSacWrapEnd not found in app.js');
}

// 3. In Populated Addon row, add permanent circled-cross remove icon next to addon name
const oldAddonTitleBlock = `                            <!-- Populated Row: Selected Addon (Screenshot 1 & Screenshot 2) -->
                            <div style="flex:1;">
                              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                                <span style="font-weight:600; color:#111827; font-size:0.88rem;">\${escapeHtml(addon.name)}</span>
                              </div>`;

const newAddonTitleBlock = `                            <!-- Populated Row: Selected Addon (Screenshot 1 & Screenshot 2) -->
                            <div style="flex:1;">
                              <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                                <span style="font-weight:600; color:#111827; font-size:0.88rem;">\${escapeHtml(addon.name)}</span>
                                <span class="zoho-addon-remove-btn" onclick="event.stopPropagation(); window.smatApp.removeZohoSubAddonRow(\${idx})" style="color:#9CA3AF; cursor:pointer; display:inline-flex; align-items:center; transition:color 0.15s;" title="Remove Addon" onmouseover="this.style.color='#EF4444'" onmouseout="this.style.color='#9CA3AF'">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                  </svg>
                                </span>
                              </div>`;

if (norm.includes(oldAddonTitleBlock)) {
  norm = norm.replace(oldAddonTitleBlock, newAddonTitleBlock);
  console.log('Added permanent circled-cross remove icon next to addon name in app.js');
} else {
  console.log('Warning: oldAddonTitleBlock not found in app.js');
}

fs.writeFileSync(appPath, norm.replace(/\n/g, '\r\n'), 'utf8');
console.log('Successfully updated Plan and Addon remove marks and removed select dropdown!');
