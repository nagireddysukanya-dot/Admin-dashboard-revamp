const fs = require('fs');
let content = fs.readFileSync('frontend/js/app.js', 'utf8');
const oldSnippet = `    } else if (route === 'change-subscription' || route === 'new-subscription') {
      renderZohoSubscriptionView(viewport);
    } else if (route === 'subscription' || route === 'edit-customer') {
      renderZohoEditCustomerView(viewport);
    } else if (route === 'subscriptions') {
      renderClientSubscriptionsView(viewport);`;
const newSnippet = `    } else if (route === 'change-subscription' || route === 'new-subscription' || route === 'subscriptions') {
      renderZohoSubscriptionView(viewport);
    } else if (route === 'subscription' || route === 'edit-customer') {
      renderZohoEditCustomerView(viewport);
    } else if (route === 'subscriptions-directory') {
      renderClientSubscriptionsView(viewport);`;

const normalizedOld = oldSnippet.replace(/\r\n/g, '\n');
const normalizedContent = content.replace(/\r\n/g, '\n');
if (normalizedContent.includes(normalizedOld)) {
  const updated = normalizedContent.replace(normalizedOld, newSnippet.replace(/\r\n/g, '\n'));
  fs.writeFileSync('frontend/js/app.js', updated.replace(/\n/g, '\r\n'), 'utf8');
  console.log('Successfully updated subscriptions routing to renderZohoSubscriptionView!');
} else {
  console.log('Old snippet not found!');
}
