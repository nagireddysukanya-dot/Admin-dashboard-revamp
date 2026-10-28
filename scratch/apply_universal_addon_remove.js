const fs = require('fs');

let content = fs.readFileSync('frontend/js/app.js', 'utf8');

// 1. Remove duplicate 'x' next to addon title in populated row
const oldTitleRow = `<div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                                <span style="font-weight:600; color:#111827; font-size:0.88rem;">\${escapeHtml(addon.name)}</span>
                                <span style="color:#9CA3AF; cursor:pointer; font-size:0.95rem; margin-left:6px;" onclick="window.smatApp.removeZohoSubAddonRow(\${idx})" title="Clear / Remove Add-on">✕</span>
                              </div>`;

const newTitleRow = `<div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                                <span style="font-weight:600; color:#111827; font-size:0.88rem;">\${escapeHtml(addon.name)}</span>
                              </div>`;

// 2. Make the right-side '···' and 'ⓧ' buttons universal for ALL addon rows
const oldAmountCell = `                      <!-- Live Amount & Far Right Row Actions (··· and ⓧ) (Screenshot 1) -->
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
                      </td>`;

const newAmountCell = `                      <!-- Live Amount & Far Right Row Actions (··· and ⓧ for ALL addon rows) -->
                      <td style="padding:1rem; text-align:right; white-space:nowrap;">
                        <div style="display:inline-flex; align-items:center; justify-content:flex-end; gap:0.45rem;">
                          <div id="zoho-addon-amount-\${idx}" style="font-weight:700; color:#111827; font-size:0.9rem;">
                            Rs. \${isRowEmpty ? '0.00' : (addon.price * addon.qty).toLocaleString('en-IN') + '.00'}
                          </div>
                          <button type="button" style="width:24px; height:24px; border-radius:50%; border:1px solid #E5E7EB; background:#FFFFFF; color:#6B7280; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; font-size:11px; padding:0;" title="More options">···</button>
                          <button type="button" onclick="window.smatApp.removeZohoSubAddonRow(\${idx})" style="width:22px; height:22px; border-radius:50%; border:1px solid #FCA5A5; background:#FEF2F2; color:#DC2626; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; font-size:11px; font-weight:700; padding:0;" title="Delete row">✕</button>
                        </div>
                      </td>`;

let normContent = content.replace(/\r\n/g, '\n');
const normOldTitleRow = oldTitleRow.replace(/\r\n/g, '\n');
const normOldAmountCell = oldAmountCell.replace(/\r\n/g, '\n');

if (normContent.includes(normOldTitleRow) && normContent.includes(normOldAmountCell)) {
  normContent = normContent.replace(normOldTitleRow, newTitleRow.replace(/\r\n/g, '\n'));
  normContent = normContent.replace(normOldAmountCell, newAmountCell.replace(/\r\n/g, '\n'));
  fs.writeFileSync('frontend/js/app.js', normContent.replace(/\n/g, '\r\n'), 'utf8');
  console.log('Successfully made remove option available for ALL addon rows!');
} else {
  console.log('Failed to match targets:', {
    titleRow: normContent.includes(normOldTitleRow),
    amountCell: normContent.includes(normOldAmountCell)
  });
}
