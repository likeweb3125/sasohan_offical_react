import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import axios from "axios";
import { enum_api_uri } from "../../config/enum";
import { appPointPop, loadingPop, confirmPop } from "../../store/popupSlice";
import ConfirmPop from "../../components/popup/ConfirmPop";
import pay_check_img from "../../images/app/pay_check_img.svg";


const Point2 = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const m_pay_check = enum_api_uri.m_pay_check;
    const [confirm, setConfirm] = useState(false);
    const [token, setToken] = useState('');
    const [pointData, setPointData] = useState({});
    const [complete, setComplete] = useState(false);
    const timerRef = useRef(null);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);


    //앱에 결제데이터 요청
    useEffect(() => {
        dispatch(loadingPop(true));

        const checkAndRequestToken = () => {
            if (window.flutter_inappwebview && window.flutter_inappwebview.callHandler) {
                dispatch(loadingPop(false));
                window.flutter_inappwebview.callHandler('requestPointCheckData').then(function(result) {
                    const data = JSON.stringify(result);
                    setPointData(data);
                    setToken(data.token);
                }).catch(function(error) {
                    dispatch(confirmPop({
                        confirmPop: true,
                        confirmPopTit: '알림',
                        confirmPopTxt: '새로고침 버튼을 눌러주세요.',
                        confirmPopBtn: 1,
                    }));
                    setConfirm(true);
                });
            } else {
                dispatch(loadingPop(false));
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'새로고침 버튼을 눌러주세요.',
                    confirmPopBtn:1,
                }));
                setConfirm(true);
            }
        };
    
       setTimeout(checkAndRequestToken, 1000); // 1초 후에 결제데이터 요청 시도
    }, []);
    
    

    //결제처리 체크하기
    const payCheckHandler = () => {
        if(token){
            axios.get(`${m_pay_check.replace(":var1",pointData.var1)}`,
                {headers:{Authorization: `Bearer ${token}`}}
            )
            .then((res)=>{
                if(res.status === 200){
                    if(res.data.result){

                        // 포인트충전완료 팝업 띄우기
                        let payType;

                        if(pointData.pay == "card"){
                            payType = "신용카드";
                        }else if(pointData.pay == "phone"){
                            payType = "휴대폰결제";
                        }

                        const data = {
                            data: moment().format("YYYY.MM.DD"),
                            payType: payType,
                            price: pointData.price,
                            point: pointData.point
                        };
                        dispatch(appPointPop({appPointPop:true,appPointPopData:data}));

                        setComplete(true);

                        // 결제처리가 완료되면 타이머 중단
                        if(timerRef.current) {
                            clearInterval(timerRef.current);
                        }
                    }
                }
            })
            .catch((error) => {

            });
        }
    };


    //0.3초마다 결제처리 체크하기
    useEffect(()=>{
        timerRef.current = setInterval(() => {
            payCheckHandler();
        }, 300);

        return () => {
            if(timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    },[]);


    //결제완료후 확인버튼 클릭시
    const payOkBtnClickHandler = () => {
        //앱에 포인트결제완료 보내기
        window.flutter_inappwebview.callHandler('flutterPointChargeComplete');
    };


    return(<>
        <div className="point_wrap2 flex_center">
            <button type="button" className="app_btn" onClick={()=>{
                window.location.reload();
            }}>새로고침</button>
            <div className="box tx_c">
                <img src={pay_check_img} alt="결제아이콘" />
                <p>결제가 {complete ? '완료되었습니다.' : '진행중 입니다.'}</p>
                {complete && <button type="button" className="app_btn" onClick={payOkBtnClickHandler}>확인</button>}
            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}  
    </>);
};

export default Point2;