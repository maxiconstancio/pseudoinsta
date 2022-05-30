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

// User register
router.post('/auth/signup', userValidation.signup, signup);

// User login
router.post('/auth/login', userValidation.login, login);

// User delete
router.delete('/:id', authenticated, authOwnership('User'), userDelete);


//test subida a aws

router.post('/upload', upload('imageUrl'), async (req, res) => {
  console.log(req)
  let image = await awsImageUploader.awsUpload(req.file)
  res.status(200).json(image);
}) 



module.exports = router;
