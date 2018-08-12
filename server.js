const puppeteer = require('puppeteer');
var express = require('express');

const PORT = process.env.PORT || 5000


var app = express();

var models = require('./server/models/index.js');
var scrape = require('./scrappers/scrapper_general.js');
const scrapper_acoes = require('./scrappers/scrapper_acoes.js');
const scrapper_fii = require('./scrappers/scrapper_fii.js');

var texto = "";

var data_fii = [];
var data_acoes = [];

var acoes_is_running = false;
var fii_is_running = false;

var evaluateNewTicker = function(ticker){
    var data = [];
    var urls = [ticker];
    var total = urls.length;
    for (var i = urls.length - 1; i >= 0; i--) {
        scrape(urls[i]).then(
            (value) => {
                data.push(value[0]);
                if (data[0].status == 200){
                    console.log("adicionando do trading view");
                    updateOrCreateDBOne(data[0].ticker, "scrapper3", data[0].price);
                }
            }
        ).catch(
        function(error){
            console.log(error);
        });
    }
};


var ToFloat = function(value){
    var valor = value.replace(',','.');
    return parseFloat(valor);
};

var updateOrCreateDB = function(data, source){
    for (var i = data.length - 1; i >= 0; i--) {
        var nome = data[i].ticker;
        var valor = ToFloat(data[i].price);
        updateOrCreateDBOne(nome, source, valor);
    }
}

var updateFII = function(){
    if (fii_is_running == false){
        fii_is_running = true;
        scrapper_fii().then(
                (value) => {
                    // res.json(value);
                    data_fii = value;
                    fii_is_running = false;
                    updateOrCreateDB(data_fii, "scrapper2");
                }
        ).catch(
        function(error){
            console.log(error);
        });
    }
};

var updateACOES = function(){
    if (acoes_is_running == false) {
        acoes_is_running = true;
        scrapper_acoes().then(
                (value) => {
                    // res.json(value);
                    data_acoes = value;
                    acoes_is_running = false;
                    updateOrCreateDB(data_acoes, "scrapper1");
                }
        ).catch(
        function(error){
            console.log(error);
        });           
    }
}

var updateRegister = function(tickerparam, newprice){
  models.Ativos.update(
    { price: newprice },
    { where: { ticker: tickerparam } }
  )
  .then(result =>
    // handleResult(result)
    console.log(result)
  )
  .catch(err =>
    // handleError(err)
    console.log(result)
  );
};

var createRegister = function(tickerparam, priceparam, sourceparam){
    models.Ativos.create({
        ticker: tickerparam,
        price: priceparam,
        source: sourceparam
      }).then(function(user) {
        // res.send("abriu");
      });
};

var updateOrCreateDBOne = function(tickerparam, sourceparam, priceparam){
    models.Ativos.count({ where: { ticker: tickerparam } })
      .then(count => {
        if (count != 0) {
            updateRegister(tickerparam, priceparam);
        } else {
            createRegister(tickerparam, priceparam, sourceparam);
        }
    });
};


app.get('/all', function(req, res) {
      models.Ativos.findAll({}).then(function(todos) {
        res.json(todos);
    });
})

app.get('/prices', function(req, res) {

    var tickerparam = (req.query.ticker).toUpperCase();;
    // scrapper(req.query.ticker);
    models.Ativos.find({where: {ticker: tickerparam}}).then(function(todos) {
        if(todos == null){
            evaluateNewTicker(tickerparam);
            res.json([{status: 404, response: {answer: "Tentaremos obter esse ativo para novas consultas"}}]);
        }else{
            res.json([{status: 200, response: todos}]);
        }
    });
})

app.get('/', function(req, res) {
    updateACOES();
    updateFII();
    // teste();
    res.send("<h2> Info disponível :</h2> <p> /all </p><p> /prices/?ticker= </p><p></p>");
    
})

// Execução do serviço
app.listen(PORT)
console.log('Executando raspagem de dados na porta 5000...');
exports = module.exports = app;