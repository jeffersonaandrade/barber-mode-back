// @ts-nocheck
const bcrypt = require('bcrypt');

async function generateHashes() {
  const passwords = ['admin123', 'gerente123', 'barbeiro123'];
  
  for (const password of passwords) {
    const hash = await bcrypt.hash(password, 12);
    console.log(`${password}: ${hash}`);
  }
}

generateHashes(); 