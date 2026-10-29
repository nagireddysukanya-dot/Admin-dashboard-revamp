const fs = require('fs');
const path = require('path');

// 1. Update frontend/css/styles.css
const cssPath = path.join(__dirname, '../frontend/css/styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

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

// Normalize line endings for replacement
const normalize = (str) => str.replace(/\r\n/g, '\n');
const normalizedCss = normalize(css);
const normalizedTarget = normalize(targetHamburgerCss);
const normalizedReplacement = normalize(replacementHamburgerCss);

if (normalizedCss.includes(normalizedTarget)) {
  const updatedCss = normalizedCss.replace(normalizedTarget, normalizedReplacement);
  // Keep original CRLF
  fs.writeFileSync(cssPath, updatedCss.replace(/\n/g, '\r\n'), 'utf8');
  console.log('✅ Updated styles.css with hamburger hover & sidebar peek animation!');
} else {
  console.error('⚠️ Could not locate target hamburger css in styles.css');
}

// 2. Update frontend/js/app.js
const appJsPath = path.join(__dirname, '../frontend/js/app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');
let normAppJs = normalize(appJs);

// A. Sidebar aside tag hover listeners
normAppJs = normAppJs.replace(
  '<aside class="main-sidebar" id="app-sidebar">',
  '<aside class="main-sidebar" id="app-sidebar" onmouseenter="window.smatApp.onSidebarHoverEnter()" onmouseleave="window.smatApp.onSidebarHoverLeave()">'
);

// B. Hamburger button hover listeners & tooltip
normAppJs = normAppJs.replace(
  '<button class="hamburger-btn" onclick="window.smatApp.toggleSidebar()" title="Toggle Navigation Sidebar">',
  '<button class="hamburger-btn" id="btn-sidebar-toggle" onclick="window.smatApp.toggleSidebar()" onmouseenter="window.smatApp.onHamburgerHoverEnter()" onmouseleave="window.smatApp.onHamburgerHoverLeave()" title="Hover over lines to open sidebar, click to pin open">'
);

// C. In navigateTo, dismiss hover peek
normAppJs = normAppJs.replace(
  'function navigateTo(route, updateHash = true) {',
  `function navigateTo(route, updateHash = true) {
    const appWrapper = $('.app-layout-wrapper');
    if (appWrapper) appWrapper.classList.remove('sidebar-hover-peek');`
);

// D. Toggle sidebar and hover controller methods
const oldToggleSidebar = `  function toggleSidebar() {
    const wrapper = $('.app-layout-wrapper');
    if (wrapper) {
      wrapper.classList.toggle('sidebar-collapsed');
    }
  }`;

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

if (normAppJs.includes(oldToggleSidebar)) {
  normAppJs = normAppJs.replace(oldToggleSidebar, newSidebarController);
  console.log('✅ Replaced toggleSidebar with full hover peek controller in app.js!');
} else {
  console.error('⚠️ Could not find old toggleSidebar in app.js');
}

// E. Add to window.smatApp export
normAppJs = normAppJs.replace(
  'toggleSidebar,',
  `toggleSidebar,
    onHamburgerHoverEnter,
    onHamburgerHoverLeave,
    onSidebarHoverEnter,
    onSidebarHoverLeave,`
);

fs.writeFileSync(appJsPath, normAppJs.replace(/\n/g, '\r\n'), 'utf8');
console.log('✅ Updated app.js successfully!');

// 3. Bump index.html to v=4.6
const indexPath = path.join(__dirname, '../frontend/index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');
indexHtml = indexHtml.replace(/v=4\.[0-9]+/g, 'v=4.6');
fs.writeFileSync(indexPath, indexHtml, 'utf8');
console.log('✅ Bumped index.html to v=4.6!');
