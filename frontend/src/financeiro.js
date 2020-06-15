httpGetAsync("financeiro", function (financas) {
    if (financas) {
        if (financas.length > 0) {
            var valorTotal = 0;
            var valorPagoTotal = 0;
            var trocoTotal = 0;
            financas.forEach(financa => {
                valorTotal += financa.valor;
                valorPagoTotal += financa.valorPago;
                trocoTotal += financa.troco;
                novaLinha(financa.idFinanceiro, financa.valor, financa.valorPago, financa.troco)
            });
            novaLinha("TOTAIS", "R$" + valorTotal, "R$" + valorPagoTotal, "R$" + trocoTotal);
        }
    }
});

function novaLinha(id, valor, valorPago, troco) {
    var myHtmlContent = `<th scope="row">${id}</th>
    <td>${valor}</td>
    <td>${valorPago}</td>
    <td>${troco}</td>`
    var tableRef = document.getElementById('tabela').getElementsByTagName('tbody')[0];
    var newRow = tableRef.insertRow(tableRef.rows.length);
    newRow.innerHTML = myHtmlContent;

}


async function httpGetAsync(endpoint, callback) {
    var url = "http://localhost:3000/" + endpoint
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(JSON.parse(xmlHttp.responseText));
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

async function httpPostAsync(endpoint, postParams, callback) {
    var url = "http://localhost:3000/" + endpoint
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("POST", url, true); // true for asynchronous 
    xmlHttp.send(null);
    const params = postParams;
    const http = new XMLHttpRequest()
    http.open('POST', url)
    http.setRequestHeader('Content-type', 'application/json')
    
    http.send(JSON.stringify(params))
    http.onload = function () {
        callback(JSON.parse(http.response));
    }
}
