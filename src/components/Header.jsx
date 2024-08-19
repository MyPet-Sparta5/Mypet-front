import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../styles/Header.module.css';
import logo from '../assets/logo.png'; // 로고 이미지 파일 경로
import DropdownMenu from './DropdownMenu';

function Header() {

    const [user, setUser] = useState({ nickname: '', role: '', accessToken: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const storedNickname = localStorage.getItem('nickname');
        const storedrole = localStorage.getItem('userRole');
        const storedAccessToken = localStorage.getItem('accessToken');

        if (storedNickname && storedrole && storedAccessToken) {
            setUser({ nickname: storedNickname, role: storedrole, accessToken: storedAccessToken });
        }
    }, []);

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerContainer}>
                <div className={styles.logoContainer}>
                    <NavLink to="/">
                        <img src={logo} alt="로고" className={styles.logo} />
                    </NavLink>
                    <NavLink to="/" className={styles.headerTitle}>나만, 펫</NavLink>
                </div>
                <nav className={styles.nav}>
                    <NavLink to="/community" className={({ isActive }) => isActive ? styles.navLink + ' ' + styles.active : styles.navLink}>
                        통합 게시판
                    </NavLink>
                    <NavLink to="/gallery" className={({ isActive }) => isActive ? styles.navLink + ' ' + styles.active : styles.navLink}>
                        펫 자랑 게시판
                    </NavLink>
                    <NavLink to="/freedom" className={({ isActive }) => isActive ? styles.navLink + ' ' + styles.active : styles.navLink}>
                        자유 게시판
                    </NavLink>
                    <NavLink to="/facility-finder" className={({ isActive }) => isActive ? styles.navLink + ' ' + styles.active : styles.navLink}>
                        동물병원 찾기
                    </NavLink>
                </nav>
                <div className={styles.headerButtons}>
                    {user.accessToken ? (
                        <DropdownMenu nickname={user.nickname} role={user.role} />
                    ) : (
                        <>
                            <button className={styles.button} onClick={handleLoginClick}>로그인</button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
