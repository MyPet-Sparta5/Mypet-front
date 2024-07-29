// LikeButton.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import axios from 'axios';
import RefreshToken from './refreshToken';
import debounce from 'lodash/debounce';
import styles from '../styles/LikeButton.module.css'; // 스타일 파일 생성 필요

function getAuthTokenFromLocalStorage() {
    return localStorage.getItem('accessToken');
}

const LikeButton = ({ postId, initialLiked, initialLikeCount, onLikeChange }) => {
    const [liked, setLiked] = useState(initialLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);

    const handleTokenRefresh = useCallback(async (retryFunc) => {
        try {
            await RefreshToken();
            const newToken = getAuthTokenFromLocalStorage();
            return await retryFunc(newToken);
        } catch {
            console.error('Token refresh error');
        }
    }, []);

    const sendLikeRequest = useCallback(async (token) => {
        return await axios.post(`http://localhost:8080/api/posts/${postId}/likes`, {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }, [postId]);

    const sendUnlikeRequest = useCallback(async (token) => {
        return await axios.delete(`http://localhost:8080/api/posts/${postId}/likes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }, [postId]);

    const toggleLike = useCallback(async (token) => {
        try {
            if (liked) {
                await sendUnlikeRequest(token);
            } else {
                await sendLikeRequest(token);
            }
            const newLiked = !liked;
            setLiked(newLiked);
            setLikeCount(prevCount => newLiked ? prevCount + 1 : prevCount - 1);

            if (onLikeChange) {
                onLikeChange(newLiked, newLiked ? likeCount + 1 : likeCount - 1);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            if (error.response?.status === 401 && error.response.data.data === 'Expired-Token') {
                try {
                    await handleTokenRefresh(toggleLike);
                } catch {
                    alert('인증에 실패했습니다. 다시 로그인해주세요.');
                }
            } else {
                alert('좋아요 처리에 실패했습니다.');
            }
        }
    }, [liked, likeCount, sendLikeRequest, sendUnlikeRequest, handleTokenRefresh, onLikeChange]);


    const debouncedToggleLike = useCallback(
        debounce(async () => {
            const token = getAuthTokenFromLocalStorage();
            if (!token) {
                alert('로그인이 필요합니다.');
                return;
            }
            await toggleLike(token);
        }, 250)
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