// src/server.ts

import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import router from './routes/uploadRoute';
const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Use the upload route
app.use('/upload', router);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
