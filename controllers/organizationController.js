const { organizations } = require('../models');
const { awsUpload, awsDelete } = require('./awsActions');

const newOrganization  = async (req, res, next) => {
    try {
        
        if (typeof req.files === 'undefined') res.status(500).json('Image is required');
        const name = req.body.name;
        const phone = req.body.phone;
        const city = req.body.city;
        const facebook = req.body.facebook;
        const instagram = req.body.instagram
        const twitter = req.body.twitter; 
        const userId = req.user.id;
        
      
        const imageUrl = await awsUpload(req.files['urlImage'][0]);
        
        const logoUrl = await awsUpload(req.files['urlLogo'][0]);
        const newOrg = await organizations.create({
          name, phone, city, facebook, instagram,twitter,userId, imageUrl,logoUrl,
        });
        res.status(201).json({ newOrg });
      } catch (error) {
        next(error);
      }
}

module.exports= { newOrganization }