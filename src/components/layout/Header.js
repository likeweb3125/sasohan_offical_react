import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { applyPop } from '../../store/popupSlice';
import ConfirmPop from '../popup/ConfirmPop';
import logo_big_b from "../../images/logo_big_b.svg";


const Header = () => {
    const popup = useSelector((state)=>state.popup);
    const common = useSelector((state)=>state.common);
    const dispatch = useDispatch();
    const [confirm, setConfirm] = useState(false);
    const [headerOn, setHeaderOn] = useState(null);
    const [menuOn, setMenuOn] = useState(1);
    const location = useLocation();
    const [mainPage, setMainPage] = useState(null);
    const [menuWrap, setMenuWrap] = useState(false);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);


    //메인페이지일때만 스크롤시 header active-----------
    const handleScroll = () => {
        if(mainPage){
            if(window.scrollY > 0) {
                setHeaderOn(true);
            }else{
                setHeaderOn(false);
            }
        }
    };
    
    useEffect(() => {    
        const timer = setInterval(() => {
            window.addEventListener("scroll", handleScroll);
        }, 100);
        return () => {
            clearInterval(timer);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [mainPage]);


    //페이지이동시 메뉴on 변경
    useEffect(()=>{
        setMenuWrap(false);

        const path = location.pathname;
        if(path == "/"){
            setMenuOn(1);
            setMainPage(true);
        }else{
            setMainPage(false);
        }
        
        if(path == "/ranking"){
            setMenuOn(2);
        }
    },[location]);


    //메인페이지일때만 headerOn false
    useEffect(()=>{
        if(mainPage){
            setHeaderOn(false);
        }else{
            setHeaderOn(true);
        }
    },[mainPage]);


    return(<>
        <header id="header" className={`flex_center ${headerOn ? "on" : ""}`}>
            <div className="header_inner">
                <h1 className={`logo${!mainPage ? " logo_b" : ""}`}>
                    <Link to="/">사소한</Link>
                </h1>
                <nav className="gnb_wrap">
                    <ul className="gnb">
                        <li className={menuOn === 1 ? "on" : ""}><Link to="/">About 사소한</Link></li>
                        {/* <li className={menuOn === 2 ? "on" : ""}><Link to="/ranking">사소한 랭킹</Link></li> */}
                    </ul>
                </nav>
                <div className="sns_wrap">
                    <ul className="list_sns">
                        <li>
                            <a
                                className="sns_ytb"
                                href="https://www.youtube.com/@user-sasohan"
                                target="_blank"
                                rel="noopener noreferrer"
                            >유튜브</a>
                        </li>
                        <li>
                            <a
                                className="sns_insta"
                                href="https://www.instagram.com/sasohan_official_/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >인스타그램</a>
                        </li>
                        <li>
                            <a
                                className="sns_blog"
                                href="https://blog.naver.com/sasohan_official"
                                target="_blank"
                                rel="noopener noreferrer"
                            >블로그</a>
                        </li>
                    </ul>
                </div>
                <button type='button' className='btn_apply' onClick={()=>{
                    dispatch(applyPop(true));
                }}>소개팅 신청</button>
                <button type='button' className='btn_menu' onClick={()=>setMenuWrap(true)}>모바일메뉴열기버튼</button>
            </div>
            <div className={`menu_wrap${menuWrap ? " on" : ""}`}>
                <div className='dim'></div>
                <div className='menu_box'>
                    <div className='top_box flex_between'>
                        <img src={logo_big_b} alt="로고" />
                        <button type='button' className='btn_close' onClick={()=>setMenuWrap(false)}>모바일메뉴닫기버튼</button>
                    </div>
                    <ul className='menu_list'>
                        <li className={menuOn === 1 ? "on" : ""}>
                            <Link to="/">About 사소한</Link>
                        </li>
                        {/* <li className={menuOn === 2 ? "on" : ""}>
                            <Link to="/ranking">사소한 랭킹</Link>
                        </li> */}
                    </ul>
                </div>
            </div>
        </header>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default Header;