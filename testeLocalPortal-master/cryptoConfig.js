// cryptoConfig.js
const crypto = require('crypto');
const fs = require('fs');

function encryptConfig() {
  const algorithm = 'aes-256-cbc';
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  const config = {
    connectionString: 'Driver={ODBC Driver 18 for SQL Server};Server=tcp:devdbccp.database.windows.net,1433;Database=CCPTFCJ;Uid=berglimma@berglimma@devdbccp;Pwd=Sup0rt&@L0j@s;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;',
  };

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(JSON.stringify(config), 'utf8', 'hex');
  encrypted += cipher.final('hex');

  fs.writeFileSync('encryptedConfig.txt', `${iv.toString('hex')}:${encrypted}`);
  fs.writeFileSync('key.txt', key.toString('hex'));

  console.log('Configuração criptografada e salva com sucesso.');
}

function decryptConfig() {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(fs.readFileSync('key.txt', 'utf8'), 'hex');
  const [ivHex, encrypted] = fs.readFileSync('encryptedConfig.txt', 'utf8').split(':');
  const iv = Buffer.from(ivHex, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted);
}

// Exporta as funções
module.exports = {
  encryptConfig,
  decryptConfig,
};
