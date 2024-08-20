import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/PostDetail.module.css';

function Comment({ text, username, createdAt, onDelete }) {
    const formatDate = (dateString) => {
        const now = new Date();
        const commentDate = new Date(dateString);
        const diffTime = Math.abs(now - commentDate);
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        
        if (diffMinutes < 1) {
            return '1분 전';
        } else if (diffMinutes < 60) {
            return `${diffMinutes}분 전`;
        } else if (diffHours < 24) {
            return `${diffHours}시간 전`;
        } else {
            return commentDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
        }
    };

    return (
        <div className={styles.commentContainer}>
            <div className={styles.commentHeader}>
                <span className={styles.commentUsername}>{username}</span>
                <button className={styles.deleteButton} onClick={onDelete}>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
            <div className={styles.commentText}>{text}</div>
            <div className={styles.commentFooter}>
            <span className={styles.commentDate}>{formatDate(createdAt)}</span>
            </div>
        </div>
    );
}

export default Comment;