const express = require('express');
const router = express.Router();
const { inMemoryClients } = require('../config/db');

// GET /api/clients - Multi-Filter Query Engine matching exact SmatBot dropdowns
router.get('/', (req, res) => {
  let clients = [...inMemoryClients];

  const {
    planType,
    accountType,
    billingCycle,
    customerTypes,
    planNames,
    supportPlan,
    lostClientStatus,
    salesPerson,
    supportPerson,
    currencyType,
    inrMin,
    inrMax,
    usdMin,
    usdMax,
    subscriptionStatus,
    search
  } = req.query;

  // Single selects
  if (planType && planType !== 'All') {
    clients = clients.filter(c => c.plan_type === planType);
  }
  if (accountType && accountType !== 'All') {
    clients = clients.filter(c => c.account_type === accountType);
  }
  if (billingCycle && billingCycle !== 'All') {
    clients = clients.filter(c => c.billing_cycle === billingCycle);
  }
  if (supportPlan && supportPlan !== 'All') {
    clients = clients.filter(c => c.support_plan === supportPlan);
  }
  if (lostClientStatus && lostClientStatus !== 'All') {
    clients = clients.filter(c => (c.lost_client_status || 'No') === lostClientStatus);
  }
  if (salesPerson && salesPerson !== 'All') {
    clients = clients.filter(c => c.sales_person === salesPerson);
  }
  if (supportPerson && supportPerson !== 'All') {
    clients = clients.filter(c => c.support_person === supportPerson);
  }
  if (currencyType && currencyType !== 'All') {
    clients = clients.filter(c => c.currency_type === currencyType);
  }
  if (subscriptionStatus && subscriptionStatus !== 'All') {
    clients = clients.filter(c => c.subscription_status.toLowerCase() === subscriptionStatus.toLowerCase());
  }

  // Multi-select Checkbox Filters
  if (customerTypes) {
    const cTypes = Array.isArray(customerTypes) ? customerTypes : customerTypes.split(',');
    clients = clients.filter(c => cTypes.includes(c.customer_type));
  }
  if (planNames) {
    const pNames = Array.isArray(planNames) ? planNames : planNames.split(',');
    clients = clients.filter(c => pNames.includes(c.plan_name));
  }

  // Currency ranges
  if (inrMin) clients = clients.filter(c => c.inr_amount >= parseFloat(inrMin));
  if (inrMax) clients = clients.filter(c => c.inr_amount <= parseFloat(inrMax));
  if (usdMin) clients = clients.filter(c => c.usd_amount >= parseFloat(usdMin));
  if (usdMax) clients = clients.filter(c => c.usd_amount <= parseFloat(usdMax));

  // Global search
  if (search && search.trim() !== '') {
    const q = search.trim().toLowerCase();
    clients = clients.filter(c => 
      c.email.toLowerCase().includes(q) ||
      (c.subscription_id && c.subscription_id.toLowerCase().includes(q)) ||
      (c.zoho_customer_id && c.zoho_customer_id.toLowerCase().includes(q)) ||
      c.name.toLowerCase().includes(q) ||
      c.phone_number.includes(q)
    );
  }

  res.json({
    success: true,
    totalCount: clients.length,
    clients
  });
});

// GET /api/clients/:id
router.get('/:id', (req, res) => {
  const client = inMemoryClients.find(c => c.id === parseInt(req.params.id, 10));
  if (!client) {
    return res.status(404).json({ success: false, message: 'Client not found' });
  }
  res.json({ success: true, client });
});

// POST /api/clients - Add New Client
router.post('/', (req, res) => {
  const {
    name,
    phone_number,
    alternate_phone,
    email,
    customer_type,
    account_type,
    plan_name,
    billing_cycle,
    sales_person,
    support_person,
    currency_type,
    inr_amount,
    usd_amount
  } = req.body;

  if (!name || !email || !phone_number) {
    return res.status(400).json({ success: false, message: 'Name, email and phone number are required' });
  }

  const newClient = {
    id: inMemoryClients.length + 1,
    client_uuid: 'cli_' + Date.now().toString(36),
    name,
    phone_number,
    alternate_phone: alternate_phone || '',
    email,
    customer_type: customer_type || 'Direct',
    account_type: account_type || 'Client Accounts',
    plan_name: plan_name || 'Pro NM (WA)',
    plan_type: 'Paid',
    support_plan: 'Basic support',
    billing_cycle: billing_cycle || 'Monthly',
    subscription_status: 'Active',
    lost_client_status: 'No',
    sales_person: sales_person || 'Rahul Sharma',
    support_person: support_person || 'Kiran Kumar',
    currency_type: currency_type || 'INR',
    inr_amount: parseFloat(inr_amount) || 11999.00,
    usd_amount: parseFloat(usd_amount) || 149.00,
    zoho_customer_id: 'ZC-' + Math.floor(100000 + Math.random() * 900000),
    subscription_id: 'SUB-SMT-' + Math.floor(1000 + Math.random() * 9000),
    conversations_used: 0,
    conversations_limit: 25000,
    ai_tokens_limit: 1000000,
    bots_count: 1
  };

  inMemoryClients.unshift(newClient);

  res.status(201).json({
    success: true,
    message: 'Client created successfully',
    client: newClient
  });
});

// PUT /api/clients/:id
router.put('/:id', (req, res) => {
  const idx = inMemoryClients.findIndex(c => c.id === parseInt(req.params.id, 10));
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Client not found' });
  }

  inMemoryClients[idx] = { ...inMemoryClients[idx], ...req.body };

  res.json({
    success: true,
    message: 'Client details updated successfully',
    client: inMemoryClients[idx]
  });
});

// POST /api/clients/:id/impersonate
router.post('/:id/impersonate', (req, res) => {
  const client = inMemoryClients.find(c => c.id === parseInt(req.params.id, 10));
  if (!client) {
    return res.status(404).json({ success: false, message: 'Client not found' });
  }

  const impersonationToken = 'smt_imp_' + Buffer.from(`${client.client_uuid}:${Date.now()}`).toString('base64');

  res.json({
    success: true,
    message: `Impersonation session established for ${client.name}`,
    impersonationToken,
    client
  });
});

// DELETE /api/clients/:id
router.delete('/:id', (req, res) => {
  const idx = inMemoryClients.findIndex(c => c.id === parseInt(req.params.id, 10));
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Client not found' });
  }
  const deleted = inMemoryClients.splice(idx, 1);
  res.json({ success: true, message: `Client ${deleted[0].name} removed` });
});

module.exports = router;
