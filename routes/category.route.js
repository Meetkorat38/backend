import express from "express";
import { getAllCategory } from "../controller/category.controller.js";

const router = express.Router();

router.get("/", getAllCategory);

export default router;
