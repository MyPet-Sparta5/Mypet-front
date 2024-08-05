import React from 'react';
import { useRef } from 'react';
import styles from '../styles/Login.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const emailInput = useRef();
    const passwordInput = useRef();

    const navigate = useNavigate();

    const handleLoginClick = async (e) => {
        e.preventDefault();

        if (!emailInput.current.value || !passwordInput.current.value) {
            alert('빈 칸을 전부 입력 해주세요.');
            return;
        }

        try {
            //로그인 백엔드 연결 부분
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email: emailInput.current.value,
                password: passwordInput.current.value
            }, {
                withCredentials: true // 쿠키 허용
            });

            if (response.status === 200) {
                const accessToken = response.headers['authorization']; // 서버에서는  대소문자 구분되지만, 클라이언트는 구분 X

                if (accessToken) {
                    localStorage.setItem('accessToken', accessToken.replace('Bearer ', ''));
                } else {
                    alert('access token이 존재하지 않습니다.')
                }

                const { id, nickname, userRole } = response.data.data;

                localStorage.setItem('userId', id);
                localStorage.setItem('nickname', nickname);
                localStorage.setItem('userRole', userRole);

                alert(`[ ${nickname} ] 님 환영합니다!`);

                navigate('/');
                window.location.reload();
            } else {
                alert('아이디 또는 비밀번호가 맞지 않습니다. 다시 시도해 주세요.')
            }
        } catch (error) {
            alert('아이디 또는 비밀번호가 맞지 않습니다. 다시 시도해 주세요.');
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
                <button className={styles.button} type="submit" onClick={handleLoginClick}>Login</button>
                <button className={styles.button} type="submit" onClick={handleSignupClick}>Sign up</button>
            </form>
        </div>
    );
}

export default Login;