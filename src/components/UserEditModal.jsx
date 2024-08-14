import React, { useState } from 'react';
import styles from '../styles/Modal.module.css';

function UserEditModal({ nickname, onSave, onClose }) {
    const [nicknameValue, setNickname] = useState(nickname);
    const [currentPassword, setCurrentPassword] = useState('');
    const [error, setError] = useState('');

    const handleSave = () => {
        // 필드 별로 오류 메시지 설정
        if (!nicknameValue && !currentPassword) {
            setError('닉네임과 비밀번호를 입력해주세요.');
            return;
        }
        if (!nicknameValue) {
            setError('닉네임을 입력해주세요.');
            return;
        }
        if (!currentPassword) {
            setError('현재 비밀번호를 입력해주세요.');
            return;
        }

        // 회원정보 수정 함수 호출
        onSave({ nickname: nicknameValue, password: currentPassword });
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>회원정보 수정</h2>
                <div className={styles.inputGroup}>
                    <label htmlFor="userNickname">닉네임</label>
                    <input
                        className={styles.inputTitle}
                        id="userNickname"
                        type="text"
                        value={nicknameValue}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                </div>
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
                {error && <p className={styles.error}>{error}</p>}
                <div className={styles.modalButtons}>
                    <button className={styles.saveButton} onClick={handleSave}>수정</button>
                    <button className={styles.cancelButton} onClick={onClose}>취소</button>
                </div>
            </div>
        </div>
    );
}

export default UserEditModal;
