import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { formatDistanceToNowStrict, parseISO, addHours } from 'date-fns';
import { ko } from 'date-fns/locale';
import styles from '../styles/PostDetail.module.css';

function Comment({ text, username, createdAt, onDelete }) {
    const formatDate = (dateString) => {
        const commentDate = parseISO(dateString); // 서버시간 받아옴.
        // 서버가 UTC 시간대라면, 클라이언트의 로컬 시간대로 변환
        const localDate = addHours(commentDate, new Date().getTimezoneOffset() / -60);
    
        const distanceToNow = formatDistanceToNowStrict(localDate, { locale: ko });
    
        if (distanceToNow.includes('초')) {
            return '1분 전';
        } else if (distanceToNow.includes('분') || distanceToNow.includes('시간')) {
            return `${distanceToNow} 전`;
        } else {
            // 시간 차이가 하루 이상인 경우 날짜만 표시
            return localDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
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