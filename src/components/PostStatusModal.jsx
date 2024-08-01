import React, { useState } from 'react';
import styles from '../styles/Modal.module.css';

const PostStatusModal = ({ status, onSave, onClose }) => {
    const [selectedStatus, setSelectedStatus] = useState(status);

    const handleSave = () => {
        onSave(selectedStatus);
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>게시물 상태 수정</h2>
                <h4>게시물 현재 상태 : {status}</h4>
                <div className={styles.inputGroup}>
                    <label htmlFor="postStatus">게시물 상태</label>
                    <select
                        id="postStatus"
                        className={styles.selectCategory}
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="ACTIVE">공개</option>
                        <option value="INACTIVE">비공개</option>
                    </select>
                </div>
                <div className={styles.modalButtons}>
                    <button className={styles.saveButton} onClick={handleSave}>저장</button>
                    <button className={styles.cancelButton} onClick={onClose}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default PostStatusModal;
