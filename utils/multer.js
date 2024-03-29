
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage({
  
  destination(req, file, callback) {
    callback(null, '');
  },
});

const limits = { fileSize: 1024 * 1024 * 5 };

const fileFilter = (req, file, callback) => {

  if (!file) return callback(null, false);
  
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
  const mimetype = filetypes.test(file.mimetype);

  if (!mimetype && !extname) {
    
    return callback(res.status(500).json('Error: Allow images only of extensions jpeg|jpg|png !'), false);
  }
  
  return callback(null, true);
};

const upload =  multer({ storage, fileFilter, limits });


module.exports = upload;
