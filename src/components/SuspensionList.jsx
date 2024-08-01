import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/SuspensionList.module.css';
import PaginationButton from './PaginationButton';

const SuspensionList = () => {
    //예시 데이터
    const suspensions = [
        { id: 1, issue: "유해 게시물", userEmail: "test@email.com", startDate: "2024-07-20", endDate: "2124-07=20" },
        { id: 2, issue: "유해 게시물", userEmail: "test@email.com", startDate: "2024-07-20", endDate: "2124-07=20" },
        { id: 3, issue: "회원 상태 변경", userEmail: "test@email.com", startDate: "2024-07-20", endDate: "2124-07=20" },
        { id: 4, issue: "유해 게시물", userEmail: "test@email.com", startDate: "2024-07-20", endDate: "2124-07=20" },
        { id: 5, issue: "유해 게시물", userEmail: "test@email.com", startDate: "2024-07-20", endDate: "2124-07=20" },
        { id: 6, issue: "유해 게시물", userEmail: "test@email.com", startDate: "2024-07-20", endDate: "2124-07=20" },
        { id: 7, issue: "회원 상태 변경", userEmail: "test@email.com", startDate: "2024-07-20", endDate: "2124-07=20" }
    ]
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [selectedReport, setSelectedReport] = useState(null);


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
                        <th>정지 중지일</th>
                    </tr>
                </thead>
                <tbody>
                    {suspensions.length > 0 ? (
                        suspensions.map(suspension => (
                            <tr key={suspension.id}>
                                <td>{suspension.issue}</td>
                                <td>{suspension.userEmail}</td>
                                <td>{suspension.startDate}</td>
                                <td>{suspension.endDate}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No suspensions available.</td>
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
