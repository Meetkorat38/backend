import express from "express";
import { getAllUsers } from "../controller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../controller/product.controller.js";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "../controller/category.controller.js";
import {
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrder,
} from "../controller/order.controller.js";

const router = express.Router();

router.get("/allusers", getAllUsers); // 🟢

router.post("/products/create", upload.single("productImage"), createProduct); // 🟠 -> implement zod schema

router.put(
  "/products/update/:id",
  upload.single("productImage"),
  updateProduct
); // 🟢

router.delete("/products/delete/:id", deleteProduct); // 🟢

router.get("/products", getAllProducts); // 🟢

router.post("/category/create", createCategory); // 🟢

router.put("/category/update/:id", updateCategory); // 🟢

router.get("/category/", getAllCategory); // 🟢

router.delete("/category/delete/:id", deleteCategory); // 🟢

router.get("/orders", getOrders); // 🟢

router.get("/orders/order/:id", getOrderById); // 🟢

router.put("/orders/update/:id", updateOrder); // 🟢

router.delete("/orders/delete/:id", deleteOrder); // 🟢

export default router;
