const {createTask,getTasksService,changeTaskStatusService,deleteTaskService} = require("../services/taskServices")

//Create Task
const taskCreate = async(req,res) =>{
    const userId = req.userId
    const {title,description,due_date,status} = req.body
    //validation
    if(!userId)
    {
        return res.status(400).json({message:"User ID is required"});
    }
    if(!title)
    {
        return res.status(400).json({message:"Title is required"});
    }
    if(description && description.length>500)
    {
        return res.status(400).json({message:"Description cannot exceed 500 characters"});
    }
    const validatedStatus = ['pending','in_progress','completed'];
    if(status && !validatedStatus.includes(status))
    {
        return res.status(400).json({message:"Invalid status value"});
    }
    if(due_date && isNaN(Date.parse(due_date)))
    {
        return res.status(400).json({message:"Invalid due date"});
    }
    if(due_date && (new Date(due_date)<=new Date()))
    {
        return res.status(400).json({message:"Due date must be a future date"});
    }
    //if all validations pass call the create task service
    try{
        await createTask(userId,title,description,due_date,status)
        return res.status(201).json({message:"Task created successfully"})
    }catch(err)
    {
        return res.status(500).json({message:"Error creating task",error:err.message})
    }
}

//get Tasks with pagination and filtering
const getTasks = async(req,res) =>{
    const {page=1,limit=10,status} = req.query
    const userId = req.userId
    if(isNaN(parseInt(page)) || isNaN(parseInt(limit)))
    {
        return res.status(400).json({message:"Page and limit must be integers"});
    }
    if(page<=0 || limit<=0)
    {
        return res.status(400).json({message:"Page and limit must be positive integers"});
    }
    if(status && !['pending','in_progress','completed'].includes(status))
    {
        return res.status(400).json({message:"Invalid status filter"});
    }
    //Call the service to get tasks
    try{
        const taskData = await getTasksService(parseInt(page),parseInt(limit),status,userId)
        return res.status(200).json({message:"Tasks retrieved successfully",data:taskData})
    }catch(err)
    {
        if(err.code === "NO_TASKS" )
        {
            return res.status(404).json({error:err.message});
        }
        return res.status(500).json({message:"Error retrieving tasks",error:err.message})
    }
}


//Update Task
const changeTaskStatus = async(req,res) =>{
    const {id} = req.params
    const {status} = req.body
    if(!status)
    {
        return res.status(400).json({message:"Status is required"})
    }
    if(!id)
    {
        return res.status(400).json({message:"Task id is missing in the request"})
    }
    const valideStatus = ['pending','in_progress','completed']
    if(!valideStatus.includes(status))
    {
        return res.status(400).json({message:"Invalid status filter"})
    }
    try{
        const successResponse = await changeTaskStatusService(status,id)
        return res.status(200).json(successResponse);
    }catch(err)
    {
        if(err.code==="NO_Task")
        {
            return res.status(404).json({error:err.message})
        }
        return res.status(500).json({message:"Internal server error",error:err.message})
    }
}

//Delete Task
const deleteTask = async(req,res) =>{
    const {id} = req.params
    if(!id)
    {
        return res.status(400).json({message:"Task id is missing in the request"})
    }
    try{
        const successfulResponse = await deleteTaskService(id)
        return res.status(200).json(successfulResponse)
    }catch(err)
    {
        if(err.code === "NO_TASK")
            {
                return res.status(404).json({error:err.message})
            }  
        return res.status(500).json({message:"Internal server error",error:err.message})
    }
}
module.exports = {taskCreate,getTasks,changeTaskStatus,deleteTask}