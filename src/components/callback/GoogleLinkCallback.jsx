import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../setting/api';

const GoogleLinkCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {

    const sendCodeToBackend = async (email, code) => {
      try {

        const response = await axiosInstance.post(
          '/api/oauth/google/link',
          { email, code }
        );

        if (response.status === 200) {
          alert('구글 계정 연동에 성공했습니다.');
          navigate('/profile');
        }
      } catch (error) {
        console.error('구글 계정 연동 실패:', error);
        alert('구글 계정 연동에 실패했습니다.');
        navigate('/profile');
      }
    };

    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      const email = localStorage.getItem('email');
      localStorage.removeItem('email');
      sendCodeToBackend(email, code);
    } else {
        const error = new URL(window.location.href).searchParams.get("error");
        alert(error);
        navigate('/profile');
    }
  });

  return <div>구글 계정 연동 처리 중...</div>;
};

export default GoogleLinkCallback;