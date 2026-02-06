const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./../models/user')

router.post('/signup', async (req,res)=>{
    try{
        //1. If the User Already Exist
        const user = await User.findOne({email : req.body.email})

        //2. If User exist , sends an message
        if(user){
         return res.status(400).send({
            message : 'User Already Exist',
            success : false
         })
        }

        //3.Encrypt the Password
       const hashedPassword =  await  bcrypt.hash(req.body.password, 10);
       req.body.password = hashedPassword;

       //4.Create new User and save in DB
       const newUser = new User(req.body);
       await newUser.save();

       res.status(201).send({
        message : 'User Created Succesfully',
        success : true
       });
        
    


    }catch(error){
        res.status(500).send({
            message : error.message,
            success : false

        });
    }

})

router.post('/login', async (req, res) => {

 if (!req.body.email || !req.body.password) {
  return res.status(400).json({
    success: false,
    message: "Email and password are required"
  });
}

 
  try {
    // 1. Check user
const user = await User.findOne({ email: req.body.email }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
        success: false
      });
    }

    // 2. Check password
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      return res.status(400).json({
        message: "Invalid password",
        success: false
      });
    }


    // 3. Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

   
   res.status(200).send({
      message: "Login successful",
      success: true,
      token,
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        profilePic: user.profilePic
      }
    });

 
   
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false
    });
  }
});



module.exports = router;