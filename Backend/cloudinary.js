const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'dngqkykzc', 
  api_key: '538278423866846', 
  api_secret: 'mfVlKFu9M58K9k_s4qt_kxvJ478'
});

module.exports = cloudinary;