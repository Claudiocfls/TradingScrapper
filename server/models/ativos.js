'use strict';
module.exports = (sequelize, DataTypes) => {
  var Ativos = sequelize.define('Ativos', {
    ticker: DataTypes.STRING,
    price: DataTypes.FLOAT,
    ultima_atualizacao: DataTypes.DATE
  }, {});
  Ativos.associate = function(models) {
    // associations can be defined here
  };
  return Ativos;
};