'use strict';
module.exports = (sequelize, DataTypes) => {
  var Ativos = sequelize.define('Ativos', {
    ticker: DataTypes.STRING,
    price: DataTypes.FLOAT,
    source: DataTypes.STRING
  }, {});
  Ativos.associate = function(models) {
    // associations can be defined here
  };
  return Ativos;
};