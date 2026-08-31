import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { inngest } from '../inngest/client.js'
import { storage } from '../storage/index.js'

export const signUp = async (req, res) => {
    const { email, password, skills = [] } = req.body
    // console.log("Signup request: ", req.body)
    try {

        const userExist = await storage.getUserByEmail(email)
        if (userExist) {
            return res.status(403).json({
                message: "Account already exist, Try login"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await storage.createUser({
            email,
            password: hashedPassword,
            skills,
            role: role || "user"
        })

        //Inngest Function call
        await inngest.send({
            name: "user/signUp",
            data: {
                email
            }
        })
        const token = jwt.sign({ _id: user._id, role: user.role, }, process.env.JWT_SECRET)
        const createdUser = await storage.getUserById(user._id)

        return res.status(200).json({ createdUser, token, message: "Account created successfully" })
    } catch (error) {
        return res.status(500).json({
            error: "Sign up failed",
            details: error.message
        })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const findUser = await storage.getUserByEmail(email)

        if (!findUser) {
            return res.status(402).json({ message: "User not found" })
        }

        const comparePassword = await bcrypt.compare(password, findUser.password)
        if (!comparePassword) {
            return res.status(401).json({
                message: "Wrong credentials",
            })
        }

        const token = jwt.sign({ _id: findUser._id, role: findUser.role, }, process.env.JWT_SECRET)
        return res.json({ findUser, token })
    } catch (error) {
        console.error("Error: ", error)
        return res.status(500).json({
            message: "Error in logging in the user",
        })
    }
}

export const logout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        if (!token) return res.status(402).json({ error: "Unauthorized access" });
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.status(401).json({ error: "Unauthorized Access" });
            res.json({ message: "Logged out successfully" })
        })

    } catch (error) {
        return res.status(500).json({ error: "Error in logging out", details: error.message })
    }
}

export const updateUser = async (req, res) => {
    const { skills = [], role, email } = req.body
    try {
        let findUser;
        if (email) {
            findUser = await storage.getUserByEmail(email)
        } else {
            findUser = await storage.getUserById(req.user._id)
        }

        if (!findUser) return res.status(404).json({ error: "User does not exist" });

        // Non-admins can only update their own profile skills
        if (req.user?.role !== "admin") {
            if (findUser._id.toString() !== req.user._id.toString()) {
                return res.status(403).json({ error: "Forbidden: You can only update your own profile" });
            }

            const updatedUser = await storage.updateUser(findUser._id, {
                skills: req.body.skills ?? findUser.skills
            });

            return res.json({ message: "Profile skills updated successfully", user: updatedUser });
        }

        // Admins can ONLY update roles. Users manage their own skills directly.
        const updatedUser = await storage.updateUser(findUser._id, {
            role: role || findUser.role
        });

        return res.json({ message: "User role updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ error: "Error in updating user" });
    }
}

export const getUsers = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') return res.status(403).json({ error: "Forbidden request" });

        const user = await User.find().select("-password")
        return res.json({ user })

    } catch (error) {
        return res.status(500).json({ error: "Error in fetching all users profile" })
    }
}