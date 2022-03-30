const pool = require('../utils/pool');

module.exports = class Secret {
  id;
  title;
  content;
  user_id;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.content = row.content;
    this.user_id = row.user_id;
  }

  static async create({ user_id, title, content }) {
    const { rows } = await pool.query(
      'INSERT INTO secrets (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
      [user_id, title, content]
    );
    return new Secret(rows[0]);
  }
};
