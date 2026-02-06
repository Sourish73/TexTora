const router = require('express').Router();
const User = require('./../models/user');
const authMiddleware = require('./../middlewares/authMiddleware')
const cloudinary = require('./../cloudinary');
const message = require('../models/message');

router.get('/get-user-logged',authMiddleware,async(req,res)=>{
try{
  const user = await User.findOne({ _id: req.userId });


    res.send({
        message : "user fetched successfully",
        success : true,
        data : user
    });

}catch(error){
    res.status(500).send({
        message : error.message,
        success :false
    })
}
});

router.get('/get-all-users',authMiddleware,async(req,res)=>{
try{
    const userid = req.userId;
  const allUsers = await User.find({ _id:{$ne:userid}});


    res.send({
        message : "ALL Users fetched successfully",
        success : true,
        data : allUsers
    });

}catch(error){
    res.status(500).send({
        message : error.message,
        success :false
    })
}
});

router.post('/upload-profile-pic',authMiddleware,async(req,res,next)=>{
    try{
        const image = req.body.image;

        //UPLOAD THE IMAGE TO CLODINARY
        const uploadedImage = await cloudinary.uploader.upload(image, {
            folder: 'quick-chat'
        });

        //UPDATE THE USER MODEL & SET THE PROFILE PIC PROPERTY
     const user = await User.findByIdAndUpdate(
  req.userId,
  { profilePic: uploadedImage.secure_url },
  { new: true }
);


        res.send({
            message: 'Profic picture uploaded successfully',
            success: true,
            data: user
        })
    }
    catch(error){
        res.send({
            message:error.message,
            success:false
        })
    }
})

module.exports = router;