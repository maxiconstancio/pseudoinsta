const express = require('express');
const { createImage, getAlbum, deleteImage, deleteAlbum } = require('../controllers/imagesController');
const watermark = require('../controllers/watermark');
const authenticated = require('../middlewares/authenticated');
const authOwnership = require('../middlewares/authOwnership');
const authAdmin = require('../middlewares/authAdmin')
const upload = require('../utils/multer');

const router = express.Router();

// Subida de imagen 

router.post('/', upload('imageUrl'), watermark, createImage);

//Ver album

router.get('/', authenticated, getAlbum);



//Eliminar un album

router.delete('/album/:id', authenticated, authAdmin, deleteAlbum);

//Eliminar una imagen

router.delete('/:id', authenticated, authAdmin, getAlbum);

module.exports = router;


