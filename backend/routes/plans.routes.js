const express = require('express');
const router = express.Router();
const { inMemoryClients } = require('../config/db');

// GET /api/plans
router.get('/', (req, res) => {
  const plans = [
    { code: 'starter', name: 'Starter', priceINR: 3999, priceUSD: 49, conversations: 5000, bots: 3 },
    { code: 'pro', name: 'Professional', priceINR: 11999, priceUSD: 149, conversations: 25000, bots: 10 },
    { code: 'enterprise', name: 'Enterprise AI', priceINR: 39999, priceUSD: 499, conversations: 150000, bots: 50 },
    { code: 'custom', name: 'Custom White-Label', priceINR: 99999, priceUSD: 1200, conversations: 1000000, bots: 500 }
  ];
  res.json({ success: true, plans });
});

// POST /api/plans/activate - Activate/Upgrade plan for client
router.post('/activate', (req, res) => {
  const { clientId, planName, billingCycle, addOns } = req.body;
  const client = inMemoryClients.find(c => c.id === parseInt(clientId, 10));

  if (!client) {
    return res.status(404).json({ success: false, message: 'Client not found' });
  }

  client.plan_name = planName || 'Professional';
  client.billing_cycle = billingCycle || 'Monthly';
  client.subscription_status = 'Active';

  if (planName === 'Enterprise AI') {
    client.conversations_limit = 150000;
    client.inr_amount = billingCycle === 'Yearly' ? 479988.00 : 39999.00;
  } else if (planName === 'Professional') {
    client.conversations_limit = 25000;
    client.inr_amount = billingCycle === 'Yearly' ? 119990.00 : 11999.00;
  } else if (planName === 'Starter') {
    client.conversations_limit = 5000;
    client.inr_amount = billingCycle === 'Yearly' ? 39990.00 : 3999.00;
  }

  res.json({
    success: true,
    message: `Plan ${planName} (${billingCycle}) activated successfully for ${client.name}`,
    client
  });
});

module.exports = router;
