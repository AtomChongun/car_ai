import axios from "axios";

export const handleUpload_service = async (formData, setUploadProgress) => {
    const uploadUrl = "http://localhost:3000/analyze-accident"; // Replace with your actual URL
  
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        // Calculate and update the progress percentage
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      },
    };
  
    try {
      const response = await axios.post(uploadUrl, formData, config);
      return response.data; // Return the response data (e.g., file URL or metadata)
    } catch (error) {
      console.error("Upload failed:", error);
      throw error; // Re-throw error for handling in the parent function
    }
  };
