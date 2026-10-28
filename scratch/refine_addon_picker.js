const fs = require('fs');

let content = fs.readFileSync('frontend/js/app.js', 'utf8');

// Update option value inside zoho-addon-picker
const oldOption = `<option value="\${escapeHtml(a.name)}|\${a.price}|\${escapeHtml(a.desc)}|\${escapeHtml(a.unit)}">\${escapeHtml(a.name)} (Rs. \${a.price.toLocaleString('en-IN')})</option>`;
const newOption = `<option value="\${escapeHtml(a.name)}">\${escapeHtml(a.name)} (Rs. \${a.price.toLocaleString('en-IN')})</option>`;

// Update onZohoAddonChange
const oldFunc = `  function onZohoAddonChange(idx, val) {
    if (!val || !zohoSubAddons[idx]) return;
    const parts = val.split('|');
    zohoSubAddons[idx].name = parts[0] || '';
    zohoSubAddons[idx].price = parseFloat(parts[1]) || 0;
    zohoSubAddons[idx].desc = parts[2] || '';
    zohoSubAddons[idx].unit = parts[3] || parts[0] || '';
    zohoSubAddons[idx].taxRate = 18;
    zohoSubAddons[idx].isEmpty = false;
    const viewport = document.getElementById('route-viewport');
    if (viewport) renderZohoSubscriptionView(viewport);
    updateZohoSubCalculations();
  }`;

const newFunc = `  function onZohoAddonChange(idx, val) {
    if (!val || !zohoSubAddons[idx]) return;
    const found = AVAILABLE_ZOHO_ADDONS.find(a => a.name === val) || {
      name: val,
      price: 0,
      desc: '',
      unit: val
    };
    zohoSubAddons[idx].name = found.name;
    zohoSubAddons[idx].price = found.price;
    zohoSubAddons[idx].desc = found.desc;
    zohoSubAddons[idx].unit = found.unit;
    zohoSubAddons[idx].taxRate = 18;
    zohoSubAddons[idx].isEmpty = false;
    const viewport = document.getElementById('route-viewport');
    if (viewport) renderZohoSubscriptionView(viewport);
    updateZohoSubCalculations();
  }`;

let normContent = content.replace(/\r\n/g, '\n');
const normOldOption = oldOption.replace(/\r\n/g, '\n');
const normOldFunc = oldFunc.replace(/\r\n/g, '\n');

if (normContent.includes(normOldOption) && normContent.includes(normOldFunc)) {
  normContent = normContent.replace(normOldOption, newOption.replace(/\r\n/g, '\n'));
  normContent = normContent.replace(normOldFunc, newFunc.replace(/\r\n/g, '\n'));
  fs.writeFileSync('frontend/js/app.js', normContent.replace(/\n/g, '\r\n'), 'utf8');
  console.log('Successfully refined addon picker and onZohoAddonChange lookup!');
} else {
  console.log('Matches failed:', {
    option: normContent.includes(normOldOption),
    func: normContent.includes(normOldFunc)
  });
}
