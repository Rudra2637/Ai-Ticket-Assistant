import express from 'express'
import { getUsers, login, logout, signUp, updateUser } from '../controllers/user.controller.js'
import { authmiddleWare } from '../middlewares/auth.js'

const router = express.Router()

router.post("/signup",signUp)

router.post("/login",login)

router.post("/logout",logout)

router.post("/update-User",authmiddleWare,updateUser)
router.get("/users",authmiddleWare,getUsers)

export default router