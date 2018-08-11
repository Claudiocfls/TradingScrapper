const puppeteer = require('puppeteer');
var models = require('./server/models/index.js');

var express = require('express'),
    app = express();

const PORT = process.env.PORT || 5000

var scrape = require('./scrappers/scrapper_general.js');

var texto = "";
var data = [];

var data_fii = [];
var data_acoes = [];

var acoes_is_running = false;
var fii_is_running = false;

var scrapper = function(ticker){
    var urls = [ticker];
    var total = urls.length;
    for (var i = urls.length - 1; i >= 0; i--) {
        scrape(urls[i]).then(
            (value) => {
                data.push(value[0]);
                total = total - 1;
                if(total == 0){
                    // res.json(data);
                    texto = "acabou";
                }
            }
        ).catch(
        function(error){
            console.log(error);
        });
    }
};


// Escolhendo no metodo .get() o caminho para fazer a requisição
// Poderia ser somente a barra, mas para facilitar a compreensão vamos personalizar
// app.get('/raspagem', function(req, res) {
//     scrapper();
//     texto = "realizando";
//     res.send("está realizando a busca");    
// })

// app.get('/recebe', function(req, res) {
//     // scrapper();
//     // texto = "realizando";
//     if(data.length != 0){
//         res.json(data);
//     } else {
//         res.json([{'status': 300}]);    
//     }
// })

// app.get('/apaga', function(req, res) {
//     // scrapper();
//     // texto = "realizando";
//     data = [];
//     res.redirect('/');
// })

const scrapper_acoes = require('./scrappers/scrapper_acoes.js');
var updateFII = function(){
    fii_is_running = true;
    scrapper_fii().then(
            (value) => {
                // res.json(value);
                data_fii = value;
                fii_is_running = false;
            }
    ).catch(
    function(error){
        console.log(error);
    });
};

var updateACOES = function(){
    acoes_is_running = true;
    scrapper_acoes().then(
            (value) => {
                // res.json(value);
                data_acoes = value;
                acoes_is_running = false;

            }
    ).catch(
    function(error){
        console.log(error);
    });           
}


var updateRegister = function(tickerparam, newprice){
  models.Ativos.find({ where: { ticker: tickerparam } })
  .on('success', function (project) {
    // Check if record exists in db
    if (project) {
      project.updateAttributes({
        price: newprice
      })
      .success(function () {})
    }
  })
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

var thereIsRegister = function(ticker){
    return models.Ativos.count({ where: { ticker: ticker } })
      .then(count => {
        if (count == 0) {
          return false;
        }
        return true;
    });
};


app.get('/infomoney/acoes', function(req,res){
    if (data_acoes.length != 0){
        res.json(data_acoes);
    } else {
        if(!acoes_is_running){
            updateACOES();
        }
        res.json([{status: "300", message: "obtendo dados"}]);
    }
})


const scrapper_fii = require('./scrappers/scrapper_fii.js');

app.get('/infomoney/fii', function(req,res){
    if (data_fii.length != 0){
        res.json(data_fii);
    } else {
        if (!fii_is_running){
            updateFII();
        }
        res.json([{status: "300", message: "obtendo dados"}]);
    }
})

app.get('/verifica', function(req, res) {
    // var urls = ['ITSA4','BOVA11','ABCP11','MGLU3','PETR3','SNSL3'];
    var entrada = {body:{ticker:'ITSA4'}};
    // ativos.create(req,res);
    if (!thereIsRegister('ITSA4')){
        createRegister('ITSA4',11.00,'scrapper1');
    }else{
        updateRegister('ITSA4',12.00);
    }
    res.send("abriu");
    
})

app.get('/verifica2', function(req, res) {
    // var urls = ['ITSA4','BOVA11','ABCP11','MGLU3','PETR3','SNSL3'];
    // var entrada = {body:{ticker:'ITSA4'}};
    // // ativos.create(req,res);
    // models.Ativos.create({
    //     sticker: 'ITSA4',
    //     price: 12.01
    //   }).then(function(user) {
    //     res.send("abriu");
    //   });
      models.Ativos.findAll({}).then(function(todos) {
        res.json(todos);
    });
    // res.send("abriu");
})

// var teste = function() {
//     setTimeout(function(){
//          console.log('gets printed only once after 3 seconds')
//          //logic
//     },8000);
// };

app.get('/envia', function(req, res) {
    // var urls = ['ITSA4','BOVA11','ABCP11','MGLU3','PETR3','SNSL3'];
    // var urls = [req.query.ticker];
    // // console.log(req.query.ticker);
    // var total = urls.length;
    // var data = [];
    // for (var i = urls.length - 1; i >= 0; i--) {
    //     scrape(urls[i]).then(
    //         (value) => {
    //             data.push(value[0]);
    //             total = total - 1;
    //             if(total == 0){
    //                 res.json(data);
    //             }
    //         }
    //     );
    // }

    scrapper(req.query.ticker);

    // teste();
    res.send("espera a resposta em /recebe");
    
})

app.get('/', function(req, res) {
    updateACOES();
    updateFII();
    // teste();
    res.send("<h2> Info disponível :</h2> <p> /acoes </p><p> /fii </p><p></p>");
    
})


// Execução do serviço
app.listen(PORT)
console.log('Executando raspagem de dados na porta 5000...');
exports = module.exports = app;