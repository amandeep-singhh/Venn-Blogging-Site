import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config'
import cors from 'cors';
import { userAuthRoutes } from "./routes/userAuth.js"
import aws from "aws-sdk"
import { blogRoutes } from './routes/blog.js';
import { userRoutes } from './routes/user.js';

const server = express();
let PORT = 3000;


server.use(express.json());
server.use(cors())

//Mongoose config
mongoose.connect(process.env.DB_LOACTION, {
    autoIndex: true
})


server.use(userAuthRoutes)
server.use(blogRoutes)
server.use(userRoutes)


server.listen(PORT, () => {
    console.log('listening on port-> ', PORT);
})