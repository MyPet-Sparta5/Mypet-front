import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/ReportList.module.css';
import PaginationButton from '../components/PaginationButton';
import ReportStatusModal from '../components/ReportStatusModal';
import { axiosInstance, handleApiCall } from '../setting/api'; 

const ReportList = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const reportsPerPage = 10;

    const [selectedReport, setSelectedReport] = useState(null);

    const fetchReports = async (page) => {
        try {
            const response = await handleApiCall(() => axiosInstance.get('/api/admin/report-view', {
                params: {
                    page,
                    pageSize: reportsPerPage,
                    sortBy: 'createdAt,desc'
                }
            }));
            const data = response.data;

            if (data && data.data && data.data.content) {
                setReports(data.data.content);
                setTotalPages(data.data.totalPages);
            } else {
                setReports([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error('Failed to fetch reports:', error);
        }
    };

    useEffect(() => {
        fetchReports(currentPage);
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleStatusChange = (report) => {
        setSelectedReport(report);
    };

    const handleSaveStatus = async (newStatus) => {
        try {
            const response = await handleApiCall(() => axiosInstance.put(`/api/admin/report-view/${selectedReport.id}/report-status`, {
                reportStatus: newStatus
            }));

            if (response.status === 200) {
                fetchReports(currentPage);
                alert(`${selectedReport.reportIssue} \n신고 상태 변경 - ${newStatus}`);
            } else {
                console.error('Failed to save status:', response.data);
            }
        } catch (error) {
            console.error('Failed to save status:', error);
        }
        setSelectedReport(null);
    };

    const handleCloseModal = () => {
        setSelectedReport(null);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleString('ko-KR', options).replace(/\.\s/g, '. ').replace(/:\d{2}\s/, ' ');
    };

    const navigateToPost = (report) => {
        const targetPath = report.reportedPostCategory === 'BOAST' ? `/pet/${report.reportedPostId}` : `/posts/${report.reportedPostId}`;
        navigate(targetPath);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>신고 목록</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>신고 사유</th>
                        <th>신고당한 게시물 ID</th>
                        <th>게시물 작성자 id</th>
                        <th>신고 상태</th>
                        <th>신고 일시</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.length > 0 ? (
                        reports.map(report => (
                            <tr key={report.id}>
                                <td>{report.reportIssue}</td>
                                <td className={styles.reportEdit} onClick={() => navigateToPost(report)}>{report.reportedPostId}</td>
                                <td>{report.reportedPostUserId}</td>
                                <td className={styles.reportEdit} onClick={() => handleStatusChange(report)}>
                                    {report.reportStatus}
                                </td>
                                <td>{formatDate(report.createdAt)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No reports available.</td>
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
                    issue={selectedReport.reportIssue}
                    status={selectedReport.reportStatus}
                    onSave={handleSaveStatus}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default ReportList;
