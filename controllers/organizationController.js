const { organizations, User } = require('../models');

const { awsUpload, awsDelete } = require('./awsActions');

const newOrganization  = async (req, res, next) => {
    try {
        
        if (typeof req.files === 'undefined') res.status(500).json('Image is required');
        const name = req.body.name;
        const email = req.body.email
        const phone = req.body.phone;
        const city = req.body.city;
        const facebook = req.body.facebook;
        const instagram = req.body.instagram
        const twitter = req.body.twitter; 
        const userId = req.user.id;
        
        
        const imageUrl = await awsUpload(req.files['urlImage'][0]);
        
        const logoUrl = await awsUpload(req.files['urlLogo'][0]);
        const newOrg = await organizations.create({
          name, phone, email, city, facebook, instagram,twitter,userId, imageUrl,logoUrl,
        });
      

        await User.update(
          {
            organizationId: newOrg.id,
          },
          {
            where: {
              id: req.user.id,
              
            },
          },
        );
        res.status(201).json( {newOrg} );
      } catch (error) {
        return res.status(500).json({
          success: false,
          error: error,
        });
      }
}

const infoOrganization = async (req, res) => {
 
  try {
    const org = await organizations.findByPk(req.params.id);
    
    if (!org) {
      return res.status(404).json({
        success: false,
        error: 'No news found',
      });
    }

    return res.status(200).json({
      success: true,
      data: org,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err,
    });
  }
}

module.exports= { newOrganization, infoOrganization }