const fs = require('fs');

let content = fs.readFileSync('frontend/js/app.js', 'utf8');

// 1. Fix Plan table wrapper overflow
const oldPlanTableWrap = `<div style="border:1px solid #E5E7EB; border-radius:6px; overflow:hidden; margin-bottom:2rem;">`;
const newPlanTableWrap = `<div style="border:1px solid #E5E7EB; border-radius:6px; overflow:visible; position:relative; z-index:30; margin-bottom:2rem; background:#FFFFFF;">`;

// 2. Fix Addons table wrapper overflow
const oldAddonTableWrap = `<div style="border:1px solid #E5E7EB; border-radius:6px; overflow:hidden; margin-bottom:0.75rem;">`;
const newAddonTableWrap = `<div style="border:1px solid #E5E7EB; border-radius:6px; overflow:visible; position:relative; z-index:20; margin-bottom:0.75rem; background:#FFFFFF;">`;

// 3. Ensure popover has high z-index and doesn't get clipped
const oldPopoverStyle = `position:absolute; top:calc(100% + 8px); left:0; z-index:1050; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:6px; box-shadow:0 8px 24px rgba(0,0,0,0.12); padding:12px 14px; min-width:270px; text-align:left;`;
const newPopoverStyle = `position:absolute; top:calc(100% + 8px); left:0; z-index:9999; background:#FFFFFF; border:1px solid #D1D5DB; border-radius:6px; box-shadow:0 12px 28px rgba(0,0,0,0.15); padding:12px 14px; min-width:280px; text-align:left;`;

let normContent = content.replace(/\r\n/g, '\n');
const normOldPlanTable = oldPlanTableWrap.replace(/\r\n/g, '\n');
const normOldAddonTable = oldAddonTableWrap.replace(/\r\n/g, '\n');
const normOldPopoverStyle = oldPopoverStyle.replace(/\r\n/g, '\n');

let changes = 0;
if (normContent.includes(normOldPlanTable)) {
  normContent = normContent.replace(normOldPlanTable, newPlanTableWrap.replace(/\r\n/g, '\n'));
  changes++;
}

if (normContent.includes(normOldAddonTable)) {
  normContent = normContent.replace(normOldAddonTable, newAddonTableWrap.replace(/\r\n/g, '\n'));
  changes++;
}

if (normContent.includes(normOldPopoverStyle)) {
  normContent = normContent.split(normOldPopoverStyle).join(newPopoverStyle.replace(/\r\n/g, '\n'));
  changes++;
}

if (changes >= 2) {
  fs.writeFileSync('frontend/js/app.js', normContent.replace(/\n/g, '\r\n'), 'utf8');
  console.log(`Successfully fixed table overflow in ${changes} places so popover is 100% visible!`);
} else {
  console.log('Failed to match targets:', {
    planTable: normContent.includes(normOldPlanTable),
    addonTable: normContent.includes(normOldAddonTable)
  });
}
