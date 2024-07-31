import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserEditModal from '../components/UserEditModal';
import ChangePasswordModal from './ChangePasswordModal';
import WithdrawModal from '../components/WithdrawModal';
import styles from '../styles/Profile.module.css';
import RefreshToken from './RefreshToken';
import handleLogout from './Logout';

const Profile = () => {
    const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [postList, setPostList] = useState([]);
    const navigate = useNavigate();

    const transformPostData = (data) => {
        const categoryMapping = {
            "BOAST": "자랑하기",
            "FREEDOM": "자유게시판"
        };

        return data.map(post => ({
            id: post.id,
            category: categoryMapping[post.category] || post.category,
            title: post.title,
            createdTime: new Date(post.createAt).toLocaleDateString(),
            likes: post.likeCount,
        }));
    };

    const navigateToPost = (post) => {
        if (post.category === '자랑하기') {
            navigate(`/pet/${post.id}`);
        } else {
            navigate(`/posts/${post.id}`);
        }
    };

    useEffect(() => {
        // 사용자 정보를 불러오는 API 호출
        const fetchUserData = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) {
                    console.error('액세스 토큰이 없습니다.');
                    navigate('/');
                    window.location.reload();
                    return;
                }

                const response = await axios.get(
                    'http://localhost:8080/api/users', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    withCredentials: true
                });

                const userData = response.data.data;
                setNickname(userData.nickname);
                setEmail(userData.email);
                setPostList(transformPostData(userData.postList));
            } catch (error) {
                if (error.response?.status === 401 && error.response.data.data === 'Expired-Token') {
                    try {
                        await RefreshToken(navigate);
                        fetchUserData();
                    } catch (refreshError) {
                        console.error('Token refresh error:', refreshError);
                    }
                } else {
                    alert(`${error.response.data.message}` || '사용자 정보를 불러오는 데 실패했습니다.');
                }
            }
        };

        fetchUserData();
    }, [navigate]);

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

    const handleUserEditConfirm = async (data) => {
        console.log('회원정보 수정:', data);
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                console.error('액세스 토큰이 없습니다.');
                return;
            }

            const response = await axios.put(
                'http://localhost:8080/api/users',
                {
                    newNickname: data.nickname,
                    currentPassword: data.password
                }, {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true
            });

            if (response.status === 200) {
                localStorage.setItem('nickname', response.data.data.newNickname); // 로컬 스토리지에 수정된 닉네임으로 교체
                alert(`닉네임이 "${response.data.data.newNickname}"(으)로 수정되었습니다.`);
                handleCloseUserEditModal();
                window.location.reload();
            }
        } catch (error) {
            if (error.response?.status === 401 && error.response.data.data === 'Expired-Token') {
                try {
                    await RefreshToken(navigate);
                    handleUserEditConfirm(data);
                } catch (refreshError) {
                    console.error('Token refresh error:', refreshError);
                }
            } else {
                alert(`${error.response.data.message}` || '회원정보 수정이 실패했습니다.');
            }
        }
    };

    const handleChangePasswordConfirm = async (data) => {
        console.log('비밀번호 변경:', data);
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                console.error('액세스 토큰이 없습니다.');
                return;
            }

            const response = await axios.put(
                'http://localhost:8080/api/users/password',
                {
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                    newRepeatPassword: data.confirmNewPassword
                }, {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true
            });

            if (response.status === 200) {
                handleLogout(navigate);
                handleCloseChangePasswordModal();
                alert('비밀번호 변경이 완료 되었습니다. 다시 로그인 해주세요!');
                navigate('/login');
                window.location.reload();
            }
        } catch (error) {
            if (error.response?.status === 401 && error.response.data.data === 'Expired-Token') {
                try {
                    await RefreshToken(navigate);
                    handleChangePasswordConfirm(data);
                } catch (refreshError) {
                    console.error('Token refresh error:', refreshError);
                }
            } else {
                alert(`${error.response.data.message}` || '비밀번호 변경이 실패했습니다.');
            }
        }
    };

    const handleWithdrawConfirm = async () => {
        console.log('회원탈퇴 확인');
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                console.error('액세스 토큰이 없습니다.');
                return;
            }

            const response = await axios.put(
                'http://localhost:8080/api/users/withdraw',
                {}, {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true
            });

            if (response.status === 200) {
                handleLogout(navigate);
                handleCloseWithdrawModal();
                alert('회원탈퇴가 완료 되었습니다. 메인 페이지로 이동합니다.');
                navigate('/');
                window.location.reload();
            }
        } catch (error) {
            if (error.response?.status === 401 && error.response.data.data === 'Expired-Token') {
                try {
                    await RefreshToken(navigate);
                    handleWithdrawConfirm();
                } catch (refreshError) {
                    console.error('Token refresh error:', refreshError);
                }
            } else {
                alert(`${error.response.data.message}` || '회원탈퇴가 실패했습니다.');
            }
        }
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
                        <h2 className={styles.heading}>나의 최근 게시글 목록</h2>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>카테고리</th>
                                    <th>제목</th>
                                    <th>작성 일자</th>
                                    <th>좋아요 수</th>
                                </tr>
                            </thead>
                            <tbody>
                                {postList.length > 0 ? (
                                    postList.map(post => (
                                        <tr key={post.id} className={styles.clickableRow}>
                                            <td>{post.category}</td>
                                            <td key={post.id} onClick={() => navigateToPost(post)} className={styles.postLink}>{post.title}</td>
                                            <td>{post.createdTime}</td>
                                            <td>{post.likes}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">게시물이 없습니다.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <Link to={`/my-post-list/${email}`} className={styles.viewMore}>더보기</Link>
                    </div>
                </div>
            </div>

            {isUserEditModalOpen && (
                <UserEditModal
                    nickname={nickname}
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
