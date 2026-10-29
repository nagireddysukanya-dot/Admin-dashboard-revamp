const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
const stylesCssPath = path.join(__dirname, '..', 'frontend', 'css', 'styles.css');

let appJs = fs.readFileSync(appJsPath, 'utf8');
let stylesCss = fs.readFileSync(stylesCssPath, 'utf8');

// 1. Update onPhoneInputChange in app.js
const oldPhoneInputFunc = `  function onPhoneInputChange(val) {
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

const newPhoneInputFunc = `  function onPhoneInputChange(val) {
    const warning = $('#phone-matching-warning-container');
    const triangle = $('#phone-warning-triangle-icon');
    const dropdown = $('#matching-customers-dropdown');
    const phoneInput = $('#cust-phone');
    const isMatching = checkPhoneDuplicates(val);

    if (warning) {
      warning.style.display = isMatching ? 'flex' : 'none';
    }
    if (triangle) {
      triangle.style.display = isMatching ? 'flex' : 'none';
    }
    if (phoneInput) {
      if (isMatching) phoneInput.classList.add('has-warning-icon');
      else phoneInput.classList.remove('has-warning-icon');
    }

    if (!isMatching) {
      matchingRecordsDropdownOpen = false;
      if (dropdown) dropdown.classList.remove('show');
      const arrow = $('#matching-records-toggle-arrow');
      if (arrow) arrow.textContent = '▾';
    }
  }`;

appJs = appJs.replace(oldPhoneInputFunc, newPhoneInputFunc);

// 2. Update Phone Row markup in renderZohoEditCustomerView
const oldPhoneMarkup = `              <div class="zoho-single-phone-input-row">
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
              </div>`;

const newPhoneMarkup = `              <div class="zoho-single-phone-input-row">
                <select class="zoho-input-select phone-code-select" id="cust-phone-code">
                  <option value="+91" selected>+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+971">+971</option>
                </select>
                <div class="zoho-phone-input-inner-wrapper">
                  <input 
                    type="text" 
                    id="cust-phone" 
                    class="zoho-input-text phone-input \${isDuplicate ? 'has-warning-icon' : ''}" 
                    placeholder="Work Phone" 
                    value="\${escapeHtml(currClient.phone_number || '')}" 
                    oninput="window.smatApp.onPhoneInputChange(this.value)" 
                  />
                  <!-- Orange Warning Triangle inside input on right (Screenshot 2 Match) -->
                  <div id="phone-warning-triangle-icon" class="phone-input-warning-triangle" style="display:\${isDuplicate ? 'flex' : 'none'};" title="Phone number already exists in records">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Warning Note: ONLY SHOWN IF DUPLICATE PHONE EXISTS (Screenshot 2 Match) -->
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
                  <span id="matching-records-toggle-arrow">▾</span>
                </button>
              </div>`;

if (!appJs.includes(oldPhoneMarkup)) {
  console.error('Could not find oldPhoneMarkup in app.js');
  process.exit(1);
}

appJs = appJs.replace(oldPhoneMarkup, newPhoneMarkup);
fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('Successfully updated app.js with warning triangle and real-time detection!');

// 3. Update styles.css with inner input wrapper, warning triangle, and matching card positioning (Screenshot 2 & 3 match)
const oldPhoneCss = `.zoho-single-phone-input-row {
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
}`;

const newPhoneCss = `.zoho-single-phone-input-row {
  display: flex;
  gap: 8px;
  max-width: 440px;
}

.phone-code-select {
  width: 80px;
  flex-shrink: 0;
}

.zoho-phone-input-inner-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.phone-input {
  width: 100%;
}

.phone-input.has-warning-icon {
  padding-right: 36px;
}

/* Orange Warning Triangle inside input on right (Screenshot 2 Match) */
.phone-input-warning-triangle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

/* Duplicate Phone Alert Line (Screenshot 2 Match) */
.zoho-duplicate-phone-alert {
  margin-top: 6px;
  font-size: 12.5px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.alert-orange-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.alert-muted-text {
  color: #6B7280;
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
  padding: 0 2px;
}

.btn-toggle-existing-records:hover {
  text-decoration: underline;
}

/* MATCHING CUSTOMER RECORDS FLOATING DROPDOWN CARD (Screenshot 3 Match) */
.matching-customers-card {
  position: absolute;
  bottom: 26px;
  left: 88px;
  width: 385px;
  max-width: 95vw;
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.16), 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #CBD5E1;
  z-index: 1000;
  display: none;
  overflow: hidden;
}

@media (max-width: 680px) {
  .matching-customers-card {
    bottom: auto;
    top: 100%;
    left: 0;
    width: 100%;
    margin-top: 8px;
  }
}`;

if (!stylesCss.includes(oldPhoneCss)) {
  console.error('Could not find oldPhoneCss in styles.css');
  process.exit(1);
}

stylesCss = stylesCss.replace(oldPhoneCss, newPhoneCss);
fs.writeFileSync(stylesCssPath, stylesCss, 'utf8');
console.log('Successfully updated styles.css with warning triangle and Screenshot 3 dropdown positioning!');
