import axios from 'axios';
import refreshAccessToken from './refreshToken';

const handleLogout = async (navigate) => {

  try {
    // 로컬 스토리지에서 액세스 토큰 가져오기
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('액세스 토큰이 없습니다.');
      return;
    }

    // 로그아웃 API 호출
    const response = await axios.post(
      'http://localhost:8080/api/auth/logout', {
    }, {
      headers: { Authorization: `Bearer ${accessToken}` }, // 'Bearer ' 문구 포함 엑세스 토큰
      withCredentials: true
    });

    if (response.status == 200) {
      // 로컬 스토리지에서 사용자 정보 제거
      localStorage.removeItem('accessToken');
      localStorage.removeItem('nickname');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId')

      alert('로그아웃이 완료 되었습니다.');

      // 로그아웃 후 리다이렉트
      navigate('/');
      window.location.reload();
    } else {
      console.log('로그아웃 중 오류가 발생했습니다.');
    }
  } catch (error) {
    console.error('로그아웃 중 오류가 발생했습니다.', error);

    // 에러 상태코드 '401' 이고, 서버의 응답 데이터가 'Expired-Token'인 경우 토큰 리프레쉬
    if (error.response.status == 401 && error.response.data.data == 'Expired-Token') {
      await refreshAccessToken();
      handleLogout(navigate); // 다시 수행하고 있던 함수 재호출
    } else {
      alert(`${error.response.data.message}` || '로그아웃 중 오류가 발생했습니다.');
    }
  }
};

export default handleLogout;