// Loading.js
import React, { useState, useEffect } from 'react';
import styles from '../styles/Loading.module.css';
import Spinner from '../assets/Loading.gif';

const Loading = () => {
  const [show, setShow] = useState(false);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShow(true);
    }, 300); // 300ms 지연 후 로딩 화면 표시

    const dotTimer = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots === '...') {
          return '';
        }
        return prevDots + '.';
      });
    }, 500); // 500ms마다 점 추가

    return () => {
      clearTimeout(showTimer);
      clearInterval(dotTimer);
    };
  }, []);

  return (
    <div className={`${styles.loadingWrapper} ${show ? styles.show : ''}`}>
      <p className={styles.loadingText}>Loading{dots}</p>
      <img src={Spinner} alt="로딩중" className={styles.loadingImage} />
    </div>
  );
};

export default Loading;
