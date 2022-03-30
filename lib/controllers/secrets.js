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
        },
      ];
      res.send(secrets);
    } catch (error) {
      next(error);
    }
  })
  .post('/', authenticate, async (req, res, next) => {
    const secret = await Secret.insert(req.body);
    res.send(secret);
  });
