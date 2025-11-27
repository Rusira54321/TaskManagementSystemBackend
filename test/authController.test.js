const { userRegister, userLogin } = require("../controllers/authController");
const { registerService, loginService } = require("../services/authServices");

// Mock the services 
jest.mock("../services/authServices", () => ({
    registerService: jest.fn(),
    loginService: jest.fn(),
}));

// helper to mock req & res
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res); // allow chaining
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("Auth Controller", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // test cases for userRegister
    describe("userRegister", () => {

        // validation tests

        test("should return 400 if email or password is missing", async () => {
            const req = { body: { email: "", password: "" } };
            const res = mockResponse();

            await userRegister(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Email and password are required"
            });
        });

        test("should return 400 if password is too short", async () => {
            const req = { body: { email: "test@mail.com", password: "123" } };
            const res = mockResponse();

            await userRegister(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Password must be at least 10 characters long"
            });
        });

        test("should return 400 for invalid email format", async () => {
            const req = { body: { email: "invalid", password: "longpassword" } };
            const res = mockResponse();

            await userRegister(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Invalid email format"
            });
        });

        // success test

        test("should register user successfully", async () => {
            registerService.mockResolvedValue();

            const req = {
                body: { email: "test@mail.com", password: "validpassword123" }
            };
            const res = mockResponse();

            await userRegister(req, res);

            expect(registerService).toHaveBeenCalledWith("test@mail.com", "validpassword123");
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: "User registered successfully"
            });
        });

        // service error: user exists

        test("should return 409 if user already exists", async () => {
            registerService.mockRejectedValue({
                code: "USER_EXISTS",
                message: "User already exists"
            });

            const req = {
                body: { email: "test@mail.com", password: "validpassword123" }
            };
            const res = mockResponse();

            await userRegister(req, res);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({
                error: "User already exists"
            });
        });

        // service error: other errors

        test("should return 500 for other server errors", async () => {
            registerService.mockRejectedValue(new Error("DB crashed"));

            const req = {
                body: { email: "test@mail.com", password: "validpassword123" }
            };
            const res = mockResponse();

            await userRegister(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Error registering user",
                error: "DB crashed"
            });
        });

    });

    // unit tests for userLogin
    describe("userLogin", () => {

        test("should return 400 if email or password missing", async () => {
            const req = { body: { email: "", password: "" } };
            const res = mockResponse();

            await userLogin(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Email and password are required"
            });
        });

        test("should login successfully and return token", async () => {
            loginService.mockResolvedValue("abc123token");

            const req = { body: { email: "test@mail.com", password: "pass123456" } };
            const res = mockResponse();

            await userLogin(req, res);

            expect(loginService).toHaveBeenCalledWith("test@mail.com", "pass123456");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Login successful",
                token: "abc123token"
            });
        });

        test("should return 401 if loginService throws error", async () => {

            loginService.mockRejectedValue(new Error("Invalid credentials"));

            const req = { body: { email: "wrong@mail.com", password: "wrong" } };
            const res = mockResponse();

            await userLogin(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: "Login failed",
                error: "Invalid credentials"
            });
        });

    });

});
