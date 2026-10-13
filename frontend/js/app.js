// SmatBot Official Admin Portal - Unified Modern Control Center
// Complete Implementation of 5 Core Modules:
// 1. Clients (15 Filters, Directory, Deep-Dive Profile 👁)
// 2. Migrate Bot (4-Step Wizard, Pre-Flight Check, Live Terminal, Rollback)
// 3. Add Users (Team Management, Role-Based Access, Granular Permissions Matrix)
// 4. Plan Activation (Tier Cards, Add-ons, Voucher Discounts, Instant Activation)
// 5. Login to Dashboard (Client Portal Impersonation Simulator & Interactive Bot Console)

(function () {
  'use strict';

  // State
  let currentRoute = 'client-details';
  let currentUser = { 
    name: 'Sukanya Nagireddy', 
    email: 'sukanya@smatbot.com', 
    role: 'Super Admin',
    avatar: 'SN',
    department: 'Executive Operations'
  };
  let clientsData = [];
  let usersData = [];
  let migrationsData = [];
  let selectedClientId = 1;
  let isAuthenticated = false;
  let impersonatingClient = null;
  let billingToggleYearly = false;
  let clientPageSize = 10;
  let clientCurrentPage = 1;
  let partnersTab = 'All';

  // 15 Filter Dropdown State
  let filterState = {
    planType: 'All',
    accountType: 'All',
    billingCycle: 'All',
    customerTypes: ['Direct', 'Reseller', 'White-Label', 'On-Premise', 'Reseller Client', 'Channel Partners', 'Referral'],
    planNames: [
      'Pro NY', 'Starter NY (WA)', 'Starter NY', 'Pro NM (WA)', 'Pro NM', 
      'Starter NM (WA)', 'Starter NM', 'test plan', 'TESTAPICHANGE', 'Pro Trail WhatsApp', 'Pro Trial', 'Pro Trail WhatsApp Trial'
    ],
    supportPlan: 'All',
    lostClientStatus: 'All',
    salesPerson: 'All',
    supportPerson: 'All',
    currencyType: 'All',
    inrMin: '',
    inrMax: '',
    usdMin: '',
    usdMax: '',
    subscriptionStatus: 'All',
    duration: 'All Time',
    search: '',
    newThisMonthOnly: false,
    activeSegmentTab: 'all'
  };

  const ALL_CUSTOMER_TYPES = ['Direct', 'Reseller', 'White-Label', 'On-Premise', 'Reseller Client', 'Channel Partners', 'Referral'];
  const ALL_PLAN_NAMES = [
    'Broadcast', 'Standard', 'Pro', 'AI', 'Pro Trial', 'Pro NY', 'Starter NY', 'test plan'
  ];

  // 218 Initial Seed Clients Data (Matching User Screenshots & Production Specs)
  function generateInitialSeedClients() {
    const baseClients = [
      {
        id: 1, s_no: 1, name: 'Arpit Padhy', phone_number: '+91-8591876630', alternate_phone: '',
        email: 'arpitpadhy19@gmail.com', customer_type: 'Direct', account_type: 'Client Accounts',
        plan_name: 'Pro Trial', plan_type: 'Trial_plan', billing_cycle: 'Monthly',
        subscription_amount_display: '₹ 0.00', inr_amount: 0, usd_amount: 0, end_date: '08-10-2026',
        days_left: 9, bots_limit: 10, bots_used: 1, chats_limit: 500, chats_used: 12,
        service_chats_limit: 500, service_chats_used: 0, bi_chats_limit: 0, bi_chats_used: 0,
        gst_number: '-', url: 'arpitpadhy.in',
        test_account: 'No', subscription_status: 'Trial', sales_person: 'Rahul Sharma',
        support_person: 'Kiran Kumar', currency_type: 'INR', zoho_customer_id: 'ZC-901820', subscription_id: 'SUB-ARPIT-2026',
        deployment_type: 'White-Label', custom_domain: 'bot.arpitpadhy.in', sub_clients_count: 14, white_label_brand: 'Arpit AI Portal', ssl_status: 'Active (SSL 🔒)'
      },
      {
        id: 2, s_no: 2, name: 'Amitesh', phone_number: '+91-8989909098', alternate_phone: '',
        email: 'openskill.co@gmail.com', customer_type: 'Direct', account_type: 'Client Accounts',
        plan_name: 'Pro Trial', plan_type: 'Trial_plan', billing_cycle: 'Monthly',
        subscription_amount_display: '₹ 0.00', inr_amount: 0, usd_amount: 0, end_date: '07-10-2026',
        days_left: 8, bots_limit: 10, bots_used: 0, chats_limit: 500, chats_used: 0,
        service_chats_limit: 500, service_chats_used: 0, bi_chats_limit: 0, bi_chats_used: 0,
        gst_number: '-', url: 'openskill.co',
        test_account: 'No', subscription_status: 'Trial', sales_person: 'Rahul Sharma',
        support_person: 'Kiran Kumar', currency_type: 'INR', zoho_customer_id: 'ZC-901821', subscription_id: 'SUB-AMIT-2026',
        deployment_type: 'On-Premise', server_host: 'AWS Private VPC (Mumbai DC) - Node 02', cluster_health: '🟢 100% Operational', engine_version: 'v4.2.0 Enterprise Node', license_key: 'LIC-ONPREM-2026-X002'
      },
      {
        id: 3, s_no: 3, name: 'Loki Kudsj', phone_number: '+91-9857564502', alternate_phone: '',
        email: 'plummaddi@uberip.com', customer_type: 'Direct', account_type: 'Client Accounts',
        plan_name: 'Pro Trial', plan_type: 'Trial_plan', billing_cycle: 'Monthly',
        subscription_amount_display: '₹ 0.00', inr_amount: 0, usd_amount: 0, end_date: '07-10-2026',
        days_left: 8, bots_limit: 10, bots_used: 0, chats_limit: 500, chats_used: 0,
        service_chats_limit: 500, service_chats_used: 0, bi_chats_limit: 0, bi_chats_used: 0,
        gst_number: '29AABCS1429B1Z8', url: 'uberip.com',
        test_account: 'No', subscription_status: 'Trial', sales_person: 'Pooja Reddy',
        support_person: 'Vikas Rao', currency_type: 'INR', zoho_customer_id: 'ZC-901822', subscription_id: 'SUB-LOKI-2026',
        deployment_type: 'White-Label', custom_domain: 'chat.uberip.com', sub_clients_count: 8, white_label_brand: 'UberIP Bot Engine', ssl_status: 'Active (SSL 🔒)'
      },
      {
        id: 4, s_no: 4, name: 'SANKU MUKHERJEE', phone_number: '+91-9007266633', alternate_phone: '',
        email: 'parichaytour@gmail.com', customer_type: 'Direct', account_type: 'Client Accounts',
        plan_name: 'Pro Trail WhatsApp Trial', plan_type: 'Trial_plan', billing_cycle: 'Monthly',
        subscription_amount_display: '₹ 0.00', inr_amount: 0, usd_amount: 0, end_date: '30-09-2026',
        days_left: 1, bots_limit: 10, bots_used: 1, chats_limit: 500, chats_used: 14,
        service_chats_limit: 500, service_chats_used: 0, bi_chats_limit: 0, bi_chats_used: 0,
        gst_number: '-', url: 'parichaytour.com',
        test_account: 'No', subscription_status: 'Trial', sales_person: 'Rahul Sharma',
        support_person: 'Kiran Kumar', currency_type: 'INR', zoho_customer_id: 'ZC-901823', subscription_id: 'SUB-SANKU-2026',
        deployment_type: 'On-Premise', server_host: 'Azure Private Enterprise Stack - Delhi DC', cluster_health: '🟢 100% Operational', engine_version: 'v4.2.0 Enterprise Node', license_key: 'LIC-ONPREM-2026-X004'
      },
      {
        id: 5, s_no: 5, name: 'cacat75624@findize.com', phone_number: '+91-9848051648', alternate_phone: '',
        email: 'cacat75624@findize.com', customer_type: 'Direct', account_type: 'Client Accounts',
        plan_name: 'Pro Trial', plan_type: 'Trial_plan', billing_cycle: 'Monthly',
        subscription_amount_display: '₹ 0.00', inr_amount: 0, usd_amount: 0, end_date: '29-09-2026',
        days_left: '-', bots_limit: 10, bots_used: 0, chats_limit: 500, chats_used: 0,
        service_chats_limit: 500, service_chats_used: 0, bi_chats_limit: 0, bi_chats_used: 0,
        gst_number: '-', url: 'findize.com',
        test_account: 'No', subscription_status: 'Trial', sales_person: 'Sameer Khan',
        support_person: 'Vikas Rao', currency_type: 'INR', zoho_customer_id: 'ZC-901824', subscription_id: 'SUB-CACAT-2026',
        deployment_type: 'White-Label', custom_domain: 'bot.findize.com', sub_clients_count: 19, white_label_brand: 'Findize Conversational Hub', ssl_status: 'Active (SSL 🔒)'
      },
      {
        id: 6, s_no: 6, name: 'Dr Rajesh Reddy', phone_number: '+91-9988711695', alternate_phone: '',
        email: 'drrajeshreddy1@gmail.com', customer_type: 'Direct', account_type: 'Client Accounts',
        plan_name: 'Free', plan_type: 'Trial_plan', billing_cycle: 'Monthly',
        subscription_amount_display: '₹ 0.00', inr_amount: 0, usd_amount: 0, end_date: '19-10-2026',
        days_left: 20, bots_limit: 10, bots_used: 2, chats_limit: 500, chats_used: 48,
        service_chats_limit: 500, service_chats_used: 0, bi_chats_limit: 0, bi_chats_used: 0,
        gst_number: '-', url: 'drrajeshreddy.com',
        test_account: 'No', subscription_status: 'Trial', sales_person: 'Rahul Sharma',
        support_person: 'Kiran Kumar', currency_type: 'INR', zoho_customer_id: 'ZC-901825', subscription_id: 'SUB-RAJESH-2026',
        deployment_type: 'On-Premise', server_host: 'Private Hospital Server (Apollo DC) - Node 01', cluster_health: '🟢 100% Operational', engine_version: 'v4.2.0 Enterprise Node', license_key: 'LIC-ONPREM-2026-X006'
      },
      {
        id: 7, s_no: 7, name: 'Wisera Info', phone_number: '+91-9876598897', alternate_phone: '',
        email: 'info@wisera.in', customer_type: 'Direct', account_type: 'Client Accounts',
        plan_name: 'Pro Trial', plan_type: 'Trial_plan', billing_cycle: 'Monthly',
        subscription_amount_display: '₹ 0.00', inr_amount: 0, usd_amount: 0, end_date: '17-09-2027',
        days_left: 353, bots_limit: 25, bots_used: 6, chats_limit: 25000, chats_used: 3200,
        service_chats_limit: 2500, service_chats_used: 200, bi_chats_limit: 5000, bi_chats_used: 120,
        gst_number: '36AAACW9821K1Z2', url: 'wisera.in',
        test_account: 'No', subscription_status: 'Trial', sales_person: 'Pooja Reddy',
        support_person: 'Ananya Sen', currency_type: 'INR', zoho_customer_id: 'ZC-901826', subscription_id: 'SUB-WISERA-2026',
        deployment_type: 'White-Label', custom_domain: 'agent.wisera.in', sub_clients_count: 22, white_label_brand: 'Wisera Reseller Network', ssl_status: 'Active (SSL 🔒)'
      },
      {
        id: 8, s_no: 8, name: 'BTS SmartBot', phone_number: '+91-9811102113', alternate_phone: '',
        email: 'btssmartbot@gmail.com', customer_type: 'Direct', account_type: 'Client Accounts',
        plan_name: 'Free', plan_type: 'Trial_plan', billing_cycle: 'Monthly',
        subscription_amount_display: '₹ 0.00', inr_amount: 0, usd_amount: 0, end_date: '18-10-2026',
        days_left: 19, bots_limit: 5, bots_used: 1, chats_limit: 500, chats_used: 8,
        service_chats_limit: 500, service_chats_used: 0, bi_chats_limit: 0, bi_chats_used: 0,
        gst_number: '-', url: 'btssmartbot.com',
        test_account: 'No', subscription_status: 'Trial', sales_person: 'Amit Patel',
        support_person: 'Suresh Raina', currency_type: 'INR', zoho_customer_id: 'ZC-901827', subscription_id: 'SUB-BTS-2026',
        deployment_type: 'On-Premise', server_host: 'AWS Dedicated VPC (Bangalore DC) - Node 03', cluster_health: '🟢 100% Operational', engine_version: 'v4.2.0 Enterprise Node', license_key: 'LIC-ONPREM-2026-X008'
      },
      {
        id: 9, s_no: 9, name: 'Shrishti Jajodia', phone_number: '+91-7289970856', alternate_phone: '',
        email: 'customercare@alignbooks.com', customer_type: 'Direct', account_type: 'Client Accounts',
        plan_name: 'Pro NY (WA)', plan_type: 'Paid_plan', billing_cycle: 'Yearly',
        subscription_amount_display: '₹ 47,999.00', inr_amount: 47999, usd_amount: 600, end_date: '08-06-2027',
        days_left: 252, bots_limit: 10, bots_used: 1, chats_limit: 5000, chats_used: 0,
        service_chats_limit: 1000, service_chats_used: 0, bi_chats_limit: 0, bi_chats_used: 0,
        gst_number: '-', url: 'alignbooks.com',
        test_account: 'No', subscription_status: 'Active', sales_person: 'Rahul Sharma',
        support_person: 'Kiran Kumar', currency_type: 'INR', zoho_customer_id: '3141005000009490054', subscription_id: 'SUB-SHRISHTI-2026',
        deployment_type: 'White-Label', custom_domain: 'app.alignbooks.com', sub_clients_count: 36, white_label_brand: 'AlignBooks Automation Hub', ssl_status: 'Active (SSL 🔒)'
      },
      {
        id: 10, s_no: 10, name: 'Solaris Green Energy #2', phone_number: '+91-9800009460', alternate_phone: '+91-9100006220',
        email: 'client20@solarisgre.com', customer_type: 'Direct', account_type: 'Client Accounts',
        plan_name: 'Pro NM', plan_type: 'Paid_plan', billing_cycle: 'Monthly',
        subscription_amount_display: '₹ 4,999.00', inr_amount: 4999, usd_amount: 65, end_date: '15-02-2027',
        days_left: 141, bots_limit: 25, bots_used: 0, chats_limit: 50000, chats_used: 2400,
        service_chats_limit: 1000, service_chats_used: 0, bi_chats_limit: 5000, bi_chats_used: 0,
        gst_number: '36AAACH7020R1ZZ', url: 'solarisgre.com',
        test_account: 'No', subscription_status: 'Active', sales_person: 'Rahul Sharma',
        support_person: 'Kiran Kumar', currency_type: 'INR', zoho_customer_id: '3141005000009490020', subscription_id: 'SUB-SOLARIS-2026',
        deployment_type: 'On-Premise', server_host: 'Solaris Private On-Prem Datacenter - Node A1', cluster_health: '🟢 100% Operational', engine_version: 'v4.2.0 Enterprise Node', license_key: 'LIC-ONPREM-2026-X010'
      }
    ];

    const customerTypes = ['Direct', 'Reseller', 'Reseller Client', 'Channel Partners', 'Referral'];
    const planNames = ['Pro NY', 'Starter NY (WA)', 'Starter NY', 'Pro NM (WA)', 'Pro NM', 'Enterprise AI', 'Pro Trial', 'Free'];
    const salesList = ['Rahul Sharma', 'Pooja Reddy', 'Sameer Khan', 'Amit Patel'];
    const supportList = ['Kiran Kumar', 'Vikas Rao', 'Ananya Sen', 'Suresh Raina'];
    const clientNames = [
      'TechCorp Solutions Pvt Ltd', 'FinEdge Capital Advisors', 'HealthCare Pulse Global', 'RetailMart Omni-Commerce',
      'Kuber Logistics India', 'Apex RealTech Infra', 'Zenith AutoMobility', 'EduVibe Learning Hub',
      'CloudNine Hospitality', 'InnoWave Media Group', 'Vedic Naturals Wellness', 'Solaris Green Energy',
      'PayFlow Financial Systems', 'LogiTrans Freight Corp', 'UrbanNest Interiors', 'MetroPlus Diagnostics',
      'SwiftRide Mobility', 'PrimeHealth Clinics', 'AeroFly Aviation Academy', 'DataPulse Analytics'
    ];

    const allClients = [...baseClients];
    for (let i = 11; i <= 218; i++) {
      const name = `${clientNames[(i - 10) % clientNames.length]} ${Math.floor(i / 20) > 0 ? '#' + (Math.floor(i/20)+1) : ''}`.trim();
      const plan = planNames[i % planNames.length];
      const isPaid = plan.includes('NY') || plan.includes('NM') || plan.includes('Enterprise');
      const cycle = i % 3 === 0 ? 'Yearly' : 'Monthly';
      const amt = isPaid ? (cycle === 'Yearly' ? '₹ 47,999.00' : '₹ 4,999.00') : '₹ 0.00';
      const inr = isPaid ? (cycle === 'Yearly' ? 47999 : 4999) : 0;
      const days = (i * 7) % 365 + 1;
      const sales = salesList[i % salesList.length];
      const support = supportList[i % supportList.length];
      const cType = customerTypes[i % customerTypes.length];
      const domain = `${name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10)}.com`;
      const isWhiteLabel = i % 2 === 1;

      allClients.push({
        id: i,
        s_no: i,
        name: name,
        phone_number: `+91-${9800000000 + i * 473}`,
        alternate_phone: i % 4 === 0 ? `+91-${9100000000 + i * 311}` : '',
        email: `client${i}@${domain}`,
        customer_type: cType,
        account_type: i % 15 === 0 ? 'Testing Accounts' : 'Client Accounts',
        plan_name: plan,
        plan_type: isPaid ? 'Paid_plan' : 'Trial_plan',
        billing_cycle: cycle,
        subscription_amount_display: amt,
        inr_amount: inr,
        usd_amount: isPaid ? Math.round(inr / 80) : 0,
        end_date: `${String((i % 28) + 1).padStart(2, '0')}-10-2026`,
        days_left: days,
        bots_limit: isPaid ? 25 : 10,
        bots_used: (i % 5),
        chats_limit: isPaid ? 50000 : 500,
        chats_used: isPaid ? (i * 120) % 40000 : (i * 7) % 450,
        service_chats_limit: isPaid ? 1000 : 200,
        service_chats_used: isPaid ? (i * 15) % 800 : 0,
        bi_chats_limit: isPaid ? (i % 2 === 0 ? 5000 : 0) : 0,
        bi_chats_used: isPaid && (i % 2 === 0) ? (i * 20) % 4500 : 0,
        gst_number: i % 4 === 0 ? `36AAACH${7000 + i}R1ZZ` : '-',
        url: domain,
        test_account: i % 20 === 0 ? 'Yes' : 'No',
        subscription_status: isPaid ? 'Active' : 'Trial',
        sales_person: sales,
        support_person: support,
        currency_type: 'INR',
        zoho_customer_id: `3141005000${800000 + i * 19}`,
        subscription_id: `SUB-${name.substring(0, 3).toUpperCase()}-${2000 + i}`,
        deployment_type: isWhiteLabel ? 'White-Label' : 'On-Premise',
        custom_domain: isWhiteLabel ? `bot.${domain}` : null,
        sub_clients_count: isWhiteLabel ? ((i * 3) % 25 + 2) : 0,
        white_label_brand: isWhiteLabel ? `${name.split(' ')[0]} AI Hub` : null,
        ssl_status: isWhiteLabel ? 'Active (SSL 🔒)' : null,
        server_host: !isWhiteLabel ? `AWS Dedicated VPC (Mumbai DC) - Node 0${(i % 5) + 1}` : null,
        cluster_health: !isWhiteLabel ? '🟢 100% Operational' : null,
        engine_version: !isWhiteLabel ? 'v4.2.0 Enterprise Node' : null,
        license_key: !isWhiteLabel ? `LIC-ONPREM-2026-X${String(i).padStart(3, '0')}` : null
      });
    }
    return allClients;
  }

  // Seed Team Users Data
  const SEED_USERS = [
    {
      id: 1,
      name: 'Sukanya Nagireddy',
      email: 'sukanya@smatbot.com',
      role: 'Super Admin',
      department: 'Executive Operations',
      avatar: 'SN',
      status: 'Active',
      twoFactorEnabled: true,
      lastActive: 'Just now',
      permissions: {
        manageClients: true,
        migrateBots: true,
        activatePlans: true,
        manageUsers: true,
        apiAdmin: true,
        viewAnalytics: true
      }
    },
    {
      id: 2,
      name: 'Arjun Mehta',
      email: 'arjun@smatbot.com',
      role: 'Bot Engineer',
      department: 'Bot Engineering & AI',
      avatar: 'AM',
      status: 'Active',
      twoFactorEnabled: true,
      lastActive: '15m ago',
      permissions: {
        manageClients: true,
        migrateBots: true,
        activatePlans: false,
        manageUsers: false,
        apiAdmin: true,
        viewAnalytics: true
      }
    },
    {
      id: 3,
      name: 'Rohan Deshmukh',
      email: 'rohan.d@smatbot.com',
      role: 'Support Lead',
      department: 'Customer Support SLA',
      avatar: 'RD',
      status: 'Active',
      twoFactorEnabled: false,
      lastActive: '1h ago',
      permissions: {
        manageClients: true,
        migrateBots: false,
        activatePlans: false,
        manageUsers: false,
        apiAdmin: false,
        viewAnalytics: true
      }
    },
    {
      id: 4,
      name: 'Elena Rostova',
      email: 'elena@smatbot.com',
      role: 'Billing Manager',
      department: 'Finance & Subscriptions',
      avatar: 'ER',
      status: 'Active',
      twoFactorEnabled: true,
      lastActive: '3h ago',
      permissions: {
        manageClients: true,
        migrateBots: false,
        activatePlans: true,
        manageUsers: false,
        apiAdmin: false,
        viewAnalytics: true
      }
    }
  ];

  // Seed Bot Migrations History Data
  const SEED_MIGRATIONS = [
    {
      id: 'MIG-1092',
      botName: 'Customer Support WhatsApp Bot v3',
      sourceClient: 'TechCorp Solutions Pvt Ltd',
      sourceClientId: 6,
      targetClient: 'FinEdge Capital Advisors',
      targetClientId: 7,
      mode: 'Clone Template',
      status: 'Completed',
      flowNodes: 38,
      intents: 142,
      executedBy: 'Arjun Mehta',
      timestamp: '2026-09-28 14:30',
      duration: '3.8s',
      canRollback: true,
      logs: [
        '[00:00.1] Validated bot flow schema v4.2.1 [OK]',
        '[00:01.2] Cloned 38 conversation tree nodes & triggers [OK]',
        '[00:02.1] Remapped OpenAI embeddings to target tenant [OK]',
        '[00:03.0] Provisioned WhatsApp WABA webhook routes [OK]',
        '[00:03.8] Migration executed successfully.'
      ]
    },
    {
      id: 'MIG-1091',
      botName: 'Lead Generation & Booking Flow',
      sourceClient: 'SANKU MUKHERJEE',
      sourceClientId: 4,
      targetClient: 'Arpit Padhy',
      targetClientId: 1,
      mode: 'Environment Promotion',
      status: 'Completed',
      flowNodes: 18,
      intents: 65,
      executedBy: 'Sukanya Nagireddy',
      timestamp: '2026-09-27 11:15',
      duration: '2.4s',
      canRollback: false,
      logs: [
        '[00:00.2] Promoted bot from Staging to Production [OK]',
        '[00:01.5] Linked Zoho CRM webhook mapping [OK]',
        '[00:02.4] Flow deployed to live channel.'
      ]
    }
  ];

  // Seed Partners Data
  const PARTNERS_DATA = [
    { id: 1, name: 'Malik Kia', email: 'crmservice.kp@malikkia.in', companyName: 'Malik kia', companyUrl: 'Malikkia.in' },
    { id: 2, name: 'abhinav', email: 'abhinav@smatbot.com', companyName: 'Feso Social', companyUrl: 'https://www.chatbotdev.fesosocialmedia.info/' },
    { id: 3, name: 'Sandip Jana', email: 'sandip@preconetindia.com', companyName: 'Preconet Technologies', companyUrl: 'www.preconetindia.com' },
    { id: 4, name: 'Panthayan James', email: 'panthayanjames@gmail.com', companyName: 'isoftw', companyUrl: 'www.soyniya.com' },
    { id: 5, name: 'Ajay Vishwakarma', email: 'asinfotechandservices@gmail.com', companyName: 'A S Infotech', companyUrl: 'asinfotechservices.com' },
    { id: 6, name: 'Pankaj', email: 'pankaj.ps4610425@gmail.com', companyName: 'Sigma Clap', companyUrl: 'https://sigmaclaub.com' }
  ];

  // DOM Helpers
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  function getPreviousLoginsHistory() {
    try {
      const raw = localStorage.getItem('smatbot_previous_logins');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    // Default to the active admin user if previously recorded, else empty
    const savedUser = localStorage.getItem('smatbot_admin_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u && u.email) {
          return [{ email: u.email, domain: '', password: '••••••••', realPass: 'admin123' }];
        }
      } catch (e) {}
    }
    return [
      { email: 'sukanya@smatbot.com', domain: '', password: '••••••••', realPass: 'admin123' }
    ];
  }

  function recordLoginHistory(email, password) {
    if (!email) return;
    let list = getPreviousLoginsHistory();
    list = list.filter(item => item.email.toLowerCase() !== email.toLowerCase());
    const domain = email.includes('@') && !email.endsWith('@smatbot.com') ? email.split('@')[1] : '';
    list.unshift({
      email: email,
      domain: domain,
      password: '••••••••',
      realPass: password || 'admin123',
      savedAt: new Date().toISOString()
    });
    // Keep max 5 recent logins
    list = list.slice(0, 5);
    localStorage.setItem('smatbot_previous_logins', JSON.stringify(list));
  }

  function removeLoginFromHistory(email, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    let list = getPreviousLoginsHistory();
    list = list.filter(item => item.email.toLowerCase() !== email.toLowerCase());
    localStorage.setItem('smatbot_previous_logins', JSON.stringify(list));
    showToast(`Removed ${email} from saved history`);
    renderLoginPage();
  }

  function resetToDefaultData() {
    localStorage.removeItem('smatbot_clients_data');
    clientsData = generateInitialSeedClients();
    localStorage.setItem('smatbot_clients_data', JSON.stringify(clientsData));
    showToast('Reset database to reference dummy dataset (218 clients).');
    if (currentRoute === 'client-details') {
      renderClientDetailsView($('#route-viewport'));
    } else if (currentRoute === 'client-details-profile') {
      renderClientDetailsProfileView($('#route-viewport'));
    }
  }

  function init() {
    try {
      const savedClients = localStorage.getItem('smatbot_clients_data');
      if (savedClients) {
        const parsed = JSON.parse(savedClients);
        if (Array.isArray(parsed) && parsed.length > 0) {
          clientsData = parsed;
        } else {
          clientsData = generateInitialSeedClients();
          localStorage.setItem('smatbot_clients_data', JSON.stringify(clientsData));
        }
      } else {
        clientsData = generateInitialSeedClients();
        localStorage.setItem('smatbot_clients_data', JSON.stringify(clientsData));
      }
    } catch (e) {
      clientsData = generateInitialSeedClients();
    }

    usersData = [...SEED_USERS];
    migrationsData = [...SEED_MIGRATIONS];

    // Ensure light theme
    localStorage.removeItem('smatbot_theme');
    document.body.classList.remove('dark-theme');

    // Global Click Outside Listener for closing custom dropdowns, user menu & saved logins
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.filter-item-block')) {
        $$('.custom-dropdown-menu').forEach(menu => menu.classList.remove('show'));
        $$('.custom-dropdown-trigger').forEach(trig => trig.classList.remove('open'));
      }
      if (!e.target.closest('.user-profile-header') && !e.target.closest('#user-menu-dropdown')) {
        const userDropdown = $('#user-menu-dropdown');
        if (userDropdown) userDropdown.classList.remove('show');
      }
      if (!e.target.closest('#saved-logins-popup') && !e.target.closest('#login-email-input') && !e.target.closest('#login-password-input')) {
        hideSavedLoginsPopup();
      }
    });

    // Check saved session
    const savedLogin = localStorage.getItem('smatbot_admin_logged_in');
    const savedUser = localStorage.getItem('smatbot_admin_user');

    if (savedLogin === 'true' && savedUser) {
      currentUser = JSON.parse(savedUser);
      isAuthenticated = true;
      loadAppShell();
    } else {
      isAuthenticated = false;
      renderLoginPage();
    }
  }

  // =========================================================================
  // 0. ADMIN LOGIN PAGE (admin.smatbot.com - Dynamic Previous Logins)
  // =========================================================================
  function renderLoginPage() {
    const app = $('#app-mount');
    const savedLogins = getPreviousLoginsHistory();
    const hasPreviousLogins = savedLogins && savedLogins.length > 0;
    const defaultEmail = hasPreviousLogins ? savedLogins[0].email : '';
    const defaultPass = hasPreviousLogins ? savedLogins[0].realPass : '';

    app.innerHTML = `
      <div class="smatbot-login-page-container">
        <!-- Top Navigation Header with Purple SmatBot Robot Logo -->
        <header class="login-top-header">
          <div class="smatbot-brand-logo-full">
            <div class="smatbot-logo-icon-purple">
              <svg viewBox="0 0 36 32" width="28" height="25" fill="none">
                <rect width="36" height="26" y="3" rx="7" fill="#635BFF" />
                <circle cx="12" cy="14" r="2.8" fill="#FFFFFF" />
                <circle cx="24" cy="14" r="2.8" fill="#FFFFFF" />
                <path d="M13 21 Q18 25 23 21" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" fill="none" />
                <circle cx="18" cy="2" r="1.5" fill="#635BFF" />
                <line x1="18" y1="3.5" x2="18" y2="4.5" stroke="#635BFF" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </div>
            <span class="smatbot-brand-name-text">SmatBot</span>
          </div>
        </header>

        <!-- Centered Login Box -->
        <main class="login-center-viewport">
          <div class="smatbot-login-box">
            <h1 class="smatbot-login-title">Login</h1>

            <form id="admin-login-form" onsubmit="window.smatApp.handleLoginSubmit(event)">
              <div class="smat-form-group relative-anchor" id="email-group-anchor">
                <label class="smat-form-label" for="login-email-input">Email Address</label>
                <input 
                  type="email" 
                  id="login-email-input" 
                  class="smat-form-input" 
                  value="${defaultEmail}" 
                  placeholder="Enter your email"
                  required 
                  autocomplete="off"
                  onfocus="${hasPreviousLogins ? "window.smatApp.showSavedLoginsPopup('email')" : ''}"
                  onclick="${hasPreviousLogins ? "window.smatApp.showSavedLoginsPopup('email')" : ''}"
                />

                ${hasPreviousLogins ? `
                  <!-- Dark Autofill Saved Logins Dropdown Popup (Shown only if previous logins exist) -->
                  <div class="saved-logins-dark-popup pos-email" id="saved-logins-popup">
                    <div class="saved-logins-list-container">
                      ${savedLogins.map((acc, idx) => `
                        <div class="saved-login-item-row" onclick="window.smatApp.selectSavedLogin(${idx})">
                          <div class="saved-login-icon-box">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                            </svg>
                          </div>
                          <div class="saved-login-text-info">
                            <div class="saved-login-email-line">
                              <span class="saved-login-email-txt">${acc.email}</span>
                              ${acc.domain ? `<span class="saved-login-domain-txt">${acc.domain}</span>` : ''}
                            </div>
                            <span class="saved-login-pass-bullets">${acc.password || '••••••••'}</span>
                          </div>
                          <button type="button" class="btn-remove-saved-login" title="Remove from history" onclick="window.smatApp.removeLoginFromHistory('${acc.email}', event)">
                            ✕
                          </button>
                        </div>
                      `).join('')}
                    </div>
                    <div class="saved-logins-footer-bar" onclick="window.smatApp.showToast('Opening Saved Password Vault...')">
                      <div class="saved-logins-footer-left">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <circle cx="12" cy="12" r="4"></circle>
                        </svg>
                        <span>Manage passwords...</span>
                      </div>
                      <span class="saved-logins-footer-key-icon">🔑</span>
                    </div>
                  </div>
                ` : ''}
              </div>

              <div class="smat-form-group relative-anchor" id="password-group-anchor">
                <label class="smat-form-label" for="login-password-input">Password</label>
                <input 
                  type="password" 
                  id="login-password-input" 
                  class="smat-form-input" 
                  value="${defaultPass}" 
                  placeholder="Enter your password"
                  required 
                  autocomplete="off"
                  onfocus="${hasPreviousLogins ? "window.smatApp.showSavedLoginsPopup('password')" : ''}"
                  onclick="${hasPreviousLogins ? "window.smatApp.showSavedLoginsPopup('password')" : ''}"
                />
              </div>

              <button type="submit" class="btn-smatbot-primary-login" id="btn-login-action">
                Login
              </button>
            </form>

            <!-- Quick Demo Credentials for Fast Switching -->
            <div class="demo-login-shortcuts-section">
              <div class="demo-shortcuts-divider"><span>Demo Roles</span></div>
              <div class="demo-shortcuts-grid">
                <button type="button" class="btn-demo-shortcut" onclick="window.smatApp.quickDemoLogin('Sukanya Nagireddy', 'sukanya@smatbot.com', 'Super Admin')">
                  <span class="demo-role-icon">👑</span>
                  <span>Super Admin</span>
                </button>
                <button type="button" class="btn-demo-shortcut" onclick="window.smatApp.quickDemoLogin('Arjun Mehta', 'arjun@smatbot.com', 'Bot Engineer')">
                  <span class="demo-role-icon">🤖</span>
                  <span>Bot Engineer</span>
                </button>
                <button type="button" class="btn-demo-shortcut" onclick="window.smatApp.quickDemoLogin('Elena Rostova', 'elena@smatbot.com', 'Billing Manager')">
                  <span class="demo-role-icon">💳</span>
                  <span>Billing Lead</span>
                </button>
              </div>
            </div>
          </div>
        </main>
        <div id="toast-container"></div>
      </div>
    `;
  }

  function showSavedLoginsPopup(targetField) {
    const popup = $('#saved-logins-popup');
    if (!popup) return;
    
    popup.classList.remove('pos-email', 'pos-password');
    if (targetField === 'email') {
      popup.classList.add('pos-email');
      const emailAnchor = $('#email-group-anchor');
      if (emailAnchor && popup.parentElement !== emailAnchor) {
        emailAnchor.appendChild(popup);
      }
    } else {
      popup.classList.add('pos-password');
      const passAnchor = $('#password-group-anchor');
      if (passAnchor && popup.parentElement !== passAnchor) {
        passAnchor.appendChild(popup);
      }
    }
    popup.classList.add('show');
  }

  function hideSavedLoginsPopup() {
    const popup = $('#saved-logins-popup');
    if (popup) popup.classList.remove('show');
  }

  function selectSavedLogin(index) {
    const list = getPreviousLoginsHistory();
    const item = list[index];
    if (!item) return;

    const emailInput = $('#login-email-input');
    const passInput = $('#login-password-input');
    if (emailInput) emailInput.value = item.email;
    if (passInput) passInput.value = item.realPass || 'admin123';

    showToast(`Autofilled credentials for: ${item.email}`);
    hideSavedLoginsPopup();
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    const email = $('#login-email-input').value.trim();
    const password = $('#login-password-input').value.trim();

    // Record login into previous history
    recordLoginHistory(email, password);

    const user = usersData.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
      name: email.split('@')[0],
      email: email,
      role: 'Super Admin',
      avatar: email.substring(0,2).toUpperCase()
    };
    
    currentUser = { ...user };
    isAuthenticated = true;
    localStorage.setItem('smatbot_admin_logged_in', 'true');
    localStorage.setItem('smatbot_admin_user', JSON.stringify(currentUser));
    
    showToast(`Welcome back, ${currentUser.name}!`);
    loadAppShell();
  }

  function quickDemoLogin(name, email, role) {
    recordLoginHistory(email, 'admin123');
    currentUser = { name, email, role, avatar: name.split(' ').map(n=>n[0]).join('').substring(0,2) };
    isAuthenticated = true;
    localStorage.setItem('smatbot_admin_logged_in', 'true');
    localStorage.setItem('smatbot_admin_user', JSON.stringify(currentUser));
    
    showToast(`Welcome back, ${currentUser.name}!`);
    loadAppShell();
  }

  function logout() {
    localStorage.removeItem('smatbot_admin_logged_in');
    localStorage.removeItem('smatbot_admin_user');
    isAuthenticated = false;
    impersonatingClient = null;
    showToast('Logged out successfully.');
    renderLoginPage();
  }

  // =========================================================================
  // 1. APP SHELL LAYOUT (Unified Modern Control Center)
  // =========================================================================
  function loadAppShell() {
    if (impersonatingClient) {
      renderClientPortalSimulator(impersonatingClient);
      return;
    }

    const app = $('#app-mount');
    app.innerHTML = `
      <div class="app-layout-wrapper sidebar-collapsed" id="admin-app-root">
        <!-- Modern SmatBot Left Navigation Sidebar -->
        <aside class="main-sidebar" id="app-sidebar">
          <div class="sidebar-brand-box">
            <div class="sidebar-brand-logo">
              <div class="brand-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <div class="brand-title-group">
                <span class="sidebar-brand-title">SmatBot</span>
                <span class="sidebar-brand-sub">Admin Portal</span>
              </div>
            </div>
            <button class="btn-sidebar-close" onclick="window.smatApp.toggleSidebar()" title="Collapse Sidebar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          </div>

          <!-- Super Admin Profile Card in Sidebar -->
          <div class="sidebar-profile-card">
            <div class="profile-card-left">
              <div class="profile-avatar-circle">
                ${currentUser.name.split(' ').map(n=>n[0]).join('').substring(0, 2)}
                <span class="status-badge-dot"></span>
              </div>
              <div class="profile-card-text">
                <span class="profile-card-name">${currentUser.name}</span>
                <span class="profile-card-role">● ${currentUser.role}</span>
              </div>
            </div>
          </div>

          <!-- All Core Navigation Modules -->
          <div class="sidebar-nav-container">
            <div class="sidebar-section-title">CLIENT MANAGEMENT</div>

            <!-- 1. Client Details (DEFAULT / MAIN LANDING SCREEN) -->
            <a class="nav-link-item ${currentRoute === 'client-details' || currentRoute === 'client-details-profile' ? 'active' : ''}" onclick="window.smatApp.navigateTo('client-details')">
              <span class="nav-link-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </span>
              <span>Client Details</span>
            </a>

            <!-- 2. Chatbots & Migrate Bot -->
            <a class="nav-link-item ${currentRoute === 'chatbots' ? 'active' : ''}" onclick="window.smatApp.navigateTo('chatbots')">
              <span class="nav-link-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path></svg>
              </span>
              <span>Chatbots</span>
            </a>

            <div class="sidebar-section-title" style="margin-top:0.85rem;">BILLING & PLANS</div>

            <!-- 3. Plan Activation & Matrix -->
            <a class="nav-link-item ${currentRoute === 'plans' ? 'active' : ''}" onclick="window.smatApp.navigateTo('plans')">
              <span class="nav-link-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </span>
              <span>Plan Activation & Pricing</span>
            </a>

            <!-- 4. Client Subscriptions -->
            <a class="nav-link-item ${currentRoute === 'subscriptions' ? 'active' : ''}" onclick="window.smatApp.navigateTo('subscriptions')">
              <span class="nav-link-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
              </span>
              <span>Active Subscriptions</span>
            </a>

            <!-- 5. Renewals & Expiries -->
            <a class="nav-link-item ${currentRoute === 'renewals' ? 'active' : ''}" onclick="window.smatApp.navigateTo('renewals')">
              <span class="nav-link-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
              </span>
              <span>Renewals</span>
            </a>

            <!-- 6. Platform Addons -->
            <a class="nav-link-item ${currentRoute === 'addons' ? 'active' : ''}" onclick="window.smatApp.navigateTo('addons')">
              <span class="nav-link-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </span>
              <span>Platform Addons</span>
            </a>

            <!-- 7. Coupons -->
            <a class="nav-link-item ${currentRoute === 'coupons' ? 'active' : ''}" onclick="window.smatApp.navigateTo('coupons')">
              <span class="nav-link-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              </span>
              <span>Discount Coupons</span>
            </a>

            <div class="sidebar-section-title" style="margin-top:0.85rem;">TEAM & PARTNERS</div>

            <!-- 8. Team & Users -->
            <a class="nav-link-item ${currentRoute === 'users' ? 'active' : ''}" onclick="window.smatApp.navigateTo('users')">
              <span class="nav-link-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </span>
              <span>Team & Users</span>
            </a>

            <!-- 9. Agency Partners -->
            <a class="nav-link-item ${currentRoute === 'partners' ? 'active' : ''}" onclick="window.smatApp.navigateTo('partners')">
              <span class="nav-link-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="3" width="6" height="4" rx="1"></rect><rect x="3" y="17" width="6" height="4" rx="1"></rect><rect x="15" y="17" width="6" height="4" rx="1"></rect><path d="M12 7v4"></path></svg>
              </span>
              <span>Agency Partners</span>
            </a>
          </div>

          <div class="sidebar-footer-box">
            <span style="font-size:0.75rem; color:#64748B; font-weight:600;">Cloud System Status</span>
            <span class="status-pill active" style="font-size:0.72rem; padding:2px 8px;">100% Operational</span>
          </div>
        </aside>

        <!-- Main Viewport Area -->
        <div class="main-viewport">
          <header class="app-header">
            <div class="header-left-group">
              <button class="hamburger-btn" onclick="window.smatApp.toggleSidebar()" title="Toggle Navigation Sidebar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
              <div id="header-page-title" style="font-weight: 700; font-size: 1.05rem; color: #1E293B;">
                SmatBot Admin Control Center
              </div>
            </div>

            <div class="header-right-group">
              <div id="header-details-actions" class="details-top-actions-group" style="display:none;"></div>

              <!-- Profile Pill Dropdown Trigger -->
              <div class="user-profile-header" onclick="window.smatApp.toggleUserMenu()">
                <div class="user-avatar-circle">
                  ${currentUser.name.split(' ').map(n=>n[0]).join('').substring(0, 2)}
                </div>
                <span class="user-header-name">
                  ${currentUser.name}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </div>

              <!-- Floating User Menu Panel -->
              <div class="user-menu-dropdown" id="user-menu-dropdown">
                <div class="user-menu-header-info">
                  <div class="user-menu-title">${currentUser.name}</div>
                  <div class="user-menu-email">${currentUser.email}</div>
                  <div class="user-menu-role">Role: ${currentUser.role}</div>
                </div>
                <div class="user-menu-item" onclick="window.smatApp.navigateTo('users'); window.smatApp.toggleUserMenu();">
                  <span class="user-menu-item-icon">👤</span>
                  <span>Team & Access Control</span>
                </div>
                <div class="user-menu-item danger" onclick="window.smatApp.logout()">
                  <span class="user-menu-item-icon">🚪</span>
                  <span>Logout</span>
                </div>
              </div>
            </div>
          </header>

          <div class="page-body-container" id="route-viewport">
            <!-- Dynamic Route View -->
          </div>
        </div>
      </div>

      <div id="modal-container"></div>
      <div id="drawer-container"></div>
      <div id="toast-container"></div>
    `;

    navigateTo(currentRoute);
  }

  // =========================================================================
  // 2. ROUTING CONTROLLER
  // =========================================================================
  function navigateTo(route) {
    currentRoute = route;
    $$('.nav-link-item').forEach(el => {
      if (el.getAttribute('onclick')?.includes(`'${route}'`) || (route === 'client-details-profile' && el.getAttribute('onclick')?.includes('client-details'))) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    const headerActions = $('#header-details-actions');
    if (headerActions) {
      if (route === 'client-details-profile') {
        headerActions.style.display = 'flex';
      } else {
        headerActions.style.display = 'none';
        headerActions.innerHTML = '';
      }
    }

    const titleEl = $('#header-page-title');
    const titles = {
      'overview': 'Operations Command Center & Executive Hub',
      'client-details': 'Client Details',
      'client-details-profile': 'Client Profile Details View',
      'impersonation': 'Client Portal Impersonation Console',
      'chatbots': 'Bot Migration Engine & Workflows',
      'users': 'Team & Role-Based Access Control',
      'plans': 'Plan Activation & Pricing Subscriptions',
      'subscriptions': 'Active Client Subscriptions',
      'renewals': 'Subscription Renewals & Expiries',
      'addons': 'Platform Addons & Integrations',
      'partners': 'Agency & Channel Partners Directory',
      'coupons': 'Discount Coupons & Vouchers'
    };
    if (titleEl) titleEl.innerText = titles[route] || 'SmatBot Admin Control Center';

    const viewport = $('#route-viewport');
    if (!viewport) return;

    if (route === 'overview') {
      renderOverviewView(viewport);
    } else if (route === 'client-details') {
      renderClientDetailsView(viewport);
    } else if (route === 'client-details-profile') {
      renderClientDetailsProfileView(viewport);
    } else if (route === 'impersonation') {
      renderImpersonationView(viewport);
    } else if (route === 'chatbots') {
      renderChatbotsView(viewport);
    } else if (route === 'users') {
      renderUsersView(viewport);
    } else if (route === 'plans') {
      renderPlansView(viewport);
    } else if (route === 'addons') {
      renderAddonsView(viewport);
    } else if (route === 'subscriptions') {
      renderClientSubscriptionsView(viewport);
    } else if (route === 'renewals') {
      renderRenewalsView(viewport);
    } else if (route === 'partners') {
      renderPartnersView(viewport);
    } else if (route === 'coupons') {
      renderCouponsView(viewport);
    } else {
      renderGenericView(viewport, route);
    }
  }

  // =========================================================================
  // 3. EXECUTIVE OPERATIONS COMMAND CENTER (OVERVIEW HUB)
  // =========================================================================
  function renderOverviewView(container) {
    const totalClients = clientsData.length;
    const activeClients = clientsData.filter(c => c.subscription_status === 'Active').length;
    const trialClients = clientsData.filter(c => c.subscription_status === 'Trial' || (!c.subscription_status && (c.plan_name || '').toLowerCase().includes('trial'))).length;
    const expiringClients = clientsData.filter(c => typeof c.days_left === 'number' && c.days_left <= 7 && c.days_left >= 0).length;
    const autoPayClients = clientsData.filter(c => c.auto_pay === true || c.auto_pay === 'Active' || c.id % 2 === 0).length;
    const totalBotsManaged = clientsData.reduce((acc, c) => acc + (c.bots_used || 1), 0);

    const monthlyClients = clientsData.filter(c => (c.billing_cycle || '').toLowerCase() === 'monthly').length;
    const yearlyClients = clientsData.filter(c => (c.billing_cycle || '').toLowerCase() === 'yearly').length;
    const customDurationClients = Math.max(0, totalClients - monthlyClients - yearlyClients);

    container.innerHTML = `
      <div class="command-center-container">
        <!-- 1. Header with Live Engine Badge -->
        <div class="command-center-header">
          <div>
            <div class="cc-header-title">
              <span>⚡ SmatBot Operations Command Center</span>
              <span class="cc-live-pulse-badge"><span class="cc-pulse-dot"></span> LIVE OPERATIONS ENGINE</span>
            </div>
            <p style="font-size:0.85rem; color:#64748B; margin:4px 0 0 0;">
              Unified SaaS Operations, Revenue Health, Multi-duration Subscriptions & Security Gateway.
            </p>
          </div>
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <button class="launcher-btn primary" onclick="window.smatApp.openAddClientModal()">
              ➕ Onboard Client & Assign Plan
            </button>
            <button class="launcher-btn secondary" onclick="window.smatApp.navigateTo('client-details')">
              👥 Client Directory (${totalClients})
            </button>
          </div>
        </div>

        <!-- 2. Quick Action Launcher Bar -->
        <div class="quick-action-launcher-bar">
          <span style="font-size:0.8rem; font-weight:700; color:#475569; text-transform:uppercase; letter-spacing:0.04em;">QUICK ACTIONS:</span>
          <button class="launcher-btn primary" onclick="window.smatApp.openAddClientModal()">
            <span>➕</span> Add New Client Account
          </button>
          <button class="launcher-btn accent" onclick="window.smatApp.openPlanModal(null, 'Pro NY')">
            <span>⚡</span> Assign / Upgrade Plan
          </button>
          <button class="launcher-btn purple" onclick="window.smatApp.navigateTo('impersonation')">
            <span>🔐</span> 1-Click Client Portal Login
          </button>
          <button class="launcher-btn secondary" onclick="window.smatApp.navigateTo('renewals')">
            <span>🔄</span> Renewal Tracking (14 Expiring)
          </button>
          <button class="launcher-btn secondary" onclick="window.smatApp.navigateTo('addons')">
            <span>🧩</span> Manage Add-ons & Quotas
          </button>
        </div>

        <!-- 3. Executive Metrics 6-Card Grid -->
        <div class="metrics-hub-grid">
          <!-- Metric 1: Total Accounts -->
          <div class="hub-metric-card" onclick="window.smatApp.navigateTo('client-details')" style="cursor:pointer;" title="View all clients">
            <div class="hub-metric-top">
              <div class="hub-metric-icon blue">🏢</div>
              <span class="hub-metric-badge blue">SaaS + On-Prem</span>
            </div>
            <div class="hub-metric-value">${totalClients}</div>
            <div class="hub-metric-label">Total Accounts Managed</div>
          </div>

          <!-- Metric 2: Active Paid Subscriptions -->
          <div class="hub-metric-card" style="border-left: 4px solid #16A34A; cursor:pointer;" onclick="window.smatApp.navigateTo('client-details'); window.smatApp.selectSegmentTab('active');" title="Click to view Active Paid list">
            <div class="hub-metric-top">
              <div class="hub-metric-icon green">🟢</div>
              <span class="hub-metric-badge green">71.8% Retention</span>
            </div>
            <div class="hub-metric-value">${activeClients} <span style="font-size:0.9rem; color:#16A34A; font-weight:700;">Paid</span></div>
            <div class="hub-metric-label">Active Paying Subscriptions (₹3.42L MRR)</div>
          </div>

          <!-- Metric 3: Trial Pipeline -->
          <div class="hub-metric-card" style="border-left: 4px solid #F59E0B; cursor:pointer;" onclick="window.smatApp.navigateTo('client-details'); window.smatApp.selectSegmentTab('trial');" title="Click to view Trials">
            <div class="hub-metric-top">
              <div class="hub-metric-icon orange">⏳</div>
              <span class="hub-metric-badge orange">Evaluation</span>
            </div>
            <div class="hub-metric-value">${trialClients}</div>
            <div class="hub-metric-label">Trial Pipeline Accounts</div>
          </div>

          <!-- Metric 4: Impending Renewals -->
          <div class="hub-metric-card" style="border-left: 4px solid #DC2626; cursor:pointer;" onclick="window.smatApp.navigateTo('client-details'); window.smatApp.selectSegmentTab('expiring');" title="Click to view Expiring accounts">
            <div class="hub-metric-top">
              <div class="hub-metric-icon red">⚠️</div>
              <span class="hub-metric-badge red">Next 7 Days</span>
            </div>
            <div class="hub-metric-value" style="color:#DC2626;">${expiringClients}</div>
            <div class="hub-metric-label">Renewals Requiring Attention</div>
          </div>

          <!-- Metric 5: Auto-Pay Status -->
          <div class="hub-metric-card" onclick="window.smatApp.navigateTo('subscriptions')" style="cursor:pointer;" title="View subscriptions">
            <div class="hub-metric-top">
              <div class="hub-metric-icon teal">⚡</div>
              <span class="hub-metric-badge green">Auto Recurring</span>
            </div>
            <div class="hub-metric-value">${autoPayClients}</div>
            <div class="hub-metric-label">Auto-Pay Active Subscriptions</div>
          </div>

          <!-- Metric 6: Live Chatbots Managed -->
          <div class="hub-metric-card" onclick="window.smatApp.navigateTo('chatbots')" style="cursor:pointer;" title="View bot engine">
            <div class="hub-metric-top">
              <div class="hub-metric-icon purple">🤖</div>
              <span class="hub-metric-badge blue">WhatsApp + Web</span>
            </div>
            <div class="hub-metric-value">${totalBotsManaged}</div>
            <div class="hub-metric-label">Live Active Bot Instances</div>
          </div>
        </div>

        <!-- 4. Subscription Cycles & Duration Breakdown -->
        <div class="cycles-section-container">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
            <div>
              <div style="font-weight:800; font-size:1.1rem; color:#0F172A;">📊 Flexible Subscription Cycles & Durations</div>
              <p style="font-size:0.8rem; color:#64748B; margin-top:2px; margin-bottom:0;">
                Supporting Monthly, Yearly & Custom On-demand Durations (2, 4, 6, 9 Months) without requiring separate SKU plans.
              </p>
            </div>
            <button class="launcher-btn secondary" onclick="window.smatApp.navigateTo('subscriptions')">
              View All Subscriptions →
            </button>
          </div>

          <div class="cycles-cards-grid">
            <!-- Cycle 1: Monthly -->
            <div class="cycle-stat-card">
              <div class="cycle-stat-header">
                <span class="cycle-stat-title">📅 Monthly Cycle (30 Days)</span>
                <span class="hub-metric-badge blue">Standard</span>
              </div>
              <div class="cycle-stat-count">${monthlyClients} <span style="font-size:0.8rem; font-weight:600; color:#64748B;">Clients</span></div>
              <p style="font-size:0.75rem; color:#64748B; margin-top:6px; margin-bottom:10px;">
                Recurring every 30 days. High flexibility for SMBs with auto-pay support.
              </p>
              <div style="background:#E2E8F0; height:6px; border-radius:3px; overflow:hidden;">
                <div style="background:#1877F2; height:100%; width:${Math.round((monthlyClients/totalClients)*100)}%;"></div>
              </div>
            </div>

            <!-- Cycle 2: Yearly -->
            <div class="cycle-stat-card featured">
              <div class="cycle-stat-header">
                <span class="cycle-stat-title">🌟 Yearly Cycle (365 Days)</span>
                <span class="hub-metric-badge green">Annual ARR</span>
              </div>
              <div class="cycle-stat-count">${yearlyClients} <span style="font-size:0.8rem; font-weight:600; color:#64748B;">Clients</span></div>
              <p style="font-size:0.75rem; color:#64748B; margin-top:6px; margin-bottom:10px;">
                Annual upfront contract with monthly add-on capability (Add-ons co-expire with main contract).
              </p>
              <div style="background:#E2E8F0; height:6px; border-radius:3px; overflow:hidden;">
                <div style="background:#16A34A; height:100%; width:${Math.round((yearlyClients/totalClients)*100)}%;"></div>
              </div>
            </div>

            <!-- Cycle 3: Custom Durations -->
            <div class="cycle-stat-card">
              <div class="cycle-stat-header">
                <span class="cycle-stat-title">⏱️ Custom Durations (2, 4, 6, 9 Mos)</span>
                <span class="hub-metric-badge orange">Custom Term</span>
              </div>
              <div class="cycle-stat-count">${customDurationClients} <span style="font-size:0.8rem; font-weight:600; color:#64748B;">Clients</span></div>
              <p style="font-size:0.75rem; color:#64748B; margin-top:6px; margin-bottom:10px;">
                Calculated dynamically: <code style="background:#E2E8F0; padding:1px 4px; border-radius:4px;">Monthly Price × N Months</code>. Zero extra plan clutter.
              </p>
              <div style="background:#E2E8F0; height:6px; border-radius:3px; overflow:hidden;">
                <div style="background:#F59E0B; height:100%; width:${Math.round((customDurationClients/totalClients)*100)}%;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 5. Plans Portfolio Matrix -->
        <div class="plans-portfolio-container">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
            <div>
              <div style="font-weight:800; font-size:1.1rem; color:#0F172A;">💎 Active Plans Portfolio & Entitlements</div>
              <p style="font-size:0.8rem; color:#64748B; margin-top:2px; margin-bottom:0;">
                All registered tier plans with live subscriber counts, quota caps, and prorated upgrade paths.
              </p>
            </div>
            <button class="launcher-btn primary" onclick="window.smatApp.navigateTo('plans')">
              Plan Matrix & Pricing Details →
            </button>
          </div>

          <div class="portfolio-cards-grid">
            <!-- Plan 1: Broadcast -->
            <div class="plan-item-card">
              <div>
                <div class="plan-item-header">
                  <span class="plan-item-name">Broadcast</span>
                  <span class="hub-metric-badge blue">Tier 1 • Outreach</span>
                </div>
                <div class="plan-item-price">₹1,499 <span>/ mo • ₹14,500 / yr</span></div>
                <div class="plan-item-subscribers">👥 28 Active Subscribers</div>
                <div class="plan-item-meta">
                  <span>🤖 <strong>2 Bots Included</strong></span>
                  <span>💬 <strong>1K/mo (12K/yr Upfront)</strong> Service Chats</span>
                  <span>📨 WA Template & Broadcast Messaging</span>
                  <span>📊 Google Sheets Integration & Contacts</span>
                </div>
              </div>
              <button class="launcher-btn secondary" style="width:100%; justify-content:center;" onclick="window.smatApp.openPlanModal(null, 'Broadcast')">
                Assign Broadcast
              </button>
            </div>

            <!-- Plan 2: Standard -->
            <div class="plan-item-card">
              <div>
                <div class="plan-item-header">
                  <span class="plan-item-name">Standard</span>
                  <span class="hub-metric-badge orange">Tier 2 • Flow Bot</span>
                </div>
                <div class="plan-item-price">₹3,500 <span>/ mo • ₹35,000 / yr</span></div>
                <div class="plan-item-subscribers" style="background:#FEF3C7; color:#B45309;">👥 64 Active Subscribers</div>
                <div class="plan-item-meta">
                  <span>🤖 <strong>5 Bots Included</strong></span>
                  <span>💬 <strong>30K/mo (360K/yr Upfront)</strong> Service Chats</span>
                  <span>🌐 Unlimited Website & Instagram Messages</span>
                  <span>📱 4 Platforms + Custom Sheets & Webhooks</span>
                </div>
              </div>
              <button class="launcher-btn secondary" style="width:100%; justify-content:center;" onclick="window.smatApp.openPlanModal(null, 'Standard')">
                Assign Standard
              </button>
            </div>

            <!-- Plan 3: Pro (Most Popular) -->
            <div class="plan-item-card popular">
              <div>
                <div class="plan-item-header">
                  <span class="plan-item-name" style="color:#1877F2;">Pro</span>
                  <span class="hub-metric-badge green">★ Most Popular</span>
                </div>
                <div class="plan-item-price">₹6,500 <span>/ mo • ₹72,000 / yr</span></div>
                <div class="plan-item-subscribers" style="background:#DCFCE7; color:#15803D;">👥 92 Active Subscribers</div>
                <div class="plan-item-meta">
                  <span>🤖 <strong>10 Bots Included + 3 Live Agents</strong></span>
                  <span>💬 <strong>100K/mo (1.2M/yr Upfront)</strong> Service Chats</span>
                  <span>📱 6 Omnichannel Platforms (WA, Web, FB, IG, Apps, Landing)</span>
                  <span>🛒 WhatsApp Cart, Catalog & CRM Included</span>
                </div>
              </div>
              <button class="launcher-btn primary" style="width:100%; justify-content:center;" onclick="window.smatApp.openPlanModal(null, 'Pro')">
                Assign / Upgrade Pro
              </button>
            </div>

            <!-- Plan 4: AI -->
            <div class="plan-item-card">
              <div>
                <div class="plan-item-header">
                  <span class="plan-item-name" style="color:#7C3AED;">AI Integration</span>
                  <span class="hub-metric-badge purple">Tier 4 • Autonomous</span>
                </div>
                <div class="plan-item-price">₹8,999 <span>/ mo • ₹96,000 / yr</span></div>
                <div class="plan-item-subscribers" style="background:#F3E8FF; color:#7E22CE;">👥 34 Active Deployments</div>
                <div class="plan-item-meta">
                  <span>🤖 <strong>10 Bots Included + 3 Live Agents</strong></span>
                  <span>💬 <strong>500K/mo (6M/yr Upfront)</strong> Service Chats</span>
                  <span>🧠 Native AI Knowledge Base & LLM Integration</span>
                  <span>⚡ 10K/mo (120K/yr Upfront) BI Messages</span>
                </div>
              </div>
              <button class="launcher-btn secondary" style="width:100%; justify-content:center;" onclick="window.smatApp.openPlanModal(null, 'AI')">
                Assign AI Tier
              </button>
            </div>
          </div>
        </div>

        <!-- 6. Client Impersonation & Security Spotlight Card -->
        <div style="background:#FFFFFF; border-radius:14px; border:1px solid #E2E8F0; padding:1.5rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div style="display:flex; align-items:center; gap:1rem;">
            <div style="width:50px; height:50px; border-radius:12px; background:#FAF5FF; color:#7E22CE; display:flex; align-items:center; justify-content:center; font-size:1.5rem;">
              🔐
            </div>
            <div>
              <div style="font-weight:800; font-size:1.05rem; color:#0F172A;">Client Portal Impersonation Gateway</div>
              <p style="font-size:0.8rem; color:#64748B; margin-top:2px; margin-bottom:0;">
                Troubleshoot client chatbot issues in real time without asking for their passwords. Audit-logged & encrypted.
              </p>
            </div>
          </div>
          <div style="display:flex; gap:0.75rem;">
            <button class="launcher-btn purple" onclick="window.smatApp.navigateTo('impersonation')">
              Launch Impersonation Console →
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderImpersonationView(container) {
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:1.5rem; padding-bottom:2rem;">
        <div style="background:#FFFFFF; padding:1.5rem; border-radius:14px; border:1px solid #E2E8F0;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
            <div>
              <h2 class="section-page-title" style="margin:0; display:flex; align-items:center; gap:0.5rem;">
                <span>🔐</span> Client Portal Impersonation Console
              </h2>
              <p style="font-size:0.85rem; color:#64748B; margin-top:4px; margin-bottom:0;">
                Select any registered client account to securely launch into their live Chatbot Control Panel for instant debugging, flow verification, or configuration support.
              </p>
            </div>
            <div class="cc-live-pulse-badge" style="background:#FAF5FF; color:#7E22CE; border-color:#E9D5FF;">
              🛡️ AUDIT-LOGGED COMPLIANCE GATEWAY
            </div>
          </div>

          <div style="margin-top:1.25rem;">
            <input 
              type="text" 
              id="impersonate-search-box"
              class="filter-search-box" 
              placeholder="🔍 Search client by name, email, or Zoho ID to impersonate..." 
              oninput="window.smatApp.filterImpersonationClients(this.value)"
              style="max-width:550px;"
            />
          </div>
        </div>

        <div class="table-card-container">
          <table class="client-data-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Email</th>
                <th>Current Plan</th>
                <th>Active Bots</th>
                <th>Status</th>
                <th style="text-align:right;">1-Click Impersonate Action</th>
              </tr>
            </thead>
            <tbody id="impersonation-table-body">
              ${clientsData.slice(0, 15).map(c => `
                <tr>
                  <td>
                    <div class="client-name-cell">
                      <div class="client-avatar-circle ${getAvatarColorClass(c.name)}">${getInitials(c.name)}</div>
                      <div>
                        <div class="client-primary-name">${escapeHtml(c.name)}</div>
                        <div class="client-sub-domain">${escapeHtml(c.custom_domain || c.url || '')}</div>
                      </div>
                    </div>
                  </td>
                  <td>${escapeHtml(c.email)}</td>
                  <td><span style="font-weight:700; color:#1E293B;">${escapeHtml(c.plan_name || 'Pro Trial')}</span></td>
                  <td>${c.bots_used || 0} / ${c.bots_limit || 10} Bots</td>
                  <td>
                    <span class="status-badge-compact ${c.subscription_status === 'Active' ? 'active' : (c.subscription_status === 'Trial' ? 'trial' : 'expired')}">
                      ● ${escapeHtml(c.subscription_status || 'Trial')}
                    </span>
                  </td>
                  <td style="text-align:right;">
                    <button class="launcher-btn purple" style="padding:6px 14px; font-size:0.78rem;" onclick="window.smatApp.openLoginConfirmModal(${c.id})">
                      🔐 Login as ${escapeHtml(c.name)}
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function filterImpersonationClients(q) {
    const tbody = $('#impersonation-table-body');
    if (!tbody) return;
    const term = (q || '').trim().toLowerCase();
    const list = clientsData.filter(c => 
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.zoho_customer_id && c.zoho_customer_id.toLowerCase().includes(term))
    ).slice(0, 15);

    tbody.innerHTML = list.map(c => `
      <tr>
        <td>
          <div class="client-name-cell">
            <div class="client-avatar-circle ${getAvatarColorClass(c.name)}">${getInitials(c.name)}</div>
            <div>
              <div class="client-primary-name">${escapeHtml(c.name)}</div>
              <div class="client-sub-domain">${escapeHtml(c.custom_domain || c.url || '')}</div>
            </div>
          </div>
        </td>
        <td>${escapeHtml(c.email)}</td>
        <td><span style="font-weight:700; color:#1E293B;">${escapeHtml(c.plan_name || 'Pro Trial')}</span></td>
        <td>${c.bots_used || 0} / ${c.bots_limit || 10} Bots</td>
        <td>
          <span class="status-badge-compact ${c.subscription_status === 'Active' ? 'active' : (c.subscription_status === 'Trial' ? 'trial' : 'expired')}">
            ● ${escapeHtml(c.subscription_status || 'Trial')}
          </span>
        </td>
        <td style="text-align:right;">
          <button class="launcher-btn purple" style="padding:6px 14px; font-size:0.78rem;" onclick="window.smatApp.openLoginConfirmModal(${c.id})">
            🔐 Login as ${escapeHtml(c.name)}
          </button>
        </td>
      </tr>
    `).join('');
  }

  // =========================================================================
  // 4. MODULE 1: CLIENT DETAILS TABLE & 15 FILTERS
  // =========================================================================
  function renderClientDetailsView(container) {
    const totalClients = clientsData.length;
    const activeClients = clientsData.filter(c => c.subscription_status === 'Active').length;
    const trialClients = clientsData.filter(c => c.subscription_status === 'Trial' || (!c.subscription_status && (c.plan_name || '').toLowerCase().includes('trial'))).length;
    const expiringClients = clientsData.filter(c => typeof c.days_left === 'number' && c.days_left <= 7 && c.days_left >= 0).length;
    const whitelabelClients = clientsData.filter(c => c.customer_type === 'White-Label' || c.deployment_type === 'White-Label').length;
    const activePercent = totalClients > 0 ? Math.round((activeClients / totalClients) * 100) : 0;
    const trialPercent = totalClients > 0 ? Math.round((trialClients / totalClients) * 100) : 0;

    const filteredList = getFilteredClients();
    const totalItems = filteredList.length;
    const totalPages = Math.ceil(totalItems / clientPageSize) || 1;
    if (clientCurrentPage > totalPages) clientCurrentPage = totalPages;
    if (clientCurrentPage < 1) clientCurrentPage = 1;

    const startIdx = (clientCurrentPage - 1) * clientPageSize;
    const endIdx = startIdx + clientPageSize;
    const paginatedList = filteredList.slice(startIdx, endIdx);

    container.innerHTML = `
      <!-- Top 3 Metrics Overview Cards (Total Customers, Active Clients, Trial Pipeline) -->
      <div class="overview-metrics-grid">
        <!-- Card 1: TOTAL CUSTOMERS -->
        <div class="metric-summary-card clickable ${filterState.activeSegmentTab === 'all' ? 'active-filter' : ''}" onclick="window.smatApp.selectSegmentTab('all')">
          <div class="metric-card-top-row">
            <div class="metric-card-badge">
              <div class="metric-icon-circle purple">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <span class="metric-card-label">TOTAL CUSTOMERS</span>
            </div>
            <button class="metric-btn-pill" onclick="event.stopPropagation(); window.smatApp.openAddClientModal()">+ Add Client</button>
          </div>
          <div class="metric-card-big-value">
            ${totalClients} <span class="metric-sub-limit">Accounts</span>
            <span class="metric-monthly-growth-pill clickable" onclick="event.stopPropagation(); window.smatApp.filterNewClientsThisMonth()" title="Click to filter 18 new clients">✨ +18 New</span>
          </div>
          <div class="metric-card-subtext" onclick="event.stopPropagation(); window.smatApp.filterNewClientsThisMonth()" style="cursor:pointer;" title="Click to filter 18 new clients">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0; color:#10B981;"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
            <span><strong style="color:#059669;">+18 new accounts</strong> added this month</span>
          </div>
        </div>

        <!-- Card 2: ACTIVE CLIENTS -->
        <div class="metric-summary-card clickable ${filterState.activeSegmentTab === 'active' ? 'active-filter' : ''}" onclick="window.smatApp.selectSegmentTab('active')">
          <div class="metric-card-top-row">
            <div class="metric-card-badge">
              <div class="metric-icon-circle blue">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <span class="metric-card-label">ACTIVE CLIENTS</span>
            </div>
          </div>
          <div class="metric-card-big-value">${activeClients} <span class="metric-sub-limit">/ ${totalClients}</span></div>
          <div class="metric-progress-row">
            <span>Active Paid Subscriptions</span>
            <span class="metric-percent-text blue">${activePercent}% Active</span>
          </div>
          <div class="metric-progress-track">
            <div class="metric-progress-fill blue" style="width: ${activePercent}%;"></div>
          </div>
        </div>

        <!-- Card 3: TRIAL EVALUATION PIPELINE -->
        <div class="metric-summary-card clickable ${filterState.activeSegmentTab === 'trial' ? 'active-filter' : ''}" onclick="window.smatApp.selectSegmentTab('trial')">
          <div class="metric-card-top-row">
            <div class="metric-card-badge">
              <div class="metric-icon-circle orange">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <span class="metric-card-label">TRIAL PIPELINE</span>
            </div>
          </div>
          <div class="metric-card-big-value">${trialClients} <span class="metric-sub-limit">Trial Accounts</span></div>
          <div class="metric-progress-row">
            <span>Trial Evaluation Accounts</span>
            <span class="metric-percent-text orange">${trialPercent}% in Trial</span>
          </div>
          <div class="metric-progress-track">
            <div class="metric-progress-fill orange" style="width: ${trialPercent}%;"></div>
          </div>
        </div>
      </div>

      <!-- Active Filter Banner (Shown when user clicks +18 New badge) -->
      ${filterState.newThisMonthOnly ? `
        <div class="active-filter-banner">
          <span class="active-filter-banner-text">
            <span>✨</span>
            <span><strong>Showing 18 New Clients Onboarded This Month</strong> (New Registrations Batch)</span>
          </span>
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <button class="btn-banner-action" onclick="window.smatApp.openNewClientsModal()">📋 View Popup Summary</button>
            <button class="btn-banner-clear" onclick="window.smatApp.clearNewClientsFilter()">✕ Show All ${totalClients} Accounts</button>
          </div>
        </div>
      ` : ''}

      <!-- Streamlined Minimal Filter Bar -->
      <div class="client-filter-card client-filter-card-minimal">
        <div class="filter-minimal-row">
          <!-- 1. Search Box -->
          <div class="filter-item-block filter-item-search">
            <label class="filter-item-label">Search <span class="info-tooltip-icon" title="Search by Email, Subscription ID, Zoho ID, Name or Phone">i</span></label>
            <div class="search-input-wrapper">
              <span class="search-input-icon">🔍</span>
              <input 
                type="text" 
                id="search-input" 
                class="filter-search-box" 
                placeholder="Email / Subscription Id / Zoho customer Id / Name" 
                value="${filterState.search}"
                oninput="window.smatApp.updateSearch(this.value)"
                onkeydown="if(event.key==='Enter') window.smatApp.applyFilters()"
              />
            </div>
          </div>

          <!-- 2. Subscription Status -->
          <div class="filter-item-block filter-item-status" id="dd-block-sub-status">
            <label class="filter-item-label">Subscription Status <span class="info-tooltip-icon" title="Filter by Subscription Status">i</span></label>
            <div class="custom-dropdown-trigger" onclick="window.smatApp.toggleDropdown('dd-sub-status')">
              <span id="label-subscription-status">${filterState.subscriptionStatus === 'All' ? 'All Status' : filterState.subscriptionStatus}</span>
              <span class="dropdown-arrow-icon">▼</span>
            </div>
            <div class="custom-dropdown-menu" id="dd-sub-status">
              <div class="dropdown-select-item ${filterState.subscriptionStatus === 'All' ? 'selected' : ''}" onclick="window.smatApp.selectSingleOption('subscriptionStatus', 'All')">All Status</div>
              <div class="dropdown-select-item ${filterState.subscriptionStatus === 'Active' ? 'selected' : ''}" onclick="window.smatApp.selectSingleOption('subscriptionStatus', 'Active')">Active</div>
              <div class="dropdown-select-item ${filterState.subscriptionStatus === 'Trial' ? 'selected' : ''}" onclick="window.smatApp.selectSingleOption('subscriptionStatus', 'Trial')">Trial</div>
              <div class="dropdown-select-item ${filterState.subscriptionStatus === 'Expired' ? 'selected' : ''}" onclick="window.smatApp.selectSingleOption('subscriptionStatus', 'Expired')">Expired</div>
            </div>
          </div>

          <!-- 3. Plan Name -->
          <div class="filter-item-block filter-item-plan" id="dd-block-plan-name">
            <label class="filter-item-label">Plan Name <span class="info-tooltip-icon" title="Filter by Plan Names">i</span></label>
            <div class="custom-dropdown-trigger" onclick="window.smatApp.toggleDropdown('dd-plan-name')">
              <span>${filterState.planNames.length === ALL_PLAN_NAMES.length ? 'All selected' : filterState.planNames.length + ' selected'}</span>
              <span class="dropdown-arrow-icon">▼</span>
            </div>
            <div class="custom-dropdown-menu" id="dd-plan-name">
              <div class="dropdown-checkbox-item" onclick="window.smatApp.toggleSelectAllPlanNames()">
                <div class="custom-checkbox-box ${filterState.planNames.length === ALL_PLAN_NAMES.length ? '' : 'unchecked'}">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <strong>Select All</strong>
              </div>
              ${ALL_PLAN_NAMES.map(pn => `
                <div class="dropdown-checkbox-item" onclick="window.smatApp.toggleCheckboxOption('planNames', '${pn}')">
                  <div class="custom-checkbox-box ${filterState.planNames.includes(pn) ? '' : 'unchecked'}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span>${pn}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 4. Customer Type -->
          <div class="filter-item-block filter-item-customer" id="dd-block-customer-type">
            <label class="filter-item-label">Customer type <span class="info-tooltip-icon" title="Filter by Customer Type">i</span></label>
            <div class="custom-dropdown-trigger" onclick="window.smatApp.toggleDropdown('dd-customer-type')">
              <span>${filterState.customerTypes.length === ALL_CUSTOMER_TYPES.length ? 'All selected' : filterState.customerTypes.length + ' selected'}</span>
              <span class="dropdown-arrow-icon">▼</span>
            </div>
            <div class="custom-dropdown-menu" id="dd-customer-type">
              <div class="dropdown-checkbox-item" onclick="window.smatApp.toggleSelectAllCustomerTypes()">
                <div class="custom-checkbox-box ${filterState.customerTypes.length === ALL_CUSTOMER_TYPES.length ? '' : 'unchecked'}">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <strong>Select All</strong>
              </div>
              ${ALL_CUSTOMER_TYPES.map(ct => `
                <div class="dropdown-checkbox-item" onclick="window.smatApp.toggleCheckboxOption('customerTypes', '${ct}')">
                  <div class="custom-checkbox-box ${filterState.customerTypes.includes(ct) ? '' : 'unchecked'}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span>${ct}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 5. Action Buttons (Search + Reset) -->
          <div class="filter-actions-group">
            <button class="btn-filter-search" id="btn-search-trigger" onclick="window.smatApp.applyFilters()">Search</button>
            <button class="btn-filter-reset" id="btn-reset-filters" onclick="window.smatApp.resetFilters()" title="Reset All Filters">↺ Reset</button>
          </div>
        </div>
      </div>

      <!-- Smart Quick Segment Tabs Bar -->
      <div class="quick-segment-tabs-container">
        <div class="quick-segment-tabs-list">
          <button class="segment-tab-pill ${filterState.activeSegmentTab === 'all' ? 'active' : ''}" onclick="window.smatApp.selectSegmentTab('all')">
            🌐 All Accounts <span class="segment-tab-counter">${totalClients}</span>
          </button>
          <button class="segment-tab-pill ${filterState.activeSegmentTab === 'active' ? 'active' : ''}" onclick="window.smatApp.selectSegmentTab('active')">
            🟢 Active Paid <span class="segment-tab-counter">${activeClients}</span>
          </button>
          <button class="segment-tab-pill ${filterState.activeSegmentTab === 'trial' ? 'active' : ''}" onclick="window.smatApp.selectSegmentTab('trial')">
            ⏳ Trial Accounts <span class="segment-tab-counter">${trialClients}</span>
          </button>
          <button class="segment-tab-pill ${filterState.activeSegmentTab === 'expiring' ? 'active' : ''}" onclick="window.smatApp.selectSegmentTab('expiring')">
            ⚠️ Expiring in 7 Days <span class="segment-tab-counter" style="background:${expiringClients>0?'#FEE2E2':'#E2E8F0'}; color:${expiringClients>0?'#DC2626':'#475569'};">${expiringClients}</span>
          </button>
          <button class="segment-tab-pill ${filterState.activeSegmentTab === 'whitelabel' ? 'active' : ''}" onclick="window.smatApp.selectSegmentTab('whitelabel')">
            🏷️ White-Label <span class="segment-tab-counter">${whitelabelClients}</span>
          </button>
        </div>
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <div class="client-count-blue-badge" id="client-count-badge">${totalItems} Results</div>
        </div>
      </div>

      <!-- Client Details Data Table -->
      <div class="table-card-container">
        <table class="client-data-table">
          <thead>
            <tr>
              <th style="width: 50px;">S.no</th>
              <th>Name</th>
              <th>Phone number</th>
              <th>Alternate Phone</th>
              <th>Email</th>
              <th>Customer type</th>
              <th>Plan name</th>
              <th>Plan Type</th>
              <th>Subscription Amount</th>
              <th>End date</th>
              <th>Days Left</th>
              <th>Test account</th>
              <th style="text-align: center;">Actions</th>
            </tr>
          </thead>
          <tbody id="clients-table-body">
            ${renderClientTableRows(paginatedList)}
          </tbody>
        </table>
        ${renderPaginationControls(totalPages, clientCurrentPage, clientPageSize)}
      </div>
    `;
  }

  function renderClientTableRows(list) {
    if (list.length === 0) {
      return `<tr><td colspan="13" style="text-align:center; padding: 2.5rem; color: #94A3B8;">No client records match your filter criteria. <button onclick="window.smatApp.resetFilters()" style="color:#1877F2; background:none; border:none; cursor:pointer; font-weight:700;">Reset Filters</button></td></tr>`;
    }

    return list.map(c => `
      <tr>
        <td style="font-weight: 600; color: #64748B;">${c.s_no}</td>
        <td>
          <div class="client-name-cell">
            <div class="client-avatar-circle ${getAvatarColorClass(c.name)}">${getInitials(c.name)}</div>
            <div class="client-name-meta">
              <span class="client-primary-name" onclick="window.smatApp.openClientQuickDrawer(${c.id})" title="Click to view Quick Drawer">${escapeHtml(c.name)}</span>
              <span class="client-sub-domain">${escapeHtml(c.custom_domain || c.url || c.email || '')}</span>
            </div>
          </div>
        </td>
        <td>
          <span style="color: #334155;">${escapeHtml(c.phone_number)}</span>
          <button class="btn-copy-inline" onclick="window.smatApp.copyToClipboard('${c.phone_number}', 'phone number')" title="Copy Phone">
            <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
          </button>
        </td>
        <td style="color: #64748B;">${escapeHtml(c.alternate_phone || '-')}</td>
        <td>
          <span style="color: #334155;">${escapeHtml(c.email)}</span>
          <button class="btn-copy-inline" onclick="window.smatApp.copyToClipboard('${c.email}', 'email address')" title="Copy Email">
            <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
          </button>
        </td>
        <td>
          ${c.customer_type === 'White-Label' || c.deployment_type === 'White-Label' 
            ? `<span class="cust-type-pill whitelabel" title="Custom CNAME Domain: ${escapeHtml(c.custom_domain || 'bot.' + c.url)}">🏷️ White-Label</span>` 
            : (c.customer_type === 'On-Premise' || c.deployment_type === 'On-Premise' 
              ? `<span class="cust-type-pill onpremise" title="Server: ${escapeHtml(c.server_host || 'AWS Dedicated VPC')}">🛡️ On-Premise</span>` 
              : (c.customer_type === 'Reseller' 
                ? `<span class="cust-type-pill reseller">Reseller</span>` 
                : `<span class="cust-type-pill direct">${escapeHtml(c.customer_type || 'Direct')}</span>`))}
        </td>
        <td style="color: #334155; font-weight:600;">${escapeHtml(c.plan_name || 'Pro Trial')}</td>

        <td style="color: #334155;">${escapeHtml(c.plan_type || 'Trial_plan')}</td>
        <td style="color: #1E293B; font-weight: 600;">${escapeHtml(c.subscription_amount_display || '₹ 0.00')}</td>
        <td style="color: #334155;">${escapeHtml(c.end_date || '08-10-2026')}</td>
        <td style="color: ${typeof c.days_left === 'number' && c.days_left <= 7 ? '#DC2626; font-weight:700;' : '#334155;'}">${c.days_left !== undefined ? c.days_left : 13}</td>
        <td style="color: #334155;">${escapeHtml(c.test_account || 'No')}</td>
        <td style="text-align: center;">
          <div class="client-action-row">
            <button class="client-mini-action-btn" onclick="window.smatApp.openClientQuickDrawer(${c.id})" title="Quick Overview Drawer">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              Quick
            </button>
            <button class="client-mini-action-btn login-btn" onclick="window.smatApp.openLoginConfirmModal(${c.id})" title="1-Click Client Portal Impersonation">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Login
            </button>
            <button class="client-mini-action-btn" onclick="window.smatApp.openClientDetailsPage(${c.id})" title="Full Profile">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // =========================================================================
  // 4. CLIENT DEEP-DIVE DETAILS PROFILE VIEW
  // =========================================================================
  function openClientDetailsPage(clientId) {
    selectedClientId = clientId;
    navigateTo('client-details-profile');
  }

  function renderClientDetailsProfileView(container) {
    const client = clientsData.find(c => c.id === selectedClientId) || clientsData[0];
    
    // Top Header Action Buttons (Expire, Login Into Client, Comments, Documents)
    const headerActions = $('#header-details-actions');
    if (headerActions) {
      headerActions.innerHTML = `
        <button class="btn-header-action" onclick="window.smatApp.openExpireModal(${client.id})">Expire</button>
        <button class="btn-header-action" onclick="window.smatApp.openLoginConfirmModal(${client.id})" style="background:#1877F2; color:#FFFFFF; border-color:#1877F2;">
          🔐 Login Into Client
        </button>
        <button class="btn-header-action" onclick="window.smatApp.openCommentsModal(${client.id})">Comments</button>
        <button class="btn-header-action" onclick="window.smatApp.openDocumentsModal(${client.id})">Documents</button>
      `;
    }

    const botsLimit = client.bots_limit !== undefined ? client.bots_limit : 10;
    const botsUsed = client.bots_used !== undefined ? client.bots_used : 0;
    const botsLeft = Math.max(0, botsLimit - botsUsed);
    const botsPct = botsLimit > 0 ? ((botsUsed / botsLimit) * 100).toFixed(2) : '0.00';

    const chatsLimit = client.chats_limit !== undefined ? client.chats_limit : 5000;
    const chatsUsed = client.chats_used !== undefined ? client.chats_used : 0;
    const chatsLeft = Math.max(0, chatsLimit - chatsUsed);
    const chatsPct = chatsLimit > 0 ? ((chatsUsed / chatsLimit) * 100).toFixed(2) : '0.00';

    const serviceLimit = client.service_chats_limit !== undefined ? client.service_chats_limit : 1000;
    const serviceUsed = client.service_chats_used !== undefined ? client.service_chats_used : 0;
    const serviceLeft = Math.max(0, serviceLimit - serviceUsed);
    const servicePct = serviceLimit > 0 ? ((serviceUsed / serviceLimit) * 100).toFixed(2) : '0.00';

    const biLimit = client.bi_chats_limit !== undefined ? client.bi_chats_limit : 0;
    const biUsed = client.bi_chats_used !== undefined ? client.bi_chats_used : 0;
    const biLeft = Math.max(0, biLimit - biUsed);
    const biPct = biLimit > 0 ? ((biUsed / biLimit) * 100).toFixed(2) : '0.00';

    const clientUrl = client.url || client.company_url || (client.email.includes('@') && !client.email.endsWith('gmail.com') ? client.email.split('@')[1] : 'alignbooks.com');

    container.innerHTML = `
      <div class="details-view-container">
        <!-- Back Navigation & Title -->
        <div class="details-back-header">
          <button class="btn-back-arrow" onclick="window.smatApp.navigateTo('client-details')" title="Back to Client Details">
            ←
          </button>
          <h2 class="details-page-heading">Details: ${client.name}</h2>
        </div>

        <!-- 1. Profile Accordion (Open by Default) -->
        <div class="details-accordion-card open" id="acc-profile">
          <div class="details-accordion-header" onclick="window.smatApp.toggleAccordion('acc-profile')">
            <span>Profile</span>
            <span class="accordion-arrow-indicator">▲</span>
          </div>
          <div class="details-accordion-body">
            <div class="details-subcard-grid">
              <!-- Subcard 1: Profile Details (All 9 Options) -->
              <div class="details-subcard">
                <button class="btn-edit-pencil" onclick="window.smatApp.openEditProfileModal(${client.id})" title="Edit Profile Details">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                </button>
                <div class="details-subcard-title">Profile Details</div>
                <div class="details-kv-list">
                  <div class="details-kv-row">
                    <span class="details-kv-label">Name :</span>
                    <span class="details-kv-value">${client.name}</span>
                  </div>
                  <div class="details-kv-row">
                    <span class="details-kv-label">Email :</span>
                    <span class="details-kv-value">${client.email}</span>
                  </div>
                  <div class="details-kv-row">
                    <span class="details-kv-label">Mobile :</span>
                    <span class="details-kv-value">${client.phone_number}</span>
                  </div>
                  <div class="details-kv-row">
                    <span class="details-kv-label">Alternate Mobile :</span>
                    <span class="details-kv-value">${client.alternate_phone || '-'}</span>
                  </div>
                  <div class="details-kv-row">
                    <span class="details-kv-label">GST Number :</span>
                    <span class="details-kv-value">${client.gst_number || '-'}</span>
                  </div>
                  <div class="details-kv-row">
                    <span class="details-kv-label">Customer type :</span>
                    <span class="details-kv-value">${client.customer_type || 'Direct'}</span>
                  </div>
                  <div class="details-kv-row">
                    <span class="details-kv-label">Zoho Customer Id :</span>
                    <span class="details-kv-value">${client.zoho_customer_id || '3141005000009490054'}</span>
                  </div>
                  <div class="details-kv-row">
                    <span class="details-kv-label">url :</span>
                    <span class="details-kv-value">
                      <a href="${clientUrl.startsWith('http') ? clientUrl : 'https://' + clientUrl}" target="_blank" style="color:#1877F2; text-decoration:none; font-weight:500;">${clientUrl}</a>
                    </span>
                  </div>
                  <div class="details-kv-row">
                    <span class="details-kv-label">Test account :</span>
                    <span class="details-kv-value" style="display:flex; align-items:center; gap:0.4rem;">
                      <span>${client.test_account || 'No'}</span>
                      <button class="btn-inline-pencil" onclick="window.smatApp.toggleClientTestAccount(${client.id})" title="Toggle Test Account">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </button>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Subcard 2: Active plan details (All 6 Options with Edit Controls) -->
              <div class="details-subcard">
                <div class="details-subcard-title">Active plan details</div>
                <div class="details-kv-list">
                  <div class="details-kv-row">
                    <span class="details-kv-label">Plan Name :</span>
                    <span class="details-kv-value" style="font-weight:700; color:#1877F2;">${client.plan_name || 'Pro NY (WA)'}</span>
                  </div>
                  <div class="details-kv-row">
                    <span class="details-kv-label">Number of bots :</span>
                    <span class="details-kv-value">${botsLimit} - ( ${botsLeft} Left ) - ${botsPct}% Used</span>
                  </div>
                  <div class="details-kv-row">
                    <span class="details-kv-label">Number of chats :</span>
                    <span class="details-kv-value" style="display:flex; align-items:center; gap:0.4rem;">
                      <span>${chatsLimit} - (${chatsLeft} Left ) - ${chatsPct}% Used</span>
                      <button class="btn-inline-pencil" onclick="window.smatApp.openEditChatQuotaModal(${client.id}, 'chats')" title="Edit Chat Limit">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </button>
                    </span>
                  </div>
                  <div class="details-kv-row">
                    <span class="details-kv-label">Number of Service Chats<br/>(User Initiated) :</span>
                    <span class="details-kv-value" style="display:flex; align-items:center; gap:0.4rem;">
                      <span>${serviceLimit} - ( ${serviceLeft} Left ) - ${servicePct}% Used</span>
                      <button class="btn-inline-pencil" onclick="window.smatApp.openEditChatQuotaModal(${client.id}, 'service')" title="Edit Service Chats Limit">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </button>
                    </span>
                  </div>
                  <div class="details-kv-row">
                    <span class="details-kv-label">Number of BI Chats :</span>
                    <span class="details-kv-value" style="display:flex; align-items:center; gap:0.4rem;">
                      <span>${biLimit} - ( ${biLeft} Left ) - ${biPct}% Used</span>
                      <button class="btn-inline-pencil" onclick="window.smatApp.openEditChatQuotaModal(${client.id}, 'bi')" title="Edit BI Chats Limit">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </button>
                    </span>
                  </div>
                  <div class="details-kv-row">
                    <span class="details-kv-label">Days Left :</span>
                    <span class="details-kv-value">${client.days_left !== undefined ? client.days_left : 252}</span>
                  </div>
                </div>
              </div>

              <!-- Subcard 3: Deployment & Infrastructure Architecture -->
              <div class="details-subcard details-deployment-card ${client.deployment_type === 'White-Label' ? 'whitelabel' : 'onpremise'}" style="grid-column: 1 / -1;">
                <div class="details-subcard-title" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
                  <span>Deployment & Infrastructure Architecture</span>
                  ${client.deployment_type === 'White-Label' 
                    ? `<span class="badge-whitelabel" style="font-size:0.8rem; padding:4px 10px;">🏷️ White-Label Reseller Platform</span>` 
                    : `<span class="badge-onpremise" style="font-size:0.8rem; padding:4px 10px;">🛡️ On-Premise Enterprise VPC</span>`}
                </div>
                <div class="details-kv-list" style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem 2rem;">
                  <div class="details-kv-row" style="grid-template-columns: 180px 1fr;">
                    <span class="details-kv-label">Deployment Model :</span>
                    <span class="details-kv-value" style="font-weight:700; color:#1E293B;">
                      ${client.deployment_type === 'White-Label' ? '🏷️ Multi-Tenant White-Label Hub' : '🛡️ Single-Tenant Isolated On-Premise Node'}
                    </span>
                  </div>
                  ${client.deployment_type === 'White-Label' ? `
                    <div class="details-kv-row" style="grid-template-columns: 180px 1fr;">
                      <span class="details-kv-label">Custom CNAME Domain :</span>
                      <span class="details-kv-value">
                        <a href="https://${client.custom_domain || 'bot.' + clientUrl}" target="_blank" style="color:#7C3AED; font-weight:700; text-decoration:none;">
                          https://${client.custom_domain || 'bot.' + clientUrl} ↗
                        </a>
                      </span>
                    </div>
                    <div class="details-kv-row" style="grid-template-columns: 180px 1fr;">
                      <span class="details-kv-label">White-Label Brand :</span>
                      <span class="details-kv-value" style="font-weight:600; color:#1E293B;">${client.white_label_brand || client.name + ' AI Portal'}</span>
                    </div>
                    <div class="details-kv-row" style="grid-template-columns: 180px 1fr;">
                      <span class="details-kv-label">Managed Sub-Clients :</span>
                      <span class="details-kv-value" style="font-weight:700; color:#1877F2;">
                        ${client.sub_clients_count || 12} Active Reseller Accounts
                      </span>
                    </div>
                    <div class="details-kv-row" style="grid-template-columns: 180px 1fr;">
                      <span class="details-kv-label">SSL & Security :</span>
                      <span class="details-kv-value" style="color:#059669; font-weight:600;">
                        ${client.ssl_status || 'Active (TLS 1.3 / Auto-Renew 🔒)'}
                      </span>
                    </div>
                    <div class="details-kv-row" style="grid-template-columns: 180px 1fr;">
                      <span class="details-kv-label">Custom SMTP & DNS :</span>
                      <span class="details-kv-value" style="color:#059669; font-weight:600;">
                        Verified & Routed (DKIM / SPF OK)
                      </span>
                    </div>
                  ` : `
                    <div class="details-kv-row" style="grid-template-columns: 180px 1fr;">
                      <span class="details-kv-label">Private VPC Host :</span>
                      <span class="details-kv-value" style="font-family:monospace; color:#1E293B; font-weight:600;">
                        ${client.server_host || 'AWS Dedicated VPC (Mumbai DC) - Node 01'}
                      </span>
                    </div>
                    <div class="details-kv-row" style="grid-template-columns: 180px 1fr;">
                      <span class="details-kv-label">Cluster Heartbeat :</span>
                      <span class="details-kv-value">
                        <span class="badge-cluster-live">${client.cluster_health || '🟢 100% Operational'}</span>
                      </span>
                    </div>
                    <div class="details-kv-row" style="grid-template-columns: 180px 1fr;">
                      <span class="details-kv-label">Engine Version :</span>
                      <span class="details-kv-value" style="font-weight:600;">${client.engine_version || 'v4.2.0 Enterprise Node'}</span>
                    </div>
                    <div class="details-kv-row" style="grid-template-columns: 180px 1fr;">
                      <span class="details-kv-label">Dedicated License :</span>
                      <span class="details-kv-value" style="font-family:monospace; color:#1D4ED8; font-weight:700;">
                        <code>${client.license_key || 'LIC-ONPREM-2026-X' + String(client.id).padStart(3, '0')}</code>
                      </span>
                    </div>
                    <div class="details-kv-row" style="grid-template-columns: 180px 1fr;">
                      <span class="details-kv-label">VPC Isolation :</span>
                      <span class="details-kv-value" style="color:#059669; font-weight:600;">
                        Zero External Ingress (Private Subnet)
                      </span>
                    </div>
                  `}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Bots Accordion -->
        <div class="details-accordion-card" id="acc-bots">
          <div class="details-accordion-header" onclick="window.smatApp.toggleAccordion('acc-bots')">
            <span>Bots</span>
            <span class="accordion-arrow-indicator">▼</span>
          </div>
          <div class="details-accordion-body">
            <div class="bot-category-grid">
              <div class="bot-category-card" onclick="window.smatApp.openBotDetailsModal(${client.id})">
                🤖 Web Chatbot Details & Flow Builder
              </div>
              <div class="bot-category-card has-smat-tooltip" data-tooltip="WhatsApp Verified WABA" onclick="window.smatApp.openWhatsAppBotDetailsModal(${client.id})">
                💬 WhatsApp Bot Details & Webhook Routing
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Subscriptions Accordion (Points 1-8 Full Control Center) -->
        <div class="details-accordion-card open" id="acc-subscriptions">
          <div class="details-accordion-header" onclick="window.smatApp.toggleAccordion('acc-subscriptions')">
            <span>Subscriptions & Invoices (Billing Control Center)</span>
            <span class="accordion-arrow-indicator">▲</span>
          </div>
          <div class="details-accordion-body">
            <div class="details-subcard" style="padding:1.25rem;">
              <!-- Top Grid: Subscription Overview -->
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1.25rem; font-size:0.88rem; color:#334155; padding-bottom:1rem; border-bottom:1px solid #E2E8F0;">
                <div>
                  <span style="font-size:0.75rem; color:#64748B;">Subscription ID:</span><br/>
                  <code style="font-weight:700; color:#1877F2;">${client.subscription_id || 'SUB-PRO-2026'}</code>
                </div>
                <div>
                  <span style="font-size:0.75rem; color:#64748B;">Billing Cycle:</span><br/>
                  <strong>${client.billing_cycle || 'Monthly'}</strong>
                </div>
                <div>
                  <span style="font-size:0.75rem; color:#64748B;">Subscription Amount:</span><br/>
                  <strong style="color:#0F172A; font-size:1.05rem;">${client.subscription_amount_display || '₹ 0.00'}</strong>
                </div>
                <div>
                  <span style="font-size:0.75rem; color:#64748B;">Valid Till / Expiry Date:</span><br/>
                  <strong style="color:#2563EB;">${client.end_date || '08-10-2026'}</strong> (${client.days_left || 0} Days Left)
                </div>
                <div>
                  <span style="font-size:0.75rem; color:#64748B;">Status:</span><br/>
                  <span class="status-pill ${client.subscription_status.toLowerCase()}">${client.subscription_status}</span>
                  ${client.cancellation_status === 'pending_end_of_period' ? `<span style="font-size:0.75rem; color:#DC2626; font-weight:700; display:block; margin-top:3px;">⚠️ Scheduled to cancel on ${client.end_date}</span>` : ''}
                </div>
              </div>

              <!-- Mid Grid: Auto-Pay & Payment Method -->
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; margin:1.25rem 0; padding-bottom:1rem; border-bottom:1px solid #E2E8F0;">
                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:0.85rem 1rem;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                    <span style="font-size:0.82rem; font-weight:700; color:#1E293B;">💳 Auto-Pay Status</span>
                    <span class="autopay-status-badge ${client.autopay_enabled !== false ? 'enabled' : 'disabled'}">
                      ${client.autopay_enabled !== false ? '🟢 ON' : '⚪ OFF'}
                    </span>
                  </div>
                  <div style="font-size:0.78rem; color:#64748B; margin-bottom:0.6rem;">
                    ${client.autopay_enabled !== false ? 'Automatic renewal active on billing date.' : 'Auto-renew disabled. Plan remains fully active until expiry.'}
                  </div>
                  <button class="btn-table-action btn-action-secondary" style="font-size:0.78rem; padding:4px 10px;" onclick="window.smatApp.openAutoPayModal(${client.id})">
                    ⚙️ Manage Auto-Pay
                  </button>
                </div>

                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:0.85rem 1rem;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                    <span style="font-size:0.82rem; font-weight:700; color:#1E293B;">🏦 Saved Payment Method</span>
                    <span style="font-size:0.75rem; color:#15803D; font-weight:700;">DEFAULT</span>
                  </div>
                  <div style="font-size:0.82rem; color:#334155; margin-bottom:0.6rem;">
                    <strong>${client.payment_method?.brand || 'Visa'}</strong> •••• ${client.payment_method?.last4 || '4242'} <span style="color:#64748B;">(Exp: ${client.payment_method?.expiry || '12/28'})</span>
                  </div>
                  <button class="btn-table-action btn-action-secondary" style="font-size:0.78rem; padding:4px 10px;" onclick="window.smatApp.openUpdatePaymentMethodModal(${client.id})">
                    💳 Update Card
                  </button>
                </div>
              </div>

              <!-- Active Add-ons with Expiry Priority -->
              <div style="margin-bottom:1.25rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
                  <span style="font-weight:700; font-size:0.86rem; color:#1E293B;">📦 Active Add-ons & Boosters</span>
                  <span style="font-size:0.75rem; color:#64748B; font-weight:600;">Synchronized with active subscription expiry</span>
                </div>

                <div style="display:flex; flex-direction:column; gap:0.5rem;">
                  ${(client.active_addons && client.active_addons.length > 0) ? client.active_addons.map(addon => `
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0.85rem; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:6px; font-size:0.82rem;">
                      <div>
                        <strong>${addon.name}</strong>
                        <span style="font-size:0.75rem; color:#64748B; margin-left:6px;">(${addon.type || 'recurring'})</span>
                      </div>
                      <div style="display:flex; align-items:center; gap:0.6rem;">
                        <span class="addon-expiry-pill capped">
                          Expires: ${addon.expiryDate || client.end_date} (Synced to Plan Expiry)
                        </span>
                        <span style="color:#10B981; font-weight:700;">🟢 Active</span>
                      </div>
                    </div>
                  `).join('') : `
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0.85rem; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:6px; font-size:0.82rem;">
                      <div>
                        <strong>+10,000 Additional Conversations Quota</strong>
                        <span style="font-size:0.75rem; color:#64748B; margin-left:6px;">(Auto-pay Recurring)</span>
                      </div>
                      <div style="display:flex; align-items:center; gap:0.6rem;">
                        <span class="addon-expiry-pill capped">
                          Expires: ${client.end_date} (Synced to Plan Expiry)
                        </span>
                        <span style="color:#10B981; font-weight:700;">🟢 Active</span>
                      </div>
                    </div>
                  `}
                </div>
              </div>

              <!-- Action Buttons Row -->
              <div style="display:flex; justify-content:space-between; align-items:center; pt:0.5rem;">
                <button class="btn-table-action btn-action-danger" style="background:#FFF1F2; border-color:#FECDD3; color:#E11D48;" onclick="window.smatApp.openCancelSubscriptionModal(${client.id})">
                  🚫 Cancel Subscription
                </button>
                <div style="display:flex; gap:0.5rem;">
                  <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.openPlanModal(${client.id})">
                    🔄 Change Plan / Duration
                  </button>
                  <button class="btn-table-action btn-action-primary" onclick="window.smatApp.openPlanModal(${client.id})">
                    ⚡ Upgrade / Modify Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


        <!-- 4. AI Details Accordion -->
        <div class="details-accordion-card" id="acc-ai">
          <div class="details-accordion-header" onclick="window.smatApp.toggleAccordion('acc-ai')">
            <span>AI Details & Vector Embeddings</span>
            <span class="accordion-arrow-indicator">▼</span>
          </div>
          <div class="details-accordion-body">
            <div class="details-subcard" style="padding:1.25rem;">
              <div style="font-size:0.88rem; color:#334155; line-height:1.9;">
                <div>Vector Knowledge Base Chunks: <strong>1,420 chunks embedded</strong></div>
                <div>LLM Engine: <strong>OpenAI GPT-4o & Claude 3.5 Sonnet (Hybrid Fallback)</strong></div>
                <div>Monthly Token Consumption: <strong>28,400 / 1,000,000 (2.84% Used)</strong></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 5. Customer AI Keys Accordion -->
        <div class="details-accordion-card" id="acc-keys">
          <div class="details-accordion-header" onclick="window.smatApp.toggleAccordion('acc-keys')">
            <span>Customer AI Keys & Webhook Credentials</span>
            <span class="accordion-arrow-indicator">▼</span>
          </div>
          <div class="details-accordion-body">
            <div class="details-subcard" style="padding:1.25rem;">
              <div style="font-size:0.88rem; color:#334155; line-height:1.9;">
                <div>Client Public API Key: <code>sk-smt-live-${client.id}9028aef82319</code></div>
                <div>Webhook Secret: <code>whsec_smt_meta_cloud_${client.id}992</code></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 6. Agents Accordion -->
        <div class="details-accordion-card" id="acc-agents">
          <div class="details-accordion-header" onclick="window.smatApp.toggleAccordion('acc-agents')">
            <span>Live Chat Support Agents</span>
            <span class="accordion-arrow-indicator">▼</span>
          </div>
          <div class="details-accordion-body">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="font-size:0.88rem; color:#334155;">
                Active Live Chat Human Agents: <strong>3 Agents configured</strong>
              </div>
              <button class="btn-table-action btn-action-primary" onclick="window.smatApp.openAddUserModal()">+ Add Agent</button>
            </div>
          </div>
        </div>

        <!-- 7. Logs Accordion -->
        <div class="details-accordion-card" id="acc-logs">
          <div class="details-accordion-header" onclick="window.smatApp.toggleAccordion('acc-logs')">
            <span>Audit & System Logs</span>
            <span class="accordion-arrow-indicator">▼</span>
          </div>
          <div class="details-accordion-body">
            <div style="font-size:0.82rem; color:#64748B; font-family:monospace; line-height:1.8; background:#F8FAFC; padding:1rem; border-radius:8px;">
              [2026-09-29 10:45:12] SSO Impersonation Token issued for ${client.email}<br/>
              [2026-09-28 09:12:04] Plan Activated: ${client.plan_name}<br/>
              [2026-09-27 16:30:11] WhatsApp webhook synchronized with Meta Cloud API
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function toggleAccordion(cardId) {
    const card = $(`#${cardId}`);
    if (!card) return;
    card.classList.toggle('open');
    const indicator = card.querySelector('.accordion-arrow-indicator');
    if (indicator) {
      indicator.innerText = card.classList.contains('open') ? '▲' : '▼';
    }
  }

  // =========================================================================
  // 5. MODULE 2: BOT MIGRATION ENGINE (Wizard, Terminal, Rollback)
  // =========================================================================
  function renderChatbotsView(container) {
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
        <div>
          <h2 class="section-page-title" style="margin:0;">Bot Migration Control Engine</h2>
          <p style="font-size:0.85rem; color:#64748B; margin-top:4px;">Clone, transfer, and promote bot flows across client accounts with zero downtime.</p>
        </div>
        <button class="btn-table-action btn-action-primary" onclick="window.smatApp.openMigrateWizardModal()" style="padding:0.6rem 1.25rem; font-size:0.88rem;">
          🔀 Launch Migration Wizard
        </button>
      </div>

      <!-- Quick Action Cards -->
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:1.25rem; margin-bottom:1.5rem;">
        <div class="metric-summary-card" style="min-height:auto; padding:1.25rem;">
          <div style="font-weight:700; font-size:0.9rem; color:#1E293B;">Clone Template</div>
          <p style="font-size:0.8rem; color:#64748B; margin:6px 0 10px 0;">Duplicate existing bot flows into target accounts without altering source.</p>
          <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.openMigrateWizardModal('Clone Template')">Start Clone</button>
        </div>
        <div class="metric-summary-card" style="min-height:auto; padding:1.25rem;">
          <div style="font-weight:700; font-size:0.9rem; color:#1E293B;">Full Account Transfer</div>
          <p style="font-size:0.8rem; color:#64748B; margin:6px 0 10px 0;">Move bot ownership, NLP embeddings, and webhook configurations completely.</p>
          <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.openMigrateWizardModal('Full Transfer')">Transfer Bot</button>
        </div>
        <div class="metric-summary-card" style="min-height:auto; padding:1.25rem;">
          <div style="font-weight:700; font-size:0.9rem; color:#1E293B;">Staging → Production</div>
          <p style="font-size:0.8rem; color:#64748B; margin:6px 0 10px 0;">Promote tested flows from staging sandboxes into live customer channels.</p>
          <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.openMigrateWizardModal('Environment Promotion')">Promote Flow</button>
        </div>
      </div>

      <!-- Migration History Table -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
        <h3 style="font-size:1.05rem; font-weight:700; color:#1E293B;">Migration Audit History</h3>
        <span style="font-size:0.82rem; color:#64748B;">Total Executions: <strong>${migrationsData.length}</strong></span>
      </div>

      <div class="table-card-container">
        <table class="client-data-table">
          <thead>
            <tr>
              <th>Migration ID</th>
              <th>Bot Flow Name</th>
              <th>Source Account</th>
              <th>Target Destination</th>
              <th>Mode</th>
              <th>Status</th>
              <th>Executed By</th>
              <th>Timestamp</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${migrationsData.map(m => `
              <tr>
                <td style="font-family:monospace; font-weight:700; color:#1877F2;">${m.id}</td>
                <td style="font-weight:600; color:#1E293B;">${m.botName}</td>
                <td>${m.sourceClient}</td>
                <td style="font-weight:600;">${m.targetClient}</td>
                <td><span class="status-pill trial" style="font-size:0.75rem;">${m.mode}</span></td>
                <td><span class="status-pill active">${m.status}</span></td>
                <td>${m.executedBy}</td>
                <td style="color:#64748B;">${m.timestamp}</td>
                <td style="text-align: right;">
                  ${m.canRollback ? `
                    <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.rollbackMigration('${m.id}')" title="Revert this migration" style="color:#BE123C;">
                      ↩ Rollback
                    </button>
                  ` : `
                    <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.viewMigrationLogs('${m.id}')">
                      📄 Logs
                    </button>
                  `}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // 4-Step Migration Wizard Controller
  let wizardState = {
    step: 1,
    sourceId: 6,
    botName: 'Customer Support WhatsApp Bot v3',
    targetId: 1,
    mode: 'Clone Template',
    includeFaq: true,
    includeWebhooks: true,
    includeChannels: true
  };

  function openMigrateWizardModal(presetMode) {
    wizardState.step = 1;
    if (presetMode) wizardState.mode = presetMode;
    renderWizardStep();
  }

  function renderWizardStep() {
    const modal = $('#modal-container');
    const source = clientsData.find(c => c.id === parseInt(wizardState.sourceId)) || clientsData[0];
    const target = clientsData.find(c => c.id === parseInt(wizardState.targetId)) || clientsData[1];

    let stepHtml = '';

    if (wizardState.step === 1) {
      stepHtml = `
        <div style="margin-bottom:1.25rem;">
          <label class="filter-item-label">Source Client Account</label>
          <select id="wiz-source-client" class="custom-dropdown-trigger" style="width:100%;" onchange="window.smatApp.updateWizField('sourceId', this.value)">
            ${clientsData.map(c => `<option value="${c.id}" ${c.id === wizardState.sourceId ? 'selected' : ''}>${c.name} (${c.plan_name})</option>`).join('')}
          </select>
        </div>

        <div style="margin-bottom:1.5rem;">
          <label class="filter-item-label">Select Bot Flow to Migrate</label>
          <select id="wiz-bot-name" class="custom-dropdown-trigger" style="width:100%;" onchange="window.smatApp.updateWizField('botName', this.value)">
            <option value="Customer Support WhatsApp Bot v3">Customer Support WhatsApp Bot v3 (38 Nodes, Meta WABA)</option>
            <option value="Lead Qualification & Demo Booking">Lead Qualification & Demo Booking (24 Nodes, Web Widget)</option>
            <option value="E-Commerce Catalog & Checkout Flow">E-Commerce Catalog & Checkout Flow (42 Nodes, WhatsApp & Web)</option>
          </select>
        </div>
      `;
    } else if (wizardState.step === 2) {
      stepHtml = `
        <div style="margin-bottom:1.25rem;">
          <label class="filter-item-label">Target Destination Client</label>
          <select id="wiz-target-client" class="custom-dropdown-trigger" style="width:100%;" onchange="window.smatApp.updateWizField('targetId', this.value)">
            ${clientsData.filter(c => c.id !== parseInt(wizardState.sourceId)).map(c => `<option value="${c.id}" ${c.id === wizardState.targetId ? 'selected' : ''}>${c.name} (${c.plan_name})</option>`).join('')}
          </select>
        </div>

        <label class="filter-item-label" style="margin-bottom:0.75rem;">Migration Mode</label>
        <div class="migration-mode-card ${wizardState.mode === 'Clone Template' ? 'selected' : ''}" onclick="window.smatApp.setWizMode('Clone Template')">
          <input type="radio" name="mig_mode" ${wizardState.mode === 'Clone Template' ? 'checked' : ''} />
          <div>
            <div style="font-weight:700; font-size:0.88rem; color:#1E293B;">Clone Template (Recommended)</div>
            <div style="font-size:0.78rem; color:#64748B;">Creates an independent duplicate in target account without modifying source.</div>
          </div>
        </div>

        <div class="migration-mode-card ${wizardState.mode === 'Full Transfer' ? 'selected' : ''}" onclick="window.smatApp.setWizMode('Full Transfer')">
          <input type="radio" name="mig_mode" ${wizardState.mode === 'Full Transfer' ? 'checked' : ''} />
          <div>
            <div style="font-weight:700; font-size:0.88rem; color:#1E293B;">Full Ownership Transfer</div>
            <div style="font-size:0.78rem; color:#64748B;">Moves the bot completely from source to target account.</div>
          </div>
        </div>

        <div class="migration-mode-card ${wizardState.mode === 'Environment Promotion' ? 'selected' : ''}" onclick="window.smatApp.setWizMode('Environment Promotion')">
          <input type="radio" name="mig_mode" ${wizardState.mode === 'Environment Promotion' ? 'checked' : ''} />
          <div>
            <div style="font-weight:700; font-size:0.88rem; color:#1E293B;">Environment Promotion (Staging → Production)</div>
            <div style="font-size:0.78rem; color:#64748B;">Promote validated test bot flows into production channels.</div>
          </div>
        </div>
      `;
    } else if (wizardState.step === 3) {
      stepHtml = `
        <div style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:8px; padding:1rem; margin-bottom:1.25rem;">
          <div style="font-weight:700; color:#1D4ED8; font-size:0.88rem; margin-bottom:4px;">✓ Pre-Flight Checks Passed</div>
          <div style="font-size:0.8rem; color:#3B82F6;">Target account has available bot quota (${target.bots_limit - target.bots_used} slots available). No webhook conflicts detected.</div>
        </div>

        <label class="filter-item-label" style="margin-bottom:0.75rem;">Asset Inclusions</label>
        <div style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1.5rem;">
          <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; color:#334155; cursor:pointer;">
            <input type="checkbox" checked /> Include NLP FAQ Vector Embeddings (142 Intents)
          </label>
          <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; color:#334155; cursor:pointer;">
            <input type="checkbox" checked /> Remap Webhook Triggers & Zapier Actions
          </label>
          <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; color:#334155; cursor:pointer;">
            <input type="checkbox" checked /> Apply Target Account WhatsApp Phone Bindings
          </label>
        </div>
      `;
    } else if (wizardState.step === 4) {
      stepHtml = `
        <div style="text-align:center; margin-bottom:1.25rem;">
          <div style="font-size:1.15rem; font-weight:800; color:#1E293B; margin-bottom:4px;">Migrating Bot Flow...</div>
          <div style="font-size:0.82rem; color:#64748B;">Transferring flow nodes from <strong>${source.name}</strong> to <strong>${target.name}</strong></div>
        </div>

        <div style="margin-bottom:1rem;">
          <div class="metric-progress-track" style="height:8px;">
            <div id="wiz-progress-bar" class="metric-progress-fill blue" style="width: 35%;"></div>
          </div>
        </div>

        <div class="migration-terminal-box" id="wiz-terminal">
          <div class="terminal-line"><span class="term-time">[00:00.1]</span> Initializing migration engine...</div>
          <div class="terminal-line"><span class="term-time">[00:00.4]</span> Validating bot flow schema v4.2.1 <span class="term-ok">[OK]</span></div>
          <div class="terminal-line"><span class="term-time">[00:01.2]</span> Cloning 38 conversation tree nodes & triggers <span class="term-ok">[OK]</span></div>
          <div class="terminal-line"><span class="term-time">[00:02.1]</span> Remapping NLP vector embeddings <span class="term-ok">[OK]</span></div>
          <div class="terminal-line"><span class="term-time">[00:03.4]</span> Provisioning WhatsApp WABA routes <span class="term-ok">[OK]</span></div>
          <div class="terminal-line"><span class="term-time">[00:04.1]</span> <span class="term-ok">Migration completed successfully!</span></div>
        </div>
      `;
    }

    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="modal-box-card" style="border-top: 4px solid #1877F2; max-width:580px;">
          <!-- Header -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <div style="font-size:1.15rem; font-weight:800; color:#1E293B;">🔀 Bot Migration Wizard</div>
            <button onclick="window.smatApp.closeModal()" style="background:none; border:none; font-size:1.2rem; cursor:pointer;">✕</button>
          </div>

          <!-- Wizard Stepper Indicator -->
          <div class="wizard-steps-container">
            <div class="wizard-step-node ${wizardState.step >= 1 ? 'active' : ''} ${wizardState.step > 1 ? 'completed' : ''}">
              <div class="wizard-step-circle">${wizardState.step > 1 ? '✓' : '1'}</div>
              <span class="wizard-step-title">Source</span>
            </div>
            <div class="wizard-step-line ${wizardState.step >= 2 ? 'active' : ''}"></div>
            <div class="wizard-step-node ${wizardState.step >= 2 ? 'active' : ''} ${wizardState.step > 2 ? 'completed' : ''}">
              <div class="wizard-step-circle">${wizardState.step > 2 ? '✓' : '2'}</div>
              <span class="wizard-step-title">Target & Mode</span>
            </div>
            <div class="wizard-step-line ${wizardState.step >= 3 ? 'active' : ''}"></div>
            <div class="wizard-step-node ${wizardState.step >= 3 ? 'active' : ''} ${wizardState.step > 3 ? 'completed' : ''}">
              <div class="wizard-step-circle">${wizardState.step > 3 ? '✓' : '3'}</div>
              <span class="wizard-step-title">Pre-Flight</span>
            </div>
            <div class="wizard-step-line ${wizardState.step >= 4 ? 'active' : ''}"></div>
            <div class="wizard-step-node ${wizardState.step >= 4 ? 'active' : ''}">
              <div class="wizard-step-circle">4</div>
              <span class="wizard-step-title">Execute</span>
            </div>
          </div>

          <!-- Step Content -->
          ${stepHtml}

          <!-- Footer Buttons -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1.5rem;">
            ${wizardState.step > 1 && wizardState.step < 4 ? `
              <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.prevWizStep()">← Back</button>
            ` : `<div></div>`}

            <div style="display:flex; gap:0.5rem;">
              <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.closeModal()">Cancel</button>
              ${wizardState.step < 3 ? `
                <button class="btn-table-action btn-action-primary" onclick="window.smatApp.nextWizStep()">Next Step →</button>
              ` : wizardState.step === 3 ? `
                <button class="btn-table-action btn-action-primary" onclick="window.smatApp.startMigrationExecution()">⚡ Start Migration Now</button>
              ` : `
                <button class="btn-table-action btn-action-primary" onclick="window.smatApp.finishMigration()">Done</button>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function updateWizField(key, val) {
    wizardState[key] = val;
  }

  function setWizMode(mode) {
    wizardState.mode = mode;
    renderWizardStep();
  }

  function nextWizStep() {
    wizardState.step++;
    renderWizardStep();
  }

  function prevWizStep() {
    wizardState.step--;
    renderWizardStep();
  }

  function startMigrationExecution() {
    wizardState.step = 4;
    renderWizardStep();

    setTimeout(() => {
      const p = $('#wiz-progress-bar');
      if (p) p.style.width = '100%';
    }, 400);

    const source = clientsData.find(c => c.id === parseInt(wizardState.sourceId)) || clientsData[0];
    const target = clientsData.find(c => c.id === parseInt(wizardState.targetId)) || clientsData[1];

    const newMig = {
      id: `MIG-${Math.floor(1000 + Math.random() * 9000)}`,
      botName: wizardState.botName,
      sourceClient: source.name,
      sourceClientId: source.id,
      targetClient: target.name,
      targetClientId: target.id,
      mode: wizardState.mode,
      status: 'Completed',
      flowNodes: 24,
      intents: 110,
      executedBy: currentUser.name,
      timestamp: 'Just now',
      duration: '4.1s',
      canRollback: true,
      logs: [
        '[00:00.1] Validated bot schema [OK]',
        '[00:01.2] Cloned 24 flow nodes [OK]',
        '[00:02.3] Remapped AI embeddings [OK]',
        '[00:04.1] Migration completed.'
      ]
    };

    migrationsData.unshift(newMig);
    target.bots_used = (target.bots_used || 0) + 1;
  }

  function finishMigration() {
    closeModal();
    showToast('Bot migration completed successfully!');
    if (currentRoute === 'chatbots') {
      renderChatbotsView($('#route-viewport'));
    }
  }

  function rollbackMigration(migId) {
    const mig = migrationsData.find(m => m.id === migId);
    if (mig) {
      mig.status = 'Rolled Back';
      mig.canRollback = false;
      showToast(`Migration ${migId} rolled back successfully.`);
      renderChatbotsView($('#route-viewport'));
    }
  }

  function viewMigrationLogs(migId) {
    const mig = migrationsData.find(m => m.id === migId);
    if (!mig) return;
    const modal = $('#modal-container');
    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="modal-box-card" style="border-top: 4px solid #1877F2;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <div style="font-size:1.15rem; font-weight:800; color:#1E293B;">📄 Migration Execution Log: ${mig.id}</div>
            <button onclick="window.smatApp.closeModal()" style="background:none; border:none; font-size:1.2rem; cursor:pointer;">✕</button>
          </div>
          <div class="migration-terminal-box">
            ${mig.logs.map(l => `<div class="terminal-line">${l}</div>`).join('')}
          </div>
          <div style="display:flex; justify-content:flex-end; margin-top:1.25rem;">
            <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.closeModal()">Close</button>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 6. MODULE 3: ADD USERS & TEAM ACCESS CONTROL
  // =========================================================================
  function renderUsersView(container) {
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
        <div>
          <h2 class="section-page-title" style="margin:0;">User & Access Control</h2>
          <p style="font-size:0.85rem; color:#64748B; margin-top:4px;">Manage team members, admin roles, and granular platform permissions.</p>
        </div>
        <button class="btn-table-action btn-action-primary" onclick="window.smatApp.openAddUserModal()" style="padding:0.6rem 1.25rem; font-size:0.88rem;">
          👤 + Add Team User
        </button>
      </div>

      <!-- Overview Metric Cards -->
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:1.25rem; margin-bottom:1.5rem;">
        <div class="metric-summary-card" style="min-height:auto; padding:1.25rem;">
          <div style="font-size:0.75rem; font-weight:700; color:#64748B; text-transform:uppercase;">TOTAL TEAM USERS</div>
          <div style="font-size:1.5rem; font-weight:800; color:#1E293B; margin-top:4px;">${usersData.length}</div>
        </div>
        <div class="metric-summary-card" style="min-height:auto; padding:1.25rem;">
          <div style="font-size:0.75rem; font-weight:700; color:#64748B; text-transform:uppercase;">SUPER ADMINS</div>
          <div style="font-size:1.5rem; font-weight:800; color:#7C3AED; margin-top:4px;">${usersData.filter(u=>u.role==='Super Admin').length}</div>
        </div>
        <div class="metric-summary-card" style="min-height:auto; padding:1.25rem;">
          <div style="font-size:0.75rem; font-weight:700; color:#64748B; text-transform:uppercase;">BOT ENGINEERS</div>
          <div style="font-size:1.5rem; font-weight:800; color:#1D4ED8; margin-top:4px;">${usersData.filter(u=>u.role==='Bot Engineer').length}</div>
        </div>
        <div class="metric-summary-card" style="min-height:auto; padding:1.25rem;">
          <div style="font-size:0.75rem; font-weight:700; color:#64748B; text-transform:uppercase;">SUPPORT LEADS</div>
          <div style="font-size:1.5rem; font-weight:800; color:#15803D; margin-top:4px;">${usersData.filter(u=>u.role==='Support Lead').length}</div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="table-card-container">
        <table class="client-data-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email Address</th>
              <th>Department</th>
              <th>Assigned Role</th>
              <th>2FA Status</th>
              <th>Last Active</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${usersData.map(u => `
              <tr>
                <td>
                  <div style="display:flex; align-items:center; gap:0.65rem;">
                    <div class="profile-avatar-circle" style="width:30px; height:30px; font-size:0.75rem;">${u.avatar}</div>
                    <span style="font-weight:700; color:#1E293B;">${u.name}</span>
                  </div>
                </td>
                <td style="color:#334155;">${u.email}</td>
                <td style="color:#64748B;">${u.department}</td>
                <td>
                  <span class="role-badge ${u.role === 'Super Admin' ? 'super-admin' : u.role === 'Bot Engineer' ? 'engineer' : u.role === 'Support Lead' ? 'support' : 'billing'}">
                    ● ${u.role}
                  </span>
                </td>
                <td>
                  <span class="status-pill ${u.twoFactorEnabled ? 'active' : 'trial'}">
                    ${u.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
                <td style="color:#64748B;">${u.lastActive}</td>
                <td style="text-align: right;">
                  <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.openEditUserModal(${u.id})">✎ Permissions</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function openAddUserModal() {
    const modal = $('#modal-container');
    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="modal-box-card" style="border-top: 4px solid #1877F2; max-width:600px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <div style="font-size:1.15rem; font-weight:800; color:#1E293B;">👤 Add New Team User</div>
            <button onclick="window.smatApp.closeModal()" style="background:none; border:none; font-size:1.2rem; cursor:pointer;">✕</button>
          </div>

          <form id="add-user-form">
            <div style="margin-bottom:1rem;">
              <label class="filter-item-label">Full Name *</label>
              <input type="text" id="new-user-name" class="filter-search-box" placeholder="e.g. Ramesh Varma" required />
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
              <div>
                <label class="filter-item-label">Email Address *</label>
                <input type="email" id="new-user-email" class="filter-search-box" placeholder="ramesh@smatbot.com" required />
              </div>
              <div>
                <label class="filter-item-label">Department</label>
                <input type="text" id="new-user-dept" class="filter-search-box" placeholder="e.g. Support & Operations" />
              </div>
            </div>

            <div style="margin-bottom:1.25rem;">
              <label class="filter-item-label">Assign Role *</label>
              <select id="new-user-role" class="custom-dropdown-trigger" style="width:100%;">
                <option value="Super Admin">Super Admin (Full Platform Access)</option>
                <option value="Bot Engineer">Bot Engineer (Bot Migration & Flows)</option>
                <option value="Support Lead">Support Lead (Clients & Live Chats)</option>
                <option value="Billing Manager">Billing Manager (Plans & Invoices)</option>
              </select>
            </div>

            <!-- Permissions Matrix -->
            <label class="filter-item-label" style="margin-bottom:0.5rem;">Granular Permissions Matrix</label>
            <div class="permissions-matrix-grid">
              <div class="permission-toggle-card">
                <span>Manage Clients & Impersonation</span>
                <label class="switch-box"><input type="checkbox" checked /><span class="switch-slider"></span></label>
              </div>
              <div class="permission-toggle-card">
                <span>Execute Bot Migrations</span>
                <label class="switch-box"><input type="checkbox" checked /><span class="switch-slider"></span></label>
              </div>
              <div class="permission-toggle-card">
                <span>Activate Plans & Billing</span>
                <label class="switch-box"><input type="checkbox" checked /><span class="switch-slider"></span></label>
              </div>
              <div class="permission-toggle-card">
                <span>Manage Team Users</span>
                <label class="switch-box"><input type="checkbox" checked /><span class="switch-slider"></span></label>
              </div>
              <div class="permission-toggle-card">
                <span>API & Webhook Admin</span>
                <label class="switch-box"><input type="checkbox" checked /><span class="switch-slider"></span></label>
              </div>
              <div class="permission-toggle-card">
                <span>View Analytics Reports</span>
                <label class="switch-box"><input type="checkbox" checked /><span class="switch-slider"></span></label>
              </div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
              <button type="button" class="btn-table-action btn-action-secondary" onclick="window.smatApp.closeModal()">Cancel</button>
              <button type="submit" class="btn-table-action btn-action-primary">Create Team User</button>
            </div>
          </form>
        </div>
      </div>
    `;

    $('#add-user-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#new-user-name').value.trim();
      const email = $('#new-user-email').value.trim();
      const dept = $('#new-user-dept').value.trim() || 'Operations';
      const role = $('#new-user-role').value;

      const newUser = {
        id: usersData.length + 1,
        name,
        email,
        department: dept,
        role,
        avatar: name.split(' ').map(n=>n[0]).join('').substring(0,2),
        status: 'Active',
        twoFactorEnabled: false,
        lastActive: 'Just now',
        permissions: { manageClients: true, migrateBots: true, activatePlans: true }
      };

      usersData.unshift(newUser);
      showToast(`User ${name} created successfully!`);
      closeModal();
      if (currentRoute === 'users') renderUsersView($('#route-viewport'));
    });
  }

  function openEditUserModal(userId) {
    const user = usersData.find(u => u.id === userId) || usersData[0];
    const modal = $('#modal-container');
    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="modal-box-card" style="border-top: 4px solid #1877F2;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <div style="font-size:1.15rem; font-weight:800; color:#1E293B;">✎ Edit User Permissions: ${user.name}</div>
            <button onclick="window.smatApp.closeModal()" style="background:none; border:none; font-size:1.2rem; cursor:pointer;">✕</button>
          </div>
          <form id="edit-user-form">
            <div style="margin-bottom:1rem;">
              <label class="filter-item-label">Assigned Role</label>
              <select id="edit-user-role" class="custom-dropdown-trigger" style="width:100%;">
                <option value="Super Admin" ${user.role==='Super Admin'?'selected':''}>Super Admin</option>
                <option value="Bot Engineer" ${user.role==='Bot Engineer'?'selected':''}>Bot Engineer</option>
                <option value="Support Lead" ${user.role==='Support Lead'?'selected':''}>Support Lead</option>
                <option value="Billing Manager" ${user.role==='Billing Manager'?'selected':''}>Billing Manager</option>
              </select>
            </div>
            <div class="permissions-matrix-grid">
              <div class="permission-toggle-card">
                <span>Manage Clients</span>
                <label class="switch-box"><input type="checkbox" checked /><span class="switch-slider"></span></label>
              </div>
              <div class="permission-toggle-card">
                <span>Execute Bot Migrations</span>
                <label class="switch-box"><input type="checkbox" ${user.role==='Super Admin'||user.role==='Bot Engineer'?'checked':''} /><span class="switch-slider"></span></label>
              </div>
              <div class="permission-toggle-card">
                <span>Activate Plans</span>
                <label class="switch-box"><input type="checkbox" ${user.role==='Super Admin'||user.role==='Billing Manager'?'checked':''} /><span class="switch-slider"></span></label>
              </div>
              <div class="permission-toggle-card">
                <span>Manage Users</span>
                <label class="switch-box"><input type="checkbox" ${user.role==='Super Admin'?'checked':''} /><span class="switch-slider"></span></label>
              </div>
            </div>
            <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
              <button type="button" class="btn-table-action btn-action-secondary" onclick="window.smatApp.closeModal()">Cancel</button>
              <button type="submit" class="btn-table-action btn-action-primary">Save Permissions</button>
            </div>
          </form>
        </div>
      </div>
    `;

    $('#edit-user-form').addEventListener('submit', (e) => {
      e.preventDefault();
      user.role = $('#edit-user-role').value;
      showToast('User permissions updated successfully!');
      closeModal();
      if (currentRoute === 'users') renderUsersView($('#route-viewport'));
    });
  }

  // =========================================================================
  // 7. MODULE 4: PLAN ACTIVATION & BILLING TIERS
  // =========================================================================
  function renderPlansView(container) {
    const isYearly = billingToggleYearly;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h2 class="section-page-title" style="margin:0;">SmatBot — Pricing & Plans (Official Structure)</h2>
          <p style="font-size:0.85rem; color:#64748B; margin-top:4px;">Broadcast · Standard · Pro · AI — Enterprise SaaS Tier Management & Feature Matrix</p>
        </div>
        <button class="btn-table-action btn-action-primary" onclick="window.smatApp.openPlanModal()" style="padding:0.6rem 1.25rem; font-size:0.88rem;">
          ⚡ Activate Client Plan
        </button>
      </div>

      <!-- Billing Period Switch -->
      <div class="pricing-billing-switch-wrap">
        <div class="pricing-billing-switch" role="group" aria-label="Billing period">
          <button type="button" class="${!isYearly ? 'active' : ''}" onclick="window.smatApp.toggleBillingFrequency(false)">Monthly</button>
          <button type="button" class="${isYearly ? 'active' : ''}" onclick="window.smatApp.toggleBillingFrequency(true)">
            Yearly <span class="hint">Save up to 19% 🎉</span>
          </button>
        </div>
      </div>

      <!-- 4 Plan Summary Cards -->
      <div class="official-plan-cards">

        <!-- Broadcast -->
        <div class="official-plan-card">
          <div>
            <div class="official-plan-name">Broadcast</div>
            <div class="official-plan-price">
              ${!isYearly 
                ? '<sub>₹</sub>1,499 <span class="per">/ mo</span>' 
                : '<sub>₹</sub>14,500 <span class="per">/ yr</span>'}
            </div>
            <div class="official-plan-sub">
              ${!isYearly 
                ? '₹17,988 over 12 months' 
                : '≈ ₹1,208 / mo, billed yearly'}
            </div>
            <div class="official-plan-save">
              ${!isYearly 
                ? '<span class="nudge-text">Save 19% with yearly</span>' 
                : '<span class="save-badge">Save ₹3,488 (19%)</span>'}
            </div>
            <div class="official-plan-gst">+ GST</div>
            <div class="official-plan-desc">
              WhatsApp template/broadcast messages with Google Sheets integration. No bot — replies are handled by an agent from the dashboard.
            </div>
          </div>
          <button class="btn-table-action btn-action-secondary" style="width:100%; justify-content:center;" onclick="window.smatApp.openPlanModal(null, 'Broadcast')">
            Select Broadcast
          </button>
        </div>

        <!-- Standard -->
        <div class="official-plan-card">
          <div>
            <div class="official-plan-name">Standard</div>
            <div class="official-plan-price">
              ${!isYearly 
                ? '<sub>₹</sub>3,500 <span class="per">/ mo</span>' 
                : '<sub>₹</sub>35,000 <span class="per">/ yr</span>'}
            </div>
            <div class="official-plan-sub">
              ${!isYearly 
                ? '₹42,000 over 12 months' 
                : '≈ ₹2,917 / mo, billed yearly'}
            </div>
            <div class="official-plan-save">
              ${!isYearly 
                ? '<span class="nudge-text">Save 17% with yearly</span>' 
                : '<span class="save-badge">Save ₹7,000 (17%)</span>'}
            </div>
            <div class="official-plan-gst">+ GST</div>
            <div class="official-plan-desc">
              Flow/menu-driven chatbot with Google Sheets integration. Platforms: WhatsApp, Website, Instagram + Landing Page Chatbot. All add-ons available.
            </div>
          </div>
          <button class="btn-table-action btn-action-secondary" style="width:100%; justify-content:center;" onclick="window.smatApp.openPlanModal(null, 'Standard')">
            Select Standard
          </button>
        </div>

        <!-- Pro (Highlight / Most Popular) -->
        <div class="official-plan-card highlight">
          <span class="official-plan-badge-popular">Most Popular</span>
          <div>
            <div class="official-plan-name" style="color:#2563EB;">Pro</div>
            <div class="official-plan-price">
              ${!isYearly 
                ? '<sub>₹</sub>6,500 <span class="per">/ mo</span>' 
                : '<sub>₹</sub>72,000 <span class="per">/ yr</span>'}
            </div>
            <div class="official-plan-sub">
              ${!isYearly 
                ? '₹78,000 over 12 months' 
                : '≈ ₹6,000 / mo, billed yearly'}
            </div>
            <div class="official-plan-save">
              ${!isYearly 
                ? '<span class="nudge-text">Save 8% with yearly</span>' 
                : '<span class="save-badge">Save ₹6,000 (8%)</span>'}
            </div>
            <div class="official-plan-gst">+ GST</div>
            <div class="official-plan-desc">
              Flow-based bot with the full feature set. 6 platforms: WhatsApp, Website, Facebook Messenger, Instagram Messenger, Applications & Landing Page Chatbot. 3 Live Agents included.
            </div>
          </div>
          <button class="btn-table-action btn-action-primary" style="width:100%; justify-content:center; background:#2563EB; border-color:#2563EB;" onclick="window.smatApp.openPlanModal(null, 'Pro')">
            Activate Pro
          </button>
        </div>

        <!-- AI -->
        <div class="official-plan-card">
          <div>
            <div class="official-plan-name" style="color:#7C3AED;">AI</div>
            <div class="official-plan-price">
              ${!isYearly 
                ? '<sub>₹</sub>8,999 <span class="per">/ mo</span>' 
                : '<sub>₹</sub>96,000 <span class="per">/ yr</span>'}
            </div>
            <div class="official-plan-sub">
              ${!isYearly 
                ? '₹107,988 over 12 months' 
                : '≈ ₹8,000 / mo, billed yearly'}
            </div>
            <div class="official-plan-save">
              ${!isYearly 
                ? '<span class="nudge-text">Save 11% with yearly</span>' 
                : '<span class="save-badge">Save ₹11,988 (11%)</span>'}
            </div>
            <div class="official-plan-gst">+ GST</div>
            <div class="official-plan-desc">
              Everything in Pro, plus native AI integration suite. 500,000 Monthly Service Messages (6M Upfront on Yearly), 10,000 BI Messages (120K Upfront), 3 Live Agents.
            </div>
          </div>
          <button class="btn-table-action btn-action-secondary" style="width:100%; justify-content:center;" onclick="window.smatApp.openPlanModal(null, 'AI')">
            Select AI Tier
          </button>
        </div>

      </div>

      <!-- Feature Comparison Table -->
      <div class="pricing-section-header">
        <h2>Feature Comparison</h2>
        <div class="line"></div>
      </div>

      <div class="pricing-table-wrap">
        <table class="pricing-matrix-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Broadcast</th>
              <th>Standard</th>
              <th>Pro</th>
              <th>AI</th>
            </tr>
          </thead>
          <tbody>

            <tr class="group-row"><td colspan="5">Overview</td></tr>
            <tr><td>Bot Type</td><td class="note-inline">Broadcast only (no bot)</td><td class="note-inline">Flow / menu-driven</td><td class="note-inline">Flow-based (full feature set)</td><td class="note-inline">Flow-based + AI integration</td></tr>
            <tr><td>Chatbots Included</td><td class="val">2</td><td class="val">5</td><td class="val">10</td><td class="val">10</td></tr>
            <tr><td>Price</td>
              <td class="val">${!isYearly ? '₹1,499 / mo' : '₹14,500 / yr'}</td>
              <td class="val">${!isYearly ? '₹3,500 / mo' : '₹35,000 / yr'}</td>
              <td class="val">${!isYearly ? '₹6,500 / mo' : '₹72,000 / yr'}</td>
              <td class="val">${!isYearly ? '₹8,999 / mo' : '₹96,000 / yr'}</td>
            </tr>
            <tr><td>Cost for 12 Months</td>
              <td>${!isYearly ? '₹17,988' : '₹14,500'}</td>
              <td>${!isYearly ? '₹42,000' : '₹35,000'}</td>
              <td>${!isYearly ? '₹78,000' : '₹72,000'}</td>
              <td>${!isYearly ? '₹107,988' : '₹96,000'}</td>
            </tr>
            <tr><td>Yearly Plan Saves</td>
              <td><span class="save-badge">₹3,488 (19%)</span></td>
              <td><span class="save-badge">₹7,000 (17%)</span></td>
              <td><span class="save-badge">₹6,000 (8%)</span></td>
              <td><span class="save-badge">₹11,988 (11%)</span></td>
            </tr>

            <tr class="group-row"><td colspan="5">Platforms</td></tr>
            <tr><td>WhatsApp</td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>Website</td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>Facebook Messenger</td><td><span class="cross">—</span></td><td><span class="cross">—</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>Instagram Messenger</td><td><span class="cross">—</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>Applications (in-app)</td><td><span class="cross">—</span></td><td><span class="cross">—</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>Landing Page Chatbot</td><td><span class="cross">—</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>

            <tr class="group-row"><td colspan="5">Message &amp; Chat Limits</td></tr>
            <tr><td>Website Messages</td><td><span class="cross">—</span></td><td class="val">Unlimited</td><td class="val">Unlimited</td><td class="val">Unlimited</td></tr>
            <tr><td>Instagram Messages</td><td><span class="cross">—</span></td><td class="val">Unlimited</td><td class="val">Unlimited</td><td class="val">Unlimited</td></tr>
            <tr><td>WhatsApp Service (UI) Messages<br><span class="note-inline">+ Meta charges applicable</span></td>
              <td>${!isYearly ? '<span class="val">1,000 / mo</span><br><span class="note-inline">credited each month</span>' : '<span class="val">12,000 / yr</span><br><span class="note-inline">credited upfront</span>'}</td>
              <td>${!isYearly ? '<span class="val">30,000 / mo</span><br><span class="note-inline">credited each month</span>' : '<span class="val">360,000 / yr</span><br><span class="note-inline">credited upfront</span>'}</td>
              <td>${!isYearly ? '<span class="val">100,000 / mo</span><br><span class="note-inline">credited each month</span>' : '<span class="val">1,200,000 / yr</span><br><span class="note-inline">credited upfront</span>'}</td>
              <td>${!isYearly ? '<span class="val">500,000 / mo</span><br><span class="note-inline">credited each month</span>' : '<span class="val">6,000,000 / yr</span><br><span class="note-inline">credited upfront</span>'}</td>
            </tr>
            <tr><td>WhatsApp BI Messages<br><span class="note-inline">+ Meta charges applicable</span></td>
              <td>${!isYearly ? '<span class="val">1,000 / mo</span><br><span class="note-inline">credited each month</span>' : '<span class="val">12,000 / yr</span><br><span class="note-inline">credited upfront</span>'}</td>
              <td>${!isYearly ? '<span class="val">2,000 / mo</span><br><span class="note-inline">credited each month</span>' : '<span class="val">24,000 / yr</span><br><span class="note-inline">credited upfront</span>'}</td>
              <td>${!isYearly ? '<span class="val">5,000 / mo</span><br><span class="note-inline">credited each month</span>' : '<span class="val">60,000 / yr</span><br><span class="note-inline">credited upfront</span>'}</td>
              <td>${!isYearly ? '<span class="val">10,000 / mo</span><br><span class="note-inline">credited each month</span>' : '<span class="val">120,000 / yr</span><br><span class="note-inline">credited upfront</span>'}</td>
            </tr>

            <tr class="group-row"><td colspan="5">WhatsApp Behaviour</td></tr>
            <tr><td>Send Template / Broadcast Messages</td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>Two-Way Bot Conversation on WhatsApp</td><td><span class="cross">—</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>Template Text Replies<br><span class="note-inline">Same add-on as Button Click Responses</span></td><td><span class="pricing-badge-addon">Add-on</span></td><td><span class="pricing-badge-addon">Add-on</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>Template Button Click Responses<br><span class="note-inline">Same add-on as Template Text Replies</span></td><td><span class="pricing-badge-addon">Add-on</span></td><td><span class="pricing-badge-addon">Add-on</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>WhatsApp Cart &amp; Catalog</td><td><span class="pricing-badge-addon">Add-on</span></td><td><span class="pricing-badge-addon">Add-on</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>

            <tr class="group-row"><td colspan="5">Bot &amp; Automation</td></tr>
            <tr><td>Google Sheets Integration</td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>Custom Google Sheet</td><td><span class="cross">—</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>Custom Webhook Integration</td><td><span class="cross">—</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>Dynamic Responses</td><td><span class="cross">—</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>Canned Responses</td><td><span class="cross">—</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>Live Agents<br><span class="note-inline">3 included in Pro &amp; AI</span></td><td><span class="pricing-badge-addon">Add-on</span></td><td><span class="pricing-badge-addon">Add-on</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>Media Upload</td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>Contacts</td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>CRM</td><td><span class="pricing-badge-addon">Add-on</span></td><td><span class="pricing-badge-addon">Add-on</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>AI Agent (Dialogflow)</td><td><span class="pricing-badge-addon">Add-on</span></td><td><span class="pricing-badge-addon">Add-on</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>AI Integration</td><td><span class="pricing-badge-addon">Add-on</span></td><td><span class="pricing-badge-addon">Add-on</span></td><td><span class="pricing-badge-addon">Add-on</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>Voice Enabled (Speech to Text)</td><td><span class="cross">—</span></td><td><span class="cross">—</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>Multi-Lingual (up to 2 languages)</td><td><span class="pricing-badge-addon">Add-on</span></td><td><span class="pricing-badge-addon">Add-on</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>Auto Email Follow-up</td><td><span class="cross">—</span></td><td><span class="cross">—</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>AdWords Tracking</td><td><span class="cross">—</span></td><td><span class="cross">—</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>Facebook Pixel</td><td><span class="cross">—</span></td><td><span class="cross">—</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>

            <tr class="group-row"><td colspan="5">Security &amp; Notifications</td></tr>
            <tr><td>Lead Email Notifications</td><td><span class="cross">—</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>Hot Lead Notifications</td><td><span class="cross">—</span></td><td><span class="cross">—</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>Email OTP Validation</td><td><span class="cross">—</span></td><td><span class="pricing-badge-addon">Add-on</span></td><td><span class="pricing-badge-addon">Add-on</span></td><td><span class="pricing-badge-addon">Add-on</span></td></tr>
            <tr><td>Two-Factor Authentication (2FA)</td><td><span class="cross">—</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>

            <tr class="group-row"><td colspan="5">Analytics &amp; Reports</td></tr>
            <tr><td>Analytics</td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>

            <tr class="group-row"><td colspan="5">Add-ons &amp; Customization</td></tr>
            <tr><td>Add-ons Available</td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td><td><span class="tick">✓</span></td></tr>
            <tr><td>Custom Development / Customization</td><td colspan="4"><span class="pricing-badge-addon">Quoted &amp; charged separately — all plans</span></td></tr>

          </tbody>
        </table>
      </div>

      <!-- Notices -->
      <div class="pricing-notice-box blue">
        <span style="font-size:1.2rem;">ℹ️</span>
        <div><b>How limits are credited:</b> monthly plans get the monthly allowance every month. Yearly plans get all 12 months' allowance credited once, <strong>upfront</strong> — e.g. Broadcast yearly gets 1,000 × 12 = 12,000 service messages and 1,000 × 12 = 12,000 BI messages. Standard gets 360,000 service chats upfront. Pro gets 1,200,000 service chats upfront. AI gets 6,000,000 service chats upfront.</div>
      </div>

      <div class="pricing-notice-box">
        <span style="font-size:1.2rem;">ℹ️</span>
        <div><b>Meta charges applicable on WhatsApp service (UI) and BI messages:</b> the customer must add a payment card in Meta Business Manager. Meta's per-message charges apply on top of the plan price.</div>
      </div>

      <div class="pricing-notice-box">
        <span style="font-size:1.2rem;">ℹ️</span>
        <div>All prices are <b>exclusive of GST (+18%)</b>, which is charged extra at checkout.</div>
      </div>

      <!-- Add-ons Section Header -->
      <div class="pricing-section-header">
        <h2>Official Add-ons Catalog (19 Available Modules)</h2>
        <div class="line"></div>
      </div>

      <div class="pricing-table-wrap">
        <table class="pricing-matrix-table">
          <thead>
            <tr>
              <th>Add-on Name</th>
              <th>Unit / Scope</th>
              <th>Available on Plans</th>
              <th>Price (₹)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Template Text Replies + Button Clicks <span class="note-inline">(one add-on)</span></td>
              <td class="note-inline">flat rate</td>
              <td class="note-inline">Broadcast, Standard</td>
              <td class="val">${!isYearly ? '₹1,000 / mo' : '₹9,600 / yr'}</td>
              <td><button class="btn-table-action btn-action-secondary" style="font-size:0.75rem; padding:3px 8px;" onclick="window.smatApp.openPlanModal(null, null)">+ Add</button></td>
            </tr>
            <tr>
              <td>CRM Integration</td>
              <td class="note-inline">flat rate</td>
              <td class="note-inline">Broadcast, Standard</td>
              <td class="val">${!isYearly ? '₹1,000 / mo' : '₹9,600 / yr'}</td>
              <td><button class="btn-table-action btn-action-secondary" style="font-size:0.75rem; padding:3px 8px;" onclick="window.smatApp.openPlanModal(null, null)">+ Add</button></td>
            </tr>
            <tr>
              <td>WhatsApp Cart &amp; Catalog</td>
              <td class="note-inline">flat rate</td>
              <td class="note-inline">Broadcast, Standard</td>
              <td class="val">${!isYearly ? '₹1,000 / mo' : '₹9,600 / yr'}</td>
              <td><button class="btn-table-action btn-action-secondary" style="font-size:0.75rem; padding:3px 8px;" onclick="window.smatApp.openPlanModal(null, null)">+ Add</button></td>
            </tr>
            <tr>
              <td>Live Agent Seat</td>
              <td class="note-inline">per agent<br>(Pro &amp; AI: beyond 3 included)</td>
              <td class="note-inline">All plans</td>
              <td class="val">${!isYearly ? '₹1,000 / mo' : '₹9,600 / yr'}</td>
              <td><button class="btn-table-action btn-action-secondary" style="font-size:0.75rem; padding:3px 8px;" onclick="window.smatApp.openPlanModal(null, null)">+ Add</button></td>
            </tr>
            <tr>
              <td>AI Agent (Dialogflow)</td>
              <td class="note-inline">flat rate</td>
              <td class="note-inline">Broadcast, Standard</td>
              <td class="val">${!isYearly ? '₹1,000 / mo' : '₹9,600 / yr'}</td>
              <td><button class="btn-table-action btn-action-secondary" style="font-size:0.75rem; padding:3px 8px;" onclick="window.smatApp.openPlanModal(null, null)">+ Add</button></td>
            </tr>
            <tr>
              <td>Multi-Lingual / Extra Language</td>
              <td class="note-inline">Broadcast &amp; Standard: up to 2 langs<br>Pro &amp; AI: per language beyond 2</td>
              <td class="note-inline">All plans</td>
              <td class="val">${!isYearly ? '₹1,000 / mo' : '₹9,600 / yr'}</td>
              <td><button class="btn-table-action btn-action-secondary" style="font-size:0.75rem; padding:3px 8px;" onclick="window.smatApp.openPlanModal(null, null)">+ Add</button></td>
            </tr>
            <tr>
              <td>AI Integration Suite</td>
              <td class="note-inline">flat rate</td>
              <td class="note-inline">Broadcast, Standard, Pro</td>
              <td class="val">${!isYearly ? '₹2,000 / mo' : '₹24,000 / yr'}</td>
              <td><button class="btn-table-action btn-action-secondary" style="font-size:0.75rem; padding:3px 8px;" onclick="window.smatApp.openPlanModal(null, null)">+ Add</button></td>
            </tr>
            <tr>
              <td>Email OTP Validation</td>
              <td class="note-inline">${!isYearly ? '1,000 OTPs / mo' : '12,000 OTPs / yr upfront'}</td>
              <td class="note-inline">Standard, Pro, AI</td>
              <td class="val">${!isYearly ? '₹500 / mo' : '₹6,000 / yr'}</td>
              <td><button class="btn-table-action btn-action-secondary" style="font-size:0.75rem; padding:3px 8px;" onclick="window.smatApp.openPlanModal(null, null)">+ Add</button></td>
            </tr>
            <tr>
              <td>Extra Chatbots</td>
              <td class="note-inline">per 5 chatbots</td>
              <td class="note-inline">All plans</td>
              <td class="val">${!isYearly ? '₹1,000 / mo' : '₹9,600 / yr'}</td>
              <td><button class="btn-table-action btn-action-secondary" style="font-size:0.75rem; padding:3px 8px;" onclick="window.smatApp.openPlanModal(null, null)">+ Add</button></td>
            </tr>
            <tr>
              <td>WhatsApp BI Messages</td>
              <td class="note-inline">${!isYearly ? '1,000 messages / mo' : '12,000 messages / yr upfront'}</td>
              <td class="note-inline">All plans</td>
              <td class="val">${!isYearly ? '₹200 / mo' : '₹2,400 / yr'}</td>
              <td><button class="btn-table-action btn-action-secondary" style="font-size:0.75rem; padding:3px 8px;" onclick="window.smatApp.openPlanModal(null, null)">+ Add</button></td>
            </tr>
            <tr>
              <td>UI / Website Chats</td>
              <td class="note-inline">${!isYearly ? '1,000 chats / mo' : '12,000 chats / yr upfront'}</td>
              <td class="note-inline">All plans</td>
              <td class="val">${!isYearly ? '₹600 / mo' : '₹7,200 / yr'}</td>
              <td><button class="btn-table-action btn-action-secondary" style="font-size:0.75rem; padding:3px 8px;" onclick="window.smatApp.openPlanModal(null, null)">+ Add</button></td>
            </tr>
            <tr>
              <td>SMS OTPs</td>
              <td class="note-inline">${!isYearly ? '1,000 OTPs / mo' : '12,000 OTPs / yr upfront'}</td>
              <td class="note-inline">All plans</td>
              <td class="val">${!isYearly ? '₹500 / mo' : '₹6,000 / yr'}</td>
              <td><button class="btn-table-action btn-action-secondary" style="font-size:0.75rem; padding:3px 8px;" onclick="window.smatApp.openPlanModal(null, null)">+ Add</button></td>
            </tr>
            <tr>
              <td>WhatsApp OTPs</td>
              <td class="note-inline">${!isYearly ? '1,000 OTPs / mo' : '12,000 OTPs / yr upfront'}</td>
              <td class="note-inline">All plans</td>
              <td class="val">${!isYearly ? '₹500 / mo' : '₹6,000 / yr'}</td>
              <td><button class="btn-table-action btn-action-secondary" style="font-size:0.75rem; padding:3px 8px;" onclick="window.smatApp.openPlanModal(null, null)">+ Add</button></td>
            </tr>
            <tr>
              <td>SMS Notifications</td>
              <td class="note-inline">${!isYearly ? '1,000 notifications / mo' : '12,000 notifications / yr upfront'}</td>
              <td class="note-inline">All plans</td>
              <td class="val">${!isYearly ? '₹500 / mo' : '₹6,000 / yr'}</td>
              <td><button class="btn-table-action btn-action-secondary" style="font-size:0.75rem; padding:3px 8px;" onclick="window.smatApp.openPlanModal(null, null)">+ Add</button></td>
            </tr>
            <tr>
              <td>WhatsApp Notifications</td>
              <td class="note-inline">${!isYearly ? '1,000 notifications / mo' : '12,000 notifications / yr upfront'}</td>
              <td class="note-inline">All plans</td>
              <td class="val">${!isYearly ? '₹500 / mo' : '₹6,000 / yr'}</td>
              <td><button class="btn-table-action btn-action-secondary" style="font-size:0.75rem; padding:3px 8px;" onclick="window.smatApp.openPlanModal(null, null)">+ Add</button></td>
            </tr>
            <tr>
              <td>Text to Speech</td>
              <td class="note-inline">flat rate</td>
              <td class="note-inline">All plans</td>
              <td class="val">${!isYearly ? '₹800 / mo' : '₹7,200 / yr'}</td>
              <td><button class="btn-table-action btn-action-secondary" style="font-size:0.75rem; padding:3px 8px;" onclick="window.smatApp.openPlanModal(null, null)">+ Add</button></td>
            </tr>
            <tr>
              <td>Remove Branding</td>
              <td class="note-inline">flat rate</td>
              <td class="note-inline">All plans</td>
              <td class="val">${!isYearly ? '₹1,900 / mo' : '₹20,280 / yr'}</td>
              <td><button class="btn-table-action btn-action-secondary" style="font-size:0.75rem; padding:3px 8px;" onclick="window.smatApp.openPlanModal(null, null)">+ Add</button></td>
            </tr>
            <tr>
              <td>Basic Support</td>
              <td class="note-inline">flat rate</td>
              <td class="note-inline">All plans</td>
              <td class="val">${!isYearly ? '₹6,999 / mo' : '₹71,988 / yr'}</td>
              <td><button class="btn-table-action btn-action-secondary" style="font-size:0.75rem; padding:3px 8px;" onclick="window.smatApp.openPlanModal(null, null)">+ Add</button></td>
            </tr>
            <tr>
              <td>Premium Support</td>
              <td class="note-inline">flat rate</td>
              <td class="note-inline">All plans</td>
              <td class="val">${!isYearly ? '₹14,999 / mo' : '₹143,988 / yr'}</td>
              <td><button class="btn-table-action btn-action-secondary" style="font-size:0.75rem; padding:3px 8px;" onclick="window.smatApp.openPlanModal(null, null)">+ Add</button></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Quick Navigation Callout -->
      <div style="background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%); border: 1px solid #BBF7D0; border-radius: var(--radius-lg); padding: 1.25rem 1.75rem; display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <div style="font-weight: 700; font-size: 0.95rem; color: #166534;">Manage Active Client Subscriptions</div>
          <div style="font-size: 0.82rem; color: #15803D; margin-top: 2px;">View all ${clientsData.length} client renewal dates, expiring days left, and license upgrades.</div>
        </div>
        <button class="btn-table-action btn-action-primary" onclick="window.smatApp.navigateTo('subscriptions')" style="background-color: #16A34A; border:none;">
          Open Client Subscriptions →
        </button>
      </div>
    `;
  }

  // =========================================================================
  // DEDICATED ADDONS & INTEGRATIONS VIEW
  // =========================================================================
  function renderAddonsView(container) {
    const isYearly = billingToggleYearly;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h2 class="section-page-title" style="margin:0;">Platform Addons & Integrations Catalog</h2>
          <p style="font-size:0.85rem; color:#64748B; margin-top:4px;">19 Official SmatBot Add-ons with Upfront Yearly Quota Allocation & Plan Eligibility</p>
        </div>
        <button class="btn-table-action btn-action-primary" onclick="window.smatApp.openPlanModal()" style="padding:0.6rem 1.25rem; font-size:0.88rem;">
          ⚡ Assign Add-on to Client
        </button>
      </div>

      <!-- Billing Period Switch -->
      <div class="pricing-billing-switch-wrap">
        <div class="pricing-billing-switch" role="group" aria-label="Billing period">
          <button type="button" class="${!isYearly ? 'active' : ''}" onclick="window.smatApp.toggleBillingFrequency(false)">Monthly</button>
          <button type="button" class="${isYearly ? 'active' : ''}" onclick="window.smatApp.toggleBillingFrequency(true)">
            Yearly <span class="hint">Upfront Quota Credited 🎉</span>
          </button>
        </div>
      </div>

      <!-- Operational Mandate Banner -->
      <div class="pricing-notice-box blue" style="margin-bottom:1.5rem;">
        <span style="font-size:1.3rem;">🚀</span>
        <div>
          <b>Yearly Add-on Quota Allocation Rule:</b>
          If a client purchases an annual quota add-on (such as SMS Notifications, SMS OTP, WhatsApp BI Messages, or Email OTPs), the entire yearly allowance (e.g. <b>12,000 notifications upfront</b>) is credited immediately upon activation, instead of a monthly reset.
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
        <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:10px; padding:1.25rem;">
          <div style="font-size:0.78rem; font-weight:700; color:#64748B; text-transform:uppercase;">Total Add-ons</div>
          <div style="font-size:1.6rem; font-weight:800; color:#0F172A; margin:4px 0;">19 Modules</div>
          <div style="font-size:0.78rem; color:#16A34A; font-weight:600;">Fully cataloged & priced</div>
        </div>
        <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:10px; padding:1.25rem;">
          <div style="font-size:0.78rem; font-weight:700; color:#64748B; text-transform:uppercase;">Quota-Based Modules</div>
          <div style="font-size:1.6rem; font-weight:800; color:#2563EB; margin:4px 0;">7 Add-ons</div>
          <div style="font-size:0.78rem; color:#64748B;">SMS, WA OTP, BI, Email OTP</div>
        </div>
        <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:10px; padding:1.25rem;">
          <div style="font-size:0.78rem; font-weight:700; color:#64748B; text-transform:uppercase;">Flat-Rate Feature Add-ons</div>
          <div style="font-size:1.6rem; font-weight:800; color:#7C3AED; margin:4px 0;">10 Add-ons</div>
          <div style="font-size:0.78rem; color:#64748B;">CRM, AI Suite, Cart, TTS</div>
        </div>
        <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:10px; padding:1.25rem;">
          <div style="font-size:0.78rem; font-weight:700; color:#64748B; text-transform:uppercase;">Support Tiers</div>
          <div style="font-size:1.6rem; font-weight:800; color:#EA580C; margin:4px 0;">2 Tiers</div>
          <div style="font-size:0.78rem; color:#64748B;">Basic & Premium SLA</div>
        </div>
      </div>

      <!-- Add-ons Catalog Table -->
      <div class="pricing-table-wrap">
        <table class="pricing-matrix-table">
          <thead>
            <tr>
              <th>Add-on</th>
              <th>Unit / Allocation Rule</th>
              <th>Available on Plans</th>
              <th>Price (₹)</th>
              <th>Billing Frequency</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Template Text Replies + Button Clicks</strong><div class="note-inline">Combined unified response module</div></td>
              <td class="note-inline">flat rate</td>
              <td><span class="badge-tag blue">Broadcast</span> <span class="badge-tag blue">Standard</span></td>
              <td class="val">${!isYearly ? '₹1,000 / mo' : '₹9,600 / yr'}</td>
              <td>${!isYearly ? 'Monthly' : 'Yearly (20% Off)'}</td>
              <td><button class="btn-table-action btn-action-primary" style="font-size:0.75rem; padding:4px 10px;" onclick="window.smatApp.openPlanModal(null, null)">Provision</button></td>
            </tr>
            <tr>
              <td><strong>CRM Integration</strong><div class="note-inline">Hubspot, Zoho, Salesforce sync</div></td>
              <td class="note-inline">flat rate</td>
              <td><span class="badge-tag blue">Broadcast</span> <span class="badge-tag blue">Standard</span></td>
              <td class="val">${!isYearly ? '₹1,000 / mo' : '₹9,600 / yr'}</td>
              <td>${!isYearly ? 'Monthly' : 'Yearly (20% Off)'}</td>
              <td><button class="btn-table-action btn-action-primary" style="font-size:0.75rem; padding:4px 10px;" onclick="window.smatApp.openPlanModal(null, null)">Provision</button></td>
            </tr>
            <tr>
              <td><strong>WhatsApp Cart &amp; Catalog</strong><div class="note-inline">E-commerce in-chat checkout</div></td>
              <td class="note-inline">flat rate</td>
              <td><span class="badge-tag blue">Broadcast</span> <span class="badge-tag blue">Standard</span></td>
              <td class="val">${!isYearly ? '₹1,000 / mo' : '₹9,600 / yr'}</td>
              <td>${!isYearly ? 'Monthly' : 'Yearly (20% Off)'}</td>
              <td><button class="btn-table-action btn-action-primary" style="font-size:0.75rem; padding:4px 10px;" onclick="window.smatApp.openPlanModal(null, null)">Provision</button></td>
            </tr>
            <tr>
              <td><strong>Live Agent Seat</strong><div class="note-inline">Real-time human takeover</div></td>
              <td class="note-inline">per agent (Pro &amp; AI: beyond 3 incl.)</td>
              <td><span class="badge-tag green">All Plans</span></td>
              <td class="val">${!isYearly ? '₹1,000 / mo' : '₹9,600 / yr'}</td>
              <td>${!isYearly ? 'Monthly' : 'Yearly (20% Off)'}</td>
              <td><button class="btn-table-action btn-action-primary" style="font-size:0.75rem; padding:4px 10px;" onclick="window.smatApp.openPlanModal(null, null)">Provision</button></td>
            </tr>
            <tr>
              <td><strong>AI Agent (Dialogflow)</strong><div class="note-inline">Google Dialogflow ES/CX agent</div></td>
              <td class="note-inline">flat rate</td>
              <td><span class="badge-tag blue">Broadcast</span> <span class="badge-tag blue">Standard</span></td>
              <td class="val">${!isYearly ? '₹1,000 / mo' : '₹9,600 / yr'}</td>
              <td>${!isYearly ? 'Monthly' : 'Yearly (20% Off)'}</td>
              <td><button class="btn-table-action btn-action-primary" style="font-size:0.75rem; padding:4px 10px;" onclick="window.smatApp.openPlanModal(null, null)">Provision</button></td>
            </tr>
            <tr>
              <td><strong>Multi-Lingual / Extra Language</strong><div class="note-inline">Broad/Std: up to 2 langs • Pro/AI: per lang &gt; 2</div></td>
              <td class="note-inline">per language</td>
              <td><span class="badge-tag green">All Plans</span></td>
              <td class="val">${!isYearly ? '₹1,000 / mo' : '₹9,600 / yr'}</td>
              <td>${!isYearly ? 'Monthly' : 'Yearly (20% Off)'}</td>
              <td><button class="btn-table-action btn-action-primary" style="font-size:0.75rem; padding:4px 10px;" onclick="window.smatApp.openPlanModal(null, null)">Provision</button></td>
            </tr>
            <tr>
              <td><strong>AI Integration Suite</strong><div class="note-inline">Full LLM vector training fallback</div></td>
              <td class="note-inline">flat rate</td>
              <td><span class="badge-tag blue">Broadcast</span> <span class="badge-tag blue">Standard</span> <span class="badge-tag blue">Pro</span></td>
              <td class="val">${!isYearly ? '₹2,000 / mo' : '₹24,000 / yr'}</td>
              <td>${!isYearly ? 'Monthly' : 'Yearly (Flat)'}</td>
              <td><button class="btn-table-action btn-action-primary" style="font-size:0.75rem; padding:4px 10px;" onclick="window.smatApp.openPlanModal(null, null)">Provision</button></td>
            </tr>
            <tr>
              <td><strong>Email OTP Validation</strong><div class="note-inline">Two-factor email code verification</div></td>
              <td class="note-inline">${!isYearly ? '1,000 OTPs / mo' : '<strong>12,000 OTPs / yr upfront</strong>'}</td>
              <td><span class="badge-tag blue">Standard</span> <span class="badge-tag blue">Pro</span> <span class="badge-tag blue">AI</span></td>
              <td class="val">${!isYearly ? '₹500 / mo' : '₹6,000 / yr'}</td>
              <td>${!isYearly ? 'Monthly' : 'Yearly Upfront Quota'}</td>
              <td><button class="btn-table-action btn-action-primary" style="font-size:0.75rem; padding:4px 10px;" onclick="window.smatApp.openPlanModal(null, null)">Provision</button></td>
            </tr>
            <tr>
              <td><strong>Extra Chatbots</strong><div class="note-inline">Expand bot limit</div></td>
              <td class="note-inline">per 5 chatbots</td>
              <td><span class="badge-tag green">All Plans</span></td>
              <td class="val">${!isYearly ? '₹1,000 / mo' : '₹9,600 / yr'}</td>
              <td>${!isYearly ? 'Monthly' : 'Yearly (20% Off)'}</td>
              <td><button class="btn-table-action btn-action-primary" style="font-size:0.75rem; padding:4px 10px;" onclick="window.smatApp.openPlanModal(null, null)">Provision</button></td>
            </tr>
            <tr>
              <td><strong>WhatsApp BI Messages</strong><div class="note-inline">Business-initiated message quota</div></td>
              <td class="note-inline">${!isYearly ? '1,000 messages / mo' : '<strong>12,000 messages / yr upfront</strong>'}</td>
              <td><span class="badge-tag green">All Plans</span></td>
              <td class="val">${!isYearly ? '₹200 / mo' : '₹2,400 / yr'}</td>
              <td>${!isYearly ? 'Monthly' : 'Yearly Upfront Quota'}</td>
              <td><button class="btn-table-action btn-action-primary" style="font-size:0.75rem; padding:4px 10px;" onclick="window.smatApp.openPlanModal(null, null)">Provision</button></td>
            </tr>
            <tr>
              <td><strong>UI / Website Chats</strong><div class="note-inline">Extra web visitor conversation packs</div></td>
              <td class="note-inline">${!isYearly ? '1,000 chats / mo' : '<strong>12,000 chats / yr upfront</strong>'}</td>
              <td><span class="badge-tag green">All Plans</span></td>
              <td class="val">${!isYearly ? '₹600 / mo' : '₹7,200 / yr'}</td>
              <td>${!isYearly ? 'Monthly' : 'Yearly Upfront Quota'}</td>
              <td><button class="btn-table-action btn-action-primary" style="font-size:0.75rem; padding:4px 10px;" onclick="window.smatApp.openPlanModal(null, null)">Provision</button></td>
            </tr>
            <tr>
              <td><strong>SMS OTPs</strong><div class="note-inline">High-delivery transactional OTP route</div></td>
              <td class="note-inline">${!isYearly ? '1,000 OTPs / mo' : '<strong>12,000 OTPs / yr upfront</strong>'}</td>
              <td><span class="badge-tag green">All Plans</span></td>
              <td class="val">${!isYearly ? '₹500 / mo' : '₹6,000 / yr'}</td>
              <td>${!isYearly ? 'Monthly' : 'Yearly Upfront Quota'}</td>
              <td><button class="btn-table-action btn-action-primary" style="font-size:0.75rem; padding:4px 10px;" onclick="window.smatApp.openPlanModal(null, null)">Provision</button></td>
            </tr>
            <tr>
              <td><strong>WhatsApp OTPs</strong><div class="note-inline">Authentication template authentication</div></td>
              <td class="note-inline">${!isYearly ? '1,000 OTPs / mo' : '<strong>12,000 OTPs / yr upfront</strong>'}</td>
              <td><span class="badge-tag green">All Plans</span></td>
              <td class="val">${!isYearly ? '₹500 / mo' : '₹6,000 / yr'}</td>
              <td>${!isYearly ? 'Monthly' : 'Yearly Upfront Quota'}</td>
              <td><button class="btn-table-action btn-action-primary" style="font-size:0.75rem; padding:4px 10px;" onclick="window.smatApp.openPlanModal(null, null)">Provision</button></td>
            </tr>
            <tr>
              <td><strong>SMS Notifications</strong><div class="note-inline">Order updates, reminders, transactional</div></td>
              <td class="note-inline">${!isYearly ? '1,000 notifs / mo' : '<strong>12,000 notifs / yr upfront</strong>'}</td>
              <td><span class="badge-tag green">All Plans</span></td>
              <td class="val">${!isYearly ? '₹500 / mo' : '₹6,000 / yr'}</td>
              <td>${!isYearly ? 'Monthly' : 'Yearly Upfront Quota'}</td>
              <td><button class="btn-table-action btn-action-primary" style="font-size:0.75rem; padding:4px 10px;" onclick="window.smatApp.openPlanModal(null, null)">Provision</button></td>
            </tr>
            <tr>
              <td><strong>WhatsApp Notifications</strong><div class="note-inline">Utility &amp; service notification alerts</div></td>
              <td class="note-inline">${!isYearly ? '1,000 notifs / mo' : '<strong>12,000 notifs / yr upfront</strong>'}</td>
              <td><span class="badge-tag green">All Plans</span></td>
              <td class="val">${!isYearly ? '₹500 / mo' : '₹6,000 / yr'}</td>
              <td>${!isYearly ? 'Monthly' : 'Yearly Upfront Quota'}</td>
              <td><button class="btn-table-action btn-action-primary" style="font-size:0.75rem; padding:4px 10px;" onclick="window.smatApp.openPlanModal(null, null)">Provision</button></td>
            </tr>
            <tr>
              <td><strong>Text to Speech</strong><div class="note-inline">Voice synthesis audio audio player</div></td>
              <td class="note-inline">flat rate</td>
              <td><span class="badge-tag green">All Plans</span></td>
              <td class="val">${!isYearly ? '₹800 / mo' : '₹7,200 / yr'}</td>
              <td>${!isYearly ? 'Monthly' : 'Yearly (25% Off)'}</td>
              <td><button class="btn-table-action btn-action-primary" style="font-size:0.75rem; padding:4px 10px;" onclick="window.smatApp.openPlanModal(null, null)">Provision</button></td>
            </tr>
            <tr>
              <td><strong>Remove Branding</strong><div class="note-inline">White-label "Powered by SmatBot" removal</div></td>
              <td class="note-inline">flat rate</td>
              <td><span class="badge-tag green">All Plans</span></td>
              <td class="val">${!isYearly ? '₹1,900 / mo' : '₹20,280 / yr'}</td>
              <td>${!isYearly ? 'Monthly' : 'Yearly (11% Off)'}</td>
              <td><button class="btn-table-action btn-action-primary" style="font-size:0.75rem; padding:4px 10px;" onclick="window.smatApp.openPlanModal(null, null)">Provision</button></td>
            </tr>
            <tr>
              <td><strong>Basic Support</strong><div class="note-inline">8-hour business day email &amp; chat SLA</div></td>
              <td class="note-inline">flat rate</td>
              <td><span class="badge-tag green">All Plans</span></td>
              <td class="val">${!isYearly ? '₹6,999 / mo' : '₹71,988 / yr'}</td>
              <td>${!isYearly ? 'Monthly' : 'Yearly SLA'}</td>
              <td><button class="btn-table-action btn-action-primary" style="font-size:0.75rem; padding:4px 10px;" onclick="window.smatApp.openPlanModal(null, null)">Provision</button></td>
            </tr>
            <tr>
              <td><strong>Premium Support</strong><div class="note-inline">24/7 dedicated engineer &amp; phone SLA</div></td>
              <td class="note-inline">flat rate</td>
              <td><span class="badge-tag green">All Plans</span></td>
              <td class="val">${!isYearly ? '₹14,999 / mo' : '₹143,988 / yr'}</td>
              <td>${!isYearly ? 'Monthly' : 'Yearly SLA'}</td>
              <td><button class="btn-table-action btn-action-primary" style="font-size:0.75rem; padding:4px 10px;" onclick="window.smatApp.openPlanModal(null, null)">Provision</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  function toggleBillingFrequency(isYearly) {
    billingToggleYearly = isYearly;
    if (currentRoute === 'plans') renderPlansView($('#route-viewport'));
  }

  // =========================================================================
  // 7B. MODULE 4B: ACTIVE CLIENT SUBSCRIPTIONS DEDICATED VIEW
  // =========================================================================
  let subSearch = '';
  let subStatus = 'All';
  let subPage = 1;
  const subPageSize = 10;

  function renderClientSubscriptionsView(container) {
    let list = [...clientsData];

    if (subStatus !== 'All') {
      list = list.filter(c => c.subscription_status === subStatus);
    }

    if (subSearch && subSearch.trim()) {
      const q = subSearch.trim().toLowerCase();
      list = list.filter(c => 
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.plan_name && c.plan_name.toLowerCase().includes(q)) ||
        (c.subscription_id && c.subscription_id.toLowerCase().includes(q)) ||
        (c.zoho_customer_id && c.zoho_customer_id.toLowerCase().includes(q))
      );
    }

    const totalSubs = list.length;
    const totalPages = Math.ceil(totalSubs / subPageSize) || 1;
    if (subPage > totalPages) subPage = totalPages;
    if (subPage < 1) subPage = 1;

    const startIdx = (subPage - 1) * subPageSize;
    const paginatedSubs = list.slice(startIdx, startIdx + subPageSize);

    const activePaidCount = clientsData.filter(c => c.subscription_status === 'Active').length;
    const trialCount = clientsData.filter(c => c.subscription_status === 'Trial').length;
    const expiredCount = clientsData.filter(c => c.subscription_status === 'Expired').length;

    container.innerHTML = `
      <!-- Top Metrics Overview -->
      <div class="overview-metrics-grid" style="grid-template-columns: repeat(4, 1fr); margin-bottom: 1.5rem;">
        <div class="metric-summary-card">
          <div class="metric-card-top-row">
            <span class="metric-card-label">TOTAL SUBSCRIPTIONS</span>
            <div class="metric-icon-circle blue" style="width:28px; height:28px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="1" y="4" width="22" height="16" rx="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            </div>
          </div>
          <div class="metric-card-big-value" style="font-size:1.6rem; margin-top:0.4rem;">${clientsData.length} <span class="metric-sub-limit">Accounts</span></div>
          <div style="font-size:0.75rem; color:#64748B; margin-top:4px;">Across all billing tiers</div>
        </div>

        <div class="metric-summary-card">
          <div class="metric-card-top-row">
            <span class="metric-card-label">ACTIVE PAID TIERS</span>
            <div class="metric-icon-circle" style="width:28px; height:28px; background:rgba(16, 185, 129, 0.12); color:#10B981;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          </div>
          <div class="metric-card-big-value" style="font-size:1.6rem; color:#10B981; margin-top:0.4rem;">${activePaidCount} <span class="metric-sub-limit">Active</span></div>
          <div style="font-size:0.75rem; color:#64748B; margin-top:4px;">Recurring revenue active</div>
        </div>

        <div class="metric-summary-card">
          <div class="metric-card-top-row">
            <span class="metric-card-label">TRIAL INSTANCES</span>
            <div class="metric-icon-circle purple" style="width:28px; height:28px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
          </div>
          <div class="metric-card-big-value" style="font-size:1.6rem; color:#7C3AED; margin-top:0.4rem;">${trialCount} <span class="metric-sub-limit">Trials</span></div>
          <div style="font-size:0.75rem; color:#64748B; margin-top:4px;">14-day evaluation bots</div>
        </div>

        <div class="metric-summary-card">
          <div class="metric-card-top-row">
            <span class="metric-card-label">EXPIRED / DUE</span>
            <div class="metric-icon-circle orange" style="width:28px; height:28px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
          </div>
          <div class="metric-card-big-value" style="font-size:1.6rem; color:#EA580C; margin-top:0.4rem;">${expiredCount} <span class="metric-sub-limit">Accounts</span></div>
          <div style="font-size:0.75rem; color:#64748B; margin-top:4px;">Pending renewal or expired</div>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
        <div>
          <h2 class="section-page-title" style="margin:0;">Active Client Subscriptions</h2>
          <p style="font-size:0.85rem; color:#64748B; margin-top:4px;">View live client license tiers, renewal cycles, and upgrade plans.</p>
        </div>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.navigateTo('plans')">
            ⚙️ View Pricing Tiers
          </button>
          <button class="btn-table-action btn-action-primary" onclick="window.smatApp.openPlanModal()">
            ⚡ + Activate Subscription
          </button>
        </div>
      </div>

      <!-- Filter Bar for Subscriptions -->
      <div class="client-filter-card client-filter-card-minimal" style="margin-bottom:1.25rem;">
        <div class="filter-minimal-row">
          <div class="filter-item-block filter-item-search">
            <label class="filter-item-label">Search Subscriptions <span class="info-tooltip-icon">i</span></label>
            <div class="search-input-wrapper">
              <span class="search-input-icon">🔍</span>
              <input 
                type="text" 
                class="filter-search-box" 
                placeholder="Search by client name, email, subscription ID..." 
                value="${subSearch}"
                oninput="window.smatApp.updateSubSearch(this.value)"
              />
            </div>
          </div>

          <div class="filter-item-block filter-item-status" style="max-width:200px;">
            <label class="filter-item-label">Status Filter <span class="info-tooltip-icon">i</span></label>
            <select class="filter-search-box" style="padding-left:0.75rem; cursor:pointer;" onchange="window.smatApp.updateSubStatus(this.value)">
              <option value="All" ${subStatus === 'All' ? 'selected' : ''}>All Statuses</option>
              <option value="Active" ${subStatus === 'Active' ? 'selected' : ''}>Active Only</option>
              <option value="Trial" ${subStatus === 'Trial' ? 'selected' : ''}>Trial Only</option>
              <option value="Expired" ${subStatus === 'Expired' ? 'selected' : ''}>Expired Only</option>
            </select>
          </div>

          <div class="filter-actions-group">
            <button class="btn-filter-reset" onclick="window.smatApp.resetSubFilters()">↺ Reset</button>
          </div>
        </div>
      </div>

      <!-- Subscriptions Data Table -->
      <div class="table-card-container">
        <table class="client-data-table">
          <thead>
            <tr>
              <th style="width: 50px;">S.no</th>
              <th>Client Name</th>
              <th>Current Tier</th>
              <th>Billing Frequency</th>
              <th>Amount</th>
              <th>Renewal Date</th>
              <th>Days Left</th>
              <th>Status</th>
              <th style="text-align: center;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${paginatedSubs.length === 0 ? `
              <tr>
                <td colspan="9" style="text-align:center; padding:2.5rem; color:#94A3B8;">
                  No subscriptions match your search. <button onclick="window.smatApp.resetSubFilters()" style="color:#1877F2; background:none; border:none; cursor:pointer; font-weight:700;">Reset Filter</button>
                </td>
              </tr>
            ` : paginatedSubs.map(c => `
              <tr>
                <td style="font-weight:600; color:#64748B;">${c.s_no}</td>
                <td>
                  <span style="font-weight:700; color:#1E293B; cursor:pointer;" onclick="window.smatApp.openClientDetailsPage(${c.id})">${c.name}</span>
                  <div style="font-size:0.75rem; color:#64748B;">${c.email}</div>
                </td>
                <td>
                  <span style="font-weight:700; color:#1877F2; background:var(--primary-blue-light); padding:3px 8px; border-radius:4px; font-size:0.8rem;">
                    ${c.plan_name}
                  </span>
                </td>
                <td style="color:#334155; font-weight:600;">${c.billing_cycle || 'Monthly'}</td>
                <td style="font-weight:700; color:#1E293B;">${c.subscription_amount_display}</td>
                <td style="color:#64748B; font-weight:500;">${c.end_date}</td>
                <td>
                  <strong style="color: ${c.days_left === 0 || c.days_left === '0' ? '#EF4444' : (c.days_left <= 7 ? '#EA580C' : '#10B981')};">
                    ${c.days_left} days
                  </strong>
                </td>
                <td>
                  <span class="status-pill ${(c.subscription_status || 'trial').toLowerCase()}">
                    ${c.subscription_status}
                  </span>
                </td>
                <td style="text-align: center;">
                  <button class="btn-table-action btn-action-primary" onclick="window.smatApp.openPlanModal(${c.id})" title="Upgrade or Change Plan">
                    ⚡ Upgrade
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Pagination Controls -->
        <div class="table-pagination-footer" style="padding: 1rem 1.25rem; display:flex; justify-content:space-between; align-items:center;">
          <div style="font-size:0.82rem; color:#64748B;">
            Showing <strong>${startIdx + 1}</strong> to <strong>${Math.min(startIdx + subPageSize, totalSubs)}</strong> of <strong>${totalSubs}</strong> subscriptions
          </div>
          <div style="display:flex; gap:0.35rem; align-items:center;">
            <button class="btn-pagination-nav" onclick="window.smatApp.goToSubPage(${subPage - 1})" ${subPage === 1 ? 'disabled' : ''}>‹</button>
            <span style="font-size:0.82rem; font-weight:700; padding:0 0.5rem; color:#1E293B;">Page ${subPage} of ${totalPages}</span>
            <button class="btn-pagination-nav" onclick="window.smatApp.goToSubPage(${subPage + 1})" ${subPage === totalPages ? 'disabled' : ''}>›</button>
          </div>
        </div>
      </div>
    `;
  }

  function updateSubSearch(val) {
    subSearch = val;
    subPage = 1;
    renderClientSubscriptionsView($('#route-viewport'));
  }

  function updateSubStatus(val) {
    subStatus = val;
    subPage = 1;
    renderClientSubscriptionsView($('#route-viewport'));
  }

  function resetSubFilters() {
    subSearch = '';
    subStatus = 'All';
    subPage = 1;
    renderClientSubscriptionsView($('#route-viewport'));
  }

  function goToSubPage(page) {
    subPage = page;
    renderClientSubscriptionsView($('#route-viewport'));
  }

  // =========================================================================
  // 7. MODULE 4: SUBSCRIPTION & BILLING ENGINE (Points 1-9 Implementation)
  // =========================================================================
  const PLAN_TIER_META = {
    'Broadcast': { rank: 1, monthlyINR: 1499, yearlyINR: 14500, yearlySavingsINR: 3488, yearlySavingsPercent: 19, bots: 2, chats: 1000, yearlyChatsUpfront: 12000, monthlyBiChats: 1000, yearlyBiChatsUpfront: 12000, monthlyUSD: 19, yearlyUSD: 180, hasWA: true, hasWL: false },
    'Standard': { rank: 2, monthlyINR: 3500, yearlyINR: 35000, yearlySavingsINR: 7000, yearlySavingsPercent: 17, bots: 5, chats: 30000, yearlyChatsUpfront: 360000, monthlyBiChats: 2000, yearlyBiChatsUpfront: 24000, monthlyUSD: 45, yearlyUSD: 430, hasWA: true, hasWL: false },
    'Pro': { rank: 3, isPopular: true, monthlyINR: 6500, yearlyINR: 72000, yearlySavingsINR: 6000, yearlySavingsPercent: 8, bots: 10, chats: 100000, yearlyChatsUpfront: 1200000, monthlyBiChats: 5000, yearlyBiChatsUpfront: 60000, liveAgents: 3, monthlyUSD: 85, yearlyUSD: 890, hasWA: true, hasWL: true },
    'AI': { rank: 4, monthlyINR: 8999, yearlyINR: 96000, yearlySavingsINR: 11988, yearlySavingsPercent: 11, bots: 10, chats: 500000, yearlyChatsUpfront: 6000000, monthlyBiChats: 10000, yearlyBiChatsUpfront: 120000, liveAgents: 3, monthlyUSD: 115, yearlyUSD: 1190, hasWA: true, hasWL: true },
    'Free Trial': { rank: 0, monthlyINR: 0, yearlyINR: 0, monthlyUSD: 0, yearlyUSD: 0, bots: 1, chats: 500, hasWA: false, hasWL: false },
    'Pro Trial': { rank: 0, monthlyINR: 0, yearlyINR: 0, monthlyUSD: 0, yearlyUSD: 0, bots: 10, chats: 500, hasWA: true, hasWL: false },
    'Pro NY': { rank: 3, monthlyINR: 6500, yearlyINR: 72000, bots: 10, chats: 100000, hasWA: true, hasWL: false },
    'Starter NY': { rank: 2, monthlyINR: 3500, yearlyINR: 35000, bots: 5, chats: 30000, hasWA: false, hasWL: false },
    'Starter NM': { rank: 2, monthlyINR: 3500, yearlyINR: 35000, bots: 5, chats: 30000, hasWA: false, hasWL: false },
    'Enterprise AI': { rank: 4, monthlyINR: 8999, yearlyINR: 96000, bots: 10, chats: 500000, hasWA: true, hasWL: true },
    'Custom White-Label': { rank: 4, monthlyINR: 8999, yearlyINR: 96000, bots: 10, chats: 500000, hasWA: true, hasWL: true }
  };

  function getPlanRank(planName) {
    if (!planName) return 1;
    const clean = planName.replace(' (WA)', '').trim();
    return PLAN_TIER_META[clean]?.rank ?? (clean.includes('Enterprise') ? 3 : clean.includes('Pro') ? 2 : clean.includes('Custom') ? 4 : 1);
  }

  function getPlanMeta(planName) {
    if (!planName) return PLAN_TIER_META['Pro NY'];
    const clean = planName.replace(' (WA)', '').trim();
    return PLAN_TIER_META[clean] || PLAN_TIER_META['Pro NY'];
  }

  function openPlanModal(clientId, defaultPlan) {
    const client = clientsData.find(c => c.id === clientId) || clientsData[0];
    const initialPlan = defaultPlan || client.plan_name || 'Pro NY';
    const modal = $('#modal-container');

    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="modal-box-card" style="border-top: 4px solid #1877F2; max-width:620px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <div>
              <div style="font-size:1.18rem; font-weight:800; color:#1E293B;">⚡ Plan Activation & Subscription Wizard</div>
              <div style="font-size:0.8rem; color:#64748B;">Manage flexible durations, add-on expiry sync, and plan tier transitions</div>
            </div>
            <button onclick="window.smatApp.closeModal()" style="background:none; border:none; font-size:1.2rem; cursor:pointer;">✕</button>
          </div>

          <form id="plan-activation-form">
            <div style="margin-bottom:1rem;">
              <label class="filter-item-label">Target Client Account</label>
              <select id="plan-target-client" class="custom-dropdown-trigger" style="width:100%;">
                ${clientsData.map(c => `<option value="${c.id}" ${c.id === client.id ? 'selected' : ''}>${c.name} (Current: ${c.plan_name})</option>`).join('')}
              </select>
            </div>

            <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:1rem; margin-bottom:1rem;">
              <div>
                <label class="filter-item-label">Select Plan Tier</label>
                <select id="plan-tier-select" class="custom-dropdown-trigger" style="width:100%;">
                  <option value="Pro" ${initialPlan === 'Pro' || initialPlan.includes('Pro NY') ? 'selected' : ''}>Pro (₹6,500/mo | ₹72,000/yr)</option>
                  <option value="Broadcast" ${initialPlan === 'Broadcast' ? 'selected' : ''}>Broadcast (₹1,499/mo | ₹14,500/yr)</option>
                  <option value="Standard" ${initialPlan === 'Standard' || initialPlan.includes('Starter') ? 'selected' : ''}>Standard (₹3,500/mo | ₹35,000/yr)</option>
                  <option value="AI" ${initialPlan === 'AI' || initialPlan.includes('Enterprise') ? 'selected' : ''}>AI (₹8,999/mo | ₹96,000/yr)</option>
                  <option value="Pro Trial" ${initialPlan.includes('Trial') || initialPlan.includes('Free') ? 'selected' : ''}>Pro Trial (₹0)</option>
                </select>
              </div>
              <div>
                <!-- Point 2: Flexible Subscription Durations -->
                <label class="filter-item-label">Subscription Duration</label>
                <select id="plan-duration-select" class="custom-dropdown-trigger" style="width:100%;">
                  <option value="1">1 Month (Monthly)</option>
                  <option value="2">Custom 2 Months</option>
                  <option value="4">Custom 4 Months</option>
                  <option value="6">Custom 6 Months</option>
                  <option value="9">Custom 9 Months</option>
                  <option value="12" selected>Yearly (12 Mos - Save 20%)</option>
                </select>
              </div>
            </div>

            <!-- Dynamic Calculation Display -->
            <div id="plan-price-calc-box" style="background:#F0F7FF; border:1px solid #BFDBFE; border-radius:8px; padding:0.8rem 1rem; margin-bottom:1rem; font-size:0.85rem; color:#1E40AF;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span><strong>Flexible Pricing Calculation:</strong></span>
                <span id="calc-formula-display" style="font-weight:700;">₹ 11,999 × 10 = ₹ 1,19,990.00 (Yearly)</span>
              </div>
              <div style="font-size:0.75rem; color:#3B82F6; margin-top:3px;">
                💡 Custom durations (2, 4, 6, 9 months) are calculated dynamically from base monthly rate.
              </div>
            </div>

            <!-- Add-on Purchases & Expiry Synchronization -->
            <div style="margin-bottom:1rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                <label class="filter-item-label" style="margin:0;">Add-on Boosters</label>
                <span style="font-size:0.75rem; color:#64748B; font-weight:600;">Auto-Synchronized Expiry</span>
              </div>
              
              <div style="display:flex; flex-direction:column; gap:0.5rem; font-size:0.84rem; color:#334155;">
                <label style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0.8rem; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:6px; cursor:pointer;">
                  <div>
                    <span style="font-weight:600;">+10,000 Conversations Quota</span>
                    <div style="font-size:0.75rem; color:#64748B;">₹1,500 / month • Auto-pay Recurring</div>
                  </div>
                  <div style="display:flex; align-items:center; gap:0.5rem;">
                    <span class="addon-expiry-pill capped" id="addon-preview-expiry">Expires with Plan</span>
                    <input type="checkbox" id="addon-chats" checked />
                  </div>
                </label>

                <label style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0.8rem; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:6px; cursor:pointer;">
                  <div>
                    <span style="font-weight:600;">+1 Dedicated WhatsApp WABA Number</span>
                    <div style="font-size:0.75rem; color:#64748B;">₹2,500 / month • Auto-pay Recurring</div>
                  </div>
                  <div style="display:flex; align-items:center; gap:0.5rem;">
                    <span class="addon-expiry-pill capped">Expires with Plan</span>
                    <input type="checkbox" id="addon-waba" checked />
                  </div>
                </label>

                <label style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0.8rem; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:6px; cursor:pointer;">
                  <div>
                    <span style="font-weight:600;">+1 Additional Live Agent Seat</span>
                    <div style="font-size:0.75rem; color:#64748B;">₹800 • One-Time Booster</div>
                  </div>
                  <div style="display:flex; align-items:center; gap:0.5rem;">
                    <span class="addon-expiry-pill capped">Expires with Plan</span>
                    <input type="checkbox" id="addon-agent" />
                  </div>
                </label>
              </div>

              <div style="font-size:0.75rem; color:#64748B; margin-top:4px; line-height:1.4;">
                🛡️ <strong>Add-on Validity:</strong> Add-ons last up to 30 days, but are automatically synchronized with the main subscription renewal date.
              </div>
            </div>

            <!-- Coupon Code -->
            <div style="margin-bottom:1.25rem;">
              <label class="filter-item-label">Voucher / Coupon Code</label>
              <div style="display:flex; gap:0.5rem;">
                <input type="text" id="voucher-code-input" class="filter-search-box" placeholder="e.g. SMAT50 or WELCOME2026" value="SMAT50" />
                <button type="button" class="btn-filter-reset" onclick="window.smatApp.showToast('Coupon SMAT50 Applied! 50% discount reflected.')">Apply</button>
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; padding-top:0.75rem; border-top:1px solid #E2E8F0;">
              <button type="button" class="btn-table-action btn-action-secondary" onclick="window.smatApp.closeModal()">Cancel</button>
              <button type="submit" id="plan-submit-btn" class="btn-table-action btn-action-primary">
                ⚡ Confirm & Activate Plan
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Dynamic price calculation updater
    function updateCalcDisplay() {
      const targetId = parseInt($('#plan-target-client')?.value || client.id);
      const targetC = clientsData.find(c => c.id === targetId) || client;
      const selectedPlan = $('#plan-tier-select')?.value || 'Pro NY';
      const durationMonths = parseInt($('#plan-duration-select')?.value || '12', 10);
      const meta = getPlanMeta(selectedPlan);

      const baseMonthly = targetC.currency_type === 'USD' ? meta.monthlyUSD : meta.monthlyINR;
      const currencySymbol = targetC.currency_type === 'USD' ? '$ ' : '₹ ';

      let total = 0;
      let formulaText = '';
      if (durationMonths === 12) {
        total = meta.yearlyINR ? (targetC.currency_type === 'USD' ? meta.yearlyUSD : meta.yearlyINR) : baseMonthly * 10;
        formulaText = `${currencySymbol}${total.toLocaleString()} billed yearly (Save ${meta.yearlySavingsPercent || 15}%) • Quotas credited UPFRONT`;
      } else {
        total = baseMonthly * durationMonths;
        formulaText = `${currencySymbol}${baseMonthly.toLocaleString()} × ${durationMonths} Months = ${currencySymbol}${total.toLocaleString()}`;
      }

      const calcEl = $('#calc-formula-display');
      if (calcEl) calcEl.innerText = formulaText;

      // Downgrade detection
      const currentRank = getPlanRank(targetC.plan_name);
      const targetRank = meta.rank;
      const submitBtn = $('#plan-submit-btn');

      if (submitBtn) {
        if (targetRank < currentRank) {
          submitBtn.className = 'btn-table-action btn-action-warning';
          submitBtn.style.background = '#EA580C';
          submitBtn.style.borderColor = '#EA580C';
          submitBtn.style.color = '#FFFFFF';
          submitBtn.innerHTML = '⚠️ Assess Downgrade Impact & Proceed';
        } else {
          submitBtn.className = 'btn-table-action btn-action-primary';
          submitBtn.style.background = '#1877F2';
          submitBtn.style.borderColor = '#1877F2';
          submitBtn.style.color = '#FFFFFF';
          submitBtn.innerHTML = '⚡ Confirm & Activate Plan';
        }
      }
    }

    $('#plan-tier-select')?.addEventListener('change', updateCalcDisplay);
    $('#plan-duration-select')?.addEventListener('change', updateCalcDisplay);
    $('#plan-target-client')?.addEventListener('change', updateCalcDisplay);
    updateCalcDisplay();

    // Form submit
    $('#plan-activation-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const targetId = parseInt($('#plan-target-client').value);
      const selectedPlan = $('#plan-tier-select').value;
      const durationMonths = parseInt($('#plan-duration-select').value, 10);
      const targetClient = clientsData.find(c => c.id === targetId) || client;

      const currentRank = getPlanRank(targetClient.plan_name);
      const targetRank = getPlanMeta(selectedPlan).rank;

      const selectedAddons = [];
      if ($('#addon-chats')?.checked) selectedAddons.push({ name: '+10,000 Conversations Quota', priceINR: 1500, type: 'recurring' });
      if ($('#addon-waba')?.checked) selectedAddons.push({ name: '+1 Dedicated WhatsApp WABA Number', priceINR: 2500, type: 'recurring' });
      if ($('#addon-agent')?.checked) selectedAddons.push({ name: '+1 Additional Live Agent Seat', priceINR: 800, type: 'one_time' });

      // Point 8: If Downgrade, trigger Admin Downgrade Impact Assessment modal!
      if (targetRank < currentRank) {
        closeModal();
        openDowngradeImpactModal(targetId, selectedPlan, durationMonths, selectedAddons);
        return;
      }

      // Upgrade / Renewal direct activation
      applyPlanActivation(targetClient, selectedPlan, durationMonths, selectedAddons);
    });
  }

  // Helper: Apply Plan Activation
  function applyPlanActivation(targetClient, selectedPlan, durationMonths, selectedAddons) {
    const meta = getPlanMeta(selectedPlan);
    const isYearly = durationMonths === 12;
    const baseMonthly = targetClient.currency_type === 'USD' ? meta.monthlyUSD : meta.monthlyINR;
    const totalAmount = isYearly ? baseMonthly * 10 : baseMonthly * durationMonths;

    targetClient.plan_name = selectedPlan;
    targetClient.plan_type = meta.monthlyINR > 0 ? 'Paid_plan' : 'Trial_plan';
    targetClient.billing_cycle = isYearly ? 'Yearly' : (durationMonths > 1 ? `Custom (${durationMonths} Mos)` : 'Monthly');
    targetClient.subscription_status = 'Active';
    targetClient.days_left = durationMonths * 30;
    targetClient.bots_limit = meta.bots;
    targetClient.chats_limit = meta.chats;

    // Calculate effective end date
    const now = new Date();
    const endDate = new Date(now.getTime() + durationMonths * 30 * 24 * 60 * 60 * 1000);
    targetClient.end_date = `${String(endDate.getDate()).padStart(2, '0')}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${endDate.getFullYear()}`;
    targetClient.subscription_amount_display = targetClient.currency_type === 'USD' ? `$ ${totalAmount.toFixed(2)}` : `₹ ${totalAmount.toLocaleString('en-IN')}.00`;

    // Process add-ons with Point 3 Expiry Priority
    targetClient.active_addons = selectedAddons.map(addon => {
      const std30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const effectiveExpiry = endDate < std30 ? endDate : std30;
      return {
        id: `addon_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name: addon.name,
        type: addon.type,
        expiryDate: `${String(effectiveExpiry.getDate()).padStart(2, '0')}-${String(effectiveExpiry.getMonth() + 1).padStart(2, '0')}-${effectiveExpiry.getFullYear()}`,
        cappedBySubscription: endDate < std30
      };
    });

    showToast(`Plan successfully activated for ${targetClient.name} (${durationMonths} Mos)!`);
    closeModal();
    if (currentRoute === 'plans') renderPlansView($('#route-viewport'));
    else if (currentRoute === 'client-details') renderClientDetailsView($('#route-viewport'));
    else if (currentRoute === 'client-details-profile') renderClientDetailsProfileView($('#route-viewport'));
  }

  // =========================================================================
  // POINT 8: ADMIN PANEL – DOWNGRADE IMPACT ASSESSMENT MODAL
  // =========================================================================
  function openDowngradeImpactModal(clientId, targetPlanName, durationMonths, selectedAddons) {
    const client = clientsData.find(c => c.id === clientId) || clientsData[0];
    const currentMeta = getPlanMeta(client.plan_name);
    const targetMeta = getPlanMeta(targetPlanName);
    const modal = $('#modal-container');

    // Real client usage calculation
    const botsUsed = client.bots_used || 0;
    const chatsUsed = client.chats_used || 0;
    const botsExceeded = Math.max(0, botsUsed - targetMeta.bots);
    const chatsExceeded = Math.max(0, chatsUsed - targetMeta.chats);
    const hasWA = client.plan_name?.includes('WA') || client.plan_name?.includes('Pro');
    const waBlocked = hasWA && !targetMeta.hasWA;
    const isWL = client.deployment_type === 'White-Label';
    const wlBlocked = isWL && !targetMeta.hasWL;

    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="impact-modal-box">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <div>
              <div style="font-size:1.15rem; font-weight:800; color:#9A3412; display:flex; align-items:center; gap:0.5rem;">
                <span>⚠️ Admin Downgrade Impact Assessment</span>
              </div>
              <div style="font-size:0.8rem; color:#64748B;">Account: <strong>${client.name}</strong> (${client.email})</div>
            </div>
            <button onclick="window.smatApp.closeModal()" style="background:none; border:none; font-size:1.2rem; cursor:pointer;">✕</button>
          </div>

          <!-- Alert Banner -->
          <div class="impact-alert-banner">
            <span style="font-size:1.3rem;">🚨</span>
            <div>
              <strong>Action Required:</strong> You are downgrading this account from a higher tier. SmatBot has evaluated the account's live usage and identified configurations that will be disrupted.
            </div>
          </div>

          <!-- Plan Comparison Header -->
          <div class="impact-comparison-header">
            <div>
              <div style="font-size:0.75rem; color:#64748B; margin-bottom:2px;">Current Active Plan</div>
              <span class="impact-plan-pill current">${client.plan_name}</span>
            </div>
            <div style="font-size:1.2rem; color:#94A3B8; font-weight:700;">➔</div>
            <div>
              <div style="font-size:0.75rem; color:#64748B; margin-bottom:2px;">Target Downgraded Plan</div>
              <span class="impact-plan-pill target">${targetPlanName}</span>
            </div>
          </div>

          <!-- Section 1: Usage Limits Exceeded -->
          <div class="impact-section-title">
            <span>📊 Usage Limits Impact</span>
          </div>

          ${botsExceeded > 0 ? `
            <div class="impact-item-box danger">
              <div>
                <strong>Active Chatbots Exceeded (${botsUsed} / ${targetMeta.bots} allowed)</strong>
                <div style="font-size:0.78rem; color:#64748B; margin-top:2px;">Client currently has ${botsUsed} live bots. The new plan only permits ${targetMeta.bots} bots.</div>
              </div>
              <span class="impact-badge-tag exceeded">-${botsExceeded} Bots To Pause</span>
            </div>
          ` : `
            <div class="impact-item-box safe">
              <div><strong>Chatbot Allocation:</strong> ${botsUsed} of ${targetMeta.bots} bots used</div>
              <span class="impact-badge-tag safe">Within Limit</span>
            </div>
          `}

          ${chatsExceeded > 0 ? `
            <div class="impact-item-box danger">
              <div>
                <strong>Conversations Quota (${chatsUsed.toLocaleString()} / ${targetMeta.chats.toLocaleString()})</strong>
                <div style="font-size:0.78rem; color:#64748B; margin-top:2px;">Current month chats exceed new plan capacity. Live chats will pause unless quota add-on is purchased.</div>
              </div>
              <span class="impact-badge-tag exceeded">Exceeded by ${chatsExceeded.toLocaleString()}</span>
            </div>
          ` : `
            <div class="impact-item-box safe">
              <div><strong>Conversations Quota:</strong> ${chatsUsed.toLocaleString()} of ${targetMeta.chats.toLocaleString()} chats</div>
              <span class="impact-badge-tag safe">Within Limit</span>
            </div>
          `}

          <!-- Section 2: Features Becoming Unavailable -->
          <div class="impact-section-title">
            <span>🚫 Features Becoming Unavailable</span>
          </div>

          ${waBlocked ? `
            <div class="impact-item-box danger">
              <div>
                <strong>WhatsApp WABA Business Cloud API</strong>
                <div style="font-size:0.78rem; color:#64748B; margin-top:2px;">Meta webhook and WhatsApp bot message automation will be disconnected immediately.</div>
              </div>
              <span class="impact-badge-tag blocked">Disconnected</span>
            </div>
          ` : ''}

          ${wlBlocked ? `
            <div class="impact-item-box danger">
              <div>
                <strong>White-Label Domain & Reseller Hub (${client.custom_domain || 'Custom Domain'})</strong>
                <div style="font-size:0.78rem; color:#64748B; margin-top:2px;">Custom domain will revert to default smatbot.com subdomain. Reseller sub-clients will be locked out.</div>
              </div>
              <span class="impact-badge-tag blocked">Reverted</span>
            </div>
          ` : ''}

          <div class="impact-item-box warning">
            <div>
              <strong>AI Vector Embeddings & Custom LLM Fallback</strong>
              <div style="font-size:0.78rem; color:#64748B; margin-top:2px;">Document training switched to read-only rule matching. Token consumption halted.</div>
            </div>
            <span class="impact-badge-tag exceeded">Restricted</span>
          </div>

          <!-- Section 3: Safe Features Continuing to Work -->
          <div class="impact-section-title">
            <span>✅ Features That Will Continue to Work</span>
          </div>
          <div class="impact-item-box safe">
            <div>
              <strong>Core Chatbot Automation & Web Widget</strong>
              <div style="font-size:0.78rem; color:#64748B; margin-top:2px;">Web live chat widget, lead capture forms, and basic email notifications remain fully operational.</div>
            </div>
            <span class="impact-badge-tag safe">Active</span>
          </div>

          <!-- Section 4: Required Admin Actions -->
          <div class="impact-section-title">
            <span>📋 Required Pre-Downgrade Actions</span>
          </div>
          <ul class="impact-action-list">
            ${botsExceeded > 0 ? `<li>⚠️ <strong>Archive ${botsExceeded} Bot(s):</strong> Confirm which bots to deactivate before final execution.</li>` : ''}
            ${waBlocked ? `<li>⚠️ <strong>Export WhatsApp Data:</strong> Notify client to back up customer transcripts.</li>` : ''}
            <li>⚠️ <strong>Audit Add-on Renewals:</strong> Confirm with client that recurring add-ons will align with the new plan tier.</li>
          </ul>

          <!-- Checkbox Confirmation -->
          <label class="impact-ack-checkbox">
            <input type="checkbox" id="impact-ack-check" onchange="document.getElementById('confirm-downgrade-btn').disabled = !this.checked;" />
            <span>I have reviewed this Downgrade Impact Assessment with the client and verify that the required feature deactivations are accepted.</span>
          </label>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1rem;">
            <button type="button" class="btn-table-action btn-action-secondary" onclick="window.smatApp.openPlanModal(${client.id}, '${targetPlanName}')">
              ← Back to Plan Selector
            </button>
            <button type="button" id="confirm-downgrade-btn" class="btn-table-action btn-action-warning" style="background:#EA580C; border-color:#EA580C; color:#FFFFFF;" disabled onclick="window.smatApp.executeDowngrade(${client.id}, '${targetPlanName}', ${durationMonths})">
              🛡️ Confirm & Execute Downgrade
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function executeDowngrade(clientId, targetPlanName, durationMonths) {
    const client = clientsData.find(c => c.id === clientId);
    if (!client) return;

    applyPlanActivation(client, targetPlanName, durationMonths, []);
    showToast(`Downgrade applied to ${client.name} (${targetPlanName}). Impact logged in audit trail.`);
  }

  // =========================================================================
  // POINT 5: AUTO-PAY MANAGEMENT MODAL
  // =========================================================================
  function openAutoPayModal(clientId) {
    const client = clientsData.find(c => c.id === clientId) || clientsData[0];
    const isEnabled = client.autopay_enabled !== false;
    const modal = $('#modal-container');

    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="modal-box-card" style="max-width:520px; border-top:4px solid #1877F2;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.2rem;">
            <div style="font-size:1.15rem; font-weight:800; color:#1E293B;">💳 Auto-Pay Renewal Settings</div>
            <button onclick="window.smatApp.closeModal()" style="background:none; border:none; font-size:1.2rem; cursor:pointer;">✕</button>
          </div>

          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:1rem; margin-bottom:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-weight:700; color:#1E293B;">Auto-Pay Recurring Debits</div>
                <div style="font-size:0.8rem; color:#64748B;">For Plan renewals & recurring add-ons</div>
              </div>
              <span class="autopay-status-badge ${isEnabled ? 'enabled' : 'disabled'}">
                ${isEnabled ? '🟢 ACTIVE' : '⚪ DISABLED'}
              </span>
            </div>
          </div>

          <!-- Clear Communication Banner -->
          <div style="background:#EFF6FF; border:1px solid #BFDBFE; border-left:4px solid #1877F2; border-radius:8px; padding:0.85rem 1rem; margin-bottom:1.25rem; font-size:0.84rem; color:#1E40AF; line-height:1.5;">
            <strong>🛡️ Important Information:</strong><br/>
            Disabling auto-pay will <strong>NOT cancel your active subscription</strong> or remove access to paid features. Your current plan (${client.plan_name}) remains 100% active until <strong>${client.end_date || 'expiry date'}</strong>. Only automated future card charges will be turned off.
          </div>

          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" class="btn-table-action btn-action-secondary" onclick="window.smatApp.closeModal()">Close</button>
            <button type="button" class="btn-table-action ${isEnabled ? 'btn-action-warning' : 'btn-action-primary'}" onclick="window.smatApp.toggleAutoPay(${client.id}, ${!isEnabled})">
              ${isEnabled ? 'Turn OFF Auto-Pay' : 'Turn ON Auto-Pay'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function toggleAutoPay(clientId, newStatus) {
    const client = clientsData.find(c => c.id === clientId);
    if (!client) return;
    client.autopay_enabled = newStatus;
    showToast(newStatus ? 'Auto-Pay enabled for future renewals.' : 'Auto-Pay disabled. Plan remains active till expiry.');
    closeModal();
    if (currentRoute === 'client-details-profile') renderClientDetailsProfileView($('#route-viewport'));
  }

  // =========================================================================
  // POINT 6: SUBSCRIPTION CANCELLATION MODAL (2 CHOICES)
  // =========================================================================
  function openCancelSubscriptionModal(clientId) {
    const client = clientsData.find(c => c.id === clientId) || clientsData[0];
    const modal = $('#modal-container');

    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="modal-box-card" style="max-width:560px; border-top:4px solid #EF4444;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <div style="font-size:1.15rem; font-weight:800; color:#991B1B;">🚫 Cancel Subscription</div>
            <button onclick="window.smatApp.closeModal()" style="background:none; border:none; font-size:1.2rem; cursor:pointer;">✕</button>
          </div>

          <div style="font-size:0.85rem; color:#475569; margin-bottom:1rem;">
            Account: <strong>${client.name}</strong> • Current Plan: <strong>${client.plan_name}</strong>
          </div>

          <!-- Point 6 Choice 1: Cancel at End of Billing Period -->
          <div class="billing-choice-card selected" id="cancel-card-end" onclick="window.smatApp.selectCancelOption('end')">
            <input type="radio" name="cancel-type" id="cancel-opt-end" class="billing-choice-radio" value="end_of_period" checked />
            <div style="flex:1;">
              <div class="billing-choice-title">Cancel at the end of current billing period (Recommended)</div>
              <div class="billing-choice-desc">
                Your subscription remains fully active until <strong>${client.end_date || 'renewal date'}</strong>. You keep full access to all paid bots, chats, and add-on boosters until then. No further charges will occur.
              </div>
              <div style="margin-top:4px; font-size:0.75rem; color:#1877F2; font-weight:600;">
                Effective Cancellation Date: ${client.end_date || '30-10-2026'}
              </div>
            </div>
          </div>

          <!-- Point 6 Choice 2: Cancel Immediately -->
          <div class="billing-choice-card" id="cancel-card-immediate" onclick="window.smatApp.selectCancelOption('immediate')">
            <input type="radio" name="cancel-type" id="cancel-opt-immediate" class="billing-choice-radio" value="immediate" />
            <div style="flex:1;">
              <div class="billing-choice-title" style="color:#B91C1C;">Cancel immediately</div>
              <div class="billing-choice-desc">
                Terminate the subscription today. Access to chatbots, WhatsApp routing, and active add-ons will stop immediately in accordance with billing terms.
              </div>
              <div style="margin-top:4px; font-size:0.75rem; color:#EF4444; font-weight:600;">
                Effective Cancellation Date: Today (${new Date().toLocaleDateString()})
              </div>
            </div>
          </div>

          <div style="margin:1rem 0;">
            <label class="filter-item-label">Reason for Cancellation</label>
            <select id="cancel-reason-select" class="custom-dropdown-trigger" style="width:100%;">
              <option value="Cost / Pricing">Cost / Pricing</option>
              <option value="Missing Features">Missing Features</option>
              <option value="Switching to Another Platform">Switching to Another Platform</option>
              <option value="Temporary Pause">Temporary Pause</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #E2E8F0; padding-top:0.75rem;">
            <button type="button" class="btn-table-action btn-action-secondary" onclick="window.smatApp.closeModal()">Keep Subscription</button>
            <button type="button" class="btn-table-action" style="background:#DC2626; color:#FFFFFF; border-color:#DC2626;" onclick="window.smatApp.confirmSubscriptionCancellation(${client.id})">
              Confirm Cancellation
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function selectCancelOption(type) {
    const endCard = $('#cancel-card-end');
    const immCard = $('#cancel-card-immediate');
    const optEnd = $('#cancel-opt-end');
    const optImm = $('#cancel-opt-immediate');

    if (type === 'end') {
      endCard?.classList.add('selected');
      immCard?.classList.remove('selected');
      if (optEnd) optEnd.checked = true;
    } else {
      immCard?.classList.add('selected');
      endCard?.classList.remove('selected');
      if (optImm) optImm.checked = true;
    }
  }

  function confirmSubscriptionCancellation(clientId) {
    const client = clientsData.find(c => c.id === clientId);
    if (!client) return;

    const isImmediate = $('#cancel-opt-immediate')?.checked;
    if (isImmediate) {
      client.subscription_status = 'Cancelled';
      client.days_left = 0;
      client.active_addons = [];
      showToast(`Subscription for ${client.name} cancelled immediately.`);
    } else {
      client.cancellation_status = 'pending_end_of_period';
      client.autopay_enabled = false;
      showToast(`Subscription scheduled to cancel on ${client.end_date}. Access remains active.`);
    }
    closeModal();
    if (currentRoute === 'client-details-profile') renderClientDetailsProfileView($('#route-viewport'));
  }

  // =========================================================================
  // POINT 4: PAYMENT METHOD MANAGEMENT MODAL
  // =========================================================================
  function openUpdatePaymentMethodModal(clientId) {
    const client = clientsData.find(c => c.id === clientId) || clientsData[0];
    const currentPM = client.payment_method || { brand: 'Visa', last4: '4242', expiry: '12/28' };
    const modal = $('#modal-container');

    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="modal-box-card" style="max-width:480px; border-top:4px solid #1877F2;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <div style="font-size:1.15rem; font-weight:800; color:#1E293B;">💳 Update Payment Method</div>
            <button onclick="window.smatApp.closeModal()" style="background:none; border:none; font-size:1.2rem; cursor:pointer;">✕</button>
          </div>

          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:0.75rem 1rem; margin-bottom:1rem; font-size:0.84rem;">
            <span style="color:#64748B;">Current Card:</span> <strong>${currentPM.brand} •••• ${currentPM.last4}</strong> (Expires ${currentPM.expiry})
          </div>

          <form id="update-payment-form">
            <div style="margin-bottom:0.75rem;">
              <label class="filter-item-label">Cardholder Name</label>
              <input type="text" id="pm-cardholder" class="filter-search-box" value="${currentPM.holderName || client.name}" required />
            </div>

            <div style="margin-bottom:0.75rem;">
              <label class="filter-item-label">Card Number</label>
              <input type="text" id="pm-cardnumber" class="filter-search-box" placeholder="4242 •••• •••• 8899" value="•••• •••• •••• 8899" required />
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1rem;">
              <div>
                <label class="filter-item-label">Expiry (MM/YY)</label>
                <input type="text" id="pm-expiry" class="filter-search-box" placeholder="08/29" value="08/29" required />
              </div>
              <div>
                <label class="filter-item-label">CVV</label>
                <input type="password" id="pm-cvv" class="filter-search-box" placeholder="•••" value="123" required />
              </div>
            </div>

            <!-- Applied to Future Renewals Note -->
            <div style="font-size:0.78rem; color:#15803D; background:#F0FDF4; border:1px solid #BBF7D0; border-radius:6px; padding:0.6rem 0.8rem; margin-bottom:1.25rem;">
              ✅ <strong>Primary Payment Method:</strong> This payment method will be applied automatically to all future subscription renewals and recurring add-on charges.
            </div>

            <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
              <button type="button" class="btn-table-action btn-action-secondary" onclick="window.smatApp.closeModal()">Cancel</button>
              <button type="submit" class="btn-table-action btn-action-primary">Save Payment Method</button>
            </div>
          </form>
        </div>
      </div>
    `;

    $('#update-payment-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const holder = $('#pm-cardholder').value;
      const exp = $('#pm-expiry').value;

      client.payment_method = {
        brand: 'Mastercard',
        last4: '8899',
        expiry: exp,
        holderName: holder
      };

      showToast(`Payment method updated to Mastercard ending in •••• 8899`);
      closeModal();
      if (currentRoute === 'client-details-profile') renderClientDetailsProfileView($('#route-viewport'));
    });
  }


  // =========================================================================
  // 8. MODULE 5: LOGIN TO DASHBOARD (CLIENT CONFIRMATION MODAL & DASHBOARD)
  // =========================================================================
  function openLoginConfirmModal(clientId) {
    const client = clientsData.find(c => c.id === clientId) || clientsData[0];
    const modal = $('#modal-container');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-overlay open" onclick="if(event.target === this) window.smatApp.closeModal()">
        <div class="confirm-login-modal-box">
          <button class="btn-confirm-modal-close" onclick="window.smatApp.closeModal()" title="Close">✕</button>
          <div class="confirm-login-title">Are you sure you want to Login ?</div>
          <div class="confirm-login-btn-row">
            <button class="btn-confirm-no" onclick="window.smatApp.closeModal()">No</button>
            <button class="btn-confirm-yes" onclick="window.smatApp.confirmLoginToDashboard(${client.id})">Yes</button>
          </div>
        </div>
      </div>
    `;
  }

  function confirmLoginToDashboard(clientId) {
    const client = clientsData.find(c => c.id === clientId) || clientsData[0];
    impersonatingClient = client;
    closeModal();
    showToast(`Logged into ${client.name} Dashboard`);
    renderClientPortalSimulator(client);
  }

  function loginToDashboard(clientId) {
    openLoginConfirmModal(clientId);
  }

  function exitImpersonation() {
    impersonatingClient = null;
    showToast('Exited client dashboard. Returned to Admin Control Center.');
    loadAppShell();
  }

  let clientBotSearchQuery = '';

  function filterClientBots(query) {
    clientBotSearchQuery = (query || '').toLowerCase().trim();
    const cards = $$('.client-bot-card');
    cards.forEach(card => {
      const title = card.querySelector('.client-bot-title-text')?.innerText?.toLowerCase() || '';
      if (!clientBotSearchQuery || title.includes(clientBotSearchQuery)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  function toggleBotActiveStatus(botName, isActive) {
    showToast(`Bot "${botName}" is now ${isActive ? 'Active (Online)' : 'Paused (Offline)'}`);
  }

  function renderClientPortalSimulator(client) {
    const app = $('#app-mount');
    
    // Determine the client bot name matching Screenshot 2 (AlignBooks for Shrishti Jajodia or company name)
    let botList = [];
    if (client.name.includes('Shrishti') || client.email.includes('alignbooks')) {
      botList = [
        { id: 1, name: 'AlignBooks', isActive: true }
      ];
    } else if (client.name.includes('Solaris')) {
      botList = [
        { id: 1, name: 'Solaris Green Bot', isActive: true },
        { id: 2, name: 'Solaris Lead Flow', isActive: true }
      ];
    } else {
      const baseName = client.url && client.url !== '-' ? client.url.split('.')[0] : (client.name.split(' ')[0] + ' Bot');
      const formatted = baseName.charAt(0).toUpperCase() + baseName.slice(1);
      botList = [
        { id: 1, name: formatted, isActive: true }
      ];
    }

    const clientInitial = (client.name.split(' ')[0][0] || 'S').toUpperCase();

    app.innerHTML = `
      <div class="client-portal-root">
        <!-- Top Address Simulation Bar with Return to Admin Option -->
        <div class="portal-sim-browser-bar">
          <div class="portal-sim-url-badge">
            <span class="portal-sim-lock-icon">🔒</span>
            <span class="portal-sim-url-text">app.smatbot.com/dashboard?is_whitelabelled=true</span>
          </div>
          <button class="btn-portal-exit-admin" onclick="window.smatApp.exitImpersonation()">
            ← Back to Admin Panel
          </button>
        </div>

        <!-- Client Portal Workspace -->
        <div class="client-portal-layout">
          <!-- Slim Left Navigation Sidebar (Matching Screenshot 2) -->
          <aside class="client-portal-sidebar">
            <div class="client-sidebar-item active" title="Dashboard">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
            <div class="client-sidebar-item" title="User Management" onclick="window.smatApp.showToast('Opened Client User Management')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="client-sidebar-item" title="Bot Templates & Flows" onclick="window.smatApp.showToast('Opened Bot Flow Catalog')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
            </div>
            <div class="client-sidebar-item" title="Integrations & Settings" onclick="window.smatApp.showToast('Opened CRM & Webhook Settings')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </div>
            <div class="client-sidebar-item" title="Live Bot Console" onclick="window.smatApp.showToast('Opened Live Conversation Console')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 12h8"></path>
                <path d="M12 8v8"></path>
              </svg>
            </div>
            <!-- Point 1-7: Client Self-Service Billing Sidebar Tab -->
            <div class="client-sidebar-item" id="client-nav-billing" title="Subscription & Billing" onclick="window.smatApp.renderClientBillingPortal()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
            </div>
          </aside>


          <!-- Main Viewport Area -->
          <div class="client-portal-viewport">
            <!-- Header (Create new bot + User Pill) -->
            <header class="client-portal-header">
              <div class="client-portal-header-left"></div>

              <div class="client-portal-header-right">
                <button class="btn-portal-create-bot" onclick="window.smatApp.showToast('Create New Bot Wizard Opened')">
                  + Create new bot
                </button>

                <div class="client-portal-user-pill" onclick="window.smatApp.showToast('Client Account: ${client.name}')">
                  <div class="client-portal-user-avatar">${clientInitial}</div>
                  <div class="client-portal-user-meta">
                    <span class="client-portal-user-name">${client.name}</span>
                    <span class="client-portal-user-email">${client.email}</span>
                  </div>
                  <span class="client-portal-status-dot"></span>
                  <span class="client-portal-caret">▾</span>
                </div>
              </div>
            </header>

            <!-- Body Area -->
            <main class="client-portal-body">
              <!-- Filter & Search Bar (Matching Screenshot 2) -->
              <div class="client-portal-filter-bar">
                <div class="client-filter-dropdown-pill" onclick="window.smatApp.showToast('Filter: All Bots')">
                  <span>All</span>
                  <span class="client-filter-arrow">▾</span>
                </div>

                <div class="client-search-input-wrapper">
                  <input 
                    type="text" 
                    class="client-portal-search-input" 
                    placeholder="Search here for bot" 
                    oninput="window.smatApp.filterClientBots(this.value)"
                  />
                  <span class="client-search-icon">🔍</span>
                </div>
              </div>

              <!-- Bots Grid (Matching Screenshot 2) -->
              <div class="client-bots-grid">
                ${botList.map(bot => `
                  <div class="client-bot-card">
                    <div class="client-bot-card-top">
                      <!-- Left: Blue Logo & Title -->
                      <div class="client-bot-card-logo-col">
                        <div class="client-bot-circle-icon">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="#FFFFFF">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 12c-1.5 0-2.5-.8-2.5-.8s.5 1.8 2.5 1.8 2.5-1.8 2.5-1.8-1 .8-2.5.8zM8 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm8 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                          </svg>
                        </div>
                        <div class="client-bot-title-text" title="${bot.name}">${bot.name}</div>
                      </div>

                      <!-- Right: 2x3 Grid of 6 Action Tools -->
                      <div class="client-bot-actions-grid">
                        <button class="client-bot-tool-btn" title="Flow Builder / Settings" onclick="window.smatApp.showToast('Opening Flow Builder for ${bot.name}')">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                          </svg>
                        </button>
                        <button class="client-bot-tool-btn" title="Notification Alerts" onclick="window.smatApp.showToast('Opening Notification Settings for ${bot.name}')">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                          </svg>
                        </button>
                        <button class="client-bot-tool-btn" title="Broadcast Campaigns" onclick="window.smatApp.showToast('Opening Broadcast Campaigns for ${bot.name}')">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                          </svg>
                        </button>
                        <button class="client-bot-tool-btn" title="Live Chat & Inbox" onclick="window.smatApp.showToast('Opening Live Chat Inbox for ${bot.name}')">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                        </button>
                        <button class="client-bot-tool-btn" title="Leads & Contacts" onclick="window.smatApp.showToast('Opening Leads Database for ${bot.name}')">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                        </button>
                        <button class="client-bot-tool-btn" title="Analytics & Reports" onclick="window.smatApp.showToast('Opening Bot Analytics for ${bot.name}')">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="20" x2="18" y2="10"></line>
                            <line x1="12" y1="20" x2="12" y2="4"></line>
                            <line x1="6" y1="20" x2="6" y2="14"></line>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <!-- Bottom Bar: Toggle + 3 Dots -->
                    <div class="client-bot-card-bottom">
                      <label class="client-toggle-switch" title="Toggle Bot Active/Inactive">
                        <input type="checkbox" ${bot.isActive ? 'checked' : ''} onchange="window.smatApp.toggleBotActiveStatus('${bot.name}', this.checked)" />
                        <span class="client-toggle-slider"></span>
                      </label>

                      <button class="client-bot-more-btn" title="More Options" onclick="window.smatApp.showToast('Bot Options: Flow Settings, Clone Bot, Embed Script, Delete')">
                        •••
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>

              <!-- Floating Live Chat Widget Launcher (Bottom Right) -->
              <div class="client-floating-widget-launcher" onclick="window.smatApp.showToast('Client Website Bot Widget Live Preview')">
                <span class="client-hey-text">Hey</span>
                <div class="client-launcher-circle">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                  </svg>
                  <span class="client-launcher-online-dot"></span>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div id="toast-container"></div>
      </div>
    `;
  }

  function renderClientBillingPortal() {
    const client = impersonatingClient || clientsData[0];
    const main = $('.client-portal-body');
    if (!main) return;

    // Update sidebar active states
    $$('.client-sidebar-item').forEach(el => el.classList.remove('active'));
    const billingTab = $('#client-nav-billing');
    if (billingTab) billingTab.classList.add('active');

    main.innerHTML = `
      <div style="padding:1.5rem; max-width:960px; margin:0 auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
          <div>
            <div style="font-size:1.35rem; font-weight:800; color:#1E293B;">💳 Subscription & Billing Management</div>
            <div style="font-size:0.85rem; color:#64748B;">Client Self-Service Portal for <strong>${client.name}</strong></div>
          </div>
          <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.returnToClientBotsGrid()">
            ← Back to Bots Dashboard
          </button>
        </div>

        <!-- Active Plan Overview Banner -->
        <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; padding:1.5rem; margin-bottom:1.5rem; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
            <div>
              <span class="status-pill active" style="font-size:0.75rem; text-transform:uppercase;">ACTIVE SUBSCRIPTION</span>
              <div style="font-size:1.5rem; font-weight:800; color:#0F172A; margin:0.4rem 0;">${client.plan_name}</div>
              <div style="font-size:0.88rem; color:#64748B;">
                Billing Cycle: <strong>${client.billing_cycle || 'Monthly'}</strong> • Auto-renews on: <strong style="color:#2563EB;">${client.end_date}</strong> (${client.days_left} Days Left)
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:1.5rem; font-weight:800; color:#1877F2;">${client.subscription_amount_display || '₹ 0.00'}</div>
              <div style="margin-top:0.5rem; display:flex; gap:0.5rem; justify-content:flex-end;">
                <!-- Point 7: Self-service plan upgrade available online -->
                <button class="btn-table-action btn-action-primary" onclick="window.smatApp.openPlanModal(${client.id})">
                  ⚡ Upgrade Plan Online
                </button>
              </div>
            </div>
          </div>

          <!-- Plan Downgrades Restricted to Support Notice -->
          <div style="margin-top:1.25rem; background:#FFFBEB; border:1px solid #FDE68A; border-left:4px solid #F59E0B; border-radius:8px; padding:0.85rem 1rem; font-size:0.84rem; color:#92400E; line-height:1.5;">
            <strong>ℹ️ Plan Downgrade Policy:</strong><br/>
            Plan downgrades are not available directly online to prevent accidental disruption to your live chatbots, WhatsApp numbers, and workflows. To request a plan downgrade, please contact our Support or Sales team at <a href="mailto:support@smatbot.com" style="color:#D97706; font-weight:700;">support@smatbot.com</a> for an account usage assessment.
          </div>
        </div>

        <!-- Two-Column Grid: Payment & Auto-Pay -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; margin-bottom:1.5rem;">
          <!-- Auto-Pay Management Card -->
          <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; padding:1.25rem; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <div style="font-weight:700; font-size:1rem; color:#1E293B;">Auto-Pay Settings</div>
              <span class="autopay-status-badge ${client.autopay_enabled !== false ? 'enabled' : 'disabled'}">
                ${client.autopay_enabled !== false ? '🟢 Active' : '⚪ Off'}
              </span>
            </div>
            <p style="font-size:0.83rem; color:#64748B; line-height:1.5; margin-bottom:1rem;">
              ${client.autopay_enabled !== false 
                ? 'Your subscription is set to renew automatically using your saved card. Disabling will not cancel your current term.' 
                : 'Auto-renewal is paused. Your current subscription stays active until ' + client.end_date + '.'}
            </p>
            <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.openAutoPayModal(${client.id})">
              ⚙️ Manage Auto-Pay
            </button>
          </div>

          <!-- Payment Method Card -->
          <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; padding:1.25rem; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <div style="font-weight:700; font-size:1rem; color:#1E293B;">Saved Payment Method</div>
              <span style="font-size:0.75rem; color:#15803D; font-weight:700;">DEFAULT</span>
            </div>
            <div style="font-size:0.95rem; font-weight:600; color:#334155; margin-bottom:0.25rem;">
              💳 ${client.payment_method?.brand || 'Visa'} ending in •••• ${client.payment_method?.last4 || '4242'}
            </div>
            <p style="font-size:0.82rem; color:#64748B; margin-bottom:1rem;">
              Expires: ${client.payment_method?.expiry || '12/28'} • Applied to all future renewals and recurring add-ons.
            </p>
            <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.openUpdatePaymentMethodModal(${client.id})">
              💳 Update Card
            </button>
          </div>
        </div>

        <!-- Active Add-ons Section -->
        <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; padding:1.25rem; margin-bottom:1.5rem; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <div>
              <div style="font-weight:700; font-size:1rem; color:#1E293B;">Active Add-ons & Boosters</div>
              <div style="font-size:0.8rem; color:#64748B;">Monthly add-ons always synchronize expiry with your main subscription end date.</div>
            </div>
            <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.openPlanModal(${client.id})">
              + Purchase Add-on
            </button>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.6rem;">
            ${(client.active_addons && client.active_addons.length > 0) ? client.active_addons.map(addon => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:0.75rem 1rem; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; font-size:0.86rem;">
                <div>
                  <strong>${addon.name}</strong>
                  <span style="font-size:0.75rem; color:#64748B; margin-left:6px;">(${addon.type || 'recurring'})</span>
                </div>
                <div style="display:flex; align-items:center; gap:0.75rem;">
                  <span class="addon-expiry-pill capped">
                    Expires: ${addon.expiryDate || client.end_date} (Capped by Plan)
                  </span>
                  <span style="color:#10B981; font-weight:700;">🟢 Active</span>
                </div>
              </div>
            `).join('') : `
              <div style="padding:1rem; text-align:center; color:#64748B; font-size:0.85rem;">
                No active add-ons. You can add extra conversations or dedicated numbers anytime.
              </div>
            `}
          </div>
        </div>

        <!-- Bottom: Cancellation Option -->
        <div style="background:#FFFFFF; border:1px solid #FECDD3; border-radius:12px; padding:1.25rem; box-shadow:0 1px 3px rgba(0,0,0,0.05); display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:700; color:#991B1B;">Cancel Subscription</div>
            <div style="font-size:0.82rem; color:#64748B;">Choose to cancel immediately or at the end of the current billing cycle (${client.end_date}).</div>
          </div>
          <button class="btn-table-action" style="background:#FEE2E2; border-color:#FECDD3; color:#DC2626;" onclick="window.smatApp.openCancelSubscriptionModal(${client.id})">
            Cancel Subscription
          </button>
        </div>
      </div>
    `;
  }

  function returnToClientBotsGrid() {
    const client = impersonatingClient || clientsData[0];
    renderClientPortalSimulator(client);
  }


  // =========================================================================
  // 9. MODULE 5: SUBSCRIPTION RENEWALS
  // =========================================================================
  let renewalSearch = '';
  let renewalStatus = 'All';
  let renewalPage = 1;
  const renewalPageSize = 10;

  function renderRenewalsView(container) {
    let list = [...clientsData];

    if (renewalStatus === 'DueSoon') {
      list = list.filter(c => typeof c.days_left === 'number' && c.days_left <= 7 && c.days_left > 0);
    } else if (renewalStatus === 'Expired') {
      list = list.filter(c => c.days_left === 0 || c.subscription_status === 'Expired');
    } else if (renewalStatus === 'Active') {
      list = list.filter(c => c.days_left > 7 && c.subscription_status !== 'Expired');
    }

    if (renewalSearch && renewalSearch.trim()) {
      const q = renewalSearch.trim().toLowerCase();
      list = list.filter(c => 
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.plan_name && c.plan_name.toLowerCase().includes(q)) ||
        (c.subscription_id && c.subscription_id.toLowerCase().includes(q))
      );
    }

    const totalRenewals = list.length;
    const totalPages = Math.ceil(totalRenewals / renewalPageSize) || 1;
    if (renewalPage > totalPages) renewalPage = totalPages;
    if (renewalPage < 1) renewalPage = 1;

    const startIdx = (renewalPage - 1) * renewalPageSize;
    const paginatedRenewals = list.slice(startIdx, startIdx + renewalPageSize);

    const dueSoonCount = clientsData.filter(c => typeof c.days_left === 'number' && c.days_left <= 7 && c.days_left > 0).length;
    const expiredCount = clientsData.filter(c => c.days_left === 0 || c.subscription_status === 'Expired').length;
    const healthyCount = clientsData.filter(c => c.days_left > 7 && c.subscription_status !== 'Expired').length;

    container.innerHTML = `
      <!-- Top Metrics Overview -->
      <div class="overview-metrics-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 1.5rem;">
        <div class="metric-summary-card">
          <div class="metric-card-top-row">
            <span class="metric-card-label">RENEWALS DUE SOON (≤7 DAYS)</span>
            <div class="metric-icon-circle orange" style="width:28px; height:28px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
          </div>
          <div class="metric-card-big-value" style="font-size:1.6rem; color:#EA580C; margin-top:0.4rem;">${dueSoonCount} <span class="metric-sub-limit">Accounts</span></div>
          <div style="font-size:0.75rem; color:#64748B; margin-top:4px;">Requires renewal outreach</div>
        </div>

        <div class="metric-summary-card">
          <div class="metric-card-top-row">
            <span class="metric-card-label">EXPIRED LICENSES</span>
            <div class="metric-icon-circle" style="width:28px; height:28px; background:rgba(239, 68, 68, 0.12); color:#EF4444;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
          </div>
          <div class="metric-card-big-value" style="font-size:1.6rem; color:#EF4444; margin-top:0.4rem;">${expiredCount} <span class="metric-sub-limit">Accounts</span></div>
          <div style="font-size:0.75rem; color:#64748B; margin-top:4px;">Deactivated or pending payment</div>
        </div>

        <div class="metric-summary-card">
          <div class="metric-card-top-row">
            <span class="metric-card-label">HEALTHY ACTIVE LICENSES</span>
            <div class="metric-icon-circle" style="width:28px; height:28px; background:rgba(16, 185, 129, 0.12); color:#10B981;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          </div>
          <div class="metric-card-big-value" style="font-size:1.6rem; color:#10B981; margin-top:0.4rem;">${healthyCount} <span class="metric-sub-limit">Accounts</span></div>
          <div style="font-size:0.75rem; color:#64748B; margin-top:4px;">Good standing (>7 days left)</div>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
        <div>
          <h2 class="section-page-title" style="margin:0;">Subscription Renewals</h2>
          <p style="font-size:0.85rem; color:#64748B; margin-top:4px;">Track client renewal dates, expiration cadences, and trigger instant renewals.</p>
        </div>
      </div>

      <!-- Quick Search & Status Filter Bar -->
      <div class="client-filter-card client-filter-card-minimal" style="margin-bottom:1.25rem;">
        <div class="filter-minimal-row">
          <div class="filter-item-block filter-item-search">
            <label class="filter-item-label">Search Client Email <span class="info-tooltip-icon">i</span></label>
            <div class="search-input-wrapper">
              <span class="search-input-icon">🔍</span>
              <input 
                type="text" 
                class="filter-search-box" 
                placeholder="Search by client email, plan, or subscription ID..." 
                value="${renewalSearch}"
                oninput="window.smatApp.updateRenewalSearch(this.value)"
              />
            </div>
          </div>

          <div class="filter-item-block filter-item-status" style="max-width:200px;">
            <label class="filter-item-label">Renewal Urgency <span class="info-tooltip-icon">i</span></label>
            <select class="filter-search-box" style="padding-left:0.75rem; cursor:pointer;" onchange="window.smatApp.updateRenewalStatus(this.value)">
              <option value="All" ${renewalStatus === 'All' ? 'selected' : ''}>All Accounts</option>
              <option value="DueSoon" ${renewalStatus === 'DueSoon' ? 'selected' : ''}>Due Soon (≤7 Days)</option>
              <option value="Expired" ${renewalStatus === 'Expired' ? 'selected' : ''}>Expired (0 Days)</option>
              <option value="Active" ${renewalStatus === 'Active' ? 'selected' : ''}>Healthy Active</option>
            </select>
          </div>

          <div class="filter-actions-group">
            <button class="btn-filter-reset" onclick="window.smatApp.resetRenewalFilters()">↺ Reset</button>
          </div>
        </div>
      </div>

      <!-- Renewals Data Table with Recommended Headers -->
      <div class="table-card-container">
        <table class="client-data-table">
          <thead>
            <tr>
              <th style="width: 50px;">S.no</th>
              <th>Client Email</th>
              <th>Current Plan</th>
              <th>Billing Cycle</th>
              <th>Renewal Amount</th>
              <th>Renewal Date</th>
              <th>Days Left</th>
              <th>Status</th>
              <th style="text-align: center;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${paginatedRenewals.length === 0 ? `
              <tr>
                <td colspan="9" style="text-align:center; padding:2.5rem; color:#94A3B8;">
                  No renewals match your filter. <button onclick="window.smatApp.resetRenewalFilters()" style="color:#1877F2; background:none; border:none; cursor:pointer; font-weight:700;">Reset Filter</button>
                </td>
              </tr>
            ` : paginatedRenewals.map(c => `
              <tr>
                <td style="font-weight:600; color:#64748B;">${c.s_no}</td>
                <td>
                  <span style="font-weight:700; color:#1E293B; cursor:pointer;" onclick="window.smatApp.openClientDetailsPage(${c.id})">${c.email}</span>
                  <button class="btn-copy-inline" onclick="window.smatApp.copyToClipboard('${c.email}', 'email')" title="Copy Email">
                    <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                  </button>
                </td>
                <td>
                  <span style="font-weight:700; color:#1877F2; background:var(--primary-blue-light); padding:3px 8px; border-radius:4px; font-size:0.8rem;">
                    ${c.plan_name}
                  </span>
                </td>
                <td style="color:#334155; font-weight:600;">${c.billing_cycle || 'Monthly'}</td>
                <td style="font-weight:700; color:#1E293B;">${c.subscription_amount_display}</td>
                <td style="color:#64748B; font-weight:500;">${c.end_date}</td>
                <td>
                  <strong style="color: ${c.days_left === 0 || c.days_left === '0' ? '#EF4444' : (c.days_left <= 7 ? '#EA580C' : '#10B981')};">
                    ${c.days_left} Days
                  </strong>
                </td>
                <td>
                  <span class="status-pill ${(c.subscription_status || 'trial').toLowerCase()}">
                    ${c.subscription_status}
                  </span>
                </td>
                <td style="text-align: center;">
                  <button class="btn-table-action btn-action-primary" onclick="window.smatApp.openPlanModal(${c.id})" title="Renew or Upgrade Subscription">
                    ⚡ Renew
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Pagination Controls -->
        <div class="table-pagination-footer" style="padding: 1rem 1.25rem; display:flex; justify-content:space-between; align-items:center;">
          <div style="font-size:0.82rem; color:#64748B;">
            Showing <strong>${startIdx + 1}</strong> to <strong>${Math.min(startIdx + renewalPageSize, totalRenewals)}</strong> of <strong>${totalRenewals}</strong> renewal accounts
          </div>
          <div style="display:flex; gap:0.35rem; align-items:center;">
            <button class="btn-pagination-nav" onclick="window.smatApp.goToRenewalPage(${renewalPage - 1})" ${renewalPage === 1 ? 'disabled' : ''}>‹</button>
            <span style="font-size:0.82rem; font-weight:700; padding:0 0.5rem; color:#1E293B;">Page ${renewalPage} of ${totalPages}</span>
            <button class="btn-pagination-nav" onclick="window.smatApp.goToRenewalPage(${renewalPage + 1})" ${renewalPage === totalPages ? 'disabled' : ''}>›</button>
          </div>
        </div>
      </div>
    `;
  }

  function updateRenewalSearch(val) {
    renewalSearch = val;
    renewalPage = 1;
    renderRenewalsView($('#route-viewport'));
  }

  function updateRenewalStatus(val) {
    renewalStatus = val;
    renewalPage = 1;
    renderRenewalsView($('#route-viewport'));
  }

  function resetRenewalFilters() {
    renewalSearch = '';
    renewalStatus = 'All';
    renewalPage = 1;
    renderRenewalsView($('#route-viewport'));
  }

  function goToRenewalPage(page) {
    renewalPage = page;
    renderRenewalsView($('#route-viewport'));
  }

  function setPartnersTab(tab) {
    partnersTab = tab;
    renderPartnersView($('#route-viewport'));
  }

  function renderPartnersView(container) {
    const whiteLabelClients = clientsData.filter(c => c.deployment_type === 'White-Label' || c.customer_type === 'White-Label');
    const onPremiseClients = clientsData.filter(c => c.deployment_type === 'On-Premise' || c.customer_type === 'On-Premise');
    const totalWL = whiteLabelClients.length;
    const totalOnPrem = onPremiseClients.length;
    const totalChannel = PARTNERS_DATA.length;

    container.innerHTML = `
      <!-- Partners & Deployments Top Metric Cards -->
      <div class="overview-metrics-grid" style="margin-bottom:1.5rem;">
        <div class="metric-summary-card" style="cursor:pointer;" onclick="window.smatApp.setPartnersTab('White-Label')">
          <div class="metric-card-top-row">
            <div class="metric-card-badge">
              <div class="metric-icon-circle purple">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
              </div>
              <span class="metric-card-label">WHITE-LABEL RESELLERS</span>
            </div>
            <span class="status-pill active" style="font-size:0.7rem;">Custom Branding</span>
          </div>
          <div class="metric-card-big-value">${totalWL} <span class="metric-sub-limit">Portals</span></div>
          <div class="metric-card-subtext">
            Custom CNAME Domains & Sub-client Admin Accounts
          </div>
        </div>

        <div class="metric-summary-card" style="cursor:pointer;" onclick="window.smatApp.setPartnersTab('On-Premise')">
          <div class="metric-card-top-row">
            <div class="metric-card-badge">
              <div class="metric-icon-circle blue">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
              </div>
              <span class="metric-card-label">ON-PREMISE ENTERPRISE</span>
            </div>
            <span class="status-pill active" style="font-size:0.7rem;">Private VPC</span>
          </div>
          <div class="metric-card-big-value">${totalOnPrem} <span class="metric-sub-limit">Clusters</span></div>
          <div class="metric-card-subtext">
            Dedicated AWS / On-Premise Bare-Metal Server Nodes
          </div>
        </div>

        <div class="metric-summary-card" style="cursor:pointer;" onclick="window.smatApp.setPartnersTab('Channel')">
          <div class="metric-card-top-row">
            <div class="metric-card-badge">
              <div class="metric-icon-circle orange">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <span class="metric-card-label">CHANNEL PARTNERS</span>
            </div>
            <span class="status-pill active" style="font-size:0.7rem;">Affiliates</span>
          </div>
          <div class="metric-card-big-value">${totalChannel} <span class="metric-sub-limit">Partners</span></div>
          <div class="metric-card-subtext">
            Registered Agency & Strategic Reseller Partners
          </div>
        </div>
      </div>

      <!-- Header & Action Row -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.75rem;">
        <div>
          <h2 class="section-page-title" style="margin:0 0 4px 0;">Partners & Dedicated Deployments</h2>
          <p style="font-size:0.85rem; color:#64748B; margin:0;">Track White-Label portals, On-Premise dedicated nodes, and agency partners.</p>
        </div>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.navigateTo('client-details')">← View All Clients</button>
          <button class="btn-table-action btn-action-primary" onclick="window.smatApp.openAddClientModal()">+ New Deployment / Partner</button>
        </div>
      </div>

      <!-- Segment Tabs -->
      <div class="deployment-segment-bar" style="margin-bottom:1.25rem;">
        <button class="deployment-tab ${partnersTab === 'All' ? 'active' : ''}" onclick="window.smatApp.setPartnersTab('All')">
          All Partners (${totalWL + totalOnPrem + totalChannel})
        </button>
        <button class="deployment-tab ${partnersTab === 'White-Label' ? 'active' : ''}" onclick="window.smatApp.setPartnersTab('White-Label')">
          🏷️ White-Label Resellers (${totalWL})
        </button>
        <button class="deployment-tab ${partnersTab === 'On-Premise' ? 'active' : ''}" onclick="window.smatApp.setPartnersTab('On-Premise')">
          🛡️ On-Premise Enterprise (${totalOnPrem})
        </button>
        <button class="deployment-tab ${partnersTab === 'Channel' ? 'active' : ''}" onclick="window.smatApp.setPartnersTab('Channel')">
          🤝 Channel Partners (${totalChannel})
        </button>
      </div>

      <!-- Data Table Card -->
      <div class="table-card-container">
        ${renderPartnersTabContent(partnersTab, whiteLabelClients, onPremiseClients)}
      </div>
    `;
  }

  function renderPartnersTabContent(tab, whiteLabelClients, onPremiseClients) {
    if (tab === 'White-Label') {
      return `
        <table class="client-data-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Client / Brand Name</th>
              <th>Custom Domain (CNAME)</th>
              <th>SSL Status</th>
              <th>Sub-Clients</th>
              <th>Contact Email</th>
              <th>Plan</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${whiteLabelClients.map((c, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td>
                  <span style="font-weight:700; color:#1E293B; cursor:pointer;" onclick="window.smatApp.openClientDetailsPage(${c.id})">${c.name}</span>
                  <div style="font-size:0.75rem; color:#7C3AED; font-weight:600;">🏷️ ${c.white_label_brand || c.name + ' AI Portal'}</div>
                </td>
                <td>
                  <a href="https://${c.custom_domain || 'bot.' + (c.url || 'smatbot.com')}" target="_blank" style="color:#1877F2; font-weight:600; text-decoration:none;">
                    🔗 ${c.custom_domain || 'bot.' + (c.url || 'smatbot.com')}
                  </a>
                </td>
                <td><span class="status-pill active" style="font-size:0.72rem;">🔒 Active (SSL)</span></td>
                <td><span style="font-weight:700; color:#1E293B;">${c.sub_clients_count || 14}</span> accounts</td>
                <td>${c.email}</td>
                <td><span class="cust-type-pill whitelabel">${c.plan_name || 'Pro NY'}</span></td>
                <td style="text-align: right;">
                  <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.openClientDetailsPage(${c.id})">👁️ Profile</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    if (tab === 'On-Premise') {
      return `
        <table class="client-data-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Enterprise Client</th>
              <th>Dedicated Host / VPC</th>
              <th>Cluster Health</th>
              <th>Engine Version</th>
              <th>License Key</th>
              <th>Contact Email</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${onPremiseClients.map((c, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td>
                  <span style="font-weight:700; color:#1E293B; cursor:pointer;" onclick="window.smatApp.openClientDetailsPage(${c.id})">${c.name}</span>
                  <div style="font-size:0.75rem; color:#1D4ED8; font-weight:600;">🛡️ Enterprise Node</div>
                </td>
                <td style="font-weight:600; color:#334155;">
                  🖥️ ${c.server_host || 'AWS Private VPC (Mumbai DC)'}
                </td>
                <td><span class="status-pill active" style="font-size:0.72rem;">🟢 100% Operational</span></td>
                <td><code>${c.engine_version || 'v4.2.0 Enterprise'}</code></td>
                <td><code style="font-size:0.75rem; background:#F1F5F9; padding:2px 6px; border-radius:4px;">${c.license_key || 'LIC-ONPREM-2026-X01'}</code></td>
                <td>${c.email}</td>
                <td style="text-align: right;">
                  <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.openClientDetailsPage(${c.id})">👁️ Profile</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    if (tab === 'Channel') {
      return `
        <table class="client-data-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Contact Name</th>
              <th>Email</th>
              <th>Company Name</th>
              <th>Company URL</th>
              <th>Partner Tier</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${PARTNERS_DATA.map((p, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td style="font-weight:700;">${p.name}</td>
                <td>${p.email}</td>
                <td>${p.companyName}</td>
                <td><a href="${p.companyUrl.startsWith('http') ? p.companyUrl : 'https://' + p.companyUrl}" target="_blank" style="color:#1877F2;">${p.companyUrl}</a></td>
                <td><span class="cust-type-pill reseller">Agency Tier</span></td>
                <td style="text-align: right;">
                  <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.showToast('Partner profile for ${p.name}')">View</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    // Default 'All' tab: Combined view
    return `
      <table class="client-data-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name / Organization</th>
            <th>Email</th>
            <th>Deployment / Category</th>
            <th>Host / Custom Domain</th>
            <th>Status</th>
            <th style="text-align: right;">Action</th>
          </tr>
        </thead>
        <tbody>
          ${whiteLabelClients.map((c, idx) => `
            <tr>
              <td>WL-${idx + 1}</td>
              <td style="font-weight:700;">${c.name}</td>
              <td>${c.email}</td>
              <td><span class="cust-type-pill whitelabel">🏷️ White-Label Reseller</span></td>
              <td><a href="https://${c.custom_domain || 'bot.' + (c.url || 'smatbot.com')}" target="_blank" style="color:#1877F2;">🔗 ${c.custom_domain || 'bot.' + (c.url || 'smatbot.com')}</a></td>
              <td><span class="status-pill active" style="font-size:0.72rem;">Active</span></td>
              <td style="text-align: right;">
                <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.openClientDetailsPage(${c.id})">👁️ Profile</button>
              </td>
            </tr>
          `).join('')}
          ${onPremiseClients.map((c, idx) => `
            <tr>
              <td>OP-${idx + 1}</td>
              <td style="font-weight:700;">${c.name}</td>
              <td>${c.email}</td>
              <td><span class="cust-type-pill onpremise">🛡️ On-Premise Enterprise</span></td>
              <td>🖥️ ${c.server_host || 'AWS Private VPC (Mumbai DC)'}</td>
              <td><span class="status-pill active" style="font-size:0.72rem;">🟢 Operational</span></td>
              <td style="text-align: right;">
                <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.openClientDetailsPage(${c.id})">👁️ Profile</button>
              </td>
            </tr>
          `).join('')}
          ${PARTNERS_DATA.map((p, idx) => `
            <tr>
              <td>CH-${idx + 1}</td>
              <td style="font-weight:700;">${p.name} (${p.companyName})</td>
              <td>${p.email}</td>
              <td><span class="cust-type-pill reseller">🤝 Channel Partner</span></td>
              <td><a href="${p.companyUrl.startsWith('http') ? p.companyUrl : 'https://' + p.companyUrl}" target="_blank" style="color:#1877F2;">${p.companyUrl}</a></td>
              <td><span class="status-pill active" style="font-size:0.72rem;">Verified</span></td>
              <td style="text-align: right;">
                <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.showToast('Partner details for ${p.name}')">View</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  // =========================================================================
  // 9B. MODULE 6: DISCOUNT COUPONS & VOUCHERS SYSTEM
  // =========================================================================
  let couponsData = [
    {
      id: 1,
      code: 'SMAT50',
      discount: '50% OFF',
      discount_type: 'percentage',
      discount_value: 50,
      applicable_plans: 'Professional, Enterprise AI',
      usage_limit: '100 Redemptions',
      used_count: 34,
      expiry_date: '31-12-2026',
      status: 'Active'
    },
    {
      id: 2,
      code: 'WELCOME2026',
      discount: '20% OFF',
      discount_type: 'percentage',
      discount_value: 20,
      applicable_plans: 'All Annual Subscriptions',
      usage_limit: 'Unlimited',
      used_count: 142,
      expiry_date: '31-12-2026',
      status: 'Active'
    },
    {
      id: 3,
      code: 'STARTUPFLAT',
      discount: '₹ 1,000 OFF',
      discount_type: 'flat',
      discount_value: 1000,
      applicable_plans: 'Starter, Pro NY',
      usage_limit: '50 Redemptions',
      used_count: 18,
      expiry_date: '15-11-2026',
      status: 'Active'
    },
    {
      id: 4,
      code: 'EARLYBIRD',
      discount: '30% OFF',
      discount_type: 'percentage',
      discount_value: 30,
      applicable_plans: 'All Plans',
      usage_limit: '25 Redemptions',
      used_count: 25,
      expiry_date: '01-09-2026',
      status: 'Expired'
    }
  ];

  function renderCouponsView(container) {
    const activeCouponsCount = couponsData.filter(c => c.status === 'Active').length;
    const totalRedemptions = couponsData.reduce((acc, c) => acc + (c.used_count || 0), 0);

    container.innerHTML = `
      <!-- Top Metrics Overview -->
      <div class="overview-metrics-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 1.5rem;">
        <div class="metric-summary-card">
          <div class="metric-card-top-row">
            <span class="metric-card-label">TOTAL COUPONS</span>
            <div class="metric-icon-circle blue" style="width:28px; height:28px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            </div>
          </div>
          <div class="metric-card-big-value" style="font-size:1.6rem; margin-top:0.4rem;">${couponsData.length} <span class="metric-sub-limit">Vouchers</span></div>
          <div style="font-size:0.75rem; color:#64748B; margin-top:4px;">Promotional & partner codes</div>
        </div>

        <div class="metric-summary-card">
          <div class="metric-card-top-row">
            <span class="metric-card-label">ACTIVE PROMOTIONS</span>
            <div class="metric-icon-circle" style="width:28px; height:28px; background:rgba(16, 185, 129, 0.12); color:#10B981;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          </div>
          <div class="metric-card-big-value" style="font-size:1.6rem; color:#10B981; margin-top:0.4rem;">${activeCouponsCount} <span class="metric-sub-limit">Live</span></div>
          <div style="font-size:0.75rem; color:#64748B; margin-top:4px;">Available for redemption</div>
        </div>

        <div class="metric-summary-card">
          <div class="metric-card-top-row">
            <span class="metric-card-label">TOTAL REDEMPTIONS</span>
            <div class="metric-icon-circle purple" style="width:28px; height:28px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
            </div>
          </div>
          <div class="metric-card-big-value" style="font-size:1.6rem; color:#7C3AED; margin-top:0.4rem;">${totalRedemptions} <span class="metric-sub-limit">Claimed</span></div>
          <div style="font-size:0.75rem; color:#64748B; margin-top:4px;">Claimed by customers</div>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
        <div>
          <h2 class="section-page-title" style="margin:0;">Discount Coupons & Vouchers</h2>
          <p style="font-size:0.85rem; color:#64748B; margin-top:4px;">Generate promotional discount codes, manage redemption limits, and activate campaign vouchers.</p>
        </div>
        <button class="btn-table-action btn-action-primary" onclick="window.smatApp.openAddCouponModal()" style="padding:0.6rem 1.25rem; font-size:0.88rem;">
          + Add Coupon
        </button>
      </div>

      <!-- Coupons Table Container -->
      <div class="table-card-container">
        <table class="client-data-table">
          <thead>
            <tr>
              <th style="width: 50px;">S.no</th>
              <th>Coupon Code</th>
              <th>Discount Value</th>
              <th>Applicable Plans</th>
              <th>Usage Limit</th>
              <th>Redemptions</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th style="text-align: center;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${couponsData.length === 0 ? `
              <tr>
                <td colspan="9" style="text-align:center; padding:2.5rem; color:#94A3B8;">
                  No coupons found. Click <strong>+ Add Coupon</strong> to create one.
                </td>
              </tr>
            ` : couponsData.map((c, idx) => `
              <tr>
                <td style="font-weight:600; color:#64748B;">${idx + 1}</td>
                <td>
                  <span style="font-weight:800; font-family:monospace; color:#1877F2; background:rgba(24, 119, 242, 0.08); padding:3px 8px; border-radius:4px; font-size:0.9rem; letter-spacing:0.5px;">
                    ${c.code}
                  </span>
                  <button class="btn-copy-inline" onclick="window.smatApp.copyToClipboard('${c.code}', 'coupon code')" title="Copy Code">
                    <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                  </button>
                </td>
                <td style="font-weight:700; color:#10B981;">${c.discount}</td>
                <td style="color:#334155; font-weight:500;">${c.applicable_plans}</td>
                <td style="color:#64748B;">${c.usage_limit}</td>
                <td><strong>${c.used_count || 0} used</strong></td>
                <td style="color:#64748B;">${c.expiry_date}</td>
                <td>
                  <span class="status-pill ${c.status.toLowerCase()}">${c.status}</span>
                </td>
                <td style="text-align: center;">
                  <div style="display:flex; gap:0.4rem; justify-content:center;">
                    <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.toggleCouponStatus(${c.id})" title="Toggle Active / Paused">
                      ${c.status === 'Active' ? '⏸️ Pause' : '▶️ Activate'}
                    </button>
                    <button class="btn-table-action btn-action-danger" onclick="window.smatApp.deleteCoupon(${c.id})" title="Delete Coupon">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function openAddCouponModal() {
    const modal = $('#modal-container');
    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="modal-box-card" style="border-top: 4px solid #1877F2; max-width:540px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <div style="font-size:1.15rem; font-weight:800; color:#1E293B;">🎟️ Create New Discount Coupon</div>
            <button onclick="window.smatApp.closeModal()" style="background:none; border:none; font-size:1.2rem; cursor:pointer;">✕</button>
          </div>

          <form onsubmit="window.smatApp.handleAddCouponSubmit(event)">
            <div style="display:flex; flex-direction:column; gap:1rem;">
              <div>
                <label style="font-size:0.8rem; font-weight:700; color:#1E293B; display:block; margin-bottom:4px;">Coupon Code *</label>
                <input 
                  type="text" 
                  id="coupon-code-input" 
                  class="filter-search-box" 
                  style="text-transform:uppercase; font-family:monospace; font-weight:700; font-size:0.95rem; letter-spacing:1px;" 
                  placeholder="e.g. DIWALI50, STARTUP20" 
                  required 
                />
              </div>

              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.75rem;">
                <div>
                  <label style="font-size:0.8rem; font-weight:700; color:#1E293B; display:block; margin-bottom:4px;">Discount Type *</label>
                  <select id="coupon-type-input" class="filter-search-box" style="padding-left:0.75rem;" onchange="window.smatApp.updateCouponTypePlaceholder()">
                    <option value="percentage">Percentage (%) OFF</option>
                    <option value="flat">Flat Amount (₹ / $) OFF</option>
                  </select>
                </div>

                <div>
                  <label style="font-size:0.8rem; font-weight:700; color:#1E293B; display:block; margin-bottom:4px;">Discount Value *</label>
                  <input type="number" id="coupon-value-input" class="filter-search-box" placeholder="e.g. 50 (for 50%)" min="1" required />
                </div>
              </div>

              <div>
                <label style="font-size:0.8rem; font-weight:700; color:#1E293B; display:block; margin-bottom:4px;">Applicable Plans *</label>
                <select id="coupon-plans-input" class="filter-search-box" style="padding-left:0.75rem;">
                  <option value="All Plans">All Plans & Tiers</option>
                  <option value="Professional, Enterprise AI">Professional & Enterprise AI</option>
                  <option value="Starter, Pro NY">Starter & Pro NY</option>
                  <option value="All Annual Subscriptions">All Annual Subscriptions</option>
                  <option value="Custom White-Label">Custom White-Label Only</option>
                </select>
              </div>

              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.75rem;">
                <div>
                  <label style="font-size:0.8rem; font-weight:700; color:#1E293B; display:block; margin-bottom:4px;">Usage Limit</label>
                  <input type="number" id="coupon-limit-input" class="filter-search-box" placeholder="e.g. 100 (Leave empty for Unlimited)" min="1" />
                </div>

                <div>
                  <label style="font-size:0.8rem; font-weight:700; color:#1E293B; display:block; margin-bottom:4px;">Expiry Date *</label>
                  <input type="date" id="coupon-expiry-input" class="filter-search-box" required />
                </div>
              </div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
              <button type="button" class="btn-table-action btn-action-secondary" onclick="window.smatApp.closeModal()">Cancel</button>
              <button type="submit" class="btn-table-action btn-action-primary">⚡ Create Coupon</button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Set default date to 3 months from now
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 3);
    const dateStr = nextDate.toISOString().split('T')[0];
    const dateInput = $('#coupon-expiry-input');
    if (dateInput) dateInput.value = dateStr;
  }

  function handleAddCouponSubmit(e) {
    e.preventDefault();
    const code = ($('#coupon-code-input')?.value || '').trim().toUpperCase();
    const type = $('#coupon-type-input')?.value || 'percentage';
    const value = parseFloat($('#coupon-value-input')?.value || '0');
    const plans = $('#coupon-plans-input')?.value || 'All Plans';
    const limit = $('#coupon-limit-input')?.value;
    const expiry = $('#coupon-expiry-input')?.value;

    if (!code || isNaN(value) || value <= 0) {
      showToast('Please enter a valid coupon code and discount value');
      return;
    }

    const discountText = type === 'percentage' ? `${value}% OFF` : `₹ ${value} OFF`;
    const usageLimitText = limit ? `${limit} Redemptions` : 'Unlimited';

    // Format date DD-MM-YYYY
    let formattedExpiry = '31-12-2026';
    if (expiry) {
      const parts = expiry.split('-');
      if (parts.length === 3) formattedExpiry = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    const newCoupon = {
      id: couponsData.length + 1,
      code,
      discount: discountText,
      discount_type: type,
      discount_value: value,
      applicable_plans: plans,
      usage_limit: usageLimitText,
      used_count: 0,
      expiry_date: formattedExpiry,
      status: 'Active'
    };

    couponsData.unshift(newCoupon);
    closeModal();
    showToast(`Coupon "${code}" created successfully! 🎉`);
    if (currentRoute === 'coupons') renderCouponsView($('#route-viewport'));
  }

  function toggleCouponStatus(id) {
    const coupon = couponsData.find(c => c.id === id);
    if (!coupon) return;
    coupon.status = coupon.status === 'Active' ? 'Paused' : 'Active';
    showToast(`Coupon "${coupon.code}" status changed to ${coupon.status}`);
    renderCouponsView($('#route-viewport'));
  }

  function deleteCoupon(id) {
    const coupon = couponsData.find(c => c.id === id);
    if (!coupon) return;
    if (confirm(`Are you sure you want to delete coupon "${coupon.code}"?`)) {
      couponsData = couponsData.filter(c => c.id !== id);
      showToast(`Coupon "${coupon.code}" deleted`);
      renderCouponsView($('#route-viewport'));
    }
  }

  function updateCouponTypePlaceholder() {
    const type = $('#coupon-type-input')?.value;
    const valInput = $('#coupon-value-input');
    if (!valInput) return;
    if (type === 'percentage') {
      valInput.placeholder = 'e.g. 50 (for 50%)';
      valInput.max = '100';
    } else {
      valInput.placeholder = 'e.g. 1000 (for ₹1,000)';
      valInput.removeAttribute('max');
    }
  }

  function renderGenericView(container, routeName) {
    container.innerHTML = `
      <h2 class="section-page-title">${routeName.toUpperCase()}</h2>
      <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; padding:3rem; text-align:center;">
        <div style="font-size:2rem; margin-bottom:0.5rem;">⚡</div>
        <div style="font-size:1.15rem; font-weight:700; color:#1E293B;">Module: ${routeName}</div>
        <p style="font-size:0.85rem; color:#64748B; margin-top:4px;">Connected with SmatBot Backend Cloud Engine.</p>
      </div>
    `;
  }

  // =========================================================================
  // 10. FILTER ENGINE & HELPER FUNCTIONS
  // =========================================================================
  function getFilteredClients() {
    let list = [...clientsData];

    if (filterState.newThisMonthOnly) {
      list = list.filter((c, idx) => c.is_new_this_month || idx < 18);
    }

    if (filterState.activeSegmentTab === 'active') {
      list = list.filter(c => c.subscription_status === 'Active');
    } else if (filterState.activeSegmentTab === 'trial') {
      list = list.filter(c => c.subscription_status === 'Trial' || (!c.subscription_status && (c.plan_name || '').toLowerCase().includes('trial')));
    } else if (filterState.activeSegmentTab === 'expiring') {
      list = list.filter(c => typeof c.days_left === 'number' && c.days_left <= 7 && c.days_left >= 0);
    } else if (filterState.activeSegmentTab === 'whitelabel') {
      list = list.filter(c => c.customer_type === 'White-Label' || c.deployment_type === 'White-Label');
    }

    if (filterState.planType !== 'All') {
      list = list.filter(c => c.plan_type && c.plan_type.toLowerCase().includes(filterState.planType.toLowerCase()));
    }
    if (filterState.accountType !== 'All') {
      list = list.filter(c => c.account_type === filterState.accountType);
    }
    if (filterState.billingCycle !== 'All') {
      list = list.filter(c => c.billing_cycle === filterState.billingCycle);
    }
    if (filterState.customerTypes.length > 0 && filterState.customerTypes.length < ALL_CUSTOMER_TYPES.length) {
      list = list.filter(c => filterState.customerTypes.includes(c.customer_type));
    }
    if (filterState.planNames.length > 0 && filterState.planNames.length < ALL_PLAN_NAMES.length) {
      list = list.filter(c => filterState.planNames.includes(c.plan_name));
    }
    if (filterState.lostClientStatus !== 'All') {
      list = list.filter(c => (filterState.lostClientStatus === 'Yes' ? c.days_left === 0 : c.days_left > 0));
    }
    if (filterState.salesPerson !== 'All') {
      list = list.filter(c => c.sales_person === filterState.salesPerson);
    }
    if (filterState.supportPerson !== 'All') {
      list = list.filter(c => c.support_person === filterState.supportPerson);
    }
    if (filterState.currencyType !== 'All') {
      list = list.filter(c => c.currency_type === filterState.currencyType);
    }
    if (filterState.subscriptionStatus !== 'All') {
      list = list.filter(c => c.subscription_status === filterState.subscriptionStatus);
    }
    if (filterState.inrMin) list = list.filter(c => (c.inr_amount || 0) >= parseFloat(filterState.inrMin));
    if (filterState.inrMax) list = list.filter(c => (c.inr_amount || 0) <= parseFloat(filterState.inrMax));
    if (filterState.usdMin) list = list.filter(c => (c.usd_amount || 0) >= parseFloat(filterState.usdMin));
    if (filterState.usdMax) list = list.filter(c => (c.usd_amount || 0) <= parseFloat(filterState.usdMax));

    if (filterState.search && filterState.search.trim() !== '') {
      const q = filterState.search.trim().toLowerCase();
      list = list.filter(c => 
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.subscription_id && c.subscription_id.toLowerCase().includes(q)) ||
        (c.zoho_customer_id && c.zoho_customer_id.toLowerCase().includes(q)) ||
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.phone_number && c.phone_number.includes(q)) ||
        (c.custom_domain && c.custom_domain.toLowerCase().includes(q)) ||
        (c.server_host && c.server_host.toLowerCase().includes(q)) ||
        (c.license_key && c.license_key.toLowerCase().includes(q))
      );
    }

    return list;
  }

  function filterNewClientsThisMonth() {
    filterState.newThisMonthOnly = true;
    clientCurrentPage = 1;
    renderClientDetailsView($('#route-viewport'));
    showToast('✨ Filtered to 18 new clients onboarded this month!');
  }

  function clearNewClientsFilter() {
    filterState.newThisMonthOnly = false;
    clientCurrentPage = 1;
    renderClientDetailsView($('#route-viewport'));
    showToast('Showing all registered client accounts.');
  }

  function selectSegmentTab(tabKey) {
    filterState.activeSegmentTab = tabKey;
    clientCurrentPage = 1;
    renderClientDetailsView($('#route-viewport'));
  }

  function getAvatarColorClass(str) {
    const classes = ['purple', 'blue', 'green', 'orange', 'pink'];
    let hash = 0;
    for (let i = 0; i < (str || '').length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return classes[Math.abs(hash) % classes.length];
  }

  function getInitials(name) {
    if (!name) return 'SB';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function openClientQuickDrawer(clientId) {
    const client = clientsData.find(c => c.id === clientId) || clientsData[0];
    const drawerContainer = $('#drawer-container');
    if (!drawerContainer) return;

    const botsLimit = client.bots_limit !== undefined ? client.bots_limit : 10;
    const botsUsed = client.bots_used !== undefined ? client.bots_used : 0;
    const botsPct = botsLimit > 0 ? Math.min(100, Math.round((botsUsed / botsLimit) * 100)) : 0;

    const chatsLimit = client.chats_limit !== undefined ? client.chats_limit : 5000;
    const chatsUsed = client.chats_used !== undefined ? client.chats_used : 0;
    const chatsPct = chatsLimit > 0 ? Math.min(100, Math.round((chatsUsed / chatsLimit) * 100)) : 0;

    const isTrial = client.subscription_status === 'Trial' || (!client.subscription_status && (client.plan_name || '').toLowerCase().includes('trial'));
    const isExpired = client.subscription_status === 'Expired' || client.days_left === 0;

    const statusBadge = isExpired 
      ? '<span class="status-badge-compact expired">● Expired</span>'
      : (isTrial 
        ? '<span class="status-badge-compact trial">⏳ Trial</span>' 
        : '<span class="status-badge-compact active">🟢 Active</span>');

    drawerContainer.innerHTML = `
      <div class="drawer-backdrop open" onclick="window.smatApp.closeClientDrawer()"></div>
      <div class="client-slide-drawer open">
        <div class="drawer-header">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <div class="client-avatar-circle ${getAvatarColorClass(client.name)}" style="width:40px; height:40px; font-size:1rem;">
              ${getInitials(client.name)}
            </div>
            <div>
              <div style="font-weight:700; color:#1E293B; font-size:1.05rem;">${escapeHtml(client.name)}</div>
              <div style="font-size:0.75rem; color:#64748B;">ID: ${escapeHtml(client.zoho_customer_id || ('#CL-' + client.id))}</div>
            </div>
          </div>
          <button onclick="window.smatApp.closeClientDrawer()" style="background:none; border:none; font-size:1.3rem; color:#64748B; cursor:pointer; padding:4px 8px; border-radius:6px;" title="Close Drawer">✕</button>
        </div>

        <div class="drawer-body">
          <!-- Status & Type Row -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <div>${statusBadge}</div>
            <div style="font-size:0.8rem; font-weight:600; color:#475569; background:#F1F5F9; padding:3px 8px; border-radius:6px;">
              ${escapeHtml(client.customer_type || 'Direct')} · ${escapeHtml(client.account_type || 'Client Accounts')}
            </div>
          </div>

          <!-- Quick Stats Grid -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1.5rem;">
            <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:0.75rem;">
              <div style="font-size:0.72rem; color:#64748B; font-weight:600; text-transform:uppercase;">Current Plan</div>
              <div style="font-weight:700; color:#1E293B; font-size:0.95rem; margin-top:2px;">${escapeHtml(client.plan_name || 'Pro Trial')}</div>
              <div style="font-size:0.72rem; color:#64748B;">${escapeHtml(client.billing_cycle || 'Monthly')} (${escapeHtml(client.subscription_amount_display || '₹ 0.00')})</div>
            </div>
            <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:0.75rem;">
              <div style="font-size:0.72rem; color:#64748B; font-weight:600; text-transform:uppercase;">Days Remaining</div>
              <div style="font-weight:800; color:${(client.days_left || 0) <= 7 ? '#DC2626' : '#16A34A'}; font-size:1.15rem; margin-top:2px;">
                ${client.days_left !== undefined ? client.days_left : 13} <span style="font-size:0.75rem; font-weight:600; color:#64748B;">days</span>
              </div>
              <div style="font-size:0.72rem; color:#64748B;">Expires: ${escapeHtml(client.end_date || '08-10-2026')}</div>
            </div>
          </div>

          <!-- Usage Progress Cards -->
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:1rem; margin-bottom:1.5rem;">
            <div style="font-weight:700; font-size:0.82rem; color:#334155; margin-bottom:0.75rem;">QUOTA CONSUMPTION</div>
            
            <div style="margin-bottom:0.75rem;">
              <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:4px;">
                <span style="color:#64748B; font-weight:600;">Active Bots</span>
                <span style="font-weight:700; color:#1E293B;">${botsUsed} / ${botsLimit} (${botsPct}%)</span>
              </div>
              <div style="background:#E2E8F0; height:6px; border-radius:3px; overflow:hidden;">
                <div style="background:#1877F2; height:100%; width:${botsPct}%;"></div>
              </div>
            </div>

            <div>
              <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:4px;">
                <span style="color:#64748B; font-weight:600;">Monthly Chats</span>
                <span style="font-weight:700; color:#1E293B;">${chatsUsed.toLocaleString()} / ${chatsLimit.toLocaleString()} (${chatsPct}%)</span>
              </div>
              <div style="background:#E2E8F0; height:6px; border-radius:3px; overflow:hidden;">
                <div style="background:#10B981; height:100%; width:${chatsPct}%;"></div>
              </div>
            </div>
          </div>

          <!-- Contact & Deployment Specs -->
          <div style="border:1px solid #E2E8F0; border-radius:10px; padding:1rem; margin-bottom:1.5rem;">
            <div style="font-weight:700; font-size:0.82rem; color:#334155; margin-bottom:0.75rem;">CONTACT & DEPLOYMENT</div>
            
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; margin-bottom:0.5rem; padding-bottom:0.5rem; border-bottom:1px solid #F1F5F9;">
              <span style="color:#64748B;">Email</span>
              <span style="font-weight:600; color:#1E293B; display:flex; align-items:center; gap:4px;">
                ${escapeHtml(client.email)}
                <button class="btn-copy-inline" onclick="window.smatApp.copyToClipboard('${client.email}', 'email')" title="Copy Email">
                  <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                </button>
              </span>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; margin-bottom:0.5rem; padding-bottom:0.5rem; border-bottom:1px solid #F1F5F9;">
              <span style="color:#64748B;">Phone</span>
              <span style="font-weight:600; color:#1E293B; display:flex; align-items:center; gap:4px;">
                ${escapeHtml(client.phone_number)}
                <button class="btn-copy-inline" onclick="window.smatApp.copyToClipboard('${client.phone_number}', 'phone')" title="Copy Phone">
                  <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                </button>
              </span>
            </div>

            <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:0.5rem; padding-bottom:0.5rem; border-bottom:1px solid #F1F5F9;">
              <span style="color:#64748B;">Sub-Domain / URL</span>
              <span style="font-weight:600; color:#1877F2;">${escapeHtml(client.custom_domain || client.url || '-')}</span>
            </div>

            <div style="display:flex; justify-content:space-between; font-size:0.8rem;">
              <span style="color:#64748B;">Assigned Reps</span>
              <span style="font-weight:600; color:#334155;">Sales: ${escapeHtml(client.sales_person || '-')} | Support: ${escapeHtml(client.support_person || '-')}</span>
            </div>
          </div>
        </div>

        <div class="drawer-footer">
          <button class="client-mini-action-btn" onclick="window.smatApp.closeClientDrawer(); window.smatApp.openPlanModal(${client.id});" style="padding:8px 14px; font-size:0.82rem;">
            ⚡ Plan / Add-ons
          </button>
          <button class="client-mini-action-btn login-btn" onclick="window.smatApp.closeClientDrawer(); window.smatApp.openLoginConfirmModal(${client.id});" style="padding:8px 14px; font-size:0.82rem; background:#16A34A; color:#FFFFFF; border-color:#16A34A;">
            🔐 1-Click Login
          </button>
          <button class="btn-action-primary" onclick="window.smatApp.closeClientDrawer(); window.smatApp.openClientDetailsPage(${client.id});" style="padding:8px 14px; font-size:0.82rem;">
            Full Profile 👁️
          </button>
        </div>
      </div>
    `;
  }

  function closeClientDrawer() {
    const drawerContainer = $('#drawer-container');
    if (drawerContainer) {
      drawerContainer.innerHTML = '';
    }
  }

  function openNewClientsModal() {
    const newClients = clientsData.slice(0, 18);
    const modal = $('#modal-container');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="modal-box-card" style="border-top: 4px solid #10B981; max-width: 860px; width:92vw;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.25rem;">
            <div>
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <span style="font-size:1.4rem;">✨</span>
                <div style="font-size:1.15rem; font-weight:800; color:#1E293B;">New Clients Added This Month (18 Accounts)</div>
              </div>
              <p style="font-size:0.82rem; color:#64748B; margin-top:3px; margin-bottom:0;">
                All clients recently registered or onboarded during the current monthly billing cycle.
              </p>
            </div>
            <button onclick="window.smatApp.closeModal()" style="background:none; border:none; font-size:1.3rem; cursor:pointer; color:#64748B;">✕</button>
          </div>

          <div style="max-height:460px; overflow-y:auto; border:1px solid #E2E8F0; border-radius:8px; margin-bottom:1.25rem;">
            <table class="client-data-table" style="margin:0;">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Client Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Customer Type</th>
                  <th>Plan Name</th>
                  <th>Status</th>
                  <th style="text-align:right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${newClients.map((c, idx) => `
                  <tr>
                    <td style="font-weight:600; color:#64748B;">${idx + 1}</td>
                    <td style="font-weight:700; color:#1E293B;">${c.name}</td>
                    <td>${c.email}</td>
                    <td>${c.phone_number}</td>
                    <td>
                      ${c.customer_type === 'White-Label' || c.deployment_type === 'White-Label' 
                        ? `<span class="cust-type-pill whitelabel">🏷️ White-Label</span>` 
                        : (c.customer_type === 'On-Premise' || c.deployment_type === 'On-Premise' 
                          ? `<span class="cust-type-pill onpremise">🛡️ On-Premise</span>` 
                          : `<span class="cust-type-pill direct">${c.customer_type || 'Direct'}</span>`)}
                    </td>
                    <td style="font-weight:600; color:#334155;">${c.plan_name || 'Pro Trial'}</td>
                    <td><span class="status-pill active" style="font-size:0.7rem;">Active</span></td>
                    <td style="text-align:right;">
                      <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.closeModal(); window.smatApp.openClientDetailsPage(${c.id})">👁️ Profile</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.8rem; color:#64748B;">Showing 18 of 18 new accounts</span>
            <div style="display:flex; gap:0.5rem;">
              <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.closeModal()">Close</button>
              <button class="btn-table-action btn-action-primary" style="background:#10B981;" onclick="window.smatApp.closeModal(); window.smatApp.filterNewClientsThisMonth();">Filter Main Table</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function toggleDropdown(menuId) {
    const targetMenu = $(`#${menuId}`);
    if (!targetMenu) return;
    const trigger = targetMenu.previousElementSibling;
    const isCurrentlyOpen = targetMenu.classList.contains('show');

    $$('.custom-dropdown-menu').forEach(m => m.classList.remove('show'));
    $$('.custom-dropdown-trigger').forEach(t => t.classList.remove('open'));

    if (!isCurrentlyOpen) {
      targetMenu.classList.add('show');
      if (trigger) trigger.classList.add('open');
    }
  }

  function selectSingleOption(field, value) {
    filterState[field] = value;
    const labelEl = $(`#label-${field.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
    if (labelEl) labelEl.innerText = value;
    
    $$('.custom-dropdown-menu').forEach(m => m.classList.remove('show'));
    $$('.custom-dropdown-trigger').forEach(t => t.classList.remove('open'));
    
    applyFilters();
  }

  function toggleCheckboxOption(field, value) {
    if (filterState[field].includes(value)) {
      filterState[field] = filterState[field].filter(v => v !== value);
    } else {
      filterState[field].push(value);
    }

    renderClientDetailsView($('#route-viewport'));
    const targetId = field === 'customerTypes' ? 'dd-customer-type' : 'dd-plan-name';
    const targetMenu = $(`#${targetId}`);
    if (targetMenu) {
      targetMenu.classList.add('show');
      targetMenu.previousElementSibling.classList.add('open');
    }
  }

  function toggleSelectAllCustomerTypes() {
    if (filterState.customerTypes.length === ALL_CUSTOMER_TYPES.length) {
      filterState.customerTypes = [];
    } else {
      filterState.customerTypes = [...ALL_CUSTOMER_TYPES];
    }
    renderClientDetailsView($('#route-viewport'));
    const targetMenu = $('#dd-customer-type');
    if (targetMenu) {
      targetMenu.classList.add('show');
      targetMenu.previousElementSibling.classList.add('open');
    }
  }

  function toggleSelectAllPlanNames() {
    if (filterState.planNames.length === ALL_PLAN_NAMES.length) {
      filterState.planNames = [];
    } else {
      filterState.planNames = [...ALL_PLAN_NAMES];
    }
    renderClientDetailsView($('#route-viewport'));
    const targetMenu = $('#dd-plan-name');
    if (targetMenu) {
      targetMenu.classList.add('show');
      targetMenu.previousElementSibling.classList.add('open');
    }
  }

  function updateRange(field, val) {
    filterState[field] = val;
  }

  function updateSearch(val) {
    filterState.search = val;
  }

  function applyFilters() {
    clientCurrentPage = 1;
    renderClientDetailsView($('#route-viewport'));
  }

  function renderPaginationControls(totalPages, currentPage, pageSize) {
    let pagesHtml = '';
    
    pagesHtml += `
      <button class="btn-pagination-nav" onclick="window.smatApp.goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} title="Previous Page">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
    `;

    if (totalPages <= 7) {
      for (let p = 1; p <= totalPages; p++) {
        pagesHtml += `<button class="btn-pagination-nav ${p === currentPage ? 'active' : ''}" onclick="window.smatApp.goToPage(${p})">${p}</button>`;
      }
    } else {
      if (currentPage <= 4) {
        for (let p = 1; p <= 5; p++) {
          pagesHtml += `<button class="btn-pagination-nav ${p === currentPage ? 'active' : ''}" onclick="window.smatApp.goToPage(${p})">${p}</button>`;
        }
        pagesHtml += `<span class="pagination-ellipsis">...</span>`;
        pagesHtml += `<button class="btn-pagination-nav" onclick="window.smatApp.goToPage(${totalPages})">${totalPages}</button>`;
      } else if (currentPage >= totalPages - 3) {
        pagesHtml += `<button class="btn-pagination-nav" onclick="window.smatApp.goToPage(1)">1</button>`;
        pagesHtml += `<span class="pagination-ellipsis">...</span>`;
        for (let p = totalPages - 4; p <= totalPages; p++) {
          pagesHtml += `<button class="btn-pagination-nav ${p === currentPage ? 'active' : ''}" onclick="window.smatApp.goToPage(${p})">${p}</button>`;
        }
      } else {
        pagesHtml += `<button class="btn-pagination-nav" onclick="window.smatApp.goToPage(1)">1</button>`;
        pagesHtml += `<span class="pagination-ellipsis">...</span>`;
        for (let p = currentPage - 1; p <= currentPage + 1; p++) {
          pagesHtml += `<button class="btn-pagination-nav ${p === currentPage ? 'active' : ''}" onclick="window.smatApp.goToPage(${p})">${p}</button>`;
        }
        pagesHtml += `<span class="pagination-ellipsis">...</span>`;
        pagesHtml += `<button class="btn-pagination-nav" onclick="window.smatApp.goToPage(${totalPages})">${totalPages}</button>`;
      }
    }

    pagesHtml += `
      <button class="btn-pagination-nav" onclick="window.smatApp.goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''} title="Next Page">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    `;

    return `
      <div class="client-table-pagination-footer">
        <select class="page-size-select" onchange="window.smatApp.changePageSize(Number(this.value))">
          <option value="10" ${pageSize === 10 ? 'selected' : ''}>10</option>
          <option value="25" ${pageSize === 25 ? 'selected' : ''}>25</option>
          <option value="50" ${pageSize === 50 ? 'selected' : ''}>50</option>
          <option value="100" ${pageSize === 100 ? 'selected' : ''}>100</option>
        </select>
        <div class="pagination-numbers-list">
          ${pagesHtml}
        </div>
      </div>
    `;
  }

  function changePageSize(newSize) {
    clientPageSize = parseInt(newSize) || 10;
    clientCurrentPage = 1;
    renderClientDetailsView($('#route-viewport'));
  }

  function goToPage(page) {
    clientCurrentPage = parseInt(page) || 1;
    renderClientDetailsView($('#route-viewport'));
  }

  // Add Client Modal Implementation
  function updateAddClientAmountCalc() {
    const planSelect = $('#add-client-plan-name');
    const cycleSelect = $('#add-client-billing-cycle');
    const amountInput = $('#add-client-amount');
    const daysLeftInput = $('#add-client-days-left');
    if (!planSelect || !cycleSelect || !amountInput) return;

    const planPrices = {
      'Broadcast': 1499,
      'Standard': 3500,
      'Pro': 6500,
      'AI': 8999,
      'Pro Trial': 0,
      'Pro Trail WhatsApp Trial': 0,
      'Free': 0,
      'Starter NY': 3500,
      'Starter NY (WA)': 3500,
      'Starter NM': 3500,
      'Starter NM (WA)': 3500,
      'Pro NY': 6500,
      'Pro NM': 6500,
      'Pro NM (WA)': 6500,
      'Enterprise AI': 8999
    };

    const yearlyPlanFlat = {
      'Broadcast': 14500,
      'Standard': 35000,
      'Pro': 72000,
      'AI': 96000
    };

    const monthlyPrice = planPrices[planSelect.value] !== undefined ? planPrices[planSelect.value] : 9999;
    const cycle = cycleSelect.value;

    let multiplier = 1;
    let days = 30;

    if (cycle === '2 Months') { multiplier = 2; days = 60; }
    else if (cycle === '4 Months') { multiplier = 4; days = 120; }
    else if (cycle === '6 Months') { multiplier = 6; days = 180; }
    else if (cycle === '9 Months') { multiplier = 9; days = 270; }
    else if (cycle === 'Yearly') { multiplier = 10; days = 365; }
    else { multiplier = 1; days = 30; }

    if (monthlyPrice === 0) {
      amountInput.value = '₹ 0.00';
      if (daysLeftInput) daysLeftInput.value = '14';
    } else {
      const total = (cycle === 'Yearly' && yearlyPlanFlat[planSelect.value]) 
        ? yearlyPlanFlat[planSelect.value] 
        : monthlyPrice * multiplier;
      amountInput.value = `₹ ${total.toLocaleString('en-IN')}.00`;
      if (daysLeftInput) daysLeftInput.value = days.toString();
    }
  }

  function openAddClientModal() {
    const modal = $('#modal-container');
    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="modal-box-card" style="border-top: 4px solid #1877F2; max-width: 740px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <div>
              <div style="font-size:1.2rem; font-weight:800; color:#1E293B; display:flex; align-items:center; gap:0.5rem;">
                <span>🏢</span> Onboard New Client & Provision Subscription
              </div>
              <p style="font-size:0.8rem; color:#64748B; margin-top:2px;">
                Instant tenant provisioning with automated duration proration & quota allocation.
              </p>
            </div>
            <button onclick="window.smatApp.closeModal()" style="background:none; border:none; font-size:1.2rem; cursor:pointer; color:#64748B;">✕</button>
          </div>
          
          <form id="add-client-form" onsubmit="window.smatApp.handleAddClientSubmit(event)">
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label class="filter-item-label">Client / Company Name *</label>
                <input type="text" id="add-client-name" class="filter-search-box" placeholder="e.g. Acme Innovations Pvt Ltd" required />
              </div>
              <div>
                <label class="filter-item-label">Primary Email Address *</label>
                <input type="email" id="add-client-email" class="filter-search-box" placeholder="e.g. contact@acme.com" required />
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label class="filter-item-label">Primary Phone Number *</label>
                <input type="text" id="add-client-phone" class="filter-search-box" placeholder="e.g. +91-9876543210" required />
              </div>
              <div>
                <label class="filter-item-label">Alternate Phone Number</label>
                <input type="text" id="add-client-alt-phone" class="filter-search-box" placeholder="e.g. +91-9123456789" />
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label class="filter-item-label">Customer Type</label>
                <select id="add-client-customer-type" class="filter-search-box" style="padding-left:0.75rem;">
                  <option value="Direct">Direct</option>
                  <option value="Reseller">Reseller</option>
                  <option value="Reseller Client">Reseller Client</option>
                  <option value="Channel Partners">Channel Partners</option>
                  <option value="Referral">Referral</option>
                </select>
              </div>
              <div>
                <label class="filter-item-label">Account Type</label>
                <select id="add-client-account-type" class="filter-search-box" style="padding-left:0.75rem;">
                  <option value="Client Accounts">Client Accounts</option>
                  <option value="Testing Accounts">Testing Accounts</option>
                </select>
              </div>
              <div>
                <label class="filter-item-label">Plan Name *</label>
                <select id="add-client-plan-name" class="filter-search-box" style="padding-left:0.75rem;" onchange="window.smatApp.updateAddClientAmountCalc()">
                  <option value="Pro">Pro (₹6,500/mo | ₹72,000/yr)</option>
                  <option value="Broadcast">Broadcast (₹1,499/mo | ₹14,500/yr)</option>
                  <option value="Standard">Standard (₹3,500/mo | ₹35,000/yr)</option>
                  <option value="AI">AI (₹8,999/mo | ₹96,000/yr)</option>
                  <option value="Pro Trial">Pro Trial (₹0.00)</option>
                </select>
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label class="filter-item-label">Billing Cycle / Duration *</label>
                <select id="add-client-billing-cycle" class="filter-search-box" style="padding-left:0.75rem;" onchange="window.smatApp.updateAddClientAmountCalc()">
                  <option value="Monthly">Monthly (1 Month)</option>
                  <option value="2 Months">2 Months Custom (Monthly × 2)</option>
                  <option value="4 Months">4 Months Custom (Monthly × 4)</option>
                  <option value="6 Months">6 Months Custom (Monthly × 6)</option>
                  <option value="9 Months">9 Months Custom (Monthly × 9)</option>
                  <option value="Yearly">Yearly (12 Months - Save 20%)</option>
                </select>
              </div>
              <div>
                <label class="filter-item-label">Subscription Amount (Calculated)</label>
                <input type="text" id="add-client-amount" class="filter-search-box" value="₹ 9,999.00" readonly style="background:#F8FAFC; font-weight:700;" />
              </div>
              <div>
                <label class="filter-item-label">Days Left (Valid Until)</label>
                <input type="number" id="add-client-days-left" class="filter-search-box" value="30" min="1" max="365" />
              </div>
            </div>

            <!-- Optional Add-ons & Auto-Pay Allocation -->
            <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:0.75rem 1rem; margin-bottom:1rem;">
              <div style="font-size:0.78rem; font-weight:700; color:#334155; margin-bottom:0.5rem; text-transform:uppercase;">Add-on Allocation & Auto-Pay Settings</div>
              <div style="display:flex; flex-wrap:wrap; gap:1.25rem; font-size:0.8rem; color:#475569;">
                <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                  <input type="checkbox" id="add-client-addon-wa" />
                  <span>Extra WhatsApp Pack (+5,000 Chats)</span>
                </label>
                <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                  <input type="checkbox" id="add-client-addon-bot" />
                  <span>Extra Bot Instance (+2 Bots)</span>
                </label>
                <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                  <input type="checkbox" id="add-client-autopay" checked />
                  <span><strong style="color:#16A34A;">⚡ Auto-Pay Enabled</strong> (Automated Recurring Renewal)</span>
                </label>
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label class="filter-item-label">Deployment Architecture *</label>
                <select id="add-client-deployment-type" class="filter-search-box" style="padding-left:0.75rem;">
                  <option value="Direct">🌐 Direct SaaS Multi-Tenant</option>
                  <option value="White-Label">🏷️ White-Label Reseller Platform</option>
                  <option value="On-Premise">🛡️ On-Premise Enterprise VPC</option>
                </select>
              </div>
              <div>
                <label class="filter-item-label">Custom Domain / Server Host</label>
                <input type="text" id="add-client-custom-domain" class="filter-search-box" placeholder="e.g. bot.acme.com or AWS VPC Node 01" />
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
              <div>
                <label class="filter-item-label">Sales Person</label>
                <select id="add-client-sales-person" class="filter-search-box" style="padding-left:0.75rem;">
                  <option value="Rahul Sharma">Rahul Sharma</option>
                  <option value="Pooja Reddy">Pooja Reddy</option>
                  <option value="Sameer Khan">Sameer Khan</option>
                  <option value="Amit Patel">Amit Patel</option>
                </select>
              </div>
              <div>
                <label class="filter-item-label">Support Person</label>
                <select id="add-client-support-person" class="filter-search-box" style="padding-left:0.75rem;">
                  <option value="Kiran Kumar">Kiran Kumar</option>
                  <option value="Vikas Rao">Vikas Rao</option>
                  <option value="Ananya Sen">Ananya Sen</option>
                  <option value="Suresh Raina">Suresh Raina</option>
                </select>
              </div>
              <div>
                <label class="filter-item-label">Test Account</label>
                <select id="add-client-test-account" class="filter-search-box" style="padding-left:0.75rem;">
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:0.75rem; border-top: 1px solid #E2E8F0; padding-top: 1.25rem;">
              <button type="button" class="btn-table-action btn-action-secondary" onclick="window.smatApp.closeModal()">Cancel</button>
              <button type="submit" class="btn-table-action btn-action-primary" style="padding:0.6rem 1.5rem; font-size:0.88rem;">+ Provision Client Account</button>
            </div>
          </form>
        </div>
    `;
  }

  function handleAddClientSubmit(e) {
    e.preventDefault();
    const name = $('#add-client-name').value.trim();
    const email = $('#add-client-email').value.trim();
    const phone = $('#add-client-phone').value.trim();
    const altPhone = $('#add-client-alt-phone').value.trim();
    const customerType = $('#add-client-customer-type').value;
    const accountType = $('#add-client-account-type').value;
    const planName = $('#add-client-plan-name').value;
    const billingCycle = $('#add-client-billing-cycle').value;
    const amountStr = $('#add-client-amount').value.trim() || '₹ 0.00';
    const salesPerson = $('#add-client-sales-person').value;
    const supportPerson = $('#add-client-support-person').value;
    const daysLeft = parseInt($('#add-client-days-left').value) || 14;
    const isTest = $('#add-client-test-account').value;
    const deploymentType = $('#add-client-deployment-type')?.value || 'White-Label';
    const customDomainOrHost = $('#add-client-custom-domain')?.value.trim() || '';
    const isWhiteLabel = deploymentType === 'White-Label';

    const isPaid = planName.includes('NY') || planName.includes('NM') || planName.includes('Enterprise');
    const now = new Date();
    now.setDate(now.getDate() + daysLeft);
    const endFormatted = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;

    const nextId = clientsData.length > 0 ? Math.max(...clientsData.map(c => c.id || 0)) + 1 : 1;
    const cleanDomain = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10) + '.com';

    const newClient = {
      id: nextId,
      s_no: 1,
      name: name,
      phone_number: phone.startsWith('+') ? phone : (phone.length === 10 ? `+91-${phone}` : phone),
      alternate_phone: altPhone,
      email: email,
      customer_type: customerType,
      account_type: accountType,
      plan_name: planName,
      plan_type: isPaid ? 'Paid_plan' : 'Trial_plan',
      billing_cycle: billingCycle,
      subscription_amount_display: amountStr.startsWith('₹') || amountStr.startsWith('$') ? amountStr : `₹ ${amountStr}`,
      inr_amount: parseFloat(amountStr.replace(/[^0-9.]/g, '')) || 0,
      usd_amount: Math.round((parseFloat(amountStr.replace(/[^0-9.]/g, '')) || 0) / 80),
      end_date: endFormatted,
      days_left: daysLeft,
      bots_limit: isPaid ? 25 : 10,
      bots_used: 0,
      chats_limit: isPaid ? 50000 : 500,
      chats_used: 0,
      service_chats_limit: isPaid ? 1000 : 200,
      service_chats_used: 0,
      bi_chats_limit: 0,
      bi_chats_used: 0,
      gst_number: '-',
      url: cleanDomain,
      test_account: isTest,
      subscription_status: isPaid ? 'Active' : 'Trial',
      sales_person: salesPerson,
      support_person: supportPerson,
      currency_type: amountStr.includes('$') ? 'USD' : 'INR',
      zoho_customer_id: `ZC-${Math.floor(100000 + Math.random() * 900000)}`,
      subscription_id: `SUB-${name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'CLI')}-${new Date().getFullYear()}`,
      deployment_type: deploymentType,
      custom_domain: isWhiteLabel ? (customDomainOrHost || `bot.${cleanDomain}`) : null,
      sub_clients_count: isWhiteLabel ? 1 : 0,
      white_label_brand: isWhiteLabel ? `${name} AI Portal` : null,
      ssl_status: isWhiteLabel ? 'Active (SSL 🔒)' : null,
      server_host: !isWhiteLabel ? (customDomainOrHost || 'AWS Dedicated VPC (Mumbai DC) - Node 01') : null,
      cluster_health: !isWhiteLabel ? '🟢 100% Operational' : null,
      engine_version: !isWhiteLabel ? 'v4.2.0 Enterprise Node' : null,
      license_key: !isWhiteLabel ? `LIC-ONPREM-2026-X${String(nextId).padStart(3, '0')}` : null
    };

    clientsData.unshift(newClient);
    clientsData.forEach((c, idx) => {
      c.s_no = idx + 1;
    });

    localStorage.setItem('smatbot_clients_data', JSON.stringify(clientsData));
    closeModal();
    showToast(`Client "${newClient.name}" created with ${newClient.deployment_type} deployment!`);
    clientCurrentPage = 1;
    renderClientDetailsView($('#route-viewport'));
  }


  function resetFilters() {
    filterState = {
      planType: 'All',
      accountType: 'All',
      billingCycle: 'All',
      customerTypes: [...ALL_CUSTOMER_TYPES],
      planNames: [...ALL_PLAN_NAMES],
      supportPlan: 'All',
      lostClientStatus: 'All',
      salesPerson: 'All',
      supportPerson: 'All',
      currencyType: 'All',
      inrMin: '',
      inrMax: '',
      usdMin: '',
      usdMax: '',
      subscriptionStatus: 'All',
      duration: 'All Time',
      search: '',
      newThisMonthOnly: false,
      activeSegmentTab: 'all'
    };
    clientCurrentPage = 1;
    renderClientDetailsView($('#route-viewport'));
    showToast('Filters reset to default.');
  }

  // Modals for Client Profile
  function toggleClientTestAccount(clientId) {
    const client = clientsData.find(c => c.id === clientId);
    if (client) {
      client.test_account = client.test_account === 'Yes' ? 'No' : 'Yes';
      localStorage.setItem('smatbot_clients_data', JSON.stringify(clientsData));
      showToast(`Test account status set to "${client.test_account}" for ${client.name}`);
      renderClientDetailsProfileView($('#route-viewport'));
    }
  }

  function openEditProfileModal(clientId) {
    const client = clientsData.find(c => c.id === clientId) || clientsData[0];
    const clientUrl = client.url || client.company_url || (client.email.includes('@') && !client.email.endsWith('gmail.com') ? client.email.split('@')[1] : 'alignbooks.com');
    const modal = $('#modal-container');
    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="modal-box-card" style="border-top: 4px solid #1877F2; max-width: 680px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <div>
              <div style="font-size:1.15rem; font-weight:800; color:#1E293B;">✎ Edit Profile Details: ${client.name}</div>
              <p style="font-size:0.8rem; color:#64748B; margin-top:2px;">Update company details, GST, CRM & account parameters</p>
            </div>
            <button onclick="window.smatApp.closeModal()" style="background:none; border:none; font-size:1.2rem; cursor:pointer;">✕</button>
          </div>
          <form id="edit-profile-form">
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label class="filter-item-label">Full Name</label>
                <input type="text" id="edit-name" class="filter-search-box" value="${client.name}" required />
              </div>
              <div>
                <label class="filter-item-label">Email Address</label>
                <input type="email" id="edit-email" class="filter-search-box" value="${client.email}" required />
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label class="filter-item-label">Mobile Number</label>
                <input type="text" id="edit-mobile" class="filter-search-box" value="${client.phone_number}" required />
              </div>
              <div>
                <label class="filter-item-label">Alternate Mobile</label>
                <input type="text" id="edit-alt-mobile" class="filter-search-box" value="${client.alternate_phone || ''}" placeholder="-" />
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label class="filter-item-label">GST Number</label>
                <input type="text" id="edit-gst" class="filter-search-box" value="${client.gst_number || ''}" placeholder="e.g. 36AAACH7409R1ZZ" />
              </div>
              <div>
                <label class="filter-item-label">Customer Type</label>
                <select id="edit-customer-type" class="filter-search-box" style="padding-left:0.75rem;">
                  <option value="Direct" ${client.customer_type === 'Direct' ? 'selected' : ''}>Direct</option>
                  <option value="Reseller" ${client.customer_type === 'Reseller' ? 'selected' : ''}>Reseller</option>
                  <option value="Reseller Client" ${client.customer_type === 'Reseller Client' ? 'selected' : ''}>Reseller Client</option>
                  <option value="Channel Partners" ${client.customer_type === 'Channel Partners' ? 'selected' : ''}>Channel Partners</option>
                  <option value="Referral" ${client.customer_type === 'Referral' ? 'selected' : ''}>Referral</option>
                </select>
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label class="filter-item-label">Zoho Customer Id</label>
                <input type="text" id="edit-zoho-id" class="filter-search-box" value="${client.zoho_customer_id || ''}" />
              </div>
              <div>
                <label class="filter-item-label">Company Website URL</label>
                <input type="text" id="edit-url" class="filter-search-box" value="${clientUrl}" />
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label class="filter-item-label">Deployment Architecture</label>
                <select id="edit-deployment-type" class="filter-search-box" style="padding-left:0.75rem;">
                  <option value="White-Label" ${client.deployment_type === 'White-Label' ? 'selected' : ''}>🏷️ White-Label Reseller Platform</option>
                  <option value="On-Premise" ${client.deployment_type === 'On-Premise' ? 'selected' : ''}>🛡️ On-Premise Enterprise VPC</option>
                </select>
              </div>
              <div>
                <label class="filter-item-label">Custom Domain / Server Host</label>
                <input type="text" id="edit-deployment-host" class="filter-search-box" value="${client.deployment_type === 'White-Label' ? (client.custom_domain || '') : (client.server_host || '')}" placeholder="e.g. bot.domain.com or AWS VPC Node 01" />
              </div>
            </div>

            <div style="margin-bottom: 1.5rem;">
              <label class="filter-item-label">Test Account Status</label>
              <select id="edit-test-account" class="filter-search-box" style="padding-left:0.75rem; width: 50%;">
                <option value="No" ${client.test_account === 'No' ? 'selected' : ''}>No</option>
                <option value="Yes" ${client.test_account === 'Yes' ? 'selected' : ''}>Yes</option>
              </select>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:0.5rem; border-top: 1px solid #E2E8F0; padding-top: 1.25rem;">
              <button type="button" class="btn-table-action btn-action-secondary" onclick="window.smatApp.closeModal()">Cancel</button>
              <button type="submit" class="btn-table-action btn-action-primary">Save Profile</button>
            </div>
          </form>
        </div>
      </div>
    `;

    $('#edit-profile-form').addEventListener('submit', (e) => {
      e.preventDefault();
      client.name = $('#edit-name').value.trim();
      client.email = $('#edit-email').value.trim();
      client.phone_number = $('#edit-mobile').value.trim();
      client.alternate_phone = $('#edit-alt-mobile').value.trim();
      client.gst_number = $('#edit-gst').value.trim() || '-';
      client.customer_type = $('#edit-customer-type').value;
      client.zoho_customer_id = $('#edit-zoho-id').value.trim();
      client.url = $('#edit-url').value.trim();
      client.test_account = $('#edit-test-account').value;

      const newDepType = $('#edit-deployment-type').value;
      const newDepHost = $('#edit-deployment-host').value.trim();
      client.deployment_type = newDepType;
      if (newDepType === 'White-Label') {
        client.custom_domain = newDepHost || `bot.${client.url || 'domain.com'}`;
        if (!client.white_label_brand) client.white_label_brand = `${client.name} AI Hub`;
        if (!client.ssl_status) client.ssl_status = 'Active (SSL 🔒)';
        if (!client.sub_clients_count) client.sub_clients_count = 1;
      } else {
        client.server_host = newDepHost || 'AWS Dedicated VPC (Mumbai DC) - Node 01';
        if (!client.cluster_health) client.cluster_health = '🟢 100% Operational';
        if (!client.engine_version) client.engine_version = 'v4.2.0 Enterprise Node';
        if (!client.license_key) client.license_key = `LIC-ONPREM-2026-X${String(client.id).padStart(3, '0')}`;
      }

      localStorage.setItem('smatbot_clients_data', JSON.stringify(clientsData));
      showToast('Profile and Deployment architecture updated successfully!');
      closeModal();
      renderClientDetailsProfileView($('#route-viewport'));
    });
  }


  function openEditChatQuotaModal(clientId, quotaType) {
    const client = clientsData.find(c => c.id === clientId) || clientsData[0];
    const modal = $('#modal-container');
    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="modal-box-card" style="border-top: 4px solid #1877F2; max-width: 580px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <div>
              <div style="font-size:1.15rem; font-weight:800; color:#1E293B;">✎ Modify Chat & Bot Limits: ${client.name}</div>
              <p style="font-size:0.8rem; color:#64748B; margin-top:2px;">Adjust conversational message quotas and bot slots</p>
            </div>
            <button onclick="window.smatApp.closeModal()" style="background:none; border:none; font-size:1.2rem; cursor:pointer;">✕</button>
          </div>
          <form id="edit-quota-form">
            <div style="margin-bottom:1rem;">
              <label class="filter-item-label">Total Allowed Chats (General)</label>
              <input type="number" id="edit-chats-limit" class="filter-search-box" value="${client.chats_limit || 5000}" required />
            </div>
            <div style="margin-bottom:1rem;">
              <label class="filter-item-label">Number of Service Chats (User Initiated)</label>
              <input type="number" id="edit-service-chats-limit" class="filter-search-box" value="${client.service_chats_limit !== undefined ? client.service_chats_limit : 1000}" required />
            </div>
            <div style="margin-bottom:1rem;">
              <label class="filter-item-label">Number of BI Chats (Business Initiated)</label>
              <input type="number" id="edit-bi-chats-limit" class="filter-search-box" value="${client.bi_chats_limit !== undefined ? client.bi_chats_limit : 0}" required />
            </div>
            <div style="margin-bottom:1.5rem;">
              <label class="filter-item-label">Total Allowed Bots</label>
              <input type="number" id="edit-bots-limit" class="filter-search-box" value="${client.bots_limit || 10}" required />
            </div>
            <div style="display:flex; justify-content:flex-end; gap:0.5rem; border-top: 1px solid #E2E8F0; padding-top: 1.25rem;">
              <button type="button" class="btn-table-action btn-action-secondary" onclick="window.smatApp.closeModal()">Cancel</button>
              <button type="submit" class="btn-table-action btn-action-primary">Update Limits</button>
            </div>
          </form>
        </div>
      </div>
    `;

    $('#edit-quota-form').addEventListener('submit', (e) => {
      e.preventDefault();
      client.chats_limit = parseInt($('#edit-chats-limit').value) || 0;
      client.service_chats_limit = parseInt($('#edit-service-chats-limit').value) || 0;
      client.bi_chats_limit = parseInt($('#edit-bi-chats-limit').value) || 0;
      client.bots_limit = parseInt($('#edit-bots-limit').value) || 0;
      
      localStorage.setItem('smatbot_clients_data', JSON.stringify(clientsData));
      showToast('Quota limits updated successfully!');
      closeModal();
      renderClientDetailsProfileView($('#route-viewport'));
    });
  }

  function openExpireModal(clientId) {
    const client = clientsData.find(c => c.id === clientId) || clientsData[0];
    const modal = $('#modal-container');
    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="modal-box-card" style="border-top: 4px solid #E11D48;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <div style="font-size:1.15rem; font-weight:800; color:#BE123C;">⚠️ Expire Subscription</div>
            <button onclick="window.smatApp.closeModal()" style="background:none; border:none; font-size:1.2rem; cursor:pointer;">✕</button>
          </div>
          <p style="font-size:0.9rem; color:#475569; margin-bottom:1.25rem;">
            Are you sure you want to expire the active plan for <strong>${client.name}</strong> (<code>${client.email}</code>)?
          </p>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.closeModal()">Cancel</button>
            <button class="btn-table-action btn-action-primary" style="background:#E11D48;" onclick="window.smatApp.confirmExpire(${client.id})">Confirm Expiration</button>
          </div>
        </div>
      </div>
    `;
  }

  function confirmExpire(clientId) {
    const client = clientsData.find(c => c.id === clientId);
    if (client) {
      client.subscription_status = 'Expired';
      client.days_left = 0;
      localStorage.setItem('smatbot_clients_data', JSON.stringify(clientsData));
    }
    showToast(`Subscription for ${client?.name || 'Client'} has been expired.`);
    closeModal();
    renderClientDetailsProfileView($('#route-viewport'));
  }

  function openCommentsModal(clientId) {
    const client = clientsData.find(c => c.id === clientId) || clientsData[0];
    const modal = $('#modal-container');
    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="modal-box-card" style="border-top: 4px solid #1877F2;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <div style="font-size:1.15rem; font-weight:800; color:#1E293B;">💬 Internal Admin Comments: ${client.name}</div>
            <button onclick="window.smatApp.closeModal()" style="background:none; border:none; font-size:1.2rem; cursor:pointer;">✕</button>
          </div>
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:6px; padding:0.85rem; margin-bottom:1rem; font-size:0.85rem; color:#475569;">
            <strong>[2026-09-28 by Sukanya Nagireddy]:</strong> Client requested WhatsApp Business API template approvals. Migration completed.
          </div>
          <form id="comment-form">
            <textarea class="filter-search-box" style="height:80px; padding:0.75rem; resize:none; margin-bottom:1rem;" placeholder="Add an internal operational note..."></textarea>
            <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
              <button type="button" class="btn-table-action btn-action-secondary" onclick="window.smatApp.closeModal()">Close</button>
              <button type="submit" class="btn-table-action btn-action-primary">Add Note</button>
            </div>
          </form>
        </div>
      </div>
    `;

    $('#comment-form').addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Comment saved to client audit log!');
      closeModal();
    });
  }

  function openDocumentsModal(clientId) {
    const client = clientsData.find(c => c.id === clientId) || clientsData[0];
    const modal = $('#modal-container');
    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="modal-box-card" style="border-top: 4px solid #1877F2;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <div style="font-size:1.15rem; font-weight:800; color:#1E293B;">📄 Client Documents & Contracts: ${client.name}</div>
            <button onclick="window.smatApp.closeModal()" style="background:none; border:none; font-size:1.2rem; cursor:pointer;">✕</button>
          </div>
          <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; padding:0.75rem; border:1px solid #E2E8F0; border-radius:6px;">
              <div>
                <div style="font-weight:700; font-size:0.88rem;">SmatBot_SaaS_Service_Agreement_2026.pdf</div>
                <div style="font-size:0.75rem; color:#64748B;">Uploaded: 28 Sep 2026 • 2.4 MB</div>
              </div>
              <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.showToast('Downloading SLA contract...')">Download</button>
            </div>
          </div>
          <div style="display:flex; justify-content:flex-end;">
            <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.closeModal()">Close</button>
          </div>
        </div>
      </div>
    `;
  }

  function openBotDetailsModal(clientId) {
    const client = clientsData.find(c => c.id === clientId) || clientsData[0];
    const modal = $('#modal-container');
    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="modal-box-card" style="border-top: 4px solid #1877F2;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <div style="font-size:1.15rem; font-weight:800; color:#1E293B;">🤖 Bot Details: ${client.name}</div>
            <button onclick="window.smatApp.closeModal()" style="background:none; border:none; font-size:1.2rem; cursor:pointer;">✕</button>
          </div>
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:1rem; margin-bottom:1.25rem; font-size:0.88rem;">
            <strong>Bot Flow:</strong> Website Lead & Customer Support Bot (24 Flow Nodes)<br/>
            <strong>Status:</strong> <span class="status-pill active" style="font-size:0.75rem; padding:2px 8px;">Live</span>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.closeModal()">Close</button>
            <button class="btn-table-action btn-action-primary" onclick="window.smatApp.openMigrateWizardModal()">Migrate Bot</button>
          </div>
        </div>
      </div>
    `;
  }

  function openWhatsAppBotDetailsModal(clientId) {
    const client = clientsData.find(c => c.id === clientId) || clientsData[0];
    const modal = $('#modal-container');
    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="modal-box-card" style="border-top: 4px solid #16A34A;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <div style="font-size:1.15rem; font-weight:800; color:#1E293B;">💬 WhatsApp Bot Details: ${client.name}</div>
            <button onclick="window.smatApp.closeModal()" style="background:none; border:none; font-size:1.2rem; cursor:pointer;">✕</button>
          </div>
          <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:8px; padding:1rem; margin-bottom:1.25rem; font-size:0.88rem; color:#166534;">
            <strong>Phone Binding:</strong> ${client.phone_number} (Verified WABA)<br/>
            <strong>Webhook Status:</strong> Connected & Synchronized with Meta Cloud API
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.closeModal()">Close</button>
            <button class="btn-table-action btn-action-primary" style="background:#16A34A;" onclick="window.smatApp.showToast('Test WhatsApp message sent to ${client.phone_number}!'); window.smatApp.closeModal();">Send Test Message</button>
          </div>
        </div>
      </div>
    `;
  }

  function copyToClipboard(text, label) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied ${label || 'value'}: ${text}`);
      }).catch(() => {
        showToast(`Copied: ${text}`);
      });
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast(`Copied: ${text}`);
    }
  }

  function closeModal() {
    const modal = $('#modal-container');
    if (modal) modal.innerHTML = '';
  }

  function toggleSidebar() {
    const wrapper = $('.app-layout-wrapper');
    if (wrapper) {
      wrapper.classList.toggle('sidebar-collapsed');
    }
  }

  function triggerSyncAddress() {
    showToast('Customer address synced successfully with Zoho CRM!');
  }

  function toggleUserMenu() {
    const dropdown = $('#user-menu-dropdown');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  }

  function showToast(msg) {
    const toast = $('#toast-container');
    if (!toast) return;
    toast.innerHTML = `
      <div class="pastel-toast">
        <span style="color:#1877F2; font-size:1.2rem;">✓</span>
        <span>${msg}</span>
      </div>
    `;
    setTimeout(() => {
      toast.innerHTML = '';
    }, 3200);
  }

  // Public API
  window.smatApp = {
    init,
    navigateTo,
    handleLoginSubmit,
    quickDemoLogin,
    showSavedLoginsPopup,
    hideSavedLoginsPopup,
    selectSavedLogin,
    removeLoginFromHistory,
    logout,
    toggleDropdown,
    selectSingleOption,
    toggleCheckboxOption,
    toggleSelectAllCustomerTypes,
    toggleSelectAllPlanNames,
    updateRange,
    updateSearch,
    applyFilters,
    resetFilters,
    changePageSize,
    goToPage,
    openAddClientModal,
    handleAddClientSubmit,
    openClientDetailsPage,
    toggleAccordion,
    openBotDetailsModal,
    openWhatsAppBotDetailsModal,
    openEditProfileModal,
    openEditChatQuotaModal,
    toggleClientTestAccount,
    openExpireModal,
    confirmExpire,
    openCommentsModal,
    openDocumentsModal,
    openLoginConfirmModal,
    confirmLoginToDashboard,
    loginToDashboard,
    filterClientBots,
    toggleBotActiveStatus,
    exitImpersonation,
    openMigrateWizardModal,
    setWizMode,
    updateWizField,
    nextWizStep,
    prevWizStep,
    startMigrationExecution,
    finishMigration,
    rollbackMigration,
    viewMigrationLogs,
    openAddUserModal,
    openEditUserModal,
    openPlanModal,
    toggleBillingFrequency,
    updateSubSearch,
    updateSubStatus,
    resetSubFilters,
    goToSubPage,
    updateRenewalSearch,
    updateRenewalStatus,
    resetRenewalFilters,
    goToRenewalPage,
    openAddCouponModal,
    handleAddCouponSubmit,
    toggleCouponStatus,
    deleteCoupon,
    updateCouponTypePlaceholder,
    copyToClipboard,
    closeModal,
    toggleSidebar,
    triggerSyncAddress,
    toggleUserMenu,
    setPartnersTab,
    filterNewClientsThisMonth,
    clearNewClientsFilter,
    openNewClientsModal,
    resetToDefaultData,
    openDowngradeImpactModal,
    executeDowngrade,
    openAutoPayModal,
    toggleAutoPay,
    openCancelSubscriptionModal,
    selectCancelOption,
    confirmSubscriptionCancellation,
    openUpdatePaymentMethodModal,
    renderClientBillingPortal,
    returnToClientBotsGrid,
    selectSegmentTab,
    openClientQuickDrawer,
    closeClientDrawer,
    renderOverviewView,
    renderPlansView,
    renderAddonsView,
    renderImpersonationView,
    filterImpersonationClients,
    updateAddClientAmountCalc,
    showToast
  };

  document.addEventListener('DOMContentLoaded', init);
})();
