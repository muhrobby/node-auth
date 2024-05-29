import express from 'express';
import dotenv from 'dotenv';
import router from './routes/users.js';
import { db } from './config/database.js';
import User from './models/user.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';



dotenv.config();
const app = express();

try {
    await db.authenticate();
    console.log("Database Conected");
    // await User.sync();  
} catch (error) {
    console.error("Database not Connected");
    console.error(error);
}

app.use(cors( {credentials: true , origin: 'http://localhost:3000'}))
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(4040,()=>{
    console.log("listening on Port 4040");
})