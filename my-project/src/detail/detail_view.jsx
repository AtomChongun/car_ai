import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, ArrowLeft, Navigation, Phone, Star, Clock } from 'lucide-react';

// กำหนด API Key สำหรับ Google Maps (ในการใช้งานจริงควรเก็บไว้ใน .env)

const AutoRepairDetail = () => {
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyShops, setNearbyShops] = useState([]);
  const [map, setMap] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();
  
  // Mock data for the repair case details
  const damageDetail = {
    status: "ร้ายแรง", // Severe status matching the upload form's option
    date: "21/02/2568", // Thai Buddhist calendar year
    price: "20000 บาท", // Price in Thai Baht
    image: "/api/placeholder/400/320", // Placeholder for damage image
  };

  // เริ่มต้นการทำงานเมื่อโหลดคอมโพเนนต์
  useEffect(() => {
    // โหลด Google Maps JavaScript API
    const loadGoogleMapsApi = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setMapLoading(false);
        getUserLocation();
      };
      document.head.appendChild(script);
    };

    loadGoogleMapsApi();
    
    // ล้างการโหลดข้อมูลหลัก
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // ขอตำแหน่งผู้ใช้ปัจจุบันโดยใช้ GPS จากเครื่อง
  const getUserLocation = () => {
    setLocationError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log("Got user location:", currentLocation);
          setUserLocation(currentLocation);
          initializeMap(currentLocation);
        },
        (error) => {
          console.error("Error getting user location:", error);
          setLocationError(`ไม่สามารถรับตำแหน่งได้: ${getLocationErrorMessage(error.code)}`);
          
          // กรณีไม่สามารถรับตำแหน่งได้ ใช้ตำแหน่งเริ่มต้นที่กรุงเทพฯ
          const bangkokLocation = { lat: 13.7563, lng: 100.5018 };
          setUserLocation(bangkokLocation);
          initializeMap(bangkokLocation);
        },
        { 
          enableHighAccuracy: true, 
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLocationError("เบราว์เซอร์นี้ไม่รองรับการระบุตำแหน่ง");
      
      const bangkokLocation = { lat: 13.7563, lng: 100.5018 };
      setUserLocation(bangkokLocation);
      initializeMap(bangkokLocation);
    }
  };

  // แปลรหัสข้อผิดพลาดเป็นข้อความภาษาไทย
  const getLocationErrorMessage = (errorCode) => {
    switch(errorCode) {
      case 1:
        return "คุณไม่อนุญาตให้เข้าถึงตำแหน่ง";
      case 2:
        return "ไม่สามารถรับตำแหน่งได้";
      case 3:
        return "การรับตำแหน่งใช้เวลานานเกินไป";
      default:
        return "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";
    }
  };

  // สร้างแผนที่ Google Maps
  const initializeMap = (location) => {
    if (!window.google || mapLoading) return;

    const mapOptions = {
      center: location,
      zoom: 14,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    };

    const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);

    // เพิ่ม marker ตำแหน่งผู้ใช้
    new window.google.maps.Marker({
      position: location,
      map: newMap,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#4285F4",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      },
      title: "ตำแหน่งของคุณ"
    });

    // ค้นหาอู่ซ่อมรถใกล้เคียง
    searchNearbyRepairShops(location, newMap);
  };

  // ค้นหาอู่ซ่อมรถใกล้เคียงด้วย Places API
  const searchNearbyRepairShops = (location, mapInstance) => {
    if (!window.google || !mapInstance) return;

    const placesService = new window.google.maps.places.PlacesService(mapInstance);
    
    const request = {
      location: location,
      radius: 5000, // ค้นหาในรัศมี 5 กิโลเมตร
      keyword: 'อู่ซ่อมรถ',
      type: ['car_repair'], // ประเภทสถานที่
    };

    placesService.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const shops = results.map((place, index) => {
          // สร้าง marker สำหรับแต่ละอู่
          const marker = new window.google.maps.Marker({
            position: place.geometry.location,
            map: mapInstance,
            title: place.name,
            animation: window.google.maps.Animation.DROP,
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            }
          });

          // สร้าง InfoWindow สำหรับแสดงข้อมูลเมื่อคลิกที่ marker
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 5px;">
                <strong>${place.name}</strong><br>
                ${place.vicinity || ''}<br>
                ${place.rating ? `Rating: ${place.rating} (${place.user_ratings_total || 0} รีวิว)` : 'ยังไม่มีรีวิว'}
              </div>
            `,
          });

          // เพิ่ม event listener เมื่อคลิกที่ marker
          marker.addListener('click', () => {
            infoWindow.open(mapInstance, marker);
          });

          // คำนวณระยะทางจากตำแหน่งผู้ใช้ไปยังอู่
          const distance = calculateDistance(
            location.lat, location.lng,
            place.geometry.location.lat(), place.geometry.location.lng()
          );

          // ดึงข้อมูลเพิ่มเติมของสถานที่
          getPlaceDetails(place.place_id, placesService);

          return {
            id: place.place_id,
            name: place.name,
            rating: place.rating || 0,
            ratingCount: place.user_ratings_total || 0,
            distance: `${distance.toFixed(1)} กม.`,
            address: place.vicinity || '',
            openStatus: place.opening_hours?.open_now ? "เปิดอยู่" : "ปิดแล้ว",
            phone: "", // จะถูกอัพเดทเมื่อได้รับข้อมูลเพิ่มเติม
            marker: marker,
            location: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            }
          };
        });

        setNearbyShops(shops);
      } else {
        console.error("Error fetching nearby shops:", status);
      }
    });
  };

  // ขอข้อมูลเพิ่มเติมของสถานที่
  const getPlaceDetails = (placeId, placesService) => {
    const request = {
      placeId: placeId,
      fields: ['formatted_phone_number', 'opening_hours']
    };

    placesService.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setNearbyShops(prevShops => 
          prevShops.map(shop => {
            if (shop.id === placeId) {
              let openStatusText = "ไม่ทราบเวลาทำการ";
              
              if (place.opening_hours) {
                const today = new Date().getDay();
                const todayHours = place.opening_hours.weekday_text ? 
                  place.opening_hours.weekday_text[today] : null;
                
                openStatusText = place.opening_hours.isOpen() ? 
                  `เปิดอยู่ ${todayHours ? '· ' + todayHours.split(': ')[1] : ''}` : 
                  `ปิดแล้ว ${todayHours ? '· ' + todayHours.split(': ')[1] : ''}`;
              }
              
              return {
                ...shop,
                phone: place.formatted_phone_number || "",
                openStatus: openStatusText
              };
            }
            return shop;
          })
        );
      }
    });
  };

  // คำนวณระยะทางระหว่างสองตำแหน่ง (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // รัศมีของโลกในหน่วย km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // ระยะทางในหน่วย km
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // ฟังก์ชันทดลองค้นหาอู่ใหม่
  const handleRetryLocation = () => {
    getUserLocation();
  };

  // ฟังก์ชันเปิด Google Maps เพื่อนำทางไปยังอู่
  const openDirections = (shop) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${shop.location.lat},${shop.location.lng}&destination_place_id=${shop.id}`;
    window.open(url, '_blank');
  };

  // ฟังก์ชันโทรหาอู่
  const handleCall = (phone) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    } else {
      alert("ไม่พบข้อมูลเบอร์โทรศัพท์");
    }
  };

  // ฟังก์ชันเลือกดูรายละเอียดอู่
  const handleSelectShop = (shop) => {
    setSelectedShop(shop);
    
    if (map && shop.marker) {
      map.setCenter(shop.location);
      map.setZoom(16);
      
      // แสดง InfoWindow
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 5px;">
            <strong>${shop.name}</strong><br>
            ${shop.address || ''}<br>
            ${shop.rating ? `Rating: ${shop.rating} (${shop.ratingCount} รีวิว)` : 'ยังไม่มีรีวิว'}
          </div>
        `,
      });
      
      infoWindow.open(map, shop.marker);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-md mx-auto flex items-center">
          <button 
            onClick={handleBack}
            className="mr-3 p-1 rounded-full hover:bg-red-400 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">{damageDetail.status}</h1>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="max-w-md mx-auto px-4 py-6">
          {/* Damage Details Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">รายละเอียด</h2>
            <div className="bg-white rounded-xl p-4 shadow-md border border-blue-100">
              <div className="mb-4">
                <img 
                  src={damageDetail.image} 
                  alt="ภาพความเสียหาย" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="flex items-center mb-3">
                <Calendar className="text-blue-500 mr-3" size={20} />
                <div>
                  <span className="font-medium">วันที่: </span>
                  {damageDetail.date}
                </div>
              </div>
              <div className="flex items-center">
                <DollarSign className="text-blue-500 mr-3" size={20} />
                <div>
                  <span className="font-medium">มูลค่าความเสียหาย: </span>
                  {damageDetail.price}
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">ร้านซ่อม</h2>
              <div className="text-sm text-blue-600">ค้นหา: "อู่ซ่อมรถใกล้ฉัน"</div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-md border border-blue-100">
              {/* Map Container with actual Google Maps */}
              <div 
                ref={mapRef} 
                className="h-64 rounded-lg mb-4 relative overflow-hidden"
                style={{ background: '#f0f0f0' }}
              >
                {!userLocation && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <p className="text-gray-600">กำลังโหลดแผนที่...</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Location error message if any */}
              {locationError && (
                <div className="bg-red-50 rounded-lg p-3 mb-4 text-red-700 text-sm">
                  <p>{locationError}</p>
                  <button 
                    onClick={handleRetryLocation}
                    className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 rounded-lg transition-colors text-red-800"
                  >
                    ลองอีกครั้ง
                  </button>
                </div>
              )}
              
              {/* Nearby shops list with real data */}
              <div className="space-y-3">
                <p className="text-sm text-gray-500 mb-2">
                  {nearbyShops.length > 0 
                    ? `อู่ซ่อมรถใกล้เคียง (${nearbyShops.length})` 
                    : "กำลังค้นหาอู่ซ่อมรถใกล้เคียง..."}
                </p>
                
                {nearbyShops.length === 0 && userLocation && (
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-blue-600">กำลังค้นหาอู่ซ่อมรถใกล้เคียง...</p>
                  </div>
                )}
                
                {nearbyShops.map(shop => (
                  <div 
                    key={shop.id} 
                    className={`bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors ${selectedShop?.id === shop.id ? 'border-2 border-blue-500' : ''}`}
                    onClick={() => handleSelectShop(shop)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{shop.name}</h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="text-yellow-500 mr-1" size={14} />
                          <span>{shop.rating.toFixed(1)}</span>
                          <span className="mx-1">•</span>
                          <span>รีวิว {shop.ratingCount}</span>
                          <span className="mx-1">•</span>
                          <span>{shop.distance}</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{shop.address}</div>
                        <div className="flex items-center text-sm text-green-600 mt-1">
                          <Clock size={14} className="mr-1" />
                          <span>{shop.openStatus}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCall(shop.phone);
                        }}
                        disabled={!shop.phone}
                        className={`flex-1 flex items-center justify-center py-2 rounded-md text-sm font-medium transition-colors ${
                          shop.phone 
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200" 
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <Phone size={16} className="mr-1" />
                        <span>โทร</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openDirections(shop);
                        }}
                        className="flex-1 flex items-center justify-center py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Navigation size={16} className="mr-1" />
                        <span>นำทาง</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoRepairDetail;