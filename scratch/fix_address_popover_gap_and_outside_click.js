const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
let content = fs.readFileSync(appJsPath, 'utf8');

// 1. Fix the positioning of both billing & shipping popovers from "top:calc(100% + 4px);" to "top:24px; left:0;"
// For billing:
const oldBillingPopover = `id="zoho-addr-popover-billing" class="zoho-addr-popover" style="display:none; position:absolute; top:calc(100% + 4px); left:0; z-index:1100; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:8px; box-shadow:0 10px 25px rgba(0,0,0,0.12); padding:10px; width:290px;"`;
const newBillingPopover = `id="zoho-addr-popover-billing" class="zoho-addr-popover" style="display:none; position:absolute; top:24px; left:0; z-index:1100; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:8px; box-shadow:0 10px 25px rgba(0,0,0,0.15); padding:10px; width:290px;"`;

// For shipping:
const oldShippingPopover = `id="zoho-addr-popover-shipping" class="zoho-addr-popover" style="display:none; position:absolute; top:calc(100% + 4px); left:0; z-index:1100; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:8px; box-shadow:0 10px 25px rgba(0,0,0,0.12); padding:10px; width:290px;"`;
const newShippingPopover = `id="zoho-addr-popover-shipping" class="zoho-addr-popover" style="display:none; position:absolute; top:24px; left:0; z-index:1100; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:8px; box-shadow:0 10px 25px rgba(0,0,0,0.15); padding:10px; width:290px;"`;

let norm = content.replace(/\r\n/g, '\n');

if (norm.includes(oldBillingPopover)) {
  norm = norm.replace(oldBillingPopover, newBillingPopover);
  console.log('Fixed billing popover position to top:24px (no gap)');
} else {
  console.log('Could not find exact oldBillingPopover, checking variations...');
}

if (norm.includes(oldShippingPopover)) {
  norm = norm.replace(oldShippingPopover, newShippingPopover);
  console.log('Fixed shipping popover position to top:24px (no gap)');
} else {
  console.log('Could not find exact oldShippingPopover, checking variations...');
}

// 2. Add class="zoho-addr-trigger" to the pencil triggers and the New Address link
const oldBillingTrigger = `<span style="cursor:pointer; display:inline-flex; align-items:center;" title="Edit Billing Address" onclick="event.stopPropagation(); window.smatApp.toggleAddressPopover('billing', event)">`;
const newBillingTrigger = `<span class="zoho-addr-trigger" style="cursor:pointer; display:inline-flex; align-items:center;" title="Edit Billing Address" onclick="event.stopPropagation(); window.smatApp.toggleAddressPopover('billing', event)">`;

const oldShippingTrigger = `<span style="cursor:pointer; display:inline-flex; align-items:center;" title="Edit Shipping Address" onclick="event.stopPropagation(); window.smatApp.toggleAddressPopover('shipping', event)">`;
const newShippingTrigger = `<span class="zoho-addr-trigger" style="cursor:pointer; display:inline-flex; align-items:center;" title="Edit Shipping Address" onclick="event.stopPropagation(); window.smatApp.toggleAddressPopover('shipping', event)">`;

const oldNewAddrLink = `<a href="javascript:void(0)" onclick="event.stopPropagation(); window.smatApp.toggleAddressPopover('shipping', event)" style="color:#2563EB; text-decoration:none; font-size:0.84rem; font-weight:500;">New Address</a>`;
const newNewAddrLink = `<a href="javascript:void(0)" class="zoho-addr-trigger" onclick="event.stopPropagation(); window.smatApp.toggleAddressPopover('shipping', event)" style="color:#2563EB; text-decoration:none; font-size:0.84rem; font-weight:500;">New Address</a>`;

if (norm.includes(oldBillingTrigger)) norm = norm.replace(oldBillingTrigger, newBillingTrigger);
if (norm.includes(oldShippingTrigger)) norm = norm.replace(oldShippingTrigger, newShippingTrigger);
if (norm.includes(oldNewAddrLink)) norm = norm.replace(oldNewAddrLink, newNewAddrLink);

// 3. Update the global click/outside-tap listener to reliably close the popovers on any outside tap
const oldDocListener = `  if (typeof document !== 'undefined') {
    document.addEventListener('click', (e) => {
      if (e && e.target && typeof e.target.closest === 'function') {
        if (!e.target.closest('.zoho-sac-badge-wrap')) {
          document.querySelectorAll('.zoho-sac-popover').forEach(p => p.style.display = 'none');
        }
        if (!e.target.closest('.zoho-addr-card-wrap')) {
          document.querySelectorAll('.zoho-addr-popover').forEach(p => p.style.display = 'none');
        }
      }
    });
  }`;

const newDocListener = `  if (typeof document !== 'undefined') {
    const handleOutsideClick = (e) => {
      if (!e || !e.target || typeof e.target.closest === 'function') return;

      // 1. SAC popover close on outside click
      if (!e.target.closest('.zoho-sac-popover') && !e.target.closest('.zoho-sac-badge-wrap')) {
        document.querySelectorAll('.zoho-sac-popover').forEach(p => p.style.display = 'none');
      }

      // 2. Address popover close on tap anywhere outside
      if (!e.target.closest('.zoho-addr-popover') && !e.target.closest('.zoho-addr-trigger')) {
        document.querySelectorAll('.zoho-addr-popover').forEach(p => p.style.display = 'none');
      }
    };

    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
  }`;

if (norm.includes(oldDocListener)) {
  norm = norm.replace(oldDocListener, newDocListener);
  console.log('Updated outside-click and outside-tap handler to close address popovers everywhere');
} else {
  console.log('Could not find exact oldDocListener, checking...');
}

fs.writeFileSync(appJsPath, norm.replace(/\n/g, '\r\n'), 'utf8');
console.log('frontend/js/app.js updated successfully!');
