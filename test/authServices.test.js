const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {user} = require("../model/Users")
const {registerService,loginService} = require("../services/authServices")

//mocking the actual database functions
jest.mock("../model/Users",()=>({
    user:{
        findOne:jest.fn(),
        create:jest.fn()
    }
}))
//mocking the bcrypt and jsonwebtoken
jest.mock("bcryptjs")
jest.mock("jsonwebtoken")


// test cases for auth services functions
describe("Auth Services",()=>{
    //this reset mocks after each test
    afterEach(()=>{
        jest.clearAllMocks();
    })

    // registerService function test cases
    describe("registerService",()=>{

        test('should throw error if user already exists', async() => {
                user.findOne.mockResolvedValue({id:1,email:"test@gmail.com"});

                await expect(registerService("test@gmail.com","password123"))
                .rejects.toThrow("User with this email already exists");

                expect(user.findOne).toHaveBeenCalledWith({ where: { email: "test@gmail.com" } });
        });

        test('should create a new user if email does not exist', async() => {
                user.findOne.mockResolvedValue(null);
                bcrypt.hash.mockResolvedValue("hashedPassword");
                await registerService("new@gmail.com","password123");
                expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
                expect(user.create).toHaveBeenCalledWith({
                    email: "new@gmail.com",
                    passwordHash: "hashedPassword"
                });
                expect(user.findOne).toHaveBeenCalledWith({ where: { email: "new@gmail.com" } });
        });
    
    });

    //loginService function test cases
    describe('loginService',()=>{

        test('should throw error if user not found', async() => {
            user.findOne.mockResolvedValue(null);

            await expect(loginService('new@gmail.com','password123'))
            .rejects.toThrow("You are not registered");

            expect(user.findOne).toHaveBeenCalledWith({where: { email: "new@gmail.com"}});
        });

        test('should throw error if password is invalid', async() => {
            user.findOne.mockResolvedValue({ id: 1, email: "test@gmail.com", passwordHash: "hashedPassword" });
            bcrypt.compare.mockResolvedValue(false);

            await expect(loginService("test@gmail.com", "wrongpassword"))
                .rejects
                .toThrow("Invalid password");

            expect(bcrypt.compare).toHaveBeenCalledWith("wrongpassword", "hashedPassword");
        })
        
        test('should return token if login is successful', async() => {
            user.findOne.mockResolvedValue({ id: 1, email: "test@gmail.com", passwordHash: "hashedPassword" });
            
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue("fakeToken");
            
            const token = await loginService("test@gmail.com", "password123");

            expect(token).toBe("fakeToken");

            expect(jwt.sign).toHaveBeenCalledWith(
                { id: 1, email: "test@gmail.com" },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
        });
        
    }); 
});