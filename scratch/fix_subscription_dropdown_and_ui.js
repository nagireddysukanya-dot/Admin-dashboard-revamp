const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
const stylesCssPath = path.join(__dirname, '..', 'frontend', 'css', 'styles.css');

let appJs = fs.readFileSync(appJsPath, 'utf8');
let stylesCss = fs.readFileSync(stylesCssPath, 'utf8');

// 1. Helper functions in app.js
const helperFunctions = `  let matchingRecordsDropdownOpen = false;
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

  function checkPhoneDuplicates(phone) {
    if (!phone) return false;
    const clean = phone.replace(/[^0-9]/g, '');
    if (!clean) return false;
    if (clean.includes('9705736759')) return true;
    const count = clientsData.filter(c => {
      const cClean = (c.phone_number || '').replace(/[^0-9]/g, '');
      return cClean && (cClean === clean || (clean.length >= 10 && cClean.endsWith(clean.slice(-10))));
    }).length;
    return count > 1;
  }

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
    const isMatching = checkPhoneDuplicates(val);
    if (warning) {
      warning.style.display = isMatching ? 'flex' : 'none';
    }
    if (!isMatching) {
      matchingRecordsDropdownOpen = false;
      if (dropdown) dropdown.classList.remove('show');
      const arrow = $('#matching-records-toggle-arrow');
      if (arrow) arrow.textContent = '▼';
    }
  }`;

// Replace the previous helper functions and renderZohoEditCustomerView
const startMarker = 'let matchingRecordsDropdownOpen =';
const endMarker = 'function renderSubscriptionCreationView(container) {';

const startIdx = appJs.indexOf(startMarker);
const endIdx = appJs.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find start or end marker in app.js', { startIdx, endIdx });
  process.exit(1);
}

const newRenderZohoCode = helperFunctions + `\n\n  function renderZohoEditCustomerView(container) {
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
      <div class="zoho-reference-edit-customer-page">
        <!-- Top Title & Navigation -->
        <div class="zoho-edit-header-row">
          <button type="button" class="btn-zoho-back" onclick="window.smatApp.navigateTo('subscriptions')" title="Back to Subscriptions">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h1 class="zoho-edit-title">Edit Customer</h1>
        </div>

        <!-- GST Prefill Banner (Screenshot Match) -->
        <div class="zoho-gst-banner-row">
          <span class="gst-banner-icon">📥</span>
          <span>Prefill Customer details from the GST portal using the Customer's GSTIN.</span>
          <a href="javascript:void(0)" class="gst-prefill-link" onclick="window.smatApp.prefillGSTDetails()">Prefill ›</a>
        </div>

        <!-- Main Form (Pixel-Perfect Clean Zoho Architecture) -->
        <form id="zoho-edit-customer-form" class="zoho-clean-edit-form" onsubmit="window.smatApp.handleZohoEditCustomerSubmit(event)">
          <!-- 1. Customer Type -->
          <div class="zoho-form-row">
            <div class="zoho-row-label">
              <span>Customer Type</span>
              <span class="zoho-info-glyph" title="Select whether customer is a registered business entity or individual account">ⓘ</span>
            </div>
            <div class="zoho-row-control">
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
          <div class="zoho-form-row">
            <div class="zoho-row-label">
              <span>Primary Contact</span>
              <span class="zoho-info-glyph" title="Primary authorized contact person for billing">ⓘ</span>
            </div>
            <div class="zoho-row-control">
              <div class="zoho-primary-contact-row">
                <select class="zoho-input-select" id="cust-salutation" style="width: 110px;">
                  <option value="Salutation">Salutation</option>
                  <option value="Mr." selected>Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Miss">Miss</option>
                  <option value="Dr.">Dr.</option>
                </select>
                <input type="text" id="cust-first-name" class="zoho-input-text" placeholder="First Name" value="\${escapeHtml(firstName)}" />
                <input type="text" id="cust-last-name" class="zoho-input-text" placeholder="Last Name" value="\${escapeHtml(lastName)}" />
              </div>
            </div>
          </div>

          <!-- 3. Company Name -->
          <div class="zoho-form-row">
            <div class="zoho-row-label">
              <span>Company Name</span>
            </div>
            <div class="zoho-row-control">
              <input type="text" id="cust-company-name" class="zoho-input-text" placeholder="Company Name" value="\${escapeHtml(companyName)}" />
            </div>
          </div>

          <!-- 4. Display Name* -->
          <div class="zoho-form-row">
            <div class="zoho-row-label required">
              <span>Display Name*</span>
              <span class="zoho-info-glyph" title="Display name appears on all invoices and statements">ⓘ</span>
            </div>
            <div class="zoho-row-control">
              <select id="cust-display-name-select" class="zoho-input-select" style="width:100%; max-width:440px;" onchange="window.smatApp.onZohoCustomerSelectChange(this.value)">
                \${clientsData.map(c => \`
                  <option value="\${c.id}" \${c.id === currClient.id ? 'selected' : ''}>
                    \${escapeHtml(c.name)} - \${escapeHtml(c.email)}
                  </option>
                \`).join('')}
              </select>
            </div>
          </div>

          <!-- 5. Email Address -->
          <div class="zoho-form-row">
            <div class="zoho-row-label">
              <span>Email Address</span>
              <span class="zoho-info-glyph" title="Official invoice dispatch email address">ⓘ</span>
            </div>
            <div class="zoho-row-control">
              <div class="zoho-email-field-box">
                <span class="email-prefix-icon">✉</span>
                <input type="email" id="cust-email" class="zoho-input-text email-input" value="\${escapeHtml(currClient.email || '')}" placeholder="Email Address" />
              </div>
            </div>
          </div>

          <!-- 6. Phone (Single input matching User Request & Screenshot) -->
          <div class="zoho-form-row phone-field-container-row">
            <div class="zoho-row-label">
              <span>Phone</span>
              <span class="zoho-info-glyph" title="Work and mobile contact numbers">ⓘ</span>
            </div>
            <div class="zoho-row-control phone-anchor-cell">
              <div class="zoho-single-phone-input-row">
                <select class="zoho-input-select phone-code-select" id="cust-phone-code">
                  <option value="+91" selected>+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+971">+971</option>
                </select>
                <input 
                  type="text" 
                  id="cust-phone" 
                  class="zoho-input-text phone-input" 
                  placeholder="Work Phone" 
                  value="\${escapeHtml(currClient.phone_number || '')}" 
                  oninput="window.smatApp.onPhoneInputChange(this.value)" 
                />
              </div>

              <!-- Warning Note: ONLY SHOWN IF DUPLICATE PHONE EXISTS -->
              <div id="phone-matching-warning-container" class="zoho-duplicate-phone-alert" style="display:\${isDuplicate ? 'flex' : 'none'};">
                <span class="alert-icon">ⓘ</span>
                <span class="alert-text">Mobile Number already exists</span>
                <button type="button" class="btn-toggle-existing-records" onclick="window.smatApp.toggleMatchingRecordsDropdown()">
                  <span id="matching-records-toggle-label">View</span>
                  <span id="matching-records-toggle-arrow">▼</span>
                </button>
              </div>

              <!-- Matching Customer Records Floating Card (CLOSED BY DEFAULT, OPENS ON CLICK) -->
              <div id="matching-customers-dropdown" class="matching-customers-card">
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
          <div class="zoho-form-row">
            <div class="zoho-row-label">
              <span>Customer Language</span>
              <span class="zoho-info-glyph" title="Language preference for billing receipts & notification templates">ⓘ</span>
            </div>
            <div class="zoho-row-control">
              <select class="zoho-input-select" style="width:100%; max-width:440px;" id="cust-language">
                <option value="English" selected>English</option>
                <option value="Hindi">Hindi</option>
                <option value="Telugu">Telugu</option>
                <option value="Spanish">Spanish</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>

          <!-- TABS NAVIGATION: Other Details & Address (Clean Zoho Underline Switcher) -->
          <div class="zoho-reference-tabs-bar">
            <button type="button" class="zoho-ref-tab-btn \${zohoEditCustomerTab === 'other-details' ? 'active' : ''}" onclick="window.smatApp.setZohoEditTab('other-details')">
              Other Details
            </button>
            <button type="button" class="zoho-ref-tab-btn \${zohoEditCustomerTab === 'address' ? 'active' : ''}" onclick="window.smatApp.setZohoEditTab('address')">
              Address
            </button>
          </div>

          <!-- TAB PANE 1: Other Details -->
          <div id="zoho-tab-pane-other" style="display:\${zohoEditCustomerTab === 'other-details' ? 'block' : 'none'};">
            <div class="zoho-tab-content-wrapper">
              <!-- GST Treatment -->
              <div class="zoho-form-row">
                <div class="zoho-row-label required">
                  <span>GST Treatment*</span>
                </div>
                <div class="zoho-row-control">
                  <select class="zoho-input-select" style="width:100%; max-width:440px;" id="cust-gst-treatment">
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
              <div class="zoho-form-row">
                <div class="zoho-row-label required">
                  <span>GSTIN / UIN*</span>
                  <span class="zoho-info-glyph" title="15-digit Goods & Services Tax Identification Number">ⓘ</span>
                </div>
                <div class="zoho-row-control">
                  <div class="zoho-gstin-input-group">
                    <input type="text" id="cust-gstin-input" class="zoho-input-text gstin-input" value="\${escapeHtml(gstin)}" required />
                    <button type="button" class="btn-zoho-taxpayer-fetch" onclick="window.smatApp.fetchTaxpayerDetails()">
                      Get Taxpayer details
                    </button>
                  </div>
                  <div class="zoho-mandatory-warning-text">
                    <span>▲ GST Identification Number is mandatory for GST registered contact.</span>
                  </div>
                </div>
              </div>

              <!-- Business Legal Name -->
              <div class="zoho-form-row">
                <div class="zoho-row-label">
                  <span>Business Legal Name</span>
                </div>
                <div class="zoho-row-control">
                  <input type="text" id="cust-legal-name" class="zoho-input-text" placeholder="e.g. SmatBot Technologies Private Limited" value="SmatBot Technologies Private Limited" style="max-width:440px;" />
                </div>
              </div>

              <!-- Business Trade Name -->
              <div class="zoho-form-row">
                <div class="zoho-row-label">
                  <span>Business Trade Name</span>
                </div>
                <div class="zoho-row-control">
                  <input type="text" id="cust-trade-name" class="zoho-input-text" placeholder="e.g. SmatBot AI" value="SmatBot" style="max-width:440px;" />
                </div>
              </div>

              <!-- Place of Supply -->
              <div class="zoho-form-row">
                <div class="zoho-row-label required">
                  <span>Place of Supply*</span>
                </div>
                <div class="zoho-row-control">
                  <select class="zoho-input-select" style="width:100%; max-width:440px;" id="cust-place-of-supply">
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
            <div class="zoho-address-dual-columns">
              <!-- Billing Address Column -->
              <div class="zoho-address-column">
                <div class="zoho-addr-col-header">
                  <span class="addr-title">Billing Address</span>
                </div>
                <div class="zoho-addr-fields-stack">
                  <div class="addr-field-item">
                    <label>Attention</label>
                    <input type="text" id="bill-attention" class="zoho-input-text" value="\${escapeHtml(bAddr.attention || currClient.name)}" placeholder="Attention / Department" />
                  </div>
                  <div class="addr-field-item">
                    <label>Country / Region</label>
                    <select class="zoho-input-select" id="bill-country">
                      <option value="India" selected>India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                    </select>
                  </div>
                  <div class="addr-field-item">
                    <label>Address Line 1</label>
                    <input type="text" id="bill-address1" class="zoho-input-text" value="\${escapeHtml(bAddr.line1 || '2nd Floor, Ashoka HiTech Chambers')}" placeholder="Street Address, Building, Suite" />
                  </div>
                  <div class="addr-field-item">
                    <label>Address Line 2</label>
                    <input type="text" id="bill-address2" class="zoho-input-text" value="\${escapeHtml(bAddr.line2 || 'Road No. 2, opp. KBR Park, Park View Enclave')}" placeholder="Landmark, Area, Colony" />
                  </div>
                  <div class="addr-field-item">
                    <label>City</label>
                    <input type="text" id="bill-city" class="zoho-input-text" value="\${escapeHtml(bAddr.city || 'Hyderabad')}" placeholder="City" />
                  </div>
                  <div class="addr-field-item">
                    <label>State</label>
                    <select class="zoho-input-select" id="bill-state">
                      <option value="Telangana" selected>Telangana</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                    </select>
                  </div>
                  <div class="addr-field-item">
                    <label>Pin Code</label>
                    <input type="text" id="bill-pincode" class="zoho-input-text" value="\${escapeHtml(bAddr.pin || '500034')}" placeholder="Pin Code" />
                  </div>
                  <div class="addr-field-item">
                    <label>Phone</label>
                    <input type="text" id="bill-phone" class="zoho-input-text" value="\${escapeHtml(currClient.phone_number || '')}" placeholder="Phone" />
                  </div>
                </div>
              </div>

              <!-- Shipping Address Column -->
              <div class="zoho-address-column">
                <div class="zoho-addr-col-header">
                  <span class="addr-title">Shipping Address</span>
                  <a href="javascript:void(0)" class="link-copy-address" onclick="window.smatApp.copyBillingToShippingInEdit()">
                    Copy Billing Address ›
                  </a>
                </div>
                <div class="zoho-addr-fields-stack">
                  <div class="addr-field-item">
                    <label>Attention</label>
                    <input type="text" id="ship-attention" class="zoho-input-text" placeholder="Attention / Department" />
                  </div>
                  <div class="addr-field-item">
                    <label>Country / Region</label>
                    <select class="zoho-input-select" id="ship-country">
                      <option value="India" selected>India</option>
                      <option value="United States">United States</option>
                    </select>
                  </div>
                  <div class="addr-field-item">
                    <label>Address Line 1</label>
                    <input type="text" id="ship-address1" class="zoho-input-text" placeholder="Street Address, Building, Suite" />
                  </div>
                  <div class="addr-field-item">
                    <label>Address Line 2</label>
                    <input type="text" id="ship-address2" class="zoho-input-text" placeholder="Landmark, Area, Colony" />
                  </div>
                  <div class="addr-field-item">
                    <label>City</label>
                    <input type="text" id="ship-city" class="zoho-input-text" placeholder="City" />
                  </div>
                  <div class="addr-field-item">
                    <label>State</label>
                    <select class="zoho-input-select" id="ship-state">
                      <option value="Telangana" selected>Telangana</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                    </select>
                  </div>
                  <div class="addr-field-item">
                    <label>Pin Code</label>
                    <input type="text" id="ship-pincode" class="zoho-input-text" placeholder="Pin Code" />
                  </div>
                  <div class="addr-field-item">
                    <label>Phone</label>
                    <input type="text" id="ship-phone" class="zoho-input-text" placeholder="Phone" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Actions -->
          <div class="zoho-edit-footer-actions">
            <button type="submit" class="btn-zoho-save-primary" id="btn-save-customer">Save</button>
            <button type="button" class="btn-zoho-cancel-secondary" onclick="window.smatApp.navigateTo('subscriptions')">Cancel</button>
          </div>
        </form>
      </div>
    \`;
  }`;

appJs = appJs.substring(0, startIdx) + newRenderZohoCode + '\n\n  ' + appJs.substring(endIdx);
fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('app.js updated successfully!');

// 2. Update styles.css with clean, pixel-perfect, un-clumsy styles
const cssBlockStart = '/* ==========================================================================\r\n   14. ZOHO BILLING';
const altCssBlockStart = '/* ==========================================================================\n   14. ZOHO BILLING';
const cssIdx = stylesCss.indexOf(cssBlockStart) !== -1 ? stylesCss.indexOf(cssBlockStart) : stylesCss.indexOf(altCssBlockStart);

const newStyles = `/* ==========================================================================
   14. ZOHO BILLING - EDIT CUSTOMER FORM (Pixel-Perfect Match to Screenshot Reference)
   ========================================================================== */
.zoho-reference-edit-customer-page {
  background: #FFFFFF;
  min-height: calc(100vh - var(--header-height, 65px));
  padding: 1.5rem 2.5rem 4rem;
  max-width: 1040px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: #1F2937;
}

.zoho-edit-header-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1rem;
}

.zoho-edit-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.btn-zoho-back {
  background: #F3F4F6;
  border: 1px solid #E5E7EB;
  color: #4B5563;
  width: 30px;
  height: 30px;
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

/* Prefill banner */
.zoho-gst-banner-row {
  background-color: #EFF6FF;
  border: 1px solid #DBEAFE;
  border-radius: 6px;
  padding: 9px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #1E40AF;
  margin-bottom: 1.75rem;
}

.gst-banner-icon {
  font-size: 15px;
}

.gst-prefill-link {
  color: #2563EB;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

.gst-prefill-link:hover {
  text-decoration: underline;
}

/* Clean Form Grid */
.zoho-clean-edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.zoho-form-row {
  display: flex;
  align-items: flex-start;
  min-height: 36px;
}

.zoho-row-label {
  width: 170px;
  flex-shrink: 0;
  font-size: 13.5px;
  color: #374151;
  font-weight: 500;
  padding-top: 8px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.zoho-row-label.required {
  color: #DC2626;
}

.zoho-info-glyph {
  font-size: 12px;
  color: #9CA3AF;
  cursor: help;
}

.zoho-row-control {
  flex: 1;
  max-width: 650px;
}

/* Clean Form Inputs matching reference */
.zoho-input-text {
  width: 100%;
  height: 36px;
  box-sizing: border-box;
  padding: 0 12px;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  background: #FFFFFF;
  font-size: 13.5px;
  color: #1F2937;
  outline: none;
  font-family: inherit;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.zoho-input-text:focus {
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.zoho-input-select {
  height: 36px;
  box-sizing: border-box;
  padding: 0 10px;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  background: #FFFFFF;
  font-size: 13.5px;
  color: #1F2937;
  outline: none;
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.zoho-input-select:focus {
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

/* Radio Group */
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
}

/* Primary Contact 3-col */
.zoho-primary-contact-row {
  display: grid;
  grid-template-columns: 110px 1fr 1fr;
  gap: 10px;
  max-width: 520px;
}

/* Email with icon */
.zoho-email-field-box {
  position: relative;
  max-width: 440px;
  display: flex;
  align-items: center;
}

.email-prefix-icon {
  position: absolute;
  left: 10px;
  color: #9CA3AF;
  font-size: 14px;
  pointer-events: none;
}

.email-input {
  padding-left: 32px;
}

/* Phone Field & Anchoring (Screenshot Match!) */
.phone-field-container-row {
  position: relative;
}

.phone-anchor-cell {
  position: relative;
}

.zoho-single-phone-input-row {
  display: flex;
  gap: 8px;
  max-width: 440px;
}

.phone-code-select {
  width: 80px;
  flex-shrink: 0;
}

.phone-input {
  flex: 1;
}

/* Duplicate Phone Alert Line (Screenshot Match) */
.zoho-duplicate-phone-alert {
  margin-top: 7px;
  font-size: 12.5px;
  color: #EA580C;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
}

.btn-toggle-existing-records {
  background: none;
  border: none;
  color: #2563EB;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 0 3px;
}

.btn-toggle-existing-records:hover {
  text-decoration: underline;
}

/* MATCHING CUSTOMER RECORDS FLOATING DROPDOWN CARD (PIXEL-PERFECT SCREENSHOT MATCH) */
.matching-customers-card {
  position: absolute;
  top: -120px;
  left: 450px;
  width: 375px;
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #CBD5E1;
  z-index: 1000;
  display: none;
  overflow: hidden;
}

.matching-customers-card.show {
  display: block;
}

.matching-card-header {
  background: #FAFAFA;
  border-bottom: 1px solid #E5E7EB;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 700;
  color: #374151;
}

.matching-records-scroll-list {
  max-height: 360px;
  overflow-y: auto;
}

.matching-customer-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid #F1F5F9;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.matching-customer-item:hover {
  background: #F9FAFB;
}

/* Active Highlight Item in Blue (Screenshot Match) */
.matching-customer-item.active {
  background: #2563EB;
  color: #FFFFFF;
}

.matching-avatar-circle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #E5E7EB;
  color: #6B7280;
  font-weight: 700;
  font-size: 13.5px;
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
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 3px;
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
  gap: 5px;
  font-size: 11.5px;
  margin-top: 2px;
}

.matching-customer-item.active .matching-meta-line {
  color: rgba(255, 255, 255, 0.95);
}

.matching-customer-item:not(.active) .matching-meta-line {
  color: #6B7280;
}

/* Responsive positioning for dropdown: never cut off */
@media (max-width: 1180px) {
  .matching-customers-card {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    width: 380px;
    max-width: 100%;
  }
}

/* Tabs Bar */
.zoho-reference-tabs-bar {
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid #E5E7EB;
  margin-top: 2rem;
  margin-bottom: 1.5rem;
}

.zoho-ref-tab-btn {
  background: none;
  border: none;
  padding: 10px 4px;
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
  cursor: pointer;
  position: relative;
  transition: color 0.15s ease;
}

.zoho-ref-tab-btn:hover {
  color: #111827;
}

.zoho-ref-tab-btn.active {
  color: #2563EB;
  font-weight: 600;
}

.zoho-ref-tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #2563EB;
}

.zoho-tab-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.zoho-gstin-input-group {
  display: flex;
  gap: 10px;
  max-width: 440px;
}

.gstin-input {
  border-color: #F87171;
}

.btn-zoho-taxpayer-fetch {
  background: #FFFFFF;
  border: 1px solid #D1D5DB;
  color: #374151;
  padding: 0 14px;
  border-radius: 4px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.btn-zoho-taxpayer-fetch:hover {
  background: #F9FAFB;
}

.zoho-mandatory-warning-text {
  margin-top: 6px;
  font-size: 12px;
  color: #EF4444;
}

/* Address Dual Columns */
.zoho-address-dual-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 860px;
}

.zoho-addr-col-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #F3F4F6;
}

.addr-title {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}

.link-copy-address {
  font-size: 12.5px;
  color: #2563EB;
  text-decoration: none;
  font-weight: 500;
}

.link-copy-address:hover {
  text-decoration: underline;
}

.zoho-addr-fields-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.addr-field-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.addr-field-item label {
  font-size: 12.5px;
  color: #4B5563;
  font-weight: 500;
}

/* Footer Actions */
.zoho-edit-footer-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #E5E7EB;
}

.btn-zoho-save-primary {
  background: #2563EB;
  color: #FFFFFF;
  border: none;
  padding: 8px 22px;
  border-radius: 4px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-zoho-save-primary:hover {
  background: #1D4ED8;
}

.btn-zoho-cancel-secondary {
  background: #FFFFFF;
  color: #374151;
  border: 1px solid #D1D5DB;
  padding: 8px 18px;
  border-radius: 4px;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-zoho-cancel-secondary:hover {
  background: #F9FAFB;
}
`;

if (cssIdx !== -1) {
  stylesCss = stylesCss.substring(0, cssIdx) + newStyles;
} else {
  stylesCss += '\n' + newStyles;
}

fs.writeFileSync(stylesCssPath, stylesCss, 'utf8');
console.log('styles.css updated successfully!');
