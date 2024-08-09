import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from '../styles/ImageSlider.module.css';

export default function ImageSlider({ fileUrls }) {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '20px'
  };

  const renderSlide = (url, index) => {

    // 파일 확장자를 통해 이미지인지 비디오인지 판별
    const isVideo = url.match(/\.(mp4|avi)$/i);

    return (
      <div key={index} className={styles.slide}>
        {isVideo ? (
          <video
            src={url}
            controls
            className={styles.slideMedia}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={url}
            alt={`Slide ${index + 1}`}
            className={styles.slideImage}
          />
        )}
      </div>
    );
  };

  return (
    <div className={styles.sliderContainer}>
      <Slider {...settings}>
        {fileUrls.length > 0 ? (
          fileUrls.map((url, index) => renderSlide(url, index))
        ) : (
          <div className={styles.slide}>No Images Available</div> // 파일이 없을 때 표시될 내용
        )}
      </Slider>
    </div>
  );
}
