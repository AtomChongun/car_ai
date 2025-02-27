import React, { useState, useRef, useEffect } from "react";
import { handleUpload_service } from "../service/analysis_damage";
import CardDetailView from "./carddetail";
import Header from "../component/header/header";
import Footer from "../component/footer/footer";

const MAX_FILES = 5;
const FILE_SIZE_LIMIT = 10; // MB

const UploadView = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadData, setUploadData] = useState(null);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const fileInputRef = useRef(null);

  // Validate files before adding them
  const validateAndAddFiles = (files) => {
    // Filter out non-image files
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      alert("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }

    // Check file sizes
    const validSizeFiles = imageFiles.filter((file) => {
      const sizeInMB = file.size / (1024 * 1024);
      return sizeInMB <= FILE_SIZE_LIMIT;
    });

    if (validSizeFiles.length < imageFiles.length) {
      alert(`ไฟล์บางไฟล์มีขนาดเกิน ${FILE_SIZE_LIMIT}MB และถูกข้ามไป`);
    }

    // Limit to maximum MAX_FILES images
    const newFiles = [...selectedFiles, ...validSizeFiles].slice(0, MAX_FILES);
    setSelectedFiles(newFiles);

    // Generate preview URLs for new files
    const newPreviews = newFiles.map((file, index) => {
      // If we already have a preview for this file, reuse it
      if (index < previewUrls.length) {
        return previewUrls[index];
      }
      // Otherwise, create a new preview
      return URL.createObjectURL(file);
    });

    setPreviewUrls(newPreviews);
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    validateAndAddFiles(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files);
    validateAndAddFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("กรุณาเลือกไฟล์ก่อนอัปโหลด");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setCurrentFileIndex(0);

      // อัพโหลดทีละไฟล์และเก็บผลลัพธ์
      const uploadResults = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        setCurrentFileIndex(i);
        const formData = new FormData();
        formData.append("image", selectedFiles[i]);

        // คำนวณ progress ทั้งหมด
        const baseProgress = (i / selectedFiles.length) * 100;
        const updateProgress = (fileProgress) => {
          const overallProgress = baseProgress + fileProgress / selectedFiles.length;
          setUploadProgress(Math.min(overallProgress, 99));
        };

        try {
          const res = await handleUpload_service(formData, updateProgress);
          uploadResults.push({
            result: res,
            imageUrl: previewUrls[i],
            fileName: selectedFiles[i].name,
          });
        } catch (error) {
          console.error(`Failed to upload file ${i + 1}:`, error);
          uploadResults.push({
            error: `Failed to upload ${selectedFiles[i].name}`,
            imageUrl: previewUrls[i],
            fileName: selectedFiles[i].name,
          });
        }
      }

      setUploadProgress(100);

      if (uploadResults.length > 0) {
        setUploadData(uploadResults);
      } else {
        throw new Error("ไม่มีไฟล์ที่อัปโหลดสำเร็จ");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("เกิดข้อผิดพลาดในการอัปโหลด: " + (error.message || "โปรดลองอีกครั้ง"));
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleReset = () => {
    // รีเซ็ต state ทั้งหมด
    setUploadData(null);
    setSelectedFiles([]);

    // ทำความสะอาด URLs ก่อนที่จะรีเซ็ต
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);

    setUploadProgress(0);
    setCurrentFileIndex(0);
  };

  const removeImage = (index) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...previewUrls];

    // ลบ object URL เพื่อป้องกัน memory leak
    URL.revokeObjectURL(previewUrls[index]);

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // Render preview thumbnails
  const renderPreviewThumbnails = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {previewUrls.map((url, index) => (
        <div key={index} className="relative group">
          <img
            src={url}
            alt={`Preview ${index + 1}`}
            className="h-32 w-full object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          />
          <button
            onClick={() => removeImage(index)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Remove image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <p className="text-xs text-gray-600 mt-1 truncate">
            {selectedFiles[index]?.name || ""}
          </p>
        </div>
      ))}
      {previewUrls.length < MAX_FILES && (
        <div
          onClick={triggerFileInput}
          className="h-32 flex items-center justify-center border-2 border-dashed border-red-300 rounded-lg cursor-pointer hover:bg-red-50 transition-colors duration-200"
        >
          <div className="text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span className="text-xs">เพิ่มรูป</span>
          </div>
        </div>
      )}
    </div>
  );

  // Render upload progress indicator
  const renderUploadProgress = () => (
    <div className="space-y-2">
      <div className="w-full bg-red-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-red-500 to-indigo-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${uploadProgress}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-600 text-center">
        กำลังอัปโหลดรูปที่ {currentFileIndex + 1} จาก {selectedFiles.length} ({uploadProgress.toFixed(0)}%)
      </p>
    </div>
  );

  // Render upload section
  const renderUploadSection = () => (
    <>
      <div className="flex flex-col items-center justify-center aling-center">
        {/* Logo */}
        <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-r from-red-500 to-indigo-600 text-white rounded-full mb-4 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-12 h-12"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-800">
          อัปโหลดรูปภาพ
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          กรุณาเลือกรูปภาพ (สูงสุด {MAX_FILES} รูป) และกำหนดราคาที่ต้องการ
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <div
          className={`h-86 border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
            isDragging ? "border-red-500 bg-red-50" : "border-red-200"
          } ${
            previewUrls.length > 0 ? "py-4" : "py-10"
          } hover:border-red-400 hover:bg-red-50`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex="0"
          aria-label="อัพโหลดรูปภาพโดยการลากและวาง"
        >
          {previewUrls.length > 0 ? (
            <div className="space-y-4">
              {renderPreviewThumbnails()}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {selectedFiles.length} จาก {MAX_FILES} รูป
                </span>
                <button
                  onClick={triggerFileInput}
                  className="text-red-600 hover:text-red-800 font-medium underline transition-colors duration-200"
                  disabled={selectedFiles.length >= MAX_FILES}
                >
                  {selectedFiles.length >= MAX_FILES
                    ? "จำนวนรูปเต็มแล้ว"
                    : "เพิ่มรูปภาพ"}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <svg
                className="mx-auto h-16 w-16 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-base text-gray-600">
                ลากและวางรูปภาพที่นี่ หรือ{" "}
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="text-red-600 hover:text-red-500 font-medium"
                >
                  คลิกเพื่อเลือกไฟล์
                </button>
              </p>
              <p className="text-xs text-gray-500">
                รองรับไฟล์ PNG, JPG และ GIF ขนาดไม่เกิน {FILE_SIZE_LIMIT}MB (สูงสุด {MAX_FILES} รูป)
              </p>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileSelect}
          multiple
          aria-label="เลือกไฟล์รูปภาพ"
        />

        {isUploading && renderUploadProgress()}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || isUploading}
            className={`flex-1 rounded-md border border-transparent py-3 px-4 text-sm font-medium text-white transition-all duration-200 shadow-lg ${
              selectedFiles.length === 0 || isUploading
                ? "bg-red-300 cursor-not-allowed"
                : "bg-gradient-to-r from-red-500 to-indigo-600 hover:from-red-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            }`}
          >
            อัปโหลด {selectedFiles.length > 0 ? `(${selectedFiles.length} รูป)` : ""}
          </button>
        </div>
      </div>
    </>
  );

  // Render results section
  const renderResultsSection = () => (
    <div className="space-y-10">
      <h2 className="text-center text-3xl font-semibold text-gray-800 mb-8">
        ผลการวิเคราะห์รูปภาพ
      </h2>

      {Array.isArray(uploadData) &&
        uploadData.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden mb-6"
          >
            <div className="md:w-2/3 p-6 mx-auto">
              <CardDetailView
                uploadData={item.result || item}
                previewUrl={item.imageUrl}
              />
            </div>
          </div>
        ))}

      <div className="flex justify-center mt-8">
        <button
          onClick={handleReset}
          className="px-8 py-3 bg-gradient-to-r from-red-500 to-indigo-600 hover:from-red-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg transform hover:scale-105"
        >
          กลับไปอัปโหลดรูปใหม่
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen items-center justify-center bg-gradient-to-b from-red-100 to-white">
      <Header />
      <div className="w-full h-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-red-100 items-center">
        {!uploadData ? renderUploadSection() : renderResultsSection()}
      </div>
      <Footer />
    </div>
  );
};

export default UploadView;