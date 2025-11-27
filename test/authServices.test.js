const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {user} = require("../model/Users")
const {registerService,loginService} = require("../services/authServices")

jest.mock("../model/Users")
jest.mock("bcryptjs")
jest.mock("jsonwebtoken")

describe("Auth Services",()=>{
    
})
