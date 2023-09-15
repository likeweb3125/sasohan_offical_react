import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/moment";
import { enum_api_uri } from "../../config/enum";
import { appTermsCheckList, appTermsPop, confirmPop } from "../../store/popupSlice";
import ConfirmPop from "../../components/popup/ConfirmPop";
import profile_img from "../../images/app/profile_img.jpg";


const SignUp = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const m_realname_okurl = enum_api_uri.m_realname_okurl;
    const tradeid = moment().format("YYYYMMDDHHmmss");
    const [confirm, setConfirm] = useState(false);
    const [agreeList, setAgreeList] = useState(["개인정보취급방침 동의","이메일 무단 수집 거부 동의","개인정보수집 동의","이용약관 동의","개인정보 처리 위탁 동의 "]);
    const [step, setStep] = useState(1);
    const [allCheck, setAllCheck] = useState(false);
    const [agreeCheckList, setAgreeCheckList] = useState([]);
    const contRef = useRef();
    

    useEffect(()=>{
        setAgreeCheckList(agreeCheckList);
        dispatch(appTermsCheckList(agreeCheckList));
    },[agreeCheckList]);


    useEffect(()=>{
        setAgreeCheckList(popup.appTermsCheckList);
    },[popup.appTermsCheckList]);


    //전체약관 동의
    const allAgreeHandler = (checked) => {
        setAllCheck(!allCheck)
        if (checked) {
            setAgreeCheckList(['agree_1', 'agree_2', 'agree_3', 'agree_4', 'agree_5']);
        } else if ((!checked && agreeCheckList.includes('agree_1')) || (!checked && agreeCheckList.includes('agree_2')) || (!checked && agreeCheckList.includes('agree_3')) || (!checked && agreeCheckList.includes('agree_4')) || (!checked && agreeCheckList.includes('agree_5')) ) {
            setAgreeCheckList([]);
        }
    }

    //약관동의
    const agreeHandler = (checked, value) => {
        if (checked) {
            setAgreeCheckList([...agreeCheckList, value]);
        } else if (!checked && agreeCheckList.includes(value)) {
            setAgreeCheckList(agreeCheckList.filter((el) => el !== value));
        }
    }


    //약관동의 다하면 전체약관동의 체크박스 체크됨
    useEffect(() => {
        if (agreeCheckList.length == 5) {
            setAllCheck(true)
        } else {
            setAllCheck(false)
        }
    }, [agreeCheckList]);


    //본인인증 ------------------------------
    function RealnameRequest() {
        // 아래와 같이 ext_inc_comm.js에 선언되어 있는 함수를 호출
        window.MCASH_PAYMENT(document.realnameForm);
    }

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://auth.mobilians.co.kr/js/ext/ext_inc_comm.js';
        script.async = true;
    
        document.body.appendChild(script);
    
        return () => {
            document.body.removeChild(script);
        };
    }, []);
  
    // 본인인증할때 tradeid localStorage에 저장
    useEffect(()=>{
        localStorage.setItem("tradeid",tradeid);
    },[tradeid]);

    

    return(<>
        <div className="signup_wrap">
            <ul className="step_ul flex_between">
                <li className="on"></li>
                <li className={step > 2 ? "on" : ""}></li>
                <li className={step > 7 ? "on" : ""}></li>
                <li></li>
            </ul>
            <div className="signup_cont scroll_wrap" ref={contRef}>

                {/* 약관동의 */}
                <div className="signup_box flex_top">
                    <div className="img_box">
                        <img src={profile_img} alt="이미지" />
                    </div>
                    <div className="txt_box">
                        <form name="realnameForm" acceptCharset='euc-kr'>
                            <input type="hidden" name="CASH_GB" id="CASH_GB" value="CI"/>
                            <input type="hidden" name="CI_SVCID" id="CI_SVCID"  value="171228049209" />
                            <input type="hidden" name="Cryptyn" id="Cryptyn" value="Y"/>
                            <input type="hidden" name="Keygb" id="Keygb"  value="0" />
                            <input type="hidden" name="CALL_TYPE" id="CALL_TYPE" value=""/>
                            <input type="hidden" name="LOGO_YN" id="LOGO_YN" value="N"/>
                            <input type="hidden" name="CI_Mode" id="CI_Mode" value="61"/>
                            <input type="hidden" name="DI_CODE" id="DI_CODE" value=""/>
                            <input type="hidden" name="Siteurl" id="Siteurl" value="www.jja-gg.com"/>
                            <input type="hidden" name="SUB_CPID" id="SUB_CPID" value=""/>
                            <input type="hidden" name="Callback" id="Callback" size="30" value=""/>
                            <input type="hidden" name="Smstext" id="Smstext" size="30" value=""/>
                            <input type="hidden" name="Lmstitle" id="Lmstitle" size="40" value=""/>
                            <input type="hidden" name="Lmstext" id="Lmstext" size="40" value=""/>
                            <input type="hidden" name="Tradeid" id="Tradeid" size="30" value={tradeid}/>
                            <input type="hidden" name="PAY_MODE" id="PAY_MODE" size="30" value="10"/>
                            <input type="hidden" name="Okurl" id="Okurl" size="30" value={m_realname_okurl}/>
                            <input type="hidden" name="Cryptokurl" id="Cryptokurl" size="30" value="Y"/>
                            <input type="hidden" name="CI_FIXCOMMID" id="CI_FIXCOMMID" size="30" value=""/>
                            <input type="hidden" name="Closeurl" id="Closeurl" size="30" value=""/>
                        </form>
                        <p className="name">사소한 매니저 하니</p>
                        <div className="inner_box">
                            <div className="tit_box">
                                <p className="f_20 medium"><span className="f_18">안녕하세요. <br/>
                                    저는 사소한 매니저 "하니" 입니다! <br/>
                                    지금부터 회원 가입을 도와드릴게요. :D <br/></span>
                                    <strong>회원 가입 약관동의</strong>를 진행해주세요</p>
                            </div>
                            <div className="agree_box">
                                <div className="all_check custom_check">
                                    <label htmlFor="all_agree">
                                        <input type={"checkbox"} id="all_agree" 
                                            onChange={(e) => allAgreeHandler(e.currentTarget.checked)} 
                                            checked={allCheck} 
                                        />
                                        <span className="check">체크</span>
                                        <span className="txt">전체 동의</span>
                                    </label>
                                </div>
                                <ul>
                                    {agreeList.map((txt,i)=>{
                                        const idx = i+1;
                                        const val = "agree_"+(i+1);
                                        return(
                                            <li key={i} className="flex">
                                                <div className="custom_check">
                                                    <label htmlFor={val}>
                                                        <input type={"checkbox"} id={val} value={val}
                                                            onChange={(e) => agreeHandler(e.currentTarget.checked, e.currentTarget.value)} 
                                                            checked={agreeCheckList.includes(val) ? true : false}
                                                        />
                                                        <span className="check">체크</span>
                                                    </label>
                                                </div>
                                                <button type="button" onClick={()=>{dispatch(appTermsPop({appTermsPop:true,appTermsPopIdx:idx}))}}>{txt}</button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div className="flex_end tp10">
                            <button type="button" className="app_btn_s" 
                                onClick={()=>{
                                    if(allCheck){
                                        RealnameRequest();
                                    }else{
                                        dispatch(confirmPop({
                                            confirmPop:true,
                                            confirmPopTit:'알림',
                                            confirmPopTxt: '이용 약관과 개인정보 수집 및 이용에 관한 안내를 모두 동의해 주세요.',
                                            confirmPopBtn:1,
                                        }));
                                        setConfirm(true);
                                    }
                                }}
                            >다음</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}  
    </>);
};

export default SignUp;