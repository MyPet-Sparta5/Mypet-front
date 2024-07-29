import React, { useState } from 'react';
import styles from '../styles/Modal.module.css';

function ReportModal({ userName, content, onClose, onSave }) {
    const [text, setText] = useState('');

    const handleSave = () => {
        onSave({ text, userName }); // 신고 사유와 사용자 이름을 전달
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>신고하기</h2>
                <div>{content}</div>
                <div className={styles.inputGroup}>
                    <textarea
                        className={styles.textareaContent}
                        id="postContent"
                        placeholder="신고 사유를 작성해주세요." // placeholder 수정
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <div className={styles.modalButtons}>
                    <button className={styles.saveButton} onClick={handleSave}>신고하기</button>
                    <button className={styles.cancelButton} onClick={onClose}>취소</button>
                </div>
            </div>
        </div>
    );
}

export default ReportModal;
