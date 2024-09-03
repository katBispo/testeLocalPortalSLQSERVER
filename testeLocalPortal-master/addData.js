const { connectToDatabase } = require('./db');

async function addData() {
  const connection = await connectToDatabase();
  if (!connection) return;

  try {
    const [result] = await connection.execute("INSERT INTO InfoCCP (restricaoDescricao, setorPatio, statusRestricao, responsavel, dataCadastro, previsaoRetirada, ultimaMudanca) VALUES ('Manutenção via permanente', 'P09', 'Ativo', 'Kateriny Bispo', '2024-08-15', '2024-08-22', '2024-08-16')");
    console.log('Dados inseridos com sucesso:', result);
  } catch (err) {
    console.error('Erro ao inserir dados:', err);
  } finally {
    connection.end();
  }
}

addData();
