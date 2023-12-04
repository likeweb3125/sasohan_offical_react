
import ranking_tip_box from "../images/ranking_tip_box.svg";
import ranking_tip_box_mo from "../images/ranking_tip_box_mo.svg";

const Ranking = () => {
    return(<>
        <div className="rankin_wrap">
            <div className="top_banner">

            </div>
            <div className="inner_cont">
                <div className="tit_box">
                    <div>
                        <p className="tit">사소한 랭킹</p>
                        <p className="txt">사소한 회원분들의 <strong>1년 동안의 총 매칭 건수</strong>를 합산하여 <br/>등록된 <strong>사소한 회원만의 특별한 랭킹 시스템</strong>입니다.</p>
                    </div>
                    <div className="tip_box">
                        <p className="tip_txt">사소한 랭킹 산정은 어떻게 하나요?</p>
                        <div className="box">
                            <img src={ranking_tip_box} alt="말풍선이미지" class="mo_none" />
                            <img src={ranking_tip_box_mo} alt="말풍선이미지" class="mo_show" />
                        </div>
                    </div>
                </div>
                <div className="auth_box">
                    <div className="txt_box">
                        <p className="txt1">회원님의 랭킹이 <br/>궁금하신가요?</p>
                        <p className="txt2">회원가입 시 입력한 연락처 정보를 통해 <br/>회원님의 랭킹을 확인할 수 있습니다.</p>
                    </div>
                    <div>
                        <ul>
                            <li>
                                <p>연락처</p>
                                <div>

                                </div>
                            </li>
                        </ul>
                        <button type="button">인증완료</button>
                    </div>
                </div>
            </div>
        </div>
    </>);
};

export default Ranking;