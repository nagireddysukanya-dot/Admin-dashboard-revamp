# SmatBot Admin Portal (Node.js + Express + MySQL Full-Stack)

Official SmatBot Website Admin Panel recreation with complete **Frontend + Node.js REST API Backend + MySQL Database Schema**.

---

## 📁 Project Structure

```
smatbot-admin-fullstack/
├── backend/
│   ├── config/
│   │   └── db.js                 # MySQL Pool Connection & Intelligent In-Memory fallback
│   ├── routes/
│   │   ├── auth.routes.js        # POST /api/auth/login, GET /api/auth/me
│   │   ├── clients.routes.js     # GET /api/clients (15 Filters), CRUD & Impersonate
│   │   ├── bots.routes.js        # POST /api/bots/migrate, GET /api/bots/migrations
│   │   ├── users.routes.js       # GET /api/users, POST /api/users
│   │   └── plans.routes.js       # GET /api/plans, POST /api/plans/activate
│   └── server.js                 # Express Application Server on Port 5000
│
├── database/
│   └── schema.sql                # MySQL Database Schema DDL & Seed Queries
│
├── frontend/
│   ├── css/
│   │   └── styles.css            # SmatBot Design System (Matching Screenshots 1 & 2)
│   ├── js/
│   │   └── app.js                # Frontend Application Controller & Fetch API Client
│   └── index.html                # Single Page App Root
│
├── .env                          # Server Port & MySQL Credentials
└── package.json                  # Backend Dependencies (express, mysql2, cors, dotenv)
```

---

## ⚡ How to Setup & Run

### 1. MySQL Setup (Optional / Recommended)
Import the database schema into your MySQL server (via MySQL Workbench, phpMyAdmin, or CLI):
```bash
mysql -u root -p < database/schema.sql
```
*(Note: If MySQL is not running, the Node.js server automatically runs with built-in in-memory storage so you can test everything immediately without any database setup blocker!)*

### 2. Install & Start the Node.js Server
```bash
cd C:\Users\admin\.gemini\antigravity-ide\scratch\smatbot-admin-fullstack
npm install
node backend/server.js
```

Then open **`http://localhost:5000`** in your browser!

---

## 🎯 Supported Features Matching Exact SmatBot Screenshots

1. **Login Page (`admin.smatbot.com`)**:
   - Matching SmatBot purple bot logo & typography.
   - Email address input (`sukanya@smatbot.com`).
   - Password input.
   - Primary blue **Login** button.

2. **Client Details Page (`admin.smatbot.com/client-details`)**:
   - **Header**: Hamburger menu `☰`, "Sync Customer Address" button, user profile with `Sukanya Nagireddy ∨`.
   - **All 15 Filters**:
     1. `Select Plan Type` (All, Paid, Free Trial)
     2. `Account type` (All, Enterprise, Business, Healthcare, Retail, Education)
     3. `Select Billing Cycle` (All, Monthly, Quarterly, Yearly)
     4. `Customer type` (All, Direct Client, Agency Partner, White-Label Partner)
     5. `Plan Name` (All, Starter, Professional, Enterprise AI, Custom White-Label)
     6. `support Plans` (All, Standard Support, Priority SLA (24/7), Dedicated Account Mgr)
     7. `Lost Client Status` (All, No, Yes)
     8. `Sales Persons` (All, Rahul Sharma, Pooja Reddy, Sameer Khan)
     9. `Support Persons` (All, Kiran Kumar, Vikas Rao)
     10. `Currency type` (All, INR, USD)
     11. `INR Currency Range` (`₹ From` - `To`)
     12. `USD Currency Range` (`$ From` - `To`)
     13. `Subscription Status` (Active, Trial, Suspended)
     14. `Select duration` (All Time, This Month, Last 30 Days)
     15. `Search` (`Email / Subscription Id / Zoho customer Id`) + Blue **Search** button
   - **Count Badge**: Blue pill badge (e.g. `215`).
   - **Data Table**: Columns matching `S.no`, `Name`, `Phone number`, `Alternate Phone`, `Email`, `Customer Type`, `Plan name`, `Plan Type`, `Subscription Status`, and `Actions`.

3. **Action Modals & Workflows**:
   - **Login to Dashboard**: Direct 1-click client impersonation session.
   - **Migrate Bot**: 4-step Bot Migration Wizard.
   - **Plan Activation**: Plan tier upgrades, billing frequency toggles & add-ons.
   - **Add Users**: Add and invite team members.
