import React, { useState, useEffect, useCallback } from 'react';
import { Map, MapMarker, MarkerClusterer, Circle, useMap } from 'react-kakao-maps-sdk';
import axios from 'axios';
import '../styles/FacilityFinderPage.css';
import { debounce } from 'lodash';

function FacilityFinderPage() {
  const [facilities, setFacilities] = useState([]);
  const [center, setCenter] = useState({ lat: 37.566826, lng: 126.9786567 });
  const [level, setLevel] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [searchRadius, setSearchRadius] = useState(250); // 초기 검색 반경 (미터 단위)

  const calculateRadius = useCallback((map) => {
    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const center = map.getCenter();
  
    const latDiff = Math.abs(ne.getLat() - sw.getLat()) / 2;
    const lngDiff = Math.abs(ne.getLng() - sw.getLng()) / 2;
  
    // 위도와 경도 차이 중 더 작은 값을 선택
    const smallerDiff = Math.min(latDiff, lngDiff);
  
    // Haversine을 이용하여 거리 계산 (km 단위)
    const R = 6371;
    const dLat = smallerDiff * Math.PI / 180;
    const dLon = smallerDiff * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(center.getLat() * Math.PI / 180) * Math.cos((center.getLat() + smallerDiff) * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  
    return  R * c * 1000; // 미터 단위로 변환
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchFacilities = useCallback(debounce(async (map) => {
    if (!map) return;

    const centerPoint = map.getCenter();
    const radius = calculateRadius(map);
    setSearchRadius(radius);
    setCenter({ lat: centerPoint.getLat(), lng: centerPoint.getLng() }); 
    
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/facilities/search', {
        params: {
          category: "ANIMAL_HOSPITAL",
          x: centerPoint.getLng(),
          y: centerPoint.getLat(),
          radius: radius,
          page: 1,
          size: 100,
          sort: "id,asc"
        }
      });
      console.log('API 응답:', response.data);
      setFacilities(response.data.content);
    } catch (error) {
      console.error('Error searching facilities:', error.response || error);
      alert('시설 검색 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  }, 500), [calculateRadius]);

  const MapEventHandler = () => {
    const map = useMap();
    useEffect(() => {
      if (map) {
        const handleMapChange = () => {
          setLevel(map.getLevel());
          searchFacilities(map);
        };

        map.addListener('center_changed', handleMapChange);
        map.addListener('zoom_changed', handleMapChange);
        map.addListener('dragend', handleMapChange);

        return () => {
          map.removeListener('center_changed', handleMapChange);
          map.removeListener('zoom_changed', handleMapChange);
          map.removeListener('dragend', handleMapChange);
        };
      }
    }, [map, searchFacilities]);

    return null;
  };

  return (
    <div className="facility-finder-page">
      <h1>주변 동물병원 찾기</h1>
      <div className="map-container">
        <Map 
          center={center} 
          style={{ width: "100%", height: "90%" }}
          level={level}>
          <MapEventHandler />
          <Circle 
            center={center}
            radius={searchRadius}
            strokeWeight={1}
            strokeColor="#75B8FA"
            strokeOpacity={0.7}
            strokeStyle="dashed"
            fillColor="#CFE7FF"
            fillOpacity={0.3}
          />
          <MarkerClusterer
            averageCenter={true}
            minLevel={10}>
            {facilities.map((facility) => (
              <MapMarker
                key={facility.id}
                position={{ lat: facility.latitude, lng: facility.longitude }}
                title={facility.placeName}
              />
            ))}
          </MarkerClusterer>
        </Map>
      </div>
      {isLoading && <div className="loading-overlay">로딩 중...</div>}
    </div>
  );
}

export default FacilityFinderPage;