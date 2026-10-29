const fs = require('fs');
const code = fs.readFileSync('frontend/js/app.js', 'utf8');

const hasPurpleRobot = code.includes('smatbot-purple-robot-badge');
const hasEmailAddress = code.includes('Email Address');
const hasNoClientsCount = !code.includes('220+ client chatbots');
const hasNoValuePills = !code.includes('220+ AI Chatbots Live');

console.log('Checks:');
console.log('1. Official Purple Robot Logo Badge:', hasPurpleRobot);
console.log('2. Email Address Input:', hasEmailAddress);
console.log('3. 220+ Client Marketing Blurb Removed:', hasNoClientsCount);
console.log('4. Value Pills Removed:', hasNoValuePills);

if (hasPurpleRobot && hasEmailAddress && hasNoClientsCount && hasNoValuePills) {
  console.log('ALL VERIFICATIONS PASSED!');
} else {
  console.error('VERIFICATION FAILED!');
  process.exit(1);
}
