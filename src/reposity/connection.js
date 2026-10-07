import mysql from 'mysql2/promise'

const con = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'tcc',
  password: 'root'
})

console.log('Conectou com MYSQL!');

export { con };
