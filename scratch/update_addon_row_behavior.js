const fs = require('fs');

let content = fs.readFileSync('frontend/js/app.js', 'utf8');

// 1. Add AVAILABLE_ZOHO_ADDONS near zohoSubAddons
const targetInit = `  let zohoSubAddons = [
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
  ];`;

const replacementInit = `  const AVAILABLE_ZOHO_ADDONS = [
    { name: 'Extra Chats OC NM', price: 600, desc: '1 UNIT : 1000 CHATS ( Excluding WhatsApp )', unit: 'Extra Chats OC NM', sac: '998314' },
    { name: '+10,000 Conversations Quota', price: 1500, desc: 'Monthly conversational messages booster', unit: '+10,000 Quota', sac: '998314' },
    { name: '+1 Dedicated WhatsApp WABA Number', price: 2500, desc: 'Official Meta cloud number channel', unit: '+1 WABA No.', sac: '998314' },
    { name: '+1 Additional Live Agent Seat', price: 800, desc: 'Multi-agent live chat seat', unit: '+1 Agent Seat', sac: '998314' },
    { name: 'AI Integration Booster', price: 2000, desc: 'Dialogflow & OpenAI Vector Embeddings', unit: 'AI Booster', sac: '998314' },
    { name: 'Dedicated CSM / Premium SLA', price: 3000, desc: '24/7 dedicated support representative', unit: 'Dedicated CSM', sac: '998314' }
  ];

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
      taxRate: 18,
      isEmpty: false
    }
  ];`;

// 2. Replace the Addons tbody rendering
const targetTbody = `<tbody id="zoho-addons-tbody">
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
                </tbody>`;

const replacementTbody = `<tbody id="zoho-addons-tbody">
                  \${zohoSubAddons.map((addon, idx) => {
                    const isRowEmpty = addon.isEmpty || !addon.name;
                    return \`
                    <tr style="border-bottom:1px solid #F3F4F6; vertical-align:top;" id="zoho-addon-row-\${idx}">
                      <!-- Addon Name / Picker (Screenshot 1: Empty vs Populated) -->
                      <td style="padding:0.85rem 1rem;">
                        <div style="display:flex; gap:0.6rem; align-items:flex-start;">
                          <span style="color:#9CA3AF; cursor:grab; font-size:1.1rem; line-height:1; padding-top: \${isRowEmpty ? '8px' : '4px'};">⠿</span>
                          <div style="width:38px; height:38px; background:#F9FAFB; border:1px solid #E5E7EB; border-radius:4px; display:flex; align-items:center; justify-content:center; color:#9CA3AF; flex-shrink:0;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                          </div>
                          
                          \${isRowEmpty ? \`
                            <!-- Empty Row: Blue border box with placeholder "Type or click to select an addon." (Screenshot 1) -->
                            <div style="flex:1; position:relative;">
                              <select id="zoho-addon-picker-\${idx}" 
                                      style="width:100%; border:1.5px solid #3B82F6; box-shadow:0 0 0 1px rgba(59, 130, 246, 0.2); border-radius:4px; padding:0.6rem 0.75rem; font-size:0.85rem; color:#4B5563; outline:none; background:#FFFFFF; cursor:pointer;"
                                      onchange="window.smatApp.onZohoAddonChange(\${idx}, this.value)">
                                <option value="" disabled selected hidden>Type or click to select an addon.</option>
                                \${AVAILABLE_ZOHO_ADDONS.map(a => \`
                                  <option value="\${escapeHtml(a.name)}|\${a.price}|\${escapeHtml(a.desc)}|\${escapeHtml(a.unit)}">\${escapeHtml(a.name)} (Rs. \${a.price.toLocaleString('en-IN')})</option>
                                \`).join('')}
                              </select>
                            </div>
                          \` : \`
                            <!-- Populated Row: Selected Addon (Screenshot 1 & Screenshot 2) -->
                            <div style="flex:1;">
                              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                                <span style="font-weight:600; color:#111827; font-size:0.88rem;">\${escapeHtml(addon.name)}</span>
                                <span style="color:#9CA3AF; cursor:pointer; font-size:0.95rem; margin-left:6px;" onclick="window.smatApp.removeZohoSubAddonRow(\${idx})" title="Clear / Remove Add-on">✕</span>
                              </div>
                              <div style="background:#F9FAFB; border:1px solid #F3F4F6; border-radius:4px; padding:4px 8px; font-size:0.78rem; color:#4B5563; margin-bottom:6px;">
                                \${escapeHtml(addon.desc)}
                              </div>
                              <div style="display:inline-flex; align-items:center; gap:4px;">
                                <span style="background:#059669; color:#FFFFFF; font-size:0.68rem; font-weight:700; padding:1px 5px; border-radius:3px;">SERVICE</span>
                                <span style="font-size:0.75rem; color:#2563EB; font-weight:600;">SAC: 998314 ✏️</span>
                              </div>
                            </div>
                          \`}
                        </div>
                      </td>

                      <!-- Quantity (Screenshot 1: 1.00 for empty, 1 for filled) -->
                      <td style="padding:1rem 0.75rem; text-align:center;">
                        <input type="number" id="zoho-addon-qty-\${idx}" value="\${isRowEmpty ? '1.00' : addon.qty}" step="\${isRowEmpty ? '0.01' : '1'}" min="1" style="width:60px; text-align:center; border:1px solid #D1D5DB; border-radius:4px; padding:4px; font-size:0.85rem;" oninput="window.smatApp.updateZohoSubCalculations()" />
                        \${!isRowEmpty && addon.unit ? \`<div style="font-size:0.72rem; color:#6B7280; margin-top:4px;">\${escapeHtml(addon.unit)}</div>\` : ''}
                      </td>

                      <!-- Price (Screenshot 1: 0.00 for empty) -->
                      <td style="padding:1rem 0.75rem; text-align:right;">
                        <input type="number" id="zoho-addon-price-\${idx}" value="\${isRowEmpty ? '0.00' : addon.price}" step="0.01" style="width:75px; text-align:right; border:1px solid #D1D5DB; border-radius:4px; padding:4px; font-size:0.85rem;" oninput="window.smatApp.updateZohoSubCalculations()" />
                      </td>

                      <!-- Point 2: Add-on Discount (% / ₹) (Screenshot 1 & 2) -->
                      <td style="padding:1rem 0.75rem; text-align:center;">
                        <div style="display:inline-flex; align-items:center; gap:2px; border:1px solid #D1D5DB; border-radius:4px; padding:1px 4px; background:#FFFFFF;">
                          <input type="number" id="zoho-addon-disc-val-\${idx}" value="\${addon.discountVal || 0}" min="0" style="width:40px; border:none; text-align:center; font-size:0.85rem; outline:none;" oninput="window.smatApp.updateZohoSubCalculations()" />
                          <select id="zoho-addon-disc-type-\${idx}" style="border:none; background:none; font-size:0.8rem; color:#4B5563; outline:none; cursor:pointer;" onchange="window.smatApp.updateZohoSubCalculations()">
                            <option value="percent" \${addon.discountType === 'percent' ? 'selected' : ''}>% ⌄</option>
                            <option value="flat" \${addon.discountType === 'flat' ? 'selected' : ''}>₹ ⌄</option>
                          </select>
                        </div>
                      </td>

                      <!-- Tax (Screenshot 1: "Select a Tax ▾" for empty, GST18 for filled) -->
                      <td style="padding:1rem 0.75rem;">
                        <select id="zoho-addon-tax-\${idx}" style="border:1px solid #D1D5DB; border-radius:4px; padding:4px; font-size:0.8rem; width:100%; color:#4B5563;" onchange="window.smatApp.updateZohoSubCalculations()">
                          \${isRowEmpty ? \`<option value="0" selected>Select a Tax</option>\` : ''}
                          <option value="18" \${addon.taxRate === 18 ? 'selected' : ''}>GST18 [18%]</option>
                          <option value="12" \${addon.taxRate === 12 ? 'selected' : ''}>GST12 [12%]</option>
                          <option value="5" \${addon.taxRate === 5 ? 'selected' : ''}>GST5 [5%]</option>
                          <option value="0" \${addon.taxRate === 0 && !isRowEmpty ? 'selected' : ''}>None [0%]</option>
                        </select>
                      </td>

                      <!-- Live Amount & Far Right Row Actions (··· and ⓧ) (Screenshot 1) -->
                      <td style="padding:1rem; text-align:right; white-space:nowrap;">
                        <div style="display:inline-flex; align-items:center; justify-content:flex-end; gap:0.45rem;">
                          <div id="zoho-addon-amount-\${idx}" style="font-weight:700; color:#111827; font-size:0.9rem;">
                            Rs. \${isRowEmpty ? '0.00' : (addon.price * addon.qty).toLocaleString('en-IN') + '.00'}
                          </div>
                          \${isRowEmpty ? \`
                            <button type="button" style="width:24px; height:24px; border-radius:50%; border:1px solid #E5E7EB; background:#FFFFFF; color:#6B7280; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; font-size:11px; padding:0;" title="More options">···</button>
                            <button type="button" onclick="window.smatApp.removeZohoSubAddonRow(\${idx})" style="width:22px; height:22px; border-radius:50%; border:1px solid #FCA5A5; background:#FEF2F2; color:#DC2626; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; font-size:11px; font-weight:700; padding:0;" title="Delete row">✕</button>
                          \` : ''}
                        </div>
                      </td>
                    </tr>
                    \`;
                  }).join('')}
                </tbody>`;

// 3. Update addZohoSubAddonRow, onZohoAddonChange, removeZohoSubAddonRow
const targetFunctions = `  function onZohoAddonChange(idx, val) {
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
  }`;

const replacementFunctions = `  function onZohoAddonChange(idx, val) {
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
  }

  function addZohoSubAddonRow() {
    // Screenshot 1: Creates an empty new row with "Type or click to select an addon."
    zohoSubAddons.push({
      id: \`addon_\${Date.now()}\`,
      name: '',
      desc: '',
      sac: '998314',
      qty: 1,
      unit: '',
      price: 0,
      discountVal: 0,
      discountType: 'percent',
      taxRate: 0,
      isEmpty: true
    });
    const viewport = document.getElementById('route-viewport');
    if (viewport) renderZohoSubscriptionView(viewport);
    // Focus the new row picker
    setTimeout(() => {
      const picker = document.getElementById(\`zoho-addon-picker-\${zohoSubAddons.length - 1}\`);
      if (picker) picker.focus();
    }, 50);
  }

  function removeZohoSubAddonRow(idx) {
    if (zohoSubAddons.length <= 1) {
      // If single item, reset it to empty
      zohoSubAddons[0] = {
        id: \`addon_\${Date.now()}\`,
        name: '',
        desc: '',
        sac: '998314',
        qty: 1,
        unit: '',
        price: 0,
        discountVal: 0,
        discountType: 'percent',
        taxRate: 0,
        isEmpty: true
      };
    } else {
      zohoSubAddons.splice(idx, 1);
    }
    const viewport = document.getElementById('route-viewport');
    if (viewport) renderZohoSubscriptionView(viewport);
    updateZohoSubCalculations();
  }`;

let normContent = content.replace(/\r\n/g, '\n');
let normTargetInit = targetInit.replace(/\r\n/g, '\n');
let normTargetTbody = targetTbody.replace(/\r\n/g, '\n');
let normTargetFunctions = targetFunctions.replace(/\r\n/g, '\n');

if (normContent.includes(normTargetInit) && normContent.includes(normTargetTbody) && normContent.includes(normTargetFunctions)) {
  normContent = normContent.replace(normTargetInit, replacementInit.replace(/\r\n/g, '\n'));
  normContent = normContent.replace(normTargetTbody, replacementTbody.replace(/\r\n/g, '\n'));
  normContent = normContent.replace(normTargetFunctions, replacementFunctions.replace(/\r\n/g, '\n'));
  fs.writeFileSync('frontend/js/app.js', normContent.replace(/\n/g, '\r\n'), 'utf8');
  console.log('Successfully updated addon row behavior to match Screenshot 1!');
} else {
  console.log('Failed to match targets:', {
    targetInit: normContent.includes(normTargetInit),
    targetTbody: normContent.includes(normTargetTbody),
    targetFunctions: normContent.includes(normTargetFunctions)
  });
}
