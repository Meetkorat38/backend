import express from "express";
import {
  getAllUsers,
  loginHandler,
  meHandler,
  signupHandler,
} from "../controller/user.controller.js";
import { auth, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signupHandler);

router.post("/login", loginHandler);

router.get("/me", auth, meHandler);

router.get("/allusers", auth, isAdmin, getAllUsers);
export default router;
