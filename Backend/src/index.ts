import express from 'express';
import multer from 'multer';
import path from 'path';
import  cors  from 'cors';
import fs from 'fs';
import { parseCSV } from './parsers/csvParser';
import { assignSecretSanta } from './services/secretSantaService';
import { createObjectCsvWriter } from 'csv-writer';
import { Employee, Assignment } from './models/secretSantaAssignment';
import { permission } from 'process';

const app = express();

// enabling cros origin permission
app.use(cors({
  origin: 'http://localhost:5173' 
}));
// Set up Multer for file uploads with custom storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads')); 
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const fileExtension = path.extname(originalName); 
    const baseName = path.basename(originalName, fileExtension); 
    cb(null, `${baseName}-${Date.now()}${fileExtension}`); 
  },
});

// multer type and size validation
const upload = multer({
  storage, // Use custom storage configuration
  limits: { fileSize: 2 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    // Only allow CSV files
    if (file.mimetype === 'text/csv') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed!') as any, false);
    }
  },
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define the output directory for the generated CSV
const outputDir = path.join(__dirname, 'output');

// checking output directory exists or not
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);

} else {
  // console.log('Output directory already exists');
}

// Endpoint to handle file uploads and process them
app.post('/upload', upload.array('files', 2), async (req: any, res: any) => {
 
  try {
    const files = req.files as Express.Multer.File[];
    // Ensure both the Employee list and previous year’s Secret Santa files are present
    const employeeFile = files.find(file => file.originalname.includes('Employee-List'));
    const previousYearFile = files.find(file => file.originalname.includes('Secret-Santa-Game-Result'));

    if (!employeeFile || !previousYearFile) {
      return res.status(400).json({ error: 'Both Employee list and previous year’s Secret Santa files are required.' });
    }

    // Parse the uploaded CSV files
    const employees = await parseCSV(employeeFile.path) as Employee[];
    const previousAssignments = await parseCSV(previousYearFile.path) as Assignment[];

    if (!employees || !previousAssignments) {
      return res.status(400).json({ error: 'Error parsing CSV files. Please ensure the files are correctly formatted.' });
    }

    // passing required data to next model
    const newAssignments = assignSecretSanta(employees, previousAssignments);
    
    // Generate a dynamic output file name
    const outputFileName = `secretSantaResults-${Date.now()}.csv`;
    const outputFilePath = path.join(outputDir, outputFileName);

    // Write the new assignments to the output CSV file
    await writeCSV(outputFilePath, newAssignments);

    // Respond with the download URL for the generated CSV file
    res.status(200).json({
      message: 'Files processed successfully!',
      filename:outputFileName,
      downloadUrl: `/download/${outputFileName}`
    });
  } catch (error) {
    console.error('Error processing files:', error);
    res.status(500).json({ error: 'Failed to process files' });
  }
});

// Helper function to write the new Secret Santa assignments to a CSV file
const writeCSV = async (filePath: string, data: Assignment[]) => {
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: 'Employee_Name', title: 'Employee_Name' },
      { id: 'Employee_EmailID', title: 'Employee_EmailID' },
      { id: 'Secret_Child_Name', title: 'Secret_Child_Name' },
      { id: 'Secret_Child_EmailID', title: 'Secret_Child_EmailID' },
    ],
  });
  try {
  
    await csvWriter.writeRecords(data);
    
  } catch (error) {
    console.error('Error writing CSV file:', error);
    throw new Error('Failed to write CSV file');
  }
};

// Endpoint to download the generated Secret Santa results CSV
app.get('/download/:filename', (req: any, res: any) => {
  const filename = req.params.filename;
  const filePath = path.join(outputDir, filename);

  // Check if the requested file exists
  if (fs.existsSync(filePath)) {
    return res.download(filePath); // Download the file
  } else {
  
    return res.status(404).json({ error: 'File not found' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
