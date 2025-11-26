const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {user} = require("../model/Users")
require("dotenv").config()
const registerService = async(email,password) =>{
    //Logic for registering a user
    const hashedPassword = await bcrypt.hash(password,10)
    const matchedUser = await user.findOne({where:{email}});
    //Checking the user already exists
    if(matchedUser)
    {
        const error = new Error("User with this email already exists")
        error.code = "USER_EXISTS"
        throw error
    }
    //Creating a new user
    await user.create({
        email,
        passwordHash:hashedPassword
    })
}

const loginService = async(email,password) =>{
    const matchedUser = await user.findOne({where:{email}})
    if(!matchedUser)
    {
        throw new Error("You are not registered")
    }
    const isPasswordValid = await bcrypt.compare(password,matchedUser.passwordHash)
    if(!isPasswordValid)
    {
        throw new Error("Invalid password")
    }
    const token = jwt.sign({id:matchedUser.id,email:matchedUser.email},process.env.JWT_SECRET,{expiresIn:'1h'});
    return token;
}
module.exports = {registerService,loginService}