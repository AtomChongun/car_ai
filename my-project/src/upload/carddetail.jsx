import React, { useState } from "react";

const CardDetailView = ({ uploadData, previewUrl, handleReset }) => {
  // Function to search for repair shops on Google Maps
  const searchRepairShopsOnGoogleMaps = (toolName) => {
    // Encode the search query
    const query = encodeURIComponent(`อู่ซ่อม${toolName}ใกล้ฉัน`);
    // Open Google Maps in a new tab with the search query
    window.open(`https://www.google.com/maps/search/${query}`, "_blank");
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl overflow-hidden shadow-lg border border-slate-200">
        <div className="p-1 bg-gradient-to-r from-slate-500 to-zinc-500"></div>

        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-slate-500 to-zinc-600 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-6 h-6"
              >
                <path d="M12 10.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM12 2a6 6 0 00-6 6c0 4.5 6 11 6 11s6-6.5 6-11a6 6 0 00-6-6zm0 9a3 3 0 110-6 3 3 0 010 6z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-zinc-700 bg-clip-text text-transparent">
              รายละเอียดการวิเคราะห์
            </h3>
          </div>

          {/* คอนเทนเนอร์หลัก */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* ส่วนแสดงรูปภาพ */}
            <div className="md:w-2/5">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-slate-400 to-zinc-500 rounded-lg blur opacity-25 group-hover:opacity-70 transition duration-300"></div>
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
              {uploadData.models && (
                <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-slate-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
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
                    <h4 className="font-semibold text-gray-800">รุ่นรถ</h4>
                  </div>
                  <div className="ml-10 text-gray-700">
                    <p>{uploadData.models}</p>
                  </div>
                </div>
              )}

              {/* ระดับความรุนแรง */}
              {uploadData.severity && (
                <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-slate-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        uploadData.severity === "ร้ายแรง"
                          ? "bg-rose-500"
                          : uploadData.severity === "ปานกลาง"
                          ? "bg-amber-500"
                          : "bg-yellow-400"
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
                      uploadData.severity === "ร้ายแรง"
                        ? "text-rose-600"
                        : uploadData.severity === "ปานกลาง"
                        ? "text-amber-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {uploadData.severity}
                  </p>
                </div>
              )}

              {/* รายละเอียด */}
              {uploadData.description && (
                <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-slate-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-slate-500 flex items-center justify-center">
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
                    <h4 className="font-semibold text-gray-800">รายละเอียด</h4>
                  </div>
                  <p className="ml-10 text-gray-700">
                    {uploadData.description}
                  </p>
                </div>
              )}

              {/* คำแนะนำ */}

              {uploadData.recommendations && (
                <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-slate-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
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
              )}

              {uploadData.price && (
                <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-slate-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
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
                      ราคาที่ใช้ในการซ่อม
                    </h4>
                  </div>
                  <div className="ml-10 text-gray-700">
                    <p>{uploadData.price}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ส่วนแสดงรายการที่ต้องซ่อม */}
          <div className="mt-8">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-slate-500 to-zinc-600 flex items-center justify-center">
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
              <h3 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-zinc-700 bg-clip-text text-transparent">
                รายการที่ต้องซ่อม
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uploadData.fixinglist &&
                uploadData.fixinglist.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-slate-200 flex items-start cursor-pointer"
                    onClick={() => searchRepairShopsOnGoogleMaps(item.tool)}
                  >
                    <div
                      className={`min-w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        item.status.includes("เปลี่ยน")
                          ? "bg-rose-500"
                          : item.status.includes("ซ่อมแซม")
                          ? "bg-amber-500"
                          : "bg-slate-500"
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
                      <h4 className="font-medium text-gray-800">{item.tool}</h4>
                      <p className="text-sm mt-1 text-slate-600">
                        รายละเอียด : {item.detail}
                      </p>
                      <p
                        className={`text-sm mt-1 ${
                          item.status.includes("เปลี่ยน")
                            ? "text-rose-600"
                            : item.status.includes("ซ่อมแซม")
                            ? "text-amber-600"
                            : "text-slate-600"
                        }`}
                      >
                        {item.status}
                      </p>
                      <p className="text-xs mt-1 text-blue-600">
                        คลิกเพื่อค้นหาอู่ซ่อมใกล้คุณ
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailView;
