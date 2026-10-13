const express = require('express');
const router = express.Router();
const { inMemoryClients } = require('../config/db');

// Plan metadata & feature matrix definitions (Official New 4-Plan Structure)
const PLAN_DEFINITIONS = [
  {
    code: 'broadcast',
    name: 'Broadcast',
    tierRank: 1,
    priceMonthlyINR: 1499,
    priceYearlyINR: 14500,
    yearlySavingsINR: 3488,
    yearlySavingsPercent: 19,
    monthlyServiceChats: 1000,
    yearlyServiceChatsUpfront: 12000,
    monthlyBiChats: 1000,
    yearlyBiChatsUpfront: 12000,
    conversations: 1000,
    bots: 2,
    liveAgents: 0,
    botType: 'Broadcast only (no bot)',
    platforms: ['WhatsApp', 'Website'],
    features: ['WhatsApp Template / Broadcast Messages', 'Google Sheets Integration', 'Media Upload', 'Contacts Management', 'Analytics'],
    unsupportedFeatures: ['Two-Way Bot Conversation on WhatsApp', 'Custom Google Sheet', 'Custom Webhooks', 'Facebook Messenger', 'Live Agents Included', 'NLP AI Vector FAQs']
  },
  {
    code: 'standard',
    name: 'Standard',
    tierRank: 2,
    priceMonthlyINR: 3500,
    priceYearlyINR: 35000,
    yearlySavingsINR: 7000,
    yearlySavingsPercent: 17,
    monthlyServiceChats: 30000,
    yearlyServiceChatsUpfront: 360000,
    monthlyBiChats: 2000,
    yearlyBiChatsUpfront: 24000,
    conversations: 30000,
    bots: 5,
    liveAgents: 0,
    botType: 'Flow / menu-driven',
    platforms: ['WhatsApp', 'Website', 'Instagram Messenger', 'Landing Page Chatbot'],
    features: ['Flow/Menu-Driven Chatbot', 'Two-Way Bot Conversation on WhatsApp', 'Unlimited Website & Instagram Messages', 'Google Sheets & Custom Sheet', 'Dynamic & Canned Responses', 'Two-Factor Authentication (2FA)'],
    unsupportedFeatures: ['Facebook Messenger', 'Applications (In-app)', 'Live Agents Included', 'AI Embeddings', 'Hot Lead Notifications']
  },
  {
    code: 'pro',
    name: 'Pro',
    tierRank: 3,
    isPopular: true,
    priceMonthlyINR: 6500,
    priceYearlyINR: 72000,
    yearlySavingsINR: 6000,
    yearlySavingsPercent: 8,
    monthlyServiceChats: 100000,
    yearlyServiceChatsUpfront: 1200000,
    monthlyBiChats: 5000,
    yearlyBiChatsUpfront: 60000,
    conversations: 100000,
    bots: 10,
    liveAgents: 3,
    botType: 'Flow-based (full feature set)',
    platforms: ['WhatsApp', 'Website', 'Facebook Messenger', 'Instagram Messenger', 'Applications', 'Landing Page Chatbot'],
    features: ['Flow-Based Bot (Full Feature Set)', '6 Multi-Channel Platforms', '3 Live Agent Seats Included', 'Template Button Click & Text Replies Included', 'WhatsApp Cart & Catalog Included', 'CRM Integration Included', 'Voice Enabled (Speech to Text)', 'Hot Lead & Email Notifications'],
    unsupportedFeatures: ['AI Integration (Available as Add-on)']
  },
  {
    code: 'ai',
    name: 'AI',
    tierRank: 4,
    priceMonthlyINR: 8999,
    priceYearlyINR: 96000,
    yearlySavingsINR: 11988,
    yearlySavingsPercent: 11,
    monthlyServiceChats: 500000,
    yearlyServiceChatsUpfront: 6000000,
    monthlyBiChats: 10000,
    yearlyBiChatsUpfront: 120000,
    conversations: 500000,
    bots: 10,
    liveAgents: 3,
    botType: 'Flow-based + AI integration',
    platforms: ['WhatsApp', 'Website', 'Facebook Messenger', 'Instagram Messenger', 'Applications', 'Landing Page Chatbot', 'AI Integration'],
    features: ['Everything in Pro + Native AI Integration', '500,000 Monthly Service Messages (6M Upfront on Yearly)', '10,000 Monthly BI Messages (120K Upfront on Yearly)', '3 Live Agents Included', 'Full Omnichannel NLP Suite'],
    unsupportedFeatures: []
  }
];

// Official Add-ons Catalog (19 Add-ons with Upfront Yearly Quota Allocation)
const ADDON_DEFINITIONS = [
  { id: 'template_replies', name: 'Template Text Replies + Button Clicks', unit: 'flat rate', priceMonthlyINR: 1000, priceYearlyINR: 9600, applicablePlans: ['Broadcast', 'Standard'], isQuota: false },
  { id: 'crm', name: 'CRM Integration', unit: 'flat rate', priceMonthlyINR: 1000, priceYearlyINR: 9600, applicablePlans: ['Broadcast', 'Standard'], isQuota: false },
  { id: 'wa_catalog', name: 'WhatsApp Cart & Catalog', unit: 'flat rate', priceMonthlyINR: 1000, priceYearlyINR: 9600, applicablePlans: ['Broadcast', 'Standard'], isQuota: false },
  { id: 'live_agent', name: 'Live Agent', unit: 'per agent', priceMonthlyINR: 1000, priceYearlyINR: 9600, applicablePlans: ['All'], isQuota: false },
  { id: 'dialogflow', name: 'AI Agent (Dialogflow)', unit: 'flat rate', priceMonthlyINR: 1000, priceYearlyINR: 9600, applicablePlans: ['Broadcast', 'Standard'], isQuota: false },
  { id: 'multilingual', name: 'Multi-Lingual / Extra Language', unit: 'per language', priceMonthlyINR: 1000, priceYearlyINR: 9600, applicablePlans: ['All'], isQuota: false },
  { id: 'ai_integration', name: 'AI Integration', unit: 'flat rate', priceMonthlyINR: 2000, priceYearlyINR: 24000, applicablePlans: ['Broadcast', 'Standard', 'Pro'], isQuota: false },
  { id: 'email_otp', name: 'Email OTP Validation', unit: '1,000 / mo or 12,000 / yr upfront', priceMonthlyINR: 500, priceYearlyINR: 6000, monthlyQuota: 1000, yearlyQuotaUpfront: 12000, applicablePlans: ['Standard', 'Pro', 'AI'], isQuota: true },
  { id: 'extra_chatbots', name: 'Extra Chatbots', unit: 'per 5 chatbots', priceMonthlyINR: 1000, priceYearlyINR: 9600, applicablePlans: ['All'], isQuota: false },
  { id: 'wa_bi_messages', name: 'WhatsApp BI Messages', unit: '1,000 / mo or 12,000 / yr upfront', priceMonthlyINR: 200, priceYearlyINR: 2400, monthlyQuota: 1000, yearlyQuotaUpfront: 12000, applicablePlans: ['All'], isQuota: true },
  { id: 'ui_website_chats', name: 'UI / Website Chats', unit: '1,000 / mo or 12,000 / yr upfront', priceMonthlyINR: 600, priceYearlyINR: 7200, monthlyQuota: 1000, yearlyQuotaUpfront: 12000, applicablePlans: ['All'], isQuota: true },
  { id: 'sms_otp', name: 'SMS OTPs', unit: '1,000 / mo or 12,000 / yr upfront', priceMonthlyINR: 500, priceYearlyINR: 6000, monthlyQuota: 1000, yearlyQuotaUpfront: 12000, applicablePlans: ['All'], isQuota: true },
  { id: 'wa_otp', name: 'WhatsApp OTPs', unit: '1,000 / mo or 12,000 / yr upfront', priceMonthlyINR: 500, priceYearlyINR: 6000, monthlyQuota: 1000, yearlyQuotaUpfront: 12000, applicablePlans: ['All'], isQuota: true },
  { id: 'sms_notifications', name: 'SMS Notifications', unit: '1,000 / mo or 12,000 / yr upfront', priceMonthlyINR: 500, priceYearlyINR: 6000, monthlyQuota: 1000, yearlyQuotaUpfront: 12000, applicablePlans: ['All'], isQuota: true },
  { id: 'wa_notifications', name: 'WhatsApp Notifications', unit: '1,000 / mo or 12,000 / yr upfront', priceMonthlyINR: 500, priceYearlyINR: 6000, monthlyQuota: 1000, yearlyQuotaUpfront: 12000, applicablePlans: ['All'], isQuota: true },
  { id: 'tts', name: 'Text to Speech', unit: 'flat rate', priceMonthlyINR: 800, priceYearlyINR: 7200, applicablePlans: ['All'], isQuota: false },
  { id: 'remove_branding', name: 'Remove Branding', unit: 'flat rate', priceMonthlyINR: 1900, priceYearlyINR: 20280, applicablePlans: ['All'], isQuota: false },
  { id: 'basic_support', name: 'Basic Support', unit: 'flat rate', priceMonthlyINR: 6999, priceYearlyINR: 71988, applicablePlans: ['All'], isQuota: false },
  { id: 'premium_support', name: 'Premium Support', unit: 'flat rate', priceMonthlyINR: 14999, priceYearlyINR: 143988, applicablePlans: ['All'], isQuota: false }
];

// Helper: Find Plan by Name or Code
function findPlan(nameOrCode) {
  if (!nameOrCode) return PLAN_DEFINITIONS[1];
  const query = nameOrCode.toLowerCase();
  return PLAN_DEFINITIONS.find(p =>
    p.code.toLowerCase() === query ||
    p.name.toLowerCase().includes(query) ||
    query.includes(p.code.toLowerCase())
  ) || PLAN_DEFINITIONS[1];
}

// GET /api/plans - Plan catalog & Add-ons catalog
router.get('/', (req, res) => {
  res.json({
    success: true,
    plans: PLAN_DEFINITIONS,
    addons: ADDON_DEFINITIONS
  });
});

// POST /api/plans/calculate-impact - Point 8: Admin Panel Downgrade Impact Assessment
router.post('/calculate-impact', (req, res) => {
  const { clientId, targetPlanName } = req.body;
  const client = inMemoryClients.find(c => c.id === parseInt(clientId, 10));

  if (!client) {
    return res.status(404).json({ success: false, message: 'Client not found' });
  }

  const currentPlan = findPlan(client.plan_name);
  const targetPlan = findPlan(targetPlanName);
  const isDowngrade = targetPlan.tierRank < currentPlan.tierRank;

  // Real client usage metrics
  const botsUsed = client.bots_used || 0;
  const chatsUsed = client.chats_used || 0;
  const hasWhatsApp = client.plan_name?.toLowerCase().includes('wa') || client.plan_name?.toLowerCase().includes('pro') || targetPlan.platforms.includes('WhatsApp');
  const isWhiteLabel = client.deployment_type === 'White-Label';

  // Impact analysis based on ACTUAL configuration
  const limitViolations = [];
  if (botsUsed > targetPlan.bots) {
    limitViolations.push({
      metric: 'Active Chatbots',
      used: botsUsed,
      newLimit: targetPlan.bots,
      excess: botsUsed - targetPlan.bots,
      warning: `Client currently has ${botsUsed} active bots, but ${targetPlan.name} allows only ${targetPlan.bots}. ${botsUsed - targetPlan.bots} bot(s) will be automatically deactivated.`
    });
  }

  const newServiceChatsLimit = targetPlan.monthlyServiceChats;
  if (chatsUsed > newServiceChatsLimit) {
    limitViolations.push({
      metric: 'Monthly Service Chats Quota',
      used: chatsUsed,
      newLimit: newServiceChatsLimit,
      excess: chatsUsed - newServiceChatsLimit,
      warning: `Current month usage (${chatsUsed.toLocaleString()} chats) exceeds new plan limit (${newServiceChatsLimit.toLocaleString()} chats). Message processing will pause until next cycle or add-on purchase.`
    });
  }

  // Features becoming unavailable
  const blockedFeatures = [];
  if (currentPlan.code !== 'broadcast' && targetPlan.code === 'broadcast') {
    blockedFeatures.push({
      feature: 'Two-Way Bot Conversation & Automated Flows',
      impact: 'Bot automation will stop. Only WhatsApp Broadcast/Template messages and manual agent dashboard replies will remain active.',
      criticality: 'High'
    });
  }
  if (!targetPlan.platforms.includes('Facebook Messenger') && currentPlan.platforms?.includes('Facebook Messenger')) {
    blockedFeatures.push({
      feature: 'Facebook Messenger Integration',
      impact: 'Messenger webhooks and automated responses will be suspended.',
      criticality: 'Medium'
    });
  }
  if (!targetPlan.platforms.includes('Applications') && currentPlan.platforms?.includes('Applications')) {
    blockedFeatures.push({
      feature: 'In-App Mobile SDK Chatbot',
      impact: 'Mobile in-app chat integration will be deactivated.',
      criticality: 'Medium'
    });
  }
  if (currentPlan.code === 'ai' && targetPlan.code !== 'ai') {
    blockedFeatures.push({
      feature: 'Native AI Integration Suite',
      impact: 'Native AI vector embeddings & LLM fallback will be disabled unless purchased as an add-on (₹2,000/mo).',
      criticality: 'High'
    });
  }

  // Features that will continue working safely
  const safeFeatures = targetPlan.features;

  // Required Admin / Client actions before applying downgrade
  const requiredActions = [];
  if (botsUsed > targetPlan.bots) {
    requiredActions.push(`Select ${botsUsed - targetPlan.bots} bot(s) to archive or pause.`);
  }
  if (currentPlan.code !== 'broadcast' && targetPlan.code === 'broadcast') {
    requiredActions.push('Inform client that conversational chatbot flows will be paused in favor of Broadcast-only mode.');
  }
  requiredActions.push('Confirm with client whether active add-ons should be retained or synchronized.');

  res.json({
    success: true,
    isDowngrade,
    currentPlan: currentPlan.name,
    targetPlan: targetPlan.name,
    client: {
      id: client.id,
      name: client.name,
      email: client.email,
      botsUsed,
      chatsUsed
    },
    limitViolations,
    blockedFeatures,
    safeFeatures,
    requiredActions
  });
});

// POST /api/plans/calculate-price - Points 2 & 3: Flexible Durations & Add-on Expiry Calculation
router.post('/calculate-price', (req, res) => {
  const { planName, durationMonths = 1, currency = 'INR', addOns = [], clientEndDate } = req.body;
  const plan = findPlan(planName);
  const months = parseInt(durationMonths, 10) || 1;
  const isYearly = months >= 12;

  const baseMonthly = currency === 'USD' ? Math.round(plan.priceMonthlyINR / 83) : plan.priceMonthlyINR;

  // Point 2: Flexible Duration Multiplier (monthly price * number of months)
  // For standard yearly (12 months), use official yearly discounted price (e.g. Broadcast ₹14,500, Standard ₹35,000, Pro ₹72,000, AI ₹96,000)
  // For custom months (2, 4, 6, 9), monthly * months exactly as specified in PRD
  let basePlanTotal = 0;
  if (isYearly) {
    basePlanTotal = currency === 'USD' ? Math.round(plan.priceYearlyINR / 83) : plan.priceYearlyINR;
  } else {
    basePlanTotal = baseMonthly * months;
  }

  // Calculate Add-ons with Point 3 Expiry Priority rule & Upfront Quota Rule (Deepak's Mandate)
  const now = new Date();
  const subExpiryDate = clientEndDate ? new Date(clientEndDate) : new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000);

  let addOnsTotal = 0;
  const processedAddons = (addOns || []).map(addon => {
    const addonDef = ADDON_DEFINITIONS.find(a => a.id === addon.id || a.name.toLowerCase() === (addon.name || '').toLowerCase());
    const addonIsYearly = addon.billingCycle === 'Yearly' || isYearly;

    let cost = 0;
    if (addonDef) {
      if (addonIsYearly) {
        cost = currency === 'USD' ? Math.round(addonDef.priceYearlyINR / 83) : addonDef.priceYearlyINR;
      } else {
        cost = currency === 'USD' ? Math.round(addonDef.priceMonthlyINR / 83) : addonDef.priceMonthlyINR;
      }
    } else {
      cost = currency === 'USD' ? (addon.priceUSD || 20) : (addon.priceINR || 1000);
    }
    addOnsTotal += cost;

    // Upfront quota crediting for yearly add-on purchases
    let allocatedQuota = null;
    if (addonDef && addonDef.isQuota) {
      allocatedQuota = addonIsYearly ? addonDef.yearlyQuotaUpfront : addonDef.monthlyQuota;
    }

    const standardDurationDays = addonIsYearly ? 365 : 30;
    const standardExpiry = new Date(now.getTime() + standardDurationDays * 24 * 60 * 60 * 1000);
    const effectiveExpiry = subExpiryDate < standardExpiry ? subExpiryDate : standardExpiry;

    return {
      name: addonDef ? addonDef.name : (addon.name || 'Add-on Booster'),
      type: addon.type || 'recurring',
      billingCycle: addonIsYearly ? 'Yearly' : 'Monthly',
      cost,
      allocatedQuota,
      quotaCreditRule: addonIsYearly ? 'Yearly Upfront Quota Allocation' : 'Monthly Reset Basis',
      standardExpiry: standardExpiry.toISOString().split('T')[0],
      effectiveExpiry: effectiveExpiry.toISOString().split('T')[0],
      cappedBySubscription: subExpiryDate < standardExpiry
    };
  });

  res.json({
    success: true,
    planName: plan.name,
    durationMonths: months,
    currency,
    baseMonthlyRate: baseMonthly,
    basePlanTotal,
    addOnsTotal,
    grandTotal: basePlanTotal + addOnsTotal,
    processedAddons,
    subscriptionExpiryDate: subExpiryDate.toISOString().split('T')[0],
    upfrontServiceChats: isYearly ? plan.yearlyServiceChatsUpfront : plan.monthlyServiceChats,
    upfrontBiChats: isYearly ? plan.yearlyBiChatsUpfront : plan.monthlyBiChats
  });
});

// POST /api/plans/activate - Activate / Upgrade / Downgrade Plan (Honoring Deepak's Upfront Allocation Mandate)
router.post('/activate', (req, res) => {
  const { clientId, planName, durationMonths = 1, billingCycle, addOns = [], voucherCode } = req.body;
  const client = inMemoryClients.find(c => c.id === parseInt(clientId, 10));

  if (!client) {
    return res.status(404).json({ success: false, message: 'Client not found' });
  }

  const plan = findPlan(planName);
  const months = parseInt(durationMonths, 10) || (billingCycle === 'Yearly' ? 12 : 1);
  const isYearly = months >= 12;

  // Pricing: Yearly official flat discounted rate OR Monthly * N months flexible duration
  let planTotal;
  if (isYearly) {
    planTotal = client.currency_type === 'USD' ? Math.round(plan.priceYearlyINR / 83) : plan.priceYearlyINR;
  } else {
    const baseMonthly = client.currency_type === 'USD' ? Math.round(plan.priceMonthlyINR / 83) : plan.priceMonthlyINR;
    planTotal = baseMonthly * months;
  }

  // Calculate new end date
  const now = new Date();
  const endDate = new Date(now.getTime() + months * 30 * 24 * 60 * 60 * 1000);
  const formattedEndDate = `${String(endDate.getDate()).padStart(2, '0')}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${endDate.getFullYear()}`;

  // Process Add-ons with Point 3 Expiry Priority & Deepak's Upfront Yearly Quota Allocation
  const activeAddons = (addOns || []).map((addon, index) => {
    const addonDef = ADDON_DEFINITIONS.find(a => a.id === addon.id || a.name.toLowerCase() === (addon.name || '').toLowerCase());
    const addonIsYearly = addon.billingCycle === 'Yearly' || isYearly;

    // Upfront quota allocation for yearly add-on purchases
    let allocatedQuota = null;
    if (addonDef && addonDef.isQuota) {
      allocatedQuota = addonIsYearly ? addonDef.yearlyQuotaUpfront : addonDef.monthlyQuota;
    }

    const standardDurationDays = addonIsYearly ? 365 : 30;
    const standardExpiry = new Date(now.getTime() + standardDurationDays * 24 * 60 * 60 * 1000);
    const effectiveExpiry = endDate < standardExpiry ? endDate : standardExpiry;

    return {
      id: `add_${client.id}_${Date.now()}_${index}`,
      name: addonDef ? addonDef.name : (addon.name || 'Add-on Booster'),
      type: addon.type || 'recurring',
      billingCycle: addonIsYearly ? 'Yearly' : 'Monthly',
      allocatedQuota,
      quotaCreditRule: addonIsYearly ? 'Full Yearly Quota Allocated Upfront' : 'Monthly Reset Basis',
      purchaseDate: now.toISOString().split('T')[0],
      expiryDate: `${String(effectiveExpiry.getDate()).padStart(2, '0')}-${String(effectiveExpiry.getMonth() + 1).padStart(2, '0')}-${effectiveExpiry.getFullYear()}`,
      cappedBySubscription: endDate < standardExpiry
    };
  });

  // Update client record with Deepak's Mandate:
  // "Earlier, we used to allocate chats to yearly plan users on a monthly reset basis. Now, we have changed this approach to allocate the entire yearly chat quota upfront at the beginning of the subscription year."
  client.plan_name = plan.name;
  client.plan_type = plan.priceMonthlyINR > 0 ? 'Paid_plan' : 'Trial_plan';
  client.billing_cycle = isYearly ? 'Yearly' : (months > 1 ? `Custom (${months} Mos)` : 'Monthly');
  client.subscription_status = 'Active';
  client.days_left = months * 30;
  client.end_date = formattedEndDate;
  client.bots_limit = plan.bots;
  client.live_agents_limit = plan.liveAgents || 0;

  // Upfront chat quota allocation
  if (isYearly) {
    client.chats_limit = plan.yearlyServiceChatsUpfront;
    client.service_chats_limit = plan.yearlyServiceChatsUpfront;
    client.bi_chats_limit = plan.yearlyBiChatsUpfront;
    client.chat_allocation_mode = 'Yearly Upfront';
  } else {
    client.chats_limit = plan.monthlyServiceChats;
    client.service_chats_limit = plan.monthlyServiceChats;
    client.bi_chats_limit = plan.monthlyBiChats;
    client.chat_allocation_mode = 'Monthly Reset';
  }

  client.inr_amount = client.currency_type === 'USD' ? planTotal * 83 : planTotal;
  client.usd_amount = client.currency_type === 'USD' ? planTotal : Math.round(planTotal / 83);
  client.subscription_amount_display = client.currency_type === 'USD' ? `$ ${planTotal.toFixed(2)}` : `₹ ${planTotal.toLocaleString('en-IN')}.00`;
  client.active_addons = activeAddons;
  client.cancellation_status = null;
  client.cancellation_effective_date = null;

  res.json({
    success: true,
    message: `Plan ${plan.name} (${months} Months) activated successfully for ${client.name}. ${isYearly ? `Allocated ${plan.yearlyServiceChatsUpfront.toLocaleString()} service chats and ${plan.yearlyBiChatsUpfront.toLocaleString()} BI chats UPFRONT.` : ''}`,
    client
  });
});

// POST /api/plans/autopay-toggle - Point 5: Auto-Pay Toggle Management
router.post('/autopay-toggle', (req, res) => {
  const { clientId, enabled } = req.body;
  const client = inMemoryClients.find(c => c.id === parseInt(clientId, 10));

  if (!client) {
    return res.status(404).json({ success: false, message: 'Client not found' });
  }

  client.autopay_enabled = Boolean(enabled);

  res.json({
    success: true,
    message: client.autopay_enabled
      ? 'Auto-Pay enabled. Future renewals will be charged automatically.'
      : 'Auto-Pay disabled. Current subscription remains active until expiry date without loss of features.',
    autopay_enabled: client.autopay_enabled,
    client: {
      id: client.id,
      name: client.name,
      subscription_status: client.subscription_status,
      end_date: client.end_date,
      days_left: client.days_left
    }
  });
});

// POST /api/plans/cancel - Point 6: Subscription Cancellation (Immediate vs End of Billing Period)
router.post('/cancel', (req, res) => {
  const { clientId, cancellationType = 'end_of_period', reason = 'User requested cancellation' } = req.body;
  const client = inMemoryClients.find(c => c.id === parseInt(clientId, 10));

  if (!client) {
    return res.status(404).json({ success: false, message: 'Client not found' });
  }

  if (cancellationType === 'immediate') {
    // Terminate immediately
    client.subscription_status = 'Cancelled';
    client.cancellation_status = 'cancelled_immediately';
    client.cancellation_effective_date = new Date().toISOString().split('T')[0];
    client.days_left = 0;
    client.active_addons = []; // Revoke add-ons
    return res.json({
      success: true,
      cancellationType: 'immediate',
      message: `Subscription for ${client.name} has been cancelled immediately. Access to paid features has been revoked.`,
      client
    });
  } else {
    // End of billing period: keep active until end_date
    client.cancellation_status = 'pending_end_of_period';
    client.cancellation_effective_date = client.end_date;
    client.autopay_enabled = false;
    return res.json({
      success: true,
      cancellationType: 'end_of_period',
      message: `Subscription scheduled for cancellation on ${client.end_date}. Access and active add-ons will remain fully active until that date.`,
      effectiveDate: client.end_date,
      client
    });
  }
});

// POST /api/plans/update-payment-method - Point 4: Payment Method Update
router.post('/update-payment-method', (req, res) => {
  const { clientId, cardBrand = 'Visa', last4 = '4242', expMonth = '12', expYear = '2028', holderName } = req.body;
  const client = inMemoryClients.find(c => c.id === parseInt(clientId, 10));

  if (!client) {
    return res.status(404).json({ success: false, message: 'Client not found' });
  }

  client.payment_method = {
    brand: cardBrand,
    last4,
    expiry: `${expMonth}/${expYear}`,
    holderName: holderName || client.name,
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    message: `Payment method updated to ${cardBrand} ending in •••• ${last4}. Applied to future renewals and recurring add-ons.`,
    payment_method: client.payment_method
  });
});

module.exports = router;
