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


const ResetPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const reset_pw = enum_api_uri.reset_pw;
    const popup = useSelector((state)=>state.popup);
    const common = useSelector((state)=>state.common);
    const [confirm, setConfirm] = useState(false);
    const [okConfirm, setOkConfirm] = useState(false);
    const [focusInput, setFocusInput] = useState({});
    const [error, setError] = useState({});
    const [values, setValues] = useState({});
    const [passShow, setPassShow] = useState({"password":false,"password2":false});
    const [btnOn, setBtnOn] = useState(false);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
            setOkConfirm(false);
        }
    },[popup.confirmPop]);


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


    //values 값 변경시 
    useEffect(()=>{
        if((values.password && values.password.length > 0) && values.password2 && values.password2.length > 0){
            setBtnOn(true);
        }else{
            setBtnOn(false);
        }
    },[values]);


    //입력값 체크
    const errorCheck = () => {
        const newError = {...error};
        if(!values.password || values.password.length === 0){
            newError.password = true;
        }
        if(values.password){
            let pw = values.password;
            let num = pw.search(/[0-9]/g);
            let eng = pw.search(/[a-z]/ig);
            let spe = pw.search(/[!@#$%^&*()]/g);   //숫자키 1~0까지 있는 특수문자만 사용

            if(pw.length < 8 || pw.length > 13){
                newError.password = true;
            }else if(pw.search(/\s/) != -1){
                newError.password = true;
            }else if(num < 0 || eng < 0 || spe < 0){
                newError.password = true;
            }else {
                newError.password = false;
            }
        }
        if(!values.password2 || values.password2.length === 0){
            newError.password2 = true;
        }
        if(values.password2){
            let pw = values.password;
            let pw2 = values.password2;
            if(pw !== pw2){
                newError.password2 = true;
            }else{
                newError.password2 = false;
            }
        }
        setError(newError);
    }


    //비밀번호변경 버튼 클릭시
    const changeBtnClickHandler = () => {
        errorCheck();

        let pw = '';
        if(values.password){
            pw = values.password;
        }
        let num = pw.search(/[0-9]/g);
        let eng = pw.search(/[a-z]/ig);
        let spe = pw.search(/[!@#$%^&*()]/g);   //숫자키 1~0까지 있는 특수문자만 사용

        if(pw.length >= 8 && pw.search(/\s/) == -1 && num !== -1 && eng !== -1 && spe !== -1 && pw == values.password2){
            changePassword();
        }
    };


    //비밀번호 변경하기
    const changePassword = () => {
        const body = {
            m_password: values.password,
            token: common.resetPasswordToken
        }

        axios.post(reset_pw, body)
        .then((res)=>{
            if(res.status === 200){
                //store 에 저장된 비밀번호변경 토큰값 초기화
                dispatch(resetPasswordToken(''));

                //로그인페이지로 이동
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'비밀번호 변경이 완료되었습니다. <br/>로그인 해주세요.',
                    confirmPopBtn:1,
                }));
                setOkConfirm(true);
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
    
 


    return(<>
        <div className="gray_wrap">
            <div className="cont">
                <div className="form_cont">
                    <div className="tit_box">
                        <p className="tit">비밀번호 변경</p>
                    </div>
                    <div className="shadow_box">
                        <div className="inner">
                            <p className="tx_c f_18 color_black2 bm32">사소한은 회원님의 중요한 개인정보를 <br/>철저히 관리하고 있습니다.</p>
                            <ul className="form_ul">
                                <li>
                                    <p className="color_black2 medium">비밀번호 <span className="color_point">*</span></p>
                                    <div className={`pass_input_box${passShow.password ? " on" : ""}`}>
                                        <div className={`input_box f_18 light${focusInput.password ? " on" : error.password ? " error" : ""}`}>
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
                                                maxLength={12}
                                            />
                                        </div>
                                        <button type="button" onClick={()=>passShowHandler("password")}>비밀번호보기 버튼</button>
                                    </div>
                                    {(focusInput.password || error.password) && <p className={`error_txt${focusInput.password ? ' color_point' : ''}`}>영문, 숫자, 특수문자를 포함하여 8~12자 까지 입력해주세요!</p>}
                                </li>
                                <li>
                                    <p className="color_black2 medium">비밀번호 확인 <span className="color_point">*</span></p>
                                    <div className={`pass_input_box${passShow.password2 ? " on" : ""}`}>
                                        <div className={`input_box f_18 light${focusInput.password2 ? " on" : error.password2 ? " error" : ""}`}>
                                            <InputBox 
                                                type={passShow.password2 ? "text" : "password"}
                                                placeholder={`비밀번호를 입력해주세요.`}
                                                value={values.password2 || ""}
                                                onChangeHandler={onInputChangeHandler}
                                                id={`password2`}
                                                onFocusHandler={(e)=>{
                                                    focusHandler(e,true);
                                                }}
                                                onBlurHandler={(e)=>{
                                                    focusHandler(e,false);
                                                }}
                                                maxLength={12}
                                            />
                                        </div>
                                        <button type="button" onClick={()=>passShowHandler("password2")}>비밀번호보기 버튼</button>
                                    </div>
                                    {(focusInput.password2 || error.password2) && <p className={`error_txt${focusInput.password2 ? ' color_point' : ''}`}>비밀번호를 재입력해주세요!</p>}
                                </li>
                            </ul>
                            <div className="tm60">
                                <button type="button" 
                                    className="btn_type3" 
                                    disabled={btnOn ? false : true}
                                    onClick={changeBtnClickHandler}
                                >비밀번호 변경</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 비밀번호변경 완료 confirm팝업 */}
        {okConfirm && <ConfirmPop closePop="custom" onCloseHandler={()=>navigate('/member/login')} />}

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default ResetPassword;