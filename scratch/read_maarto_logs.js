const fs = require('fs');
const readline = require('readline');

async function checkOtherMaarto() {
  const rl = readline.createInterface({
    input: fs.createReadStream('C:\\Users\\admin\\AppData\\Local\\Temp\\scp24404\\home\\vamsinole\\clientApisNodeServer\\logs\\2026-10-21.clientapisnodeserver.development.log'),
    crlfDelay: Infinity
  });

  let lineNum = 0;
  for await (const line of rl) {
    lineNum++;
    if (/digilocker|aadhaar|surepass|statement-response/i.test(line)) {
      console.log(`[${lineNum}] ${line.substring(0, 200)}`);
    }
  }
}

checkOtherMaarto().catch(console.error);
