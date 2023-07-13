
import logo from "../../images/logo_foot.svg";

const Footer = () => {

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
                    <li>주소 : 충청북도 청주시 서원구 사직대로 160 8층</li>
                    <li>개인정보책임관리자 및 대표 : 서정승</li>
                </ul>
                <ul>
                    <li>사업자 번호 : 684-21-01312</li>
                    <li>연락처 : 010-3924-3233 / 070-4355-6751</li>
                </ul>
            </div>
            <div className="link_box">
                <ul className="flex_center flex_wrap">
                    <li>
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >공지사항</a>
                    </li>
                    <li>
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >개인정보취급방침</a>
                    </li>
                    <li>
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >이메일 무단수집거부</a>
                    </li>
                    <li>
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >이용약관</a>
                    </li>
                </ul>
            </div>
            <div className="copy">COPYRIGHT© 2023 사소한 ALL RIGHTS RESERVED.</div>
        </footer>
        <div className="fixed_box">
            <ul className="list_sns">
                <li>
                    <a
                        className="sns_ytb"
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >유튜브</a>
                </li>
                <li>
                    <a
                        className="sns_insta"
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >인스타그램</a>
                </li>
            </ul>
            <button type="button" className="btn_top" onClick={scrollToTop}></button>
        </div>
    </>);
};

export default Footer;