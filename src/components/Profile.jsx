// src/pages/Profile.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UserEditModal from '../components/UserEditModal';
import WithdrawModal from '../components/WithdrawModal';
import styles from '../styles/Profile.module.css';

const samplePosts = {
    freePosts: [
        "자유게시글 1", "자유게시글 2", "자유게시글 3", "자유게시글 4", 
        "자유게시글 5", "자유게시글 6", "자유게시글 7", "자유게시글 8", 
        "자유게시글 9", "자유게시글 10", "자유게시글 11"
    ]
};

function Profile() {
    const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [nickname, setNickname] = useState('홍길동');
    const [email, setEmail] = useState('hong@example.com');

    const handleOpenUserEditModal = () => {
        setIsUserEditModalOpen(true);
    };

    const handleCloseUserEditModal = () => {
        setIsUserEditModalOpen(false);
    };

    const handleOpenWithdrawModal = () => {
        setIsWithdrawModalOpen(true);
    };

    const handleCloseWithdrawModal = () => {
        setIsWithdrawModalOpen(false);
    };

    const handleUserEditConfirm = (data) => {
        console.log('회원정보 수정:', data);
        // 회원정보 수정 로직
        setNickname(data.nickname);
        setEmail(data.email);
        handleCloseUserEditModal();
    };

    const handleWithdrawConfirm = () => {
        console.log('회원탈퇴 확인');
        // 회원탈퇴 로직
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
                            <button className={styles.button} onClick={handleOpenWithdrawModal}>회원탈퇴</button>
                        </div>
                    </div>
                </div>
                <div className={styles.rightContainer}>
                    <div className={styles.postList}>
                        <h2>내 게시글 목록</h2>
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <tbody>
                                    {samplePosts.freePosts.slice(0, 10).map((title, index) => (
                                        <tr key={index} className={styles.clickableRow}>
                                            <td><Link to={`/posts/${index}`} className={styles.postLink}>{title}</Link></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Link to="/community" className={styles.viewMore}>자유게시글 목록 보기</Link>
                        </div>
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
