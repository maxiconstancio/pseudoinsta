const express = require('express');

const router = express.Router();
const authAdmin = require('../middlewares/authAdmin');
const {
  newOrganization
} = require('../controllers/organizationController');

const upload = require('../utils/multer');
const awsImageUploader = require('../controllers/awsActions');
const userAuth = require('../middlewares/authenticated');
const authenticated = require('../middlewares/authenticated');
const authOwnership = require('../middlewares/authOwnership');

router.post('/', authenticated, authAdmin, upload.fields([{name: 'urlImage', maxCount:1}, {name:'urlLogo', maxCount:1}]), newOrganization);


module.exports = router;
