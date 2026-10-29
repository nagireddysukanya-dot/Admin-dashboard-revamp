-- ============================================================================
-- SmatBot Official Admin Portal - PostgreSQL Production Database Schema & Seed Data
-- Compatible with PostgreSQL 12+, AWS RDS, Supabase, Neon, Render, Google Cloud SQL
-- ============================================================================

-- 1. Admins & Platform Users Table
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'Super Admin',
  department VARCHAR(100) DEFAULT 'Executive Operations',
  avatar VARCHAR(10) DEFAULT 'SN',
  is_active BOOLEAN DEFAULT TRUE,
  two_factor_enabled BOOLEAN DEFAULT TRUE,
  last_active VARCHAR(50) DEFAULT 'Just now',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Clients / Companies Master Table
CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  s_no INT NOT NULL,
  client_uuid VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  phone_number VARCHAR(50) NOT NULL,
  alternate_phone VARCHAR(50) DEFAULT '',
  email VARCHAR(150) NOT NULL,
  customer_type VARCHAR(50) DEFAULT 'Direct',
  account_type VARCHAR(50) DEFAULT 'Client Accounts',
  plan_name VARCHAR(80) NOT NULL DEFAULT 'Pro NY (WA)',
  plan_type VARCHAR(80) NOT NULL DEFAULT 'Paid_plan',
  billing_cycle VARCHAR(50) DEFAULT 'Monthly',
  subscription_status VARCHAR(50) DEFAULT 'Active',
  subscription_amount_display VARCHAR(50) DEFAULT '₹ 0.00',
  inr_amount DECIMAL(12,2) DEFAULT 0.00,
  usd_amount DECIMAL(12,2) DEFAULT 0.00,
  end_date VARCHAR(50) DEFAULT '08-10-2026',
  days_left INT DEFAULT 252,
  bots_limit INT DEFAULT 10,
  bots_used INT DEFAULT 0,
  chats_limit INT DEFAULT 5000,
  chats_used INT DEFAULT 0,
  service_chats_limit INT DEFAULT 1000,
  service_chats_used INT DEFAULT 0,
  bi_chats_limit INT DEFAULT 0,
  bi_chats_used INT DEFAULT 0,
  gst_number VARCHAR(50) DEFAULT '-',
  url VARCHAR(200) DEFAULT '',
  test_account VARCHAR(10) DEFAULT 'No',
  sales_person VARCHAR(100) DEFAULT 'Rahul Sharma',
  support_person VARCHAR(100) DEFAULT 'Kiran Kumar',
  currency_type VARCHAR(10) DEFAULT 'INR',
  zoho_customer_id VARCHAR(100) DEFAULT '3141005000009490054',
  subscription_id VARCHAR(100) DEFAULT 'SUB-PRO-2026',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bots Master Table
CREATE TABLE IF NOT EXISTS bots (
  id SERIAL PRIMARY KEY,
  bot_uuid VARCHAR(64) UNIQUE NOT NULL,
  client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  channel VARCHAR(100) DEFAULT 'Web & WhatsApp',
  bot_type VARCHAR(100) DEFAULT 'Lead Gen & Support',
  flow_nodes_count INT DEFAULT 38,
  intents_count INT DEFAULT 142,
  leads_captured INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bot Migrations History Table
CREATE TABLE IF NOT EXISTS bot_migrations (
  id VARCHAR(50) PRIMARY KEY,
  bot_name VARCHAR(150) NOT NULL,
  source_client VARCHAR(150) NOT NULL,
  source_client_id INT NOT NULL,
  target_client VARCHAR(150) NOT NULL,
  target_client_id INT NOT NULL,
  mode VARCHAR(50) DEFAULT 'Clone Template',
  status VARCHAR(50) DEFAULT 'Completed',
  flow_nodes INT DEFAULT 38,
  intents INT DEFAULT 142,
  executed_by VARCHAR(100) NOT NULL,
  timestamp VARCHAR(50) NOT NULL,
  duration VARCHAR(20) DEFAULT '3.8s',
  can_rollback BOOLEAN DEFAULT TRUE,
  logs_json TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Plans Master Table
CREATE TABLE IF NOT EXISTS plans (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  plan_type VARCHAR(50) DEFAULT 'Paid_plan',
  billing_cycle VARCHAR(50) DEFAULT 'Yearly',
  price_inr DECIMAL(10,2) NOT NULL,
  price_usd DECIMAL(10,2) NOT NULL,
  bots_limit INT NOT NULL,
  chats_limit INT NOT NULL,
  service_chats_limit INT NOT NULL,
  bi_chats_limit INT NOT NULL,
  description TEXT DEFAULT NULL
);

-- 6. Partners Master Table
CREATE TABLE IF NOT EXISTS partners (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  company_name VARCHAR(150) NOT NULL,
  company_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Client Add-ons Table
CREATE TABLE IF NOT EXISTS client_addons (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  addon_name VARCHAR(120) NOT NULL,
  addon_type VARCHAR(50) DEFAULT 'recurring',
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  purchase_date DATE NOT NULL,
  standard_expiry_date DATE NOT NULL,
  effective_expiry_date DATE NOT NULL,
  is_capped_by_subscription BOOLEAN DEFAULT TRUE,
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Payment Methods Table
CREATE TABLE IF NOT EXISTS payment_methods (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  card_brand VARCHAR(50) DEFAULT 'Visa',
  last4 VARCHAR(4) NOT NULL,
  exp_month VARCHAR(2) NOT NULL,
  exp_year VARCHAR(4) NOT NULL,
  cardholder_name VARCHAR(150),
  is_autopay_enabled BOOLEAN DEFAULT TRUE,
  is_default BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Subscription Audit Logs Table
CREATE TABLE IF NOT EXISTS subscription_audit_logs (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL,
  previous_plan VARCHAR(80),
  new_plan VARCHAR(80),
  duration_months INT DEFAULT 1,
  admin_user VARCHAR(100) DEFAULT 'Sukanya Nagireddy',
  impact_summary TEXT,
  limits_exceeded JSONB,
  blocked_features JSONB,
  reason VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Subscription Cancellations Table
CREATE TABLE IF NOT EXISTS subscription_cancellations (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  cancellation_type VARCHAR(50) NOT NULL,
  requested_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  effective_date DATE NOT NULL,
  reason VARCHAR(255),
  admin_or_client VARCHAR(100) DEFAULT 'Admin'
);

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Seed Admins
INSERT INTO admins (name, email, password_hash, role, department, avatar) VALUES
('Sukanya Nagireddy', 'sukanya@smatbot.com', 'admin123', 'Super Admin', 'Executive Operations', 'SN'),
('Arjun Mehta', 'arjun@smatbot.com', 'admin123', 'Bot Engineer', 'Bot Engineering & AI', 'AM'),
('Rohan Deshmukh', 'rohan.d@smatbot.com', 'admin123', 'Support Lead', 'Customer Support SLA', 'RD'),
('Elena Rostova', 'elena@smatbot.com', 'admin123', 'Billing Manager', 'Finance & Subscriptions', 'ER'),
('Admin User', 'admin@smatbot.com', 'password123', 'Super Admin', 'Executive Operations', 'AU')
ON CONFLICT (email) DO NOTHING;

-- Seed Plans
INSERT INTO plans (code, name, plan_type, billing_cycle, price_inr, price_usd, bots_limit, chats_limit, service_chats_limit, bi_chats_limit, description) VALUES
('pro_ny_wa', 'Pro NY (WA)', 'Paid_plan', 'Yearly', 47999.00, 600.00, 10, 5000, 1000, 0, 'WhatsApp Business API + Web chatbot annual plan'),
('pro_nm', 'Pro NM', 'Paid_plan', 'Monthly', 4999.00, 65.00, 25, 50000, 1000, 5000, 'Monthly Pro multi-bot deployment plan'),
('starter_ny_wa', 'Starter NY (WA)', 'Paid_plan', 'Yearly', 19999.00, 250.00, 5, 2000, 500, 0, 'Starter annual plan with WhatsApp support'),
('starter_nm', 'Starter NM', 'Paid_plan', 'Monthly', 1999.00, 25.00, 3, 1000, 200, 0, 'Starter monthly web chatbot'),
('pro_trial', 'Pro Trial', 'Trial_plan', 'Monthly', 0.00, 0.00, 10, 500, 500, 0, '14-Day Full Access Pro Evaluation'),
('pro_trail_wa_trial', 'Pro Trail WhatsApp Trial', 'Trial_plan', 'Monthly', 0.00, 0.00, 10, 500, 500, 0, 'WhatsApp Cloud Trial Evaluation'),
('free', 'Free', 'Trial_plan', 'Monthly', 0.00, 0.00, 5, 500, 500, 0, 'Permanent Free Tier with basic features')
ON CONFLICT (code) DO NOTHING;

-- Seed Partners
INSERT INTO partners (name, email, company_name, company_url) VALUES
('Malik Kia', 'crmservice.kp@malikkia.in', 'Malik kia', 'Malikkia.in'),
('abhinav', 'abhinav@smatbot.com', 'Feso Social', 'https://www.chatbotdev.fesosocialmedia.info/'),
('Sandip Jana', 'sandip@preconetindia.com', 'Preconet Technologies', 'www.preconetindia.com'),
('Panthayan James', 'panthayanjames@gmail.com', 'isoftw', 'www.soyniya.com'),
('Ajay Vishwakarma', 'asinfotechandservices@gmail.com', 'A S Infotech', 'asinfotechservices.com'),
('Pankaj', 'pankaj.ps4610425@gmail.com', 'Sigma Clap', 'https://sigmaclaub.com')
ON CONFLICT (email) DO NOTHING;

-- Seed Clients
INSERT INTO clients (
  s_no, client_uuid, name, phone_number, alternate_phone, email,
  customer_type, account_type, plan_name, plan_type, billing_cycle,
  subscription_amount_display, inr_amount, usd_amount, end_date, days_left,
  bots_limit, bots_used, chats_limit, chats_used, service_chats_limit, service_chats_used,
  bi_chats_limit, bi_chats_used, gst_number, url, test_account,
  subscription_status, sales_person, support_person, currency_type,
  zoho_customer_id, subscription_id
) VALUES
(1, 'cli-arpit-001', 'Arpit Padhy', '+91-8591876630', '', 'arpitpadhy19@gmail.com', 'Direct', 'Client Accounts', 'Pro Trial', 'Trial_plan', 'Monthly', '₹ 0.00', 0.00, 0.00, '08-10-2026', 9, 10, 1, 500, 12, 500, 0, 0, 0, '-', 'arpitpadhy.in', 'No', 'Trial', 'Rahul Sharma', 'Kiran Kumar', 'INR', 'ZC-901820', 'SUB-ARPIT-2026'),
(2, 'cli-amitesh-002', 'Amitesh', '+91-8989909098', '', 'openskill.co@gmail.com', 'Direct', 'Client Accounts', 'Pro Trial', 'Trial_plan', 'Monthly', '₹ 0.00', 0.00, 0.00, '07-10-2026', 8, 10, 0, 500, 0, 500, 0, 0, 0, '-', 'openskill.co', 'No', 'Trial', 'Rahul Sharma', 'Kiran Kumar', 'INR', 'ZC-901821', 'SUB-AMIT-2026'),
(3, 'cli-loki-003', 'Loki Kudsj', '+91-9857564502', '', 'plummaddi@uberip.com', 'Direct', 'Client Accounts', 'Pro Trial', 'Trial_plan', 'Monthly', '₹ 0.00', 0.00, 0.00, '07-10-2026', 8, 10, 0, 500, 0, 500, 0, 0, 0, '29AABCS1429B1Z8', 'uberip.com', 'No', 'Trial', 'Pooja Reddy', 'Vikas Rao', 'INR', 'ZC-901822', 'SUB-LOKI-2026'),
(4, 'cli-sanku-004', 'SANKU MUKHERJEE', '+91-9007266633', '', 'parichaytour@gmail.com', 'Direct', 'Client Accounts', 'Pro Trail WhatsApp Trial', 'Trial_plan', 'Monthly', '₹ 0.00', 0.00, 0.00, '30-09-2026', 1, 10, 1, 500, 14, 500, 0, 0, 0, '-', 'parichaytour.com', 'No', 'Trial', 'Rahul Sharma', 'Kiran Kumar', 'INR', 'ZC-901823', 'SUB-SANKU-2026'),
(5, 'cli-cacat-005', 'cacat75624@findize.com', '+91-9848051648', '', 'cacat75624@findize.com', 'Direct', 'Client Accounts', 'Pro Trial', 'Trial_plan', 'Monthly', '₹ 0.00', 0.00, 0.00, '29-09-2026', 0, 10, 0, 500, 0, 500, 0, 0, 0, '-', 'findize.com', 'No', 'Trial', 'Sameer Khan', 'Vikas Rao', 'INR', 'ZC-901824', 'SUB-CACAT-2026'),
(6, 'cli-rajesh-006', 'Dr Rajesh Reddy', '+91-9988711695', '', 'drrajeshreddy1@gmail.com', 'Direct', 'Client Accounts', 'Free', 'Trial_plan', 'Monthly', '₹ 0.00', 0.00, 0.00, '19-10-2026', 20, 10, 2, 500, 48, 500, 0, 0, 0, '-', 'drrajeshreddy.com', 'No', 'Trial', 'Rahul Sharma', 'Kiran Kumar', 'INR', 'ZC-901825', 'SUB-RAJESH-2026'),
(7, 'cli-wisera-007', 'Wisera Info', '+91-9876598897', '', 'info@wisera.in', 'Direct', 'Client Accounts', 'Pro Trial', 'Trial_plan', 'Monthly', '₹ 0.00', 0.00, 0.00, '17-09-2027', 353, 25, 6, 25000, 3200, 2500, 200, 5000, 120, '36AAACW9821K1Z2', 'wisera.in', 'No', 'Trial', 'Pooja Reddy', 'Ananya Sen', 'INR', 'ZC-901826', 'SUB-WISERA-2026'),
(8, 'cli-bts-008', 'BTS SmartBot', '+91-9811102113', '', 'btssmartbot@gmail.com', 'Direct', 'Client Accounts', 'Free', 'Trial_plan', 'Monthly', '₹ 0.00', 0.00, 0.00, '18-10-2026', 19, 5, 1, 500, 8, 500, 0, 0, 0, '-', 'btssmartbot.com', 'No', 'Trial', 'Amit Patel', 'Suresh Raina', 'INR', 'ZC-901827', 'SUB-BTS-2026'),
(9, 'cli-shrishti-009', 'Shrishti Jajodia', '+91-7289970856', '', 'customercare@alignbooks.com', 'Direct', 'Client Accounts', 'Pro NY (WA)', 'Paid_plan', 'Yearly', '₹ 47,999.00', 47999.00, 600.00, '08-06-2027', 252, 10, 1, 5000, 0, 1000, 0, 0, 0, '-', 'alignbooks.com', 'No', 'Active', 'Rahul Sharma', 'Kiran Kumar', 'INR', '3141005000009490054', 'SUB-SHRISHTI-2026'),
(10, 'cli-solaris-010', 'Solaris Green Energy #2', '+91-9800009460', '+91-9100006220', 'client20@solarisgre.com', 'Direct', 'Client Accounts', 'Pro NM', 'Paid_plan', 'Monthly', '₹ 4,999.00', 4999.00, 65.00, '15-02-2027', 141, 25, 0, 50000, 2400, 1000, 0, 5000, 0, '36AAACH7020R1ZZ', 'solarisgre.com', 'No', 'Active', 'Rahul Sharma', 'Kiran Kumar', 'INR', '3141005000009490020', 'SUB-SOLARIS-2026')
ON CONFLICT (client_uuid) DO NOTHING;
