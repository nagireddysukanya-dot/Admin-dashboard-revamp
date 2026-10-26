const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'frontend', 'css', 'styles.css');
const jsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');

// 1. UPDATE CSS (Section 12)
let css = fs.readFileSync(cssPath, 'utf8');

const oldCssStart = '/* ==========================================================================\r\n   12. SMATBOT ADMIN LOGIN PAGE (admin.smatbot.com)';
const oldCssEnd = '/* ==========================================================================\r\n   13. SAVED / PREVIOUS LOGINS AUTOFILL POPUP';

// Normalized finder
let startIdx = css.indexOf('12. SMATBOT ADMIN LOGIN PAGE');
let endIdx = css.indexOf('13. SAVED / PREVIOUS LOGINS');

if (startIdx !== -1 && endIdx !== -1) {
  // Find start of comment block
  const realStart = css.lastIndexOf('/*', startIdx);
  const realEnd = css.lastIndexOf('/*', endIdx);

  const newLoginCss = `/* ==========================================================================
   12. MODERN ENTERPRISE SAAS LOGIN EXPERIENCE (Revamped Premium UI)
   ========================================================================== */
.smatbot-login-page-container {
  min-height: 100vh;
  display: flex;
  background: #F8FAFC;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow-x: hidden;
}

/* Left Brand Showcase Hero */
.login-hero-showcase {
  flex: 1.15;
  background: linear-gradient(135deg, #090D16 0%, #0F172A 50%, #1E1B4B 100%);
  padding: 3.5rem 4rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  color: #FFFFFF;
}

.login-hero-showcase::before {
  content: '';
  position: absolute;
  top: -15%;
  left: -15%;
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, rgba(24, 119, 242, 0.25) 0%, transparent 70%);
  filter: blur(60px);
  pointer-events: none;
}

.login-hero-showcase::after {
  content: '';
  position: absolute;
  bottom: -15%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(99, 91, 255, 0.28) 0%, transparent 70%);
  filter: blur(70px);
  pointer-events: none;
}

.login-hero-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.login-hero-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.login-hero-badge {
  padding: 5px 14px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #A5B4FC;
  backdrop-filter: blur(8px);
}

.login-hero-content {
  position: relative;
  z-index: 2;
  max-width: 540px;
  margin: 3.5rem 0;
}

.login-hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: rgba(24, 119, 242, 0.16);
  border: 1px solid rgba(96, 165, 250, 0.35);
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #93C5FD;
  margin-bottom: 1.5rem;
}

.login-hero-title {
  font-size: 2.6rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.025em;
  color: #FFFFFF;
  margin-bottom: 1.25rem;
}

.login-hero-title span {
  background: linear-gradient(135deg, #60A5FA 0%, #C084FC 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.login-hero-desc {
  font-size: 1.05rem;
  line-height: 1.6;
  color: #94A3B8;
  margin-bottom: 2.5rem;
}

.login-hero-feature-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-glass-card {
  display: flex;
  align-items: center;
  gap: 1.15rem;
  padding: 1.15rem 1.4rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 14px;
  backdrop-filter: blur(14px);
  transition: all 0.25s ease;
}

.login-glass-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.22);
  transform: translateX(4px);
}

.login-glass-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: rgba(24, 119, 242, 0.18);
  border: 1px solid rgba(24, 119, 242, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.login-glass-text h4 {
  margin: 0 0 3px 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #F8FAFC;
}

.login-glass-text p {
  margin: 0;
  font-size: 0.82rem;
  color: #94A3B8;
  line-height: 1.4;
}

.login-hero-footer {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.82rem;
  color: #64748B;
}

.login-status-live {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #34D399;
  font-weight: 600;
}

.live-pulse-glow {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10B981;
  box-shadow: 0 0 10px #10B981;
}

/* Right Interactive Login Viewport */
.login-form-viewport {
  flex: 0.85;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2.5rem;
  background: #FFFFFF;
}

.login-form-card {
  width: 100%;
  max-width: 440px;
  padding: 2.75rem 2.5rem;
  border-radius: 20px;
  background: #FFFFFF;
  box-shadow: 0 20px 45px -10px rgba(15, 23, 42, 0.08), 0 0 1px 1px rgba(226, 232, 240, 0.8);
  border: 1px solid #EDF2F7;
}

.login-card-header {
  margin-bottom: 2.25rem;
}

.login-brand-icon-chip {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #1877F2 0%, #4F46E5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  margin-bottom: 1.25rem;
  box-shadow: 0 8px 18px -4px rgba(24, 119, 242, 0.4);
}

.login-card-title {
  font-size: 1.85rem;
  font-weight: 800;
  color: #0F172A;
  margin: 0 0 0.45rem 0;
  letter-spacing: -0.02em;
}

.login-card-subtitle {
  font-size: 0.92rem;
  color: #64748B;
  margin: 0;
  line-height: 1.5;
}

.modern-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-prefix-icon {
  position: absolute;
  left: 14px;
  color: #94A3B8;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  transition: color 0.2s ease;
}

.modern-form-input {
  width: 100%;
  height: 48px;
  padding: 0 14px 0 42px;
  background: #F8FAFC;
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;
  font-size: 0.94rem;
  font-weight: 500;
  color: #0F172A;
  outline: none;
  font-family: inherit;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-form-input:hover {
  background: #FFFFFF;
  border-color: #CBD5E1;
}

.modern-form-input:focus {
  background: #FFFFFF;
  border-color: #1877F2;
  box-shadow: 0 0 0 4px rgba(24, 119, 242, 0.12);
}

.modern-form-input:focus ~ .input-prefix-icon {
  color: #1877F2;
}

.btn-toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #94A3B8;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: color 0.15s ease, background-color 0.15s ease;
}

.btn-toggle-password:hover {
  color: #0F172A;
  background-color: #F1F5F9;
}

.login-form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  font-size: 0.88rem;
}

.remember-me-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #475569;
  cursor: pointer;
  user-select: none;
  font-weight: 500;
}

.remember-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #1877F2;
  border-radius: 4px;
  cursor: pointer;
}

.link-forgot-pass {
  color: #1877F2;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.85rem;
  transition: color 0.15s ease;
}

.link-forgot-pass:hover {
  color: #166FE5;
  text-decoration: underline;
}

.btn-modern-login-submit {
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, #1877F2 0%, #2563EB 100%);
  color: #FFFFFF;
  border: none;
  border-radius: 10px;
  font-size: 0.98rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(24, 119, 242, 0.35);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-modern-login-submit:hover {
  background: linear-gradient(135deg, #166FE5 0%, #1D4ED8 100%);
  box-shadow: 0 6px 20px rgba(24, 119, 242, 0.45);
  transform: translateY(-1px);
}

.btn-modern-login-submit:active {
  transform: translateY(0);
}

.login-card-secure-footer {
  margin-top: 1.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #94A3B8;
  font-weight: 500;
}

@media (max-width: 1024px) {
  .login-hero-showcase {
    display: none;
  }
  .login-form-viewport {
    flex: 1;
    background: #F8FAFC;
    padding: 2rem 1.5rem;
  }
}

`;

  css = css.slice(0, realStart) + newLoginCss + css.slice(realEnd);
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('Successfully updated styles.css with revamped login UI!');
} else {
  console.error('Could not locate section 12 in styles.css');
}

// 2. UPDATE JS (renderLoginPage, togglePasswordVisibility, exports)
let js = fs.readFileSync(jsPath, 'utf8');

const newRenderLoginPage = `  function renderLoginPage() {
    const app = $('#app-mount');
    const savedLogins = getPreviousLoginsHistory();
    const hasPreviousLogins = savedLogins && savedLogins.length > 0;
    const defaultEmail = hasPreviousLogins ? savedLogins[0].email : 'sukanya@smatbot.com';
    const defaultPass = hasPreviousLogins ? savedLogins[0].realPass : 'admin123';

    app.innerHTML = \`
      <div class="smatbot-login-page-container">
        <!-- Left Side: Enterprise Feature Showcase -->
        <section class="login-hero-showcase">
          <div class="login-hero-header">
            <div class="login-hero-logo">
              <div class="brand-icon-box" style="width:38px; height:38px; border-radius:10px; background:linear-gradient(135deg,#1877F2,#635BFF); display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(24,119,242,0.4);">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <div style="display:flex; flex-direction:column;">
                <span style="font-size:1.35rem; font-weight:800; letter-spacing:-0.02em; color:#FFFFFF;">SmatBot</span>
                <span style="font-size:0.72rem; font-weight:600; color:#94A3B8; text-transform:uppercase; letter-spacing:0.08em;">Control Center</span>
              </div>
            </div>
            <span class="login-hero-badge">v4.2 Production</span>
          </div>

          <div class="login-hero-content">
            <div class="login-hero-tag">
              <span class="live-pulse-glow"></span>
              <span>Next-Gen Conversational AI Admin</span>
            </div>
            <h1 class="login-hero-title">
              Manage <span>Chatbots, Clients</span> & Billing at Enterprise Scale
            </h1>
            <p class="login-hero-desc">
              Centralized orchestration hub for 220+ enterprise clients, multi-tier quota management, live bot migrations, and automated Zoho billing sync.
            </p>

            <div class="login-hero-feature-grid">
              <div class="login-glass-card">
                <div class="login-glass-icon">⚡</div>
                <div class="login-glass-text">
                  <h4>Omnichannel Bot Deployments</h4>
                  <p>WhatsApp Cloud API, Website Widgets, and Custom Webhook Triggers.</p>
                </div>
              </div>

              <div class="login-glass-card">
                <div class="login-glass-icon">🛡️</div>
                <div class="login-glass-text">
                  <h4>Enterprise Access & Audit Telemetry</h4>
                  <p>Granular RBAC, instant 1-click client portal impersonation, and live audit logs.</p>
                </div>
              </div>

              <div class="login-glass-card">
                <div class="login-glass-icon">📊</div>
                <div class="login-glass-text">
                  <h4>Automated Billing & Quota Limits</h4>
                  <p>Synchronized invoice lifecycle, trial tracking, and real-time usage meters.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="login-hero-footer">
            <span class="login-status-live">
              <span class="live-pulse-glow"></span> All Systems Operational (99.98% Uptime)
            </span>
            <span>© 2026 SmatBot Inc. All rights reserved.</span>
          </div>
        </section>

        <!-- Right Side: Clean Modern Sign-In Card -->
        <main class="login-form-viewport">
          <div class="login-form-card">
            <div class="login-card-header">
              <div class="login-brand-icon-chip">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h2 class="login-card-title">Sign In</h2>
              <p class="login-card-subtitle">Enter your admin credentials to access your control center</p>
            </div>

            <form id="admin-login-form" onsubmit="window.smatApp.handleLoginSubmit(event)">
              <div class="smat-form-group">
                <label class="smat-form-label" for="login-email-input">Work Email Address</label>
                <div class="modern-input-wrap">
                  <span class="input-prefix-icon">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </span>
                  <input 
                    type="email" 
                    id="login-email-input" 
                    class="modern-form-input" 
                    value="\${defaultEmail}" 
                    placeholder="name@smatbot.com"
                    required 
                    autocomplete="username"
                  />
                </div>
              </div>

              <div class="smat-form-group">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 8px;">
                  <label class="smat-form-label" for="login-password-input" style="margin-bottom:0;">Password</label>
                  <a href="javascript:void(0)" class="link-forgot-pass" onclick="window.smatApp.showToast('Contact administrator to reset your credentials.')">Forgot password?</a>
                </div>
                <div class="modern-input-wrap">
                  <span class="input-prefix-icon">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                  <input 
                    type="password" 
                    id="login-password-input" 
                    class="modern-form-input" 
                    value="\${defaultPass}" 
                    placeholder="Enter your password"
                    required 
                    autocomplete="current-password"
                  />
                  <button type="button" class="btn-toggle-password" onclick="window.smatApp.togglePasswordVisibility()" title="Show/Hide Password">
                    <svg id="password-toggle-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="login-form-options">
                <label class="remember-me-label">
                  <input type="checkbox" class="remember-checkbox" checked />
                  <span>Remember me on this browser</span>
                </label>
              </div>

              <button type="submit" class="btn-modern-login-submit" id="btn-login-action">
                <span>Sign In to Control Center</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </form>

            <div class="login-card-secure-footer">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>256-Bit SSL Encrypted Enterprise Gateway</span>
            </div>
          </div>
        </main>
        <div id="toast-container"></div>
      </div>
    \`;
  }

  function togglePasswordVisibility() {
    const input = $('#login-password-input');
    const icon = $('#password-toggle-icon');
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      if (icon) {
        icon.innerHTML = \`
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        \`;
      }
    } else {
      input.type = 'password';
      if (icon) {
        icon.innerHTML = \`
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        \`;
      }
    }
  }`;

// Replace renderLoginPage function
const oldRenderLoginRegex = /function renderLoginPage\(\)\s*\{[\s\S]*?function showSavedLoginsPopup/g;
js = js.replace(oldRenderLoginRegex, newRenderLoginPage + '\n\n  function showSavedLoginsPopup');

// Export togglePasswordVisibility in window.smatApp
if (!js.includes('togglePasswordVisibility,')) {
  js = js.replace('handleLoginSubmit,', 'handleLoginSubmit,\n    togglePasswordVisibility,');
}

fs.writeFileSync(jsPath, js, 'utf8');
console.log('Successfully updated app.js with revamped renderLoginPage and togglePasswordVisibility!');
