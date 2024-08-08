// src/setting/api.js
import axios from 'axios';
import RefreshToken from '../components/RefreshToken'; // 경로를 실제 파일 구조에 맞게 수정하세요

const baseURL = process.env.REACT_APP_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

const axiosNonAuthorization = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

const handleApiCall = async (apiCall, navigate) => {
    try {
        return await apiCall();
    } catch (error) {
        if (error.response && error.response.status === 401 && error.response.data.data === 'Expired-Token') {
            try {
                await RefreshToken(navigate);
                // Update headers after refreshing token
                axiosInstance.defaults.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
                return await apiCall();
            } catch (refreshError) {
                console.error('Token refresh error:', refreshError);
                navigate('/login'); // 만약 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
            }
        }
        throw error;
    }
};

export { axiosInstance, axiosNonAuthorization, handleApiCall };
