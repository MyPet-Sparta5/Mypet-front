import React, { useState } from 'react';
import styles from '../styles/Modal.module.css';

function ChangePasswordModal({ onSave, onClose }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');

    const handleSave = () => {
        if (!currentPassword) {
            setError('현재 비밀번호를 입력해주세요.');
            return;
        }
        if (!newPassword) {
            setError('새 비밀번호를 입력해주세요.');
            return;
        }
        if (!confirmNewPassword) {
            setError('비밀번호 확인을 입력해주세요.');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setError('새로운 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }

        onSave({ currentPassword, newPassword });
        onClose();
    };

    // 하이라이트 제거된 단순화된 오류 메시지 함수
    const getErrorMessage = (message) => message;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>비밀번호 변경</h2>
                <div className={styles.inputGroup}>
                    <label htmlFor="currentPassword">현재 비밀번호</label>
                    <input
                        className={styles.inputTitle}
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="newPassword">새 비밀번호</label>
                    <input
                        className={styles.inputTitle}
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="confirmNewPassword">비밀번호 확인</label>
                    <input
                        className={styles.inputTitle}
                        id="confirmNewPassword"
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                </div>
                {error && (
                    <p className={styles.error} dangerouslySetInnerHTML={{ __html: getErrorMessage(error) }} />
                )}
                <div className={styles.modalButtons}>
                    <button className={styles.saveButton} onClick={handleSave}>변경</button>
                    <button className={styles.cancelButton} onClick={onClose}>취소</button>
                </div>
            </div>
        </div>
    );
}

export default ChangePasswordModal;
