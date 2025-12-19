import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom pharmacy icon
const pharmacyIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
            <circle cx="12" cy="12" r="11" fill="#10b981" stroke="#fff" stroke-width="2"/>
            <path d="M16 11h-3V8h-2v3H8v2h3v3h2v-3h3z" fill="#fff"/>
        </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

// Component to recenter map when needed
const RecenterMap = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
};

const Map = () => {
    const [pharmacies, setPharmacies] = useState([]);
    const [neighborhoods, setNeighborhoods] = useState([]);
    const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');
    const [loading, setLoading] = useState(true);
    const [mapCenter, setMapCenter] = useState([35.6476, 36.6746]); // Maarrat al-Nu'man coordinates
    const [searchTerm, setSearchTerm] = useState('');
    const [userLocation, setUserLocation] = useState(null);
    const [isLocating, setIsLocating] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [pharmaciesRes, neighborhoodsRes] = await Promise.all([
                axios.get('/api/v1/pharmacies'),
                axios.get('/api/v1/neighborhoods'),
            ]);

            // Handle different response structures
            const pharmaciesData = Array.isArray(pharmaciesRes.data)
                ? pharmaciesRes.data
                : (pharmaciesRes.data.data || []);

            const neighborhoodsData = Array.isArray(neighborhoodsRes.data)
                ? neighborhoodsRes.data
                : (neighborhoodsRes.data.data || []);

            setPharmacies(pharmaciesData);
            setNeighborhoods(neighborhoodsData);
        } catch (error) {
            console.error('Error fetching data:', error);
            setPharmacies([]);
            setNeighborhoods([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            alert('متصفحك لا يدعم تحديد الموقع');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const newPos = [latitude, longitude];
                setUserLocation(newPos);
                setMapCenter(newPos);
                setIsLocating(false);
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('فشل في تحديد موقعك. يرجى تفعيل خدمة الموقع.');
                setIsLocating(false);
            }
        );
    };

    const filteredPharmacies = pharmacies.filter(pharmacy => {
        const matchesNeighborhood = selectedNeighborhood === 'all' ||
            pharmacy.neighborhood_id === parseInt(selectedNeighborhood);
        const matchesSearch = pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesNeighborhood && matchesSearch && pharmacy.latitude && pharmacy.longitude;
    });

    const handlePharmacyClick = (pharmacy) => {
        setMapCenter([parseFloat(pharmacy.latitude), parseFloat(pharmacy.longitude)]);
    };

    const UserLocationMarker = () => userLocation ? (
        <Marker
            position={userLocation}
            icon={new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })}
        >
            <Popup>موقعك الحالي</Popup>
        </Marker>
    ) : null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 font-sans text-slate-900 dark:text-white py-10">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                        خريطة الصيدليات
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-gray-400 max-w-2xl mx-auto">
                        اعثر على أقرب صيدلية إليك بسهولة وتعرف على الصيدليات المناوبة في منطقتك
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Search */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                                بحث عن صيدلية
                            </label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="ابحث بالاسم أو العنوان..."
                                className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500"
                            />
                            <div className="absolute left-3 top-[38px] text-slate-400 dark:text-gray-500">
                                🔍
                            </div>
                        </div>

                        {/* Neighborhood Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                                تصفية حسب الحي
                            </label>
                            <select
                                value={selectedNeighborhood}
                                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-white"
                            >
                                <option value="all">جميع الأحياء</option>
                                {neighborhoods.map(neighborhood => (
                                    <option key={neighborhood.id} value={neighborhood.id}>
                                        {neighborhood.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-gray-700">
                        <p className="text-sm text-slate-500 dark:text-gray-400">
                            عرض <span className="font-bold text-slate-900 dark:text-white">{filteredPharmacies.length}</span> صيدلية
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleLocateMe}
                                disabled={isLocating}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                            >
                                {isLocating ? (
                                    <span className="w-4 h-4 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    <span>📍</span>
                                )}
                                تحديد موقعي
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedNeighborhood('all');
                                    setSearchTerm('');
                                }}
                                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                إعادة تعيين الفلاتر
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Pharmacies List */}
                    <div className="lg:col-span-1 order-2 lg:order-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 flex flex-col h-[600px]">
                            <div className="p-4 border-b border-slate-100 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-700/50 rounded-t-2xl">
                                <h3 className="font-bold text-slate-800 dark:text-white">قائمة الصيدليات</h3>
                            </div>

                            <div className="overflow-y-auto flex-1 p-4 space-y-3 custom-scrollbar">
                                {loading ? (
                                    <div className="flex justify-center items-center h-40">
                                        <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                                    </div>
                                ) : filteredPharmacies.length === 0 ? (
                                    <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50">
                                        <span className="text-3xl block mb-2 opacity-50">🧐</span>
                                        <p className="text-slate-500 text-sm">لا توجد نتائج مطابقة لبحثك</p>
                                    </div>
                                ) : (
                                    filteredPharmacies.map(pharmacy => (
                                        <div
                                            key={pharmacy.id}
                                            onClick={() => handlePharmacyClick(pharmacy)}
                                            className="group p-4 bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 rounded-xl cursor-pointer transition-all duration-200"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                    {pharmacy.name}
                                                </h4>
                                                {pharmacy.neighborhood && (
                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-md border border-slate-200">
                                                        {pharmacy.neighborhood.name}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                                                {pharmacy.address}
                                            </p>

                                            {pharmacy.phone && (
                                                <div className="flex items-center gap-2 text-xs font-medium text-slate-400 pt-3 border-t border-slate-50">
                                                    <span>📞</span>
                                                    <span dir="ltr" className="text-slate-600">{pharmacy.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="lg:col-span-2 order-1 lg:order-2">
                        <div className="bg-slate-100 dark:bg-gray-700 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-600 overflow-hidden h-[600px] relative z-0">
                            {loading ? (
                                <div className="absolute inset-0 flex flex-col justify-center items-center bg-slate-50 z-10">
                                    <div className="w-10 h-10 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                                    <p className="text-slate-500 font-medium">جارِ تحميل الخريطة...</p>
                                </div>
                            ) : (
                                <MapContainer
                                    center={mapCenter}
                                    zoom={16}
                                    style={{ height: '100%', width: '100%' }}
                                    scrollWheelZoom={true}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <RecenterMap center={mapCenter} />
                                    <UserLocationMarker />
                                    {filteredPharmacies.map(pharmacy => (
                                        <Marker
                                            key={pharmacy.id}
                                            position={[parseFloat(pharmacy.latitude), parseFloat(pharmacy.longitude)]}
                                            icon={pharmacyIcon}
                                        >
                                            <Popup>
                                                <div className="min-w-[220px] font-sans text-right" dir="rtl">
                                                    <div className="border-b border-gray-100 pb-2 mb-2">
                                                        <h3 className="font-bold text-lg text-slate-900">{pharmacy.name}</h3>
                                                        {pharmacy.neighborhood && (
                                                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                                                {pharmacy.neighborhood.name}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2 mb-3">
                                                        <p className="text-sm text-slate-600 flex items-start gap-2">
                                                            <span>📍</span>
                                                            <span>{pharmacy.address}</span>
                                                        </p>
                                                        {pharmacy.phone && (
                                                            <p className="text-sm text-slate-600 flex items-center gap-2 font-mono" dir="ltr">
                                                                <span>📞</span>
                                                                <a href={`tel:${pharmacy.phone}`} className="hover:text-blue-600 transition-colors">
                                                                    {pharmacy.phone}
                                                                </a>
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <a
                                                            href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex-1 text-center py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1"
                                                        >
                                                            <span>🗺️</span>
                                                            الاتجاهات
                                                        </a>
                                                    </div>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}
                                </MapContainer>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Map;
