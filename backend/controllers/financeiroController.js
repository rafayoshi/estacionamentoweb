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
    await connection.query(sqlQry, async function (error, results, fields) {
        if (error)
            await res.json(error);
        else
            await res.json(results);
        return res;
    });

}


module.exports = {    
    async insert(financeiro, res) {

        const sql = "INSERT INTO financeiro(valor, valorPago,  troco, idControle) VALUES ?";
        const values = [
            [financeiro.valor, financeiro.valorPago, financeiro.troco, financeiro.idControle],
        ];
        connection.query(sql, [values], function (error, results, fields) {
            if (error) {
                return console.log(error);
            } else
                res.json(results);

        });

    },

    get(res) {
        const sql = `SELECT * FROM financeiro`;
        execSQLQuery(sql, res)
    },

    getFinanceiro(idFinanceiro, res) {
        const sql = `SELECT * FROM financeiro where idFinanceiro=${idFinanceiro}`;
        execSQLQuery(sql, res)
    },

    getFinanceiroByIdControle(idControle, res) {
        const sql = `SELECT * FROM financeiro where idControle=${idControle}`;
        execSQLQuery(sql, res)
    },

    
}