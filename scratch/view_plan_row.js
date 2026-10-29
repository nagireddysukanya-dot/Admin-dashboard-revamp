const fs = require('fs');
const content = fs.readFileSync('frontend/js/app.js', 'utf8').split(/\r?\n/);
content.forEach((line, i) => {
  if (line.includes('zoho-plan-row')) {
    console.log('Line:', i + 1);
  }
});
