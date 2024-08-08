import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/SuspensionList.module.css';
import PaginationButton from './PaginationButton';
import { axiosInstance, handleApiCall } from '../setting/api';

const SuspensionList = () => {
    const [suspensions, setSuspensions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const suspensionsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuspensions = async () => {
            const apiCall = () => axiosInstance.get('/api/admin/suspension-view', {
                params: {
                    page: currentPage,
                    pageSize: suspensionsPerPage,
                    sortBy: 'suspensionEndDatetime,desc'
                }
            });

            try {
                const response = await handleApiCall(apiCall, navigate);
                const { content, totalPages } = response.data.data;
                setSuspensions(content || []);
                setTotalPages(totalPages || 1);
                setLoading(false);
            } catch (error) {
                setError('데이터를 가져오는 데 실패했습니다.');
                setLoading(false);
            }
        };

        fetchSuspensions();
    }, [currentPage, navigate]);

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
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
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
                </>
            )}
        </div>
    );
};

export default SuspensionList;
