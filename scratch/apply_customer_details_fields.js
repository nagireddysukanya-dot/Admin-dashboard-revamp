const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../frontend/js/app.js');
let raw = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to \n for consistent matching, then save
const isCRLF = raw.includes('\r\n');
let content = raw.replace(/\r\n/g, '\n');

console.log('Original content length (normalized):', content.length);

// 1. Update Document Upload section & add removeUploadedDoc
const oldUploadSection = `  function handleDocumentUpload(input) {
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
  }`;

const newUploadSection = `  let uploadedCustomerDocs = [];
  function handleDocumentUpload(input) {
    if (input && input.files && input.files.length > 0) {
      const newFiles = Array.from(input.files).map(f => ({
        name: f.name,
        size: f.size,
        type: f.type,
        lastModified: f.lastModified
      }));
      uploadedCustomerDocs = uploadedCustomerDocs.concat(newFiles);
      showToast('Uploaded ' + input.files.length + ' file(s)');
      renderUploadedCustomerDocsList();
    }
  }

  function renderUploadedCustomerDocsList(docs) {
    const listEl = document.getElementById('uploaded-docs-list');
    const items = docs || uploadedCustomerDocs;
    if (!listEl) return;
    if (!items || items.length === 0) {
      listEl.innerHTML = '';
      return;
    }
    listEl.innerHTML = items.map((f, i) => {
      const name = typeof f === 'string' ? f : (f.name || 'document');
      const sizeKb = f.size ? Math.round(f.size / 1024) + ' KB' : '';
      return \`
        <span class="uploaded-doc-chip" style="display:inline-flex; align-items:center; gap:6px; background:#F1F5F9; border:1px solid #CBD5E1; padding:3px 8px; border-radius:4px; font-size:12px; margin:2px 4px 2px 0;">
          <span>📎 \${escapeHtml(name)} \${sizeKb ? \`(\${sizeKb})\` : ''}</span>
          <button type="button" onclick="window.smatApp.removeUploadedDoc(\${i})" style="border:none; background:none; cursor:pointer; color:#94A3B8; font-weight:700;" title="Remove file">✕</button>
        </span>
      \`;
    }).join('');
  }

  function removeUploadedDoc(index) {
    if (uploadedCustomerDocs && uploadedCustomerDocs.length > index) {
      uploadedCustomerDocs.splice(index, 1);
      renderUploadedCustomerDocsList();
    }
  }`;

if (!content.includes(oldUploadSection)) {
  console.error('ERROR: oldUploadSection not found in app.js');
  process.exit(1);
}
content = content.replace(oldUploadSection, newUploadSection);
console.log('Step 1 complete: Updated handleDocumentUpload');

// 2. Update handleZohoSaveAndSubscribe to ensure subscription is active
const oldSaveAndSubscribe = `  function handleZohoSaveAndSubscribe(e) {
    if (e && e.preventDefault) e.preventDefault();
    handleZohoEditCustomerSubmit(e || { preventDefault: () => {} });
    showToast('Customer saved and subscription activated successfully in Zoho Billing!');
  }`;

const newSaveAndSubscribe = `  function handleZohoSaveAndSubscribe(e) {
    if (e && e.preventDefault) e.preventDefault();
    let currClient = clientsData.find(c => c.id === zohoSelectedClientId);
    if (currClient) {
      currClient.subscription_status = 'Active';
    }
    handleZohoEditCustomerSubmit(e || { preventDefault: () => {} });
    showToast('Customer saved and subscription activated successfully in Zoho Billing!');
  }`;

if (!content.includes(oldSaveAndSubscribe)) {
  console.error('ERROR: oldSaveAndSubscribe not found in app.js');
  process.exit(1);
}
content = content.replace(oldSaveAndSubscribe, newSaveAndSubscribe);
console.log('Step 2 complete: Updated handleZohoSaveAndSubscribe');

// 3. Update handleZohoEditCustomerSubmit to save all 14 fields
const oldSubmitStart = `  function handleZohoEditCustomerSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    let currClient = clientsData.find(c => c.id === zohoSelectedClientId);
    const isNew = !currClient;

    const firstName = document.getElementById('cust-first-name')?.value.trim() || '';
    const lastName = document.getElementById('cust-last-name')?.value.trim() || '';
    const company = document.getElementById('cust-company-name')?.value.trim() || '';
    const email = document.getElementById('cust-email')?.value.trim() || '';
    const phone = document.getElementById('cust-phone')?.value.trim() || document.getElementById('cust-mobile-phone')?.value.trim() || '';
    const gstTreatment = document.getElementById('cust-gst-treatment')?.value || 'Unregistered Business';
    const isReg = isGstRegisteredTreatment(gstTreatment);
    const gstin = isReg ? (document.getElementById('cust-gstin-input')?.value.trim() || '') : '';

    if (!email && !company && !firstName) {
      showToast('⚠️ Please enter customer email or name.');
      return;
    }

    if (isNew) {
      const newId = clientsData.length ? Math.max(...clientsData.map(c => c.id || 0)) + 1 : 101;
      currClient = {
        id: newId,
        s_no: clientsData.length + 1,
        name: company || (firstName + ' ' + lastName).trim() || email.split('@')[0],
        email: email,
        phone_number: phone,
        company_name: company || (firstName + ' ' + lastName).trim(),
        plan_name: 'Standard',
        plan_type: 'Paid_plan',
        subscription_status: 'Active',
        billing_cycle: 'Monthly',
        subscription_amount_display: '₹ 3,500.00',
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
        days_left: 30,
        zoho_customer_id: 'ZC-' + (900000 + newId),
        gst_treatment: gstTreatment,
        gst_number: isReg ? (gstin || '-') : '-'
      };
      clientsData.unshift(currClient);
      zohoSelectedClientId = currClient.id;
    } else {
      if (company) currClient.name = company;
      else if (firstName || lastName) currClient.name = (firstName + ' ' + lastName).trim();
      if (company) currClient.company_name = company;
      if (email) currClient.email = email;
      if (phone) currClient.phone_number = phone;
      currClient.gst_treatment = gstTreatment;
      currClient.gst_number = isReg ? (gstin || '-') : '-';
    }

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
    showToast(\`✅ Customer details saved successfully in Zoho Billing (\${currClient.name || currClient.email})!\`);
    navigateTo('subscriptions');
  }`;

const newSubmitStart = `  function handleZohoEditCustomerSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    let currClient = clientsData.find(c => c.id === zohoSelectedClientId);
    const isNew = !currClient;

    const firstName = document.getElementById('cust-first-name')?.value.trim() || '';
    const lastName = document.getElementById('cust-last-name')?.value.trim() || '';
    const company = document.getElementById('cust-company-name')?.value.trim() || '';
    const email = document.getElementById('cust-email')?.value.trim() || '';
    const phoneCode = document.getElementById('cust-phone-code')?.value || '+91';
    const rawPhone = document.getElementById('cust-phone')?.value.trim() || document.getElementById('cust-mobile-phone')?.value.trim() || '';
    const phone = rawPhone;
    const language = document.getElementById('cust-language')?.value || 'English';
    const gstTreatment = document.getElementById('cust-gst-treatment')?.value || 'Unregistered Business';
    const isReg = isGstRegisteredTreatment(gstTreatment);
    const gstin = isReg ? (document.getElementById('cust-gstin-input')?.value.trim() || '') : '';
    const placeOfSupply = document.getElementById('cust-place-of-supply')?.value || '[TS] - Telangana';
    const pan = document.getElementById('cust-pan')?.value.trim().toUpperCase() || '';
    const legalName = document.getElementById('cust-legal-name')?.value.trim() || '';
    const tradeName = document.getElementById('cust-trade-name')?.value.trim() || '';
    const taxPrefRadio = document.querySelector('input[name="tax_preference"]:checked');
    const taxPreference = taxPrefRadio ? taxPrefRadio.value : 'Taxable';
    const currency = document.getElementById('cust-currency')?.value || 'INR- Indian Rupee';
    const paymentTerms = document.getElementById('cust-payment-terms')?.value || 'Due on Receipt';

    // Expandable details
    const website = document.getElementById('cust-website')?.value.trim() || '';
    const department = document.getElementById('cust-department')?.value.trim() || document.getElementById('cust-dept')?.value.trim() || '';
    const designation = document.getElementById('cust-designation')?.value.trim() || '';
    const xTwitter = document.getElementById('cust-x-twitter')?.value.trim() || '';
    const skype = document.getElementById('cust-skype')?.value.trim() || '';
    const facebook = document.getElementById('cust-facebook')?.value.trim() || '';

    // Billing Address
    const billAttention = document.getElementById('bill-attention')?.value || '';
    const billCountry = document.getElementById('bill-country')?.value || 'India';
    const billLine1 = document.getElementById('bill-address1')?.value || '';
    const billLine2 = document.getElementById('bill-address2')?.value || '';
    const billCity = document.getElementById('bill-city')?.value || '';
    const billState = document.getElementById('bill-state')?.value || 'Telangana';
    const billPin = document.getElementById('bill-pincode')?.value || '';
    const billPhone = document.getElementById('bill-phone')?.value || '';
    const billFax = document.getElementById('bill-fax')?.value || '';

    // Shipping Address
    const shipAttention = document.getElementById('ship-attention')?.value || '';
    const shipCountry = document.getElementById('ship-country')?.value || 'India';
    const shipLine1 = document.getElementById('ship-address1')?.value || '';
    const shipLine2 = document.getElementById('ship-address2')?.value || '';
    const shipCity = document.getElementById('ship-city')?.value || '';
    const shipState = document.getElementById('ship-state')?.value || 'Telangana';
    const shipPin = document.getElementById('ship-pincode')?.value || '';
    const shipPhone = document.getElementById('ship-phone')?.value || '';
    const shipFax = document.getElementById('ship-fax')?.value || '';

    if (!email && !company && !firstName) {
      showToast('⚠️ Please enter customer email or name.');
      return;
    }

    if (isNew) {
      const newId = clientsData.length ? Math.max(...clientsData.map(c => c.id || 0)) + 1 : 101;
      currClient = {
        id: newId,
        s_no: clientsData.length + 1,
        name: company || (firstName + ' ' + lastName).trim() || email.split('@')[0],
        email: email,
        phone_code: phoneCode,
        phone_number: phone,
        language: language,
        company_name: company || (firstName + ' ' + lastName).trim(),
        plan_name: 'Standard',
        plan_type: 'Paid_plan',
        subscription_status: 'Active',
        billing_cycle: 'Monthly',
        subscription_amount_display: '₹ 3,500.00',
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
        days_left: 30,
        zoho_customer_id: 'ZC-' + (900000 + newId),
        gst_treatment: gstTreatment,
        gst_number: isReg ? (gstin || '-') : '-',
        gstin: isReg ? gstin : '',
        place_of_supply: placeOfSupply,
        pan: pan,
        legal_name: legalName,
        trade_name: tradeName,
        tax_preference: taxPreference,
        currency: currency,
        payment_terms: paymentTerms,
        documents: [...uploadedCustomerDocs],
        website: website,
        department: department,
        designation: designation,
        social_links: {
          x: xTwitter,
          skype: skype,
          facebook: facebook
        },
        billing_address: {
          company: company || (firstName + ' ' + lastName).trim(),
          attention: billAttention,
          country: billCountry,
          line1: billLine1,
          line2: billLine2,
          city: billCity,
          state: billState,
          pin: billPin,
          phone: billPhone,
          fax: billFax
        },
        shipping_address: {
          attention: shipAttention,
          country: shipCountry,
          line1: shipLine1,
          line2: shipLine2,
          city: shipCity,
          state: shipState,
          pin: shipPin,
          phone: shipPhone,
          fax: shipFax
        }
      };
      clientsData.unshift(currClient);
      zohoSelectedClientId = currClient.id;
    } else {
      if (company) currClient.name = company;
      else if (firstName || lastName) currClient.name = (firstName + ' ' + lastName).trim();
      if (company) currClient.company_name = company;
      if (email) currClient.email = email;
      currClient.phone_code = phoneCode;
      if (phone) currClient.phone_number = phone;
      currClient.language = language;
      currClient.gst_treatment = gstTreatment;
      currClient.gst_number = isReg ? (gstin || '-') : '-';
      currClient.gstin = isReg ? gstin : '';
      currClient.place_of_supply = placeOfSupply;
      currClient.pan = pan;
      currClient.legal_name = legalName;
      currClient.trade_name = tradeName;
      currClient.tax_preference = taxPreference;
      currClient.currency = currency;
      currClient.payment_terms = paymentTerms;
      if (uploadedCustomerDocs && uploadedCustomerDocs.length > 0) {
        currClient.documents = [...uploadedCustomerDocs];
      }
      currClient.website = website;
      currClient.department = department;
      currClient.designation = designation;
      currClient.social_links = {
        x: xTwitter,
        skype: skype,
        facebook: facebook
      };
      currClient.billing_address = {
        company: company || currClient.name,
        attention: billAttention,
        country: billCountry,
        line1: billLine1,
        line2: billLine2,
        city: billCity,
        state: billState,
        pin: billPin,
        phone: billPhone,
        fax: billFax
      };
      currClient.shipping_address = {
        attention: shipAttention,
        country: shipCountry,
        line1: shipLine1,
        line2: shipLine2,
        city: shipCity,
        state: shipState,
        pin: shipPin,
        phone: shipPhone,
        fax: shipFax
      };
    }

    localStorage.setItem('smatbot_clients_data', JSON.stringify(clientsData));

    // Backward-compatible background sync with server if client exists
    if (currClient && currClient.id && typeof fetch === 'function') {
      try {
        fetch('/api/clients/' + currClient.id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currClient)
        }).catch(() => {});
      } catch (err) {}
    }

    showToast(\`✅ Customer details saved successfully in Zoho Billing (\${currClient.name || currClient.email})!\`);
    navigateTo('subscriptions');
  }`;

if (!content.includes(oldSubmitStart)) {
  console.error('ERROR: oldSubmitStart not found in app.js');
  process.exit(1);
}
content = content.replace(oldSubmitStart, newSubmitStart);
console.log('Step 3 complete: Updated handleZohoEditCustomerSubmit');

// 4. Update clearZohoCustomerFormFields
const oldClearFields = `  function clearZohoCustomerFormFields() {
    // 1. Primary Contact Names
    const firstNameInput = document.getElementById('cust-first-name');
    const lastNameInput = document.getElementById('cust-last-name');
    if (firstNameInput) firstNameInput.value = '';
    if (lastNameInput) lastNameInput.value = '';

    // 2. Company Name
    const compInput = document.getElementById('cust-company-name');
    if (compInput) compInput.value = '';

    // 3. Display Name Dropdown
    const dispSelect = document.getElementById('cust-display-name-select');
    if (dispSelect) dispSelect.value = '';

    // 4. Phone Number & Duplicate Warnings
    const phoneInput = document.getElementById('cust-phone');
    if (phoneInput) {
      phoneInput.value = '';
      onPhoneInputChange('');
    }

    // 5. Customer ID Chip in Header
    const chipEl = document.querySelector('.badge-cust-chip');
    if (chipEl) {
      chipEl.textContent = 'New Customer';
    }

    // 6. GST Treatment & GSTIN
    const gstinInput = document.getElementById('cust-gstin-input');
    const popoverGstin = document.getElementById('popover-gstin-input');
    const gstTreatmentSelect = document.getElementById('cust-gst-treatment');
    if (gstinInput) gstinInput.value = '';
    if (popoverGstin) popoverGstin.value = '';
    if (gstTreatmentSelect) {
      gstTreatmentSelect.value = 'Unregistered Business';
      onGstTreatmentChange('Unregistered Business');
    }

    // 7. Place of Supply, PAN, Legal Name, Trade Name, Website, Dept, Designation, Remarks
    const panEl = document.getElementById('cust-pan');
    const legalEl = document.getElementById('cust-legal-name');
    const tradeEl = document.getElementById('cust-trade-name');
    const webEl = document.getElementById('cust-website');
    const deptEl = document.getElementById('cust-dept');
    const desigEl = document.getElementById('cust-designation');
    const remarksEl = document.getElementById('cust-remarks');

    if (panEl) panEl.value = '';
    if (legalEl) legalEl.value = '';
    if (tradeEl) tradeEl.value = '';
    if (webEl) webEl.value = '';
    if (deptEl) deptEl.value = '';
    if (desigEl) desigEl.value = '';
    if (remarksEl) remarksEl.value = '';

    // 8. Billing Address
    const attentionEl = document.getElementById('bill-attention');
    const addr1El = document.getElementById('bill-address1');
    const addr2El = document.getElementById('bill-address2');
    const cityEl = document.getElementById('bill-city');
    const pinEl = document.getElementById('bill-pincode');
    const phoneBillEl = document.getElementById('bill-phone');
    const faxBillEl = document.getElementById('bill-fax');

    if (attentionEl) attentionEl.value = '';
    if (addr1El) addr1El.value = '';
    if (addr2El) addr2El.value = '';
    if (cityEl) cityEl.value = '';
    if (pinEl) pinEl.value = '';
    if (phoneBillEl) phoneBillEl.value = '';
    if (faxBillEl) faxBillEl.value = '';

    // 9. Shipping Address
    const shipAttEl = document.getElementById('ship-attention');
    const shipAddr1El = document.getElementById('ship-address1');
    const shipAddr2El = document.getElementById('ship-address2');
    const shipCityEl = document.getElementById('ship-city');
    const shipPinEl = document.getElementById('ship-pincode');
    const shipPhoneEl = document.getElementById('ship-phone');
    const shipFaxEl = document.getElementById('ship-fax');

    if (shipAttEl) shipAttEl.value = '';
    if (shipAddr1El) shipAddr1El.value = '';
    if (shipAddr2El) shipAddr2El.value = '';
    if (shipCityEl) shipCityEl.value = '';
    if (shipPinEl) shipPinEl.value = '';
    if (shipPhoneEl) shipPhoneEl.value = '';
    if (shipFaxEl) shipFaxEl.value = '';
  }`;

const newClearFields = `  function clearZohoCustomerFormFields() {
    // 1. Primary Contact Names
    const firstNameInput = document.getElementById('cust-first-name');
    const lastNameInput = document.getElementById('cust-last-name');
    if (firstNameInput) firstNameInput.value = '';
    if (lastNameInput) lastNameInput.value = '';

    // 2. Company Name
    const compInput = document.getElementById('cust-company-name');
    if (compInput) compInput.value = '';

    // 3. Display Name Dropdown
    const dispSelect = document.getElementById('cust-display-name-select');
    if (dispSelect) dispSelect.value = '';

    // 4. Phone Number & Duplicate Warnings
    const phoneCodeEl = document.getElementById('cust-phone-code');
    const phoneInput = document.getElementById('cust-phone');
    if (phoneCodeEl) phoneCodeEl.value = '+91';
    if (phoneInput) {
      phoneInput.value = '';
      onPhoneInputChange('');
    }

    // 5. Customer Language
    const langSelect = document.getElementById('cust-language');
    if (langSelect) langSelect.value = 'English';

    // 6. Customer ID Chip in Header
    const chipEl = document.querySelector('.badge-cust-chip');
    if (chipEl) {
      chipEl.textContent = 'New Customer';
    }

    // 7. GST Treatment & GSTIN
    const gstinInput = document.getElementById('cust-gstin-input');
    const popoverGstin = document.getElementById('popover-gstin-input');
    const gstTreatmentSelect = document.getElementById('cust-gst-treatment');
    if (gstinInput) gstinInput.value = '';
    if (popoverGstin) popoverGstin.value = '';
    if (gstTreatmentSelect) {
      gstTreatmentSelect.value = 'Unregistered Business';
      onGstTreatmentChange('Unregistered Business');
    }

    // 8. Place of Supply, PAN, Legal Name, Trade Name, Tax Preference, Currency, Payment Terms
    const posSelect = document.getElementById('cust-place-of-supply');
    const panEl = document.getElementById('cust-pan');
    const legalEl = document.getElementById('cust-legal-name');
    const tradeEl = document.getElementById('cust-trade-name');
    const currencySelect = document.getElementById('cust-currency');
    const paymentTermsSelect = document.getElementById('cust-payment-terms');
    const taxPrefTaxable = document.querySelector('input[name="tax_preference"][value="Taxable"]');

    if (posSelect) posSelect.value = '[TS] - Telangana';
    if (panEl) panEl.value = '';
    if (legalEl) legalEl.value = '';
    if (tradeEl) tradeEl.value = '';
    if (currencySelect) currencySelect.value = 'INR- Indian Rupee';
    if (paymentTermsSelect) paymentTermsSelect.value = 'Due on Receipt';
    if (taxPrefTaxable) taxPrefTaxable.checked = true;

    // 9. Document Upload
    uploadedCustomerDocs = [];
    const docsList = document.getElementById('uploaded-docs-list');
    if (docsList) docsList.innerHTML = '';

    // 10. Expandable More Details
    const webEl = document.getElementById('cust-website');
    const deptEl = document.getElementById('cust-department') || document.getElementById('cust-dept');
    const desigEl = document.getElementById('cust-designation');
    const xEl = document.getElementById('cust-x-twitter');
    const skypeEl = document.getElementById('cust-skype');
    const fbEl = document.getElementById('cust-facebook');
    const remarksEl = document.getElementById('cust-remarks');

    if (webEl) webEl.value = '';
    if (deptEl) deptEl.value = '';
    if (desigEl) desigEl.value = '';
    if (xEl) xEl.value = '';
    if (skypeEl) skypeEl.value = '';
    if (fbEl) fbEl.value = '';
    if (remarksEl) remarksEl.value = '';

    // 11. Billing Address
    const attentionEl = document.getElementById('bill-attention');
    const countryEl = document.getElementById('bill-country');
    const addr1El = document.getElementById('bill-address1');
    const addr2El = document.getElementById('bill-address2');
    const cityEl = document.getElementById('bill-city');
    const stateEl = document.getElementById('bill-state');
    const pinEl = document.getElementById('bill-pincode');
    const phoneBillEl = document.getElementById('bill-phone');
    const faxBillEl = document.getElementById('bill-fax');

    if (attentionEl) attentionEl.value = '';
    if (countryEl) countryEl.value = 'India';
    if (addr1El) addr1El.value = '';
    if (addr2El) addr2El.value = '';
    if (cityEl) cityEl.value = '';
    if (stateEl) stateEl.value = 'Telangana';
    if (pinEl) pinEl.value = '';
    if (phoneBillEl) phoneBillEl.value = '';
    if (faxBillEl) faxBillEl.value = '';

    // 12. Shipping Address
    const shipAttEl = document.getElementById('ship-attention');
    const shipCountryEl = document.getElementById('ship-country');
    const shipAddr1El = document.getElementById('ship-address1');
    const shipAddr2El = document.getElementById('ship-address2');
    const shipCityEl = document.getElementById('ship-city');
    const shipStateEl = document.getElementById('ship-state');
    const shipPinEl = document.getElementById('ship-pincode');
    const shipPhoneEl = document.getElementById('ship-phone');
    const shipFaxEl = document.getElementById('ship-fax');

    if (shipAttEl) shipAttEl.value = '';
    if (shipCountryEl) shipCountryEl.value = 'India';
    if (shipAddr1El) shipAddr1El.value = '';
    if (shipAddr2El) shipAddr2El.value = '';
    if (shipCityEl) shipCityEl.value = '';
    if (shipStateEl) shipStateEl.value = 'Telangana';
    if (shipPinEl) shipPinEl.value = '';
    if (shipPhoneEl) shipPhoneEl.value = '';
    if (shipFaxEl) shipFaxEl.value = '';
  }`;

if (!content.includes(oldClearFields)) {
  console.error('ERROR: oldClearFields not found in app.js');
  process.exit(1);
}
content = content.replace(oldClearFields, newClearFields);
console.log('Step 4 complete: Updated clearZohoCustomerFormFields');

// 5. Update onEmailInputChange to auto-populate all 14 fields
const oldEmailAutoFillEnd = `      // 7. Place of Supply & PAN & Legal Name
      if (found.legal_name && document.getElementById('cust-legal-name')) {
        document.getElementById('cust-legal-name').value = found.legal_name;
      }
      if (found.pan && document.getElementById('cust-pan')) {
        document.getElementById('cust-pan').value = found.pan;
      }

      // 8. Billing Address
      const bAddr = found.billing_address || {};
      const attentionEl = document.getElementById('bill-attention');
      const addr1El = document.getElementById('bill-address1');
      const addr2El = document.getElementById('bill-address2');
      const cityEl = document.getElementById('bill-city');
      const pinEl = document.getElementById('bill-pincode');
      const phoneBillEl = document.getElementById('bill-phone');
      const stateEl = document.getElementById('bill-state');

      if (attentionEl) attentionEl.value = bAddr.attention || found.name || '';
      if (addr1El && bAddr.line1) addr1El.value = bAddr.line1;
      if (addr2El && bAddr.line2) addr2El.value = bAddr.line2;
      if (cityEl && bAddr.city) cityEl.value = bAddr.city;
      if (pinEl && bAddr.pin) pinEl.value = bAddr.pin;
      if (phoneBillEl && (bAddr.phone || found.phone_number)) phoneBillEl.value = bAddr.phone || found.phone_number;

      if (stateEl && bAddr.state && stateEl.options && typeof stateEl.options[Symbol.iterator] === 'function') {
        for (let opt of stateEl.options) {
          if (opt && opt.value && opt.value.toLowerCase().includes(bAddr.state.toLowerCase())) {
            stateEl.value = opt.value;
            break;
          }
        }
      } else if (stateEl && bAddr.state) {
        stateEl.value = bAddr.state;
      }

      showToast(\`✨ Existing customer found! Details auto-filled for \${found.name}.\`);`;

const newEmailAutoFillEnd = `      // 7. Customer Language
      if (found.language && document.getElementById('cust-language')) {
        document.getElementById('cust-language').value = found.language;
      }

      // 8. Place of Supply, PAN, Legal Name, Trade Name, Tax Preference, Currency, Payment Terms
      if (found.place_of_supply && document.getElementById('cust-place-of-supply')) {
        const posEl = document.getElementById('cust-place-of-supply');
        for (let opt of posEl.options) {
          if (opt.value === found.place_of_supply || opt.value.toLowerCase().includes(found.place_of_supply.toLowerCase())) {
            posEl.value = opt.value;
            break;
          }
        }
      }
      if (found.pan && document.getElementById('cust-pan')) {
        document.getElementById('cust-pan').value = found.pan;
      }
      if (found.legal_name && document.getElementById('cust-legal-name')) {
        document.getElementById('cust-legal-name').value = found.legal_name;
      }
      if (found.trade_name && document.getElementById('cust-trade-name')) {
        document.getElementById('cust-trade-name').value = found.trade_name;
      }
      if (found.tax_preference) {
        const prefRadio = document.querySelector(\`input[name="tax_preference"][value="\${found.tax_preference}"]\`);
        if (prefRadio) prefRadio.checked = true;
      }
      if (found.currency && document.getElementById('cust-currency')) {
        document.getElementById('cust-currency').value = found.currency;
      }
      if (found.payment_terms && document.getElementById('cust-payment-terms')) {
        document.getElementById('cust-payment-terms').value = found.payment_terms;
      }

      // 9. Document Upload
      uploadedCustomerDocs = Array.isArray(found.documents) ? [...found.documents] : [];
      renderUploadedCustomerDocsList();

      // 10. Expandable More Details (Website, Dept, Designation, Social)
      if (found.website && document.getElementById('cust-website')) {
        document.getElementById('cust-website').value = found.website;
      }
      if (found.department && (document.getElementById('cust-department') || document.getElementById('cust-dept'))) {
        const deptInput = document.getElementById('cust-department') || document.getElementById('cust-dept');
        deptInput.value = found.department;
      }
      if (found.designation && document.getElementById('cust-designation')) {
        document.getElementById('cust-designation').value = found.designation;
      }
      if (found.social_links) {
        if (found.social_links.x && document.getElementById('cust-x-twitter')) {
          document.getElementById('cust-x-twitter').value = found.social_links.x;
        }
        if (found.social_links.skype && document.getElementById('cust-skype')) {
          document.getElementById('cust-skype').value = found.social_links.skype;
        }
        if (found.social_links.facebook && document.getElementById('cust-facebook')) {
          document.getElementById('cust-facebook').value = found.social_links.facebook;
        }
      }

      // 11. Billing Address
      const bAddr = found.billing_address || {};
      const attentionEl = document.getElementById('bill-attention');
      const countryEl = document.getElementById('bill-country');
      const addr1El = document.getElementById('bill-address1');
      const addr2El = document.getElementById('bill-address2');
      const cityEl = document.getElementById('bill-city');
      const pinEl = document.getElementById('bill-pincode');
      const phoneBillEl = document.getElementById('bill-phone');
      const faxBillEl = document.getElementById('bill-fax');
      const stateEl = document.getElementById('bill-state');

      if (attentionEl) attentionEl.value = bAddr.attention || found.name || '';
      if (countryEl && bAddr.country) countryEl.value = bAddr.country;
      if (addr1El && bAddr.line1) addr1El.value = bAddr.line1;
      if (addr2El && bAddr.line2) addr2El.value = bAddr.line2;
      if (cityEl && bAddr.city) cityEl.value = bAddr.city;
      if (pinEl && bAddr.pin) pinEl.value = bAddr.pin;
      if (phoneBillEl && (bAddr.phone || found.phone_number)) phoneBillEl.value = bAddr.phone || found.phone_number;
      if (faxBillEl && bAddr.fax) faxBillEl.value = bAddr.fax;

      if (stateEl && bAddr.state && stateEl.options && typeof stateEl.options[Symbol.iterator] === 'function') {
        for (let opt of stateEl.options) {
          if (opt && opt.value && opt.value.toLowerCase().includes(bAddr.state.toLowerCase())) {
            stateEl.value = opt.value;
            break;
          }
        }
      } else if (stateEl && bAddr.state) {
        stateEl.value = bAddr.state;
      }

      // 12. Shipping Address
      const sAddr = found.shipping_address || {};
      const shipAttEl = document.getElementById('ship-attention');
      const shipCountryEl = document.getElementById('ship-country');
      const shipAddr1El = document.getElementById('ship-address1');
      const shipAddr2El = document.getElementById('ship-address2');
      const shipCityEl = document.getElementById('ship-city');
      const shipPinEl = document.getElementById('ship-pincode');
      const shipPhoneEl = document.getElementById('ship-phone');
      const shipFaxEl = document.getElementById('ship-fax');
      const shipStateEl = document.getElementById('ship-state');

      if (shipAttEl && sAddr.attention) shipAttEl.value = sAddr.attention;
      if (shipCountryEl && sAddr.country) shipCountryEl.value = sAddr.country;
      if (shipAddr1El && sAddr.line1) shipAddr1El.value = sAddr.line1;
      if (shipAddr2El && sAddr.line2) shipAddr2El.value = sAddr.line2;
      if (shipCityEl && sAddr.city) shipCityEl.value = sAddr.city;
      if (shipPinEl && sAddr.pin) shipPinEl.value = sAddr.pin;
      if (shipPhoneEl && (sAddr.phone || found.phone_number)) shipPhoneEl.value = sAddr.phone || found.phone_number;
      if (shipFaxEl && sAddr.fax) shipFaxEl.value = sAddr.fax;

      if (shipStateEl && sAddr.state && shipStateEl.options && typeof shipStateEl.options[Symbol.iterator] === 'function') {
        for (let opt of shipStateEl.options) {
          if (opt && opt.value && opt.value.toLowerCase().includes(sAddr.state.toLowerCase())) {
            shipStateEl.value = opt.value;
            break;
          }
        }
      } else if (shipStateEl && sAddr.state) {
        shipStateEl.value = sAddr.state;
      }

      showToast(\`✨ Existing customer found! Details auto-filled for \${found.name}.\`);`;

if (!content.includes(oldEmailAutoFillEnd)) {
  console.error('ERROR: oldEmailAutoFillEnd not found in app.js');
  process.exit(1);
}
content = content.replace(oldEmailAutoFillEnd, newEmailAutoFillEnd);
console.log('Step 5 complete: Updated onEmailInputChange');

// 6. Update renderZohoEditCustomerView init
const oldCustomerViewInit = `    // Reset dropdown state on page load
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
    const taxPref = currClient.tax_preference || 'Taxable';`;

const newCustomerViewInit = `    // Reset dropdown state on page load
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
    const language = currClient.language || 'English';
    const placeOfSupply = currClient.place_of_supply || '[TS] - Telangana';
    let phoneCode = currClient.phone_code || '+91';
    let rawPhone = currClient.phone_number || '';
    if (!currClient.phone_code && rawPhone) {
      if (rawPhone.startsWith('+91')) { phoneCode = '+91'; rawPhone = rawPhone.replace(/^\\+91[\\s-]*/, ''); }
      else if (rawPhone.startsWith('+1')) { phoneCode = '+1'; rawPhone = rawPhone.replace(/^\\+1[\\s-]*/, ''); }
      else if (rawPhone.startsWith('+44')) { phoneCode = '+44'; rawPhone = rawPhone.replace(/^\\+44[\\s-]*/, ''); }
      else if (rawPhone.startsWith('+971')) { phoneCode = '+971'; rawPhone = rawPhone.replace(/^\\+971[\\s-]*/, ''); }
    }
    uploadedCustomerDocs = Array.isArray(currClient.documents) ? [...currClient.documents] : [];`;

if (!content.includes(oldCustomerViewInit)) {
  console.error('ERROR: oldCustomerViewInit not found in app.js');
  process.exit(1);
}
content = content.replace(oldCustomerViewInit, newCustomerViewInit);
console.log('Step 6 complete: Updated renderZohoEditCustomerView init');

// 7. Update phone code and phone input in renderZohoEditCustomerView template
const oldPhoneControl = `                  <select class="modern-input-field modern-select phone-code-select zoho-input-select" id="cust-phone-code" style="width: 80px; flex-shrink: 0;">
                    <option value="+91" selected>+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+971">+971</option>
                  </select>
                  <div class="zoho-phone-input-inner-wrapper">
                    <input 
                      type="text" 
                      id="cust-phone" 
                      class="modern-input-field phone-input zoho-input-text \${isDuplicate ? 'has-warning-icon' : ''}" 
                      placeholder="Work Phone" 
                      value="\${escapeHtml(currClient.phone_number || '')}" 
                      oninput="window.smatApp.onPhoneInputChange(this.value)" 
                    />`;

const newPhoneControl = `                  <select class="modern-input-field modern-select phone-code-select zoho-input-select" id="cust-phone-code" style="width: 80px; flex-shrink: 0;">
                    <option value="+91" \${phoneCode === '+91' ? 'selected' : ''}>+91</option>
                    <option value="+1" \${phoneCode === '+1' ? 'selected' : ''}>+1</option>
                    <option value="+44" \${phoneCode === '+44' ? 'selected' : ''}>+44</option>
                    <option value="+971" \${phoneCode === '+971' ? 'selected' : ''}>+971</option>
                  </select>
                  <div class="zoho-phone-input-inner-wrapper">
                    <input 
                      type="text" 
                      id="cust-phone" 
                      class="modern-input-field phone-input zoho-input-text \${isDuplicate ? 'has-warning-icon' : ''}" 
                      placeholder="Work Phone" 
                      value="\${escapeHtml(rawPhone || currClient.phone_number || '')}" 
                      oninput="window.smatApp.onPhoneInputChange(this.value)" 
                    />`;

if (!content.includes(oldPhoneControl)) {
  console.error('ERROR: oldPhoneControl not found in app.js');
  process.exit(1);
}
content = content.replace(oldPhoneControl, newPhoneControl);
console.log('Step 7 complete: Updated phone select & input in template');

// 8. Update Customer Language select in template
const oldLangControl = `            <!-- 7. Customer Language -->
            <div class="zoho-form-row">
              <label class="zoho-row-label" for="cust-language">
                <span>Customer Language</span>
                <span class="info-glyph-chip zoho-info-glyph" title="Language preference for billing receipts & notification templates">ⓘ</span>
              </label>
              <div class="zoho-row-control">
                <select class="modern-input-field modern-select zoho-input-select" id="cust-language">
                  <option value="English" selected>English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Spanish">Spanish</option>
                  <option value="German">German</option>
                </select>
              </div>
            </div>`;

const newLangControl = `            <!-- 7. Customer Language -->
            <div class="zoho-form-row">
              <label class="zoho-row-label" for="cust-language">
                <span>Customer Language</span>
                <span class="info-glyph-chip zoho-info-glyph" title="Language preference for billing receipts & notification templates">ⓘ</span>
              </label>
              <div class="zoho-row-control">
                <select class="modern-input-field modern-select zoho-input-select" id="cust-language">
                  <option value="English" \${language === 'English' ? 'selected' : ''}>English</option>
                  <option value="Hindi" \${language === 'Hindi' ? 'selected' : ''}>Hindi</option>
                  <option value="Telugu" \${language === 'Telugu' ? 'selected' : ''}>Telugu</option>
                  <option value="Tamil" \${language === 'Tamil' ? 'selected' : ''}>Tamil</option>
                  <option value="Spanish" \${language === 'Spanish' ? 'selected' : ''}>Spanish</option>
                  <option value="German" \${language === 'German' ? 'selected' : ''}>German</option>
                </select>
              </div>
            </div>`;

if (!content.includes(oldLangControl)) {
  console.error('ERROR: oldLangControl not found in app.js');
  process.exit(1);
}
content = content.replace(oldLangControl, newLangControl);
console.log('Step 8 complete: Updated language select in template');

// 9. Update Get Taxpayer Details button and Place of Supply in template
const oldGstinAndPos = `                      <button type="button" class="btn-zoho-taxpayer-fetch btn-get-taxpayer" onclick="window.smatApp.fetchTaxpayerDetails()">
                        Get Taxpayer details
                      </button>
                    </div>
                    <div class="zoho-mandatory-warning-text" style="margin-top:4px;">
                      <span>▲ GST Identification Number is mandatory for GST registered contact.</span>
                    </div>
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
                </div>`;

const newGstinAndPos = `                      <button type="button" class="btn-zoho-taxpayer-fetch btn-get-taxpayer" onclick="window.smatApp.fetchTaxpayerDetails()">
                        Get Taxpayer Details
                      </button>
                    </div>
                    <div class="zoho-mandatory-warning-text" style="margin-top:4px;">
                      <span>▲ GST Identification Number is mandatory for GST registered contact.</span>
                    </div>
                  </div>
                </div>

                <!-- 2. Place of Supply* -->
                <div class="zoho-form-row form-field-group">
                  <div class="zoho-row-label required">
                    <span>Place of Supply*</span>
                  </div>
                  <div class="zoho-row-control">
                    <select class="modern-input-field modern-select zoho-input-select" id="cust-place-of-supply">
                      <option value="[TS] - Telangana" \${placeOfSupply.includes('Telangana') ? 'selected' : ''}>[TS] - Telangana</option>
                      <option value="[AP] - Andhra Pradesh" \${placeOfSupply.includes('Andhra Pradesh') ? 'selected' : ''}>[AP] - Andhra Pradesh</option>
                      <option value="[MH] - Maharashtra" \${placeOfSupply.includes('Maharashtra') ? 'selected' : ''}>[MH] - Maharashtra</option>
                      <option value="[KA] - Karnataka" \${placeOfSupply.includes('Karnataka') ? 'selected' : ''}>[KA] - Karnataka</option>
                      <option value="[DL] - Delhi" \${placeOfSupply.includes('Delhi') ? 'selected' : ''}>[DL] - Delhi</option>
                      <option value="[TN] - Tamil Nadu" \${placeOfSupply.includes('Tamil Nadu') ? 'selected' : ''}>[TN] - Tamil Nadu</option>
                      <option value="[GJ] - Gujarat" \${placeOfSupply.includes('Gujarat') ? 'selected' : ''}>[GJ] - Gujarat</option>
                      <option value="[WB] - West Bengal" \${placeOfSupply.includes('West Bengal') ? 'selected' : ''}>[WB] - West Bengal</option>
                      <option value="[UP] - Uttar Pradesh" \${placeOfSupply.includes('Uttar Pradesh') ? 'selected' : ''}>[UP] - Uttar Pradesh</option>
                      <option value="[KL] - Kerala" \${placeOfSupply.includes('Kerala') ? 'selected' : ''}>[KL] - Kerala</option>
                      <option value="[RJ] - Rajasthan" \${placeOfSupply.includes('Rajasthan') ? 'selected' : ''}>[RJ] - Rajasthan</option>
                      <option value="[MP] - Madhya Pradesh" \${placeOfSupply.includes('Madhya Pradesh') ? 'selected' : ''}>[MP] - Madhya Pradesh</option>
                      <option value="[PB] - Punjab" \${placeOfSupply.includes('Punjab') ? 'selected' : ''}>[PB] - Punjab</option>
                      <option value="[HR] - Haryana" \${placeOfSupply.includes('Haryana') ? 'selected' : ''}>[HR] - Haryana</option>
                    </select>
                  </div>
                </div>`;

if (!content.includes(oldGstinAndPos)) {
  console.error('ERROR: oldGstinAndPos not found in app.js');
  process.exit(1);
}
content = content.replace(oldGstinAndPos, newGstinAndPos);
console.log('Step 9 complete: Updated Get Taxpayer Details and Place of Supply');

// 10. Update Document Upload section in template to render existing document chips
const oldDocsListInTemplate = `<div id="uploaded-docs-list" class="uploaded-docs-list-box"></div>`;
const newDocsListInTemplate = `<div id="uploaded-docs-list" class="uploaded-docs-list-box">
                      \${(uploadedCustomerDocs || []).map((doc, idx) => \`
                        <span class="uploaded-doc-chip" style="display:inline-flex; align-items:center; gap:6px; background:#F1F5F9; border:1px solid #CBD5E1; padding:3px 8px; border-radius:4px; font-size:12px; margin:2px 4px 2px 0;">
                          <span>📎 \${escapeHtml(typeof doc === 'string' ? doc : (doc.name || 'Document'))} \${doc.size ? \`(\${Math.round(doc.size / 1024)} KB)\` : ''}</span>
                          <button type="button" onclick="window.smatApp.removeUploadedDoc(\${idx})" style="border:none; background:none; cursor:pointer; color:#94A3B8; font-weight:700;" title="Remove file">✕</button>
                        </span>
                      \`).join('')}
                    </div>`;

if (!content.includes(oldDocsListInTemplate)) {
  console.error('ERROR: oldDocsListInTemplate not found in app.js');
  process.exit(1);
}
content = content.replace(oldDocsListInTemplate, newDocsListInTemplate);
console.log('Step 10 complete: Updated docs list in template');

// 11. Add removeUploadedDoc to window.smatApp exports
const oldExport = `    handleDocumentUpload,
    handleZohoSaveAndSubscribe,`;
const newExport = `    handleDocumentUpload,
    removeUploadedDoc,
    handleZohoSaveAndSubscribe,`;

if (!content.includes(oldExport)) {
  console.error('ERROR: oldExport not found in app.js');
  process.exit(1);
}
content = content.replace(oldExport, newExport);
console.log('Step 11 complete: Added removeUploadedDoc to exports');

// Restore original CRLF if was present
if (isCRLF) {
  content = content.replace(/\n/g, '\r\n');
}

// Write back to file
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully written updated frontend/js/app.js!');
