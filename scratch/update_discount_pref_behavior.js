const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
const indexHtmlPath = path.join(__dirname, '..', 'frontend', 'index.html');

let appJsRaw = fs.readFileSync(appJsPath, 'utf8');
const isCRLF = appJsRaw.includes('\r\n');
let appJs = appJsRaw.replace(/\r\n/g, '\n');

console.log('--- Updating Discount Preference Behavior Across All 3 Modes ---');

// 1. Update the initial trigger button inline style to reflect active state
const oldTrigger = `<button type="button" id="zoho-discount-pref-trigger" onclick="event.stopPropagation(); window.smatApp.toggleDiscountPrefDropdown(event)" style="display:inline-flex; align-items:center; gap:6px; border:1px solid #CBD5E1; border-radius:6px; padding:5px 10px; background:#FFFFFF; cursor:pointer; font-size:0.82rem; color:#374151; box-shadow:0 1px 2px rgba(0,0,0,0.02); font-weight:500; transition:all 0.15s;">`;
const newTrigger = `<button type="button" id="zoho-discount-pref-trigger" onclick="event.stopPropagation(); window.smatApp.toggleDiscountPrefDropdown(event)" style="display:inline-flex; align-items:center; gap:6px; border:\${(zohoDiscountPref === 'item-level' || zohoDiscountPref === 'transaction-level') ? '1.5px solid #3B82F6' : '1px solid #CBD5E1'}; box-shadow:\${(zohoDiscountPref === 'item-level' || zohoDiscountPref === 'transaction-level') ? '0 0 0 2px rgba(59, 130, 246, 0.15)' : '0 1px 2px rgba(0,0,0,0.02)'}; border-radius:6px; padding:5px 10px; background:#FFFFFF; cursor:pointer; font-size:0.82rem; color:#374151; font-weight:500; transition:all 0.15s;">`;

if (appJs.includes(oldTrigger)) {
  appJs = appJs.replace(oldTrigger, newTrigger);
  console.log('✓ Updated trigger button active styling in HTML');
} else {
  console.log('Notice: oldTrigger not matched directly, continuing...');
}

// 2. Change all zohoDiscountPref === 'no-discount' ? '40%' : '34%' to zohoDiscountPref === 'item-level' ? '34%' : '40%'
appJs = appJs.replace(
  /\${zohoDiscountPref === 'no-discount' \? '40%' : '34%'}/g,
  "${zohoDiscountPref === 'item-level' ? '34%' : '40%'}"
);
appJs = appJs.replace(
  /\${zohoDiscountPref === 'no-discount' \? '15%' : '12%'}/g,
  "${zohoDiscountPref === 'item-level' ? '12%' : '15%'}"
);
appJs = appJs.replace(
  /\${zohoDiscountPref === 'no-discount' \? '15%' : '14%'}/g,
  "${zohoDiscountPref === 'item-level' ? '14%' : '15%'}"
);
appJs = appJs.replace(
  /\${zohoDiscountPref === 'no-discount' \? '15%' : '13%'}/g,
  "${zohoDiscountPref === 'item-level' ? '13%' : '15%'}"
);
appJs = appJs.replace(
  /\${zohoDiscountPref === 'no-discount' \? 'none' : 'table-cell'}/g,
  "${zohoDiscountPref === 'item-level' ? 'table-cell' : 'none'}"
);
console.log('✓ Updated table column widths and visibility logic to only show DISCOUNT when item-level');

// 3. Update onZohoDiscountPrefChange implementation
const oldOnPref = `  function onZohoDiscountPrefChange(pref) {
    zohoDiscountPref = pref;
    const isNoDiscount = pref === 'no-discount';
    document.querySelectorAll('.zoho-col-discount').forEach(el => {
      el.style.display = isNoDiscount ? 'none' : 'table-cell';
    });
    document.querySelectorAll('.zoho-th-plan-name').forEach(el => el.style.width = isNoDiscount ? '40%' : '34%');
    document.querySelectorAll('.zoho-th-plan-qty').forEach(el => el.style.width = isNoDiscount ? '15%' : '12%');
    document.querySelectorAll('.zoho-th-plan-price').forEach(el => el.style.width = isNoDiscount ? '15%' : '14%');
    document.querySelectorAll('.zoho-th-plan-tax').forEach(el => el.style.width = isNoDiscount ? '15%' : '13%');
    document.querySelectorAll('.zoho-th-plan-amount').forEach(el => el.style.width = isNoDiscount ? '15%' : '13%');
    document.querySelectorAll('.zoho-th-addon-name').forEach(el => el.style.width = isNoDiscount ? '40%' : '34%');
    document.querySelectorAll('.zoho-th-addon-qty').forEach(el => el.style.width = isNoDiscount ? '15%' : '12%');
    document.querySelectorAll('.zoho-th-addon-price').forEach(el => el.style.width = isNoDiscount ? '15%' : '14%');
    document.querySelectorAll('.zoho-th-addon-tax').forEach(el => el.style.width = isNoDiscount ? '15%' : '13%');
    document.querySelectorAll('.zoho-th-addon-amount').forEach(el => el.style.width = isNoDiscount ? '15%' : '13%');
    updateZohoSubCalculations();
  }`;

const newOnPref = `  function onZohoDiscountPrefChange(pref) {
    zohoDiscountPref = pref;
    const isItemLevel = pref === 'item-level';
    document.querySelectorAll('.zoho-col-discount').forEach(el => {
      el.style.display = isItemLevel ? 'table-cell' : 'none';
    });
    document.querySelectorAll('.zoho-th-plan-name').forEach(el => el.style.width = isItemLevel ? '34%' : '40%');
    document.querySelectorAll('.zoho-th-plan-qty').forEach(el => el.style.width = isItemLevel ? '12%' : '15%');
    document.querySelectorAll('.zoho-th-plan-price').forEach(el => el.style.width = isItemLevel ? '14%' : '15%');
    document.querySelectorAll('.zoho-th-plan-tax').forEach(el => el.style.width = isItemLevel ? '13%' : '15%');
    document.querySelectorAll('.zoho-th-plan-amount').forEach(el => el.style.width = isItemLevel ? '13%' : '15%');
    document.querySelectorAll('.zoho-th-addon-name').forEach(el => el.style.width = isItemLevel ? '34%' : '40%');
    document.querySelectorAll('.zoho-th-addon-qty').forEach(el => el.style.width = isItemLevel ? '12%' : '15%');
    document.querySelectorAll('.zoho-th-addon-price').forEach(el => el.style.width = isItemLevel ? '14%' : '15%');
    document.querySelectorAll('.zoho-th-addon-tax').forEach(el => el.style.width = isItemLevel ? '13%' : '15%');
    document.querySelectorAll('.zoho-th-addon-amount').forEach(el => el.style.width = isItemLevel ? '13%' : '15%');

    // Trigger button active blue border matching Screenshots 2 & 3
    const trigger = document.getElementById('zoho-discount-pref-trigger');
    if (trigger) {
      if (isItemLevel || pref === 'transaction-level') {
        trigger.style.borderColor = '#3B82F6';
        trigger.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.15)';
      } else {
        trigger.style.borderColor = '#CBD5E1';
        trigger.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
      }
    }

    updateZohoSubCalculations();
  }`;

if (appJs.includes(oldOnPref)) {
  appJs = appJs.replace(oldOnPref, newOnPref);
  console.log('✓ Updated onZohoDiscountPrefChange');
} else {
  console.error('Could not find oldOnPref block in app.js');
  process.exit(1);
}

// 4. Update closeDiscountPrefDropdown so it restores the active border if item-level or transaction-level
const oldClosePref = `  function closeDiscountPrefDropdown() {
    const pop = document.getElementById('zoho-discount-pref-popover');
    if (!pop) return;
    pop.style.display = 'none';
    const trigger = document.getElementById('zoho-discount-pref-trigger');
    if (trigger) {
      trigger.style.borderColor = '#CBD5E1';
      trigger.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
    }
    const chevron = document.getElementById('zoho-discount-pref-chevron');
    if (chevron) chevron.style.transform = 'rotate(0deg)';
  }`;

const newClosePref = `  function closeDiscountPrefDropdown() {
    const pop = document.getElementById('zoho-discount-pref-popover');
    if (!pop) return;
    pop.style.display = 'none';
    const trigger = document.getElementById('zoho-discount-pref-trigger');
    if (trigger) {
      if (zohoDiscountPref === 'item-level' || zohoDiscountPref === 'transaction-level') {
        trigger.style.borderColor = '#3B82F6';
        trigger.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.15)';
      } else {
        trigger.style.borderColor = '#CBD5E1';
        trigger.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
      }
    }
    const chevron = document.getElementById('zoho-discount-pref-chevron');
    if (chevron) chevron.style.transform = 'rotate(0deg)';
  }`;

if (appJs.includes(oldClosePref)) {
  appJs = appJs.replace(oldClosePref, newClosePref);
  console.log('✓ Updated closeDiscountPrefDropdown to preserve active border');
}

// 5. Update discount calculation to only add row discounts when item-level
appJs = appJs.replace(
  "const totalDiscounts = ((zohoDiscountPref === 'no-discount') ? 0 : (planDiscountAmt + totalAddonsDiscount)) + couponDiscountAmt;",
  "const totalDiscounts = ((zohoDiscountPref === 'item-level') ? (planDiscountAmt + totalAddonsDiscount) : 0) + couponDiscountAmt;"
);
console.log('✓ Updated totalDiscounts calculation');

// Write back app.js
fs.writeFileSync(appJsPath, isCRLF ? appJs.replace(/\n/g, '\r\n') : appJs, 'utf8');
console.log('✓ Saved frontend/js/app.js');

// Bump cache version in index.html to v=11.4
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/app\.js\?v=[0-9.]+/g, 'app.js?v=11.4');
indexHtml = indexHtml.replace(/styles\.css\?v=[0-9.]+/g, 'styles.css?v=11.4');
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('✓ Bumped frontend/index.html to v=11.4');
