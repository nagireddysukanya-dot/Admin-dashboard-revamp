const mysql = require('mysql2/promise');
const { Pool: PgPool } = require('pg');
require('dotenv').config();

const DB_TYPE = (process.env.DB_TYPE || (process.env.DATABASE_URL ? 'postgres' : (process.env.DB_PORT === '5432' ? 'postgres' : 'postgres'))).toLowerCase();

// PostgreSQL Configuration
const PG_CONFIG = process.env.DATABASE_URL
  ? {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'false' ? false : (process.env.DB_SSL === 'true' || process.env.DATABASE_URL.includes('sslmode=require') ? { rejectUnauthorized: false } : false)
  }
  : {
    host: process.env.DB_HOST || process.env.PGHOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || process.env.PGPORT || '5432', 10),
    user: process.env.DB_USER || process.env.PGUSER || 'whatsapp',
    password: process.env.DB_PASSWORD || process.env.PGPASSWORD || 'whatsapp',
    database: process.env.DB_NAME || process.env.PGDATABASE || 'whatsapp_dev',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  };

// MySQL Configuration
const MYSQL_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'smatbot_admin_db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pgPool = null;
let mysqlPool = null;
let isConnected = false;
let activeDbType = null;

// In-Memory Seed Storage for Instant Zero-Setup Dev Mode (Matching User References)
let inMemoryClients = [
  {
    id: 1,
    s_no: 1,
    client_uuid: 'cli_arpit_001',
    name: 'Arpit Padhy',
    phone_number: '+91-8591876630',
    alternate_phone: '',
    email: 'arpitpadhy19@gmail.com',
    customer_type: 'Direct',
    account_type: 'Client Accounts',
    plan_name: 'Pro Trial',
    plan_type: 'Trial_plan',
    support_plan: 'Standard Support',
    billing_cycle: 'Monthly',
    subscription_status: 'Trial',
    lost_client_status: 'No',
    sales_person: 'Rahul Sharma',
    support_person: 'Kiran Kumar',
    currency_type: 'INR',
    subscription_amount_display: '₹ 0.00',
    inr_amount: 0.00,
    usd_amount: 0.00,
    end_date: '08-10-2026',
    days_left: 9,
    bots_limit: 10,
    bots_used: 1,
    chats_limit: 500,
    chats_used: 12,
    service_chats_limit: 500,
    service_chats_used: 0,
    bi_chats_limit: 0,
    bi_chats_used: 0,
    gst_number: '-',
    url: 'arpitpadhy.in',
    test_account: 'No',
    zoho_customer_id: 'ZC-901820',
    subscription_id: 'SUB-ARPIT-2026'
  },
  {
    id: 2,
    s_no: 2,
    client_uuid: 'cli_amitesh_002',
    name: 'Amitesh',
    phone_number: '+91-8989909098',
    alternate_phone: '',
    email: 'openskill.co@gmail.com',
    customer_type: 'Direct',
    account_type: 'Client Accounts',
    plan_name: 'Pro Trial',
    plan_type: 'Trial_plan',
    support_plan: 'Standard Support',
    billing_cycle: 'Monthly',
    subscription_status: 'Trial',
    lost_client_status: 'No',
    sales_person: 'Rahul Sharma',
    support_person: 'Kiran Kumar',
    currency_type: 'INR',
    subscription_amount_display: '₹ 0.00',
    inr_amount: 0.00,
    usd_amount: 0.00,
    end_date: '07-10-2026',
    days_left: 8,
    bots_limit: 10,
    bots_used: 0,
    chats_limit: 500,
    chats_used: 0,
    service_chats_limit: 500,
    service_chats_used: 0,
    bi_chats_limit: 0,
    bi_chats_used: 0,
    gst_number: '-',
    url: 'openskill.co',
    test_account: 'No',
    zoho_customer_id: 'ZC-901821',
    subscription_id: 'SUB-AMIT-2026'
  },
  {
    id: 3,
    s_no: 3,
    client_uuid: 'cli_loki_003',
    name: 'Loki Kudsj',
    phone_number: '+91-9857564502',
    alternate_phone: '',
    email: 'plummaddi@uberip.com',
    customer_type: 'Direct',
    account_type: 'Client Accounts',
    plan_name: 'Pro Trial',
    plan_type: 'Trial_plan',
    support_plan: 'Standard Support',
    billing_cycle: 'Monthly',
    subscription_status: 'Trial',
    lost_client_status: 'No',
    sales_person: 'Pooja Reddy',
    support_person: 'Vikas Rao',
    currency_type: 'INR',
    subscription_amount_display: '₹ 0.00',
    inr_amount: 0.00,
    usd_amount: 0.00,
    end_date: '07-10-2026',
    days_left: 8,
    bots_limit: 10,
    bots_used: 0,
    chats_limit: 500,
    chats_used: 0,
    service_chats_limit: 500,
    service_chats_used: 0,
    bi_chats_limit: 0,
    bi_chats_used: 0,
    gst_number: '29AABCS1429B1Z8',
    url: 'uberip.com',
    test_account: 'No',
    zoho_customer_id: 'ZC-901822',
    subscription_id: 'SUB-LOKI-2026'
  },
  {
    id: 4,
    s_no: 4,
    client_uuid: 'cli_sanku_004',
    name: 'SANKU MUKHERJEE',
    phone_number: '+91-9007266633',
    alternate_phone: '',
    email: 'parichaytour@gmail.com',
    customer_type: 'Direct',
    account_type: 'Client Accounts',
    plan_name: 'Pro Trail WhatsApp Trial',
    plan_type: 'Trial_plan',
    support_plan: 'Standard Support',
    billing_cycle: 'Monthly',
    subscription_status: 'Trial',
    lost_client_status: 'No',
    sales_person: 'Rahul Sharma',
    support_person: 'Kiran Kumar',
    currency_type: 'INR',
    subscription_amount_display: '₹ 0.00',
    inr_amount: 0.00,
    usd_amount: 0.00,
    end_date: '30-09-2026',
    days_left: 1,
    bots_limit: 10,
    bots_used: 1,
    chats_limit: 500,
    chats_used: 14,
    service_chats_limit: 500,
    service_chats_used: 0,
    bi_chats_limit: 0,
    bi_chats_used: 0,
    gst_number: '-',
    url: 'parichaytour.com',
    test_account: 'No',
    zoho_customer_id: 'ZC-901823',
    subscription_id: 'SUB-SANKU-2026'
  },
  {
    id: 5,
    s_no: 5,
    client_uuid: 'cli_cacat_005',
    name: 'cacat75624@findize.com',
    phone_number: '+91-9848051648',
    alternate_phone: '',
    email: 'cacat75624@findize.com',
    customer_type: 'Direct',
    account_type: 'Client Accounts',
    plan_name: 'Pro Trial',
    plan_type: 'Trial_plan',
    support_plan: 'Standard Support',
    billing_cycle: 'Monthly',
    subscription_status: 'Trial',
    lost_client_status: 'No',
    sales_person: 'Sameer Khan',
    support_person: 'Vikas Rao',
    currency_type: 'INR',
    subscription_amount_display: '₹ 0.00',
    inr_amount: 0.00,
    usd_amount: 0.00,
    end_date: '29-09-2026',
    days_left: 0,
    bots_limit: 10,
    bots_used: 0,
    chats_limit: 500,
    chats_used: 0,
    service_chats_limit: 500,
    service_chats_used: 0,
    bi_chats_limit: 0,
    bi_chats_used: 0,
    gst_number: '-',
    url: 'findize.com',
    test_account: 'No',
    zoho_customer_id: 'ZC-901824',
    subscription_id: 'SUB-CACAT-2026'
  },
  {
    id: 6,
    s_no: 6,
    client_uuid: 'cli_rajesh_006',
    name: 'Dr Rajesh Reddy',
    phone_number: '+91-9988711695',
    alternate_phone: '',
    email: 'drrajeshreddy1@gmail.com',
    customer_type: 'Direct',
    account_type: 'Client Accounts',
    plan_name: 'Free',
    plan_type: 'Trial_plan',
    support_plan: 'Standard Support',
    billing_cycle: 'Monthly',
    subscription_status: 'Trial',
    lost_client_status: 'No',
    sales_person: 'Rahul Sharma',
    support_person: 'Kiran Kumar',
    currency_type: 'INR',
    subscription_amount_display: '₹ 0.00',
    inr_amount: 0.00,
    usd_amount: 0.00,
    end_date: '19-10-2026',
    days_left: 20,
    bots_limit: 10,
    bots_used: 2,
    chats_limit: 500,
    chats_used: 48,
    service_chats_limit: 500,
    service_chats_used: 0,
    bi_chats_limit: 0,
    bi_chats_used: 0,
    gst_number: '-',
    url: 'drrajeshreddy.com',
    test_account: 'No',
    zoho_customer_id: 'ZC-901825',
    subscription_id: 'SUB-RAJESH-2026'
  },
  {
    id: 7,
    s_no: 7,
    client_uuid: 'cli_wisera_007',
    name: 'Wisera Info',
    phone_number: '+91-9876598897',
    alternate_phone: '',
    email: 'info@wisera.in',
    customer_type: 'Direct',
    account_type: 'Client Accounts',
    plan_name: 'Pro Trial',
    plan_type: 'Trial_plan',
    support_plan: 'Standard Support',
    billing_cycle: 'Monthly',
    subscription_status: 'Trial',
    lost_client_status: 'No',
    sales_person: 'Pooja Reddy',
    support_person: 'Ananya Sen',
    currency_type: 'INR',
    subscription_amount_display: '₹ 0.00',
    inr_amount: 0.00,
    usd_amount: 0.00,
    end_date: '17-09-2027',
    days_left: 353,
    bots_limit: 25,
    bots_used: 6,
    chats_limit: 25000,
    chats_used: 3200,
    service_chats_limit: 2500,
    service_chats_used: 200,
    bi_chats_limit: 5000,
    bi_chats_used: 120,
    gst_number: '36AAACW9821K1Z2',
    url: 'wisera.in',
    test_account: 'No',
    zoho_customer_id: 'ZC-901826',
    subscription_id: 'SUB-WISERA-2026'
  },
  {
    id: 8,
    s_no: 8,
    client_uuid: 'cli_bts_008',
    name: 'BTS SmartBot',
    phone_number: '+91-9811102113',
    alternate_phone: '',
    email: 'btssmartbot@gmail.com',
    customer_type: 'Direct',
    account_type: 'Client Accounts',
    plan_name: 'Free',
    plan_type: 'Trial_plan',
    support_plan: 'Standard Support',
    billing_cycle: 'Monthly',
    subscription_status: 'Trial',
    lost_client_status: 'No',
    sales_person: 'Amit Patel',
    support_person: 'Suresh Raina',
    currency_type: 'INR',
    subscription_amount_display: '₹ 0.00',
    inr_amount: 0.00,
    usd_amount: 0.00,
    end_date: '18-10-2026',
    days_left: 19,
    bots_limit: 5,
    bots_used: 1,
    chats_limit: 500,
    chats_used: 8,
    service_chats_limit: 500,
    service_chats_used: 0,
    bi_chats_limit: 0,
    bi_chats_used: 0,
    gst_number: '-',
    url: 'btssmartbot.com',
    test_account: 'No',
    zoho_customer_id: 'ZC-901827',
    subscription_id: 'SUB-BTS-2026'
  },
  {
    id: 9,
    s_no: 9,
    client_uuid: 'cli_shrishti_009',
    name: 'Shrishti Jajodia',
    phone_number: '+91-7289970856',
    alternate_phone: '',
    email: 'customercare@alignbooks.com',
    customer_type: 'Direct',
    account_type: 'Client Accounts',
    plan_name: 'Pro NY (WA)',
    plan_type: 'Paid_plan',
    support_plan: 'Standard Support',
    billing_cycle: 'Yearly',
    subscription_status: 'Active',
    lost_client_status: 'No',
    sales_person: 'Rahul Sharma',
    support_person: 'Kiran Kumar',
    currency_type: 'INR',
    subscription_amount_display: '₹ 47,999.00',
    inr_amount: 47999.00,
    usd_amount: 600.00,
    end_date: '08-06-2027',
    days_left: 252,
    bots_limit: 10,
    bots_used: 1,
    chats_limit: 5000,
    chats_used: 0,
    service_chats_limit: 1000,
    service_chats_used: 0,
    bi_chats_limit: 0,
    bi_chats_used: 0,
    gst_number: '-',
    url: 'alignbooks.com',
    test_account: 'No',
    zoho_customer_id: '3141005000009490054',
    subscription_id: 'SUB-SHRISHTI-2026'
  },
  {
    id: 10,
    s_no: 10,
    client_uuid: 'cli_deepak_010',
    name: 'deepak',
    company_name: 'feso',
    legal_name: 'FESO SOCIAL MEDIA PRIVATE LIMITED',
    phone_number: '+91-9800009460',
    alternate_phone: '+91-9100006220',
    email: 'suryadesigner1234@gmail.com',
    customer_type: 'Direct',
    account_type: 'Client Accounts',
    plan_name: 'Pro NM',
    plan_type: 'Paid_plan',
    support_plan: 'Priority SLA (24/7)',
    billing_cycle: 'Monthly',
    subscription_status: 'Active',
    lost_client_status: 'No',
    sales_person: 'Rahul Sharma',
    support_person: 'Kiran Kumar',
    currency_type: 'INR',
    subscription_amount_display: '₹ 4,999.00',
    inr_amount: 4999.00,
    usd_amount: 65.00,
    end_date: '15-02-2027',
    days_left: 141,
    bots_limit: 25,
    bots_used: 0,
    chats_limit: 50000,
    chats_used: 2400,
    service_chats_limit: 1000,
    service_chats_used: 0,
    bi_chats_limit: 5000,
    bi_chats_used: 0,
    gst_number: '36AAACH7020R1ZZ',
    url: 'solarisgre.com',
    test_account: 'No',
    zoho_customer_id: '3141005000009490020',
    subscription_id: 'SUB-01083',
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

let inMemoryMigrations = [
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
    canRollback: true
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
    canRollback: false
  }
];

let inMemoryUsers = [
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
    lastActive: 'Just now'
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
    lastActive: '15m ago'
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
    lastActive: '1h ago'
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
    lastActive: '3h ago'
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
    lastActive: 'Just now'
  }
];

async function initDb() {
  if (DB_TYPE === 'postgres') {
    try {
      pgPool = new PgPool(PG_CONFIG);
      const client = await pgPool.connect();
      console.log('✅ Connected successfully to PostgreSQL server at', PG_CONFIG.host || 'remote connection URL');
      isConnected = true;
      activeDbType = 'postgres';
      client.release();
    } catch (err) {
      console.warn('⚠️ PostgreSQL connection not active, using integrated fallback data store:', err.message);
      isConnected = false;
    }
  } else {
    try {
      mysqlPool = mysql.createPool(MYSQL_CONFIG);
      const connection = await mysqlPool.getConnection();
      console.log('✅ Connected successfully to MySQL server at', MYSQL_CONFIG.host);
      isConnected = true;
      activeDbType = 'mysql';
      connection.release();
    } catch (err) {
      console.warn('⚠️ MySQL connection not active, using integrated fallback data store:', err.message);
      isConnected = false;
    }
  }
}

initDb();

// Helper query function that routes to whichever database is connected
async function query(sql, params = []) {
  if (activeDbType === 'postgres' && pgPool) {
    return await pgPool.query(sql, params);
  } else if (activeDbType === 'mysql' && mysqlPool) {
    const [rows, fields] = await mysqlPool.query(sql, params);
    return { rows, fields };
  }
  throw new Error('No active database connection available.');
}

// Initialize default billing and subscription properties for all seed clients
inMemoryClients.forEach(c => {
  if (c.autopay_enabled === undefined) c.autopay_enabled = true;
  if (!c.payment_method) {
    c.payment_method = {
      brand: 'Visa',
      last4: '4242',
      expiry: '12/28',
      holderName: c.name
    };
  }
  if (!c.active_addons) {
    c.active_addons = [
      {
        id: `addon_quota_${c.id}`,
        name: '+10,000 Conversations Booster',
        type: 'recurring',
        purchaseDate: '01-10-2026',
        expiryDate: c.end_date || '30-10-2026',
        cappedBySubscription: true
      }
    ];
  }
  if (c.cancellation_status === undefined) c.cancellation_status = null;
});

module.exports = {
  getPgPool: () => pgPool,
  getPool: () => mysqlPool || pgPool,
  isDbConnected: () => isConnected,
  isMysqlConnected: () => isConnected && activeDbType === 'mysql',
  isPostgresConnected: () => isConnected && activeDbType === 'postgres',
  activeDbType: () => activeDbType,
  query,
  inMemoryClients,
  inMemoryMigrations,
  inMemoryUsers
};

