const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');
let norm = appContent.replace(/\r\n/g, '\n');

// 1. Update handleOutsideClick to close GST popover
const oldOutsideCode = `      // 2. Address popover close on tap anywhere outside
      if (!e.target.closest('.zoho-addr-popover') && !e.target.closest('.zoho-addr-trigger')) {
        document.querySelectorAll('.zoho-addr-popover').forEach(p => {
          p.style.display = 'none';
        });
      }
    };`;

const newOutsideCode = `      // 2. Address popover close on tap anywhere outside
      if (!e.target.closest('.zoho-addr-popover') && !e.target.closest('.zoho-addr-trigger')) {
        document.querySelectorAll('.zoho-addr-popover').forEach(p => {
          p.style.display = 'none';
        });
      }

      // 3. GST Preferences popover close on tap anywhere outside
      if (!e.target.closest('.zoho-gst-pref-popover') && !e.target.closest('.zoho-gst-pref-trigger')) {
        closeGstPreferencesPopover();
      }
    };`;

if (norm.includes(oldOutsideCode)) {
  norm = norm.replace(oldOutsideCode, newOutsideCode);
  console.log('Added GST popover close to handleOutsideClick');
}

// 2. Add methods to export list
const oldExport = `    saveSacCode,
    addZohoSubAddonRow,`;

const newExport = `    saveSacCode,
    togglePlanMoreTooltip,
    toggleAddonMoreMenu,
    closeAllMorePopovers,
    toggleGstPreferencesPopover,
    closeGstPreferencesPopover,
    saveGstPreferences,
    addZohoSubAddonRow,`;

if (norm.includes(oldExport)) {
  norm = norm.replace(oldExport, newExport);
  console.log('Exported all new methods to window.smatApp');
}

fs.writeFileSync(appPath, norm.replace(/\n/g, '\r\n'), 'utf8');
console.log('Done!');
