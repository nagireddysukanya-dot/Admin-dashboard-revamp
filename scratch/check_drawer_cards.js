const fs = require('fs');
const path = require('path');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'js', 'app.js'), 'utf8');
const start = appJs.indexOf('id="zoho-drawer-address-card"');
console.log(appJs.substring(start, start + 2500));
