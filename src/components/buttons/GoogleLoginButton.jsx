import React from 'react';
import styles from '../../styles/SocialLoginButton.module.css';
import googleLoginButton from '../../assets/google_login_medium_wide.png';
import { FcGoogle } from "react-icons/fc";

function GoogleLoginButton() {
    const handleGoogleLogin = () => {
        const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
        const REDIRECT_URL = process.env.REACT_APP_GOOGLE_LOGIN_REDIRECT_URI;
        const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
        const scope = 'email profile';

        const googleLoginUrl = `${GOOGLE_AUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URL}&response_type=code&scope=${scope}`;

        window.location.href = googleLoginUrl;
    }

    return (
        <div className={styles.socialLoginWrapper}>
            <button type="button" alt="구글 로그인" onClick={handleGoogleLogin} className={styles.googleLoginButton} >
                <FcGoogle className={styles.FcGoogle} /> <div className={styles.google}>구글 로그인</div>
            </button>
        </div>
    );
}

export default GoogleLoginButton;