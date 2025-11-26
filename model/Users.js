const {DataTypes} = require('sequelize')
const {sequelize} = require("../config/database")
const user = sequelize.define('User',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    email:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false
    },
    passwordHash:{
        type:DataTypes.STRING,
        allowNull:false
    },
},{
    tableName:'users',
    timestamps:true
}
);

module.exports = {user}