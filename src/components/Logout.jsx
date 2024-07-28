import axios from 'axios';

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

      // 로그아웃 후 리다이렉트
      navigate('/');
      window.location.reload();
    } else {
      alert('로그아웃 중 오류가 발생했습니다.')
    }
  } catch (error) {
    console.error('로그아웃 중 오류가 발생했습니다.', error);
    alert(`${error.response.data.message}` || '로그아웃 중 오류가 발생했습니다.');
  }
};

export default handleLogout;