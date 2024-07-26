import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../styles/Header.module.css';
import logo from '../assets/logo.png'; // 로고 이미지 파일 경로
import DropdownMenu from './DropdownMenu';

function Header() {
    const [user, setUser] = useState({ nickname: '', role: '' });
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login'); 
    };

    const handleSignupClick = () => {
        navigate('/signup');
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerContainer}>
                <div className={styles.logoContainer}>
                    <NavLink to="/">
                        <img src={logo} alt="로고" className={styles.logo} />
                    </NavLink>
                    <NavLink to="/admin/users-manager" className={styles.headerTitle}>나만, 펫</NavLink>
                </div>
                <nav className={styles.nav}>
                    <NavLink to="/admin/users-manager" className={({ isActive }) => isActive ? styles.navLink + ' ' + styles.active : styles.navLink}>
                        회원 관리
                    </NavLink>
                    <NavLink to="/admin/reports-view" className={({ isActive }) => isActive ? styles.navLink + ' ' + styles.active : styles.navLink}>
                        신고 목록
                    </NavLink>
                </nav>
                <div className={styles.headerButtons}>
                    {/* api 연동 후 로그인 전에는 로그인, 회원가입이 나오고 아니면 dropdownmenu가 보이도록 해주시면됩니다. 
                        어드민 헤더에서는 닉네임만 띄우도록 할 예정*/}
                    <button className={styles.button} onClick={handleLoginClick}>로그인</button>
                    <button className={styles.button} onClick={handleSignupClick}>회원가입</button>
                    <DropdownMenu nickname={user.nickname} role={user.role} />
                </div>
            </div>
        </header>
    );
}

export default Header;
