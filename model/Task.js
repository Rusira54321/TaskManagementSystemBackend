const {DataTypes} = require("sequelize")
const {sequelize} = require("../config/database")
const {user} = require("./Users")
const task = sequelize.define('Task',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false
    },
    description:{
        type:DataTypes.TEXT
    },
    status:{
        type:DataTypes.ENUM('pending','in_progress','completed'),
        defaultValue:'pending'
    },
    due_date:{
        type:DataTypes.DATE
    }
}
,{
    tableName:'tasks',
    timestamps:true   
});


//Define the relationship between User and Task
user.hasMany(task,{foreignKey:'user_id',onDelete:'CASCADE'});
task.belongsTo(user,{foreignKey:'user_id',onDelete:'CASCADE'});

module.exports = {task}