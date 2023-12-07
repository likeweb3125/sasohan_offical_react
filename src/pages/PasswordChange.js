const PasswordChange = () => {
    return(<>
        <div className="sub_wrap pass_change_wrap">
            <div className="top_banner"></div>
            <div className="inner_cont">
                <div className="round_box">
                    <div className="inner">
                        <div className="tit_box tx_c">
                            <p className="tit">비밀번호 변경</p>
                            <p className="txt">사소한은 회원님의 중요한 개인정보를 철저히 관리하고 있습니다. <br/>비밀번호를 정확히 입력해주세요!</p>
                        </div>
                        <ul>
                            <li>
                                <p>비밀번호</p>
                                <div className="input_box">
                                    <input type={`text`} placeholder="이름을 입력해주세요." name="name"  />
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </>);
};

export default PasswordChange;