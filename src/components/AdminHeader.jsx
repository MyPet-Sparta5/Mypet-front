import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../styles/AdminHeader.module.css';
import logo from '../assets/logo.png'; // 로고 이미지 파일 경로
import DropdownMenu from './DropdownMenu';

function Header() {

    const [user, setUser] = useState({ nickname: '', role: '', accessToken: '' });

    useEffect(() => {
        const storedNickname = localStorage.getItem('nickname');
        const storedrole = localStorage.getItem('userRole');
        const storedAccessToken = localStorage.getItem('accessToken');

        if (storedNickname && storedrole && storedAccessToken) {
            setUser({ nickname: storedNickname, role: storedrole, accessToken: storedAccessToken });
        }
    }, []);


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
                    <NavLink to="/admin/user-list" className={({ isActive }) => isActive ? styles.navLink + ' ' + styles.active : styles.navLink}>
                        회원 관리
                    </NavLink>
                    <NavLink to="/admin/report-list" className={({ isActive }) => isActive ? styles.navLink + ' ' + styles.active : styles.navLink}>
                        신고 목록
                    </NavLink>
                    <NavLink to="/admin/suspension-list" className={({ isActive }) => isActive ? styles.navLink + ' ' + styles.active : styles.navLink}>
                        회원 정지 목록
                    </NavLink>
                    <NavLink to="/admin/post-list" className={({ isActive }) => isActive ? styles.navLink + ' ' + styles.active : styles.navLink}>
                        게시물 관리
                    </NavLink>
                </nav>
                <div className={styles.headerButtons}>
                    <DropdownMenu nickname={user.nickname} role={user.role} />
                </div>
            </div>
        </header>
    );
}

export default Header;
