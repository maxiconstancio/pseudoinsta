const {
  body,
  validationResult,
} = require('express-validator');

const { request, response } = require('express');

const userValidator = {
  signup: [
    body('firstName').notEmpty().withMessage('You must complete the first name field').bail()
      .isAlpha()
      .withMessage('The first name must contain only letters, not numbers')
      .bail()
      .isLength({
        min: 2,
      })
      .withMessage('The first name must have more than 2 characters'),

    body('lastName').notEmpty().withMessage('You must complete the last name field').bail()
      .isAlpha()
      .withMessage('The last name must contain only letters, not numbers')
      .bail()
      .isLength({
        min: 2,
      })
      .withMessage('The last name must have more than 2 characters'),

    body('email').notEmpty().withMessage('You must complete the email field').bail()
      .isEmail()
      .withMessage('The email must be valid'),

    body('password').notEmpty().withMessage('You must complete the password field').bail()
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,}$/)
      .withMessage('The password must have more than 8 characters, a number, an uppercase letter and a lowercase letter, and/or it can have some special character'),
  ],
  login: [
    body('email').notEmpty().withMessage('You must complete the email field').bail()
      .isEmail()
      .withMessage('The email must be valid'),

    body('password').notEmpty().withMessage('You must complete the password field').bail(),
  ],
  edit: [
    body('firstName')
      .isAlpha()
      .withMessage('The first name must contain only letters, not numbers')
      .bail()
      .isLength({
        min: 2,
      })
      .withMessage('The first name must have more than 2 characters'),

    body('lastName')
      .isAlpha()
      .withMessage('The last name must contain only letters, not numbers')
      .bail()
      .isLength({
        min: 2,
      })
      .withMessage('The last name must have more than 2 characters'),

    body('email')
      .isEmail()
      .withMessage('The email must be valid'),

  ],

  authorizations: {
    token: (req = request, res = response, next) => {
      const token = req.headers || req.cookies;

      if (!token.token) {
        return res.status(403).json({ error: 'No credentials sent!' });
      }
      next();
    },
  },
};

module.exports = userValidator;
