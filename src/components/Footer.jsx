import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Footer.css";
import { FaGithub } from "react-icons/fa";
import { RxNotionLogo } from "react-icons/rx";

function Footer() {
    const navigate = useNavigate();

    return (
        <div className="footer">
            <div className="footer-wrapper">
                <div className="footer-nav-wrapper">
                    <div className="footer-item-wrapper">
                        <div className="footer-item">
                            <a target="_blank" rel="noopener noreferrer" href="https://github.com/MyPet-Sparta5">
                                <FaGithub /> Github
                            </a>
                        </div>
                        <div className="border"></div>
                        <div className="footer-item">
                            <a target="_blank" rel="noopener noreferrer" href="https://teamsparta.notion.site/PetZoa-e28e0e8aef1349bc866f86aa676183b8">
                                <RxNotionLogo /> Team notion
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-nav-wrapper">
                <table className="footer-table-wrapper">
                    <tbody>
                        <tr className="footer-info-item">
                            <th className="info-title"> PetZoa 이야기, </th>
                            <th className="info-title"> PetZoa 이메일 </th>
                            <th className="info-title"> 내일배움캠프 Java 5기 </th>
                        </tr>

                        <tr className="footer-info-item">
                            <td className="info-description" >반려동물을 키우는 사람은 없지만 랜선집사들이에요! <br />
                                나만 없는 펫들 마구마구 자랑해주세요~!</td>
                            <td className="info-description" > mypetzoa@gmail.com <br />
                                문의사항은 위 메일로 보내주세요.</td>
                            <td className="info-description" > 리더 : &emsp;김세림 <br/> 부리더 : 이가은 <br/> 팀원 : &emsp;김승수, 박민혁, 이윤성</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="copyright">Copyright ⓒ 2024 - petzoa. All rights reserved.</div>
        </div>
    );
}

export default Footer;
