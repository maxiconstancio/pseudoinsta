const Jimp = require("jimp");


const LOGO = "./utils/img/maxi-logo.png";

const LOGO_MARGIN_PERCENTAGE = 5;



const watermark = async (req, res, next) => {
  console.log(req.file);  
  const [image, logo] = await Promise.all([
    Jimp.read(req.file.buffer),
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
  const buff = await imagenWatermark.getBufferAsync(req.file.mimetype);
  req.file.buffer = buff;
  
  next();
};



module.exports = watermark;