const fs = require('fs');
const path = require('path');

// 1. Update frontend/css/styles.css
const cssPath = path.join(__dirname, '..', 'frontend', 'css', 'styles.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

const disabledCss = `
/* Disabled Customer Name in Change Subscription (User Reference Match) */
.zoho-customer-disabled-wrap,
.zoho-customer-disabled-wrap * {
  cursor: not-allowed !important;
}

#zoho-sub-client-select:disabled {
  cursor: not-allowed !important;
  background-color: #F8FAFC !important;
  color: #334155 !important;
  border-color: #CBD5E1 !important;
}
`;

if (!cssContent.includes('.zoho-customer-disabled-wrap')) {
  cssContent += '\n' + disabledCss;
  fs.writeFileSync(cssPath, cssContent, 'utf8');
  console.log('Added disabled customer styles to styles.css');
}

// 2. Update frontend/js/app.js
const appPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');
let norm = appContent.replace(/\r\n/g, '\n');

const oldCustomerBlock = `                  <!-- Searchable Dropdown Combo (Screenshot 1) -->
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
                  <button type="button" class="zoho-btn-search" style="background:#3B82F6; border:1px solid #3B82F6; border-radius:4px; padding:0.45rem 0.75rem; color:#FFFFFF; cursor:pointer;" onclick="document.getElementById('zoho-sub-client-select').focus();" title="Quick Search Customer">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </button>`;

const newCustomerBlock = `                  <!-- Disabled Customer Field (Fixed for Existing Subscription) -->
                  <div class="zoho-customer-disabled-wrap" style="position:relative; width:440px; cursor:not-allowed;" title="Customer cannot be changed for an existing subscription">
                    <select id="zoho-sub-client-select" class="zoho-select-dropdown" disabled style="width:100%; font-size:0.86rem; border:1px solid #CBD5E1; background:#F8FAFC; color:#334155; cursor:not-allowed; padding:7px 12px; border-radius:4px;" title="Customer cannot be changed for an existing subscription">
                      <option value="\${currClient.id}" selected>
                        \${escapeHtml(currClient.name)} - \${escapeHtml(currClient.email)}
                      </option>
                    </select>
                  </div>

                  <!-- Quick Search Glass Button (Disabled) -->
                  <button type="button" class="zoho-btn-search" disabled style="background:#94A3B8; border:1px solid #94A3B8; border-radius:4px; padding:0.45rem 0.75rem; color:#FFFFFF; cursor:not-allowed; opacity:0.75;" title="Customer cannot be changed for an existing subscription">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </button>`;

if (norm.includes(oldCustomerBlock)) {
  norm = norm.replace(oldCustomerBlock, newCustomerBlock);
  fs.writeFileSync(appPath, norm.replace(/\n/g, '\r\n'), 'utf8');
  console.log('Successfully updated Customer Name to disabled with not-allowed cursor in app.js');
} else {
  console.log('Error: oldCustomerBlock not found in app.js');
}
