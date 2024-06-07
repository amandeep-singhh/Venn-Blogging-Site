import express from "express";
import { signin, signup } from "../controllers/auth.js";

const userAuthRoutes = express.Router();

userAuthRoutes.post("/signup", signup)
userAuthRoutes.post("/signin", signin)

export {userAuthRoutes};