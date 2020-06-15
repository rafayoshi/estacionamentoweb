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
connection.connect(function (err) {
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

function twoDigits(d) {
    if (0 <= d && d < 10) return "0" + d.toString();
    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
    return d.toString();
}

Date.prototype.toMysqlFormat = function () {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};

Date.createFromMysql = function(mysql_string)
{ 
   var t, result = null;

   if( typeof mysql_string === 'string' )
   {
      t = mysql_string.split(/[- :]/);

      //when t[3], t[4] and t[5] are missing they defaults to zero
      result = new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);          
   }

   return result;   
}

function calculaValor(entrada, saida){
    // dataEntrada = Date.createFromMysql(entrada);
    // dataSaida = Date.createFromMysql(saida);
    var tempo = Math.abs(saida - entrada);
    var tempoMinutos = ((tempo / 1000) / 60);
    var fracoes = Math.ceil(tempoMinutos / 15);
    return fracoes * constante.valorFracao;
}

module.exports = {
    async insert(controle, res) {
        var sql;
        if (controle.entrada) {
            sql = "INSERT INTO controle(entrada, idVeiculo) VALUES ?";
        }
        const values = [
            [controle.entrada, controle.idVeiculo],
        ];
        connection.query(sql, [values], function (error, results, fields) {
            if (error) {
                return console.log(error);
            } else
                return results;

        });
    },

    get(res) {
        const sql = `SELECT * FROM controle`;
        execSQLQuery(sql, res)
    },

    async getUltimo(res){
        var sql = "select c.*, v.placa from controle c inner join veiculo v on c.idVeiculo = v.idVeiculo left join financeiro f on c.idControle = f.idControle where f.idControle is null and c.saida is not null order by c.saida limit 1;";
        connection.query(sql, function (error, results, fields) {
            if (error) {
                return console.log(error);
            } else{
                if(results.length > 0)
                results[0].valor = calculaValor(results[0].entrada, results[0].saida);
                res.json(results);
            }
        }); 
    },

    getControle(idControle, res) {
        const sql = `SELECT * FROM controle where idControle=${idControle}`;
        execSQLQuery(sql, res)
    },

    getControleByIdVeic(idVeiculo, res) {
        const sql = `SELECT * FROM controle where idVeiculo=${idVeiculo}`;
        execSQLQuery(sql, res)
    },

    updateControle(idVeiculo, res) {
        var data = new Date().toMysqlFormat();
        const sql = "update controle set saida = '" + data.toString() + "' where idVeiculo = " + idVeiculo;
        connection.query(sql, function (error, results, fields) {
            if (error) {
                return console.log(error);
            }
            else{
                return res.json(results);
            }
        }); 
    },

}