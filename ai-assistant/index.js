import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

const port = process.env.PORT || 3000
const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI)
.then(
    app.listen(port,() => console.log(`Server is Live on port ${port}`))
)
.catch((err) => console.log("Mongo Db connnection error: ",err))