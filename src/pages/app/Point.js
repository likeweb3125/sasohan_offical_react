import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import axios from "axios";
import Cookies from "js-cookie";
import * as CF from "../../config/function";
import { enum_api_uri } from "../../config/enum";
import { appPointPop, confirmPop, loadingPop } from "../../store/popupSlice";
import { payCheckData } from "../../store/commonSlice";
import ConfirmPop from "../../components/popup/ConfirmPop";


const Point = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const m_info = enum_api_uri.m_info;
    const m_point = enum_api_uri.m_point;
    const m_pay_check = enum_api_uri.m_pay_check;
    const m_pay_logs = enum_api_uri.m_pay_logs;
    const [pointList, setPointList] = useState([10,100,500,800,1000]);
    const [recommend, setRecommend] = useState(2);
    const [price, setPrice] = useState(0);
    const [pay, setPay] = useState("");
    const [confirm, setConfirm] = useState(false);
    const [point, setPoint] = useState(0);
    const [userPoint, setUserPoint] = useState(0);
    const [userInfo, setUserInfo] = useState({});
    const [var1, setVar1] = useState("");
    const [checkStart, setCheckStart] = useState(false);
    const token = Cookies.get("token");
    const [hasRunOnce, setHasRunOnce] = useState(false);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);


    //앱에 토큰 요청
    useEffect(() => {
        const checkAndRequestToken = () => {
            if (window.flutter_inappwebview && window.flutter_inappwebview.callHandler) {
                window.flutter_inappwebview.callHandler('requestToken').then(function(token) {
                    console.log("Received token from app: " + token);
                }).catch(function(error) {
                    console.error("Error while calling handler:", error);
                });
            } else {
                console.error("flutter_inappwebview or callHandler is not defined.");
            }
        };
    
        setTimeout(checkAndRequestToken, 1000); // 1초 후에 토큰 요청 시도
    }, []);
    

    //회원정보 가져오기
    const getInfo = () => {
        axios.get(`${m_info}`,
            {headers:{Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                const data = res.data;
                setUserInfo(data);
            }
        })
        .catch((error) => {
            const err_msg = CF.errorMsgHandler(error);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: err_msg,
                confirmPopBtn:1,
            }));
            setConfirm(true);
        });
    };

    
    //회원 잔여포인트 가져오기
    const getPoint = () => {
        axios.get(`${m_point}`,
            {headers:{Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                const data = res.data;
                setUserPoint(data.point);
            }
        })
        .catch((error) => {
            const err_msg = CF.errorMsgHandler(error);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: err_msg,
                confirmPopBtn:1,
            }));
            setConfirm(true);
        });
    };


    //맨처음 token이 있고 getInfo,getPoint 함수들이 한번도 실행안됐을때 실행하기
    useEffect(() => {
        if(token){
            dispatch(loadingPop(false));
        }else{
            dispatch(loadingPop(true));
        }

        if (token && !hasRunOnce) {
            dispatch(loadingPop(false));
            setTimeout(()=>{
                getInfo();
                getPoint();
                setHasRunOnce(true);
            },500);
        }
    }, [token]);
    

    //결제하기
    const payHandler = () => {
        const agree = document.getElementById("agree_check");
        const date = moment().format("YYYYMMDDHHmmSSS");
        setVar1(userInfo.m_id+date);

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
            // 페이앱 결제하기 로그쌓기
            const data = {
                m_id: userInfo.m_id,
                amount: price,
                pay_method: pay,
                var1: userInfo.m_id+date,
            };
            payLogs(data);
        }
    };


    // 페이앱 결제하기 로그쌓기
    const payLogs = (data) => {
        const body = {
            m_id: data.m_id,
            amount: data.amount,
            pay_method: data.pay_method,
            var1: data.var1,
        };

        axios.post(`${m_pay_logs}`,body)
        .then((res)=>{
            if(res.status === 200){
                let phone = userInfo.phone.replace(/\D/g, '');

                //앱에 결제체크데이터값 보내기
                const checkData = Object.assign({
                    pay: pay,
                    price: price,
                    point: point,
                }, body);
                window.flutter_inappwebview.callHandler(
                    "flutterPointChargeRequest",
                    JSON.stringify(checkData)
                );

                //페이앱결제창 띄우기
                if(window.PayApp) {
                    window.PayApp.setParam('userid','jjagg');
                    window.PayApp.setParam('shopname','사소한');
                    window.PayApp.setParam('goodname',userInfo.m_name);
                    window.PayApp.setParam('price',price);
                    window.PayApp.setParam('recvphone',phone);
                    window.PayApp.setParam('memo','');
                    window.PayApp.setParam('reqaddr','');
                    window.PayApp.setParam('currency','krw');
                    window.PayApp.setParam('vccode','82');
                    window.PayApp.setParam('smsuse','n');
                    window.PayApp.setParam('openpaytype',pay);
                    window.PayApp.setParam('redirectpay','1');
                    window.PayApp.setParam('returnurl','https://sasohan.net/app/point/success'); //결제완료후 url
                    window.PayApp.setParam('feedbackurl','https://api.sasohan.net/v1/pay/notice');
                    window.PayApp.setParam('checkretry','y');
                    window.PayApp.setParam('skip_cstpage','y'); //결제완료후 결제전표 skip
                    window.PayApp.setParam('var1',data.var1);
                    window.PayApp.setParam('buyerid',userInfo.m_id);
                    window.PayApp.setTarget('_self'); //새창말고 현재창 url 변경 setTarget('_self') 추가
                    window.PayApp.call();

                    //setCheckStart(true);

                    //결제체크데이터값 store 에 저장
                    // const checkData = {
                    //     var1: data.var1,
                    //     pay: pay,
                    //     price: price,
                    //     point: point
                    // };
                    // dispatch(payCheckData(checkData));
                }
            }
        })
        .catch((error) => {
            const err_msg = CF.errorMsgHandler(error);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: err_msg,
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }); 
    };


    //결제처리 체크하기
    // const payCheckHandler = () => {
    //     axios.get(`${m_pay_check.replace(":var1",var1)}`,
    //         {headers:{Authorization: `Bearer ${token}`}}
    //     )
    //     .then((res)=>{
    //         if(res.status === 200){
    //             if(res.data.result){
    //                 setCheckStart(false);

    //                 // 포인트충전완료 팝업 띄우기
    //                 let payType;

    //                 if(pay == "card"){
    //                     payType = "신용카드";
    //                 }else if(pay == "phone"){
    //                     payType = "휴대폰결제";
    //                 }

    //                 const data = {
    //                     data: moment().format("YYYY.MM.DD"),
    //                     payType: payType,
    //                     price: price,
    //                     point: point
    //                 };
    //                 dispatch(appPointPop({appPointPop:true,appPointPopData:data}));
    //             }
    //         }
    //     })
    //     .catch((error) => {
            
    //     });
    // };


    //결제시작하면 1초마다 결제처리 체크하기
    // useEffect(()=>{
    //     if(checkStart){
    //         const timer = setInterval(() => {
    //             payCheckHandler();
    //         }, 1000);

    //         return () => {
    //             clearInterval(timer);
    //         };
    //     }
    // },[checkStart]);


    return(<>
        <div className="point_wrap">
            <p>토큰:{token}</p>
            <div className="top_box">
                <div className="box">
                    <div className="txt flex_between flex_wrap">
                        <p>잔여포인트</p>
                        <h5><strong>{CF.MakeIntComma(userPoint)} </strong>포인트</h5>
                    </div>
                    <button type="button" 
                        onClick={()=>{
                            //앱에 포인트사용내역이동 보내기
                            window.flutter_inappwebview.callHandler('flutterPointChargeComplete');
                        }}
                    ><span>포인트 충전 및 사용 내역 보기</span></button>
                </div>
            </div>
            <div className="inner_box">
                <div className="box">
                    <p className="tit">충전 포인트</p>
                    <ul className="point_ul">
                        {pointList.map((point,i)=>{
                            const totalPrice = point*100+(point*10);
                            return(
                                <li key={i} className={`custom_radio${recommend === i ? " recommend" : ""}`} 
                                    onClick={()=>{
                                        setPrice(totalPrice);
                                        setPoint(point);
                                    }}
                                >
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
                    {price !== 0 && pay.length > 0 &&
                        <ul className="flex">
                            <li>{point} 포인트</li>
                            <li>{pay === "card" ? "신용카드" : pay === "phone" && "휴대폰결제"}</li>
                        </ul>
                    }
                    <div className="price_txt flex_between flex_wrap">
                        <p>총 결제 금액</p>
                        <h6><strong>{CF.MakeIntComma(price)} </strong>원</h6>
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