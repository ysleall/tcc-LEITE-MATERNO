import mysql from 'mysql2/promise';

export const con = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'tcc'
});

console.log('Conectado ao banco de dados tcc!');
