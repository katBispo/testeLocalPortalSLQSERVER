const express = require('express');
const odbc = require('odbc');
const cors = require('cors');
const app = express();
const port = 3000;

// Configuração de conexão ODBC
const config = {
  connectionString: 'Driver={ODBC Driver 18 for SQL Server};Server=tcp:devdbccp.database.windows.net,1433;Database=CCPTFCJ;Uid=berglimma@berglimma@devdbccp;Pwd=Sup0rt&@L0j@s;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;',
};

// Use o middleware CORS para permitir requisições do frontend
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
    res.json(result); // Retorna os dados em formato JSON
  } catch (err) {
    res.status(500).send(err.message);
  } finally {
    await connection.close(); // Fecha a conexão
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
