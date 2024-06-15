import { response } from "express";
import { Category } from "../models/product.model.js";
import { categoryValidationSchema } from "../utils/categoryValidator.js";

const createCategory = async (req, res) => {
  try {
    const { success, data } = categoryValidationSchema.safeParse(req.body);

    if (!success) {
      return res.status(401).json({
        message: "Parse all fields",
      });
    }

    const { categoryName, categoryDescription } = data;

    const categoryExists = await Category.findOne({
      categoryName: { $regex: RegExp(categoryName, "i") },
    });

    if (categoryExists) {
      return res.status(411).json({
        message: "category already exist",
      });
    }

    const category = await Category.create({
      categoryName,
      categoryDescription,
    });

    if (!category) {
      return response.status(401).json({
        message: "category creation failed",
      });
    }

    await category.save();

    return res.status(200).json({
      message: "category created successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Categorcreation failed",
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { success, data } = categoryValidationSchema.safeParse(req.body);

    if (!success) {
      return res.status(401).json({
        message: "Parse correct fields",
      });
    }

    const { categoryName, categoryDescription } = data;
    const id = req.params.id;

    const category = await Category.findByIdAndUpdate(
      id,
      {
        categoryName,
        categoryDescription,
      },
      { new: true }
    );

    if (!category) {
      return res.status(411).json({
        message: "Category not found",
      });
    }

    await category.save();

    return res.status(200).json({
      message: "Category updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error while updating category",
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(501).json({
        message: "Category not found ",
      });
    }

    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error while deleting category",
    });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const category = await Category.find();

    if (!category) {
      return res.status(404).json({
        message: "category not found",
      });
    }

    return res.status(200).json({
      message: "category get successfully",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Can not get all categorys",
    });
  }
};

export { createCategory, updateCategory, deleteCategory, getAllCategory };
