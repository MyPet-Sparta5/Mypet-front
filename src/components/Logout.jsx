import { axiosInstance, handleApiCall } from '../setting/api';

const handleLogout = async (navigate) => {
    try {
        const apiCall = () => axiosInstance.post('/api/auth/logout', {}, {
            withCredentials: true
        });

        const response = await handleApiCall(apiCall, navigate);

        if (response.status === 200) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('nickname');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userId');
        } else {
            console.log('로그아웃 중 오류가 발생했습니다.');
        }
    } catch (error) {
        console.error('로그아웃 중 오류가 발생했습니다.', error);
        alert(`${error.response?.data?.message}` || '로그아웃 중 오류가 발생했습니다.');
    }
};

export default handleLogout;
