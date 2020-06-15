# Estacionamento Web

Instruções para execução

Restaurar o banco de dados do arquivo estacionamentoweb.sql no MySQL Workbench. 
Se houver problemas de permissão após isso execute no MySQL Workbench: `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root'; flush privileges;`

É necessário instalar a versão LTS do [NodeJS](https://nodejs.org/en/download/).
Após a instalação do NodeJS, abra a pasta back-end no visual studio code e execute o comando `npm install` no terminal.
Após a instalação dos módulos, execute: `node index.js`. NÃO FECHE A JANELA OU PARE A EXECUÇÃO DO NODE, SENÃO NÃO VAI FUNCIONAR.

Para rodar o front-end:
No Visual Studio Code, acesse a pasta frontend através do terminal, depois rode o comando `npm install --global http-server` e espere a instalação. Após isso, digite `http-server ./ -p 8080` no terminal e acesse a [URL](http://localhost:8080/src/index.html) no navegador enquanto o servidor estiver rodando.

As credenciais para login são Usuário: admin; Senha: 1.
