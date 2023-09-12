import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { appPointPop } from "../../../store/popupSlice";
import ic_point from "../../../images/app/ic_point_big.svg";


const PointPop = () => {
    const dispatch = useDispatch();
    const [off, setOff] = useState(false);

    //팝업닫기--------------
    const closePopHandler = () => {
        setOff(true);
    };

    useEffect(()=>{
        if(off){
            setTimeout(()=>{
                dispatch(appPointPop(false));
            },500);
        }
    },[off]);

    
    return(
        <div className={`app_pop_wrap point_pop${off ? " off" : ""}`}>
            <div className="dim" onClick={closePopHandler}></div>
            <div className="pop_cont">
                <div className="flex_center">
                    <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                </div>
                <div className="pop_tit">
                    <p className="tit"><strong>포인트 충전 완료</strong></p>
                    <p className="txt"><span>포인트 충전</span>이 완료되었습니다. <br/>충전 내역은 마이페이지에서 확인 가능합니다.</p>
                </div>
                <div className="scroll_wrap">
                    <div className="tx_c">
                        <img src={ic_point} alt="포인트이미지" />
                    </div>
                    <ul className="txt_ul">
                        <li className="flex_between flex_wrap">
                            <p>충전일시</p>
                            <p>2023.06.26</p>
                        </li>
                        <li className="flex_between flex_wrap">
                            <p>결제수단</p>
                            <p>신용카드</p>
                        </li>
                        <li className="flex_between flex_wrap">
                            <p>결제금액</p>
                            <p>11,000원</p>
                        </li>
                        <li className="flex_between flex_wrap">
                            <p>총 충전 포인트</p>
                            <p><strong>100 </strong>포인트</p>
                        </li>
                    </ul>
                </div>
                <div className="btn_box">
                    <button type="button" className="app_btn" onClick={closePopHandler}>확인</button>
                </div>
            </div>
        </div>
    );
};

export default PointPop;