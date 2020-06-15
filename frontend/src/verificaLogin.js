var logado = sessionStorage.getItem('logado');
if (logado) {
    var formLogin = document.getElementById("formLogin");
    formLogin.style.display = "none";
    var dropdown = document.getElementById("dropdown");
} else {
    var dropdown = document.getElementById("dropdown");
    dropdown.style.display = "none";

    if (!document.location.href.includes("index")) {
        var n = document.location.href.indexOf("src");
        var url = document.location.href.substring(0, n) + "src/index.html";
        window.open(url,"_self")
    }
}


document.getElementById("btLogin").addEventListener("click", tentarLogin);
document.getElementById("logoff").addEventListener("click", function(){
    sessionStorage.removeItem('logado');
    window.location.reload();
});

async function tentarLogin() {
    var user = document.getElementById("user").value;
    var pass = document.getElementById("pass").value;
    await httpPostAsync("login", {user: user, pass: pass}, resp=>{
        if(resp[0].idUsuario && resp[0].idUsuario !== 0){
            sessionStorage.setItem('logado', true);
            window.location.reload();
        }
        else{
            sessionStorage.removeItem('logado');
        }
    });    
}

async function httpGetAsync(endpoint, callback)
{
    var url = "http://localhost:3000/" + endpoint
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

async function httpPostAsync(endpoint, postParams, callback)
{
    var url = "http://localhost:3000/" + endpoint
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
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
    http.onload = function() {
        callback(JSON.parse(http.response));
    }
}