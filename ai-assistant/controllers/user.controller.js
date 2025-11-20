import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/user'
import { inngest } from '../inngest/client'

export const signUp = async (req,res) => {
    const {email,password,skills = []} = req.body
    try {
        
        const hashedPassword = await bcrypt.hash(password,10)
        const user =await User.create({email,password:hashedPassword,skills})

        //Inngest Function call
        await inngest.send({
            name:"user/signUp",
            data:{
                email
            }
        })
        const token = jwt.sign({_id:user._id,role:user.role,},process.env.JWT_SECRET)
        const createdUser = await User.findById(user._id).select(
            "-password "
        )
        return res.json({createdUser,token})
    } catch (error) {
        res.status(500).json({error:"Sign up failed",
            details:error.message
        })
    }
}

export const login = async (req,res) => {
    const {email,password} = req.body
    try {
        const findUser = await User.findOne({email})
        if(!findUser){
            return res.status(402).json({error:"User not found",
                details:error.message
                })
        }
        const comparePassword = await bcrypt.compare(password,findUser.password)
        if(!comparePassword){
            return res.status(401).json({error:"Wrong credentials",
                details:error.message
            })
        }

        const token = jwt.sign({_id:findUser._id,role:findUser.role,},process.env.JWT_SECRET)
        return res.json({findUser,token})
    } catch (error) {
        res.status(500).json({error:"Error in logging in the user",
            details:error.message
        })
    }
}

export const logout = async (req,res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        if(!token)return res.status(402).json({error:"Unauthorized access"});
        jwt.verify(token,process.env.JWT_SECRET,(err,decoded) => {
            if(err) return res.status(401).json({error:"Unauthorized Access"});
            res.json({message:"Logged out successfully"})
        })

    } catch (error) {
        return res.status(500).json({error:"Error in logging out",details:error.message})
    }
}