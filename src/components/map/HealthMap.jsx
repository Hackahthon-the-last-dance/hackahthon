// Interactive Healthcare Map using Leaflet & OpenStreetMap
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Navigation,
  Search,
  Phone,
  Clock,
  Star,
  ExternalLink,
  ShieldAlert,
  Hospital,
  Stethoscope,
  Pill,
  Heart,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../common/Button';
import Badge from '../common/Badge';
import ImageWithFallback from '../common/ImageWithFallback';
import DirectionsModal from './DirectionsModal';

export default function HealthMap({ onSelectClinic, selectedClinicId, showEmergencyFilter = false }) {
  const { clinics, userLocation, locationPermission, requestUserLocation, addToast } = useApp();
  
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(showEmergencyFilter ? 'urgent_care' : 'all');
  const [activeClinicForDirections, setActiveClinicForDirections] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(() => {
    return clinics.find((c) => c.id === selectedClinicId) || clinics[0];
  });
  const [mapError, setMapError] = useState(false);

  // Filter clinics
  const filteredClinics = React.useMemo(() => {
    return clinics.filter((clinic) => {
      const matchCategory =
        activeCategory === 'all'
          ? true
          : activeCategory === 'emergency'
          ? clinic.emergencyCapable || clinic.isOpen24Hours
          : clinic.category === activeCategory;

      const matchSearch =
        clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCategory && matchSearch;
    });
  }, [clinics, activeCategory, searchQuery]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      // Create Leaflet map if not exists
      if (!mapInstanceRef.current) {
        const centerLat = userLocation?.lat || 37.7880;
        const centerLng = userLocation?.lng || -122.4075;

        const map = L.map(mapContainerRef.current, {
          center: [centerLat, centerLng],
          zoom: 14,
          zoomControl: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        markersGroupRef.current = L.layerGroup().addTo(map);
        mapInstanceRef.current = map;
      }
    } catch (err) {
      console.error('Leaflet initialization error:', err);
      setMapError(true);
    }

    return () => {
      // Clean up map instance on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when clinics or user location change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // 1. Add User Location Marker
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div style="
            width: 22px; 
            height: 22px; 
            background: #0284c7; 
            border: 3px solid #ffffff; 
            border-radius: 50%; 
            box-shadow: 0 0 0 6px rgba(2, 132, 199, 0.3), 0 4px 8px rgba(0,0,0,0.3);
          "></div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .bindPopup(`<strong>Your Location</strong><br/>${userLocation.address || 'Active device position'}`);
      markersGroup.addLayer(userMarker);
    }

    // 2. Add Clinic Markers
    filteredClinics.forEach((clinic) => {
      const isSelected = selectedClinic?.id === clinic.id;
      const isER = clinic.emergencyCapable;
      const markerColor = isER ? '#f43f5e' : '#0d9488';

      const clinicIcon = L.divIcon({
        className: 'custom-clinic-marker',
        html: `
          <div style="
            width: ${isSelected ? '38px' : '32px'}; 
            height: ${isSelected ? '38px' : '32px'}; 
            background: ${markerColor}; 
            color: #ffffff;
            border: 2px solid #ffffff; 
            border-radius: 50% 50% 50% 0; 
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            transition: all 0.2s ease;
          ">
            <div style="transform: rotate(45deg); font-size: 13px; font-weight: bold;">
              ${isER ? '+' : '🏥'}
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });

      const marker = L.marker([clinic.lat, clinic.lng], { icon: clinicIcon });

      marker.on('click', () => {
        setSelectedClinic(clinic);
        if (onSelectClinic) onSelectClinic(clinic);
        map.flyTo([clinic.lat, clinic.lng], 15, { duration: 0.8 });
      });

      const popupHtml = `
        <div style="font-family: var(--font-sans); min-width: 180px; padding: 4px;">
          <h4 style="margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #0f172a;">${clinic.name}</h4>
          <p style="margin: 0 0 6px; font-size: 12px; color: #64748b;">${clinic.address}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 600; color: #0d9488;">
            <span>★ ${clinic.rating} (${clinic.reviewsCount})</span>
            <span>${clinic.distanceMiles} mi</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      markersGroup.addLayer(marker);
    });
  }, [filteredClinics, selectedClinic, userLocation, onSelectClinic]);

  // Pan to clinic when clicked from sidebar list
  const handleClinicCardClick = (clinic) => {
    setSelectedClinic(clinic);
    if (onSelectClinic) onSelectClinic(clinic);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([clinic.lat, clinic.lng], 15, { duration: 0.8 });
    }
  };

  const categories = [
    { id: 'all', label: 'All Facilities' },
    { id: 'emergency', label: '🚨 24/7 Emergency & ER' },
    { id: 'hospital', label: 'Hospitals' },
    { id: 'primary_care', label: 'Primary Care' },
    { id: 'urgent_care', label: 'Urgent Care' },
    { id: 'pharmacy', label: 'Pharmacies' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* Search & Category Filter Pills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-full)',
              padding: '10px 18px',
              flex: 1,
              minWidth: '260px',
              maxWidth: '480px',
            }}
          >
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search clinic name, service, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '0.9375rem',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Location Permission Trigger */}
          <Button
            variant={locationPermission === 'granted' ? 'subtle' : 'secondary'}
            size="md"
            icon={Navigation}
            onClick={requestUserLocation}
            loading={locationPermission === 'requesting'}
            loadingText="Locating..."
          >
            {locationPermission === 'granted' ? 'Device Location Active' : 'Locate Nearest'}
          </Button>
        </div>

        {/* Category Filter Chips */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: activeCategory === cat.id ? '1px solid var(--primary)' : '1px solid var(--border-card)',
                backgroundColor: activeCategory === cat.id ? 'var(--primary-light)' : 'var(--bg-surface)',
                color: activeCategory === cat.id ? 'var(--primary)' : 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all var(--trans-fast)',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map + Clinic List Split Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 380px) 1fr',
          gap: '20px',
          minHeight: '520px',
        }}
        className="map-layout-grid"
      >
        {/* Left Side: Clinic Cards List */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxHeight: '540px',
            overflowY: 'auto',
            paddingRight: '6px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Nearby Healthcare Centers ({filteredClinics.length})
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Radius: 5 miles</span>
          </div>

          {filteredClinics.length === 0 ? (
            <div
              style={{
                padding: '32px 16px',
                textAlign: 'center',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--border-card)',
              }}
            >
              <MapPin size={32} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
              <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>No clinics match your filter</p>
              <Button
                variant="subtle"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                style={{ marginTop: '12px' }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            filteredClinics.map((clinic) => {
              const isSelected = selectedClinic?.id === clinic.id;
              return (
                <div
                  key={clinic.id}
                  onClick={() => handleClinicCardClick(clinic)}
                  style={{
                    backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-surface)',
                    border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-card)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all var(--trans-fast)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  }}
                  className="card-hoverable"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        {clinic.emergencyCapable ? (
                          <Badge variant="danger" size="sm" icon={ShieldAlert}>
                            24/7 ER
                          </Badge>
                        ) : (
                          <Badge variant="primary" size="sm">
                            {clinic.category.replace('_', ' ').toUpperCase()}
                          </Badge>
                        )}
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
                          ★ {clinic.rating} ({clinic.reviewsCount})
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        {clinic.name}
                      </h4>
                    </div>

                    <span
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        color: 'var(--primary)',
                        backgroundColor: 'var(--bg-input)',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        flexShrink: 0,
                      }}
                    >
                      {clinic.distanceMiles} mi
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="var(--text-muted)" />
                    {clinic.address}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.75rem', color: clinic.isOpen24Hours ? 'var(--accent-emerald)' : 'var(--text-muted)', fontWeight: 600 }}>
                      ● {clinic.openStatus}
                    </span>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveClinicForDirections(clinic);
                        }}
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-xs)',
                          backgroundColor: 'var(--primary-light)',
                        }}
                      >
                        <Navigation size={12} />
                        Directions
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Interactive Leaflet Map Container */}
        <div
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            border: '1px solid var(--border-card)',
            boxShadow: 'var(--shadow-md)',
            minHeight: '480px',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          {mapError ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <MapPin size={48} color="var(--primary)" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Interactive Map Fallback</h3>
              <p style={{ maxWidth: '400px', fontSize: '0.875rem', marginTop: '4px' }}>
                Map tiles are cached. You can select clinics from the list on the left to view comprehensive details and directions.
              </p>
            </div>
          ) : (
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%', minHeight: '480px' }} />
          )}

          {/* Selected Clinic Floating Quick View Box on Map */}
          {selectedClinic && (
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                right: '16px',
                maxWidth: '460px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-card)',
                zIndex: 400,
                display: 'flex',
                gap: '14px',
                alignItems: 'center',
              }}
              className="animate-slide-up"
            >
              <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                <ImageWithFallback
                  src={selectedClinic.image}
                  alt={selectedClinic.name}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {selectedClinic.name}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 6px' }}>
                  {selectedClinic.address} • {selectedClinic.distanceMiles} mi
                </p>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Navigation}
                    onClick={() => setActiveClinicForDirections(selectedClinic)}
                  >
                    Directions
                  </Button>

                  <a
                    href={`tel:${selectedClinic.phone}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Button variant="secondary" size="sm" icon={Phone}>
                      Call
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Directions Modal */}
      {activeClinicForDirections && (
        <DirectionsModal
          isOpen={Boolean(activeClinicForDirections)}
          clinic={activeClinicForDirections}
          userLocation={userLocation}
          onClose={() => setActiveClinicForDirections(null)}
        />
      )}
    </div>
  );
}
