const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
let content = fs.readFileSync(appPath, 'utf8');
let norm = content.replace(/\r\n/g, '\n');

const targetStr = `                          <!-- Dark Tooltip Bubble (Screenshot 3 Match) -->
                          <div id="zoho-plan-more-tooltip" class="zoho-more-popover" style="display:none; position:absolute; right:calc(100% + 10px); top:50%; transform:translateY(-50%); z-index:9999; background:#1E293B; color:#FFFFFF; border-radius:6px; padding:7px 12px; font-size:0.78rem; font-weight:500; white-space:nowrap; box-shadow:0 8px 20px rgba(0,0,0,0.25);">
                            <!-- Right-pointing triangle arrow -->
                            <div style="position:absolute; right:-5px; top:50%; transform:translateY(-50%); width:0; height:0; border-top:5px solid transparent; border-bottom:5px solid transparent; border-left:5px solid #1E293B;"></div>
                            Click here to add additional information for this item.
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>`;

const replacementStr = `                          <!-- Dark Tooltip Bubble (Screenshot 3 Match) -->
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
                    <td colspan="6" style="padding:10px 1.5rem 12px 1.5rem; position:relative;">
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

if (norm.includes(targetStr)) {
  norm = norm.replace(targetStr, replacementStr);
  fs.writeFileSync(appPath, norm.replace(/\n/g, '\r\n'), 'utf8');
  console.log('Successfully inserted #zoho-plan-additional-info-row into app.js');
} else {
  console.log('Error: targetStr not found in app.js');
}
