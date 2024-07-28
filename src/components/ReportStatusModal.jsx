import React, { useState } from 'react';
import styles from '../styles/Modal.module.css';

const ReportStatusModal = ({ status, onSave, onClose }) => {
    const [selectedStatus, setSelectedStatus] = useState(status);

    const handleSave = () => {
        onSave(selectedStatus);
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>신고 상태 수정</h2>
                <div className={styles.inputGroup}>
                    <label htmlFor="reportStatus">신고 상태</label>
                    <select
                        id="reportStatus"
                        className={styles.selectCategory}
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="처리 전">처리 전</option>
                        <option value="처리 중">처리 중</option>
                        <option value="처리 완료">처리 완료</option>
                        <option value="반려">반려</option>
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

export default ReportStatusModal;
