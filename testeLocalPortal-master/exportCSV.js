function exportTableToCSV(filename) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");
    
    // Adiciona os cabeçalhos da tabela ao CSV
    var headers = [];
    var headerCols = rows[0].querySelectorAll("th");
    for (var i = 0; i < headerCols.length; i++) {
        headers.push(headerCols[i].innerText);
    }
    csv.push(headers.join(","));
    
    // Adiciona os dados da tabela ao CSV
    for (var i = 1; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td");
        for (var j = 0; j < cols.length; j++) {
            row.push(cols[j].innerText);
        }
        csv.push(row.join(","));
    }

    // Cria um link para download
    var csvFile = new Blob([csv.join("\n")], { type: "text/csv" });
    var downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}
