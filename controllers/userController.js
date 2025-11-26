const {updateUserDetailsService} = require("../services/userServices")
const updateUser = async(req,res) =>{
    const userId = req.userId
    const {email,password} = req.body
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email || !password)
    {
        return res.status(400).json({message:"Username and password are required"})
    }
    if(password.length<10)
    {
        return res.status(400).json({message:"Password must be at least 10 characters long"});
    }
    if(!emailRegex.test(email)){
        return res.status(400).json({message:"Invalid email format"});
    }
    try{
        const successMessage = await updateUserDetailsService(email,password,userId)
        return res.status(200).json(successMessage)
    }catch(err)
    {
        if(err.code ==="NO_USER")
        {
            return res.status(404).json({error:err.message})
        }
        return res.status(500).json({message:"Internal server error",error:err.message})
    }
}

module.exports = {updateUser}