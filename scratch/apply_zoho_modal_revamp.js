const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
let js = fs.readFileSync(jsPath, 'utf8');

console.log('--- Revamping openPlanModal to 100% Zoho Reference Layout ---');

// Find start of modal.innerHTML in openPlanModal
const startMarker = "const modal = $('#modal-container');\r\n\r\n    modal.innerHTML = `";
const startMarkerLF = "const modal = $('#modal-container');\n\n    modal.innerHTML = `";

let isLF = false;
let startIdx = js.indexOf(startMarker);
if (startIdx === -1) {
  startIdx = js.indexOf(startMarkerLF);
  isLF = true;
}

if (startIdx === -1) {
  console.error('Could not find startMarker in app.js');
  process.exit(1);
}

// Find end of modal.innerHTML (before helper functions)
const endMarker = "`;\r\n\r\n    // Helper to extract clean plan tier from selection value";
const endMarkerLF = "`;\n\n    // Helper to extract clean plan tier from selection value";

let endIdx = js.indexOf(endMarker);
if (endIdx === -1) {
  endIdx = js.indexOf(endMarkerLF);
}

if (endIdx === -1) {
  console.error('Could not find endMarker in app.js');
  process.exit(1);
}

const prefix = js.substring(0, startIdx);
const suffix = js.substring(endIdx);

const newModalInnerHTML = `const modal = $('#modal-container');

    const currClientObj = (client && client.id !== undefined) ? client : (clientsData.find(c => c.id === 10) || clientsData[0] || {});
    const bAddr = currClientObj.billing_address || { company: currClientObj.company_name || 'feso', line1: 'test', line2: 'test', city: 'Hyderabad', pin: '500034', country: 'India' };
    const sAddr = currClientObj.shipping_address || {};
    const hasShipping = Boolean(sAddr.line1 || sAddr.city);

    modal.innerHTML = \`
      <div class="modal-overlay open" style="z-index:9999; display:flex; align-items:center; justify-content:center; background:rgba(15,23,42,0.65); padding:1.5rem;">
        <div class="modal-box-card" style="border-top: 4px solid #1877F2; max-width:960px; width:100%; max-height:92vh; overflow-y:auto; background:#FFFFFF; border-radius:8px; box-shadow:0 20px 40px rgba(0,0,0,0.25); padding:0;">
          
          <!-- Top Title Bar (Screenshot 1) -->
          <div style="padding:1.25rem 2rem; border-bottom:1px solid #E5E7EB; background:#FFFFFF; display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; z-index:20;">
            <div>
              <div style="font-size:1.25rem; font-weight:700; color:#111827; display:flex; align-items:center; gap:0.5rem;">
                <span>Change Subscription</span>
              </div>
              <div style="font-size:0.8rem; color:#6B7280; margin-top:2px;">
                Official Zoho Subscriptions Reference Layout • SmatBot Billing Engine
              </div>
            </div>
            <button onclick="window.smatApp.closeModal()" style="background:none; border:none; font-size:1.4rem; color:#6B7280; cursor:pointer; line-height:1;" title="Close Modal">✕</button>
          </div>

          <form id="plan-activation-form" style="padding:2rem;">

            <!-- ======================================================== -->
            <!-- SECTION 1: CUSTOMER & ADDRESS (SCREENSHOT 1)             -->
            <!-- ======================================================== -->
            <div style="display:flex; flex-direction:column; gap:1.5rem;">
              
              <!-- 1. Customer Name Row -->
              <div style="display:grid; grid-template-columns:180px 1fr; gap:1.5rem; align-items:flex-start;">
                <label class="filter-item-label" style="font-size:0.88rem; font-weight:600; color:#DC2626; margin:0; padding-top:6px;">
                  Customer Name*
                </label>
                <div>
                  <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap;">
                    
                    <!-- Searchable Customer Dropdown -->
                    <div style="position:relative; width:420px;">
                      <select id="plan-target-client" class="custom-dropdown-trigger" style="width:100%; border-color:#93C5FD; font-size:0.86rem; padding:0.45rem 0.75rem;">
                        <option value="NEW_CLIENT" \${isNewInitial ? 'selected' : ''}>➕ + Add New Client / Customer...</option>
                        \${clientsData.map(c => \`
                          <option value="\${c.id}" \${(!isNewInitial && c.id === currClientObj.id) ? 'selected' : ''}>
                            \${escapeHtml(c.name)} - \${escapeHtml(c.email)}
                          </option>
                        \`).join('')}
                      </select>
                    </div>

                    <!-- Quick Search Glass Button [ 🔍 ] -->
                    <button type="button" class="btn-table-action" style="background:#2563EB; border:1px solid #2563EB; color:#FFFFFF; padding:0.45rem 0.75rem; border-radius:4px; cursor:pointer;" onclick="document.getElementById('plan-target-client').focus();" title="Search Customer">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>

                    <!-- Currency Pill [ 🟢 INR ] -->
                    <span class="zoho-currency-pill" style="background:#ECFDF5; border:1px solid #A7F3D0; color:#065F46; padding:3px 8px; border-radius:4px; font-weight:700; font-size:0.8rem; display:inline-flex; align-items:center; gap:5px;">
                      <span style="width:7px; height:7px; background:#10B981; border-radius:50%; display:inline-block;"></span> \${currClientObj.currency_type || 'INR'}
                    </span>

                    <!-- Customer Chip on Far Right -->
                    <div style="margin-left:auto; background:#1F2937; color:#F9FAFB; padding:0.45rem 0.85rem; border-radius:4px; font-size:0.8rem; font-weight:500; display:flex; align-items:center; gap:0.4rem;">
                      <span>\${escapeHtml(currClientObj.name || 'deepak')} - \${escapeHtml((currClientObj.email || 'suryadesigner1234@gmail.com').substring(0, 13))}...</span>
                      <span>›</span>
                    </div>
                  </div>

                  <!-- New Client Quick Fields (only when NEW_CLIENT is selected) -->
                  <div id="new-client-fields-box" style="display: \${isNewInitial ? 'block' : 'none'}; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:6px; padding:0.75rem; margin-top:0.75rem;">
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
                      <div>
                        <label style="font-size:0.75rem; color:#64748B; font-weight:600; display:block; margin-bottom:2px;">Company / Client Name*</label>
                        <input type="text" id="new-client-name" class="filter-search-box" placeholder="e.g. Acme Technologies" style="width:100%;" />
                      </div>
                      <div>
                        <label style="font-size:0.75rem; color:#64748B; font-weight:600; display:block; margin-bottom:2px;">Official Email Address*</label>
                        <input type="email" id="new-client-email" class="filter-search-box" placeholder="e.g. billing@acme.com" style="width:100%;" />
                      </div>
                    </div>
                    <div style="margin-top:0.5rem;">
                      <label style="font-size:0.75rem; color:#64748B; font-weight:600; display:block; margin-bottom:2px;">Phone Number (Optional)</label>
                      <input type="tel" id="new-client-phone" class="filter-search-box" placeholder="+91 9876543210" style="width:100%;" />
                    </div>
                  </div>

                  <!-- Billing & Shipping Address Cards (Screenshot 1) -->
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:2.5rem; max-width:620px; margin-top:1.25rem;">
                    <!-- Billing Address Card -->
                    <div style="font-size:0.85rem; color:#374151; line-height:1.45;">
                      <div style="display:flex; align-items:center; gap:6px; font-size:0.75rem; font-weight:700; color:#6B7280; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.4rem;">
                        <span>BILLING ADDRESS</span>
                        <span style="cursor:pointer;" title="Edit Billing Address">✏️</span>
                      </div>
                      <div style="font-weight:700; color:#111827;">\${escapeHtml(bAddr.company || currClientObj.company_name || 'feso')}</div>
                      <div>\${escapeHtml(bAddr.line1 || 'test')}</div>
                      <div>\${escapeHtml(bAddr.line2 || 'test')}</div>
                      <div>\${escapeHtml(bAddr.city || 'Hyderabad')} \${escapeHtml(bAddr.pin || '500034')}</div>
                      <div>\${escapeHtml(bAddr.country || 'India')}</div>
                    </div>

                    <!-- Shipping Address Card -->
                    <div style="font-size:0.85rem; color:#374151; line-height:1.45;">
                      <div style="display:flex; align-items:center; gap:6px; font-size:0.75rem; font-weight:700; color:#6B7280; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.4rem;">
                        <span>SHIPPING ADDRESS</span>
                        <span style="cursor:pointer;" title="Edit Shipping Address">✏️</span>
                      </div>
                      \${hasShipping ? \`
                        <div style="font-weight:700; color:#111827;">\${escapeHtml(sAddr.company || currClientObj.name)}</div>
                        <div>\${escapeHtml(sAddr.line1 || '')}</div>
                        <div>\${escapeHtml(sAddr.city || '')} \${escapeHtml(sAddr.pin || '')}</div>
                        <div>\${escapeHtml(sAddr.country || 'India')}</div>
                      \` : \`
                        <a href="javascript:void(0)" onclick="alert('Shipping address can be customized under Edit Customer')" style="color:#2563EB; text-decoration:none; font-size:0.84rem; font-weight:500;">New Address</a>
                      \`}
                    </div>
                  </div>
                </div>
              </div>

              <!-- 2. E-MAIL TO Row (Screenshot 1) -->
              <div style="display:grid; grid-template-columns:180px 1fr; gap:1.5rem; align-items:center;">
                <label style="font-size:0.85rem; font-weight:600; color:#4B5563;">
                  E-MAIL TO
                </label>
                <div style="display:flex; align-items:center; gap:1.25rem;">
                  <button type="button" class="btn-table-action btn-action-secondary" style="border:none; color:#2563EB; font-weight:600; font-size:0.84rem; background:none; padding:0; cursor:pointer;" onclick="alert('Add Contact Person')">
                    <span style="font-size:1.1rem; line-height:1;">⊕</span> New Contact Person
                  </button>
                  <label style="display:inline-flex; align-items:center; gap:6px; font-size:0.85rem; color:#111827; cursor:pointer;">
                    <input type="checkbox" checked style="accent-color:#2563EB;" />
                    <span>\${escapeHtml(currClientObj.email || 'suryadesigner1234@gmail.com')}</span>
                  </label>
                </div>
              </div>

              <!-- 3. GST Details Row (Screenshot 1: Billing & Shipping Recipient) -->
              <div style="display:grid; grid-template-columns:180px 1fr; gap:1.5rem; align-items:flex-start;">
                <div></div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:2.5rem; max-width:620px; font-size:0.83rem;">
                  <!-- Billing Recipient GST Details -->
                  <div>
                    <div style="display:flex; align-items:center; gap:6px; font-size:0.75rem; font-weight:700; color:#6B7280; text-transform:uppercase; margin-bottom:0.35rem;">
                      <span>BILLING RECIPIENT GST DETAILS</span>
                      <span style="cursor:pointer;">✏️</span>
                    </div>
                    <div style="color:#374151;">
                      GST Treatment: <span style="font-weight:600; color:#111827;">\${escapeHtml(currClientObj.gst_treatment || 'Unregistered Business')}</span> ✏️
                    </div>
                  </div>

                  <!-- Shipping Recipient GST Details -->
                  <div>
                    <div style="display:flex; align-items:center; gap:6px; font-size:0.75rem; font-weight:700; color:#6B7280; text-transform:uppercase; margin-bottom:0.35rem;">
                      <span>SHIPPING RECIPIENT GST DETAILS</span>
                      <span style="cursor:pointer;">✏️</span>
                    </div>
                    <div style="color:#4B5563;">GSTIN: <span style="color:#111827; font-weight:500;">\${escapeHtml(currClientObj.gst_number || '')}</span></div>
                    <div style="color:#4B5563;">Business Legal Name: <span style="color:#111827; font-weight:500;">\${escapeHtml(currClientObj.legal_name || '')}</span></div>
                  </div>
                </div>
              </div>

              <!-- 4. Place of Supply* (Screenshot 1) -->
              <div style="display:grid; grid-template-columns:180px 1fr; gap:1.5rem; align-items:center;">
                <label style="font-size:0.88rem; font-weight:600; color:#DC2626;">
                  Place of Supply*
                </label>
                <div>
                  <select id="modal-place-of-supply" class="custom-dropdown-trigger" style="max-width:320px; font-size:0.85rem; padding:0.45rem 0.75rem;">
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
              </div>

              <!-- 5. Select Product* (Screenshot 1) -->
              <div style="display:grid; grid-template-columns:180px 1fr; gap:1.5rem; align-items:center;">
                <label style="font-size:0.88rem; font-weight:600; color:#DC2626;">
                  Select Product*
                </label>
                <div style="font-weight:600; color:#111827; font-size:0.9rem;">
                  SmatBot
                </div>
              </div>

            </div>

            <!-- ======================================================== -->
            <!-- SECTION 2: PLAN & ADDONS TABLE (SCREENSHOT 2)            -->
            <!-- ======================================================== -->
            <div style="margin-top:2.25rem; padding-top:1.5rem; border-top:1px solid #E5E7EB;">
              
              <!-- Plan Header & Preferences Bar -->
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                <h3 style="font-size:1.15rem; font-weight:700; color:#111827; margin:0;">Plan</h3>
                <div style="display:flex; align-items:center; gap:0.6rem;">
                  <select class="custom-dropdown-trigger" style="max-width:140px; padding:0.35rem 0.65rem; font-size:0.8rem;">
                    <option value="item-level" selected>(%) Item-Level</option>
                    <option value="transaction-level">Transaction-Level</option>
                    <option value="no-discount">No Discounts</option>
                  </select>
                  <select id="plan-duration-select" class="custom-dropdown-trigger" style="max-width:140px; padding:0.35rem 0.65rem; font-size:0.8rem;">
                    <option value="1" \${!isClientYearly ? 'selected' : ''}>Every Renewal</option>
                    <option value="12" \${isClientYearly ? 'selected' : ''}>Yearly Renewal (12 Mos)</option>
                    <option value="2">2 Months</option>
                    <option value="6">6 Months</option>
                  </select>
                </div>
              </div>

              <!-- Plan Table (Screenshot 2) -->
              <div style="border:1px solid #E5E7EB; border-radius:6px; overflow:hidden; margin-bottom:2rem;">
                <table style="width:100%; border-collapse:collapse; font-size:0.85rem;">
                  <thead>
                    <tr style="background:#F9FAFB; border-bottom:1px solid #E5E7EB; color:#6B7280; font-size:0.75rem; font-weight:700; text-transform:uppercase;">
                      <th style="padding:0.65rem 1rem; text-align:left; width:36%;">PLAN NAME</th>
                      <th style="padding:0.65rem 0.75rem; text-align:center; width:12%;">QUANTITY</th>
                      <th style="padding:0.65rem 0.75rem; text-align:right; width:14%;">PRICE</th>
                      <th style="padding:0.65rem 0.75rem; text-align:center; width:14%;">DISCOUNT</th>
                      <th style="padding:0.65rem 0.75rem; text-align:left; width:12%;">TAX</th>
                      <th style="padding:0.65rem 1rem; text-align:right; width:12%;">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="border-bottom:1px solid #F3F4F6; vertical-align:top;">
                      <!-- Plan Name & SAC Badge -->
                      <td style="padding:1rem;">
                        <div style="display:flex; gap:0.75rem;">
                          <div style="width:38px; height:38px; background:#F3F4F6; border:1px solid #E5E7EB; border-radius:4px; display:flex; align-items:center; justify-content:center; color:#9CA3AF; flex-shrink:0;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                          </div>
                          <div style="flex:1;">
                            <div style="display:flex; align-items:center; justify-content:space-between;">
                              <select id="plan-tier-select" class="custom-dropdown-trigger" style="width:100%; font-weight:600; color:#111827; border:none; background:none; font-size:0.88rem; padding:0;">
                                <optgroup label="── 📅 MONTHLY PLANS ──">
                                  <option value="Starter New Monthly (Without WA)" \${(currClientObj.plan_name || '').includes('Starter') && !isClientYearly ? 'selected' : ''}>Starter New Monthly (Without WA)</option>
                                  <option value="Pro_Monthly" \${selectedKey === 'Pro_Monthly' ? 'selected' : ''}>Pro - Monthly (₹6,500 / month)</option>
                                  <option value="Broadcast_Monthly" \${selectedKey === 'Broadcast_Monthly' ? 'selected' : ''}>Broadcast - Monthly (₹1,499 / month)</option>
                                  <option value="Standard_Monthly" \${selectedKey === 'Standard_Monthly' ? 'selected' : ''}>Standard - Monthly (₹3,500 / month)</option>
                                  <option value="AI_Monthly" \${selectedKey === 'AI_Monthly' ? 'selected' : ''}>AI Enterprise - Monthly (₹8,999 / month)</option>
                                </optgroup>
                                <optgroup label="── ⭐ YEARLY PLANS (SAVE UP TO 20%) ──">
                                  <option value="Starter New Yearly" \${(currClientObj.plan_name || '').includes('Starter') && isClientYearly ? 'selected' : ''}>Starter New Yearly (₹18,900 / year)</option>
                                  <option value="Pro_Yearly" \${selectedKey === 'Pro_Yearly' ? 'selected' : ''}>Pro - Yearly (₹72,000 / year)</option>
                                  <option value="Broadcast_Yearly" \${selectedKey === 'Broadcast_Yearly' ? 'selected' : ''}>Broadcast - Yearly (₹14,500 / year)</option>
                                  <option value="Standard_Yearly" \${selectedKey === 'Standard_Yearly' ? 'selected' : ''}>Standard - Yearly (₹35,000 / year)</option>
                                  <option value="AI_Yearly" \${selectedKey === 'AI_Yearly' ? 'selected' : ''}>AI Enterprise - Yearly (₹96,000 / year)</option>
                                </optgroup>
                                <optgroup label="── EVALUATION / TRIAL ──">
                                  <option value="Pro Trial" \${selectedKey === 'Pro Trial' ? 'selected' : ''}>Pro Trial (₹0 / 14 Days Evaluation)</option>
                                </optgroup>
                              </select>
                              <span style="color:#9CA3AF; cursor:pointer; font-size:0.9rem; margin-left:6px;" title="Reset Plan">✕</span>
                            </div>
                            <input type="text" placeholder="Add description to your plan" style="width:100%; border:none; background:#F9FAFB; padding:4px 8px; font-size:0.8rem; color:#4B5563; border-radius:4px; margin-top:4px; outline:none;" />
                            <div style="margin-top:6px; display:inline-flex; align-items:center; gap:4px;">
                              <span style="background:#059669; color:#FFFFFF; font-size:0.68rem; font-weight:700; padding:1px 5px; border-radius:3px;">SERVICE</span>
                              <span style="font-size:0.75rem; color:#2563EB; font-weight:600;">SAC: 998314 ✏️</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <!-- Quantity -->
                      <td style="padding:1rem 0.75rem; text-align:center;">
                        <input type="number" id="plan-qty-input" value="1" min="1" style="width:55px; text-align:center; border:1px solid #D1D5DB; border-radius:4px; padding:4px; font-size:0.85rem;" />
                      </td>

                      <!-- Price -->
                      <td style="padding:1rem 0.75rem; text-align:right;">
                        <div id="plan-unit-price-display" style="font-weight:600; color:#111827;">1890</div>
                      </td>

                      <!-- Point 1: Plan Discount (% / ₹) -->
                      <td style="padding:1rem 0.75rem; text-align:center;">
                        <div style="display:inline-flex; align-items:center; gap:2px; border:1px solid #D1D5DB; border-radius:4px; padding:1px 4px; background:#FFFFFF;">
                          <input type="number" id="plan-discount-value" value="0" min="0" style="width:45px; border:none; text-align:center; font-size:0.85rem; outline:none;" />
                          <select id="plan-discount-type" style="border:none; background:none; font-size:0.8rem; color:#4B5563; outline:none; cursor:pointer;">
                            <option value="percent">% ⌄</option>
                            <option value="flat">₹ ⌄</option>
                          </select>
                        </div>
                      </td>

                      <!-- Tax -->
                      <td style="padding:1rem 0.75rem;">
                        <select style="border:1px solid #D1D5DB; border-radius:4px; padding:4px; font-size:0.8rem; width:100%;">
                          <option value="18" selected>GST18 [18%]</option>
                          <option value="12">GST12 [12%]</option>
                          <option value="5">GST5 [5%]</option>
                          <option value="0">None [0%]</option>
                        </select>
                      </td>

                      <!-- Amount -->
                      <td style="padding:1rem; text-align:right;">
                        <div id="summary-plan-price" style="font-weight:700; color:#111827; font-size:0.92rem;">Rs. 1,890.00</div>
                        <div style="font-size:0.74rem; color:#6B7280; margin-top:2px;">per month</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Addons Header (Screenshot 2) -->
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                <h3 style="font-size:1.15rem; font-weight:700; color:#111827; margin:0;">Addons</h3>
              </div>

              <!-- Addons Table (Screenshot 2) -->
              <div style="border:1px solid #E5E7EB; border-radius:6px; overflow:hidden; margin-bottom:0.75rem;">
                <table style="width:100%; border-collapse:collapse; font-size:0.85rem;">
                  <thead>
                    <tr style="background:#F9FAFB; border-bottom:1px solid #E5E7EB; color:#6B7280; font-size:0.75rem; font-weight:700; text-transform:uppercase;">
                      <th style="padding:0.65rem 1rem; text-align:left; width:36%;">ADDON NAME</th>
                      <th style="padding:0.65rem 0.75rem; text-align:center; width:12%;">QUANTITY</th>
                      <th style="padding:0.65rem 0.75rem; text-align:right; width:14%;">PRICE</th>
                      <th style="padding:0.65rem 0.75rem; text-align:center; width:14%;">DISCOUNT</th>
                      <th style="padding:0.65rem 0.75rem; text-align:left; width:12%;">TAX</th>
                      <th style="padding:0.65rem 1rem; text-align:right; width:12%;">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- Row 1: Extra Chats OC NM (Screenshot 2) -->
                    <tr style="border-bottom:1px solid #F3F4F6; vertical-align:top;">
                      <td style="padding:1rem;">
                        <div style="display:flex; gap:0.6rem; align-items:flex-start;">
                          <span style="color:#9CA3AF; cursor:grab; font-size:1.1rem; line-height:1; padding-top:4px;">⠿</span>
                          <div style="width:38px; height:38px; background:#F3F4F6; border:1px solid #E5E7EB; border-radius:4px; display:flex; align-items:center; justify-content:center; color:#9CA3AF; flex-shrink:0;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                          </div>
                          <div style="flex:1;">
                            <div style="display:flex; align-items:center; justify-content:space-between;">
                              <span style="font-weight:600; color:#111827; font-size:0.86rem;">Extra Chats OC NM</span>
                              <span style="color:#DC2626; cursor:pointer; font-size:0.95rem; margin-left:6px;" title="Remove Add-on">✕</span>
                            </div>
                            <div style="font-size:0.75rem; color:#6B7280; margin-top:3px;">
                              1 UNIT : 1000 CHATS ( Excluding WhatsApp )
                            </div>
                            <div style="margin-top:6px; display:inline-flex; align-items:center; gap:4px;">
                              <span style="background:#059669; color:#FFFFFF; font-size:0.68rem; font-weight:700; padding:1px 5px; border-radius:3px;">SERVICE</span>
                              <span style="font-size:0.75rem; color:#2563EB; font-weight:600;">SAC: 998314 ✏️</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <!-- Quantity -->
                      <td style="padding:1rem 0.75rem; text-align:center;">
                        <input type="number" value="1" min="1" style="width:55px; text-align:center; border:1px solid #D1D5DB; border-radius:4px; padding:4px; font-size:0.85rem;" />
                        <div style="font-size:0.72rem; color:#6B7280; margin-top:4px;">Extra Chats OC NM</div>
                      </td>

                      <!-- Price -->
                      <td style="padding:1rem 0.75rem; text-align:right;">
                        <div style="font-weight:600; color:#111827;">600</div>
                      </td>

                      <!-- Point 2: Add-on Discount (% / ₹) -->
                      <td style="padding:1rem 0.75rem; text-align:center;">
                        <div style="display:inline-flex; align-items:center; gap:2px; border:1px solid #D1D5DB; border-radius:4px; padding:1px 4px; background:#FFFFFF;">
                          <input type="number" id="addon-discount-value" value="0" min="0" style="width:45px; border:none; text-align:center; font-size:0.85rem; outline:none;" />
                          <select id="addon-discount-type" style="border:none; background:none; font-size:0.8rem; color:#4B5563; outline:none; cursor:pointer;">
                            <option value="percent">% ⌄</option>
                            <option value="flat">₹ ⌄</option>
                          </select>
                        </div>
                      </td>

                      <!-- Tax -->
                      <td style="padding:1rem 0.75rem;">
                        <select style="border:1px solid #D1D5DB; border-radius:4px; padding:4px; font-size:0.8rem; width:100%;">
                          <option value="18" selected>GST18 [18%]</option>
                          <option value="12">GST12 [12%]</option>
                          <option value="5">GST5 [5%]</option>
                          <option value="0">None [0%]</option>
                        </select>
                      </td>

                      <!-- Amount -->
                      <td style="padding:1rem; text-align:right;">
                        <div style="font-weight:700; color:#111827; font-size:0.92rem;">Rs. 600.00</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Add-on Boosters Selection (Preserves existing checkbox inputs for logic) -->
              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:6px; padding:0.75rem; margin-bottom:1rem;">
                <div style="font-size:0.78rem; font-weight:700; color:#475569; margin-bottom:0.4rem;">Select Additional Active Add-ons:</div>
                <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.6rem; font-size:0.8rem;">
                  <label style="display:flex; align-items:center; gap:5px; cursor:pointer;">
                    <input type="checkbox" id="addon-chats" />
                    <span>+10K Chats (₹1,500)</span>
                  </label>
                  <label style="display:flex; align-items:center; gap:5px; cursor:pointer;">
                    <input type="checkbox" id="addon-waba" />
                    <span>Dedicated WABA (₹2,500)</span>
                  </label>
                  <label style="display:flex; align-items:center; gap:5px; cursor:pointer;">
                    <input type="checkbox" id="addon-agent" />
                    <span>Live Agent (₹800)</span>
                  </label>
                </div>
              </div>

              <!-- Add New Row Button (Screenshot 3) -->
              <div style="margin-bottom:2rem;">
                <button type="button" class="btn-table-action btn-action-secondary" style="font-size:0.84rem; display:inline-flex; align-items:center; gap:6px; color:#2563EB;">
                  <span>⊕ Add New Row</span>
                  <span style="font-size:0.75rem;">⌄</span>
                </button>
              </div>

            </div>

            <!-- ======================================================== -->
            <!-- SECTION 3: SUBSCRIPTION TERM (EXACT USER SPECIFICATION)  -->
            <!-- ======================================================== -->
            <div style="margin-top:2rem; padding-top:1.5rem; border-top:1px solid #E5E7EB;">
              <h3 style="font-size:1.15rem; font-weight:700; color:#111827; margin:0 0 1.25rem 0;">Subscription Term</h3>
              
              <div style="display:flex; flex-direction:column; gap:1.25rem; max-width:650px;">
                <!-- Subscription Number* -->
                <div style="display:grid; grid-template-columns:180px 1fr; gap:1.5rem; align-items:center;">
                  <label style="font-size:0.88rem; font-weight:600; color:#DC2626;">Subscription Number*</label>
                  <input type="text" id="modal-sub-number" class="filter-search-box" value="${escapeHtml(currClientObj.subscription_id || 'SUB-01083')}" style="width:100%; border:1px solid #D1D5DB; border-radius:4px; padding:0.45rem 0.75rem;" />
                </div>

                <!-- Salesperson -->
                <div style="display:grid; grid-template-columns:180px 1fr; gap:1.5rem; align-items:center;">
                  <label style="font-size:0.85rem; font-weight:600; color:#4B5563;">Salesperson</label>
                  <select id="modal-sub-sales" class="custom-dropdown-trigger" style="width:100%;">
                    <option value="">Select a salesperson</option>
                    <option value="Rahul Sharma" ${currClientObj.sales_person === 'Rahul Sharma' ? 'selected' : ''}>Rahul Sharma</option>
                    <option value="Sukanya Nagireddy" ${currClientObj.sales_person === 'Sukanya Nagireddy' ? 'selected' : ''}>Sukanya Nagireddy</option>
                    <option value="Kiran Kumar" ${currClientObj.sales_person === 'Kiran Kumar' ? 'selected' : ''}>Kiran Kumar</option>
                    <option value="Pooja Reddy" ${currClientObj.sales_person === 'Pooja Reddy' ? 'selected' : ''}>Pooja Reddy</option>
                    <option value="Amit Patel" ${currClientObj.sales_person === 'Amit Patel' ? 'selected' : ''}>Amit Patel</option>
                    <option value="Sameer Khan" ${currClientObj.sales_person === 'Sameer Khan' ? 'selected' : ''}>Sameer Khan</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- ======================================================== -->
            <!-- SECTION 5: POINT 3 LIVE FINAL BILLING & TAX SUMMARY     -->
            <!-- ======================================================== -->
            <div id="plan-billing-breakdown-card" style="margin-top:2.25rem; background:#F0F7FF; border:1px solid #BFDBFE; border-radius:8px; padding:1.25rem 1.5rem; max-width:650px;">
              <div style="font-weight:700; color:#1E40AF; font-size:0.92rem; margin-bottom:0.75rem; display:flex; justify-content:space-between; align-items:center;">
                <span>🧾 Final Billing & Tax Summary</span>
                <span style="font-size:0.75rem; color:#2563EB; background:#DBEAFE; padding:3px 8px; border-radius:4px; font-weight:600;">SAC: 998314 • GST 18%</span>
              </div>

              <div style="display:flex; flex-direction:column; gap:0.4rem; color:#334155; font-size:0.86rem;">
                <div style="display:flex; justify-content:space-between;">
                  <span id="summary-plan-title">Plan Rate:</span>
                  <span id="summary-plan-price" style="font-weight:600;">₹ 1,890.00</span>
                </div>
                <div style="display:flex; justify-content:space-between;">
                  <span>Add-on Boosters Subtotal:</span>
                  <span id="summary-addons-price" style="font-weight:600;">+ ₹ 600.00</span>
                </div>
                <div id="summary-discount-row" style="display:flex; justify-content:space-between; color:#DC2626;">
                  <span id="summary-discount-label">Applicable Discounts Deducted:</span>
                  <span id="summary-discount-price" style="font-weight:600;">- ₹ 0.00</span>
                </div>
                <div style="display:flex; justify-content:space-between; padding-top:0.4rem; border-top:1px dashed #BFDBFE;">
                  <span>Taxable Amount (Net Base):</span>
                  <span id="summary-taxable-price" style="font-weight:600;">₹ 2,490.00</span>
                </div>
                <div style="display:flex; justify-content:space-between; color:#475569;">
                  <span>GST (18% Software Services):</span>
                  <span id="summary-tax-price" style="font-weight:600;">+ ₹ 448.20</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; padding-top:0.6rem; margin-top:0.25rem; border-top:2px solid #93C5FD; font-size:1.02rem; font-weight:800; color:#1E3A8A;">
                  <span>Customer Final Payable Amount:</span>
                  <span id="summary-final-total" style="color:#1D4ED8; font-size:1.15rem;">₹ 2,938.20</span>
                </div>
              </div>
            </div>

            <!-- ======================================================== -->
            <!-- SECTION 6: FOOTER ACTIONS (SCREENSHOT 4)                 -->
            <!-- ======================================================== -->
            <div style="display:flex; align-items:center; gap:0.75rem; margin-top:2.5rem; padding-top:1.5rem; border-top:1px solid #E5E7EB;">
              <button type="submit" id="plan-submit-btn" class="zoho-btn-continue" style="background:#1877F2; border:1px solid #1877F2; color:#FFFFFF; padding:0.6rem 2rem; border-radius:4px; font-weight:600; font-size:0.9rem; cursor:pointer;">
                Continue
              </button>
              <button type="button" class="zoho-btn-cancel" onclick="window.smatApp.closeModal()" style="background:#FFFFFF; border:1px solid #D1D5DB; color:#374151; padding:0.6rem 1.5rem; border-radius:4px; font-weight:500; font-size:0.9rem; cursor:pointer;">
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    \`;`;

js = prefix + newModalInnerHTML + suffix;
fs.writeFileSync(jsPath, js, 'utf8');

console.log('🎉 Successfully revamped openPlanModal to match the 4 Zoho screenshots!');
