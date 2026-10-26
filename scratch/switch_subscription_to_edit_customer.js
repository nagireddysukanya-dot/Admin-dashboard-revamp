const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
let js = fs.readFileSync(jsPath, 'utf8');

// 1. In navigateTo, route === 'subscription' must render renderZohoEditCustomerView
js = js.replace(
  /} else if \(route === 'edit-customer'\) \{\s*renderZohoEditCustomerView\(viewport\);\s*\} else if \(route === 'subscription'\) \{\s*renderSubscriptionCreationView\(viewport\);/g,
  `} else if (route === 'subscription' || route === 'edit-customer') {
      renderZohoEditCustomerView(viewport);`
);

// 2. Set title for 'subscription' to 'Edit Customer'
js = js.replace(
  "'subscription': 'Subscriptions — Zoho Billing Portal',",
  "'subscription': 'Edit Customer',\n      'edit-customer': 'Edit Customer',"
);

// 3. Make renderSubscriptionCreationView delegate directly to renderZohoEditCustomerView
js = js.replace(
  /function renderSubscriptionCreationView\(container\) \{[\s\S]*?container\.innerHTML = `[\s\S]*?<\/form>\s*<\/div>\s*`;\s*\}/g,
  `function renderSubscriptionCreationView(container) {
    renderZohoEditCustomerView(container);
  }`
);

// 4. In renderZohoEditCustomerView, make Display Name a dropdown matching Screenshot 2: deepak - suryadesigner1234@gmail.com
const oldDisplayNameRow = `          <!-- 4. Display Name* -->
          <div class="zoho-cust-row">
            <div class="zoho-cust-label required">
              <span>Display Name*</span>
              <span class="zoho-info-icon" title="Customer unique identity name for invoices and billing receipts">ⓘ</span>
            </div>
            <div class="zoho-cust-content">
              <input type="text" id="cust-display-name" class="zoho-cust-input" value="\${escapeHtml(displayName)}" required />
            </div>
          </div>`;

const newDisplayNameRow = `          <!-- 4. Display Name* (Dropdown matching Screenshot 2) -->
          <div class="zoho-cust-row">
            <div class="zoho-cust-label required">
              <span>Display Name*</span>
              <span class="zoho-info-icon" title="Customer unique identity name for invoices and billing receipts">ⓘ</span>
            </div>
            <div class="zoho-cust-content">
              <select id="cust-display-name-select" class="zoho-cust-select" style="width:100%;" onchange="window.smatApp.onZohoCustomerSelectChange(this.value)">
                \${clientsData.map(c => \`
                  <option value="\${c.id}" \${c.id === currClient.id ? 'selected' : ''}>
                    \${escapeHtml(c.name)} - \${escapeHtml(c.email)}
                  </option>
                \`).join('')}
              </select>
            </div>
          </div>`;

if (js.includes(oldDisplayNameRow)) {
  js = js.replace(oldDisplayNameRow, newDisplayNameRow);
}

// 5. Add onZohoCustomerSelectChange function
const onCustomerChangeFn = `  function onZohoCustomerSelectChange(clientId) {
    zohoSelectedClientId = isNaN(clientId) ? clientId : Number(clientId);
    const viewport = document.getElementById('route-viewport');
    if (viewport) {
      renderZohoEditCustomerView(viewport);
    }
  }`;

if (!js.includes('function onZohoCustomerSelectChange')) {
  js = js.replace('function openZohoEditCustomer(', onCustomerChangeFn + '\n\n  function openZohoEditCustomer(');
}

// 6. Export onZohoCustomerSelectChange in window.smatApp
if (!js.includes('onZohoCustomerSelectChange,')) {
  js = js.replace('openZohoEditCustomer,', 'onZohoCustomerSelectChange,\n    openZohoEditCustomer,');
}

fs.writeFileSync(jsPath, js, 'utf8');
console.log('Successfully switched subscription route to render Edit Customer view!');
