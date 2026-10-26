const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
let code = fs.readFileSync(appJsPath, 'utf8');

// 1. Add resolveInitialRoute right before function loadAppShell()
const resolveRouteFn = `  // =========================================================================
  // ROUTE & CLIENT PERSISTENCE ENGINE (Preserves Page on F5 / Reload)
  // =========================================================================
  function resolveInitialRoute() {
    // 1. Try URL Hash (e.g. #client-details-profile?id=0 or #overview or #users)
    const rawHash = (window.location.hash || '').replace(/^#/, '').trim();
    if (rawHash) {
      if (rawHash.startsWith('client-details-profile')) {
        const idMatch = rawHash.match(/id=([^&]+)/);
        if (idMatch && idMatch[1] !== undefined) {
          const rawId = idMatch[1];
          selectedClientId = isNaN(rawId) ? rawId : Number(rawId);
          try {
            localStorage.setItem('smatbot_selected_client_id', String(selectedClientId));
          } catch (e) {}
        }
        return 'client-details-profile';
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
  // 1. APP SHELL LAYOUT`;

code = code.replace(/\/\/\s*={10,}\r?\n\s*\/\/\s*1\.\s*APP SHELL LAYOUT/g, resolveRouteFn);

// 2. In init(), attach hashchange listener
const initHashListener = `    // Global Browser Back / Forward and Hash Navigation Listener
    window.addEventListener('hashchange', () => {
      if (!isAuthenticated) return;
      const targetRoute = resolveInitialRoute();
      if (targetRoute !== currentRoute || targetRoute === 'client-details-profile') {
        navigateTo(targetRoute, false);
      }
    });

    // Check saved session`;

code = code.replace(/\/\/\s*Check saved session/g, initHashListener);

// 3. In logout(), clear persistent route & client id
const logoutClean = `  function logout() {
    localStorage.removeItem('smatbot_admin_logged_in');
    localStorage.removeItem('smatbot_admin_user');
    localStorage.removeItem('smatbot_active_route');
    localStorage.removeItem('smatbot_selected_client_id');
    window.location.hash = '';
    isAuthenticated = false;
    impersonatingClient = null;
    showToast('Logged out successfully.');
    renderLoginPage();
  }`;

code = code.replace(/function logout\(\) \{[\s\S]*?renderLoginPage\(\);\s*\}/g, logoutClean);

// 4. In loadAppShell(), invoke resolveInitialRoute()
code = code.replace(/navigateTo\(currentRoute\);/g, `const initialRoute = resolveInitialRoute();\n    navigateTo(initialRoute, true);`);

// 5. In navigateTo(), support updateHash and localStorage persistence
const oldNavigateSignature = /function navigateTo\(route\) \{/g;
const newNavigateCode = `function navigateTo(route, updateHash = true) {
    if (route === 'plans' || route === 'addons') {
      route = 'client-details';
    }
    currentRoute = route;

    // Persist current route & selected client to stay on exact page on F5 / Reload
    try {
      localStorage.setItem('smatbot_active_route', route);
      if (route === 'client-details-profile') {
        localStorage.setItem('smatbot_selected_client_id', String(selectedClientId));
      }
    } catch (e) {}

    // Synchronize URL Hash without page reset
    if (updateHash) {
      if (route === 'client-details-profile') {
        const targetHash = '#client-details-profile?id=' + selectedClientId;
        if (window.location.hash !== targetHash) {
          window.location.hash = targetHash;
        }
      } else {
        const targetHash = '#' + route;
        if (window.location.hash !== targetHash) {
          window.location.hash = targetHash;
        }
      }
    }`;

code = code.replace(oldNavigateSignature, newNavigateCode);

// 6. In openClientDetailsPage(clientId), persist clientId and navigate
const oldOpenDetails = /function openClientDetailsPage\(clientId\) \{[\s\S]*?navigateTo\('client-details-profile'\);\s*\}/g;
const newOpenDetails = `function openClientDetailsPage(clientId) {
    selectedClientId = clientId;
    try {
      localStorage.setItem('smatbot_selected_client_id', String(clientId));
    } catch (e) {}
    navigateTo('client-details-profile', true);
  }`;
code = code.replace(oldOpenDetails, newOpenDetails);

// 7. Update toggleModularCard implementation
const oldToggleCard = /function toggleModularCard\(cardId, e\) \{[\s\S]*?card\.classList\.toggle\('collapsed'\);\s*\}/g;
const newToggleCard = `function toggleModularCard(cardId, e) {
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
  window.toggleModularCard = toggleModularCard;`;
code = code.replace(oldToggleCard, newToggleCard);

// 8. In renderClientDetailsProfileView, match client with String comparison
code = code.replace(
  /const client = clientsData\.find\(c => c\.id === selectedClientId\) \|\| clientsData\[0\];/g,
  `const client = clientsData.find(c => c.id === selectedClientId || String(c.id) === String(selectedClientId)) || clientsData[0];`
);

// 9. In renderClientDetailsProfileView, make sure all 6 card headers have onclick toggleModularCard
code = code.replace(
  /<div class="modular-card" id="card-client-profile">\s*<div class="modular-card-header">/g,
  `<div class="modular-card" id="card-client-profile">\n            <div class="modular-card-header" onclick="window.smatApp.toggleModularCard('card-client-profile', event)">`
);

code = code.replace(
  /<div class="modular-card" id="card-plan-quotas">\s*<div class="modular-card-header">/g,
  `<div class="modular-card" id="card-plan-quotas">\n            <div class="modular-card-header" onclick="window.smatApp.toggleModularCard('card-plan-quotas', event)">`
);

code = code.replace(
  /<div class="modular-card modular-card-full" id="card-billing-center">\s*<div class="modular-card-header">/g,
  `<div class="modular-card modular-card-full" id="card-billing-center">\n          <div class="modular-card-header" onclick="window.smatApp.toggleModularCard('card-billing-center', event)">`
);

code = code.replace(
  /<div class="modular-card modular-card-full" id="client-configured-bots-card">\s*<div class="modular-card-header">/g,
  `<div class="modular-card modular-card-full" id="client-configured-bots-card">\n          <div class="modular-card-header" onclick="window.smatApp.toggleModularCard('client-configured-bots-card', event)">`
);

code = code.replace(
  /<div class="modular-card" id="card-support-agents">\s*<div class="modular-card-header">/g,
  `<div class="modular-card" id="card-support-agents">\n            <div class="modular-card-header" onclick="window.smatApp.toggleModularCard('card-support-agents', event)">`
);

code = code.replace(
  /<div class="modular-card" id="card-system-logs">\s*<div class="modular-card-header">/g,
  `<div class="modular-card" id="card-system-logs">\n            <div class="modular-card-header" onclick="window.smatApp.toggleModularCard('card-system-logs', event)">`
);

// 10. Update window.smatApp export at bottom to include all missing functions
const exportStartStr = 'window.smatApp = {';
const exportIndex = code.lastIndexOf(exportStartStr);
if (exportIndex !== -1) {
  const exportEndIndex = code.indexOf('};', exportIndex);
  if (exportEndIndex !== -1) {
    let exportBlock = code.slice(exportIndex, exportEndIndex);
    const neededExports = [
      'toggleModularCard',
      'toggleClientDetailsFilters',
      'openCreateBotForClient',
      'handleCreateBotSubmit',
      'toggleClientBotActive',
      'resolveInitialRoute',
      'showToast'
    ];
    for (const exp of neededExports) {
      if (!exportBlock.includes(exp)) {
        exportBlock += `,\n    ${exp}`;
      }
    }
    // Clean trailing or missing commas
    exportBlock = exportBlock.replace(/,\s*,/g, ',');
    code = code.slice(0, exportIndex) + exportBlock + code.slice(exportEndIndex);
  }
}

fs.writeFileSync(appJsPath, code, 'utf8');
console.log('Successfully updated app.js with collapse toggle and reload persistence!');
