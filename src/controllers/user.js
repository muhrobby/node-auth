import User  from "../models/user.js"
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { where } from "sequelize";


export const getUser = async (req, res, next) => {
    try {
        const response = await User.findAll()
        res.status(200).json({
            message:"User found",
            data:  response
        })
    } catch (error) {
        res.status(500).json({
            message:"failed getting user",
        })
    }
}

export const register = async (req, res, next) => {
const { name, email, password , confirmPassword } = req.body

if (password !== confirmPassword) 
    return res.status(400).json({
            message: "password not same",
    });

const salt = await bcrypt.genSalt();
const hashPassword = await bcrypt.hash(password, salt)

try {
    await User.create({
        name: name,
        email: email,
        password: hashPassword
    })
    res.status(200).json({
        message: "success",
        data: req.body
    })
} catch (error) {
    console.log(error.message);
    res.status(500).json({
        message: "failed to register",
        error: error
    })
}
}

export const login = async (req, res) => {
 try {
    const user = await User.findOne({
        where :{
            email : req.body.email,
        }
    });

    const match = await bcrypt.compare(req.body.password , user.password);

    if (!match)
        return res.status(500).json({
            message: "password mismatch",
        });

        // console.log(user.email);

    const data = {
        id: user.id,
        name: user.name,
        email: user.email,
    };
    // console.log(process.env.ACCESS_TOKEN_SECRET);
        const accessToken = jwt.sign(data,process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '20s'
        })


        const refreshToken = jwt.sign(data,process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '30s'
        })

        await User.update({refresh_token: refreshToken},{
            where:{
                id:user.id
            }
        },);
        res.cookie('auth', refreshToken,{
            httpOnly: true,
            maxAge : 24 *60 *60 * 1000
        })

        res.status(200).json({
            token : refreshToken,
        })


 } catch (error) {
    res.status(500).json({
        message: "Email tidak di temukan",
        error : error.message
    })
 }

}

export const logout = async (req, res) => {
    const refreshToken = req.cookies.auth;
    if (!refreshToken) return res.status(204);
        // console.log(`logout ${refreshToken}`);
        const user  = await User.findOne({
            where:{
                refresh_token: refreshToken
            }
        });
    if(!user) return res.status(204);
    await User.update({
        refresh_token : null,
    },{
        where: { 
            id: user.id
        }
    })

    res.clearCookie('auth');

    return res.status(200).json({
        message: 'logout successfully'
    });

}