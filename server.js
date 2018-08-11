var express = require('express'),
    app = express();

const PORT = process.env.PORT || 5000

var scrape = require('./scrape.js');

// Escolhendo no metodo .get() o caminho para fazer a requisição
// Poderia ser somente a barra, mas para facilitar a compreensão vamos personalizar
app.get('/raspagem', function(req, res) {
    // var urls = ['ITSA4','BOVA11','ABCP11','MGLU3','PETR3','SNSL3'];
    var urls = ['ITSA4'];
    var total = urls.length;
    var data = [];
    for (var i = urls.length - 1; i >= 0; i--) {
        scrape(urls[i]).then(
            (value) => {
                data.push(value[0]);
                total = total - 1;
                if(total == 0){
                    res.json(data);
                }
            }
        );
    }
    
})

app.get('/verifica', function(req, res) {
    // var urls = ['ITSA4','BOVA11','ABCP11','MGLU3','PETR3','SNSL3'];
    res.send("abriu");
    
})

// var teste = function() {
//     setTimeout(function(){
//          console.log('gets printed only once after 3 seconds')
//          //logic
//     },8000);
// };

app.get('/', function(req, res) {
    // var urls = ['ITSA4','BOVA11','ABCP11','MGLU3','PETR3','SNSL3'];
    var urls = [req.query.ticker];
    // console.log(req.query.ticker);
    var total = urls.length;
    var data = [];
    for (var i = urls.length - 1; i >= 0; i--) {
        scrape(urls[i]).then(
            (value) => {
                data.push(value[0]);
                total = total - 1;
                if(total == 0){
                    res.json(data);
                }
            }
        );
    }

    // teste();
    // res.send("acabou aqui");
    
})





// Execução do serviço
app.listen(PORT)
console.log('Executando raspagem de dados na porta 5000...');
exports = module.exports = app;