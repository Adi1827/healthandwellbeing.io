const Sequelize = require('sequelize')
const dotenv = require('dotenv');
dotenv.config();


const db = new Sequelize("healthwellbeing",process.env.DATABASE_USERNAME,process.env.DATABASE_PASSWORD,{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = db;