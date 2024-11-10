import { useState, ChangeEvent, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SantaUploader.css';

export default function SantaUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Reference to the file input for programmatically triggering it
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const validCSVFiles = selectedFiles.filter(file => file.type === 'text/csv');

    if (validCSVFiles.length === 0) {
      toast.error('Please select a CSV file', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      event.target.value = '';
      return;
    }

    if (validCSVFiles.length + files.length > 2) {
      toast.error('You can only upload up to 2 files at a time', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      event.target.value = '';
      return;
    }

    // Append new valid files to the existing ones, ensuring the total doesn't exceed 2
    setFiles(prevFiles => [...prevFiles, ...validCSVFiles].slice(0, 2));

    toast.success(`${validCSVFiles.length} CSV file(s) selected successfully!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('No files selected');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.filename) {
          toast.success('Files uploaded and processed successfully!');
          setDownloadUrl(`http://localhost:3000/download/${data.filename}`);
          setFiles([]);
        } else {
          throw new Error('Upload succeeded but response data is missing filename');
        }
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      toast.error('Error uploading files');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="santa-uploader">
      <div className="upload-container">
        <h1 className="title">Santa's CSV Uploader</h1>
        <h4>Instructions:</h4>
        <ol>
          <li>
            Please select up to 2 CSV files. The first file should be the last generated results file, named starting with <strong>"Secret-Santa-Game-Result"</strong>.
          </li>
          <li>
            The second file should be the latest employee list, named starting with <strong>"Employee-List"</strong>.
          </li>
          <li>
            Once both files are selected, click the "Upload to Santa" button to generate the result.
          </li>
        </ol>

        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="file-input"
          multiple
          style={{ display: 'none' }} 
        />

        {!files.length && !downloadUrl && (
          <label htmlFor="csv-upload" className="file-label" onClick={triggerFileInput}>
            Choose up to 2 CSV files
          </label>
        )}

        {files.length > 0 && (
          <div className="file-info">
            <p>Selected files:</p>
            <ul>
              {files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>

            <button
              onClick={handleUpload}
              className="file-label"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload to Santa'}
            </button>

            <button
              onClick={triggerFileInput}  // Trigger file input to add more files
              className="file-label"
            >
              Choose Another File
            </button>
          </div>
        )}

        {downloadUrl && (
          <button className="file-label">
            <a className="download-link" href={downloadUrl} download>
              Download Secret Santa Results
            </a>
          </button>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}
