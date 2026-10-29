const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../frontend/js/app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

// 1. Update setZohoEditTab to handle all 5 tabs and toggleMoreCustomerDetails
const setZohoEditTabSearch = `  function setZohoEditTab(tabName) {
    zohoEditCustomerTab = tabName;
    const tabBtns = document.querySelectorAll('.zoho-edit-tab-btn, .zoho-ref-tab-btn, .modern-tab-pill');
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
  }`;

const setZohoEditTabReplace = `  let moreCustomerDetailsOpen = false;
  function toggleMoreCustomerDetails() {
    moreCustomerDetailsOpen = !moreCustomerDetailsOpen;
    const morePane = document.getElementById('cust-more-details-container');
    const link = document.getElementById('toggle-more-details-btn');
    if (morePane) {
      morePane.style.display = moreCustomerDetailsOpen ? 'block' : 'none';
    }
    if (link) {
      link.innerHTML = moreCustomerDetailsOpen ? 'Less details ▲' : 'Add more details ▾';
    }
  }

  function handleDocumentUpload(input) {
    if (input && input.files && input.files.length > 0) {
      const names = Array.from(input.files).map(f => f.name).join(', ');
      showToast('Uploaded ' + input.files.length + ' file(s): ' + names);
      const listEl = document.getElementById('uploaded-docs-list');
      if (listEl) {
        listEl.innerHTML = Array.from(input.files).map(f => \`
          <span class="uploaded-doc-chip">📎 \${escapeHtml(f.name)} (\${Math.round(f.size/1024)} KB)</span>
        \`).join('');
      }
    }
  }

  function handleZohoSaveAndSubscribe(e) {
    if (e && e.preventDefault) e.preventDefault();
    handleZohoEditCustomerSubmit(e || { preventDefault: () => {} });
    showToast('Customer saved and subscription activated successfully in Zoho Billing!');
  }

  function setZohoEditTab(tabName) {
    zohoEditCustomerTab = tabName;
    const tabBtns = document.querySelectorAll('.zoho-edit-tab-btn, .zoho-ref-tab-btn, .modern-tab-pill');
    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const panes = {
      'other-details': document.getElementById('zoho-tab-pane-other'),
      'address': document.getElementById('zoho-tab-pane-address'),
      'contact-persons': document.getElementById('zoho-tab-pane-contacts'),
      'custom-fields': document.getElementById('zoho-tab-pane-custom'),
      'remarks': document.getElementById('zoho-tab-pane-remarks')
    };

    Object.keys(panes).forEach(k => {
      if (panes[k]) {
        panes[k].style.display = (k === tabName) ? 'block' : 'none';
      }
    });
  }`;

if (appContent.includes(setZohoEditTabSearch)) {
  appContent = appContent.replace(setZohoEditTabSearch, setZohoEditTabReplace);
  console.log('Successfully updated setZohoEditTab and added toggleMoreCustomerDetails!');
} else {
  console.log('setZohoEditTabSearch not matched exactly, checking markers...');
}

// 2. Replace renderZohoEditCustomerView
const startMarker = "  function renderZohoEditCustomerView(container) {";
const endMarker = "  function renderSubscriptionCreationView(container) {";

const startIndex = appContent.indexOf(startMarker);
const endIndex = appContent.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers for renderZohoEditCustomerView not found!');
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

    const pan = currClient.pan || '';
    const currency = currClient.currency || 'INR- Indian Rupee';
    const paymentTerms = currClient.payment_terms || 'Due on Receipt';
    const website = currClient.website || '';
    const department = currClient.department || '';
    const designation = currClient.designation || '';
    const social = currClient.social_links || {};
    const xTwitter = social.x || '';
    const skype = social.skype || '';
    const facebook = social.facebook || '';
    const remarks = currClient.remarks || '';
    const taxPref = currClient.tax_preference || 'Taxable';

    const bAddr = currClient.billing_address || {
      attention: '',
      line1: '2nd Floor, Ashoka HiTech Chambers',
      line2: 'Road No. 2, opp. KBR Park, Park View Enclave',
      city: 'Hyderabad',
      state: 'Hyderabad',
      pin: '500034',
      phone: currClient.phone_number || '',
      fax: ''
    };

    const sAddr = currClient.shipping_address || {
      attention: '',
      line1: '',
      line2: '',
      city: '',
      state: 'Hyderabad',
      pin: '',
      phone: '',
      fax: ''
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
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
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

          <!-- CARD 2: Tax Profile & Addresses (5 TABS matching Screenshot 1 & 2) -->
          <div class="modern-form-card">
            <div class="form-card-header tabs-header">
              <div class="modern-card-pill-tabs zoho-reference-tabs-bar">
                <button type="button" class="modern-tab-pill zoho-ref-tab-btn zoho-edit-tab-btn \${zohoEditCustomerTab === 'other-details' ? 'active' : ''}" data-tab="other-details" onclick="window.smatApp.setZohoEditTab('other-details')">
                  Other Details
                </button>
                <button type="button" class="modern-tab-pill zoho-ref-tab-btn zoho-edit-tab-btn \${zohoEditCustomerTab === 'address' ? 'active' : ''}" data-tab="address" onclick="window.smatApp.setZohoEditTab('address')">
                  Address
                </button>
                <button type="button" class="modern-tab-pill zoho-ref-tab-btn zoho-edit-tab-btn \${zohoEditCustomerTab === 'contact-persons' ? 'active' : ''}" data-tab="contact-persons" onclick="window.smatApp.setZohoEditTab('contact-persons')">
                  Contact Persons
                </button>
                <button type="button" class="modern-tab-pill zoho-ref-tab-btn zoho-edit-tab-btn \${zohoEditCustomerTab === 'custom-fields' ? 'active' : ''}" data-tab="custom-fields" onclick="window.smatApp.setZohoEditTab('custom-fields')">
                  Custom Fields*
                </button>
                <button type="button" class="modern-tab-pill zoho-ref-tab-btn zoho-edit-tab-btn \${zohoEditCustomerTab === 'remarks' ? 'active' : ''}" data-tab="remarks" onclick="window.smatApp.setZohoEditTab('remarks')">
                  Remarks
                </button>
              </div>
            </div>

            <div class="form-card-body">
              <!-- TAB PANE 1: Other Details / Tax Information (Screenshot 1 & Screenshot 4) -->
              <div id="zoho-tab-pane-other" style="display:\${zohoEditCustomerTab === 'other-details' ? 'block' : 'none'};">
                <!-- 1. GST Treatment* -->
                <div class="zoho-form-row form-field-group">
                  <div class="zoho-row-label required">
                    <span>GST Treatment*</span>
                  </div>
                  <div class="zoho-row-control">
                    <select class="modern-input-field modern-select zoho-input-select" id="cust-gst-treatment">
                      <option value="Consumer" selected>Consumer</option>
                      <option value="Registered Business - Regular">Registered Business - Regular</option>
                      <option value="Registered Business - Composition">Registered Business - Composition</option>
                      <option value="Unregistered Business">Unregistered Business</option>
                      <option value="Overseas">Overseas</option>
                      <option value="Special Economic Zone">Special Economic Zone (SEZ)</option>
                      <option value="Deemed Export">Deemed Export</option>
                    </select>
                  </div>
                </div>

                <!-- 2. Place of Supply* -->
                <div class="zoho-form-row form-field-group">
                  <div class="zoho-row-label required">
                    <span>Place of Supply*</span>
                  </div>
                  <div class="zoho-row-control">
                    <select class="modern-input-field modern-select zoho-input-select" id="cust-place-of-supply">
                      <option value="[TS] - Telangana" selected>[TS] - Telangana</option>
                      <option value="[AP] - Andhra Pradesh">[AP] - Andhra Pradesh</option>
                      <option value="[MH] - Maharashtra">[MH] - Maharashtra</option>
                      <option value="[KA] - Karnataka">[KA] - Karnataka</option>
                      <option value="[DL] - Delhi">[DL] - Delhi</option>
                      <option value="[TN] - Tamil Nadu">[TN] - Tamil Nadu</option>
                      <option value="[GJ] - Gujarat">[GJ] - Gujarat</option>
                      <option value="[WB] - West Bengal">[WB] - West Bengal</option>
                      <option value="[UP] - Uttar Pradesh">[UP] - Uttar Pradesh</option>
                    </select>
                  </div>
                </div>

                <!-- 3. PAN ⓘ (Screenshot 1) -->
                <div class="zoho-form-row form-field-group">
                  <div class="zoho-row-label">
                    <span>PAN</span>
                    <span class="info-glyph-chip zoho-info-glyph" title="Permanent Account Number">ⓘ</span>
                  </div>
                  <div class="zoho-row-control">
                    <input type="text" id="cust-pan" class="modern-input-field zoho-input-text" placeholder="e.g. ABCDE1234F" value="\${escapeHtml(pan)}" />
                  </div>
                </div>

                <!-- 4. Tax Preference* (Screenshot 1) -->
                <div class="zoho-form-row form-field-group">
                  <div class="zoho-row-label required">
                    <span>Tax Preference*</span>
                  </div>
                  <div class="zoho-row-control">
                    <div class="modern-radio-row">
                      <label class="radio-label-item">
                        <input type="radio" name="tax_preference" value="Taxable" \${taxPref === 'Taxable' ? 'checked' : ''} />
                        <span>Taxable</span>
                      </label>
                      <label class="radio-label-item">
                        <input type="radio" name="tax_preference" value="Tax Exempt" \${taxPref === 'Tax Exempt' ? 'checked' : ''} />
                        <span>Tax Exempt</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- 5. Currency (Screenshot 1) -->
                <div class="zoho-form-row form-field-group">
                  <div class="zoho-row-label">
                    <span>Currency</span>
                  </div>
                  <div class="zoho-row-control">
                    <select class="modern-input-field modern-select zoho-input-select" id="cust-currency">
                      <option value="INR- Indian Rupee" \${currency.includes('INR') ? 'selected' : ''}>INR- Indian Rupee</option>
                      <option value="USD - United States Dollar" \${currency.includes('USD') ? 'selected' : ''}>USD - United States Dollar</option>
                      <option value="EUR - Euro" \${currency.includes('EUR') ? 'selected' : ''}>EUR - Euro</option>
                      <option value="GBP - British Pound" \${currency.includes('GBP') ? 'selected' : ''}>GBP - British Pound</option>
                      <option value="AED - UAE Dirham" \${currency.includes('AED') ? 'selected' : ''}>AED - UAE Dirham</option>
                    </select>
                  </div>
                </div>

                <!-- 6. Payment Terms (Screenshot 1) -->
                <div class="zoho-form-row form-field-group">
                  <div class="zoho-row-label">
                    <span>Payment Terms</span>
                  </div>
                  <div class="zoho-row-control">
                    <select class="modern-input-field modern-select zoho-input-select" id="cust-payment-terms">
                      <option value="Due on Receipt" \${paymentTerms === 'Due on Receipt' ? 'selected' : ''}>Due on Receipt</option>
                      <option value="Net 15" \${paymentTerms === 'Net 15' ? 'selected' : ''}>Net 15</option>
                      <option value="Net 30" \${paymentTerms === 'Net 30' ? 'selected' : ''}>Net 30</option>
                      <option value="Net 45" \${paymentTerms === 'Net 45' ? 'selected' : ''}>Net 45</option>
                      <option value="Net 60" \${paymentTerms === 'Net 60' ? 'selected' : ''}>Net 60</option>
                    </select>
                  </div>
                </div>

                <!-- 7. Documents (Screenshot 1) -->
                <div class="zoho-form-row form-field-group">
                  <div class="zoho-row-label">
                    <span>Documents</span>
                  </div>
                  <div class="zoho-row-control">
                    <input type="file" id="cust-documents-input" multiple style="display:none;" onchange="window.smatApp.handleDocumentUpload(this)" />
                    <button type="button" class="btn-upload-documents" onclick="document.getElementById('cust-documents-input').click()">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                      <span>Upload File</span>
                      <span style="font-size:10px; margin-left:4px;">▾</span>
                    </button>
                    <div class="upload-helper-subtext">You can upload a maximum of 10 files, 10MB each</div>
                    <div id="uploaded-docs-list" class="uploaded-docs-list-box"></div>
                  </div>
                </div>

                <!-- GSTIN Details & Verification Helper -->
                <div class="zoho-form-row form-field-group" style="padding-top: 0.75rem; border-top: 1px dashed #E2E8F0;">
                  <div class="zoho-row-label">
                    <span>GSTIN / UIN</span>
                    <span class="info-glyph-chip zoho-info-glyph" title="15-digit Goods & Services Tax Identification Number">ⓘ</span>
                  </div>
                  <div class="zoho-row-control">
                    <div class="modern-gstin-action-group zoho-gstin-input-group">
                      <input type="text" id="cust-gstin-input" class="modern-input-field gstin-input zoho-input-text" value="\${escapeHtml(gstin)}" placeholder="e.g. 36AAACS1429B1Z8" />
                      <button type="button" class="btn-zoho-taxpayer-fetch btn-get-taxpayer" onclick="window.smatApp.fetchTaxpayerDetails()">
                        Get Taxpayer details
                      </button>
                    </div>
                    <div class="zoho-mandatory-warning-text" style="margin-top:4px;">
                      <span>▲ GST Identification Number is mandatory for GST registered contact.</span>
                    </div>
                  </div>
                </div>

                <!-- ADD MORE DETAILS TOGGLE LINK (Screenshot 1 & 4) -->
                <div class="more-details-toggle-row" style="margin-top: 1.25rem;">
                  <a href="javascript:void(0)" class="link-add-more-details" id="toggle-more-details-btn" onclick="window.smatApp.toggleMoreCustomerDetails()">
                    \${moreCustomerDetailsOpen ? 'Less details ▲' : 'Add more details ▾'}
                  </a>
                </div>

                <!-- EXPANDABLE EXTRA FIELDS CONTAINER (Screenshot 4) -->
                <div id="cust-more-details-container" class="more-details-expandable-box" style="display:\${moreCustomerDetailsOpen ? 'block' : 'none'}; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #F1F5F9;">
                  <!-- Website URL (Screenshot 4) -->
                  <div class="zoho-form-row form-field-group">
                    <div class="zoho-row-label">
                      <span>Website URL</span>
                    </div>
                    <div class="zoho-row-control">
                      <div class="input-wrapper-prefix">
                        <span class="input-prefix-icon">🌐</span>
                        <input type="text" id="cust-website" class="modern-input-field has-prefix zoho-input-text" placeholder="ex: www.zylker.com" value="\${escapeHtml(website)}" />
                      </div>
                    </div>
                  </div>

                  <!-- Department (Screenshot 4) -->
                  <div class="zoho-form-row form-field-group">
                    <div class="zoho-row-label">
                      <span>Department</span>
                    </div>
                    <div class="zoho-row-control">
                      <input type="text" id="cust-department" class="modern-input-field zoho-input-text" placeholder="Department" value="\${escapeHtml(department)}" />
                    </div>
                  </div>

                  <!-- Designation (Screenshot 4) -->
                  <div class="zoho-form-row form-field-group">
                    <div class="zoho-row-label">
                      <span>Designation</span>
                    </div>
                    <div class="zoho-row-control">
                      <input type="text" id="cust-designation" class="modern-input-field zoho-input-text" placeholder="Designation" value="\${escapeHtml(designation)}" />
                    </div>
                  </div>

                  <!-- X (Twitter) (Screenshot 4) -->
                  <div class="zoho-form-row form-field-group">
                    <div class="zoho-row-label">
                      <span>X</span>
                    </div>
                    <div class="zoho-row-control">
                      <div class="input-wrapper-prefix">
                        <span class="input-prefix-icon" style="font-weight:700;">𝕏</span>
                        <input type="text" id="cust-x-twitter" class="modern-input-field has-prefix zoho-input-text" placeholder="Username" value="\${escapeHtml(xTwitter)}" />
                      </div>
                      <div class="field-sub-helper-url">https://x.com/</div>
                    </div>
                  </div>

                  <!-- Skype Name/Number (Screenshot 4) -->
                  <div class="zoho-form-row form-field-group">
                    <div class="zoho-row-label">
                      <span>Skype Name/Number</span>
                    </div>
                    <div class="zoho-row-control">
                      <div class="input-wrapper-prefix">
                        <span class="input-prefix-icon" style="color:#00AFF0; font-weight:700;">Ⓢ</span>
                        <input type="text" id="cust-skype" class="modern-input-field has-prefix zoho-input-text" placeholder="Skype ID or Number" value="\${escapeHtml(skype)}" />
                      </div>
                    </div>
                  </div>

                  <!-- Facebook (Screenshot 4) -->
                  <div class="zoho-form-row form-field-group">
                    <div class="zoho-row-label">
                      <span>Facebook</span>
                    </div>
                    <div class="zoho-row-control">
                      <div class="input-wrapper-prefix">
                        <span class="input-prefix-icon" style="color:#1877F2; font-weight:700;">ⓕ</span>
                        <input type="text" id="cust-facebook" class="modern-input-field has-prefix zoho-input-text" placeholder="Profile or Page name" value="\${escapeHtml(facebook)}" />
                      </div>
                      <div class="field-sub-helper-url">http://www.facebook.com/</div>
                    </div>
                  </div>

                  <!-- Legal Name & Trade Name in More Details -->
                  <div class="modern-form-row-2col" style="margin-top: 1rem;">
                    <div class="zoho-form-row form-field-group">
                      <div class="zoho-row-label">
                        <span>Business Legal Name</span>
                      </div>
                      <div class="zoho-row-control">
                        <input type="text" id="cust-legal-name" class="modern-input-field zoho-input-text" placeholder="e.g. SmatBot Technologies Private Limited" value="\${escapeHtml(currClient.legal_name || 'SmatBot Technologies Private Limited')}" />
                      </div>
                    </div>

                    <div class="zoho-form-row form-field-group">
                      <div class="zoho-row-label">
                        <span>Business Trade Name</span>
                      </div>
                      <div class="zoho-row-control">
                        <input type="text" id="cust-trade-name" class="modern-input-field zoho-input-text" placeholder="e.g. SmatBot" value="\${escapeHtml(currClient.trade_name || 'SmatBot')}" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- TAB PANE 2: Address (Screenshot 2 & Screenshot 3) -->
              <div id="zoho-tab-pane-address" style="display:\${zohoEditCustomerTab === 'address' ? 'block' : 'none'};">
                <div class="modern-address-dual-grid zoho-address-dual-columns">
                  <!-- Billing Address Box -->
                  <div class="modern-address-box zoho-address-column">
                    <div class="address-box-header zoho-addr-col-header">
                      <div class="addr-box-title addr-title">
                        <span>Billing Address</span>
                      </div>
                    </div>
                    <div class="address-box-fields zoho-addr-fields-stack">
                      <div class="addr-item addr-field-item">
                        <label>Attention</label>
                        <input type="text" id="bill-attention" class="modern-input-field zoho-input-text" value="\${escapeHtml(bAddr.attention || currClient.name)}" placeholder="Attention" />
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>Country/Region</label>
                        <div class="input-select-with-clear">
                          <select class="modern-input-field modern-select zoho-input-select" id="bill-country">
                            <option value="India" selected>India</option>
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="United Arab Emirates">United Arab Emirates</option>
                          </select>
                        </div>
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>Address</label>
                        <textarea id="bill-address1" class="modern-input-field modern-textarea zoho-input-text" rows="2" placeholder="Address line 1">\${escapeHtml(bAddr.line1 || '2nd Floor, Ashoka HiTech Chambers')}</textarea>
                        <textarea id="bill-address2" class="modern-input-field modern-textarea zoho-input-text" rows="2" style="margin-top:6px;" placeholder="Address line 2">\${escapeHtml(bAddr.line2 || 'Road No. 2, opp. KBR Park, Park View Enclave')}</textarea>
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>City</label>
                        <input type="text" id="bill-city" class="modern-input-field zoho-input-text" value="\${escapeHtml(bAddr.city || 'Hyderabad')}" placeholder="City" />
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>State</label>
                        <select class="modern-input-field modern-select zoho-input-select" id="bill-state">
                          <option value="Hyderabad" selected>Hyderabad</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                        </select>
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>Pin Code</label>
                        <input type="text" id="bill-pincode" class="modern-input-field zoho-input-text" value="\${escapeHtml(bAddr.pin || '500034')}" placeholder="Pin Code" />
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>Phone</label>
                        <div class="modern-phone-input-row" style="max-width:100%;">
                          <select class="modern-input-field modern-select phone-code-select" style="width: 85px;">
                            <option value="+91" selected>+91</option>
                            <option value="+1">+1</option>
                          </select>
                          <input type="text" id="bill-phone" class="modern-input-field zoho-input-text" value="\${escapeHtml(bAddr.phone || currClient.phone_number || '')}" placeholder="Phone" />
                        </div>
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>Fax Number</label>
                        <input type="text" id="bill-fax" class="modern-input-field zoho-input-text" value="\${escapeHtml(bAddr.fax || '')}" placeholder="Fax Number" />
                      </div>
                    </div>
                  </div>

                  <!-- Shipping Address Box (Screenshot 2: Shipping Address ( ⬇ Copy billing address )) -->
                  <div class="modern-address-box zoho-address-column">
                    <div class="address-box-header zoho-addr-col-header">
                      <div class="addr-box-title addr-title">
                        <span>Shipping Address</span>
                        <span style="font-weight:400; font-size:12.5px; color:#64748B;">(</span>
                        <a href="javascript:void(0)" class="link-copy-billing-inline link-copy-address" onclick="window.smatApp.copyBillingToShippingInEdit()">
                          ⬇ Copy billing address
                        </a>
                        <span style="font-weight:400; font-size:12.5px; color:#64748B;">)</span>
                      </div>
                    </div>
                    <div class="address-box-fields zoho-addr-fields-stack">
                      <div class="addr-item addr-field-item">
                        <label>Attention</label>
                        <input type="text" id="ship-attention" class="modern-input-field zoho-input-text" value="\${escapeHtml(sAddr.attention || '')}" placeholder="Attention" />
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>Country/Region</label>
                        <div class="input-select-with-clear">
                          <select class="modern-input-field modern-select zoho-input-select" id="ship-country">
                            <option value="India" selected>India</option>
                            <option value="United States">United States</option>
                          </select>
                        </div>
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>Address</label>
                        <textarea id="ship-address1" class="modern-input-field modern-textarea zoho-input-text" rows="2" placeholder="Address line 1">\${escapeHtml(sAddr.line1 || '')}</textarea>
                        <textarea id="ship-address2" class="modern-input-field modern-textarea zoho-input-text" rows="2" style="margin-top:6px;" placeholder="Address line 2">\${escapeHtml(sAddr.line2 || '')}</textarea>
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>City</label>
                        <input type="text" id="ship-city" class="modern-input-field zoho-input-text" value="\${escapeHtml(sAddr.city || '')}" placeholder="City" />
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>State</label>
                        <select class="modern-input-field modern-select zoho-input-select" id="ship-state">
                          <option value="Hyderabad" selected>Hyderabad</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Delhi">Delhi</option>
                        </select>
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>Pin Code</label>
                        <input type="text" id="ship-pincode" class="modern-input-field zoho-input-text" value="\${escapeHtml(sAddr.pin || '')}" placeholder="Pin Code" />
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>Phone</label>
                        <div class="modern-phone-input-row" style="max-width:100%;">
                          <select class="modern-input-field modern-select phone-code-select" style="width: 85px;">
                            <option value="+91" selected>+91</option>
                            <option value="+1">+1</option>
                          </select>
                          <input type="text" id="ship-phone" class="modern-input-field zoho-input-text" value="\${escapeHtml(sAddr.phone || '')}" placeholder="Phone" />
                        </div>
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>Fax Number</label>
                        <input type="text" id="ship-fax" class="modern-input-field zoho-input-text" value="\${escapeHtml(sAddr.fax || '')}" placeholder="Fax Number" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Blue Future Transaction Warning Callout (Screenshot 3) -->
                <div class="address-future-callout">
                  <span class="info-circle-icon">ℹ</span>
                  <div>
                    <strong>This address will apply only to future transactions.</strong><br>
                    <span>To update for existing transactions, select them in the respective module and update the address using <strong>Bulk Update</strong>. <a href="javascript:void(0)" class="callout-link">Learn More</a></span>
                  </div>
                </div>

                <!-- Amber Address Notes (Screenshot 3) -->
                <div class="address-notes-callout">
                  <strong>Note:</strong>
                  <ul style="margin: 4px 0 0 18px; padding: 0;">
                    <li>Add and manage additional addresses from this Customers details section.</li>
                    <li>You can customise how customers' addresses are displayed in transaction PDFs. To do this, go to Settings &gt; Preferences &gt; Customers, and navigate to the Address Format sections.</li>
                  </ul>
                </div>
              </div>

              <!-- TAB PANE 3: Contact Persons -->
              <div id="zoho-tab-pane-contacts" style="display:\${zohoEditCustomerTab === 'contact-persons' ? 'block' : 'none'};">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                  <h3 style="font-size:14px; font-weight:700; color:#0F172A; margin:0;">Associated Contact Persons</h3>
                  <button type="button" class="btn-upload-documents" onclick="window.smatApp.showToast('Add Contact Person modal opened')">
                    + Add Contact Person
                  </button>
                </div>
                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:1.25rem;">
                  <div style="display:flex; align-items:center; gap:12px;">
                    <div class="matching-avatar-circle" style="background:#2563EB; color:#FFF;">\${escapeHtml(firstName.charAt(0) || 'C')}</div>
                    <div>
                      <div style="font-weight:600; font-size:13.5px; color:#0F172A;">\${escapeHtml(firstName)} \${escapeHtml(lastName)} (Primary Authorized)</div>
                      <div style="font-size:12px; color:#64748B;">\${escapeHtml(currClient.email || '')} • \${escapeHtml(currClient.phone_number || '')}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- TAB PANE 4: Custom Fields* -->
              <div id="zoho-tab-pane-custom" style="display:\${zohoEditCustomerTab === 'custom-fields' ? 'block' : 'none'};">
                <div class="modern-form-row-2col">
                  <div class="zoho-form-row form-field-group">
                    <div class="zoho-row-label">
                      <span>Client Portal Access</span>
                    </div>
                    <div class="zoho-row-control">
                      <select class="modern-input-field modern-select zoho-input-select">
                        <option value="Enabled" selected>Enabled</option>
                        <option value="Disabled">Disabled</option>
                      </select>
                    </div>
                  </div>
                  <div class="zoho-form-row form-field-group">
                    <div class="zoho-row-label">
                      <span>Account Manager</span>
                    </div>
                    <div class="zoho-row-control">
                      <input type="text" class="modern-input-field zoho-input-text" value="Sukanya Nagireddy" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- TAB PANE 5: Remarks -->
              <div id="zoho-tab-pane-remarks" style="display:\${zohoEditCustomerTab === 'remarks' ? 'block' : 'none'};">
                <div class="zoho-form-row form-field-group">
                  <div class="zoho-row-label">
                    <span>Remarks (For Internal Use)</span>
                  </div>
                  <div class="zoho-row-control">
                    <textarea id="cust-remarks" class="modern-input-field modern-textarea zoho-input-text" rows="5" placeholder="Add private notes, billing instructions, or operational remarks here...">\${escapeHtml(remarks)}</textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Sticky Actions Bar (Screenshot 2, 3, 4: [Save] [Save and Subscribe] [Cancel]) -->
          <div class="modern-edit-footer-bar zoho-edit-footer-actions">
            <div class="footer-sync-notice">
              <span class="sync-dot"></span>
              <span>All changes are validated and synced with Zoho Billing API.</span>
            </div>
            <div class="footer-buttons-group">
              <button type="submit" class="btn-modern-save btn-zoho-save-primary" id="btn-save-customer">
                Save
              </button>
              <button type="button" class="btn-save-subscribe-customer" id="btn-save-subscribe-customer" onclick="window.smatApp.handleZohoSaveAndSubscribe(event)">
                Save and Subscribe
              </button>
              <button type="button" class="btn-modern-cancel btn-zoho-cancel-secondary" id="btn-cancel-customer" onclick="window.smatApp.navigateTo('subscriptions')">
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    \`;
  }

  `;

appContent = appContent.slice(0, startIndex) + newFunction + appContent.slice(endIndex);

// 3. Ensure window.smatApp exports include toggleMoreCustomerDetails, handleDocumentUpload, handleZohoSaveAndSubscribe
if (!appContent.includes('toggleMoreCustomerDetails,')) {
  appContent = appContent.replace(
    'setZohoEditTab,',
    'setZohoEditTab,\n    toggleMoreCustomerDetails,\n    handleDocumentUpload,\n    handleZohoSaveAndSubscribe,'
  );
}

fs.writeFileSync(appPath, appContent, 'utf8');
console.log('Successfully updated renderZohoEditCustomerView with ALL 4 screenshots details!');
