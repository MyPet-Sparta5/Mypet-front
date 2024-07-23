import React, { useState } from 'react';
import styles from '../styles/Modal.module.css';

//이부분 api 연동할때 userId로 변경해서 아래 nickname으로 보내는 부분 수정
function ReportModal({ userName, content, onClose, onSave }) {
    const [text, setText] = useState('');

    const handleSave = () => {
        onSave({ text, userName });
        console.log(text, userName);
        onClose();
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
                        placeholder="신고사유작성"  // placeholder를 사용하여 기본 텍스트를 설정
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
