const db = require('./connection');

class UsuarioRepository {
  
  async buscarTodos() {
    const [linhas] = await db.query('SELECT * FROM usuarios');
    return linhas;
  }

  
  async buscarPorId(id) {
    const [linhas] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    return linhas[0];
  }

  
  async criar(dados) {
    const { nome, email } = dados;
    const [resultado] = await db.query(
      'INSERT INTO usuarios (nome, email) VALUES (?, ?)',
      [nome, email]
    );
    return { id: resultado.insertId, ...dados };
  }
}

module.exports = new UsuarioRepository();