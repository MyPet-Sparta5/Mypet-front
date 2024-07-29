import React, { useState, useEffect } from 'react';
import styles from '../styles/UserList.module.css';
import PaginationButton from '../components/PaginationButton';
import UserRoleModal from '../components/UserRoleModal';
import UserStatusModal from '../components/UserStatusModal';
import axios from 'axios';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const usersPerPage = 10;

    const [selectedUser, setSelectedUser] = useState(null);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8080', // API 기본 URL 설정
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
        }
    });

    const fetchUsers = async (page) => {
        try {
            const response = await axiosInstance.get('/api/admin/user-manage', {
                params: {
                    page: currentPage,
                    pageSize: usersPerPage,
                    sortBy: 'createdAt,desc'
                }
            });
            const data = response.data;
            const usersWithFormattedRoles = data.data.content.map(user => ({
                ...user,
                userRole: user.userRole.replace('ROLE_', '') // 'ROLE_' 접두사 제거
            }));
            setUsers(usersWithFormattedRoles);
            setTotalPages(data.data.totalPages);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const openRoleModal = (user) => {
        setSelectedUser(user);
        setIsRoleModalOpen(true);
    };

    const openStatusModal = (user) => {
        setSelectedUser(user);
        setIsStatusModalOpen(true);
    };

    const handleRoleSave = async (newRole) => {
        try {
            const response = await axiosInstance.put(`/api/admin/user-manage/${selectedUser.id}/role`, {
                role: newRole
            });

            if (response.status === 200) {
                fetchUsers(currentPage); // Update user list after saving role
                alert(`${selectedUser.email} 유저의 권한을 ${newRole}로 변경했습니다`);
            } else {
                console.error('Failed to save role:', response.data);
            }
        } catch (error) {
            console.error('Failed to save role:', error);
        }
        setIsRoleModalOpen(false);
    };

    const handleStatusSave = async (newStatus) => {
        try {
            const response = await axiosInstance.put(`/api/admin/user-manage/${selectedUser.id}/status`, {
                status: newStatus
            });

            if (response.status === 200) {
                fetchUsers(currentPage); // Update user list after saving status
                alert(`${selectedUser.email} 유저의 상태를 ${newStatus}로 변경했습니다`);
            } else {
                console.error('Failed to save status:', response.data);
            }
        } catch (error) {
            console.error('Failed to save status:', error);
        }
        setIsStatusModalOpen(false);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>유저 목록</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>이메일</th>
                        <th>유저 권한</th>
                        <th>유저 상태</th>
                        <th>누적 경고 수</th>
                        <th>가입 일자</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map(user => (
                            <tr key={user.id}>
                                <td>{user.email}</td>
                                <td className={styles.userEdit} onClick={() => openRoleModal(user)}>{user.userRole}</td>
                                <td className={styles.userEdit} onClick={() => openStatusModal(user)}>{user.userStatus}</td>
                                <td>{user.penaltyCount}</td>
                                <td>{user.createAt.split('T')[0]}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">유저가 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <PaginationButton
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {isRoleModalOpen && (
                <UserRoleModal
                    email={selectedUser.email}
                    role={selectedUser.userRole}
                    onSave={handleRoleSave}
                    onClose={() => setIsRoleModalOpen(false)}
                />
            )}

            {isStatusModalOpen && (
                <UserStatusModal
                    email={selectedUser.email}
                    status={selectedUser.userStatus}
                    onSave={handleStatusSave}
                    onClose={() => setIsStatusModalOpen(false)}
                />
            )}
        </div>
    );
};

export default UserList;
