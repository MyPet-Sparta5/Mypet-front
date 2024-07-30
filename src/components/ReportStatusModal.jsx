import React, { useState } from 'react';
import styles from '../styles/Modal.module.css';

const ReportStatusModal = ({ issue, status, onSave, onClose }) => {
    const [selectedStatus, setSelectedStatus] = useState(status);

    const handleSave = () => {
        onSave(selectedStatus);
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>신고 상태 수정</h2>
                <h4>신고 사유 : {issue}</h4>
                <div className={styles.inputGroup}>
                    <label htmlFor="reportStatus">신고 상태</label>
                    <select
                        id="reportStatus"
                        className={styles.selectCategory}
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="PENDING">처리 전</option>
                        <option value="IN_PROGRESS">처리 중</option>
                        <option value="REJECTED">반려</option>
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
