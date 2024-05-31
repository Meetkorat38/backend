import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const signupHandler = async (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(401).json({
      message: "Invalid request",
    });
  }

  const { firstname, lastname, email, mobilenumber, skypeID, password } = body;

  if (!(firstname && lastname && email && mobilenumber && password)) {
    return res.status(403).json({
      message: "Field cant be empty",
    });
  }

  //   If user already exists then login

  const userExist = await User.findOne({
    email,
    mobilenumber,
  });

  if (userExist) {
    return res.status(200).json({
      message: "User already exists",
    });
  }

  const user = await User.create({
    firstname,
    lastname,
    email,
    mobilenumber,
    skypeID,
    password,
  });

  if (!user) {
    return res.status(401).json({
      message: "User creation failed",
    });
  }

  return res.status(200).json({
    message: "User created successfully",
    user,
  });
};

const loginHandler = async (req, res) => {
  // Email and password are required
  const { username, password, mobilenumber } = req.body;

  if (!username || !password) {
    return res.status(403).json({
      message: "email or password is required",
    });
  }

  const user = await User.findOne({
    $or: [
      {
        email: username,
      },
      {
        mobilenumber: username,
      },
    ],
  });

  if (!user) {
    return res.status(403).json({
      message: "user not found",
    });
  }

  //   Now checked the password

  if (!(user && (await user.matchPassword(password)))) {
    return res.status(403).json({
      message: "Invalid password",
    });
  }

  const token = await jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET
  );

  if (!token) {
    return res.status(401).json({ message: "Token creation failed" });
  }

  return res.status(200).json({
    message: "User find successfully",
    token,
  });
};

const meHandler = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "first signup or signin" });
  }

  return res.status(200).json({
    status: true,
    user,
  });
};

export { signupHandler, loginHandler, meHandler };
