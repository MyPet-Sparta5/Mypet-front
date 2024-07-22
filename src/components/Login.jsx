import React from 'react';
import { useRef, useEffect } from 'react'
import styles from '../styles/Login.module.css';
import { useNavigate } from 'react-router-dom';

function Login() {
    const emailInput = useRef();
    const passwordInput = useRef();

    const navigate = useNavigate();

    const handleBoardClick = async (e) => {
        e.preventDefault();

        if (!emailInput.current || !passwordInput.current) {
            alert('빈 칸을 전부 입력 해주세요.');
            return;
        }

        try {
            //로그인 백엔드 연결 부분

            navigate('/');
            window.location.reload();
        } catch (error) {
            alert(`${error.response.data.msg}`);
        }
    };

    const handleSignupClick = () => {
        navigate('/signup');
    };

    return (
        <div className={styles.login}>
            <h2 className={styles.title}>로그인</h2>
            <form className={styles.form}>
                <input className={styles.input} type="email" placeholder="Email" ref={emailInput} />
                <input className={styles.input} type="password" placeholder="Password" ref={passwordInput} />
                <button className={styles.button} type="submit" onClick={handleBoardClick}>Login</button>
                <button className={styles.button} type="submit" onClick={handleSignupClick}>Sign up</button>
            </form>
        </div>
    );
}

export default Login;