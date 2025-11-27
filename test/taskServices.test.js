const {createTask,getTasksService,changeTaskStatusService,deleteTaskService} = require("../services/taskServices")
const {task} = require("../model/Task")

//mocking the task model
jest.mock("../model/Task",()=>({
    task:{
        create:jest.fn(),
        findAndCountAll:jest.fn(),
        findOne:jest.fn()
    }
}));

//taskServices test cases
describe("taskServices",()=>{
    afterEach(()=>{
        jest.clearAllMocks();
    })

    //test cases for createTask function
    describe("createTask",()=>{

        test('should create a task successfully', async() => {
                
                const taskData = {
                    userId:1,
                    title:"learn Jest",
                    description:"Write unit tests",
                    due_date:"2025-01-01",
                    status:"pending"
                };

                await createTask(taskData.userId,taskData.title,taskData.description,taskData.due_date,taskData.status);
                
                expect(task.create).toHaveBeenCalledWith({
                    user_id:1,
                    title:"learn Jest",
                    description:"Write unit tests",
                    due_date:"2025-01-01",
                    status:"pending"
                })
        })
    });

    //test cases for getTasksService function
    describe("getTasksService",()=>{
        test('should return paginated tasks', async() => {
            // Arrange
            task.findAndCountAll.mockResolvedValue({
                rows: [{ id: 1, title: "Test Task" }],
                count: 1
            });
            // Act
            const result = await getTasksService(1, 10, null, 7);
            // Assert
            expect(result).toEqual({
                totalPages: 1,
                currentPage: 1,
                tasks: [{ id: 1, title: "Test Task" }],
                totalTasks: 1
            });
            //this test the findAndCountAll function is called
            expect(task.findAndCountAll).toHaveBeenCalled();
        });

        test('should throw NO_TASKS error if no tasks exist', async() => {
            // Arrange
            task.findAndCountAll.mockResolvedValue({
                rows: [],
                count: 0
            });

            // Act + Assert
            await expect(getTasksService(1, 10, null, 7))
                .rejects
                .toThrow("No tasks found");
            });
    });

    //test cases for changeTaskStatusService
    describe('changeTaskStatusService',()=>{
        test('should update task status', async() => {
            // Arrange
            const fakeTask = {
                id: 1,
                status: "pending",
                save: jest.fn()
            };

            task.findOne.mockResolvedValue(fakeTask);

            // Act
            const result = await changeTaskStatusService("completed", 1);

            // Assert
            expect(fakeTask.status).toBe("completed");
            expect(fakeTask.save).toHaveBeenCalled();
            expect(result.message).toBe("Successfully update the status");
            });
        
        test('should throw error when task does not exist', async() => {
            // Arrange
            task.findOne.mockResolvedValue(null);

            // Act + Assert
            await expect(changeTaskStatusService("done", 999))
                .rejects
                .toThrow("The task is not found");
        });
    });

    //test cases for deleteTaskService
    describe('deleteTaskService',()=>{
        test('should delete a task successfully', async() => {
            // Arrange
            const fakeTask = {
                destroy: jest.fn()
            };

            task.findOne.mockResolvedValue(fakeTask);

            // Act
            const result = await deleteTaskService(1);

            // Assert
            expect(fakeTask.destroy).toHaveBeenCalled();
            expect(result.message).toBe("Task deleted successfully");
        });
        
        test('should throw error when deleting a non-existing task', async() => {
           // Arrange
            task.findOne.mockResolvedValue(null);

            // Act + Assert
            await expect(deleteTaskService(100))
                .rejects
                .toThrow("The task is not found"); 
        });
        
    });

})




