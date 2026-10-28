const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');
const isCRLF = appJs.includes('\r\n');
let normJs = appJs.replace(/\r\n/g, '\n');

// Find start of Section 3 in openPlanModal
const sec3Marker = '<!-- SECTION 3: SUBSCRIPTION TERM (SCREENSHOT 3)';
const sec3Idx = normJs.indexOf(sec3Marker);
if (sec3Idx === -1) {
  console.error('sec3Marker not found in app.js!');
  process.exit(1);
}

// Find start of Section 5 in openPlanModal (after Section 4)
const sec5Marker = '<!-- SECTION 5: POINT 3 LIVE FINAL BILLING & TAX SUMMARY';
const sec5Idx = normJs.indexOf(sec5Marker, sec3Idx);
if (sec5Idx === -1) {
  console.error('sec5Marker not found in app.js!');
  process.exit(1);
}

// Extract block between start of sec3 comment box and start of sec5 comment box
// Find the preceding comment border `<!-- ========================` before sec3Marker
const boxStart = normJs.lastIndexOf('<!-- ======================================================== -->', sec3Idx);
const boxEnd = normJs.lastIndexOf('<!-- ======================================================== -->', sec5Idx);

if (boxStart === -1 || boxEnd === -1) {
  console.error('Comment boxes not found around Section 3 and 5!');
  process.exit(1);
}

const originalBlock = normJs.substring(boxStart, boxEnd);
console.log('Found original block (length ' + originalBlock.length + ' chars):');
console.log(originalBlock.substring(0, 200) + '...');

const newCleanSection = `<!-- ======================================================== -->
            <!-- SECTION 3: SUBSCRIPTION TERM (EXACT USER SPECIFICATION)  -->
            <!-- ======================================================== -->
            <div style="margin-top:2rem; padding-top:1.5rem; border-top:1px solid #E5E7EB;">
              <h3 style="font-size:1.15rem; font-weight:700; color:#111827; margin:0 0 1.25rem 0;">Subscription Term</h3>
              
              <div style="display:flex; flex-direction:column; gap:1.25rem; max-width:650px;">
                <!-- Subscription Number* -->
                <div style="display:grid; grid-template-columns:180px 1fr; gap:1.5rem; align-items:center;">
                  <label style="font-size:0.88rem; font-weight:600; color:#DC2626;">Subscription Number*</label>
                  <input type="text" id="modal-sub-number" class="filter-search-box" value="\${escapeHtml(currClientObj.subscription_id || 'SUB-01083')}" style="width:100%; border:1px solid #D1D5DB; border-radius:4px; padding:0.45rem 0.75rem;" />
                </div>

                <!-- Salesperson -->
                <div style="display:grid; grid-template-columns:180px 1fr; gap:1.5rem; align-items:center;">
                  <label style="font-size:0.85rem; font-weight:600; color:#4B5563;">Salesperson</label>
                  <select id="modal-sub-sales" class="custom-dropdown-trigger" style="width:100%;">
                    <option value="">Select a salesperson</option>
                    <option value="Rahul Sharma" \${currClientObj.sales_person === 'Rahul Sharma' ? 'selected' : ''}>Rahul Sharma</option>
                    <option value="Sukanya Nagireddy" \${currClientObj.sales_person === 'Sukanya Nagireddy' ? 'selected' : ''}>Sukanya Nagireddy</option>
                    <option value="Kiran Kumar" \${currClientObj.sales_person === 'Kiran Kumar' ? 'selected' : ''}>Kiran Kumar</option>
                    <option value="Pooja Reddy" \${currClientObj.sales_person === 'Pooja Reddy' ? 'selected' : ''}>Pooja Reddy</option>
                    <option value="Amit Patel" \${currClientObj.sales_person === 'Amit Patel' ? 'selected' : ''}>Amit Patel</option>
                    <option value="Sameer Khan" \${currClientObj.sales_person === 'Sameer Khan' ? 'selected' : ''}>Sameer Khan</option>
                  </select>
                </div>
              </div>
            </div>

            `;

normJs = normJs.substring(0, boxStart) + newCleanSection + normJs.substring(boxEnd);
fs.writeFileSync(appJsPath, isCRLF ? normJs.replace(/\n/g, '\r\n') : normJs, 'utf8');
console.log('✓ Successfully updated app.js!');

// Update scratch/apply_zoho_modal_revamp.js if present
const scratchPath = path.join(__dirname, 'apply_zoho_modal_revamp.js');
if (fs.existsSync(scratchPath)) {
  let scratchJs = fs.readFileSync(scratchPath, 'utf8');
  const scratchCRLF = scratchJs.includes('\r\n');
  let normScratch = scratchJs.replace(/\r\n/g, '\n');
  const sSec3Idx = normScratch.indexOf(sec3Marker);
  const sSec5Idx = normScratch.indexOf(sec5Marker, sSec3Idx);
  if (sSec3Idx !== -1 && sSec5Idx !== -1) {
    const sBoxStart = normScratch.lastIndexOf('<!-- ======================================================== -->', sSec3Idx);
    const sBoxEnd = normScratch.lastIndexOf('<!-- ======================================================== -->', sSec5Idx);
    if (sBoxStart !== -1 && sBoxEnd !== -1) {
      normScratch = normScratch.substring(0, sBoxStart) + newCleanSection + normScratch.substring(sBoxEnd);
      fs.writeFileSync(scratchPath, scratchCRLF ? normScratch.replace(/\n/g, '\r\n') : normScratch, 'utf8');
      console.log('✓ Successfully updated scratch/apply_zoho_modal_revamp.js!');
    }
  }
}

// Bump cache busting version to v=11.2
const htmlPath = path.join(__dirname, '..', 'frontend', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace(/app\.js\?v=[0-9.]+/g, 'app.js?v=11.2');
html = html.replace(/styles\.css\?v=[0-9.]+/g, 'styles.css?v=11.2');
fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✓ Bumped frontend/index.html cache busting version to v=11.2');
