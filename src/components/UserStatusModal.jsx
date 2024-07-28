import React from 'react';
import styles from '../styles/Modal.module.css';

const UserStatusModal = ({ status, onSave, onClose }) => {
    const [selectedStatus, setSelectedStatus] = React.useState(status);

    const handleSave = () => {
        onSave(selectedStatus);
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>유저 상태 수정</h2>
                <div className={styles.inputGroup}>
                    <label htmlFor="userStatus">유저 상태</label>
                    <select
                        id="userStatus"
                        className={styles.selectCategory}
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="Active">정상</option>
                        <option value="Inactive">탈퇴</option>
                        <option value="Suspended">일시정지</option>
                        <option value="Banned">영구정지</option>
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

export default UserStatusModal;
