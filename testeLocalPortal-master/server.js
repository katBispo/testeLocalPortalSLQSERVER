const express = require('express');
const odbc = require('odbc');
const cors = require('cors');
const { encryptConfig, decryptConfig } = require('./cryptoConfig'); // Importando as funções
const app = express();
const port = 3000;

// Verifica se os arquivos de configuração já existem
const fs = require('fs');
if (!fs.existsSync('encryptedConfig.txt') || !fs.existsSync('key.txt')) {
  console.log('Arquivos de configuração não encontrados. Gerando nova configuração criptografada...');
  encryptConfig(); // Executa apenas se os arquivos não existirem
} else {
  console.log('Configuração criptografada já foi gerada. Usando configuração existente.');
}

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
