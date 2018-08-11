const Ativo = require('../../models').ativos;

module.exports = {
  read(req, res) {
    return Todo
      .findById(1, {
        include: [{
          model: Ativo,
          as: 'Ativo',
        }],
      })
      .then(todo => {
        if (!todo) {
          return res.status(404).send({
            message: 'Todo Not Found',
          });
        }
        return res.status(200).send(todo);
      })
      .catch(error => res.status(400).send(error));
  }
};