const fs = require('fs');
const path = require('path');

// 1. Update frontend/css/styles.css
const cssPath = path.join(__dirname, '..', 'frontend', 'css', 'styles.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

const planHoverCss = `
/* Zoho Plan Row Hover Actions (Screenshot 1, 2, 3 Match) */
.zoho-plan-table-row {
  transition: background-color 0.15s ease;
}

.zoho-plan-table-row:hover {
  background-color: #FAFAFA;
}

.zoho-plan-table-row .zoho-plan-row-actions {
  display: inline-flex;
  align-items: center;
  margin-left: 0.45rem;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s ease, visibility 0.15s ease;
}

.zoho-plan-table-row:hover .zoho-plan-row-actions,
.zoho-plan-table-row:focus-within .zoho-plan-row-actions,
.zoho-plan-table-row .zoho-plan-row-actions.open {
  opacity: 1;
  visibility: visible;
}

.zoho-addon-table-row .zoho-addon-row-actions.open {
  opacity: 1 !important;
  visibility: visible !important;
}

.zoho-btn-row-more.active {
  border-color: #2563EB !important;
  color: #2563EB !important;
  background: #EFF6FF !important;
}
`;

if (!cssContent.includes('.zoho-plan-table-row')) {
  cssContent += '\n' + planHoverCss;
  fs.writeFileSync(cssPath, cssContent, 'utf8');
  console.log('Added Plan hover and active button CSS to styles.css');
}

// 2. Update frontend/js/app.js
const appPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');
let norm = appContent.replace(/\r\n/g, '\n');

// 2a. Add zoho-plan-table-row to plan <tr>
const oldPlanTr = `<tr style="border-bottom:1px solid #F3F4F6; vertical-align:top;">\n                    \n                    <!-- Plan Thumbnail & Name & SAC Badge -->`;
const newPlanTr = `<tr class="zoho-plan-table-row" style="border-bottom:1px solid #F3F4F6; vertical-align:top;" id="zoho-plan-row">\n                    \n                    <!-- Plan Thumbnail & Name & SAC Badge -->`;

if (norm.includes(oldPlanTr)) {
  norm = norm.replace(oldPlanTr, newPlanTr);
  console.log('Added zoho-plan-table-row to plan table tr');
}

// 2b. Replace Plan Live Amount cell with hoverable three dots and tooltip
const oldPlanAmountCell = `                    <!-- Live Amount -->
                    <td style="padding:1rem; text-align:right;">
                      <div id="zoho-plan-row-amount" style="font-weight:700; color:#111827; font-size:0.92rem;">Rs. \${matchedPlan.price.toLocaleString('en-IN')}.00</div>
                      <div style="font-size:0.74rem; color:#6B7280; margin-top:2px;">\${matchedPlan.cycle}</div>
                    </td>`;

const newPlanAmountCell = `                    <!-- Live Amount & Row Actions (··· on hover - Screenshot 1, 2, 3 Match) -->
                    <td style="padding:1rem; text-align:right; white-space:nowrap; position:relative;">
                      <div style="display:inline-flex; align-items:center; justify-content:flex-end; gap:0.45rem;">
                        <div style="text-align:right;">
                          <div id="zoho-plan-row-amount" style="font-weight:700; color:#111827; font-size:0.92rem;">Rs. \${matchedPlan.price.toLocaleString('en-IN')}.00</div>
                          <div style="font-size:0.74rem; color:#6B7280; margin-top:2px;">\${matchedPlan.cycle}</div>
                        </div>
                        <div id="zoho-plan-actions-wrap" class="zoho-plan-row-actions" style="position:relative;">
                          <button type="button" id="zoho-plan-more-btn" class="zoho-btn-row-more zoho-more-trigger" onclick="event.stopPropagation(); window.smatApp.togglePlanMoreTooltip(event)" title="More options">···</button>

                          <!-- Dark Tooltip Bubble (Screenshot 3 Match) -->
                          <div id="zoho-plan-more-tooltip" class="zoho-more-popover" style="display:none; position:absolute; right:calc(100% + 10px); top:50%; transform:translateY(-50%); z-index:9999; background:#1E293B; color:#FFFFFF; border-radius:6px; padding:7px 12px; font-size:0.78rem; font-weight:500; white-space:nowrap; box-shadow:0 8px 20px rgba(0,0,0,0.25);">
                            <!-- Right-pointing triangle arrow -->
                            <div style="position:absolute; right:-5px; top:50%; transform:translateY(-50%); width:0; height:0; border-top:5px solid transparent; border-bottom:5px solid transparent; border-left:5px solid #1E293B;"></div>
                            Click here to add additional information for this item.
                          </div>
                        </div>
                      </div>
                    </td>`;

if (norm.includes(oldPlanAmountCell)) {
  norm = norm.replace(oldPlanAmountCell, newPlanAmountCell);
  console.log('Updated Plan Live Amount cell with hoverable three dots and Screenshot 3 tooltip');
}

// 2c. Update Addon Live Amount cell to include Screenshot 4 dropdown menu
const oldAddonAmountCell = `                      <!-- Live Amount & Far Right Row Actions (··· and ⓧ for ALL addon rows) -->
                      <td style="padding:1rem; text-align:right; white-space:nowrap;">
                        <div style="display:inline-flex; align-items:center; justify-content:flex-end; gap:0.45rem;">
                          <div id="zoho-addon-amount-\${idx}" style="font-weight:700; color:#111827; font-size:0.9rem;">
                            Rs. \${isRowEmpty ? '0.00' : (addon.price * addon.qty).toLocaleString('en-IN') + '.00'}
                          </div>
                          <div class="zoho-addon-row-actions">
                            <button type="button" class="zoho-btn-row-more" title="More options">···</button>
                            <button type="button" class="zoho-btn-row-delete" onclick="window.smatApp.removeZohoSubAddonRow(\${idx})" title="Delete row">✕</button>
                          </div>
                        </div>
                      </td>`;

const newAddonAmountCell = `                      <!-- Live Amount & Far Right Row Actions (··· and ⓧ on hover - Screenshot 4 Match) -->
                      <td style="padding:1rem; text-align:right; white-space:nowrap; position:relative;">
                        <div style="display:inline-flex; align-items:center; justify-content:flex-end; gap:0.45rem;">
                          <div id="zoho-addon-amount-\${idx}" style="font-weight:700; color:#111827; font-size:0.9rem;">
                            Rs. \${isRowEmpty ? '0.00' : (addon.price * addon.qty).toLocaleString('en-IN') + '.00'}
                          </div>
                          <div id="zoho-addon-actions-wrap-\${idx}" class="zoho-addon-row-actions" style="position:relative;">
                            <button type="button" id="zoho-addon-more-btn-\${idx}" class="zoho-btn-row-more zoho-more-trigger" onclick="event.stopPropagation(); window.smatApp.toggleAddonMoreMenu(\${idx}, event)" title="More options">···</button>
                            <button type="button" class="zoho-btn-row-delete" onclick="window.smatApp.removeZohoSubAddonRow(\${idx})" title="Delete row">✕</button>

                            <!-- Addon More Options Dropdown Menu (Screenshot 4 Match) -->
                            <div id="zoho-addon-more-menu-\${idx}" class="zoho-more-popover zoho-addon-menu-dropdown" style="display:none; position:absolute; top:calc(100% + 6px); right:0; z-index:9999; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:6px; box-shadow:0 10px 25px rgba(0,0,0,0.15); width:210px; overflow:hidden; text-align:left; font-size:0.83rem;">
                              <div style="background:#2563EB; color:#FFFFFF; padding:9px 14px; font-weight:500; cursor:pointer;" onclick="window.smatApp.closeAllMorePopovers()">
                                Show Additional Information
                              </div>
                              <div style="padding:9px 14px; color:#374151; cursor:pointer; border-top:1px solid #F3F4F6;" onmouseover="this.style.background='#F9FAFB'" onmouseout="this.style.background='#FFFFFF'" onclick="window.smatApp.addZohoSubAddonRow(); window.smatApp.closeAllMorePopovers();">
                                Insert New Row
                              </div>
                              <div style="padding:9px 14px; color:#374151; cursor:pointer; border-top:1px solid #F3F4F6;" onmouseover="this.style.background='#F9FAFB'" onmouseout="this.style.background='#FFFFFF'" onclick="window.smatApp.closeAllMorePopovers()">
                                Insert New Header
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>`;

if (norm.includes(oldAddonAmountCell)) {
  norm = norm.replace(oldAddonAmountCell, newAddonAmountCell);
  console.log('Updated Addon Live Amount cell with Screenshot 4 dropdown menu');
}

// 2d. Add handler functions togglePlanMoreTooltip, toggleAddonMoreMenu, closeAllMorePopovers
const helperFunctions = `
  function closeAllMorePopovers() {
    document.querySelectorAll('.zoho-more-popover').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.zoho-btn-row-more').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.zoho-plan-row-actions').forEach(w => w.classList.remove('open'));
    document.querySelectorAll('.zoho-addon-row-actions').forEach(w => w.classList.remove('open'));
  }

  function togglePlanMoreTooltip(evt) {
    if (evt) evt.stopPropagation();
    const tooltip = document.getElementById('zoho-plan-more-tooltip');
    const btn = document.getElementById('zoho-plan-more-btn');
    const wrap = document.getElementById('zoho-plan-actions-wrap');
    if (!tooltip) return;
    const isCurrentlyOpen = tooltip.style.display === 'block';
    closeAllMorePopovers();
    if (!isCurrentlyOpen) {
      tooltip.style.display = 'block';
      if (btn) btn.classList.add('active');
      if (wrap) wrap.classList.add('open');
    }
  }

  function toggleAddonMoreMenu(idx, evt) {
    if (evt) evt.stopPropagation();
    const menu = document.getElementById(\`zoho-addon-more-menu-\${idx}\`);
    const btn = document.getElementById(\`zoho-addon-more-btn-\${idx}\`);
    const wrap = document.getElementById(\`zoho-addon-actions-wrap-\${idx}\`);
    if (!menu) return;
    const isCurrentlyOpen = menu.style.display === 'block';
    closeAllMorePopovers();
    if (!isCurrentlyOpen) {
      menu.style.display = 'block';
      if (btn) btn.classList.add('active');
      if (wrap) wrap.classList.add('open');
    }
  }
`;

// Insert helperFunctions right before handleOutsideClick
const targetHandleOutside = `  if (typeof document !== 'undefined') {
    const handleOutsideClick = (e) => {`;

const replacementHandleOutside = `${helperFunctions}
  if (typeof document !== 'undefined') {
    const handleOutsideClick = (e) => {
      // Close Plan & Addon three dots popovers/tooltips on outside tap
      if (!e.target.closest('.zoho-more-popover') && !e.target.closest('.zoho-more-trigger')) {
        closeAllMorePopovers();
      }`;

if (norm.includes(targetHandleOutside)) {
  norm = norm.replace(targetHandleOutside, replacementHandleOutside);
  console.log('Added popover toggle handlers and updated outside click listener');
}

// 2e. Expose functions to window.smatApp
const exportTarget = `toggleAddressPopover,
    openEditAddressModal,`;

const exportReplacement = `toggleAddressPopover,
    openEditAddressModal,
    togglePlanMoreTooltip,
    toggleAddonMoreMenu,
    closeAllMorePopovers,`;

if (norm.includes(exportTarget)) {
  norm = norm.replace(exportTarget, exportReplacement);
  console.log('Exported togglePlanMoreTooltip, toggleAddonMoreMenu, closeAllMorePopovers to window.smatApp');
}

fs.writeFileSync(appPath, norm.replace(/\n/g, '\r\n'), 'utf8');
console.log('frontend/js/app.js updated successfully with three dots features!');
