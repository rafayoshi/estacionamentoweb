const mysql = require('mysql');
const constante = require('../constante');
const connectionConfig = {
    host: constante.host,
    port: constante.port,
    user: constante.user,
    password: constante.password,
    database: constante.database
};
const connection = mysql.createConnection(connectionConfig);
connection.connect(function(err) {
    if (err) throw err

});

async function execSQLQuery(sqlQry, res) {
    connection.query(sqlQry, function (error, results, fields) {
        if (error)
            res.json(error);
        else
            res.json(results);
    });
}

module.exports = {
        login(dados, res) {
        const sql = `SELECT * FROM usuarioApp where usuario='${dados.user}' and senha = '${dados.pass}'`;
        execSQLQuery(sql, res)
    },
}