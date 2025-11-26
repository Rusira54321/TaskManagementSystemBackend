const {user} = require("../model/Users")
const bcrypt = require("bcryptjs")
const updateUserDetailsService = async(email,password,userId) =>{
    const matchedUser = await user.findOne({
        where:{
            id:userId
        }
    })
    if(!matchedUser)
    {
        const error = new Error("The user is not found")
        error.code = "NO_USER"
        throw error
    }
    matchedUser.email = email
    matchedUser.passwordHash = await bcrypt.hash(password,10)
    await matchedUser.save()
    return {
        message:"Successfully updated user Details"
    }
}

module.exports = {updateUserDetailsService}