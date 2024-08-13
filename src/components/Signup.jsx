import React, { useRef, useEffect, useState } from 'react';
import { axiosNonAuthorization } from '../setting/api';
import styles from '../styles/Signup.module.css';
import { useNavigate, useLocation } from 'react-router-dom';

function Signup() {
    const emailInput = useRef();
    const passwordInput = useRef();
    const repeatPasswordInput = useRef();
    const nicknameInput = useRef();
    const verificationCodeInput = useRef();

    const navigate = useNavigate();

    const validateEmail = (email) => {
        // 이메일 형식 정규 표현식
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [isSocialSignup, setIsSocialSignup] = useState(false);
    const [registrationKey, setRegistrationKey] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showVerificationField, setShowVerificationField] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const key = params.get('key');
        if (key) {
            setIsSocialSignup(true);
            setRegistrationKey(key);
            // Redis에서 소셜 로그인 정보 가져오기
            fetchSocialLoginInfo(key);
        } else {
            setIsLoading(false);
        }
    }, [location]);

    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const fetchSocialLoginInfo = async (key) => {
        try {
            const response = await axiosNonAuthorization.get(`/api/users/social-account/infos?key=${key}`);
            if (response.data) {
                // 소셜 로그인 정보로 필드 채우기
                setEmail(response.data.data.email);
                setNickname(response.data.data.nickname);
                setIsEmailVerified(true); // 소셜 로그인의 경우 이메일이 이미 인증되었다고 간주
            }
        } catch (error) {
            console.error('소셜 로그인 정보 가져오기 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendVerification = async () => {
        if (!validateEmail(email)) {
            alert('올바른 이메일 형식이 아닙니다.');
            return;
        }
        try {
            await axiosNonAuthorization.post('/api/auth/send-verification', { email });
            setShowVerificationField(true);
            setResendCooldown(600); // 10분
            alert('인증 코드가 이메일로 전송되었습니다.');
        } catch (error) {
            alert('인증 코드 전송에 실패했습니다.');
        }
    };

    const handleVerifyCode = async () => {
        try {
            const response = await axiosNonAuthorization.post('/api/auth/verify', {
                email,
                code: verificationCodeInput.current.value
            });
            if (response.data.status === 200) {
                setIsEmailVerified(true);
                alert('이메일이 성공적으로 인증되었습니다.');
            } else {
                alert('잘못된 인증 코드입니다.');
            }
        } catch (error) {
            alert('인증 코드 확인에 실패했습니다.');
        }
    };

    const handleSignupClick = async () => {
        if (!isEmailVerified) {
            alert('이메일 인증을 완료해주세요.');
            return;
        }

        console.log(emailInput.current + ", " + passwordInput.current + ", " + repeatPasswordInput.current + ", " + nicknameInput.current);
        if (!emailInput.current.value || !passwordInput.current.value || !repeatPasswordInput.current.value || !nicknameInput.current.value) {
            alert('빈 칸을 전부 입력 해주세요.');
            return;
        }

        if (!validateEmail(emailInput.current.value)) {
            alert('올바른 이메일 형식이 아닙니다. 이메일 형식으로 입력해 주세요.');
            return;
        }

        if (repeatPasswordInput.current.value !== passwordInput.current.value) {
            alert('비밀번호 확인이 일치하지 않습니다.');
            return;
        }

        try {
            const signupData = {
                email: emailInput.current.value,
                nickname: nicknameInput.current.value,
                password: passwordInput.current.value,
                repeatPassword: repeatPasswordInput.current.value
            };

            if (isSocialSignup) {
                signupData.registrationKey = registrationKey;
            }

            const response = await axiosNonAuthorization.post('/api/users', signupData);

            if (response.status === 201) { // 201 Created
                alert('회원가입이 성공적으로 완료되었습니다.');
                navigate('/login');
            } else {
                alert('회원가입에 실패했습니다.');
            }
        } catch (error) {
            console.error('회원가입 중 오류 발생:', error);

            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                alert(`회원가입 실패: ${errorMessage.replace('Exception caught: ', '')}`);
            } else {
                alert('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.');
            }
        }
    };

    if (isLoading) {
        return <div>로딩 중...</div>;  // 로딩 중일 때 표시할 내용
    }

    return (
        <div className={styles.signup}>
            <h2 className={styles.title}>회원가입</h2>
            <div className={styles.form}>
                <div className={styles.inputGroup}>
                    <input
                        className={styles.input}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        ref={emailInput}
                        readOnly={isSocialSignup}
                    />
                    {!isEmailVerified ? (
                        <button
                            className={`${styles.button} ${styles.verifyButton}`}
                            onClick={handleSendVerification}
                            disabled={resendCooldown > 0}
                        >
                            {resendCooldown > 0 ? `${Math.floor(resendCooldown / 60)}:${(resendCooldown % 60).toString().padStart(2, '0')}` : '인증하기'}
                        </button>
                    ) : (
                        <span className={styles.verifiedText}>✓</span>
                    )}
                </div>
                <div className={`${styles.verificationField} ${!showVerificationField || isEmailVerified ? styles.hidden : ''}`}>
                    <div className={styles.inputGroup}>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="인증 코드"
                            ref={verificationCodeInput}
                        />
                        <button className={`${styles.button} ${styles.verificationButton}`} onClick={handleVerifyCode}>
                            확인
                        </button>
                    </div>
                </div>
                <input className={styles.input} type="password" placeholder="Password" ref={passwordInput} />
                <input className={styles.input} type="password" placeholder="Repeat Password" ref={repeatPasswordInput} />
                <input
                    className={styles.input}
                    type="text"
                    placeholder="NickName"
                    value={nickname}
                    ref={nicknameInput}
                    onChange={(e) => setNickname(e.target.value)}
                />
                <button
                    className={styles.button}
                    type="submit"
                    onClick={handleSignupClick}
                    disabled={!isEmailVerified}
                >
                    Sign up
                </button>
            </div>
        </div>
    );
}

export default Signup;