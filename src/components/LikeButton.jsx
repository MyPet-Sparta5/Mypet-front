// LikeButton.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { axiosInstance, handleApiCall } from '../setting/api'; 
import debounce from 'lodash/debounce';
import styles from '../styles/LikeButton.module.css';

function getAuthTokenFromLocalStorage() {
    return localStorage.getItem('accessToken');
}

const LikeButton = ({ postId, initialLiked, initialLikeCount, onLikeChange }) => {
    const [liked, setLiked] = useState(initialLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const navigate = useNavigate();

    const sendLikeRequest = useCallback(async () => {
        return await handleApiCall(() => axiosInstance.post(`/api/posts/${postId}/likes`), navigate);
    }, [postId, navigate]);

    const sendUnlikeRequest = useCallback(async () => {
        return await handleApiCall(() => axiosInstance.delete(`/api/posts/${postId}/likes`), navigate);
    }, [postId, navigate]);

    const toggleLike = useCallback(async () => {
        try {
            if (liked) {
                await sendUnlikeRequest();
            } else {
                await sendLikeRequest();
            }
            const newLiked = !liked;
            setLiked(newLiked);
            setLikeCount(prevCount => newLiked ? prevCount + 1 : prevCount - 1);

            if (onLikeChange) {
                onLikeChange(newLiked, newLiked ? likeCount + 1 : likeCount - 1);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            alert('좋아요 처리에 실패했습니다.');
        }
    }, [liked, likeCount, sendLikeRequest, sendUnlikeRequest, onLikeChange]);

    const debouncedToggleLike = useCallback(
        debounce(async () => {
            const token = getAuthTokenFromLocalStorage();
            if (!token) {
                alert('로그인이 필요합니다.');
                return;
            }
            await toggleLike(token);
        }, 250),
        [toggleLike]
    );

    useEffect(() => {
        return () => debouncedToggleLike.cancel();
    }, [debouncedToggleLike]);

    return (
        <div className={styles.likeContainer}>
            {liked ? (
                <FaHeart
                    className={`${styles.likeIcon} ${styles.liked}`}
                    onClick={debouncedToggleLike}
                />
            ) : (
                <FaRegHeart
                    className={styles.likeIcon}
                    onClick={debouncedToggleLike}
                />
            )}
            <strong> {likeCount} </strong> likes
        </div>
    );
};

export default LikeButton;
