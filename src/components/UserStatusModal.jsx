import React, { useState } from 'react';
import styles from '../styles/Modal.module.css';

const UserStatusModal = ({ email, status, onSave, onClose }) => {
    const [selectedStatus, setSelectedStatus] = React.useState(status);
    const [suspensionIssue, setSuspensionIssue] = useState('');

    const handleSave = () => {
    onSave({ status: selectedStatus, suspensionIssue: suspensionIssue });
    onClose();
};

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>유저 상태 수정</h2>
                <h4>유저 이메일 : {email}</h4>
                <div className={styles.inputGroup}>
                    <label htmlFor="userStatus">유저 상태</label>
                    <select
                        id="userStatus"
                        className={styles.selectCategory}
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="ACTIVE">정상</option>
                        <option value="WITHDRAWAL">탈퇴</option>
                        <option value="SUSPENSION">정지</option>
                    </select>
                </div>
                {selectedStatus === 'SUSPENSION' && (
                    <div className={styles.inputGroup}>
                        <label htmlFor="suspensionIssue">정지 사유</label>
                        <input
                            className={styles.inputTitle}
                            id="suspensionIssue"
                            type="text"
                            value={suspensionIssue}
                            onChange={(e) => setSuspensionIssue(e.target.value)}
                        />
                    </div>
                )}
                <div className={styles.modalButtons}>
                    <button className={styles.saveButton} onClick={handleSave}>저장</button>
                    <button className={styles.cancelButton} onClick={onClose}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default UserStatusModal;
