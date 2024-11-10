import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { parseCSV } from "../parsers/csvParser";
import { Assignment, Employee } from "../models/secretSantaAssignment";
import { assignSecretSanta } from "../services/secretSantaService";
import { createObjectCsvWriter } from "csv-writer";

const router = express.Router();
console.log("inside route");

// Define the output directory for generated CSV files
const outputDir = path.join(__dirname, "../output");
const uploadDir = path.join(__dirname, "../uploads");

// Ensure that the output and uploads directories exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up Multer for file uploads with custom storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store files in the correct uploads directory
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const fileExtension = path.extname(originalName);
    const baseName = path.basename(originalName, fileExtension);
    cb(null, `${baseName}-${Date.now()}${fileExtension}`);
  },
});

// Multer type and size validation
const upload = multer({
  storage, // Use custom storage configuration
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    // Only allow CSV files
    if (file.mimetype === "text/csv") {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed!") as any, false);
    }
  },
});

// Endpoint to handle file uploads and process them
router.post("/", upload.array("files", 2), async (req: any, res: any) => {
  try {
    const files = req.files as Express.Multer.File[];
    const employeeFile = files.find((file) =>
      file.originalname.includes("Employee-List")
    );
    const previousYearFile = files.find((file) =>
      file.originalname.includes("Secret-Santa-Game-Result")
    );

    if (!employeeFile || !previousYearFile) {
      return res
        .status(400)
        .json({
          error:
            "Both Employee list and previous year’s Secret Santa files are required.",
        });
    }

    // Parse the uploaded CSV files
    const employees = (await parseCSV(employeeFile.path)) as Employee[];
    const previousAssignments = (await parseCSV(
      previousYearFile.path
    )) as Assignment[];

    if (!employees || !previousAssignments) {
      return res
        .status(400)
        .json({
          error:
            "Error parsing CSV files. Please ensure the files are correctly formatted.",
        });
    }

    // Generate assignments and save to output CSV
    const newAssignments = assignSecretSanta(employees, previousAssignments);
    const outputFileName = `secretSantaResults-${Date.now()}.csv`;
    const outputFilePath = path.join(outputDir, outputFileName);
    await writeCSV(outputFilePath, newAssignments);

    // Respond with the download URL for the generated CSV file
    res.status(200).json({
      message: "Files processed successfully!",
      filename: outputFileName,
      downloadUrl: `/download/${outputFileName}`,
    });
    // Delete uploaded files after response
    await Promise.all(files.map((file) => fs.promises.unlink(file.path)));
  } catch (error) {
    console.error("Error processing files:", error);
    res.status(500).json({ error: "Failed to process files" });
  }
});

// Helper function to write the new Secret Santa assignments to a CSV file
const writeCSV = async (filePath: string, data: Assignment[]) => {
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: "Employee_Name", title: "Employee_Name" },
      { id: "Employee_EmailID", title: "Employee_EmailID" },
      { id: "Secret_Child_Name", title: "Secret_Child_Name" },
      { id: "Secret_Child_EmailID", title: "Secret_Child_EmailID" },
    ],
  });
  try {
    await csvWriter.writeRecords(data);
  } catch (error) {
    console.error("Error writing CSV file:", error);
    throw new Error("Failed to write CSV file");
  }
};

export default router;
