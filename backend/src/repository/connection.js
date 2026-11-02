import mysql from 'mysql2/promise';

export const con = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'root',
    database: process.env.MYSQL_DATABASE || 'tcc'
});

console.log(`Conectado ao banco de dados ${process.env.MYSQL_DATABASE || 'tcc'}!`);
