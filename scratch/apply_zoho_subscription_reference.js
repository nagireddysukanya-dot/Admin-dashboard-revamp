const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
const dbPath = path.join(__dirname, '..', 'backend', 'config', 'db.js');
const cssPath = path.join(__dirname, '..', 'frontend', 'css', 'styles.css');
const htmlPath = path.join(__dirname, '..', 'frontend', 'index.html');

console.log('--- Applying Zoho Subscription Reference Page ---');

// 1. Update Backend db.js for client 10
let db = fs.readFileSync(dbPath, 'utf8');
const oldDbClient10 = `  {
    id: 10,
    s_no: 10,
    client_uuid: 'cli_solaris_010',
    name: 'Solaris Green Energy #2',`;

const newDbClient10 = `  {
    id: 10,
    s_no: 10,
    client_uuid: 'cli_deepak_010',
    name: 'deepak',
    company_name: 'feso',
    legal_name: 'FESO SOCIAL MEDIA PRIVATE LIMITED',`;

if (db.includes(oldDbClient10)) {
  db = db.replace(oldDbClient10, newDbClient10);
  db = db.replace(
    "email: 'client20@solarisgre.com',",
    "email: 'suryadesigner1234@gmail.com',"
  );
  db = db.replace(
    "subscription_id: 'SUB-SOLARIS-2026'",
    "subscription_id: 'SUB-01083',\n    billing_address: {\n      attention: 'deepak',\n      company: 'feso',\n      line1: 'test',\n      line2: 'test',\n      city: 'Hyderabad',\n      state: 'Telangana',\n      pin: '500034',\n      country: 'India'\n    },\n    shipping_address: {\n      attention: '',\n      company: '',\n      line1: '',\n      line2: '',\n      city: '',\n      state: 'Telangana',\n      pin: '',\n      country: 'India'\n    }"
  );
  fs.writeFileSync(dbPath, db, 'utf8');
  console.log('✓ Updated backend db.js client 10 to deepak');
}

// 2. Update Frontend app.js client 10
let js = fs.readFileSync(jsPath, 'utf8');

const oldClient10Js = `        id: 10, s_no: 10, name: 'Solaris Green Energy #2', phone_number: '+91-9800009460', alternate_phone: '+91-9100006220',
        email: 'client20@solarisgre.com', customer_type: 'Direct', account_type: 'Client Accounts',
        plan_name: 'Pro NM', plan_type: 'Paid_plan', billing_cycle: 'Monthly',
        subscription_amount_display: '₹ 4,999.00', inr_amount: 4999, usd_amount: 65, end_date: '15-02-2027',
        days_left: 141, bots_limit: 25, bots_used: 0, chats_limit: 50000, chats_used: 2400,
        service_chats_limit: 1000, service_chats_used: 0, bi_chats_limit: 5000, bi_chats_used: 0,
        gst_number: '36AAACH7020R1ZZ', url: 'solarisgre.com',
        test_account: 'No', subscription_status: 'Active', sales_person: 'Rahul Sharma',
        support_person: 'Kiran Kumar', currency_type: 'INR', zoho_customer_id: '3141005000009490020', subscription_id: 'SUB-SOLARIS-2026',
        deployment_type: 'On-Premise', server_host: 'Solaris Private On-Prem Datacenter - Node A1', cluster_health: '🟢 100% Operational', engine_version: 'v4.2.0 Enterprise Node', license_key: 'LIC-ONPREM-2026-X010'`;

const newClient10Js = `        id: 10, s_no: 10, name: 'deepak', phone_number: '+91-9705736759', alternate_phone: '',
        email: 'suryadesigner1234@gmail.com', customer_type: 'Direct', account_type: 'Client Accounts',
        company_name: 'feso', legal_name: 'FESO SOCIAL MEDIA PRIVATE LIMITED',
        plan_name: 'Starter New Monthly (Without WA)', plan_type: 'Paid_plan', billing_cycle: 'Monthly',
        subscription_amount_display: '₹ 1,890.00', inr_amount: 1890, usd_amount: 25, end_date: '27-11-2026',
        days_left: 30, bots_limit: 5, bots_used: 1, chats_limit: 1000, chats_used: 120,
        service_chats_limit: 1000, service_chats_used: 120, bi_chats_limit: 500, bi_chats_used: 0,
        gst_number: '', gst_treatment: 'Unregistered Business', url: 'feso.in',
        test_account: 'No', subscription_status: 'Active', sales_person: 'Rahul Sharma',
        support_person: 'Sukanya Nagireddy', currency_type: 'INR', zoho_customer_id: 'ZC-01083', subscription_id: 'SUB-01083',
        billing_address: {
          attention: 'deepak',
          company: 'feso',
          line1: 'test',
          line2: 'test',
          city: 'Hyderabad',
          state: 'Telangana',
          pin: '500034',
          country: 'India'
        },
        shipping_address: {
          attention: '',
          company: '',
          line1: '',
          line2: '',
          city: '',
          state: 'Telangana',
          pin: '',
          country: 'India'
        }`;

const regexClient10 = /id:\s*10,\s*s_no:\s*10,\s*name:\s*'Solaris Green Energy #2'[\s\S]*?license_key:\s*'LIC-ONPREM-2026-X010'/;
if (regexClient10.test(js)) {
  js = js.replace(regexClient10, newClient10Js.trim());
  console.log('✓ Updated frontend app.js client 10 to deepak');
}

// 3. Add 'change-subscription' and 'new-subscription' route in navigateTo & routeTitles
if (!js.includes("'change-subscription': 'Change Subscription'")) {
  js = js.replace(
    "'subscription': 'Edit Customer',",
    "'subscription': 'Edit Customer',\n      'change-subscription': 'Change Subscription',\n      'new-subscription': 'Change Subscription',"
  );
  console.log('✓ Registered change-subscription route title');
}

if (!js.includes("route === 'change-subscription'")) {
  js = js.replace(
    "} else if (route === 'subscription' || route === 'edit-customer') {",
    "} else if (route === 'change-subscription' || route === 'new-subscription') {\n      renderZohoSubscriptionView(viewport);\n    } else if (route === 'subscription' || route === 'edit-customer') {"
  );
  console.log('✓ Registered route handler for change-subscription and new-subscription');
}

// 4. Update sidebar Subscriptions item to include a '+' plus button
const oldSidebarSubLink = `<a class="nav-link-item \${currentRoute === 'subscriptions' || currentRoute === 'subscription' || currentRoute === 'edit-customer' ? 'active' : ''}" onclick="window.smatApp.navigateTo('subscriptions')">
              <span class="nav-link-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
              </span>
              <span>Active Subscriptions</span>
            </a>`;

const newSidebarSubLink = `<a class="nav-link-item \${currentRoute === 'subscriptions' || currentRoute === 'change-subscription' || currentRoute === 'new-subscription' || currentRoute === 'subscription' || currentRoute === 'edit-customer' ? 'active' : ''}" onclick="window.smatApp.navigateTo('subscriptions')" style="display:flex; align-items:center; justify-content:space-between;">
              <div style="display:flex; align-items:center; gap:0.55rem;">
                <span class="nav-link-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                </span>
                <span>Subscriptions</span>
              </div>
              <span class="sidebar-add-plus-btn" onclick="event.stopPropagation(); window.smatApp.openZohoSubscription(null);" title="New / Change Subscription">+</span>
            </a>`;

if (js.includes(oldSidebarSubLink)) {
  js = js.replace(oldSidebarSubLink, newSidebarSubLink);
  console.log('✓ Added plus button to sidebar Subscriptions');
}

// 5. In Active Subscriptions view, add action button for Full Zoho Page and update table rows
if (!js.includes('window.smatApp.openZohoSubscription(null)')) {
  js = js.replace(
    `<button class="btn-table-action btn-action-primary" onclick="window.smatApp.openAddSubscriptionModal()">
            ⚡ + Add Subscription
          </button>`,
    `<button class="btn-table-action btn-action-primary" onclick="window.smatApp.openZohoSubscription(10)" title="Open exact Zoho Change Subscription flow matching screenshots" style="background:#1877F2; border-color:#1877F2;">
            ⚡ + Change / New Subscription
          </button>
          <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.openAddSubscriptionModal()" title="Open Quick Modal">
            + Quick Modal
          </button>`
  );
  console.log('✓ Added Change/New Subscription button in Active Subscriptions header');
}

// 6. Implement renderZohoSubscriptionView and helper functions
const zohoSubscriptionViewImplementation = `
  // =========================================================================
  // 7A. ZOHO BILLING STYLE "CHANGE / NEW SUBSCRIPTION" FULL-PAGE MODULE
  // Exact 100% Pixel-Perfect Match with User's 4 Reference Screenshots
  // =========================================================================
  let zohoSubscriptionClientId = 10; // Defaults to deepak - suryadesigner1234@gmail.com
  let zohoSubAddons = [
    {
      id: 'extra_chats_oc_nm',
      name: 'Extra Chats OC NM',
      desc: '1 UNIT : 1000 CHATS ( Excluding WhatsApp )',
      sac: '998314',
      qty: 1,
      unit: 'Extra Chats OC NM',
      price: 600,
      discountVal: 0,
      discountType: 'percent',
      taxRate: 18
    }
  ];

  function openZohoSubscription(clientId) {
    if (clientId !== undefined && clientId !== null) {
      zohoSubscriptionClientId = Number(clientId);
    } else {
      zohoSubscriptionClientId = 10; // Default to deepak (screenshot 1)
    }
    navigateTo('change-subscription');
  }

  function onZohoSubCustomerSelect(clientId) {
    zohoSubscriptionClientId = Number(clientId);
    const viewport = document.getElementById('route-viewport');
    if (viewport) {
      renderZohoSubscriptionView(viewport);
    }
  }

  function renderZohoSubscriptionView(container) {
    const currClient = clientsData.find(c => c.id === zohoSubscriptionClientId || c.id === Number(zohoSubscriptionClientId)) || clientsData[0] || {
      id: 10,
      name: 'deepak',
      email: 'suryadesigner1234@gmail.com',
      company_name: 'feso',
      subscription_id: 'SUB-01083',
      plan_name: 'Starter New Monthly (Without WA)',
      gst_treatment: 'Unregistered Business',
      billing_address: { company: 'feso', line1: 'test', line2: 'test', city: 'Hyderabad', pin: '500034', country: 'India' }
    };

    const bAddress = currClient.billing_address || {
      company: currClient.company_name || 'feso',
      line1: 'test',
      line2: 'test',
      city: 'Hyderabad',
      pin: '500034',
      country: 'India'
    };

    const sAddress = currClient.shipping_address || {};
    const hasShipping = sAddress.line1 || sAddress.city;

    // Available plans matching user's separated plans
    const planOptions = [
      { label: 'Starter New Monthly (Without WA)', price: 1890, cycle: 'per month', group: 'Monthly Plans' },
      { label: 'Pro - Monthly (₹6,500)', price: 6500, cycle: 'per month', group: 'Monthly Plans' },
      { label: 'Broadcast - Monthly (₹1,499)', price: 1499, cycle: 'per month', group: 'Monthly Plans' },
      { label: 'Standard - Monthly (₹3,500)', price: 3500, cycle: 'per month', group: 'Monthly Plans' },
      { label: 'AI Enterprise - Monthly (₹8,999)', price: 8999, cycle: 'per month', group: 'Monthly Plans' },
      { label: 'Starter New Yearly (₹18,900)', price: 18900, cycle: 'per year', group: 'Yearly Plans' },
      { label: 'Pro - Yearly (₹72,000)', price: 72000, cycle: 'per year', group: 'Yearly Plans' },
      { label: 'Broadcast - Yearly (₹14,500)', price: 14500, cycle: 'per year', group: 'Yearly Plans' },
      { label: 'Standard - Yearly (₹35,000)', price: 35000, cycle: 'per year', group: 'Yearly Plans' },
      { label: 'AI Enterprise - Yearly (₹96,000)', price: 96000, cycle: 'per year', group: 'Yearly Plans' },
      { label: 'Pro Trial (₹0 / 14 Days)', price: 0, cycle: '14 days evaluation', group: 'Trial' }
    ];

    // Find currently selected plan in list
    const currentPlanName = currClient.plan_name || 'Starter New Monthly (Without WA)';
    const matchedPlan = planOptions.find(p => p.label.toLowerCase().includes(currentPlanName.toLowerCase())) || planOptions[0];

    container.innerHTML = \`
      <div class="zoho-sub-fullpage-wrap" style="background:#FFFFFF; min-height:100vh; padding-bottom:5rem;">
        
        <!-- Sticky Top Title Bar (Screenshot 1) -->
        <div style="padding:1.25rem 2.5rem; border-bottom:1px solid #E5E7EB; background:#FFFFFF; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <button onclick="window.smatApp.navigateTo('subscriptions')" style="background:none; border:none; color:#6B7280; font-size:1.1rem; cursor:pointer;" title="Back to Subscriptions">←</button>
            <h1 style="font-size:1.35rem; font-weight:700; color:#111827; margin:0;">Change Subscription</h1>
          </div>
          <div style="font-size:0.8rem; color:#6B7280;">
            Official SmatBot Billing Engine • Zoho Subscriptions Integration
          </div>
        </div>

        <div style="padding:2rem 2.5rem; max-width:1150px;">

          <!-- SECTION 1: CUSTOMER SELECTION & ADDRESS (SCREENSHOT 1) -->
          <div class="zoho-form-grid" style="display:flex; flex-direction:column; gap:1.75rem;">
            
            <!-- 1. Customer Name Row -->
            <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:flex-start;">
              <label style="font-size:0.88rem; font-weight:600; color:#DC2626; padding-top:6px;">
                Customer Name*
              </label>
              <div>
                <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap;">
                  
                  <!-- Searchable Dropdown Combo (Screenshot 1) -->
                  <div style="position:relative; width:440px;">
                    <select id="zoho-sub-client-select" class="zoho-select-dropdown" style="width:100%; font-size:0.86rem; border-color:#93C5FD;" onchange="window.smatApp.onZohoSubCustomerSelect(this.value)">
                      \${clientsData.map(c => \`
                        <option value="\${c.id}" \${c.id === currClient.id ? 'selected' : ''}>
                          \${escapeHtml(c.name)} - \${escapeHtml(c.email)}
                        </option>
                      \`).join('')}
                    </select>
                  </div>

                  <!-- Quick Search Glass Button (Screenshot 1) -->
                  <button type="button" class="zoho-btn-search" style="background:#2563EB; border-color:#2563EB; padding:0.5rem 0.75rem;" onclick="document.getElementById('zoho-sub-client-select').focus();" title="Quick Search Customer">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </button>

                  <!-- Currency Pill (Screenshot 1) -->
                  <span class="zoho-currency-pill" style="background:#ECFDF5; border-color:#A7F3D0; color:#065F46;">
                    <span style="width:7px; height:7px; background:#10B981; border-radius:50%; display:inline-block;"></span> \${currClient.currency_type || 'INR'}
                  </span>

                  <!-- Customer Name Right Chip (Screenshot 1) -->
                  <div style="margin-left:auto; background:#1F2937; color:#F9FAFB; padding:0.45rem 1rem; border-radius:4px; font-size:0.82rem; font-weight:500; display:flex; align-items:center; gap:0.5rem;">
                    <span>\${escapeHtml(currClient.name)} - \${escapeHtml(currClient.email.substring(0, 14))}...</span>
                    <span>›</span>
                  </div>
                </div>

                <!-- Addresses Cards (Screenshot 1: Billing & Shipping Address) -->
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:2.5rem; max-width:620px; margin-top:1.25rem;">
                  <!-- Billing Address Card -->
                  <div style="font-size:0.85rem; color:#374151; line-height:1.45;">
                    <div style="display:flex; align-items:center; gap:6px; font-size:0.75rem; font-weight:700; color:#6B7280; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.4rem;">
                      <span>BILLING ADDRESS</span>
                      <span style="cursor:pointer; font-size:0.85rem;" title="Edit Billing Address">✏️</span>
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
                      <span style="cursor:pointer; font-size:0.85rem;" title="Edit Shipping Address">✏️</span>
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
                </div>
              </div>
            </div>

            <!-- 2. E-MAIL TO Row (Screenshot 1) -->
            <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:center;">
              <label style="font-size:0.85rem; font-weight:600; color:#4B5563;">
                E-MAIL TO
              </label>
              <div style="display:flex; align-items:center; gap:1.25rem;">
                <button type="button" class="zoho-btn-new-contact" style="display:inline-flex; align-items:center; gap:5px; color:#2563EB; font-weight:600; font-size:0.84rem; background:none; border:none; cursor:pointer;">
                  <span style="font-size:1.1rem; line-height:1;">⊕</span> New Contact Person
                </button>
                <label style="display:inline-flex; align-items:center; gap:6px; font-size:0.85rem; color:#111827; cursor:pointer;">
                  <input type="checkbox" checked style="accent-color:#2563EB;" />
                  <span>\${escapeHtml(currClient.email)}</span>
                </label>
              </div>
            </div>

            <!-- 3. GST Details Row (Screenshot 1: Billing & Shipping Recipient) -->
            <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:flex-start;">
              <div></div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:2.5rem; max-width:620px; font-size:0.83rem;">
                <!-- Billing Recipient GST Details -->
                <div>
                  <div style="display:flex; align-items:center; gap:6px; font-size:0.75rem; font-weight:700; color:#6B7280; text-transform:uppercase; margin-bottom:0.35rem;">
                    <span>BILLING RECIPIENT GST DETAILS</span>
                    <span style="cursor:pointer;">✏️</span>
                  </div>
                  <div style="color:#374151;">
                    GST Treatment: <span style="font-weight:600; color:#111827;">\${escapeHtml(currClient.gst_treatment || 'Unregistered Business')}</span> ✏️
                  </div>
                </div>

                <!-- Shipping Recipient GST Details -->
                <div>
                  <div style="display:flex; align-items:center; gap:6px; font-size:0.75rem; font-weight:700; color:#6B7280; text-transform:uppercase; margin-bottom:0.35rem;">
                    <span>SHIPPING RECIPIENT GST DETAILS</span>
                    <span style="cursor:pointer;">✏️</span>
                  </div>
                  <div style="color:#4B5563;">GSTIN: <span style="color:#111827; font-weight:500;">\${escapeHtml(currClient.gst_number || '')}</span></div>
                  <div style="color:#4B5563;">Business Legal Name: <span style="color:#111827; font-weight:500;">\${escapeHtml(currClient.legal_name || '')}</span></div>
                </div>
              </div>
            </div>

            <!-- 4. Place of Supply* (Screenshot 1) -->
            <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:center;">
              <label style="font-size:0.88rem; font-weight:600; color:#DC2626;">
                Place of Supply*
              </label>
              <div>
                <select id="zoho-sub-supply-state" class="zoho-select-dropdown" style="max-width:320px; font-size:0.85rem;">
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
            <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:center;">
              <label style="font-size:0.88rem; font-weight:600; color:#DC2626;">
                Select Product*
              </label>
              <div style="font-weight:600; color:#111827; font-size:0.9rem;">
                SmatBot
              </div>
            </div>

          </div>

          <!-- SECTION 2: PLAN & ADDONS TABLE (SCREENSHOT 2) -->
          <div style="margin-top:2.5rem; padding-top:1.5rem; border-top:1px solid #E5E7EB;">
            
            <!-- Plan Header & Preferences -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <h2 style="font-size:1.15rem; font-weight:700; color:#111827; margin:0;">Plan</h2>
              <div style="display:flex; align-items:center; gap:0.6rem;">
                <select id="zoho-sub-discount-pref" class="zoho-select-dropdown" style="max-width:140px; padding:0.35rem 0.65rem; font-size:0.8rem;">
                  <option value="item-level" selected>Item-Level</option>
                  <option value="transaction-level">Transaction-Level</option>
                  <option value="no-discount">No Discounts</option>
                </select>
                <select id="zoho-sub-renewal-freq" class="zoho-select-dropdown" style="max-width:140px; padding:0.35rem 0.65rem; font-size:0.8rem;">
                  <option value="every-renewal" selected>Every Renewal</option>
                  <option value="one-time">One-Time Only</option>
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
                    
                    <!-- Plan Thumbnail & Name & SAC Badge -->
                    <td style="padding:1rem;">
                      <div style="display:flex; gap:0.75rem;">
                        <div style="width:38px; height:38px; background:#F3F4F6; border:1px solid #E5E7EB; border-radius:4px; display:flex; align-items:center; justify-content:center; color:#9CA3AF; flex-shrink:0;">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                        </div>
                        <div style="flex:1;">
                          <div style="display:flex; align-items:center; justify-content:space-between;">
                            <select id="zoho-plan-select" style="font-weight:600; color:#111827; border:1px solid transparent; background:none; font-size:0.88rem; width:100%; outline:none; cursor:pointer;" onchange="window.smatApp.onZohoPlanChange(this.value)">
                              <optgroup label="── 📅 MONTHLY PLANS ──">
                                <option value="Starter New Monthly (Without WA)|1890" \${currentPlanName.includes('Starter') && !currentPlanName.includes('Yearly') ? 'selected' : ''}>Starter New Monthly (Without WA)</option>
                                <option value="Pro - Monthly|6500" \${currentPlanName.includes('Pro') && !currentPlanName.includes('Yearly') && !currentPlanName.includes('Trial') ? 'selected' : ''}>Pro - Monthly (₹6,500)</option>
                                <option value="Broadcast - Monthly|1499">Broadcast - Monthly (₹1,499)</option>
                                <option value="Standard - Monthly|3500">Standard - Monthly (₹3,500)</option>
                                <option value="AI Enterprise - Monthly|8999">AI Enterprise - Monthly (₹8,999)</option>
                              </optgroup>
                              <optgroup label="── ⭐ YEARLY PLANS (SAVE UP TO 20%) ──">
                                <option value="Starter New Yearly|18900">Starter New Yearly (₹18,900)</option>
                                <option value="Pro - Yearly|72000" \${currentPlanName.includes('Yearly') ? 'selected' : ''}>Pro - Yearly (₹72,000)</option>
                                <option value="Broadcast - Yearly|14500">Broadcast - Yearly (₹14,500)</option>
                                <option value="Standard - Yearly|35000">Standard - Yearly (₹35,000)</option>
                                <option value="AI Enterprise - Yearly|96000">AI Enterprise - Yearly (₹96,000)</option>
                              </optgroup>
                              <optgroup label="── EVALUATION / TRIAL ──">
                                <option value="Pro Trial|0" \${currentPlanName.includes('Trial') ? 'selected' : ''}>Pro Trial (₹0 / 14 Days)</option>
                              </optgroup>
                            </select>
                            <span style="color:#9CA3AF; cursor:pointer; font-size:0.9rem;" title="Reset Plan">✕</span>
                          </div>
                          
                          <!-- Plan Description Input (Screenshot 2) -->
                          <input type="text" id="zoho-plan-desc" placeholder="Add description to your plan" style="width:100%; border:none; background:#F9FAFB; padding:4px 8px; font-size:0.8rem; color:#4B5563; border-radius:4px; margin-top:4px; outline:none;" />
                          
                          <!-- SAC Code Badge (Screenshot 2) -->
                          <div style="margin-top:6px; display:inline-flex; align-items:center; gap:4px;">
                            <span style="background:#059669; color:#FFFFFF; font-size:0.68rem; font-weight:700; padding:1px 5px; border-radius:3px;">SERVICE</span>
                            <span style="font-size:0.75rem; color:#2563EB; font-weight:600;">SAC: 998314 ✏️</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <!-- Quantity -->
                    <td style="padding:1rem 0.75rem; text-align:center;">
                      <input type="number" id="zoho-plan-qty" value="1" min="1" style="width:55px; text-align:center; border:1px solid #D1D5DB; border-radius:4px; padding:4px; font-size:0.85rem;" oninput="window.smatApp.updateZohoSubCalculations()" />
                    </td>

                    <!-- Price -->
                    <td style="padding:1rem 0.75rem; text-align:right;">
                      <input type="number" id="zoho-plan-price" value="\${matchedPlan.price}" style="width:85px; text-align:right; border:1px solid #D1D5DB; border-radius:4px; padding:4px; font-size:0.85rem;" oninput="window.smatApp.updateZohoSubCalculations()" />
                    </td>

                    <!-- Point 1: Plan Discount (% / ₹) (Screenshot 2) -->
                    <td style="padding:1rem 0.75rem; text-align:center;">
                      <div style="display:inline-flex; align-items:center; gap:2px; border:1px solid #D1D5DB; border-radius:4px; padding:1px 4px; background:#FFFFFF;">
                        <input type="number" id="zoho-plan-disc-val" value="0" min="0" style="width:45px; border:none; text-align:center; font-size:0.85rem; outline:none;" oninput="window.smatApp.updateZohoSubCalculations()" />
                        <select id="zoho-plan-disc-type" style="border:none; background:none; font-size:0.8rem; color:#4B5563; outline:none; cursor:pointer;" onchange="window.smatApp.updateZohoSubCalculations()">
                          <option value="percent">% ⌄</option>
                          <option value="flat">₹ ⌄</option>
                        </select>
                      </div>
                    </td>

                    <!-- Tax (Screenshot 2) -->
                    <td style="padding:1rem 0.75rem;">
                      <select id="zoho-plan-tax" style="border:1px solid #D1D5DB; border-radius:4px; padding:4px; font-size:0.8rem; width:100%;" onchange="window.smatApp.updateZohoSubCalculations()">
                        <option value="18" selected>GST18 [18%]</option>
                        <option value="12">GST12 [12%]</option>
                        <option value="5">GST5 [5%]</option>
                        <option value="0">None [0%]</option>
                      </select>
                    </td>

                    <!-- Live Amount -->
                    <td style="padding:1rem; text-align:right;">
                      <div id="zoho-plan-row-amount" style="font-weight:700; color:#111827; font-size:0.92rem;">Rs. \${matchedPlan.price.toLocaleString('en-IN')}.00</div>
                      <div style="font-size:0.74rem; color:#6B7280; margin-top:2px;">\${matchedPlan.cycle}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Addons Header (Screenshot 2) -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <h2 style="font-size:1.15rem; font-weight:700; color:#111827; margin:0;">Addons</h2>
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
                <tbody id="zoho-addons-tbody">
                  \${zohoSubAddons.map((addon, idx) => \`
                    <tr style="border-bottom:1px solid #F3F4F6; vertical-align:top;" id="zoho-addon-row-\${idx}">
                      <!-- Addon Name & Description & SAC -->
                      <td style="padding:1rem;">
                        <div style="display:flex; gap:0.6rem; align-items:flex-start;">
                          <span style="color:#9CA3AF; cursor:grab; font-size:1.1rem; line-height:1; padding-top:4px;">⠿</span>
                          <div style="width:38px; height:38px; background:#F3F4F6; border:1px solid #E5E7EB; border-radius:4px; display:flex; align-items:center; justify-content:center; color:#9CA3AF; flex-shrink:0;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                          </div>
                          <div style="flex:1;">
                            <div style="display:flex; align-items:center; justify-content:space-between;">
                              <select style="font-weight:600; color:#111827; border:none; background:none; font-size:0.86rem; width:100%; outline:none;" onchange="window.smatApp.onZohoAddonChange(\${idx}, this.value)">
                                <option value="Extra Chats OC NM|600|1 UNIT : 1000 CHATS ( Excluding WhatsApp )" \${addon.name.includes('Extra Chats') ? 'selected' : ''}>Extra Chats OC NM</option>
                                <option value="+10,000 Conversations Quota|1500|Monthly conversational messages booster" \${addon.name.includes('10,000') ? 'selected' : ''}>+10,000 Conversations Quota</option>
                                <option value="+1 Dedicated WhatsApp WABA Number|2500|Official Meta cloud number channel" \${addon.name.includes('WABA') ? 'selected' : ''}>+1 Dedicated WhatsApp WABA Number</option>
                                <option value="+1 Additional Live Agent Seat|800|Multi-agent live chat seat" \${addon.name.includes('Live Agent') ? 'selected' : ''}>+1 Additional Live Agent Seat</option>
                                <option value="AI Integration Booster|2000|Dialogflow & OpenAI Vector Embeddings" \${addon.name.includes('AI Integration') ? 'selected' : ''}>AI Integration Booster</option>
                              </select>
                              <span style="color:#DC2626; cursor:pointer; font-size:0.95rem; margin-left:6px;" onclick="window.smatApp.removeZohoSubAddonRow(\${idx})" title="Remove Add-on">✕</span>
                            </div>
                            <div style="font-size:0.75rem; color:#6B7280; margin-top:3px;">
                              \${addon.desc}
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
                        <input type="number" id="zoho-addon-qty-\${idx}" value="\${addon.qty}" min="1" style="width:55px; text-align:center; border:1px solid #D1D5DB; border-radius:4px; padding:4px; font-size:0.85rem;" oninput="window.smatApp.updateZohoSubCalculations()" />
                        <div style="font-size:0.72rem; color:#6B7280; margin-top:4px;">\${escapeHtml(addon.unit || addon.name)}</div>
                      </td>

                      <!-- Price -->
                      <td style="padding:1rem 0.75rem; text-align:right;">
                        <input type="number" id="zoho-addon-price-\${idx}" value="\${addon.price}" style="width:85px; text-align:right; border:1px solid #D1D5DB; border-radius:4px; padding:4px; font-size:0.85rem;" oninput="window.smatApp.updateZohoSubCalculations()" />
                      </td>

                      <!-- Point 2: Add-on Discount (% / ₹) (Screenshot 2) -->
                      <td style="padding:1rem 0.75rem; text-align:center;">
                        <div style="display:inline-flex; align-items:center; gap:2px; border:1px solid #D1D5DB; border-radius:4px; padding:1px 4px; background:#FFFFFF;">
                          <input type="number" id="zoho-addon-disc-val-\${idx}" value="\${addon.discountVal || 0}" min="0" style="width:45px; border:none; text-align:center; font-size:0.85rem; outline:none;" oninput="window.smatApp.updateZohoSubCalculations()" />
                          <select id="zoho-addon-disc-type-\${idx}" style="border:none; background:none; font-size:0.8rem; color:#4B5563; outline:none; cursor:pointer;" onchange="window.smatApp.updateZohoSubCalculations()">
                            <option value="percent" \${addon.discountType === 'percent' ? 'selected' : ''}>% ⌄</option>
                            <option value="flat" \${addon.discountType === 'flat' ? 'selected' : ''}>₹ ⌄</option>
                          </select>
                        </div>
                      </td>

                      <!-- Tax -->
                      <td style="padding:1rem 0.75rem;">
                        <select id="zoho-addon-tax-\${idx}" style="border:1px solid #D1D5DB; border-radius:4px; padding:4px; font-size:0.8rem; width:100%;" onchange="window.smatApp.updateZohoSubCalculations()">
                          <option value="18" \${addon.taxRate === 18 ? 'selected' : ''}>GST18 [18%]</option>
                          <option value="12" \${addon.taxRate === 12 ? 'selected' : ''}>GST12 [12%]</option>
                          <option value="5" \${addon.taxRate === 5 ? 'selected' : ''}>GST5 [5%]</option>
                          <option value="0" \${addon.taxRate === 0 ? 'selected' : ''}>None [0%]</option>
                        </select>
                      </td>

                      <!-- Live Amount -->
                      <td style="padding:1rem; text-align:right;">
                        <div id="zoho-addon-amount-\${idx}" style="font-weight:700; color:#111827; font-size:0.92rem;">Rs. \${(addon.price * addon.qty).toLocaleString('en-IN')}.00</div>
                      </td>
                    </tr>
                  \`).join('')}
                </tbody>
              </table>
            </div>

            <!-- Add New Row Button (Screenshot 3) -->
            <div style="margin-bottom:2rem;">
              <button type="button" class="btn-table-action btn-action-secondary" onclick="window.smatApp.addZohoSubAddonRow()" style="font-size:0.84rem; display:inline-flex; align-items:center; gap:6px; color:#2563EB;">
                <span>⊕ Add New Row</span>
                <span style="font-size:0.75rem;">⌄</span>
              </button>
            </div>

          </div>

          <!-- SECTION 3: SUBSCRIPTION TERM (SCREENSHOT 3) -->
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
          </div>

          <!-- SECTION 5: POINT 3 LIVE FINAL BILLING SUMMARY CARD -->
          <div style="margin-top:2.5rem; background:#F0F7FF; border:1px solid #BFDBFE; border-radius:8px; padding:1.25rem 1.5rem; max-width:650px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <span style="font-size:0.92rem; font-weight:700; color:#1E40AF;">🧾 3. Live Final Billing Summary</span>
              <span style="font-size:0.75rem; color:#2563EB; background:#DBEAFE; padding:3px 8px; border-radius:4px; font-weight:600;">SAC: 998314 • GST 18%</span>
            </div>
            <div style="display:flex; flex-direction:column; gap:0.4rem; font-size:0.86rem; color:#374151;">
              <div style="display:flex; justify-content:space-between;">
                <span>Plan Price:</span>
                <span id="zoho-sum-plan-price" style="font-weight:600;">Rs. \${matchedPlan.price.toLocaleString('en-IN')}.00</span>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span>Add-on Boosters Subtotal:</span>
                <span id="zoho-sum-addons-price" style="font-weight:600;">+ Rs. 600.00</span>
              </div>
              <div style="display:flex; justify-content:space-between; color:#DC2626;">
                <span>Discounts Deducted (Plan & Add-on):</span>
                <span id="zoho-sum-disc-price" style="font-weight:600;">- Rs. 0.00</span>
              </div>
              <div style="display:flex; justify-content:space-between; padding-top:0.4rem; border-top:1px dashed #BFDBFE;">
                <span>Taxable Amount (Net Base):</span>
                <span id="zoho-sum-taxable-price" style="font-weight:600;">Rs. 2,490.00</span>
              </div>
              <div style="display:flex; justify-content:space-between; color:#4B5563;">
                <span>GST (18% Software Services):</span>
                <span id="zoho-sum-tax-price" style="font-weight:600;">+ Rs. 448.20</span>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; padding-top:0.6rem; margin-top:0.25rem; border-top:2px solid #93C5FD; font-size:1.02rem; font-weight:800; color:#1E3A8A;">
                <span>Customer Final Payable Amount:</span>
                <span id="zoho-sum-final-price" style="color:#1D4ED8; font-size:1.15rem;">Rs. 2,938.20</span>
              </div>
            </div>
          </div>

          <!-- SECTION 6: BOTTOM STICKY ACTION BAR (SCREENSHOT 4) -->
          <div style="display:flex; align-items:center; gap:0.75rem; margin-top:2.5rem; padding-top:1.5rem; border-top:1px solid #E5E7EB;">
            <button type="button" class="zoho-btn-continue" onclick="window.smatApp.saveZohoSubscription()" style="background:#1877F2; border:1px solid #1877F2; color:#FFFFFF; padding:0.6rem 2rem; border-radius:4px; font-weight:600; font-size:0.9rem; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,0.05);">
              Continue
            </button>
            <button type="button" class="zoho-btn-cancel" onclick="window.smatApp.navigateTo('subscriptions')" style="background:#FFFFFF; border:1px solid #D1D5DB; color:#374151; padding:0.6rem 1.5rem; border-radius:4px; font-weight:500; font-size:0.9rem; cursor:pointer;">
              Cancel
            </button>
          </div>

        </div>
      </div>
    \`;

    updateZohoSubCalculations();
  }

  function onZohoPlanChange(val) {
    if (!val) return;
    const parts = val.split('|');
    const price = parseFloat(parts[1]) || 0;
    const priceInput = document.getElementById('zoho-plan-price');
    if (priceInput) priceInput.value = price;
    updateZohoSubCalculations();
  }

  function onZohoAddonChange(idx, val) {
    if (!val || !zohoSubAddons[idx]) return;
    const parts = val.split('|');
    zohoSubAddons[idx].name = parts[0];
    zohoSubAddons[idx].price = parseFloat(parts[1]) || 0;
    zohoSubAddons[idx].desc = parts[2] || '';
    const priceInput = document.getElementById(\`zoho-addon-price-\${idx}\`);
    if (priceInput) priceInput.value = zohoSubAddons[idx].price;
    updateZohoSubCalculations();
  }

  function addZohoSubAddonRow() {
    zohoSubAddons.push({
      id: \`addon_\${Date.now()}\`,
      name: '+10,000 Conversations Quota',
      desc: 'Monthly conversational messages booster',
      sac: '998314',
      qty: 1,
      unit: '+10,000 Quota',
      price: 1500,
      discountVal: 0,
      discountType: 'percent',
      taxRate: 18
    });
    const viewport = document.getElementById('route-viewport');
    if (viewport) renderZohoSubscriptionView(viewport);
  }

  function removeZohoSubAddonRow(idx) {
    if (zohoSubAddons.length <= 1) {
      alert('At least one line item is required.');
      return;
    }
    zohoSubAddons.splice(idx, 1);
    const viewport = document.getElementById('route-viewport');
    if (viewport) renderZohoSubscriptionView(viewport);
  }

  function updateZohoSubCalculations() {
    // 1. Plan Calculation
    const planPrice = parseFloat(document.getElementById('zoho-plan-price')?.value) || 0;
    const planQty = parseInt(document.getElementById('zoho-plan-qty')?.value, 10) || 1;
    const planBase = planPrice * planQty;

    const planDiscVal = parseFloat(document.getElementById('zoho-plan-disc-val')?.value) || 0;
    const planDiscType = document.getElementById('zoho-plan-disc-type')?.value || 'percent';
    let planDiscountAmt = 0;
    if (planDiscType === 'percent') {
      planDiscountAmt = (planBase * Math.min(100, Math.max(0, planDiscVal))) / 100;
    } else {
      planDiscountAmt = Math.min(planBase, Math.max(0, planDiscVal));
    }

    const planNet = Math.max(0, planBase - planDiscountAmt);
    const planAmountEl = document.getElementById('zoho-plan-row-amount');
    if (planAmountEl) {
      planAmountEl.innerText = \`Rs. \${planNet.toLocaleString('en-IN')}.00\`;
    }

    // 2. Addons Calculation
    let totalAddonsBase = 0;
    let totalAddonsDiscount = 0;

    zohoSubAddons.forEach((addon, idx) => {
      const aQty = parseInt(document.getElementById(\`zoho-addon-qty-\${idx}\`)?.value, 10) || 1;
      const aPrice = parseFloat(document.getElementById(\`zoho-addon-price-\${idx}\`)?.value) || 0;
      const aBase = aQty * aPrice;

      const aDiscVal = parseFloat(document.getElementById(\`zoho-addon-disc-val-\${idx}\`)?.value) || 0;
      const aDiscType = document.getElementById(\`zoho-addon-disc-type-\${idx}\`)?.value || 'percent';
      let aDiscAmt = 0;
      if (aDiscType === 'percent') {
        aDiscAmt = (aBase * Math.min(100, Math.max(0, aDiscVal))) / 100;
      } else {
        aDiscAmt = Math.min(aBase, Math.max(0, aDiscVal));
      }

      totalAddonsBase += aBase;
      totalAddonsDiscount += aDiscAmt;

      const aRowAmtEl = document.getElementById(\`zoho-addon-amount-\${idx}\`);
      if (aRowAmtEl) {
        aRowAmtEl.innerText = \`Rs. \${Math.max(0, aBase - aDiscAmt).toLocaleString('en-IN')}.00\`;
      }
    });

    // 3. Combined Final Billing & 18% Tax (Point 3)
    const totalDiscounts = planDiscountAmt + totalAddonsDiscount;
    const taxableBase = Math.max(0, (planBase + totalAddonsBase) - totalDiscounts);
    const taxRate = 0.18;
    const taxAmt = Math.round(taxableBase * taxRate * 100) / 100;
    const finalTotal = taxableBase + taxAmt;

    // Update Summary Elements
    const sPlan = document.getElementById('zoho-sum-plan-price');
    if (sPlan) sPlan.innerText = \`Rs. \${planBase.toLocaleString('en-IN')}.00\`;

    const sAddons = document.getElementById('zoho-sum-addons-price');
    if (sAddons) sAddons.innerText = \`+ Rs. \${totalAddonsBase.toLocaleString('en-IN')}.00\`;

    const sDisc = document.getElementById('zoho-sum-disc-price');
    if (sDisc) sDisc.innerText = \`- Rs. \${totalDiscounts.toLocaleString('en-IN')}.00\`;

    const sTaxable = document.getElementById('zoho-sum-taxable-price');
    if (sTaxable) sTaxable.innerText = \`Rs. \${taxableBase.toLocaleString('en-IN')}.00\`;

    const sTax = document.getElementById('zoho-sum-tax-price');
    if (sTax) sTax.innerText = \`+ Rs. \${taxAmt.toLocaleString('en-IN')}.00\`;

    const sFinal = document.getElementById('zoho-sum-final-price');
    if (sFinal) sFinal.innerText = \`Rs. \${finalTotal.toLocaleString('en-IN')}.00\`;
  }

  function saveZohoSubscription() {
    const currClient = clientsData.find(c => c.id === zohoSubscriptionClientId || c.id === Number(zohoSubscriptionClientId)) || clientsData[0];
    if (!currClient) {
      alert('Please select a valid customer.');
      return;
    }

    const planVal = document.getElementById('zoho-plan-select')?.value || 'Starter New Monthly (Without WA)|1890';
    const planName = planVal.split('|')[0].replace(/\\(.*\\)/g, '').trim();
    const subNum = document.getElementById('zoho-sub-num')?.value || 'SUB-01083';
    const salesPerson = document.getElementById('zoho-sub-sales')?.value || currClient.sales_person || 'Rahul Sharma';
    const gstNum = document.getElementById('zoho-sub-gst')?.value || currClient.gst_number || '';
    const finalPriceText = document.getElementById('zoho-sum-final-price')?.innerText || 'Rs. 2,938.20';
    const finalPrice = parseFloat(finalPriceText.replace(/[^0-9.]/g, '')) || 2938.2;

    // Update client record
    currClient.plan_name = planName;
    currClient.subscription_id = subNum;
    currClient.sales_person = salesPerson;
    currClient.gst_number = gstNum;
    currClient.subscription_status = 'Active';
    currClient.inr_amount = Math.round(finalPrice);
    currClient.subscription_amount_display = \`₹ \${Math.round(finalPrice).toLocaleString('en-IN')}.00\`;
    currClient.final_billing = {
      plan_name: planName,
      subscription_id: subNum,
      sales_person: salesPerson,
      final_payable: finalPrice,
      payment_mode: 'Offline',
      payment_terms: document.getElementById('zoho-sub-terms')?.value || 'Due on Receipt',
      customer_notes: document.getElementById('zoho-sub-notes')?.value || '',
      updated_at: new Date().toISOString()
    };

    alert(\`✓ Subscription \${subNum} for \${currClient.name} successfully updated!\`);
    navigateTo('subscriptions');
  }
`;

if (!js.includes('function renderZohoSubscriptionView')) {
  js = js.replace(
    'function renderSubscriptionCreationView(container) {',
    zohoSubscriptionViewImplementation + '\n\n  function renderSubscriptionCreationView(container) {'
  );
  console.log('✓ Added renderZohoSubscriptionView and helper functions');
}

// 7. Export in window.smatApp
if (!js.includes('openZohoSubscription,')) {
  js = js.replace(
    'openAddSubscriptionModal,',
    'openAddSubscriptionModal,\n    openZohoSubscription,\n    renderZohoSubscriptionView,\n    onZohoSubCustomerSelect,\n    onZohoPlanChange,\n    onZohoAddonChange,\n    addZohoSubAddonRow,\n    removeZohoSubAddonRow,\n    updateZohoSubCalculations,\n    saveZohoSubscription,'
  );
  console.log('✓ Exported Zoho Subscription helpers in window.smatApp');
}

fs.writeFileSync(jsPath, js, 'utf8');

// 8. Add styles in styles.css
let css = fs.readFileSync(cssPath, 'utf8');
const customZohoStyles = `
/* ==========================================================================
   ZOHO SUBSCRIPTIONS EXACT REFERENCE STYLING
   ========================================================================== */
.zoho-sub-fullpage-wrap {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #111827;
}
.sidebar-add-plus-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: #1877F2;
  color: #FFFFFF;
  border-radius: 3px;
  font-size: 0.85rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  margin-left: auto;
  transition: all 0.15s ease;
}
.sidebar-add-plus-btn:hover {
  background: #1664D8;
  transform: scale(1.1);
}
.zoho-btn-continue {
  background: #1877F2 !important;
  border-color: #1877F2 !important;
}
.zoho-btn-continue:hover {
  background: #1664D8 !important;
  border-color: #1664D8 !important;
}
`;

if (!css.includes('.zoho-sub-fullpage-wrap')) {
  css += '\n' + customZohoStyles;
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('✓ Added Zoho Subscriptions CSS styling');
}

// 9. Bump version in index.html to v=8.1
let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace('styles.css?v=7.4', 'styles.css?v=8.1');
html = html.replace('app.js?v=8.0', 'app.js?v=8.1');
fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✓ Bumped cache-busting to v=8.1 in index.html');

console.log('🎉 Successfully applied Zoho Subscription Reference Page!');
