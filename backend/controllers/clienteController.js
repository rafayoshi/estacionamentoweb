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
    async insert(cliente, res) {
        const sql = "INSERT INTO cliente(nome, telefone, email) VALUES ?";
        const values = [
            [cliente.nome, cliente.telefone, cliente.email],
        ];
        connection.query(sql, [values], function (error, results, fields) {
            if (error) {
                return console.log(error);
            } else{
                res.json(results); 
            }
        });
    },

    delete(id, res) {
        const sql = `DELETE FROM cliente where idCliente=${id}`;
        execSQLQuery(sql, res)
    },

    get(res) {
        const sql = `SELECT * FROM cliente`;
        execSQLQuery(sql, res)
    },

    getCliente(idCliente, res) {
        const sql = `SELECT * FROM cliente where idCliente=${idCliente}`;
        execSQLQuery(sql, res)
    },
}