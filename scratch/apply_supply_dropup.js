const fs = require('fs');
const path = require('path');

// 1. Update frontend/css/styles.css
const cssPath = path.join(__dirname, '..', 'frontend', 'css', 'styles.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

const supplyPopoverCss = `
/* Zoho Place of Supply Popover - Positioned Above / Drop-up (paina vachela) */
.zoho-supply-popover {
  position: absolute;
  bottom: calc(100% + 4px) !important;
  top: auto !important;
  left: 0;
  width: 100%;
  z-index: 99999 !important;
  background: #FFFFFF;
  border: 1px solid #CBD5E1;
  border-radius: 6px;
  box-shadow: 0 -8px 25px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  overflow: hidden;
}
`;

if (!cssContent.includes('.zoho-supply-popover')) {
  cssContent += '\n' + supplyPopoverCss;
  fs.writeFileSync(cssPath, cssContent, 'utf8');
  console.log('Added .zoho-supply-popover above positioning to styles.css');
}

// 2. Update frontend/js/app.js
const appPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');
let norm = appContent.replace(/\r\n/g, '\n');

const oldPopoverTag = `<div id="zoho-supply-state-popover" class="zoho-supply-popover" style="display:none; position:absolute; top:calc(100% + 4px); left:0; width:100%; z-index:9999; background:#FFFFFF; border:1px solid #CBD5E1; border-radius:6px; box-shadow:0 10px 25px rgba(0,0,0,0.15); padding:8px 0; overflow:hidden;">`;

const newPopoverTag = `<div id="zoho-supply-state-popover" class="zoho-supply-popover" style="display:none; position:absolute; bottom:calc(100% + 4px); top:auto; left:0; width:100%; z-index:99999; background:#FFFFFF; border:1px solid #CBD5E1; border-radius:6px; box-shadow:0 -8px 25px rgba(0,0,0,0.15); padding:8px 0; overflow:hidden;">`;

if (norm.includes(oldPopoverTag)) {
  norm = norm.replace(oldPopoverTag, newPopoverTag);
  console.log('Updated zoho-supply-state-popover to open above (bottom: calc(100% + 4px)) in app.js');
} else {
  console.log('Warning: oldPopoverTag not found in app.js');
}

fs.writeFileSync(appPath, norm.replace(/\n/g, '\r\n'), 'utf8');
console.log('Place of Supply drop-up applied successfully!');
