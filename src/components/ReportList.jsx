import React, { useState } from 'react';
import styles from '../styles/ReportList.module.css';
import PaginationButton from '../components/PaginationButton';
import ReportStatusModal from '../components/ReportStatusModal';

const ReportList = () => {
    // 예시 데이터
    const reports = [
        { id: 1, reason: '계속 이상한 사진 올려여...', status: '처리 중', reportedDate: '2023-01-15', reportedUser: 'user1@example.com', reporter: 'user2@example.com' },
        { id: 2, reason: '강아지 확대범인거 같아요', status: '처리 완료', reportedDate: '2023-02-20', reportedUser: 'user3@example.com', reporter: 'user4@example.com' },
        { id: 3, reason: '오리 고기 사진 올림 ㅡㅡ', status: '처리 중', reportedDate: '2023-03-10', reportedUser: 'user5@example.com', reporter: 'user6@example.com' },
        { id: 4, reason: '광고성 게시글입니다', status: '처리 완료', reportedDate: '2023-04-05', reportedUser: 'user7@example.com', reporter: 'user8@example.com' },
        { id: 5, reason: '우리 강아지보고 돼지래요;', status: '처리 중', reportedDate: '2023-05-15', reportedUser: 'user9@example.com', reporter: 'user10@example.com' },
        { id: 6, reason: '산책 같이하재서 나갔는데 지산책이었음;;', status: '처리 완료', reportedDate: '2023-06-20', reportedUser: 'user11@example.com', reporter: 'user12@example.com' },
        { id: 7, reason: '본인도 동물이라고 셀카만 올림', status: '처리 중', reportedDate: '2023-07-10', reportedUser: 'user13@example.com', reporter: 'user14@example.com' },
        { id: 8, reason: '저희 개한테 한번 삶았냐고 했어요', status: '처리 완료', reportedDate: '2023-08-25', reportedUser: 'user15@example.com', reporter: 'user16@example.com' },
        { id: 9, reason: '혐오 발언', status: '처리 중', reportedDate: '2023-09-30', reportedUser: 'user17@example.com', reporter: 'user18@example.com' },
        { id: 10, reason: '부적절한 내용', status: '처리 완료', reportedDate: '2023-10-12', reportedUser: 'user19@example.com', reporter: 'user20@example.com' },
        { id: 11, reason: '스팸', status: '처리 중', reportedDate: '2023-11-01', reportedUser: 'user21@example.com', reporter: 'user22@example.com' },
        { id: 12, reason: '혐오 발언', status: '처리 완료', reportedDate: '2023-12-05', reportedUser: 'user23@example.com', reporter: 'user24@example.com' },
        { id: 13, reason: '부적절한 내용', status: '처리 중', reportedDate: '2024-01-15', reportedUser: 'user25@example.com', reporter: 'user26@example.com' },
        { id: 14, reason: '스팸', status: '처리 완료', reportedDate: '2024-02-20', reportedUser: 'user27@example.com', reporter: 'user28@example.com' },
        { id: 15, reason: '혐오 발언', status: '처리 중', reportedDate: '2024-03-10', reportedUser: 'user29@example.com', reporter: 'user30@example.com' },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedReport, setSelectedReport] = useState(null);
    const reportsPerPage = 10; // 페이지당 보고서 수
    const totalPages = Math.ceil(reports.length / reportsPerPage);

    // 페이지에 따라 보여줄 보고서 데이터 필터링
    const paginatedReports = reports.slice(
        (currentPage - 1) * reportsPerPage,
        currentPage * reportsPerPage
    );

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleStatusChange = (report) => {
        setSelectedReport(report);
    };

    const handleSaveStatus = (newStatus) => {
        setSelectedReport((prev) => ({
            ...prev,
            status: newStatus,
        }));
        // 이 예제에서는 데이터를 로컬에서 업데이트합니다.
        // 실제로는 서버에 변경 사항을 저장하는 로직이 필요합니다.
    };

    const handleCloseModal = () => {
        setSelectedReport(null);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>신고 목록</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>신고사유</th>
                        <th>신고상태</th>
                        <th>신고일시</th>
                        <th>신고당한 유저</th>
                        <th>신고한 유저</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedReports.length > 0 ? (
                        paginatedReports.map(report => (
                            <tr key={report.id}>
                                <td>{report.reason}</td>
                                <td onClick={() => handleStatusChange(report)} style={{ cursor: 'pointer' }}>
                                    {report.status}
                                </td>
                                <td>{report.reportedDate}</td>
                                <td>{report.reportedUser}</td>
                                <td>{report.reporter}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">신고가 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <PaginationButton
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {selectedReport && (
                <ReportStatusModal
                    status={selectedReport.status}
                    onSave={handleSaveStatus}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default ReportList;
