// Script to refine Zoho coupon trigger box styling to match the screenshot pixel-by-pixel
const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
const indexHtmlPath = path.join(__dirname, '..', 'frontend', 'index.html');

let appJsRaw = fs.readFileSync(appJsPath, 'utf8');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const isCRLF = appJsRaw.includes('\r\n');
let appJs = appJsRaw.replace(/\r\n/g, '\n');

console.log('Original app.js length:', appJs.length, 'isCRLF:', isCRLF);

// 1. Refine trigger button styling with explicit border and padding
const oldTrigger = `                          <button type="button" 
                                  id="zoho-coupon-trigger-btn"
                                  onclick="event.stopPropagation(); window.smatApp.toggleZohoCouponDropdown(event)"
                                  style="display:flex; align-items:center; justify-content:space-between; width:100%; border:none; outline:none; background:transparent; font-size:0.83rem; color:#1F2937; cursor:pointer; padding:2px 0; text-align:left;">`;

const newTrigger = `                          <button type="button" 
                                  id="zoho-coupon-trigger-btn"
                                  onclick="event.stopPropagation(); window.smatApp.toggleZohoCouponDropdown(event)"
                                  style="display:flex; align-items:center; justify-content:space-between; width:100%; border:1px solid #D1D5DB; border-radius:4px; padding:6px 10px; background:#FFFFFF; font-size:0.83rem; cursor:pointer; text-align:left; transition:border-color 0.15s, box-shadow 0.15s;">`;

if (appJs.includes(oldTrigger)) {
  appJs = appJs.replace(oldTrigger, newTrigger);
  console.log('✓ Updated zoho-coupon-trigger-btn with border and padding');
} else {
  console.log('zoho-coupon-trigger-btn already refined or not found');
}

// 2. Refine openZohoCouponDropdown & closeZohoCouponDropdown to highlight trigger border and reset it
const oldOpenClose = `  function openZohoCouponDropdown() {
    const pop = document.getElementById('zoho-coupon-popover');
    const chevron = document.getElementById('zoho-coupon-chevron');
    if (!pop) return;
    closeAllMorePopovers();
    closeGstPreferencesPopover();
    closeShippingGstPopover();
    closeSupplyStateDropdown();
    closePlanAccountDropdown();
    closePlanTaxDropdown();
    closeAllAddonTaxDropdowns();
    pop.style.display = 'block';
    if (chevron) chevron.style.transform = 'rotate(180deg)';
    renderZohoCouponResults();
    setTimeout(() => {
      const searchInp = document.getElementById('zoho-coupon-search-filter');
      if (searchInp) {
        searchInp.value = '';
        searchInp.focus();
      }
    }, 50);
  }

  function toggleZohoCouponDropdown(evt) {
    if (evt) evt.stopPropagation();
    const pop = document.getElementById('zoho-coupon-popover');
    if (!pop) return;
    if (pop.style.display === 'block') {
      closeZohoCouponDropdown();
    } else {
      openZohoCouponDropdown();
    }
  }

  function closeZohoCouponDropdown() {
    const pop = document.getElementById('zoho-coupon-popover');
    const chevron = document.getElementById('zoho-coupon-chevron');
    if (pop) pop.style.display = 'none';
    if (chevron) chevron.style.transform = 'rotate(0deg)';
  }`;

const newOpenClose = `  function openZohoCouponDropdown() {
    const pop = document.getElementById('zoho-coupon-popover');
    const trigger = document.getElementById('zoho-coupon-trigger-btn');
    const chevron = document.getElementById('zoho-coupon-chevron');
    if (!pop) return;
    closeAllMorePopovers();
    closeGstPreferencesPopover();
    closeShippingGstPopover();
    closeSupplyStateDropdown();
    closePlanAccountDropdown();
    closePlanTaxDropdown();
    closeAllAddonTaxDropdowns();
    pop.style.display = 'block';
    if (trigger) {
      trigger.style.borderColor = '#3B82F6';
      trigger.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.15)';
    }
    if (chevron) chevron.style.transform = 'rotate(180deg)';
    renderZohoCouponResults();
    setTimeout(() => {
      const searchInp = document.getElementById('zoho-coupon-search-filter');
      if (searchInp) {
        searchInp.value = '';
        searchInp.focus();
      }
    }, 50);
  }

  function toggleZohoCouponDropdown(evt) {
    if (evt) evt.stopPropagation();
    const pop = document.getElementById('zoho-coupon-popover');
    if (!pop) return;
    if (pop.style.display === 'block') {
      closeZohoCouponDropdown();
    } else {
      openZohoCouponDropdown();
    }
  }

  function closeZohoCouponDropdown() {
    const pop = document.getElementById('zoho-coupon-popover');
    const trigger = document.getElementById('zoho-coupon-trigger-btn');
    const chevron = document.getElementById('zoho-coupon-chevron');
    if (pop) pop.style.display = 'none';
    if (trigger) {
      trigger.style.borderColor = '#D1D5DB';
      trigger.style.boxShadow = 'none';
    }
    if (chevron) chevron.style.transform = 'rotate(0deg)';
  }`;

if (appJs.includes(oldOpenClose)) {
  appJs = appJs.replace(oldOpenClose, newOpenClose);
  console.log('✓ Updated openZohoCouponDropdown and closeZohoCouponDropdown with trigger highlight');
}

// 3. Bump cache busting version to v=11.0 in index.html
indexHtml = indexHtml.replace(/app\.js\?v=[0-9.]+/g, 'app.js?v=11.0');
indexHtml = indexHtml.replace(/styles\.css\?v=[0-9.]+/g, 'styles.css?v=11.0');
console.log('✓ Bumped cache busting version to v=11.0');

// Convert back to CRLF if original was CRLF
if (isCRLF) {
  appJs = appJs.replace(/\n/g, '\r\n');
}

// Save files
fs.writeFileSync(appJsPath, appJs, 'utf8');
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');

console.log('ALL COUPON TRIGGER REFINEMENTS APPLIED SUCCESSFULLY!');
