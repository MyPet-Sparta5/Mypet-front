import React from 'react';
import styles from '../styles/Modal.module.css';

function DeleteModal({ title, content, onConfirm, onClose, confirmText = '삭제' }) {
    const handleCancel = () => {
        onClose(); // 취소 버튼 클릭 시 모달 닫기
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>{title}</h2>
                <div>{content}</div>
                <div className={styles.modalButtons}>
                    <button className={styles.saveButton} onClick={onConfirm}>{confirmText}</button>
                    <button className={styles.cancelButton} onClick={handleCancel}>취소</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;
