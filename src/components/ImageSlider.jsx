import React, { useContext } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PostContext } from '../context/PostContext';
import styles from '../styles/ImageSlider.module.css';

export default function ImageSlider({ postId }) {
    const posts = useContext(PostContext);

    // Find the post with the given postId
    const post = posts.find(post => post.id === postId);

    // Extract image URLs from the found post
    const imageUrls = post && post.fileUrls ? post.fileUrls : [];

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
                {imageUrls.length > 0 ? (
                    imageUrls.map((url, index) => (
                        <div key={index} className={styles.slide}>
                            <img src={url} alt={`Slide ${index + 1}`} className={styles.slideImage} />
                        </div>
                    ))
                ) : (
                    <div className={styles.slide}>No Images Available</div>
                )}
            </Slider>
        </div>
    );
}
