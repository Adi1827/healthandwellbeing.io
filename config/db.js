const Sequelize = require('sequelize')
const dotenv = require('dotenv');
dotenv.config();


const db = new Sequelize(process.env.DATABASE,process.env.DATABASE_USERNAME,process.env.DATABASE_PASSWORD,{
    host: 'bym6eqpmdcitl9e5wntd-mysql.services.clever-cloud.com',
    port: 3306,
    dialect: 'mysql'
})

module.exports = db;