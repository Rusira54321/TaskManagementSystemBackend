const {createTask,getTasksService,changeTaskStatusService,deleteTaskService} = require("../services/taskServices")
const {task} = require("../model/Task")

// Mocking the task model
jest.mock("../model/Task", () => ({
    task: {
        create: jest.fn(),
        findAndCountAll: jest.fn(),
        findOne: jest.fn()
    }
}));

describe("taskServices", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    // createTask()
    describe("createTask", () => {

        test("should create a task successfully", async () => {
            const taskData = {
                userId: 1,
                title: "Learn Jest",
                description: "Write unit tests",
                due_date: "2025-01-01",
                status: "pending"
            };

            await createTask(
                taskData.userId,
                taskData.title,
                taskData.description,
                taskData.due_date,
                taskData.status
            );

            expect(task.create).toHaveBeenCalledWith({
                user_id: 1,
                title: "Learn Jest",
                description: "Write unit tests",
                due_date: "2025-01-01",
                status: "pending"
            });
        });
    });

    // getTasksService()
    describe("getTasksService", () => {

        test("should return paginated tasks", async () => {
            task.findAndCountAll.mockResolvedValue({
                rows: [{ id: 1, title: "Test Task" }],
                count: 1
            });

            const result = await getTasksService(1, 10, null, 7);

            expect(result).toEqual({
                totalPages: 1,
                currentPage: 1,
                tasks: [{ id: 1, title: "Test Task" }],
                totalTasks: 1
            });

            expect(task.findAndCountAll).toHaveBeenCalled();
        });

        test("should filter by status when provided (COVER missing branch)", async () => {
            task.findAndCountAll.mockResolvedValue({
                rows: [{ id: 1, title: "Task", status: "pending" }],
                count: 1
            });

            await getTasksService(1, 10, "pending", 5);

            expect(task.findAndCountAll).toHaveBeenCalledWith({
                conditions: { user_id: 5, status: "pending" },
                offset: 0,
                limit: 10
            });
        });

        test("should throw NO_TASKS error if no tasks found", async () => {
            task.findAndCountAll.mockResolvedValue({
                rows: [],
                count: 0
            });

            await expect(
                getTasksService(1, 10, null, 7)
            ).rejects.toThrow("No tasks found");
        });
    });


    // changeTaskStatusService()
    describe("changeTaskStatusService", () => {

        test("should update task status", async () => {
            const fakeTask = {
                id: 1,
                status: "pending",
                save: jest.fn()
            };

            task.findOne.mockResolvedValue(fakeTask);

            const result = await changeTaskStatusService("completed", 1);

            expect(fakeTask.status).toBe("completed");
            expect(fakeTask.save).toHaveBeenCalled();
            expect(result.message).toBe("Successfully update the status");
        });

        test("should throw error when task not found", async () => {
            task.findOne.mockResolvedValue(null);

            await expect(changeTaskStatusService("done", 999))
                .rejects
                .toThrow("The task is not found");
        });
    });

    
    // deleteTaskService()
    describe("deleteTaskService", () => {

        test("should delete a task successfully", async () => {
            const fakeTask = { destroy: jest.fn() };

            task.findOne.mockResolvedValue(fakeTask);

            const result = await deleteTaskService(1);

            expect(fakeTask.destroy).toHaveBeenCalled();
            expect(result.message).toBe("Task deleted successfully");
        });

        test("should throw error for non-existing task", async () => {
            task.findOne.mockResolvedValue(null);

            await expect(deleteTaskService(100))
                .rejects
                .toThrow("The task is not found");
        });

    });

});
