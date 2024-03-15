import { useState, useEffect } from "react";
import ConfirmPop from "../components/popup/ConfirmPop";
import logo from "../images/logo_big.svg";
import img_complete from "../images/apply_complete_img.svg";


const ApplyCompleted = () => {
    const [confirm, setConfirm] = useState(false);

    //Google tag 
    useEffect(() => {
        // Google Analytics 초기화
        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'AW-10879238974');
    }, []);



    return(<>
        <div className="apply_wrap">
            <div className="top_banner">
                <div className="logo">
                    <img src={logo} alt="로고" />
                </div>
                <p>사람이 사람을 소개합니다.</p>
            </div>
            <div className="cont_box complete_box">
                <div className="inner">
                    <div className="top_tit_box tx_c">
                        <h5 className="title">신청서 제출이 완료되었어요!</h5>
                        <div className="img">
                            <img src={img_complete} alt="이미지" />
                        </div>
                        <p className="sub_title">신청서를 제출해 주셔서 감사합니다. <br/>제출한 신청서가 확인될 때까지 기다려 주세요!</p>
                    </div>
                    <ul className="link_ul">
                        <li>
                            <a href="/" target="_blank"  rel="noopener noreferrer" >사소한 사이트 바로가기</a>
                        </li>
                        <li>
                            <a href="https://www.youtube.com/@user-sasohan" target="_blank" rel="noopener noreferrer" >사소한 공식 유튜브 바로가기</a>
                        </li>
                        <li>
                            <a href="https://blog.naver.com/sasohan_official" target="_blank" rel="noopener noreferrer" >사소한 공식 블로그 바로가기</a>
                        </li>
                        <li>
                            <a href="https://www.instagram.com/sasohan_official_/" target="_blank" rel="noopener noreferrer" >사소한 공식 인스타그램 바로가기</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default ApplyCompleted;