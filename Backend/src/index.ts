import express from 'express';
import multer from 'multer';
import path from 'path';
import  cors  from 'cors';
import fs from 'fs';
import router from './routes/uploadRoute';
import downloadRoute from './routes/downloadRoute';

const app = express();

// enabling cros origin permission
// app.use(cors({
//   origin: 'http://localhost:5173' 
// }));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the upload route
app.use('/upload', router);
// use download route
app.use('/download', downloadRoute);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
