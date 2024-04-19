import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { enum_api_uri } from "../../config/enum";
import * as CF from "../../config/function";
import { confirmPop } from "../../store/popupSlice";
import { userInfo, userToken, userRank } from "../../store/userSlice";
import InputBox from "../../components/component/InputBox";
import ConfirmPop from "../../components/popup/ConfirmPop";
import logo_b from "../../images/logo_b.svg";


const UserDelt = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user_delt_code = enum_api_uri.user_delt_code;
    const user_delt = enum_api_uri.user_delt;
    const popup = useSelector((state)=>state.popup);
    const user = useSelector((state)=>state.user);
    const [confirm, setConfirm] = useState(false);
    const [deltOkConfirm, setDeltOkConfirm] = useState(false);
    const [focusInput, setFocusInput] = useState({});
    const [tel, setTel] = useState("");
    const [code, setCode] = useState("");
    const [authStep, setAuthStep] = useState(1);
    const [codeBtn, setCodeBtn] = useState(false);
    const [minutes, setMinutes] = useState(5);
    const [seconds, setSeconds] = useState(0);
    const formatTime = (time) => time.toString().padStart(2, '0');
    const [deltBtnOn, setDeltBtnOn] = useState(false);


    //Google tag 
    useEffect(() => {
        // Google Analytics 초기화
        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'AW-10879238974');
    }, []);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
            setDeltOkConfirm(false);
        }
    },[popup.confirmPop]);


    //input 포커스
    const focusHandler = (e,val) => {
        const id = e.target.id;
        let newList = {...focusInput};
        newList[id] = val;
        
        setFocusInput(newList);
    };


    useEffect(()=>{
        if(code.length > 0){
            setDeltBtnOn(true);
        }else{
            setDeltBtnOn(false);
        }
    },[code]);


    //인증번호전송
    const codeSendHandler = () => {
        const body = {
            phone: tel
        }

        axios.post(user_delt_code, body,{
            headers: {
                Authorization: `Bearer ${user.userToken}`,
            },
        })
        .then((res)=>{
            if(res.status === 200){
                setAuthStep(2);
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


    //인증번호확인 타이머
    useEffect(() => {
        if (authStep === 2) {
            const countdown = setInterval(() => {
                setSeconds(prevSeconds => {
                    let updatedSeconds = prevSeconds > 0 ? prevSeconds - 1 : 59;
                    if (updatedSeconds === 59) {
                        setMinutes(prevMinutes => (prevMinutes > 0 ? prevMinutes - 1 : 0));
                    }
    
                    if (updatedSeconds === 0 && minutes === 0) {
                        clearInterval(countdown);

                        setAuthStep(1);
                        setMinutes(5);
                        setSeconds(0);
    
                        dispatch(confirmPop({
                            confirmPop:true,
                            confirmPopTit:'알림',
                            confirmPopTxt:'인증번호 입력시간이 지났습니다. 다시 인증번호를 전송해주세요.',
                            confirmPopBtn:1,
                        }));
                        setConfirm(true);
                    }
    
                    return updatedSeconds;
                });
            }, 1000);
            return () => clearInterval(countdown);
        }
    }, [authStep, minutes]);


    //회원정보 삭제하기
    const deltHandler = () => {
        const body = {
            phone: tel,
            m_code: code
        }

        axios.post(user_delt,body,{
            headers: {
                Authorization: `Bearer ${user.userToken}`,
            },
        })
        .then((res)=>{
            if(res.status === 200){
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt: '회원정보가 삭제되었습니다.',
                    confirmPopBtn:1,
                }));
                setDeltOkConfirm(true);
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


    //회원정보삭제 완료시 로그아웃
    const deltOkHandler = () => {
        dispatch(userInfo({}));
        Cookies.set('userLogin',false);
        dispatch(userToken(''));
        dispatch(userRank({userRank:false, userRankData:{}}));
        Cookies.remove('refreshT');
        localStorage.removeItem('expiresAt');

        navigate('/');
    };
    


    return(<>
        <div className="login_wrap gray_wrap">
            <div className="cont">
                <div className="form_cont">
                    <div className="tx_c bp60 tab_none"><img src={logo_b} alt="로고" /></div>
                    <div className="shadow_box">
                        <div className="inner">
                            <ul className="form_ul">
                                <li>
                                    <div className="input_btn_box">
                                        <div className={`input_box light${focusInput.tel ? " on" : ""}`}>
                                            <InputBox 
                                                phone={true}
                                                id={`tel`}
                                                value={tel}
                                                placeholder="연락처를 입력해주세요."
                                                onChangeHandler={(e)=>{
                                                    let val = e.currentTarget.value;
                                                    val = val.replace(/-/g, '');
                                                    val = val.trim();
                                                    setTel(val);

                                                    if(val.length > 10){
                                                        setCodeBtn(true);
                                                    }else{
                                                        setCodeBtn(false);
                                                    }
                                                }}
                                                onFocusHandler={(e)=>{
                                                    focusHandler(e,true);
                                                }}
                                                onBlurHandler={(e)=>{
                                                    focusHandler(e,false);
                                                }}
                                            />
                                        </div>
                                        <button type="button" disabled={codeBtn ? false : true} onClick={codeSendHandler}>인증번호 전송</button>
                                    </div>
                                </li>
                                {authStep === 2 &&
                                    <li>
                                        <div className="input_time_box">
                                            <div className={`input_box light${focusInput.code ? " on" : ""}`}>
                                                <InputBox 
                                                    type={`text`}
                                                    placeholder={`인증번호를 입력해주세요.`}
                                                    value={code}
                                                    id={`code`}
                                                    onChangeHandler={(e)=>{
                                                        const val = e.currentTarget.value;
                                                        setCode(val);
                                                    }}
                                                    onFocusHandler={(e)=>{
                                                        focusHandler(e,true);
                                                    }}
                                                    onBlurHandler={(e)=>{
                                                        focusHandler(e,false);
                                                    }}
                                                />
                                            </div>
                                            <span className="time">{formatTime(minutes)}:{formatTime(seconds)}</span>
                                        </div>
                                    </li>
                                }
                            </ul>
                            <div className="tm60">
                                <button type="button" 
                                    className="btn_type3 bm12" 
                                    onClick={deltHandler}
                                    disabled={deltBtnOn ? false : true}
                                >회원정보 삭제</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 회원정보 삭제완료 confirm팝업 */}
        {deltOkConfirm && <ConfirmPop closePop="custom" onCloseHandler={deltOkHandler} />}

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default UserDelt;