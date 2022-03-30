const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Secret = require('../models/Secret');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
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
  })
  .post('/', authenticate, async (req, res, next) => {
    try {
      const { user_id } = req.user;

      const { title, content } = req.body;
      const secret = await Secret.create({ user_id, title, content });
      res.send(secret);
    } catch (error) {
      next(error);
    }
  });
