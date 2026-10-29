const fs = require('fs');
const path = require('path');

const normalize = (str) => str.replace(/\r\n/g, '\n');

// 1. Revert styles.css
const cssPath = path.join(__dirname, '../frontend/css/styles.css');
let css = fs.readFileSync(cssPath, 'utf8');
let normCss = normalize(css);

const replacementHamburgerCss = `.hamburger-btn {
  background: #F8FAFC;
  border: 1px solid var(--border-color);
  color: #334155;
  cursor: pointer;
  width: 38px;
  height: 38px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  outline: none;
}

.hamburger-btn:hover {
  background: #EFF6FF;
  border-color: #60A5FA;
  color: #2563EB;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.16);
}

.hamburger-btn svg line {
  transition: all 0.2s ease;
}

.hamburger-btn:hover svg line:nth-child(1) {
  transform: translateX(-1px);
}
.hamburger-btn:hover svg line:nth-child(2) {
  transform: translateX(1.5px);
  stroke: #2563EB;
}
.hamburger-btn:hover svg line:nth-child(3) {
  transform: translateX(-0.5px);
}

/* Sidebar Hover Peek Mode (Smooth Slide-In on Hamburger Lines Hover) */
.app-layout-wrapper.sidebar-collapsed.sidebar-hover-peek .main-sidebar {
  transform: translateX(0) !important;
  box-shadow: 10px 0 38px rgba(15, 23, 42, 0.2) !important;
  z-index: 99 !important;
  border-right: 1px solid #BFDBFE !important;
  transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.24s ease !important;
}

.app-layout-wrapper.sidebar-collapsed.sidebar-hover-peek::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(1.5px);
  -webkit-backdrop-filter: blur(1.5px);
  z-index: 38;
  pointer-events: none;
  animation: fadeInPeek 0.2s ease-out;
}

@keyframes fadeInPeek {
  from { opacity: 0; }
  to { opacity: 1; }
}`;

const targetHamburgerCss = `.hamburger-btn {
  background: #F1F5F9;
  border: 1px solid var(--border-color);
  color: var(--text-body);
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.hamburger-btn:hover {
  background: #E2E8F0;
  color: var(--primary-blue);
}`;

if (normCss.includes(normalize(replacementHamburgerCss))) {
  normCss = normCss.replace(normalize(replacementHamburgerCss), normalize(targetHamburgerCss));
  fs.writeFileSync(cssPath, normCss.replace(/\n/g, '\r\n'), 'utf8');
  console.log('✅ Reverted styles.css hamburger & hover peek styles to standard click mode!');
} else {
  console.error('⚠️ Could not locate replacementHamburgerCss in styles.css');
}

// 2. Revert app.js
const appJsPath = path.join(__dirname, '../frontend/js/app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');
let normAppJs = normalize(appJs);

// A. Revert sidebar tag
normAppJs = normAppJs.replace(
  '<aside class="main-sidebar" id="app-sidebar" onmouseenter="window.smatApp.onSidebarHoverEnter()" onmouseleave="window.smatApp.onSidebarHoverLeave()">',
  '<aside class="main-sidebar" id="app-sidebar">'
);

// B. Revert hamburger button tag
normAppJs = normAppJs.replace(
  '<button class="hamburger-btn" id="btn-sidebar-toggle" onclick="window.smatApp.toggleSidebar()" onmouseenter="window.smatApp.onHamburgerHoverEnter()" onmouseleave="window.smatApp.onHamburgerHoverLeave()" title="Hover over lines to open sidebar, click to pin open">',
  '<button class="hamburger-btn" onclick="window.smatApp.toggleSidebar()" title="Toggle Navigation Sidebar">'
);

// C. Revert navigateTo line
normAppJs = normAppJs.replace(
  `function navigateTo(route, updateHash = true) {
    const appWrapper = $('.app-layout-wrapper');
    if (appWrapper) appWrapper.classList.remove('sidebar-hover-peek');`,
  'function navigateTo(route, updateHash = true) {'
);

// D. Revert toggleSidebar controller
const newSidebarController = `  let sidebarHoverTimer = null;

  function onHamburgerHoverEnter() {
    clearTimeout(sidebarHoverTimer);
    const wrapper = $('.app-layout-wrapper');
    if (wrapper && wrapper.classList.contains('sidebar-collapsed')) {
      wrapper.classList.add('sidebar-hover-peek');
    }
  }

  function onHamburgerHoverLeave() {
    clearTimeout(sidebarHoverTimer);
    sidebarHoverTimer = setTimeout(() => {
      const wrapper = $('.app-layout-wrapper');
      if (wrapper) wrapper.classList.remove('sidebar-hover-peek');
    }, 280);
  }

  function onSidebarHoverEnter() {
    clearTimeout(sidebarHoverTimer);
  }

  function onSidebarHoverLeave() {
    clearTimeout(sidebarHoverTimer);
    sidebarHoverTimer = setTimeout(() => {
      const wrapper = $('.app-layout-wrapper');
      if (wrapper) wrapper.classList.remove('sidebar-hover-peek');
    }, 250);
  }

  function toggleSidebar(forceState) {
    const wrapper = $('.app-layout-wrapper');
    if (!wrapper) return;
    if (forceState !== undefined) {
      if (forceState) wrapper.classList.remove('sidebar-collapsed');
      else wrapper.classList.add('sidebar-collapsed');
    } else {
      wrapper.classList.toggle('sidebar-collapsed');
    }
    wrapper.classList.remove('sidebar-hover-peek');
  }`;

const oldToggleSidebar = `  function toggleSidebar() {
    const wrapper = $('.app-layout-wrapper');
    if (wrapper) {
      wrapper.classList.toggle('sidebar-collapsed');
    }
  }`;

if (normAppJs.includes(normalize(newSidebarController))) {
  normAppJs = normAppJs.replace(normalize(newSidebarController), normalize(oldToggleSidebar));
  console.log('✅ Reverted toggleSidebar in app.js back to original standard toggle!');
} else {
  console.error('⚠️ Could not find newSidebarController in app.js');
}

// E. Remove from exports
normAppJs = normAppJs.replace(
  `toggleSidebar,
    onHamburgerHoverEnter,
    onHamburgerHoverLeave,
    onSidebarHoverEnter,
    onSidebarHoverLeave,`,
  'toggleSidebar,'
);

fs.writeFileSync(appJsPath, normAppJs.replace(/\n/g, '\r\n'), 'utf8');
console.log('✅ Reverted app.js successfully!');

// 3. Bump index.html to v=4.7
const indexPath = path.join(__dirname, '../frontend/index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');
indexHtml = indexHtml.replace(/v=4\.[0-9]+/g, 'v=4.7');
fs.writeFileSync(indexPath, indexHtml, 'utf8');
console.log('✅ Bumped index.html to v=4.7!');
