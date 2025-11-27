const { updateUser } = require("../controllers/userController");
const { updateUserDetailsService } = require("../services/userServices");

// Mock the service
jest.mock("../services/userServices", () => ({
    updateUserDetailsService: jest.fn()
}));

// Helper function to mock res object
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res); 
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("updateUser Controller", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // validation tests
    test("should return 400 if email or password is missing", async () => {
        const req = { userId: 1, body: { email: "", password: "" } };
        const res = mockResponse();

        await updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Username and password are required"
        });
    });

    test("should return 400 if password is too short", async () => {
        const req = { userId: 1, body: { email: "test@mail.com", password: "123" } };
        const res = mockResponse();

        await updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Password must be at least 10 characters long"
        });
    });

    test("should return 400 if email format is invalid", async () => {
        const req = { userId: 1, body: { email: "invalid", password: "longpassword" } };
        const res = mockResponse();

        await updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Invalid email format"
        });
    });

    //success test
    test("should update user successfully", async () => {
        const req = { userId: 1, body: { email: "new@mail.com", password: "validpassword123" } };
        const res = mockResponse();

        // Mock successful service response
        updateUserDetailsService.mockResolvedValue({ message: "Successfully updated user Details" });

        await updateUser(req, res);

        expect(updateUserDetailsService).toHaveBeenCalledWith(
            "new@mail.com",
            "validpassword123",
            1
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Successfully updated user Details" });
    });

    //user not found error test
    test("should return 404 if user not found", async () => {
        const req = { userId: 99, body: { email: "test@mail.com", password: "validpassword123" } };
        const res = mockResponse();

        updateUserDetailsService.mockRejectedValue({ code: "NO_USER", message: "The user is not found" });

        await updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "The user is not found" });
    });

    //Internal server error test
    test("should return 500 for server error", async () => {
        const req = { userId: 1, body: { email: "test@mail.com", password: "validpassword123" } };
        const res = mockResponse();

        updateUserDetailsService.mockRejectedValue(new Error("DB crashed"));

        await updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Internal server error",
            error: "DB crashed"
        });
    });
});
