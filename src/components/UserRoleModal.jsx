import React from 'react';
import styles from '../styles/Modal.module.css';

const UserRoleModal = ({ email, role, onSave, onClose }) => {
    const [selectedRole, setSelectedRole] = React.useState(role);

    React.useEffect(() => {
        // 초기 값 설정 시 'ROLE_' 부분을 제거하고 간단한 역할로 설정
        const simplifiedRole = role.replace('ROLE_', '');
        setSelectedRole(simplifiedRole);
    }, [role]);

    const handleSave = () => {
        // 저장할 때는 ROLE_를 붙이지 않음
        onSave(selectedRole);
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>"{email}" 유저 권한 수정</h2>
                <div className={styles.inputGroup}>
                    <label htmlFor="userRole">유저 권한</label>
                    <select
                        id="userRole"
                        className={styles.selectCategory}
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                    >
                        <option value="USER">유저</option>
                        <option value="ADMIN">어드민</option>
                        <option value="MANAGER">매니저</option>
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
