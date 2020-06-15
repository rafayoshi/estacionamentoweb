const controleController = require('./controleController');
const constante = require('../constante');
const mysql = require('mysql');
const connectionConfig = {
    host: constante.host,
    port: constante.port,
    user: constante.user,
    password: constante.password,
    database: constante.database
};
const connection = mysql.createConnection(connectionConfig);
connection.connect(function (err) {
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

function twoDigits(d) {
    if (0 <= d && d < 10) return "0" + d.toString();
    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
    return d.toString();
}

Date.prototype.toMysqlFormat = function () {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};


module.exports = {
    async buscaPlaca(placa, veiculo) {
        const sql = `SELECT * FROM veiculo where placa = '${placa}'`;
        await connection.query(sql, function (error, results, fields) {
            if (error) {
                return console.log(error);
            }
            var veiculo = results;
            if (veiculo.length > 0) {
                var date = new Date().toMysqlFormat();
                controleController.insert({
                    entrada: date,
                    idVeiculo: veiculo[0].idVeiculo
                });
            }
        });
    },

    async insert(veiculo, res) {
        const sql = "INSERT INTO veiculo(placa, modelo, cor,estacionado) VALUES ?";
        const values = [
            [veiculo.placa, veiculo.modelo, veiculo.cor, veiculo.estacionado],
        ];
        return await connection.query(sql, [values], function (error, results, fields) {
            if (error) {
                return console.log(error);
            } else
                res.json(results);
            return results;
        });
    },

    async getSaida(res) {
        const sql = `SELECT * FROM veiculo where estacionado = false`;
        await execSQLQuery(sql, res)
    },

    get(res) {
        const sql = `SELECT * FROM veiculo where estacionado = true`;
        execSQLQuery(sql, res)
    },

    async update(status, idVeiculo, res) {
        const sql = `UPDATE veiculo set estacionado = ${status} where idVeiculo=${idVeiculo}`;
        await connection.query(sql, function (error, results, fields) {
            if (error) {
                return console.log(error);
            }
            controleController.updateControle(idVeiculo, res);
        });

    },

    getVeiculo(idVeiculo, res) {
        const sql = `SELECT * FROM veiculo where idVeiculo=${idVeiculo}`;
        execSQLQuery(sql, res);
    },

    // getVeiculoByIdCliente(idCliente, res) {
    //     const sql = `SELECT * FROM veiculo where idCliente=${idCliente}`;
    //     execSQLQuery(sql, res)
    // },

    // deleteVeiculo(idVeiculo, res) {
    //     const sql = `DELETE FROM veiculo where idVeiculo=${idVeiculo}`;
    //     execSQLQuery(sql, res)
    // },


}