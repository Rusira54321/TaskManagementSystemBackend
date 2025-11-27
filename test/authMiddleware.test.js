const jwt = require("jsonwebtoken")
const {authMiddleware} = require("../authMiddlewares/authMiddleware")

jest.mock("jsonwebtoken")

//Unit test cases for the AuthMiddleware functions
describe("Auth Middleware",()=>{
    let req,res,next;

    //This run before each test case is running
    beforeEach(()=>{
        req = { headers: {} };
        res = {
            status:jest.fn().mockReturnThis(),
            json:jest.fn(),
        };
        next=jest.fn()
    });
    
    // test case for missing header
    test('should return 401 if Authorization header is missing', () => {
      authMiddleware(req,res,next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message:"Authorization header missing"
      });
    });

    // test case for token missing
    test('should return 401 if token is missing', () => {
        req.headers.authorization = 'Bearer ';
        authMiddleware(req,res,next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({message:"Token missing"});
    });

    // test case for valid token
    test('should call next() if token is valid', () => {
        req.headers.authorization = 'Bearer validtoken';
        jwt.verify.mockReturnValue({id:10});
        authMiddleware(req,res,next);
        expect(req.userId).toBe(10);
        expect(next).toHaveBeenCalled();
    });

    // test case for invalid or expired token
    test('should return 401 if token is invalid', () => {
        req.headers.authorization = 'Bearer invalidtoken';
        jwt.verify.mockImplementation(()=>{
            throw new Error("Invalid");
        });
        authMiddleware(req,res,next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({message:"Invalid or expired token"});
    });
    
})

