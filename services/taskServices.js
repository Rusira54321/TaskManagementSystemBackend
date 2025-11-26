const {task} = require("../model/Task")
const createTask  = async(userId,title,description,due_date,status) =>{
   await task.create({
        user_id:userId,
        title,
        description,
        due_date,
        status
    })
}
const getTasksService = async(page,limit,status,userId) =>{
    const conditions = {
        user_id:userId
    }
    if(status)
        {
            conditions.status = status
        } 
    const result = await task.findAndCountAll({
        conditions,
        offset:(page-1)*limit,
        limit:limit
    })
    //If no tasks
    if(result.rows.length===0)
    {
        const error = new Error("No tasks found")
        error.code = "NO_TASKS"
        throw error
    }
    const totalTasks = result.count
    const totalPages = Math.ceil(totalTasks/limit)
    return {
        totalPages:totalPages,
        currentPage:page,
        tasks:result.rows,
        totalTasks:totalTasks
    }
}

const changeTaskStatusService = async(status,taskid) =>{
    const matchedTask = await task.findOne({
            where: { id: taskid}
        });
    if(!matchedTask)
    {
        const error = new Error("The task is not found")
        error.code = "NO_Task"
        throw error
    }
    matchedTask.status = status
    await matchedTask.save()
    return {
        message:"Successfully update the status"
    }
}

const deleteTaskService = async(taskId) =>{
    const matchedTask = await task.findOne({
        where:{
            id: taskId
        }
    })
    if(!matchedTask)
    {
        const error = new Error("The task is not found")
        error.code = "NO_TASK"
        throw error
    }
    await matchedTask.destroy()
    return {
        message:"Task deleted successfully"
    }
}
module.exports = {createTask,getTasksService,changeTaskStatusService,deleteTaskService}