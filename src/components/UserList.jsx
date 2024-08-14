import React, { useState, useEffect } from 'react';
import styles from '../styles/UserList.module.css';
import PaginationButton from '../components/PaginationButton';
import UserRoleModal from '../components/UserRoleModal';
import UserStatusModal from '../components/UserStatusModal';
import { axiosInstance, handleApiCall } from '../setting/api';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const usersPerPage = 10;

    const [selectedUser, setSelectedUser] = useState(null);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);  // Admin 권한 상태 추가
    const [emailSearch, setEmailSearch] = useState('');
    const [nicknameSearch, setNicknameSearch] = useState('');
    const [statusSearch, setStatusSearch] = useState('');
    const [roleSearch, setRoleSearch] = useState('');
    const navigate = useNavigate();

    const fetchUsers = async (page) => {
        try {
            const response = await handleApiCall(() => axiosInstance.get('/api/admin/user-manage', {
                params: {
                    page: currentPage,
                    pageSize: usersPerPage,
                    sortBy: 'createdAt,desc',
                    email: emailSearch || undefined,
                    nickname: nicknameSearch || undefined,
                    status: statusSearch || undefined,
                    role: roleSearch || undefined,
                }
            }));
            const data = response.data;
            console.log(data);
            const usersWithFormattedRoles = data.data.content.map(user => ({
                ...user,
                userRole: user.userRole.replace('ROLE_', '')
            }));
            setUsers(usersWithFormattedRoles);
            setTotalPages(data.data.totalPages);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    useEffect(() => {
        // localStorage에서 userRole 가져오기
        const role = localStorage.getItem('userRole');
        setIsAdmin(role === 'ROLE_ADMIN');
        fetchUsers(currentPage);
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const openRoleModal = (user) => {
        if (isAdmin) {
            setSelectedUser(user);
            setIsRoleModalOpen(true);
        } else {
            alert('해당 작업은 ADMIN 권한만 가능합니다.');
        }
    };

    const openStatusModal = (user) => {
        setSelectedUser(user);
        setIsStatusModalOpen(true);
    };

    const handleRoleSave = async (newRole) => {
        try {
            const response = await handleApiCall(() => axiosInstance.put(`/api/admin/user-manage/${selectedUser.id}/role`, {
                role: newRole
            }));

            if (response.status === 200) {
                fetchUsers(currentPage);
                alert(`${selectedUser.email} 유저의 권한을 ${newRole}로 변경했습니다`);
            } else {
                console.error('Failed to save role:', response.data);
            }
        } catch (error) {
            console.error('Failed to save role:', error);
        }
        setIsRoleModalOpen(false);
    };

    const handleStatusSave = async (newStatusObj) => {
        if (selectedUser.status === newStatusObj.status) {
            alert('변경하려는 상태가 현재 상태와 동일합니다.');
            return;
        }
        try {
            const response = await handleApiCall(() => axiosInstance.put(`/api/admin/user-manage/${selectedUser.id}/status`, newStatusObj));

            if (response.status === 200) {
                fetchUsers(currentPage);
                alert(`${selectedUser.email} 유저의 상태를 ${newStatusObj.status}로 변경했습니다`);
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
            <div className={styles.searchContainer}>
                <label>이메일 : </label>
                <input
                    type="text"
                    placeholder="이메일 검색"
                    value={emailSearch}
                    onChange={(e) => setEmailSearch(e.target.value)}
                    className={styles.searchInput}
                /> <label>상태 : </label>
                <select className={styles.searchInput} value={statusSearch} onChange={(e) => {
                    const value = e.target.value === '전체' ? '' : e.target.value;
                    setStatusSearch(value);
                }}> 
                    <option>전체</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENSION">SUSPENSION</option>
                    <option value="WITHDRAWAL">WITHDRAWAL</option>
                </select> <label>역할 : </label>
                <select className={styles.searchInput} value={roleSearch} onChange={(e) => {
                    const value = e.target.value === '전체' ? '' : e.target.value;
                    setRoleSearch(value);
                }}>  
                    <option>전체</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="USER">USER</option>
                    <option value="MANAGER">MANAGER</option>
                </select>
                <button onClick={() => fetchUsers(1)} className={styles.searchButton}>검색</button>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>유저 id</th>
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
                                <td>{user.id}</td>
                                <td>{user.email}</td>
                                <td className={styles.userEdit} onClick={() => openRoleModal(user)}>{user.userRole}</td>
                                <td className={styles.userEdit} onClick={() => openStatusModal(user)}>{user.userStatus}</td>
                                <td>{user.suspensionCount}</td>
                                <td>{user.createdAt.split('T')[0]}</td>
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

            {isRoleModalOpen && isAdmin && (
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
