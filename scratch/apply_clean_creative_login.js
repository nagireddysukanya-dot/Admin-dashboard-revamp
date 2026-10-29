const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
const stylesCssPath = path.join(__dirname, '..', 'frontend', 'css', 'styles.css');

// 1. Update app.js
let appJs = fs.readFileSync(appJsPath, 'utf8');

const targetAppJsCode = `  // =========================================================================
  // 0. ADMIN LOGIN PAGE (Screenshot 2 Architecture & SmatBot 3D Creative)
  // =========================================================================
  let loginActiveTab = 'sign-in'; // 'sign-in' | 'quick-access' | 'password-recovery'

  function setLoginTab(tab) {
    loginActiveTab = tab;
    renderLoginPage();
  }

  function handlePasswordRecoverySubmit(e) {
    e.preventDefault();
    const email = document.getElementById('recovery-email-input')?.value.trim() || 'user@smatbot.com';
    showToast(\`📩 Password recovery link has been dispatched to \${email}!\`);
    setTimeout(() => {
      setLoginTab('sign-in');
    }, 1800);
  }

  function renderLoginPage() {`;

const newAppJsCode = `  // =========================================================================
  // 0. ADMIN LOGIN PAGE (Clean Focused Login with Official SmatBot Logo & 3D Artwork)
  // =========================================================================
  function renderLoginPage() {
    const app = $('#app-mount');
    const savedLogins = getPreviousLoginsHistory();
    const hasPreviousLogins = savedLogins && savedLogins.length > 0;
    const defaultEmail = hasPreviousLogins ? savedLogins[0].email : 'sukanya@smatbot.com';
    const defaultPass = hasPreviousLogins ? savedLogins[0].realPass : 'admin123';

    app.innerHTML = \`
      <div class="smatbot-login-page-container">
        <!-- Top Navbar with Official SmatBot Logo (Screenshot 1 & 4 Match) -->
        <header class="smat-login-top-bar">
          <div class="smatbot-official-nav-logo">
            <div class="smatbot-purple-robot-badge">
              <svg width="34" height="26" viewBox="0 0 34 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="34" height="26" rx="6.5" fill="#4C2277"/>
                <polygon points="10,8.5 12.5,11 10,13.5 7.5,11" fill="#FFFFFF"/>
                <polygon points="24,8.5 26.5,11 24,13.5 21.5,11" fill="#FFFFFF"/>
                <path d="M11 15.5 C13.5 19.5 20.5 19.5 23 15.5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none"/>
              </svg>
            </div>
            <span class="smatbot-official-logo-text">SmatBot</span>
          </div>
        </header>

        <!-- Main 2-Column Stage: Clean Simple Login Card + 3D Illustration -->
        <main class="smat-login-main-stage">
          <!-- LEFT: Clean Simple Login Card (Screenshot 4 Match) -->
          <div class="smat-login-card-wrapper">
            <div class="smat-clean-login-card">
              <h1 class="smat-clean-login-title">Login</h1>

              <form id="admin-login-form" onsubmit="window.smatApp.handleLoginSubmit(event)">
                <div class="smat-clean-form-group">
                  <label class="smat-clean-label" for="login-email-input">Email Address</label>
                  <input 
                    type="email" 
                    id="login-email-input" 
                    class="smat-clean-input" 
                    value="\${defaultEmail}" 
                    placeholder="sukanya@smatbot.com" 
                    required 
                    autocomplete="username" 
                  />
                </div>

                <div class="smat-clean-form-group">
                  <label class="smat-clean-label" for="login-password-input">Password</label>
                  <div class="smat-password-wrapper">
                    <input 
                      type="password" 
                      id="login-password-input" 
                      class="smat-clean-input" 
                      value="\${defaultPass}" 
                      placeholder="Enter your password" 
                      required 
                      autocomplete="current-password" 
                    />
                    <button type="button" class="smat-clean-eye-btn" onclick="window.smatApp.togglePasswordVisibility()" title="Show/Hide Password">
                      <svg id="password-toggle-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </div>
                </div>

                <button type="submit" class="btn-smat-clean-login">
                  Login
                </button>
              </form>
            </div>
          </div>

          <!-- RIGHT: 3D Illustration (Screenshot 2 Match) -->
          <div class="smat-login-illustration-column">
            <div class="smat-3d-illustration-frame">
              <img 
                src="assets/smatbot_login_3d.jpg" 
                alt="SmatBot 3D AI Digital Control Center" 
                class="smat-3d-illustration-img" 
              />
            </div>
          </div>
        </main>

        <div id="toast-container"></div>
      </div>
    \`;
  }`;

// Find start and end of renderLoginPage block
const startIdx = appJs.indexOf('// =========================================================================\r\n  // 0. ADMIN LOGIN PAGE');
const altStartIdx = appJs.indexOf('// =========================================================================\n  // 0. ADMIN LOGIN PAGE');
const actualStart = startIdx !== -1 ? startIdx : altStartIdx;

const endSearch = 'function togglePasswordVisibility()';
const endIdx = appJs.indexOf(endSearch, actualStart);

if (actualStart === -1 || endIdx === -1) {
  console.error('Could not find start or end index in app.js', { actualStart, endIdx });
  process.exit(1);
}

const beforeBlock = appJs.substring(0, actualStart);
const afterBlock = appJs.substring(endIdx);

const updatedAppJs = beforeBlock + newAppJsCode + '\n\n  ' + afterBlock;
fs.writeFileSync(appJsPath, updatedAppJs, 'utf8');
console.log('Successfully updated app.js!');

// 2. Update styles.css
let stylesCss = fs.readFileSync(stylesCssPath, 'utf8');

const cssStartMarker = '/* ==========================================================================\r\n   12. MODERN ENTERPRISE SAAS LOGIN EXPERIENCE';
const altCssStartMarker = '/* ==========================================================================\n   12. MODERN ENTERPRISE SAAS LOGIN EXPERIENCE';
const cssStart = stylesCss.indexOf(cssStartMarker) !== -1 ? stylesCss.indexOf(cssStartMarker) : stylesCss.indexOf(altCssStartMarker);

const cssEndMarker = '/* ==========================================================================\r\n   13. SAVED / PREVIOUS LOGINS AUTOFILL POPUP';
const altCssEndMarker = '/* ==========================================================================\n   13. SAVED / PREVIOUS LOGINS AUTOFILL POPUP';
const cssEnd = stylesCss.indexOf(cssEndMarker) !== -1 ? stylesCss.indexOf(cssEndMarker) : stylesCss.indexOf(altCssEndMarker);

if (cssStart === -1 || cssEnd === -1) {
  console.error('Could not find CSS start or end marker', { cssStart, cssEnd });
  process.exit(1);
}

const newCssSection = `/* ==========================================================================
   12. MODERN CREATIVE SAAS LOGIN (Official SmatBot Logo + Clean Form + 3D Illustration)
   ========================================================================== */
.smatbot-login-page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(ellipse at 70% 30%, #C8EEFF 0%, #E2F5FF 35%, #EEF8FF 65%, #F7FAFC 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow-x: hidden;
  position: relative;
}

/* Ambient Glowing Soft Blobs */
.smatbot-login-page-container::before {
  content: '';
  position: absolute;
  top: 5%;
  right: 15%;
  width: 480px;
  height: 480px;
  background: radial-gradient(circle, rgba(0, 196, 255, 0.22) 0%, rgba(24, 119, 242, 0.05) 50%, transparent 70%);
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}

.smatbot-login-page-container::after {
  content: '';
  position: absolute;
  bottom: 5%;
  left: 10%;
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, rgba(165, 235, 255, 0.38) 0%, transparent 65%);
  filter: blur(70px);
  pointer-events: none;
  z-index: 0;
}

/* Top Navbar with Official SmatBot Logo (Screenshot 1 & Screenshot 4 Match) */
.smat-login-top-bar {
  width: 100%;
  padding: 1.5rem 3rem;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 10;
}

.smatbot-official-nav-logo {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  user-select: none;
}

.smatbot-purple-robot-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  box-shadow: 0 4px 12px rgba(76, 34, 119, 0.25);
  transition: transform 0.2s ease;
}

.smatbot-purple-robot-badge:hover {
  transform: scale(1.04);
}

.smatbot-official-logo-text {
  font-size: 1.55rem;
  font-weight: 700;
  color: #374151;
  letter-spacing: -0.02em;
}

/* Main 2-Column Layout */
.smat-login-main-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 1rem 3rem 4rem;
  gap: 4.5rem;
  position: relative;
  z-index: 1;
}

/* LEFT: Clean Simple Login Card (Screenshot 4 Match) */
.smat-login-card-wrapper {
  flex: 0 0 430px;
  max-width: 450px;
  width: 100%;
}

.smat-clean-login-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 2.75rem 2.5rem;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 12px 40px rgba(0, 119, 182, 0.08), 0 2px 10px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(219, 234, 254, 0.85);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.smat-clean-login-card:hover {
  box-shadow: 0 16px 48px rgba(0, 119, 182, 0.12), 0 4px 14px rgba(0, 0, 0, 0.04);
}

.smat-clean-login-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1E293B;
  text-align: center;
  margin: 0 0 2rem;
  letter-spacing: -0.02em;
}

.smat-clean-form-group {
  margin-bottom: 1.35rem;
}

.smat-clean-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748B;
  margin-bottom: 8px;
}

/* Light blue input field exactly matching Screenshot 4 (#EDF4FE) */
.smat-clean-input {
  width: 100%;
  height: 46px;
  box-sizing: border-box;
  padding: 0 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #1E293B;
  background-color: #EDF4FE;
  border: 1px solid #DBEAFE;
  border-radius: 6px;
  outline: none;
  font-family: inherit;
  transition: all 0.18s ease;
}

.smat-clean-input:focus {
  background-color: #FFFFFF;
  border-color: #1877F2;
  box-shadow: 0 0 0 3px rgba(24, 119, 242, 0.16);
}

.smat-password-wrapper {
  position: relative;
  width: 100%;
}

.smat-password-wrapper .smat-clean-input {
  padding-right: 44px;
}

.smat-clean-eye-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  color: #94A3B8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  transition: color 0.15s ease;
}

.smat-clean-eye-btn:hover {
  color: #1E293B;
}

/* Vibrant Clean Solid Blue Login Button (Screenshot 4 Match) */
.btn-smat-clean-login {
  width: 100%;
  height: 46px;
  background-color: #1877F2;
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 1.5rem;
  box-shadow: 0 4px 14px rgba(24, 119, 242, 0.28);
  transition: background-color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-smat-clean-login:hover {
  background-color: #166FE5;
  box-shadow: 0 6px 18px rgba(24, 119, 242, 0.35);
  transform: translateY(-1px);
}

.btn-smat-clean-login:active {
  transform: translateY(0);
}

/* RIGHT: SmatBot 3D Illustration Frame (Screenshot 2 Match) */
.smat-login-illustration-column {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 640px;
}

@keyframes subtleIllustrationFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.smat-3d-illustration-frame {
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 136, 204, 0.16), 0 4px 16px rgba(0, 0, 0, 0.04);
  border: 4px solid #FFFFFF;
  animation: subtleIllustrationFloat 6s ease-in-out infinite;
  background: #FFFFFF;
}

.smat-3d-illustration-img {
  width: 100%;
  height: auto;
  display: block;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .smat-login-main-stage {
    gap: 2.5rem;
    padding: 1rem 2rem 3rem;
  }
}

@media (max-width: 860px) {
  .smat-login-top-bar {
    padding: 1.25rem 1.5rem;
  }
  .smat-login-main-stage {
    flex-direction: column-reverse;
    gap: 2rem;
    padding: 0 1.5rem 3rem;
  }
  .smat-login-card-wrapper {
    max-width: 440px;
  }
  .smat-login-illustration-column {
    max-width: 460px;
  }
}
`;

const updatedStylesCss = stylesCss.substring(0, cssStart) + newCssSection + '\n' + stylesCss.substring(cssEnd);
fs.writeFileSync(stylesCssPath, updatedStylesCss, 'utf8');
console.log('Successfully updated styles.css!');
