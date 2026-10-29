const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- TEST SUITE: BOT TOGGLE SWITCH & ACCORDION STAY OPEN ---');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'js', 'app.js'), 'utf8');
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'index.html'), 'utf8');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  [FAIL] ${name}:`, err.message);
    failed++;
  }
}

// 1. toggleClientBotActive updates DOM in-place without calling renderClientDetailsProfileView
test('toggleClientBotActive updates DOM in-place and stops propagation', () => {
  const toggleFnIdx = appJs.indexOf('function toggleClientBotActive(clientId, botId, event)');
  assert(toggleFnIdx !== -1, 'toggleClientBotActive signature must accept event');
  const toggleFnBody = appJs.substring(toggleFnIdx, appJs.indexOf('}', appJs.indexOf('showToast', toggleFnIdx)) + 50);
  assert(toggleFnBody.includes('event.stopPropagation()'), 'toggleClientBotActive must stop propagation');
  assert(toggleFnBody.includes("document.getElementById('bot-status-text-' + bot.id)"), 'Must update status text in-place');
  assert(!toggleFnBody.includes("renderClientDetailsProfileView($('#route-viewport'))"), 'Must NOT re-render page on toggle');
});

// 2. Bot status text has dynamic ID
test('Bot status text has dynamic ID bot-status-text-${bot.id}', () => {
  assert(appJs.includes('id="bot-status-text-${bot.id}"'), 'Must have id="bot-status-text-${bot.id}"');
});

// 3. Switch input passes event to toggleClientBotActive
test('Switch input passes event to toggleClientBotActive', () => {
  assert(appJs.includes("toggleClientBotActive(${client.id}, '${bot.id}', event)"), 'onchange must pass event');
});

// 4. client-configured-bots-card does not have hardcoded collapsed class
test('client-configured-bots-card preserves open state and is not hardcoded collapsed', () => {
  assert(!appJs.includes('<div class="modular-card modular-card-full collapsed" id="client-configured-bots-card">'),
    'Card must NOT have hardcoded collapsed class');
  assert(appJs.includes('id="client-configured-bots-card"'), 'client-configured-bots-card must exist');
  assert(appJs.includes('isBotsCardCollapsed'), 'isBotsCardCollapsed must be used to preserve state');
});

// 5. Cache version bumped to v=12.7
test('Cache version bumped to v=12.7 in index.html', () => {
  assert(indexHtml.includes('app.js?v=12.7'), 'app.js must be v=12.7 in index.html');
  assert(indexHtml.includes('styles.css?v=12.7'), 'styles.css must be v=12.7 in index.html');
});

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL BOT TOGGLE ACCORDION TESTS PASSED 100%!');
}
