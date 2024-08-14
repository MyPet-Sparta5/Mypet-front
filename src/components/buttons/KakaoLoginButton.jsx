import React from 'react';
import styles from '../../styles/SocialLoginButton.module.css';
import kakaoLoginButton from '../../assets/kakao_login_medium_wide.png';

function KakaoLoginButton() {
    const handleKakaoLogin = () => {
        const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID;
        const REDIRECT_URI = process.env.REACT_APP_KAKAO_LOGIN_REDIRECT_URI;
        const KAKAO_AUTH_URL = 'https://kauth.kakao.com/oauth/authorize';
        const scope = 'account_email profile_nickname';

        const kakaoLoginUrl = `${KAKAO_AUTH_URL}?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${scope}`;

        window.location.href = kakaoLoginUrl;
    }

    return (
        <div className={styles.socialLoginWrapper}>
            <img
                src={kakaoLoginButton}
                alt="카카오 로그인"
                onClick={handleKakaoLogin}
                className={styles.socialLoginButton}
            />
        </div>
    );
}

export default KakaoLoginButton;