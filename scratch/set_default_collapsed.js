const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
let content = fs.readFileSync(appJsPath, 'utf8');

content = content.replace(
  '<div class="modular-card" id="card-client-profile">',
  '<div class="modular-card collapsed" id="card-client-profile">'
);

content = content.replace(
  '<div class="modular-card" id="card-plan-quotas">',
  '<div class="modular-card collapsed" id="card-plan-quotas">'
);

content = content.replace(
  '<div class="modular-card modular-card-full" id="card-billing-center">',
  '<div class="modular-card modular-card-full collapsed" id="card-billing-center">'
);

content = content.replace(
  '<div class="modular-card modular-card-full" id="client-configured-bots-card">',
  '<div class="modular-card modular-card-full collapsed" id="client-configured-bots-card">'
);

content = content.replace(
  '<div class="modular-card" id="card-support-agents">',
  '<div class="modular-card collapsed" id="card-support-agents">'
);

content = content.replace(
  '<div class="modular-card" id="card-system-logs">',
  '<div class="modular-card collapsed" id="card-system-logs">'
);

fs.writeFileSync(appJsPath, content, 'utf8');
console.log('Successfully set all modular cards to collapsed by default!');
