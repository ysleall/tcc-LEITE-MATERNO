import mysql from 'mysql2/promise';

export const con = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'root',
    database: process.env.MYSQL_DATABASE || 'TCC8',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log(`Pool de conexões MySQL configurado para o banco: ${process.env.MYSQL_DATABASE || 'tcc'}`);

con.getConnection()
    .then((connection) => {
        console.log('MySQL conectado com sucesso!');
        connection.release();
    })
    .catch((erro) => {
        console.error('ERRO NA CONEXÃO MYSQL:', erro.message);
    });