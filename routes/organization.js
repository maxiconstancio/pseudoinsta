const express = require('express');

const router = express.Router();
const authAdmin = require('../middlewares/authAdmin');
const {
  newOrganization, infoOrganization
} = require('../controllers/organizationController');

const upload = require('../utils/multer');

const authenticated = require('../middlewares/authenticated');


// new organization
router.post('/', authenticated, authAdmin, upload.fields([{name: 'urlImage', maxCount:1}, {name:'urlLogo', maxCount:1}]), newOrganization);

// get info organization 

router.get('/:id', authenticated, authAdmin, infoOrganization )


module.exports = router;
