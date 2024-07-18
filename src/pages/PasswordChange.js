import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { enum_api_uri } from "../config/enum";
import * as CF from "../config/function";
import { confirmPop } from "../store/popupSlice";
import InputBox from "../components/component/InputBox";
import ConfirmPop from "../components/popup/ConfirmPop";


const PasswordChange = () => {
    const dispatch = useDispatch();
    const { token } = useParams();
    const navigate = useNavigate();
    const popup = useSelector((state)=>state.popup);
    const reset_pw = enum_api_uri.reset_pw;
    const [confirm, setConfirm] = useState(false);
    const [doneConfirm, setDoneConfirm] = useState(false);
    const [values, setValues] = useState({});
    const [passShow, setPassShow] = useState({"password":false,"password2":false});
    const [focusInput, setFocusInput] = useState({});
    const [error, setError] = useState({});


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
            setDoneConfirm(false);
        }
    },[popup.confirmPop]);

    
    //input값 변경시
    const onInputChangeHandler = (e) => {
        const val = e.target.value;
        const id = e.target.id;

        const newValues = {...values};
        newValues[id] = val;
        setValues(newValues); 
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
    

    //비밀번호변경버튼 클릭시
    const passChangeBtnClickHandler = () => {
        if(!values.password){
            const newError = {...error};
            newError.password = true;
            setError(newError);
        }else{
            const pw = values.password;
            const num = pw.search(/[0-9]/g);
            const eng = pw.search(/[a-z]/ig);
            const spe = pw.search(/[!@#$%^&*()]/g);   //숫자키 1~0까지 있는 특수문자만 사용

            if(pw.length < 8 || pw.length > 13){
                const newError = {...error};
                newError.password = true;
                setError(newError);
            }else if(pw.search(/\s/) != -1){
                const newError = {...error};
                newError.password = true;
                setError(newError);
            }else if(num < 0 || eng < 0 || spe < 0){
                const newError = {...error};
                newError.password = true;
                setError(newError);
            }else{
                if(!values.password2){
                    const newError = {...error};
                    newError.password = false;
                    newError.password2 = true;
                    setError(newError);
                }else{
                    const pw2 = values.password2;
                    
                    //비밀번호 확인같은지 확인
                    if(pw !== pw2){
                        const newError = {...error};
                        newError.password2 = true;
                        setError(newError);
                    }else{
                        const newError = {...error};
                        newError.password = false;
                        newError.password2 = false;
                        setError(newError);

                        //비밀번호변경 실행함수
                        passChangeHandler();
                    }
                }
            }
        }
    };


    //비밀번호변경
    const passChangeHandler = () => {
        const body = {
            m_password: values.password,
            token: token
        }

        axios.post(reset_pw, body)
        .then((res)=>{
            if(res.status === 200){
                //비밀번호변경 완료후 메인페이지로 이동
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'비밀번호변경이 완료되었습니다.',
                    confirmPopBtn:1,
                }));
                setDoneConfirm(true);
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
        <div className="sub_wrap pass_change_wrap">
            <div className="top_banner"></div>
            <div className="inner_cont">
                <div className="round_box">
                    <div className="inner">
                        <div className="tit_box tx_c">
                            <p className="tit">비밀번호 변경</p>
                            <p className="txt">사소한은 회원님의 중요한 개인정보를 철저히 관리하고 있습니다. <br/>비밀번호를 정확히 입력해주세요!</p>
                        </div>
                        <ul className="form_box">
                            <li className="flex">
                                <p>비밀번호</p>
                                <div>
                                    <div className={`pass_input_box${passShow.password ? " on" : ""}`}>
                                        <div className={`input_box h_50${focusInput.password ? " on" : ""}`}>
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
                                    {error.password && <p className="error_txt">특수문자, 영문, 숫자 포함하여 8~12자까지 입력해주세요.</p>}
                                </div>
                            </li>
                            <li className="flex">
                                <p>비밀번호 확인</p>
                                <div>
                                    <div className={`pass_input_box${passShow.password2 ? " on" : ""}`}>
                                        <div className={`input_box h_50${focusInput.password2 ? " on" : ""}`}>
                                            <InputBox 
                                                type={passShow.password2 ? "text" : "password"}
                                                placeholder={`비밀번호를 재확인`}
                                                value={values.password2 || ""}
                                                onChangeHandler={onInputChangeHandler}
                                                id={`password2`}
                                                onFocusHandler={(e)=>{
                                                    focusHandler(e,true);
                                                }}
                                                onBlurHandler={(e)=>{
                                                    focusHandler(e,false);
                                                }}
                                            />
                                        </div>
                                        <button type="button" onClick={()=>passShowHandler("password2")}>비밀번호보기 버튼</button>
                                    </div>
                                    {error.password2 && <p className="error_txt">비밀번호가 일지하지않습니다.</p>}
                                </div>
                            </li>
                        </ul>
                        <button type="button" className="btn_type2" onClick={passChangeBtnClickHandler}>비밀번호 변경</button>
                    </div>
                </div>
            </div>
        </div>

        {/* 비밀번호변경완료 confirm팝업 */}
        {doneConfirm && <ConfirmPop closePop="custom" onCloseHandler={()=>navigate("/")}  />}

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default PasswordChange;