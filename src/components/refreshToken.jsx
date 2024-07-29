import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RefreshToken = async () => {
    const navigate = useNavigate();

    try {
        // refresh token을 포함한 요청을 서버로 보냄
        const response = await axios.post(
            'http://localhost:8080/api/auth/refresh', {
        }, { withCredentials: true } // 쿠키를 포함하여 요청
        );

        if (response.status === 200) {
            // 새로운 액세스 토큰을 로컬 스토리지에 저장
            const newAccessToken = response.headers['authorization'];
            localStorage.setItem('accessToken', newAccessToken.replace('Bearer ', ''));
            console.log('토큰 재발급이 완료 되었습니다!');
        } else {
            console.log('토큰 재발급 실패!!');
        }
    } catch (error) {
        console.error('토큰 재발급 실패!!', error.response.data.message);

        localStorage.removeItem('accessToken');
        localStorage.removeItem('nickname');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        
        alert('로그인이 만료되었습니다. 다시 로그인 해주세요!');
        navigate('/login'); // 로그인 페이지로 이동
    }
};

export default RefreshToken;