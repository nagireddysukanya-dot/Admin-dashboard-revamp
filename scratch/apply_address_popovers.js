const fs = require('fs');

let content = fs.readFileSync('frontend/js/app.js', 'utf8');

// Target address block in renderZohoSubscriptionView
const oldAddressBlock = `                <!-- Addresses Cards (Screenshot 1: Billing & Shipping Address) -->
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:2.5rem; max-width:620px; margin-top:1.25rem;">
                  <!-- Billing Address Card -->
                  <div style="font-size:0.85rem; color:#374151; line-height:1.45;">
                    <div style="display:flex; align-items:center; gap:6px; font-size:0.75rem; font-weight:700; color:#6B7280; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.4rem;">
                      <span>BILLING ADDRESS</span>
                      <span style="cursor:pointer; display:inline-flex; align-items:center;" title="Edit Billing Address"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></span>
                    </div>
                    <div style="font-weight:700; color:#111827;">\${escapeHtml(bAddress.company || currClient.company_name || 'feso')}</div>
                    <div>\${escapeHtml(bAddress.line1 || 'test')}</div>
                    <div>\${escapeHtml(bAddress.line2 || 'test')}</div>
                    <div>\${escapeHtml(bAddress.city || 'Hyderabad')} \${escapeHtml(bAddress.pin || '500034')}</div>
                    <div>\${escapeHtml(bAddress.country || 'India')}</div>
                  </div>

                  <!-- Shipping Address Card -->
                  <div style="font-size:0.85rem; color:#374151; line-height:1.45;">
                    <div style="display:flex; align-items:center; gap:6px; font-size:0.75rem; font-weight:700; color:#6B7280; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.4rem;">
                      <span>SHIPPING ADDRESS</span>
                      <span style="cursor:pointer; display:inline-flex; align-items:center;" title="Edit Shipping Address"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></span>
                    </div>
                    \${hasShipping ? \`
                      <div style="font-weight:700; color:#111827;">\${escapeHtml(sAddress.company || currClient.name)}</div>
                      <div>\${escapeHtml(sAddress.line1 || '')}</div>
                      <div>\${escapeHtml(sAddress.city || '')} \${escapeHtml(sAddress.pin || '')}</div>
                      <div>\${escapeHtml(sAddress.country || 'India')}</div>
                    \` : \`
                      <a href="javascript:void(0)" onclick="alert('Add Shipping Address')" style="color:#2563EB; text-decoration:none; font-size:0.84rem; font-weight:500;">New Address</a>
                    \`}
                  </div>
                </div>`;

const newAddressBlock = `                <!-- Addresses Cards (Screenshot 1: Billing & Shipping Address with Interactive Popovers) -->
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:2.5rem; max-width:620px; margin-top:1.25rem;">
                  <!-- Billing Address Card Container -->
                  <div class="zoho-addr-card-wrap" style="font-size:0.85rem; color:#374151; line-height:1.45; position:relative;">
                    <div style="display:flex; align-items:center; gap:6px; font-size:0.75rem; font-weight:700; color:#6B7280; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.4rem;">
                      <span>BILLING ADDRESS</span>
                      <span style="cursor:pointer; display:inline-flex; align-items:center;" title="Edit Billing Address" onclick="event.stopPropagation(); window.smatApp.toggleAddressPopover('billing', event)">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </span>
                    </div>
                    <div id="zoho-billing-display-addr">
                      <div style="font-weight:700; color:#111827;">\${escapeHtml(bAddress.company || currClient.company_name || 'feso')}</div>
                      <div>\${escapeHtml(bAddress.line1 || 'test')}</div>
                      <div>\${escapeHtml(bAddress.line2 || 'test')}</div>
                      <div>\${escapeHtml(bAddress.city || 'Hyderabad')} \${escapeHtml(bAddress.pin || '500034')}</div>
                      <div>\${escapeHtml(bAddress.country || 'India')}</div>
                    </div>

                    <!-- Dropdown Popover on Pencil Click (Exact Match to Screenshot 1) -->
                    <div id="zoho-addr-popover-billing" class="zoho-addr-popover" style="display:none; position:absolute; top:calc(100% + 4px); left:0; z-index:1100; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:8px; box-shadow:0 10px 25px rgba(0,0,0,0.12); padding:10px; width:290px;">
                      <!-- Highlighted Address Card with Pencil (Screenshot 1) -->
                      <div style="background:#EEF2F6; border-radius:6px; padding:12px 14px; position:relative; font-size:0.84rem; color:#374151; line-height:1.45; margin-bottom:10px;">
                        <button type="button" onclick="event.stopPropagation(); window.smatApp.openEditAddressModal('billing')" style="position:absolute; top:10px; right:10px; width:26px; height:26px; border-radius:4px; border:1px solid #D1D5DB; background:#FFFFFF; color:#2563EB; display:inline-flex; align-items:center; justify-content:center; cursor:pointer;" title="Edit address">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </button>
                        <div style="font-weight:700; color:#111827;">\${escapeHtml(bAddress.company || currClient.company_name || 'feso')}</div>
                        <div>\${escapeHtml(bAddress.line1 || 'test')}</div>
                        <div>\${escapeHtml(bAddress.line2 || 'test')}</div>
                        <div>\${escapeHtml(bAddress.city || 'Hyderabad')}</div>
                        <div>\${escapeHtml(bAddress.country || 'India')} , \${escapeHtml(bAddress.pin || '500034')}</div>
                      </div>
                      <!-- Add New Address Button (Screenshot 1) -->
                      <div style="padding:4px 6px;">
                        <button type="button" onclick="event.stopPropagation(); window.smatApp.openEditAddressModal('billing', true)" style="display:inline-flex; align-items:center; gap:6px; color:#2563EB; font-weight:600; font-size:0.84rem; background:none; border:none; cursor:pointer; padding:0;">
                          <span style="font-size:1.05rem; line-height:1;">⊕</span> New address
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Shipping Address Card Container -->
                  <div class="zoho-addr-card-wrap" style="font-size:0.85rem; color:#374151; line-height:1.45; position:relative;">
                    <div style="display:flex; align-items:center; gap:6px; font-size:0.75rem; font-weight:700; color:#6B7280; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.4rem;">
                      <span>SHIPPING ADDRESS</span>
                      <span style="cursor:pointer; display:inline-flex; align-items:center;" title="Edit Shipping Address" onclick="event.stopPropagation(); window.smatApp.toggleAddressPopover('shipping', event)">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </span>
                    </div>
                    <div id="zoho-shipping-display-addr">
                      \${hasShipping ? \`
                        <div style="font-weight:700; color:#111827;">\${escapeHtml(sAddress.company || currClient.name)}</div>
                        <div>\${escapeHtml(sAddress.line1 || '')}</div>
                        <div>\${escapeHtml(sAddress.line2 || '')}</div>
                        <div>\${escapeHtml(sAddress.city || '')} \${escapeHtml(sAddress.pin || '')}</div>
                        <div>\${escapeHtml(sAddress.country || 'India')}</div>
                      \` : \`
                        <a href="javascript:void(0)" onclick="event.stopPropagation(); window.smatApp.toggleAddressPopover('shipping', event)" style="color:#2563EB; text-decoration:none; font-size:0.84rem; font-weight:500;">New Address</a>
                      \`}
                    </div>

                    <!-- Dropdown Popover on Pencil Click (Exact Match to Screenshot 2) -->
                    <div id="zoho-addr-popover-shipping" class="zoho-addr-popover" style="display:none; position:absolute; top:calc(100% + 4px); left:0; z-index:1100; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:8px; box-shadow:0 10px 25px rgba(0,0,0,0.12); padding:10px; width:290px;">
                      <!-- Address Card (Screenshot 2: Bordered Card clickable to set address) -->
                      <div style="background:#FFFFFF; border:1px solid #E5E7EB; border-radius:6px; padding:12px 14px; position:relative; font-size:0.84rem; color:#374151; line-height:1.45; margin-bottom:10px; cursor:pointer;" onclick="window.smatApp.selectShippingAddress('billing')" title="Click to use this address for shipping">
                        <div style="font-weight:700; color:#111827;">\${escapeHtml(bAddress.company || currClient.company_name || 'feso')}</div>
                        <div>\${escapeHtml(bAddress.line1 || 'test')}</div>
                        <div>\${escapeHtml(bAddress.line2 || 'test')}</div>
                        <div>\${escapeHtml(bAddress.city || 'Hyderabad')}</div>
                        <div>\${escapeHtml(bAddress.country || 'India')} , \${escapeHtml(bAddress.pin || '500034')}</div>
                      </div>
                      <!-- Add New Address Button (Screenshot 2) -->
                      <div style="padding:4px 6px;">
                        <button type="button" onclick="event.stopPropagation(); window.smatApp.openEditAddressModal('shipping', true)" style="display:inline-flex; align-items:center; gap:6px; color:#2563EB; font-weight:600; font-size:0.84rem; background:none; border:none; cursor:pointer; padding:0;">
                          <span style="font-size:1.05rem; line-height:1;">⊕</span> New address
                        </button>
                      </div>
                    </div>
                  </div>
                </div>`;

// Address functions to insert
const newAddressFunctions = `  function toggleAddressPopover(type, evt) {
    if (evt) evt.stopPropagation();
    const popId = type === 'billing' ? 'zoho-addr-popover-billing' : 'zoho-addr-popover-shipping';
    const pop = document.getElementById(popId);
    if (!pop) return;
    const isCurrentlyOpen = pop.style.display === 'block';
    document.querySelectorAll('.zoho-addr-popover').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.zoho-sac-popover').forEach(p => p.style.display = 'none');
    if (!isCurrentlyOpen) {
      pop.style.display = 'block';
    }
  }

  function closeAddressPopovers() {
    document.querySelectorAll('.zoho-addr-popover').forEach(p => p.style.display = 'none');
  }

  function selectShippingAddress(source) {
    const currClient = clientsData.find(c => c.id === zohoSubscriptionClientId || c.id === Number(zohoSubscriptionClientId)) || clientsData[0];
    if (currClient && source === 'billing') {
      currClient.shipping_address = { ...(currClient.billing_address || { company: 'feso', line1: 'test', line2: 'test', city: 'Hyderabad', pin: '500034', country: 'India' }) };
    }
    closeAddressPopovers();
    const viewport = document.getElementById('route-viewport');
    if (viewport) renderZohoSubscriptionView(viewport);
  }

  function openEditAddressModal(type, isNew = false) {
    closeAddressPopovers();
    const currClient = clientsData.find(c => c.id === zohoSubscriptionClientId || c.id === Number(zohoSubscriptionClientId)) || clientsData[0];
    const addr = isNew ? {} : (type === 'billing' ? (currClient.billing_address || {}) : (currClient.shipping_address || currClient.billing_address || {}));
    
    const modal = document.getElementById('modal-container');
    if (!modal) return;
    modal.innerHTML = \`
      <div class="modal-overlay open" style="z-index:9999;">
        <div class="modal-box-card" style="max-width:480px; padding:1.5rem; border-top:4px solid #2563EB;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <div style="font-size:1.1rem; font-weight:700; color:#111827;">
              \${isNew ? '⊕ Add New ' : '✎ Edit '} \${type === 'billing' ? 'Billing' : 'Shipping'} Address
            </div>
            <button onclick="window.smatApp.closeModal()" style="background:none; border:none; font-size:1.2rem; cursor:pointer;">✕</button>
          </div>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <div>
              <label style="font-size:0.75rem; font-weight:600; color:#4B5563;">Company / Legal Name</label>
              <input type="text" id="addr-modal-company" class="filter-search-box" value="\${escapeHtml(addr.company || currClient.company_name || 'feso')}" style="width:100%; margin-top:3px;" />
            </div>
            <div>
              <label style="font-size:0.75rem; font-weight:600; color:#4B5563;">Address Line 1</label>
              <input type="text" id="addr-modal-line1" class="filter-search-box" value="\${escapeHtml(addr.line1 || 'test')}" style="width:100%; margin-top:3px;" />
            </div>
            <div>
              <label style="font-size:0.75rem; font-weight:600; color:#4B5563;">Address Line 2</label>
              <input type="text" id="addr-modal-line2" class="filter-search-box" value="\${escapeHtml(addr.line2 || 'test')}" style="width:100%; margin-top:3px;" />
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
              <div>
                <label style="font-size:0.75rem; font-weight:600; color:#4B5563;">City</label>
                <input type="text" id="addr-modal-city" class="filter-search-box" value="\${escapeHtml(addr.city || 'Hyderabad')}" style="width:100%; margin-top:3px;" />
              </div>
              <div>
                <label style="font-size:0.75rem; font-weight:600; color:#4B5563;">Postal / PIN Code</label>
                <input type="text" id="addr-modal-pin" class="filter-search-box" value="\${escapeHtml(addr.pin || '500034')}" style="width:100%; margin-top:3px;" />
              </div>
            </div>
            <div>
              <label style="font-size:0.75rem; font-weight:600; color:#4B5563;">Country</label>
              <input type="text" id="addr-modal-country" class="filter-search-box" value="\${escapeHtml(addr.country || 'India')}" style="width:100%; margin-top:3px;" />
            </div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.6rem; margin-top:1.25rem;">
            <button type="button" class="btn-action-secondary" onclick="window.smatApp.closeModal()">Cancel</button>
            <button type="button" class="btn-action-primary" style="background:#2563EB;" onclick="window.smatApp.saveAddressModalData('\${type}')">Save Address</button>
          </div>
        </div>
      </div>
    \`;
  }

  function saveAddressModalData(type) {
    const currClient = clientsData.find(c => c.id === zohoSubscriptionClientId || c.id === Number(zohoSubscriptionClientId)) || clientsData[0];
    const company = document.getElementById('addr-modal-company')?.value || '';
    const line1 = document.getElementById('addr-modal-line1')?.value || '';
    const line2 = document.getElementById('addr-modal-line2')?.value || '';
    const city = document.getElementById('addr-modal-city')?.value || '';
    const pin = document.getElementById('addr-modal-pin')?.value || '';
    const country = document.getElementById('addr-modal-country')?.value || 'India';

    const newObj = { company, line1, line2, city, pin, country };
    if (type === 'billing') {
      currClient.billing_address = newObj;
    } else {
      currClient.shipping_address = newObj;
    }

    closeModal();
    const viewport = document.getElementById('route-viewport');
    if (viewport) renderZohoSubscriptionView(viewport);
  }
`;

let normContent = content.replace(/\r\n/g, '\n');
const normOldAddressBlock = oldAddressBlock.replace(/\r\n/g, '\n');

if (normContent.includes(normOldAddressBlock)) {
  normContent = normContent.replace(normOldAddressBlock, newAddressBlock.replace(/\r\n/g, '\n'));
  
  // Insert functions before toggleSacPopover
  const funcAnchor = '  function toggleSacPopover(type, idx, evt) {';
  if (normContent.includes(funcAnchor)) {
    normContent = normContent.replace(funcAnchor, newAddressFunctions + '\n' + funcAnchor);
  }

  // Update outside click listener to also close address popovers
  const oldClickListener = `        if (!e.target.closest('.zoho-sac-badge-wrap')) {
          document.querySelectorAll('.zoho-sac-popover').forEach(p => p.style.display = 'none');
        }`;
  const newClickListener = `        if (!e.target.closest('.zoho-sac-badge-wrap')) {
          document.querySelectorAll('.zoho-sac-popover').forEach(p => p.style.display = 'none');
        }
        if (!e.target.closest('.zoho-addr-card-wrap')) {
          document.querySelectorAll('.zoho-addr-popover').forEach(p => p.style.display = 'none');
        }`;

  if (normContent.includes(oldClickListener)) {
    normContent = normContent.replace(oldClickListener, newClickListener);
  }

  // Expose on window.smatApp
  const smatAnchor = '    toggleSacPopover,';
  if (normContent.includes(smatAnchor)) {
    normContent = normContent.replace(smatAnchor, `    toggleAddressPopover,\n    closeAddressPopovers,\n    selectShippingAddress,\n    openEditAddressModal,\n    saveAddressModalData,\n` + smatAnchor);
  }

  fs.writeFileSync('frontend/js/app.js', normContent.replace(/\n/g, '\r\n'), 'utf8');
  console.log('Successfully added Billing and Shipping Address popovers matching Screenshots 1 & 2!');
} else {
  console.log('Could not find oldAddressBlock in app.js');
}
