const db = require('../models');
const { verifyToken } = require('./jwt');

// roleId 1 = admin; roleId 2 = user

const authAdmin = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    const token = auth?.replace('Bearer ', '');
    const decodeToken = await verifyToken(token);
  
    const user = await db.User.findOne({
      where: {
        id: decodeToken.id,
      },
    });
    
    if (user.roleId !== 1) {
      res.status(403).json('Access denied');
    }
    next();
  } catch (error) {
    return res.status(403).json({
      data: {
        msg: 'Access denied',
      },
    });
  }
};

module.exports = authAdmin;
