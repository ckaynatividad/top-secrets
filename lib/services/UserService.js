const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = class UserService {
  static async create({ username, password }) {
    const passwordHash = bcrypt.hashSync(
      password,
      Number(process.env.SALT_ROUNDS)
    );
    return User.insert({
      username,
      passwordHash,
    });
  }

  static async signIn({ username, password }) {
    const user = await User.findByUsername(username);
    if (!user) throw new Error('invalid username');

    const passwordMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!passwordMatch) throw new Error('invalid password');

    return user;
  }
};
