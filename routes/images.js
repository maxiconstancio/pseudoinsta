const express = require('express');

const { createImage, getAlbum, deleteImage, deleteAlbum } = require('../controllers/imagesController');
const watermark = require('../controllers/watermark');
const authenticated = require('../middlewares/authenticated');
const authOwnership = require('../middlewares/authOwnership');
const authAdmin = require('../middlewares/authAdmin')
const upload = require('../utils/multer');
const sendMail = require('../middlewares/sendMail');

const router = express.Router();

// Subida de imagen 

router.post('/', authenticated, authAdmin, upload.array('imageUrl'), watermark, createImage);

//Ver album

router.get('/', authenticated, getAlbum);

//Enviar mail confirmacion

router.post('/confirm', authenticated, authAdmin, sendMail);



//Eliminar un album

router.delete('/album/:id', authenticated, authAdmin, deleteAlbum);

//Eliminar una imagen

router.delete('/:id', authenticated, authAdmin, deleteImage);

module.exports = router;


