import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { appPointPop } from "../../../store/popupSlice";
import * as CF from "../../../config/function";
import ic_point from "../../../images/app/ic_point_big.svg";


const PointPop = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const [off, setOff] = useState(false);

    //팝업닫기--------------
    const closePopHandler = () => {
        setOff(true);

        //앱에 포인트결제완료 보내기
        window.flutter_inappwebview.callHandler('flutterPointChargeComplete');
    };

    useEffect(()=>{
        if(off){
            setTimeout(()=>{
                dispatch(appPointPop({appPointPop:false,appPointPopData:{}}));
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
                            <p>{popup.appPointPopData.date}</p>
                        </li>
                        <li className="flex_between flex_wrap">
                            <p>결제수단</p>
                            <p>{popup.appPointPopData.payType}</p>
                        </li>
                        <li className="flex_between flex_wrap">
                            <p>결제금액</p>
                            <p>{CF.MakeIntComma(popup.appPointPopData.price)}원</p>
                        </li>
                        <li className="flex_between flex_wrap">
                            <p>총 충전 포인트</p>
                            <p><strong>{CF.MakeIntComma(popup.appPointPopData.point)} </strong>포인트</p>
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