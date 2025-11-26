const {sequelize} = require("./config/database")
const {user} = require("./model/Users")
const {task} = require("./model/Task")
const express = require("express")
const authRoute = require("./routers/authRouter")
const taskRoute = require("./routers/taskRouter")
const userRoute = require("./routers/userRouter")
const app = express()
app.use(express.json())
//Test DB Connection
sequelize.authenticate().then(()=>{
    console.log("Database connected...")
}).catch((err)=>{
    console.log("Error: "+ err)
})

//Create tables if they do not exist
sequelize.sync({alter:true}).then(()=>{
    console.log("All models synchronized")
}).catch((err)=>{
    console.log("Error: "+ err)
})


const port = process.env.PORT || 3000
//Start the server
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})

app.use("/api/auth",authRoute);
app.use("/api/tasks",taskRoute);
app.use("/api/user",userRoute)








