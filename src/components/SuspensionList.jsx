import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/SuspensionList.module.css';
import PaginationButton from './PaginationButton';
import { axiosInstance, handleApiCall } from '../setting/api';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { format } from 'date-fns';

registerLocale('ko', ko);

const SuspensionList = () => {
    const [suspensions, setSuspensions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [emailSearch, setEmailSearch] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const suspensionsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        fetchSuspensions();
    }, [currentPage, navigate]);

    const fetchSuspensions = async () => {
        const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : undefined;
        const formattedEndDate = endDate ? format(endDate, 'yyyy-MM-dd') : undefined;

        const apiCall = () => axiosInstance.get('/api/admin/suspension-view', {
            params: {
                page: currentPage,
                pageSize: suspensionsPerPage,
                sortBy: 'suspensionEndDatetime,desc',
                email: emailSearch,
                startDate: formattedStartDate,
                endDate: formattedEndDate
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
            <div className={styles.searchContainer}>
                <div>
                    <label>이메일 : </label>
                    <input
                        type="text"
                        placeholder="이메일 검색"
                        value={emailSearch}
                        onChange={(e) => setEmailSearch(e.target.value)}
                        className={styles.searchInput}
                    />
                    <label>기간 조회 : </label>
                    <DatePicker
                        className={styles.searchDate}
                        locale="ko"
                        dateFormat='yyyy-MM-dd'
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => {
                            setDateRange(update);
                        }}
                        isClearable
                    />
                </div>
                <div>
                    <button onClick={() => fetchSuspensions(1)} className={styles.searchButton}>검색</button>
                </div>
            </div>
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
                                    <td colSpan="4">정지 목록이 없습니다.</td>
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
