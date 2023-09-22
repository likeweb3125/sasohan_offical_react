const Header = (props) => {
    return(
        <header id="app_header">
            <button type="button" className="btn_back">뒤로가기 버튼</button>
            <p className="tit">{props.title}</p>
        </header>
    );
};

export default Header;