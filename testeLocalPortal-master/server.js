const express = require('express');
const odbc = require('odbc');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const app = express();
const port = 3000;

// Função para criptografar a string de conexão
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

// Função para descriptografar a string de conexão
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

// Criptografa a configuração-- executar Aapenas uma vez dps eu removo
encryptConfig();

// Descriptografa a configuração
const config = decryptConfig();

// Middleware CORS para permitir requisições do frontend
app.use(cors());

async function connectToDatabase() {
  try {
    const connection = await odbc.connect(config.connectionString);
    console.log('Conectado ao banco de dados');
    return connection;
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  }
}

app.get('/dados', async (req, res) => {
  const connection = await connectToDatabase();
  if (!connection) return res.status(500).send('Erro ao conectar ao banco de dados');

  try {
    const result = await connection.query('SELECT * FROM CCP_SERVICE.HistoricoRestricao');
    res.json(result);
  } catch (err) {
    res.status(500).send(err.message);
  } finally {
    await connection.close();
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
