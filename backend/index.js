const express = require('express');
const router = express.Router();
const app = express();
var cors = require('cors');
const bodyParser = require('body-parser');
const port = 3000; //porta padrão
const clienteController = require('./controllers/clienteController');
const veiculoController = require('./controllers/veiculoController');
const controleController = require('./controllers/controleController');
const financeiroController = require('./controllers/financeiroController');
const userController = require('./controllers/userController');


app.use(cors({
    origin: '*'
}));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//teste
router.get('/', (req, res) => res.json({
    message: 'Funcionando!'
}));

// get clientes
router.get('/cliente', (req, res) => {
    var clientes = clienteController.get(res);
});

// cadastro cliente
router.post('/cliente', (req, res) => {
    const nome = req.body.nome;
    const telefone = req.body.telefone;
    const email = req.body.email;
    clienteController.insert({
        nome,
        telefone,
        email
    }, res);
});


//tentar login
router.post('/login', (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    console.log(req.body);
    userController.login({
        user,
        pass
    }, res);
});

//busca todos os veiculos ou busca veiculo que esta saindo
router.get('/veiculo', (req, res) => {
    if (req.query.saida) {
        controleController.getUltimo(res);
    } else {
        veiculoController.get(res);
    }
});


// enviar veiculo e cria novo controle
router.post('/veiculo', async (req, res) => {
    const modelo = req.body.modelo;
    const cor = req.body.cor;
    const placa = req.body.placa;
    const estacionado = req.body.estacionado;
    if (placa) {
        await veiculoController.insert({
            modelo,
            cor,
            placa,
            estacionado
        }, res).then(() => {
            veiculoController.buscaPlaca(placa);
        });

    }
});

// atualiza veiculo para saida
router.put('/veiculo', (req, res) => {
    const idVeiculo = req.body.idVeiculo;
    const estacionado = req.body.status;
    if (idVeiculo) {
        veiculoController.update(estacionado, idVeiculo, res);
    }
});

//busca controles ou busca controle de veiculo específico
router.get('/controle', (req, res) => {
    if (req.query.idVeiculo) {
        controleController.getVeiculo(idVeiculo, res)
    } else {
        controleController.get(res);
    }

});

// entrada ou saida de veiculo
router.post('/controle', (req, res) => {
    const entrada = req.body.entrada;
    const saida = req.body.saida;
    const idVeiculo = req.body.idVeiculo;
    controleController.insert({
        entrada,
        saida,
        idVeiculo
    });
});

router.delete('/cliente', (req, res) => {
    const idCliente = req.query.idCliente;
    if (idCliente)
        clienteController.delete(idCliente, res);
});

router.post('/financeiro', (req, res) => {
    const idControle = req.body.idControle;
    const valor = req.body.valor;
    const valorPago = req.body.valorPago;
    const troco = req.body.troco;
    if(idControle && valor && valorPago && troco)
        financeiroController.insert({idControle, valor, valorPago, troco}, res);
});

router.get('/financeiro', (req, res) => {
    financeiroController.get(res);
});

router.get('/cliente/:id?', (req, res) => {
    let filter = '';
    clienteController.getCliente(parseInt(req.params.id), res);
})

router.get('/veiculo/:id?', (req, res) => {
    veiculoController.getVeiculo(parseInt(req.params.id), res);
})

router.get('/controle/:id?', (req, res) => {
    controleController.getControle(parseInt(req.params.id), res);
})

router.get('/controle/:veiculo?', (req, res) => {
    controleController.getControleByIdVeic(parseInt(req.params.id), res);
})

router.get('/veiculo/:cliente?', (req, res) => {
    let filter = '';
    if (req.params.id) filter = ' WHERE idCliente=' + parseInt(req.params.id);
    veiculoController.getVeiculoByIdCliente(parseInt(req.params.id), res);
})

router.get('/financeiro/:controle?', (req, res) => {
    financeiroController.getFinanceiroByIdControle(parseInt(req.params.id), res);
})

router.get('/financeiro/:id?', (req, res) => {
    financeiroController.getFinanceiro(res);
})

app.use('/', router);

app.listen(port);