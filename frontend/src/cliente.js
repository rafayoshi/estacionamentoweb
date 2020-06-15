document.getElementById("btEnviar").addEventListener("click", tentarCadastro);
httpGetAsync("cliente", function (clientes) {
    if (clientes) {
        if (clientes.length > 0) {
            clientes.forEach(cliente => {
                console.log(cliente);
                novaLinha(cliente.idCliente, cliente.nome, cliente.telefone, cliente.email);
            });
        }
    }
});


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

async function httpDeleteAsync(endpoint, id, callback) {
    var url = "http://localhost:3000/" + endpoint + "/" + "?idCliente=" + id;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("DELETE", url, true); // true for asynchronous 
    xmlHttp.send(null);
    const http = new XMLHttpRequest()
    http.open('DELETE', url)
    http.setRequestHeader('Content-type', 'application/json')

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

function tentarCadastro() {
    var nome = document.getElementById("nome").value;
    var telefone = document.getElementById("telefone").value;
    var email = document.getElementById("email").value;
    if (nome && telefone && email) {
        httpPostAsync("cliente", {
            nome: nome,
            telefone: telefone,
            email: email
        }, function (retorno) {
            if (retorno) {
                window.location.reload();
            }
        });
    }
}

function removerCliente(id) {
    console.log(id);
    httpDeleteAsync("cliente", id, function (retorno) {
        if (retorno) {
            window.location.reload();
        }
    })
}

function novaLinha(id, nome, telefone, email) {
    var myHtmlContent = `<th scope="row">${id}</th>
    <td>${nome}</td>
    <td>${telefone}</td>
    <td>${email}</td>
    <td><button type="button" class="btn btn-outline-warning" id="bt${id}">
                            <i class="fa fa-trash"></i>
                    </button></td>`
    var tableRef = document.getElementById('tabela').getElementsByTagName('tbody')[0];
    var newRow = tableRef.insertRow(tableRef.rows.length);
    newRow.innerHTML = myHtmlContent;
    document.getElementById(`bt${id}`).onclick = function () {
        removerCliente(id);
    };
}
