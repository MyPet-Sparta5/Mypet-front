import React, { useState } from 'react';
import styles from '../styles/UserList.module.css';
import PaginationButton from '../components/PaginationButton';
import UserRoleModal from '../components/UserRoleModal';
import UserStatusModal from '../components/UserStatusModal';

const UserList = () => {
    const users = [
        { id: 1, email: 'user1@example.com', role: 'Admin', status: 'Active', warningCount: 1, signUpDate: '2023-01-15' },
        { id: 2, email: 'user2@example.com', role: 'User', status: 'Inactive', warningCount: 0, signUpDate: '2023-02-20' },
        { id: 3, email: 'user3@example.com', role: 'Moderator', status: 'Active', warningCount: 2, signUpDate: '2023-03-10' },
        { id: 4, email: 'user4@example.com', role: 'Admin', status: 'Active', warningCount: 0, signUpDate: '2023-04-05' },
        { id: 5, email: 'user5@example.com', role: 'User', status: 'Inactive', warningCount: 1, signUpDate: '2023-05-15' },
        { id: 6, email: 'user6@example.com', role: 'Moderator', status: 'Active', warningCount: 0, signUpDate: '2023-06-20' },
        { id: 7, email: 'user7@example.com', role: 'Admin', status: 'Inactive', warningCount: 2, signUpDate: '2023-07-10' },
        { id: 8, email: 'user8@example.com', role: 'User', status: 'Active', warningCount: 1, signUpDate: '2023-08-25' },
        { id: 9, email: 'user9@example.com', role: 'Moderator', status: 'Inactive', warningCount: 0, signUpDate: '2023-09-30' },
        { id: 10, email: 'user10@example.com', role: 'Admin', status: 'Active', warningCount: 2, signUpDate: '2023-10-12' },
        { id: 11, email: 'user11@example.com', role: 'User', status: 'Inactive', warningCount: 1, signUpDate: '2023-11-01' },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const totalPages = Math.ceil(users.length / usersPerPage);

    const [selectedUser, setSelectedUser] = useState(null);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

    const paginatedUsers = users.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );

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

    const handleRoleSave = (newRole) => {
        setSelectedUser({ ...selectedUser, role: newRole });
        setIsRoleModalOpen(false);
    };

    const handleStatusSave = (newStatus) => {
        setSelectedUser({ ...selectedUser, status: newStatus });
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
                    {paginatedUsers.length > 0 ? (
                        paginatedUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.email}</td>
                                <td onClick={() => openRoleModal(user)}>{user.role}</td>
                                <td onClick={() => openStatusModal(user)}>{user.status}</td>
                                <td>{user.warningCount}</td>
                                <td>{user.signUpDate}</td>
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
                    role={selectedUser.role}
                    onSave={handleRoleSave}
                    onClose={() => setIsRoleModalOpen(false)}
                />
            )}

            {isStatusModalOpen && (
                <UserStatusModal
                    status={selectedUser.status}
                    onSave={handleStatusSave}
                    onClose={() => setIsStatusModalOpen(false)}
                />
            )}
        </div>
    );
};

export default UserList;
