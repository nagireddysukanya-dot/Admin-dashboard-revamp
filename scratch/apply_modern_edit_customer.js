const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../frontend/js/app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

const startMarker = "  function renderZohoEditCustomerView(container) {";
const endMarker = "  function renderSubscriptionCreationView(container) {";

const startIndex = appContent.indexOf(startMarker);
const endIndex = appContent.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found!');
  process.exit(1);
}

const newFunction = `  function renderZohoEditCustomerView(container) {
    const currClient = clientsData.find(c => c.id === zohoSelectedClientId) || clientsData[0] || {
      id: 0, name: 'Balaji', email: 'balaji@smatbot.com', phone_number: '+91-9705736759', zoho_customer_id: 'ZC-566987', gst_number: '36AACCF6679F1ZD'
    };

    const nameParts = (currClient.name || 'Balaji').trim().split(' ');
    const firstName = nameParts[0] || 'Balaji';
    const lastName = nameParts.slice(1).join(' ') || '';
    const displayName = currClient.name + ' - ' + currClient.email;
    const companyName = currClient.company_name || (currClient.name !== firstName ? currClient.name : 'smatbot');
    const gstin = currClient.gst_number && currClient.gst_number !== '-' ? currClient.gst_number : '36AACCF6679F1ZD';
    const isDuplicate = checkPhoneDuplicates(currClient.phone_number);

    // Reset dropdown state on page load
    matchingRecordsDropdownOpen = false;

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
      <div class="modern-edit-customer-page zoho-reference-edit-customer-page">
        <!-- Top Breadcrumb & Header Bar -->
        <div class="modern-edit-header-bar zoho-edit-header-row">
          <div class="header-left-col">
            <button type="button" class="btn-modern-back btn-zoho-back" onclick="window.smatApp.navigateTo('subscriptions')" title="Back to Subscriptions">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to Subscriptions</span>
            </button>
            <div class="header-title-row">
              <h1 class="modern-page-title zoho-edit-title">Edit Customer</h1>
              <span class="badge-sync-live"><span class="pulse-indicator"></span> Zoho Billing Synced</span>
              <span class="badge-cust-chip">\${escapeHtml(currClient.zoho_customer_id || 'ZC-566987')}</span>
            </div>
            <p class="modern-header-sub">Configure customer billing identity, tax identification, and invoicing address records.</p>
          </div>
          <div class="header-right-col">
            <button type="button" class="btn-gst-quick-prefill" onclick="window.smatApp.prefillGSTDetails()">
              <span>⚡</span>
              <span>Prefill from GSTIN</span>
            </button>
          </div>
        </div>

        <!-- GST Quick Helper Banner -->
        <div class="modern-gst-banner-card zoho-gst-banner-row">
          <div class="gst-banner-left">
            <div class="gst-banner-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
            <div>
              <div class="gst-banner-heading">Automated GSTIN Verification</div>
              <div class="gst-banner-subtext">Prefill Customer details from the GST portal using the Customer's GSTIN.</div>
            </div>
          </div>
          <a href="javascript:void(0)" class="btn-gst-prefill-link gst-prefill-link" onclick="window.smatApp.prefillGSTDetails()">
            Prefill Details ›
          </a>
        </div>

        <!-- Main Form with Modular Cards -->
        <form id="zoho-edit-customer-form" class="modern-customer-form zoho-clean-edit-form" onsubmit="window.smatApp.handleZohoEditCustomerSubmit(event)">
          
          <!-- CARD 1: Customer Profile & Primary Contact -->
          <div class="modern-form-card">
            <div class="form-card-header">
              <div class="card-header-info">
                <div class="card-header-icon-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div>
                  <h2 class="card-section-title">Customer Identity & Contact</h2>
                  <p class="card-section-subtitle">Account classification, primary signatory, and contact details</p>
                </div>
              </div>
              <div class="card-header-actions">
                <!-- Segmented Customer Type Pill Control -->
                <div class="modern-segmented-pill-group zoho-radio-group">
                  <label class="segmented-pill-item zoho-radio-label active" id="seg-cust-business">
                    <input type="radio" name="cust_type" value="Business" checked onchange="document.getElementById('seg-cust-business').classList.add('active'); document.getElementById('seg-cust-indiv').classList.remove('active');" />
                    <span>🏢 Business</span>
                  </label>
                  <label class="segmented-pill-item zoho-radio-label" id="seg-cust-indiv">
                    <input type="radio" name="cust_type" value="Individual" onchange="document.getElementById('seg-cust-indiv').classList.add('active'); document.getElementById('seg-cust-business').classList.remove('active');" />
                    <span>👤 Individual</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="form-card-body">
              <!-- Primary Contact Person -->
              <div class="form-field-group zoho-form-row">
                <label class="modern-field-label zoho-row-label">
                  <span>Primary Contact</span>
                  <span class="info-glyph-chip zoho-info-glyph" title="Primary authorized contact person for billing">ⓘ</span>
                </label>
                <div class="modern-primary-contact-grid zoho-primary-contact-row">
                  <select class="modern-input-field modern-select zoho-input-select" id="cust-salutation">
                    <option value="Salutation">Salutation</option>
                    <option value="Mr." selected>Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Miss">Miss</option>
                    <option value="Dr.">Dr.</option>
                  </select>
                  <input type="text" id="cust-first-name" class="modern-input-field zoho-input-text" placeholder="First Name" value="\${escapeHtml(firstName)}" />
                  <input type="text" id="cust-last-name" class="modern-input-field zoho-input-text" placeholder="Last Name" value="\${escapeHtml(lastName)}" />
                </div>
              </div>

              <!-- Company Name & Display Name (2-Column Grid) -->
              <div class="modern-form-row-2col">
                <div class="form-field-group zoho-form-row">
                  <label class="modern-field-label zoho-row-label">
                    <span>Company Name</span>
                  </label>
                  <div class="input-wrapper-prefix">
                    <span class="input-prefix-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"></path><path d="M9 8h1"></path><path d="M9 12h1"></path><path d="M9 16h1"></path><path d="M14 8h1"></path><path d="M14 12h1"></path><path d="M14 16h1"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path></svg>
                    </span>
                    <input type="text" id="cust-company-name" class="modern-input-field has-prefix zoho-input-text" placeholder="Company Name" value="\${escapeHtml(companyName)}" />
                  </div>
                </div>

                <div class="form-field-group zoho-form-row">
                  <label class="modern-field-label zoho-row-label required">
                    <span>Display Name*</span>
                    <span class="info-glyph-chip zoho-info-glyph" title="Display name appears on all invoices and statements">ⓘ</span>
                  </label>
                  <select id="cust-display-name-select" class="modern-input-field modern-select zoho-input-select" onchange="window.smatApp.onZohoCustomerSelectChange(this.value)">
                    \${clientsData.map(c => \`
                      <option value="\${c.id}" \${c.id === currClient.id ? 'selected' : ''}>
                        \${escapeHtml(c.name)} - \${escapeHtml(c.email)}
                      </option>
                    \`).join('')}
                  </select>
                </div>
              </div>

              <!-- Email Address & Customer Language (2-Column Grid) -->
              <div class="modern-form-row-2col">
                <div class="form-field-group zoho-form-row">
                  <label class="modern-field-label zoho-row-label">
                    <span>Email Address</span>
                    <span class="info-glyph-chip zoho-info-glyph" title="Official invoice dispatch email address">ⓘ</span>
                  </label>
                  <div class="input-wrapper-prefix zoho-email-field-box">
                    <span class="input-prefix-icon email-prefix-icon">✉</span>
                    <input type="email" id="cust-email" class="modern-input-field has-prefix email-input zoho-input-text" value="\${escapeHtml(currClient.email || '')}" placeholder="Email Address" />
                  </div>
                </div>

                <div class="form-field-group zoho-form-row">
                  <label class="modern-field-label zoho-row-label">
                    <span>Customer Language</span>
                    <span class="info-glyph-chip zoho-info-glyph" title="Language preference for billing receipts & notification templates">ⓘ</span>
                  </label>
                  <select class="modern-input-field modern-select zoho-input-select" id="cust-language">
                    <option value="English" selected>English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Spanish">Spanish</option>
                    <option value="German">German</option>
                  </select>
                </div>
              </div>

              <!-- Phone & Duplicate Warning (Single Input with Floating Dropdown) -->
              <div class="form-field-group zoho-form-row phone-field-container-row phone-anchor-cell">
                <label class="modern-field-label zoho-row-label">
                  <span>Phone</span>
                  <span class="info-glyph-chip zoho-info-glyph" title="Work and mobile contact numbers">ⓘ</span>
                </label>
                <div class="modern-phone-input-row zoho-single-phone-input-row">
                  <select class="modern-input-field modern-select phone-code-select zoho-input-select" id="cust-phone-code">
                    <option value="+91" selected>+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+971">+971</option>
                  </select>
                  <div class="modern-phone-wrapper zoho-phone-input-inner-wrapper">
                    <input 
                      type="text" 
                      id="cust-phone" 
                      class="modern-input-field phone-input zoho-input-text \${isDuplicate ? 'has-warning-icon' : ''}" 
                      placeholder="Work Phone" 
                      value="\${escapeHtml(currClient.phone_number || '')}" 
                      oninput="window.smatApp.onPhoneInputChange(this.value)" 
                    />
                    <!-- Orange Warning Triangle inside input on right -->
                    <div id="phone-warning-triangle-icon" class="phone-input-warning-triangle" style="display:\${isDuplicate ? 'flex' : 'none'};" title="Phone number already exists in records">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Duplicate Warning Alert Line (Shown if Duplicate) -->
                <div id="phone-matching-warning-container" class="zoho-duplicate-phone-alert" style="display:\${isDuplicate ? 'flex' : 'none'};">
                  <span class="alert-orange-circle">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </span>
                  <span class="alert-muted-text">Mobile Number already exists</span>
                  <button type="button" class="btn-toggle-existing-records" onclick="window.smatApp.toggleMatchingRecordsDropdown()">
                    <span id="matching-records-toggle-label">View</span>
                    <span id="matching-records-toggle-arrow">▼</span>
                  </button>
                </div>

                <!-- Floating Matching Customer Records Card -->
                <div id="matching-customers-dropdown" class="matching-customers-card">
                  <div class="matching-card-header">
                    <div class="matching-card-title-row">
                      <span>Matching Customer Records</span>
                      <span class="badge-match-count">4 Matches</span>
                    </div>
                  </div>
                  <div class="matching-records-scroll-list">
                    <div class="matching-customer-item active" onclick="window.smatApp.selectMatchingCustomer(0)">
                      <div class="matching-avatar-circle active-avatar">D</div>
                      <div class="matching-customer-info">
                        <div class="matching-name-title">deepak - 21552 - deepaknew@gmail.com</div>
                        <div class="matching-meta-line">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                          <span>deepaknew@gmail.com</span>
                        </div>
                        <div class="matching-meta-line">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                          <span>+91 9705736759</span>
                        </div>
                      </div>
                    </div>

                    <div class="matching-customer-item" onclick="window.smatApp.selectMatchingCustomer(1)">
                      <div class="matching-avatar-circle">S</div>
                      <div class="matching-customer-info">
                        <div class="matching-name-title">smatbot old bots - 18905 - move@smatbot.com</div>
                        <div class="matching-meta-line">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                          <span>move@smatbot.com</span>
                        </div>
                        <div class="matching-meta-line">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                          <span>+91 9705736759</span>
                        </div>
                      </div>
                    </div>

                    <div class="matching-customer-item" onclick="window.smatApp.selectMatchingCustomer(2)">
                      <div class="matching-avatar-circle">S</div>
                      <div class="matching-customer-info">
                        <div class="matching-name-title">surya deepak pulaparthi - designermoneywow2@gmail.com</div>
                        <div class="matching-meta-line">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                          <span>designermoneywow2@gmail.com</span>
                        </div>
                        <div class="matching-meta-line">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                          <span>+91 9705736759</span>
                        </div>
                      </div>
                    </div>

                    <div class="matching-customer-item" onclick="window.smatApp.selectMatchingCustomer(3)">
                      <div class="matching-avatar-circle">S</div>
                      <div class="matching-customer-info">
                        <div class="matching-name-title">surya deepak pulaparthi - designermoneywow@gmail.com</div>
                        <div class="matching-meta-line">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                          <span>designermoneywow@gmail.com</span>
                        </div>
                        <div class="matching-meta-line">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                          <span>+91 9705736759</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- CARD 2: Tax Profile & Addresses -->
          <div class="modern-form-card">
            <div class="form-card-header tabs-header">
              <div class="modern-card-pill-tabs zoho-reference-tabs-bar">
                <button type="button" class="modern-tab-pill zoho-ref-tab-btn zoho-edit-tab-btn \${zohoEditCustomerTab === 'other-details' ? 'active' : ''}" data-tab="other-details" onclick="window.smatApp.setZohoEditTab('other-details')">
                  <span class="tab-icon">🏢</span>
                  <span>Other Details</span>
                </button>
                <button type="button" class="modern-tab-pill zoho-ref-tab-btn zoho-edit-tab-btn \${zohoEditCustomerTab === 'address' ? 'active' : ''}" data-tab="address" onclick="window.smatApp.setZohoEditTab('address')">
                  <span class="tab-icon">📍</span>
                  <span>Address</span>
                </button>
              </div>
            </div>

            <div class="form-card-body">
              <!-- TAB PANE 1: Other Details / Tax Information -->
              <div id="zoho-tab-pane-other" style="display:\${zohoEditCustomerTab === 'other-details' ? 'block' : 'none'};">
                <div class="modern-form-row-2col">
                  <!-- GST Treatment -->
                  <div class="form-field-group zoho-form-row">
                    <label class="modern-field-label zoho-row-label required">
                      <span>GST Treatment*</span>
                    </label>
                    <select class="modern-input-field modern-select zoho-input-select" id="cust-gst-treatment">
                      <option value="Registered Business - Regular" selected>Registered Business - Regular</option>
                      <option value="Registered Business - Composition">Registered Business - Composition</option>
                      <option value="Unregistered Business">Unregistered Business</option>
                      <option value="Consumer">Consumer</option>
                      <option value="Overseas">Overseas</option>
                      <option value="Special Economic Zone">Special Economic Zone (SEZ)</option>
                      <option value="Deemed Export">Deemed Export</option>
                    </select>
                  </div>

                  <!-- GSTIN / UIN -->
                  <div class="form-field-group zoho-form-row">
                    <label class="modern-field-label zoho-row-label required">
                      <span>GSTIN / UIN*</span>
                      <span class="info-glyph-chip zoho-info-glyph" title="15-digit Goods & Services Tax Identification Number">ⓘ</span>
                    </label>
                    <div class="modern-gstin-action-group zoho-gstin-input-group">
                      <input type="text" id="cust-gstin-input" class="modern-input-field gstin-input zoho-input-text" value="\${escapeHtml(gstin)}" required placeholder="e.g. 36AAACS1429B1Z8" />
                      <button type="button" class="btn-zoho-taxpayer-fetch btn-get-taxpayer" onclick="window.smatApp.fetchTaxpayerDetails()">
                        Get Taxpayer details
                      </button>
                    </div>
                    <div class="zoho-mandatory-warning-text">
                      <span>▲ GST Identification Number is mandatory for GST registered contact.</span>
                    </div>
                  </div>
                </div>

                <div class="modern-form-row-2col" style="margin-top: 1rem;">
                  <!-- Business Legal Name -->
                  <div class="form-field-group zoho-form-row">
                    <label class="modern-field-label zoho-row-label">
                      <span>Business Legal Name</span>
                    </label>
                    <input type="text" id="cust-legal-name" class="modern-input-field zoho-input-text" placeholder="e.g. SmatBot Technologies Private Limited" value="SmatBot Technologies Private Limited" />
                  </div>

                  <!-- Business Trade Name -->
                  <div class="form-field-group zoho-form-row">
                    <label class="modern-field-label zoho-row-label">
                      <span>Business Trade Name</span>
                    </label>
                    <input type="text" id="cust-trade-name" class="modern-input-field zoho-input-text" placeholder="e.g. SmatBot AI" value="SmatBot" />
                  </div>
                </div>

                <div class="form-field-group zoho-form-row" style="margin-top: 1rem; max-width: 49%;">
                  <!-- Place of Supply -->
                  <label class="modern-field-label zoho-row-label required">
                    <span>Place of Supply*</span>
                  </label>
                  <select class="modern-input-field modern-select zoho-input-select" id="cust-place-of-supply">
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

              <!-- TAB PANE 2: Address (Dual Columns) -->
              <div id="zoho-tab-pane-address" style="display:\${zohoEditCustomerTab === 'address' ? 'block' : 'none'};">
                <div class="modern-address-dual-grid zoho-address-dual-columns">
                  <!-- Billing Address Box -->
                  <div class="modern-address-box zoho-address-column">
                    <div class="address-box-header zoho-addr-col-header">
                      <div class="addr-box-title addr-title">
                        <span>Billing Address</span>
                        <span class="badge-addr-primary">Primary</span>
                      </div>
                    </div>
                    <div class="address-box-fields zoho-addr-fields-stack">
                      <div class="addr-item addr-field-item">
                        <label>Attention</label>
                        <input type="text" id="bill-attention" class="modern-input-field zoho-input-text" value="\${escapeHtml(bAddr.attention || currClient.name)}" placeholder="Attention / Department" />
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>Country / Region</label>
                        <select class="modern-input-field modern-select zoho-input-select" id="bill-country">
                          <option value="India" selected>India</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="United Arab Emirates">United Arab Emirates</option>
                        </select>
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>Address Line 1</label>
                        <input type="text" id="bill-address1" class="modern-input-field zoho-input-text" value="\${escapeHtml(bAddr.line1 || '2nd Floor, Ashoka HiTech Chambers')}" placeholder="Street Address, Building, Suite" />
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>Address Line 2</label>
                        <input type="text" id="bill-address2" class="modern-input-field zoho-input-text" value="\${escapeHtml(bAddr.line2 || 'Road No. 2, opp. KBR Park, Park View Enclave')}" placeholder="Landmark, Area, Colony" />
                      </div>
                      <div class="addr-row-2col">
                        <div class="addr-item addr-field-item">
                          <label>City</label>
                          <input type="text" id="bill-city" class="modern-input-field zoho-input-text" value="\${escapeHtml(bAddr.city || 'Hyderabad')}" placeholder="City" />
                        </div>
                        <div class="addr-item addr-field-item">
                          <label>State</label>
                          <select class="modern-input-field modern-select zoho-input-select" id="bill-state">
                            <option value="Telangana" selected>Telangana</option>
                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                          </select>
                        </div>
                      </div>
                      <div class="addr-row-2col">
                        <div class="addr-item addr-field-item">
                          <label>Pin Code</label>
                          <input type="text" id="bill-pincode" class="modern-input-field zoho-input-text" value="\${escapeHtml(bAddr.pin || '500034')}" placeholder="Pin Code" />
                        </div>
                        <div class="addr-item addr-field-item">
                          <label>Phone</label>
                          <input type="text" id="bill-phone" class="modern-input-field zoho-input-text" value="\${escapeHtml(currClient.phone_number || '')}" placeholder="Phone" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Shipping Address Box -->
                  <div class="modern-address-box zoho-address-column">
                    <div class="address-box-header zoho-addr-col-header">
                      <div class="addr-box-title addr-title">
                        <span>Shipping Address</span>
                      </div>
                      <button type="button" class="btn-copy-address-pill link-copy-address" onclick="window.smatApp.copyBillingToShippingInEdit()">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        <span>Copy Billing Address ›</span>
                      </button>
                    </div>
                    <div class="address-box-fields zoho-addr-fields-stack">
                      <div class="addr-item addr-field-item">
                        <label>Attention</label>
                        <input type="text" id="ship-attention" class="modern-input-field zoho-input-text" placeholder="Attention / Department" />
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>Country / Region</label>
                        <select class="modern-input-field modern-select zoho-input-select" id="ship-country">
                          <option value="India" selected>India</option>
                          <option value="United States">United States</option>
                        </select>
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>Address Line 1</label>
                        <input type="text" id="ship-address1" class="modern-input-field zoho-input-text" placeholder="Street Address, Building, Suite" />
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>Address Line 2</label>
                        <input type="text" id="ship-address2" class="modern-input-field zoho-input-text" placeholder="Landmark, Area, Colony" />
                      </div>
                      <div class="addr-row-2col">
                        <div class="addr-item addr-field-item">
                          <label>City</label>
                          <input type="text" id="ship-city" class="modern-input-field zoho-input-text" placeholder="City" />
                        </div>
                        <div class="addr-item addr-field-item">
                          <label>State</label>
                          <select class="modern-input-field modern-select zoho-input-select" id="ship-state">
                            <option value="Telangana" selected>Telangana</option>
                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Delhi">Delhi</option>
                          </select>
                        </div>
                      </div>
                      <div class="addr-row-2col">
                        <div class="addr-item addr-field-item">
                          <label>Pin Code</label>
                          <input type="text" id="ship-pincode" class="modern-input-field zoho-input-text" placeholder="Pin Code" />
                        </div>
                        <div class="addr-item addr-field-item">
                          <label>Phone</label>
                          <input type="text" id="ship-phone" class="modern-input-field zoho-input-text" placeholder="Phone" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Sticky Actions Bar -->
          <div class="modern-edit-footer-bar zoho-edit-footer-actions">
            <div class="footer-sync-notice">
              <span class="sync-dot"></span>
              <span>All changes are validated and synced with Zoho Billing API.</span>
            </div>
            <div class="footer-buttons-group">
              <button type="button" class="btn-modern-cancel btn-zoho-cancel-secondary" onclick="window.smatApp.navigateTo('subscriptions')">
                Cancel
              </button>
              <button type="submit" class="btn-modern-save btn-zoho-save-primary" id="btn-save-customer">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Save Customer Details</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    \`;
  }

  `;

appContent = appContent.slice(0, startIndex) + newFunction + appContent.slice(endIndex);
fs.writeFileSync(appPath, appContent, 'utf8');
console.log('Successfully updated renderZohoEditCustomerView in frontend/js/app.js!');
