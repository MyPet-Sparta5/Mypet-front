// src/components/UserEditModal.js
import React, { useState } from 'react';
import styles from '../styles/Modal.module.css';

function UserEditModal({ nickname, email, onSave, onClose }) {
    const [nicknameValue, setNickname] = useState(nickname);
    const [passwordValue, setPassword] = useState('');
    const [confirmPasswordValue, setConfirmPassword] = useState('');

    const handleSave = () => {
        if (passwordValue !== confirmPasswordValue) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        onSave({ nickname: nicknameValue, password: passwordValue });
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
                    <label htmlFor="userPassword">비밀번호</label>
                    <input
                        className={styles.inputTitle}
                        id="userPassword"
                        type="password"
                        value={passwordValue}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="userConfirmPassword">비밀번호 확인</label>
                    <input
                        className={styles.inputTitle}
                        id="userConfirmPassword"
                        type="password"
                        value={confirmPasswordValue}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div className={styles.modalButtons}>
                    <button className={styles.saveButton} onClick={handleSave}>수정</button>
                    <button className={styles.cancelButton} onClick={onClose}>취소</button>
                </div>
            </div>
        </div>
    );
}

export default UserEditModal;
