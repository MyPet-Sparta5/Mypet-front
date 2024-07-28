import React from 'react';
import styles from '../styles/Modal.module.css';

const UserRoleModal = ({ role, onSave, onClose }) => {
    const [selectedRole, setSelectedRole] = React.useState(role);

    const handleSave = () => {
        onSave(selectedRole);
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>유저 권한 수정</h2>
                <div className={styles.inputGroup}>
                    <label htmlFor="userRole">유저 권한</label>
                    <select
                        id="userRole"
                        className={styles.selectCategory}
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                    >
                        <option value="User">유저</option>
                        <option value="Admin">어드민</option>
                        <option value="Manager">매니저</option>
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

export default UserRoleModal;
