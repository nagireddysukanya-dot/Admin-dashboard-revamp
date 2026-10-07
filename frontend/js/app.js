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
    newThisMonthOnly: false
  };

  const ALL_CUSTOMER_TYPES = ['Direct', 'Reseller', 'White-Label', 'On-Premise', 'Reseller Client', 'Channel Partners', 'Referral'];
  const ALL_PLAN_NAMES = [
    'Pro NY', 'Starter NY (WA)', 'Starter NY', 'Pro NM (WA)', 'Pro NM',
    'Starter NM (WA)', 'Starter NM', 'test plan', 'TESTAPICHANGE', 'Pro Trail WhatsApp', 'Pro Trial', 'Pro Trail WhatsApp Trial'
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
            <div class="sidebar-section-title">Admin Modules</div>

            <!-- 1. Client Details -->
            <a class="nav-link-item ${currentRoute === 'client-details' || currentRoute === 'client-details-profile' ? 'active' : ''}" onclick="window.smatApp.navigateTo('client-details')">
              <span class="nav-link-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </span>
              <span>Clients & Directory</span>
            </a>

            <!-- 2. Chatbots & Migrate Bot -->
            <a class="nav-link-item ${currentRoute === 'chatbots' ? 'active' : ''}" onclick="window.smatApp.navigateTo('chatbots')">
              <span class="nav-link-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path></svg>
              </span>
              <span>Migrate Bot Engine</span>
            </a>

            <!-- 3. Team & Users -->
            <a class="nav-link-item ${currentRoute === 'users' ? 'active' : ''}" onclick="window.smatApp.navigateTo('users')">
              <span class="nav-link-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </span>
              <span>Add Users & Access</span>
            </a>

            <!-- 4. Plan Activation -->
            <a class="nav-link-item ${currentRoute === 'plans' ? 'active' : ''}" onclick="window.smatApp.navigateTo('plans')">
              <span class="nav-link-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              </span>
              <span>Plan Activation</span>
            </a>

            <!-- 5. Client Subscriptions -->
            <a class="nav-link-item ${currentRoute === 'subscriptions' ? 'active' : ''}" onclick="window.smatApp.navigateTo('subscriptions')">
              <span class="nav-link-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
              </span>
              <span>Client Subscriptions</span>
            </a>

            <!-- 6. Renewals -->
            <a class="nav-link-item ${currentRoute === 'renewals' ? 'active' : ''}" onclick="window.smatApp.navigateTo('renewals')">
              <span class="nav-link-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
              </span>
              <span>Renewals</span>
            </a>

            <!-- 7. Addons -->
            <a class="nav-link-item ${currentRoute === 'addons' ? 'active' : ''}" onclick="window.smatApp.navigateTo('addons')">
              <span class="nav-link-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </span>
              <span>Addons</span>
            </a>

            <!-- 8. Partners -->
            <a class="nav-link-item ${currentRoute === 'partners' ? 'active' : ''}" onclick="window.smatApp.navigateTo('partners')">
              <span class="nav-link-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="3" width="6" height="4" rx="1"></rect><rect x="3" y="17" width="6" height="4" rx="1"></rect><rect x="15" y="17" width="6" height="4" rx="1"></rect><path d="M12 7v4"></path></svg>
              </span>
              <span>Partners</span>
            </a>

            <!-- 9. Coupons -->
            <a class="nav-link-item ${currentRoute === 'coupons' ? 'active' : ''}" onclick="window.smatApp.navigateTo('coupons')">
              <span class="nav-link-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              </span>
              <span>Coupons</span>
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
              
              <button class="btn-sync-address" onclick="window.smatApp.triggerSyncAddress()">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="1 4 1 10 7 10"></polyline>
                  <polyline points="23 20 23 14 17 14"></polyline>
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                </svg>
                Sync Customer Address
              </button>

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
      'client-details': 'Client Details',
      'client-details-profile': 'Client Profile Details View',
      'chatbots': 'Bot Migration Engine & Workflows',
      'users': 'Team & Role-Based Access Control',
      'plans': 'Plan Activation & Pricing Subscriptions',
      'subscriptions': 'Active Client Subscriptions',
      'renewals': 'Subscription Renewals',
      'addons': 'Platform Addons & Integrations',
      'partners': 'Agency & Channel Partners Directory',
      'coupons': 'Discount Coupons & Vouchers'
    };
    if (titleEl) titleEl.innerText = titles[route] || 'SmatBot Admin Control Center';

    const viewport = $('#route-viewport');
    if (!viewport) return;

    if (route === 'client-details') {
      renderClientDetailsView(viewport);
    } else if (route === 'client-details-profile') {
      renderClientDetailsProfileView(viewport);
    } else if (route === 'chatbots') {
      renderChatbotsView(viewport);
    } else if (route === 'users') {
      renderUsersView(viewport);
    } else if (route === 'plans') {
      renderPlansView(viewport);
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
  // 3. MODULE 1: CLIENT DETAILS TABLE & 15 FILTERS
  // =========================================================================
  function renderClientDetailsView(container) {
    const totalClients = clientsData.length;
    const activeClients = clientsData.filter(c => c.subscription_status === 'Active').length;
    const trialClients = clientsData.filter(c => c.subscription_status === 'Trial' || (!c.subscription_status && (c.plan_name || '').toLowerCase().includes('trial'))).length;
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
        <div class="metric-summary-card">
          <div class="metric-card-top-row">
            <div class="metric-card-badge">
              <div class="metric-icon-circle purple">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <span class="metric-card-label">TOTAL CUSTOMERS</span>
            </div>
            <button class="metric-btn-pill" onclick="window.smatApp.openAddClientModal()">+ Add Client</button>
          </div>
          <div class="metric-card-big-value">
            ${totalClients} <span class="metric-sub-limit">Accounts</span>
            <span class="metric-monthly-growth-pill clickable" onclick="window.smatApp.filterNewClientsThisMonth()" title="Click to filter 18 new clients">✨ +18 New</span>
          </div>
          <div class="metric-card-subtext" onclick="window.smatApp.filterNewClientsThisMonth()" style="cursor:pointer;" title="Click to filter 18 new clients">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0; color:#10B981;"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
            <span><strong style="color:#059669;">+18 new accounts</strong> added this month</span>
          </div>
        </div>

        <!-- Card 2: ACTIVE CLIENTS -->
        <div class="metric-summary-card">
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
        <div class="metric-summary-card">
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

      <!-- Count Badge (Top-Left Badge matching screenshot 218) -->
      <div class="client-count-blue-badge" id="client-count-badge">${totalItems}</div>

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
          <span style="font-weight: 700; color: #1E293B; cursor:pointer;" onclick="window.smatApp.openClientDetailsPage(${c.id})">${c.name}</span>
        </td>
        <td>
          <span style="color: #334155;">${c.phone_number}</span>
          <button class="btn-copy-inline" onclick="window.smatApp.copyToClipboard('${c.phone_number}', 'phone number')" title="Copy Phone">
            <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
          </button>
        </td>
        <td style="color: #64748B;">${c.alternate_phone || '-'}</td>
        <td>
          <span style="color: #334155;">${c.email}</span>
          <button class="btn-copy-inline" onclick="window.smatApp.copyToClipboard('${c.email}', 'email address')" title="Copy Email">
            <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
          </button>
        </td>
        <td>
          ${c.customer_type === 'White-Label' || c.deployment_type === 'White-Label' 
            ? `<span class="cust-type-pill whitelabel" title="Custom CNAME Domain: ${c.custom_domain || 'bot.' + c.url}">🏷️ White-Label</span>` 
            : (c.customer_type === 'On-Premise' || c.deployment_type === 'On-Premise' 
              ? `<span class="cust-type-pill onpremise" title="Server: ${c.server_host || 'AWS Dedicated VPC'}">🛡️ On-Premise</span>` 
              : (c.customer_type === 'Reseller' 
                ? `<span class="cust-type-pill reseller">Reseller</span>` 
                : `<span class="cust-type-pill direct">${c.customer_type || 'Direct'}</span>`))}
        </td>
        <td style="color: #334155; font-weight:600;">${c.plan_name || 'Pro Trial'}</td>

        <td style="color: #334155;">${c.plan_type || 'Trial_plan'}</td>
        <td style="color: #1E293B; font-weight: 600;">${c.subscription_amount_display || '₹ 0.00'}</td>
        <td style="color: #334155;">${c.end_date || '08-10-2026'}</td>
        <td style="color: #334155;">${c.days_left !== undefined ? c.days_left : 13}</td>
        <td style="color: #334155;">${c.test_account || 'No'}</td>
        <td style="text-align: center;">
          <!-- Eye Action: Opens Deep-Dive Client Details Profile View -->
          <button class="btn-eye-action" onclick="window.smatApp.openClientDetailsPage(${c.id})" title="Click to View Full Details">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
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

        <!-- 3. Subscriptions Accordion -->
        <div class="details-accordion-card" id="acc-subscriptions">
          <div class="details-accordion-header" onclick="window.smatApp.toggleAccordion('acc-subscriptions')">
            <span>Subscriptions & Invoices</span>
            <span class="accordion-arrow-indicator">▼</span>
          </div>
          <div class="details-accordion-body">
            <div class="details-subcard" style="padding:1.25rem;">
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; font-size:0.88rem; color:#334155;">
                <div><strong>Subscription ID:</strong><br/><code>${client.subscription_id || 'SUB-PRO-2026'}</code></div>
                <div><strong>Billing Cycle:</strong><br/>${client.billing_cycle || 'Monthly'}</div>
                <div><strong>Subscription Amount:</strong><br/>${client.subscription_amount_display || '₹ 0.00'}</div>
                <div><strong>Valid Till:</strong><br/>${client.end_date || '08-10-2026'}</div>
                <div><strong>Status:</strong><br/><span class="status-pill ${client.subscription_status.toLowerCase()}">${client.subscription_status}</span></div>
              </div>
              <div style="margin-top:1rem; display:flex; justify-content:flex-end;">
                <button class="btn-table-action btn-action-primary" onclick="window.smatApp.openPlanModal(${client.id})">⚡ Upgrade / Renew Plan</button>
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
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
        <div>
          <h2 class="section-page-title" style="margin:0;">Plan Activation & Subscriptions</h2>
          <p style="font-size:0.85rem; color:#64748B; margin-top:4px;">Manage SaaS subscription plans, quota tiers, and custom white-label licenses.</p>
        </div>
        <button class="btn-table-action btn-action-primary" onclick="window.smatApp.openPlanModal()" style="padding:0.6rem 1.25rem; font-size:0.88rem;">
          ⚡ Activate Client Plan
        </button>
      </div>

      <!-- Billing Frequency Toggle Pill -->
      <div class="billing-toggle-container">
        <span style="font-weight:700; font-size:0.85rem; color:#1E293B;">Billing Frequency:</span>
        <div class="billing-toggle-pill">
          <button class="billing-toggle-btn ${!billingToggleYearly ? 'active' : ''}" onclick="window.smatApp.toggleBillingFrequency(false)">Monthly</button>
          <button class="billing-toggle-btn ${billingToggleYearly ? 'active' : ''}" onclick="window.smatApp.toggleBillingFrequency(true)">Yearly (Save 20% 🎉)</button>
        </div>
      </div>

      <!-- 4 Modern Pricing Tier Cards -->
      <div class="pricing-plans-grid">
        <!-- Tier 1: Starter -->
        <div class="pricing-tier-card">
          <div>
            <div style="font-weight:800; font-size:1.15rem; color:#1E293B;">Starter Plan</div>
            <div style="font-size:0.8rem; color:#64748B;">For small startups & local businesses</div>
            <div class="tier-price-amount">
              ${billingToggleYearly ? '$39' : '$49'}<span class="period"> / mo</span>
            </div>
            <ul class="pricing-features-list">
              <li><span class="check-icon">✓</span> 5,000 Chats / month</li>
              <li><span class="check-icon">✓</span> 3 Bot Instances</li>
              <li><span class="check-icon">✓</span> Web Chat Widget</li>
              <li><span class="check-icon">✓</span> Standard Lead Forms</li>
              <li><span class="check-icon">✓</span> Email SLA Support</li>
            </ul>
          </div>
          <button class="btn-table-action btn-action-secondary" style="width:100%; justify-content:center;" onclick="window.smatApp.openPlanModal(null, 'Starter')">
            Select Starter
          </button>
        </div>

        <!-- Tier 2: Professional -->
        <div class="pricing-tier-card featured">
          <div class="pricing-popular-badge">Most Popular</div>
          <div>
            <div style="font-weight:800; font-size:1.15rem; color:#1877F2;">Professional</div>
            <div style="font-size:0.8rem; color:#64748B;">For scaling companies & e-commerce</div>
            <div class="tier-price-amount">
              ${billingToggleYearly ? '$119' : '$149'}<span class="period"> / mo</span>
            </div>
            <ul class="pricing-features-list">
              <li><span class="check-icon">✓</span> <strong>25,000 Chats / month</strong></li>
              <li><span class="check-icon">✓</span> <strong>10 Bot Instances</strong></li>
              <li><span class="check-icon">✓</span> WhatsApp Business API (WABA)</li>
              <li><span class="check-icon">✓</span> NLP AI Knowledge Base FAQs</li>
              <li><span class="check-icon">✓</span> CRM Webhooks & Zapier</li>
              <li><span class="check-icon">✓</span> Live Agent Chat Transfer</li>
            </ul>
          </div>
          <button class="btn-table-action btn-action-primary" style="width:100%; justify-content:center;" onclick="window.smatApp.openPlanModal(null, 'Pro NY')">
            Activate Professional
          </button>
        </div>

        <!-- Tier 3: Enterprise AI -->
        <div class="pricing-tier-card">
          <div>
            <div style="font-weight:800; font-size:1.15rem; color:#7C3AED;">Enterprise AI</div>
            <div style="font-size:0.8rem; color:#64748B;">High-volume AI automation & Voicebots</div>
            <div class="tier-price-amount">
              ${billingToggleYearly ? '$399' : '$499'}<span class="period"> / mo</span>
            </div>
            <ul class="pricing-features-list">
              <li><span class="check-icon">✓</span> 150,000 Chats / month</li>
              <li><span class="check-icon">✓</span> 50 Bot Instances</li>
              <li><span class="check-icon">✓</span> GPT-4o & Claude BYOK Embeddings</li>
              <li><span class="check-icon">✓</span> Voicebot & IVR Twilio Support</li>
              <li><span class="check-icon">✓</span> Dedicated Account Manager</li>
            </ul>
          </div>
          <button class="btn-table-action btn-action-secondary" style="width:100%; justify-content:center;" onclick="window.smatApp.openPlanModal(null, 'Enterprise AI')">
            Select Enterprise
          </button>
        </div>

        <!-- Tier 4: Custom White-Label -->
        <div class="pricing-tier-card">
          <div>
            <div style="font-weight:800; font-size:1.15rem; color:#10B981;">Custom White-Label</div>
            <div style="font-size:0.8rem; color:#64748B;">OEM agency & reseller platform</div>
            <div class="tier-price-amount">
              ${billingToggleYearly ? '$999' : '$1,200'}<span class="period"> / mo</span>
            </div>
            <ul class="pricing-features-list">
              <li><span class="check-icon">✓</span> 1,000,000+ Chats Quota</li>
              <li><span class="check-icon">✓</span> Custom Domain (bot.yourbrand.com)</li>
              <li><span class="check-icon">✓</span> Multi-Tenant Client Manager</li>
              <li><span class="check-icon">✓</span> Unlimited API Access</li>
            </ul>
          </div>
          <button class="btn-table-action btn-action-secondary" style="width:100%; justify-content:center;" onclick="window.smatApp.openPlanModal(null, 'Custom White-Label')">
            Select White-Label
          </button>
        </div>
      </div>

      <!-- Quick Navigation Callout to Dedicated Client Subscriptions -->
      <div style="background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%); border: 1px solid #BBF7D0; border-radius: var(--radius-lg); padding: 1.25rem 1.75rem; display: flex; justify-content: space-between; align-items: center; margin-top: 2rem;">
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

  function openPlanModal(clientId, defaultPlan) {
    const client = clientsData.find(c => c.id === clientId) || clientsData[0];
    const plan = defaultPlan || client.plan_name || 'Pro NY';
    const modal = $('#modal-container');

    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="modal-box-card" style="border-top: 4px solid #1877F2; max-width:580px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <div style="font-size:1.15rem; font-weight:800; color:#1E293B;">⚡ Plan Activation & Upgrade Wizard</div>
            <button onclick="window.smatApp.closeModal()" style="background:none; border:none; font-size:1.2rem; cursor:pointer;">✕</button>
          </div>

          <form id="plan-activation-form">
            <div style="margin-bottom:1rem;">
              <label class="filter-item-label">Target Client Account</label>
              <select id="plan-target-client" class="custom-dropdown-trigger" style="width:100%;">
                ${clientsData.map(c => `<option value="${c.id}" ${c.id === client.id ? 'selected' : ''}>${c.name} (Current: ${c.plan_name})</option>`).join('')}
              </select>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
              <div>
                <label class="filter-item-label">Select Plan Tier</label>
                <select id="plan-tier-select" class="custom-dropdown-trigger" style="width:100%;">
                  <option value="Pro NY" ${plan.includes('Pro')?'selected':''}>Professional ($149 / ₹12,500)</option>
                  <option value="Starter NY" ${plan.includes('Starter')?'selected':''}>Starter ($49 / ₹4,100)</option>
                  <option value="Enterprise AI" ${plan.includes('Enterprise')?'selected':''}>Enterprise AI ($499 / ₹41,900)</option>
                  <option value="Custom White-Label" ${plan.includes('Custom')?'selected':''}>Custom White-Label ($1200 / ₹99,900)</option>
                </select>
              </div>
              <div>
                <label class="filter-item-label">Billing Cycle</label>
                <select id="plan-billing-cycle" class="custom-dropdown-trigger" style="width:100%;">
                  <option value="Yearly" selected>Yearly (Save 20%)</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
            </div>

            <!-- Optional Add-ons -->
            <label class="filter-item-label" style="margin-bottom:0.5rem;">Select Add-on Boosters</label>
            <div style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1rem; font-size:0.85rem; color:#334155;">
              <label style="display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0.75rem; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:6px; cursor:pointer;">
                <span>+10,000 Additional Conversations Quota</span>
                <input type="checkbox" id="addon-chats" checked />
              </label>
              <label style="display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0.75rem; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:6px; cursor:pointer;">
                <span>+1 Dedicated WhatsApp WABA Number Connection</span>
                <input type="checkbox" id="addon-waba" checked />
              </label>
            </div>

            <!-- Coupon Code -->
            <div style="margin-bottom:1.5rem;">
              <label class="filter-item-label">Voucher / Coupon Code</label>
              <div style="display:flex; gap:0.5rem;">
                <input type="text" id="voucher-code-input" class="filter-search-box" placeholder="e.g. SMAT50 or WELCOME2026" value="SMAT50" />
                <button type="button" class="btn-filter-reset" onclick="window.smatApp.showToast('Coupon SMAT50 Applied! 50% discount reflected.')">Apply</button>
              </div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
              <button type="button" class="btn-table-action btn-action-secondary" onclick="window.smatApp.closeModal()">Cancel</button>
              <button type="submit" class="btn-table-action btn-action-primary">⚡ Confirm & Activate Plan</button>
            </div>
          </form>
        </div>
      </div>
    `;

    $('#plan-activation-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const targetId = parseInt($('#plan-target-client').value);
      const selectedPlan = $('#plan-tier-select').value;
      const cycle = $('#plan-billing-cycle').value;
      const targetClient = clientsData.find(c => c.id === targetId);

      if (targetClient) {
        targetClient.plan_name = selectedPlan;
        targetClient.plan_type = 'Paid_plan';
        targetClient.billing_cycle = cycle;
        targetClient.subscription_status = 'Active';
        targetClient.days_left = cycle === 'Yearly' ? 365 : 30;
        targetClient.end_date = cycle === 'Yearly' ? '30-09-2027' : '30-10-2026';
        targetClient.subscription_amount_display = cycle === 'Yearly' ? '₹ 47,999.00' : '₹ 4,999.00';
      }

      showToast(`Plan successfully activated for ${targetClient?.name || 'Client'}!`);
      closeModal();
      if (currentRoute === 'plans') renderPlansView($('#route-viewport'));
      else if (currentRoute === 'client-details') renderClientDetailsView($('#route-viewport'));
      else if (currentRoute === 'client-details-profile') renderClientDetailsProfileView($('#route-viewport'));
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
  function openAddClientModal() {
    const modal = $('#modal-container');
    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="modal-box-card" style="border-top: 4px solid #1877F2; max-width: 720px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <div>
              <div style="font-size:1.2rem; font-weight:800; color:#1E293B; display:flex; align-items:center; gap:0.5rem;">
                <span>🏢</span> Add New Client Account
              </div>
              <p style="font-size:0.8rem; color:#64748B; margin-top:2px;">Provision a new client tenant in SmatBot Control Center</p>
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
                <label class="filter-item-label">Plan Name</label>
                <select id="add-client-plan-name" class="filter-search-box" style="padding-left:0.75rem;">
                  <option value="Pro Trial">Pro Trial</option>
                  <option value="Pro Trail WhatsApp Trial">Pro Trail WhatsApp Trial</option>
                  <option value="Free">Free</option>
                  <option value="Pro NY">Pro NY (Paid)</option>
                  <option value="Starter NY (WA)">Starter NY (WA) (Paid)</option>
                  <option value="Starter NY">Starter NY (Paid)</option>
                  <option value="Pro NM (WA)">Pro NM (WA) (Paid)</option>
                  <option value="Pro NM">Pro NM (Paid)</option>
                  <option value="Enterprise AI">Enterprise AI (Paid)</option>
                </select>
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label class="filter-item-label">Billing Cycle</label>
                <select id="add-client-billing-cycle" class="filter-search-box" style="padding-left:0.75rem;">
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label class="filter-item-label">Subscription Amount</label>
                <input type="text" id="add-client-amount" class="filter-search-box" placeholder="₹ 0.00" value="₹ 0.00" />
              </div>
              <div>
                <label class="filter-item-label">Days Left</label>
                <input type="number" id="add-client-days-left" class="filter-search-box" value="14" min="1" max="365" />
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label class="filter-item-label">Deployment Architecture *</label>
                <select id="add-client-deployment-type" class="filter-search-box" style="padding-left:0.75rem;">
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
              <button type="submit" class="btn-table-action btn-action-primary" style="padding:0.6rem 1.5rem; font-size:0.88rem;">+ Create Client</button>
            </div>
          </form>
        </div>
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
      newThisMonthOnly: false
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
    showToast
  };

  document.addEventListener('DOMContentLoaded', init);
})();
