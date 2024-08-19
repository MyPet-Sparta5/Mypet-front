import React from 'react';
import PropTypes from 'prop-types';
import { CustomOverlayMap } from 'react-kakao-maps-sdk';
import styles from '../styles/KakaoMapOverlay.module.css';
import defaultImage from '../assets/default_img.png';

const KakaoMapOverlay = ({ place, position, onClose }) => {
    return (
      <CustomOverlayMap
        position={position}
        zIndex={1}
      >
        <div className={styles.wrap}>
          <div className={styles.info}>
            <div className={styles.title}>
              {place.name}
              <div className={styles.close} onClick={onClose} title="닫기"></div>
            </div>
            <div className={styles.body}>
              <div className={styles.img}>
                <img src={defaultImage} width="73" height="70" alt={place.name} />
              </div>
              <div className={styles.content}>
                <div className={styles.address}>{place.address}</div>
                <div className={styles.jibun}>{place.jibunAddress}</div>
                <div className={styles.phone}>
                  <a href={`tel:${place.phone}`} className={styles.link}>
                    전화: {place.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomOverlayMap>
    );
  };

KakaoMapOverlay.propTypes = {
  place: PropTypes.shape({
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    jibunAddress: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
  }).isRequired,
  position: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default KakaoMapOverlay;