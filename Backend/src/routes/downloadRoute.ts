import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Define the output directory for the generated files
const outputDir = path.join(__dirname, '../output');

// Route to download a file by filename
router.get('/:filename', (req: any, res: any) => {
  const filename = req.params.filename;
  const filePath = path.join(outputDir, filename);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    return res.download(filePath);
  } else {
    return res.status(404).json({ error: 'File not found' });
  }
});

export default router;
