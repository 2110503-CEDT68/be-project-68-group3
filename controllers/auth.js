const User = require('../models/User');


exports.register= async (req,res,next) => {
    try{
        const {name,telephone_number,email,password,role} = req.body;
        //Create user
        const user=await User.create({
            name,telephone_number,email,password,role
        });

        //Create token
        //const token=user.getSignedJwtToken();
        //res.status(200).json({success:true,token});
        sendTokenResponse(user,201,res);
    }catch(err){
        res.status(400).json({success:false});
        console.log(err.stack);
    }
};

exports.login= async (req,res,next)=>{
    const {email,password}=req.body;
    
    //validate email & password
    if(!email||!password){
        return res.status(400).json({success:false,msg:'Please provide an email and password'});
    }

    //check for user
    const user = await User.findOne({email}).select('+password');

    if(!user){
        return res.status(400).json({success:false,msg:'Invalid credentials'});
    }

    //check password match
    const ismatch = await user.matchPassword(password);

    if(!ismatch){
        return res.status(400).json({success:false,msg:'Invalid credentials'});
    }
    //create token
   // const token = user.getSignedJwtToken();
    //res.status(200).json({success:true,token});
     sendTokenResponse(user,200,res);
};

exports.logout= async (req,res,next)=>{
    try{
        const options= {
            expires: new Date(Date.now()),
            httpOnly:true,
            path: '/'
        };
        res.cookie('token','none',options);
        res.status(200).json({success:true,message:'Logged out successfully'});
    }
    catch(error){
        res.status(500).json({success:false,message:'Logout failed!'});
        console.log(error.stack);
    }
};

const sendTokenResponse=(user,statusCode,res)=>{
    //Create Token
    const token = user.getSignedJwtToken();

    const options ={
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly:true,
        path:'/' //cookie will be at root (can access by everyone)
    }
    if(process.env.NODE_ENV==='production'){
        options.secure=true;
    }
    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        token
    })
};

exports.getMe=async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        data:user
    });
};
