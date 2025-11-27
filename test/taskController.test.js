const { taskCreate, getTasks, changeTaskStatus, deleteTask } = require("../controllers/taskController");
const {
    createTask,
    getTasksService,
    changeTaskStatusService,
    deleteTaskService
} = require("../services/taskServices");

// Mock the services
jest.mock("../services/taskServices", () => ({
    createTask: jest.fn(),
    getTasksService: jest.fn(),
    changeTaskStatusService: jest.fn(),
    deleteTaskService: jest.fn()
}));

// Helper function to mock res object
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res); 
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("Task Controller", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    //test cases for taskCreate
    describe("taskCreate", () => {

        test("should return 400 if userId is missing", async () => {
            const req = { userId: null, body: { title: "Test Task" } };
            const res = mockResponse();

            await taskCreate(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "User ID is required" });
        });

        test("should return 400 if title is missing", async () => {
            const req = { userId: 1, body: { title: "" } };
            const res = mockResponse();

            await taskCreate(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Title is required" });
        });

        test("should return 400 if description exceeds 500 chars", async () => {
            const longDesc = "a".repeat(501);
            const req = { userId: 1, body: { title: "Test", description: longDesc } };
            const res = mockResponse();

            await taskCreate(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Description cannot exceed 500 characters" });
        });

        test("should create a task successfully", async () => {
            const req = { 
                userId: 1, 
                body: { title: "New Task", description: "desc", status: "pending", due_date: "2099-12-31" } 
            };
            const res = mockResponse();

            createTask.mockResolvedValue();

            await taskCreate(req, res);

            expect(createTask).toHaveBeenCalledWith(1, "New Task", "desc", "2099-12-31", "pending");
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: "Task created successfully" });
        });

        test("should return 500 if createTask throws error", async () => {
            const req = { userId: 1, body: { title: "Test" } };
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

    //test cases for getTasks
    describe("getTasks", () => {

        test("should return 400 if page/limit is invalid", async () => {
            const req = { userId: 1, query: { page: "abc", limit: "xyz" } };
            const res = mockResponse();

            await getTasks(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Page and limit must be integers" });
        });

        test("should return tasks successfully", async () => {
            const req = { userId: 1, query: { page: "1", limit: "10" } };
            const res = mockResponse();

            const fakeTasks = { totalPages: 1, currentPage: 1, tasks: [], totalTasks: 0 };
            getTasksService.mockResolvedValue(fakeTasks);

            await getTasks(req, res);

            expect(getTasksService).toHaveBeenCalledWith(1, 10, undefined, 1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Tasks retrieved successfully",
                data: fakeTasks
            });
        });

        test("should return 404 if no tasks found", async () => {
            const req = { userId: 1, query: { page: "1", limit: "10" } };
            const res = mockResponse();

            getTasksService.mockRejectedValue({ code: "NO_TASKS", message: "No tasks found" });

            await getTasks(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "No tasks found" });
        });
    });

    //test cases for changeTaskStatus
    describe("changeTaskStatus", () => {

        test("should return 400 if status is missing", async () => {
            const req = { params: { id: 1 }, body: {} };
            const res = mockResponse();

            await changeTaskStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Status is required" });
        });

        test("should update task status successfully", async () => {
            const req = { params: { id: 1 }, body: { status: "completed" } };
            const res = mockResponse();

            changeTaskStatusService.mockResolvedValue({ message: "Successfully update the status" });

            await changeTaskStatus(req, res);

            expect(changeTaskStatusService).toHaveBeenCalledWith("completed", 1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Successfully update the status" });
        });

        test("should return 404 if task not found", async () => {
            const req = { params: { id: 999 }, body: { status: "pending" } };
            const res = mockResponse();

            changeTaskStatusService.mockRejectedValue({ code: "NO_Task", message: "Task not found" });

            await changeTaskStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Task not found" });
        });
    });

    //test cases for deleteTask
    describe("deleteTask", () => {

        test("should return 400 if task id missing", async () => {
            const req = { params: {} };
            const res = mockResponse();

            await deleteTask(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Task id is missing in the request" });
        });

        test("should delete task successfully", async () => {
            const req = { params: { id: 1 } };
            const res = mockResponse();

            deleteTaskService.mockResolvedValue({ message: "Task deleted successfully" });

            await deleteTask(req, res);

            expect(deleteTaskService).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Task deleted successfully" });
        });

        test("should return 404 if task not found", async () => {
            const req = { params: { id: 999 } };
            const res = mockResponse();

            deleteTaskService.mockRejectedValue({ code: "NO_TASK", message: "Task not found" });

            await deleteTask(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Task not found" });
        });
    });

});
