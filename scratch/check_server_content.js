const http = require('http');

http.get('http://localhost:5000/js/app.js', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Has collapsed on card-client-profile:', data.includes('class="modular-card collapsed" id="card-client-profile"'));
    console.log('Has collapsed on card-plan-quotas:', data.includes('class="modular-card collapsed" id="card-plan-quotas"'));
    console.log('Has collapsed on card-billing-center:', data.includes('class="modular-card modular-card-full collapsed" id="card-billing-center"'));
    console.log('Has collapsed on client-configured-bots-card:', data.includes('class="modular-card modular-card-full collapsed" id="client-configured-bots-card"'));
  });
});
