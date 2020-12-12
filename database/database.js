//ARQUIVO DE CONEXAO COM O BANCO DE DADOS//
const sequelize = require('sequelize');

const connection = new sequelize('guiapress', 'fernando','Hertz94773195',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-3:00" //horario do brasil
});

module.exports = connection;