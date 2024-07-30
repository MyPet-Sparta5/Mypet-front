import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UserEditModal from '../components/UserEditModal';
import ChangePasswordModal from './ChangePasswordModal';
import WithdrawModal from '../components/WithdrawModal';
import styles from '../styles/Profile.module.css';

const dummyPosts = [
    { id: 1, category: '자랑하기', title: '자랑글 1', likes: 10 },
    { id: 2, category: '자유게시판', title: '자유게시글 1', likes: 5 },
    { id: 3, category: '자랑하기', title: '자랑글 2', likes: 8 },
    { id: 4, category: '자유게시판', title: '자유게시글 2', likes: 15 },
    { id: 5, category: '자랑하기', title: '자랑글 3', likes: 7 },
    { id: 6, category: '자유게시판', title: '자유게시글 3', likes: 12 },
    { id: 7, category: '자랑하기', title: '자랑글 4', likes: 3 },
    { id: 8, category: '자유게시판', title: '자유게시글 4', likes: 9 },
    { id: 9, category: '자랑하기', title: '자랑글 5', likes: 6 },
    { id: 10, category: '자유게시판', title: '자유게시글 5', likes: 4 },
];

const Profile = () => {
    const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [nickname, setNickname] = useState('홍길동');
    const [email, setEmail] = useState('hong@example.com');
    const [posts] = useState(dummyPosts);

    const handleOpenUserEditModal = () => {
        setIsUserEditModalOpen(true);
    };

    const handleCloseUserEditModal = () => {
        setIsUserEditModalOpen(false);
    };

    const handleOpenChangePasswordModal = () => {
        setIsChangePasswordModalOpen(true);
    };

    const handleCloseChangePasswordModal = () => {
        setIsChangePasswordModalOpen(false);
    };

    const handleOpenWithdrawModal = () => {
        setIsWithdrawModalOpen(true);
    };

    const handleCloseWithdrawModal = () => {
        setIsWithdrawModalOpen(false);
    };

    const handleUserEditConfirm = (data) => {
        console.log('회원정보 수정:', data);
        setNickname(data.nickname);
        handleCloseUserEditModal();
    };

    const handleChangePasswordConfirm = (data) => {
        console.log('비밀번호 변경:', data);
        handleCloseChangePasswordModal();
    };

    const handleWithdrawConfirm = () => {
        console.log('회원탈퇴 확인');
        handleCloseWithdrawModal();
    };

    return (
        <div className={styles.profilePage}>
            <div className={styles.pageTitle}>마이페이지</div>
            <div className={styles.container}>
                <div className={styles.leftContainer}>
                    <div className={styles.profileBox}>
                        <div className={styles.profileContent}>
                            <h3>닉네임: {nickname}</h3>
                            <p>이메일: {email}</p>
                        </div>
                        <div className={styles.buttonContainer}>
                            <button className={styles.button} onClick={handleOpenUserEditModal}>회원정보 수정</button>
                            <button className={styles.button} onClick={handleOpenChangePasswordModal}>비밀번호 수정</button>
                        </div>
                    </div>
                    <div className={styles.withdrawContainer}>
                        <span className={styles.withdrawText} onClick={handleOpenWithdrawModal}>회원탈퇴</span>
                    </div>
                </div>
                <div className={styles.rightContainer}>
                    <div className={styles.tableContainer}>
                        <h2 className={styles.heading}>나의 최근 게시글 목록 [10개]</h2>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>카테고리</th>
                                    <th>제목</th>
                                    <th>좋아요 수</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.length > 0 ? (
                                    posts.map(post => (
                                        <tr key={post.id} className={styles.clickableRow}>
                                            <td>{post.category}</td>
                                            <td><Link to={`/posts/${post.id}`} className={styles.postLink}>{post.title}</Link></td>
                                            <td>{post.likes}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3">게시물이 없습니다.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <Link to="/community" className={styles.viewMore}>통합 게시판</Link>
                    </div>
                </div>
            </div>

            {isUserEditModalOpen && (
                <UserEditModal
                    nickname={nickname}
                    email={email}
                    onSave={handleUserEditConfirm}
                    onClose={handleCloseUserEditModal}
                />
            )}

            {isChangePasswordModalOpen && (
                <ChangePasswordModal
                    onSave={handleChangePasswordConfirm}
                    onClose={handleCloseChangePasswordModal}
                />
            )}

            {isWithdrawModalOpen && (
                <WithdrawModal
                    title="회원탈퇴"
                    content="정말 탈퇴하시겠습니까?"
                    onConfirm={handleWithdrawConfirm}
                    onClose={handleCloseWithdrawModal}
                />
            )}
        </div>
    );
}

export default Profile;
