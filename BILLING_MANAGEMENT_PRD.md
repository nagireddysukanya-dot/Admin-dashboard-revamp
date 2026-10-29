# SmatBot Subscription & Billing Management – Architecture & PRD

**Author / Assignee:** Sukanya Nagireddy  
**Project:** SmatBot Admin & Client Portal Full-Stack (`smatbot-admin-fullstack`)  
**Status:** Implemented & Ready for Review  
**Version:** 2.0 (Full-Stack Engine)

---

## 📌 Executive Summary

This document specifies the complete business logic, mathematical formulas, edge cases, and UI/backend implementations for the **9 Key Subscription & Billing Management requirements** for SmatBot, fully aligned with the **Official New Plan & Pricing Architecture (`smatbot-new-pricing (1) 1.html`)** and **Management Directive (Deepak's Mandate)**.

---

## 🏛️ Official 4-Plan Architecture

SmatBot consolidates its commercial offering into 4 streamlined tier packages:

| Plan | Monthly Price | Yearly Price | Yearly Savings | Bots | Live Agents | Service Messages Quota | BI Messages Quota | Platforms Included |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Broadcast** | ₹1,499 / mo | ₹14,500 / yr | Save ₹3,488 (19%) | 2 | 0 | 1K / mo or **12K / yr upfront** | 1K / mo or **12K / yr upfront** | WhatsApp, Website (Broadcast only, no bot) |
| **Standard** | ₹3,500 / mo | ₹35,000 / yr | Save ₹7,000 (17%) | 5 | 0 | 30K / mo or **360K / yr upfront** | 2K / mo or **24K / yr upfront** | WA, Web, Instagram, Landing Page Chatbot (Flow/Menu bot) |
| **Pro (Popular)** | ₹6,500 / mo | ₹72,000 / yr | Save ₹6,000 (8%) | 10 | 3 included | 100K / mo or **1.2M / yr upfront** | 5K / mo or **60K / yr upfront** | 6 Platforms (WA, Web, FB, IG, In-App SDK, Landing Page) |
| **AI** | ₹8,999 / mo | ₹96,000 / yr | Save ₹11,988 (11%) | 10 | 3 included | 500K / mo or **6M / yr upfront** | 10K / mo or **120K / yr upfront** | Full Pro suite + Native AI Vector Knowledge Base & LLM |

> **Notices & Billing Conditions:**
> * **GST Notice**: All plan and add-on rates are exclusive of GST (+18%), charged extra at checkout.
> * **Meta Charges**: Customer must configure payment card in Meta Business Manager for direct Meta WhatsApp per-message charges.

---

## ⚡ Deepak's Core Policy Mandate: Yearly Upfront Quota Allocation

### Policy Directive
* **Historical Approach**: Previously, subscriptions on yearly cycles had chat and message quotas reset on a monthly cadence (e.g. 100,000 chats every month).
* **New Official Architecture**: **The entire yearly quota is credited UPFRONT at subscription initiation.**
  * Broadcast Yearly: **12,000 service messages** & **12,000 BI messages** allocated immediately upfront.
  * Standard Yearly: **360,000 service messages** & **24,000 BI messages** allocated immediately upfront.
  * Pro Yearly: **1,200,000 service messages** & **60,000 BI messages** allocated immediately upfront.
  * AI Yearly: **6,000,000 service messages** & **120,000 BI messages** allocated immediately upfront.
* **Unified Add-on Quota Rule**: The same upfront allocation applies strictly to all quota-based add-ons:
  * For example, purchasing an annual **SMS Notifications** add-on credits the full **12,000 notifications upfront** rather than dripping 1,000/month.
  * Similarly applies to Email OTP (12,000/yr upfront), SMS OTP (12,000/yr upfront), WhatsApp OTP (12,000/yr upfront), and WhatsApp BI messages (12,000/yr upfront).

---

## 🎯 1. Add-on Purchases (Rule 1)

### Business Rules
1. **Purchase Eligibility**: Users on active auto-pay subscriptions can purchase both:
   * **One-time Add-ons**: (e.g., extra agent seats, one-off WhatsApp message credit bundles).
   * **Recurring Auto-pay Add-ons**: (e.g., +10,000 monthly conversations quota, dedicated WhatsApp numbers).
2. **Billing Lifecycle**:
   * Recurring add-ons automatically renew on the billing date using the account's saved payment method.
   * One-time add-ons are charged once and do not recur.

### System Implementation
* **Database**: Handled in the `client_addons` table with `addon_type` ENUM (`one_time`, `recurring`).
* **UI**: Accessible in the Admin Plan Modal and Client Dashboard Self-Service Add-on Store with transparent pricing.

### Official Catalog of 19 Add-ons

| # | Add-on | Unit / Scope | Plan Eligibility | Monthly Price | Yearly Price (Upfront Quota) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Template Text Replies + Button Clicks** | Flat rate | Broadcast, Standard | ₹1,000 / mo | ₹9,600 / yr |
| 2 | **CRM Integration** | Flat rate | Broadcast, Standard | ₹1,000 / mo | ₹9,600 / yr |
| 3 | **WhatsApp Cart & Catalog** | Flat rate | Broadcast, Standard | ₹1,000 / mo | ₹9,600 / yr |
| 4 | **Live Agent Seat** | Per agent (beyond 3 in Pro/AI) | All plans | ₹1,000 / mo | ₹9,600 / yr |
| 5 | **AI Agent (Dialogflow)** | Flat rate | Broadcast, Standard | ₹1,000 / mo | ₹9,600 / yr |
| 6 | **Multi-Lingual / Extra Language** | Per extra language | All plans | ₹1,000 / mo | ₹9,600 / yr |
| 7 | **AI Integration Suite** | Flat rate | Broadcast, Standard, Pro | ₹2,000 / mo | ₹24,000 / yr |
| 8 | **Email OTP Validation** | 1,000 / mo or 12,000 / yr upfront | Standard, Pro, AI | ₹500 / mo | ₹6,000 / yr (**12K upfront**) |
| 9 | **Extra Chatbots** | Per 5 chatbots | All plans | ₹1,000 / mo | ₹9,600 / yr |
| 10 | **WhatsApp BI Messages** | 1,000 / mo or 12,000 / yr upfront | All plans | ₹200 / mo | ₹2,400 / yr (**12K upfront**) |
| 11 | **UI / Website Chats** | 1,000 / mo or 12,000 / yr upfront | All plans | ₹600 / mo | ₹7,200 / yr (**12K upfront**) |
| 12 | **SMS OTPs** | 1,000 / mo or 12,000 / yr upfront | All plans | ₹500 / mo | ₹6,000 / yr (**12K upfront**) |
| 13 | **WhatsApp OTPs** | 1,000 / mo or 12,000 / yr upfront | All plans | ₹500 / mo | ₹6,000 / yr (**12K upfront**) |
| 14 | **SMS Notifications** | 1,000 / mo or 12,000 / yr upfront | All plans | ₹500 / mo | ₹6,000 / yr (**12K upfront**) |
| 15 | **WhatsApp Notifications** | 1,000 / mo or 12,000 / yr upfront | All plans | ₹500 / mo | ₹6,000 / yr (**12K upfront**) |
| 16 | **Text to Speech** | Flat rate | All plans | ₹800 / mo | ₹7,200 / yr |
| 17 | **Remove Branding** | Flat rate | All plans | ₹1,900 / mo | ₹20,280 / yr |
| 18 | **Basic Support SLA** | Flat rate | All plans | ₹6,999 / mo | ₹71,988 / yr |
| 19 | **Premium Support SLA** | Flat rate | All plans | ₹14,999 / mo | ₹143,988 / yr |

---

## ⏳ 2. Flexible Subscription Durations (Rule 2)

### Business Rules
* Default plans offered in the catalog are **Monthly (1 month)** and **Yearly (12 months)**.
* Specific clients require custom durations: **2, 4, 6, or 9 months**.
* **Zero SKU Proliferation**: Rather than polluting the plan catalog with duplicate plan codes for every possible duration, durations are calculated dynamically using the base monthly price multiplier:

$$\text{Custom Duration Price} = \text{Base Monthly Plan Price} \times \text{Number of Months}$$

$$\text{Yearly Plan Price} = \text{Official Flat Yearly Rate (e.g. ₹14,500, ₹35,000, ₹72,000, ₹96,000)}$$

### System Implementation
* **Backend (`/api/plans/calculate-price` & `/api/plans/activate`)**: Accepts `durationMonths: 2 | 4 | 6 | 9 | 12`.
* **Frontend**: Admin Plan Wizard features a flexible duration selector with real-time price formula breakdown.

---

## 🛡️ 3. Add-on Expiry & Subscription Expiry Priority (Rule 3)

### Core Priority Rule
Yearly and multi-month subscribers frequently purchase monthly add-on boosters. The main subscription's expiry date **strictly supersedes** the add-on's nominal 30-day lifecycle.

$$\text{Effective Add-on Expiry} = \min(\text{Purchase Date} + 30\text{ days}, \text{Main Subscription Expiry Date})$$

### Concrete Example:
* Client subscription expires in **15 days** (`28-10-2026`).
* Client purchases a monthly conversations add-on on `13-10-2026`.
* **Result**: The add-on expires on **`28-10-2026` (15 days)**, NOT after 30 days.
* Prevents orphan add-on feature access on inactive/lapsed accounts.

---

## 💳 4. Payment Method Management (Rule 4)

### Business Rules
* Clients and admins can view and update their saved card / payment method.
* Updated payment credentials apply automatically to:
  1. Future primary subscription renewals.
  2. Recurring auto-pay add-on debits.
* Cards are tokenized with brand, last 4 digits, and expiration date stored in `payment_methods`.

---

## ⚙️ 5. Auto-Pay Management (Rule 5)

### Business Rules & Safeguards
* **User Control**: Clients can toggle Auto-Pay ON or OFF from their dashboard.
* **No Unintended Cancellation**:
  * Disabling auto-pay **does NOT cancel the active subscription**.
  * Access to chatbots, WhatsApp routing, and paid features remains **100% active** until the scheduled `end_date`.
  * The system displays an explicit confirmation banner clarifying that only future automated card charges are suspended.

---

## 🚫 6. Subscription Cancellation (Rule 6)

### Two Granular Cancellation Choices

| Choice | Effective Date | Feature Access & Add-ons | Billing Impact |
| :--- | :--- | :--- | :--- |
| **Option A: End of Current Billing Period (Recommended)** | `client.end_date` | Fully active until term completes; gracefully lapses | Auto-pay disabled; no further charges |
| **Option B: Cancel Immediately** | Today (`immediate`) | Revoked immediately; bots paused, webhooks disabled | Terminated immediately per terms |

The UI presents full impact disclosure and effective dates before confirmation.

---

## 🔄 7. Plan Upgrades & Downgrades (Rule 7)

### Separation of Concerns
* **Plan Upgrades (Self-Service)**: Handled directly in the client dashboard with instant proration and activation.
* **Plan Downgrades (Assisted Only)**: **Must NOT be permitted directly online**.
  * Self-service downgrade buttons are replaced with a clear notice directing clients to **Support or Sales** (`support@smatbot.com`).
  * Prevents accidental disconnection of production chatbots, custom domains, or loss of conversational history.

---

## ⚠️ 8. Admin Panel – Downgrade Impact Assessment (Rule 8)

When an authorized Administrator processes a downgrade in the SmatBot Admin Portal (e.g., *Enterprise AI ➔ Pro* or *Pro ➔ Starter*), the portal automatically runs a **Live Usage Impact Assessment**:

1. **Actual Usage vs New Limits**:
   * Checks live count of active chatbots vs target plan limit (e.g., 6 bots used vs 3 bots allowed $\rightarrow$ alerts admin that 3 bots must be paused).
   * Checks current month message consumption against new plan quota.
2. **Features Becoming Unavailable**:
   * WhatsApp WABA Cloud API connection status.
   * White-label custom CNAME domains and SSL certificates.
   * Custom LLM vector embeddings & multi-agent support seats.
3. **Admin Checkpoint**: Requires the admin to review the checklist and check:
   `[x] I have reviewed this impact report with the account owner before applying.`

---

## 🧩 9. Edge Cases & Resilience Safeguards (Rule 9)

1. **Payment Failures & Dunning Period**: 3-day grace period with email alerts before account suspension.
2. **Duplicate Transaction Guard**: Idempotency keys prevent double billing on simultaneous clicks.
3. **Mid-Cycle Plan Changes**: Upgrades extend validity with prorated pricing adjustments.
4. **Orphan Add-on Cleanup**: When a subscription is cancelled immediately, all attached add-on boosters terminate concurrently.

---

## 🗄️ Database Relational Schema

```sql
-- Client Add-ons
CREATE TABLE client_addons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  addon_name VARCHAR(120) NOT NULL,
  addon_type ENUM('one_time', 'recurring') DEFAULT 'recurring',
  price DECIMAL(10,2) NOT NULL,
  currency ENUM('INR', 'USD') DEFAULT 'INR',
  purchase_date DATE NOT NULL,
  standard_expiry_date DATE NOT NULL,
  effective_expiry_date DATE NOT NULL,
  is_capped_by_subscription TINYINT(1) DEFAULT 1,
  status ENUM('Active', 'Expired', 'Cancelled') DEFAULT 'Active',
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Payment Methods
CREATE TABLE payment_methods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  card_brand VARCHAR(50) DEFAULT 'Visa',
  last4 VARCHAR(4) NOT NULL,
  exp_month VARCHAR(2) NOT NULL,
  exp_year VARCHAR(4) NOT NULL,
  cardholder_name VARCHAR(150),
  is_autopay_enabled TINYINT(1) DEFAULT 1,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Downgrade Impact & Audit Trail
CREATE TABLE subscription_audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  action_type ENUM('upgrade', 'downgrade', 'autopay_toggle', 'cancellation') NOT NULL,
  previous_plan VARCHAR(80),
  new_plan VARCHAR(80),
  duration_months INT DEFAULT 1,
  admin_user VARCHAR(100) DEFAULT 'Sukanya Nagireddy',
  impact_summary TEXT,
  limits_exceeded JSON,
  blocked_features JSON,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);
```
