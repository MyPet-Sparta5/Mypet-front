import React from 'react';
import styles from '../styles/SocialAccountItem.module.css';
import kakaoIcon from '../assets/kakaotalk_sharing_btn_small.png';
import googleIcon from '../assets/web_light_sq_na@2x.png';

const icons = {
    KAKAO: kakaoIcon,
    GOOGLE: googleIcon,
};

const convertToSocialName = (type) => {
    if (type === 'KAKAO')
        return "카카오";
    if (type === 'GOOGLE')
        return "Google";
    return "";
}

const SocialAccountItem = ({ type, isLinked, onToggle }) => {
    return (
        <div className={styles.socialAccountItem} onClick={() => onToggle(type)}>
            <img src={icons[type]} alt={`${type} 아이콘`} className={styles.socialIcon} />
            <span className={styles.socialName}>{convertToSocialName(type)}</span>
            <span className={isLinked ? styles.linked : styles.unlinked}>
                {isLinked ? '연동됨' : '연동안됨'}
            </span>
        </div>
    );
};

export default SocialAccountItem;