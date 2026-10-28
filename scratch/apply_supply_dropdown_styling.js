const fs = require('fs');
const path = require('path');

// 1. Update frontend/css/styles.css
const cssPath = path.join(__dirname, '..', 'frontend', 'css', 'styles.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

const supplyCss = `
/* Zoho Place of Supply Dropdown Styles (Exact Match to User Reference Screenshot) */
.zoho-supply-option-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 12px;
  font-size: 0.85rem;
  color: #374151;
  cursor: pointer;
  margin: 1px 4px;
  border-radius: 4px;
  transition: all 0.12s ease;
}

.zoho-supply-option-item:hover {
  background: #3B82F6 !important;
  color: #FFFFFF !important;
}

.zoho-supply-option-item:hover span {
  color: #FFFFFF !important;
}

.zoho-supply-option-item.selected {
  background: #EEF2F6;
  color: #1E293B;
  font-weight: 500;
}

.zoho-supply-option-item.selected .zoho-supply-check {
  display: inline-block;
  color: #2563EB;
  font-weight: 700;
  font-size: 0.85rem;
}
`;

if (!cssContent.includes('.zoho-supply-option-item')) {
  cssContent += '\n' + supplyCss;
  fs.writeFileSync(cssPath, cssContent, 'utf8');
  console.log('Added Place of Supply item styles to styles.css');
}

// 2. Update frontend/js/app.js
const appPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');
let norm = appContent.replace(/\r\n/g, '\n');

// 2a. Update initial render in renderZohoSubscriptionView
const oldInitialTpl = `                  <!-- Scrollable Options List -->
                  <div id="zoho-supply-options-list" style="max-height:220px; overflow-y:auto; padding:4px 0;">
                    \${ALL_SUPPLY_STATES.map(s => {
                      const isSel = s.code === zohoSelectedSupplyState;
                      return \`
                        <div class="zoho-supply-option-item" onclick="event.stopPropagation(); window.smatApp.selectSupplyState('\${s.code}')" style="padding:7px 12px; font-size:0.85rem; cursor:pointer; margin:1px 4px; border-radius:4px; \${isSel ? 'background:#3B82F6; color:#FFFFFF; font-weight:500;' : 'color:#374151;'}" onmouseover="if (!this.classList.contains('selected')) this.style.background='#F1F5F9'" onmouseout="if (!this.classList.contains('selected')) this.style.background='transparent'">
                          [\${s.code}] - \${s.name}
                        </div>
                      \`;
                    }).join('')}
                  </div>`;

const newInitialTpl = `                  <!-- Scrollable Options List -->
                  <div id="zoho-supply-options-list" style="max-height:220px; overflow-y:auto; padding:4px 0;">
                    \${ALL_SUPPLY_STATES.map(s => {
                      const isSel = s.code === zohoSelectedSupplyState;
                      return \`
                        <div class="zoho-supply-option-item \${isSel ? 'selected' : ''}" onclick="event.stopPropagation(); window.smatApp.selectSupplyState('\${s.code}')">
                          <span>[\${s.code}] - \${s.name}</span>
                          \${isSel ? '<span class="zoho-supply-check">✓</span>' : ''}
                        </div>
                      \`;
                    }).join('')}
                  </div>`;

if (norm.includes(oldInitialTpl)) {
  norm = norm.replace(oldInitialTpl, newInitialTpl);
  console.log('Updated initial supply list template in app.js');
}

// 2b. Update renderSupplyStateOptions function
const oldRenderFn = `  function renderSupplyStateOptions(list) {
    const container = document.getElementById('zoho-supply-options-list');
    if (!container) return;
    const states = list || ALL_SUPPLY_STATES;
    container.innerHTML = states.map(s => {
      const isSel = s.code === zohoSelectedSupplyState;
      return \`
        <div class="zoho-supply-option-item \${isSel ? 'selected' : ''}" onclick="event.stopPropagation(); window.smatApp.selectSupplyState('\${s.code}')" style="padding:7px 12px; font-size:0.85rem; cursor:pointer; margin:1px 4px; border-radius:4px; \${isSel ? 'background:#3B82F6; color:#FFFFFF; font-weight:500;' : 'color:#374151;'}" onmouseover="if (!this.classList.contains('selected')) this.style.background='#F1F5F9'" onmouseout="if (!this.classList.contains('selected')) this.style.background='transparent'">
          [\${s.code}] - \${s.name}
        </div>
      \`;
    }).join('');
  }`;

const newRenderFn = `  function renderSupplyStateOptions(list) {
    const container = document.getElementById('zoho-supply-options-list');
    if (!container) return;
    const states = list || ALL_SUPPLY_STATES;
    container.innerHTML = states.map(s => {
      const isSel = s.code === zohoSelectedSupplyState;
      return \`
        <div class="zoho-supply-option-item \${isSel ? 'selected' : ''}" onclick="event.stopPropagation(); window.smatApp.selectSupplyState('\${s.code}')">
          <span>[\${s.code}] - \${s.name}</span>
          \${isSel ? '<span class="zoho-supply-check">✓</span>' : ''}
        </div>
      \`;
    }).join('');
  }`;

if (norm.includes(oldRenderFn)) {
  norm = norm.replace(oldRenderFn, newRenderFn);
  console.log('Updated renderSupplyStateOptions function in app.js');
}

fs.writeFileSync(appPath, norm.replace(/\n/g, '\r\n'), 'utf8');
console.log('Place of Supply styling updated successfully!');
