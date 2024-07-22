import React, { useRef, useEffect } from 'react';
import styles from '../styles/Signup.module.css';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const emailInput = useRef();
    const passwordInput = useRef();
    const repeatPasswordInput = useRef();
    const nicknameInput = useRef();

    const navigate = useNavigate();

    const handleSignupClick = () => {
        if (!emailInput.current || !passwordInput.current || !repeatPasswordInput.current || !nicknameInput.current) {
            alert('빈 칸을 전부 입력 해주세요.');
            return;
        }

        if(repeatPasswordInput.current.value !== passwordInput.current.value) {
            alert('비밀번호 확인이 일치하지 않습니다.');
            return;
        }
        //이부분에서 signup 백엔드랑 연결 후 성공시 아래 navigate 실행하도록 수정
        navigate('/login');
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