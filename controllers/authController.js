const bcrypt = require("bcryptjs")
const {registerService,loginService} = require("../services/authServices")
const userRegister = async(req,res) =>{
    const {email,password} = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //validation
    if(!email || !password){
        return res.status(400).json({message:"Email and password are required"});
    }
    if(password.length<10)
    {
        return res.status(400).json({message:"Password must be at least 10 characters long"});
    }
    if(!emailRegex.test(email)){
        return res.status(400).json({message:"Invalid email format"});
    }
    try{
            //Call the register service
            await registerService(email,password)
            return res.status(201).json({message:"User registered successfully"})
    }catch(err)
    {
        if(err.code === "USER_EXISTS")
        {
            //if user already exists send conflict status
            return res.status(409).json({error:err.message})
        }
        //if any other error occurs send internal server error
        return res.status(500).json({message:"Error registering user",error:err.message})
    }
}

const userLogin = async(req,res) => {
    const {email,password} = req.body;
    if(!email || !password)
    {
        return res.status(400).json({message:"Email and password are required"});
    }
    try{
        const token = await loginService(email,password)
        return res.status(200).json({message:"Login successful",token:token})
    }catch(err)
    {
        return res.status(401).json({message:"Login failed",error:err.message})
    }
}



module.exports = {userRegister,userLogin}