const fs = require('fs');
let content = fs.readFileSync('frontend/js/app.js', 'utf8');

// 1. Remove chip in renderZohoSubscriptionView
const chip1 = `                  <!-- Customer Name Right Chip (Screenshot 1) -->
                  <div style="margin-left:auto; background:#1F2937; color:#F9FAFB; padding:0.45rem 1rem; border-radius:4px; font-size:0.82rem; font-weight:500; display:flex; align-items:center; gap:0.5rem;">
                    <span>\${escapeHtml(currClient.name)} - \${escapeHtml(currClient.email.substring(0, 14))}...</span>
                    <span>›</span>
                  </div>`;

// 2. Remove chip in openPlanModal
const chip2 = `                    <!-- Customer Chip on Far Right -->
                    <div style="margin-left:auto; background:#1F2937; color:#F9FAFB; padding:0.45rem 0.85rem; border-radius:4px; font-size:0.8rem; font-weight:500; display:flex; align-items:center; gap:0.4rem;">
                      <span>\${escapeHtml(currClientObj.name || 'deepak')} - \${escapeHtml((currClientObj.email || 'suryadesigner1234@gmail.com').substring(0, 13))}...</span>
                      <span>›</span>
                    </div>`;

let normalizedContent = content.replace(/\r\n/g, '\n');
const normalizedChip1 = chip1.replace(/\r\n/g, '\n');
const normalizedChip2 = chip2.replace(/\r\n/g, '\n');

let removedCount = 0;
if (normalizedContent.includes(normalizedChip1)) {
  normalizedContent = normalizedContent.replace(normalizedChip1, '');
  removedCount++;
}

if (normalizedContent.includes(normalizedChip2)) {
  normalizedContent = normalizedContent.replace(normalizedChip2, '');
  removedCount++;
}

if (removedCount > 0) {
  fs.writeFileSync('frontend/js/app.js', normalizedContent.replace(/\n/g, '\r\n'), 'utf8');
  console.log(`Successfully removed customer dark badge from ${removedCount} locations!`);
} else {
  console.log('Customer chips not found!');
}
