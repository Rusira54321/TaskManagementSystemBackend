const {updateUserDetailsService} = require("../services/userServices")
const { user} = require("../model/Users");
const bcrypt = require("bcryptjs");

// Mocking
jest.mock("../model/Users", () => ({
    user: {
        findOne: jest.fn(),
    }
}));

jest.mock("bcryptjs", () => ({
    hash: jest.fn(),
}));

//test cases for update User Details service
describe("updateUserDetailsService", () => {

    const mockUserInstance = {
        email: "",
        passwordHash: "",
        save: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should update the user email & password and save", async () => {

        user.findOne.mockResolvedValue(mockUserInstance);
        bcrypt.hash.mockResolvedValue("hashedPassword123");

        const response = await updateUserDetailsService(
            "newemail@example.com",
            "newpassword123",
            5
        );

        // Assert findOne was called correctly 
        expect(user.findOne).toHaveBeenCalledWith({
            where: { id: 5 }
        });

        //  Assert bcrypt hashing is done properly 
        expect(bcrypt.hash).toHaveBeenCalledWith("newpassword123", 10);

        //  Assert user instance was updated 
        expect(mockUserInstance.email).toBe("newemail@example.com");
        expect(mockUserInstance.passwordHash).toBe("hashedPassword123");

        //  Assert save() was called 
        expect(mockUserInstance.save).toHaveBeenCalled();

        //  Assert returned message 
        expect(response).toEqual({
            message: "Successfully updated user Details"
        });
    });

    test("should throw an error when user not found", async () => {

        user.findOne.mockResolvedValue(null);

        await expect(
            updateUserDetailsService("test@example.com", "password", 99)
        ).rejects.toMatchObject({
            message: "The user is not found",
            code: "NO_USER"
        });

        expect(user.findOne).toHaveBeenCalledWith({
            where: { id: 99 }
        });
    });
});