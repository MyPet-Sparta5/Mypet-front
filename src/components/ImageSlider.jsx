import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from '../styles/ImageSlider.module.css';

export default function ImageSlider({ fileUrls }) {
  const settings = {
    dots: true,
    infinite: false, // false로 설정하여 이미지를 반복하지 않도록 함
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '20px'
  };

  return (
    <div className={styles.sliderContainer}>
      <Slider {...settings}>
        {fileUrls.length > 0 ? (
          fileUrls.map((url, index) => (
            <div key={index} className={styles.slide}>
              <img src={url} alt={`Slide ${index + 1}`} className={styles.slideImage} />
            </div>
          ))
        ) : (
          <div className={styles.slide}>No Images Available</div> // 파일이 없을 때 표시될 내용
        )}
      </Slider>
    </div>
  );
}
