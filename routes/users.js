const express = require('express');

const router = express.Router();
const authAdmin = require('../middlewares/authAdmin');
const {
  userList,
  signup,
  login,
  userEdit,
  getData,
  userDelete,
} = require('../controllers/userController');
const userValidation = require('../validations/user');
const upload = require('../utils/multer');
const awsImageUploader = require('../controllers/awsActions');
const userAuth = require('../middlewares/authenticated');
const authenticated = require('../middlewares/authenticated');
const authOwnership = require('../middlewares/authOwnership');

// User list
router.get('/', authAdmin, userList);

// User edit
//router.patch('/:id', userAuth, upload(), awsImageUploader, userEdit);

// User get data
router.get('/auth/me', authenticated, getData);

// User standard list 
router.get('/list', authenticated, authAdmin, userList);

// User register
router.post('/auth/signup', userValidation.signup, signup);

// User login
router.post('/auth/login', login);

// User delete
router.delete('/:id', authenticated, authOwnership('User'), userDelete);


//Verify Token

router.get('/verify', authenticated, (req,res) => {
  res.status(200).json('logged')
});



module.exports = router;
