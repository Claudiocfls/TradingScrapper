const Ativo= require('../../models').ativos;

module.exports = {
  create: (req,res) => {
    return Ativo
      .create({
        ticker: req.body.ticker,
        price: req.params.price,
        ultima_atualizacao: null
      })
      .then(todoItem => res.status(201).send(todoItem))
      .catch(error => res.status(400).send(error));
  }
};