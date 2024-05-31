import express from "express";
import {
  loginHandler,
  meHandler,
  signupHandler,
} from "../controller/user.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signupHandler);

router.post("/login", loginHandler);

router.get("/me", auth, meHandler);
export default router;
