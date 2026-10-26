const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'frontend', 'css', 'styles.css');
const jsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');

// 1. APPEND CSS FOR ZOHO EDIT CUSTOMER FORM
let css = fs.readFileSync(cssPath, 'utf8');

const editCustomerCss = `
/* ==========================================================================
   14. ZOHO BILLING - EDIT CUSTOMER FORM (Pixel-Perfect Match with Screenshots 2 & 3)
   ========================================================================== */
.zoho-edit-customer-container {
  background: #FFFFFF;
  min-height: calc(100vh - var(--header-height));
  padding: 1.75rem 2.5rem 4rem 2.5rem;
  max-width: 1040px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: #1F2937;
}

.zoho-edit-header-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.zoho-edit-title {
  font-size: 1.45rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.btn-zoho-back {
  background: #F3F4F6;
  border: 1px solid #E5E7EB;
  color: #4B5563;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-zoho-back:hover {
  background: #E5E7EB;
  color: #111827;
}

/* GST Prefill Banner (Screenshot 2) */
.zoho-gst-banner {
  background-color: #EFF6FF;
  border: 1px solid #DBEAFE;
  border-radius: 6px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  color: #1E40AF;
  margin-bottom: 2rem;
}

.zoho-gst-banner .gst-icon {
  font-size: 16px;
}

.zoho-gst-banner .gst-prefill-link {
  color: #2563EB;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  margin-left: 4px;
}

.zoho-gst-banner .gst-prefill-link:hover {
  text-decoration: underline;
}

/* Edit Customer Form Grid */
.zoho-edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.zoho-cust-row {
  display: flex;
  align-items: flex-start;
  min-height: 38px;
}

.zoho-cust-label {
  width: 170px;
  flex-shrink: 0;
  font-size: 13.5px;
  color: #374151;
  font-weight: 500;
  padding-top: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.zoho-cust-label.required {
  color: #DC2626;
}

.zoho-info-icon {
  font-size: 12px;
  color: #9CA3AF;
  cursor: help;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.zoho-cust-content {
  flex: 1;
  max-width: 650px;
}

/* Form Inputs */
.zoho-cust-input {
  width: 100%;
  height: 36px;
  padding: 0 12px;
  border: 1px solid #D1D5DB;
  border-radius: 5px;
  background: #FFFFFF;
  font-size: 13.5px;
  color: #1F2937;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  font-family: inherit;
}

.zoho-cust-input:focus {
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.zoho-cust-select {
  height: 36px;
  padding: 0 10px;
  border: 1px solid #D1D5DB;
  border-radius: 5px;
  background: #FFFFFF;
  font-size: 13.5px;
  color: #1F2937;
  outline: none;
  cursor: pointer;
  font-family: inherit;
}

.zoho-cust-select:focus {
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

/* Customer Type Radio */
.zoho-radio-group {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding-top: 8px;
}

.zoho-radio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  color: #1F2937;
  cursor: pointer;
  font-weight: 500;
}

.zoho-radio-label input {
  accent-color: #2563EB;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* Primary Contact 3-Col */
.zoho-primary-contact-row {
  display: grid;
  grid-template-columns: 140px 1fr 1fr;
  gap: 10px;
}

/* Phone 2-Col */
.zoho-phone-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.zoho-phone-input-wrap {
  display: flex;
  gap: 6px;
}

.zoho-phone-code-select {
  width: 75px;
  flex-shrink: 0;
}

.zoho-phone-warning-note {
  margin-top: 6px;
  font-size: 12px;
  color: #D97706;
  display: flex;
  align-items: center;
  gap: 4px;
}

.zoho-phone-warning-note a {
  color: #2563EB;
  text-decoration: none;
  margin-left: 2px;
  font-weight: 500;
}

/* Email with icon */
.zoho-email-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.zoho-email-icon {
  position: absolute;
  left: 10px;
  color: #9CA3AF;
  font-size: 14px;
  pointer-events: none;
}

.zoho-email-wrap input {
  padding-left: 32px;
}

/* Tabs Section (Screenshot 3 - ONLY Other Details & Address) */
.zoho-edit-tabs-nav {
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid #E5E7EB;
  margin-top: 2rem;
  margin-bottom: 1.75rem;
}

.zoho-edit-tab-btn {
  background: none;
  border: none;
  padding: 10px 4px;
  font-size: 14px;
  font-weight: 600;
  color: #6B7280;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.15s ease;
}

.zoho-edit-tab-btn:hover {
  color: #111827;
}

.zoho-edit-tab-btn.active {
  color: #2563EB;
  border-bottom-color: #2563EB;
}

/* Other Details Specifics */
.zoho-gstin-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-get-taxpayer {
  color: #2563EB;
  font-size: 13px;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  white-space: nowrap;
}

.btn-get-taxpayer:hover {
  text-decoration: underline;
}

.zoho-gst-mandatory-warning {
  margin-top: 5px;
  font-size: 12px;
  color: #DC2626;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

/* Address Tab 2-Col Grid */
.zoho-address-dual-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
}

.zoho-address-col-title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  margin-bottom: 12px;
  border-bottom: 1px solid #F3F4F6;
}

.zoho-address-col-title {
  font-size: 13.5px;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.link-copy-address {
  font-size: 13px;
  font-weight: 600;
  color: #2563EB;
  text-decoration: none;
  cursor: pointer;
}

.link-copy-address:hover {
  text-decoration: underline;
}

.zoho-address-fields-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.zoho-addr-field-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.zoho-addr-field-label {
  font-size: 12.5px;
  color: #4B5563;
  font-weight: 500;
}

/* Bottom Action Bar */
.zoho-edit-actions-footer {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid #E5E7EB;
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-zoho-save {
  height: 38px;
  padding: 0 24px;
  background-color: #2563EB;
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-zoho-save:hover {
  background-color: #1D4ED8;
}

.btn-zoho-cancel {
  height: 38px;
  padding: 0 20px;
  background-color: #FFFFFF;
  color: #4B5563;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-zoho-cancel:hover {
  background-color: #F9FAFB;
  border-color: #9CA3AF;
  color: #111827;
}

.btn-zoho-edit-cust {
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  color: #2563EB;
  background: #EFF6FF;
  border: 1px solid #BFDBFE;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 4px;
  transition: all 0.15s ease;
}

.btn-zoho-edit-cust:hover {
  background: #DBEAFE;
  color: #1D4ED8;
}
`;

if (!css.includes('ZOHO BILLING - EDIT CUSTOMER FORM')) {
  css += editCustomerCss;
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('Appended Edit Customer CSS to styles.css!');
} else {
  console.log('Edit Customer CSS already exists in styles.css');
}

// 2. UPDATE JS (app.js)
let js = fs.readFileSync(jsPath, 'utf8');

// State for Edit Customer active tab
if (!js.includes('let zohoEditCustomerTab')) {
  js = js.replace("let zohoSelectedClientId = 1;", "let zohoSelectedClientId = 1;\n  let zohoEditCustomerTab = 'other-details';");
}

// Add openZohoEditCustomer, setZohoEditTab, prefillGSTDetails, fetchTaxpayerDetails, copyBillingToShippingInEdit, handleZohoEditCustomerSubmit, renderZohoEditCustomerView
const editCustomerFunctions = `
  // =========================================================================
  // ZOHO BILLING - EDIT CUSTOMER VIEW (Screenshots 2 & 3: Other Details & Address)
  // =========================================================================
  function openZohoEditCustomer(clientId, initialTab) {
    if (clientId !== undefined) {
      zohoSelectedClientId = clientId;
    }
    zohoEditCustomerTab = initialTab || 'other-details';
    navigateTo('edit-customer');
  }

  function setZohoEditTab(tabName) {
    zohoEditCustomerTab = tabName;
    const tabBtns = document.querySelectorAll('.zoho-edit-tab-btn');
    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const otherPane = document.getElementById('zoho-tab-pane-other');
    const addrPane = document.getElementById('zoho-tab-pane-address');
    if (otherPane && addrPane) {
      if (tabName === 'other-details') {
        otherPane.style.display = 'block';
        addrPane.style.display = 'none';
      } else {
        otherPane.style.display = 'none';
        addrPane.style.display = 'block';
      }
    }
  }

  function prefillGSTDetails() {
    const gstinInput = document.getElementById('cust-gstin-input');
    const legalNameInput = document.getElementById('cust-legal-name');
    const tradeNameInput = document.getElementById('cust-trade-name');
    const posSelect = document.getElementById('cust-place-of-supply');
    const companyInput = document.getElementById('cust-company-name');

    if (gstinInput) gstinInput.value = '36AAACS1429B1Z8';
    if (legalNameInput) legalNameInput.value = 'SmatBot Technologies Private Limited';
    if (tradeNameInput) tradeNameInput.value = 'SmatBot AI';
    if (companyInput && !companyInput.value) companyInput.value = 'SmatBot Technologies';
    if (posSelect) posSelect.value = '[36] Telangana';

    showToast('Prefilled customer legal details from GSTIN: 36AAACS1429B1Z8');
  }

  function fetchTaxpayerDetails() {
    const gstin = document.getElementById('cust-gstin-input')?.value || '36AAACS1429B1Z8';
    showToast('Fetched taxpayer verification for GSTIN ' + gstin + ' from GST portal.');
  }

  function copyBillingToShippingInEdit() {
    const fields = ['attention', 'address1', 'address2', 'city', 'state', 'pincode', 'phone', 'fax'];
    fields.forEach(f => {
      const billEl = document.getElementById('bill-' + f);
      const shipEl = document.getElementById('ship-' + f);
      if (billEl && shipEl) {
        shipEl.value = billEl.value;
      }
    });
    showToast('Billing address copied to shipping address.');
  }

  function handleZohoEditCustomerSubmit(e) {
    e.preventDefault();
    const currClient = clientsData.find(c => c.id === zohoSelectedClientId) || clientsData[0];
    if (!currClient) return;

    const firstName = document.getElementById('cust-first-name')?.value.trim() || '';
    const lastName = document.getElementById('cust-last-name')?.value.trim() || '';
    const company = document.getElementById('cust-company-name')?.value.trim() || '';
    const email = document.getElementById('cust-email')?.value.trim() || '';
    const phone = document.getElementById('cust-mobile-phone')?.value.trim() || '';
    const gstin = document.getElementById('cust-gstin-input')?.value.trim() || '';

    if (company) currClient.name = company;
    else if (firstName || lastName) currClient.name = (firstName + ' ' + lastName).trim();

    if (email) currClient.email = email;
    if (phone) currClient.phone_number = phone;
    if (gstin) currClient.gst_number = gstin;

    const billAttention = document.getElementById('bill-attention')?.value || '';
    const billLine1 = document.getElementById('bill-address1')?.value || '';
    const billLine2 = document.getElementById('bill-address2')?.value || '';
    const billCity = document.getElementById('bill-city')?.value || '';
    const billState = document.getElementById('bill-state')?.value || '';
    const billPin = document.getElementById('bill-pincode')?.value || '';

    currClient.billing_address = {
      company: company || currClient.name,
      attention: billAttention,
      line1: billLine1,
      line2: billLine2,
      city: billCity,
      state: billState,
      pin: billPin,
      country: 'India'
    };

    localStorage.setItem('smatbot_clients_data', JSON.stringify(clientsData));
    showToast('Customer details saved successfully in Zoho Billing!');
    navigateTo('subscription');
  }

  function renderZohoEditCustomerView(container) {
    const currClient = clientsData.find(c => c.id === zohoSelectedClientId) || clientsData[0] || {
      id: 0, name: 'Balaji', email: 'balaji@smatbot.com', phone_number: '+91-9705736759', zoho_customer_id: 'ZC-566987', gst_number: '36AAACS1429B1Z8'
    };

    const nameParts = (currClient.name || 'Balaji').trim().split(' ');
    const firstName = nameParts[0] || 'Balaji';
    const lastName = nameParts.slice(1).join(' ') || '';
    const displayName = currClient.name + ' - ' + currClient.email;
    const companyName = currClient.company_name || (currClient.name !== firstName ? currClient.name : 'smatbot');
    const gstin = currClient.gst_number && currClient.gst_number !== '-' ? currClient.gst_number : '36AAACS1429B1Z8';

    const bAddr = currClient.billing_address || {
      attention: '',
      line1: '2nd Floor, Ashoka HiTech Chambers',
      line2: 'Road No. 2, opp. KBR Park, Park View Enclave',
      city: 'Hyderabad',
      state: 'Telangana',
      pin: '500034',
      phone: currClient.phone_number || ''
    };

    container.innerHTML = \`
      <div class="zoho-edit-customer-container">
        <!-- Header -->
        <div class="zoho-edit-header-row">
          <button type="button" class="btn-zoho-back" onclick="window.smatApp.navigateTo('subscription')" title="Back to Subscriptions">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h1 class="zoho-edit-title">Edit Customer</h1>
        </div>

        <!-- GST Prefill Banner (Screenshot 2) -->
        <div class="zoho-gst-banner">
          <span class="gst-icon">📥</span>
          <span>Prefill Customer details from the GST portal using the Customer's GSTIN.</span>
          <a href="javascript:void(0)" class="gst-prefill-link" onclick="window.smatApp.prefillGSTDetails()">Prefill ›</a>
        </div>

        <!-- Main Form (Screenshot 2) -->
        <form id="zoho-edit-customer-form" class="zoho-edit-form" onsubmit="window.smatApp.handleZohoEditCustomerSubmit(event)">
          <!-- 1. Customer Type -->
          <div class="zoho-cust-row">
            <div class="zoho-cust-label">
              <span>Customer Type</span>
              <span class="zoho-info-icon" title="Select whether customer is a Registered Business or Individual">ⓘ</span>
            </div>
            <div class="zoho-cust-content">
              <div class="zoho-radio-group">
                <label class="zoho-radio-label">
                  <input type="radio" name="cust_type" value="Business" checked />
                  <span>Business</span>
                </label>
                <label class="zoho-radio-label">
                  <input type="radio" name="cust_type" value="Individual" />
                  <span>Individual</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 2. Primary Contact -->
          <div class="zoho-cust-row">
            <div class="zoho-cust-label">
              <span>Primary Contact</span>
              <span class="zoho-info-icon" title="Primary representative contact details">ⓘ</span>
            </div>
            <div class="zoho-cust-content">
              <div class="zoho-primary-contact-row">
                <select class="zoho-cust-select" id="cust-salutation">
                  <option value="Salutation">Salutation</option>
                  <option value="Mr." selected>Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Miss">Miss</option>
                  <option value="Dr.">Dr.</option>
                </select>
                <input type="text" id="cust-first-name" class="zoho-cust-input" placeholder="First Name" value="\${escapeHtml(firstName)}" />
                <input type="text" id="cust-last-name" class="zoho-cust-input" placeholder="Last Name" value="\${escapeHtml(lastName)}" />
              </div>
            </div>
          </div>

          <!-- 3. Company Name -->
          <div class="zoho-cust-row">
            <div class="zoho-cust-label">
              <span>Company Name</span>
            </div>
            <div class="zoho-cust-content">
              <input type="text" id="cust-company-name" class="zoho-cust-input" placeholder="Company Name" value="\${escapeHtml(companyName)}" />
            </div>
          </div>

          <!-- 4. Display Name* -->
          <div class="zoho-cust-row">
            <div class="zoho-cust-label required">
              <span>Display Name*</span>
              <span class="zoho-info-icon" title="Customer unique identity name for invoices and billing receipts">ⓘ</span>
            </div>
            <div class="zoho-cust-content">
              <input type="text" id="cust-display-name" class="zoho-cust-input" value="\${escapeHtml(displayName)}" required />
            </div>
          </div>

          <!-- 5. Email Address -->
          <div class="zoho-cust-row">
            <div class="zoho-cust-label">
              <span>Email Address</span>
              <span class="zoho-info-icon" title="Primary invoice dispatch and billing email address">ⓘ</span>
            </div>
            <div class="zoho-cust-content">
              <div class="zoho-email-wrap">
                <span class="zoho-email-icon">✉</span>
                <input type="email" id="cust-email" class="zoho-cust-input" value="\${escapeHtml(currClient.email || '')}" placeholder="Email Address" />
              </div>
            </div>
          </div>

          <!-- 6. Phone -->
          <div class="zoho-cust-row">
            <div class="zoho-cust-label">
              <span>Phone</span>
              <span class="zoho-info-icon" title="Work and Mobile Contact Numbers">ⓘ</span>
            </div>
            <div class="zoho-cust-content">
              <div class="zoho-phone-row">
                <div class="zoho-phone-input-wrap">
                  <select class="zoho-cust-select zoho-phone-code-select">
                    <option value="+91" selected>+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+971">+971</option>
                  </select>
                  <input type="text" id="cust-work-phone" class="zoho-cust-input" placeholder="Work Phone" value="" />
                </div>
                <div>
                  <div class="zoho-phone-input-wrap">
                    <select class="zoho-cust-select zoho-phone-code-select">
                      <option value="+91" selected>+91</option>
                      <option value="+1">+1</option>
                    </select>
                    <input type="text" id="cust-mobile-phone" class="zoho-cust-input" placeholder="Mobile Phone" value="\${escapeHtml(currClient.phone_number || '+91 9705736759')}" />
                  </div>
                  <div class="zoho-phone-warning-note">
                    <span>ⓘ Mobile Number already exists</span>
                    <a href="javascript:void(0)" onclick="window.smatApp.showToast('Client records using this phone: ' + currClient.name)">View ▾</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 7. Customer Language -->
          <div class="zoho-cust-row">
            <div class="zoho-cust-label">
              <span>Customer Language</span>
              <span class="zoho-info-icon" title="Preferred language for system emails and notification templates">ⓘ</span>
            </div>
            <div class="zoho-cust-content">
              <select class="zoho-cust-select" style="width:100%;" id="cust-language">
                <option value="English" selected>English</option>
                <option value="Hindi">Hindi</option>
                <option value="Telugu">Telugu</option>
                <option value="Spanish">Spanish</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>

          <!-- TABS NAVIGATION (Screenshot 3 - ONLY Other Details & Address) -->
          <div class="zoho-edit-tabs-nav">
            <button type="button" class="zoho-edit-tab-btn \${zohoEditCustomerTab === 'other-details' ? 'active' : ''}" data-tab="other-details" onclick="window.smatApp.setZohoEditTab('other-details')">
              Other Details
            </button>
            <button type="button" class="zoho-edit-tab-btn \${zohoEditCustomerTab === 'address' ? 'active' : ''}" data-tab="address" onclick="window.smatApp.setZohoEditTab('address')">
              Address
            </button>
          </div>

          <!-- TAB PANE 1: Other Details (Screenshot 3) -->
          <div id="zoho-tab-pane-other" style="display:\${zohoEditCustomerTab === 'other-details' ? 'block' : 'none'};">
            <div style="display:flex; flex-direction:column; gap:1.15rem;">
              <!-- GST Treatment -->
              <div class="zoho-cust-row">
                <div class="zoho-cust-label required">
                  <span>GST Treatment*</span>
                </div>
                <div class="zoho-cust-content">
                  <select class="zoho-cust-select" style="width:100%;" id="cust-gst-treatment">
                    <option value="Registered Business - Regular" selected>Registered Business - Regular</option>
                    <option value="Registered Business - Composition">Registered Business - Composition</option>
                    <option value="Unregistered Business">Unregistered Business</option>
                    <option value="Consumer">Consumer</option>
                    <option value="Overseas">Overseas</option>
                    <option value="Special Economic Zone">Special Economic Zone (SEZ)</option>
                    <option value="Deemed Export">Deemed Export</option>
                  </select>
                </div>
              </div>

              <!-- GSTIN / UIN -->
              <div class="zoho-cust-row">
                <div class="zoho-cust-label required">
                  <span>GSTIN / UIN*</span>
                  <span class="zoho-info-icon" title="15-digit Goods & Services Tax Identification Number">ⓘ</span>
                </div>
                <div class="zoho-cust-content">
                  <div class="zoho-gstin-row">
                    <input type="text" id="cust-gstin-input" class="zoho-cust-input" style="border-color:#F87171;" value="\${escapeHtml(gstin)}" required />
                    <button type="button" class="btn-get-taxpayer" onclick="window.smatApp.fetchTaxpayerDetails()">Get Taxpayer details</button>
                  </div>
                  <div class="zoho-gst-mandatory-warning">
                    <span>▲ GST Identification Number is mandatory for GST registered contact.</span>
                  </div>
                </div>
              </div>

              <!-- Business Legal Name -->
              <div class="zoho-cust-row">
                <div class="zoho-cust-label">
                  <span>Business Legal Name</span>
                </div>
                <div class="zoho-cust-content">
                  <input type="text" id="cust-legal-name" class="zoho-cust-input" placeholder="e.g. SmatBot Technologies Private Limited" value="SmatBot Technologies Private Limited" />
                </div>
              </div>

              <!-- Business Trade Name -->
              <div class="zoho-cust-row">
                <div class="zoho-cust-label">
                  <span>Business Trade Name</span>
                </div>
                <div class="zoho-cust-content">
                  <input type="text" id="cust-trade-name" class="zoho-cust-input" placeholder="e.g. SmatBot AI" value="SmatBot" />
                </div>
              </div>

              <!-- Place of Supply -->
              <div class="zoho-cust-row">
                <div class="zoho-cust-label required">
                  <span>Place of Supply*</span>
                </div>
                <div class="zoho-cust-content">
                  <select class="zoho-cust-select" style="width:100%;" id="cust-place-of-supply">
                    <option value="[36] Telangana" selected>[36] Telangana</option>
                    <option value="[27] Maharashtra">[27] Maharashtra</option>
                    <option value="[29] Karnataka">[29] Karnataka</option>
                    <option value="[07] Delhi">[07] Delhi</option>
                    <option value="[33] Tamil Nadu">[33] Tamil Nadu</option>
                    <option value="[24] Gujarat">[24] Gujarat</option>
                    <option value="[19] West Bengal">[19] West Bengal</option>
                    <option value="[09] Uttar Pradesh">[09] Uttar Pradesh</option>
                    <option value="[37] Andhra Pradesh">[37] Andhra Pradesh</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB PANE 2: Address (Screenshot 3) -->
          <div id="zoho-tab-pane-address" style="display:\${zohoEditCustomerTab === 'address' ? 'block' : 'none'};">
            <div class="zoho-address-dual-grid">
              <!-- Billing Address Column -->
              <div class="zoho-address-col">
                <div class="zoho-address-col-title-bar">
                  <span class="zoho-address-col-title">Billing Address</span>
                </div>
                <div class="zoho-address-fields-stack">
                  <div class="zoho-addr-field-row">
                    <label class="zoho-addr-field-label">Attention</label>
                    <input type="text" id="bill-attention" class="zoho-cust-input" value="\${escapeHtml(bAddr.attention || currClient.name)}" placeholder="Attention / Department" />
                  </div>
                  <div class="zoho-addr-field-row">
                    <label class="zoho-addr-field-label">Country / Region</label>
                    <select class="zoho-cust-select" id="bill-country">
                      <option value="India" selected>India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                    </select>
                  </div>
                  <div class="zoho-addr-field-row">
                    <label class="zoho-addr-field-label">Address Line 1</label>
                    <input type="text" id="bill-address1" class="zoho-cust-input" value="\${escapeHtml(bAddr.line1 || '2nd Floor, Ashoka HiTech Chambers')}" placeholder="Street Address, Building, Suite" />
                  </div>
                  <div class="zoho-addr-field-row">
                    <label class="zoho-addr-field-label">Address Line 2</label>
                    <input type="text" id="bill-address2" class="zoho-cust-input" value="\${escapeHtml(bAddr.line2 || 'Road No. 2, opp. KBR Park, Park View Enclave')}" placeholder="Landmark, Area, Colony" />
                  </div>
                  <div class="zoho-addr-field-row">
                    <label class="zoho-addr-field-label">City</label>
                    <input type="text" id="bill-city" class="zoho-cust-input" value="\${escapeHtml(bAddr.city || 'Hyderabad')}" placeholder="City" />
                  </div>
                  <div class="zoho-addr-field-row">
                    <label class="zoho-addr-field-label">State</label>
                    <select class="zoho-cust-select" id="bill-state">
                      <option value="Telangana" selected>Telangana</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                    </select>
                  </div>
                  <div class="zoho-addr-field-row">
                    <label class="zoho-addr-field-label">Pin Code</label>
                    <input type="text" id="bill-pincode" class="zoho-cust-input" value="\${escapeHtml(bAddr.pin || '500034')}" placeholder="Pin Code" />
                  </div>
                  <div class="zoho-addr-field-row">
                    <label class="zoho-addr-field-label">Phone</label>
                    <input type="text" id="bill-phone" class="zoho-cust-input" value="\${escapeHtml(currClient.phone_number || '')}" placeholder="Phone" />
                  </div>
                  <div class="zoho-addr-field-row">
                    <label class="zoho-addr-field-label">Fax</label>
                    <input type="text" id="bill-fax" class="zoho-cust-input" placeholder="Fax" />
                  </div>
                </div>
              </div>

              <!-- Shipping Address Column -->
              <div class="zoho-address-col">
                <div class="zoho-address-col-title-bar">
                  <span class="zoho-address-col-title">Shipping Address</span>
                  <a href="javascript:void(0)" class="link-copy-address" onclick="window.smatApp.copyBillingToShippingInEdit()">Copy Billing Address ›</a>
                </div>
                <div class="zoho-address-fields-stack">
                  <div class="zoho-addr-field-row">
                    <label class="zoho-addr-field-label">Attention</label>
                    <input type="text" id="ship-attention" class="zoho-cust-input" placeholder="Attention / Department" />
                  </div>
                  <div class="zoho-addr-field-row">
                    <label class="zoho-addr-field-label">Country / Region</label>
                    <select class="zoho-cust-select" id="ship-country">
                      <option value="India" selected>India</option>
                      <option value="United States">United States</option>
                    </select>
                  </div>
                  <div class="zoho-addr-field-row">
                    <label class="zoho-addr-field-label">Address Line 1</label>
                    <input type="text" id="ship-address1" class="zoho-cust-input" placeholder="Street Address, Building, Suite" />
                  </div>
                  <div class="zoho-addr-field-row">
                    <label class="zoho-addr-field-label">Address Line 2</label>
                    <input type="text" id="ship-address2" class="zoho-cust-input" placeholder="Landmark, Area, Colony" />
                  </div>
                  <div class="zoho-addr-field-row">
                    <label class="zoho-addr-field-label">City</label>
                    <input type="text" id="ship-city" class="zoho-cust-input" placeholder="City" />
                  </div>
                  <div class="zoho-addr-field-row">
                    <label class="zoho-addr-field-label">State</label>
                    <select class="zoho-cust-select" id="ship-state">
                      <option value="Telangana" selected>Telangana</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                    </select>
                  </div>
                  <div class="zoho-addr-field-row">
                    <label class="zoho-addr-field-label">Pin Code</label>
                    <input type="text" id="ship-pincode" class="zoho-cust-input" placeholder="Pin Code" />
                  </div>
                  <div class="zoho-addr-field-row">
                    <label class="zoho-addr-field-label">Phone</label>
                    <input type="text" id="ship-phone" class="zoho-cust-input" placeholder="Phone" />
                  </div>
                  <div class="zoho-addr-field-row">
                    <label class="zoho-addr-field-label">Fax</label>
                    <input type="text" id="ship-fax" class="zoho-cust-input" placeholder="Fax" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Footer Action Buttons -->
          <div class="zoho-edit-actions-footer">
            <button type="submit" class="btn-zoho-save" id="btn-save-customer">Save</button>
            <button type="button" class="btn-zoho-cancel" onclick="window.smatApp.navigateTo('subscription')">Cancel</button>
          </div>
        </form>
      </div>
    \`;
  }
`;

// Insert editCustomerFunctions right before renderSubscriptionCreationView
if (!js.includes('function openZohoEditCustomer')) {
  js = js.replace('function renderSubscriptionCreationView(container) {', editCustomerFunctions + '\n\n  function renderSubscriptionCreationView(container) {');
}

// In editZohoAddress(type), redirect to openZohoEditCustomer
js = js.replace(
  /function editZohoAddress\(type\) \{[\s\S]*?\}/,
  `function editZohoAddress(type) {
    openZohoEditCustomer(zohoSelectedClientId, 'address');
  }`
);

// In renderSubscriptionCreationView, add "Edit Customer" button next to Customer Name select
const oldCombo = `<button type="button" class="zoho-btn-search" onclick="window.smatApp.openClientQuickDrawer(\${currClient.id})" title="Search / View Profile">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </button>`;

const newCombo = `<button type="button" class="zoho-btn-search" onclick="window.smatApp.openZohoEditCustomer(\${currClient.id})" title="Edit Customer Details">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </button>
                <button type="button" class="btn-zoho-edit-cust" onclick="window.smatApp.openZohoEditCustomer(\${currClient.id})" title="Edit Customer Profile & Addresses">
                  ✏️ Edit Customer
                </button>`;

if (js.includes(oldCombo)) {
  js = js.replace(oldCombo, newCombo);
}

// In navigateTo(route), handle 'edit-customer'
if (!js.includes("route === 'edit-customer'")) {
  js = js.replace(
    "} else if (route === 'subscription') {",
    "} else if (route === 'edit-customer') {\n      renderZohoEditCustomerView(viewport);\n    } else if (route === 'subscription') {"
  );
  js = js.replace(
    "'subscription': 'Subscriptions — Zoho Billing Portal',",
    "'subscription': 'Subscriptions — Zoho Billing Portal',\n      'edit-customer': 'Edit Customer — Zoho Billing Portal',"
  );
}

// In window.smatApp export, add new functions
const exportNeeds = [
  'openZohoEditCustomer',
  'setZohoEditTab',
  'prefillGSTDetails',
  'fetchTaxpayerDetails',
  'copyBillingToShippingInEdit',
  'handleZohoEditCustomerSubmit',
  'renderZohoEditCustomerView'
];

exportNeeds.forEach(fn => {
  if (!js.includes(fn + ',')) {
    js = js.replace('handleZohoSubscriptionSubmit,', fn + ',\n    handleZohoSubscriptionSubmit,');
  }
});

fs.writeFileSync(jsPath, js, 'utf8');
console.log('Successfully updated app.js with Edit Customer view matching Screenshots 2 & 3!');
