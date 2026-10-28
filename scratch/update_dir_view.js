const fs = require('fs');
let content = fs.readFileSync('frontend/js/app.js', 'utf8');

const targetStr = `    container.innerHTML = \`
      <!-- Top Metrics Overview -->`;

const replacementStr = `    container.innerHTML = \`
      <!-- Sub-Navigation Bar for Subscriptions (Zoho Reference vs Directory) -->
      <div style="padding:0.75rem 2rem 0 2rem; background:#F8FAFC; border-bottom:1px solid #E5E7EB; display:flex; gap:0.5rem; align-items:center; margin-bottom:1.5rem;">
        <button class="btn-table-action btn-action-secondary" style="background:#FFFFFF; border-radius:6px 6px 0 0; padding:0.55rem 1.25rem; font-weight:500;" onclick="window.smatApp.openZohoSubscription(10)">
          ⚡ Change / New Subscription
        </button>
        <button class="btn-table-action btn-action-primary" style="background:#1877F2; border-color:#1877F2; border-radius:6px 6px 0 0; padding:0.55rem 1.25rem; font-weight:600;" onclick="window.smatApp.navigateTo('subscriptions-directory')">
          📋 Active Client Subscriptions Directory
        </button>
      </div>

      <!-- Top Metrics Overview -->`;

const normalizedTarget = targetStr.replace(/\r\n/g, '\n');
const normalizedContent = content.replace(/\r\n/g, '\n');

if (normalizedContent.includes(normalizedTarget)) {
  const updated = normalizedContent.replace(normalizedTarget, replacementStr.replace(/\r\n/g, '\n'));
  fs.writeFileSync('frontend/js/app.js', updated.replace(/\n/g, '\r\n'), 'utf8');
  console.log('Successfully updated renderClientSubscriptionsView with sub-nav tabs!');
} else {
  console.log('Target string not found!');
}
