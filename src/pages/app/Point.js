import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as CF from "../../config/function";
import { appPointPop, confirmPop } from "../../store/popupSlice";
import ConfirmPop from "../../components/popup/ConfirmPop";


const Point = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const [pointList, setPointList] = useState([100,500,800,1000]);
    const [recommend, setRecommend] = useState(2);
    const [price, setPrice] = useState(0);
    const [pay, setPay] = useState("");
    const [confirm, setConfirm] = useState(false);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);
    

    //결제하기
    const payHandler = () => {
        const agree = document.getElementById("agree_check");
        if(price === 0){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: '결제하실 포인트 상품을 선택해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }else if(pay.length === 0){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: '결제방식을 선택해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }else if(!agree.checked){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: '포인트충전 및 결제 안내문확인을 체크해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }else{
            if(window.PayApp) {
                window.PayApp.setParam('userid','jjagg');
                window.PayApp.setParam('shopname','사소한');
                window.PayApp.setParam('goodname','포인트충전');
                window.PayApp.setParam('price',price);
                window.PayApp.setParam('recvphone',);
                window.PayApp.setParam('memo','');
                window.PayApp.setParam('reqaddr','');
                window.PayApp.setParam('currency','krw');
                window.PayApp.setParam('vccode','82');
                window.PayApp.setParam('smsuse','n');
                window.PayApp.setParam('openpaytype',pay);
                window.PayApp.setParam('redirectpay','1');
                window.PayApp.setParam('feedbackurl','');
                window.PayApp.setParam('checkretry','y');
                window.PayApp.setParam('var1',);
                window.PayApp.setParam('buyerid',);
                window.PayApp.call('_self'); //새창말고 현재창 url 변경 (_self 추가)
            }
        }
    };


    return(<>
        <div className="point_wrap">
            <div className="top_box">
                <div className="box">
                    <div className="txt flex_between flex_wrap">
                        <p>잔여포인트</p>
                        <h5><strong>3,000 </strong>포인트</h5>
                    </div>
                    <button type="button"><span>포인트 충전 및 사용 내역 보기</span></button>
                </div>
            </div>
            <div className="inner_box">
                <div className="box">
                    <p className="tit">충전 포인트</p>
                    <ul className="point_ul">
                        {pointList.map((point,i)=>{
                            const totalPrice = point*100+(point*10);
                            return(
                                <li key={i} className={`custom_radio${recommend === i ? " recommend" : ""}`} onClick={()=>{setPrice(totalPrice)}}>
                                    <label htmlFor={`point_${point}`}>
                                        <input type={"radio"} id={`point_${point}`} name="point_check" />
                                        <div className="box w_100 flex_between flex_wrap">
                                            <p className="txt"><strong>{CF.MakeIntComma(point)} </strong>포인트</p>
                                            <div className="flex">
                                                <p className="txt2">{CF.MakeIntComma(totalPrice)}원</p>
                                                <div className="check">체크</div>
                                            </div>
                                        </div>
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="box">
                    <p className="tit">결제방식</p>
                    <ul className="price_ul flex_between">
                        <li className="custom_radio">
                            <label htmlFor="price_1">
                                <input type={"radio"} id="price_1" name="price_check"
                                    onChange={(e)=>{
                                        if(e.currentTarget.checked){
                                            setPay("card")
                                        }
                                    }} 
                                />
                                <div className="box">
                                    <span className="txt">신용카드</span>
                                </div>
                            </label>
                        </li>
                        <li className="custom_radio">
                            <label htmlFor="price_2">
                                <input type={"radio"} id="price_2" name="price_check" 
                                    onChange={(e)=>{
                                        if(e.currentTarget.checked){
                                            setPay("phone")
                                        }
                                    }} 
                                />
                                <div className="box">
                                    <span className="txt">휴대폰결제</span>
                                </div>
                            </label>
                        </li>
                    </ul>
                    <ul className="txt_ul">
                        <li>본서비스는 만 19세 이상부터 이용이 가능합니다.</li>
                        <li>결제하는 포인트 상품 및 금액 모든 내용을 확인하였습니다.</li>
                    </ul>
                    <div className="custom_check">
                        <label htmlFor="agree_check">
                            <input type={"checkbox"} id="agree_check" />
                            <span className="check">체크</span>
                            <span className="txt">모두 확인하였습니다.</span>
                        </label>
                    </div>
                </div>
                <div className="bottom_box">
                    <ul className="flex">
                        <li>800 포인트</li>
                        <li>신용카드</li>
                    </ul>
                    <div className="price_txt flex_between flex_wrap">
                        <p>총 결제 금액</p>
                        <h6><strong>88,000 </strong>원</h6>
                    </div>
                    <button type="button" className="app_btn2" onClick={payHandler}>결제</button>
                </div>
            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}  
    </>);
};

export default Point;