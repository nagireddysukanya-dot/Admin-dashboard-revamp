const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
let js = fs.readFileSync(jsPath, 'utf8');

console.log('--- Applying Direct Zoho Subscriptions View to Match Screenshot 3 ---');

// 1. In navigateTo, route === 'subscriptions' should render renderZohoSubscriptionView by default!
// And we also support 'subscriptions-directory' for the table list.
if (js.includes("} else if (route === 'subscriptions') {\n      renderClientSubscriptionsView(viewport);")) {
  js = js.replace(
    "} else if (route === 'subscriptions') {\n      renderClientSubscriptionsView(viewport);",
    "} else if (route === 'subscriptions') {\n      renderZohoSubscriptionView(viewport);\n    } else if (route === 'subscriptions-directory') {\n      renderClientSubscriptionsView(viewport);"
  );
  console.log('✓ Routed subscriptions directly to renderZohoSubscriptionView (Screenshot 3)');
}

// 2. In openAddSubscriptionModal, make it call openZohoSubscription(10)
const oldOpenAddSub = `  function openAddSubscriptionModal() {
    openPlanModal(null, 'Pro', true);
  }`;

const newOpenAddSub = `  function openAddSubscriptionModal() {
    openZohoSubscription(10);
  }`;

if (js.includes(oldOpenAddSub)) {
  js = js.replace(oldOpenAddSub, newOpenAddSub);
  console.log('✓ Made openAddSubscriptionModal call openZohoSubscription(10)');
}

// 3. In Active Subscriptions Directory view (renderClientSubscriptionsView), make + Add Subscription call openZohoSubscription(10)
const oldTableAddBtn = `<button class="btn-table-action btn-action-primary" onclick="window.smatApp.openAddSubscriptionModal()">
            ⚡ + Add Subscription
          </button>`;

const newTableAddBtn = `<button class="btn-table-action btn-action-primary" onclick="window.smatApp.openZohoSubscription(10)" style="background:#1877F2; border-color:#1877F2;">
            ⚡ + Add Subscription (Zoho Reference)
          </button>`;

if (js.includes(oldTableAddBtn)) {
  js = js.replace(oldTableAddBtn, newTableAddBtn);
  console.log('✓ Updated + Add Subscription button to call openZohoSubscription(10)');
}

// 4. In renderClientSubscriptionsView table rows, make Upgrade button call openZohoSubscription(c.id)
const oldRowUpgradeBtn = `<button class="btn-table-action btn-action-primary" onclick="window.smatApp.openPlanModal(\${c.id})" title="Upgrade or Change Plan">
                      ⚡ Upgrade
                    </button>`;

const newRowUpgradeBtn = `<button class="btn-table-action btn-action-primary" onclick="window.smatApp.openZohoSubscription(\${c.id})" title="Change Subscription">
                      ⚡ Change Subscription
                    </button>`;

if (js.includes(oldRowUpgradeBtn)) {
  js = js.replace(oldRowUpgradeBtn, newRowUpgradeBtn);
  console.log('✓ Updated table row Upgrade button to call openZohoSubscription(c.id)');
}

// 5. In renderZohoSubscriptionView, add top toggle tabs between Change Subscription & Directory, and add Phone Number + Country Code from teammate notes
const oldSubTitleBar = `        <!-- Sticky Top Title Bar (Screenshot 1) -->
        <div style="padding:1.25rem 2.5rem; border-bottom:1px solid #E5E7EB; background:#FFFFFF; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <button onclick="window.smatApp.navigateTo('subscriptions')" style="background:none; border:none; color:#6B7280; font-size:1.1rem; cursor:pointer;" title="Back to Subscriptions">←</button>
            <h1 style="font-size:1.35rem; font-weight:700; color:#111827; margin:0;">Change Subscription</h1>
          </div>
          <div style="font-size:0.8rem; color:#6B7280;">
            Official SmatBot Billing Engine • Zoho Subscriptions Integration
          </div>
        </div>`;

const newSubTitleBar = `        <!-- Sub-Navigation Bar for Subscriptions (Zoho Reference vs Directory) -->
        <div style="padding:0.75rem 2.5rem 0 2.5rem; background:#F8FAFC; border-bottom:1px solid #E5E7EB; display:flex; gap:0.5rem; align-items:center;">
          <button class="btn-table-action btn-action-primary" style="background:#1877F2; border-color:#1877F2; border-radius:6px 6px 0 0; padding:0.55rem 1.25rem; font-weight:600;" onclick="window.smatApp.openZohoSubscription(10)">
            ⚡ Change / New Subscription
          </button>
          <button class="btn-table-action btn-action-secondary" style="background:#FFFFFF; border-radius:6px 6px 0 0; padding:0.55rem 1.25rem; font-weight:500;" onclick="window.smatApp.navigateTo('subscriptions-directory')">
            📋 Active Client Subscriptions Directory
          </button>
        </div>

        <!-- Sticky Top Title Bar (Screenshot 1 & Screenshot 3) -->
        <div style="padding:1.25rem 2.5rem; border-bottom:1px solid #E5E7EB; background:#FFFFFF; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <h1 style="font-size:1.35rem; font-weight:700; color:#111827; margin:0;">Change Subscription</h1>
          </div>
          <div style="font-size:0.8rem; color:#6B7280;">
            Official SmatBot Billing Engine • Zoho Subscriptions Integration
          </div>
        </div>`;

if (js.includes(oldSubTitleBar)) {
  js = js.replace(oldSubTitleBar, newSubTitleBar);
  console.log('✓ Added top sub-navigation bar to renderZohoSubscriptionView');
}

// 6. In E-MAIL TO row, add Phone Number + Country Code (from Teammate notes 1: Phone Number + Country Code)
const oldEmailToRow = `            <!-- 2. E-MAIL TO Row (Screenshot 1) -->
            <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:center;">
              <label style="font-size:0.85rem; font-weight:600; color:#4B5563;">
                E-MAIL TO
              </label>
              <div style="display:flex; align-items:center; gap:1.25rem;">
                <button type="button" class="zoho-btn-new-contact" style="display:inline-flex; align-items:center; gap:5px; color:#2563EB; font-weight:600; font-size:0.84rem; background:none; border:none; cursor:pointer;">
                  <span style="font-size:1.1rem; line-height:1;">⊕</span> New Contact Person
                </button>
                <label style="display:inline-flex; align-items:center; gap:6px; font-size:0.85rem; color:#111827; cursor:pointer;">
                  <input type="checkbox" checked style="accent-color:#2563EB;" />
                  <span>\${escapeHtml(currClient.email)}</span>
                </label>
              </div>
            </div>`;

const newEmailToRow = `            <!-- 2. E-MAIL TO & Direct Phone Details (Screenshot 1 & Teammate Note 1) -->
            <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:center;">
              <label style="font-size:0.85rem; font-weight:600; color:#4B5563;">
                E-MAIL TO
              </label>
              <div style="display:flex; align-items:center; gap:1.75rem; flex-wrap:wrap;">
                <button type="button" class="zoho-btn-new-contact" style="display:inline-flex; align-items:center; gap:5px; color:#2563EB; font-weight:600; font-size:0.84rem; background:none; border:none; cursor:pointer;">
                  <span style="font-size:1.1rem; line-height:1;">⊕</span> New Contact Person
                </button>
                <label style="display:inline-flex; align-items:center; gap:6px; font-size:0.85rem; color:#111827; cursor:pointer;">
                  <input type="checkbox" checked style="accent-color:#2563EB;" />
                  <span>\${escapeHtml(currClient.email)}</span>
                </label>
                <div style="display:inline-flex; align-items:center; gap:6px; font-size:0.84rem; color:#4B5563; background:#F8FAFC; border:1px solid #E2E8F0; padding:2px 8px; border-radius:4px;">
                  <span style="font-weight:600; color:#1E293B;">Phone:</span>
                  <span>\${escapeHtml(currClient.phone_number || '+91-9705736759')}</span>
                  <span style="color:#64748B; font-size:0.75rem;">(Country Code: +91)</span>
                </div>
              </div>
            </div>`;

if (js.includes(oldEmailToRow)) {
  js = js.replace(oldEmailToRow, newEmailToRow);
  console.log('✓ Added Phone Number + Country Code from teammate note 1');
}

// 7. Update Discount mode dropdown options to match Teammate Note: Item Level Discount (sep), Transactional Level, No Discount
const oldDiscPref = `<option value="item-level" selected>Item-Level</option>
                  <option value="transaction-level">Transaction-Level</option>
                  <option value="no-discount">No Discounts</option>`;

const newDiscPref = `<option value="item-level" selected>(%) Item-Level Discount (sep)</option>
                  <option value="transaction-level">Transactional Level</option>
                  <option value="no-discount">No Discount</option>`;

if (js.includes(oldDiscPref)) {
  js = js.replace(oldDiscPref, newDiscPref);
  console.log('✓ Updated discount mode dropdown matching teammate note (Item Level Discount sep)');
}

fs.writeFileSync(jsPath, js, 'utf8');
console.log('🎉 Successfully applied Direct Zoho Subscriptions View!');
