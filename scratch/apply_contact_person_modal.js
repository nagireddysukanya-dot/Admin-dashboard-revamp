const fs = require('fs');

let content = fs.readFileSync('frontend/js/app.js', 'utf8');

// 1. Target E-MAIL TO row in renderZohoSubscriptionView
const oldEmailToRow = `            <!-- 2. E-MAIL TO & Direct Phone Details (Screenshot 1 & Teammate Note 1) -->
            <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:center;">
              <label style="font-size:0.85rem; font-weight:600; color:#4B5563;">
                E-MAIL TO
              </label>
              <div style="display:flex; align-items:center; gap:1.75rem; flex-wrap:wrap;">
                <button type="button" class="zoho-btn-new-contact" style="display:inline-flex; align-items:center; gap:5px; color:#2563EB; font-weight:600; font-size:0.84rem; background:none; border:none; cursor:pointer;">
                  <span style="font-size:1.1rem; line-height:1;">⊕</span> New Contact Person
                </button>
                <label style="display:inline-flex; align-items:center; gap:6px; font-size:0.85rem; color:#111827; cursor:pointer;">
                  <input type="checkbox" checked style="accent-color:#2563EB;" />
                  <span>\${escapeHtml(currClient.email)}</span>
                </label>
                <div style="display:inline-flex; align-items:center; gap:6px; font-size:0.84rem; color:#4B5563; background:#F8FAFC; border:1px solid #E2E8F0; padding:2px 8px; border-radius:4px;">
                  <span style="font-weight:600; color:#1E293B;">Phone:</span>
                  <span>\${escapeHtml(currClient.phone_number || '+91-9705736759')}</span>
                  <span style="color:#64748B; font-size:0.75rem;">(Country Code: +91)</span>
                </div>
              </div>
            </div>`;

const newEmailToRow = `            <!-- 2. E-MAIL TO & Direct Phone Details (Exact Match to Screenshot 2) -->
            <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:center;">
              <label style="font-size:0.85rem; font-weight:600; color:#4B5563;">
                E-MAIL TO
              </label>
              <div style="display:flex; align-items:center; gap:0.85rem; flex-wrap:wrap;">
                <!-- Dashed New Contact Person Button (Screenshot 2 Match) -->
                <button type="button" class="zoho-btn-new-contact" onclick="window.smatApp.openAddContactPersonModal()" style="display:inline-flex; align-items:center; gap:6px; color:#1E293B; font-weight:500; font-size:0.84rem; background:#FFFFFF; border:1px dashed #CBD5E1; border-radius:4px; padding:5px 12px; cursor:pointer;">
                  <span style="color:#2563EB; font-size:0.95rem;">⊕</span> New Contact Person
                </button>

                <!-- Customer Primary Email Checkbox Card (Screenshot 2 Match) -->
                <label style="display:inline-flex; align-items:center; gap:6px; font-size:0.85rem; color:#111827; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:4px; padding:5px 12px; cursor:pointer;">
                  <input type="checkbox" checked style="accent-color:#2563EB; width:15px; height:15px;" />
                  <span>\${escapeHtml(currClient.email)}</span>
                </label>

                <!-- Additional Contact Persons Added Dynamically -->
                \${(currClient.contact_persons || []).map(cp => \`
                  <label style="display:inline-flex; align-items:center; gap:6px; font-size:0.85rem; color:#111827; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:4px; padding:5px 12px; cursor:pointer;">
                    <input type="checkbox" checked style="accent-color:#2563EB; width:15px; height:15px;" />
                    <span>\${escapeHtml(cp.name ? cp.name + ' (' + cp.email + ')' : cp.email)}</span>
                  </label>
                \`).join('')}

                <div style="display:inline-flex; align-items:center; gap:6px; font-size:0.84rem; color:#4B5563; background:#F8FAFC; border:1px solid #E2E8F0; padding:4px 10px; border-radius:4px;">
                  <span style="font-weight:600; color:#1E293B;">Phone:</span>
                  <span>\${escapeHtml(currClient.phone_number || '+91-9705736759')}</span>
                  <span style="color:#64748B; font-size:0.75rem;">(Country Code: +91)</span>
                </div>
              </div>
            </div>`;

// 2. Add openAddContactPersonModal and saveContactPerson functions
const newContactFunctions = `  function openAddContactPersonModal() {
    const modal = document.getElementById('modal-container');
    if (!modal) return;

    modal.innerHTML = \`
      <div class="modal-overlay open" style="z-index:9999;">
        <div class="modal-box-card" style="max-width:850px; width:92%; padding:0; border-radius:8px; overflow:hidden; background:#FFFFFF; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);">
          <!-- Modal Header (Screenshot 1 Match) -->
          <div style="display:flex; justify-content:space-between; align-items:center; padding:1.25rem 1.75rem; border-bottom:1px solid #E5E7EB;">
            <h2 style="font-size:1.18rem; font-weight:600; color:#111827; margin:0;">Add Contact Person</h2>
            <button type="button" onclick="window.smatApp.closeModal()" style="width:26px; height:26px; border:1px solid #FCA5A5; background:#FEF2F2; color:#DC2626; border-radius:4px; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; font-size:12px; font-weight:700;">✕</button>
          </div>

          <!-- Modal Body Grid: Form Left, Profile Image Right (Screenshot 1 Match) -->
          <div style="display:grid; grid-template-columns:1fr 240px; gap:2.5rem; padding:1.75rem;">
            <!-- Left Form Fields -->
            <div style="display:flex; flex-direction:column; gap:1.15rem;">
              <!-- 1. Name -->
              <div style="display:grid; grid-template-columns:130px 1fr; gap:1rem; align-items:center;">
                <label style="font-size:0.86rem; color:#4B5563;">Name</label>
                <div style="display:grid; grid-template-columns:120px 1fr 1fr; gap:0.6rem;">
                  <select id="cp-salutation" class="filter-search-box" style="padding:0.45rem 0.6rem; font-size:0.84rem; cursor:pointer;">
                    <option value="" disabled selected hidden>Salutation ⌄</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Miss">Miss</option>
                    <option value="Dr.">Dr.</option>
                  </select>
                  <input type="text" id="cp-first-name" class="filter-search-box" placeholder="First Name" style="padding:0.45rem 0.6rem; font-size:0.84rem;" />
                  <input type="text" id="cp-last-name" class="filter-search-box" placeholder="Last Name" style="padding:0.45rem 0.6rem; font-size:0.84rem;" />
                </div>
              </div>

              <!-- 2. Email Address -->
              <div style="display:grid; grid-template-columns:130px 1fr; gap:1rem; align-items:center;">
                <label style="font-size:0.86rem; color:#4B5563;">Email Address</label>
                <input type="email" id="cp-email" class="filter-search-box" placeholder="" style="width:100%; padding:0.45rem 0.6rem; font-size:0.84rem;" />
              </div>

              <!-- 3. Phone -->
              <div style="display:grid; grid-template-columns:130px 1fr; gap:1rem; align-items:flex-start;">
                <label style="font-size:0.86rem; color:#4B5563; padding-top:6px;">Phone</label>
                <div style="display:flex; flex-direction:column; gap:0.65rem;">
                  <!-- Work Phone -->
                  <div style="display:flex; gap:0.5rem;">
                    <select id="cp-work-cc" class="filter-search-box" style="width:85px; padding:0.45rem 0.5rem; font-size:0.84rem; cursor:pointer;">
                      <option value="+91" selected>+91 ⌄</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+971">+971</option>
                    </select>
                    <input type="text" id="cp-work-phone" class="filter-search-box" placeholder="Work Phone" style="flex:1; padding:0.45rem 0.6rem; font-size:0.84rem;" />
                  </div>
                  <!-- Mobile -->
                  <div style="display:flex; gap:0.5rem;">
                    <select id="cp-mobile-cc" class="filter-search-box" style="width:85px; padding:0.45rem 0.5rem; font-size:0.84rem; cursor:pointer;">
                      <option value="+91" selected>+91 ⌄</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+971">+971</option>
                    </select>
                    <input type="text" id="cp-mobile" class="filter-search-box" placeholder="Mobile" style="flex:1; padding:0.45rem 0.6rem; font-size:0.84rem;" />
                  </div>
                </div>
              </div>

              <!-- 4. Skype Name/Number -->
              <div style="display:grid; grid-template-columns:130px 1fr; gap:1rem; align-items:center;">
                <label style="font-size:0.86rem; color:#4B5563;">Skype Name/Number</label>
                <div style="display:flex; align-items:center; border:1px solid #D1D5DB; border-radius:4px; overflow:hidden;">
                  <span style="background:#F9FAFB; border-right:1px solid #E5E7EB; padding:0.45rem 0.75rem; display:inline-flex; align-items:center; color:#0284C7; font-weight:700;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12.001 2c-5.523 0-10 4.477-10 10 0 1.258.232 2.464.655 3.576C2.247 16.732 2 18.006 2 19.333c0 1.473.573 2.857 1.615 3.899A5.474 5.474 0 0 0 7.514 24.85c1.112.423 2.318.655 3.576.655 5.523 0 10-4.477 10-10 0-1.258-.232-2.464-.655-3.576.409-1.156.655-2.43.655-3.757 0-1.473-.573-2.857-1.615-3.899A5.474 5.474 0 0 0 15.897 2.65C14.785 2.227 13.579 2 12.001 2z"/></svg>
                  </span>
                  <input type="text" id="cp-skype" placeholder="Skype Name/Number" style="flex:1; border:none; outline:none; padding:0.45rem 0.6rem; font-size:0.84rem; color:#111827;" />
                </div>
              </div>

              <!-- 5. Other Details -->
              <div style="display:grid; grid-template-columns:130px 1fr; gap:1rem; align-items:center;">
                <label style="font-size:0.86rem; color:#4B5563;">Other Details</label>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem;">
                  <input type="text" id="cp-designation" class="filter-search-box" placeholder="Designation" style="padding:0.45rem 0.6rem; font-size:0.84rem;" />
                  <input type="text" id="cp-department" class="filter-search-box" placeholder="Department" style="padding:0.45rem 0.6rem; font-size:0.84rem;" />
                </div>
              </div>
            </div>

            <!-- Right Profile Image Upload Card (Screenshot 1 Match) -->
            <div style="border:1.5px dashed #CBD5E1; border-radius:6px; padding:2rem 1.25rem; text-align:center; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#FAFAFA;">
              <div style="width:38px; height:38px; border-radius:50%; background:#2563EB; color:#FFFFFF; display:inline-flex; align-items:center; justify-content:center; margin-bottom:0.85rem;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
              </div>
              <div style="font-size:0.88rem; font-weight:700; color:#1E293B; margin-bottom:0.35rem;">Drag & Drop Profile Image</div>
              <div style="font-size:0.73rem; color:#64748B; margin-bottom:2px;">Supported Files: jpg, jpeg, png, gif, bmp</div>
              <div style="font-size:0.73rem; color:#64748B; margin-bottom:1rem;">Maximum File Size: 5MB</div>
              <label style="color:#2563EB; font-size:0.84rem; font-weight:600; cursor:pointer;">
                Upload File
                <input type="file" style="display:none;" accept="image/*" onchange="alert('Image chosen: ' + this.files[0]?.name)" />
              </label>
            </div>
          </div>

          <!-- Modal Footer (Screenshot 1 Match) -->
          <div style="display:flex; align-items:center; gap:0.75rem; padding:1.15rem 1.75rem; border-top:1px solid #E5E7EB; background:#FFFFFF;">
            <button type="button" onclick="window.smatApp.saveContactPerson()" style="background:#2563EB; color:#FFFFFF; border:none; border-radius:4px; padding:0.5rem 1.5rem; font-size:0.86rem; font-weight:600; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,0.05);">Save</button>
            <button type="button" onclick="window.smatApp.closeModal()" style="background:#F3F4F6; color:#374151; border:1px solid #E5E7EB; border-radius:4px; padding:0.5rem 1.25rem; font-size:0.86rem; cursor:pointer;">Cancel</button>
          </div>
        </div>
      </div>
    \`;
  }

  function saveContactPerson() {
    const salutation = document.getElementById('cp-salutation')?.value || '';
    const firstName = document.getElementById('cp-first-name')?.value?.trim() || '';
    const lastName = document.getElementById('cp-last-name')?.value?.trim() || '';
    const email = document.getElementById('cp-email')?.value?.trim() || '';
    const workCc = document.getElementById('cp-work-cc')?.value || '+91';
    const workPhone = document.getElementById('cp-work-phone')?.value?.trim() || '';
    const mobileCc = document.getElementById('cp-mobile-cc')?.value || '+91';
    const mobile = document.getElementById('cp-mobile')?.value?.trim() || '';
    const skype = document.getElementById('cp-skype')?.value?.trim() || '';
    const designation = document.getElementById('cp-designation')?.value?.trim() || '';
    const department = document.getElementById('cp-department')?.value?.trim() || '';

    if (!firstName && !email) {
      alert('Please enter at least First Name or Email Address.');
      return;
    }

    const fullName = [salutation, firstName, lastName].filter(Boolean).join(' ');
    const currClient = clientsData.find(c => c.id === zohoSubscriptionClientId || c.id === Number(zohoSubscriptionClientId)) || clientsData[0];
    if (currClient) {
      currClient.contact_persons = currClient.contact_persons || [];
      currClient.contact_persons.push({
        name: fullName || firstName || 'Contact Person',
        email: email || currClient.email,
        phone: mobile ? \`\${mobileCc}-\${mobile}\` : (workPhone ? \`\${workCc}-\${workPhone}\` : ''),
        designation,
        department,
        skype
      });
    }

    closeModal();
    const viewport = document.getElementById('route-viewport');
    if (viewport) renderZohoSubscriptionView(viewport);
  }
`;

let normContent = content.replace(/\r\n/g, '\n');
const normOldEmailTo = oldEmailToRow.replace(/\r\n/g, '\n');

if (normContent.includes(normOldEmailTo)) {
  normContent = normContent.replace(normOldEmailTo, newEmailToRow.replace(/\r\n/g, '\n'));

  // Insert contact functions right before toggleAddressPopover
  const addrAnchor = '  function toggleAddressPopover(type, evt) {';
  if (normContent.includes(addrAnchor)) {
    normContent = normContent.replace(addrAnchor, newContactFunctions + '\n' + addrAnchor);
  }

  // Expose on window.smatApp
  const smatAnchor = '    toggleAddressPopover,';
  if (normContent.includes(smatAnchor)) {
    normContent = normContent.replace(smatAnchor, `    openAddContactPersonModal,\n    saveContactPerson,\n` + smatAnchor);
  }

  fs.writeFileSync('frontend/js/app.js', normContent.replace(/\n/g, '\r\n'), 'utf8');
  console.log('Successfully added Add Contact Person modal matching Screenshot 1 & 2!');
} else {
  console.log('Could not find oldEmailToRow in app.js');
}
