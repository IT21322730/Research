// src/components/FileUpload.js
import React, { useState } from 'react';
import { storage, ref, uploadBytes, getDownloadURL } from '../firebase';

const FileUpload = () => {
  const [file, setFile] = useState(null);  // Store the selected file
  const [uploading, setUploading] = useState(false);
  const [fileURL, setFileURL] = useState('');

  // Handle file input change
  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);  // Store the selected file
  };

  // Upload the file to Firebase Storage
  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    // Create a reference to the location in Firebase Storage
    const storageRef = ref(storage, 'uploads/' + file.name);

    try {
      // Upload the file
      await uploadBytes(storageRef, file);

      // Get the download URL of the uploaded file
      const downloadURL = await getDownloadURL(storageRef);
      setFileURL(downloadURL);  // Set the file URL in state

      console.log('File uploaded successfully! Download URL:', downloadURL);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload a File</h2>
      
      {/* File input */}
      <input type="file" onChange={handleChange} />
      
      {/* Upload button */}
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {/* Display the file URL if the upload is successful */}
      {fileURL && (
        <div>
          <p>File uploaded successfully!</p>
          <a href={fileURL} target="_blank" rel="noopener noreferrer">
            View File
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
