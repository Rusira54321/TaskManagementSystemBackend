const {taskCreate,getTasks,changeTaskStatus,deleteTask} = require("../controllers/taskController");

const {createTask,getTasksService,changeTaskStatusService,deleteTaskService} = require("../services/taskServices");

jest.mock("../services/taskServices", () => ({
    createTask: jest.fn(),
    getTasksService: jest.fn(),
    changeTaskStatusService: jest.fn(),
    deleteTaskService: jest.fn()
}));

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("Task Controller", () => {

    beforeEach(() => jest.clearAllMocks());

    //  TASK CREATE
    describe("taskCreate()", () => {

        test("400 - missing userId", async () => {
            const req = { userId: null, body: {} };
            const res = mockResponse();

            await taskCreate(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "User ID is required" });
        });

        test("400 - missing title", async () => {
            const req = { userId: 1, body: { title: "" } };
            const res = mockResponse();

            await taskCreate(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Title is required" });
        });

        test("400 - description > 500 chars", async () => {
            const req = { userId: 1, body: { title: "A", description: "a".repeat(501) } };
            const res = mockResponse();

            await taskCreate(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Description cannot exceed 500 characters"
            });
        });

        test("400 - invalid status", async () => {
            const req = { userId: 1, body: { title: "A", status: "wrong" } };
            const res = mockResponse();

            await taskCreate(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid status value" });
        });

        test("400 - invalid date format", async () => {
            const req = { userId: 1, body: { title: "A", due_date: "abc" } };
            const res = mockResponse();

            await taskCreate(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid due date" });
        });

        test("400 - due date is not future date", async () => {
            const req = { userId: 1, body: { title: "A", due_date: "2000-01-01" } };
            const res = mockResponse();

            await taskCreate(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Due date must be a future date"
            });
        });

        test("201 - task created successfully", async () => {
            const req = {
                userId: 1,
                body: {
                    title: "A",
                    description: "desc",
                    due_date: "2099-01-01",
                    status: "pending"
                }
            };
            const res = mockResponse();

            createTask.mockResolvedValue();

            await taskCreate(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: "Task created successfully" });
        });

        test("500 - createTask throws error", async () => {
            const req = { userId: 1, body: { title: "A" } };
            const res = mockResponse();

            createTask.mockRejectedValue(new Error("DB error"));

            await taskCreate(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Error creating task",
                error: "DB error"
            });
        });
    });


    //  GET TASKS
    describe("getTasks()", () => {

        test("400 - page/limit not numbers", async () => {
            const req = { userId: 1, query: { page: "abc", limit: "xyz" } };
            const res = mockResponse();

            await getTasks(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Page and limit must be integers"
            });
        });

        test("400 - page/limit <= 0", async () => {
            const req = { userId: 1, query: { page: "-1", limit: "0" } };
            const res = mockResponse();

            await getTasks(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Page and limit must be positive integers"
            });
        });

        test("400 - invalid status filter", async () => {
            const req = { userId: 1, query: { page: "1", limit: "10", status: "unknown" } };
            const res = mockResponse();

            await getTasks(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Invalid status filter"
            });
        });

        test("200 - tasks fetched successfully", async () => {
            const req = { userId: 1, query: { page: "1", limit: "10" } };
            const res = mockResponse();

            const mockData = { tasks: [], totalPages: 1 };
            getTasksService.mockResolvedValue(mockData);

            await getTasks(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Tasks retrieved successfully",
                data: mockData
            });
        });

        test("404 - NO_TASKS error", async () => {
            const req = { userId: 1, query: { page: "1", limit: "10" } };
            const res = mockResponse();

            getTasksService.mockRejectedValue({ code: "NO_TASKS", message: "No tasks" });

            await getTasks(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "No tasks" });
        });

        test("500 - internal error", async () => {
            const req = { userId: 1, query: { page: "1", limit: "10" } };
            const res = mockResponse();

            getTasksService.mockRejectedValue(new Error("Internal err"));

            await getTasks(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Error retrieving tasks",
                error: "Internal err"
            });
        });
    });


    // CHANGE TASK STATUS
    describe("changeTaskStatus()", () => {

        test("400 - missing status", async () => {
            const req = { params: { id: 1 }, body: {} };
            const res = mockResponse();

            await changeTaskStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Status is required" });
        });

        test("400 - missing id", async () => {
            const req = { params: {}, body: { status: "pending" } };
            const res = mockResponse();

            await changeTaskStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Task id is missing in the request"
            });
        });

        test("400 - invalid status", async () => {
            const req = { params: { id: 1 }, body: { status: "wrong" } };
            const res = mockResponse();

            await changeTaskStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Invalid status filter"
            });
        });

        test("200 - successfully updated", async () => {
            const req = { params: { id: 1 }, body: { status: "completed" } };
            const res = mockResponse();

            changeTaskStatusService.mockResolvedValue({
                message: "Updated"
            });

            await changeTaskStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Updated" });
        });

        test("404 - NO_Task error", async () => {
            const req = { params: { id: 1 }, body: { status: "pending" } };
            const res = mockResponse();

            changeTaskStatusService.mockRejectedValue({
                code: "NO_Task",
                message: "Not found"
            });

            await changeTaskStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Not found" });
        });

        test("500 - internal error", async () => {
            const req = { params: { id: 1 }, body: { status: "pending" } };
            const res = mockResponse();

            changeTaskStatusService.mockRejectedValue(new Error("Fail"));

            await changeTaskStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Internal server error",
                error: "Fail"
            });
        });
    });


    // DELETE TASK
    describe("deleteTask()", () => {

        test("400 - missing id", async () => {
            const req = { params: {} };
            const res = mockResponse();

            await deleteTask(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Task id is missing in the request"
            });
        });

        test("200 - task deleted", async () => {
            const req = { params: { id: 1 } };
            const res = mockResponse();

            deleteTaskService.mockResolvedValue({
                message: "Task deleted"
            });

            await deleteTask(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Task deleted"
            });
        });

        test("404 - NO_TASK error", async () => {
            const req = { params: { id: 1 } };
            const res = mockResponse();

            deleteTaskService.mockRejectedValue({
                code: "NO_TASK",
                message: "Not found"
            });

            await deleteTask(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Not found" });
        });

        test("500 - internal error", async () => {
            const req = { params: { id: 1 } };
            const res = mockResponse();

            deleteTaskService.mockRejectedValue(new Error("DB ERROR"));

            await deleteTask(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Internal server error",
                error: "DB ERROR"
            });
        });
    });
});
