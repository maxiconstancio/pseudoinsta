const Jimp = require("jimp");


const LOGO = process.env.LOGO || "./utils/img/maxi-logo.png"; //Subir logo a bucket de amazon

const LOGO_MARGIN_PERCENTAGE = 5;



const watermark = async (req, res, next) => {
  
  for (i = 0; i < req.files.length; i++ ) {
  const [image, logo] = await Promise.all([
    Jimp.read(req.files[i].buffer),
    Jimp.read(LOGO)
  ]);
   
  logo.resize(image.bitmap.width / 10, Jimp.AUTO);

  const xMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;
  const yMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;

  const X = image.bitmap.width - logo.bitmap.width - xMargin;
  const Y = image.bitmap.height - logo.bitmap.height - yMargin;

  const imagenWatermark = image.composite(logo, X, Y, [
    {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 0.5,
      opacityDest: 1  
    }
  ]);
  const buff = await imagenWatermark.getBufferAsync(req.files[i].mimetype);
  req.files[i].buffer = buff;
}
  next();
};



module.exports = watermark;