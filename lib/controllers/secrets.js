const { Router } = require('express');
const authenticate = require('../middleware/authenticate');

module.exports = Router().get('/', authenticate, async (req, res, next) => {
  try {
    const secrets = [
      {
        id: '1',
        title: 'Meow',
        content: 'Huwwo!',
        user_id: '1',
      },
    ];
    res.send(secrets);
  } catch (error) {
    next(error);
  }
});
