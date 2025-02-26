import React, { useState, useRef, useEffect } from "react";
import { handleUpload_service } from "../service/analysis_damage";

const UploadView = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadData, setUploadData] = useState(null); // State to store uploaded data
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("กรุณาเลือกไฟล์ก่อนอัปโหลด");
      return;
    }
  
    try {
      setIsUploading(true);
      setUploadProgress(0); 
      const formData = new FormData();
      formData.append("image", selectedFile);
      const res = await handleUpload_service(formData, setUploadProgress);
      setUploadData(res);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("เกิดข้อผิดพลาดในการอัปโหลด");
    } finally {
      setIsUploading(false);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleReset = () => {
    // Reset all states to go back to upload view
    setUploadData(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-100 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full h-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-blue-100 items-center">
        {!uploadData ? (
          // Upload Section - only show if no uploadData
          <>
            <div className="flex flex-col items-center">
              {/* Logo */}
              <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full mb-4 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-12 h-12"
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
                กรุณาเลือกรูปภาพและกำหนดราคาที่ต้องการ
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                  isDragging ? "border-blue-500 bg-blue-50" : "border-blue-200"
                } ${
                  previewUrl ? "py-4" : "py-10"
                } hover:border-blue-400 hover:bg-blue-50`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {previewUrl ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-64 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)}{" "}
                      KB)
                    </p>
                    <button
                      onClick={triggerFileInput}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium underline transition-colors duration-200"
                    >
                      เปลี่ยนรูปภาพ
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <svg
                      className="mx-auto h-16 w-16 text-blue-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
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
                        className="text-blue-600 hover:text-blue-500 font-medium"
                      >
                        คลิกเพื่อเลือกไฟล์
                      </button>
                    </p>
                    <p className="text-xs text-gray-500">
                      รองรับไฟล์ PNG, JPG และ GIF ขนาดไม่เกิน 10MB
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
              />

              {isUploading && (
                <div className="space-y-2">
                  <div className="w-full bg-blue-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 text-center">
                    กำลังอัปโหลด {uploadProgress}%
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className={`flex-1 rounded-md border border-transparent py-3 px-4 text-sm font-medium text-white transition-all duration-200 shadow-lg ${
                    !selectedFile || isUploading
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  }`}
                >
                  อัปโหลด
                </button>
              </div>
            </div>
          </>
        ) : (
          // Results Card - show only if uploadData exists
          <div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl overflow-hidden shadow-lg border border-blue-100">
              <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="white"
                      className="w-6 h-6"
                    >
                      <path d="M12 10.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM12 2a6 6 0 00-6 6c0 4.5 6 11 6 11s6-6.5 6-11a6 6 0 00-6-6zm0 9a3 3 0 110-6 3 3 0 010 6z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    รายละเอียดการวิเคราะห์
                  </h3>
                </div>

                {/* คอนเทนเนอร์หลัก */}
                <div className="flex flex-col md:flex-row gap-6">
                  {/* ส่วนแสดงรูปภาพ */}
                  <div className="md:w-2/5">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg blur opacity-25 group-hover:opacity-70 transition duration-300"></div>
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Uploaded"
                          className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ส่วนแสดงข้อมูลการวิเคราะห์ */}
                  <div className="md:w-3/5 space-y-4">
                    {/* ระดับความรุนแรง */}
                    <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-100">
                      <div className="flex items-center space-x-2 mb-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            uploadData.severity === "ร้ายแรง"
                              ? "bg-red-500"
                              : uploadData.severity === "ปานกลาง"
                              ? "bg-orange-500"
                              : "bg-yellow-500"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="white"
                            className="w-5 h-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <h4 className="font-semibold text-gray-800">
                          ระดับความรุนแรง
                        </h4>
                      </div>
                      <p
                        className={`ml-10 text-base font-medium ${
                          uploadData.severity === "รุนแรงมาก"
                            ? "text-red-600"
                            : uploadData.severity === "รุนแรงปานกลาง"
                            ? "text-orange-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {uploadData.severity}
                      </p>
                    </div>

                    {/* รายละเอียด */}
                    <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-100">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="white"
                            className="w-5 h-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <h4 className="font-semibold text-gray-800">
                          รายละเอียด
                        </h4>
                      </div>
                      <p className="ml-10 text-gray-700">
                        {uploadData.description}
                      </p>
                    </div>

                    {/* คำแนะนำ */}
                    <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-100">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="white"
                            className="w-5 h-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <h4 className="font-semibold text-gray-800">คำแนะนำ</h4>
                      </div>
                      <div className="ml-10 text-gray-700">
                        <p>{uploadData.recommendations}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ส่วนแสดงรายการที่ต้องซ่อม */}
                <div className="mt-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="white"
                        className="w-6 h-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 6.75a5.25 5.25 0 016.775-5.025.75.75 0 01.313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 011.248.313 5.25 5.25 0 01-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 112.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0112 6.75zM4.117 19.125a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      รายการที่ต้องซ่อม
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {uploadData.fixinglist &&
                      uploadData.fixinglist.map((item, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-100 flex items-start"
                        >
                          <div
                            className={`min-w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                              item.status.includes("เปลี่ยน")
                                ? "bg-red-500"
                                : item.status.includes("ซ่อมแซม")
                                ? "bg-orange-500"
                                : "bg-blue-500"
                            }`}
                          >
                            {item.status.includes("เปลี่ยน") ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="white"
                                className="w-5 h-5"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : item.status.includes("ซ่อมแซม") ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="white"
                                className="w-5 h-5"
                              >
                                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="white"
                                className="w-5 h-5"
                              >
                                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                <path
                                  fillRule="evenodd"
                                  d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {item.tool}
                            </h4>
                            <p
                              className={`text-sm mt-1 ${
                                item.status.includes("เปลี่ยน")
                                  ? "text-red-600"
                                  : item.status.includes("ซ่อมแซม")
                                  ? "text-orange-600"
                                  : "text-blue-600"
                              }`}
                            >
                              {item.status}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* "Back" button at the bottom of the detail card */}
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>กลับไปหน้าอัปโหลด</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadView;