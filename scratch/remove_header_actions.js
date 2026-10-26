const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
let code = fs.readFileSync(appJsPath, 'utf8');

// 1. Remove the headerActions insertion block from renderClientDetailsProfileView
const targetSnippet = `    // Top Header Action Buttons (Expire, Login Into Client, Comments, Documents)
    const headerActions = $('#header-details-actions');
    if (headerActions) {
      headerActions.innerHTML = \`
        <button class="btn-header-action" onclick="window.smatApp.openExpireModal(\${client.id})">Expire</button>
        <button class="btn-header-action" onclick="window.smatApp.openLoginConfirmModal(\${client.id})" style="background:#1877F2; color:#FFFFFF; border-color:#1877F2;">
          🔐 Login Into Client
        </button>
        <button class="btn-header-action" onclick="window.smatApp.openCommentsModal(\${client.id})">Comments</button>
        <button class="btn-header-action" onclick="window.smatApp.openDocumentsModal(\${client.id})">Documents</button>
      \`;
    }`;

// Replace with empty or clean comment
if (code.includes(targetSnippet)) {
  code = code.replace(targetSnippet, `    // Top Header Action Buttons removed (maintained in profile card below)
    const headerActions = $('#header-details-actions');
    if (headerActions) {
      headerActions.style.display = 'none';
      headerActions.innerHTML = '';
    }`);
  console.log('Successfully removed header actions snippet from renderClientDetailsProfileView!');
} else {
  // Regex fallback in case of whitespace/CRLF differences
  code = code.replace(
    /\/\/\s*Top Header Action Buttons[\s\S]*?headerActions\.innerHTML\s*=\s*`[\s\S]*?`;\s*\}/g,
    `// Top Header Action Buttons removed (maintained in profile card below)
    const headerActions = $('#header-details-actions');
    if (headerActions) {
      headerActions.style.display = 'none';
      headerActions.innerHTML = '';
    }`
  );
  console.log('Applied regex replacement for header actions removal!');
}

// 2. In navigateTo, ensure headerActions is always hidden
code = code.replace(
  /if \(route === 'client-details-profile'\) \{\s*headerActions\.style\.display = 'flex';\s*\} else \{\s*headerActions\.style\.display = 'none';\s*headerActions\.innerHTML = '';\s*\}/g,
  `headerActions.style.display = 'none';\n        headerActions.innerHTML = '';`
);

fs.writeFileSync(appJsPath, code, 'utf8');
console.log('app.js updated successfully!');
