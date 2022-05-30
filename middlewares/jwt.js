const { sign, verify } = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

// eslint-disable-next-line arrow-body-style
const createToken = (id, expiresIn = 60 * 60) => {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject(new Error('datos invalidos'));
      return;
    }
    sign({ id }, jwtSecret, { expiresIn }, (err, token) => {
      if (err) {
        reject(new Error('token invalido'));
      } else {
        resolve(token);
      }
    });
  });
};

// eslint-disable-next-line arrow-body-style
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error('token invalido'));
      return;
    }
    verify(token, jwtSecret, {}, (err, decode) => {
      if (err) {
        reject(new Error('tu sesion ha expirado, volve a ingresar'));
      } else {
        resolve(decode);
      }
    });
  });
};

module.exports = { createToken, verifyToken };
