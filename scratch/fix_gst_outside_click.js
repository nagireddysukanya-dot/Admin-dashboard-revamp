const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

const target = `      // 2. Address popover close on tap anywhere outside
      if (!e.target.closest('.zoho-addr-popover') && !e.target.closest('.zoho-addr-trigger')) {
        document.querySelectorAll('.zoho-addr-popover').forEach(p => p.style.display = 'none');
      }`;

const replacement = `      // 2. Address popover close on tap anywhere outside
      if (!e.target.closest('.zoho-addr-popover') && !e.target.closest('.zoho-addr-trigger')) {
        document.querySelectorAll('.zoho-addr-popover').forEach(p => p.style.display = 'none');
      }

      // 3. GST Preferences popover close on tap anywhere outside
      if (!e.target.closest('.zoho-gst-pref-popover') && !e.target.closest('.zoho-gst-pref-trigger')) {
        closeGstPreferencesPopover();
      }`;

let norm = appContent.replace(/\r\n/g, '\n');
if (norm.includes(target)) {
  norm = norm.replace(target, replacement);
  fs.writeFileSync(appPath, norm.replace(/\n/g, '\r\n'), 'utf8');
  console.log('Successfully added GST outside click handler to app.js');
} else {
  console.error('Target not found in app.js');
}
