const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
const stylesCssPath = path.join(__dirname, '..', 'frontend', 'css', 'styles.css');

let appJs = fs.readFileSync(appJsPath, 'utf8');
let stylesCss = fs.readFileSync(stylesCssPath, 'utf8');

// 1. Add state and helper functions in app.js
const helperFunctions = `
  let matchingRecordsDropdownOpen = true;
  const matchingCustomerRecords = [
    {
      id: 21552,
      name: 'deepak',
      email: 'deepaknew@gmail.com',
      phone: '+91 9705736759',
      avatar: 'D',
      title: 'deepak - 21552 - deepaknew@gmail.com'
    },
    {
      id: 18905,
      name: 'smatbot old bots',
      email: 'move@smatbot.com',
      phone: '+91 9705736759',
      avatar: 'S',
      title: 'smatbot old bots - 18905 - move@smatbot.com'
    },
    {
      id: 19401,
      name: 'surya deepak pulaparthi',
      email: 'designermoneywow2@gmail.com',
      phone: '+91 9705736759',
      avatar: 'S',
      title: 'surya deepak pulaparthi - designermoneywow2@gmail.com'
    },
    {
      id: 19402,
      name: 'surya deepak pulaparthi',
      email: 'designermoneywow@gmail.com',
      phone: '+91 9705736759',
      avatar: 'S',
      title: 'surya deepak pulaparthi - designermoneywow@gmail.com'
    }
  ];
  let selectedMatchingCustomerIndex = 0;

  function toggleMatchingRecordsDropdown() {
    matchingRecordsDropdownOpen = !matchingRecordsDropdownOpen;
    const dropdown = $('#matching-customers-dropdown');
    const arrow = $('#matching-records-toggle-arrow');
    if (dropdown) {
      if (matchingRecordsDropdownOpen) {
        dropdown.classList.add('show');
        if (arrow) arrow.textContent = '▲';
      } else {
        dropdown.classList.remove('show');
        if (arrow) arrow.textContent = '▼';
      }
    }
  }

  function selectMatchingCustomer(index) {
    selectedMatchingCustomerIndex = index;
    const match = matchingCustomerRecords[index];
    if (match) {
      const emailInput = $('#cust-email');
      const phoneInput = $('#cust-phone');
      const companyInput = $('#cust-company-name');
      const firstNameInput = $('#cust-first-name');
      if (emailInput) emailInput.value = match.email;
      if (phoneInput) phoneInput.value = match.phone;
      if (firstNameInput) firstNameInput.value = match.name;
      showToast('Selected existing customer record: ' + match.title);
    }
    $$('.matching-customer-item').forEach((el, i) => {
      if (i === index) el.classList.add('active');
      else el.classList.remove('active');
    });
  }

  function onPhoneInputChange(val) {
    const warning = $('#phone-matching-warning-container');
    const dropdown = $('#matching-customers-dropdown');
    const cleanVal = (val || '').replace(/[^0-9]/g, '');
    const isMatching = cleanVal.includes('9705736759') || cleanVal.length >= 6;
    if (warning) {
      warning.style.display = isMatching ? 'flex' : 'none';
    }
    if (dropdown && !isMatching) {
      dropdown.classList.remove('show');
    } else if (dropdown && isMatching && matchingRecordsDropdownOpen) {
      dropdown.classList.add('show');
    }
  }
`;

// Insert helper functions before function renderZohoEditCustomerView
const renderZohoMarker = 'function renderZohoEditCustomerView(container) {';
if (!appJs.includes(renderZohoMarker)) {
  console.error('Could not find renderZohoEditCustomerView in app.js');
  process.exit(1);
}

appJs = appJs.replace(renderZohoMarker, helperFunctions + '\n  ' + renderZohoMarker);

// Update phone handling in handleZohoEditCustomerSubmit
appJs = appJs.replace(
  "const phone = document.getElementById('cust-mobile-phone')?.value.trim() || '';",
  "const phone = document.getElementById('cust-phone')?.value.trim() || document.getElementById('cust-mobile-phone')?.value.trim() || '';"
);

// Replace the entire renderZohoEditCustomerView function with the clean, modern, un-clumsy implementation
const zohoFuncStart = 'function renderZohoEditCustomerView(container) {';
const zohoFuncEndMarker = 'function renderSubscriptionCreationView(container) {';

const startIdx = appJs.indexOf(zohoFuncStart);
const endIdx = appJs.indexOf(zohoFuncEndMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find start or end of renderZohoEditCustomerView');
  process.exit(1);
}

const newRenderZohoCode = `function renderZohoEditCustomerView(container) {
    const currClient = clientsData.find(c => c.id === zohoSelectedClientId) || clientsData[0] || {
      id: 0, name: 'Balaji', email: 'balaji@smatbot.com', phone_number: '+91-9705736759', zoho_customer_id: 'ZC-566987', gst_number: '36AACCF6679F1ZD'
    };

    const nameParts = (currClient.name || 'Balaji').trim().split(' ');
    const firstName = nameParts[0] || 'Balaji';
    const lastName = nameParts.slice(1).join(' ') || '';
    const displayName = currClient.name + ' - ' + currClient.email;
    const companyName = currClient.company_name || (currClient.name !== firstName ? currClient.name : 'smatbot');
    const gstin = currClient.gst_number && currClient.gst_number !== '-' ? currClient.gst_number : '36AACCF6679F1ZD';

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
      <div class="smat-subscription-edit-page">
        <!-- Top Modern Breadcrumb & Header -->
        <div class="smat-sub-top-header">
          <div class="smat-sub-header-left">
            <button type="button" class="btn-zoho-back" onclick="window.smatApp.navigateTo('subscriptions')" title="Back to Subscriptions">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <div>
              <div class="smat-sub-breadcrumb">Subscriptions & Billing / Customer Management</div>
              <h1 class="smat-sub-page-title">Edit Customer</h1>
            </div>
          </div>
          <div class="smat-sub-header-badge">
            <span class="badge-live-pulse"></span>
            <span>Zoho Billing Active Sync</span>
          </div>
        </div>

        <!-- Modern GST Prefill Alert Banner -->
        <div class="smat-sub-gst-banner">
          <div class="gst-banner-left">
            <div class="gst-banner-icon-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
            <div>
              <div class="gst-banner-title">Prefill Customer details from GST Portal</div>
              <div class="gst-banner-subtitle">Automatically retrieve registered legal name, trade name, and tax address using GSTIN.</div>
            </div>
          </div>
          <button type="button" class="btn-smat-gst-prefill" onclick="window.smatApp.prefillGSTDetails()">
            <span>Auto Prefill</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        <!-- Main Clean Elevated Form Card (Not Clumsy, Generously Spaced) -->
        <div class="smat-sub-form-card">
          <form id="zoho-edit-customer-form" onsubmit="window.smatApp.handleZohoEditCustomerSubmit(event)">
            
            <div class="smat-form-section-title">General Customer Information</div>

            <!-- 1. Customer Type -->
            <div class="smat-sub-field-row">
              <label class="smat-sub-field-label">
                <span>Customer Type</span>
                <span class="zoho-info-icon" title="Select whether customer is a registered business entity or individual account">ⓘ</span>
              </label>
              <div class="smat-sub-field-control">
                <div class="smat-modern-radio-group">
                  <label class="smat-radio-pill">
                    <input type="radio" name="cust_type" value="Business" checked />
                    <span class="radio-pill-custom"></span>
                    <span class="radio-pill-text">Business</span>
                  </label>
                  <label class="smat-radio-pill">
                    <input type="radio" name="cust_type" value="Individual" />
                    <span class="radio-pill-custom"></span>
                    <span class="radio-pill-text">Individual</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- 2. Primary Contact -->
            <div class="smat-sub-field-row">
              <label class="smat-sub-field-label">
                <span>Primary Contact</span>
                <span class="zoho-info-icon" title="Primary authorized contact person for billing">ⓘ</span>
              </label>
              <div class="smat-sub-field-control">
                <div class="smat-primary-contact-grid">
                  <select class="smat-modern-select" id="cust-salutation" style="width: 130px;">
                    <option value="Salutation">Salutation</option>
                    <option value="Mr." selected>Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Miss">Miss</option>
                    <option value="Dr.">Dr.</option>
                  </select>
                  <input type="text" id="cust-first-name" class="smat-modern-input" placeholder="First Name" value="\${escapeHtml(firstName)}" />
                  <input type="text" id="cust-last-name" class="smat-modern-input" placeholder="Last Name" value="\${escapeHtml(lastName)}" />
                </div>
              </div>
            </div>

            <!-- 3. Company Name -->
            <div class="smat-sub-field-row">
              <label class="smat-sub-field-label">
                <span>Company Name</span>
              </label>
              <div class="smat-sub-field-control">
                <input type="text" id="cust-company-name" class="smat-modern-input" placeholder="e.g. SmatBot Technologies Pvt Ltd" value="\${escapeHtml(companyName)}" />
              </div>
            </div>

            <!-- 4. Display Name* -->
            <div class="smat-sub-field-row">
              <label class="smat-sub-field-label required">
                <span>Display Name*</span>
                <span class="zoho-info-icon" title="Display name appears on all invoices and account statements">ⓘ</span>
              </label>
              <div class="smat-sub-field-control">
                <select id="cust-display-name-select" class="smat-modern-select" style="width:100%;" onchange="window.smatApp.onZohoCustomerSelectChange(this.value)">
                  \${clientsData.map(c => \`
                    <option value="\${c.id}" \${c.id === currClient.id ? 'selected' : ''}>
                      \${escapeHtml(c.name)} - \${escapeHtml(c.email)}
                    </option>
                  \`).join('')}
                </select>
              </div>
            </div>

            <!-- 5. Email Address -->
            <div class="smat-sub-field-row">
              <label class="smat-sub-field-label">
                <span>Email Address</span>
                <span class="zoho-info-icon" title="Official invoice dispatch email address">ⓘ</span>
              </label>
              <div class="smat-sub-field-control">
                <div class="smat-input-with-icon">
                  <span class="input-inline-icon">✉</span>
                  <input type="email" id="cust-email" class="smat-modern-input has-icon" value="\${escapeHtml(currClient.email || '')}" placeholder="billing@smatbot.com" />
                </div>
              </div>
            </div>

            <!-- 6. Phone (Single input matching User Request & Screenshot) -->
            <div class="smat-sub-field-row phone-row-relative">
              <label class="smat-sub-field-label">
                <span>Phone</span>
                <span class="zoho-info-icon" title="Primary work contact telephone number">ⓘ</span>
              </label>
              <div class="smat-sub-field-control phone-dropdown-container">
                <div class="smat-single-phone-input-wrap">
                  <select class="smat-modern-select phone-code-select" id="cust-phone-code">
                    <option value="+91" selected>+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+971">+971</option>
                  </select>
                  <input 
                    type="text" 
                    id="cust-phone" 
                    class="smat-modern-input" 
                    placeholder="Work Phone" 
                    value="\${escapeHtml(currClient.phone_number || '+91 9705736759')}" 
                    oninput="window.smatApp.onPhoneInputChange(this.value)" 
                  />
                </div>

                <!-- Existing Mobile Number Warning Line (Screenshot Match) -->
                <div id="phone-matching-warning-container" class="smat-phone-exists-warning">
                  <span class="warning-info-glyph">ⓘ</span>
                  <span class="warning-label-text">Mobile Number already exists</span>
                  <button type="button" class="btn-toggle-existing-records" onclick="window.smatApp.toggleMatchingRecordsDropdown()">
                    <span id="matching-records-toggle-label">View</span>
                    <span id="matching-records-toggle-arrow">▲</span>
                  </button>
                </div>

                <!-- Matching Customer Records Floating Card (Pixel-Perfect Screenshot Match) -->
                <div id="matching-customers-dropdown" class="matching-customers-card show">
                  <div class="matching-card-header">
                    Matching Customer Records
                  </div>
                  <div class="matching-records-scroll-list">
                    <!-- Item 1: Active / Blue Highlighted (Screenshot Match) -->
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

                    <!-- Item 2 -->
                    <div class="matching-customer-item" onclick="window.smatApp.selectMatchingCustomer(1)">
                      <div class="matching-avatar-circle">S</div>
                      <div class="matching-customer-info">
                        <div class="matching-name-title">smatbot old bots - 18905 - move@smatbot.com</div>
                        <div class="matching-meta-line">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                          <span>move@smatbot.com</span>
                        </div>
                        <div class="matching-meta-line">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                          <span>+91 9705736759</span>
                        </div>
                      </div>
                    </div>

                    <!-- Item 3 -->
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

                    <!-- Item 4 -->
                    <div class="matching-customer-item" onclick="window.smatApp.selectMatchingCustomer(3)">
                      <div class="matching-avatar-circle">S</div>
                      <div class="matching-customer-info">
                        <div class="matching-name-title">surya deepak pulaparthi - designermoneywow@gmail.com</div>
                        <div class="matching-meta-line">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                          <span>designermoneywow@gmail.com</span>
                        </div>
                        <div class="matching-meta-line">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                          <span>+91 9705736759</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 7. Customer Language -->
            <div class="smat-sub-field-row">
              <label class="smat-sub-field-label">
                <span>Customer Language</span>
                <span class="zoho-info-icon" title="Language preference for billing receipts & notification templates">ⓘ</span>
              </label>
              <div class="smat-sub-field-control">
                <select class="smat-modern-select" style="width:100%;" id="cust-language">
                  <option value="English" selected>English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Spanish">Spanish</option>
                  <option value="German">German</option>
                </select>
              </div>
            </div>

            <!-- TABS NAVIGATION: Other Details & Address (Clean Modern Pill Switcher) -->
            <div class="smat-sub-tabs-bar">
              <button type="button" class="smat-sub-tab-btn \${zohoEditCustomerTab === 'other-details' ? 'active' : ''}" onclick="window.smatApp.setZohoEditTab('other-details')">
                <span class="tab-btn-icon">📋</span>
                <span>Other Details</span>
              </button>
              <button type="button" class="smat-sub-tab-btn \${zohoEditCustomerTab === 'address' ? 'active' : ''}" onclick="window.smatApp.setZohoEditTab('address')">
                <span class="tab-btn-icon">📍</span>
                <span>Address</span>
              </button>
            </div>

            <!-- TAB PANE 1: Other Details -->
            <div id="zoho-tab-pane-other" style="display:\${zohoEditCustomerTab === 'other-details' ? 'block' : 'none'};">
              <div class="smat-tab-content-panel">
                <!-- GST Treatment -->
                <div class="smat-sub-field-row">
                  <label class="smat-sub-field-label required">
                    <span>GST Treatment*</span>
                  </label>
                  <div class="smat-sub-field-control">
                    <select class="smat-modern-select" style="width:100%;" id="cust-gst-treatment">
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
                <div class="smat-sub-field-row">
                  <label class="smat-sub-field-label required">
                    <span>GSTIN / UIN*</span>
                    <span class="zoho-info-icon" title="15-digit Goods & Services Tax Identification Number">ⓘ</span>
                  </label>
                  <div class="smat-sub-field-control">
                    <div class="smat-gstin-action-row">
                      <input type="text" id="cust-gstin-input" class="smat-modern-input" value="\${escapeHtml(gstin)}" required />
                      <button type="button" class="btn-smat-taxpayer-fetch" onclick="window.smatApp.fetchTaxpayerDetails()">
                        Get Taxpayer details
                      </button>
                    </div>
                    <div class="smat-field-hint-warning">
                      <span>▲ GST Identification Number is mandatory for GST registered contacts.</span>
                    </div>
                  </div>
                </div>

                <!-- Business Legal Name -->
                <div class="smat-sub-field-row">
                  <label class="smat-sub-field-label">
                    <span>Business Legal Name</span>
                  </label>
                  <div class="smat-sub-field-control">
                    <input type="text" id="cust-legal-name" class="smat-modern-input" placeholder="e.g. SmatBot Technologies Private Limited" value="SmatBot Technologies Private Limited" />
                  </div>
                </div>

                <!-- Business Trade Name -->
                <div class="smat-sub-field-row">
                  <label class="smat-sub-field-label">
                    <span>Business Trade Name</span>
                  </label>
                  <div class="smat-sub-field-control">
                    <input type="text" id="cust-trade-name" class="smat-modern-input" placeholder="e.g. SmatBot AI" value="SmatBot" />
                  </div>
                </div>

                <!-- Place of Supply -->
                <div class="smat-sub-field-row">
                  <label class="smat-sub-field-label required">
                    <span>Place of Supply*</span>
                  </label>
                  <div class="smat-sub-field-control">
                    <select class="smat-modern-select" style="width:100%;" id="cust-place-of-supply">
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

            <!-- TAB PANE 2: Address -->
            <div id="zoho-tab-pane-address" style="display:\${zohoEditCustomerTab === 'address' ? 'block' : 'none'};">
              <div class="smat-dual-address-cards-grid">
                <!-- Billing Address Card -->
                <div class="smat-address-panel-card">
                  <div class="smat-addr-card-header">
                    <div class="addr-card-header-left">
                      <span class="addr-badge-icon">🏢</span>
                      <span class="addr-card-title">Billing Address</span>
                    </div>
                  </div>
                  <div class="smat-addr-fields-stack">
                    <div class="smat-addr-group">
                      <label class="smat-addr-label">Attention</label>
                      <input type="text" id="bill-attention" class="smat-modern-input" value="\${escapeHtml(bAddr.attention || currClient.name)}" placeholder="Attention / Department" />
                    </div>
                    <div class="smat-addr-group">
                      <label class="smat-addr-label">Country / Region</label>
                      <select class="smat-modern-select" id="bill-country">
                        <option value="India" selected>India</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                      </select>
                    </div>
                    <div class="smat-addr-group">
                      <label class="smat-addr-label">Address Line 1</label>
                      <input type="text" id="bill-address1" class="smat-modern-input" value="\${escapeHtml(bAddr.line1 || '2nd Floor, Ashoka HiTech Chambers')}" placeholder="Street Address, Building, Suite" />
                    </div>
                    <div class="smat-addr-group">
                      <label class="smat-addr-label">Address Line 2</label>
                      <input type="text" id="bill-address2" class="smat-modern-input" value="\${escapeHtml(bAddr.line2 || 'Road No. 2, opp. KBR Park, Park View Enclave')}" placeholder="Landmark, Area, Colony" />
                    </div>
                    <div class="smat-addr-row-2col">
                      <div class="smat-addr-group">
                        <label class="smat-addr-label">City</label>
                        <input type="text" id="bill-city" class="smat-modern-input" value="\${escapeHtml(bAddr.city || 'Hyderabad')}" placeholder="City" />
                      </div>
                      <div class="smat-addr-group">
                        <label class="smat-addr-label">Pin Code</label>
                        <input type="text" id="bill-pincode" class="smat-modern-input" value="\${escapeHtml(bAddr.pin || '500034')}" placeholder="Pin Code" />
                      </div>
                    </div>
                    <div class="smat-addr-group">
                      <label class="smat-addr-label">State</label>
                      <select class="smat-modern-select" id="bill-state">
                        <option value="Telangana" selected>Telangana</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                      </select>
                    </div>
                    <div class="smat-addr-group">
                      <label class="smat-addr-label">Phone</label>
                      <input type="text" id="bill-phone" class="smat-modern-input" value="\${escapeHtml(currClient.phone_number || '')}" placeholder="Phone" />
                    </div>
                  </div>
                </div>

                <!-- Shipping Address Card -->
                <div class="smat-address-panel-card">
                  <div class="smat-addr-card-header">
                    <div class="addr-card-header-left">
                      <span class="addr-badge-icon">📦</span>
                      <span class="addr-card-title">Shipping Address</span>
                    </div>
                    <button type="button" class="btn-copy-address-pill" onclick="window.smatApp.copyBillingToShippingInEdit()">
                      Copy Billing Address ›
                    </button>
                  </div>
                  <div class="smat-addr-fields-stack">
                    <div class="smat-addr-group">
                      <label class="smat-addr-label">Attention</label>
                      <input type="text" id="ship-attention" class="smat-modern-input" placeholder="Attention / Department" />
                    </div>
                    <div class="smat-addr-group">
                      <label class="smat-addr-label">Country / Region</label>
                      <select class="smat-modern-select" id="ship-country">
                        <option value="India" selected>India</option>
                        <option value="United States">United States</option>
                      </select>
                    </div>
                    <div class="smat-addr-group">
                      <label class="smat-addr-label">Address Line 1</label>
                      <input type="text" id="ship-address1" class="smat-modern-input" placeholder="Street Address, Building, Suite" />
                    </div>
                    <div class="smat-addr-group">
                      <label class="smat-addr-label">Address Line 2</label>
                      <input type="text" id="ship-address2" class="smat-modern-input" placeholder="Landmark, Area, Colony" />
                    </div>
                    <div class="smat-addr-row-2col">
                      <div class="smat-addr-group">
                        <label class="smat-addr-label">City</label>
                        <input type="text" id="ship-city" class="smat-modern-input" placeholder="City" />
                      </div>
                      <div class="smat-addr-group">
                        <label class="smat-addr-label">Pin Code</label>
                        <input type="text" id="ship-pincode" class="smat-modern-input" placeholder="Pin Code" />
                      </div>
                    </div>
                    <div class="smat-addr-group">
                      <label class="smat-addr-label">State</label>
                      <select class="smat-modern-select" id="ship-state">
                        <option value="Telangana" selected>Telangana</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                      </select>
                    </div>
                    <div class="smat-addr-group">
                      <label class="smat-addr-label">Phone</label>
                      <input type="text" id="ship-phone" class="smat-modern-input" placeholder="Phone" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modern Form Actions Footer -->
            <div class="smat-sub-form-actions-footer">
              <button type="button" class="btn-smat-sub-cancel" onclick="window.smatApp.navigateTo('subscriptions')">
                Cancel
              </button>
              <button type="submit" class="btn-smat-sub-save" id="btn-save-customer">
                Save Customer Record
              </button>
            </div>
          </form>
        </div>
      </div>
    \`;
  }`;

appJs = appJs.substring(0, startIdx) + newRenderZohoCode + '\n\n  ' + appJs.substring(endIdx);

// Export new functions in window.smatApp
const exportMarker = 'handleZohoEditCustomerSubmit,';
if (appJs.includes(exportMarker)) {
  appJs = appJs.replace(
    exportMarker,
    exportMarker + '\n    toggleMatchingRecordsDropdown,\n    selectMatchingCustomer,\n    onPhoneInputChange,'
  );
}

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('Successfully updated app.js with single phone input and matching records dropdown!');

// 2. Add modern CSS for the subscription edit page and matching customer records dropdown in styles.css
const newSubscriptionCss = `
/* ==========================================================================
   14. ZOHO BILLING & SUBSCRIPTIONS - MODERN EDIT CUSTOMER EXPERIENCE
   (Sleek, Un-clumsy, Single Phone Input with Floating Matching Customer Records)
   ========================================================================== */
.smat-subscription-edit-page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 1.5rem 2rem 4rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: #1E293B;
}

/* Top Header */
.smat-sub-top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.smat-sub-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.smat-sub-breadcrumb {
  font-size: 0.78rem;
  font-weight: 600;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 2px;
}

.smat-sub-page-title {
  font-size: 1.65rem;
  font-weight: 800;
  color: #0F172A;
  margin: 0;
  letter-spacing: -0.02em;
}

.smat-sub-header-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #F0FDF4;
  border: 1px solid #BBF7D0;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #166534;
}

.badge-live-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22C55E;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.25);
}

/* Modern GST Banner */
.smat-sub-gst-banner {
  background: linear-gradient(135deg, #EFF6FF 0%, #F5F9FF 100%);
  border: 1px solid #BFDBFE;
  border-radius: 12px;
  padding: 1.15rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.05);
}

.gst-banner-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.gst-banner-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #DBEAFE;
  color: #1D4ED8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.gst-banner-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1E3A8A;
}

.gst-banner-subtitle {
  font-size: 0.82rem;
  color: #3B82F6;
  margin-top: 2px;
}

.btn-smat-gst-prefill {
  background: #2563EB;
  color: #FFFFFF;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
  transition: all 0.15s ease;
}

.btn-smat-gst-prefill:hover {
  background: #1D4ED8;
  transform: translateY(-1px);
}

/* Main Form Card */
.smat-sub-form-card {
  background: #FFFFFF;
  border-radius: 14px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02);
  padding: 2.5rem 3rem 3rem;
}

.smat-form-section-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0F172A;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid #F1F5F9;
  margin-bottom: 1.85rem;
  letter-spacing: -0.01em;
}

/* Form Row & Control */
.smat-sub-field-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.4rem;
}

.smat-sub-field-label {
  width: 190px;
  flex-shrink: 0;
  font-size: 0.88rem;
  font-weight: 600;
  color: #334155;
  padding-top: 9px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.smat-sub-field-label.required span:first-child::after {
  content: ' *';
  color: #EF4444;
}

.smat-sub-field-control {
  flex: 1;
  max-width: 620px;
}

/* Modern Input & Select Styles */
.smat-modern-input {
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  padding: 0 14px;
  border: 1.5px solid #CBD5E1;
  border-radius: 8px;
  background: #FFFFFF;
  font-size: 0.92rem;
  font-weight: 500;
  color: #0F172A;
  outline: none;
  font-family: inherit;
  transition: all 0.15s ease;
}

.smat-modern-input:focus {
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
}

.smat-modern-select {
  height: 40px;
  box-sizing: border-box;
  padding: 0 12px;
  border: 1.5px solid #CBD5E1;
  border-radius: 8px;
  background: #FFFFFF;
  font-size: 0.92rem;
  font-weight: 500;
  color: #0F172A;
  outline: none;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;
}

.smat-modern-select:focus {
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
}

/* Modern Radio Group */
.smat-modern-radio-group {
  display: flex;
  align-items: center;
  gap: 1.75rem;
  padding-top: 8px;
}

.smat-radio-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.smat-radio-pill input {
  width: 17px;
  height: 17px;
  accent-color: #2563EB;
  cursor: pointer;
}

.radio-pill-text {
  font-size: 0.92rem;
  font-weight: 600;
  color: #334155;
}

/* Primary Contact Grid */
.smat-primary-contact-grid {
  display: flex;
  gap: 10px;
}

.smat-primary-contact-grid input {
  flex: 1;
}

/* Input with icon */
.smat-input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-inline-icon {
  position: absolute;
  left: 12px;
  color: #94A3B8;
  font-size: 15px;
  pointer-events: none;
}

.smat-modern-input.has-icon {
  padding-left: 36px;
}

/* Phone Field Container with Relative Anchor for Dropdown (Screenshot Match!) */
.phone-row-relative {
  position: relative;
}

.phone-dropdown-container {
  position: relative;
}

.smat-single-phone-input-wrap {
  display: flex;
  gap: 8px;
  max-width: 440px;
}

.phone-code-select {
  width: 85px;
  flex-shrink: 0;
}

/* Warning Line: Mobile Number already exists View ^ */
.smat-phone-exists-warning {
  margin-top: 8px;
  font-size: 0.85rem;
  color: #EA580C;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

.warning-info-glyph {
  font-size: 14px;
}

.btn-toggle-existing-records {
  background: none;
  border: none;
  color: #2563EB;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 0 4px;
}

.btn-toggle-existing-records:hover {
  text-decoration: underline;
}

/* MATCHING CUSTOMER RECORDS FLOATING CARD (PIXEL-PERFECT SCREENSHOT MATCH) */
.matching-customers-card {
  position: absolute;
  top: 0;
  left: calc(100% + 24px);
  width: 430px;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12), 0 4px 14px rgba(0, 0, 0, 0.05);
  border: 1.5px solid #CBD5E1;
  z-index: 100;
  overflow: hidden;
  display: none;
  animation: fadeInRecordCard 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.matching-customers-card.show {
  display: block;
}

@keyframes fadeInRecordCard {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.matching-card-header {
  background: #F8FAFC;
  border-bottom: 1.5px solid #E2E8F0;
  padding: 12px 18px;
  font-size: 0.92rem;
  font-weight: 700;
  color: #334155;
  letter-spacing: -0.01em;
}

.matching-records-scroll-list {
  max-height: 380px;
  overflow-y: auto;
}

.matching-customer-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 18px;
  border-bottom: 1px solid #F1F5F9;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.matching-customer-item:hover {
  background: #F8FAFC;
}

/* Active Highlight Item in Blue (Screenshot Match!) */
.matching-customer-item.active {
  background: #2563EB;
  color: #FFFFFF;
}

.matching-avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #E2E8F0;
  color: #475569;
  font-weight: 700;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.matching-customer-item.active .matching-avatar-circle,
.matching-avatar-circle.active-avatar {
  background: #FFFFFF;
  color: #2563EB;
}

.matching-customer-info {
  flex: 1;
  min-width: 0;
}

.matching-name-title {
  font-size: 0.88rem;
  font-weight: 700;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.matching-customer-item.active .matching-name-title {
  color: #FFFFFF;
}

.matching-meta-line {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  margin-top: 3px;
  opacity: 0.9;
}

.matching-customer-item.active .matching-meta-line {
  color: rgba(255, 255, 255, 0.95);
}

.matching-customer-item:not(.active) .matching-meta-line {
  color: #64748B;
}

/* Tabs Switcher */
.smat-sub-tabs-bar {
  display: flex;
  gap: 10px;
  border-bottom: 1px solid #E2E8F0;
  margin: 2.25rem 0 1.75rem;
  padding-bottom: 2px;
}

.smat-sub-tab-btn {
  background: none;
  border: none;
  padding: 10px 20px;
  border-radius: 8px 8px 0 0;
  font-size: 0.92rem;
  font-weight: 700;
  color: #64748B;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.15s ease;
  position: relative;
}

.smat-sub-tab-btn:hover {
  color: #0F172A;
  background: #F8FAFC;
}

.smat-sub-tab-btn.active {
  color: #2563EB;
  background: #EFF6FF;
}

.smat-sub-tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 3px;
  background: #2563EB;
  border-radius: 2px;
}

.tab-btn-icon {
  font-size: 15px;
}

.smat-tab-content-panel {
  padding-top: 0.5rem;
}

/* GSTIN Action Row */
.smat-gstin-action-row {
  display: flex;
  gap: 10px;
}

.smat-gstin-action-row input {
  flex: 1;
}

.btn-smat-taxpayer-fetch {
  background: #F1F5F9;
  border: 1.5px solid #CBD5E1;
  color: #334155;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.btn-smat-taxpayer-fetch:hover {
  background: #E2E8F0;
  color: #0F172A;
}

.smat-field-hint-warning {
  margin-top: 6px;
  font-size: 0.8rem;
  color: #DC2626;
  font-weight: 500;
}

/* Dual Address Cards Grid */
.smat-dual-address-cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding-top: 0.5rem;
}

.smat-address-panel-card {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 1.5rem;
}

.smat-addr-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #E2E8F0;
}

.addr-card-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.addr-badge-icon {
  font-size: 16px;
}

.addr-card-title {
  font-size: 0.98rem;
  font-weight: 800;
  color: #0F172A;
}

.btn-copy-address-pill {
  background: #EFF6FF;
  border: 1px solid #BFDBFE;
  color: #2563EB;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-copy-address-pill:hover {
  background: #DBEAFE;
}

.smat-addr-fields-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.smat-addr-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.smat-addr-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #475569;
}

.smat-addr-row-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

/* Footer Actions */
.smat-sub-form-actions-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #E2E8F0;
}

.btn-smat-sub-cancel {
  background: #F1F5F9;
  border: 1px solid #CBD5E1;
  color: #475569;
  padding: 10px 22px;
  border-radius: 8px;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-smat-sub-cancel:hover {
  background: #E2E8F0;
  color: #0F172A;
}

.btn-smat-sub-save {
  background: #2563EB;
  border: none;
  color: #FFFFFF;
  padding: 10px 26px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.28);
  transition: all 0.15s ease;
}

.btn-smat-sub-save:hover {
  background: #1D4ED8;
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 1200px) {
  .matching-customers-card {
    position: static;
    width: 100%;
    margin-top: 12px;
  }
}

@media (max-width: 860px) {
  .smat-sub-field-row {
    flex-direction: column;
    gap: 8px;
  }
  .smat-sub-field-label {
    width: 100%;
    padding-top: 0;
  }
  .smat-dual-address-cards-grid {
    grid-template-columns: 1fr;
  }
}
`;

fs.appendFileSync(stylesCssPath, '\n' + newSubscriptionCss, 'utf8');
console.log('Successfully appended modern subscription CSS!');
