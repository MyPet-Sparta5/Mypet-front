import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/PostDetail.module.css';

function Comment({ text, onDelete}) {
    return (
        <div className={styles.commentContainer}>
            <div className={styles.commentText}>{text}</div>
            <button className={styles.deleteButton} onClick={onDelete}>
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </div>
    );
}

export default Comment;
