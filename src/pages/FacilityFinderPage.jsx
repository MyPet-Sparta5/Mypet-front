import React, { useState, useEffect, useCallback } from 'react';
import { Map, MapMarker, MarkerClusterer, Circle, useMap } from 'react-kakao-maps-sdk';
import { axiosNonAuthorization } from '../setting/api'; 
import '../styles/FacilityFinderPage.css';
import { debounce } from 'lodash';

function FacilityFinderPage() {
  const [facilities, setFacilities] = useState([]);
  const [center, setCenter] = useState({ lat: 37.566826, lng: 126.9786567 });
  const [level, setLevel] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [searchRadius, setSearchRadius] = useState(250); // 초기 검색 반경 (미터 단위)

  useEffect(() => {
    // 사용자의 위치를 가져오는 함수
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newCenter = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setCenter(newCenter);
          },
          (error) => {
            console.error("Error getting user location:", error);
            alert("사용자 위치를 가져오는데 실패했습니다. 기본 위치(서울 시청)를 사용합니다.");
          }
        );
      } else {
        alert("이 브라우저에서는 위치 정보를 지원하지 않습니다. 기본 위치(서울 시청)를 사용합니다.");
      }
    };

    getUserLocation();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  const calculateRadius = useCallback((map) => {
    if (!map) return 250;

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
      const response = await axiosNonAuthorization.get('/api/facilities/search', {
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
  }), [calculateRadius]);

  const debouncedSearchFacilities = useCallback(debounce(searchFacilities, 200), [searchFacilities]);

  const MapEventHandler = () => {
    const map = useMap();
    useEffect(() => {
      if (map) {
        const handleDragEnd = () => {
          setLevel(map.getLevel());
          debouncedSearchFacilities(map);
        };

        const handleMapChange = () => {
          setLevel(map.getLevel());
          debouncedSearchFacilities(map);
        };

        const debouncedHandleMapChange = debounce(handleMapChange, 200);

        map.addListener('dragend', handleDragEnd);
        map.addListener('center_changed', debouncedHandleMapChange);
        map.addListener('zoom_changed', debouncedHandleMapChange);

        return () => {
          map.removeListener('dragend', handleDragEnd);
          map.removeListener('center_changed', debouncedHandleMapChange);
          map.removeListener('zoom_changed', debouncedHandleMapChange);
        };
      }
    }, [map, debouncedSearchFacilities]);

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