import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import * as CF from "../../config/function";
import { enum_api_uri } from "../../config/enum";
import { confirmPop } from "../../store/popupSlice";
import { aboutVipScroll } from "../../store/commonSlice";
import ConfirmPop from "../popup/ConfirmPop";
import logo from "../../images/logo_color.svg";

const Footer = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const site_info = enum_api_uri.site_info;
    const [confirm, setConfirm] = useState(false);
    const [info, setInfo] = useState({});
    const location = useLocation();
    const [mainPage, setMainPage] = useState(null);

    //사이트정보 가져오기
    const geInfo = () => {
        axios
            .get(`${site_info}`)
            .then((res) => {
                if (res.status === 200) {
                    let data = res.data;
                    setInfo({ ...data });
                }
            })
            .catch((error) => {
                const err_msg = CF.errorMsgHandler(error);
                dispatch(
                    confirmPop({
                        confirmPop: true,
                        confirmPopTit: "알림",
                        confirmPopTxt: err_msg,
                        confirmPopBtn: 1,
                    })
                );
                setConfirm(true);
            });
    };

    useEffect(() => {
        geInfo();
    }, []);

    //탑버튼
    const scrollToTop = () => {
        window.scroll({
            top: 0,
            behavior: "smooth",
        });
    };

    //메인페이지인지 확인
    useEffect(() => {
        const path = location.pathname;
        if (path == "/") {
            setMainPage(true);
        } else {
            setMainPage(false);
        }
    }, [location]);

    return (
        <>
            <footer id="footer" className={mainPage ? "main" : ""}>
                <div className="top_box">
                    <div className="logo">
                        <img src={logo} alt="로고" />
                    </div>
                    {props.title && (
                        <ul>
                            <li>상호명 : 사소한</li>
                        </ul>
                    )}
                    <ul>
                        {info && info.site_address && (
                            <li>주소 : {info.site_address}</li>
                        )}
                        {info && info.site_manager && (
                            <li>
                                개인정보책임관리자 및 대표 : {info.site_manager}
                            </li>
                        )}
                    </ul>
                    <ul>
                        {info && info.site_num && (
                            <li>사업자 번호 : {info.site_num}</li>
                        )}
                        {info && info.site_tel && (
                            <li>
                                연락처 : {info.site_tel}
                                {info.site_fax && " / " + info.site_fax}
                            </li>
                        )}
                        <li>운영 시간 : 13:00 - 21:30</li>
                    </ul>
                    <ul>
                        {info && info.site_email && (
                            <li>이메일 : {info.site_email}</li>
                        )}
                        <li>본사 연락처 : 070-4355-6649</li>
                        <li>대표자 : 서정승</li>
                    </ul>
                    <ul>
                        <li>
                            국내 결혼중개업 신고번호 : 충북-청주-국내-24-0001 호
                        </li>
                    </ul>
                </div>
                {props.linkBox && (
                    <div className="link_box">
                        <ul className="flex_center flex_wrap">
                            <li>
                                <a
                                    href="/"
                                    // target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    공지사항
                                </a>
                            </li>
                            <li>
                                <Link to={"/terms/privacy-policy"}>
                                    개인정보 보호정책
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={
                                        "/terms/personal-information-collection"
                                    }
                                >
                                    개인정보수집
                                </Link>
                            </li>
                            <li>
                                <Link to={"/terms/terms-of-use"}>이용약관</Link>
                            </li>
                            <li>
                                <Link to={"/terms/insurance-claim-procedure"}>
                                    보증보험증권에 의한 손해보상 청구절차
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}
                <div className="copy">
                    COPYRIGHT© 2015 사소한 ALL RIGHTS RESERVED.
                </div>
            </footer>
            {props.fixedBox && (
                <div className="fixed_box">
                    <ul className="list_sns">
                        <li>
                            <a
                                href="https://www.youtube.com/@user-sasohan"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                유튜브
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.instagram.com/sasohan1percent_official/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                인스타그램
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://blog.naver.com/sasohan_official"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                블로그
                            </a>
                        </li>
                    </ul>
                    <button
                        type="button"
                        className="btn_top"
                        onClick={scrollToTop}
                    ></button>
                    <div className="link_btn_box">
                        <button
                            type="button"
                            className="btn_apply"
                            onClick={() => {
                                dispatch(
                                    aboutVipScroll({
                                        aboutVipScroll: "vip_sect4",
                                        aboutVipScrollPath: location.pathname,
                                    })
                                );
                                navigate("/about");
                            }}
                        >
                            소개팅 <br />
                            신청
                        </button>
                        <button
                            type="button"
                            className="btn_vip"
                            onClick={() => {
                                dispatch(
                                    aboutVipScroll({
                                        aboutVipScroll: "vip_sect5",
                                        aboutVipScrollPath: location.pathname,
                                    })
                                );
                                navigate("/about");
                            }}
                        >
                            1% <br />
                            지원
                        </button>
                    </div>
                </div>
            )}

            {/* confirm팝업 */}
            {confirm && <ConfirmPop />}
        </>
    );
};

export default Footer;
