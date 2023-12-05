import { useSelector } from 'react-redux';
import { Link } from 'react-scroll';

const MainFixMenu = () => {
    const common = useSelector((state)=>state.common);

    return(<>
        <ul className='fix_menu_box'>
            <li className={common.headerMenuOn === 1 ? "on" : ""}><Link to="sect1"><span>매니저 소개</span></Link></li>
            <li className={common.headerMenuOn === 2 ? "on" : ""}><Link to="sect2"><span>About 사소한</span></Link></li>
            <li className={common.headerMenuOn === 3 ? "on" : ""}><Link to="sect3"><span>사소한 칼럼</span></Link></li>
            <li className={common.headerMenuOn === 4 ? "on" : ""}><Link to="sect5"><span>사소한의 신뢰</span></Link></li>
            <li className={common.headerMenuOn === 5 ? "on" : ""}><Link to="sect6"><span>사소한 후기</span></Link></li>
        </ul>
    </>);
};

export default MainFixMenu;