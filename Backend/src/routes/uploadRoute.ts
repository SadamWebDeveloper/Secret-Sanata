// src/routes/uploadRoute.ts

import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Set up Multer for file uploads with custom storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const fileExtension = path.extname(originalName); // Get the original file extension
    const baseName = path.basename(originalName, fileExtension); // Remove the extension for a clean base name
    cb(null, `${baseName}-${Date.now()}${fileExtension}`); // Add timestamp to make filename unique
  },
});

const upload = multer({
  storage, // Use custom storage configuration
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2 MB per file
  fileFilter: (req, file, cb) => {
    // Only allow CSV files
    if (file.mimetype === 'text/csv') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed!') as any, false);
    }
  },
});

// Define the file upload route for multiple files
router.post('/', upload.array('files', 2), (req: any, res: any) => {
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  const uploadedFiles = (req.files as Express.Multer.File[]).map((file) => ({
    fileName: file.filename,
    filePath: file.path,
  }));

  // Do any processing with the uploaded files here (e.g., parse each CSV file)

  return res.status(200).json({
    message: 'Files uploaded successfully',
    files: uploadedFiles,
  });
});

export default router;
