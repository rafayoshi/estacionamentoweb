httpGetAsync("veiculo", function (veiculos) {
    if (veiculos) {
        if (veiculos.length > 0) {
            veiculos.forEach(veiculo => {
                console.log(veiculo);
                novaLinha(veiculo.idVeiculo, veiculo.placa, veiculo.modelo, veiculo.cor)
            });
        }
    }
});

document.getElementById("btEnviar").addEventListener("click", tentarCadastro);

function tentarCadastro() {
    var modelo = document.getElementById("modelo").value;
    var placa = document.getElementById("placa").value;
    var cor = document.getElementById("cor").value;
    if (modelo && placa && cor) {
        if (regex.test(placa)) {
            httpPostAsync("veiculo", {
                modelo: modelo,
                placa: placa,
                cor: cor,
                estacionado: true
            }, function (retorno) {
                if (retorno) {
                    window.location.reload();
                }
            });
        } else {
            alert("Placa inválida");
        }
    }
}

const regex = new RegExp("[a-zA-Z]{3}[0-9]{4}");

function novaLinha(id, placa, modelo, cor) {
    var myHtmlContent = `<th scope="row">${id}</th>
    <td>${placa}</td>
    <td>${modelo}</td>
    <td>${cor}</td>
    <td><button type="button" class="btn btn-outline-warning" id="bt${id}">
                            <i class="fa fa-edit"></i>
                    </button></td>`
    var tableRef = document.getElementById('tabela').getElementsByTagName('tbody')[0];
    var newRow = tableRef.insertRow(tableRef.rows.length);
    newRow.innerHTML = myHtmlContent;
    document.getElementById(`bt${id}`).onclick = function () {
        saidaVeiculo(id);
    };
}

function saidaVeiculo(idVeiculo) {
    httpPutAsync("veiculo", {
        idVeiculo: idVeiculo,
        status: false
    }, function () {
        var n = document.location.href.indexOf("src");
        var url = document.location.href.substring(0, n) + "src/saida.html";
        window.open(url, "_self")
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
    const http = new XMLHttpRequest()
    http.open('PUT', url)
    http.setRequestHeader('Content-type', 'application/json')
    http.send(JSON.stringify(params))
    http.onload = function () {
        callback(JSON.parse(http.response));
    }
}