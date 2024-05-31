import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import { enum_api_uri } from "../../config/enum";
import * as CF from "../../config/function";
import { confirmPop, loadingPop } from "../../store/popupSlice";
import { userToken, userInfo, userRank } from "../../store/userSlice";
import { phoneLogin } from "../../store/commonSlice";
import InputBox from "../../components/component/InputBox";
import ConfirmPop from "../../components/popup/ConfirmPop";
import logo_b from "../../images/logo_b.svg";


const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const login  = enum_api_uri.login;
    const login_code  = enum_api_uri.login_code;
    const login_phone  = enum_api_uri.login_phone;
    const basic_profile  = enum_api_uri.basic_profile;
    const rank_token = enum_api_uri.rank_token;
    const manager_profile = enum_api_uri.manager_profile;
    const popup = useSelector((state)=>state.popup);
    const common = useSelector((state)=>state.common);
    const [tabOn, setTabOn] = useState(1);
    const [confirm, setConfirm] = useState(false);
    const [values, setValues] = useState({});
    const [passShow, setPassShow] = useState({"password":false});
    const [focusInput, setFocusInput] = useState({});
    const [error, setError] = useState({});
    const [saveIdCheck, setSaveIdCheck] = useState(false);
    const [tel, setTel] = useState("");
    const [code, setCode] = useState("");
    const [authStep, setAuthStep] = useState(1);
    const [codeBtn, setCodeBtn] = useState(false);
    const [minutes, setMinutes] = useState(5);
    const [seconds, setSeconds] = useState(0);
    const formatTime = (time) => time.toString().padStart(2, '0');
    const [loginBtnOn, setLoginBtnOn] = useState(false);
    const { id } = useParams();

    useEffect(()=>{
        console.log(id);
    },[id]);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);


    useEffect(()=>{
        if(common.phoneLogin){
            setTabOn(2);
            dispatch(phoneLogin(false));
        }
    },[common.phoneLogin]);


    //input값 변경시
    const onInputChangeHandler = (e) => {
        const val = e.target.value;
        const id = e.target.id;

        const newValues = {...values};
        newValues[id] = val;
        setValues(newValues); 

        const newError = {...error};
        if(val.length > 0){
            newError[id] = false;
            setError(newError);
        }
    };


    //input 포커스
    const focusHandler = (e,val) => {
        const id = e.target.id;
        let newList = {...focusInput};
        newList[id] = val;
        
        setFocusInput(newList);
    };


    //비밀번호보기버튼 클릭시 토글
    const passShowHandler = (id) => {
        const newData = {...passShow};
        newData[id] = !newData[id];
        setPassShow(newData);
    };


    //탭 변경시
    useEffect(()=>{
        //아이디로그인 초기화
        let newValues = {...values};
        newValues.id = '';
        newValues.password = '';
        setValues(newValues);

        //연락처로그인 초기화
        setAuthStep(1);
        setTel('');
        setMinutes(5);
        setSeconds(0);
        setCode('');
        setCodeBtn(false);
    },[tabOn]);


    useEffect(()=>{
        //아이디 로그인일때
        if(tabOn === 1){
            if(values.id && values.password){
                setLoginBtnOn(true);
            }else{
                setLoginBtnOn(false);
            }
        }
        //연락처 로그인일때
        if(tabOn === 2){
            if(code.length > 0){
                setLoginBtnOn(true);
            }else{
                setLoginBtnOn(false);
            }
        }
    },[values, code]);


    //인증번호전송
    const codeSendHandler = () => {
        const body = {
            phone: tel
        }

        axios.post(login_code, body)
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


    
    //연락처로그인 하기
    const doneHandler = () => {
        const body = {
            phone: tel,
            m_code: code
        }

        axios.post(login_phone, body)
        .then((res)=>{
            if(res.status === 200){
                // const token = res.data.accessToken;
                const token = {
                    accessToken: res.data.accessToken,
                    refreshToken: res.data.refreshToken
                };

                //회원기본정보 가져오기
                getUserInfo(token);
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
    


    //로그인버튼 클릭시
    const loginBtnClickHandler = () => {
        const newError = {...error};

        //아이디 로그인일때
        if(tabOn === 1){
            if(!values.id){
                newError.id = true;
            }
            if(!values.password){
                newError.password = true;
            }

            setError(newError);

            if(!newError.id && !newError.password){
                loginHandler();
            }
        }
        //연락처 로그인일때
        if(tabOn === 2){
            doneHandler();
        }
    };


    //로그인하기
    const loginHandler = () => {
        dispatch(loadingPop(true));

        const body = {
            m_id: values.id,
            m_password: values.password,
            app_token: ''
        }

        axios.post(login, body)
        .then((res)=>{
            if(res.status === 200){
                // const token = res.data.accessToken;
                const token = {
                    accessToken: res.data.accessToken,
                    refreshToken: res.data.refreshToken
                };

                //회원기본정보 가져오기
                getUserInfo(token);
            }
        })
        .catch((error) => {
            dispatch(loadingPop(false));

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


    //회원 기본정보 가져오기
    const getUserInfo = (token) => {
        axios.get(basic_profile,{
            headers: {
                Authorization: `Bearer ${token.accessToken}`,
            },
        })
        .then((res)=>{
            if(res.status === 200){
                const info = res.data;
                
                //매니저일때
                if(info.user_level == 'M'){
                    //매니저 프로필정보 가져오기
                    getManagerProfile(token, info);
                }
                //일반회원일때
                if(info.user_level == 'U'){
                    //회원 랭킹정보 가져오기
                    getUserRank(token, info);
                }
                
            }
        })
        .catch((error) => {
            dispatch(loadingPop(false));

            const err_msg = CF.errorMsgHandler(error);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: err_msg,
                confirmPopBtn:1,
            }));
            setConfirm(true);
        })
    };


    //회원 랭킹정보 가져오기
    const getUserRank = (token, info) => {
        const body = {
            token: token.accessToken
        };
        axios.post(rank_token,body)
        .then((res)=>{
            if(res.status === 200){
                dispatch(loadingPop(false));

                //아이디저장 체크시 쿠키에 저장
                if(saveIdCheck){
                    Cookies.set("saveId",info.m_id,{ expires: 1 });
                }else{
                    Cookies.remove("saveId");
                }

                //회원랭킹 정의
                // if(text === 'X클래스') {
                //     classNum = 1;
                // } else if(text === 'S클래스') {
                //     classNum = 2;
                // } else if(text === 'A클래스') {
                //     classNum = 3;
                // } else if(text === 'B클래스') {
                //     classNum = 4;
                // } else if(text === 'C클래스') {
                //     classNum = 5;
                // } else if(text === 'Unranked') {
                //     classNum = 0;
                // } else {
                //     classNum = -1;
                // }
                // ** class_name 값이 X클래스~C클래스, Unranked 일때만 flag = true

                //회원랭킹정보 store 에 저장
                const data = res.data;
                let rank = false;
                let rankData = {};
                if(data.flag){
                    if(data.class_number > 0){
                        rank = true;
                    }
                    rankData = data;
                }
                dispatch(userRank({userRank:rank, userRankData:rankData}));

                //로그인회원정보 store 에 저장
                dispatch(userInfo(info));
                Cookies.set("userLogin",true,{expires:1});
                dispatch(userToken(token.accessToken));
                Cookies.set("refreshT",token.refreshToken,{expires:1});
                localStorage.setItem(
                    "expiresAt",
                    moment().add(12, 'hours').format("yyyy-MM-DD HH:mm:ss")
                );

                //메인페이지로 이동
                navigate('/');
            }
        })
        .catch((error) => {
            dispatch(loadingPop(false));

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


    //매니저 프로필 가져오기
    const getManagerProfile = (token, info) => {
        axios.get(`${manager_profile.replace(':m_id',info.m_id)}`,{
            headers: {
                Authorization: `Bearer ${token.accessToken}`,
            },
        })
        .then((res)=>{
            if(res.status === 200){
                dispatch(loadingPop(false));

                //아이디저장 체크시 쿠키에 저장
                if(saveIdCheck){
                    Cookies.set("saveId",info.m_id,{ expires: 1 });
                }else{
                    Cookies.remove("saveId");
                }

                const data = res.data;
                const newInfo = {...info};
                newInfo.m_f_photo = data.photo; //매니저프로필사진 넣기
                
                //로그인회원정보 store 에 저장
                dispatch(userInfo(newInfo));
                Cookies.set("userLogin",true,{expires:1});
                dispatch(userToken(token.accessToken));
                Cookies.set("refreshT",token.refreshToken,{expires:1});
                localStorage.setItem(
                    "expiresAt",
                    moment().add(12, 'hours').format("yyyy-MM-DD HH:mm:ss")
                );

                //메인페이지로 이동
                navigate('/');
            }
        })
        .catch((error) => {
            dispatch(loadingPop(false));
            
            const err_msg = CF.errorMsgHandler(error);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: err_msg,
                confirmPopBtn:1,
            }));
            setConfirm(true);
        })
    };


    //아이디저장값이 있을때
    useEffect(()=>{
        const id = Cookies.get('saveId');
        if(id){
            const newValues = {...values};
            newValues.id = id;
            setValues(newValues);
            setSaveIdCheck(true);
        }
    },[]);


    return(<>
        <div className="login_wrap gray_wrap">
            <div className="cont">
                <div className="form_cont">
                    <div className="tx_c bp60 tab_none"><img src={logo_b} alt="로고" /></div>
                    <div className="shadow_box">
                        <ul className="tab_type1 flex">
                            <li className={tabOn === 1 ? 'on' : ''} onClick={()=>setTabOn(1)}>아이디 로그인</li>
                            <li className={tabOn === 2 ? 'on' : ''} onClick={()=>setTabOn(2)}>연락처 로그인</li>
                        </ul>
                        <div className="inner">
                            {tabOn === 1 ?
                                <>
                                    <ul className="form_ul">
                                        <li>
                                            <div className={`input_box light${focusInput.id ? " on" : ""}`}>
                                                <InputBox 
                                                    type={'text'}
                                                    placeholder={`아이디를 입력해주세요.`}
                                                    value={values.id || ''}
                                                    onChangeHandler={onInputChangeHandler}
                                                    id={`id`}
                                                    onFocusHandler={(e)=>{
                                                        focusHandler(e,true);
                                                    }}
                                                    onBlurHandler={(e)=>{
                                                        focusHandler(e,false);
                                                    }}
                                                />
                                            </div>
                                            {error.id && <p className="error_txt">아이디를 입력해주세요.</p>}
                                        </li>
                                        <li>
                                            <div className={`pass_input_box${passShow.password ? " on" : ""}`}>
                                                <div className={`input_box light${focusInput.password ? " on" : ""}`}>
                                                    <InputBox 
                                                        type={passShow.password ? "text" : "password"}
                                                        placeholder={`비밀번호를 입력해주세요.`}
                                                        value={values.password || ""}
                                                        onChangeHandler={onInputChangeHandler}
                                                        id={`password`}
                                                        onFocusHandler={(e)=>{
                                                            focusHandler(e,true);
                                                        }}
                                                        onBlurHandler={(e)=>{
                                                            focusHandler(e,false);
                                                        }}
                                                    />
                                                </div>
                                                <button type="button" onClick={()=>passShowHandler("password")}>비밀번호보기 버튼</button>
                                            </div>
                                            {error.password && <p className="error_txt">비밀번호를 입력해주세요.</p>}
                                        </li>
                                    </ul>
                                    <div className="flex_between tm24">
                                        <div className="custom_check">
                                            <label>
                                                <input type={`checkbox`}
                                                    onChange={(e)=>{
                                                        const checked = e.currentTarget.checked;
                                                        if(checked){
                                                            setSaveIdCheck(true);
                                                        }else{
                                                            setSaveIdCheck(false);
                                                        }
                                                    }} 
                                                    checked={saveIdCheck}
                                                />
                                                <span className="check">체크박스</span>
                                                <span className="s_txt">아이디 저장</span>
                                            </label>
                                        </div>
                                        <div>
                                            <Link to='/member/find' className="btn_find">ID / PW 찾기</Link>
                                        </div>
                                    </div>
                                </>
                                : tabOn === 2 &&
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
                            }
                            <div className="tm60">
                                <button type="button" 
                                    className="btn_type3 bm12" 
                                    onClick={loginBtnClickHandler}
                                    disabled={loginBtnOn ? false : true}
                                >로그인</button>
                                <Link to='/member/signup' className="btn_type4 ">회원가입</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default Login;