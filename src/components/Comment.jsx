import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { formatDistanceToNow, parseISO, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import styles from '../styles/PostDetail.module.css';

function Comment({ text, username, createdAt, onDelete }) {
    const formatDate = (dateString) => {
        const date = parseISO(dateString);
        const distanceToNow = formatDistanceToNow(date, { addSuffix: true, locale: ko });
        
        if (distanceToNow.includes('1년')) {
            return format(date, 'yyyy년 M월 d일 HH:mm', { locale: ko });
        }
        
        return distanceToNow;
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