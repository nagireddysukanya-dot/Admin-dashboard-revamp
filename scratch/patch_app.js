const fs = require('fs');
let code = fs.readFileSync('frontend/js/app.js', 'utf8');

// Normalize line endings to \n
code = code.replace(/\r\n/g, '\n');

// 1. Fix line 544
code = code.replace(
  '      isAuthenticated = t  // =========================================================================\n  // 0. ADMIN LOGIN PAGE',
  '      isAuthenticated = true;\n      loadAppShell();\n    } else {\n      isAuthenticated = false;\n      renderLoginPage();\n    }\n  }\n\n  // =========================================================================\n  // 0. ADMIN LOGIN PAGE'
);

// 2. Fix leftover around line 836
code = code.replace(/\n\s*\}ateway[\s\S]*?`\;\n\s*\}/, '\n  }');

fs.writeFileSync('frontend/js/app.js', code, 'utf8');
console.log('App.js patched successfully!');
