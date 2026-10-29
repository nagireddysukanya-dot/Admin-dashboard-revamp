const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');
let norm = appContent.replace(/\r\n/g, '\n');

// 1. Target the billing GST details treatment line
const oldGstTreatmentLine = `                  <div style="color:#374151;">
                    GST Treatment: <span style="font-weight:600; color:#111827;">\${escapeHtml(currClient.gst_treatment || 'Unregistered Business')}</span> <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="cursor:pointer; vertical-align:middle;" title="Edit GST Treatment"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                  </div>`;

const newGstTreatmentLine = `                  <div style="color:#374151; position:relative;" class="zoho-gst-pref-wrap">
                    GST Treatment: <span id="zoho-gst-treatment-display" style="font-weight:600; color:#111827;">\${escapeHtml(currClient.gst_treatment || 'Unregistered Business')}</span>
                    <span class="zoho-gst-pref-trigger" onclick="event.stopPropagation(); window.smatApp.toggleGstPreferencesPopover(event)" style="cursor:pointer; display:inline-flex; align-items:center; margin-left:4px;" title="Configure Tax Preferences">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </span>

                    <!-- Configure Tax Preferences Popover (Screenshot 1 Match) -->
                    <div id="zoho-gst-pref-popover" class="zoho-gst-pref-popover" style="display:none; position:absolute; bottom:calc(100% + 10px); left:-10px; z-index:9999; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:8px; box-shadow:0 12px 30px rgba(0,0,0,0.18); width:310px; padding:14px 16px;">
                      <!-- Bottom-pointing triangle arrow -->
                      <div style="position:absolute; bottom:-6px; left:85px; width:10px; height:10px; background:#FFFFFF; border-right:1px solid #E5E7EB; border-bottom:1px solid #E5E7EB; transform:rotate(45deg);"></div>

                      <!-- Header with Red Close Button -->
                      <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:8px; border-bottom:1px solid #E5E7EB; margin-bottom:12px;">
                        <div style="font-size:0.95rem; font-weight:600; color:#1E293B;">Configure Tax Preferences</div>
                        <button type="button" onclick="event.stopPropagation(); window.smatApp.closeGstPreferencesPopover()" style="border:none; background:none; color:#EF4444; font-size:1.15rem; font-weight:700; cursor:pointer; line-height:1; padding:0 2px;" title="Close">✕</button>
                      </div>

                      <!-- GST Treatment Select -->
                      <div style="margin-bottom:12px;">
                        <label style="display:block; font-size:0.83rem; font-weight:500; color:#4B5563; margin-bottom:5px;">GST Treatment</label>
                        <select id="zoho-gst-treatment-input" style="width:100%; border:1px solid #CBD5E1; border-radius:4px; padding:6px 10px; font-size:0.86rem; color:#1E293B; background:#FFFFFF; outline:none; cursor:pointer;">
                          <option value="Unregistered Business" \${(currClient.gst_treatment || 'Unregistered Business') === 'Unregistered Business' ? 'selected' : ''}>Unregistered Business</option>
                          <option value="Registered Business - Regular" \${currClient.gst_treatment === 'Registered Business - Regular' ? 'selected' : ''}>Registered Business - Regular</option>
                          <option value="Registered Business - Composition" \${currClient.gst_treatment === 'Registered Business - Composition' ? 'selected' : ''}>Registered Business - Composition</option>
                          <option value="Consumer" \${currClient.gst_treatment === 'Consumer' ? 'selected' : ''}>Consumer</option>
                          <option value="Overseas" \${currClient.gst_treatment === 'Overseas' ? 'selected' : ''}>Overseas</option>
                          <option value="Special Economic Zone" \${currClient.gst_treatment === 'Special Economic Zone' ? 'selected' : ''}>Special Economic Zone</option>
                          <option value="Deemed Export" \${currClient.gst_treatment === 'Deemed Export' ? 'selected' : ''}>Deemed Export</option>
                        </select>
                      </div>

                      <!-- Make it permanent? Checkbox -->
                      <div style="margin-bottom:14px;">
                        <div style="font-size:0.85rem; font-weight:500; color:#1E293B; margin-bottom:6px;">Make it permanent?</div>
                        <label style="display:flex; align-items:flex-start; gap:8px; font-size:0.8rem; color:#4B5563; cursor:pointer; line-height:1.4;">
                          <input type="checkbox" id="zoho-gst-permanent-check" style="accent-color:#2563EB; width:15px; height:15px; margin-top:1px; flex-shrink:0;" />
                          <span>Use these settings for all future transactions of this customer.</span>
                        </label>
                      </div>

                      <!-- Actions -->
                      <div style="display:flex; gap:8px; padding-top:10px; border-top:1px solid #F1F5F9;">
                        <button type="button" onclick="event.stopPropagation(); window.smatApp.saveGstPreferences()" style="background:#2563EB; color:#FFFFFF; border:none; border-radius:4px; padding:6px 16px; font-size:0.84rem; font-weight:600; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,0.05);">Update</button>
                        <button type="button" onclick="event.stopPropagation(); window.smatApp.closeGstPreferencesPopover()" style="background:#FFFFFF; border:1px solid #D1D5DB; color:#374151; border-radius:4px; padding:6px 14px; font-size:0.84rem; font-weight:500; cursor:pointer;">Cancel</button>
                      </div>
                    </div>
                  </div>`;

if (norm.includes(oldGstTreatmentLine)) {
  norm = norm.replace(oldGstTreatmentLine, newGstTreatmentLine);
  console.log('Replaced GST treatment line with Configure Tax Preferences Popover');
} else {
  console.error('Could not find oldGstTreatmentLine in app.js');
}

// 2. Add functions: toggleGstPreferencesPopover, closeGstPreferencesPopover, saveGstPreferences
const gstFunctions = `
  function toggleGstPreferencesPopover(evt) {
    if (evt) evt.stopPropagation();
    const pop = document.getElementById('zoho-gst-pref-popover');
    if (!pop) return;
    const isCurrentlyOpen = pop.style.display === 'block';
    closeAllMorePopovers();
    document.querySelectorAll('.zoho-addr-popover').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.zoho-sac-popover').forEach(p => p.style.display = 'none');
    if (!isCurrentlyOpen) {
      pop.style.display = 'block';
    } else {
      pop.style.display = 'none';
    }
  }

  function closeGstPreferencesPopover() {
    const pop = document.getElementById('zoho-gst-pref-popover');
    if (pop) pop.style.display = 'none';
  }

  function saveGstPreferences() {
    const input = document.getElementById('zoho-gst-treatment-input');
    const val = input ? input.value : 'Unregistered Business';
    const currClient = clientsData.find(c => c.id === zohoSubscriptionClientId || c.id === Number(zohoSubscriptionClientId)) || clientsData[0];
    if (currClient) {
      currClient.gst_treatment = val;
    }
    const displaySpan = document.getElementById('zoho-gst-treatment-display');
    if (displaySpan) {
      displaySpan.innerText = val;
    }
    closeGstPreferencesPopover();
  }
`;

const targetBeforeHelper = `  function closeAllMorePopovers() {`;
if (norm.includes(targetBeforeHelper)) {
  norm = norm.replace(targetBeforeHelper, gstFunctions + '\n' + targetBeforeHelper);
  console.log('Added GST preference popover helper functions');
}

// 3. Update outside click listener to close GST Preferences popover
const oldOutsideCheck = `      // Close Address popover if tap is outside the popover and outside the trigger
      if (!e.target.closest('.zoho-addr-popover') && !e.target.closest('.zoho-addr-trigger')) {
        document.querySelectorAll('.zoho-addr-popover').forEach(p => {
          p.style.display = 'none';
        });
      }`;

const newOutsideCheck = `      // Close Address popover if tap is outside the popover and outside the trigger
      if (!e.target.closest('.zoho-addr-popover') && !e.target.closest('.zoho-addr-trigger')) {
        document.querySelectorAll('.zoho-addr-popover').forEach(p => {
          p.style.display = 'none';
        });
      }

      // Close GST Preferences popover on outside tap
      if (!e.target.closest('.zoho-gst-pref-popover') && !e.target.closest('.zoho-gst-pref-trigger')) {
        closeGstPreferencesPopover();
      }`;

if (norm.includes(oldOutsideCheck)) {
  norm = norm.replace(oldOutsideCheck, newOutsideCheck);
  console.log('Updated outside click listener to close GST popover');
}

// 4. Export functions to window.smatApp
const exportTarget = `togglePlanMoreTooltip,
    toggleAddonMoreMenu,`;

const exportReplacement = `togglePlanMoreTooltip,
    toggleAddonMoreMenu,
    toggleGstPreferencesPopover,
    closeGstPreferencesPopover,
    saveGstPreferences,`;

if (norm.includes(exportTarget)) {
  norm = norm.replace(exportTarget, exportReplacement);
  console.log('Exported GST preference methods to window.smatApp');
}

fs.writeFileSync(appPath, norm.replace(/\n/g, '\r\n'), 'utf8');
console.log('Updated frontend/js/app.js successfully!');
