import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from './user/UserStorage';
import axios from 'axios';

const KakaoLinkCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {

    const sendCodeToBackend = async (email, code) => {
      try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios.post(
          'http://localhost:8080/api/oauth/kakao/link',
          { email, code },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true
          }
        );

        if (response.status === 200) {
          alert('카카오 계정 연동에 성공했습니다.');
          navigate('/profile');
        }
      } catch (error) {
        console.error('카카오 계정 연동 실패:', error);
        alert('카카오 계정 연동에 실패했습니다.');
        navigate('/profile');
      }
    };

    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      const email = localStorage.getItem('email');
      localStorage.removeItem('email');
      sendCodeToBackend(email, code);
    }
  });

  return <div>카카오 계정 연동 처리 중...</div>;
};

export default KakaoLinkCallback;