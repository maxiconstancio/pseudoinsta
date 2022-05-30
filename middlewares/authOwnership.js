const db = require('../models');

const authOwnership = (model = 'Comments') => async (req, res, next) => {
  const itemId = req.params.id || req.body.id;
  const { id: userId } = req.user;
  console.log(userId);

  if (!itemId) return res.status(400).json({ message: 'id invalido' });

  try {
    const isAdmin = await db.User.findByPk(userId);
    if (isAdmin.roleId === 1) return next();
    const itemUser = await db[model].findByPk(itemId);

    // Only Applies for User model
    if (itemUser.id === userId && model === 'User') return next();

    if (itemUser.user_id !== userId) return res.status(403).json({ message: 'Acceso Denegado' });
    return next();
  } catch (error) {
    return res.status(500).send('Error del Servidor');
  }
};

module.exports = authOwnership;
