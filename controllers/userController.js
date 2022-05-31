const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../models');
const { createToken, verifyToken } = require('../middlewares/jwt');
const sendMail = require('../middlewares/sendMail');
const template = require('../utils/emailTemplate');
const awsImageUploader = require('../controllers/awsActions');
const userController = {
  userList: (req, res) => {
    db.User.findAll({
      where: {roleId: 2}
    })
      .then((result) => {
        const response = {
          status: 200,
          message: 'OK',
          data: result,
        };
        res.json(response);
      })
      .catch((error) => {
        res.json(error);
      });
  },
  userEdit: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        errors: errors.array(),
      });
    } else {
      const {
        firstName, lastName,
      } = req.body;

      const user = db.User.findByPk(req.params.id);
      if (user !== '') {
        db.User.update(
          {
            firstName,
            lastName,
            photo: req.user.image,
          },
          {
            where: {
              id: req.params.id,
            },
          },
        )
          .then(() => {
            const response = {
              status: 200,
              message: 'User updated successfully!',
            };
            res.json(response);
          })
          .catch((error) => {
            res.json(error);
          });
      } else {
        const response = {
          status: 404,
          message: 'User not found!',
        };
        res.json(response);
      }
    }
  },
  signup: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    db.User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((possibleUser) => {
      if (possibleUser) {
        res.status(409).json({ msg: 'User already exists' });
      } else {
        
        db.User.create({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 10),
        }).then(async (user) => {
          const token = await createToken(user.id);
          res.header('Authorization', `Bearer ${token}`);
          await sendMail(user.email, template.subject, template.html).then(() => {
            const response = {
              message: 'Account created successfully! Check your email spam box!',
              data: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
              },
            };
            return res.json(response);
          }).catch((err) => res.status(500).json({
            msg: `Please contact the administrator, Error: ${err.message}`,
          }));
        })
          .catch((err) => res.status(500).json(err));
      }
    })
      .catch((err) => res.status(500).json(err));
  },
  userDelete: async (req, res) => {
    const userId = Number(req.params.id);
    try {
      const user = await db.User.findOne({
        where: {
          id: userId,
        },
      });

      if (user) {
        console.log('userToDel', user);
        await user.destroy();

        res.json({
          msg: 'The user has been soft-deleted',
        });
      } else {
        res.status(404).json({
          msg: `No users with id: ${userId}, were found !`,
        });
      }
    } catch (error) {
      return res.status(500).json({
        msg: 'Pelase contact the administrator',
      });
    }
  },
  // End User CRUD
  login: async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const user = await db.User.findOne({
        where: {
          email: req.body.email,
        },
      });
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          console.log('User Authenticated');
          const token = await createToken(user.id);
          res.status(200).json({
            user,
            token,
          });
        } else {
          res.status(401).json({
            msg: 'The password is incorrect',
          });
        }
      } else {
        res.status(404).json({
          msg: 'User not found',
        });
      }
    } catch (error) {
      res.status(500).json({
        msg: 'Please contact the administrator',
      });
    }
  },
  getData: async (req, res) => {
    const { id } = req.user;
    try {
      if (id) {
        const user = await db.User.findOne({
          where: {
            id,
          },
        });

        const {
           firstName, lastName, email,  roleId,
        } = user;

        if (user) {
          res.status(200).json({
            msg: {
              id,
              firstName,
              lastName,
              email,
              roleId,
            },
          });
        } else {
          res.status(404).json({
            msg: 'User and credentials does not match',
          });
        }
      }
    } catch (error) {
      return res.status(500).json({
        msg: 'Please contact the administrator',
      });
    }
  },
};

module.exports = userController;
