const pool = require('../utils/pool');

module.exports = class Secret {
  id;
  title;
  content;
  created_at;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.content = row.content;
    this.created_at = row.created_at;
  }

  static async insert({ title, content }) {
    const { rows } = await pool.query(
      'INSERT INTO secrets (title, content) VALUES ($1, $2) RETURNING *;',
      [title, content]
    );
    return new Secret(rows[0]);
  }
};
