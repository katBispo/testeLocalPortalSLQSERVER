const mysql = require('mysql2/promise');

const config = {
  host: 'database.cd2mma0w2q5w.us-east-2.rds.amazonaws.com',
  user: 'kateriny',
  password: 'Sucodeuva123!',
  database: 'database', // Nome do banco de dados
  port: 3306,
  connectTimeout: 30000 // Aumentar o tempo de conexão para 30 segundos
};

async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection(config);
    console.log('Conectado ao banco de dados');
    return connection;
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  }
}

module.exports = { connectToDatabase };
