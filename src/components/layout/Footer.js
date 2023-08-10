import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import * as CF from "../../config/function";
import { enum_api_uri } from "../../config/enum";
import { termsPop, confirmPop } from "../../store/popupSlice";
import ConfirmPop from "../popup/ConfirmPop";
import logo from "../../images/logo_foot.svg";

const Footer = () => {
    const dispatch = useDispatch();
    const site_info = enum_api_uri.site_info;
    const [confirm, setConfirm] = useState(false);
    const [info, setInfo] = useState({});


    //사이트정보 가져오기
    const geInfo = () => {
        axios.get(`${site_info}`)
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setInfo({...data});
            }
        })
        .catch((error) => {
            const err_msg = CF.errorMsgHandler(error);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: err_msg,
                confirmPopBtn:1,
            }));
            setConfirm(true);
        });
    };

    
    useEffect(()=>{
        geInfo();
    },[]);


    //탑버튼
    const scrollToTop = () => {
        window.scroll({
            top: 0,
            behavior: 'smooth'
        })
    }

    return(<>
        <footer id="footer">
            <div className="top_box">
                <div className="logo"><img src={logo} alt="로고" /></div>
                <ul>
                    {info && info.site_address && <li>주소 : {info.site_address}</li>}
                    {info && info.site_manager && <li>개인정보책임관리자 및 대표 : {info.site_manager}</li>}
                </ul>
                <ul>
                    {info && info.site_num && <li>사업자 번호 : {info.site_num}</li>}
                    {info && info.site_tel && <li>연락처 : {info.site_tel}{info.site_fax && ' / '+info.site_fax}</li>}
                    <li>고객센터 운영 시간 : 13:00 - 21:30</li>
                </ul>
            </div>
            <div className="link_box">
                <ul className="flex_center flex_wrap">
                    <li>
                        <a
                            href="/"
                            // target="_blank"
                            rel="noopener noreferrer"
                        >공지사항</a>
                    </li>
                    <li>
                        <button type="button" onClick={()=>{dispatch(termsPop({termsPop:true,termsPopTab:1}))}}>개인정보 보호정책</button>
                    </li>
                    <li>
                        <button type="button" onClick={()=>{dispatch(termsPop({termsPop:true,termsPopTab:2}))}}>이메일 무단수집거부</button>
                    </li>
                    <li>
                        <button type="button" onClick={()=>{dispatch(termsPop({termsPop:true,termsPopTab:4}))}}>이용약관</button>
                    </li>
                </ul>
            </div>
            <div className="copy">COPYRIGHT© 2023 사소한 ALL RIGHTS RESERVED.</div>
        </footer>
        <div className="fixed_box">
            <ul className="list_sns">
                <li>
                    <a
                        href="https://www.youtube.com/@user-sasohan"
                        target="_blank"
                        rel="noopener noreferrer"
                    >유튜브</a>
                </li>
                <li>
                    <a
                        href="https://www.instagram.com/sasohanofficial/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >인스타그램</a>
                </li>
                <li>
                    <a
                        href="https://blog.naver.com/sasohan_official"
                        target="_blank"
                        rel="noopener noreferrer"
                    >블로그</a>
                </li>
            </ul>
            <button type="button" className="btn_top" onClick={scrollToTop}></button>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default Footer;