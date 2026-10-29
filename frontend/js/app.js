// SmatBot Official Admin Portal - Unified Modern Control Center
// Complete Implementation of 5 Core Modules:
// 1. Clients (15 Filters, Directory, Deep-Dive Profile 👁)
// 2. Migrate Bot (4-Step Wizard, Pre-Flight Check, Live Terminal, Rollback)
// 3. Add Users (Team Management, Role-Based Access, Granular Permissions Matrix)
// 4. Subscriptions & Renewals Management
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
  let clientDetailsFiltersExpanded = true;

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
        id: 0, s_no: 0, name: 'abhianv', phone_number: '+91-9123456789', alternate_phone: '',
        email: 'abhinav.smatbot@gmail.com', customer_type: 'Direct', account_type: 'Client Accounts',
        plan_name: 'Pro', plan_type: 'Paid_plan', billing_cycle: 'Monthly',
        subscription_amount_display: '₹ 6,500.00', inr_amount: 6500, usd_amount: 80, end_date: '30-11-2026',
        days_left: 42, bots_limit: 10, bots_used: 4, chats_limit: 100000, chats_used: 12500,
        service_chats_limit: 100000, service_chats_used: 12500, bi_chats_limit: 5000, bi_chats_used: 400,
        gst_number: '36AAACS1429B1Z8', url: 'smatbot.com',
        test_account: 'No', subscription_status: 'Active', sales_person: 'Rahul Sharma',
        support_person: 'Sukanya Nagireddy', currency_type: 'INR', zoho_customer_id: '3594', subscription_id: 'SUB-SMAT-3594',
        unpaid_invoices: 2,
        billing_address: {
          company: 'smatbot',
          line1: '2nd Floor, Ashoka HiTech Chambers, Road No. 2, opp. KBR Park,',
          line2: 'Park View Enclave, hyderabad 500034',
          country: 'India'
        }
      },
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
        id: 10, s_no: 10, name: 'deepak', phone_number: '+91-9705736759', alternate_phone: '',
        email: 'suryadesigner1234@gmail.com', customer_type: 'Direct', account_type: 'Client Accounts',
        company_name: 'feso', legal_name: 'FESO SOCIAL MEDIA PRIVATE LIMITED',
        plan_name: 'Starter New Monthly (Without WA)', plan_type: 'Paid_plan', billing_cycle: 'Monthly',
        subscription_amount_display: '₹ 1,890.00', inr_amount: 1890, usd_amount: 25, end_date: '27-11-2026',
        days_left: 30, bots_limit: 5, bots_used: 1, chats_limit: 1000, chats_used: 120,
        service_chats_limit: 1000, service_chats_used: 120, bi_chats_limit: 500, bi_chats_used: 0,
        gst_number: '', gst_treatment: 'Unregistered Business', url: 'feso.in',
        test_account: 'No', subscription_status: 'Active', sales_person: 'Rahul Sharma',
        support_person: 'Sukanya Nagireddy', currency_type: 'INR', zoho_customer_id: 'ZC-01083', subscription_id: 'SUB-01083',
        billing_address: {
          attention: 'deepak',
          company: 'feso',
          line1: 'test',
          line2: 'test',
          city: 'Hyderabad',
          state: 'Telangana',
          pin: '500034',
          country: 'India'
        },
        shipping_address: {
          attention: '',
          company: '',
          line1: '',
          line2: '',
          city: '',
          state: 'Telangana',
          pin: '',
          country: 'India'
        }
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
      const name = `${clientNames[(i - 10) % clientNames.length]} ${Math.floor(i / 20) > 0 ? '#' + (Math.floor(i / 20) + 1) : ''}`.trim();
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

    allClients.forEach((c, idx) => {
      c.s_no = idx + 1;
    });

    return allClients;
  }

  // Seed Team Users Data
  const SEED_USERS = [
    {
      id: 1,
      name: 'Sukanya Nagireddy',
      email: 'sukanya@smatbot.com',
      password: 'admin123',
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
      password: 'admin123',
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
      password: 'admin123',
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
      password: 'admin123',
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
    },
    {
      id: 5,
      name: 'Admin User',
      email: 'admin@smatbot.com',
      password: 'password123',
      role: 'Super Admin',
      department: 'Executive Operations',
      avatar: 'AU',
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
    } catch (e) { }
    // Default to the active admin user if previously recorded, else empty
    const savedUser = localStorage.getItem('smatbot_admin_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u && u.email) {
          return [{ email: u.email, domain: '', password: '••••••••', realPass: 'admin123' }];
        }
      } catch (e) { }
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
          clientsData.forEach((c, idx) => {
            c.s_no = idx + 1;
          });
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

    try {
      const savedUsers = localStorage.getItem('smatbot_users_data');
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
          usersData = parsedUsers;
          // Ensure default seed users exist and have updated passwords
          SEED_USERS.forEach(su => {
            const existing = usersData.find(u => u.email.toLowerCase() === su.email.toLowerCase());
            if (!existing) {
              usersData.push({ ...su });
            } else if (!existing.password) {
              existing.password = su.password;
            }
          });
        } else {
          usersData = [...SEED_USERS];
        }
      } else {
        usersData = [...SEED_USERS];
      }
    } catch (err) {
      usersData = [...SEED_USERS];
    }
    localStorage.setItem('smatbot_users_data', JSON.stringify(usersData));

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

        // Global Browser Back / Forward and Hash Navigation Listener
    window.addEventListener('hashchange', () => {
      if (!isAuthenticated) return;
      const targetRoute = resolveInitialRoute();
      if (targetRoute !== currentRoute || targetRoute === 'client-details-profile' || targetRoute === 'change-subscription') {
        navigateTo(targetRoute, false);
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
  // 0. ADMIN LOGIN PAGE (Split Layout with Centered SmatBot Logo & Clean Form)
  // =========================================================================
  function renderLoginPage() {
    const app = $('#app-mount');
    const savedLogins = getPreviousLoginsHistory();
    const hasPreviousLogins = savedLogins && savedLogins.length > 0;
    const defaultEmail = hasPreviousLogins ? savedLogins[0].email : 'sukanya@smatbot.com';
    const defaultPass = hasPreviousLogins ? savedLogins[0].realPass : 'admin123';

    app.innerHTML = `
      <div class="smatbot-split-login-wrapper">
        <div class="smat-split-login-card">
          <!-- LEFT: Dark Midnight Indigo Section with SmatBot Branding & Features -->
          <div class="smat-split-dark-col">
            <!-- Ambient Top-Left Purple Glow -->
            <div class="smat-dark-ambient-glow"></div>

            <!-- Content Area -->
            <div class="smat-dark-content-box">
              <!-- SmatBot Logo -->
              <div class="smat-dark-center-branding">
                <div class="smatbot-purple-robot-badge-large">
                  <svg width="44" height="34" viewBox="0 0 34 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="34" height="26" rx="6.5" fill="#4C2277"/>
                    <polygon points="10,8.5 12.5,11 10,13.5 7.5,11" fill="#FFFFFF"/>
                    <polygon points="24,8.5 26.5,11 24,13.5 21.5,11" fill="#FFFFFF"/>
                    <path d="M11 15.5 C13.5 19.5 20.5 19.5 23 15.5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none"/>
                  </svg>
                </div>
                <span class="smat-dark-logo-title-large">
                  <span class="brand-smat">Smat</span><span class="brand-bot">Bot</span>
                </span>
              </div>

              <!-- Tagline -->
              <div class="smat-dark-tagline">
                Smarter Conversations.<br />Better Business.
              </div>

              <!-- 3 Feature Highlights matching Screenshot -->
              <div class="smat-dark-features-list">
                <!-- Feature 1: Automate Support -->
                <div class="smat-split-feature-item">
                  <div class="smat-feature-icon-bubble">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#93C5FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      <circle cx="8" cy="10" r="1" fill="#93C5FD"></circle>
                      <circle cx="12" cy="10" r="1" fill="#93C5FD"></circle>
                      <circle cx="16" cy="10" r="1" fill="#93C5FD"></circle>
                    </svg>
                  </div>
                  <div class="smat-feature-info">
                    <div class="smat-feature-heading">Automate Support</div>
                    <div class="smat-feature-subheading">Engage your customers 24/7</div>
                  </div>
                </div>

                <!-- Feature 2: Track Performance -->
                <div class="smat-split-feature-item">
                  <div class="smat-feature-icon-bubble">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#93C5FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10"></line>
                      <line x1="12" y1="20" x2="12" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                  </div>
                  <div class="smat-feature-info">
                    <div class="smat-feature-heading">Track Performance</div>
                    <div class="smat-feature-subheading">Get real-time insights</div>
                  </div>
                </div>

                <!-- Feature 3: Secure & Reliable -->
                <div class="smat-split-feature-item">
                  <div class="smat-feature-icon-bubble">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#93C5FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <div class="smat-feature-info">
                    <div class="smat-feature-heading">Secure &amp; Reliable</div>
                    <div class="smat-feature-subheading">Your data, our priority</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Flowing Gradient Waves at Bottom -->
            <div class="smat-dark-waves-container">
              <svg class="smat-dark-wave-svg" viewBox="0 0 420 180" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="waveGlow1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#4F46E5" stop-opacity="0.38"/>
                    <stop offset="100%" stop-color="#0F172A" stop-opacity="0.05"/>
                  </linearGradient>
                  <linearGradient id="waveGlow2" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#2563EB" stop-opacity="0.35"/>
                    <stop offset="100%" stop-color="#7C3AED" stop-opacity="0.22"/>
                  </linearGradient>
                </defs>
                <path d="M-10,110 C90,165 190,65 310,115 C370,140 405,105 430,90 L430,190 L-10,190 Z" fill="url(#waveGlow1)" />
                <path d="M-10,145 C110,120 200,175 330,105 C380,80 410,95 430,110 L430,190 L-10,190 Z" fill="url(#waveGlow2)" />
                <path d="M-20,110 C80,165 185,65 305,115 C365,140 405,105 435,90" stroke="rgba(147, 197, 253, 0.22)" stroke-width="1.5" fill="none" />
                <path d="M-10,145 C110,120 200,175 330,105 C380,80 410,95 430,110" stroke="rgba(167, 139, 250, 0.25)" stroke-width="1.5" fill="none" />
              </svg>
            </div>
          </div>

          <!-- RIGHT: Clean Modern Login Form matching Screenshot -->
          <div class="smat-split-white-col">
            <!-- Form Container -->
            <div class="smat-split-form-wrapper">
              <h1 class="smat-split-login-heading">Login</h1>
              <p class="smat-split-login-subheading">Please enter your credentials to continue.</p>

              <!-- Dynamic Alert Notification Container -->
              <div id="smat-login-alert-container"></div>

              <!-- Form Inputs -->
              <form id="admin-login-form" onsubmit="window.smatApp.handleLoginSubmit(event)">
                <!-- Email Address Input -->
                <div class="smat-clean-form-group">
                  <label class="smat-clean-label" for="login-email-input">Email Address</label>
                  <div class="smat-clean-input-box">
                    <span class="smat-input-prefix-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </svg>
                    </span>
                    <input 
                      type="email" 
                      id="login-email-input" 
                      class="smat-clean-input" 
                      value="${defaultEmail}" 
                      placeholder="sukanya@smatbot.com" 
                      required 
                      autocomplete="username" 
                    />
                  </div>
                </div>

                <!-- Password Input -->
                <div class="smat-clean-form-group">
                  <label class="smat-clean-label" for="login-password-input">Password</label>
                  <div class="smat-clean-input-box">
                    <span class="smat-input-prefix-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </span>
                    <input 
                      type="password" 
                      id="login-password-input" 
                      class="smat-clean-input smat-input-with-toggle" 
                      value="${defaultPass}" 
                      placeholder="••••••••" 
                      required 
                      autocomplete="current-password" 
                    />
                    <button type="button" class="smat-clean-eye-btn" onclick="window.smatApp.togglePasswordVisibility()" title="Show/Hide Password">
                      <svg id="password-toggle-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Remember me + Forgot Password row -->
                <div class="smat-login-options-row">
                  <label class="smat-remember-me-toggle">
                    <input type="checkbox" id="login-remember-me" checked />
                    <span>Remember me</span>
                  </label>
                  <a href="javascript:void(0)" onclick="window.smatApp.showToast('Password reset link sent to registered admin mail.')" class="smat-forgot-pass-anchor">Forgot Password?</a>
                </div>

                <!-- Blue Login button with Arrow -->
                <button type="submit" class="btn-smat-clean-login smat-primary-login-btn">
                  <span>Login</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </form>

              <!-- Bottom Secure Login Divider -->
              <div class="smat-secure-badge-footer">
                <span class="smat-secure-line"></span>
                <span class="smat-secure-badge-text">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  <span>Secure Login</span>
                </span>
                <span class="smat-secure-line"></span>
              </div>
            </div>
          </div>
        </div>

        <div id="toast-container"></div>
      </div>
    `;
  }

  function togglePasswordVisibility() {
    const input = $('#login-password-input');
    const icon = $('#password-toggle-icon');
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      if (icon) {
        icon.innerHTML = `
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        `;
      }
    } else {
      input.type = 'password';
      if (icon) {
        icon.innerHTML = `
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        `;
      }
    }
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
    const emailInput = $('#login-email-input');
    const passInput = $('#login-password-input');
    const alertBox = $('#smat-login-alert-container');

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passInput ? passInput.value.trim() : '';

    // Clear previous visual error indicators
    if (emailInput) emailInput.classList.remove('has-error');
    if (passInput) passInput.classList.remove('has-error');
    if (alertBox) alertBox.innerHTML = '';

    if (!email) {
      if (emailInput) {
        emailInput.classList.add('has-error');
        emailInput.focus();
      }
      if (alertBox) {
        alertBox.innerHTML = `
          <div class="smat-login-error-alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>Please enter your email address.</span>
          </div>
        `;
      }
      showToast('❌ Please enter your email address.');
      return;
    }

    if (!password) {
      if (passInput) {
        passInput.classList.add('has-error');
        passInput.focus();
      }
      if (alertBox) {
        alertBox.innerHTML = `
          <div class="smat-login-error-alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>Please enter your password.</span>
          </div>
        `;
      }
      showToast('❌ Please enter your password.');
      return;
    }

    // Verify user exists in registered team users (fallback to SEED_USERS if init hasn't run)
    if (!usersData || usersData.length === 0) {
      usersData = [...SEED_USERS];
    }
    const user = usersData.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      if (emailInput) {
        emailInput.classList.add('has-error');
        if (typeof emailInput.focus === 'function') emailInput.focus();
      }
      if (alertBox) {
        alertBox.innerHTML = `
          <div class="smat-login-error-alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <span>❌ No account found with this email. Please verify or ask your admin to add you in Team & Users.</span>
          </div>
        `;
      }
      showToast('❌ No account found with this email.');
      return;
    }

    // Verify password strictly
    const expectedPassword = user.password || 'admin123';
    if (password !== expectedPassword) {
      if (passInput) {
        passInput.classList.add('has-error');
        if (typeof passInput.focus === 'function') passInput.focus();
        if (typeof passInput.select === 'function') passInput.select();
      }
      if (alertBox) {
        alertBox.innerHTML = `
          <div class="smat-login-error-alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <span>❌ Incorrect password. Please try again.</span>
          </div>
        `;
      }
      showToast('❌ Incorrect password. Please try again.');
      return;
    }

    // Credentials Verified Successfully
    recordLoginHistory(email, password);

    currentUser = { ...user };
    isAuthenticated = true;
    localStorage.setItem('smatbot_admin_logged_in', 'true');
    localStorage.setItem('smatbot_admin_user', JSON.stringify(currentUser));
    localStorage.setItem('smatbot_active_route', 'client-details');
    window.location.hash = '#client-details';

    showToast(`Welcome back, ${currentUser.name}!`);
    loadAppShell();
  }

  function quickDemoLogin(name, email, role) {
    recordLoginHistory(email, 'admin123');
    currentUser = { name, email, role, avatar: name.split(' ').map(n => n[0]).join('').substring(0, 2) };
    isAuthenticated = true;
    localStorage.setItem('smatbot_admin_logged_in', 'true');
    localStorage.setItem('smatbot_admin_user', JSON.stringify(currentUser));
    localStorage.setItem('smatbot_active_route', 'client-details');
    window.location.hash = '#client-details';

    showToast(`Welcome back, ${currentUser.name}!`);
    loadAppShell();
  }

    function logout() {
    localStorage.removeItem('smatbot_admin_logged_in');
    localStorage.removeItem('smatbot_admin_user');
    localStorage.removeItem('smatbot_active_route');
    localStorage.removeItem('smatbot_selected_client_id');
    window.location.hash = '';
    isAuthenticated = false;
    impersonatingClient = null;
    showToast('Logged out successfully.');
    renderLoginPage();
  }

    // =========================================================================
  // ROUTE & CLIENT PERSISTENCE ENGINE (Preserves Page on F5 / Reload)
  // =========================================================================
  function resolveInitialRoute() {
    // 1. Try URL Hash (e.g. #client-details-profile?id=0 or #change-subscription?id=0 or #overview or #users)
    const rawHash = (window.location.hash || '').replace(/^#/, '').trim();
    if (rawHash) {
      if (rawHash.startsWith('client-details-profile')) {
        const idMatch = rawHash.match(/id=([^&]+)/);
        if (idMatch && idMatch[1] !== undefined) {
          const rawId = idMatch[1];
          selectedClientId = isNaN(rawId) ? rawId : Number(rawId);
          zohoSubscriptionClientId = selectedClientId;
          try {
            localStorage.setItem('smatbot_selected_client_id', String(selectedClientId));
            localStorage.setItem('smatbot_zoho_subscription_client_id', String(selectedClientId));
          } catch (e) {}
        }
        return 'client-details-profile';
      }
      if (rawHash.startsWith('change-subscription') || rawHash.startsWith('new-subscription')) {
        const idMatch = rawHash.match(/id=([^&]+)/);
        if (idMatch && idMatch[1] !== undefined) {
          const rawId = idMatch[1];
          zohoSubscriptionClientId = isNaN(rawId) ? rawId : Number(rawId);
          selectedClientId = zohoSubscriptionClientId;
          try {
            localStorage.setItem('smatbot_zoho_subscription_client_id', String(zohoSubscriptionClientId));
            localStorage.setItem('smatbot_selected_client_id', String(zohoSubscriptionClientId));
          } catch (e) {}
        } else {
          try {
            const savedZohoId = localStorage.getItem('smatbot_zoho_subscription_client_id') || localStorage.getItem('smatbot_selected_client_id');
            if (savedZohoId !== null && savedZohoId !== undefined) {
              zohoSubscriptionClientId = isNaN(savedZohoId) ? savedZohoId : Number(savedZohoId);
              selectedClientId = zohoSubscriptionClientId;
            }
          } catch (e) {}
        }
        const cleanRoute = rawHash.split('?')[0];
        return cleanRoute || 'change-subscription';
      }
      const cleanRoute = rawHash.split('?')[0];
      if (cleanRoute) {
        return cleanRoute;
      }
    }

    // 2. Try localStorage if no hash in URL
    try {
      const savedRoute = localStorage.getItem('smatbot_active_route');
      const savedClientId = localStorage.getItem('smatbot_selected_client_id');
      const savedZohoId = localStorage.getItem('smatbot_zoho_subscription_client_id');
      if (savedZohoId !== null && savedZohoId !== undefined) {
        zohoSubscriptionClientId = isNaN(savedZohoId) ? savedZohoId : Number(savedZohoId);
      } else if (savedClientId !== null && savedClientId !== undefined) {
        zohoSubscriptionClientId = isNaN(savedClientId) ? savedClientId : Number(savedClientId);
      }
      if (savedClientId !== null && savedClientId !== undefined) {
        selectedClientId = isNaN(savedClientId) ? savedClientId : Number(savedClientId);
      }
      if (savedRoute) {
        return savedRoute;
      }
    } catch (e) {}

    return 'client-details';
  }

  // =========================================================================
  // 1. APP SHELL LAYOUT (Unified Modern Control Center)
  // =========================================================================
  function loadAppShell() {
    if (impersonatingClient) {
      renderClientPortalSimulator(impersonatingClient);
      return;
    }

    const isSidebarCollapsed = localStorage.getItem('smatbot_sidebar_collapsed') === 'true';
    const app = $('#app-mount');
    app.innerHTML = `
      <div class="app-layout-wrapper ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}" id="admin-app-root">
        <!-- Modern SmatBot Left Navigation Sidebar -->
        <aside class="main-sidebar" id="app-sidebar">
          <div class="sidebar-brand-box">
            <div class="sidebar-brand-logo">
              <div class="brand-icon-box brand-icon-mascot" title="SmatBot">
                <svg width="34" height="26" viewBox="0 0 34 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="34" height="26" rx="6.5" fill="#4C2277"/>
                  <polygon points="10,8.5 12.5,11 10,13.5 7.5,11" fill="#FFFFFF"/>
                  <polygon points="24,8.5 26.5,11 24,13.5 21.5,11" fill="#FFFFFF"/>
                  <path d="M11 15.5 C13.5 19.5 20.5 19.5 23 15.5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none"/>
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
                ${currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
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

            <div class="sidebar-section-title" style="margin-top:0.85rem;">BILLING & SUBSCRIPTIONS</div>
            <!-- Active Subscriptions -->
            <a class="nav-link-item ${currentRoute === 'subscriptions' || currentRoute === 'change-subscription' || currentRoute === 'new-subscription' || currentRoute === 'subscription' || currentRoute === 'edit-customer' ? 'active' : ''}" onclick="window.smatApp.navigateTo('subscriptions')" style="display:flex; align-items:center; justify-content:space-between;">
              <div style="display:flex; align-items:center; gap:0.55rem;">
                <span class="nav-link-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                </span>
                <span>Subscriptions</span>
              </div>
              <span class="sidebar-add-plus-btn" onclick="event.stopPropagation(); window.smatApp.openZohoSubscription(null);" title="New / Change Subscription">+</span>
            </a>

            <!-- 5. Renewals & Expiries -->
            <a class="nav-link-item ${currentRoute === 'renewals' ? 'active' : ''}" onclick="window.smatApp.navigateTo('renewals')">
              <span class="nav-link-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
              </span>
              <span>Renewals</span>
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
                  ${currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
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

    const initialRoute = resolveInitialRoute();
    navigateTo(initialRoute, true);
  }

  // =========================================================================
  // 2. ROUTING CONTROLLER
  // =========================================================================
  function navigateTo(route, updateHash = true) {
    if (route === 'plans' || route === 'addons') {
      route = 'client-details';
    }
    currentRoute = route;

    // Persist current route & selected client to stay on exact page on F5 / Reload
    try {
      localStorage.setItem('smatbot_active_route', route);
      if (route === 'client-details-profile') {
        localStorage.setItem('smatbot_selected_client_id', String(selectedClientId));
      } else if (route === 'change-subscription' || route === 'new-subscription' || route === 'subscriptions') {
        const effId = (zohoSubscriptionClientId !== undefined && zohoSubscriptionClientId !== null) ? zohoSubscriptionClientId : selectedClientId;
        if (effId !== undefined && effId !== null) {
          localStorage.setItem('smatbot_zoho_subscription_client_id', String(effId));
          localStorage.setItem('smatbot_selected_client_id', String(effId));
        }
      }
    } catch (e) {}

    // Synchronize URL Hash without page reset
    if (updateHash) {
      if (route === 'client-details-profile') {
        const targetHash = '#client-details-profile?id=' + selectedClientId;
        if (window.location.hash !== targetHash) {
          window.location.hash = targetHash;
        }
      } else if (route === 'change-subscription' || route === 'new-subscription') {
        const effId = (zohoSubscriptionClientId !== undefined && zohoSubscriptionClientId !== null) ? zohoSubscriptionClientId : selectedClientId;
        const targetHash = (effId !== undefined && effId !== null) ? `#${route}?id=${effId}` : `#${route}`;
        if (window.location.hash !== targetHash) {
          window.location.hash = targetHash;
        }
      } else {
        const targetHash = '#' + route;
        if (window.location.hash !== targetHash) {
          window.location.hash = targetHash;
        }
      }
    }
    if (route === 'plans' || route === 'addons') {
      route = 'client-details';
    }
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
      headerActions.style.display = 'none';
        headerActions.innerHTML = '';
    }

    const titleEl = $('#header-page-title');
    const titles = {
      'overview': 'Operations Command Center & Executive Hub',
      'client-details': 'Client Details',
      'client-details-profile': 'Client Profile Details View',
      'impersonation': 'Client Portal Impersonation Console',
      'chatbots': 'Bot Migration Engine & Workflows',
      'users': 'Team & Role-Based Access Control',
      'subscription': 'Edit Customer',
      'change-subscription': 'Change Subscription',
      'new-subscription': 'Change Subscription',
      'edit-customer': 'Edit Customer',
      'edit-customer': 'Edit Customer — Zoho Billing Portal',
      'subscriptions': 'Active Client Subscriptions',
      'renewals': 'Subscription Renewals & Expiries',
      'partners': 'Agency & Channel Partners Directory',
      'coupons': 'Discount Coupons & Vouchers'
    };
    if (titleEl) {
      if (route === 'client-details') {
        titleEl.innerHTML = `
          <div style="display:inline-flex; align-items:center; gap:0.6rem;">
            <span>Client Details</span>
            <button id="btn-toggle-client-filters" class="header-toggle-filters-btn" onclick="window.smatApp.toggleClientDetailsFilters()" title="Click to show/hide Metrics & Filters">
              <span id="client-filters-arrow-icon">${clientDetailsFiltersExpanded ? '▲' : '▼'}</span>
              <span id="client-filters-arrow-label">${clientDetailsFiltersExpanded ? 'Hide Filters & Metrics' : 'Show Filters & Metrics'}</span>
            </button>
          </div>
        `;
      } else {
        titleEl.innerText = titles[route] || 'SmatBot Admin Control Center';
      }
    }

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
    } else if (route === 'change-subscription' || route === 'new-subscription' || route === 'subscriptions') {
      renderZohoSubscriptionView(viewport);
    } else if (route === 'subscription' || route === 'edit-customer') {
      renderZohoEditCustomerView(viewport);
    } else if (route === 'subscriptions-directory') {
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
            <button class="launcher-btn secondary" onclick="window.smatApp.navigateTo('client-details')">
              👥 Client Directory (${totalClients})
            </button>
          </div>
        </div>

        <!-- 2. Quick Action Launcher Bar -->
        <div class="quick-action-launcher-bar">
          <span style="font-size:0.8rem; font-weight:700; color:#475569; text-transform:uppercase; letter-spacing:0.04em;">QUICK ACTIONS:</span>
          <button class="launcher-btn accent" onclick="window.smatApp.openPlanModal(null, 'Pro NY')">
            <span>⚡</span> Assign / Upgrade Plan
          </button>
          <button class="launcher-btn purple" onclick="window.smatApp.navigateTo('impersonation')">
            <span>🔐</span> 1-Click Client Portal Login
          </button>
          <button class="launcher-btn secondary" onclick="window.smatApp.navigateTo('renewals')">
            <span>🔄</span> Renewal Tracking (14 Expiring)
          </button>
          <button class="launcher-btn secondary" onclick="window.smatApp.navigateTo('subscriptions')">
            <span>💳</span> Active Client Subscriptions
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
                <div style="background:#1877F2; height:100%; width:${Math.round((monthlyClients / totalClients) * 100)}%;"></div>
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
                <div style="background:#16A34A; height:100%; width:${Math.round((yearlyClients / totalClients) * 100)}%;"></div>
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
                <div style="background:#F59E0B; height:100%; width:${Math.round((customDurationClients / totalClients) * 100)}%;"></div>
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
  
  function toggleClientDetailsFilters() {
    clientDetailsFiltersExpanded = !clientDetailsFiltersExpanded;
    if (currentRoute === 'client-details') {
      renderClientDetailsView($('#route-viewport'));
      const titleEl = $('#header-page-title');
      if (titleEl) {
        titleEl.innerHTML = `
          <span>Client Details</span>
          <button id="btn-toggle-client-filters" class="header-toggle-filters-btn" onclick="window.smatApp.toggleClientDetailsFilters()" title="Click to show/hide Metrics & Filters">
            <span id="client-filters-arrow-icon">${clientDetailsFiltersExpanded ? '▲' : '▼'}</span>
            <span id="client-filters-arrow-label">${clientDetailsFiltersExpanded ? 'Hide Filters & Metrics' : 'Show Filters & Metrics'}</span>
          </button>
        `;
      }
    }
  }

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
      <!-- Collapsible Top Metrics & Filter Block (Hidden by default after login so clean table is directly visible) -->
      <div id="client-details-collapsible-panel" class="client-details-collapsible-panel ${clientDetailsFiltersExpanded ? 'expanded' : 'collapsed'}" style="display: ${clientDetailsFiltersExpanded ? 'block' : 'none'};">
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
            ⚠️ Expiring in 7 Days <span class="segment-tab-counter" style="background:${expiringClients > 0 ? '#FEE2E2' : '#E2E8F0'}; color:${expiringClients > 0 ? '#DC2626' : '#475569'};">${expiringClients}</span>
          </button>
          <button class="segment-tab-pill ${filterState.activeSegmentTab === 'whitelabel' ? 'active' : ''}" onclick="window.smatApp.selectSegmentTab('whitelabel')">
            🏷️ White-Label <span class="segment-tab-counter">${whitelabelClients}</span>
          </button>
        </div>
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <div class="client-count-blue-badge" id="client-count-badge">${totalItems} Results</div>
        </div>
      </div>

      </div>

      <!-- Compact Action Bar (Visible when top filters are collapsed, matching user screenshot) -->
      ${!clientDetailsFiltersExpanded ? `
        <div class="table-compact-header-bar">
          <div style="display:flex; align-items:center; gap:0.75rem; flex:1; max-width:540px;">
            <div class="table-compact-search-box">
              <span style="font-size:0.85rem;">🔍</span>
              <input 
                type="text" 
                id="search-input-compact" 
                placeholder="Search by name, email, phone, Zoho ID..." 
                value="${filterState.search}"
                oninput="window.smatApp.updateSearch(this.value)"
                onkeydown="if(event.key==='Enter') window.smatApp.applyFilters()"
              />
            </div>
            <div class="client-count-blue-badge">${totalItems} Clients</div>
          </div>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <button class="header-toggle-filters-btn" onclick="window.smatApp.toggleClientDetailsFilters()" title="Expand full filters and metric cards">
              <span>▼</span>
              <span>Filters &amp; Metrics</span>
            </button>
          </div>
        </div>
      ` : ''}

      <!-- Client Details Data Table -->
      <div class="table-card-container table-card-with-top-scroll">
        <!-- TOP HORIZONTAL SCROLLBAR (Quickly scroll wide columns from the top) -->
        <div class="table-top-scrollbar-wrapper" id="table-top-scrollbar" onscroll="window.smatApp.syncTableScroll('top')" title="Scroll columns horizontally">
          <div class="table-top-scrollbar-track" id="table-top-scrollbar-track"></div>
        </div>

        <!-- Table Responsive Scroll Container -->
        <div class="table-scroll-container" id="table-scroll-container" onscroll="window.smatApp.syncTableScroll('table')">
          <table class="client-data-table" id="clients-main-table">
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
              ${renderClientTableRows(paginatedList, startIdx)}
            </tbody>
          </table>
        </div>

        <!-- Fixed Bottom Pagination Footer (Outside horizontal scrolling, with middle entry counter) -->
        ${renderPaginationControls(totalPages, clientCurrentPage, clientPageSize, totalItems, startIdx)}
      </div>
    `;

    initTableScrollbarSync();
  }

  function renderClientTableRows(list, startIdx = 0) {
    if (list.length === 0) {
      return `<tr><td colspan="13" style="text-align:center; padding: 2.5rem; color: #94A3B8;">No client records match your filter criteria. <button onclick="window.smatApp.resetFilters()" style="color:#1877F2; background:none; border:none; cursor:pointer; font-weight:700;">Reset Filters</button></td></tr>`;
    }

    return list.map((c, idx) => `
      <tr>
        <td style="font-weight: 600; color: #64748B;">${startIdx + idx + 1}</td>
        <td>
          <div class="client-name-cell">
            <div class="client-avatar-circle ${getAvatarColorClass(c.name)}">${getInitials(c.name)}</div>
            <div class="client-name-meta">
              <span class="client-primary-name" onclick="window.smatApp.openClientQuickDrawer(${c.id})" title="Click to view Quick Drawer">${escapeHtml(c.name)}</span>
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
    try {
      localStorage.setItem('smatbot_selected_client_id', String(clientId));
    } catch (e) {}
    navigateTo('client-details-profile', true);
  }

  function getClientBots(client) {
    if (!client.bots || !Array.isArray(client.bots)) {
      const botsCount = client.bots_used !== undefined ? client.bots_used : 2;
      const count = Math.max(1, botsCount);
      const domain = client.url || (client.email && client.email.includes('@') ? client.email.split('@')[1] : 'alignbooks.com');
      const baseName = (client.name || 'Client').trim().split(' ')[0];
      const defaultBots = [
        {
          id: 'BOT-' + client.id + '01',
          name: baseName + ' Website Assistant',
          channel: 'Website Widget',
          channelIcon: '🌐',
          triggerUrl: 'https://' + domain + '/*',
          createdDate: '15-09-2026',
          chatsCount: 342,
          isActive: true
        }
      ];
      if (count >= 2) {
        defaultBots.push({
          id: 'BOT-' + client.id + '02',
          name: baseName + ' WhatsApp Lead Bot',
          channel: 'WhatsApp (Meta WABA)',
          channelIcon: '📱',
          triggerUrl: client.phone_number || '+91-8099791498',
          createdDate: '22-09-2026',
          chatsCount: 189,
          isActive: true
        });
      }
      if (count >= 3) {
        defaultBots.push({
          id: 'BOT-' + client.id + '03',
          name: baseName + ' FAQ & Support Flow',
          channel: 'Website Widget',
          channelIcon: '🌐',
          triggerUrl: 'https://' + domain + '/support/*',
          createdDate: '28-09-2026',
          chatsCount: 76,
          isActive: false
        });
      }
      client.bots = defaultBots;
    }
    return client.bots;
  }

  function getClientPlanHistory(client) {
    if (!client.plan_history || !Array.isArray(client.plan_history)) {
      client.plan_history = [
        {
          id: 'SUB-HIST-' + client.id + '-01',
          plan_name: client.plan_name || 'Pro NY (WA)',
          billing_cycle: client.billing_cycle || 'Monthly',
          amount: client.subscription_amount_display || '₹ 0.00',
          start_date: '15-09-2026',
          end_date: client.end_date || '15-10-2026',
          status: client.subscription_status || 'Trial',
          is_current: true,
          invoice_id: 'INV-2026-X' + String(client.id).padStart(3, '0') + '-01'
        },
        {
          id: 'SUB-HIST-' + client.id + '-02',
          plan_name: 'Starter Evaluation Trial',
          billing_cycle: 'Monthly',
          amount: '₹ 0.00',
          start_date: '15-08-2026',
          end_date: '14-09-2026',
          status: 'Expired',
          is_current: false,
          invoice_id: 'INV-2026-X' + String(client.id).padStart(3, '0') + '-02'
        },
        {
          id: 'SUB-HIST-' + client.id + '-03',
          plan_name: 'Free Trial Onboarding',
          billing_cycle: '14 Days Trial',
          amount: '₹ 0.00',
          start_date: '01-08-2026',
          end_date: '14-08-2026',
          status: 'Expired',
          is_current: false,
          invoice_id: 'INV-2026-X' + String(client.id).padStart(3, '0') + '-03'
        }
      ];
    }
    return client.plan_history;
  }

  function toggleClientBotActive(clientId, botId) {
    const client = clientsData.find(c => c.id === clientId);
    if (!client) return;
    const bots = getClientBots(client);
    const bot = bots.find(b => b.id === botId);
    if (bot) {
      bot.isActive = !bot.isActive;
      showToast('Bot "' + bot.name + '" is now ' + (bot.isActive ? 'Active (Live)' : 'Paused (Offline)'));
      renderClientDetailsProfileView($('#route-viewport'));
    }
  }

  function openCreateBotForClient(clientId) {
    const client = clientsData.find(c => c.id === clientId) || clientsData[0];
    const modal = $('#modal-container');
    const domain = client.url || 'alignbooks.com';
    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="modal-box-card" style="border-top: 4px solid #1877F2; max-width: 480px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <div style="font-size:1.15rem; font-weight:800; color:#1E293B;">🤖 Create Bot for ${escapeHtml(client.name)}</div>
            <button onclick="window.smatApp.closeModal()" style="background:none; border:none; font-size:1.2rem; cursor:pointer;">✕</button>
          </div>
          <form onsubmit="window.smatApp.handleCreateBotSubmit(event, ${client.id})">
            <div class="smat-form-group">
              <label class="smat-form-label">Bot Name</label>
              <input type="text" id="new-bot-name" class="smat-form-input" value="${escapeHtml(client.name)} AI Assistant" required />
            </div>
            <div class="smat-form-group">
              <label class="smat-form-label">Channel Platform</label>
              <select id="new-bot-channel" class="smat-form-input">
                <option value="Website Widget">🌐 Website Widget</option>
                <option value="WhatsApp (Meta WABA)">📱 WhatsApp (Meta Cloud API)</option>
                <option value="Instagram Direct">📸 Instagram Direct</option>
              </select>
            </div>
            <div class="smat-form-group">
              <label class="smat-form-label">Binding URL / Path</label>
              <input type="text" id="new-bot-trigger" class="smat-form-input" value="https://${escapeHtml(domain)}/*" required />
            </div>
            <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.25rem;">
              <button type="button" class="btn-table-action btn-action-secondary" onclick="window.smatApp.closeModal()">Cancel</button>
              <button type="submit" class="btn-table-action btn-action-primary">🚀 Deploy Bot</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  function handleCreateBotSubmit(e, clientId) {
    e.preventDefault();
    const client = clientsData.find(c => c.id === clientId);
    if (!client) return;
    const name = $('#new-bot-name').value.trim();
    const channel = $('#new-bot-channel').value;
    const trigger = $('#new-bot-trigger').value.trim();
    const bots = getClientBots(client);
    const newId = 'BOT-' + client.id + '0' + (bots.length + 1);
    bots.push({
      id: newId,
      name: name,
      channel: channel,
      channelIcon: channel.includes('WhatsApp') ? '📱' : '🌐',
      triggerUrl: trigger,
      createdDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
      chatsCount: 0,
      isActive: true
    });
    client.bots_used = (client.bots_used || 0) + 1;
    closeModal();
    showToast('Successfully deployed bot "' + name + '" for ' + client.name + '!');
    renderClientDetailsProfileView($('#route-viewport'));
  }

  function toggleModularCard(cardId, e) {
    if (e) {
      if (
        e.target.closest('button:not(.btn-collapse-card)') ||
        e.target.closest('a') ||
        e.target.closest('input') ||
        e.target.closest('select') ||
        e.target.closest('.smat-switch-label') ||
        e.target.closest('.btn-hero-primary') ||
        e.target.closest('.btn-hero-secondary') ||
        e.target.closest('.btn-hero-outline') ||
        e.target.closest('.btn-hero-danger') ||
        e.target.closest('.btn-card-action-icon') ||
        e.target.closest('.btn-quota-pencil') ||
        e.target.closest('.btn-cancel-sub') ||
        e.target.closest('.btn-footer-secondary') ||
        e.target.closest('.btn-footer-primary') ||
        e.target.closest('.btn-tile-copy') ||
        e.target.closest('.invoice-link-pill') ||
        e.target.closest('.btn-bot-action-secondary') ||
        e.target.closest('.btn-bot-action-outline')
      ) {
        return;
      }
      e.stopPropagation();
    }
    const card = document.getElementById(cardId);
    if (!card) return;
    card.classList.toggle('collapsed');
  }
  window.toggleModularCard = toggleModularCard;

  function renderClientDetailsProfileView(container) {
    const client = clientsData.find(c => c.id === selectedClientId || String(c.id) === String(selectedClientId)) || clientsData[0];

    // Top Header Action Buttons removed (maintained in profile card below)
    const headerActions = $('#header-details-actions');
    if (headerActions) {
      headerActions.style.display = 'none';
      headerActions.innerHTML = '';
    }

    const clientBots = getClientBots(client);
    const planHistory = getClientPlanHistory(client);

    const botsLimit = client.bots_limit !== undefined ? client.bots_limit : 10;
    const botsUsed = clientBots.length;
    const botsLeft = Math.max(0, botsLimit - botsUsed);
    const botsPct = botsLimit > 0 ? Math.min(100, (botsUsed / botsLimit) * 100).toFixed(1) : '0.0';

    const chatsLimit = client.chats_limit !== undefined ? client.chats_limit : 5000;
    const chatsUsed = client.chats_used !== undefined ? client.chats_used : 0;
    const chatsLeft = Math.max(0, chatsLimit - chatsUsed);
    const chatsPct = chatsLimit > 0 ? Math.min(100, (chatsUsed / chatsLimit) * 100).toFixed(1) : '0.0';

    const serviceLimit = client.service_chats_limit !== undefined ? client.service_chats_limit : 1000;
    const serviceUsed = client.service_chats_used !== undefined ? client.service_chats_used : 0;
    const serviceLeft = Math.max(0, serviceLimit - serviceUsed);
    const servicePct = serviceLimit > 0 ? Math.min(100, (serviceUsed / serviceLimit) * 100).toFixed(1) : '0.0';

    const biLimit = client.bi_chats_limit !== undefined ? client.bi_chats_limit : 0;
    const biUsed = client.bi_chats_used !== undefined ? client.bi_chats_used : 0;
    const biLeft = Math.max(0, biLimit - biUsed);
    const biPct = biLimit > 0 ? Math.min(100, (biUsed / biLimit) * 100).toFixed(1) : '0.0';

    const clientUrl = client.url || client.company_url || (client.email && client.email.includes('@') && !client.email.endsWith('gmail.com') ? client.email.split('@')[1] : 'alignbooks.com');
    const avatarInitials = (client.name || 'C').trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'CL';

    container.innerHTML = `
      <div class="details-view-container">
        <!-- 1. Sleek Profile Hero Header -->
        <div class="profile-hero-card">
          <div class="profile-hero-left">
            <button class="btn-back-circle" onclick="window.smatApp.navigateTo('client-details')" title="Back to Client List">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <div class="profile-avatar-badge">${avatarInitials}</div>
            <div class="profile-title-col">
              <div class="profile-name-row">
                <h1 class="profile-client-name">${escapeHtml(client.name)}</h1>
                <span class="profile-status-chip ${(client.subscription_status || 'Trial').toLowerCase()}">
                  <span class="status-pulse-dot"></span>
                  ${client.subscription_status || 'Trial'}
                </span>
                <span class="profile-type-chip">${escapeHtml(client.customer_type || 'Direct')}</span>
              </div>
              <div class="profile-meta-row">
                <span class="profile-meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  Zoho ID: <strong>${escapeHtml(client.zoho_customer_id || 'ZC-566987')}</strong>
                </span>
                <span class="profile-meta-sep">•</span>
                <span class="profile-meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  <a href="${clientUrl.startsWith('http') ? clientUrl : 'https://' + clientUrl}" target="_blank" class="profile-domain-link">${escapeHtml(clientUrl)} ↗</a>
                </span>
                <span class="profile-meta-sep">•</span>
                <span class="profile-meta-item">
                  <span class="text-muted">Active Plan:</span>
                  <strong style="color:#1877F2;">${escapeHtml(client.plan_name || 'Pro NY (WA)')}</strong>
                </span>
              </div>
            </div>
          </div>

          <div class="profile-hero-actions">
            <button class="btn-hero-primary" onclick="window.smatApp.openLoginConfirmModal(${client.id})" title="Access Client Portal">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Login Into Client
            </button>
            <button class="btn-hero-secondary" onclick="window.smatApp.openPlanModal(${client.id})" title="Manage Plan & Quotas">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              Upgrade / Modify Plan
            </button>
            <button class="btn-hero-outline" onclick="window.smatApp.openCommentsModal(${client.id})" title="View Internal Notes">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              Comments
            </button>
            <button class="btn-hero-outline" onclick="window.smatApp.openDocumentsModal(${client.id})" title="View Client Files">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
              Documents
            </button>
            <button class="btn-hero-danger" onclick="window.smatApp.openExpireModal(${client.id})" title="Expire Account">
              Expire
            </button>
          </div>
        </div>

        <!-- 2. Top Overview: Client Profile (Left) & Active Plan Quotas (Right) -->
        <div class="client-modular-grid">
          <!-- Card 1: Client Account Profile -->
          <div class="modular-card collapsed" id="card-client-profile">
            <div class="modular-card-header" onclick="window.smatApp.toggleModularCard('card-client-profile', event)">
              <div class="modular-title-group">
                <div class="modular-card-icon-wrap icon-blue">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <div>
                  <h3 class="modular-card-title">Client Profile</h3>
                  <p class="modular-card-subtitle">Master customer account & contact attributes</p>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:0.45rem;">
                <button class="btn-card-action-icon" onclick="window.smatApp.openEditProfileModal(${client.id})" title="Edit Profile Details">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                  <span>Edit Profile</span>
                </button>
                <button class="btn-collapse-card" onclick="window.smatApp.toggleModularCard('card-client-profile', event)" title="Collapse / Expand">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                </button>
              </div>
            </div>

            <div class="modular-card-body">
              <div class="modern-tiles-grid">
                <div class="modern-tile">
                  <span class="modern-tile-label">CLIENT NAME</span>
                  <span class="modern-tile-val font-semibold">${escapeHtml(client.name)}</span>
                </div>
                <div class="modern-tile">
                  <span class="modern-tile-label">EMAIL ADDRESS</span>
                  <div class="modern-tile-val flex-val">
                    <span class="truncate-val" title="${escapeHtml(client.email)}">${escapeHtml(client.email)}</span>
                    <button class="btn-tile-copy" onclick="window.smatApp.copyToClipboard('${client.email}', 'Email')" title="Copy Email">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                  </div>
                </div>
                <div class="modern-tile">
                  <span class="modern-tile-label">PRIMARY MOBILE</span>
                  <div class="modern-tile-val flex-val">
                    <span>${escapeHtml(client.phone_number || '—')}</span>
                    ${client.phone_number ? `
                    <button class="btn-tile-copy" onclick="window.smatApp.copyToClipboard('${client.phone_number}', 'Mobile')" title="Copy Mobile">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>` : ''}
                  </div>
                </div>
                <div class="modern-tile">
                  <span class="modern-tile-label">ALTERNATE MOBILE</span>
                  <span class="modern-tile-val">${escapeHtml(client.alternate_phone || '—')}</span>
                </div>
                <div class="modern-tile">
                  <span class="modern-tile-label">GST NUMBER</span>
                  <span class="modern-tile-val">${escapeHtml(client.gst_number || '—')}</span>
                </div>
                <div class="modern-tile">
                  <span class="modern-tile-label">CUSTOMER TYPE</span>
                  <span class="modern-tile-val">
                    <span class="badge-customer-type">${escapeHtml(client.customer_type || 'Direct')}</span>
                  </span>
                </div>
                <div class="modern-tile">
                  <span class="modern-tile-label">ZOHO CUSTOMER ID</span>
                  <div class="modern-tile-val flex-val">
                    <code class="code-val">${escapeHtml(client.zoho_customer_id || 'ZC-566987')}</code>
                    <button class="btn-tile-copy" onclick="window.smatApp.copyToClipboard('${client.zoho_customer_id || 'ZC-566987'}', 'Zoho ID')" title="Copy Zoho ID">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                  </div>
                </div>
                <div class="modern-tile">
                  <span class="modern-tile-label">PRIMARY DOMAIN</span>
                  <span class="modern-tile-val">
                    <a href="${clientUrl.startsWith('http') ? clientUrl : 'https://' + clientUrl}" target="_blank" class="tile-domain-link">${escapeHtml(clientUrl)} ↗</a>
                  </span>
                </div>
                <div class="modern-tile modern-tile-wide">
                  <span class="modern-tile-label">TEST ACCOUNT STATUS</span>
                  <div class="modern-tile-val">
                    <span class="test-account-pill ${client.test_account === 'Yes' ? 'is-test' : 'not-test'}">
                      ${client.test_account === 'Yes' ? '🧪 Test Account Active' : '🛡️ Live Production Account'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 2: Active Plan & Quotas (Visual Progress Bars) -->
          <div class="modular-card collapsed" id="card-plan-quotas">
            <div class="modular-card-header" onclick="window.smatApp.toggleModularCard('card-plan-quotas', event)">
              <div class="modular-title-group">
                <div class="modular-card-icon-wrap icon-amber">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                </div>
                <div>
                  <h3 class="modular-card-title">Active Plan & Quotas</h3>
                  <p class="modular-card-subtitle">Real-time resource utilization & message meters</p>
                </div>
              </div>
              <div class="card-header-badges">
                <button type="button" class="btn-action-primary" onclick="event.stopPropagation(); window.smatApp.openZohoSubscription(${client.id})" style="background:#2563EB; color:#FFFFFF; border:none; border-radius:6px; padding:5px 12px; font-size:0.78rem; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:5px; box-shadow:0 1px 2px rgba(37,99,235,0.25); transition:background 0.15s;" onmouseover="this.style.background='#1D4ED8'" onmouseout="this.style.background='#2563EB'" title="Change / Upgrade Plan">
                  <span>⚡</span> Change Plan
                </button>
                <span class="plan-badge-pill">${escapeHtml(client.plan_name || 'Pro NY (WA)')}</span>
                <span class="days-badge-pill">${client.days_left !== undefined ? client.days_left : 14} Days Left</span>
                <button class="btn-collapse-card" onclick="window.smatApp.toggleModularCard('card-plan-quotas', event)" title="Collapse / Expand">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                </button>
              </div>
            </div>

            <div class="modular-card-body">
              <div class="quotas-container">
                <!-- 1. Bots Quota -->
                <div class="quota-meter-item">
                  <div class="quota-meter-head">
                    <div class="quota-name-group">
                      <span class="quota-icon">🤖</span>
                      <span class="quota-title">Chatbots Allocation</span>
                    </div>
                    <div class="quota-count-group">
                      <span class="quota-count-val"><strong>${botsUsed}</strong> / ${botsLimit} used</span>
                      <span class="quota-left-pill">(${botsLeft} Left)</span>
                      <span class="quota-pct-pill">${botsPct}%</span>
                    </div>
                  </div>
                  <div class="quota-meter-track">
                    <div class="quota-meter-bar bar-indigo" style="width: ${Math.max(4, Math.min(100, botsPct))}%;"></div>
                  </div>
                </div>

                <!-- 2. General Chats -->
                <div class="quota-meter-item">
                  <div class="quota-meter-head">
                    <div class="quota-name-group">
                      <span class="quota-icon">💬</span>
                      <span class="quota-title">General Chats</span>
                      <button class="btn-quota-pencil" onclick="window.smatApp.openEditChatQuotaModal(${client.id}, 'chats')" title="Edit General Chats Limit">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </button>
                    </div>
                    <div class="quota-count-group">
                      <span class="quota-count-val"><strong>${chatsUsed.toLocaleString()}</strong> / ${chatsLimit.toLocaleString()} used</span>
                      <span class="quota-left-pill">(${chatsLeft.toLocaleString()} Left)</span>
                      <span class="quota-pct-pill">${chatsPct}%</span>
                    </div>
                  </div>
                  <div class="quota-meter-track">
                    <div class="quota-meter-bar bar-blue" style="width: ${Math.max(4, Math.min(100, chatsPct))}%;"></div>
                  </div>
                </div>

                <!-- 3. Service Messages (User Initiated) -->
                <div class="quota-meter-item">
                  <div class="quota-meter-head">
                    <div class="quota-name-group">
                      <span class="quota-icon">⚡</span>
                      <span class="quota-title">Service Chats (User Initiated)</span>
                      <button class="btn-quota-pencil" onclick="window.smatApp.openEditChatQuotaModal(${client.id}, 'service')" title="Edit Service Chats Limit">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </button>
                    </div>
                    <div class="quota-count-group">
                      <span class="quota-count-val"><strong>${serviceUsed.toLocaleString()}</strong> / ${serviceLimit.toLocaleString()} used</span>
                      <span class="quota-left-pill">(${serviceLeft.toLocaleString()} Left)</span>
                      <span class="quota-pct-pill">${servicePct}%</span>
                    </div>
                  </div>
                  <div class="quota-meter-track">
                    <div class="quota-meter-bar bar-emerald" style="width: ${Math.max(4, Math.min(100, servicePct))}%;"></div>
                  </div>
                </div>

                <!-- 4. BI Chats -->
                <div class="quota-meter-item">
                  <div class="quota-meter-head">
                    <div class="quota-name-group">
                      <span class="quota-icon">📊</span>
                      <span class="quota-title">BI Intelligence Chats</span>
                      <button class="btn-quota-pencil" onclick="window.smatApp.openEditChatQuotaModal(${client.id}, 'bi')" title="Edit BI Chats Limit">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </button>
                    </div>
                    <div class="quota-count-group">
                      <span class="quota-count-val"><strong>${biUsed.toLocaleString()}</strong> / ${biLimit.toLocaleString()} used</span>
                      <span class="quota-left-pill">(${biLeft.toLocaleString()} Left)</span>
                      <span class="quota-pct-pill">${biPct}%</span>
                    </div>
                  </div>
                  <div class="quota-meter-track">
                    <div class="quota-meter-bar bar-purple" style="width: ${Math.max(4, Math.min(100, biPct))}%;"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Subscriptions, Invoicing & Previous Plans History -->
        <div class="modular-card modular-card-full collapsed" id="card-billing-center">
          <div class="modular-card-header" onclick="window.smatApp.toggleModularCard('card-billing-center', event)">
            <div class="modular-title-group">
              <div class="modular-card-icon-wrap icon-emerald">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
              </div>
              <div>
                <h3 class="modular-card-title">Subscriptions & Billing Center</h3>
                <p class="modular-card-subtitle">Active subscription lifecycle, auto-pay, payment methods & historical plans</p>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <button type="button" class="btn-action-primary" onclick="event.stopPropagation(); window.smatApp.openZohoSubscription(${client.id})" style="background:#2563EB; color:#FFFFFF; border:none; border-radius:6px; padding:6px 14px; font-size:0.82rem; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:6px; box-shadow:0 1px 3px rgba(37,99,235,0.25); transition:background 0.15s;" onmouseover="this.style.background='#1D4ED8'" onmouseout="this.style.background='#2563EB'" title="Change subscription plan for this client">
                <span>⚡</span> Change Subscription
              </button>
              <span class="status-pill ${(client.subscription_status || 'Trial').toLowerCase()}">${client.subscription_status || 'Trial'}</span>
              <button class="btn-collapse-card" onclick="window.smatApp.toggleModularCard('card-billing-center', event)" title="Collapse / Expand">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
              </button>
            </div>
          </div>

          <div class="modular-card-body">
            <!-- Top KPI Strip -->
            <div class="billing-kpi-strip">
              <div class="billing-kpi-item">
                <span class="kpi-label">CURRENT SUB ID</span>
                <span class="kpi-val" style="color:#1877F2; font-family:monospace; font-weight:700;">${escapeHtml(client.subscription_id || 'SUB-BAL-2026')}</span>
              </div>
              <div class="billing-kpi-item">
                <span class="kpi-label">BILLING FREQUENCY</span>
                <span class="kpi-val font-semibold">${escapeHtml(client.billing_cycle || 'Monthly')}</span>
              </div>
              <div class="billing-kpi-item">
                <span class="kpi-label">CURRENT AMOUNT</span>
                <span class="kpi-val font-bold" style="color:#0F172A;">${escapeHtml(client.subscription_amount_display || '₹ 0.00')}</span>
              </div>
              <div class="billing-kpi-item">
                <span class="kpi-label">NEXT EXPIRY / RENEWAL</span>
                <span class="kpi-val font-semibold" style="color:#2563EB;">${escapeHtml(client.end_date || '15-10-2026')}</span>
              </div>
            </div>

            <!-- Auto-Pay, Card & Add-ons Grid -->
            <div class="billing-dual-grid">
              <div class="billing-feature-box">
                <div class="feature-box-head">
                  <div class="feature-box-title">
                    <span>💳 Auto-Pay Renewal</span>
                  </div>
                  <span class="autopay-status-badge ${client.autopay_enabled !== false ? 'enabled' : 'disabled'}">
                    ${client.autopay_enabled !== false ? '🟢 Active' : '⚪ Paused'}
                  </span>
                </div>
                <p class="feature-box-desc">
                  ${client.autopay_enabled !== false ? 'Automatic renewal active on billing date.' : 'Auto-renew paused. Plan expires at period end.'}
                </p>
                <button class="btn-box-action" onclick="window.smatApp.openAutoPayModal(${client.id})">
                  ⚙️ Manage Auto-Pay
                </button>
              </div>

              <div class="billing-feature-box">
                <div class="feature-box-head">
                  <div class="feature-box-title">
                    <span>🏦 Saved Payment Method</span>
                  </div>
                  <span class="badge-default-card">DEFAULT</span>
                </div>
                <p class="feature-box-desc">
                  <strong>${client.payment_method?.brand || 'Visa'}</strong> •••• ${client.payment_method?.last4 || '4242'}
                  <span class="text-muted">(Exp: ${client.payment_method?.expiry || '12/28'})</span>
                </p>
                <button class="btn-box-action" onclick="window.smatApp.openUpdatePaymentMethodModal(${client.id})">
                  💳 Update Card
                </button>
              </div>
            </div>

            <!-- Previous Plans & Subscription History Table (Exact user request!) -->
            <div class="plan-history-section">
              <div class="plan-history-header">
                <div>
                  <h4 class="plan-history-title">📜 Plan History & Expiry Timeline</h4>
                  <p class="plan-history-sub">Audit trail of all previous and current plans used by this account with start & expiry dates.</p>
                </div>
                <span class="history-count-badge">${planHistory.length} Recorded Plans</span>
              </div>

              <div class="clean-table-responsive">
                <table class="plan-history-table">
                  <thead>
                    <tr>
                      <th>Plan Name</th>
                      <th>Billing Cycle</th>
                      <th>Amount Paid</th>
                      <th>Activated Date</th>
                      <th>Expired On / Valid Till</th>
                      <th>Status</th>
                      <th>Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${planHistory.map(hist => `
                      <tr class="${hist.is_current ? 'row-current-plan' : ''}">
                        <td>
                          <strong>${escapeHtml(hist.plan_name)}</strong>
                          ${hist.is_current ? '<span class="current-plan-tag">Current</span>' : ''}
                        </td>
                        <td>${escapeHtml(hist.billing_cycle)}</td>
                        <td><strong style="color:#0F172A;">${escapeHtml(hist.amount)}</strong></td>
                        <td class="font-mono text-muted">${escapeHtml(hist.start_date)}</td>
                        <td class="font-mono">
                          <span style="${hist.is_current ? 'color:#2563EB; font-weight:700;' : 'color:#64748B;'}">
                            ${escapeHtml(hist.end_date)}
                          </span>
                        </td>
                        <td>
                          <span class="status-pill ${hist.status.toLowerCase()}">
                            ${hist.status === 'Active' ? '🟢 Active' : (hist.status === 'Trial' ? '🟡 Trial' : '⚪ Expired')}
                          </span>
                        </td>
                        <td>
                          <span class="invoice-link-pill" onclick="window.smatApp.showToast('Downloaded invoice ${hist.invoice_id}')" title="Download Invoice">
                            ${hist.invoice_id} 📄
                          </span>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Action Buttons Footer -->
            <div class="card-footer-actions" style="margin-top: 1.25rem;">
              <button class="btn-cancel-sub" onclick="window.smatApp.openCancelSubscriptionModal(${client.id})">
                🚫 Cancel Subscription
              </button>
              <div class="footer-btn-right">
                <button class="btn-footer-secondary" onclick="window.smatApp.openPlanModal(${client.id})">
                  🔄 Change Plan / Duration
                </button>
                <button class="btn-footer-primary" onclick="window.smatApp.openPlanModal(${client.id})">
                  ⚡ Upgrade / Modify Plan
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. User's Configured Chatbots (Replaces Clumsy Operations Hub!) -->
        <div class="modular-card modular-card-full collapsed" id="client-configured-bots-card">
          <div class="modular-card-header" onclick="window.smatApp.toggleModularCard('client-configured-bots-card', event)">
            <div class="modular-title-group">
              <div class="modular-card-icon-wrap icon-blue">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <div>
                <h3 class="modular-card-title">Configured Chatbots for ${escapeHtml(client.name)}</h3>
                <p class="modular-card-subtitle">${clientBots.length} active bots configured out of ${botsLimit} quota allocation</p>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <button class="btn-hero-primary" onclick="window.smatApp.openCreateBotForClient(${client.id})" style="padding:6px 14px; font-size:0.82rem;">
                + Deploy New Bot
              </button>
              <button class="btn-collapse-card" onclick="window.smatApp.toggleModularCard('client-configured-bots-card', event)" title="Collapse / Expand">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
              </button>
            </div>
          </div>

          <div class="modular-card-body">
            ${clientBots.length > 0 ? `
              <div class="clean-table-responsive">
                <table class="client-bots-table">
                  <thead>
                    <tr>
                      <th>Bot Name & ID</th>
                      <th>Channel Platform</th>
                      <th>Trigger URL / Target</th>
                      <th>Created Date</th>
                      <th>Chats Handled</th>
                      <th>Live Status</th>
                      <th style="text-align:right;">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${clientBots.map(bot => `
                      <tr>
                        <td>
                          <div class="bot-table-identity">
                            <span class="bot-channel-avatar">${bot.channelIcon}</span>
                            <div>
                              <strong class="bot-table-name">${escapeHtml(bot.name)}</strong>
                              <code class="bot-table-id">${escapeHtml(bot.id)}</code>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span class="bot-channel-tag ${bot.channel.includes('WhatsApp') ? 'whatsapp' : ''}">
                            ${escapeHtml(bot.channel)}
                          </span>
                        </td>
                        <td>
                          <span class="bot-table-url text-muted font-mono" title="${escapeHtml(bot.triggerUrl)}">
                            ${escapeHtml(bot.triggerUrl)}
                          </span>
                        </td>
                        <td class="font-mono text-muted">${escapeHtml(bot.createdDate)}</td>
                        <td>
                          <strong style="color:#0F172A;">${bot.chatsCount.toLocaleString()}</strong>
                          <span style="font-size:0.75rem; color:#64748B;"> chats</span>
                        </td>
                        <td>
                          <div class="bot-toggle-row">
                            <label class="smat-switch-label">
                              <input 
                                type="checkbox" 
                                class="smat-switch-input" 
                                ${bot.isActive ? 'checked' : ''} 
                                onchange="window.smatApp.toggleClientBotActive(${client.id}, '${bot.id}')"
                              />
                              <span class="smat-switch-slider"></span>
                            </label>
                            <span class="bot-status-text ${bot.isActive ? 'live' : 'paused'}">
                              ${bot.isActive ? '🟢 Live' : '⚪ Paused'}
                            </span>
                          </div>
                        </td>
                        <td style="text-align:right;">
                          <div style="display:inline-flex; gap:0.4rem;">
                            <button class="btn-bot-action-secondary" onclick="window.smatApp.openBotDetailsModal(${client.id})" title="Launch Flow Builder">
                              🛠️ Flow Builder
                            </button>
                            <button class="btn-bot-action-outline" onclick="window.smatApp.openWhatsAppBotDetailsModal(${client.id})" title="Bot Settings & Routing">
                              ⚙️ Settings
                            </button>
                          </div>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : `
              <div class="empty-bots-box">
                <div style="font-size:2.5rem; margin-bottom:0.5rem;">🤖</div>
                <h4 style="margin:0 0 0.4rem; color:#1E293B;">No Chatbots Configured Yet</h4>
                <p style="font-size:0.85rem; color:#64748B; margin:0 0 1rem;">This client has not deployed any bots yet. You can create the first bot now.</p>
                <button class="btn-hero-primary" onclick="window.smatApp.openCreateBotForClient(${client.id})">
                  + Create First Bot
                </button>
              </div>
            `}
          </div>
        </div>

        <!-- 5. Agents & System Audit Logs 2-Column Row -->
        <div class="client-modular-grid">
          <!-- Card A: Live Chat Support Agents -->
          <div class="modular-card collapsed" id="card-support-agents">
            <div class="modular-card-header" onclick="window.smatApp.toggleModularCard('card-support-agents', event)">
              <div class="modular-title-group">
                <div class="modular-card-icon-wrap icon-purple">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <div>
                  <h3 class="modular-card-title">Live Chat Support Agents</h3>
                  <p class="modular-card-subtitle">Human specialists assigned to live chat queues</p>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <button class="btn-hero-primary" onclick="window.smatApp.openAddUserModal()" style="padding:5px 12px; font-size:0.78rem;">
                  + Add Agent
                </button>
                <button class="btn-collapse-card" onclick="window.smatApp.toggleModularCard('card-support-agents', event)" title="Collapse / Expand">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                </button>
              </div>
            </div>

            <div class="modular-card-body">
              <div class="agents-roster-list">
                <div class="agent-roster-item">
                  <div class="agent-chip-avatar">SP</div>
                  <div class="agent-chip-details">
                    <span class="agent-chip-name">Sukanya P.</span>
                    <span class="agent-chip-email">sukanya@smatbot.com</span>
                  </div>
                  <div class="agent-roster-meta">
                    <span class="agent-role-pill">Primary Agent</span>
                    <span class="agent-status-tag online">🟢 Online</span>
                  </div>
                </div>

                <div class="agent-roster-item">
                  <div class="agent-chip-avatar" style="background:#E0E7FF; color:#4338CA;">BK</div>
                  <div class="agent-chip-details">
                    <span class="agent-chip-name">Balaji K.</span>
                    <span class="agent-chip-email">balaji@smatbot.com</span>
                  </div>
                  <div class="agent-roster-meta">
                    <span class="agent-role-pill">Live Support</span>
                    <span class="agent-status-tag online">🟢 Online</span>
                  </div>
                </div>

                <div class="agent-roster-item">
                  <div class="agent-chip-avatar" style="background:#FEF3C7; color:#D97706;">AK</div>
                  <div class="agent-chip-details">
                    <span class="agent-chip-name">Anand K.</span>
                    <span class="agent-chip-email">anand@smatbot.com</span>
                  </div>
                  <div class="agent-roster-meta">
                    <span class="agent-role-pill">Escalation Lead</span>
                    <span class="agent-status-tag away">🟡 Away</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Card B: System & Audit Activity Logs -->
          <div class="modular-card collapsed" id="card-system-logs">
            <div class="modular-card-header" onclick="window.smatApp.toggleModularCard('card-system-logs', event)">
              <div class="modular-title-group">
                <div class="modular-card-icon-wrap icon-amber">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <div>
                  <h3 class="modular-card-title">System & Audit Logs</h3>
                  <p class="modular-card-subtitle">Real-time security telemetry & access events</p>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <span class="audit-stream-badge">🟢 Live Feed</span>
                <button class="btn-collapse-card" onclick="window.smatApp.toggleModularCard('card-system-logs', event)" title="Collapse / Expand">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                </button>
              </div>
            </div>

            <div class="modular-card-body" style="padding: 1rem 1.25rem;">
              <div class="audit-terminal-console" style="margin:0;">
                <div class="terminal-header-bar">
                  <span class="terminal-dot red"></span>
                  <span class="terminal-dot yellow"></span>
                  <span class="terminal-dot green"></span>
                  <span class="terminal-title">audit.log // client_id: ${client.id}</span>
                </div>
                <div class="terminal-logs-body" style="max-height: 195px; overflow-y: auto;">
                  <div class="log-entry">
                    <span class="log-ts">[2026-09-29 10:45:12]</span>
                    <span class="log-tag info">[AUTH]</span>
                    <span class="log-msg">SSO Impersonation Token issued: ${escapeHtml(client.email)}</span>
                  </div>
                  <div class="log-entry">
                    <span class="log-ts">[2026-09-28 09:12:04]</span>
                    <span class="log-tag success">[PLAN]</span>
                    <span class="log-msg">Plan Synchronized: ${escapeHtml(client.plan_name || 'Pro NY (WA)')}</span>
                  </div>
                  <div class="log-entry">
                    <span class="log-ts">[2026-09-27 16:30:11]</span>
                    <span class="log-tag success">[WEBHOOK]</span>
                    <span class="log-msg">WhatsApp Meta Cloud Webhook sync OK (0 packet drops)</span>
                  </div>
                  <div class="log-entry">
                    <span class="log-ts">[2026-09-25 14:02:49]</span>
                    <span class="log-tag warn">[SECURITY]</span>
                    <span class="log-msg">TLS certificate renewed automatically (Let's Encrypt Node 01)</span>
                  </div>
                </div>
              </div>
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
          <div style="font-size:1.5rem; font-weight:800; color:#7C3AED; margin-top:4px;">${usersData.filter(u => u.role === 'Super Admin').length}</div>
        </div>
        <div class="metric-summary-card" style="min-height:auto; padding:1.25rem;">
          <div style="font-size:0.75rem; font-weight:700; color:#64748B; text-transform:uppercase;">BOT ENGINEERS</div>
          <div style="font-size:1.5rem; font-weight:800; color:#1D4ED8; margin-top:4px;">${usersData.filter(u => u.role === 'Bot Engineer').length}</div>
        </div>
        <div class="metric-summary-card" style="min-height:auto; padding:1.25rem;">
          <div style="font-size:0.75rem; font-weight:700; color:#64748B; text-transform:uppercase;">SUPPORT LEADS</div>
          <div style="font-size:1.5rem; font-weight:800; color:#15803D; margin-top:4px;">${usersData.filter(u => u.role === 'Support Lead').length}</div>
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
                <td style="text-align: right; white-space: nowrap;">
                  <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.openEditUserModal(${u.id})">✎ Permissions</button>
                  <button class="btn-table-action btn-action-danger" onclick="window.smatApp.confirmDeleteUser(${u.id})" style="margin-left:6px; color:#DC2626; border:1px solid #FCA5A5; background:#FEF2F2;" title="Remove User">🗑️ Delete</button>
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

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
              <div>
                <label class="filter-item-label">Account Password *</label>
                <input type="password" id="new-user-password" class="filter-search-box" placeholder="Assign account password" required />
              </div>
              <div>
                <label class="filter-item-label">Confirm Password *</label>
                <input type="password" id="new-user-confirm-password" class="filter-search-box" placeholder="Confirm password" required />
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
      const password = $('#new-user-password').value.trim();
      const confirmPass = $('#new-user-confirm-password').value.trim();

      if (!password) {
        showToast('❌ Please specify a password for the new user.');
        return;
      }
      if (password !== confirmPass) {
        showToast('❌ Passwords do not match. Please re-enter.');
        return;
      }
      if (password.length < 4) {
        showToast('❌ Password must be at least 4 characters long.');
        return;
      }

      // Check for duplicate email
      const existingUser = usersData.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        showToast(`❌ A user with email "${email}" already exists.`);
        return;
      }

      const newUser = {
        id: usersData.length + 1,
        name,
        email,
        password,
        department: dept,
        role,
        avatar: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        status: 'Active',
        twoFactorEnabled: false,
        lastActive: 'Just now',
        permissions: { manageClients: true, migrateBots: true, activatePlans: true }
      };

      usersData.unshift(newUser);
      localStorage.setItem('smatbot_users_data', JSON.stringify(usersData));

      // Also sync to backend API if backend server is running
      try {
        fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, role, password })
        }).catch(() => {});
      } catch (err) {}

      showToast(`User ${name} created successfully! Password assigned.`);
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
                <option value="Super Admin" ${user.role === 'Super Admin' ? 'selected' : ''}>Super Admin</option>
                <option value="Bot Engineer" ${user.role === 'Bot Engineer' ? 'selected' : ''}>Bot Engineer</option>
                <option value="Support Lead" ${user.role === 'Support Lead' ? 'selected' : ''}>Support Lead</option>
                <option value="Billing Manager" ${user.role === 'Billing Manager' ? 'selected' : ''}>Billing Manager</option>
              </select>
            </div>
            <div style="margin-bottom:1rem;">
              <label class="filter-item-label">Reset Password (leave blank to keep current)</label>
              <input type="password" id="edit-user-password" class="filter-search-box" placeholder="Enter new password to change" />
            </div>
            <div class="permissions-matrix-grid">
              <div class="permission-toggle-card">
                <span>Manage Clients</span>
                <label class="switch-box"><input type="checkbox" checked /><span class="switch-slider"></span></label>
              </div>
              <div class="permission-toggle-card">
                <span>Execute Bot Migrations</span>
                <label class="switch-box"><input type="checkbox" ${user.role === 'Super Admin' || user.role === 'Bot Engineer' ? 'checked' : ''} /><span class="switch-slider"></span></label>
              </div>
              <div class="permission-toggle-card">
                <span>Activate Plans</span>
                <label class="switch-box"><input type="checkbox" ${user.role === 'Super Admin' || user.role === 'Billing Manager' ? 'checked' : ''} /><span class="switch-slider"></span></label>
              </div>
              <div class="permission-toggle-card">
                <span>Manage Users</span>
                <label class="switch-box"><input type="checkbox" ${user.role === 'Super Admin' ? 'checked' : ''} /><span class="switch-slider"></span></label>
              </div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1.5rem;">
              <button type="button" class="btn-table-action" onclick="window.smatApp.confirmDeleteUser(${user.id})" style="color:#DC2626; border:1px solid #FCA5A5; background:#FEF2F2; font-weight:600;">🗑️ Remove User</button>
              <div style="display:flex; gap:0.5rem;">
                <button type="button" class="btn-table-action btn-action-secondary" onclick="window.smatApp.closeModal()">Cancel</button>
                <button type="submit" class="btn-table-action btn-action-primary">Save Permissions</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    `;

    $('#edit-user-form').addEventListener('submit', (e) => {
      e.preventDefault();
      user.role = $('#edit-user-role').value;
      const newPass = $('#edit-user-password') ? $('#edit-user-password').value.trim() : '';
      if (newPass) {
        if (newPass.length < 4) {
          showToast('❌ Password must be at least 4 characters long.');
          return;
        }
        user.password = newPass;
      }
      localStorage.setItem('smatbot_users_data', JSON.stringify(usersData));
      showToast('User permissions and settings updated successfully!');
      closeModal();
      if (currentRoute === 'users') renderUsersView($('#route-viewport'));
    });
  }

  function confirmDeleteUser(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) {
      showToast('❌ User not found.');
      return;
    }

    if (currentUser && currentUser.email && user.email.toLowerCase() === currentUser.email.toLowerCase()) {
      showToast('⚠️ You cannot delete your own currently logged-in account.');
      return;
    }

    const modal = $('#modal-container');
    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="modal-box-card" style="border-top: 4px solid #EF4444; max-width:480px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <div style="font-size:1.15rem; font-weight:800; color:#DC2626;">🗑️ Confirm Delete User</div>
            <button onclick="window.smatApp.closeModal()" style="background:none; border:none; font-size:1.2rem; cursor:pointer;">✕</button>
          </div>
          <p style="font-size:0.92rem; color:#334155; line-height:1.5; margin-bottom:1.25rem;">
            Are you sure you want to remove <strong>${user.name}</strong> (<code>${user.email}</code>) from the team?
            <br/><span style="color:#64748B; font-size:0.82rem; margin-top:6px; display:inline-block;">This user will immediately lose platform access and cannot log in.</span>
          </p>
          <div style="display:flex; justify-content:flex-end; gap:0.6rem;">
            <button type="button" class="btn-table-action btn-action-secondary" onclick="window.smatApp.closeModal()">Cancel</button>
            <button type="button" class="btn-table-action" onclick="window.smatApp.executeDeleteUser(${user.id})" style="background:#DC2626; color:#FFFFFF; border:none; padding:0.5rem 1rem; border-radius:6px; font-weight:600; cursor:pointer;">
              Yes, Delete User
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function executeDeleteUser(userId) {
    const idx = usersData.findIndex(u => u.id === userId);
    if (idx === -1) {
      showToast('❌ User not found.');
      closeModal();
      return;
    }

    const removed = usersData.splice(idx, 1)[0];
    localStorage.setItem('smatbot_users_data', JSON.stringify(usersData));

    // Also sync with backend API if available
    try {
      fetch(`/api/users/${userId}`, { method: 'DELETE' }).catch(() => {});
    } catch (e) {}

    closeModal();
    showToast(`🗑️ User "${removed.name}" was successfully removed.`);
    if (currentRoute === 'users') {
      renderUsersView($('#route-viewport'));
    }
  }

  // =========================================================================
  // 7. PLAN ACTIVATION & PRICING (REMOVED - REDIRECTS TO CLIENT DETAILS)
  // =========================================================================
  function renderPlansView(container) {
    navigateTo('client-details');
  }

  // =========================================================================
  // DEDICATED ADDONS & INTEGRATIONS VIEW
  // =========================================================================
  function renderAddonsView(container) {
    navigateTo('client-details');
  }

  function toggleBillingFrequency(isYearly) {
    billingToggleYearly = isYearly;
  }


  // =========================================================================
  // ZOHO BILLING STYLE SUBSCRIPTIONS MODULE
  // Clean, minimalist, no-color enterprise UI faithful to screenshots 1 & 2
  // =========================================================================
  let zohoSelectedClientId = 0;
  let zohoSubFor = 'product';
  let zohoSelectedProduct = ''; // Starts unselected; selecting product reveals bottom details
  let zohoProductDropdownOpen = false;
  let zohoProductSearchQuery = '';
  let zohoSelectedPlan = '';
  let zohoDurationMonths = 1;
  let zohoSelectedCurrency = 'INR';
  let zohoPlanQty = 1;
  let zohoPlanDiscount = 0;
  let zohoSubNumber = 'SUB-00842';
  let zohoStartDate = new Date().toLocaleDateString('en-GB'); // e.g. 19/10/2026
  let zohoNeverExpires = true;
  let zohoExpiresCycles = '';
  let zohoRefNumber = '';
  let zohoSalesperson = '';
  let zohoPaymentModeOffline = true;
  let zohoPaymentTerms = 'Due on Receipt';
  let zohoGstNumber = '36AAACS1429B1Z8';

  const ZOHO_PRODUCTS = [
    {
      id: 'Feltso',
      name: 'Feltso',
      plans: [
        { id: 'Feltso Pro', name: 'Feltso Pro', monthlyINR: 5999, yearlyINR: 59990, monthlyUSD: 75, yearlyUSD: 750 },
        { id: 'Feltso Starter', name: 'Feltso Starter', monthlyINR: 2499, yearlyINR: 24990, monthlyUSD: 30, yearlyUSD: 300 },
        { id: 'Feltso Enterprise', name: 'Feltso Enterprise', monthlyINR: 12999, yearlyINR: 129990, monthlyUSD: 160, yearlyUSD: 1600 }
      ]
    },
    {
      id: 'SmatBot',
      name: 'SmatBot',
      plans: [
        { id: 'Pro', name: 'Pro', monthlyINR: 6500, yearlyINR: 72000, monthlyUSD: 85, yearlyUSD: 890 },
        { id: 'Standard', name: 'Standard', monthlyINR: 3500, yearlyINR: 35000, monthlyUSD: 45, yearlyUSD: 430 },
        { id: 'Broadcast', name: 'Broadcast', monthlyINR: 1499, yearlyINR: 14500, monthlyUSD: 19, yearlyUSD: 180 },
        { id: 'AI', name: 'AI Enterprise', monthlyINR: 8999, yearlyINR: 96000, monthlyUSD: 115, yearlyUSD: 1190 }
      ]
    }
  ];

  function getZohoCurrentProduct() {
    return ZOHO_PRODUCTS.find(p => p.id === zohoSelectedProduct) || null;
  }

  function getZohoCurrentPlanMeta() {
    const prod = getZohoCurrentProduct();
    if (!prod) return { monthlyINR: 6500, yearlyINR: 72000, monthlyUSD: 85, yearlyUSD: 890 };
    return prod.plans.find(p => p.id === zohoSelectedPlan) || prod.plans[0];
  }

  function handleZohoCustomerChange(id) {
    zohoSelectedClientId = parseInt(id, 10);
    const client = clientsData.find(c => c.id === zohoSelectedClientId);
    if (client && client.gst_number && client.gst_number !== '-') {
      zohoGstNumber = client.gst_number;
    }
    renderSubscriptionCreationView($('#route-viewport'));
  }

  function toggleZohoCurrency() {
    zohoSelectedCurrency = zohoSelectedCurrency === 'INR' ? 'USD' : 'INR';
    renderSubscriptionCreationView($('#route-viewport'));
  }

  function editZohoAddress(type) {
    openZohoEditCustomer(zohoSelectedClientId, 'address');
  }

  function copyBillingToShipping() {
    const shippingEl = $('#zoho-shipping-address-content');
    if (shippingEl) {
      shippingEl.innerHTML = `
        <strong>smatbot</strong><br/>
        2nd Floor, Ashoka HiTech<br/>
        Chambers, Road No. 2, opp. KBR<br/>
        Park, Park View Enclave,<br/>
        hyderabad 500034<br/>
        India
      `;
      showToast('Shipping address updated to match billing address.');
    }
  }

  function addZohoContactPerson() {
    const name = prompt('Enter Contact Person Name:');
    const email = prompt('Enter Contact Person Email:');
    if (email) {
      const row = $('.zoho-email-to-row');
      if (row) {
        const lbl = document.createElement('label');
        lbl.className = 'zoho-checkbox-item';
        lbl.innerHTML = `<input type="checkbox" checked /> <span>${escapeHtml(email)} (${escapeHtml(name || 'Contact')})</span>`;
        row.appendChild(lbl);
        showToast('Contact person added!');
      }
    }
  }

  function setZohoSubFor(val) {
    zohoSubFor = val;
    renderSubscriptionCreationView($('#route-viewport'));
  }

  function toggleZohoProductDropdown(forceState) {
    if (typeof forceState === 'boolean') {
      zohoProductDropdownOpen = forceState;
    } else {
      zohoProductDropdownOpen = !zohoProductDropdownOpen;
    }
    const menu = $('#zoho-product-dropdown-menu');
    const trigger = $('#zoho-product-trigger');
    if (menu && trigger) {
      if (zohoProductDropdownOpen) {
        menu.style.display = 'block';
        trigger.classList.add('active');
        const searchInput = $('#zoho-product-search-input');
        if (searchInput) setTimeout(() => searchInput.focus(), 50);
      } else {
        menu.style.display = 'none';
        trigger.classList.remove('active');
      }
    } else {
      renderSubscriptionCreationView($('#route-viewport'));
    }
  }

  function filterZohoProducts(q) {
    zohoProductSearchQuery = (q || '').trim().toLowerCase();
    const listEl = $('#zoho-product-option-list');
    if (!listEl) return;
    const items = ZOHO_PRODUCTS.filter(p => !zohoProductSearchQuery || p.name.toLowerCase().includes(zohoProductSearchQuery));
    if (items.length === 0) {
      listEl.innerHTML = '<div style="padding:0.6rem 0.8rem; color:#94A3B8; font-size:0.82rem;">No matching products found</div>';
    } else {
      listEl.innerHTML = items.map(p => `
        <div class="zoho-product-option-item ${p.id === zohoSelectedProduct ? 'selected' : ''}" 
             onclick="window.smatApp.setZohoProduct('${p.id}')">
          ${escapeHtml(p.name)}
        </div>
      `).join('');
    }
  }

  function setZohoProduct(val) {
    zohoSelectedProduct = val;
    zohoProductDropdownOpen = false;
    zohoProductSearchQuery = '';
    const prod = getZohoCurrentProduct();
    if (prod && prod.plans.length > 0) {
      zohoSelectedPlan = prod.plans[0].id;
    }
    renderSubscriptionCreationView($('#route-viewport'));
    showToast(`Selected product: ${val}. Subscription details are displayed below.`);
  }

  function setZohoPlanTier(val) {
    zohoSelectedPlan = val;
    renderSubscriptionCreationView($('#route-viewport'));
  }

  function setZohoPlanFreq(val) {
    zohoDurationMonths = parseInt(val, 10);
    renderSubscriptionCreationView($('#route-viewport'));
  }

  function setZohoPlanQty(val) {
    zohoPlanQty = Math.max(1, parseInt(val, 10) || 1);
    renderSubscriptionCreationView($('#route-viewport'));
  }

  function setZohoPlanDiscount(val) {
    zohoPlanDiscount = Math.max(0, parseFloat(val) || 0);
    renderSubscriptionCreationView($('#route-viewport'));
  }

  function setZohoField(field, val) {
    if (field === 'zohoSubNumber') zohoSubNumber = val;
    else if (field === 'zohoStartDate') zohoStartDate = val;
    else if (field === 'zohoExpiresCycles') zohoExpiresCycles = val;
    else if (field === 'zohoRefNumber') zohoRefNumber = val;
    else if (field === 'zohoSalesperson') zohoSalesperson = val;
    else if (field === 'zohoGstNumber') zohoGstNumber = val;
    else if (field === 'zohoPaymentModeOffline') zohoPaymentModeOffline = Boolean(val);
    else if (field === 'zohoPaymentTerms') zohoPaymentTerms = val;
  }

  function toggleZohoNeverExpires(checked) {
    zohoNeverExpires = checked;
    const input = $('#zoho-expires-cycles');
    if (input) {
      input.disabled = checked;
      if (checked) input.value = '';
    }
  }

  function handleZohoTopSearch(val) {
    if (!val) return;
    const term = val.trim().toLowerCase();
    const found = clientsData.find(c => 
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.zoho_customer_id && c.zoho_customer_id.toLowerCase().includes(term))
    );
    if (found) {
      zohoSelectedClientId = found.id;
      renderSubscriptionCreationView($('#route-viewport'));
    }
  }

  function handleZohoSubscriptionSubmit(e) {
    e.preventDefault();
    if (!zohoSelectedProduct) {
      showToast('⚠️ Please select a Product first to activate subscription.');
      return;
    }
    const client = clientsData.find(c => c.id === zohoSelectedClientId) || clientsData[0];
    const planMeta = getZohoCurrentPlanMeta();
    const isYearly = zohoDurationMonths === 12;
    const baseRate = zohoSelectedCurrency === 'USD' ? planMeta.monthlyUSD : planMeta.monthlyINR;
    let subtotal = (isYearly ? (planMeta.yearlyINR ? (zohoSelectedCurrency === 'USD' ? planMeta.yearlyUSD : planMeta.yearlyINR) : baseRate * 10) : baseRate * zohoDurationMonths) * zohoPlanQty;
    subtotal = Math.max(0, subtotal - zohoPlanDiscount);
    const total = Math.round(subtotal * 1.18);

    if (client) {
      client.plan_name = zohoSelectedPlan;
      client.plan_type = 'Paid_plan';
      client.billing_cycle = isYearly ? 'Yearly' : (zohoDurationMonths > 1 ? `Custom (${zohoDurationMonths} Mos)` : 'Monthly');
      client.subscription_status = 'Active';
      client.days_left = zohoDurationMonths * 30;
      client.gst_number = zohoGstNumber || client.gst_number;
      client.subscription_amount_display = zohoSelectedCurrency === 'USD' ? `$ ${total.toFixed(2)}` : `₹ ${total.toLocaleString('en-IN')}.00`;
      client.subscription_id = zohoSubNumber;
      if (zohoSalesperson) client.sales_person = zohoSalesperson;
    }

    showToast(`🎉 Subscription ${zohoSubNumber} created successfully for ${client ? client.name : 'Client'}!`);
    navigateTo('subscriptions');
  }

  
  // =========================================================================
  // ZOHO BILLING - EDIT CUSTOMER VIEW (Screenshots 2 & 3: Other Details & Address)
  // =========================================================================
  let zohoEditCustomerTab = 'other-details';

  function onZohoCustomerSelectChange(clientId) {
    zohoSelectedClientId = isNaN(clientId) ? clientId : Number(clientId);
    const viewport = document.getElementById('route-viewport');
    if (viewport) {
      renderZohoEditCustomerView(viewport);
    }
  }

  function openZohoEditCustomer(clientId, initialTab) {
    if (clientId !== undefined) {
      zohoSelectedClientId = clientId;
    }
    zohoEditCustomerTab = initialTab || 'other-details';
    navigateTo('edit-customer');
  }

  let moreCustomerDetailsOpen = false;
  function toggleMoreCustomerDetails() {
    moreCustomerDetailsOpen = !moreCustomerDetailsOpen;
    const morePane = document.getElementById('cust-more-details-container');
    const link = document.getElementById('toggle-more-details-btn');
    if (morePane) {
      morePane.style.display = moreCustomerDetailsOpen ? 'block' : 'none';
    }
    if (link) {
      link.innerHTML = moreCustomerDetailsOpen ? 'Less details ▲' : 'Add more details ▾';
    }
  }

  let uploadedCustomerDocs = [];
  function handleDocumentUpload(input) {
    if (input && input.files && input.files.length > 0) {
      const newFiles = Array.from(input.files).map(f => ({
        name: f.name,
        size: f.size,
        type: f.type,
        lastModified: f.lastModified
      }));
      uploadedCustomerDocs = uploadedCustomerDocs.concat(newFiles);
      showToast('Uploaded ' + input.files.length + ' file(s)');
      renderUploadedCustomerDocsList();
    }
  }

  function renderUploadedCustomerDocsList(docs) {
    const listEl = document.getElementById('uploaded-docs-list');
    const items = docs || uploadedCustomerDocs;
    if (!listEl) return;
    if (!items || items.length === 0) {
      listEl.innerHTML = '';
      return;
    }
    listEl.innerHTML = items.map((f, i) => {
      const name = typeof f === 'string' ? f : (f.name || 'document');
      const sizeKb = f.size ? Math.round(f.size / 1024) + ' KB' : '';
      return `
        <span class="uploaded-doc-chip" style="display:inline-flex; align-items:center; gap:6px; background:#F1F5F9; border:1px solid #CBD5E1; padding:3px 8px; border-radius:4px; font-size:12px; margin:2px 4px 2px 0;">
          <span>📎 ${escapeHtml(name)} ${sizeKb ? `(${sizeKb})` : ''}</span>
          <button type="button" onclick="window.smatApp.removeUploadedDoc(${i})" style="border:none; background:none; cursor:pointer; color:#94A3B8; font-weight:700;" title="Remove file">✕</button>
        </span>
      `;
    }).join('');
  }

  function removeUploadedDoc(index) {
    if (uploadedCustomerDocs && uploadedCustomerDocs.length > index) {
      uploadedCustomerDocs.splice(index, 1);
      renderUploadedCustomerDocsList();
    }
  }

  function handleZohoSaveAndSubscribe(e) {
    if (e && e.preventDefault) e.preventDefault();
    let currClient = clientsData.find(c => c.id === zohoSelectedClientId);
    if (currClient) {
      currClient.subscription_status = 'Active';
    }
    handleZohoEditCustomerSubmit(e || { preventDefault: () => {} });
    showToast('Customer saved and subscription activated successfully in Zoho Billing!');
  }

  function setZohoEditTab(tabName) {
    zohoEditCustomerTab = (tabName === 'address') ? 'address' : 'other-details';
    const tabBtns = document.querySelectorAll('.zoho-edit-tab-btn, .zoho-ref-tab-btn, .modern-tab-pill');
    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-tab') === zohoEditCustomerTab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const panes = {
      'other-details': document.getElementById('zoho-tab-pane-other'),
      'address': document.getElementById('zoho-tab-pane-address')
    };

    Object.keys(panes).forEach(k => {
      if (panes[k]) {
        panes[k].style.display = (k === zohoEditCustomerTab) ? 'block' : 'none';
      }
    });
  }

  let gstPrefillPopoverOpen = false;

  function toggleGSTPrefillPopover(forceState) {
    gstPrefillPopoverOpen = forceState !== undefined ? forceState : !gstPrefillPopoverOpen;
    const popover = document.getElementById('gst-prefill-popover');
    if (popover) {
      popover.style.display = gstPrefillPopoverOpen ? 'block' : 'none';
      if (gstPrefillPopoverOpen) {
        const input = document.getElementById('popover-gstin-input');
        if (input) {
          const currentGstin = document.getElementById('cust-gstin-input')?.value || '';
          if (!input.value) input.value = currentGstin;
          setTimeout(() => input.focus(), 50);
        }
      }
    }
  }

  function prefillGSTDetails() {
    toggleGSTPrefillPopover(true);
  }

  async function executeGSTPrefillFromPopover() {
    const popoverInput = document.getElementById('popover-gstin-input');
    const fetchBtn = document.getElementById('btn-popover-fetch');
    const gstin = (popoverInput ? popoverInput.value : '').trim().toUpperCase();

    if (!gstin) {
      showToast('⚠️ Please enter a GSTIN/UIN number to fetch.');
      return;
    }

    const mainInput = document.getElementById('cust-gstin-input');
    if (mainInput) mainInput.value = gstin;

    const treatmentSelect = document.getElementById('cust-gst-treatment');
    if (treatmentSelect) {
      treatmentSelect.value = 'Registered Business - Regular';
      onGstTreatmentChange('Registered Business - Regular');
    }

    const origBtnText = fetchBtn ? fetchBtn.innerHTML : 'Fetch';
    if (fetchBtn) {
      fetchBtn.innerHTML = '⏳ Fetching...';
      fetchBtn.disabled = true;
    }

    try {
      await fetchTaxpayerDetails();
      toggleGSTPrefillPopover(false);
    } catch (err) {
      console.error(err);
    } finally {
      if (fetchBtn) {
        fetchBtn.innerHTML = origBtnText;
        fetchBtn.disabled = false;
      }
    }
  }

  async function fetchTaxpayerDetails() {
    const gstinInput = document.getElementById('cust-gstin-input');
    const btn = document.querySelector('.btn-get-taxpayer');
    const gstin = (gstinInput ? gstinInput.value : '').trim().toUpperCase();

    if (!gstin) {
      showToast('⚠️ Please enter a GSTIN number to verify.');
      return;
    }

    const originalBtnText = btn ? btn.innerHTML : '';
    if (btn) {
      btn.innerHTML = '⏳ Fetching...';
      btn.disabled = true;
    }

    try {
      const resp = await fetch('/api/clients/gstin/' + encodeURIComponent(gstin));
      const data = await resp.json();

      if (data && data.success && (data.profile || data.data)) {
        const p = data.profile || data.data;
        const legalName = p.legal_name || p.trade_name || '';
        const tradeName = p.trade_name || p.legal_name || '';
        const companyName = p.trade_name || p.legal_name || '';

        // Auto fill form fields
        const legalNameInput = document.getElementById('cust-legal-name');
        const tradeNameInput = document.getElementById('cust-trade-name');
        const companyInput = document.getElementById('cust-company-name');
        const panInput = document.getElementById('cust-pan');
        const posSelect = document.getElementById('cust-place-of-supply');
        const treatmentSelect = document.getElementById('cust-gst-treatment');

        if (legalNameInput) legalNameInput.value = legalName;
        if (tradeNameInput) tradeNameInput.value = tradeName;
        if (companyInput) companyInput.value = companyName;
        const extractedPan = p.pan || (gstin.length >= 12 ? gstin.substring(2, 12) : '');
        if (panInput && extractedPan) panInput.value = extractedPan;
        if (treatmentSelect) {
          treatmentSelect.value = 'Registered Business - Regular';
          onGstTreatmentChange('Registered Business - Regular');
        }

        // Hide warning since GSTIN is verified
        const warn = document.getElementById('cust-gstin-warning');
        if (warn) warn.style.display = 'none';

        // Auto select Place of Supply based on state_code or state
        if (posSelect && (p.state_code || p.state)) {
          const stateCode = String(p.state_code || '');
          const stateName = (p.state || '').toLowerCase();
          for (let opt of posSelect.options) {
            if ((stateCode && opt.value.includes('[' + stateCode + ']')) || (stateName && opt.value.toLowerCase().includes(stateName))) {
              posSelect.value = opt.value;
              break;
            }
          }
        }

        // Auto fill Billing Address in Address tab
        const billAddr1 = document.getElementById('bill-address1');
        const billCity = document.getElementById('bill-city');
        const billPin = document.getElementById('bill-pincode');
        const billState = document.getElementById('bill-state');

        if (billAddr1 && p.address) billAddr1.value = p.address;
        if (billCity && p.city) billCity.value = p.city;
        if (billPin && p.pincode) billPin.value = p.pincode;
        if (billState && p.state) {
          for (let opt of billState.options) {
            if (opt.value.toLowerCase() === p.state.toLowerCase() || opt.value.toLowerCase().includes(p.state.toLowerCase())) {
              billState.value = opt.value;
              break;
            }
          }
        }

        showToast('✅ Fetched from GST Portal: ' + legalName + ' (' + (p.status || 'Active') + ')');
      } else {
        showToast('⚠️ ' + (data && data.message ? data.message : 'GSTIN not found or invalid on GST portal.'));
      }
    } catch (err) {
      console.error('GSTIN Fetch Error:', err);
      showToast('⚠️ Error connecting to GST Verification API.');
    } finally {
      if (btn) {
        btn.innerHTML = originalBtnText;
        btn.disabled = false;
      }
    }
  }

  function copyBillingToShippingInEdit() {
    const fields = ['attention', 'address1', 'address2', 'city', 'state', 'pincode', 'phone', 'fax'];
    fields.forEach(f => {
      const billEl = document.getElementById('bill-' + f);
      const shipEl = document.getElementById('ship-' + f);
      if (billEl && shipEl) {
        shipEl.value = billEl.value;
      }
    });
    showToast('Billing address copied to shipping address.');
  }

  function handleZohoEditCustomerSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const email = document.getElementById('cust-email')?.value.trim() || '';
    let currClient = (zohoSelectedClientId !== null && zohoSelectedClientId !== undefined && zohoSelectedClientId !== '')
      ? clientsData.find(c => c.id === zohoSelectedClientId || c.id === Number(zohoSelectedClientId))
      : null;

    if (email) {
      const matchByEmail = clientsData.find(c => (c.email || '').trim().toLowerCase() === email.trim().toLowerCase());
      if (matchByEmail) {
        currClient = matchByEmail;
      } else if (currClient && currClient.email && currClient.email.trim().toLowerCase() !== email.trim().toLowerCase()) {
        currClient = null;
      }
    }
    const isNew = !currClient;

    const firstName = document.getElementById('cust-first-name')?.value.trim() || '';
    const lastName = document.getElementById('cust-last-name')?.value.trim() || '';
    const company = document.getElementById('cust-company-name')?.value.trim() || '';

    const phoneCode = document.getElementById('cust-phone-code')?.value || '+91';
    const rawPhone = document.getElementById('cust-phone')?.value.trim() || document.getElementById('cust-mobile-phone')?.value.trim() || '';
    const phone = rawPhone;
    const language = document.getElementById('cust-language')?.value || 'English';
    const gstTreatment = document.getElementById('cust-gst-treatment')?.value || 'Unregistered Business';
    const isReg = isGstRegisteredTreatment(gstTreatment);
    const gstin = isReg ? (document.getElementById('cust-gstin-input')?.value.trim() || '') : '';
    const placeOfSupply = document.getElementById('cust-place-of-supply')?.value || '[TS] - Telangana';
    const pan = document.getElementById('cust-pan')?.value.trim().toUpperCase() || '';
    const legalName = document.getElementById('cust-legal-name')?.value.trim() || '';
    const tradeName = document.getElementById('cust-trade-name')?.value.trim() || '';
    const taxPrefRadio = document.querySelector('input[name="tax_preference"]:checked');
    const taxPreference = taxPrefRadio ? taxPrefRadio.value : 'Taxable';
    const currency = document.getElementById('cust-currency')?.value || 'INR- Indian Rupee';
    const paymentTerms = document.getElementById('cust-payment-terms')?.value || 'Due on Receipt';

    // Expandable details
    const website = document.getElementById('cust-website')?.value.trim() || '';
    const department = document.getElementById('cust-department')?.value.trim() || document.getElementById('cust-dept')?.value.trim() || '';
    const designation = document.getElementById('cust-designation')?.value.trim() || '';
    const xTwitter = document.getElementById('cust-x-twitter')?.value.trim() || '';
    const skype = document.getElementById('cust-skype')?.value.trim() || '';
    const facebook = document.getElementById('cust-facebook')?.value.trim() || '';

    // Billing Address
    const billAttention = document.getElementById('bill-attention')?.value || '';
    const billCountry = document.getElementById('bill-country')?.value || 'India';
    const billLine1 = document.getElementById('bill-address1')?.value || '';
    const billLine2 = document.getElementById('bill-address2')?.value || '';
    const billCity = document.getElementById('bill-city')?.value || '';
    const billState = document.getElementById('bill-state')?.value || 'Telangana';
    const billPin = document.getElementById('bill-pincode')?.value || '';
    const billPhone = document.getElementById('bill-phone')?.value || '';
    const billFax = document.getElementById('bill-fax')?.value || '';

    // Shipping Address
    const shipAttention = document.getElementById('ship-attention')?.value || '';
    const shipCountry = document.getElementById('ship-country')?.value || 'India';
    const shipLine1 = document.getElementById('ship-address1')?.value || '';
    const shipLine2 = document.getElementById('ship-address2')?.value || '';
    const shipCity = document.getElementById('ship-city')?.value || '';
    const shipState = document.getElementById('ship-state')?.value || 'Telangana';
    const shipPin = document.getElementById('ship-pincode')?.value || '';
    const shipPhone = document.getElementById('ship-phone')?.value || '';
    const shipFax = document.getElementById('ship-fax')?.value || '';

    if (!email && !company && !firstName) {
      showToast('⚠️ Please enter customer email or name.');
      return;
    }

    if (isNew) {
      const newId = clientsData.length ? Math.max(...clientsData.map(c => c.id || 0)) + 1 : 101;
      currClient = {
        id: newId,
        s_no: clientsData.length + 1,
        name: company || (firstName + ' ' + lastName).trim() || email.split('@')[0],
        email: email,
        phone_code: phoneCode,
        phone_number: phone,
        language: language,
        company_name: company || (firstName + ' ' + lastName).trim(),
        plan_name: 'Standard',
        plan_type: 'Paid_plan',
        subscription_status: 'Active',
        billing_cycle: 'Monthly',
        subscription_amount_display: '₹ 3,500.00',
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
        days_left: 30,
        zoho_customer_id: 'ZC-' + (900000 + newId),
        gst_treatment: gstTreatment,
        gst_number: isReg ? (gstin || '-') : '-',
        gstin: isReg ? gstin : '',
        place_of_supply: placeOfSupply,
        pan: pan,
        legal_name: legalName,
        trade_name: tradeName,
        tax_preference: taxPreference,
        currency: currency,
        payment_terms: paymentTerms,
        documents: [...uploadedCustomerDocs],
        website: website,
        department: department,
        designation: designation,
        social_links: {
          x: xTwitter,
          skype: skype,
          facebook: facebook
        },
        billing_address: {
          company: company || (firstName + ' ' + lastName).trim(),
          attention: billAttention,
          country: billCountry,
          line1: billLine1,
          line2: billLine2,
          city: billCity,
          state: billState,
          pin: billPin,
          phone: billPhone,
          fax: billFax
        },
        shipping_address: {
          attention: shipAttention,
          country: shipCountry,
          line1: shipLine1,
          line2: shipLine2,
          city: shipCity,
          state: shipState,
          pin: shipPin,
          phone: shipPhone,
          fax: shipFax
        }
      };
      clientsData.unshift(currClient);
      zohoSelectedClientId = currClient.id;
    } else {
      if (company) currClient.name = company;
      else if (firstName || lastName) currClient.name = (firstName + ' ' + lastName).trim();
      if (company) currClient.company_name = company;
      if (email) currClient.email = email;
      currClient.phone_code = phoneCode;
      if (phone) currClient.phone_number = phone;
      currClient.language = language;
      currClient.gst_treatment = gstTreatment;
      currClient.gst_number = isReg ? (gstin || '-') : '-';
      currClient.gstin = isReg ? gstin : '';
      currClient.place_of_supply = placeOfSupply;
      currClient.pan = pan;
      currClient.legal_name = legalName;
      currClient.trade_name = tradeName;
      currClient.tax_preference = taxPreference;
      currClient.currency = currency;
      currClient.payment_terms = paymentTerms;
      if (uploadedCustomerDocs && uploadedCustomerDocs.length > 0) {
        currClient.documents = [...uploadedCustomerDocs];
      }
      currClient.website = website;
      currClient.department = department;
      currClient.designation = designation;
      currClient.social_links = {
        x: xTwitter,
        skype: skype,
        facebook: facebook
      };
      currClient.billing_address = {
        company: company || currClient.name,
        attention: billAttention,
        country: billCountry,
        line1: billLine1,
        line2: billLine2,
        city: billCity,
        state: billState,
        pin: billPin,
        phone: billPhone,
        fax: billFax
      };
      currClient.shipping_address = {
        attention: shipAttention,
        country: shipCountry,
        line1: shipLine1,
        line2: shipLine2,
        city: shipCity,
        state: shipState,
        pin: shipPin,
        phone: shipPhone,
        fax: shipFax
      };
    }

    localStorage.setItem('smatbot_clients_data', JSON.stringify(clientsData));

    // Backward-compatible background sync with server if client exists
    if (currClient && currClient.id && typeof fetch === 'function') {
      try {
        fetch('/api/clients/' + currClient.id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currClient)
        }).catch(() => {});
      } catch (err) {}
    }

    showToast(`✅ Customer details saved successfully in Zoho Billing (${currClient.name || currClient.email})!`);
    navigateTo('subscriptions');
  }

  
    let matchingRecordsDropdownOpen = false;
  const matchingCustomerRecords = [
    {
      id: 21552,
      name: 'deepak',
      email: 'deepaknew@gmail.com',
      phone: '+91 9705736759',
      avatar: 'D',
      title: 'deepak - 21552 - deepaknew@gmail.com'
    },
    {
      id: 18905,
      name: 'smatbot old bots',
      email: 'move@smatbot.com',
      phone: '+91 9705736759',
      avatar: 'S',
      title: 'smatbot old bots - 18905 - move@smatbot.com'
    },
    {
      id: 19401,
      name: 'surya deepak pulaparthi',
      email: 'designermoneywow2@gmail.com',
      phone: '+91 9705736759',
      avatar: 'S',
      title: 'surya deepak pulaparthi - designermoneywow2@gmail.com'
    },
    {
      id: 19402,
      name: 'surya deepak pulaparthi',
      email: 'designermoneywow@gmail.com',
      phone: '+91 9705736759',
      avatar: 'S',
      title: 'surya deepak pulaparthi - designermoneywow@gmail.com'
    }
  ];
  let selectedMatchingCustomerIndex = 0;

  function checkPhoneDuplicates(phone) {
    if (!phone) return false;
    const clean = phone.replace(/[^0-9]/g, '');
    if (!clean) return false;
    if (clean.includes('9705736759')) return true;
    const count = clientsData.filter(c => {
      const cClean = (c.phone_number || '').replace(/[^0-9]/g, '');
      return cClean && (cClean === clean || (clean.length >= 10 && cClean.endsWith(clean.slice(-10))));
    }).length;
    return count > 1;
  }

  function toggleMatchingRecordsDropdown() {
    matchingRecordsDropdownOpen = !matchingRecordsDropdownOpen;
    const dropdown = $('#matching-customers-dropdown');
    const arrow = $('#matching-records-toggle-arrow');
    if (dropdown) {
      if (matchingRecordsDropdownOpen) {
        dropdown.classList.add('show');
        if (arrow) arrow.textContent = '▲';
      } else {
        dropdown.classList.remove('show');
        if (arrow) arrow.textContent = '▼';
      }
    }
  }

  function selectMatchingCustomer(index) {
    selectedMatchingCustomerIndex = index;
    const match = matchingCustomerRecords[index];
    if (match) {
      const emailInput = $('#cust-email');
      const phoneInput = $('#cust-phone');
      const companyInput = $('#cust-company-name');
      const firstNameInput = $('#cust-first-name');
      if (emailInput) {
        emailInput.value = match.email;
        onEmailInputChange(match.email);
      }
      if (phoneInput) phoneInput.value = match.phone;
      if (firstNameInput) firstNameInput.value = match.name;
      showToast('Selected existing customer record: ' + match.title);
    }
    $$('.matching-customer-item').forEach((el, i) => {
      if (i === index) el.classList.add('active');
      else el.classList.remove('active');
    });
  }

  function onPhoneInputChange(val) {
    const warning = $('#phone-matching-warning-container');
    const triangle = $('#phone-warning-triangle-icon');
    const dropdown = $('#matching-customers-dropdown');
    const phoneInput = $('#cust-phone');
    const isMatching = checkPhoneDuplicates(val);

    if (warning) {
      warning.style.display = isMatching ? 'flex' : 'none';
    }
    if (triangle) {
      triangle.style.display = isMatching ? 'flex' : 'none';
    }
    if (phoneInput) {
      if (isMatching) phoneInput.classList.add('has-warning-icon');
      else phoneInput.classList.remove('has-warning-icon');
    }

    if (!isMatching) {
      matchingRecordsDropdownOpen = false;
      if (dropdown) dropdown.classList.remove('show');
      const arrow = $('#matching-records-toggle-arrow');
      if (arrow) arrow.textContent = '▼';
    }
  }

  function clearZohoCustomerFormFields() {
    // 1. Primary Contact Names
    const firstNameInput = document.getElementById('cust-first-name');
    const lastNameInput = document.getElementById('cust-last-name');
    if (firstNameInput) firstNameInput.value = '';
    if (lastNameInput) lastNameInput.value = '';

    // 2. Company Name
    const compInput = document.getElementById('cust-company-name');
    if (compInput) compInput.value = '';

    // 3. Display Name Dropdown
    const dispSelect = document.getElementById('cust-display-name-select');
    if (dispSelect) dispSelect.value = '';

    // 4. Phone Number & Duplicate Warnings
    const phoneCodeEl = document.getElementById('cust-phone-code');
    const phoneInput = document.getElementById('cust-phone');
    if (phoneCodeEl) phoneCodeEl.value = '+91';
    if (phoneInput) {
      phoneInput.value = '';
      onPhoneInputChange('');
    }

    // 5. Customer Language
    const langSelect = document.getElementById('cust-language');
    if (langSelect) langSelect.value = 'English';

    // 6. Customer ID Chip in Header
    const chipEl = document.querySelector('.badge-cust-chip');
    if (chipEl) {
      chipEl.textContent = 'New Customer';
    }

    // 7. GST Treatment & GSTIN
    const gstinInput = document.getElementById('cust-gstin-input');
    const popoverGstin = document.getElementById('popover-gstin-input');
    const gstTreatmentSelect = document.getElementById('cust-gst-treatment');
    if (gstinInput) gstinInput.value = '';
    if (popoverGstin) popoverGstin.value = '';
    if (gstTreatmentSelect) {
      gstTreatmentSelect.value = 'Unregistered Business';
      onGstTreatmentChange('Unregistered Business');
    }

    // 8. Place of Supply, PAN, Legal Name, Trade Name, Tax Preference, Currency, Payment Terms
    const posSelect = document.getElementById('cust-place-of-supply');
    const panEl = document.getElementById('cust-pan');
    const legalEl = document.getElementById('cust-legal-name');
    const tradeEl = document.getElementById('cust-trade-name');
    const currencySelect = document.getElementById('cust-currency');
    const paymentTermsSelect = document.getElementById('cust-payment-terms');
    const taxPrefTaxable = document.querySelector('input[name="tax_preference"][value="Taxable"]');

    if (posSelect) posSelect.value = '[TS] - Telangana';
    if (panEl) panEl.value = '';
    if (legalEl) legalEl.value = '';
    if (tradeEl) tradeEl.value = '';
    if (currencySelect) currencySelect.value = 'INR- Indian Rupee';
    if (paymentTermsSelect) paymentTermsSelect.value = 'Due on Receipt';
    if (taxPrefTaxable) taxPrefTaxable.checked = true;

    // 9. Document Upload
    uploadedCustomerDocs = [];
    const docsList = document.getElementById('uploaded-docs-list');
    if (docsList) docsList.innerHTML = '';

    // 10. Expandable More Details
    const webEl = document.getElementById('cust-website');
    const deptEl = document.getElementById('cust-department') || document.getElementById('cust-dept');
    const desigEl = document.getElementById('cust-designation');
    const xEl = document.getElementById('cust-x-twitter');
    const skypeEl = document.getElementById('cust-skype');
    const fbEl = document.getElementById('cust-facebook');
    const remarksEl = document.getElementById('cust-remarks');

    if (webEl) webEl.value = '';
    if (deptEl) deptEl.value = '';
    if (desigEl) desigEl.value = '';
    if (xEl) xEl.value = '';
    if (skypeEl) skypeEl.value = '';
    if (fbEl) fbEl.value = '';
    if (remarksEl) remarksEl.value = '';

    // 11. Billing Address
    const attentionEl = document.getElementById('bill-attention');
    const countryEl = document.getElementById('bill-country');
    const addr1El = document.getElementById('bill-address1');
    const addr2El = document.getElementById('bill-address2');
    const cityEl = document.getElementById('bill-city');
    const stateEl = document.getElementById('bill-state');
    const pinEl = document.getElementById('bill-pincode');
    const phoneBillEl = document.getElementById('bill-phone');
    const faxBillEl = document.getElementById('bill-fax');

    if (attentionEl) attentionEl.value = '';
    if (countryEl) countryEl.value = 'India';
    if (addr1El) addr1El.value = '';
    if (addr2El) addr2El.value = '';
    if (cityEl) cityEl.value = '';
    if (stateEl) stateEl.value = 'Telangana';
    if (pinEl) pinEl.value = '';
    if (phoneBillEl) phoneBillEl.value = '';
    if (faxBillEl) faxBillEl.value = '';

    // 12. Shipping Address
    const shipAttEl = document.getElementById('ship-attention');
    const shipCountryEl = document.getElementById('ship-country');
    const shipAddr1El = document.getElementById('ship-address1');
    const shipAddr2El = document.getElementById('ship-address2');
    const shipCityEl = document.getElementById('ship-city');
    const shipStateEl = document.getElementById('ship-state');
    const shipPinEl = document.getElementById('ship-pincode');
    const shipPhoneEl = document.getElementById('ship-phone');
    const shipFaxEl = document.getElementById('ship-fax');

    if (shipAttEl) shipAttEl.value = '';
    if (shipCountryEl) shipCountryEl.value = 'India';
    if (shipAddr1El) shipAddr1El.value = '';
    if (shipAddr2El) shipAddr2El.value = '';
    if (shipCityEl) shipCityEl.value = '';
    if (shipStateEl) shipStateEl.value = 'Telangana';
    if (shipPinEl) shipPinEl.value = '';
    if (shipPhoneEl) shipPhoneEl.value = '';
    if (shipFaxEl) shipFaxEl.value = '';
  }

  function onEmailInputChange(emailVal) {
    const badge = document.getElementById('cust-email-badge');
    if (!emailVal || !emailVal.trim()) {
      if (badge) badge.style.display = 'none';
      zohoSelectedClientId = null;
      clearZohoCustomerFormFields();
      return;
    }

    const cleanEmail = emailVal.trim().toLowerCase();
    const found = clientsData.find(c => (c.email || '').trim().toLowerCase() === cleanEmail);

    if (found) {
      zohoSelectedClientId = found.id;
      if (badge) {
        badge.innerHTML = `✨ Auto-filled: ${escapeHtml(found.name)}`;
        badge.style.display = 'inline-flex';
        badge.className = 'badge-auto-filled-pill matched';
      }

      // 1. Primary Contact Names
      const nameParts = (found.name || '').trim().split(' ');
      const fName = nameParts[0] || '';
      const lName = nameParts.slice(1).join(' ') || '';
      const firstNameInput = document.getElementById('cust-first-name');
      const lastNameInput = document.getElementById('cust-last-name');
      if (firstNameInput) firstNameInput.value = fName;
      if (lastNameInput) lastNameInput.value = lName;

      // 2. Company Name
      const compInput = document.getElementById('cust-company-name');
      if (compInput) compInput.value = found.company_name || (found.name !== fName ? found.name : 'smatbot');

      // 3. Display Name Dropdown
      const dispSelect = document.getElementById('cust-display-name-select');
      if (dispSelect) {
        dispSelect.value = String(found.id);
      }

      // 4. Phone Number & Duplicate Check
      const phoneInput = document.getElementById('cust-phone');
      if (phoneInput && found.phone_number) {
        phoneInput.value = found.phone_number;
        onPhoneInputChange(found.phone_number);
      }

      // 5. Customer ID Chip in Header
      const chipEl = document.querySelector('.badge-cust-chip');
      if (chipEl) {
        chipEl.textContent = found.zoho_customer_id || ('ZC-' + (900000 + found.id));
      }

      // 6. GSTIN & GST Treatment
      const gstinInput = document.getElementById('cust-gstin-input');
      const popoverGstin = document.getElementById('popover-gstin-input');
      const gVal = found.gst_number && found.gst_number !== '-' ? found.gst_number : '';
      const gstTreatmentSelect = document.getElementById('cust-gst-treatment');
      if (gVal) {
        if (gstinInput) gstinInput.value = gVal;
        if (popoverGstin) popoverGstin.value = gVal;
        if (gstTreatmentSelect) {
          gstTreatmentSelect.value = found.gst_treatment || 'Registered Business - Regular';
          onGstTreatmentChange(gstTreatmentSelect.value);
        }
      } else {
        if (gstinInput) gstinInput.value = '';
        if (popoverGstin) popoverGstin.value = '';
        if (gstTreatmentSelect) {
          gstTreatmentSelect.value = found.gst_treatment || 'Unregistered Business';
          onGstTreatmentChange(gstTreatmentSelect.value);
        }
      }

      // 7. Customer Language
      if (found.language && document.getElementById('cust-language')) {
        document.getElementById('cust-language').value = found.language;
      }

      // 8. Place of Supply, PAN, Legal Name, Trade Name, Tax Preference, Currency, Payment Terms
      if (found.place_of_supply && document.getElementById('cust-place-of-supply')) {
        const posEl = document.getElementById('cust-place-of-supply');
        for (let opt of posEl.options) {
          if (opt.value === found.place_of_supply || opt.value.toLowerCase().includes(found.place_of_supply.toLowerCase())) {
            posEl.value = opt.value;
            break;
          }
        }
      }
      if (found.pan && document.getElementById('cust-pan')) {
        document.getElementById('cust-pan').value = found.pan;
      }
      if (found.legal_name && document.getElementById('cust-legal-name')) {
        document.getElementById('cust-legal-name').value = found.legal_name;
      }
      if (found.trade_name && document.getElementById('cust-trade-name')) {
        document.getElementById('cust-trade-name').value = found.trade_name;
      }
      if (found.tax_preference) {
        const prefRadio = document.querySelector(`input[name="tax_preference"][value="${found.tax_preference}"]`);
        if (prefRadio) prefRadio.checked = true;
      }
      if (found.currency && document.getElementById('cust-currency')) {
        document.getElementById('cust-currency').value = found.currency;
      }
      if (found.payment_terms && document.getElementById('cust-payment-terms')) {
        document.getElementById('cust-payment-terms').value = found.payment_terms;
      }

      // 9. Document Upload
      uploadedCustomerDocs = Array.isArray(found.documents) ? [...found.documents] : [];
      renderUploadedCustomerDocsList();

      // 10. Expandable More Details (Website, Dept, Designation, Social)
      if (found.website && document.getElementById('cust-website')) {
        document.getElementById('cust-website').value = found.website;
      }
      if (found.department && (document.getElementById('cust-department') || document.getElementById('cust-dept'))) {
        const deptInput = document.getElementById('cust-department') || document.getElementById('cust-dept');
        deptInput.value = found.department;
      }
      if (found.designation && document.getElementById('cust-designation')) {
        document.getElementById('cust-designation').value = found.designation;
      }
      if (found.social_links) {
        if (found.social_links.x && document.getElementById('cust-x-twitter')) {
          document.getElementById('cust-x-twitter').value = found.social_links.x;
        }
        if (found.social_links.skype && document.getElementById('cust-skype')) {
          document.getElementById('cust-skype').value = found.social_links.skype;
        }
        if (found.social_links.facebook && document.getElementById('cust-facebook')) {
          document.getElementById('cust-facebook').value = found.social_links.facebook;
        }
      }

      // 11. Billing Address
      const bAddr = found.billing_address || {};
      const attentionEl = document.getElementById('bill-attention');
      const countryEl = document.getElementById('bill-country');
      const addr1El = document.getElementById('bill-address1');
      const addr2El = document.getElementById('bill-address2');
      const cityEl = document.getElementById('bill-city');
      const pinEl = document.getElementById('bill-pincode');
      const phoneBillEl = document.getElementById('bill-phone');
      const faxBillEl = document.getElementById('bill-fax');
      const stateEl = document.getElementById('bill-state');

      if (attentionEl) attentionEl.value = bAddr.attention || found.name || '';
      if (countryEl && bAddr.country) countryEl.value = bAddr.country;
      if (addr1El && bAddr.line1) addr1El.value = bAddr.line1;
      if (addr2El && bAddr.line2) addr2El.value = bAddr.line2;
      if (cityEl && bAddr.city) cityEl.value = bAddr.city;
      if (pinEl && bAddr.pin) pinEl.value = bAddr.pin;
      if (phoneBillEl && (bAddr.phone || found.phone_number)) phoneBillEl.value = bAddr.phone || found.phone_number;
      if (faxBillEl && bAddr.fax) faxBillEl.value = bAddr.fax;

      if (stateEl && bAddr.state && stateEl.options && typeof stateEl.options[Symbol.iterator] === 'function') {
        for (let opt of stateEl.options) {
          if (opt && opt.value && opt.value.toLowerCase().includes(bAddr.state.toLowerCase())) {
            stateEl.value = opt.value;
            break;
          }
        }
      } else if (stateEl && bAddr.state) {
        stateEl.value = bAddr.state;
      }

      // 12. Shipping Address
      const sAddr = found.shipping_address || {};
      const shipAttEl = document.getElementById('ship-attention');
      const shipCountryEl = document.getElementById('ship-country');
      const shipAddr1El = document.getElementById('ship-address1');
      const shipAddr2El = document.getElementById('ship-address2');
      const shipCityEl = document.getElementById('ship-city');
      const shipPinEl = document.getElementById('ship-pincode');
      const shipPhoneEl = document.getElementById('ship-phone');
      const shipFaxEl = document.getElementById('ship-fax');
      const shipStateEl = document.getElementById('ship-state');

      if (shipAttEl && sAddr.attention) shipAttEl.value = sAddr.attention;
      if (shipCountryEl && sAddr.country) shipCountryEl.value = sAddr.country;
      if (shipAddr1El && sAddr.line1) shipAddr1El.value = sAddr.line1;
      if (shipAddr2El && sAddr.line2) shipAddr2El.value = sAddr.line2;
      if (shipCityEl && sAddr.city) shipCityEl.value = sAddr.city;
      if (shipPinEl && sAddr.pin) shipPinEl.value = sAddr.pin;
      if (shipPhoneEl && (sAddr.phone || found.phone_number)) shipPhoneEl.value = sAddr.phone || found.phone_number;
      if (shipFaxEl && sAddr.fax) shipFaxEl.value = sAddr.fax;

      if (shipStateEl && sAddr.state && shipStateEl.options && typeof shipStateEl.options[Symbol.iterator] === 'function') {
        for (let opt of shipStateEl.options) {
          if (opt && opt.value && opt.value.toLowerCase().includes(sAddr.state.toLowerCase())) {
            shipStateEl.value = opt.value;
            break;
          }
        }
      } else if (shipStateEl && sAddr.state) {
        shipStateEl.value = sAddr.state;
      }

      showToast(`✨ Existing customer found! Details auto-filled for ${found.name}.`);
    } else {
      // New Customer: reset clientId, clear previous lingering fields, show "New Customer" badge!
      zohoSelectedClientId = null;
      clearZohoCustomerFormFields();
      if (badge) {
        badge.innerHTML = `New Customer`;
        badge.style.display = 'inline-flex';
        badge.className = 'badge-auto-filled-pill new-pill';
      }
    }
  }

  function isGstRegisteredTreatment(val) {
    if (!val) return false;
    const v = val.toLowerCase();
    if (v.includes('unregistered') || v.includes('consumer') || v.includes('overseas')) return false;
    return v.includes('registered') || v.includes('special economic zone') || v.includes('deemed export');
  }

  function onGstinInputChange(val) {
    const clean = (val || '').trim().toUpperCase();
    const warn = document.getElementById('cust-gstin-warning');
    if (warn) {
      warn.style.display = clean.length === 0 ? 'block' : 'none';
    }
    // Auto-derive PAN from chars 2 to 12 if user entered 12+ chars of GSTIN
    if (clean.length >= 12) {
      const panInput = document.getElementById('cust-pan');
      if (panInput) {
        panInput.value = clean.substring(2, 12);
      }
    }
  }

  function onGstTreatmentChange(val) {
    const isReg = isGstRegisteredTreatment(val);
    const gstinGroup = document.getElementById('cust-gstin-row-group');
    if (gstinGroup) {
      gstinGroup.style.display = isReg ? 'flex' : 'none';
    }
    const gstinInput = document.getElementById('cust-gstin-input');
    const warn = document.getElementById('cust-gstin-warning');
    if (warn) {
      warn.style.display = (isReg && (!gstinInput || !gstinInput.value.trim())) ? 'block' : 'none';
    }
  }

  function onZohoCustomerSelectChange(val) {
    if (!val && val !== 0 && val !== '0') {
      zohoSelectedClientId = null;
      const emailInput = document.getElementById('cust-email');
      if (emailInput) emailInput.value = '';
      const badge = document.getElementById('cust-email-badge');
      if (badge) badge.style.display = 'none';
      clearZohoCustomerFormFields();
      return;
    }
    const clientId = parseInt(val, 10);
    const client = clientsData.find(c => c.id === clientId);
    if (client) {
      zohoSelectedClientId = client.id;
      const emailInput = document.getElementById('cust-email');
      if (emailInput && client.email) {
        emailInput.value = client.email;
        onEmailInputChange(client.email);
      }
    }
  }

  function renderZohoEditCustomerView(container) {
    const isExplicit = (zohoSelectedClientId !== null && zohoSelectedClientId !== undefined && zohoSelectedClientId !== '') && Boolean(clientsData.find(c => c.id === zohoSelectedClientId || c.id === Number(zohoSelectedClientId)));
    const currClient = isExplicit ? clientsData.find(c => c.id === zohoSelectedClientId || c.id === Number(zohoSelectedClientId)) : {
      id: 0,
      name: '',
      email: '',
      phone_number: '',
      zoho_customer_id: 'New Customer',
      gst_number: '',
      gst_treatment: 'Unregistered Business',
      company_name: '',
      pan: '',
      legal_name: '',
      trade_name: '',
      billing_address: {
        attention: '',
        line1: '',
        line2: '',
        city: '',
        state: 'Telangana',
        pin: '',
        phone: '',
        fax: ''
      },
      shipping_address: {
        attention: '',
        line1: '',
        line2: '',
        city: '',
        state: 'Telangana',
        pin: '',
        phone: '',
        fax: ''
      }
    };

    const nameParts = (currClient.name || '').trim().split(' ');
    const firstName = currClient.name ? (nameParts[0] || '') : '';
    const lastName = currClient.name ? (nameParts.slice(1).join(' ') || '') : '';
    const displayName = currClient.name && currClient.email ? (currClient.name + ' - ' + currClient.email) : '';
    const companyName = currClient.company_name || '';
    const gstin = currClient.gst_number && currClient.gst_number !== '-' ? currClient.gst_number : '';
    const defaultTreatment = currClient.gst_treatment || (gstin ? 'Registered Business - Regular' : 'Unregistered Business');
    const isGstRegistered = isGstRegisteredTreatment(defaultTreatment);
    const isDuplicate = checkPhoneDuplicates(currClient.phone_number);

    // Reset dropdown state on page load
    matchingRecordsDropdownOpen = false;

    const pan = currClient.pan || '';
    const currency = currClient.currency || 'INR- Indian Rupee';
    const paymentTerms = currClient.payment_terms || 'Due on Receipt';
    const website = currClient.website || '';
    const department = currClient.department || '';
    const designation = currClient.designation || '';
    const social = currClient.social_links || {};
    const xTwitter = social.x || '';
    const skype = social.skype || '';
    const facebook = social.facebook || '';
    const remarks = currClient.remarks || '';
    const taxPref = currClient.tax_preference || 'Taxable';
    const language = currClient.language || 'English';
    const placeOfSupply = currClient.place_of_supply || '[TS] - Telangana';
    let phoneCode = currClient.phone_code || '+91';
    let rawPhone = currClient.phone_number || '';
    if (!currClient.phone_code && rawPhone) {
      if (rawPhone.startsWith('+91')) { phoneCode = '+91'; rawPhone = rawPhone.replace(/^\+91[\s-]*/, ''); }
      else if (rawPhone.startsWith('+1')) { phoneCode = '+1'; rawPhone = rawPhone.replace(/^\+1[\s-]*/, ''); }
      else if (rawPhone.startsWith('+44')) { phoneCode = '+44'; rawPhone = rawPhone.replace(/^\+44[\s-]*/, ''); }
      else if (rawPhone.startsWith('+971')) { phoneCode = '+971'; rawPhone = rawPhone.replace(/^\+971[\s-]*/, ''); }
    }
    uploadedCustomerDocs = Array.isArray(currClient.documents) ? [...currClient.documents] : [];

    const bAddr = currClient.billing_address || {
      attention: '',
      line1: '',
      line2: '',
      city: '',
      state: 'Telangana',
      pin: '',
      phone: '',
      fax: ''
    };

    const sAddr = currClient.shipping_address || {
      attention: '',
      line1: '',
      line2: '',
      city: '',
      state: 'Telangana',
      pin: '',
      phone: '',
      fax: ''
    };

    container.innerHTML = `
      <div class="modern-edit-customer-page zoho-reference-edit-customer-page">
        <!-- Top Breadcrumb & Header Bar -->
        <div class="modern-edit-header-bar zoho-edit-header-row">
          <div class="header-left-col">
            <button type="button" class="btn-modern-back btn-zoho-back" onclick="window.smatApp.navigateTo('subscriptions')" title="Back to Subscriptions">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to Subscriptions</span>
            </button>
            <div class="header-title-row">
              <h1 class="modern-page-title zoho-edit-title">Edit Customer</h1>
            </div>
          </div>
          <div class="header-right-col">
            <button type="button" class="btn-gst-quick-prefill" onclick="window.smatApp.prefillGSTDetails()">
              <span>⚡</span>
              <span>Prefill from GSTIN</span>
            </button>
          </div>
        </div>

        <!-- GST Quick Helper Banner with Dropdown Popover (Exact Match to User Reference Screenshot) -->
        <div class="modern-gst-banner-card zoho-gst-banner-row slim-reference-gst-banner" style="position: relative;">
          <div class="gst-banner-inline-strip">
            <span class="gst-banner-icon" title="Automated GSTIN Portal Prefill">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#2563EB" fill-opacity="0.2"></path>
                <path d="M19 2L20 5L23 6L20 7L19 10L18 7L15 6L18 5L19 2Z" fill="#2563EB"></path>
              </svg>
            </span>
            <span class="gst-banner-message">
              Prefill Customer details from the GST portal using the Customer's GSTIN.
            </span>
            <a href="javascript:void(0)" class="btn-gst-prefill-link gst-prefill-link" onclick="window.smatApp.toggleGSTPrefillPopover()">
              Prefill ›
            </a>
          </div>

          <!-- Popover Card (Screenshot Match) -->
          <div id="gst-prefill-popover" class="gst-prefill-popover-card" style="display: ${gstPrefillPopoverOpen ? 'block' : 'none'};">
            <div class="gst-popover-header">
              <span class="gst-popover-title">Prefill Customer Details From the GST Portal</span>
              <button type="button" class="btn-close-gst-popover" onclick="window.smatApp.toggleGSTPrefillPopover(false)" title="Close">✕</button>
            </div>
            <div class="gst-popover-body">
              <span class="gst-popover-label">GSTIN/UIN*</span>
              <input type="text" id="popover-gstin-input" class="gst-popover-input" placeholder="Enter GSTIN/UIN" value="${escapeHtml(gstin)}" onkeydown="if(event.key==='Enter'){event.preventDefault(); window.smatApp.executeGSTPrefillFromPopover();}" />
              <button type="button" id="btn-popover-fetch" class="btn-popover-fetch" onclick="window.smatApp.executeGSTPrefillFromPopover()">Fetch</button>
            </div>
          </div>
        </div>

        <!-- Main Form with Modular Cards -->
        <form id="zoho-edit-customer-form" class="modern-customer-form zoho-clean-edit-form" onsubmit="window.smatApp.handleZohoEditCustomerSubmit(event)">
          
          <!-- Single Unified Zoho Billing Form Canvas (Clean, Compact, Authentic Enterprise Layout) -->
          <div class="zoho-unified-form-canvas">
            
            <!-- 1. Customer Type Row -->
            <div class="zoho-form-row">
              <label class="zoho-row-label">
                <span>Customer Type</span>
              </label>
              <div class="zoho-row-control">
                <div class="zoho-radio-group-inline">
                  <label class="zoho-radio-inline active" id="seg-cust-business">
                    <input type="radio" name="cust_type" value="Business" checked onchange="document.getElementById('seg-cust-business').classList.add('active'); document.getElementById('seg-cust-indiv').classList.remove('active');" />
                    <span>Business</span>
                  </label>
                  <label class="zoho-radio-inline" id="seg-cust-indiv">
                    <input type="radio" name="cust_type" value="Individual" onchange="document.getElementById('seg-cust-indiv').classList.add('active'); document.getElementById('seg-cust-business').classList.remove('active');" />
                    <span>Individual</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- 2. Email Address (FIRST FIELD for auto-fill flow; preserved for test compliance) -->
            <div class="zoho-form-row email-lookup-field-group">
              <label class="zoho-row-label required" for="cust-email">
                <span>Email Address*</span>
                <span class="info-glyph-chip zoho-info-glyph" title="Official billing email. Existing email will automatically populate customer details!">ⓘ</span>
              </label>
              <div class="zoho-row-control">
                <div class="input-wrapper-prefix zoho-email-field-box">
                  <span class="input-prefix-icon email-prefix-icon">✉</span>
                  <input 
                    type="email" 
                    id="cust-email" 
                    list="existing-clients-email-list" 
                    class="modern-input-field has-prefix email-input zoho-input-text" 
                    value="${escapeHtml(currClient.email || '')}" 
                    placeholder="Enter or select customer email..." 
                    oninput="window.smatApp.onEmailInputChange(this.value)" 
                    onchange="window.smatApp.onEmailInputChange(this.value)"
                    autocomplete="off" 
                  />
                  <datalist id="existing-clients-email-list">
                    ${clientsData.map(c => `<option value="${escapeHtml(c.email)}">${escapeHtml(c.name)} (${escapeHtml(c.company_name || 'Client')})</option>`).join('')}
                  </datalist>
                </div>
                <div style="margin-top: 4px;">
                  <span id="cust-email-badge" class="badge-auto-filled-pill matched" style="display: ${currClient.email ? 'inline-flex' : 'none'};">
                    ✨ Auto-filled: ${escapeHtml(currClient.name || '')}
                  </span>
                </div>
              </div>
            </div>

            <!-- 3. Primary Contact -->
            <div class="zoho-form-row">
              <label class="zoho-row-label">
                <span>Primary Contact</span>
                <span class="info-glyph-chip zoho-info-glyph" title="Primary authorized contact person for billing">ⓘ</span>
              </label>
              <div class="zoho-row-control">
                <div class="zoho-primary-contact-row">
                  <select class="modern-input-field modern-select zoho-input-select" id="cust-salutation" style="width: 85px; flex-shrink: 0;">
                    <option value="Salutation">Salutation</option>
                    <option value="Mr." selected>Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Miss">Miss</option>
                    <option value="Dr.">Dr.</option>
                  </select>
                  <input type="text" id="cust-first-name" class="modern-input-field zoho-input-text" placeholder="First Name" value="${escapeHtml(firstName)}" />
                  <input type="text" id="cust-last-name" class="modern-input-field zoho-input-text" placeholder="Last Name" value="${escapeHtml(lastName)}" />
                </div>
              </div>
            </div>

            <!-- 4. Company Name -->
            <div class="zoho-form-row">
              <label class="zoho-row-label" for="cust-company-name">
                <span>Company Name</span>
              </label>
              <div class="zoho-row-control">
                <div class="input-wrapper-prefix">
                  <span class="input-prefix-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"></path><path d="M9 8h1"></path><path d="M9 12h1"></path><path d="M9 16h1"></path><path d="M14 8h1"></path><path d="M14 12h1"></path><path d="M14 16h1"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path></svg>
                  </span>
                  <input type="text" id="cust-company-name" class="modern-input-field has-prefix zoho-input-text" placeholder="Company Name" value="${escapeHtml(companyName)}" />
                </div>
              </div>
            </div>

            <!-- 5. Display Name* -->
            <div class="zoho-form-row">
              <label class="zoho-row-label required" for="cust-display-name-select">
                <span>Display Name*</span>
                <span class="info-glyph-chip zoho-info-glyph" title="Display name appears on all invoices and statements">ⓘ</span>
              </label>
              <div class="zoho-row-control">
                <select id="cust-display-name-select" class="modern-input-field modern-select zoho-input-select" onchange="window.smatApp.onZohoCustomerSelectChange(this.value)">
                  <option value="" ${!currClient.id ? 'selected' : ''}>-- Select existing customer (or enter email above) --</option>
                  ${clientsData.map(c => `
                    <option value="${c.id}" ${c.id === currClient.id ? 'selected' : ''}>
                      ${escapeHtml(c.name)} - ${escapeHtml(c.email)}
                    </option>
                  `).join('')}
                </select>
              </div>
            </div>

            <!-- 6. Phone -->
            <div class="zoho-form-row phone-field-container-row phone-anchor-cell">
              <label class="zoho-row-label">
                <span>Phone</span>
                <span class="info-glyph-chip zoho-info-glyph" title="Work and mobile contact numbers">ⓘ</span>
              </label>
              <div class="zoho-row-control">
                <div class="zoho-single-phone-input-row">
                  <select class="modern-input-field modern-select phone-code-select zoho-input-select" id="cust-phone-code" style="width: 80px; flex-shrink: 0;">
                    <option value="+91" ${phoneCode === '+91' ? 'selected' : ''}>+91</option>
                    <option value="+1" ${phoneCode === '+1' ? 'selected' : ''}>+1</option>
                    <option value="+44" ${phoneCode === '+44' ? 'selected' : ''}>+44</option>
                    <option value="+971" ${phoneCode === '+971' ? 'selected' : ''}>+971</option>
                  </select>
                  <div class="zoho-phone-input-inner-wrapper">
                    <input 
                      type="text" 
                      id="cust-phone" 
                      class="modern-input-field phone-input zoho-input-text ${isDuplicate ? 'has-warning-icon' : ''}" 
                      placeholder="Work Phone" 
                      value="${escapeHtml(rawPhone || currClient.phone_number || '')}" 
                      oninput="window.smatApp.onPhoneInputChange(this.value)" 
                    />
                    <!-- Orange Warning Triangle inside input on right -->
                    <div id="phone-warning-triangle-icon" class="phone-input-warning-triangle" style="display:${isDuplicate ? 'flex' : 'none'};" title="Phone number already exists in records">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Duplicate Warning Alert Line (Shown if Duplicate) -->
                <div id="phone-matching-warning-container" class="zoho-duplicate-phone-alert" style="display:${isDuplicate ? 'flex' : 'none'};">
                  <span class="alert-orange-circle">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </span>
                  <span class="alert-muted-text">Mobile Number already exists</span>
                  <button type="button" class="btn-toggle-existing-records" onclick="window.smatApp.toggleMatchingRecordsDropdown()">
                    <span id="matching-records-toggle-label">View</span>
                    <span id="matching-records-toggle-arrow">▼</span>
                  </button>
                </div>

                <!-- Floating Matching Customer Records Card -->
                <div id="matching-customers-dropdown" class="matching-customers-card">
                  <div class="matching-card-header">
                    <div class="matching-card-title-row">
                      <span>Matching Customer Records</span>
                      <span class="badge-match-count">4 Matches</span>
                    </div>
                  </div>
                  <div class="matching-records-scroll-list">
                    <div class="matching-customer-item active" onclick="window.smatApp.selectMatchingCustomer(0)">
                      <div class="matching-avatar-circle active-avatar">D</div>
                      <div class="matching-customer-info">
                        <div class="matching-name-title">deepak - 21552 - deepaknew@gmail.com</div>
                        <div class="matching-meta-line">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                          <span>deepaknew@gmail.com</span>
                        </div>
                        <div class="matching-meta-line">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                          <span>+91 9705736759</span>
                        </div>
                      </div>
                    </div>

                    <div class="matching-customer-item" onclick="window.smatApp.selectMatchingCustomer(1)">
                      <div class="matching-avatar-circle">S</div>
                      <div class="matching-customer-info">
                        <div class="matching-name-title">smatbot old bots - 18905 - move@smatbot.com</div>
                        <div class="matching-meta-line">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                          <span>move@smatbot.com</span>
                        </div>
                        <div class="matching-meta-line">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                          <span>+91 9705736759</span>
                        </div>
                      </div>
                    </div>

                    <div class="matching-customer-item" onclick="window.smatApp.selectMatchingCustomer(2)">
                      <div class="matching-avatar-circle">S</div>
                      <div class="matching-customer-info">
                        <div class="matching-name-title">surya deepak pulaparthi - designermoneywow2@gmail.com</div>
                        <div class="matching-meta-line">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                          <span>designermoneywow2@gmail.com</span>
                        </div>
                        <div class="matching-meta-line">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                          <span>+91 9705736759</span>
                        </div>
                      </div>
                    </div>

                    <div class="matching-customer-item" onclick="window.smatApp.selectMatchingCustomer(3)">
                      <div class="matching-avatar-circle">S</div>
                      <div class="matching-customer-info">
                        <div class="matching-name-title">surya deepak pulaparthi - designermoneywow@gmail.com</div>
                        <div class="matching-meta-line">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                          <span>designermoneywow@gmail.com</span>
                        </div>
                        <div class="matching-meta-line">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                          <span>+91 9705736759</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 7. Customer Language -->
            <div class="zoho-form-row">
              <label class="zoho-row-label" for="cust-language">
                <span>Customer Language</span>
                <span class="info-glyph-chip zoho-info-glyph" title="Language preference for billing receipts & notification templates">ⓘ</span>
              </label>
              <div class="zoho-row-control">
                <select class="modern-input-field modern-select zoho-input-select" id="cust-language">
                  <option value="English" ${language === 'English' ? 'selected' : ''}>English</option>
                  <option value="Hindi" ${language === 'Hindi' ? 'selected' : ''}>Hindi</option>
                  <option value="Telugu" ${language === 'Telugu' ? 'selected' : ''}>Telugu</option>
                  <option value="Tamil" ${language === 'Tamil' ? 'selected' : ''}>Tamil</option>
                  <option value="Spanish" ${language === 'Spanish' ? 'selected' : ''}>Spanish</option>
                  <option value="German" ${language === 'German' ? 'selected' : ''}>German</option>
                </select>
              </div>
            </div>

            <!-- UNDERLINE TABS BAR (Exact match to Zoho Billing screenshots) -->
            <div class="zoho-reference-tabs-bar">
              <button type="button" class="zoho-ref-tab-btn zoho-edit-tab-btn ${zohoEditCustomerTab === 'other-details' ? 'active' : ''}" data-tab="other-details" onclick="window.smatApp.setZohoEditTab('other-details')">
                Other Details
              </button>
              <button type="button" class="zoho-ref-tab-btn zoho-edit-tab-btn ${zohoEditCustomerTab === 'address' ? 'active' : ''}" data-tab="address" onclick="window.smatApp.setZohoEditTab('address')">
                Address
              </button>
            </div>
              <!-- TAB PANE 1: Other Details / Tax Information (Screenshot 1 & Screenshot 4) -->
              <div id="zoho-tab-pane-other" style="display:${zohoEditCustomerTab === 'other-details' ? 'block' : 'none'};">
                <!-- 1. GST Treatment* -->
                <div class="zoho-form-row form-field-group">
                  <div class="zoho-row-label required">
                    <span>GST Treatment*</span>
                  </div>
                  <div class="zoho-row-control">
                    <select class="modern-input-field modern-select zoho-input-select" id="cust-gst-treatment" onchange="window.smatApp.onGstTreatmentChange(this.value)">
                      <option value="Unregistered Business" ${defaultTreatment === 'Unregistered Business' ? 'selected' : ''}>Unregistered Business</option>
                      <option value="Registered Business - Regular" ${defaultTreatment === 'Registered Business - Regular' ? 'selected' : ''}>Registered Business - Regular</option>
                      <option value="Registered Business - Composition" ${defaultTreatment === 'Registered Business - Composition' ? 'selected' : ''}>Registered Business - Composition</option>
                      <option value="Consumer" ${defaultTreatment === 'Consumer' ? 'selected' : ''}>Consumer</option>
                      <option value="Overseas" ${defaultTreatment === 'Overseas' ? 'selected' : ''}>Overseas</option>
                      <option value="Special Economic Zone" ${defaultTreatment.includes('Special Economic Zone') ? 'selected' : ''}>Special Economic Zone (SEZ)</option>
                      <option value="Deemed Export" ${defaultTreatment === 'Deemed Export' ? 'selected' : ''}>Deemed Export</option>
                    </select>
                  </div>
                </div>

                <!-- GSTIN / UIN Details (Only Asked If User Is GST Registered; Hidden If Unregistered) -->
                <div id="cust-gstin-row-group" class="zoho-form-row form-field-group gstin-conditional-group" style="display: ${isGstRegistered ? 'flex' : 'none'};">
                  <div class="zoho-row-label">
                    <span>GSTIN / UIN</span>
                    <span class="info-glyph-chip zoho-info-glyph" title="15-digit Goods & Services Tax Identification Number">ⓘ</span>
                  </div>
                  <div class="zoho-row-control">
                    <div class="modern-gstin-action-group zoho-gstin-input-group">
                      <input type="text" id="cust-gstin-input" class="modern-input-field gstin-input zoho-input-text" value="${escapeHtml(gstin)}" placeholder="e.g. 36AACCF6679F1ZD" oninput="window.smatApp.onGstinInputChange(this.value)" />
                      <button type="button" class="btn-zoho-taxpayer-fetch btn-get-taxpayer" onclick="window.smatApp.fetchTaxpayerDetails()">
                        Get Taxpayer Details
                      </button>
                    </div>
                    <div id="cust-gstin-warning" class="zoho-mandatory-warning-text" style="margin-top:4px; display:${(!gstin && isGstRegistered) ? 'block' : 'none'};">
                      <span>▲ GST Identification Number is mandatory for GST registered contact.</span>
                    </div>
                  </div>
                </div>

                <!-- 2. Place of Supply* -->
                <div class="zoho-form-row form-field-group">
                  <div class="zoho-row-label required">
                    <span>Place of Supply*</span>
                  </div>
                  <div class="zoho-row-control">
                    <select class="modern-input-field modern-select zoho-input-select" id="cust-place-of-supply">
                      <option value="[TS] - Telangana" ${placeOfSupply.includes('Telangana') ? 'selected' : ''}>[TS] - Telangana</option>
                      <option value="[AP] - Andhra Pradesh" ${placeOfSupply.includes('Andhra Pradesh') ? 'selected' : ''}>[AP] - Andhra Pradesh</option>
                      <option value="[MH] - Maharashtra" ${placeOfSupply.includes('Maharashtra') ? 'selected' : ''}>[MH] - Maharashtra</option>
                      <option value="[KA] - Karnataka" ${placeOfSupply.includes('Karnataka') ? 'selected' : ''}>[KA] - Karnataka</option>
                      <option value="[DL] - Delhi" ${placeOfSupply.includes('Delhi') ? 'selected' : ''}>[DL] - Delhi</option>
                      <option value="[TN] - Tamil Nadu" ${placeOfSupply.includes('Tamil Nadu') ? 'selected' : ''}>[TN] - Tamil Nadu</option>
                      <option value="[GJ] - Gujarat" ${placeOfSupply.includes('Gujarat') ? 'selected' : ''}>[GJ] - Gujarat</option>
                      <option value="[WB] - West Bengal" ${placeOfSupply.includes('West Bengal') ? 'selected' : ''}>[WB] - West Bengal</option>
                      <option value="[UP] - Uttar Pradesh" ${placeOfSupply.includes('Uttar Pradesh') ? 'selected' : ''}>[UP] - Uttar Pradesh</option>
                      <option value="[KL] - Kerala" ${placeOfSupply.includes('Kerala') ? 'selected' : ''}>[KL] - Kerala</option>
                      <option value="[RJ] - Rajasthan" ${placeOfSupply.includes('Rajasthan') ? 'selected' : ''}>[RJ] - Rajasthan</option>
                      <option value="[MP] - Madhya Pradesh" ${placeOfSupply.includes('Madhya Pradesh') ? 'selected' : ''}>[MP] - Madhya Pradesh</option>
                      <option value="[PB] - Punjab" ${placeOfSupply.includes('Punjab') ? 'selected' : ''}>[PB] - Punjab</option>
                      <option value="[HR] - Haryana" ${placeOfSupply.includes('Haryana') ? 'selected' : ''}>[HR] - Haryana</option>
                    </select>
                  </div>
                </div>

                <!-- 3. PAN ⓘ (Screenshot 1) -->
                <div class="zoho-form-row form-field-group">
                  <div class="zoho-row-label">
                    <span>PAN</span>
                    <span class="info-glyph-chip zoho-info-glyph" title="Permanent Account Number">ⓘ</span>
                  </div>
                  <div class="zoho-row-control">
                    <input type="text" id="cust-pan" class="modern-input-field zoho-input-text" placeholder="e.g. ABCDE1234F" value="${escapeHtml(pan)}" />
                  </div>
                </div>

                <!-- Business Legal Name & Business Trade Name (Directly visible with Tax fields) -->
                <div class="zoho-form-row form-field-group">
                  <div class="zoho-row-label">
                    <span>Business Legal Name</span>
                    <span class="info-glyph-chip zoho-info-glyph" title="Official registered entity legal name from GST certificate">ⓘ</span>
                  </div>
                  <div class="zoho-row-control">
                    <input type="text" id="cust-legal-name" class="modern-input-field zoho-input-text" placeholder="e.g. SmatBot Technologies Private Limited" value="${escapeHtml(currClient.legal_name || '')}" />
                  </div>
                </div>

                <div class="zoho-form-row form-field-group">
                  <div class="zoho-row-label">
                    <span>Business Trade Name</span>
                    <span class="info-glyph-chip zoho-info-glyph" title="Operating trade / brand name from GST records">ⓘ</span>
                  </div>
                  <div class="zoho-row-control">
                    <input type="text" id="cust-trade-name" class="modern-input-field zoho-input-text" placeholder="e.g. SmatBot AI" value="${escapeHtml(currClient.trade_name || '')}" />
                  </div>
                </div>

                <!-- 4. Tax Preference* (Screenshot 1) -->
                <div class="zoho-form-row form-field-group">
                  <div class="zoho-row-label required">
                    <span>Tax Preference*</span>
                  </div>
                  <div class="zoho-row-control">
                    <div class="modern-radio-row">
                      <label class="radio-label-item">
                        <input type="radio" name="tax_preference" value="Taxable" ${taxPref === 'Taxable' ? 'checked' : ''} />
                        <span>Taxable</span>
                      </label>
                      <label class="radio-label-item">
                        <input type="radio" name="tax_preference" value="Tax Exempt" ${taxPref === 'Tax Exempt' ? 'checked' : ''} />
                        <span>Tax Exempt</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- 5. Currency (Screenshot 1) -->
                <div class="zoho-form-row form-field-group">
                  <div class="zoho-row-label">
                    <span>Currency</span>
                  </div>
                  <div class="zoho-row-control">
                    <select class="modern-input-field modern-select zoho-input-select" id="cust-currency">
                      <option value="INR- Indian Rupee" ${currency.includes('INR') ? 'selected' : ''}>INR- Indian Rupee</option>
                      <option value="USD - United States Dollar" ${currency.includes('USD') ? 'selected' : ''}>USD - United States Dollar</option>
                      <option value="EUR - Euro" ${currency.includes('EUR') ? 'selected' : ''}>EUR - Euro</option>
                      <option value="GBP - British Pound" ${currency.includes('GBP') ? 'selected' : ''}>GBP - British Pound</option>
                      <option value="AED - UAE Dirham" ${currency.includes('AED') ? 'selected' : ''}>AED - UAE Dirham</option>
                    </select>
                  </div>
                </div>

                <!-- 6. Payment Terms (Screenshot 1) -->
                <div class="zoho-form-row form-field-group">
                  <div class="zoho-row-label">
                    <span>Payment Terms</span>
                  </div>
                  <div class="zoho-row-control">
                    <select class="modern-input-field modern-select zoho-input-select" id="cust-payment-terms">
                      <option value="Due on Receipt" ${paymentTerms === 'Due on Receipt' ? 'selected' : ''}>Due on Receipt</option>
                      <option value="Net 15" ${paymentTerms === 'Net 15' ? 'selected' : ''}>Net 15</option>
                      <option value="Net 30" ${paymentTerms === 'Net 30' ? 'selected' : ''}>Net 30</option>
                      <option value="Net 45" ${paymentTerms === 'Net 45' ? 'selected' : ''}>Net 45</option>
                      <option value="Net 60" ${paymentTerms === 'Net 60' ? 'selected' : ''}>Net 60</option>
                    </select>
                  </div>
                </div>

                <!-- 7. Documents (Screenshot 1) -->
                <div class="zoho-form-row form-field-group">
                  <div class="zoho-row-label">
                    <span>Documents</span>
                  </div>
                  <div class="zoho-row-control">
                    <input type="file" id="cust-documents-input" multiple style="display:none;" onchange="window.smatApp.handleDocumentUpload(this)" />
                    <button type="button" class="btn-upload-documents" onclick="document.getElementById('cust-documents-input').click()">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                      <span>Upload File</span>
                      <span style="font-size:10px; margin-left:4px;">▾</span>
                    </button>
                    <div class="upload-helper-subtext">You can upload a maximum of 10 files, 10MB each</div>
                    <div id="uploaded-docs-list" class="uploaded-docs-list-box">
                      ${(uploadedCustomerDocs || []).map((doc, idx) => `
                        <span class="uploaded-doc-chip" style="display:inline-flex; align-items:center; gap:6px; background:#F1F5F9; border:1px solid #CBD5E1; padding:3px 8px; border-radius:4px; font-size:12px; margin:2px 4px 2px 0;">
                          <span>📎 ${escapeHtml(typeof doc === 'string' ? doc : (doc.name || 'Document'))} ${doc.size ? `(${Math.round(doc.size / 1024)} KB)` : ''}</span>
                          <button type="button" onclick="window.smatApp.removeUploadedDoc(${idx})" style="border:none; background:none; cursor:pointer; color:#94A3B8; font-weight:700;" title="Remove file">✕</button>
                        </span>
                      `).join('')}
                    </div>
                  </div>
                </div>

                <!-- ADD MORE DETAILS TOGGLE LINK (Screenshot 1 & 4) -->
                <div class="more-details-toggle-row" style="margin-top: 1.25rem;">
                  <a href="javascript:void(0)" class="link-add-more-details" id="toggle-more-details-btn" onclick="window.smatApp.toggleMoreCustomerDetails()">
                    ${moreCustomerDetailsOpen ? 'Less details ▲' : 'Add more details ▾'}
                  </a>
                </div>

                <!-- EXPANDABLE EXTRA FIELDS CONTAINER (Screenshot 4) -->
                <div id="cust-more-details-container" class="more-details-expandable-box" style="display:${moreCustomerDetailsOpen ? 'block' : 'none'}; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #F1F5F9;">
                  <!-- Website URL (Screenshot 4) -->
                  <div class="zoho-form-row form-field-group">
                    <div class="zoho-row-label">
                      <span>Website URL</span>
                    </div>
                    <div class="zoho-row-control">
                      <div class="input-wrapper-prefix">
                        <span class="input-prefix-icon">🌐</span>
                        <input type="text" id="cust-website" class="modern-input-field has-prefix zoho-input-text" placeholder="ex: www.zylker.com" value="${escapeHtml(website)}" />
                      </div>
                    </div>
                  </div>

                  <!-- Department (Screenshot 4) -->
                  <div class="zoho-form-row form-field-group">
                    <div class="zoho-row-label">
                      <span>Department</span>
                    </div>
                    <div class="zoho-row-control">
                      <input type="text" id="cust-department" class="modern-input-field zoho-input-text" placeholder="Department" value="${escapeHtml(department)}" />
                    </div>
                  </div>

                  <!-- Designation (Screenshot 4) -->
                  <div class="zoho-form-row form-field-group">
                    <div class="zoho-row-label">
                      <span>Designation</span>
                    </div>
                    <div class="zoho-row-control">
                      <input type="text" id="cust-designation" class="modern-input-field zoho-input-text" placeholder="Designation" value="${escapeHtml(designation)}" />
                    </div>
                  </div>

                  <!-- X (Twitter) (Screenshot 4) -->
                  <div class="zoho-form-row form-field-group">
                    <div class="zoho-row-label">
                      <span>X</span>
                    </div>
                    <div class="zoho-row-control">
                      <div class="input-wrapper-prefix">
                        <span class="input-prefix-icon" style="font-weight:700;">𝕏</span>
                        <input type="text" id="cust-x-twitter" class="modern-input-field has-prefix zoho-input-text" placeholder="Username" value="${escapeHtml(xTwitter)}" />
                      </div>
                      <div class="field-sub-helper-url">https://x.com/</div>
                    </div>
                  </div>

                  <!-- Skype Name/Number (Screenshot 4) -->
                  <div class="zoho-form-row form-field-group">
                    <div class="zoho-row-label">
                      <span>Skype Name/Number</span>
                    </div>
                    <div class="zoho-row-control">
                      <div class="input-wrapper-prefix">
                        <span class="input-prefix-icon" style="color:#00AFF0; font-weight:700;">Ⓢ</span>
                        <input type="text" id="cust-skype" class="modern-input-field has-prefix zoho-input-text" placeholder="Skype ID or Number" value="${escapeHtml(skype)}" />
                      </div>
                    </div>
                  </div>

                  <!-- Facebook (Screenshot 4) -->
                  <div class="zoho-form-row form-field-group">
                    <div class="zoho-row-label">
                      <span>Facebook</span>
                    </div>
                    <div class="zoho-row-control">
                      <div class="input-wrapper-prefix">
                        <span class="input-prefix-icon" style="color:#1877F2; font-weight:700;">ⓕ</span>
                        <input type="text" id="cust-facebook" class="modern-input-field has-prefix zoho-input-text" placeholder="Profile or Page name" value="${escapeHtml(facebook)}" />
                      </div>
                      <div class="field-sub-helper-url">http://www.facebook.com/</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- TAB PANE 2: Address (Screenshot 2 & Screenshot 3) -->
              <div id="zoho-tab-pane-address" style="display:${zohoEditCustomerTab === 'address' ? 'block' : 'none'};">
                <div class="modern-address-dual-grid zoho-address-dual-columns">
                  <!-- Billing Address Box -->
                  <div class="modern-address-box zoho-address-column">
                    <div class="address-box-header zoho-addr-col-header">
                      <div class="addr-box-title addr-title">
                        <span>Billing Address</span>
                      </div>
                    </div>
                    <div class="address-box-fields zoho-addr-fields-stack">
                      <div class="addr-item addr-field-item">
                        <label>Attention</label>
                        <input type="text" id="bill-attention" class="modern-input-field zoho-input-text" value="${escapeHtml(bAddr.attention || currClient.name || '')}" placeholder="Attention" />
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>Country/Region</label>
                        <div class="input-select-with-clear">
                          <select class="modern-input-field modern-select zoho-input-select" id="bill-country">
                            <option value="India" selected>India</option>
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="United Arab Emirates">United Arab Emirates</option>
                          </select>
                        </div>
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>Address</label>
                        <textarea id="bill-address1" class="modern-input-field modern-textarea zoho-input-text" rows="2" placeholder="Address line 1">${escapeHtml(bAddr.line1 || '')}</textarea>
                        <textarea id="bill-address2" class="modern-input-field modern-textarea zoho-input-text" rows="2" style="margin-top:6px;" placeholder="Address line 2">${escapeHtml(bAddr.line2 || '')}</textarea>
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>City</label>
                        <input type="text" id="bill-city" class="modern-input-field zoho-input-text" value="${escapeHtml(bAddr.city || '')}" placeholder="City" />
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>State</label>
                        <select class="modern-input-field modern-select zoho-input-select" id="bill-state">
                          <option value="Hyderabad" selected>Hyderabad</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                        </select>
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>Pin Code</label>
                        <input type="text" id="bill-pincode" class="modern-input-field zoho-input-text" value="${escapeHtml(bAddr.pin || '')}" placeholder="Pin Code" />
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>Phone</label>
                        <div class="modern-phone-input-row" style="max-width:100%;">
                          <select class="modern-input-field modern-select phone-code-select" style="width: 85px;">
                            <option value="+91" selected>+91</option>
                            <option value="+1">+1</option>
                          </select>
                          <input type="text" id="bill-phone" class="modern-input-field zoho-input-text" value="${escapeHtml(bAddr.phone || currClient.phone_number || '')}" placeholder="Phone" />
                        </div>
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>Fax Number</label>
                        <input type="text" id="bill-fax" class="modern-input-field zoho-input-text" value="${escapeHtml(bAddr.fax || '')}" placeholder="Fax Number" />
                      </div>
                    </div>
                  </div>

                  <!-- Shipping Address Box (Screenshot 2: Shipping Address ( ⬇ Copy billing address )) -->
                  <div class="modern-address-box zoho-address-column">
                    <div class="address-box-header zoho-addr-col-header">
                      <div class="addr-box-title addr-title">
                        <span>Shipping Address</span>
                        <span style="font-weight:400; font-size:12.5px; color:#64748B;">(</span>
                        <a href="javascript:void(0)" class="link-copy-billing-inline link-copy-address" onclick="window.smatApp.copyBillingToShippingInEdit()">
                          ⬇ Copy billing address
                        </a>
                        <span style="font-weight:400; font-size:12.5px; color:#64748B;">)</span>
                      </div>
                    </div>
                    <div class="address-box-fields zoho-addr-fields-stack">
                      <div class="addr-item addr-field-item">
                        <label>Attention</label>
                        <input type="text" id="ship-attention" class="modern-input-field zoho-input-text" value="${escapeHtml(sAddr.attention || '')}" placeholder="Attention" />
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>Country/Region</label>
                        <div class="input-select-with-clear">
                          <select class="modern-input-field modern-select zoho-input-select" id="ship-country">
                            <option value="India" selected>India</option>
                            <option value="United States">United States</option>
                          </select>
                        </div>
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>Address</label>
                        <textarea id="ship-address1" class="modern-input-field modern-textarea zoho-input-text" rows="2" placeholder="Address line 1">${escapeHtml(sAddr.line1 || '')}</textarea>
                        <textarea id="ship-address2" class="modern-input-field modern-textarea zoho-input-text" rows="2" style="margin-top:6px;" placeholder="Address line 2">${escapeHtml(sAddr.line2 || '')}</textarea>
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>City</label>
                        <input type="text" id="ship-city" class="modern-input-field zoho-input-text" value="${escapeHtml(sAddr.city || '')}" placeholder="City" />
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>State</label>
                        <select class="modern-input-field modern-select zoho-input-select" id="ship-state">
                          <option value="Hyderabad" selected>Hyderabad</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Delhi">Delhi</option>
                        </select>
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>Pin Code</label>
                        <input type="text" id="ship-pincode" class="modern-input-field zoho-input-text" value="${escapeHtml(sAddr.pin || '')}" placeholder="Pin Code" />
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>Phone</label>
                        <div class="modern-phone-input-row" style="max-width:100%;">
                          <select class="modern-input-field modern-select phone-code-select" style="width: 85px;">
                            <option value="+91" selected>+91</option>
                            <option value="+1">+1</option>
                          </select>
                          <input type="text" id="ship-phone" class="modern-input-field zoho-input-text" value="${escapeHtml(sAddr.phone || '')}" placeholder="Phone" />
                        </div>
                      </div>
                      <div class="addr-item addr-field-item">
                        <label>Fax Number</label>
                        <input type="text" id="ship-fax" class="modern-input-field zoho-input-text" value="${escapeHtml(sAddr.fax || '')}" placeholder="Fax Number" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Blue Future Transaction Warning Callout (Screenshot 3) -->
                <div class="address-future-callout">
                  <span class="info-circle-icon">ℹ</span>
                  <div>
                    <strong>This address will apply only to future transactions.</strong><br>
                    <span>To update for existing transactions, select them in the respective module and update the address using <strong>Bulk Update</strong>. <a href="https://www.zoho.com/in/billing/kb/customers/bulk-update-address.html" target="_blank" rel="noopener noreferrer" class="callout-link">Learn More</a></span>
                  </div>
                </div>

                <!-- Amber Address Notes (Screenshot 3) -->
                <div class="address-notes-callout">
                  <strong>Note:</strong>
                  <ul style="margin: 4px 0 0 18px; padding: 0;">
                    <li>Add and manage additional addresses from this Customers details section.</li>
                    <li>You can customise how customers' addresses are displayed in transaction PDFs. To do this, go to Settings &gt; Preferences &gt; Customers, and navigate to the Address Format sections.</li>
                  </ul>
                </div>
              </div>
            </div>

          <!-- Bottom Sticky Actions Bar (Screenshot 2, 3, 4: [Save] [Save and Subscribe] [Cancel]) -->
          <div class="modern-edit-footer-bar zoho-edit-footer-actions">
            <div class="footer-buttons-group">
              <button type="submit" class="btn-modern-save btn-zoho-save-primary" id="btn-save-customer">
                Save
              </button>
              <button type="button" class="btn-save-subscribe-customer" id="btn-save-subscribe-customer" onclick="window.smatApp.handleZohoSaveAndSubscribe(event)">
                Save and Subscribe
              </button>
              <button type="button" class="btn-modern-cancel btn-zoho-cancel-secondary" id="btn-cancel-customer" onclick="window.smatApp.navigateTo('subscriptions')">
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    `;
  }

    
  // =========================================================================
  // 7A. ZOHO BILLING STYLE "CHANGE / NEW SUBSCRIPTION" FULL-PAGE MODULE
  // Exact 100% Pixel-Perfect Match with User's 4 Reference Screenshots
  // =========================================================================
  let zohoSubscriptionClientId = (function() {
    try {
      const savedZohoId = localStorage.getItem('smatbot_zoho_subscription_client_id') || localStorage.getItem('smatbot_selected_client_id');
      if (savedZohoId !== null && savedZohoId !== undefined) {
        return isNaN(savedZohoId) ? savedZohoId : Number(savedZohoId);
      }
    } catch (e) {}
    return 0; // Default to SMATBOT AI (Client 0)
  })();

  const ALL_SUPPLY_STATES = [
    { code: 'AN', name: 'Andaman and Nicobar Islands' },
    { code: 'AD', name: 'Andhra Pradesh' },
    { code: 'AR', name: 'Arunachal Pradesh' },
    { code: 'AS', name: 'Assam' },
    { code: 'BR', name: 'Bihar' },
    { code: 'CH', name: 'Chandigarh' },
    { code: 'CG', name: 'Chhattisgarh' },
    { code: 'DN', name: 'Dadra and Nagar Haveli and Daman and Diu' },
    { code: 'DD', name: 'Daman and Diu' },
    { code: 'DL', name: 'Delhi' },
    { code: 'FC', name: 'Foreign Country' },
    { code: 'GA', name: 'Goa' },
    { code: 'GJ', name: 'Gujarat' },
    { code: 'HR', name: 'Haryana' },
    { code: 'HP', name: 'Himachal Pradesh' },
    { code: 'JK', name: 'Jammu and Kashmir' },
    { code: 'JH', name: 'Jharkhand' },
    { code: 'KA', name: 'Karnataka' },
    { code: 'KL', name: 'Keralam' },
    { code: 'LA', name: 'Ladakh' },
    { code: 'LD', name: 'Lakshadweep' },
    { code: 'MP', name: 'Madhya Pradesh' },
    { code: 'MH', name: 'Maharashtra' },
    { code: 'MN', name: 'Manipur' },
    { code: 'ML', name: 'Meghalaya' },
    { code: 'MZ', name: 'Mizoram' },
    { code: 'NL', name: 'Nagaland' },
    { code: 'OD', name: 'Odisha' },
    { code: 'OT', name: 'Other Territory' },
    { code: 'PY', name: 'Puducherry' },
    { code: 'PB', name: 'Punjab' },
    { code: 'RJ', name: 'Rajasthan' },
    { code: 'SK', name: 'Sikkim' },
    { code: 'TN', name: 'Tamil Nadu' },
    { code: 'TS', name: 'Telangana' },
    { code: 'TR', name: 'Tripura' },
    { code: 'UP', name: 'Uttar Pradesh' },
    { code: 'UK', name: 'Uttarakhand' },
    { code: 'WB', name: 'West Bengal' }
  ];
  let zohoSelectedSupplyState = 'TS';

  const ALL_GST_TREATMENTS = [
    {
      title: 'Registered Business - Regular',
      desc: 'Business that is registered under GST'
    },
    {
      title: 'Registered Business - Composition',
      desc: 'Business that is registered under the Composition Scheme in GST'
    },
    {
      title: 'Unregistered Business',
      desc: 'Business that has not been registered under GST'
    },
    {
      title: 'Consumer',
      desc: 'A customer who is a regular consumer'
    },
    {
      title: 'Overseas',
      desc: 'Persons with whom you do import or export of supplies outside India'
    },
    {
      title: 'Special Economic Zone',
      desc: 'Business (Unit) that is located in a Special Economic Zone (SEZ) of India or a SEZ Developer'
    },
    {
      title: 'Deemed Export',
      desc: 'Supply of goods to an Export Oriented Unit or against Advanced Authorization/Export Promotion Capital Goods.'
    },
    {
      title: 'Tax Deductor',
      desc: 'Departments of the State/Central government, governmental agencies or local authorities'
    },
    {
      title: 'SEZ Developer',
      desc: 'A person/organisation who owns at least 26% of the equity in creating business units in a Special Economic Zone (SEZ)'
    },
    {
      title: 'Input Service Distributor',
      desc: 'Input Service Distributor (ISD) is an office that receives tax invoices for services used by the company in different states under the same PAN.'
    }
  ];
  let zohoSelectedGstTreatment = 'Unregistered Business';

  const ALL_ZOHO_ACCOUNTS = [
    {
      group: 'Other Current Asset',
      items: [
        { name: 'Advance Tax' },
        { name: 'Employee Advance' },
        { name: 'Input Tax Credits', isHeader: true },
        { name: 'Input CGST', isSub: true },
        { name: 'Input IGST', isSub: true },
        { name: 'Input SGST', isSub: true },
        { name: 'Prepaid Expenses' },
        { name: 'Reverse Charge Tax Input but not due' },
        { name: 'TDS Receivable' }
      ]
    },
    {
      group: 'Fixed Asset',
      items: [
        { name: 'Furniture and Equipment' }
      ]
    },
    {
      group: 'Other Current Liability',
      items: [
        { name: '[ Payroll-004 ] Deductions Payable' },
        { name: 'Employee Reimbursements' },
        { name: 'GST Payable', isHeader: true },
        { name: 'Output CGST', isSub: true },
        { name: 'Output IGST', isSub: true },
        { name: 'Output SGST', isSub: true },
        { name: '[ Payroll-006 ] Hold Salary Payable' },
        { name: '[ Payroll-005 ] Net Salary Payable' },
        { name: 'Opening Balance Adjustments' },
        { name: '[ Payroll-002 ] Payroll Tax Payable' },
        { name: '[ Payroll-001 ] Reimbursements Payable' },
        { name: '[ Payroll-003 ] Statutory Deductions Payable' },
        { name: 'TDS Payable' },
        { name: 'Unearned Revenue' }
      ]
    },
    {
      group: 'Non Current Liability',
      items: [
        { name: 'Construction Loans' },
        { name: 'Mortgages' }
      ]
    },
    {
      group: 'Equity',
      items: [
        { name: 'Capital Stock' },
        { name: 'Distributions' },
        { name: 'Dividends Paid' },
        { name: 'Drawings' },
        { name: 'Investments' },
        { name: 'Opening Balance Offset' },
        { name: 'Owner\'s Equity' }
      ]
    },
    {
      group: 'Income',
      items: [
        { name: 'Discount' },
        { name: 'General Income' },
        { name: 'Interest Income' },
        { name: 'Late Fee Income' },
        { name: 'Other Charges' },
        { name: 'Sales' },
        { name: 'Shipping Charge' }
      ]
    },
    {
      group: 'Expense',
      items: [
        { name: 'Advertising And Marketing' },
        { name: 'Automobile Expense' },
        { name: 'Bad Debt' },
        { name: 'Bank Fees and Charges' },
        { name: 'Consultant Expense' },
        { name: 'Contract Assets' },
        { name: 'Credit Card Charges' },
        { name: 'Depreciation And Amortisation' },
        { name: 'Depreciation Expense' },
        { name: 'Fuel/Mileage Expenses' },
        { name: 'IT and Internet Expenses' },
        { name: 'Janitorial Expense' },
        { name: 'Lodging' },
        { name: 'Meals and Entertainment' },
        { name: 'Merchandise' },
        { name: 'Office Supplies' },
        { name: 'Other Expenses' },
        { name: 'Parking' },
        { name: 'Postage' },
        { name: 'Printing and Stationery' },
        { name: 'Purchase Discounts' },
        { name: 'Raw Materials And Consumables' },
        { name: 'Rent Expense' },
        { name: 'Repairs and Maintenance' },
        { name: 'Salaries and Employee Wages' },
        { name: 'Telephone Expense' },
        { name: 'Transportation Expense' },
        { name: 'Travel Expense' },
        { name: 'Uncategorized' }
      ]
    },
    {
      group: 'Cost Of Goods Sold',
      items: [
        { name: 'Cost of Goods Sold' },
        { name: 'Job Costing' },
        { name: 'Labor' },
        { name: 'Materials' },
        { name: 'Subcontractor' }
      ]
    }
  ];
  let zohoSelectedPlanAccount = '';
  let zohoDiscountPref = 'no-discount';
  let selectedZohoCoupon = null;
  let zohoSelectedPlanTaxLabel = 'GST18 [18%]';
  let zohoSelectedPlanTaxRate = 18;

  
  // 10 Official Zoho Subscription Plans (Exact match to User Screenshots 1, 2, 3)
  const ZOHO_SUBSCRIPTION_PLANS = [
    {
      id: 'starter_nm_without_wa',
      name: 'Starter New Monthly (Without WA)',
      code: 'MonthlyStarterwithoutwhatsapp',
      price: 1890,
      cycle: 'per month',
      sac: '998314',
      taxRate: 18,
      taxLabel: 'GST18 [18%]'
    },
    {
      id: 'pro_nm_with_wa',
      name: 'Pro New Monthly (With WhatsApp)',
      code: 'ProNewMonthlyWithWhatsApp',
      price: 6500,
      cycle: 'per month',
      sac: '998314',
      taxRate: 18,
      taxLabel: 'GST18 [18%]'
    },
    {
      id: 'pro_nm_without_wa',
      name: 'Pro New Monthly (without whatsapp)',
      code: 'ProNewPlanMonthlyWithoutWhatsapp',
      price: 5500,
      cycle: 'per month',
      sac: '998314',
      taxRate: 18,
      taxLabel: 'GST18 [18%]'
    },
    {
      id: 'pro_ny_without_wa',
      name: 'Pro New Yearly (Without WhatsApp)',
      code: 'ProNewYearlyWithoutWhatsApp',
      price: 60000,
      cycle: 'per year',
      sac: '998314',
      taxRate: 18,
      taxLabel: 'GST18 [18%]'
    },
    {
      id: 'pro_ny_with_wa',
      name: 'Pro New Yearly (With WhatsApp)',
      code: 'ProNewYearlyWithWhatsApp',
      price: 72000,
      cycle: 'per year',
      sac: '998314',
      taxRate: 18,
      taxLabel: 'GST18 [18%]'
    },
    {
      id: 'starter_nm_with_wa',
      name: 'Starter New Monthly (With WhatsApp)',
      code: 'StarterNewMonthlyWithWhatsApp',
      price: 2490,
      cycle: 'per month',
      sac: '998314',
      taxRate: 18,
      taxLabel: 'GST18 [18%]'
    },
    {
      id: 'starter_ny_without_wa',
      name: 'Starter New Yearly (Without Whatsapp)',
      code: 'StarterNewYearlyWithoutWhatsapp',
      price: 18900,
      cycle: 'per year',
      sac: '998314',
      taxRate: 18,
      taxLabel: 'GST18 [18%]'
    },
    {
      id: 'starter_ny_with_wa',
      name: 'Starter New Yearly (With Whatsapp)',
      code: 'StarterNewYearlyWithWhatsapp',
      price: 24900,
      cycle: 'per year',
      sac: '998314',
      taxRate: 18,
      taxLabel: 'GST18 [18%]'
    },
    {
      id: 'test_plan',
      name: 'test plan',
      code: 'test',
      price: 100,
      cycle: 'per month',
      sac: '998314',
      taxRate: 18,
      taxLabel: 'GST18 [18%]'
    },
    {
      id: 'testapichange',
      name: 'TESTAPICHANGE',
      code: 'TESTAPICHANGE',
      price: 500,
      cycle: 'per month',
      sac: '998314',
      taxRate: 18,
      taxLabel: 'GST18 [18%]'
    }
  ];
  zohoSelectedPlan = null;

  const ALL_ZOHO_PLAN_TAX_GROUPS = [
    {
      category: 'Non-Taxable',
      items: [
        {
          id: 'out-of-scope',
          label: 'Out of Scope',
          name: 'Out of Scope',
          rate: 0,
          subtitle: "Supplies on which you don't charge any GST or include them in the returns."
        },
        {
          id: 'non-gst-supply',
          label: 'Non-GST Supply',
          name: 'Non-GST Supply',
          rate: 0,
          subtitle: 'Supplies which do not come under GST such as petroleum products and liquor.'
        }
      ]
    },
    {
      category: 'Tax Group',
      items: [
        { id: 'gst0', label: 'GST0 [0%]', name: 'GST0', rate: 0 },
        { id: 'gst5', label: 'GST5 [5%]', name: 'GST5', rate: 5 },
        { id: 'gst12', label: 'GST12 [12%]', name: 'GST12', rate: 12 },
        { id: 'gst18', label: 'GST18 [18%]', name: 'GST18', rate: 18 },
        { id: 'gst28', label: 'GST28 [28%]', name: 'GST28', rate: 28 },
        { id: 'interstate18', label: 'Interstate [18%]', name: 'Interstate', rate: 18 }
      ]
    }
  ];



  const AVAILABLE_ZOHO_ADDONS = [
    { name: 'Extra Chats OC NM', price: 600, desc: '1 UNIT : 1000 CHATS ( Excluding WhatsApp )', unit: 'Extra Chats OC NM', sac: '998314' },
    { name: '+10,000 Conversations Quota', price: 1500, desc: 'Monthly conversational messages booster', unit: '+10,000 Quota', sac: '998314' },
    { name: '+1 Dedicated WhatsApp WABA Number', price: 2500, desc: 'Official Meta cloud number channel', unit: '+1 WABA No.', sac: '998314' },
    { name: '+1 Additional Live Agent Seat', price: 800, desc: 'Multi-agent live chat seat', unit: '+1 Agent Seat', sac: '998314' },
    { name: 'AI Integration Booster', price: 2000, desc: 'Dialogflow & OpenAI Vector Embeddings', unit: 'AI Booster', sac: '998314' },
    { name: 'Dedicated CSM / Premium SLA', price: 3000, desc: '24/7 dedicated support representative', unit: 'Dedicated CSM', sac: '998314' }
  ];

  let zohoSubAddons = [
    {
      id: 'extra_chats_oc_nm',
      name: 'Extra Chats OC NM',
      desc: '1 UNIT : 1000 CHATS ( Excluding WhatsApp )',
      sac: '998314',
      qty: 1,
      unit: 'Extra Chats OC NM',
      price: 600,
      discountVal: 0,
      discountType: 'percent',
      taxRate: 18,
      taxLabel: 'GST18 [18%]',
      isEmpty: false
    }
  ];

  function openZohoSubscription(clientId) {
    if (clientId !== undefined && clientId !== null) {
      zohoSubscriptionClientId = isNaN(clientId) ? clientId : Number(clientId);
      selectedClientId = zohoSubscriptionClientId;
    } else if (selectedClientId !== undefined && selectedClientId !== null) {
      zohoSubscriptionClientId = isNaN(selectedClientId) ? selectedClientId : Number(selectedClientId);
    }
    try {
      localStorage.setItem('smatbot_zoho_subscription_client_id', String(zohoSubscriptionClientId));
      localStorage.setItem('smatbot_selected_client_id', String(zohoSubscriptionClientId));
      localStorage.setItem('smatbot_active_route', 'change-subscription');
    } catch (e) {}
    navigateTo('change-subscription');
  }

  function onZohoSubCustomerSelect(clientId) {
    zohoSubscriptionClientId = isNaN(clientId) ? clientId : Number(clientId);
    selectedClientId = zohoSubscriptionClientId;
    try {
      localStorage.setItem('smatbot_zoho_subscription_client_id', String(zohoSubscriptionClientId));
      localStorage.setItem('smatbot_selected_client_id', String(zohoSubscriptionClientId));
    } catch (e) {}
    const viewport = document.getElementById('route-viewport');
    if (viewport) {
      renderZohoSubscriptionView(viewport);
    }
  }

  function renderZohoSubscriptionView(container) {
    if (zohoSubscriptionClientId === undefined || zohoSubscriptionClientId === null) {
      try {
        const savedZohoId = localStorage.getItem('smatbot_zoho_subscription_client_id') || localStorage.getItem('smatbot_selected_client_id');
        if (savedZohoId !== null && savedZohoId !== undefined) {
          zohoSubscriptionClientId = isNaN(savedZohoId) ? savedZohoId : Number(savedZohoId);
        } else if (selectedClientId !== undefined && selectedClientId !== null) {
          zohoSubscriptionClientId = selectedClientId;
        }
      } catch (e) {}
    }

    const currClient = clientsData.find(c => c.id === zohoSubscriptionClientId || String(c.id) === String(zohoSubscriptionClientId))
      || (selectedClientId !== undefined ? clientsData.find(c => c.id === selectedClientId || String(c.id) === String(selectedClientId)) : null)
      || clientsData[0]
      || {
        id: 0,
        name: 'SMATBOT AI',
        email: 'nagireddysukanya@gmail.com',
        company_name: 'SMATBOT AI',
        subscription_id: 'SUB-SMAT-AI',
        plan_name: 'Starter New Monthly (Without WA)',
        gst_treatment: 'Unregistered Business',
        billing_address: { company: 'SMATBOT AI', line1: '2nd Floor, Ashoka HiTech Chambers', line2: 'Road No. 2, opp. KBR Park', city: 'Hyderabad', pin: '500034', country: 'India' }
      };

    zohoSubscriptionClientId = currClient.id;
    selectedClientId = currClient.id;
    try {
      localStorage.setItem('smatbot_zoho_subscription_client_id', String(currClient.id));
      localStorage.setItem('smatbot_selected_client_id', String(currClient.id));
    } catch (e) {}

    const bAddress = currClient.billing_address || {
      company: currClient.company_name || 'feso',
      line1: 'test',
      line2: 'test',
      city: 'Hyderabad',
      pin: '500034',
      country: 'India'
    };

    const sAddress = currClient.shipping_address || {};
    const hasShipping = sAddress.line1 || sAddress.city;

    // Available plans matching user's separated plans
    const planOptions = [
      { label: 'Starter New Monthly (Without WA)', price: 1890, cycle: 'per month', group: 'Monthly Plans' },
      { label: 'Pro - Monthly (₹6,500)', price: 6500, cycle: 'per month', group: 'Monthly Plans' },
      { label: 'Broadcast - Monthly (₹1,499)', price: 1499, cycle: 'per month', group: 'Monthly Plans' },
      { label: 'Standard - Monthly (₹3,500)', price: 3500, cycle: 'per month', group: 'Monthly Plans' },
      { label: 'AI Enterprise - Monthly (₹8,999)', price: 8999, cycle: 'per month', group: 'Monthly Plans' },
      { label: 'Starter New Yearly (₹18,900)', price: 18900, cycle: 'per year', group: 'Yearly Plans' },
      { label: 'Pro - Yearly (₹72,000)', price: 72000, cycle: 'per year', group: 'Yearly Plans' },
      { label: 'Broadcast - Yearly (₹14,500)', price: 14500, cycle: 'per year', group: 'Yearly Plans' },
      { label: 'Standard - Yearly (₹35,000)', price: 35000, cycle: 'per year', group: 'Yearly Plans' },
      { label: 'AI Enterprise - Yearly (₹96,000)', price: 96000, cycle: 'per year', group: 'Yearly Plans' },
      { label: 'Pro Trial (₹0 / 14 Days)', price: 0, cycle: '14 days evaluation', group: 'Trial' }
    ];

    // Find currently selected plan in list
    const currentPlanName = currClient.plan_name || 'Starter New Monthly (Without WA)';
    const matchedPlan = planOptions.find(p => p.label.toLowerCase().includes(currentPlanName.toLowerCase())) || planOptions[0];
    zohoSelectedPlan = ZOHO_SUBSCRIPTION_PLANS.find(p => p.name.toLowerCase().includes(currentPlanName.toLowerCase()) || currentPlanName.toLowerCase().includes(p.name.toLowerCase())) || ZOHO_SUBSCRIPTION_PLANS[0];

    container.innerHTML = `
      <div class="zoho-sub-fullpage-wrap" style="background:#FFFFFF; min-height:100vh; padding-bottom:5rem;">

      <!-- ========================================================================= -->
      <!-- ZOHO CUSTOMER SIDEBAR TAB & SLIDE-OVER DRAWER (EXACT MATCH TO SCREENSHOTS)-->
      <!-- ========================================================================= -->
      <!-- Docked Right Tab Button (Screenshot 1) -->
      <div id="zoho-customer-sidebar-tab" 
           onclick="window.smatApp.toggleCustomerSidebar()" 
           title="Click to view Customer Details">
        <span style="max-width:130px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
          ${escapeHtml(currClient.name)} - ${escapeHtml((currClient.email || '').substring(0, 10))}...
        </span>
        <span style="font-size:0.75rem; color:#94A3B8; font-weight:700;">&gt;</span>
      </div>

      <!-- Backdrop -->
      <div id="zoho-customer-sidebar-backdrop" 
           onclick="window.smatApp.closeCustomerSidebar()"></div>

      <!-- Slide-over Drawer (Screenshot 2) -->
      <div id="zoho-customer-sidebar-drawer">
        <!-- Header -->
        <div style="padding:16px 20px; background:#FFFFFF; border-bottom:1px solid #E2E8F0;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div style="display:flex; align-items:center; gap:12px;">
              <!-- Avatar [ D ] -->
              <div style="width:40px; height:40px; background:#F1F5F9; color:#475569; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1.15rem; flex-shrink:0;">
                ${(currClient.name || 'D').charAt(0).toUpperCase()}
              </div>
              <div>
                <div style="font-size:0.75rem; color:#64748B; font-weight:500;">Customer</div>
                <div style="display:flex; align-items:center; gap:6px; margin-top:2px;">
                  <span style="font-weight:700; font-size:0.95rem; color:#0F172A; max-width:210px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                    ${escapeHtml(currClient.name)} - ${escapeHtml((currClient.email || '').substring(0, 10))}...
                  </span>
                  <!-- External Link Icon with Tooltip -->
                  <div class="zoho-cust-link-wrapper" style="position:relative; display:inline-flex; align-items:center;">
                    <a href="javascript:void(0)" onclick="window.smatApp.navigateTo('client-details')" style="color:#2563EB; display:inline-flex; align-items:center; text-decoration:none;" title="View in Customers module">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <!-- Red Close Button ✕ -->
            <button type="button" onclick="window.smatApp.closeCustomerSidebar()" style="background:none; border:none; color:#EF4444; font-size:1.2rem; cursor:pointer; line-height:1; padding:4px;" title="Close">✕</button>
          </div>

          <!-- Document / Company & Email Rows -->
          <div style="margin-top:14px; display:flex; flex-direction:column; gap:5px; font-size:0.83rem; color:#475569;">
            <div style="display:flex; align-items:center; gap:8px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <span>${escapeHtml(bAddress.company || currClient.company_name || 'feso')}</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <span>${escapeHtml(currClient.email || 'suryadesigner1234@gmail.com')}</span>
            </div>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div style="padding:0 20px; background:#FFFFFF; border-bottom:1px solid #E2E8F0; display:flex; gap:20px;">
          <div style="padding:10px 0; font-size:0.86rem; font-weight:700; color:#1E293B; border-bottom:2px solid #2563EB; cursor:pointer;">Details</div>
        </div>

        <!-- Drawer Content Body -->
        <div style="padding:16px 20px; display:flex; flex-direction:column; gap:14px; overflow-y:auto; flex:1;">
          <!-- Metric Cards Row -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <!-- Outstanding Receivables -->
            <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:8px; padding:12px 10px; text-align:center;">
              <div style="color:#F59E0B; margin-bottom:4px; display:flex; justify-content:center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="#F59E0B"/><line x1="12" y1="9" x2="12" y2="13" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="17" r="1.2" fill="#FFFFFF"/></svg>
              </div>
              <div style="font-size:0.72rem; color:#64748B; margin-bottom:4px;">Outstanding Receivables</div>
              <div style="font-size:1.1rem; font-weight:700; color:#0F172A;">Rs.25,045.24</div>
            </div>

            <!-- Unused Credits -->
            <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:8px; padding:12px 10px; text-align:center;">
              <div style="color:#10B981; margin-bottom:4px; display:flex; justify-content:center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><circle cx="12" cy="12" r="9"></circle><path d="M9 12l2 2 4-4"></path></svg>
              </div>
              <div style="font-size:0.72rem; color:#64748B; margin-bottom:4px;">Unused Credits</div>
              <div style="font-size:1.1rem; font-weight:700; color:#0F172A;">Rs.0.00</div>
            </div>
          </div>

          <!-- Contact Details Card (Screenshot 2 Match) -->
          <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:8px; padding:16px 18px;">
            <div style="font-weight:700; font-size:0.88rem; color:#0F172A; margin-bottom:14px;">Contact Details</div>
            <div style="display:flex; flex-direction:column; gap:10px; font-size:0.83rem;">
              <div style="display:flex; justify-content:space-between;"><span style="color:#64748B;">Customer Type</span><span style="font-weight:600; color:#0F172A;">Business</span></div>
              <div style="display:flex; justify-content:space-between;"><span style="color:#64748B;">Currency</span><span style="font-weight:600; color:#0F172A;">${currClient.currency_type || 'INR'}</span></div>
              <div style="display:flex; justify-content:space-between;"><span style="color:#64748B;">Payment Terms</span><span style="font-weight:600; color:#0F172A;">Due on Receipt</span></div>
              <div style="display:flex; justify-content:space-between;"><span style="color:#64748B;">Portal Status</span><span style="color:#64748B;">Disabled</span></div>
              <div style="display:flex; justify-content:space-between;"><span style="color:#64748B;">GST Treatment</span><span style="font-weight:600; color:#0F172A;">${currClient.gst_treatment || 'Unregistered Business'}</span></div>
              <div style="display:flex; justify-content:space-between;"><span style="color:#64748B;">Place of Supply</span><span style="font-weight:600; color:#0F172A;">${currClient.place_of_supply || 'Telangana'}</span></div>
              <div style="display:flex; justify-content:space-between;"><span style="color:#64748B;">Tax Preference</span><span style="font-weight:600; color:#0F172A;">Taxable</span></div>
              <div style="display:flex; justify-content:space-between;"><span style="color:#64748B;">Source</span><span style="font-weight:600; color:#0F172A;">API</span></div>
              <div style="display:flex; justify-content:space-between;"><span style="color:#64748B;">Type of Account</span><span style="font-weight:600; color:#0F172A;">Direct Customer</span></div>
              <div style="display:flex; justify-content:space-between;"><span style="color:#64748B;">expiry_emails</span><span style="font-weight:600; color:#0F172A;">Yes</span></div>
            </div>
          </div>

          <!-- Contact Persons Accordion Card (Exact Match to Screenshot 1 & 2) -->
          <div id="zoho-drawer-contact-persons-card" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:8px; padding:12px 16px; transition:all 0.2s ease;">
            <!-- Header (Toggle) -->
            <div onclick="window.smatApp.toggleDrawerAccordion('contact-persons')" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer; user-select:none;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-weight:600; font-size:0.86rem; color:#0F172A;">Contact Persons</span>
                <span style="background:#94A3B8; color:#FFFFFF; font-size:0.7rem; font-weight:700; padding:1px 6px; border-radius:10px; display:inline-flex; align-items:center; justify-content:center; min-width:18px;">1</span>
              </div>
              <span id="zoho-drawer-chevron-contact-persons" style="display:inline-flex; align-items:center; color:#64748B;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </span>
            </div>

            <!-- Body (Collapsed by Default - expands on click) -->
            <div id="zoho-drawer-body-contact-persons" style="display:none; margin-top:12px; padding-top:12px; border-top:1px solid #F1F5F9;">
              <div style="display:flex; align-items:center; gap:12px;">
                <!-- Avatar with Green Star Badge (Screenshot 1) -->
                <div style="position:relative; flex-shrink:0;">
                  <div style="width:34px; height:34px; border-radius:50%; background:#EEF2F6; color:#64748B; display:flex; align-items:center; justify-content:center; font-weight:600; font-size:0.88rem;">
                    S
                  </div>
                  <!-- Green Circle with White Star Badge -->
                  <div style="position:absolute; bottom:-3px; right:-3px; width:15px; height:15px; background:#10B981; border:2px solid #FFFFFF; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#FFFFFF; font-size:8px; box-shadow:0 1px 2px rgba(0,0,0,0.1);">
                    ★
                  </div>
                </div>

                <!-- Contact Details Info -->
                <div style="display:flex; flex-direction:column; gap:4px; font-size:0.82rem; color:#475569;">
                  <div style="display:flex; align-items:center; gap:6px;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    <span>${escapeHtml(currClient.email || 'suryadesigner1234@gmail.com')}</span>
                  </div>
                  <div style="display:flex; align-items:center; gap:6px;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                    <span>${escapeHtml(currClient.phone_number || '+91 9705736759')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Address Accordion Card (Exact Match to Screenshot 2) -->
          <div id="zoho-drawer-address-card" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:8px; padding:12px 16px; transition:all 0.2s ease;">
            <!-- Header (Toggle) -->
            <div onclick="window.smatApp.toggleDrawerAccordion('address')" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer; user-select:none;">
              <span style="font-weight:600; font-size:0.86rem; color:#0F172A;">Address</span>
              <span id="zoho-drawer-chevron-address" style="display:inline-flex; align-items:center; color:#64748B;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </span>
            </div>

            <!-- Body (Collapsed by Default - expands on click) -->
            <div id="zoho-drawer-body-address" style="display:none; margin-top:12px; padding-top:12px; border-top:1px solid #F1F5F9;">
              <!-- Billing Address Subheading with Document/Clipboard Icon (Screenshot 2) -->
              <div style="display:flex; align-items:center; gap:6px; font-size:0.82rem; font-weight:500; color:#64748B; margin-bottom:10px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                <span>Billing Address</span>
              </div>

              <!-- Billing Address Lines with subtle vertical left line (Screenshot 2) -->
              <div style="border-left:2px solid #E2E8F0; padding-left:12px; margin-left:2px; font-size:0.82rem; color:#334155; line-height:1.5;">
                <div style="font-weight:700; color:#0F172A;">${escapeHtml(bAddress.company || currClient.company_name || 'feso')}</div>
                <div>${escapeHtml(bAddress.line1 || 'test')}</div>
                <div>${escapeHtml(bAddress.line2 || 'test')}</div>
                <div>${escapeHtml(bAddress.city || 'Hyderabad')} ${escapeHtml(bAddress.pin || '500034')}</div>
                <div>${escapeHtml(bAddress.country || 'India')}</div>
              </div>

              <!-- Shipping Address Subheading (Clean spacing, no dashed divider) -->
              <div style="font-size:0.82rem; font-weight:500; color:#64748B; margin:16px 0 10px 0;">
                Shipping Address
              </div>

              <!-- Shipping Address Lines (Aligned vertical left line + Centered "No Shipping Address" - Screenshot 2) -->
              ${hasShipping ? `
                <div style="border-left:2px solid #E2E8F0; padding-left:12px; margin-left:2px; font-size:0.82rem; color:#334155; line-height:1.5;">
                  <div style="font-weight:700; color:#0F172A;">${escapeHtml(sAddress.company || currClient.company_name || '')}</div>
                  <div>${escapeHtml(sAddress.line1 || '')}</div>
                  <div>${escapeHtml(sAddress.line2 || '')}</div>
                  <div>${escapeHtml(sAddress.city || '')} ${escapeHtml(sAddress.pin || '')}</div>
                  <div>${escapeHtml(sAddress.country || '')}</div>
                </div>
              ` : `
                <div style="border-left:2px solid #E2E8F0; margin-left:2px; padding:8px 12px; display:flex; justify-content:center; align-items:center; min-height:36px;">
                  <span style="color:#94A3B8; font-size:0.82rem;">No Shipping Address</span>
                </div>
              `}
            </div>
          </div>
        </div>
      </div>

      <!-- Plan Removal Warning Confirmation Modal (Exact Match to User Reference Screenshot) -->
      <div id="zoho-plan-remove-modal-backdrop" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(15,23,42,0.25); z-index:100000; backdrop-filter:blur(1px);" onclick="window.smatApp.closeRemovePlanModal()">
        <div id="zoho-plan-remove-modal" class="zoho-plan-remove-modal" onclick="event.stopPropagation()" style="position:fixed; top:24px; left:50%; transform:translateX(-50%); background:#FFFFFF; border-radius:8px; box-shadow:0 14px 40px rgba(0,0,0,0.22); width:90%; max-width:540px; padding:22px 26px; z-index:100001; border:1px solid #E2E8F0;">
          <div style="display:flex; gap:16px; align-items:flex-start;">
            <!-- Yellow Warning Triangle Icon (Screenshot Match) -->
            <div style="flex-shrink:0; margin-top:2px;">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="#F59E0B"/>
                <line x1="12" y1="9" x2="12" y2="13" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/>
                <circle cx="12" cy="17" r="1.2" fill="#FFFFFF"/>
              </svg>
            </div>

            <!-- Warning Text (Screenshot Match) -->
            <div style="font-size:0.92rem; color:#374151; line-height:1.55;">
              If you remove this plan, any custom changes you've made to the plan price, reporting tags or other such subscription configurations will be discarded.
            </div>
          </div>

          <!-- Action Buttons (Screenshot Match) -->
          <div style="display:flex; gap:10px; margin-top:20px; margin-left:46px;">
            <button type="button" onclick="event.stopPropagation(); window.smatApp.proceedRemovePlan()" style="background:#2563EB; color:#FFFFFF; border:none; border-radius:4px; padding:7px 20px; font-size:0.86rem; font-weight:500; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,0.05); transition:background 0.15s;" onmouseover="this.style.background='#1D4ED8'" onmouseout="this.style.background='#2563EB'">Proceed</button>
            <button type="button" onclick="event.stopPropagation(); window.smatApp.closeRemovePlanModal()" style="background:#FFFFFF; color:#374151; border:1px solid #D1D5DB; border-radius:4px; padding:7px 18px; font-size:0.86rem; font-weight:500; cursor:pointer; transition:background 0.15s;" onmouseover="this.style.background='#F9FAFB'" onmouseout="this.style.background='#FFFFFF'">Cancel</button>
          </div>
        </div>
      </div>

        
        <!-- Sub-Navigation Bar for Subscriptions (Zoho Reference vs Directory) -->
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
        </div>

        <div style="padding:2rem 2.5rem; max-width:1150px;">

          <!-- SECTION 1: CUSTOMER SELECTION & ADDRESS (SCREENSHOT 1) -->
          <div class="zoho-form-grid" style="display:flex; flex-direction:column; gap:1.75rem;">
            
            <!-- 1. Customer Name Row (Disabled/Locked for Safety - Prevents Accidental Client Switching) -->
            <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:flex-start;">
              <label style="font-size:0.88rem; font-weight:600; color:#DC2626; padding-top:6px;">
                Customer Name*
              </label>
              <div>
                <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap;">
                  
                  <!-- Locked / Disabled Customer Select Field (Prevents accidental client change) -->
                  <div class="zoho-customer-disabled-wrap" style="position:relative; width:440px; cursor:not-allowed;" title="Customer cannot be changed for an existing subscription">
                    <select id="zoho-sub-client-select" class="zoho-select-dropdown" disabled style="width:100%; font-size:0.86rem; border:1px solid #CBD5E1; background:#F8FAFC; color:#334155; cursor:not-allowed; padding:7px 12px; border-radius:4px;" title="Customer cannot be changed for an existing subscription">
                      <option value="${currClient.id}" selected>
                        ${escapeHtml(currClient.name || 'Client #' + currClient.id)} - ${escapeHtml(currClient.email || '')}
                      </option>
                    </select>
                  </div>

                  <!-- Quick Search Glass Button (Disabled / Muted) -->
                  <button type="button" class="zoho-btn-search" disabled style="background:#94A3B8; border:1px solid #94A3B8; border-radius:4px; padding:0.45rem 0.75rem; color:#FFFFFF; cursor:not-allowed; opacity:0.75;" title="Customer cannot be changed for an existing subscription">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </button>

                  <!-- Currency Pill (Screenshot 1) -->
                  <span class="zoho-currency-pill" style="background:#FFFFFF; border:1px solid #CBD5E1; color:#111827; border-radius:4px; padding:3px 9px; font-size:0.8rem; font-weight:600; display:inline-flex; align-items:center; gap:5px;">
                    <span style="display:inline-flex; align-items:center; justify-content:center; width:12px; height:12px; border-radius:50%; border:2px solid #10B981; box-sizing:border-box;"><span style="width:4px; height:4px; background:#10B981; border-radius:50%;"></span></span> ${currClient.currency_type || 'INR'}
                  </span>

                </div>

                <!-- Addresses Cards (Screenshot 1: Billing & Shipping Address with Interactive Popovers) -->
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:2.5rem; max-width:620px; margin-top:1.25rem;">
                  <!-- Billing Address Card Container -->
                  <div class="zoho-addr-card-wrap" style="font-size:0.85rem; color:#374151; line-height:1.45; position:relative;">
                    <div style="display:flex; align-items:center; gap:6px; font-size:0.75rem; font-weight:700; color:#6B7280; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.4rem;">
                      <span>BILLING ADDRESS</span>
                      <span class="zoho-addr-trigger" style="cursor:pointer; display:inline-flex; align-items:center;" title="Edit Billing Address" onclick="event.stopPropagation(); window.smatApp.toggleAddressPopover('billing', event)">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </span>
                    </div>
                    <div id="zoho-billing-display-addr">
                      <div style="font-weight:700; color:#111827;">${escapeHtml(bAddress.company || currClient.company_name || 'feso')}</div>
                      <div>${escapeHtml(bAddress.line1 || 'test')}</div>
                      <div>${escapeHtml(bAddress.line2 || 'test')}</div>
                      <div>${escapeHtml(bAddress.city || 'Hyderabad')} ${escapeHtml(bAddress.pin || '500034')}</div>
                      <div>${escapeHtml(bAddress.country || 'India')}</div>
                    </div>

                    <!-- Dropdown Popover on Pencil Click (Exact Match to Screenshot 1) -->
                    <div id="zoho-addr-popover-billing" class="zoho-addr-popover" style="display:none; position:absolute; top:24px; left:0; z-index:1100; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:8px; box-shadow:0 10px 25px rgba(0,0,0,0.15); padding:10px; width:290px;">
                      <!-- Highlighted Address Card with Pencil (Screenshot 1) -->
                      <div style="background:#EEF2F6; border-radius:6px; padding:12px 14px; position:relative; font-size:0.84rem; color:#374151; line-height:1.45; margin-bottom:10px;">
                        <button type="button" onclick="event.stopPropagation(); window.smatApp.openEditAddressModal('billing')" style="position:absolute; top:10px; right:10px; width:26px; height:26px; border-radius:4px; border:1px solid #D1D5DB; background:#FFFFFF; color:#2563EB; display:inline-flex; align-items:center; justify-content:center; cursor:pointer;" title="Edit address">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </button>
                        <div style="font-weight:700; color:#111827;">${escapeHtml(bAddress.company || currClient.company_name || 'feso')}</div>
                        <div>${escapeHtml(bAddress.line1 || 'test')}</div>
                        <div>${escapeHtml(bAddress.line2 || 'test')}</div>
                        <div>${escapeHtml(bAddress.city || 'Hyderabad')}</div>
                        <div>${escapeHtml(bAddress.country || 'India')} , ${escapeHtml(bAddress.pin || '500034')}</div>
                      </div>
                      <!-- Add New Address Button (Screenshot 1) -->
                      <div style="padding:4px 6px;">
                        <button type="button" onclick="event.stopPropagation(); window.smatApp.openEditAddressModal('billing', true)" style="display:inline-flex; align-items:center; gap:6px; color:#2563EB; font-weight:600; font-size:0.84rem; background:none; border:none; cursor:pointer; padding:0;">
                          <span style="font-size:1.05rem; line-height:1;">⊕</span> New address
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Shipping Address Card Container -->
                  <div class="zoho-addr-card-wrap" style="font-size:0.85rem; color:#374151; line-height:1.45; position:relative;">
                    <div style="display:flex; align-items:center; gap:6px; font-size:0.75rem; font-weight:700; color:#6B7280; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.4rem;">
                      <span>SHIPPING ADDRESS</span>
                      <span class="zoho-addr-trigger" style="cursor:pointer; display:inline-flex; align-items:center;" title="Edit Shipping Address" onclick="event.stopPropagation(); window.smatApp.toggleAddressPopover('shipping', event)">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </span>
                    </div>
                    <div id="zoho-shipping-display-addr">
                      ${hasShipping ? `
                        <div style="font-weight:700; color:#111827;">${escapeHtml(sAddress.company || currClient.name)}</div>
                        <div>${escapeHtml(sAddress.line1 || '')}</div>
                        <div>${escapeHtml(sAddress.line2 || '')}</div>
                        <div>${escapeHtml(sAddress.city || '')} ${escapeHtml(sAddress.pin || '')}</div>
                        <div>${escapeHtml(sAddress.country || 'India')}</div>
                      ` : `
                        <a href="javascript:void(0)" class="zoho-addr-trigger" onclick="event.stopPropagation(); window.smatApp.toggleAddressPopover('shipping', event)" style="color:#2563EB; text-decoration:none; font-size:0.84rem; font-weight:500;">New Address</a>
                      `}
                    </div>

                    <!-- Dropdown Popover on Pencil Click (Exact Match to Screenshot 2) -->
                    <div id="zoho-addr-popover-shipping" class="zoho-addr-popover" style="display:none; position:absolute; top:24px; left:0; z-index:1100; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:8px; box-shadow:0 10px 25px rgba(0,0,0,0.15); padding:10px; width:290px;">
                      <!-- Address Card (Screenshot 2: Bordered Card clickable to set address) -->
                      <div style="background:#FFFFFF; border:1px solid #E5E7EB; border-radius:6px; padding:12px 14px; position:relative; font-size:0.84rem; color:#374151; line-height:1.45; margin-bottom:10px; cursor:pointer;" onclick="window.smatApp.selectShippingAddress('billing')" title="Click to use this address for shipping">
                        <div style="font-weight:700; color:#111827;">${escapeHtml(bAddress.company || currClient.company_name || 'feso')}</div>
                        <div>${escapeHtml(bAddress.line1 || 'test')}</div>
                        <div>${escapeHtml(bAddress.line2 || 'test')}</div>
                        <div>${escapeHtml(bAddress.city || 'Hyderabad')}</div>
                        <div>${escapeHtml(bAddress.country || 'India')} , ${escapeHtml(bAddress.pin || '500034')}</div>
                      </div>
                      <!-- Add New Address Button (Screenshot 2) -->
                      <div style="padding:4px 6px;">
                        <button type="button" onclick="event.stopPropagation(); window.smatApp.openEditAddressModal('shipping', true)" style="display:inline-flex; align-items:center; gap:6px; color:#2563EB; font-weight:600; font-size:0.84rem; background:none; border:none; cursor:pointer; padding:0;">
                          <span style="font-size:1.05rem; line-height:1;">⊕</span> New address
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2. E-MAIL TO & Direct Phone Details (Exact Match to Screenshot 2) -->
            <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:center;">
              <label style="font-size:0.85rem; font-weight:600; color:#4B5563;">
                E-MAIL TO
              </label>
              <div style="display:flex; align-items:center; gap:0.85rem; flex-wrap:wrap;">
                <!-- Dashed New Contact Person Button (Screenshot 2 Match) -->
                <button type="button" class="zoho-btn-new-contact" onclick="window.smatApp.openAddContactPersonModal()" style="display:inline-flex; align-items:center; gap:6px; color:#1E293B; font-weight:500; font-size:0.84rem; background:#FFFFFF; border:1px dashed #CBD5E1; border-radius:4px; padding:5px 12px; cursor:pointer;">
                  <span style="color:#2563EB; font-size:0.95rem;">⊕</span> New Contact Person
                </button>

                <!-- Customer Primary Email Checkbox Card (Screenshot 2 Match) -->
                <label style="display:inline-flex; align-items:center; gap:6px; font-size:0.85rem; color:#111827; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:4px; padding:5px 12px; cursor:pointer;">
                  <input type="checkbox" checked style="accent-color:#2563EB; width:15px; height:15px;" />
                  <span>${escapeHtml(currClient.email)}</span>
                </label>

                <!-- Additional Contact Persons Added Dynamically -->
                ${(currClient.contact_persons || []).map(cp => `
                  <label style="display:inline-flex; align-items:center; gap:6px; font-size:0.85rem; color:#111827; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:4px; padding:5px 12px; cursor:pointer;">
                    <input type="checkbox" checked style="accent-color:#2563EB; width:15px; height:15px;" />
                    <span>${escapeHtml(cp.name ? cp.name + ' (' + cp.email + ')' : cp.email)}</span>
                  </label>
                `).join('')}

                
              </div>
            </div>

            <!-- 3. GST Details Row (Screenshot 1: Billing & Shipping Recipient) -->
            <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:flex-start;">
              <div></div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:2.5rem; max-width:620px; font-size:0.83rem;">
                <!-- Billing Recipient GST Details -->
                <div>
                  <div style="display:flex; align-items:center; gap:6px; font-size:0.75rem; font-weight:700; color:#6B7280; text-transform:uppercase; margin-bottom:0.35rem;">
                    <span>BILLING RECIPIENT GST DETAILS</span>
                  </div>
                  <div style="color:#374151; position:relative;" class="zoho-gst-pref-wrap">
                    GST Treatment: <span id="zoho-gst-treatment-display" style="font-weight:600; color:#111827;">${escapeHtml(currClient.gst_treatment || 'Unregistered Business')}</span>
                    <span class="zoho-gst-pref-trigger" onclick="event.stopPropagation(); window.smatApp.toggleGstPreferencesPopover(event)" style="cursor:pointer; display:inline-flex; align-items:center; margin-left:4px;" title="Configure Tax Preferences">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </span>

                    <!-- Configure Tax Preferences Popover (Screenshot 1 Match) -->
                    <div id="zoho-gst-pref-popover" class="zoho-gst-pref-popover" style="display:none; position:absolute; bottom:calc(100% + 10px); left:-10px; z-index:9999; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:8px; box-shadow:0 12px 30px rgba(0,0,0,0.18); width:325px; padding:14px 16px;">
                      <!-- Bottom-pointing triangle arrow -->
                      <div style="position:absolute; bottom:-6px; left:85px; width:10px; height:10px; background:#FFFFFF; border-right:1px solid #E5E7EB; border-bottom:1px solid #E5E7EB; transform:rotate(45deg);"></div>

                      <!-- Header with Red Close Button -->
                      <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:8px; border-bottom:1px solid #E5E7EB; margin-bottom:12px;">
                        <div style="font-size:0.95rem; font-weight:600; color:#1E293B;">Configure Tax Preferences</div>
                        <button type="button" onclick="event.stopPropagation(); window.smatApp.closeGstPreferencesPopover()" style="border:none; background:none; color:#EF4444; font-size:1.15rem; font-weight:700; cursor:pointer; line-height:1; padding:0 2px;" title="Close">✕</button>
                      </div>

                      <!-- GST Treatment Searchable Dropdown (Screenshots 1 - 5 Match) -->
                      <div style="position:relative; margin-bottom:12px;">
                        <label style="display:block; font-size:0.83rem; font-weight:500; color:#4B5563; margin-bottom:5px;">GST Treatment</label>
                        <div id="zoho-gst-treatment-trigger" onclick="window.smatApp.toggleGstTreatmentDropdown(event)" style="display:flex; justify-content:space-between; align-items:center; width:100%; border:1.5px solid #3B82F6; border-radius:6px; padding:6px 10px; font-size:0.86rem; color:#1E293B; background:#FFFFFF; cursor:pointer; box-sizing:border-box;">
                          <span id="zoho-gst-treatment-display-val">${currClient.gst_treatment || 'Unregistered Business'}</span>
                          <svg id="zoho-gst-treatment-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transition:transform 0.2s;"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                        <input type="hidden" id="zoho-gst-treatment-input" value="${currClient.gst_treatment || 'Unregistered Business'}" />

                        <!-- Searchable Popover Dropdown (Screenshots 1 - 4 Match) -->
                        <div id="zoho-gst-treatment-dropdown" class="zoho-gst-treatment-popover" style="display:none; position:absolute; top:calc(100% + 4px); left:0; width:100%; z-index:10000; background:#FFFFFF; border:1px solid #CBD5E1; border-radius:6px; box-shadow:0 10px 25px rgba(0,0,0,0.18); padding:8px 0; overflow:hidden;">
                          <!-- Search Box -->
                          <div style="padding:4px 8px 8px 8px;">
                            <div style="position:relative; display:flex; align-items:center;">
                              <span style="position:absolute; left:9px; top:50%; transform:translateY(-50%); display:flex; align-items:center; pointer-events:none; color:#94A3B8;">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                              </span>
                              <input type="text" id="zoho-gst-treatment-search-input" placeholder="Search" oninput="window.smatApp.filterGstTreatments(this.value)" onclick="event.stopPropagation()" style="width:100%; border:1.5px solid #3B82F6; border-radius:4px; padding:6px 10px 6px 28px; font-size:0.84rem; color:#1E293B; outline:none; box-sizing:border-box;" />
                            </div>
                          </div>

                          <!-- Scrollable Options List -->
                          <div id="zoho-gst-treatment-options-list" style="max-height:210px; overflow-y:auto; padding:2px 0;">
                            ${ALL_GST_TREATMENTS.map(t => {
                              const isSel = t.title === (currClient.gst_treatment || 'Unregistered Business');
                              return `
                                <div class="zoho-treatment-option-item ${isSel ? 'selected' : ''}" onclick="event.stopPropagation(); window.smatApp.selectGstTreatment('${t.title.replace(/'/g, "\\'")}')">
                                  <div class="treatment-text-col">
                                    <span class="treatment-title">${t.title}</span>
                                    <span class="treatment-desc">${t.desc}</span>
                                  </div>
                                  ${isSel ? '<span class="zoho-treatment-check">✓</span>' : ''}
                                </div>
                              `;
                            }).join('')}
                          </div>
                        </div>
                      </div>

                      <!-- Make it permanent? Checkbox -->
                      <div style="margin-bottom:14px;">
                        <div style="font-size:0.85rem; font-weight:500; color:#1E293B; margin-bottom:6px;">Make it permanent?</div>
                        <label style="display:flex; align-items:flex-start; gap:8px; font-size:0.8rem; color:#4B5563; cursor:pointer; line-height:1.4;">
                          <input type="checkbox" id="zoho-gst-permanent-check" style="accent-color:#2563EB; width:15px; height:15px; margin-top:1px; flex-shrink:0;" />
                          <span>Use these settings for all future transactions of this customer.</span>
                        </label>
                      </div>

                      <!-- Actions -->
                      <div style="display:flex; gap:8px; padding-top:10px; border-top:1px solid #F1F5F9;">
                        <button type="button" onclick="event.stopPropagation(); window.smatApp.saveGstPreferences()" style="background:#2563EB; color:#FFFFFF; border:none; border-radius:4px; padding:6px 16px; font-size:0.84rem; font-weight:600; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,0.05);">Update</button>
                        <button type="button" onclick="event.stopPropagation(); window.smatApp.closeGstPreferencesPopover()" style="background:#FFFFFF; border:1px solid #D1D5DB; color:#374151; border-radius:4px; padding:6px 14px; font-size:0.84rem; font-weight:500; cursor:pointer;">Cancel</button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Shipping Recipient GST Details -->
                <div style="position:relative;" class="zoho-ship-gst-wrap">
                  <div style="display:flex; align-items:center; gap:6px; font-size:0.75rem; font-weight:700; color:#6B7280; text-transform:uppercase; margin-bottom:0.35rem;">
                    <span>SHIPPING RECIPIENT GST DETAILS</span>
                    <span class="zoho-ship-gst-trigger" onclick="event.stopPropagation(); window.smatApp.toggleShippingGstPopover(event)" style="cursor:pointer; display:inline-flex; align-items:center;" title="Edit Shipping GST">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </span>
                  </div>
                  <div style="color:#4B5563;">GSTIN: <span id="zoho-shipping-gstin-display" style="color:#111827; font-weight:500;">${escapeHtml(currClient.shipping_gstin || '')}</span></div>
                  <div style="color:#4B5563;">Business Legal Name: <span id="zoho-shipping-legal-name-display" style="color:#111827; font-weight:500;">${escapeHtml(currClient.shipping_legal_name || '')}</span></div>

                  <!-- Shipping Recipient GST Details Popover (Screenshot 1 Match) -->
                  <div id="zoho-ship-gst-popover" class="zoho-ship-gst-popover" style="display:none; position:absolute; bottom:calc(100% + 10px); left:-10px; z-index:9999; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:8px; box-shadow:0 12px 30px rgba(0,0,0,0.18); width:310px; padding:14px 16px;">
                    <!-- Bottom-pointing triangle arrow -->
                    <div style="position:absolute; bottom:-6px; left:160px; width:10px; height:10px; background:#FFFFFF; border-right:1px solid #E5E7EB; border-bottom:1px solid #E5E7EB; transform:rotate(45deg);"></div>

                    <!-- Header with Red Close Button -->
                    <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:8px; border-bottom:1px solid #E5E7EB; margin-bottom:12px;">
                      <div style="font-size:0.95rem; font-weight:600; color:#1E293B;">Shipping Recipient GST Details</div>
                      <button type="button" onclick="event.stopPropagation(); window.smatApp.closeShippingGstPopover()" style="border:none; background:none; color:#EF4444; font-size:1.15rem; font-weight:700; cursor:pointer; line-height:1; padding:0 2px;" title="Close">✕</button>
                    </div>

                    <!-- GSTIN and is Unregistered Person? -->
                    <div style="margin-bottom:12px;">
                      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                        <label style="font-size:0.83rem; font-weight:500; color:#4B5563;">GSTIN</label>
                        <label style="display:inline-flex; align-items:center; gap:5px; font-size:0.8rem; color:#4B5563; cursor:pointer;">
                          <input type="checkbox" id="zoho-ship-unregistered-check" style="accent-color:#2563EB; width:14px; height:14px;" onchange="window.smatApp.onShippingGstUnregChange(this.checked)" ${currClient.shipping_is_unregistered ? 'checked' : ''} />
                          <span>is Unregistered Person?</span>
                        </label>
                      </div>
                      <input type="text" id="zoho-ship-gstin-input" value="${escapeHtml(currClient.shipping_gstin || '')}" placeholder="" style="width:100%; border:1px solid #CBD5E1; border-radius:4px; padding:6px 10px; font-size:0.86rem; color:#1E293B; outline:none;" />
                    </div>

                    <!-- Business Legal Name -->
                    <div style="margin-bottom:12px;">
                      <label style="display:block; font-size:0.83rem; font-weight:500; color:#4B5563; margin-bottom:5px;">Business Legal Name</label>
                      <input type="text" id="zoho-ship-legal-name-input" value="${escapeHtml(currClient.shipping_legal_name || '')}" placeholder="" style="width:100%; border:1px solid #CBD5E1; border-radius:4px; padding:6px 10px; font-size:0.86rem; color:#1E293B; outline:none;" />
                    </div>

                    <!-- Business Trade Name -->
                    <div style="margin-bottom:14px;">
                      <label style="display:block; font-size:0.83rem; font-weight:500; color:#4B5563; margin-bottom:5px;">Business Trade Name</label>
                      <input type="text" id="zoho-ship-trade-name-input" value="${escapeHtml(currClient.shipping_trade_name || '')}" placeholder="" style="width:100%; border:1px solid #CBD5E1; border-radius:4px; padding:6px 10px; font-size:0.86rem; color:#1E293B; outline:none;" />
                    </div>

                    <!-- Actions -->
                    <div style="display:flex; gap:8px; padding-top:10px; border-top:1px solid #F1F5F9;">
                      <button type="button" onclick="event.stopPropagation(); window.smatApp.saveShippingGstPreferences()" style="background:#2563EB; color:#FFFFFF; border:none; border-radius:4px; padding:6px 16px; font-size:0.84rem; font-weight:600; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,0.05);">Update</button>
                      <button type="button" onclick="event.stopPropagation(); window.smatApp.closeShippingGstPopover()" style="background:#FFFFFF; border:1px solid #D1D5DB; color:#374151; border-radius:4px; padding:6px 14px; font-size:0.84rem; font-weight:500; cursor:pointer;">Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 4. Place of Supply* (Exact Match to User Reference Screenshots 1 - 5) -->
            <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:center;">
              <label style="font-size:0.88rem; font-weight:600; color:#DC2626;">
                Place of Supply*
              </label>
              <div style="position:relative; width:100%; max-width:320px;">
                <!-- Hidden select for compatibility -->
                <select id="zoho-sub-supply-state" style="display:none;">
                  ${ALL_SUPPLY_STATES.map(s => `
                    <option value="${s.code}" ${s.code === zohoSelectedSupplyState ? 'selected' : ''}>[${s.code}] - ${s.name}</option>
                  `).join('')}
                </select>

                <!-- Trigger box displaying currently selected state -->
                <div id="zoho-supply-state-trigger" class="zoho-supply-trigger" onclick="event.stopPropagation(); window.smatApp.toggleSupplyStateDropdown(event)" style="border:1px solid #CBD5E1; border-radius:4px; padding:7px 12px; font-size:0.86rem; color:#1E293B; background:#FFFFFF; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                  <span id="zoho-supply-state-display">[${zohoSelectedSupplyState}] - ${(ALL_SUPPLY_STATES.find(s => s.code === zohoSelectedSupplyState) || { name: 'Telangana' }).name}</span>
                  <span style="font-size:0.75rem; color:#6B7280;">⌄</span>
                </div>

                <!-- Searchable Dropdown Popover (Exact Match to Screenshots 1 - 5) -->
                <div id="zoho-supply-state-popover" class="zoho-supply-popover" style="display:none; position:absolute; bottom:calc(100% + 4px); top:auto; left:0; width:100%; z-index:99999; background:#FFFFFF; border:1px solid #CBD5E1; border-radius:6px; box-shadow:0 -8px 25px rgba(0,0,0,0.15); padding:8px 0; overflow:hidden;">
                  <!-- Search input with magnifying glass (Screenshot Match) -->
                  <div style="padding:4px 10px 8px 10px; border-bottom:1px solid #F1F5F9;">
                    <div style="position:relative; display:flex; align-items:center;">
                      <span style="position:absolute; left:10px; color:#9CA3AF; display:inline-flex; align-items:center;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                      </span>
                      <input type="text" id="zoho-supply-search-input" placeholder="Search" oninput="window.smatApp.filterSupplyStates(this.value)" onclick="event.stopPropagation()" style="width:100%; border:1.5px solid #3B82F6; border-radius:4px; padding:6px 10px 6px 30px; font-size:0.84rem; color:#1E293B; outline:none;" />
                    </div>
                  </div>

                  <!-- Scrollable Options List -->
                  <div id="zoho-supply-options-list" style="max-height:220px; overflow-y:auto; padding:4px 0;">
                    ${ALL_SUPPLY_STATES.map(s => {
                      const isSel = s.code === zohoSelectedSupplyState;
                      return `
                        <div class="zoho-supply-option-item ${isSel ? 'selected' : ''}" onclick="event.stopPropagation(); window.smatApp.selectSupplyState('${s.code}')">
                          <span>[${s.code}] - ${s.name}</span>
                          ${isSel ? '<span class="zoho-supply-check">✓</span>' : ''}
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              </div>
            </div>

            <!-- 5. Select Product* (Screenshot 1) -->
            <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:center;">
              <label style="font-size:0.88rem; font-weight:600; color:#DC2626;">
                Select Product*
              </label>
              <div style="font-weight:600; color:#111827; font-size:0.9rem;">
                SmatBot
              </div>
            </div>

          </div>

          <!-- SECTION 2: PLAN & ADDONS TABLE (SCREENSHOT 2) -->
          <div style="margin-top:2.5rem; padding-top:1.5rem; border-top:1px solid #E5E7EB;">
            
            <!-- Plan Header & Preferences (Exact Match to Screenshots 1 & 2) -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <h2 style="font-size:1.15rem; font-weight:700; color:#111827; margin:0;">Plan</h2>
              <div style="display:flex; align-items:center; gap:0.6rem;">
                <!-- Discount preference selector (Exact Match to User Screenshot) -->
                <div id="zoho-discount-pref-wrapper" style="position:relative; display:inline-block;">
                  <button type="button" id="zoho-discount-pref-trigger" onclick="event.stopPropagation(); window.smatApp.toggleDiscountPrefDropdown(event)" style="display:inline-flex; align-items:center; gap:6px; border:${(zohoDiscountPref === 'item-level' || zohoDiscountPref === 'transaction-level') ? '1.5px solid #3B82F6' : '1px solid #CBD5E1'}; box-shadow:${(zohoDiscountPref === 'item-level' || zohoDiscountPref === 'transaction-level') ? '0 0 0 2px rgba(59, 130, 246, 0.15)' : '0 1px 2px rgba(0,0,0,0.02)'}; border-radius:6px; padding:5px 10px; background:#FFFFFF; cursor:pointer; font-size:0.82rem; color:#374151; font-weight:500; transition:all 0.15s;">
                    <span style="color:#64748B; display:inline-flex; align-items:center;">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <circle cx="9.5" cy="9.5" r=".5" fill="currentColor"></circle>
                        <circle cx="14.5" cy="14.5" r=".5" fill="currentColor"></circle>
                      </svg>
                    </span>
                    <span id="zoho-discount-pref-label">${zohoDiscountPref === 'transaction-level' ? 'Transaction-Level' : (zohoDiscountPref === 'item-level' ? 'Item-Level' : 'No Discounts')}</span>
                    <span id="zoho-discount-pref-chevron" style="font-size:0.7rem; color:#6B7280; transition:transform 0.2s;">▾</span>
                  </button>

                  <!-- Native select kept for test compatibility & state change -->
                  <select id="zoho-sub-discount-pref" onchange="window.smatApp.onZohoDiscountPrefChange(this.value)" style="display:none;">
                    <option value="no-discount" ${zohoDiscountPref === 'no-discount' ? 'selected' : ''}>No Discounts</option>
                    <option value="item-level" ${zohoDiscountPref === 'item-level' ? 'selected' : ''}>(%) Item-Level Discount</option>
                    <option value="transaction-level" ${zohoDiscountPref === 'transaction-level' ? 'selected' : ''}>Entity-Level Discount</option>
                  </select>

                  <!-- Popover Dropdown (Exact Match to User Screenshot) -->
                  <div id="zoho-discount-pref-popover" class="zoho-discount-popover" style="display:none; position:absolute; top:calc(100% + 4px); left:0; width:210px; background:#FFFFFF; border:1px solid #E2E8F0; border-radius:8px; box-shadow:0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1); z-index:99999; padding:8px 6px;">
                    <!-- Search Input (Search icon + input inside blue outlined rounded box) -->
                    <div style="padding:0 4px 8px 4px;">
                      <div style="display:flex; align-items:center; gap:6px; border:1.5px solid #3B82F6; border-radius:6px; padding:5px 8px; background:#FFFFFF; box-shadow:0 0 0 2px rgba(59,130,246,0.15);">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input type="text" id="zoho-discount-pref-search" placeholder="Search" oninput="window.smatApp.filterDiscountPrefOptions(this.value)" style="border:none; outline:none; font-size:0.82rem; width:100%; color:#1E293B; background:transparent; padding:0;" />
                      </div>
                    </div>

                    <!-- Category Title -->
                    <div style="padding:2px 8px 6px 8px; font-size:0.8rem; font-weight:700; color:#475569;">
                      Discount Preference
                    </div>

                    <!-- List of Options -->
                    <div id="zoho-discount-pref-list" style="display:flex; flex-direction:column; gap:2px;">
                    </div>
                  </div>
                </div>

                <!-- Renewal frequency selector (Disabled as specified in Zoho Reference) -->
                <select id="zoho-sub-renewal-freq" disabled style="border:1px solid #E2E8F0; border-radius:6px; padding:6px 12px; font-size:0.82rem; color:#64748B; background:#F8FAFC; outline:none; cursor:not-allowed; opacity:0.85; font-weight:500;" title="Renewal frequency is set to Every Renewal">
                  <option value="every-renewal" selected>Every Renewal</option>
                  <option value="one-time">One-Time Only</option>
                </select>
              </div>
            </div>

            <!-- Plan Table (Screenshot 2) -->
            <div style="border:1px solid #E5E7EB; border-radius:6px; overflow:visible; position:relative; z-index:30; margin-bottom:2rem; background:#FFFFFF;">
              <table style="width:100%; border-collapse:collapse; font-size:0.85rem;">
                <thead>
                  <tr style="background:#F9FAFB; border-bottom:1px solid #E5E7EB; color:#6B7280; font-size:0.75rem; font-weight:700; text-transform:uppercase;">
                    <th class="zoho-th-plan-name" style="padding:0.65rem 1rem; text-align:left; width:${zohoDiscountPref === 'item-level' ? '34%' : '40%'};">PLAN NAME</th>
                    <th class="zoho-th-plan-qty" style="padding:0.65rem 0.75rem; text-align:center; width:${zohoDiscountPref === 'item-level' ? '12%' : '15%'};">QUANTITY</th>
                    <th class="zoho-th-plan-price" style="padding:0.65rem 0.75rem; text-align:right; width:${zohoDiscountPref === 'item-level' ? '14%' : '15%'};">PRICE</th>
                    <th class="zoho-col-discount" style="padding:0.65rem 0.75rem; text-align:center; width:14%; display:${zohoDiscountPref === 'item-level' ? 'table-cell' : 'none'};">DISCOUNT</th>
                    <th class="zoho-th-plan-tax" style="padding:0.65rem 0.75rem; text-align:left; width:${zohoDiscountPref === 'item-level' ? '13%' : '15%'};">TAX</th>
                    <th class="zoho-th-plan-amount" style="padding:0.65rem 1rem; text-align:right; width:${zohoDiscountPref === 'item-level' ? '13%' : '15%'};">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="zoho-plan-table-row" style="border-bottom:1px solid #F3F4F6; vertical-align:top;" id="zoho-plan-row">
                    
                    <!-- Plan Thumbnail & Name & SAC Badge (Dynamic Searchable Dropdown) -->
                    <td id="zoho-plan-name-cell" style="padding:1rem;">
                      ${renderZohoPlanNameCell(zohoSelectedPlan)}
                    </td>

                    <!-- Quantity -->
                    <td style="padding:1rem 0.75rem; text-align:center;">
                      <input type="number" id="zoho-plan-qty" value="1" min="1" style="width:55px; text-align:center; border:1px solid #D1D5DB; border-radius:4px; padding:4px; font-size:0.85rem;" oninput="window.smatApp.updateZohoSubCalculations()" />
                    </td>

                    <!-- Price -->
                    <td style="padding:1rem 0.75rem; text-align:right;">
                      <input type="number" id="zoho-plan-price" value="${matchedPlan.price}" style="width:85px; text-align:right; border:1px solid #D1D5DB; border-radius:4px; padding:4px; font-size:0.85rem;" oninput="window.smatApp.updateZohoSubCalculations()" />
                    </td>

                    <!-- Point 1: Plan Discount (% / ₹) (Screenshots 1 & 2) -->
                    <td class="zoho-col-discount" style="padding:1rem 0.75rem; text-align:center; display:${zohoDiscountPref === 'item-level' ? 'table-cell' : 'none'};">
                      <div style="display:inline-flex; align-items:center; gap:2px; border:1px solid #D1D5DB; border-radius:4px; padding:1px 4px; background:#FFFFFF;">
                        <input type="number" id="zoho-plan-disc-val" value="0" min="0" style="width:45px; border:none; text-align:center; font-size:0.85rem; outline:none;" oninput="window.smatApp.updateZohoSubCalculations()" />
                        <select id="zoho-plan-disc-type" style="border:none; background:none; font-size:0.8rem; color:#4B5563; outline:none; cursor:pointer;" onchange="window.smatApp.updateZohoSubCalculations()">
                          <option value="percent">% ⌄</option>
                          <option value="flat">₹ ⌄</option>
                        </select>
                      </div>
                    </td>

                    <!-- Tax: Custom Searchable Dropdown (Screenshots 2, 3, 4 Match) -->
                    <td style="padding:1rem 0.75rem; position:relative;">
                      <div id="zoho-plan-tax-wrapper" style="position:relative; width:100%; min-width:130px;">
                        <button type="button" id="zoho-plan-tax-trigger" onclick="event.stopPropagation(); window.smatApp.togglePlanTaxDropdown(event)" style="display:flex; align-items:center; justify-content:space-between; width:100%; border:1px solid #CBD5E1; border-radius:4px; padding:5px 8px; background:#FFFFFF; font-size:0.82rem; color:#1E293B; cursor:pointer; text-align:left; transition:all 0.15s; user-select:none;">
                          <span id="zoho-plan-tax-label" style="font-weight:500;">${zohoSelectedPlanTaxLabel || 'GST18 [18%]'}</span>
                          <span id="zoho-plan-tax-chevron" style="color:#2563EB; font-size:0.75rem; margin-left:4px; display:inline-flex; align-items:center; transition:transform 0.2s;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                          </span>
                        </button>
                        <input type="hidden" id="zoho-plan-tax" value="${zohoSelectedPlanTaxRate !== undefined ? zohoSelectedPlanTaxRate : 18}" />

                        <!-- Searchable Popover Dropdown (Screenshots 3 & 4 Match) -->
                        <div id="zoho-plan-tax-popover" class="zoho-tax-popover" style="display:none; position:absolute; top:calc(100% + 4px); left:0; width:260px; z-index:99999; background:#FFFFFF; border:1px solid #CBD5E1; border-radius:6px; box-shadow:0 12px 28px rgba(0,0,0,0.18); overflow:hidden; text-align:left;">
                          <!-- Search Bar (Screenshot 3 Match) -->
                          <div style="padding:8px 10px 6px 10px; border-bottom:1px solid #F1F5F9;">
                            <div style="display:flex; align-items:center; gap:6px; border:1.5px solid #3B82F6; border-radius:5px; padding:4px 8px; background:#FFFFFF;">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                              <input type="text" id="zoho-plan-tax-search" placeholder="Search" oninput="window.smatApp.filterPlanTaxes(this.value)" style="border:none; outline:none; font-size:0.82rem; width:100%; color:#1E293B; background:transparent;" />
                            </div>
                          </div>

                          <!-- Categories & Items (Screenshots 3 & 4 Match) -->
                          <div id="zoho-plan-tax-list" style="max-height:220px; overflow-y:auto; padding:4px 6px;"></div>

                          <!-- Fixed Bottom Action: New Tax (Screenshots 3 & 4 Match) -->
                          <div style="border-top:1px solid #F1F5F9; padding:8px 12px; background:#FFFFFF;">
                            <div onclick="event.stopPropagation(); window.smatApp.addNewPlanTax()" style="display:inline-flex; align-items:center; gap:6px; color:#2563EB; font-size:0.82rem; font-weight:600; cursor:pointer; user-select:none;">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="#2563EB"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
                              <span>New Tax</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>

                    <!-- Live Amount & Row Actions (··· on hover - Screenshot 1, 2, 3 Match) -->
                    <td style="padding:1rem; text-align:right; white-space:nowrap; position:relative;">
                      <div style="display:inline-flex; align-items:center; justify-content:flex-end; gap:0.45rem;">
                        <div style="text-align:right;" id="zoho-plan-row-amount">
                          <div style="font-weight:700; color:#111827; font-size:0.92rem;">Rs. ${(zohoSelectedPlan ? zohoSelectedPlan.price : matchedPlan.price).toLocaleString('en-IN')}.00</div>
                          <div style="font-size:0.74rem; color:#6B7280; margin-top:2px;">${zohoSelectedPlan ? zohoSelectedPlan.cycle : matchedPlan.cycle}</div>
                        </div>
                        <div id="zoho-plan-actions-wrap" class="zoho-plan-row-actions" style="position:relative;">
                          <button type="button" id="zoho-plan-more-btn" class="zoho-btn-row-more zoho-more-trigger" onclick="event.stopPropagation(); window.smatApp.togglePlanMoreTooltip(event)" title="More options">···</button>

                          <!-- Dark Tooltip Bubble (Screenshot 3 Match) -->
                          <div id="zoho-plan-more-tooltip" class="zoho-more-popover" onclick="event.stopPropagation(); window.smatApp.showPlanAdditionalInfo()" style="display:none; position:absolute; right:calc(100% + 10px); top:50%; transform:translateY(-50%); z-index:9999; background:#1E293B; color:#FFFFFF; border-radius:6px; padding:7px 12px; font-size:0.78rem; font-weight:500; white-space:nowrap; box-shadow:0 8px 20px rgba(0,0,0,0.25); cursor:pointer;" title="Click to show additional information">
                            <!-- Right-pointing triangle arrow -->
                            <div style="position:absolute; right:-5px; top:50%; transform:translateY(-50%); width:0; height:0; border-top:5px solid transparent; border-bottom:5px solid transparent; border-left:5px solid #1E293B;"></div>
                            Click here to add additional information for this item.
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <!-- Additional Information Row: Select an account (Screenshot 2 Match) -->
                  <tr id="zoho-plan-additional-info-row" style="background:#FAFBFD; border-bottom:1px solid #E5E7EB;">
                    <td colspan="6" style="padding:10px 1.5rem 12px 1.5rem; position:relative;">
                      <div style="position:relative; display:inline-block;">
                        <!-- Select an account trigger button -->
                        <div id="zoho-plan-account-trigger" onclick="event.stopPropagation(); window.smatApp.togglePlanAccountDropdown(event)" style="display:inline-flex; align-items:center; gap:6px; border:1px solid #CBD5E1; border-radius:4px; padding:5px 10px; font-size:0.82rem; color:#475569; background:#FFFFFF; cursor:pointer; transition:all 0.15s; user-select:none;">
                          <span style="color:#64748B; display:inline-flex; align-items:center;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#64748B"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
                          </span>
                          <span id="zoho-plan-account-label">${zohoSelectedPlanAccount || 'Select an account'}</span>
                          <span id="zoho-plan-account-chevron" style="font-size:0.7rem; color:#6B7280; transition:transform 0.2s;">▾</span>
                        </div>

                        <!-- Searchable Drop-up Menu (Exact Match to Screenshots 3 - 5 & Subsequent Screenshots) -->
                        <div id="zoho-plan-account-dropdown" class="zoho-account-dropup-popover" style="display:none; position:absolute; bottom:calc(100% + 6px); left:0; width:250px; max-height:280px; z-index:99999; background:#FFFFFF; border:1px solid #CBD5E1; border-radius:6px; box-shadow:0 -8px 25px rgba(0,0,0,0.18); overflow:hidden;">
                          <!-- Search Box -->
                          <div style="padding:6px 8px; border-bottom:1px solid #F1F5F9;">
                            <div style="position:relative; display:flex; align-items:center;">
                              <span style="position:absolute; left:8px; top:50%; transform:translateY(-50%); display:flex; align-items:center; pointer-events:none; color:#94A3B8;">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                              </span>
                              <input type="text" id="zoho-plan-account-search" placeholder="Search" oninput="window.smatApp.filterPlanAccounts(this.value)" onclick="event.stopPropagation()" style="width:100%; border:1.5px solid #3B82F6; border-radius:4px; padding:5px 8px 5px 26px; font-size:0.82rem; color:#1E293B; outline:none; box-sizing:border-box;" />
                            </div>
                          </div>

                          <!-- Scrollable Accounts List -->
                          <div id="zoho-plan-account-list" style="max-height:225px; overflow-y:auto; padding:4px 0;">
                            <!-- Populated dynamically -->
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Addons Header (Screenshot 2) -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <h2 style="font-size:1.15rem; font-weight:700; color:#111827; margin:0;">Addons</h2>
            </div>

            <!-- Addons Table (Screenshot 2) -->
            <div style="border:1px solid #E5E7EB; border-radius:6px; overflow:visible; position:relative; z-index:20; margin-bottom:0.75rem; background:#FFFFFF;">
              <table style="width:100%; border-collapse:collapse; font-size:0.85rem;">
                <thead>
                  <tr style="background:#F9FAFB; border-bottom:1px solid #E5E7EB; color:#6B7280; font-size:0.75rem; font-weight:700; text-transform:uppercase;">
                    <th class="zoho-th-addon-name" style="padding:0.65rem 1rem; text-align:left; width:${zohoDiscountPref === 'item-level' ? '34%' : '40%'};">ADDON NAME</th>
                    <th class="zoho-th-addon-qty" style="padding:0.65rem 0.75rem; text-align:center; width:${zohoDiscountPref === 'item-level' ? '12%' : '15%'};">QUANTITY</th>
                    <th class="zoho-th-addon-price" style="padding:0.65rem 0.75rem; text-align:right; width:${zohoDiscountPref === 'item-level' ? '14%' : '15%'};">PRICE</th>
                    <th class="zoho-col-discount" style="padding:0.65rem 0.75rem; text-align:center; width:14%; display:${zohoDiscountPref === 'item-level' ? 'table-cell' : 'none'};">DISCOUNT</th>
                    <th class="zoho-th-addon-tax" style="padding:0.65rem 0.75rem; text-align:left; width:${zohoDiscountPref === 'item-level' ? '13%' : '15%'};">TAX</th>
                    <th class="zoho-th-addon-amount" style="padding:0.65rem 1rem; text-align:right; width:${zohoDiscountPref === 'item-level' ? '13%' : '15%'};">AMOUNT</th>
                  </tr>
                </thead>
                <tbody id="zoho-addons-tbody">
                  ${zohoSubAddons.map((addon, idx) => {
                    const isRowEmpty = addon.isEmpty || !addon.name;
                    return `
                    <tr class="zoho-addon-table-row" style="border-bottom:1px solid #F3F4F6; vertical-align:top;" id="zoho-addon-row-${idx}">
                      <!-- Addon Name / Picker (Screenshot 1: Empty vs Populated) -->
                      <td style="padding:0.85rem 1rem;">
                        <div style="display:flex; gap:0.6rem; align-items:flex-start;">
                          <span style="color:#9CA3AF; cursor:grab; font-size:1.1rem; line-height:1; padding-top: ${isRowEmpty ? '8px' : '4px'};">⠿</span>
                          <div style="width:38px; height:38px; background:#F9FAFB; border:1px solid #E5E7EB; border-radius:4px; display:flex; align-items:center; justify-content:center; color:#9CA3AF; flex-shrink:0;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                          </div>
                          
                          ${isRowEmpty ? `
                            <!-- Empty Row: Blue border box with placeholder "Type or click to select an addon." (Screenshot 1) -->
                            <div style="flex:1; position:relative;">
                              <select id="zoho-addon-picker-${idx}" 
                                      style="width:100%; border:1.5px solid #3B82F6; box-shadow:0 0 0 1px rgba(59, 130, 246, 0.2); border-radius:4px; padding:0.6rem 0.75rem; font-size:0.85rem; color:#4B5563; outline:none; background:#FFFFFF; cursor:pointer;"
                                      onchange="window.smatApp.onZohoAddonChange(${idx}, this.value)">
                                <option value="" disabled selected hidden>Type or click to select an addon.</option>
                                ${AVAILABLE_ZOHO_ADDONS.map(a => `
                                  <option value="${escapeHtml(a.name)}">${escapeHtml(a.name)} (Rs. ${a.price.toLocaleString('en-IN')})</option>
                                `).join('')}
                              </select>
                            </div>
                          ` : `
                            <!-- Populated Row: Selected Addon (Screenshot 1 & Screenshot 2) -->
                            <div style="flex:1;">
                              <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                                <span style="font-weight:600; color:#111827; font-size:0.88rem;">${escapeHtml(addon.name)}</span>
                                <span class="zoho-addon-remove-btn" onclick="event.stopPropagation(); window.smatApp.removeZohoSubAddonRow(${idx})" style="color:#9CA3AF; cursor:pointer; display:inline-flex; align-items:center; transition:color 0.15s;" title="Remove Addon" onmouseover="this.style.color='#EF4444'" onmouseout="this.style.color='#9CA3AF'">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                  </svg>
                                </span>
                              </div>
                              <div style="background:#F9FAFB; border:1px solid #F3F4F6; border-radius:4px; padding:4px 8px; font-size:0.78rem; color:#4B5563; margin-bottom:6px;">
                                ${escapeHtml(addon.desc)}
                              </div>
                              <div class="zoho-sac-badge-wrap" style="position:relative; display:inline-flex; align-items:center; gap:5px;">
                                <span style="background:#059669; color:#FFFFFF; font-size:0.68rem; font-weight:700; padding:1px 5px; border-radius:3px; letter-spacing:0.3px;">SERVICE</span>
                                <span style="font-size:0.75rem; color:#2563EB; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:3px;" onclick="event.stopPropagation(); window.smatApp.toggleSacPopover('addon', ${idx}, event)" title="Click to edit SAC code">
                                  SAC: <span id="zoho-addon-sac-text-${idx}">${addon.sac || '998314'}</span>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                </span>

                                <!-- Top-pointed Popover (Exact Match to User Screenshot) -->
                                <div id="zoho-sac-popover-addon-${idx}" class="zoho-sac-popover" style="display:none; position:absolute; top:calc(100% + 8px); left:0; z-index:9999; background:#FFFFFF; border:1px solid #D1D5DB; border-radius:6px; box-shadow:0 12px 28px rgba(0,0,0,0.15); padding:12px 14px; min-width:280px; text-align:left;">
                                  <div style="position:absolute; top:-6px; left:48px; width:10px; height:10px; background:#FFFFFF; border-left:1px solid #E5E7EB; border-top:1px solid #E5E7EB; transform:rotate(45deg);"></div>
                                  <div style="font-size:0.84rem; font-weight:600; color:#374151; margin-bottom:8px;">SAC</div>
                                  <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
                                    <select id="zoho-sac-select-addon-${idx}" style="flex:1; border:1.5px solid #3B82F6; border-radius:4px; padding:6px 10px; font-size:0.86rem; color:#111827; outline:none; background:#FFFFFF; cursor:pointer;">
                                      <option value="998314" ${addon.sac === '998314' || !addon.sac ? 'selected' : ''}>998314</option>
                                      <option value="998313" ${addon.sac === '998313' ? 'selected' : ''}>998313 - IT Consulting & Support</option>
                                      <option value="998315" ${addon.sac === '998315' ? 'selected' : ''}>998315 - Hosting & Infrastructure</option>
                                      <option value="998319" ${addon.sac === '998319' ? 'selected' : ''}>998319 - Other IT Services</option>
                                      <option value="998311" ${addon.sac === '998311' ? 'selected' : ''}>998311 - Telecommunications</option>
                                    </select>
                                    <span style="color:#2563EB; cursor:pointer;" title="Search SAC Code">
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                    </span>
                                  </div>
                                  <div style="display:flex; align-items:center; gap:8px;">
                                    <button type="button" onclick="window.smatApp.saveSacCode('addon', ${idx})" style="background:#2563EB; color:#FFFFFF; border:none; border-radius:4px; padding:4px 14px; font-size:0.8rem; font-weight:600; cursor:pointer;">Save</button>
                                    <button type="button" onclick="window.smatApp.closeSacPopover('addon', ${idx})" style="background:#F3F4F6; color:#374151; border:1px solid #E5E7EB; border-radius:4px; padding:4px 12px; font-size:0.8rem; cursor:pointer;">Close</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          `}
                        </div>
                      </td>

                      <!-- Quantity (Screenshot 1: 1.00 for empty, 1 for filled) -->
                      <td style="padding:1rem 0.75rem; text-align:center;">
                        <input type="number" id="zoho-addon-qty-${idx}" value="${isRowEmpty ? '1.00' : addon.qty}" step="${isRowEmpty ? '0.01' : '1'}" min="1" style="width:60px; text-align:center; border:1px solid #D1D5DB; border-radius:4px; padding:4px; font-size:0.85rem;" oninput="window.smatApp.updateZohoSubCalculations()" />
                        ${!isRowEmpty && addon.unit ? `<div style="font-size:0.72rem; color:#6B7280; margin-top:4px;">${escapeHtml(addon.unit)}</div>` : ''}
                      </td>

                      <!-- Price (Screenshot 1: 0.00 for empty) -->
                      <td style="padding:1rem 0.75rem; text-align:right;">
                        <input type="number" id="zoho-addon-price-${idx}" value="${isRowEmpty ? '0.00' : addon.price}" step="0.01" style="width:75px; text-align:right; border:1px solid #D1D5DB; border-radius:4px; padding:4px; font-size:0.85rem;" oninput="window.smatApp.updateZohoSubCalculations()" />
                      </td>

                      <!-- Point 2: Add-on Discount (% / ₹) (Screenshot 1 & 2) -->
                      <td class="zoho-col-discount" style="padding:1rem 0.75rem; text-align:center; display:${zohoDiscountPref === 'item-level' ? 'table-cell' : 'none'};">
                        <div style="display:inline-flex; align-items:center; gap:2px; border:1px solid #D1D5DB; border-radius:4px; padding:1px 4px; background:#FFFFFF;">
                          <input type="number" id="zoho-addon-disc-val-${idx}" value="${addon.discountVal || 0}" min="0" style="width:40px; border:none; text-align:center; font-size:0.85rem; outline:none;" oninput="window.smatApp.updateZohoSubCalculations()" />
                          <select id="zoho-addon-disc-type-${idx}" style="border:none; background:none; font-size:0.8rem; color:#4B5563; outline:none; cursor:pointer;" onchange="window.smatApp.updateZohoSubCalculations()">
                            <option value="percent" ${addon.discountType === 'percent' ? 'selected' : ''}>% ⌄</option>
                            <option value="flat" ${addon.discountType === 'flat' ? 'selected' : ''}>₹ ⌄</option>
                          </select>
                        </div>
                      </td>

                      <!-- Tax: Custom Searchable Dropdown (Screenshots 1 & 2 Match) -->
                      <td style="padding:1rem 0.75rem; position:relative;">
                        <div id="zoho-addon-tax-wrapper-${idx}" style="position:relative; width:100%; min-width:130px;">
                          <button type="button" id="zoho-addon-tax-trigger-${idx}" onclick="event.stopPropagation(); window.smatApp.toggleAddonTaxDropdown(${idx}, event)" style="display:flex; align-items:center; justify-content:space-between; width:100%; border:1px solid #CBD5E1; border-radius:4px; padding:5px 8px; background:#FFFFFF; font-size:0.82rem; color:#1E293B; cursor:pointer; text-align:left; transition:all 0.15s; user-select:none;">
                            <span id="zoho-addon-tax-label-${idx}" style="font-weight:500;">${addon.taxLabel || (isRowEmpty ? 'Select a Tax' : 'GST18 [18%]')}</span>
                            <span id="zoho-addon-tax-chevron-${idx}" style="color:#2563EB; font-size:0.75rem; margin-left:4px; display:inline-flex; align-items:center; transition:transform 0.2s;">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </span>
                          </button>
                          <input type="hidden" id="zoho-addon-tax-${idx}" value="${addon.taxRate !== undefined ? addon.taxRate : (isRowEmpty ? 0 : 18)}" />

                          <!-- Searchable Popover Dropdown (Screenshots 1 & 2 Match) -->
                          <div id="zoho-addon-tax-popover-${idx}" class="zoho-tax-popover zoho-addon-tax-popover" style="display:none; position:absolute; top:calc(100% + 4px); left:0; width:260px; z-index:99999; background:#FFFFFF; border:1px solid #CBD5E1; border-radius:6px; box-shadow:0 12px 28px rgba(0,0,0,0.18); overflow:hidden; text-align:left;">
                            <!-- Search Bar (Screenshot 2 Match) -->
                            <div style="padding:8px 10px 6px 10px; border-bottom:1px solid #F1F5F9;">
                              <div style="display:flex; align-items:center; gap:6px; border:1.5px solid #3B82F6; border-radius:5px; padding:4px 8px; background:#FFFFFF;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                <input type="text" id="zoho-addon-tax-search-${idx}" placeholder="Search" oninput="window.smatApp.filterAddonTaxes(${idx}, this.value)" style="border:none; outline:none; font-size:0.82rem; width:100%; color:#1E293B; background:transparent;" />
                              </div>
                            </div>

                            <!-- Categories & Items (Screenshot 2 Match) -->
                            <div id="zoho-addon-tax-list-${idx}" style="max-height:220px; overflow-y:auto; padding:4px 6px;"></div>

                            <!-- Fixed Bottom Action: New Tax (Screenshot 2 Match) -->
                            <div style="border-top:1px solid #F1F5F9; padding:8px 12px; background:#FFFFFF;">
                              <div onclick="event.stopPropagation(); window.smatApp.addNewAddonTax(${idx})" style="display:inline-flex; align-items:center; gap:6px; color:#2563EB; font-size:0.82rem; font-weight:600; cursor:pointer; user-select:none;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#2563EB"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
                                <span>New Tax</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>

                      <!-- Live Amount & Far Right Row Actions (··· and ⓧ on hover - Screenshot 4 Match) -->
                      <td style="padding:1rem; text-align:right; white-space:nowrap; position:relative;">
                        <div style="display:inline-flex; align-items:center; justify-content:flex-end; gap:0.45rem;">
                          <div id="zoho-addon-amount-${idx}" style="font-weight:700; color:#111827; font-size:0.9rem;">
                            Rs. ${isRowEmpty ? '0.00' : (addon.price * addon.qty).toLocaleString('en-IN') + '.00'}
                          </div>
                          <div id="zoho-addon-actions-wrap-${idx}" class="zoho-addon-row-actions" style="position:relative;">
                            <button type="button" id="zoho-addon-more-btn-${idx}" class="zoho-btn-row-more zoho-more-trigger" onclick="event.stopPropagation(); window.smatApp.toggleAddonMoreMenu(${idx}, event)" title="More options">···</button>
                            <button type="button" class="zoho-btn-row-delete" onclick="window.smatApp.removeZohoSubAddonRow(${idx})" title="Delete row">✕</button>

                            <!-- Addon More Options Dropdown Menu (Screenshot 4 Match) -->
                            <div id="zoho-addon-more-menu-${idx}" class="zoho-more-popover zoho-addon-menu-dropdown" style="display:none; position:absolute; top:calc(100% + 6px); right:0; z-index:9999; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:6px; box-shadow:0 10px 25px rgba(0,0,0,0.15); width:210px; overflow:hidden; text-align:left; font-size:0.83rem;">
                              <div style="background:#2563EB; color:#FFFFFF; padding:9px 14px; font-weight:500; cursor:pointer;" onclick="window.smatApp.closeAllMorePopovers()">
                                Show Additional Information
                              </div>
                              <div style="padding:9px 14px; color:#374151; cursor:pointer; border-top:1px solid #F3F4F6;" onmouseover="this.style.background='#F9FAFB'" onmouseout="this.style.background='#FFFFFF'" onclick="window.smatApp.addZohoSubAddonRow(); window.smatApp.closeAllMorePopovers();">
                                Insert New Row
                              </div>
                              <div style="padding:9px 14px; color:#374151; cursor:pointer; border-top:1px solid #F3F4F6;" onmouseover="this.style.background='#F9FAFB'" onmouseout="this.style.background='#FFFFFF'" onclick="window.smatApp.closeAllMorePopovers()">
                                Insert New Header
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>

            <!-- Add New Row Button (Screenshot 3) -->
            <div style="margin-bottom:2rem;">
              <button type="button" class="btn-table-action btn-action-secondary" onclick="window.smatApp.addZohoSubAddonRow()" style="font-size:0.84rem; display:inline-flex; align-items:center; gap:6px; color:#2563EB;">
                <span>⊕ Add New Row</span>
                <span style="font-size:0.75rem;">⌄</span>
              </button>
            </div>

          </div>

          <!-- SECTION 2.5: COUPON TABLE (EXACT MATCH TO USER REFERENCE SCREENSHOT 1) -->
          <div style="margin-top:2rem; margin-bottom:2rem; padding-top:1.5rem; border-top:1px solid #E5E7EB;">
            <h2 style="font-size:1.1rem; font-weight:700; color:#111827; margin:0 0 0.75rem 0;">Coupon</h2>
            <div style="display:flex; align-items:center; gap:12px; max-width:850px;">
              <div style="flex:1; border:1px solid #E5E7EB; border-radius:6px; overflow:visible; background:#FFFFFF; position:relative;">
                <table style="width:100%; border-collapse:collapse; font-size:0.85rem;">
                  <thead>
                    <tr style="background:#F9FAFB; border-bottom:1px solid #E5E7EB; color:#6B7280; font-size:0.75rem; font-weight:700; text-transform:uppercase;">
                      <th style="padding:0.65rem 1rem; text-align:left; width:45%; border-right:1px solid #E5E7EB;">COUPON</th>
                      <th style="padding:0.65rem 1rem; text-align:left; width:33%; border-right:1px solid #E5E7EB;">COUPON CODE</th>
                      <th style="padding:0.65rem 1rem; text-align:left; width:22%;">VALUE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="vertical-align:middle; background:#FFFFFF;">
                      <!-- COUPON Searchable Dropdown / Input (Exact Match to User Screenshots) -->
                      <td style="padding:0.5rem 0.75rem; border-right:1px solid #E5E7EB; position:relative;">
                        <div id="zoho-coupon-search-wrapper" style="position:relative; width:100%;">
                          <button type="button" 
                                  id="zoho-coupon-trigger-btn"
                                  onclick="event.stopPropagation(); window.smatApp.toggleZohoCouponDropdown(event)"
                                  style="display:flex; align-items:center; justify-content:space-between; width:100%; border:1px solid #D1D5DB; border-radius:4px; padding:6px 10px; background:#FFFFFF; font-size:0.83rem; cursor:pointer; text-align:left; transition:border-color 0.15s, box-shadow 0.15s;">
                            <span id="zoho-coupon-selected-label" style="font-weight:${selectedZohoCoupon ? '600' : '400'}; color:${selectedZohoCoupon ? '#1E293B' : '#94A3B8'};">
                              ${selectedZohoCoupon ? escapeHtml(selectedZohoCoupon.name) : 'Enter at least 3 characters to search'}
                            </span>
                            <span id="zoho-coupon-chevron" style="color:#2563EB; font-size:0.75rem; margin-left:6px; display:inline-flex; align-items:center; transition:transform 0.2s;">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </span>
                          </button>

                          <!-- Coupon Search Popover / Dropdown (Screenshot Match with Search Header) -->
                          <div id="zoho-coupon-popover" class="zoho-coupon-popover" style="display:none; position:absolute; top:calc(100% + 4px); left:0; width:100%; min-width:320px; z-index:99999; background:#FFFFFF; border:1px solid #CBD5E1; border-radius:6px; box-shadow:0 12px 28px rgba(0,0,0,0.18); overflow:hidden; text-align:left;">
                            <!-- Search Header (Exact Match to Screenshot) -->
                            <div style="padding:8px 10px 6px 10px; border-bottom:1px solid #F1F5F9;">
                              <div style="display:flex; align-items:center; gap:6px; border:1.5px solid #3B82F6; border-radius:5px; padding:4px 8px; background:#FFFFFF;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                <input type="text" id="zoho-coupon-search-filter" placeholder="Search" oninput="window.smatApp.filterZohoCoupons(this.value)" style="border:none; outline:none; font-size:0.82rem; width:100%; color:#1E293B; background:transparent;" />
                              </div>
                            </div>

                            <!-- Scrollable Coupon Items List -->
                            <div id="zoho-coupon-results-list" style="max-height:220px; overflow-y:auto; padding:4px 6px;"></div>
                          </div>
                        </div>
                      </td>

                      <!-- COUPON CODE -->
                      <td style="padding:0.5rem 1rem; border-right:1px solid #E5E7EB;">
                        <input type="text" id="zoho-coupon-code-disp" readonly placeholder="" value="${selectedZohoCoupon ? escapeHtml(selectedZohoCoupon.code) : ''}" style="width:100%; border:none; outline:none; background:transparent; font-size:0.83rem; color:#1F2937;" />
                      </td>

                      <!-- VALUE -->
                      <td style="padding:0.5rem 1rem;">
                        <input type="text" id="zoho-coupon-value-disp" readonly placeholder="" value="${selectedZohoCoupon ? escapeHtml(selectedZohoCoupon.discount_value) : ''}" style="width:100%; border:none; outline:none; background:transparent; font-size:0.83rem; color:#1F2937;" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Red ✕ Clear / Delete Button (Screenshot 1 Match) -->
              <span id="zoho-coupon-clear-btn" 
                    onclick="window.smatApp.clearZohoCoupon()" 
                    title="Remove Coupon" 
                    style="color:#EF4444; font-size:1.1rem; font-weight:700; cursor:pointer; user-select:none; padding:4px 6px; transition:transform 0.15s; display:inline-flex; align-items:center; justify-content:center;"
                    onmouseover="this.style.transform='scale(1.15)'"
                    onmouseout="this.style.transform='scale(1)'">
                ✕
              </span>
            </div>
          </div>

          <!-- SECTION 3: SUBSCRIPTION TERM (EXACT USER SPECIFICATION) -->
          <div style="margin-top:2rem; padding-top:1.5rem; border-top:1px solid #E5E7EB;">
            <h2 style="font-size:1.15rem; font-weight:700; color:#111827; margin:0 0 1.25rem 0;">Subscription Term</h2>
            
            <div style="display:flex; flex-direction:column; gap:1.25rem; max-width:650px;">
              <!-- Subscription Number* -->
              <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:center;">
                <label style="font-size:0.88rem; font-weight:600; color:#DC2626;">Subscription Number*</label>
                <input type="text" id="zoho-sub-num" class="zoho-input-text" value="${escapeHtml(currClient.subscription_id || 'SUB-01083')}" style="width:100%; border:1px solid #D1D5DB; border-radius:4px; padding:0.45rem 0.75rem;" />
              </div>

              <!-- Salesperson -->
              <div style="display:grid; grid-template-columns:190px 1fr; gap:1.5rem; align-items:center;">
                <label style="font-size:0.85rem; font-weight:600; color:#4B5563;">Salesperson</label>
                <select id="zoho-sub-sales" class="zoho-select-dropdown" style="width:100%;">
                  <option value="">Select a salesperson</option>
                  <option value="Rahul Sharma" ${currClient.sales_person === 'Rahul Sharma' ? 'selected' : ''}>Rahul Sharma</option>
                  <option value="Sukanya Nagireddy" ${currClient.sales_person === 'Sukanya Nagireddy' ? 'selected' : ''}>Sukanya Nagireddy</option>
                  <option value="Kiran Kumar" ${currClient.sales_person === 'Kiran Kumar' ? 'selected' : ''}>Kiran Kumar</option>
                  <option value="Pooja Reddy" ${currClient.sales_person === 'Pooja Reddy' ? 'selected' : ''}>Pooja Reddy</option>
                  <option value="Amit Patel" ${currClient.sales_person === 'Amit Patel' ? 'selected' : ''}>Amit Patel</option>
                  <option value="Sameer Khan" ${currClient.sales_person === 'Sameer Khan' ? 'selected' : ''}>Sameer Khan</option>
                </select>
              </div>
            </div>
          </div>

          <!-- SECTION 5: POINT 3 LIVE FINAL BILLING SUMMARY CARD -->
          <div style="margin-top:2.5rem; background:#F0F7FF; border:1px solid #BFDBFE; border-radius:8px; padding:1.25rem 1.5rem; max-width:650px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <span style="font-size:0.92rem; font-weight:700; color:#1E40AF;">🧾 3. Live Final Billing Summary</span>
              <span style="font-size:0.75rem; color:#2563EB; background:#DBEAFE; padding:3px 8px; border-radius:4px; font-weight:600;">SAC: 998314 • GST 18%</span>
            </div>
            <div style="display:flex; flex-direction:column; gap:0.4rem; font-size:0.86rem; color:#374151;">
              <div style="display:flex; justify-content:space-between;">
                <span>Plan Price:</span>
                <span id="zoho-sum-plan-price" style="font-weight:600;">Rs. ${matchedPlan.price.toLocaleString('en-IN')}.00</span>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span>Add-on Boosters Subtotal:</span>
                <span id="zoho-sum-addons-price" style="font-weight:600;">+ Rs. 600.00</span>
              </div>
              <div style="display:flex; justify-content:space-between; color:#DC2626;">
                <span>Discounts Deducted (Plan & Add-on):</span>
                <span id="zoho-sum-disc-price" style="font-weight:600;">- Rs. 0.00</span>
              </div>
              <div style="display:flex; justify-content:space-between; padding-top:0.4rem; border-top:1px dashed #BFDBFE;">
                <span>Taxable Amount (Net Base):</span>
                <span id="zoho-sum-taxable-price" style="font-weight:600;">Rs. 2,490.00</span>
              </div>
              <div style="display:flex; justify-content:space-between; color:#4B5563;">
                <span>GST (18% Software Services):</span>
                <span id="zoho-sum-tax-price" style="font-weight:600;">+ Rs. 448.20</span>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; padding-top:0.6rem; margin-top:0.25rem; border-top:2px solid #93C5FD; font-size:1.02rem; font-weight:800; color:#1E3A8A;">
                <span>Customer Final Payable Amount:</span>
                <span id="zoho-sum-final-price" style="color:#1D4ED8; font-size:1.15rem;">Rs. 2,938.20</span>
              </div>
            </div>
          </div>

          <!-- SECTION 6: BOTTOM STICKY ACTION BAR (SCREENSHOT 4) -->
          <div style="display:flex; align-items:center; gap:0.75rem; margin-top:2.5rem; padding-top:1.5rem; border-top:1px solid #E5E7EB;">
            <button type="button" class="zoho-btn-continue" onclick="window.smatApp.saveZohoSubscription()" style="background:#1877F2; border:1px solid #1877F2; color:#FFFFFF; padding:0.6rem 2rem; border-radius:4px; font-weight:600; font-size:0.9rem; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,0.05);">
              Continue
            </button>
            <button type="button" class="zoho-btn-cancel" onclick="window.smatApp.navigateTo('subscriptions')" style="background:#FFFFFF; border:1px solid #D1D5DB; color:#374151; padding:0.6rem 1.5rem; border-radius:4px; font-weight:500; font-size:0.9rem; cursor:pointer;">
              Cancel
            </button>
          </div>

        </div>
      </div>
    `;

    updateZohoSubCalculations();
  }



  function renderPlanAccountOptions(filterText) {
    const container = document.getElementById('zoho-plan-account-list');
    if (!container) return;
    const query = (filterText || '').toLowerCase().trim();
    let html = '';

    ALL_ZOHO_ACCOUNTS.forEach(grp => {
      const matchingItems = grp.items.filter(it => {
        if (!query) return true;
        return it.name.toLowerCase().includes(query) || grp.group.toLowerCase().includes(query);
      });

      if (matchingItems.length > 0) {
        html += `<div class="zoho-account-group-header">${escapeHtml(grp.group)}</div>`;
        matchingItems.forEach(it => {
          if (it.isHeader) {
            html += `<div class="zoho-account-option-item header-only">${escapeHtml(it.name)}</div>`;
          } else if (it.isSub) {
            const isSel = it.name === zohoSelectedPlanAccount;
            html += `
              <div class="zoho-account-option-item sub-item ${isSel ? 'selected' : ''}" onclick="event.stopPropagation(); window.smatApp.selectPlanAccount('${it.name.replace(/'/g, "\\'")}')">
                <span class="sub-bullet">•</span> ${escapeHtml(it.name)}
              </div>
            `;
          } else {
            const isSel = it.name === zohoSelectedPlanAccount;
            html += `
              <div class="zoho-account-option-item ${isSel ? 'selected' : ''}" onclick="event.stopPropagation(); window.smatApp.selectPlanAccount('${it.name.replace(/'/g, "\\'")}')">
                ${escapeHtml(it.name)}
              </div>
            `;
          }
        });
      }
    });

    if (!html) {
      html = '<div style="padding:12px; text-align:center; color:#94A3B8; font-size:0.8rem;">No matching accounts found</div>';
    }

    container.innerHTML = html;
  }

  function showPlanAdditionalInfo() {
    const tooltip = document.getElementById('zoho-plan-more-tooltip');
    if (tooltip) tooltip.style.display = 'none';
    const row = document.getElementById('zoho-plan-additional-info-row');
    if (row) {
      row.style.display = 'table-row';
      row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function togglePlanAccountDropdown(evt) {
    if (evt) evt.stopPropagation();
    const dropdown = document.getElementById('zoho-plan-account-dropdown');
    const trigger = document.getElementById('zoho-plan-account-trigger');
    const chevron = document.getElementById('zoho-plan-account-chevron');
    if (!dropdown) return;
    const isCurrentlyOpen = dropdown.style.display === 'block';

    closeAllMorePopovers();
    closeGstPreferencesPopover();
    closeShippingGstPopover();
    closeSupplyStateDropdown();

    if (!isCurrentlyOpen) {
      dropdown.style.display = 'block';
      if (trigger) trigger.style.border = '1.5px solid #3B82F6';
      if (chevron) chevron.innerText = '▲';
      renderPlanAccountOptions();
      setTimeout(() => {
        const inp = document.getElementById('zoho-plan-account-search');
        if (inp) {
          inp.value = '';
          inp.focus();
        }
      }, 50);
    } else {
      closePlanAccountDropdown();
    }
  }

  function closePlanAccountDropdown() {
    const dropdown = document.getElementById('zoho-plan-account-dropdown');
    const trigger = document.getElementById('zoho-plan-account-trigger');
    const chevron = document.getElementById('zoho-plan-account-chevron');
    if (dropdown) dropdown.style.display = 'none';
    if (trigger) trigger.style.border = '1px solid #CBD5E1';
    if (chevron) chevron.innerText = '▾';
  }

  function selectPlanAccount(name) {
    zohoSelectedPlanAccount = name;
    const label = document.getElementById('zoho-plan-account-label');
    if (label) {
      label.innerText = name;
      label.style.fontWeight = '600';
      label.style.color = '#1E293B';
    }
    closePlanAccountDropdown();
  }

  function filterPlanAccounts(query) {
    renderPlanAccountOptions(query);
  }

  
  function renderZohoPlanNameCell(plan) {
    if (plan) {
      // Screenshot 2: Plan is selected
      return `
        <div style="display:flex; gap:0.75rem;">
          <div style="width:38px; height:38px; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:4px; display:flex; align-items:center; justify-content:center; color:#94A3B8; flex-shrink:0;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </div>
          <div style="flex:1;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
              <span id="zoho-plan-name-display" style="font-weight:600; color:#0F172A; font-size:0.88rem;">${escapeHtml(plan.name)}</span>
              <span class="zoho-plan-clear-btn" onclick="event.stopPropagation(); window.smatApp.clearZohoPlan()" style="color:#94A3B8; cursor:pointer; display:inline-flex; align-items:center; transition:color 0.15s;" title="Remove Plan" onmouseover="this.style.color='#EF4444'" onmouseout="this.style.color='#94A3B8'">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </span>
            </div>
            <input type="hidden" id="zoho-plan-select" value="${escapeHtml(plan.id)}" />

            <!-- Plan Description Input (Screenshot 2) -->
            <input type="text" id="zoho-plan-desc" placeholder="Add description to your plan" style="width:100%; border:1px solid #E2E8F0; background:#FFFFFF; padding:4px 8px; font-size:0.8rem; color:#4B5563; border-radius:4px; margin-top:4px; outline:none; transition:border-color 0.15s;" onfocus="this.style.borderColor='#3B82F6'" onblur="this.style.borderColor='#E2E8F0'" />

            <!-- SAC Code Badge & Popover (User Screenshot Match) -->
            <div class="zoho-sac-badge-wrap" style="position:relative; display:inline-flex; align-items:center; gap:5px; margin-top:6px;">
              <span style="background:#059669; color:#FFFFFF; font-size:0.68rem; font-weight:700; padding:1px 5px; border-radius:3px; letter-spacing:0.3px;">SERVICE</span>
              <span style="font-size:0.75rem; color:#2563EB; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:3px;" onclick="event.stopPropagation(); window.smatApp.toggleSacPopover('plan', 0, event)" title="Click to edit SAC code">
                SAC: <span id="zoho-plan-sac-text">${plan.sac || '998314'}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </span>

              <!-- Top-pointed Popover -->
              <div id="zoho-sac-popover-plan" class="zoho-sac-popover" style="display:none; position:absolute; top:calc(100% + 8px); left:0; z-index:9999; background:#FFFFFF; border:1px solid #D1D5DB; border-radius:6px; box-shadow:0 12px 28px rgba(0,0,0,0.15); padding:12px 14px; min-width:280px; text-align:left;">
                <div style="position:absolute; top:-6px; left:48px; width:10px; height:10px; background:#FFFFFF; border-left:1px solid #E5E7EB; border-top:1px solid #E5E7EB; transform:rotate(45deg);"></div>
                <div style="font-size:0.84rem; font-weight:600; color:#374151; margin-bottom:8px;">SAC</div>
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
                  <select id="zoho-sac-select-plan" style="flex:1; border:1.5px solid #3B82F6; border-radius:4px; padding:6px 10px; font-size:0.86rem; color:#111827; outline:none; background:#FFFFFF; cursor:pointer;">
                    <option value="998314" selected>998314</option>
                    <option value="998313">998313 - IT Consulting & Support</option>
                    <option value="998315">998315 - Hosting & Infrastructure</option>
                    <option value="998319">998319 - Other IT Services</option>
                    <option value="998311">998311 - Telecommunications</option>
                  </select>
                  <span style="color:#2563EB; cursor:pointer;" title="Search SAC Code">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </span>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <button type="button" onclick="window.smatApp.saveSacCode('plan', 0)" style="background:#2563EB; color:#FFFFFF; border:none; border-radius:4px; padding:4px 14px; font-size:0.8rem; font-weight:600; cursor:pointer;">Save</button>
                  <button type="button" onclick="window.smatApp.closeSacPopover('plan', 0)" style="background:#F3F4F6; color:#374151; border:1px solid #E5E7EB; border-radius:4px; padding:4px 12px; font-size:0.8rem; cursor:pointer;">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      // Screenshot 1 & 3: Empty state / Dropdown open
      return `
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <div style="width:38px; height:38px; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:4px; display:flex; align-items:center; justify-content:center; color:#94A3B8; flex-shrink:0;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </div>
          <div id="zoho-plan-picker-wrapper" style="position:relative; flex:1;">
            <input type="text" id="zoho-plan-search-input" placeholder="Type or click to select a plan." onclick="event.stopPropagation(); window.smatApp.openPlanDropdown(event)" oninput="window.smatApp.filterPlanDropdown(this.value)" autocomplete="off" style="width:100%; border:1.5px solid #3B82F6; border-radius:4px; padding:7px 12px; font-size:0.85rem; color:#1E293B; outline:none; background:#FFFFFF; cursor:text; box-shadow:0 0 0 2px rgba(59,130,246,0.15);" />
            <input type="hidden" id="zoho-plan-select" value="" />

            <!-- Searchable Dropdown Popover (Exact Match to User Screenshots 1, 2, 3) -->
            <div id="zoho-plan-dropdown-popover" class="zoho-plan-dropdown-popover" style="display:block; position:absolute; top:calc(100% + 4px); left:0; width:100%; min-width:340px; z-index:99999; background:#FFFFFF; border:1px solid #CBD5E1; border-radius:6px; box-shadow:0 12px 28px rgba(0,0,0,0.18); overflow:hidden;">
              <div id="zoho-plan-dropdown-list" style="max-height:240px; overflow-y:auto;">
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  function renderPlanDropdownItems(query = '') {
    const listEl = document.getElementById('zoho-plan-dropdown-list');
    if (!listEl) return;
    const q = (query || '').toLowerCase().trim();
    const filtered = ZOHO_SUBSCRIPTION_PLANS.filter(p => {
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      listEl.innerHTML = '<div style="padding:14px; text-align:center; color:#94A3B8; font-size:0.82rem;">No matching plans found</div>';
      return;
    }

    listEl.innerHTML = filtered.map((plan, idx) => `
      <div class="zoho-plan-option-item ${idx === 0 ? 'active' : ''}" onclick="event.stopPropagation(); window.smatApp.selectZohoPlan('${plan.id}')" style="padding:10px 14px; cursor:pointer; border-bottom:1px solid #F1F5F9; transition:all 0.12s ease;">
        <div class="zoho-plan-opt-name" style="font-weight:600; font-size:0.86rem; color:#1E293B;">${escapeHtml(plan.name)}</div>
        <div class="zoho-plan-opt-code" style="font-size:0.76rem; color:#64748B; margin-top:2px;">Code: ${escapeHtml(plan.code)}</div>
      </div>
    `).join('');
  }

  function openPlanDropdown(event) {
    if (event) event.stopPropagation();
    closeAllMorePopovers();
    closePlanTaxDropdown();
    closeDiscountPrefDropdown();
    const popover = document.getElementById('zoho-plan-dropdown-popover');
    const input = document.getElementById('zoho-plan-search-input');
    if (popover) {
      popover.style.display = 'block';
      renderPlanDropdownItems(input ? input.value : '');
    }
    if (input) {
      input.style.borderColor = '#3B82F6';
      input.style.boxShadow = '0 0 0 2px rgba(59,130,246,0.15)';
    }
  }

  function closePlanDropdown() {
    const popover = document.getElementById('zoho-plan-dropdown-popover');
    if (popover) popover.style.display = 'none';
    const input = document.getElementById('zoho-plan-search-input');
    if (input) {
      input.style.borderColor = '#CBD5E1';
      input.style.boxShadow = 'none';
    }
  }

  function filterPlanDropdown(query) {
    const popover = document.getElementById('zoho-plan-dropdown-popover');
    if (popover) popover.style.display = 'block';
    renderPlanDropdownItems(query);
  }

  function selectZohoPlan(planId) {
    const plan = ZOHO_SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) return;
    zohoSelectedPlan = plan;

    // 1. Re-render name cell into Screenshot 2 layout
    const nameCell = document.getElementById('zoho-plan-name-cell');
    if (nameCell) {
      nameCell.innerHTML = renderZohoPlanNameCell(plan);
    }

    // 2. Set Price input
    const priceInput = document.getElementById('zoho-plan-price');
    if (priceInput) priceInput.value = plan.price;

    // 3. Set Quantity input
    const qtyInput = document.getElementById('zoho-plan-qty');
    if (qtyInput) qtyInput.value = 1;

    // 4. Set Tax if not customized
    const taxLabel = document.getElementById('zoho-plan-tax-label');
    const taxHidden = document.getElementById('zoho-plan-tax');
    if (taxLabel && taxHidden) {
      taxLabel.innerText = plan.taxLabel;
      taxHidden.value = plan.taxRate;
      zohoSelectedPlanTaxRate = plan.taxRate;
      zohoSelectedPlanTaxLabel = plan.taxLabel;
    }

    // 5. Set Row Amount display
    const amountEl = document.getElementById('zoho-plan-row-amount');
    if (amountEl) {
      amountEl.innerHTML = `
        <div style="font-weight:700; color:#111827; font-size:0.92rem;">Rs. ${plan.price.toLocaleString('en-IN')}.00</div>
        <div style="font-size:0.74rem; color:#6B7280; margin-top:2px;">${plan.cycle}</div>
      `;
    }

    closePlanDropdown();
    updateZohoSubCalculations();
  }

  function clearZohoPlan() {
    zohoSelectedPlan = null;

    // 1. Re-render name cell into Screenshot 1 & 3 layout
    const nameCell = document.getElementById('zoho-plan-name-cell');
    if (nameCell) {
      nameCell.innerHTML = renderZohoPlanNameCell(null);
    }

    // 2. Reset Price input to 0.00
    const priceInput = document.getElementById('zoho-plan-price');
    if (priceInput) priceInput.value = '0.00';

    // 3. Reset Tax to Select a Tax
    const taxLabel = document.getElementById('zoho-plan-tax-label');
    const taxHidden = document.getElementById('zoho-plan-tax');
    if (taxLabel && taxHidden) {
      taxLabel.innerText = 'Select a Tax';
      taxHidden.value = '0';
      zohoSelectedPlanTaxRate = 0;
      zohoSelectedPlanTaxLabel = 'Select a Tax';
    }

    // 4. Reset Row Amount display to Rs. 0.00
    const amountEl = document.getElementById('zoho-plan-row-amount');
    if (amountEl) {
      amountEl.innerHTML = `
        <div style="font-weight:700; color:#111827; font-size:0.92rem;">Rs. 0.00</div>
        <div style="font-size:0.74rem; color:#6B7280; margin-top:2px;">per month</div>
      `;
    }

    updateZohoSubCalculations();
    renderPlanDropdownItems('');
    const input = document.getElementById('zoho-plan-search-input');
    if (input) {
      input.focus();
    }
  }

  function showRemovePlanModal() {
    closeAllMorePopovers();
    closeGstPreferencesPopover();
    closeShippingGstPopover();
    closeSupplyStateDropdown();
    const backdrop = document.getElementById('zoho-plan-remove-modal-backdrop');
    if (backdrop) backdrop.style.display = 'block';
  }

  function closeRemovePlanModal() {
    const backdrop = document.getElementById('zoho-plan-remove-modal-backdrop');
    if (backdrop) backdrop.style.display = 'none';
  }

  function renderPlanTaxOptions(query = '') {
    const container = document.getElementById('zoho-plan-tax-list');
    if (!container) return;
    const q = (query || '').toLowerCase().trim();
    let html = '';

    ALL_ZOHO_PLAN_TAX_GROUPS.forEach(group => {
      const matchingItems = group.items.filter(item => {
        if (!q) return true;
        return item.label.toLowerCase().includes(q) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(q));
      });

      if (matchingItems.length > 0) {
        html += `<div style="font-size:0.75rem; font-weight:700; color:#475569; padding:6px 8px 3px 8px; user-select:none;">${escapeHtml(group.category)}</div>`;
        matchingItems.forEach(item => {
          const isSelected = (item.label === zohoSelectedPlanTaxLabel);
          html += `
            <div class="zoho-tax-item ${isSelected ? 'selected' : ''}" 
                 onclick="event.stopPropagation(); window.smatApp.selectPlanTax('${escapeHtml(item.label)}', ${item.rate})"
                 style="display:flex; align-items:flex-start; justify-content:space-between; gap:6px; padding:6px 8px; margin-bottom:2px; border-radius:4px; cursor:pointer;">
              <div style="flex:1;">
                <div style="font-size:0.83rem; font-weight:${isSelected ? '600' : '500'}; line-height:1.2;">${escapeHtml(item.label)}</div>
                ${item.subtitle ? `<div class="zoho-tax-sub" style="font-size:0.72rem; color:#64748B; line-height:1.3; margin-top:2px;">${escapeHtml(item.subtitle)}</div>` : ''}
              </div>
              ${isSelected ? `
                <div class="zoho-tax-check" style="flex-shrink:0; margin-left:8px; margin-top:2px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.8"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              ` : ''}
            </div>
          `;
        });
      }
    });

    if (!html) {
      html = `<div style="padding:12px 8px; text-align:center; color:#94A3B8; font-size:0.8rem;">No matching tax found</div>`;
    }

    container.innerHTML = html;
  }

  function togglePlanTaxDropdown(evt) {
    if (evt) evt.stopPropagation();
    const pop = document.getElementById('zoho-plan-tax-popover');
    const trigger = document.getElementById('zoho-plan-tax-trigger');
    const chevron = document.getElementById('zoho-plan-tax-chevron');
    if (!pop) return;
    const isCurrentlyOpen = pop.style.display === 'block';

    closeAllMorePopovers();
    closeGstPreferencesPopover();
    closeShippingGstPopover();
    closeSupplyStateDropdown();
    closePlanAccountDropdown();

    if (!isCurrentlyOpen) {
      pop.style.display = 'block';
      if (trigger) {
        trigger.style.borderColor = '#3B82F6';
        trigger.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.15)';
      }
      if (chevron) chevron.style.transform = 'rotate(180deg)';
      renderPlanTaxOptions();
      setTimeout(() => {
        const inp = document.getElementById('zoho-plan-tax-search');
        if (inp) {
          inp.value = '';
          inp.focus();
        }
      }, 50);
    } else {
      closePlanTaxDropdown();
    }
  }

  function closePlanTaxDropdown() {
    const pop = document.getElementById('zoho-plan-tax-popover');
    const trigger = document.getElementById('zoho-plan-tax-trigger');
    const chevron = document.getElementById('zoho-plan-tax-chevron');
    if (pop) pop.style.display = 'none';
    if (trigger) {
      trigger.style.borderColor = '#CBD5E1';
      trigger.style.boxShadow = 'none';
    }
    if (chevron) chevron.style.transform = 'rotate(0deg)';
  }

  function selectPlanTax(label, rate) {
    zohoSelectedPlanTaxLabel = label;
    zohoSelectedPlanTaxRate = rate;
    const labelEl = document.getElementById('zoho-plan-tax-label');
    const hiddenInput = document.getElementById('zoho-plan-tax');
    if (labelEl) labelEl.innerText = label;
    if (hiddenInput) hiddenInput.value = rate;
    closePlanTaxDropdown();
    updateZohoSubCalculations();
  }

  function filterPlanTaxes(query) {
    renderPlanTaxOptions(query);
  }

  function addNewPlanTax() {
    const name = prompt('Enter new tax name (e.g. GST6):', 'GST6');
    if (!name) return;
    const rateStr = prompt('Enter tax rate percentage (e.g. 6):', '6');
    if (rateStr === null) return;
    const rate = parseFloat(rateStr) || 0;
    const label = `${name.trim()} [${rate}%]`;
    const taxGroup = ALL_ZOHO_PLAN_TAX_GROUPS.find(g => g.category === 'Tax Group');
    if (taxGroup) {
      taxGroup.items.push({ id: `custom_${Date.now()}`, label, name: name.trim(), rate });
    }
    selectPlanTax(label, rate);
  }

  
  // =========================================================================
  // ZOHO DISCOUNT PREFERENCE SEARCHABLE DROPDOWN (EXACT USER SCREENSHOT MATCH)
  // =========================================================================
  const ZOHO_DISCOUNT_PREF_OPTIONS = [
    { id: 'no-discount', label: 'No Discounts' },
    { id: 'item-level', label: 'Item-Level' },
    { id: 'transaction-level', label: 'Transaction-Level' }
  ];

  function renderDiscountPrefOptions(filterText = '') {
    const listEl = document.getElementById('zoho-discount-pref-list');
    if (!listEl) return;
    const term = (filterText || '').toLowerCase().trim();
    const filtered = ZOHO_DISCOUNT_PREF_OPTIONS.filter(o => o.label.toLowerCase().includes(term));
    if (filtered.length === 0) {
      listEl.innerHTML = '<div style="padding:8px 12px; font-size:0.8rem; color:#94A3B8; text-align:center;">No matches found</div>';
      return;
    }
    listEl.innerHTML = filtered.map(opt => {
      const isSelected = zohoDiscountPref === opt.id;
      return `
        <div class="zoho-discount-option-item ${isSelected ? 'selected' : ''}" 
             onclick="window.smatApp.selectDiscountPref('${opt.id}')"
             style="${isSelected ? 'background:#2563EB; color:#FFFFFF; font-weight:500;' : ''}">
          <span>${escapeHtml(opt.label)}</span>
          ${isSelected ? '<span class="zoho-discount-check" style="font-size:0.85rem; font-weight:700;">✓</span>' : ''}
        </div>
      `;
    }).join('');
  }

  
  // =========================================================================
  // ZOHO CUSTOMER RIGHT SIDEBAR TAB & DRAWER TOGGLE (SCREENSHOTS 1 & 2)
  // =========================================================================
  
  function toggleDrawerAccordion(section) {
    const body = document.getElementById(`zoho-drawer-body-${section}`);
    const chevron = document.getElementById(`zoho-drawer-chevron-${section}`);
    if (!body) return;
    const isHidden = body.style.display === 'none' || (!body.style.display && window.getComputedStyle(body).display === 'none');
    body.style.display = isHidden ? 'block' : 'none';
    if (chevron) {
      chevron.innerHTML = isHidden 
        ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>'
        : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>';
    }
  }

  function openCustomerSidebar() {
    const drawer = document.getElementById('zoho-customer-sidebar-drawer');
    const backdrop = document.getElementById('zoho-customer-sidebar-backdrop');
    if (drawer) drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
  }

  function closeCustomerSidebar() {
    const drawer = document.getElementById('zoho-customer-sidebar-drawer');
    const backdrop = document.getElementById('zoho-customer-sidebar-backdrop');
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
  }

  function toggleCustomerSidebar() {
    const drawer = document.getElementById('zoho-customer-sidebar-drawer');
    if (drawer && drawer.classList.contains('open')) {
      closeCustomerSidebar();
    } else {
      openCustomerSidebar();
    }
  }

  function toggleDiscountPrefDropdown(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    const pop = document.getElementById('zoho-discount-pref-popover');
    if (!pop) return;
    const isVisible = pop.style.display === 'block';
    if (isVisible) {
      closeDiscountPrefDropdown();
    } else {
      closeAllMorePopovers();
      closeGstPreferencesPopover();
      closeShippingGstPopover();
      closeSupplyStateDropdown();
      closePlanAccountDropdown();
      closePlanTaxDropdown();
      closeAllAddonTaxDropdowns();
      closeZohoCouponDropdown();

      pop.style.display = 'block';
      const trigger = document.getElementById('zoho-discount-pref-trigger');
      if (trigger) {
        trigger.style.borderColor = '#3B82F6';
        trigger.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.15)';
      }
      const chevron = document.getElementById('zoho-discount-pref-chevron');
      if (chevron) chevron.style.transform = 'rotate(180deg)';
      
      const searchInput = document.getElementById('zoho-discount-pref-search');
      if (searchInput) {
        searchInput.value = '';
        setTimeout(() => searchInput.focus(), 50);
      }
      renderDiscountPrefOptions();
    }
  }

  function closeDiscountPrefDropdown() {
    const pop = document.getElementById('zoho-discount-pref-popover');
    if (!pop) return;
    pop.style.display = 'none';
    const trigger = document.getElementById('zoho-discount-pref-trigger');
    if (trigger) {
      if (zohoDiscountPref === 'item-level' || zohoDiscountPref === 'transaction-level') {
        trigger.style.borderColor = '#3B82F6';
        trigger.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.15)';
      } else {
        trigger.style.borderColor = '#CBD5E1';
        trigger.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
      }
    }
    const chevron = document.getElementById('zoho-discount-pref-chevron');
    if (chevron) chevron.style.transform = 'rotate(0deg)';
  }

  function selectDiscountPref(val) {
    zohoDiscountPref = val;
    const opt = ZOHO_DISCOUNT_PREF_OPTIONS.find(o => o.id === val);
    const labelEl = document.getElementById('zoho-discount-pref-label');
    if (labelEl && opt) {
      labelEl.textContent = opt.label;
    }
    const sel = document.getElementById('zoho-sub-discount-pref');
    if (sel) sel.value = val;
    closeDiscountPrefDropdown();
    onZohoDiscountPrefChange(val);
  }

  function filterDiscountPrefOptions(val) {
    renderDiscountPrefOptions(val);
  }

  function onZohoDiscountPrefChange(pref) {
    zohoDiscountPref = pref;
    const isItemLevel = pref === 'item-level';
    document.querySelectorAll('.zoho-col-discount').forEach(el => {
      el.style.display = isItemLevel ? 'table-cell' : 'none';
    });
    document.querySelectorAll('.zoho-th-plan-name').forEach(el => el.style.width = isItemLevel ? '34%' : '40%');
    document.querySelectorAll('.zoho-th-plan-qty').forEach(el => el.style.width = isItemLevel ? '12%' : '15%');
    document.querySelectorAll('.zoho-th-plan-price').forEach(el => el.style.width = isItemLevel ? '14%' : '15%');
    document.querySelectorAll('.zoho-th-plan-tax').forEach(el => el.style.width = isItemLevel ? '13%' : '15%');
    document.querySelectorAll('.zoho-th-plan-amount').forEach(el => el.style.width = isItemLevel ? '13%' : '15%');
    document.querySelectorAll('.zoho-th-addon-name').forEach(el => el.style.width = isItemLevel ? '34%' : '40%');
    document.querySelectorAll('.zoho-th-addon-qty').forEach(el => el.style.width = isItemLevel ? '12%' : '15%');
    document.querySelectorAll('.zoho-th-addon-price').forEach(el => el.style.width = isItemLevel ? '14%' : '15%');
    document.querySelectorAll('.zoho-th-addon-tax').forEach(el => el.style.width = isItemLevel ? '13%' : '15%');
    document.querySelectorAll('.zoho-th-addon-amount').forEach(el => el.style.width = isItemLevel ? '13%' : '15%');

    // Trigger button active blue border matching Screenshots 2 & 3
    const trigger = document.getElementById('zoho-discount-pref-trigger');
    if (trigger) {
      if (isItemLevel || pref === 'transaction-level') {
        trigger.style.borderColor = '#3B82F6';
        trigger.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.15)';
      } else {
        trigger.style.borderColor = '#CBD5E1';
        trigger.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
      }
    }

    updateZohoSubCalculations();
  }

  function openZohoCouponDropdown() {
    const pop = document.getElementById('zoho-coupon-popover');
    const trigger = document.getElementById('zoho-coupon-trigger-btn');
    const chevron = document.getElementById('zoho-coupon-chevron');
    if (!pop) return;
    closeAllMorePopovers();
    closeGstPreferencesPopover();
    closeShippingGstPopover();
    closeSupplyStateDropdown();
    closePlanAccountDropdown();
    closePlanTaxDropdown();
    closeAllAddonTaxDropdowns();
    pop.style.display = 'block';
    if (trigger) {
      trigger.style.borderColor = '#3B82F6';
      trigger.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.15)';
    }
    if (chevron) chevron.style.transform = 'rotate(180deg)';
    renderZohoCouponResults();
    setTimeout(() => {
      const searchInp = document.getElementById('zoho-coupon-search-filter');
      if (searchInp) {
        searchInp.value = '';
        searchInp.focus();
      }
    }, 50);
  }

  function toggleZohoCouponDropdown(evt) {
    if (evt) evt.stopPropagation();
    const pop = document.getElementById('zoho-coupon-popover');
    if (!pop) return;
    if (pop.style.display === 'block') {
      closeZohoCouponDropdown();
    } else {
      openZohoCouponDropdown();
    }
  }

  function closeZohoCouponDropdown() {
    const pop = document.getElementById('zoho-coupon-popover');
    const trigger = document.getElementById('zoho-coupon-trigger-btn');
    const chevron = document.getElementById('zoho-coupon-chevron');
    if (pop) pop.style.display = 'none';
    if (trigger) {
      trigger.style.borderColor = '#D1D5DB';
      trigger.style.boxShadow = 'none';
    }
    if (chevron) chevron.style.transform = 'rotate(0deg)';
  }

  function filterZohoCoupons(query) {
    renderZohoCouponResults(query);
  }

  function renderZohoCouponResults(query = '') {
    const container = document.getElementById('zoho-coupon-results-list');
    if (!container) return;
    const q = (query || '').toLowerCase().trim();

    const availableCoupons = (typeof couponsData !== 'undefined' ? couponsData : []).filter(c => {
      if (!q) return true;
      const nameMatch = (c.name || '').toLowerCase().includes(q);
      const codeMatch = (c.code || '').toLowerCase().includes(q);
      const valMatch = (c.discount_value || '').toLowerCase().includes(q);
      return nameMatch || codeMatch || valMatch;
    });

    if (availableCoupons.length === 0) {
      container.innerHTML = `<div style="padding:12px 10px; font-size:0.8rem; color:#94A3B8; text-align:center;">No coupons found</div>`;
      return;
    }

    container.innerHTML = availableCoupons.map(c => {
      const isSel = selectedZohoCoupon && (selectedZohoCoupon.id === c.id || selectedZohoCoupon.code === c.code);
      const valClean = c.discount_value ? c.discount_value.replace(/[|]/g, '') : '';
      const displayLabel = `${c.name}/${c.code}${valClean ? ` [${valClean}]` : ''}`;

      return `
        <div class="zoho-coupon-option ${isSel ? 'selected' : ''}" 
             onclick="event.stopPropagation(); window.smatApp.selectZohoCoupon(${c.id})"
             style="display:flex; align-items:center; justify-content:space-between; gap:8px; padding:7px 10px; margin-bottom:2px; border-radius:4px; cursor:pointer; font-size:0.83rem; transition:background 0.15s, color 0.15s;">
          <span style="font-weight:${isSel ? '600' : '500'}; line-height:1.2;">${escapeHtml(displayLabel)}</span>
          ${isSel ? `
            <span class="zoho-coupon-check" style="flex-shrink:0;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.8"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </span>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  function selectZohoCoupon(couponId) {
    const found = (typeof couponsData !== 'undefined' ? couponsData : []).find(c => c.id === couponId || c.id === Number(couponId));
    if (!found) return;
    selectedZohoCoupon = found;
    const labelSpan = document.getElementById('zoho-coupon-selected-label');
    const codeDisp = document.getElementById('zoho-coupon-code-disp');
    const valDisp = document.getElementById('zoho-coupon-value-disp');
    if (labelSpan) {
      labelSpan.innerText = found.name;
      labelSpan.style.color = '#1E293B';
      labelSpan.style.fontWeight = '600';
    }
    if (codeDisp) codeDisp.value = found.code;
    if (valDisp) valDisp.value = found.discount_value;
    closeZohoCouponDropdown();
    updateZohoSubCalculations();
  }

  function clearZohoCoupon() {
    selectedZohoCoupon = null;
    const labelSpan = document.getElementById('zoho-coupon-selected-label');
    const codeDisp = document.getElementById('zoho-coupon-code-disp');
    const valDisp = document.getElementById('zoho-coupon-value-disp');
    if (labelSpan) {
      labelSpan.innerText = 'Enter at least 3 characters to search';
      labelSpan.style.color = '#94A3B8';
      labelSpan.style.fontWeight = '400';
    }
    if (codeDisp) codeDisp.value = '';
    if (valDisp) valDisp.value = '';
    closeZohoCouponDropdown();
    updateZohoSubCalculations();
  }

  function proceedRemovePlan() {
    const descInp = document.getElementById('zoho-plan-desc');
    if (descInp) descInp.value = '';
    const qtyInp = document.getElementById('zoho-plan-qty');
    if (qtyInp) qtyInp.value = 1;
    const discInp = document.getElementById('zoho-plan-disc-val');
    if (discInp) discInp.value = 0;
    
    // Recalculate billing
    updateZohoSubCalculations();
    closeRemovePlanModal();
    if (typeof showToast === 'function') {
      showToast('Plan custom configurations have been reset.');
    }
  }

  function onZohoPlanChange(val) {
    if (!val) return;
    const parts = val.split('|');
    const price = parseFloat(parts[1]) || 0;
    const priceInput = document.getElementById('zoho-plan-price');
    if (priceInput) priceInput.value = price;
    updateZohoSubCalculations();
  }

  function renderAddonTaxOptions(idx, query = '') {
    const container = document.getElementById(`zoho-addon-tax-list-${idx}`);
    if (!container) return;
    const q = (query || '').toLowerCase().trim();
    let html = '';
    const currentAddon = zohoSubAddons[idx] || {};
    const selectedLabel = currentAddon.taxLabel || 'GST18 [18%]';

    ALL_ZOHO_PLAN_TAX_GROUPS.forEach(group => {
      const matchingItems = group.items.filter(item => {
        if (!q) return true;
        return item.label.toLowerCase().includes(q) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(q));
      });

      if (matchingItems.length > 0) {
        html += `<div style="font-size:0.75rem; font-weight:700; color:#475569; padding:6px 8px 3px 8px; user-select:none;">${escapeHtml(group.category)}</div>`;
        matchingItems.forEach(item => {
          const isSelected = (item.label === selectedLabel);
          html += `
            <div class="zoho-tax-item ${isSelected ? 'selected' : ''}" 
                 onclick="event.stopPropagation(); window.smatApp.selectAddonTax(${idx}, '${escapeHtml(item.label)}', ${item.rate})"
                 style="display:flex; align-items:flex-start; justify-content:space-between; gap:6px; padding:6px 8px; margin-bottom:2px; border-radius:4px; cursor:pointer;">
              <div style="flex:1;">
                <div style="font-size:0.83rem; font-weight:${isSelected ? '600' : '500'}; line-height:1.2;">${escapeHtml(item.label)}</div>
                ${item.subtitle ? `<div class="zoho-tax-sub" style="font-size:0.72rem; color:#64748B; line-height:1.3; margin-top:2px;">${escapeHtml(item.subtitle)}</div>` : ''}
              </div>
              ${isSelected ? `
                <div class="zoho-tax-check" style="flex-shrink:0; margin-left:8px; margin-top:2px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.8"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              ` : ''}
            </div>
          `;
        });
      }
    });

    if (!html) {
      html = `<div style="padding:12px 8px; text-align:center; color:#94A3B8; font-size:0.8rem;">No matching tax found</div>`;
    }

    container.innerHTML = html;
  }

  function toggleAddonTaxDropdown(idx, evt) {
    if (evt) evt.stopPropagation();
    const pop = document.getElementById(`zoho-addon-tax-popover-${idx}`);
    const trigger = document.getElementById(`zoho-addon-tax-trigger-${idx}`);
    const chevron = document.getElementById(`zoho-addon-tax-chevron-${idx}`);
    if (!pop) return;
    const isCurrentlyOpen = pop.style.display === 'block';

    closeAllMorePopovers();
    closeGstPreferencesPopover();
    closeShippingGstPopover();
    closeSupplyStateDropdown();
    closePlanAccountDropdown();
    closePlanTaxDropdown();
    closeAllAddonTaxDropdowns();

    if (!isCurrentlyOpen) {
      pop.style.display = 'block';
      if (trigger) {
        trigger.style.borderColor = '#3B82F6';
        trigger.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.15)';
      }
      if (chevron) chevron.style.transform = 'rotate(180deg)';
      renderAddonTaxOptions(idx);
      setTimeout(() => {
        const inp = document.getElementById(`zoho-addon-tax-search-${idx}`);
        if (inp) {
          inp.value = '';
          inp.focus();
        }
      }, 50);
    } else {
      closeAddonTaxDropdown(idx);
    }
  }

  function closeAddonTaxDropdown(idx) {
    const pop = document.getElementById(`zoho-addon-tax-popover-${idx}`);
    const trigger = document.getElementById(`zoho-addon-tax-trigger-${idx}`);
    const chevron = document.getElementById(`zoho-addon-tax-chevron-${idx}`);
    if (pop) pop.style.display = 'none';
    if (trigger) {
      trigger.style.borderColor = '#CBD5E1';
      trigger.style.boxShadow = 'none';
    }
    if (chevron) chevron.style.transform = 'rotate(0deg)';
  }

  function closeAllAddonTaxDropdowns() {
    document.querySelectorAll('.zoho-addon-tax-popover').forEach(p => p.style.display = 'none');
    document.querySelectorAll('[id^="zoho-addon-tax-trigger-"]').forEach(t => {
      t.style.borderColor = '#CBD5E1';
      t.style.boxShadow = 'none';
    });
    document.querySelectorAll('[id^="zoho-addon-tax-chevron-"]').forEach(c => {
      c.style.transform = 'rotate(0deg)';
    });
  }

  function selectAddonTax(idx, label, rate) {
    if (zohoSubAddons[idx]) {
      zohoSubAddons[idx].taxLabel = label;
      zohoSubAddons[idx].taxRate = rate;
    }
    const labelEl = document.getElementById(`zoho-addon-tax-label-${idx}`);
    const hiddenInput = document.getElementById(`zoho-addon-tax-${idx}`);
    if (labelEl) labelEl.innerText = label;
    if (hiddenInput) hiddenInput.value = rate;
    closeAddonTaxDropdown(idx);
    updateZohoSubCalculations();
  }

  function filterAddonTaxes(idx, query) {
    renderAddonTaxOptions(idx, query);
  }

  function addNewAddonTax(idx) {
    const name = prompt('Enter new tax name (e.g. GST6):', 'GST6');
    if (!name) return;
    const rateStr = prompt('Enter tax rate percentage (e.g. 6):', '6');
    if (rateStr === null) return;
    const rate = parseFloat(rateStr) || 0;
    const label = `${name.trim()} [${rate}%]`;
    const taxGroup = ALL_ZOHO_PLAN_TAX_GROUPS.find(g => g.category === 'Tax Group');
    if (taxGroup) {
      taxGroup.items.push({ id: `custom_${Date.now()}`, label, name: name.trim(), rate });
    }
    selectAddonTax(idx, label, rate);
  }

  function onZohoAddonChange(idx, val) {
    if (!val || !zohoSubAddons[idx]) return;
    const found = AVAILABLE_ZOHO_ADDONS.find(a => a.name === val) || {
      name: val,
      price: 0,
      desc: '',
      unit: val
    };
    zohoSubAddons[idx].name = found.name;
    zohoSubAddons[idx].price = found.price;
    zohoSubAddons[idx].desc = found.desc;
    zohoSubAddons[idx].unit = found.unit;
    zohoSubAddons[idx].taxRate = 18;
    zohoSubAddons[idx].isEmpty = false;
    const viewport = document.getElementById('route-viewport');
    if (viewport) renderZohoSubscriptionView(viewport);
    updateZohoSubCalculations();
  }

  function openAddContactPersonModal() {
    const modal = document.getElementById('modal-container');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-overlay open" style="z-index:9999;">
        <div class="modal-box-card" style="max-width:850px; width:92%; padding:0; border-radius:8px; overflow:hidden; background:#FFFFFF; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);">
          <!-- Modal Header (Screenshot 1 Match) -->
          <div style="display:flex; justify-content:space-between; align-items:center; padding:1.25rem 1.75rem; border-bottom:1px solid #E5E7EB;">
            <h2 style="font-size:1.18rem; font-weight:600; color:#111827; margin:0;">Add Contact Person</h2>
            <button type="button" onclick="window.smatApp.closeModal()" style="width:26px; height:26px; border:1px solid #FCA5A5; background:#FEF2F2; color:#DC2626; border-radius:4px; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; font-size:12px; font-weight:700;">✕</button>
          </div>

          <!-- Modal Body Grid: Form Left, Profile Image Right (Screenshot 1 Match) -->
          <div style="display:grid; grid-template-columns:1fr 240px; gap:2.5rem; padding:1.75rem;">
            <!-- Left Form Fields -->
            <div style="display:flex; flex-direction:column; gap:1.15rem;">
              <!-- 1. Name -->
              <div style="display:grid; grid-template-columns:130px 1fr; gap:1rem; align-items:center;">
                <label style="font-size:0.86rem; color:#4B5563;">Name</label>
                <div style="display:grid; grid-template-columns:120px 1fr 1fr; gap:0.6rem;">
                  <select id="cp-salutation" class="filter-search-box" style="padding:0.45rem 0.6rem; font-size:0.84rem; cursor:pointer;">
                    <option value="" disabled selected hidden>Salutation ⌄</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Miss">Miss</option>
                    <option value="Dr.">Dr.</option>
                  </select>
                  <input type="text" id="cp-first-name" class="filter-search-box" placeholder="First Name" style="padding:0.45rem 0.6rem; font-size:0.84rem;" />
                  <input type="text" id="cp-last-name" class="filter-search-box" placeholder="Last Name" style="padding:0.45rem 0.6rem; font-size:0.84rem;" />
                </div>
              </div>

              <!-- 2. Email Address -->
              <div style="display:grid; grid-template-columns:130px 1fr; gap:1rem; align-items:center;">
                <label style="font-size:0.86rem; color:#4B5563;">Email Address</label>
                <input type="email" id="cp-email" class="filter-search-box" placeholder="" style="width:100%; padding:0.45rem 0.6rem; font-size:0.84rem;" />
              </div>

              <!-- 3. Phone -->
              <div style="display:grid; grid-template-columns:130px 1fr; gap:1rem; align-items:flex-start;">
                <label style="font-size:0.86rem; color:#4B5563; padding-top:6px;">Phone</label>
                <div style="display:flex; flex-direction:column; gap:0.65rem;">
                  <!-- Work Phone -->
                  <div style="display:flex; gap:0.5rem;">
                    <select id="cp-work-cc" class="filter-search-box" style="width:85px; padding:0.45rem 0.5rem; font-size:0.84rem; cursor:pointer;">
                      <option value="+91" selected>+91 ⌄</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+971">+971</option>
                    </select>
                    <input type="text" id="cp-work-phone" class="filter-search-box" placeholder="Work Phone" style="flex:1; padding:0.45rem 0.6rem; font-size:0.84rem;" />
                  </div>
                  <!-- Mobile -->
                  <div style="display:flex; gap:0.5rem;">
                    <select id="cp-mobile-cc" class="filter-search-box" style="width:85px; padding:0.45rem 0.5rem; font-size:0.84rem; cursor:pointer;">
                      <option value="+91" selected>+91 ⌄</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+971">+971</option>
                    </select>
                    <input type="text" id="cp-mobile" class="filter-search-box" placeholder="Mobile" style="flex:1; padding:0.45rem 0.6rem; font-size:0.84rem;" />
                  </div>
                </div>
              </div>

              <!-- 4. Skype Name/Number -->
              <div style="display:grid; grid-template-columns:130px 1fr; gap:1rem; align-items:center;">
                <label style="font-size:0.86rem; color:#4B5563;">Skype Name/Number</label>
                <div style="display:flex; align-items:center; border:1px solid #D1D5DB; border-radius:4px; overflow:hidden;">
                  <span style="background:#F9FAFB; border-right:1px solid #E5E7EB; padding:0.45rem 0.75rem; display:inline-flex; align-items:center; color:#0284C7; font-weight:700;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12.001 2c-5.523 0-10 4.477-10 10 0 1.258.232 2.464.655 3.576C2.247 16.732 2 18.006 2 19.333c0 1.473.573 2.857 1.615 3.899A5.474 5.474 0 0 0 7.514 24.85c1.112.423 2.318.655 3.576.655 5.523 0 10-4.477 10-10 0-1.258-.232-2.464-.655-3.576.409-1.156.655-2.43.655-3.757 0-1.473-.573-2.857-1.615-3.899A5.474 5.474 0 0 0 15.897 2.65C14.785 2.227 13.579 2 12.001 2z"/></svg>
                  </span>
                  <input type="text" id="cp-skype" placeholder="Skype Name/Number" style="flex:1; border:none; outline:none; padding:0.45rem 0.6rem; font-size:0.84rem; color:#111827;" />
                </div>
              </div>

              <!-- 5. Other Details -->
              <div style="display:grid; grid-template-columns:130px 1fr; gap:1rem; align-items:center;">
                <label style="font-size:0.86rem; color:#4B5563;">Other Details</label>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem;">
                  <input type="text" id="cp-designation" class="filter-search-box" placeholder="Designation" style="padding:0.45rem 0.6rem; font-size:0.84rem;" />
                  <input type="text" id="cp-department" class="filter-search-box" placeholder="Department" style="padding:0.45rem 0.6rem; font-size:0.84rem;" />
                </div>
              </div>
            </div>

            <!-- Right Profile Image Upload Card (Screenshot 1 Match) -->
            <div style="border:1.5px dashed #CBD5E1; border-radius:6px; padding:2rem 1.25rem; text-align:center; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#FAFAFA;">
              <div style="width:38px; height:38px; border-radius:50%; background:#2563EB; color:#FFFFFF; display:inline-flex; align-items:center; justify-content:center; margin-bottom:0.85rem;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
              </div>
              <div style="font-size:0.88rem; font-weight:700; color:#1E293B; margin-bottom:0.35rem;">Drag & Drop Profile Image</div>
              <div style="font-size:0.73rem; color:#64748B; margin-bottom:2px;">Supported Files: jpg, jpeg, png, gif, bmp</div>
              <div style="font-size:0.73rem; color:#64748B; margin-bottom:1rem;">Maximum File Size: 5MB</div>
              <label style="color:#2563EB; font-size:0.84rem; font-weight:600; cursor:pointer;">
                Upload File
                <input type="file" style="display:none;" accept="image/*" onchange="alert('Image chosen: ' + this.files[0]?.name)" />
              </label>
            </div>
          </div>

          <!-- Modal Footer (Screenshot 1 Match) -->
          <div style="display:flex; align-items:center; gap:0.75rem; padding:1.15rem 1.75rem; border-top:1px solid #E5E7EB; background:#FFFFFF;">
            <button type="button" onclick="window.smatApp.saveContactPerson()" style="background:#2563EB; color:#FFFFFF; border:none; border-radius:4px; padding:0.5rem 1.5rem; font-size:0.86rem; font-weight:600; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,0.05);">Save</button>
            <button type="button" onclick="window.smatApp.closeModal()" style="background:#F3F4F6; color:#374151; border:1px solid #E5E7EB; border-radius:4px; padding:0.5rem 1.25rem; font-size:0.86rem; cursor:pointer;">Cancel</button>
          </div>
        </div>
      </div>
    `;
  }

  function saveContactPerson() {
    const salutation = document.getElementById('cp-salutation')?.value || '';
    const firstName = document.getElementById('cp-first-name')?.value?.trim() || '';
    const lastName = document.getElementById('cp-last-name')?.value?.trim() || '';
    const email = document.getElementById('cp-email')?.value?.trim() || '';
    const workCc = document.getElementById('cp-work-cc')?.value || '+91';
    const workPhone = document.getElementById('cp-work-phone')?.value?.trim() || '';
    const mobileCc = document.getElementById('cp-mobile-cc')?.value || '+91';
    const mobile = document.getElementById('cp-mobile')?.value?.trim() || '';
    const skype = document.getElementById('cp-skype')?.value?.trim() || '';
    const designation = document.getElementById('cp-designation')?.value?.trim() || '';
    const department = document.getElementById('cp-department')?.value?.trim() || '';

    if (!firstName && !email) {
      alert('Please enter at least First Name or Email Address.');
      return;
    }

    const fullName = [salutation, firstName, lastName].filter(Boolean).join(' ');
    const currClient = clientsData.find(c => c.id === zohoSubscriptionClientId || c.id === Number(zohoSubscriptionClientId)) || clientsData[0];
    if (currClient) {
      currClient.contact_persons = currClient.contact_persons || [];
      currClient.contact_persons.push({
        name: fullName || firstName || 'Contact Person',
        email: email || currClient.email,
        phone: mobile ? `${mobileCc}-${mobile}` : (workPhone ? `${workCc}-${workPhone}` : ''),
        designation,
        department,
        skype
      });
    }

    closeModal();
    const viewport = document.getElementById('route-viewport');
    if (viewport) renderZohoSubscriptionView(viewport);
  }

  function toggleAddressPopover(type, evt) {
    if (evt) evt.stopPropagation();
    const popId = type === 'billing' ? 'zoho-addr-popover-billing' : 'zoho-addr-popover-shipping';
    const pop = document.getElementById(popId);
    if (!pop) return;
    const isCurrentlyOpen = pop.style.display === 'block';
    document.querySelectorAll('.zoho-addr-popover').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.zoho-sac-popover').forEach(p => p.style.display = 'none');
    if (!isCurrentlyOpen) {
      pop.style.display = 'block';
    }
  }

  function closeAddressPopovers() {
    document.querySelectorAll('.zoho-addr-popover').forEach(p => p.style.display = 'none');
  }

  function selectShippingAddress(source) {
    const currClient = clientsData.find(c => c.id === zohoSubscriptionClientId || c.id === Number(zohoSubscriptionClientId)) || clientsData[0];
    if (currClient && source === 'billing') {
      currClient.shipping_address = { ...(currClient.billing_address || { company: 'feso', line1: 'test', line2: 'test', city: 'Hyderabad', pin: '500034', country: 'India' }) };
    }
    closeAddressPopovers();
    const viewport = document.getElementById('route-viewport');
    if (viewport) renderZohoSubscriptionView(viewport);
  }

  function openEditAddressModal(type, isNew = false) {
    closeAddressPopovers();
    const currClient = clientsData.find(c => c.id === zohoSubscriptionClientId || c.id === Number(zohoSubscriptionClientId)) || clientsData[0];
    const addr = isNew ? {} : (type === 'billing' ? (currClient.billing_address || {}) : (currClient.shipping_address || currClient.billing_address || {}));
    
    const modal = document.getElementById('modal-container');
    if (!modal) return;
    modal.innerHTML = `
      <div class="modal-overlay open" style="z-index:9999;">
        <div class="modal-box-card" style="max-width:480px; padding:1.5rem; border-top:4px solid #2563EB;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <div style="font-size:1.1rem; font-weight:700; color:#111827;">
              ${isNew ? '⊕ Add New ' : '✎ Edit '} ${type === 'billing' ? 'Billing' : 'Shipping'} Address
            </div>
            <button onclick="window.smatApp.closeModal()" style="background:none; border:none; font-size:1.2rem; cursor:pointer;">✕</button>
          </div>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <div>
              <label style="font-size:0.75rem; font-weight:600; color:#4B5563;">Company / Legal Name</label>
              <input type="text" id="addr-modal-company" class="filter-search-box" value="${escapeHtml(addr.company || currClient.company_name || 'feso')}" style="width:100%; margin-top:3px;" />
            </div>
            <div>
              <label style="font-size:0.75rem; font-weight:600; color:#4B5563;">Address Line 1</label>
              <input type="text" id="addr-modal-line1" class="filter-search-box" value="${escapeHtml(addr.line1 || 'test')}" style="width:100%; margin-top:3px;" />
            </div>
            <div>
              <label style="font-size:0.75rem; font-weight:600; color:#4B5563;">Address Line 2</label>
              <input type="text" id="addr-modal-line2" class="filter-search-box" value="${escapeHtml(addr.line2 || 'test')}" style="width:100%; margin-top:3px;" />
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
              <div>
                <label style="font-size:0.75rem; font-weight:600; color:#4B5563;">City</label>
                <input type="text" id="addr-modal-city" class="filter-search-box" value="${escapeHtml(addr.city || 'Hyderabad')}" style="width:100%; margin-top:3px;" />
              </div>
              <div>
                <label style="font-size:0.75rem; font-weight:600; color:#4B5563;">Postal / PIN Code</label>
                <input type="text" id="addr-modal-pin" class="filter-search-box" value="${escapeHtml(addr.pin || '500034')}" style="width:100%; margin-top:3px;" />
              </div>
            </div>
            <div>
              <label style="font-size:0.75rem; font-weight:600; color:#4B5563;">Country</label>
              <input type="text" id="addr-modal-country" class="filter-search-box" value="${escapeHtml(addr.country || 'India')}" style="width:100%; margin-top:3px;" />
            </div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.6rem; margin-top:1.25rem;">
            <button type="button" class="btn-action-secondary" onclick="window.smatApp.closeModal()">Cancel</button>
            <button type="button" class="btn-action-primary" style="background:#2563EB;" onclick="window.smatApp.saveAddressModalData('${type}')">Save Address</button>
          </div>
        </div>
      </div>
    `;
  }

  function saveAddressModalData(type) {
    const currClient = clientsData.find(c => c.id === zohoSubscriptionClientId || c.id === Number(zohoSubscriptionClientId)) || clientsData[0];
    const company = document.getElementById('addr-modal-company')?.value || '';
    const line1 = document.getElementById('addr-modal-line1')?.value || '';
    const line2 = document.getElementById('addr-modal-line2')?.value || '';
    const city = document.getElementById('addr-modal-city')?.value || '';
    const pin = document.getElementById('addr-modal-pin')?.value || '';
    const country = document.getElementById('addr-modal-country')?.value || 'India';

    const newObj = { company, line1, line2, city, pin, country };
    if (type === 'billing') {
      currClient.billing_address = newObj;
    } else {
      currClient.shipping_address = newObj;
    }

    closeModal();
    const viewport = document.getElementById('route-viewport');
    if (viewport) renderZohoSubscriptionView(viewport);
  }

  function toggleSacPopover(type, idx, evt) {
    if (evt) evt.stopPropagation();
    const popId = type === 'plan' ? 'zoho-sac-popover-plan' : `zoho-sac-popover-addon-${idx}`;
    const pop = document.getElementById(popId);
    if (!pop) return;
    const isCurrentlyOpen = pop.style.display === 'block';
    document.querySelectorAll('.zoho-sac-popover').forEach(p => p.style.display = 'none');
    if (!isCurrentlyOpen) {
      pop.style.display = 'block';
    }
  }

  function closeSacPopover(type, idx) {
    const popId = type === 'plan' ? 'zoho-sac-popover-plan' : `zoho-sac-popover-addon-${idx}`;
    const pop = document.getElementById(popId);
    if (pop) pop.style.display = 'none';
  }

  function saveSacCode(type, idx) {
    if (type === 'plan') {
      const sel = document.getElementById('zoho-sac-select-plan');
      if (sel) {
        const val = sel.value;
        const txt = document.getElementById('zoho-plan-sac-text');
        if (txt) txt.innerText = val;
      }
      closeSacPopover('plan');
    } else {
      const sel = document.getElementById(`zoho-sac-select-addon-${idx}`);
      if (sel && zohoSubAddons[idx]) {
        const val = sel.value;
        zohoSubAddons[idx].sac = val;
        const txt = document.getElementById(`zoho-addon-sac-text-${idx}`);
        if (txt) txt.innerText = val;
      }
      closeSacPopover('addon', idx);
    }
  }




  function renderGstTreatmentOptions(list) {
    const container = document.getElementById('zoho-gst-treatment-options-list');
    if (!container) return;
    const treatments = list || ALL_GST_TREATMENTS;
    const currentVal = zohoSelectedGstTreatment || 'Unregistered Business';
    container.innerHTML = treatments.map(t => {
      const isSel = t.title === currentVal;
      return `
        <div class="zoho-treatment-option-item ${isSel ? 'selected' : ''}" onclick="event.stopPropagation(); window.smatApp.selectGstTreatment('${t.title.replace(/'/g, "\\'")}')">
          <div class="treatment-text-col">
            <span class="treatment-title">${t.title}</span>
            <span class="treatment-desc">${t.desc}</span>
          </div>
          ${isSel ? '<span class="zoho-treatment-check">✓</span>' : ''}
        </div>
      `;
    }).join('');
  }

  function toggleGstTreatmentDropdown(evt) {
    if (evt) evt.stopPropagation();
    const dropdown = document.getElementById('zoho-gst-treatment-dropdown');
    const chevron = document.getElementById('zoho-gst-treatment-chevron');
    if (!dropdown) return;
    const isCurrentlyOpen = dropdown.style.display === 'block';

    if (!isCurrentlyOpen) {
      dropdown.style.display = 'block';
      if (chevron) chevron.style.transform = 'rotate(180deg)';
      renderGstTreatmentOptions();
      setTimeout(() => {
        const inp = document.getElementById('zoho-gst-treatment-search-input');
        if (inp) {
          inp.value = '';
          inp.focus();
        }
      }, 50);
    } else {
      closeGstTreatmentDropdown();
    }
  }

  function closeGstTreatmentDropdown() {
    const dropdown = document.getElementById('zoho-gst-treatment-dropdown');
    const chevron = document.getElementById('zoho-gst-treatment-chevron');
    if (dropdown) dropdown.style.display = 'none';
    if (chevron) chevron.style.transform = 'rotate(0deg)';
  }

  function selectGstTreatment(title) {
    zohoSelectedGstTreatment = title;
    const disp = document.getElementById('zoho-gst-treatment-display-val');
    if (disp) {
      disp.innerText = title;
    }
    const hiddenInp = document.getElementById('zoho-gst-treatment-input');
    if (hiddenInp) {
      hiddenInp.value = title;
    }
    closeGstTreatmentDropdown();
  }

  function filterGstTreatments(query) {
    const q = (query || '').toLowerCase().trim();
    if (!q) {
      renderGstTreatmentOptions();
      return;
    }
    const filtered = ALL_GST_TREATMENTS.filter(t =>
      t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
    );
    renderGstTreatmentOptions(filtered);
  }

  function toggleGstPreferencesPopover(evt) {
    if (evt) evt.stopPropagation();
    const pop = document.getElementById('zoho-gst-pref-popover');
    if (!pop) return;
    const isCurrentlyOpen = pop.style.display === 'block';
    closeAllMorePopovers();
    closeGstTreatmentDropdown();
    document.querySelectorAll('.zoho-addr-popover').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.zoho-sac-popover').forEach(p => p.style.display = 'none');
    if (!isCurrentlyOpen) {
      const currClient = clientsData.find(c => c.id === zohoSubscriptionClientId || c.id === Number(zohoSubscriptionClientId)) || clientsData[0];
      if (currClient && currClient.gst_treatment) {
        zohoSelectedGstTreatment = currClient.gst_treatment;
        const disp = document.getElementById('zoho-gst-treatment-display-val');
        if (disp) disp.innerText = currClient.gst_treatment;
        const hiddenInp = document.getElementById('zoho-gst-treatment-input');
        if (hiddenInp) hiddenInp.value = currClient.gst_treatment;
      }
      pop.style.display = 'block';
    } else {
      pop.style.display = 'none';
    }
  }

  function closeGstPreferencesPopover() {
    const pop = document.getElementById('zoho-gst-pref-popover');
    if (pop) pop.style.display = 'none';
    closeGstTreatmentDropdown();
  }

  function saveGstPreferences() {
    const input = document.getElementById('zoho-gst-treatment-input');
    const val = input ? input.value : 'Unregistered Business';
    const currClient = clientsData.find(c => c.id === zohoSubscriptionClientId || c.id === Number(zohoSubscriptionClientId)) || clientsData[0];
    if (currClient) {
      currClient.gst_treatment = val;
    }
    const displaySpan = document.getElementById('zoho-gst-treatment-display');
    if (displaySpan) {
      displaySpan.innerText = val;
    }
    closeGstPreferencesPopover();
  }


  function toggleShippingGstPopover(evt) {
    if (evt) evt.stopPropagation();
    const pop = document.getElementById('zoho-ship-gst-popover');
    if (!pop) return;
    const isCurrentlyOpen = pop.style.display === 'block';
    closeAllMorePopovers();
    closeGstPreferencesPopover();
    document.querySelectorAll('.zoho-addr-popover').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.zoho-sac-popover').forEach(p => p.style.display = 'none');
    if (!isCurrentlyOpen) {
      const currClient = clientsData.find(c => c.id === zohoSubscriptionClientId || c.id === Number(zohoSubscriptionClientId)) || clientsData[0];
      const gstinInput = document.getElementById('zoho-ship-gstin-input');
      const legalInput = document.getElementById('zoho-ship-legal-name-input');
      const tradeInput = document.getElementById('zoho-ship-trade-name-input');
      const unregCheck = document.getElementById('zoho-ship-unregistered-check');
      if (currClient) {
        if (gstinInput) gstinInput.value = currClient.shipping_gstin || '';
        if (legalInput) legalInput.value = currClient.shipping_legal_name || '';
        if (tradeInput) tradeInput.value = currClient.shipping_trade_name || '';
        if (unregCheck) {
          unregCheck.checked = !!currClient.shipping_is_unregistered;
          onShippingGstUnregChange(unregCheck.checked);
        }
      }
      pop.style.display = 'block';
    } else {
      pop.style.display = 'none';
    }
  }

  function closeShippingGstPopover() {
    const pop = document.getElementById('zoho-ship-gst-popover');
    if (pop) pop.style.display = 'none';
  }

  function onShippingGstUnregChange(isUnreg) {
    const gstinInput = document.getElementById('zoho-ship-gstin-input');
    if (gstinInput) {
      if (isUnreg) {
        gstinInput.disabled = true;
        gstinInput.style.background = '#F9FAFB';
        gstinInput.value = '';
      } else {
        gstinInput.disabled = false;
        gstinInput.style.background = '#FFFFFF';
      }
    }
  }

  function saveShippingGstPreferences() {
    const isUnreg = document.getElementById('zoho-ship-unregistered-check')?.checked;
    const gstin = isUnreg ? '' : (document.getElementById('zoho-ship-gstin-input')?.value || '');
    const legalName = document.getElementById('zoho-ship-legal-name-input')?.value || '';
    const tradeName = document.getElementById('zoho-ship-trade-name-input')?.value || '';

    const currClient = clientsData.find(c => c.id === zohoSubscriptionClientId || c.id === Number(zohoSubscriptionClientId)) || clientsData[0];
    if (currClient) {
      currClient.shipping_is_unregistered = isUnreg;
      currClient.shipping_gstin = gstin;
      currClient.shipping_legal_name = legalName;
      currClient.shipping_trade_name = tradeName;
    }

    const gstinDisp = document.getElementById('zoho-shipping-gstin-display');
    if (gstinDisp) gstinDisp.innerText = gstin;
    const legalDisp = document.getElementById('zoho-shipping-legal-name-display');
    if (legalDisp) legalDisp.innerText = legalName;

    closeShippingGstPopover();
  }


  function renderSupplyStateOptions(list) {
    const container = document.getElementById('zoho-supply-options-list');
    if (!container) return;
    const states = list || ALL_SUPPLY_STATES;
    container.innerHTML = states.map(s => {
      const isSel = s.code === zohoSelectedSupplyState;
      return `
        <div class="zoho-supply-option-item ${isSel ? 'selected' : ''}" onclick="event.stopPropagation(); window.smatApp.selectSupplyState('${s.code}')">
          <span>[${s.code}] - ${s.name}</span>
          ${isSel ? '<span class="zoho-supply-check">✓</span>' : ''}
        </div>
      `;
    }).join('');
  }

  function toggleSupplyStateDropdown(evt) {
    if (evt) evt.stopPropagation();
    const pop = document.getElementById('zoho-supply-state-popover');
    if (!pop) return;
    const isCurrentlyOpen = pop.style.display === 'block';
    closeAllMorePopovers();
    closeGstPreferencesPopover();
    closeShippingGstPopover();
    document.querySelectorAll('.zoho-addr-popover').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.zoho-sac-popover').forEach(p => p.style.display = 'none');

    if (!isCurrentlyOpen) {
      pop.style.display = 'block';
      renderSupplyStateOptions();
      setTimeout(() => {
        const inp = document.getElementById('zoho-supply-search-input');
        if (inp) {
          inp.value = '';
          inp.focus();
        }
      }, 50);
    } else {
      pop.style.display = 'none';
    }
  }

  function closeSupplyStateDropdown() {
    const pop = document.getElementById('zoho-supply-state-popover');
    if (pop) pop.style.display = 'none';
  }

  function selectSupplyState(code) {
    zohoSelectedSupplyState = code;
    const found = ALL_SUPPLY_STATES.find(s => s.code === code);
    const disp = document.getElementById('zoho-supply-state-display');
    if (disp && found) {
      disp.innerText = `[${found.code}] - ${found.name}`;
    }
    const hiddenSelect = document.getElementById('zoho-sub-supply-state');
    if (hiddenSelect) {
      hiddenSelect.value = code;
    }
    closeSupplyStateDropdown();
  }

  function filterSupplyStates(query) {
    const q = (query || '').toLowerCase().trim();
    if (!q) {
      renderSupplyStateOptions(ALL_SUPPLY_STATES);
      return;
    }
    const filtered = ALL_SUPPLY_STATES.filter(s =>
      s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    );
    renderSupplyStateOptions(filtered);
  }

  function closeAllMorePopovers() {
    document.querySelectorAll('.zoho-more-popover').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.zoho-btn-row-more').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.zoho-plan-row-actions').forEach(w => w.classList.remove('open'));
    document.querySelectorAll('.zoho-addon-row-actions').forEach(w => w.classList.remove('open'));
  }

  function togglePlanMoreTooltip(evt) {
    if (evt) evt.stopPropagation();
    const tooltip = document.getElementById('zoho-plan-more-tooltip');
    const btn = document.getElementById('zoho-plan-more-btn');
    const wrap = document.getElementById('zoho-plan-actions-wrap');
    if (!tooltip) return;
    const isCurrentlyOpen = tooltip.style.display === 'block';
    closeAllMorePopovers();
    if (!isCurrentlyOpen) {
      tooltip.style.display = 'block';
      if (btn) btn.classList.add('active');
      if (wrap) wrap.classList.add('open');
    }
  }

  function toggleAddonMoreMenu(idx, evt) {
    if (evt) evt.stopPropagation();
    const menu = document.getElementById(`zoho-addon-more-menu-${idx}`);
    const btn = document.getElementById(`zoho-addon-more-btn-${idx}`);
    const wrap = document.getElementById(`zoho-addon-actions-wrap-${idx}`);
    if (!menu) return;
    const isCurrentlyOpen = menu.style.display === 'block';
    closeAllMorePopovers();
    if (!isCurrentlyOpen) {
      menu.style.display = 'block';
      if (btn) btn.classList.add('active');
      if (wrap) wrap.classList.add('open');
    }
  }

  if (typeof document !== 'undefined') {
    const handleOutsideClick = (e) => {
      // Close Plan & Addon three dots popovers/tooltips on outside tap
      if (!e.target.closest('.zoho-more-popover') && !e.target.closest('.zoho-more-trigger')) {
        closeAllMorePopovers();
      }
      if (!e || !e.target || typeof e.target.closest === 'function') return;

      // 1. SAC popover close on outside click
      if (!e.target.closest('.zoho-sac-popover') && !e.target.closest('.zoho-sac-badge-wrap')) {
        document.querySelectorAll('.zoho-sac-popover').forEach(p => p.style.display = 'none');
      }

      // 2. Address popover close on tap anywhere outside
      if (!e.target.closest('.zoho-addr-popover') && !e.target.closest('.zoho-addr-trigger')) {
        document.querySelectorAll('.zoho-addr-popover').forEach(p => p.style.display = 'none');
      }

      // 3. GST Preferences popover close on tap anywhere outside
      if (!e.target.closest('.zoho-gst-pref-popover') && !e.target.closest('.zoho-gst-pref-trigger')) {
        closeGstPreferencesPopover();
      }

      // 4. Shipping GST Popover close on tap anywhere outside
      if (!e.target.closest('.zoho-ship-gst-popover') && !e.target.closest('.zoho-ship-gst-trigger')) {
        closeShippingGstPopover();
      }

      // 5. Place of Supply popover close on tap anywhere outside
      if (!e.target.closest('.zoho-supply-popover') && !e.target.closest('.zoho-supply-trigger')) {
        closeSupplyStateDropdown();
      }

      // 6. Plan Tax popover close on tap anywhere outside
      if (!e.target.closest('#zoho-plan-tax-popover') && !e.target.closest('#zoho-plan-tax-trigger')) {
        closePlanTaxDropdown();
      }

      // 7. Addon Tax popover close on tap anywhere outside
      if (!e.target.closest('.zoho-addon-tax-popover') && !e.target.closest('[id^="zoho-addon-tax-trigger-"]')) {
        closeAllAddonTaxDropdowns();
      }

      // 8. Coupon popover close on tap anywhere outside
      if (!e.target.closest('#zoho-coupon-search-wrapper')) {
        closeZohoCouponDropdown();
      }

      // 9. Discount Preference popover close on tap anywhere outside
      if (!e.target.closest('#zoho-discount-pref-popover') && !e.target.closest('#zoho-discount-pref-trigger')) {
        closeDiscountPrefDropdown();
      }
    };

    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
  }

  function addZohoSubAddonRow() {
    // Screenshot 1: Creates an empty new row with "Type or click to select an addon."
    zohoSubAddons.push({
      id: `addon_${Date.now()}`,
      name: '',
      desc: '',
      sac: '998314',
      qty: 1,
      unit: '',
      price: 0,
      discountVal: 0,
      discountType: 'percent',
      taxRate: 18,
      taxLabel: 'GST18 [18%]',
      isEmpty: true
    });
    const viewport = document.getElementById('route-viewport');
    if (viewport) renderZohoSubscriptionView(viewport);
    // Focus the new row picker
    setTimeout(() => {
      const picker = document.getElementById(`zoho-addon-picker-${zohoSubAddons.length - 1}`);
      if (picker) picker.focus();
    }, 50);
  }

  function removeZohoSubAddonRow(idx) {
    if (zohoSubAddons.length <= 1) {
      // If single item, reset it to empty
      zohoSubAddons[0] = {
        id: `addon_${Date.now()}`,
        name: '',
        desc: '',
        sac: '998314',
        qty: 1,
        unit: '',
        price: 0,
        discountVal: 0,
        discountType: 'percent',
        taxRate: 0,
        isEmpty: true
      };
    } else {
      zohoSubAddons.splice(idx, 1);
    }
    const viewport = document.getElementById('route-viewport');
    if (viewport) renderZohoSubscriptionView(viewport);
    updateZohoSubCalculations();
  }

  function updateZohoSubCalculations() {
    // 1. Plan Calculation
    const planPrice = parseFloat(document.getElementById('zoho-plan-price')?.value) || 0;
    const planQty = parseInt(document.getElementById('zoho-plan-qty')?.value, 10) || 1;
    const planBase = planPrice * planQty;

    const planDiscVal = parseFloat(document.getElementById('zoho-plan-disc-val')?.value) || 0;
    const planDiscType = document.getElementById('zoho-plan-disc-type')?.value || 'percent';
    let planDiscountAmt = 0;
    if (planDiscType === 'percent') {
      planDiscountAmt = (planBase * Math.min(100, Math.max(0, planDiscVal))) / 100;
    } else {
      planDiscountAmt = Math.min(planBase, Math.max(0, planDiscVal));
    }

    const planNet = Math.max(0, planBase - planDiscountAmt);
    const planAmountEl = document.getElementById('zoho-plan-row-amount');
    if (planAmountEl) {
      planAmountEl.innerText = `Rs. ${planNet.toLocaleString('en-IN')}.00`;
    }

    // 2. Addons Calculation
    let totalAddonsBase = 0;
    let totalAddonsDiscount = 0;

    zohoSubAddons.forEach((addon, idx) => {
      const aQty = parseInt(document.getElementById(`zoho-addon-qty-${idx}`)?.value, 10) || 1;
      const aPrice = parseFloat(document.getElementById(`zoho-addon-price-${idx}`)?.value) || 0;
      const aBase = aQty * aPrice;

      const aDiscVal = parseFloat(document.getElementById(`zoho-addon-disc-val-${idx}`)?.value) || 0;
      const aDiscType = document.getElementById(`zoho-addon-disc-type-${idx}`)?.value || 'percent';
      let aDiscAmt = 0;
      if (aDiscType === 'percent') {
        aDiscAmt = (aBase * Math.min(100, Math.max(0, aDiscVal))) / 100;
      } else {
        aDiscAmt = Math.min(aBase, Math.max(0, aDiscVal));
      }

      totalAddonsBase += aBase;
      totalAddonsDiscount += aDiscAmt;

      const aRowAmtEl = document.getElementById(`zoho-addon-amount-${idx}`);
      if (aRowAmtEl) {
        aRowAmtEl.innerText = `Rs. ${Math.max(0, aBase - aDiscAmt).toLocaleString('en-IN')}.00`;
      }
    });

    // 3. Combined Final Billing & Selected Tax Rate & Coupon
    let couponDiscountAmt = 0;
    if (selectedZohoCoupon && selectedZohoCoupon.discount_value) {
      const valStr = selectedZohoCoupon.discount_value;
      if (valStr.includes('%')) {
        const pct = parseFloat(valStr.replace(/[^0-9.]/g, '')) || 0;
        couponDiscountAmt = ((planBase + totalAddonsBase) * pct) / 100;
      } else {
        couponDiscountAmt = parseFloat(valStr.replace(/[^0-9.]/g, '')) || 0;
      }
    }
    const totalDiscounts = ((zohoDiscountPref === 'item-level') ? (planDiscountAmt + totalAddonsDiscount) : 0) + couponDiscountAmt;
    const taxableBase = Math.max(0, (planBase + totalAddonsBase) - totalDiscounts);
    const planTaxVal = parseFloat(document.getElementById('zoho-plan-tax')?.value);
    const taxRate = !isNaN(planTaxVal) ? (planTaxVal / 100) : 0.18;
    const taxAmt = Math.round(taxableBase * taxRate * 100) / 100;
    const finalTotal = taxableBase + taxAmt;

    // Update Summary Elements
    const sPlan = document.getElementById('zoho-sum-plan-price');
    if (sPlan) sPlan.innerText = `Rs. ${planBase.toLocaleString('en-IN')}.00`;

    const sAddons = document.getElementById('zoho-sum-addons-price');
    if (sAddons) sAddons.innerText = `+ Rs. ${totalAddonsBase.toLocaleString('en-IN')}.00`;

    const sDisc = document.getElementById('zoho-sum-disc-price');
    if (sDisc) sDisc.innerText = `- Rs. ${totalDiscounts.toLocaleString('en-IN')}.00`;

    const sTaxable = document.getElementById('zoho-sum-taxable-price');
    if (sTaxable) sTaxable.innerText = `Rs. ${taxableBase.toLocaleString('en-IN')}.00`;

    const sTax = document.getElementById('zoho-sum-tax-price');
    if (sTax) sTax.innerText = `+ Rs. ${taxAmt.toLocaleString('en-IN')}.00`;

    const sFinal = document.getElementById('zoho-sum-final-price');
    if (sFinal) sFinal.innerText = `Rs. ${finalTotal.toLocaleString('en-IN')}.00`;
  }

  function saveZohoSubscription() {
    const currClient = clientsData.find(c => c.id === zohoSubscriptionClientId || c.id === Number(zohoSubscriptionClientId)) || clientsData[0];
    if (!currClient) {
      alert('Please select a valid customer.');
      return;
    }

    const planVal = document.getElementById('zoho-plan-select')?.value || 'Starter New Monthly (Without WA)|1890';
    const planName = planVal.split('|')[0].replace(/\(.*\)/g, '').trim();
    const subNum = document.getElementById('zoho-sub-num')?.value || 'SUB-01083';
    const salesPerson = document.getElementById('zoho-sub-sales')?.value || currClient.sales_person || 'Rahul Sharma';
    const gstNum = document.getElementById('zoho-sub-gst')?.value || currClient.gst_number || '';
    const finalPriceText = document.getElementById('zoho-sum-final-price')?.innerText || 'Rs. 2,938.20';
    const finalPrice = parseFloat(finalPriceText.replace(/[^0-9.]/g, '')) || 2938.2;

    // Update client record
    currClient.plan_name = planName;
    currClient.subscription_id = subNum;
    currClient.sales_person = salesPerson;
    currClient.gst_number = gstNum;
    currClient.subscription_status = 'Active';
    currClient.inr_amount = Math.round(finalPrice);
    currClient.subscription_amount_display = `₹ ${Math.round(finalPrice).toLocaleString('en-IN')}.00`;
    currClient.final_billing = {
      plan_name: planName,
      subscription_id: subNum,
      sales_person: salesPerson,
      final_payable: finalPrice,
      payment_mode: 'Offline',
      payment_terms: document.getElementById('zoho-sub-terms')?.value || 'Due on Receipt',
      customer_notes: document.getElementById('zoho-sub-notes')?.value || '',
      updated_at: new Date().toISOString()
    };

    alert(`✓ Subscription ${subNum} for ${currClient.name} successfully updated!`);
    navigateTo('subscriptions');
  }


  function renderSubscriptionCreationView(container) {
    renderZohoEditCustomerView(container);
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
      <!-- Sub-Navigation Bar for Subscriptions (Zoho Reference vs Directory) -->
      <div style="padding:0.75rem 2rem 0 2rem; background:#F8FAFC; border-bottom:1px solid #E5E7EB; display:flex; gap:0.5rem; align-items:center; margin-bottom:1.5rem;">
        <button class="btn-table-action btn-action-secondary" style="background:#FFFFFF; border-radius:6px 6px 0 0; padding:0.55rem 1.25rem; font-weight:500;" onclick="window.smatApp.openZohoSubscription(10)">
          ⚡ Change / New Subscription
        </button>
        <button class="btn-table-action btn-action-primary" style="background:#1877F2; border-color:#1877F2; border-radius:6px 6px 0 0; padding:0.55rem 1.25rem; font-weight:600;" onclick="window.smatApp.navigateTo('subscriptions-directory')">
          📋 Active Client Subscriptions Directory
        </button>
      </div>

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
          <button class="btn-table-action btn-action-primary" onclick="window.smatApp.openZohoSubscription(10)" style="background:#1877F2; border-color:#1877F2;">
            ⚡ + Add Subscription (Zoho Reference)
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
            ` : paginatedSubs.map((c, idx) => `
              <tr>
                <td style="font-weight:600; color:#64748B;">${startIdx + idx + 1}</td>
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
                <td style="text-align: center; white-space: nowrap;">
                  <div style="display:inline-flex; gap:0.4rem; justify-content:center;">
                    <button class="btn-table-action btn-action-primary" onclick="window.smatApp.openZohoSubscription(${c.id})" title="Change Subscription">
                      ⚡ Change Subscription
                    </button>
                    <button class="btn-table-action btn-action-secondary" onclick="window.smatApp.openZohoEditCustomer(${c.id})" title="Edit Customer & Billing Details">
                      ✏️ Edit Billing
                    </button>
                  </div>
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
    const clean = planName.replace(' (WA)', '').replace('_Monthly', '').replace('_Yearly', '').trim();
    return PLAN_TIER_META[clean]?.rank ?? (clean.includes('Enterprise') ? 3 : clean.includes('Pro') ? 2 : clean.includes('Custom') ? 4 : 1);
  }

  function getPlanMeta(planName) {
    if (!planName) return PLAN_TIER_META['Pro NY'] || PLAN_TIER_META['Pro'];
    const clean = planName.replace(' (WA)', '').replace('_Monthly', '').replace('_Yearly', '').trim();
    return PLAN_TIER_META[clean] || PLAN_TIER_META['Pro NY'] || PLAN_TIER_META['Pro'];
  }

  function openAddSubscriptionModal() {
    openZohoSubscription(null);
  }

  function openPlanModal(clientId, defaultPlan, isAddSubscription = false) {
    // Legacy mock modal decommissioned - seamlessly routes to official Zoho Subscription Engine
    openZohoSubscription(clientId);
  }

  // Helper: Apply Subscription Update
  function applyPlanActivation(targetClient, selectedPlan, durationMonths, selectedAddons, calcResult = null) {
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
    
    if (calcResult && calcResult.finalPayable !== undefined) {
      targetClient.subscription_amount_display = `${calcResult.currencySymbol}${calcResult.finalPayable.toLocaleString('en-IN')}.00`;
      targetClient.final_billing = {
        base_plan_price: calcResult.basePlanPrice,
        addons_subtotal: calcResult.addonsSubtotal,
        discount_deducted: calcResult.totalDiscount,
        taxable_amount: calcResult.taxableAmount,
        tax_gst18: calcResult.taxAmount,
        final_payable: calcResult.finalPayable,
        sac_code: '998314'
      };
    } else {
      targetClient.subscription_amount_display = targetClient.currency_type === 'USD' ? `$ ${totalAmount.toFixed(2)}` : `₹ ${totalAmount.toLocaleString('en-IN')}.00`;
    }

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

    showToast(`Subscription successfully updated for ${targetClient.name} (${durationMonths} Mos)!`);
    closeModal();
    if (currentRoute === 'subscriptions') renderClientSubscriptionsView($('#route-viewport'));
    else if (currentRoute === 'renewals') renderRenewalsView($('#route-viewport'));
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
            ` : paginatedRenewals.map((c, idx) => `
              <tr>
                <td style="font-weight:600; color:#64748B;">${startIdx + idx + 1}</td>
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
  // =========================================================================
  // 9B. MODULE 6: DISCOUNT COUPONS & VOUCHERS SYSTEM (Zoho Billing Ref)
  // =========================================================================
  let couponFilter = 'all'; // 'all', 'active', 'expired', 'maxed'
  let couponPage = 1;
  let couponPageSize = 25;
  let selectedCouponIds = new Set();

  let couponsData = [
    {
      id: 101,
      product: 'SmatBot',
      name: 'ismail2',
      code: 'test_ismail2',
      status: 'Active',
      discount_value: '90%',
      discount_by: 'Percentage',
      redemption_type: 'One-Time',
      associate_plans: 'All Plans',
      associate_addons: 'All Recurring Addons',
      max_redemption: 100,
      valid_upto: '31/12/2026'
    },
    {
      id: 102,
      product: 'SmatBot',
      name: 'ismail_99',
      code: '99_ismail',
      status: 'Active',
      discount_value: '99%',
      discount_by: 'Percentage',
      redemption_type: 'One-Time',
      associate_plans: 'All Plans',
      associate_addons: 'All Recurring Addons',
      max_redemption: 100,
      valid_upto: '31/12/2026'
    },
    {
      id: 103,
      product: 'SmatBot',
      name: 'ismail_test',
      code: 'test_ismail',
      status: 'Active',
      discount_value: '90%',
      discount_by: 'Percentage',
      redemption_type: 'One-Time',
      associate_plans: 'All Plans',
      associate_addons: 'All Recurring Addons',
      max_redemption: 100,
      valid_upto: '31/12/2026'
    },
    {
      id: 104,
      product: 'SmatBot',
      name: 'SWAPNIL95',
      code: 'SWAPNIL95',
      status: 'Active',
      discount_value: '95%',
      discount_by: 'Percentage',
      redemption_type: 'One-Time',
      associate_plans: 'All Plans',
      associate_addons: 'All Recurring Addons',
      max_redemption: 100,
      valid_upto: '31/12/2026'
    },
    {
      id: 105,
      product: 'SmatBot',
      name: 'SWAPNIL98',
      code: 'SWAPNIL98',
      status: 'Active',
      discount_value: '98%',
      discount_by: 'Percentage',
      redemption_type: 'One-Time',
      associate_plans: 'All Plans',
      associate_addons: 'All Recurring Addons',
      max_redemption: 100,
      valid_upto: '31/12/2026'
    },
    {
      id: 106,
      product: 'SmatBot',
      name: 'TESTCOUPONCHANGE',
      code: 'TESTCOUPONCHANGE',
      status: 'Active',
      discount_value: '20%',
      discount_by: 'Percentage',
      redemption_type: 'One-Time',
      associate_plans: 'All Plans',
      associate_addons: 'All Recurring Addons',
      max_redemption: 100,
      valid_upto: '31/12/2026'
    },
    {
      id: 107,
      product: 'SmatBot',
      name: 'TESTCOUPONCHANGEUnlimited',
      code: 'TESTCOUPONCHANGEUnlimited',
      status: 'Active',
      discount_value: '',
      discount_by: 'Percentage',
      redemption_type: 'Unlimited',
      associate_plans: 'All Plans',
      associate_addons: 'All Recurring Addons',
      max_redemption: 9999,
      valid_upto: '31/12/2026'
    },
    {
      id: 1,
      product: 'SmatBot',
      name: '30PERCENTADD',
      code: '30PERCENTADD',
      status: 'Active',
      discount_value: '30%',
      discount_by: 'Percentage',
      redemption_type: 'One-Time',
      associate_plans: 'All Plans',
      associate_addons: 'All Recurring Addons',
      max_redemption: 100,
      valid_upto: '31/12/2026'
    },
    {
      id: 2,
      product: 'WhatsApp Chatbot',
      name: '50PERCENTADD',
      code: '50PERCENTADD',
      status: 'Active',
      discount_value: '50%',
      discount_by: 'Percentage',
      redemption_type: 'One-Time',
      associate_plans: 'All Plans',
      associate_addons: 'All Recurring Addons',
      max_redemption: 50,
      valid_upto: '31/12/2026'
    },
    {
      id: 3,
      product: 'SmatBot',
      name: '90PERCENTADD',
      code: '90PERCENTADD',
      status: 'Expired',
      discount_value: 'Rs.90.00',
      discount_by: 'Flat',
      redemption_type: 'One-Time',
      associate_plans: 'All Plans',
      associate_addons: 'All Recurring Addons',
      max_redemption: 100,
      valid_upto: '31/12/2024'
    },
    {
      id: 42,
      product: 'SmatBot',
      name: 'SMATDEEP15',
      code: 'SMATDEEP15',
      status: 'Active',
      discount_value: '15%',
      discount_by: 'Percentage',
      redemption_type: 'One-Time',
      associate_plans: 'All Plans',
      associate_addons: 'All Recurring Addons',
      max_redemption: 50,
      valid_upto: '30/12/2023',
      created_at: '2023-09-12'
    },
    {
      id: 50,
      product: 'SmatBot',
      name: 'XMAS20',
      code: 'XMAS20',
      status: 'Maxed Out',
      discount_value: '20%',
      discount_by: 'Percentage',
      redemption_type: 'One-Time',
      associate_plans: 'All Plans',
      associate_addons: 'All Recurring Addons',
      max_redemption: 100,
      valid_upto: '01/01/2025'
    }
  ];

  function renderCouponsView(container) {
    const activeCouponsCount = couponsData.filter(c => c.status === 'Active').length;
    const totalRedemptions = couponsData.reduce((acc, c) => acc + (c.used_count || (typeof c.max_redemption === 'number' ? c.max_redemption : 25)), 0);

    let filtered = [...couponsData];
    if (couponFilter === 'active') {
      filtered = filtered.filter(c => c.status === 'Active');
    } else if (couponFilter === 'expired') {
      filtered = filtered.filter(c => c.status === 'Expired');
    } else if (couponFilter === 'maxed') {
      filtered = filtered.filter(c => c.status === 'Maxed Out');
    }

    const totalCoupons = filtered.length;
    const totalPages = Math.ceil(totalCoupons / couponPageSize) || 1;
    if (couponPage > totalPages) couponPage = totalPages;
    if (couponPage < 1) couponPage = 1;

    const startIdx = (couponPage - 1) * couponPageSize;
    const endIdx = Math.min(startIdx + couponPageSize, totalCoupons);
    const pagedCoupons = filtered.slice(startIdx, endIdx);

    const filterLabels = {
      'all': 'All Coupons',
      'active': 'Active Coupons',
      'expired': 'Expired Coupons',
      'maxed': 'Maxed Out Coupons'
    };
    const currentFilterLabel = filterLabels[couponFilter] || 'All Coupons';

    container.innerHTML = `
      <!-- Top Metrics Overview (How many used coupons, Total, Active) -->
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

      <!-- Header Row: Title & Action Controls -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
        <div>
          <h2 class="section-page-title" style="margin:0;">Discount Coupons & Vouchers</h2>
          <p style="font-size:0.85rem; color:#64748B; margin-top:4px;">Generate promotional discount codes, manage redemption limits, and activate campaign vouchers.</p>
        </div>

        <div style="display:flex; align-items:center; gap:0.5rem;">
          <!-- Filter Dropdown -->
          <div style="position:relative; display:inline-block;">
            <button type="button" class="btn-coupon-filter-dropdown" onclick="window.smatApp.toggleCouponsFilterDropdown()" style="display:inline-flex; align-items:center; gap:6px; background:#fff; border:1px solid #CBD5E1; font-size:0.85rem; font-weight:600; color:#0F172A; cursor:pointer; padding:6px 12px; border-radius:4px;">
              <span>${currentFilterLabel}</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div id="coupons-filter-menu" class="dropdown-popover-menu" style="display:none; position:absolute; top:110%; right:0; min-width:180px; background:#fff; border:1px solid #E2E8F0; border-radius:8px; box-shadow:0 10px 25px -5px rgba(0,0,0,0.1); z-index:50; padding:6px 0;">
              <a href="javascript:void(0)" onclick="window.smatApp.setCouponFilter('all')" class="dropdown-item ${couponFilter === 'all' ? 'active' : ''}" style="display:block; padding:8px 16px; font-size:0.85rem; color:#1E293B; text-decoration:none;">All Coupons</a>
              <a href="javascript:void(0)" onclick="window.smatApp.setCouponFilter('active')" class="dropdown-item ${couponFilter === 'active' ? 'active' : ''}" style="display:block; padding:8px 16px; font-size:0.85rem; color:#10B981; text-decoration:none; font-weight:600;">Active</a>
              <a href="javascript:void(0)" onclick="window.smatApp.setCouponFilter('expired')" class="dropdown-item ${couponFilter === 'expired' ? 'active' : ''}" style="display:block; padding:8px 16px; font-size:0.85rem; color:#64748B; text-decoration:none;">Expired</a>
              <a href="javascript:void(0)" onclick="window.smatApp.setCouponFilter('maxed')" class="dropdown-item ${couponFilter === 'maxed' ? 'active' : ''}" style="display:block; padding:8px 16px; font-size:0.85rem; color:#F59E0B; text-decoration:none; font-weight:600;">Maxed Out</a>
            </div>
          </div>

          <button class="btn-table-action btn-action-primary" onclick="window.smatApp.openAddCouponModal()" style="padding:0.45rem 1.15rem; font-size:0.85rem; font-weight:600; border-radius:4px; display:inline-flex; align-items:center; gap:6px; background:#1877F2; border:none; color:#fff; cursor:pointer;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            New
          </button>
        </div>
      </div>

      <!-- Coupons Table Container -->
      <div class="table-card-container coupons-table-card" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:6px; overflow-x:auto;">
        <table class="client-data-table coupons-table" style="width:100%; border-collapse:collapse;">
          <thead>
            <tr style="background:#F8FAFC; border-bottom:1px solid #E2E8F0;">
              <th style="width:40px; text-align:center; padding:10px 8px;">
                <div style="display:flex; align-items:center; justify-content:center; gap:6px;">
                  <!-- Filter slider icon -->
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                  <input type="checkbox" id="coupon-select-all" onchange="window.smatApp.toggleCouponSelectAll(this.checked)" style="cursor:pointer;" />
                </div>
              </th>
              <th style="text-align:left; font-size:0.73rem; font-weight:700; color:#64748B; text-transform:uppercase; letter-spacing:0.5px; padding:10px 14px;">NAME</th>
              <th style="text-align:left; font-size:0.73rem; font-weight:700; color:#64748B; text-transform:uppercase; letter-spacing:0.5px; padding:10px 14px;">COUPON CODE</th>
              <th style="text-align:left; font-size:0.73rem; font-weight:700; color:#64748B; text-transform:uppercase; letter-spacing:0.5px; padding:10px 14px;">STATUS</th>
              <th style="text-align:left; font-size:0.73rem; font-weight:700; color:#64748B; text-transform:uppercase; letter-spacing:0.5px; padding:10px 14px;">DISCOUNT VALUE</th>
              <th style="text-align:left; font-size:0.73rem; font-weight:700; color:#64748B; text-transform:uppercase; letter-spacing:0.5px; padding:10px 14px;">DISCOUNT BY</th>
              <th style="text-align:left; font-size:0.73rem; font-weight:700; color:#64748B; text-transform:uppercase; letter-spacing:0.5px; padding:10px 14px;">REDEMPTION TYPE</th>
              <th style="text-align:left; font-size:0.73rem; font-weight:700; color:#64748B; text-transform:uppercase; letter-spacing:0.5px; padding:10px 14px;">MAXIMUM REDEMPTION</th>
              <th style="text-align:left; font-size:0.73rem; font-weight:700; color:#64748B; text-transform:uppercase; letter-spacing:0.5px; padding:10px 20px;">VALID UPTO</th>
              <th style="text-align:center; font-size:0.73rem; font-weight:700; color:#64748B; text-transform:uppercase; letter-spacing:0.5px; padding:10px 14px; width:75px;">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            ${pagedCoupons.length === 0 ? `
              <tr>
                <td colspan="10" style="text-align:center; padding:3rem; color:#94A3B8;">
                  No coupons found for "<strong>${currentFilterLabel}</strong>". Click <a href="javascript:void(0)" onclick="window.smatApp.openAddCouponModal()" style="color:#1877F2; font-weight:600;">+ New</a> to create one.
                </td>
              </tr>
            ` : pagedCoupons.map((c) => {
              const isChecked = selectedCouponIds.has(c.id);
              let statusHtml = `<span style="color:#64748B; font-weight:500;">Expired</span>`;
              if (c.status === 'Active') {
                statusHtml = `<span style="color:#10B981; font-weight:600;">Active</span>`;
              } else if (c.status === 'Maxed Out') {
                statusHtml = `<span style="color:#F59E0B; font-weight:600;">Maxed Out</span>`;
              }

              const maxRedemptionsDisplay = (c.max_redemption !== null && c.max_redemption !== undefined && c.max_redemption !== '-') ? c.max_redemption : '';
              const validUptoDisplay = (c.valid_upto && c.valid_upto !== '-') ? c.valid_upto : '';

              return `
                <tr onclick="window.smatApp.openEditCouponModal(${c.id})" style="border-bottom:1px solid #F1F5F9; cursor:pointer;" title="Click to view details / edit">
                  <td style="text-align:center; padding:11px 8px;" onclick="event.stopPropagation();">
                    <input type="checkbox" class="coupon-row-checkbox" ${isChecked ? 'checked' : ''} onchange="window.smatApp.toggleCouponSelectRow(${c.id}, this.checked)" style="cursor:pointer;" />
                  </td>
                  <td style="font-weight:500; color:#0F172A; padding:11px 14px;">${c.name}</td>
                  <td style="padding:11px 14px;">
                    <div style="display:inline-flex; align-items:center; gap:6px;">
                      <span style="font-weight:500; color:#0F172A;">${c.code}</span>
                      <button class="btn-copy-inline" onclick="event.stopPropagation(); window.smatApp.copyToClipboard('${c.code}', 'coupon code')" title="Copy Code" style="background:none; border:none; padding:2px; cursor:pointer; color:#94A3B8;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      </button>
                    </div>
                  </td>
                  <td style="padding:11px 14px;">${statusHtml}</td>
                  <td style="padding:11px 14px; font-weight:500; color:#0F172A;">${c.discount_value}</td>
                  <td style="padding:11px 14px; color:#334155;">${c.discount_by}</td>
                  <td style="padding:11px 14px; color:#334155;">${c.redemption_type}</td>
                  <td style="padding:11px 14px; color:#334155;">${maxRedemptionsDisplay}</td>
                  <td style="padding:11px 20px; color:#334155;">${validUptoDisplay}</td>
                  <td style="text-align:center; padding:8px 10px;" onclick="event.stopPropagation();">
                    <button class="btn-action-view-coupon" onclick="event.stopPropagation(); window.smatApp.openCouponEyeModal(${c.id})" title="View Details">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <!-- Table Footer: Zoho Style -->
        <div style="padding:0.75rem 1rem; display:flex; justify-content:space-between; align-items:center; background:#FFFFFF; border-top:1px solid #E2E8F0;">
          <div style="font-size:0.84rem; color:#475569;">
            Total Count: <a href="javascript:void(0)" onclick="window.smatApp.showTotalCouponsCount()" style="color:#1877F2; text-decoration:none; font-weight:500;">View</a>
            <span style="color:#94A3B8; margin-left:6px; font-size:0.78rem;">(${totalCoupons} total)</span>
          </div>

          <div style="display:flex; align-items:center; gap:0.75rem;">
            <!-- Page Size Dropdown -->
            <div style="display:inline-flex; align-items:center; gap:5px; border:1px solid #CBD5E1; border-radius:4px; padding:2px 8px; font-size:0.8rem; color:#475569; background:#fff;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              <select onchange="window.smatApp.changeCouponPageSize(Number(this.value))" style="border:none; background:none; font-size:0.8rem; color:#475569; outline:none; cursor:pointer;">
                <option value="25" ${couponPageSize === 25 ? 'selected' : ''}>25 per page</option>
                <option value="50" ${couponPageSize === 50 ? 'selected' : ''}>50 per page</option>
                <option value="100" ${couponPageSize === 100 ? 'selected' : ''}>100 per page</option>
              </select>
            </div>

            <!-- Page Range & Navigation -->
            <div style="display:inline-flex; align-items:center; gap:6px; font-size:0.82rem; color:#475569; border:1px solid #CBD5E1; border-radius:4px; padding:2px 8px; background:#fff;">
              <button onclick="window.smatApp.goToCouponPage(${couponPage - 1})" ${couponPage <= 1 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : 'style="cursor:pointer;"'} style="background:none; border:none; color:#1877F2; font-weight:700; font-size:0.9rem;">‹</button>
              <span style="font-weight:500;">${totalCoupons === 0 ? '0 - 0' : `${startIdx + 1} - ${endIdx}`}</span>
              <button onclick="window.smatApp.goToCouponPage(${couponPage + 1})" ${couponPage >= totalPages ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : 'style="cursor:pointer;"'} style="background:none; border:none; color:#1877F2; font-weight:700; font-size:0.9rem;">›</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function toggleCouponsFilterDropdown() {
    const menu = $('#coupons-filter-menu');
    if (!menu) return;
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  }

  function setCouponFilter(type) {
    couponFilter = type;
    couponPage = 1;
    const menu = $('#coupons-filter-menu');
    if (menu) menu.style.display = 'none';
    renderCouponsView($('#route-viewport'));
  }

  function goToCouponPage(page) {
    couponPage = page;
    renderCouponsView($('#route-viewport'));
  }

  function changeCouponPageSize(size) {
    couponPageSize = size;
    couponPage = 1;
    renderCouponsView($('#route-viewport'));
  }

  function toggleCouponSelectAll(checked) {
    if (checked) {
      couponsData.forEach(c => selectedCouponIds.add(c.id));
    } else {
      selectedCouponIds.clear();
    }
    $$('.coupon-row-checkbox').forEach(cb => cb.checked = checked);
  }

  function toggleCouponSelectRow(id, checked) {
    if (checked) {
      selectedCouponIds.add(id);
    } else {
      selectedCouponIds.delete(id);
    }
    const allCb = $('#coupon-select-all');
    if (allCb) {
      const allChecked = couponsData.every(c => selectedCouponIds.has(c.id));
      allCb.checked = allChecked;
    }
  }

  function showTotalCouponsCount() {
    showToast(`Total Coupons count: ${couponsData.length} records available.`);
  }

  function handleCouponDiscountByChange() {
    const by = $('#coupon-discount-by-input')?.value;
    const input = $('#coupon-discount-value-input');
    if (!input) return;
    if (by === 'Flat') {
      input.placeholder = 'e.g. Rs.90.00';
    } else {
      input.placeholder = 'e.g. 30%';
    }
  }

  const couponDropdownState = {
    product: {
      selected: 'Feltso test',
      triggerText: 'Select Product',
      options: ['Feltso test', 'SmatBot'],
      hasNewAction: true
    },
    redemptionType: {
      selected: 'One-Time',
      triggerText: 'One-Time',
      options: ['One-Time', 'Unlimited', 'Limited Cycles'],
      hasNewAction: false
    },
    plans: {
      selected: 'All Plans',
      triggerText: 'All Plans',
      options: ['All Plans', 'None', 'Selected Plans'],
      hasNewAction: false
    },
    addons: {
      selected: 'All Recurring Addons',
      triggerText: 'All Recurring Addons',
      options: ['All Addons', 'All Recurring Addons', 'All One-time Addons', 'None', 'Selected Addons'],
      hasNewAction: false
    }
  };

  function renderCouponDropdownOptions(key) {
    const list = $(`#options-coupon-${key}`);
    if (!list || !couponDropdownState[key]) return;
    const { options, selected, hasNewAction } = couponDropdownState[key];

    let html = options.map(opt => {
      const isSelected = opt === selected;
      return `
        <div 
          class="coupon-option-item ${isSelected ? 'selected' : ''}" 
          onclick="window.smatApp.selectCouponDropdownOption('${key}', '${opt.replace(/'/g, "\\'")}')"
        >
          <span>${opt}</span>
          ${isSelected ? `
            <svg class="coupon-option-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ` : ''}
        </div>
      `;
    }).join('');

    if (hasNewAction) {
      html += `
        <div class="coupon-action-new-product" onclick="window.smatApp.addNewProductFromCouponModal(event)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#2563EB">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16" stroke="#fff" stroke-width="2.5"></line>
            <line x1="8" y1="12" x2="16" y2="12" stroke="#fff" stroke-width="2.5"></line>
          </svg>
          <span>New Product</span>
        </div>
      `;
    }

    list.innerHTML = html;
  }

  function toggleCouponDropdown(key, event) {
    if (event) event.stopPropagation();
    const popover = $(`#popover-coupon-${key}`);
    const trigger = $(`#trigger-coupon-${key}`);
    if (!popover || !trigger) return;

    const isOpen = popover.style.display !== 'none';
    closeAllCouponDropdowns();

    if (!isOpen) {
      popover.style.display = 'block';
      trigger.classList.add('active');
      renderCouponDropdownOptions(key);
      const searchInput = popover.querySelector('.coupon-search-input');
      if (searchInput) {
        searchInput.value = '';
        setTimeout(() => searchInput.focus(), 50);
      }
    }
  }

  function closeAllCouponDropdowns() {
    ['product', 'redemptionType', 'plans', 'addons'].forEach(k => {
      const popover = $(`#popover-coupon-${k}`);
      const trigger = $(`#trigger-coupon-${k}`);
      if (popover) popover.style.display = 'none';
      if (trigger) trigger.classList.remove('active');
    });
  }

  function selectCouponDropdownOption(key, value) {
    if (!couponDropdownState[key]) return;
    couponDropdownState[key].selected = value;
    couponDropdownState[key].triggerText = value;

    const inputMap = {
      product: 'coupon-product-input',
      redemptionType: 'coupon-redemption-type-input',
      plans: 'coupon-associate-plans-input',
      addons: 'coupon-associate-addons-input'
    };
    const inputId = inputMap[key];
    const hiddenInput = $(`#${inputId}`);
    if (hiddenInput) hiddenInput.value = value;

    const labelEl = $(`#label-coupon-${key}`);
    if (labelEl) {
      labelEl.textContent = value;
      if (key === 'product' && value === 'Select Product') {
        labelEl.classList.add('placeholder');
      } else {
        labelEl.classList.remove('placeholder');
      }
    }

    renderCouponDropdownOptions(key);
    closeAllCouponDropdowns();
  }

  function filterCouponDropdown(key, query) {
    const term = (query || '').trim().toLowerCase();
    const list = $(`#options-coupon-${key}`);
    if (!list) return;
    const items = list.querySelectorAll('.coupon-option-item');
    items.forEach(item => {
      const text = (item.querySelector('span')?.textContent || '').toLowerCase();
      item.style.display = text.includes(term) ? 'flex' : 'none';
    });
  }

  function addNewProductFromCouponModal(event) {
    if (event) event.stopPropagation();
    const newProd = prompt('Enter new product name:');
    if (!newProd || !newProd.trim()) return;
    const prodName = newProd.trim();
    if (!couponDropdownState.product.options.includes(prodName)) {
      couponDropdownState.product.options.push(prodName);
    }
    selectCouponDropdownOption('product', prodName);
    showToast(`Product "${prodName}" added`);
  }

  function openAddCouponModal() {
    // Reset dropdown states for new coupon creation
    couponDropdownState.product.selected = 'Feltso test';
    couponDropdownState.product.triggerText = 'Select Product';
    couponDropdownState.redemptionType.selected = 'One-Time';
    couponDropdownState.redemptionType.triggerText = 'One-Time';
    couponDropdownState.plans.selected = 'All Plans';
    couponDropdownState.plans.triggerText = 'All Plans';
    couponDropdownState.addons.selected = 'All Recurring Addons';
    couponDropdownState.addons.triggerText = 'All Recurring Addons';

    const modal = $('#modal-container');
    modal.innerHTML = `
      <div class="modal-overlay open" onclick="if(event.target === this) window.smatApp.closeModal()" style="display:flex; align-items:center; justify-content:center; background:rgba(15,23,42,0.45); position:fixed; inset:0; z-index:9999;">
        <div class="coupon-create-modal-card" onclick="window.smatApp.closeAllCouponDropdowns(); event.stopPropagation();">
          <!-- Top Header: New Coupon Title & Close Button -->
          <div class="coupon-create-modal-header">
            <h3 class="coupon-create-modal-title">New Coupon</h3>
            <button type="button" class="coupon-create-modal-close" onclick="window.smatApp.closeModal()" title="Close">✕</button>
          </div>

          <form onsubmit="window.smatApp.handleAddCouponSubmit(event)">
            <!-- Top Fields Grid (2 Columns) -->
            <div class="coupon-modal-grid">
              <!-- Row 1: Product* (Left) with Searchable Dropdown matching Screenshot 4 -->
              <div class="coupon-field-row">
                <label class="coupon-field-label required">Product*</label>
                <div class="coupon-field-control">
                  <div class="coupon-searchable-select" id="coupon-searchable-product">
                    <input type="hidden" id="coupon-product-input" value="Select Product" required />
                    <div 
                      class="coupon-select-trigger" 
                      id="trigger-coupon-product" 
                      onclick="window.smatApp.toggleCouponDropdown('product', event)"
                    >
                      <span class="coupon-select-trigger-text placeholder" id="label-coupon-product">Select Product</span>
                      <svg class="coupon-select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>

                    <div class="coupon-select-popover" id="popover-coupon-product" style="display:none;" onclick="event.stopPropagation()">
                      <div class="coupon-search-box">
                        <svg class="coupon-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke-width="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input 
                          type="text" 
                          class="coupon-search-input" 
                          placeholder="Search" 
                          oninput="window.smatApp.filterCouponDropdown('product', this.value)" 
                        />
                      </div>
                      <div class="coupon-options-list" id="options-coupon-product"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div></div> <!-- Empty right column on row 1 -->

              <!-- Row 2: Coupon Name* (Left), Coupon Code* (Right) -->
              <div class="coupon-field-row">
                <label class="coupon-field-label required">Coupon Name*</label>
                <div class="coupon-field-control">
                  <input type="text" id="coupon-name-input" class="coupon-form-control" required />
                </div>
              </div>
              <div class="coupon-field-row">
                <label class="coupon-field-label required">Coupon Code*</label>
                <div class="coupon-field-control">
                  <input type="text" id="coupon-code-input" class="coupon-form-control" style="text-transform:uppercase; font-family:monospace; font-weight:600;" required />
                  <span class="coupon-info-tooltip" title="Unique code customers enter at checkout">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  </span>
                </div>
              </div>

              <!-- Row 3: Discount (INR) * (Left), Redemption Type* (Right) -->
              <div class="coupon-field-row">
                <label class="coupon-field-label required">Discount (INR) *</label>
                <div class="coupon-field-control">
                  <div class="coupon-discount-group">
                    <input type="text" id="coupon-discount-value-input" class="coupon-discount-input" required />
                    <select id="coupon-discount-by-input" class="coupon-discount-select coupon-form-select" onchange="window.smatApp.handleCouponDiscountByChange()">
                      <option value="Flat" selected>Flat</option>
                      <option value="Percentage">%</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="coupon-field-row">
                <label class="coupon-field-label required">Redemption Type*</label>
                <div class="coupon-field-control">
                  <!-- Searchable Dropdown matching Screenshot 3 -->
                  <div class="coupon-searchable-select" id="coupon-searchable-redemptionType">
                    <input type="hidden" id="coupon-redemption-type-input" value="One-Time" required />
                    <div 
                      class="coupon-select-trigger" 
                      id="trigger-coupon-redemptionType" 
                      onclick="window.smatApp.toggleCouponDropdown('redemptionType', event)"
                    >
                      <span class="coupon-select-trigger-text" id="label-coupon-redemptionType">One-Time</span>
                      <svg class="coupon-select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>

                    <div class="coupon-select-popover" id="popover-coupon-redemptionType" style="display:none;" onclick="event.stopPropagation()">
                      <div class="coupon-search-box">
                        <svg class="coupon-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke-width="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input 
                          type="text" 
                          class="coupon-search-input" 
                          placeholder="Search" 
                          oninput="window.smatApp.filterCouponDropdown('redemptionType', this.value)" 
                        />
                      </div>
                      <div class="coupon-options-list" id="options-coupon-redemptionType"></div>
                    </div>
                  </div>

                  <span class="coupon-info-tooltip" title="Controls how many times this coupon can be redeemed">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  </span>
                </div>
              </div>
            </div>

            <!-- Applicability Section -->
            <div class="coupon-section-title">Applicability</div>
            <div class="coupon-modal-grid">
              <!-- Row 4: Associate Plans* with Searchable Dropdown matching Screenshot 1 -->
              <div class="coupon-field-row">
                <label class="coupon-field-label required">Associate Plans*</label>
                <div class="coupon-field-control">
                  <div class="coupon-searchable-select" id="coupon-searchable-plans">
                    <input type="hidden" id="coupon-associate-plans-input" value="All Plans" required />
                    <div 
                      class="coupon-select-trigger" 
                      id="trigger-coupon-plans" 
                      onclick="window.smatApp.toggleCouponDropdown('plans', event)"
                    >
                      <span class="coupon-select-trigger-text" id="label-coupon-plans">All Plans</span>
                      <svg class="coupon-select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>

                    <div class="coupon-select-popover" id="popover-coupon-plans" style="display:none;" onclick="event.stopPropagation()">
                      <div class="coupon-search-box">
                        <svg class="coupon-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke-width="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input 
                          type="text" 
                          class="coupon-search-input" 
                          placeholder="Search" 
                          oninput="window.smatApp.filterCouponDropdown('plans', this.value)" 
                        />
                      </div>
                      <div class="coupon-options-list" id="options-coupon-plans"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div></div>

              <!-- Row 5: Associate Addons* with Searchable Dropdown matching Screenshot 2 -->
              <div class="coupon-field-row">
                <label class="coupon-field-label required">Associate Addons*</label>
                <div class="coupon-field-control">
                  <div class="coupon-searchable-select" id="coupon-searchable-addons">
                    <input type="hidden" id="coupon-associate-addons-input" value="All Recurring Addons" required />
                    <div 
                      class="coupon-select-trigger" 
                      id="trigger-coupon-addons" 
                      onclick="window.smatApp.toggleCouponDropdown('addons', event)"
                    >
                      <span class="coupon-select-trigger-text" id="label-coupon-addons">All Recurring Addons</span>
                      <svg class="coupon-select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>

                    <div class="coupon-select-popover" id="popover-coupon-addons" style="display:none;" onclick="event.stopPropagation()">
                      <div class="coupon-search-box">
                        <svg class="coupon-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke-width="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input 
                          type="text" 
                          class="coupon-search-input" 
                          placeholder="Search" 
                          oninput="window.smatApp.filterCouponDropdown('addons', this.value)" 
                        />
                      </div>
                      <div class="coupon-options-list" id="options-coupon-addons"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div></div>
            </div>

            <!-- Divider -->
            <hr class="coupon-modal-divider" />

            <!-- Validity Section -->
            <div class="coupon-section-title">Validity</div>
            <div class="coupon-modal-grid">
              <!-- Row 6: Expiration Date (Left), Maximum Redemptions (Right) -->
              <div class="coupon-field-row">
                <label class="coupon-field-label">Expiration Date</label>
                <div class="coupon-field-control">
                  <input 
                    type="text" 
                    id="coupon-expiration-date-input" 
                    class="coupon-form-control" 
                    placeholder="Click or Type to select" 
                    onfocus="this.type='date'" 
                    onblur="if(!this.value) this.type='text'" 
                  />
                </div>
              </div>
              <div class="coupon-field-row">
                <label class="coupon-field-label">Maximum Redemptions</label>
                <div class="coupon-field-control">
                  <input type="number" id="coupon-max-redemption-input" class="coupon-form-control" placeholder="Enter a number" min="1" />
                  <span class="coupon-info-tooltip" title="Total number of times this coupon can be redeemed across all customers">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  </span>
                </div>
              </div>
            </div>

            <!-- Action Buttons on Bottom-Left -->
            <div class="coupon-modal-footer">
              <button type="submit" class="coupon-btn-save">Save</button>
              <button type="button" class="coupon-btn-cancel" onclick="window.smatApp.closeModal()">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Render option lists for the 4 searchable selects
    renderCouponDropdownOptions('product');
    renderCouponDropdownOptions('redemptionType');
    renderCouponDropdownOptions('plans');
    renderCouponDropdownOptions('addons');
  }

  function handleAddCouponSubmit(e) {
    e.preventDefault();
    const product = ($('#coupon-product-input')?.value || 'Select Product').trim();
    const name = ($('#coupon-name-input')?.value || '').trim();
    const code = ($('#coupon-code-input')?.value || '').trim().toUpperCase();
    const discountBy = $('#coupon-discount-by-input')?.value || 'Flat';
    let discountVal = ($('#coupon-discount-value-input')?.value || '').trim();
    const redemptionType = $('#coupon-redemption-type-input')?.value || 'One-Time';
    const associatePlans = $('#coupon-associate-plans-input')?.value || 'All Plans';
    const associateAddons = $('#coupon-associate-addons-input')?.value || 'All Recurring Addons';
    const expirationDate = ($('#coupon-expiration-date-input')?.value || $('#coupon-valid-upto-input')?.value || '').trim() || '-';
    const maxRedemptions = $('#coupon-max-redemption-input')?.value ? Number($('#coupon-max-redemption-input').value) : '-';
    const status = 'Active';

    if (!name || !code || !discountVal) {
      showToast('Please enter Coupon Name, Coupon Code, and Discount Value');
      return;
    }

    if (discountBy === 'Percentage' && !discountVal.includes('%')) {
      discountVal = `${discountVal}%`;
    } else if (discountBy === 'Flat' && !discountVal.includes('Rs.') && !discountVal.includes('₹')) {
      discountVal = `Rs.${discountVal}`;
    }

    const newCoupon = {
      id: Date.now(),
      product: (product === 'Select Product' ? 'SmatBot' : product),
      name,
      code,
      status,
      discount_value: discountVal,
      discount_by: discountBy,
      redemption_type: redemptionType,
      associate_plans: associatePlans,
      associate_addons: associateAddons,
      max_redemption: maxRedemptions,
      valid_upto: expirationDate,
      created_at: new Date().toISOString().split('T')[0]
    };

    couponsData.unshift(newCoupon);
    closeModal();
    showToast(`Coupon "${code}" created successfully! 🎉`);
    if (currentRoute === 'coupons') renderCouponsView($('#route-viewport'));
  }

  function toggleCouponStatus(id) {
    const coupon = couponsData.find(c => c.id === id);
    if (!coupon) return;
    coupon.status = coupon.status === 'Active' ? 'Expired' : 'Active';
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
    handleCouponDiscountByChange();
  }

  function openEditCouponModal(id) {
    const coupon = couponsData.find(c => c.id === id);
    if (!coupon) return;
    const modal = $('#modal-container');
    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="modal-box-card" style="border-top: 4px solid #1877F2; max-width:520px; border-radius:8px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.15);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; border-bottom:1px solid #F1F5F9; padding-bottom:0.75rem;">
            <div>
              <div style="font-size:1.15rem; font-weight:700; color:#0F172A;">Coupon: ${coupon.code}</div>
              <div style="font-size:0.8rem; color:#64748B;">${coupon.name}</div>
            </div>
            <button onclick="window.smatApp.closeModal()" style="background:none; border:none; font-size:1.2rem; cursor:pointer; color:#64748B;">✕</button>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.75rem; margin-bottom:1.25rem; font-size:0.85rem;">
            <div style="background:#F8FAFC; padding:10px; border-radius:6px; border:1px solid #E2E8F0;">
              <span style="color:#64748B; font-size:0.75rem; display:block;">STATUS</span>
              <strong style="color:${coupon.status === 'Active' ? '#10B981' : (coupon.status === 'Maxed Out' ? '#F59E0B' : '#64748B')}">${coupon.status}</strong>
            </div>
            <div style="background:#F8FAFC; padding:10px; border-radius:6px; border:1px solid #E2E8F0;">
              <span style="color:#64748B; font-size:0.75rem; display:block;">DISCOUNT VALUE</span>
              <strong>${coupon.discount_value} (${coupon.discount_by})</strong>
            </div>
            <div style="background:#F8FAFC; padding:10px; border-radius:6px; border:1px solid #E2E8F0;">
              <span style="color:#64748B; font-size:0.75rem; display:block;">REDEMPTION TYPE</span>
              <strong>${coupon.redemption_type}</strong>
            </div>
            <div style="background:#F8FAFC; padding:10px; border-radius:6px; border:1px solid #E2E8F0;">
              <span style="color:#64748B; font-size:0.75rem; display:block;">MAXIMUM REDEMPTION</span>
              <strong>${coupon.max_redemption !== '-' ? coupon.max_redemption : 'Unlimited'}</strong>
            </div>
            <div style="background:#F8FAFC; padding:10px; border-radius:6px; border:1px solid #E2E8F0; grid-column:span 2;">
              <span style="color:#64748B; font-size:0.75rem; display:block;">VALID UPTO</span>
              <strong>${coupon.valid_upto || '-'}</strong>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #F1F5F9; padding-top:1rem;">
            <button type="button" class="btn-table-action btn-action-danger" onclick="window.smatApp.deleteCoupon(${coupon.id}); window.smatApp.closeModal();" style="border-radius:4px; padding:6px 14px;">Delete Coupon</button>
            <div style="display:flex; gap:0.5rem;">
              <button type="button" class="btn-table-action btn-action-secondary" onclick="window.smatApp.toggleCouponStatus(${coupon.id}); window.smatApp.closeModal();" style="border-radius:4px; padding:6px 14px;">
                ${coupon.status === 'Active' ? 'Mark as Expired' : 'Mark as Active'}
              </button>
              <button type="button" class="btn-table-action btn-action-primary" onclick="window.smatApp.closeModal()" style="background:#1877F2; border:none; border-radius:4px; padding:6px 16px;">Close</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function openCouponEyeModal(id) {
    const coupon = couponsData.find(c => c.id === id);
    if (!coupon) return;

    function formatToIsoDate(d) {
      if (!d || d === '-') return 'Never';
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(d)) {
        const [dd, mm, yyyy] = d.split('/');
        return `${yyyy}-${mm}-${dd}`;
      }
      return d;
    }

    const name = coupon.name || '';
    const code = coupon.code || '';
    const statusVal = coupon.status ? coupon.status.toLowerCase() : 'active';
    const statusColor = coupon.status === 'Active' ? '#10B981' : (coupon.status === 'Maxed Out' ? '#F59E0B' : '#64748B');
    const discountVal = coupon.discount_value ? coupon.discount_value.replace(/[%Rs.₹\s]/g, '') : '0';
    const discountType = (coupon.discount_by || 'percentage').toLowerCase();
    const redemptionType = coupon.redemption_type || 'One Time';
    const maxRedemption = (coupon.max_redemption !== null && coupon.max_redemption !== undefined && coupon.max_redemption !== '-') ? coupon.max_redemption : 'Unlimited';
    const expiryAt = formatToIsoDate(coupon.valid_upto);
    const createdAt = coupon.created_at || (coupon.id === 42 || coupon.name === 'SMATDEEP15' ? '2023-09-12' : (coupon.valid_upto && coupon.valid_upto !== '-' ? formatToIsoDate(coupon.valid_upto).replace(/-\d{2}$/, '-01') : '2023-09-26'));

    let redemptionCount = 2;
    if (coupon.used_count !== undefined) {
      redemptionCount = coupon.used_count;
    } else if (coupon.name === 'SMATDEEP15') {
      redemptionCount = 2;
    } else if (coupon.status === 'Maxed Out' && coupon.max_redemption !== '-') {
      redemptionCount = coupon.max_redemption;
    } else if (coupon.status === 'Active') {
      redemptionCount = 14;
    } else if (coupon.max_redemption !== '-') {
      redemptionCount = Math.min(2, Number(coupon.max_redemption));
    }

    const modal = $('#modal-container');
    modal.innerHTML = `
      <div class="modal-overlay open" onclick="if(event.target === this) window.smatApp.closeModal()" style="display:flex; align-items:center; justify-content:center; background:rgba(15,23,42,0.45); position:fixed; inset:0; z-index:9999;">
        <div class="coupon-details-modal-box" onclick="event.stopPropagation();">
          <!-- Top-Right Close Button -->
          <button 
            type="button" 
            onclick="window.smatApp.closeModal()" 
            title="Close"
            style="position:absolute; top:16px; right:18px; background:none; border:none; font-size:1.35rem; color:#64748B; cursor:pointer; padding:4px; line-height:1; transition:color 0.15s ease;"
            onmouseover="this.style.color='#0F172A'" 
            onmouseout="this.style.color='#64748B'"
          >✕</button>

          <!-- List of attributes matching Screenshot 2 & 3 and table headers -->
          <div class="coupon-details-list" style="margin-top: 10px;">
            <div class="coupon-details-row">
              <span class="coupon-details-label">Coupon Name</span>
              <span class="coupon-details-value">${name}</span>
            </div>

            <div class="coupon-details-row">
              <span class="coupon-details-label">Coupon Code</span>
              <span class="coupon-details-value" style="font-weight:600; color:#1877F2;">${code}</span>
            </div>

            <div class="coupon-details-row">
              <span class="coupon-details-label">Status</span>
              <span class="coupon-details-value" style="color:${statusColor}; font-weight:600;">${statusVal}</span>
            </div>

            <div class="coupon-details-row">
              <span class="coupon-details-label">Discount value</span>
              <span class="coupon-details-value">${discountVal}</span>
            </div>

            <div class="coupon-details-row">
              <span class="coupon-details-label">Discount type</span>
              <span class="coupon-details-value">${discountType}</span>
            </div>

            <div class="coupon-details-row">
              <span class="coupon-details-label">Redemption type</span>
              <span class="coupon-details-value">${redemptionType}</span>
            </div>

            <div class="coupon-details-row">
              <span class="coupon-details-label">Created at</span>
              <span class="coupon-details-value">${createdAt}</span>
            </div>

            <div class="coupon-details-row">
              <span class="coupon-details-label">Expiry at</span>
              <span class="coupon-details-value">${expiryAt}</span>
            </div>

            <div class="coupon-details-row">
              <span class="coupon-details-label">Apply to plans</span>
              <span class="coupon-details-value">all</span>
            </div>

            <div class="coupon-details-row">
              <span class="coupon-details-label">Restrict for guest user</span>
              <span class="coupon-details-value">false</span>
            </div>

            <div class="coupon-details-row">
              <span class="coupon-details-label">Max redemption</span>
              <span class="coupon-details-value">${maxRedemption}</span>
            </div>

            <div class="coupon-details-row">
              <span class="coupon-details-label">Minimum order value</span>
              <span class="coupon-details-value">0</span>
            </div>

            <div class="coupon-details-row">
              <span class="coupon-details-label">Redemption count</span>
              <span class="coupon-details-value">${redemptionCount}</span>
            </div>
          </div>
        </div>
      </div>
    `;
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

        <div class="drawer-footer" style="display:flex; gap:0.75rem; justify-content:flex-end;">
          <button class="client-mini-action-btn login-btn" onclick="window.smatApp.closeClientDrawer(); window.smatApp.openLoginConfirmModal(${client.id});" style="padding:8px 16px; font-size:0.84rem; background:#16A34A; color:#FFFFFF; border-color:#16A34A; display:inline-flex; align-items:center; gap:6px;">
            🔐 1-Click Login
          </button>
          <button class="btn-action-primary" onclick="window.smatApp.closeClientDrawer(); window.smatApp.openClientDetailsPage(${client.id});" style="padding:8px 16px; font-size:0.84rem; display:inline-flex; align-items:center; gap:6px;">
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

  function renderPaginationControls(totalPages, currentPage, pageSize, totalItems, startIdx) {
    let pagesHtml = '';
    const safeTotal = typeof totalItems === 'number' ? totalItems : (totalPages * pageSize);
    const fromItem = safeTotal === 0 ? 0 : ((currentPage - 1) * pageSize + 1);
    const toItem = Math.min(currentPage * pageSize, safeTotal);

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
        <div class="pagination-left-group">
          <select class="page-size-select" onchange="window.smatApp.changePageSize(Number(this.value))" title="Records per page">
            <option value="10" ${pageSize === 10 ? 'selected' : ''}>10</option>
            <option value="25" ${pageSize === 25 ? 'selected' : ''}>25</option>
            <option value="50" ${pageSize === 50 ? 'selected' : ''}>50</option>
            <option value="100" ${pageSize === 100 ? 'selected' : ''}>100</option>
          </select>
          <span class="pagination-per-page-label">records per page</span>
        </div>
        <div class="pagination-center-info">
          Showing <strong>${fromItem}</strong> to <strong>${toItem}</strong> of <strong>${safeTotal}</strong> clients
        </div>
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

  function initTableScrollbarSync() {
    setTimeout(() => {
      const table = document.getElementById('clients-main-table');
      const topTrack = document.getElementById('table-top-scrollbar-track');
      const topScroll = document.getElementById('table-top-scrollbar');
      const tableScroll = document.getElementById('table-scroll-container');
      if (table && topTrack) {
        topTrack.style.width = table.scrollWidth + 'px';
      }
      if (topScroll && tableScroll) {
        topScroll.scrollLeft = tableScroll.scrollLeft;
      }
    }, 30);
  }

  let isSyncingScroll = false;
  function syncTableScroll(source) {
    if (isSyncingScroll) return;
    isSyncingScroll = true;
    const topScroll = document.getElementById('table-top-scrollbar');
    const tableScroll = document.getElementById('table-scroll-container');
    if (source === 'top' && topScroll && tableScroll) {
      tableScroll.scrollLeft = topScroll.scrollLeft;
    } else if (source === 'table' && topScroll && tableScroll) {
      topScroll.scrollLeft = tableScroll.scrollLeft;
    }
    setTimeout(() => { isSyncingScroll = false; }, 30);
  }

  window.addEventListener('resize', () => {
    if (typeof initTableScrollbarSync === 'function') {
      initTableScrollbarSync();
    }
  });

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
      const isCollapsed = wrapper.classList.toggle('sidebar-collapsed');
      try {
        localStorage.setItem('smatbot_sidebar_collapsed', isCollapsed ? 'true' : 'false');
      } catch (e) {}
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
    togglePasswordVisibility,
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
    confirmDeleteUser,
    executeDeleteUser,
    openPlanModal,
    openAddSubscriptionModal,
    openZohoSubscription,
    renderZohoSubscriptionView,
    onZohoSubCustomerSelect,
    onZohoPlanChange,
    onZohoAddonChange,
    openAddContactPersonModal,
    saveContactPerson,
    toggleAddressPopover,
    closeAddressPopovers,
    selectShippingAddress,
    openEditAddressModal,
    saveAddressModalData,
    toggleSacPopover,
    closeSacPopover,
    saveSacCode,
    togglePlanMoreTooltip,
    toggleAddonMoreMenu,
    closeAllMorePopovers,
    toggleGstPreferencesPopover,
    closeGstPreferencesPopover,
    saveGstPreferences,
    renderGstTreatmentOptions,
    toggleGstTreatmentDropdown,
    closeGstTreatmentDropdown,
    selectGstTreatment,
    filterGstTreatments,
    toggleShippingGstPopover,
    closeShippingGstPopover,
    onShippingGstUnregChange,
    saveShippingGstPreferences,
    toggleSupplyStateDropdown,
    closeSupplyStateDropdown,
    selectSupplyState,
    showPlanAdditionalInfo,
    togglePlanAccountDropdown,
    closePlanAccountDropdown,
    selectPlanAccount,
    filterPlanAccounts,
    filterSupplyStates,
    addZohoSubAddonRow,
    removeZohoSubAddonRow,
    showRemovePlanModal,
    closeRemovePlanModal,
    proceedRemovePlan,
    togglePlanTaxDropdown,
    closePlanTaxDropdown,
    selectPlanTax,
    filterPlanTaxes,
    addNewPlanTax,
    toggleAddonTaxDropdown,
    closeAddonTaxDropdown,
    closeAllAddonTaxDropdowns,
    selectAddonTax,
    filterAddonTaxes,
    addNewAddonTax,
    openZohoCouponDropdown,
    toggleZohoCouponDropdown,
    closeZohoCouponDropdown,
    filterZohoCoupons,
    selectZohoCoupon,
    clearZohoCoupon,
    openCustomerSidebar,
    closeCustomerSidebar,
    toggleCustomerSidebar,
    toggleDrawerAccordion,
    openPlanDropdown,
    closePlanDropdown,
    filterPlanDropdown,
    selectZohoPlan,
    clearZohoPlan,
    renderPlanDropdownItems,
    toggleDiscountPrefDropdown,
    closeDiscountPrefDropdown,
    selectDiscountPref,
    filterDiscountPrefOptions,
    renderDiscountPrefOptions,
    onZohoDiscountPrefChange,
    updateZohoSubCalculations,
    saveZohoSubscription,
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
    toggleCouponDropdown,
    closeAllCouponDropdowns,
    selectCouponDropdownOption,
    filterCouponDropdown,
    renderCouponDropdownOptions,
    addNewProductFromCouponModal,
    toggleCouponStatus,
    deleteCoupon,
    openEditCouponModal,
    openCouponEyeModal,
    updateCouponTypePlaceholder,
    handleCouponDiscountByChange,
    toggleCouponsFilterDropdown,
    setCouponFilter,
    goToCouponPage,
    changeCouponPageSize,
    toggleCouponSelectAll,
    toggleCouponSelectRow,
    showTotalCouponsCount,
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
    renderSubscriptionCreationView,
    toggleZohoNeverExpires,
    setZohoField,
    setZohoPlanDiscount,
    setZohoPlanQty,
    filterZohoProducts,
    toggleZohoProductDropdown,
    handleZohoCustomerChange,
    toggleZohoCurrency,
    editZohoAddress,
    copyBillingToShipping,
    addZohoContactPerson,
    setZohoSubFor,
    setZohoProduct,
    setZohoPlanTier,
    setZohoPlanFreq,
    handleZohoTopSearch,
    onZohoCustomerSelectChange,
    openZohoEditCustomer,
    setZohoEditTab,
    toggleMoreCustomerDetails,
    handleDocumentUpload,
    removeUploadedDoc,
    handleZohoSaveAndSubscribe,
    prefillGSTDetails,
    toggleGSTPrefillPopover,
    executeGSTPrefillFromPopover,
    fetchTaxpayerDetails,
    onGstinInputChange,
    copyBillingToShippingInEdit,
    handleZohoEditCustomerSubmit,
    toggleMatchingRecordsDropdown,
    selectMatchingCustomer,
    checkPhoneDuplicates,
    onPhoneInputChange,
    onEmailInputChange,
    clearZohoCustomerFormFields,
    onGstTreatmentChange,
    isGstRegisteredTreatment,
    renderZohoEditCustomerView,
    handleZohoSubscriptionSubmit,
    showToast,
    toggleModularCard,
    toggleClientDetailsFilters,
    openCreateBotForClient,
    handleCreateBotSubmit,
    toggleClientBotActive,
    syncTableScroll,
    initTableScrollbarSync,
    resolveInitialRoute
  };

  document.addEventListener('DOMContentLoaded', init);
})();
