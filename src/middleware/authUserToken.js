const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const _ = require('lodash');

let key = fs.readFileSync('./src/models/user/jwtRS256.key.pub', 'utf8');

const authUserToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log(authHeader, 'me console');
  if (!authHeader) return res.status(401).send('Not authorized');

  const token = _.replace(authHeader, 'Bearer', '').trim();
  if (!token) return res.status(401).send('Not authorized');

  console.log('hola1', token);

  try {
    const decoded = jwt.verify(token, key, {
      algorithm: 'RS256',
    });
    req.user = decoded;
    console.log(decoded, 'hola soy decoded');
    next();
  } catch (err) {
    return res.status(401).send('Not authorized');
  }
};

module.exports = authUserToken;
