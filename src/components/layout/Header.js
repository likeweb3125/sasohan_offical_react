import { useEffect, useState } from 'react';
import { Link } from 'react-scroll';
import { useSelector } from 'react-redux';
import ConfirmPop from '../popup/ConfirmPop';

const Header = () => {
    const popup = useSelector((state)=>state.popup);
    const common = useSelector((state)=>state.common);
    const [confirm, setConfirm] = useState(false);
    const [headerOn, setHeaderOn] = useState(false);

    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);

    //스크롤시 header active-----------
    const handleScroll = () => {
        if(window.scrollY > 0) {
            setHeaderOn(true);
        }else{
            setHeaderOn(false);
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
    }, []);

    return(<>
        <header id="header" className={`flex_center ${headerOn ? "on" : ""}`}>
            <div className="header_inner">
                <h1 className="logo">
                    <a
                        href="/"
                        rel="noopener noreferrer"
                    >사소한</a>
                </h1>
                <nav className="gnb_wrap">
                    <ul className="gnb">
                        <li className={common.headerMenuOn === 1 ? "on" : ""}><Link to="sect1" smooth={true} duration={500}>매니저 소개</Link></li>
                        <li className={common.headerMenuOn === 2 ? "on" : ""}><Link to="sect2" smooth={true} duration={500}>About 사소한</Link></li>
                        <li className={common.headerMenuOn === 3 ? "on" : ""}><Link to="sect3" smooth={true} duration={500}>사소한 칼럼</Link></li>
                        <li className={common.headerMenuOn === 4 ? "on" : ""}><Link to="sect5" smooth={true} duration={500}>사소한의 약속</Link></li>
                        <li className={common.headerMenuOn === 5 ? "on" : ""}><Link to="sect6" smooth={true} duration={500}>사소한 후기</Link></li>
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
                                href="https://www.instagram.com/sasohanofficial/"
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
            </div>
        </header>

        <ul className='fix_menu_box'>
            <li className={common.headerMenuOn === 1 ? "on" : ""}><Link to="sect1" smooth={true} duration={500}><span>매니저 소개</span></Link></li>
            <li className={common.headerMenuOn === 2 ? "on" : ""}><Link to="sect2" smooth={true} duration={500}><span>About 사소한</span></Link></li>
            <li className={common.headerMenuOn === 3 ? "on" : ""}><Link to="sect3" smooth={true} duration={500}><span>사소한 칼럼</span></Link></li>
            <li className={common.headerMenuOn === 4 ? "on" : ""}><Link to="sect5" smooth={true} duration={500}><span>사소한의 약속</span></Link></li>
            <li className={common.headerMenuOn === 5 ? "on" : ""}><Link to="sect6" smooth={true} duration={500}><span>사소한 후기</span></Link></li>
        </ul>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default Header;