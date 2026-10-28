// Script to remove Reference Number, GST Number, and Payment Mode/Preferences section as marked by user
const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
const indexHtmlPath = path.join(__dirname, '..', 'frontend', 'index.html');

let appJsRaw = fs.readFileSync(appJsPath, 'utf8');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const isCRLF = appJsRaw.includes('\r\n');
let appJs = appJsRaw.replace(/\r\n/g, '\n');

console.log('Original app.js length:', appJs.length, 'isCRLF:', isCRLF);

// Exact target block to replace (from Section 3 Subscription Term through Section 4 Payment Mode)
const targetBlock = `          <!-- SECTION 3: SUBSCRIPTION TERM (SCREENSHOT 3) -->
          <div style="margin-top:2rem; padding-top:1.5rem; border-top:1px solid #E5E7EB;">
            <h2 style="font-size:1.15rem; font-weight:700; color:#111827; margin:0 0 1.25rem 0;">Subscription Term</h2>
            
            <div style="display:flex; flex-direction:column; gap:1.25rem; max-width:650px;">
              <!-- Subscription Number* -->
              <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:center;">
                <label style="font-size:0.88rem; font-weight:600; color:#DC2626;">Subscription Number*</label>
                <input type="text" id="zoho-sub-num" class="zoho-input-text" value="\${escapeHtml(currClient.subscription_id || 'SUB-01083')}" style="width:100%; border:1px solid #D1D5DB; border-radius:4px; padding:0.45rem 0.75rem;" />
              </div>

              <!-- Reference Number -->
              <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:center;">
                <label style="font-size:0.85rem; font-weight:600; color:#4B5563;">Reference Number</label>
                <input type="text" id="zoho-sub-ref" class="zoho-input-text" placeholder="" style="width:100%; border:1px solid #D1D5DB; border-radius:4px; padding:0.45rem 0.75rem;" />
              </div>

              <!-- Salesperson -->
              <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:center;">
                <label style="font-size:0.85rem; font-weight:600; color:#4B5563;">Salesperson</label>
                <select id="zoho-sub-sales" class="zoho-select-dropdown" style="width:100%;">
                  <option value="">Select a salesperson</option>
                  <option value="Rahul Sharma" \${currClient.sales_person === 'Rahul Sharma' ? 'selected' : ''}>Rahul Sharma</option>
                  <option value="Sukanya Nagireddy" \${currClient.sales_person === 'Sukanya Nagireddy' ? 'selected' : ''}>Sukanya Nagireddy</option>
                  <option value="Kiran Kumar" \${currClient.sales_person === 'Kiran Kumar' ? 'selected' : ''}>Kiran Kumar</option>
                  <option value="Pooja Reddy" \${currClient.sales_person === 'Pooja Reddy' ? 'selected' : ''}>Pooja Reddy</option>
                  <option value="Amit Patel" \${currClient.sales_person === 'Amit Patel' ? 'selected' : ''}>Amit Patel</option>
                  <option value="Sameer Khan" \${currClient.sales_person === 'Sameer Khan' ? 'selected' : ''}>Sameer Khan</option>
                </select>
              </div>

              <!-- GST Number (Screenshot 3) -->
              <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:center;">
                <label style="font-size:0.85rem; font-weight:600; color:#4B5563;">GST Number</label>
                <input type="text" id="zoho-sub-gst" class="zoho-input-text" value="\${escapeHtml(currClient.gst_number || '')}" placeholder="" style="width:100%; border:1px solid #D1D5DB; border-radius:4px; padding:0.45rem 0.75rem;" />
              </div>
            </div>
          </div>

          <!-- SECTION 4: PAYMENT MODE & PREFERENCES (SCREENSHOT 4) -->
          <div style="margin-top:2rem; padding-top:1.5rem; border-top:1px solid #E5E7EB;">
            <div style="display:flex; flex-direction:column; gap:1.25rem; max-width:700px;">
              
              <!-- Payment Mode: Collect payment offline (Mandated by User) -->
              <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:center;">
                <label style="font-size:0.85rem; font-weight:600; color:#4B5563;">Payment Mode</label>
                <label style="display:inline-flex; align-items:center; gap:6px; font-size:0.85rem; color:#111827; cursor:pointer;">
                  <input type="checkbox" id="zoho-sub-paymode-offline" checked style="accent-color:#2563EB;" />
                  <span>Collect payment offline</span>
                </label>
              </div>

              <!-- Payment Terms -->
              <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:center;">
                <label style="font-size:0.85rem; font-weight:600; color:#4B5563;">Payment Terms</label>
                <select id="zoho-sub-terms" class="zoho-select-dropdown" style="max-width:240px;">
                  <option value="Due on Receipt" selected>Due on Receipt</option>
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Due End of Month">Due End of Month</option>
                </select>
              </div>

              <!-- Online payment options (Screenshot 4) -->
              <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:flex-start;">
                <div></div>
                <div>
                  <div style="font-size:0.82rem; color:#4B5563; margin-bottom:0.4rem;">
                    Select an online payment option to get paid faster <span style="font-size:0.9rem;">🔴🟡</span> <span style="color:#1E3A8A; font-weight:700;">VISA</span> <span style="color:#2563EB; font-weight:600;">⚙ Payment Gateway</span>
                  </div>
                  <label style="display:inline-flex; align-items:center; gap:6px; font-size:0.85rem; color:#111827; cursor:pointer;">
                    <input type="checkbox" id="zoho-sub-razorpay" style="accent-color:#2563EB;" />
                    <span>Razorpay</span>
                  </label>
                </div>
              </div>

              <!-- Proration Preference (Screenshot 4) -->
              <div style="margin-top:1rem; padding-top:1rem; border-top:1px dashed #E5E7EB;">
                <div style="font-size:0.85rem; font-weight:700; color:#4B5563; margin-bottom:0.5rem;">Proration Preference</div>
                <label style="display:inline-flex; align-items:center; gap:6px; font-size:0.85rem; color:#111827; cursor:pointer;">
                  <input type="checkbox" id="zoho-sub-prorate" style="accent-color:#2563EB;" />
                  <span>Prorate Charges & Credits <span style="color:#9CA3AF;" title="Prorate fees across billing cycle">ⓘ</span></span>
                </label>
              </div>

              <!-- Other Preferences (Screenshot 4) -->
              <div style="margin-top:0.75rem;">
                <div style="font-size:0.85rem; font-weight:700; color:#2563EB; cursor:pointer; margin-bottom:0.75rem;">
                  Other Preferences ▾
                </div>
                
                <div style="display:flex; flex-direction:column; gap:0.75rem; font-size:0.85rem;">
                  <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:center;">
                    <span style="color:#4B5563;">Invoice Template</span>
                    <span style="color:#111827; font-weight:500;">Standard Template ✏️</span>
                  </div>
                  <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:center;">
                    <span style="color:#4B5563;">Round Off Preference</span>
                    <span style="color:#111827; font-weight:500;">No Rounding ✏️</span>
                  </div>
                  <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:flex-start;">
                    <span style="color:#4B5563; padding-top:6px;">Customer Notes ⓘ</span>
                    <textarea id="zoho-sub-notes" style="width:100%; max-width:480px; height:60px; border:1px solid #D1D5DB; border-radius:4px; padding:0.5rem; font-size:0.84rem; color:#111827; outline:none; resize:vertical;">Thank you for the payment. You just made our day.</textarea>
                  </div>
                </div>
              </div>

            </div>
          </div>`;

const newCleanBlock = `          <!-- SECTION 3: SUBSCRIPTION TERM (EXACT USER SPECIFICATION) -->
          <div style="margin-top:2rem; padding-top:1.5rem; border-top:1px solid #E5E7EB;">
            <h2 style="font-size:1.15rem; font-weight:700; color:#111827; margin:0 0 1.25rem 0;">Subscription Term</h2>
            
            <div style="display:flex; flex-direction:column; gap:1.25rem; max-width:650px;">
              <!-- Subscription Number* -->
              <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:center;">
                <label style="font-size:0.88rem; font-weight:600; color:#DC2626;">Subscription Number*</label>
                <input type="text" id="zoho-sub-num" class="zoho-input-text" value="\${escapeHtml(currClient.subscription_id || 'SUB-01083')}" style="width:100%; border:1px solid #D1D5DB; border-radius:4px; padding:0.45rem 0.75rem;" />
              </div>

              <!-- Salesperson -->
              <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:center;">
                <label style="font-size:0.85rem; font-weight:600; color:#4B5563;">Salesperson</label>
                <select id="zoho-sub-sales" class="zoho-select-dropdown" style="width:100%;">
                  <option value="">Select a salesperson</option>
                  <option value="Rahul Sharma" \${currClient.sales_person === 'Rahul Sharma' ? 'selected' : ''}>Rahul Sharma</option>
                  <option value="Sukanya Nagireddy" \${currClient.sales_person === 'Sukanya Nagireddy' ? 'selected' : ''}>Sukanya Nagireddy</option>
                  <option value="Kiran Kumar" \${currClient.sales_person === 'Kiran Kumar' ? 'selected' : ''}>Kiran Kumar</option>
                  <option value="Pooja Reddy" \${currClient.sales_person === 'Pooja Reddy' ? 'selected' : ''}>Pooja Reddy</option>
                  <option value="Amit Patel" \${currClient.sales_person === 'Amit Patel' ? 'selected' : ''}>Amit Patel</option>
                  <option value="Sameer Khan" \${currClient.sales_person === 'Sameer Khan' ? 'selected' : ''}>Sameer Khan</option>
                </select>
              </div>
            </div>
          </div>`;

if (!appJs.includes(targetBlock)) {
  console.error('Error: targetBlock not found in app.js');
  process.exit(1);
}

appJs = appJs.replace(targetBlock, newCleanBlock);
console.log('✓ Successfully removed Reference Number, GST Number, and Payment Mode/Preferences section');

// Bump cache busting version to v=11.1 in index.html
indexHtml = indexHtml.replace(/app\.js\?v=[0-9.]+/g, 'app.js?v=11.1');
indexHtml = indexHtml.replace(/styles\.css\?v=[0-9.]+/g, 'styles.css?v=11.1');
console.log('✓ Bumped cache busting version to v=11.1');

// Convert back to CRLF if original was CRLF
if (isCRLF) {
  appJs = appJs.replace(/\n/g, '\r\n');
}

// Save files
fs.writeFileSync(appJsPath, appJs, 'utf8');
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');

console.log('ALL REMOVALS COMPLETED SUCCESSFULLY!');
