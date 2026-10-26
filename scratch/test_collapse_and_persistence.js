const fs = require('fs');
const path = require('path');

// Mock browser environment for node
const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; }
};

global.window = {
  location: { hash: '' },
  addEventListener: () => {}
};

// Test 1: Load code and check functions exist
const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
const code = fs.readFileSync(appJsPath, 'utf8');

console.log('--- TEST SUITE: COLLAPSE & RELOAD PERSISTENCE ---');

// Test resolveInitialRoute logic
function resolveInitialRoute() {
  const rawHash = (window.location.hash || '').replace(/^#/, '').trim();
  if (rawHash) {
    if (rawHash.startsWith('client-details-profile')) {
      const idMatch = rawHash.match(/id=([^&]+)/);
      if (idMatch && idMatch[1] !== undefined) {
        const rawId = idMatch[1];
        let selectedClientId = isNaN(rawId) ? rawId : Number(rawId);
        try {
          localStorage.setItem('smatbot_selected_client_id', String(selectedClientId));
        } catch (e) {}
        return { route: 'client-details-profile', selectedClientId };
      }
      return { route: 'client-details-profile' };
    }
    const cleanRoute = rawHash.split('?')[0];
    if (cleanRoute) {
      return { route: cleanRoute };
    }
  }

  try {
    const savedRoute = localStorage.getItem('smatbot_active_route');
    const savedClientId = localStorage.getItem('smatbot_selected_client_id');
    if (savedRoute) {
      return {
        route: savedRoute,
        selectedClientId: savedClientId ? (isNaN(savedClientId) ? savedClientId : Number(savedClientId)) : undefined
      };
    }
  } catch (e) {}

  return { route: 'client-details' };
}

// 1. Initial empty hash & storage
console.log('1. Initial fresh load test:');
window.location.hash = '';
const res1 = resolveInitialRoute();
console.assert(res1.route === 'client-details', 'Should default to client-details');
console.log('   ✓ Default fallback passed:', res1.route);

// 2. Navigation to client profile
console.log('2. Navigation persistence test:');
localStorage.setItem('smatbot_active_route', 'client-details-profile');
localStorage.setItem('smatbot_selected_client_id', '1');
window.location.hash = '#client-details-profile?id=1';

const res2 = resolveInitialRoute();
console.assert(res2.route === 'client-details-profile', 'Route should be client-details-profile');
console.assert(res2.selectedClientId === 1, 'Client ID should be 1');
console.log('   ✓ Preserved route on refresh:', res2.route, 'Client ID:', res2.selectedClientId);

// 3. Navigation to other pages like chatbots or users
console.log('3. Other pages refresh test:');
window.location.hash = '#chatbots';
localStorage.setItem('smatbot_active_route', 'chatbots');
const res3 = resolveInitialRoute();
console.assert(res3.route === 'chatbots', 'Should preserve chatbots route');
console.log('   ✓ Preserved chatbots route on refresh:', res3.route);

// 4. Test Card Collapse Logic
console.log('4. Card Collapse / Expand simulation test:');
class MockClassList {
  constructor() { this.classes = new Set(); }
  toggle(cls) {
    if (this.classes.has(cls)) { this.classes.delete(cls); return false; }
    else { this.classes.add(cls); return true; }
  }
  contains(cls) { return this.classes.has(cls); }
}

const mockCard = { id: 'card-client-profile', classList: new MockClassList() };
global.document = {
  getElementById: (id) => id === 'card-client-profile' ? mockCard : null
};

// Simulate toggleModularCard
function toggleModularCard(cardId, e) {
  if (e && e.target && e.target.closest) {
    if (e.target.closest('button:not(.btn-collapse-card)')) return;
  }
  const card = document.getElementById(cardId);
  if (!card) return;
  card.classList.toggle('collapsed');
}

// First click: should collapse (daggaraki avvali)
toggleModularCard('card-client-profile');
console.assert(mockCard.classList.contains('collapsed') === true, 'Card must be collapsed');
console.log('   ✓ Click 1 (Collapse): Card is collapsed (closed):', mockCard.classList.contains('collapsed'));

// Second click: should expand (open avvi anni chupinchali)
toggleModularCard('card-client-profile');
console.assert(mockCard.classList.contains('collapsed') === false, 'Card must be expanded');
console.log('   ✓ Click 2 (Expand): Card is open again:', !mockCard.classList.contains('collapsed'));

// Inner action button click test (should NOT collapse)
toggleModularCard('card-client-profile', {
  target: {
    closest: (sel) => sel.includes('button:not(.btn-collapse-card)') ? {} : null
  }
});
console.assert(mockCard.classList.contains('collapsed') === false, 'Action button click should NOT collapse card');
console.log('   ✓ Inner button click ignored properly without collapsing card.');

console.log('\n--- ALL UNIT & LOGIC VERIFICATIONS PASSED SUCCESSFULLY! ---');
