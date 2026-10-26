const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
let code = fs.readFileSync(appJsPath, 'utf8');

// Replace app-layout-wrapper with app-layout-wrapper sidebar-collapsed
code = code.replace(
  '<div class="app-layout-wrapper" id="admin-app-root">',
  '<div class="app-layout-wrapper sidebar-collapsed" id="admin-app-root">'
);

fs.writeFileSync(appJsPath, code, 'utf8');
console.log('Successfully set sidebar to collapsed by default in app-layout-wrapper!');
