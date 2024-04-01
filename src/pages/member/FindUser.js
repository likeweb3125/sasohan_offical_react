import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { enum_api_uri } from "../../config/enum";
import * as CF from "../../config/function";
import { confirmPop } from "../../store/popupSlice";
import { resetPasswordToken } from "../../store/commonSlice";
import InputBox from "../../components/component/InputBox";
import ConfirmPop from "../../components/popup/ConfirmPop";
import { useNavigate } from "react-router-dom";


const FindUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const find_id_sms = enum_api_uri.find_id_sms;
    const find_id = enum_api_uri.find_id;
    const find_pw_sms = enum_api_uri.find_pw_sms;
    const find_pw = enum_api_uri.find_pw;
    const popup = useSelector((state)=>state.popup);
    const [tabOn, setTabOn] = useState(1);
    const [confirm, setConfirm] = useState(false);
    const [focusInput, setFocusInput] = useState({});
    const [tel, setTel] = useState("");
    const [tel2, setTel2] = useState("");
    const [code, setCode] = useState("");
    const [code2, setCode2] = useState("");
    const [id, setId] = useState("");
    const [authStep, setAuthStep] = useState(1);
    const [codeBtn, setCodeBtn] = useState(false);
    const [minutes, setMinutes] = useState(5);
    const [seconds, setSeconds] = useState(0);
    const formatTime = (time) => time.toString().padStart(2, '0');
    const [step, setStep] = useState(1);
    const [nextBtnOn, setNextBtnOn] = useState(false);
    const [resultId, setResultId] = useState('');


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);


    //input 포커스
    const focusHandler = (e,val) => {
        const id = e.target.id;
        let newList = {...focusInput};
        newList[id] = val;
        
        setFocusInput(newList);
    };


    //탭 변경시
    useEffect(()=>{
        //아이디찾기 초기화
        setStep(1);
        setAuthStep(1);
        setTel('');
        setCode('');
        setMinutes(5);
        setSeconds(0);
        setCode('');
        setCodeBtn(false);
        setNextBtnOn(false);
        setResultId('');

        //비밀번호찾기 초기화
        setId('');
        setTel2('');
        setCode2('');
    },[tabOn]);



    //인증번호전송
    const codeSendHandler = () => {
        //아이디찾기 일때
        if(tabOn === 1){
            const body = {
                phone: tel
            }
    
            axios.post(find_id_sms, body)
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
        }
        //비밀번호찾기 일때
        if(tabOn === 2){
            const body = {
                phone: tel2
            }
    
            axios.post(find_pw_sms, body)
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
        }
        
        
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



    //인증번호값 변경시
    useEffect(()=>{
        if(code.length > 0 || code2.length > 0){
            setNextBtnOn(true);
        }else{
            setNextBtnOn(false);
        }
    },[code, code2]);



    //다음버튼 클릭시
    const nextBtnClickHandler = () => {
        //아이디찾기일때
        if(tabOn === 1){
            const body = {
                phone: tel,
                m_code: code,
            }
    
            axios.post(find_id, body)
            .then((res)=>{
                if(res.status === 200){
                    const data = res.data;
                    setResultId(data.m_id);

                    setStep(2);
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
        }
        //비밀번호찾기일때
        if(tabOn === 2){
            const body = {
                m_id: id,
                phone: tel2,
                m_code: code2,
            }
    
            axios.post(find_pw, body)
            .then((res)=>{
                if(res.status === 200){
                    //비밀번호변경 토큰값 store 에 저장
                    const data = res.data;
                    dispatch(resetPasswordToken(data.pw_token));

                    //비밀번호변경 페이지로 이동
                    navigate('/member/reset-password');
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
        }
    };


 


    return(<>
        <div className="gray_wrap">
            <div className="cont">
                <div className="form_cont">
                    <div className="tit_box">
                        <p className="tit">아이디 / 비밀번호 찾기</p>
                    </div>
                    <div className="shadow_box">
                        <ul className="tab_type1 flex">
                            <li className={tabOn === 1 ? 'on' : ''} onClick={()=>setTabOn(1)}>아이디 찾기</li>
                            <li className={tabOn === 2 ? 'on' : ''} onClick={()=>setTabOn(2)}>비밀번호 찾기</li>
                        </ul>
                        <div className="inner">
                            {tabOn === 1 && step === 1 ? //아이디찾기 일때
                                <>
                                    <p className="tx_c f_18 color_black2 bm32">가입시 입력한 본인정보를 입력하세요.</p>
                                    <ul className="form_ul">
                                        <li>
                                            <p className="color_black2 medium">연락처</p>
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
                                            className="btn_type3" 
                                            disabled={nextBtnOn ? false : true}
                                            onClick={nextBtnClickHandler}
                                        >다음</button>
                                    </div>
                                </>
                                : tabOn === 1 && step === 2 ?
                                    <div className="tx_c">
                                        <p className="f_18 color_black2 bp24">아이디 찾기 결과</p>
                                        <p className="f_20 medium">회원님의 아이디는 <br/><span className="f_22 color_point">{resultId}</span><br/>(으)로 등록되어있습니다.</p>
                                        <div className="tm60">
                                            <Link to="/member/login" className="btn_type3">로그인</Link>
                                        </div>
                                    </div>
                                : tabOn === 2 && //비밀번호찾기 일때
                                <>
                                    <p className="tx_c f_18 color_black2 bm32">가입시 입력한 본인정보를 입력하세요.</p>
                                    <ul className="form_ul">
                                        <li>
                                            <p className="color_black2 medium">아이디</p>
                                            <div className={`input_box light${focusInput.id ? " on" : ""}`}>
                                                <InputBox 
                                                    type={'text'}
                                                    placeholder={`아이디를 입력해주세요.`}
                                                    value={id}
                                                    onChangeHandler={(e)=>{
                                                        const val = e.currentTarget.value;
                                                        setId(val);
                                                    }}
                                                    id={`id`}
                                                    onFocusHandler={(e)=>{
                                                        focusHandler(e,true);
                                                    }}
                                                    onBlurHandler={(e)=>{
                                                        focusHandler(e,false);
                                                    }}
                                                />
                                            </div>
                                        </li>
                                        <li>
                                            <p className="color_black2 medium">연락처</p>
                                            <div className="input_btn_box">
                                                <div className={`input_box light${focusInput.tel2 ? " on" : ""}`}>
                                                    <InputBox 
                                                        phone={true}
                                                        id={`tel2`}
                                                        value={tel2}
                                                        placeholder="연락처를 입력해주세요."
                                                        onChangeHandler={(e)=>{
                                                            let val = e.currentTarget.value;
                                                            val = val.replace(/-/g, '');
                                                            val = val.trim();
                                                            setTel2(val);

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
                                                    <div className={`input_box light${focusInput.code2 ? " on" : ""}`}>
                                                        <InputBox 
                                                            type={`text`}
                                                            placeholder={`인증번호를 입력해주세요.`}
                                                            value={code2}
                                                            id={`code2`}
                                                            onChangeHandler={(e)=>{
                                                                const val = e.currentTarget.value;
                                                                setCode2(val);
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
                                            className="btn_type3" 
                                            disabled={nextBtnOn ? false : true}
                                            onClick={nextBtnClickHandler}
                                        >다음</button>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default FindUser;