const fs = require('fs');
const path = require('path');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'js', 'app.js'), 'utf8');
const start = appJs.indexOf('<!-- Plan Table');
const tbodyEnd = appJs.indexOf('</tbody>', start);
console.log(appJs.substring(start, tbodyEnd + 8));
