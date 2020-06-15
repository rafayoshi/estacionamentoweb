document.getElementById("btEnvio").addEventListener("click", confirmaSaida);
document.getElementById("valorPago").addEventListener("blur", calculaTroco);
var valor;
var idControle;
var troco;

httpGetAsync("veiculo?saida=true", function (retorno) {
    if (retorno) {
        if (retorno.length > 0) {
            var veiculo = retorno[0];
            var valorField = document.getElementById("valor");
            var placa = document.getElementById("placa");
            valorField.innerHTML= `Valor: R$${veiculo.valor}`;
            valor = veiculo.valor;
            placa.innerHTML= `Placa: ${veiculo.placa}`
            idControle = veiculo.idControle;
        }
        else{
            var n = document.location.href.indexOf("src");
            var url = document.location.href.substring(0, n) + "src/entrada.html";
            window.open(url,"_self");
        }
    }
    else{
        var n = document.location.href.indexOf("src");
        var url = document.location.href.substring(0, n) + "src/entrada.html";
        window.open(url,"_self");
    }
});


function calculaTroco(){
    var valorPago = document.getElementById("valorPago").value;
    
    if(valorPago.length > 0){
        valorPago = valorPago.replace(",",".");
        pagamento = parseFloat(valorPago);
        
        if(pagamento){
            let valorTroco = pagamento - valor;
            troco = valorTroco.toFixed(2);
            var trocoField = document.getElementById("troco");
            trocoField.innerHTML = `R$${troco}`;
        }
    }
}

async function confirmaSaida(){
    var valorPago = document.getElementById("valorPago").value;
    valorPago = valorPago.replace(",",".");
    troco = troco.replace(",",".");
    
    httpPostAsync("financeiro", {valorPago: valorPago, troco: troco, idControle: idControle, valor: valor}, function(){
        var n = document.location.href.indexOf("src");
        var url = document.location.href.substring(0, n) + "src/entrada.html";
        window.open(url,"_self");
    })
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

async function httpPutAsync(endpoint, putParams, callback) {
    var url = "http://localhost:3000/" + endpoint
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("PUT", url, true); // true for asynchronous 
    xmlHttp.send(null);

    const params = putParams;
    const http = new XMLHttpRequest();
    http.open('PUT', url);
    http.setRequestHeader('Content-type', 'application/json');
    http.send(JSON.stringify(params));
    
    http.onload = function () {
        callback(JSON.parse(http.response));
    }
}