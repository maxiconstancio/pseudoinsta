const { Images } = require('../models');
const { awsUpload, awsDelete } = require('./awsActions');

const getAlbum = async (req, res, next) => {
    
  try {
    const images = await Images.findAll({ where: {userId: req.user.id} });
    res.json({ images });
  } catch (error) {
    next(error);
  }
};

const createImage = async (req, res, next) => {
  
  
  try {
    if (typeof req.file === 'undefined') throw new Error('Image is required');
    userId = req.body.userId;
    const url = await awsUpload(req.file);
    const images = await Images.create({
      url, userId
    });
    res.status(201).json({ images });
  } catch (error) {
    next(error);
  }
};

/*
// eslint-disable-next-line consistent-return
const getOneImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !Number(id)) throw new Error('Invalid Id');
    const image = await Images.findByPk(Number(id));
    if (!image) return res.status(404).json({ message: 'Not Found' });
    res.json({ image });
  } catch (error) {
    next(error);
  }
};*/

/*
const updateSlide = async (req, res, next) => {
  const { text, organizationId, order } = req.body;
  const { id } = req.params;
  try {
    if (!id) throw new Error('Invalid Id');
    const slide = await Slides.findByPk(id);
    if (!slide) throw new Error('Item not found');
    let imageUrl = slide.imageUrl || '';

    if (typeof req.file !== 'undefined') {
      // if (imageUrl !== '') {
      //   await awsDelete(imageUrl); // permissions need to be granted to delete the image
      // }
      imageUrl = await awsUpload(req.file);
    }

    Object.assign(slide, {
      text, organizationId, order, imageUrl,
    });
    await slide.save();

    res.json({ message: 'Update Success', slide });
  } catch (error) {
    next(error);
  }
};*/

const deleteImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new Error('Invalid Id');
    const image = await Images.findByPk(id);
    if (!image) throw new Error('Item not found');
    // await awsDelete(slide.imageUrl); // permissions need to be granted to delete the image
    await image.destroy();
    res.json({ message: 'Delete Success', image });
  } catch (error) {
    next(error);
  }
}
  const deleteAlbum = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) throw new Error('Invalid Id');
      
      // await awsDelete(slide.imageUrl); // permissions need to be granted to delete the image
      await Images.destroy({
        where: {
          userId: id
        }
      });
      res.json({ message: 'Delete Success' });
    } catch (error) {
      next(error);
    }
  
};

module.exports = {
  createImage,
  getAlbum,
  deleteImage,
  deleteAlbum
};
