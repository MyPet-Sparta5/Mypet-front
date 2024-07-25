import React, { useRef, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Signup.module.css';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const emailInput = useRef();
    const passwordInput = useRef();
    const repeatPasswordInput = useRef();
    const nicknameInput = useRef();

    const navigate = useNavigate();

    const handleSignupClick = async () => {
        if (!emailInput.current || !passwordInput.current || !repeatPasswordInput.current || !nicknameInput.current) {
            alert('빈 칸을 전부 입력 해주세요.');
            return;
        }

        if (repeatPasswordInput.current.value !== passwordInput.current.value) {
            alert('비밀번호 확인이 일치하지 않습니다.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/users', {
                email: emailInput.current.value,
                password: passwordInput.current.value,
                repeatPassword: repeatPasswordInput.current.value,
                nickname: nicknameInput.current.value
            });

            if (response.status == 201) { // 201 Created
                alert('회원가입이 성공적으로 완료되었습니다.');
                navigate('/login');
            } else {
                alert('회원가입에 실패했습니다.');
            }
        } catch (error) {
            console.error('회원가입 중 오류 발생:', error);
            alert('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    return (
        <div className={styles.signup}>
            <h2 className={styles.title}>회원가입</h2>
            <div className={styles.form}>
                <input className={styles.input} type="email" placeholder="Email" ref={emailInput} />
                <input className={styles.input} type="password" placeholder="Password" ref={passwordInput} />
                <input className={styles.input} type="password" placeholder="Repeat Password" ref={repeatPasswordInput} />
                <input className={styles.input} type="text" placeholder="NickName" ref={nicknameInput} />
                <button className={styles.button} type="submit" onClick={handleSignupClick}>Sign up</button>
            </div>
        </div>
    );
}

export default Signup;