import { response } from "express";
import { Category, Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { productValidationSchema } from "../utils/productValidator.js"; // 🟠 -> Implement zod here

const createProduct = async (req, res) => {
  try {
    const { productName, description, price, category } = await req.body;

    let productImage = (await req.file) ? req.file?.path : "";

    const uploadImage = await uploadOnCloudinary(productImage);

    //   check if product is already available

    if (!uploadImage) {
      return response.status(200).json({
        message: "Image not upload",
      });
    }

    const productExist = await Product.findOne({
      productName: { $regex: new RegExp(productName, "i") },
    });

    if (productExist) {
      return res.status(411).json({
        message: "Product already available",
      });
    }

    const categoryDoc = await Category.findOne({
      categoryName: category,
    });

    if (!categoryDoc) {
      return res.status(404).json({
        message: `Category ${category} not found`,
      });
    }

    const product = await Product.create({
      productName,
      category: categoryDoc._id,
      description,
      price: Number(price),
      productImage: uploadImage?.url,
    });

    if (!product) {
      return res.status(501).json({
        message: "Product creation failed ",
      });
    }

    await product.save();

    return res.status(200).json({
      message: "Product created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Product not created",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productName, description, price, category } = req.body;
    const id = req.params.id;

    let updatedFields = {};

    // If a category is provided, find the corresponding category document
    if (category) {
      const categoryDoc = await Category.findOne({ categoryName: category });
      if (!categoryDoc) {
        return res.status(404).json({
          message: `Category ${category} not found`,
        });
      }
      updatedFields.category = categoryDoc._id;
    }

    // If a new product name is provided, update it
    if (productName) {
      updatedFields.productName = productName;
    }

    // If a new description is provided, update it
    if (description) {
      updatedFields.description = description;
    }

    // If a new price is provided, update it
    if (price) {
      updatedFields.price = Number(price);
    }

    // If a new image is provided, upload it to Cloudinary and update the image URL
    if (req.file) {
      const productImage = req.file.path;
      const uploadImage = await uploadOnCloudinary(productImage);
      if (uploadImage && uploadImage.url) {
        updatedFields.productImage = uploadImage.url;
      }
    }

    // Update the product with the provided fields
    const product = await Product.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Product update failed",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        message: "Product delet task failed | DB error",
      });
    }

    return res.status(200).json({
      message: "Product deleted task successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error deleting product failed",
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products) {
      return res.status(500).josn({
        message: "DB Error",
      });
    }

    return res.status(200).json({
      message: "Product geted successfully",
      products,
    });
  } catch (error) {
    return res.sattus(500).json({
      message: error.message || "Product geted error",
    });
  }
};

export { createProduct, updateProduct, getAllProducts, deleteProduct };
