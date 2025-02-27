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

  export const handleUploads_service = async (files, setUploadProgress) => {
    const uploadUrl = "http://localhost:3000/analyze-accident"; // เปลี่ยนเป็น URL จริงของคุณ
    const formData = new FormData();
  
    // เพิ่มไฟล์ทั้งหมดใน FormData
    files.forEach((file) => {
      formData.append("files", file); // สมมติว่า backend รองรับ 'files' เป็น array
    });
  
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        // คำนวณเปอร์เซ็นต์การอัปโหลด
        const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        setUploadProgress(progress);
      },
    };
  
    try {
      const response = await axios.post(uploadUrl, formData, config);
      return response.data; // ส่งข้อมูล response กลับ (อาจเป็น URL หรือ metadata)
    } catch (error) {
      console.error("Upload failed:", error);
      throw error; // ส่ง error ให้ฟังก์ชันที่เรียกใช้งาน handle
    }
  };

