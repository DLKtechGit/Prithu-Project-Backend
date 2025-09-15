const multer = require('multer');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const path = require('path');

// ✅ Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer Temporary Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, "./uploads/images");
    } else if (file.mimetype.startsWith("video/")) {
      cb(null, "./uploads/videos");
    } else {
      cb(new Error("Only image/video files are allowed"), null);
    }
  },
  filename: (req, file, cb) => {
    const sanitizedName = file.originalname.replace(/\s+/g, "_");
    cb(null, Date.now() + "_" + sanitizedName);
  }
});

const upload = multer({ storage });

// ✅ Upload to Cloudinary Middleware
const uploadToCloudinary = async (req, res, next) => {
  if (!req.file) return next(); // skip if no file uploaded

  try {
    const filePath = req.file.path;
    const result = await cloudinary.uploader.upload(filePath, {
      folder: req.file.mimetype.startsWith("image/") ? "images" : "videos",
      resource_type: "auto",
    });

    fs.unlinkSync(filePath); // remove local temp file

    req.cloudinaryFile = {
      url: result.secure_url,
      public_id: result.public_id,
    };

    next();
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
};

// ✅ Delete a file from Cloudinary
const deleteFromCloudinary = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id, { resource_type: "auto" });
    return result;
  } catch (err) {
    throw new Error("Cloudinary delete failed: " + err.message);
  }
};

// ✅ Update a file on Cloudinary (delete old → upload new)
const updateOnCloudinary = async (public_id, newFilePath, mimetype) => {
  try {
    if (public_id) {
      await cloudinary.uploader.destroy(public_id, { resource_type: "auto" });
    }

    const result = await cloudinary.uploader.upload(newFilePath, {
      folder: mimetype.startsWith("image/") ? "images" : "videos",
      resource_type: "auto",
    });

    fs.unlinkSync(newFilePath); // remove local temp file

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (err) {
    throw new Error("Cloudinary update failed: " + err.message);
  }
};

module.exports = {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
  updateOnCloudinary,
};
