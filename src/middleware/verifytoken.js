import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { where } from 'sequelize';


export const verifyToken = async (req, res, next) =>{
    const authHeader = req.header('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({
        message : 'token is required'
    })


    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findOne({
            where:{
                    refresh_token: token
            }
        })

        if (user.id == decoded.id) {
            next();
        } else {
            res.status(500).json({
                message : "access denied",
            })
        }

    } catch (error) {
        res.status(500).json({
            message : "invalid token",
            error: error.message
        })
    }


    
   
}