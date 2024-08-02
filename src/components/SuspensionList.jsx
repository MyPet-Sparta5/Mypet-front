import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/SuspensionList.module.css';
import PaginationButton from './PaginationButton';
import RefreshToken from './RefreshToken';

const SuspensionList = () => {
    const [suspensions, setSuspensions] = useState([]); // Initialize with an empty array
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const suspensionsPerPage = 10;
    const navigate = useNavigate();

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8080/api',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
        },
        withCredentials: true
    });

    const handleApiCall = async (apiCall) => {
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
                    setError('토큰 갱신 실패. 다시 로그인해 주세요.');
                }
            } else {
                setError('API 호출 중 오류 발생.');
            }
            throw error;
        }
    };

    useEffect(() => {
        const fetchSuspensions = async () => {
            try {
                const response = await handleApiCall(() =>
                    axiosInstance.get(`/admin/suspension-view`, {
                        params: {
                            page: currentPage, 
                            pageSize: suspensionsPerPage,
                            sortBy: 'suspensionEndDatetime,desc'
                        }
                    })
                );
                console.log(response);
                const { content, totalPages } = response.data.data;
                setSuspensions(content || []); // Default to an empty array if undefined
                setTotalPages(totalPages || 1); // Default to 1 if undefined
                setLoading(false);
            } catch (error) {
                setError('데이터를 가져오는 데 실패했습니다.');
                setLoading(false);
            }
        };

        fetchSuspensions();
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleString('ko-KR', options).replace(/\.\s/g, '. ').replace(/:\d{2}\s/, ' ');
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>회원 정지 목록</h2>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>정지 사유</th>
                                <th>정지 유저</th>
                                <th>정지 시작일</th>
                                <th>정지 중단일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suspensions.length > 0 ? (
                                suspensions.map(suspension => (
                                    <tr key={suspension.id}>
                                        <td>{suspension.suspensionIssue}</td>
                                        <td>{suspension.suspensionUserEmail}</td>
                                        <td>{formatDate(suspension.suspensionStartDatetime)}</td>
                                        <td>{formatDate(suspension.suspensionEndDatetime)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No suspensions available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <PaginationButton
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
        </div>
    );
};

export default SuspensionList;
