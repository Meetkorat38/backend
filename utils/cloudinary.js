import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_KEY_SECRET,
});

const uploadOnCloudinary = async (localFileName) => {
  try {
    //If localfilename is empty or invalid then return immediately without further processing
    if (!localFileName) {
      return null;
    }

    // Now uploder upload the file to the server
    const response = await cloudinary.uploader.upload(localFileName, {
      folder: "product-images",
      resource_type: "image",
    });

    console.log(response);

    // console.log("File uploaded successfully: " + response);
    fs.unlinkSync(localFileName);
    return response;
  } catch (error) {
    // If the operation got failed then delete the tempory saved local file on the server
    fs.unlinkSync(localFileName);

    console.log(error.message || "Image failed to be saved");

    // And return null if the operation didn't succeed
    return null;
  }
};

const removeCloudinary = async (localFileName) => {
  try {
    if (!localFileName) return null;

    await cloudinary.uploader.destroy(localFileName, {
      resource_type: "auto",
    });
  } catch (error) {
    return null;
  }
};

export { uploadOnCloudinary, removeCloudinary };
