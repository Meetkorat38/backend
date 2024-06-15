import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

const placeOrder = async (req, res) => {
  try {
    const { products, totalAmount, address } = req.body;

    if (!address) {
      return res.status(401).json({
        message: "Address cant be empty",
      });
    }

    // Fetch product details from the database
    const productIds = products.map((product) => product.product);
    const productDetails = await Product.find({ _id: { $in: productIds } });

    // Calculate the total amount based on product prices and quantities
    const calculatedTotalAmount = products.reduce((total, product) => {
      const productDetail = productDetails.find(
        (p) => p._id.toString() === product.product
      );
      if (productDetail) {
        return total + productDetail.price * product.quantity;
      }
      return total;
    }, 0);

    // Compare calculated total amount with the provided total amount
    if (calculatedTotalAmount !== totalAmount) {
      return res.status(400).json({
        message: "Total amount mismatch. Please try again.",
      });
    }

    console.log("calculatedTotalAmount ", Number(calculatedTotalAmount));

    // Compare calculated total amount with the provided total amount
    if (calculatedTotalAmount !== totalAmount) {
      return res.status(400).json({
        message: "Total amount mismatch. Please try again.",
      });
    }

    const order = await Order.create({
      user: req.user._id,
      products,
      totalAmount: calculatedTotalAmount,
      address,
    });

    if (!order) {
      return res.status(411).json({
        message: "Order cant be placed",
      });
    }

    await order.save();

    return res.status(200).json({
      message: "Order placed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Order cant be placed",
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "id name");

    if (!orders) {
      return res.status(404).json({
        message: "DB Error | Cant get orders",
      });
    }

    return res.status(200).json({
      message: "Order geted successfully",
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error getting orders",
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const id = req.params.id;

    const order = await Order.findById(id).populate("user", "id name");

    if (!order) {
      return res.status(404).json({
        message: "order not found",
      });
    }

    return res.status(200).json({
      message: "order get successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "order get failed",
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { status } = req.body;
    const id = req.params.id;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = status;

    const updatedOrder = await order.save();
    return res.status(200).json({
      message: "order updated successfully",
      updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Update order failed",
    });
  }
};

const deleteOrder = async (req, res) => {
  const id = req.params.id;
  const order = await Order.findByIdAndDelete(id);

  if (!order) {
    return res.status(404).json({
      message: "Order not found",
    });
  }

  return res.status(200).json({
    message: "Order deleted successfully",
  });
};

const getUserOrders = async (req, res) => {
  try {
    const user = req.user;

    const orders = await Order.find({ user: user._id }).populate(
      "products.product",
      "name price"
    );

    if (!orders) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({
      message: "Order find successfully",
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Fetch order failed",
    });
  }
};

export {
  placeOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getUserOrders,
};
