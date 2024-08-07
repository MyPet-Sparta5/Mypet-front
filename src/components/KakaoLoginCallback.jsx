// KakaoLoginCallback.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function KakaoLoginCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const sendCodeToBackend = async (code) => {
            try {
                const response = await axios.post('http://localhost:8080/api/oauth/kakao', { code }, {
                    validateStatus: function (status) {
                        return status < 500; // 500 미만의 상태 코드는 에러로 취급하지 않음
                    }
                });
                
                console.log(response.status);
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
                } else if (response.status === 302) {
                    
                    // 회원가입 필요
                    if (response.data.data.registrationUrl) {
                        // 백엔드에서 제공한 회원가입 URL로 리다이렉트
                        const url = new URL(response.data.data.registrationUrl);
                        const key = url.searchParams.get('key');
                        navigate(`/signup?key=${key}`);
                    } else {
                        // 백엔드에서 URL을 제공하지 않은 경우, 프론트엔드의 회원가입 페이지로 이동
                        navigate('/signup', { 
                            state: { 
                                message: response.data.message,
                                kakaoData: response.data.kakaoData // 카카오 데이터가 있다면
                            } 
                        });
                    }
                } else {
                    // 기타 상황 처리
                    alert(response.data.message);
                    navigate('/login');
                }
            } catch (error) {
                console.error('카카오 로그인 에러:', error);
                alert(error);
                navigate('/login');
            }
        };

        const code = new URL(window.location.href).searchParams.get("code");
        if (code) {
            sendCodeToBackend(code);
        }
    }); // 의존성 배열 추가

    return <div>카카오 로그인 처리 중...</div>;
}

export default KakaoLoginCallback;