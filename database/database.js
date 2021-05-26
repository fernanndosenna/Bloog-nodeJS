//ARQUIVO DE CONEXAO COM O BANCO DE DADOS//
const sequelize = require('sequelize');

const connection = new sequelize('guiapress', 'fernando','password',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-3:00" //horario do brasil
});

module.exports = connection;
