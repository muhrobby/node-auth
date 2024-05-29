import sequelize from "sequelize";
import { db } from "../config/database.js";


const dataType =  sequelize


const User = db.define('users', {
    name : {
        type : dataType.STRING,
        unique : true,
        allowNull: false,
        min : 3
    },
    email :{
        type : dataType.STRING,
        unique : true,
        allowNull: false,
        isEmail: true,
    },
    password : {
        type: dataType.STRING,
        min : 8,

    },
    refresh_token :{
        type: dataType.TEXT,
        allowNull: true,
    }
},{
    freezeTableName : true

})

export default User;