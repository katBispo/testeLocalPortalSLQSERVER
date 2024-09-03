document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:3000/dados')
    .then(response => {
      console.log('Status da resposta:', response.status); // Log do status da resposta
      return response.text(); // Obtém o texto da resposta para depuração
    })
    .then(text => {
      console.log('Texto da resposta:', text); // Log do texto da resposta
      try {
        const data = JSON.parse(text); // Tenta converter o texto para JSON
        console.log('Dados:', data); // Log dos dados
        const tabela = document.getElementById('dados-tabela').getElementsByTagName('tbody')[0];
        data.forEach(item => {
          const row = tabela.insertRow();
          row.insertCell(0).textContent = item.RestricaoDescricao;
          row.insertCell(1).textContent = item.SetorPatio;
          row.insertCell(2).textContent = item.PrevisaoRetirada;
          row.insertCell(3).textContent = item.StatusRestricao;
          row.insertCell(4).textContent = item.Responsavel;
          row.insertCell(5).textContent = new Date(item.DataCadastro).toLocaleDateString();
          row.insertCell(6).textContent = new Date(item.PrevisaoRetirada).toLocaleDateString();
          row.insertCell(7).textContent = new Date(item.UltimaMudanca).toLocaleDateString();
          row.insertCell(8).textContent = item.Observacao;


        // Calcular a diferença de dias
        const dataCadastro = new Date(item.dataCadastro);
        const previsaoRetirada = new Date(item.previsaoRetirada);
        const diffTime = Math.abs(dataCadastro - previsaoRetirada);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        row.insertCell(8).textContent = diffDays; // Adicionar a diferença de dias na nova coluna
        });

      } catch (err) {
        console.error('Erro ao parsear JSON:', err);
      }
    })
    .catch(error => console.error('Erro ao buscar dados:', error));
});
