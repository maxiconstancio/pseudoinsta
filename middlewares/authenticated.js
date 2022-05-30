const { verifyToken } = require('./jwt');

const authenticated = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    const token = auth?.replace('Bearer ', '');
    if (!token) {
      return res.status(403).json({
        message: 'No se puede procesar la solicitud requerida',
        error: 'Forbidden',
        status: 403,
        data: null,
      });
    }
    const decodeToken = await verifyToken(token);
    req.user = decodeToken;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: error.message,
      error: 'Unauthorized',
      status: 401,
      data: null,
    });
  }
};

module.exports = authenticated;
