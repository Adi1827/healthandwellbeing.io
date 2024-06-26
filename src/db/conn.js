import mysql from "mysql2";

const conn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Aditya2308',
    database: 'healthwellbeing'
});

export default conn;