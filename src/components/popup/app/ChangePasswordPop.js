import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { enum_api_uri } from "../../../config/enum";
import util from "../../../config/util";
import * as CF from "../../../config/function";
import { appChangePasswordPop, confirmPop } from "../../../store/popupSlice";
import ConfirmPop from "../ConfirmPop";


const ChangePasswordPop = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const [off, setOff] = useState(false);
    const m_change_password = enum_api_uri.m_change_password;
    const [valPassword, setValPassword] = useState("");
    const [valPassword2, setValPassword2] = useState("");
    const [valPassword3, setValPassword3] = useState("");
    const [passView, setPassView] = useState(false);
    const [pass2View, setPass2View] = useState(false);
    const [pass3View, setPass3View] = useState(false);
    const [inputFocus, setInputFocus] = useState({});
    const [errorPassword, setErrorPassword] = useState(true);
    const [errorPassword2, setErrorPassword2] = useState(false);
    const [errorPassword3, setErrorPassword3] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [editOkConfirm, setEditOkConfirm] = useState(false);
    const token = util.getCookie("token");


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
            setEditOkConfirm(false);
        }
    },[popup.confirmPop]);


    //팝업닫기--------------
    const closePopHandler = () => {
        setOff(true);
    };

    useEffect(()=>{
        if(off){
            setTimeout(()=>{
                dispatch(appChangePasswordPop(false));
            },500);
        }
    },[off]);


    //인풋포커스 체크
    const inputFocusHandler = (data) => {
        setInputFocus((prevInputFocus) => {
            // 이전 상태를 복사
            const newInputFocus = { ...prevInputFocus };
        
            // data 객체를 반복하면서 값을 추가하거나 변경
            for (const key in data) {
                newInputFocus[key] = data[key];
            }
      
            return newInputFocus;
        });
    };


    //비밀번호 변경하기버튼 클릭시
    const changeBtnClickHandler = () => {
        let pw = valPassword2;
        let pw2 = valPassword3;
        let num = pw.search(/[0-9]/g);
        let eng = pw.search(/[a-z]/ig);

        if(pw.length < 8 || pw.length > 13){
            setErrorPassword2(true);
        }else if(pw.search(/\s/) != -1){
            setErrorPassword2(true);
        }else if(num < 0 || eng < 0 ){
            setErrorPassword2(true);
        }else {
            setErrorPassword2(false);

            //비밀번호 확인같은지 확인
            if(pw !== pw2){
                setErrorPassword3(true);
            }else{
                setErrorPassword3(false);

                changeHandler();
            }
        }
    };


    //비밀번호 변경하기
    const changeHandler = () => {
        const body = {
            now_pw: valPassword,
            change_pw: valPassword2,
            confirm_pw: valPassword3,
        };
        axios.post(`${m_change_password}`, body,
            {headers:{Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt: '비밀번호가 변경되었습니다.',
                    confirmPopBtn:1,
                }));
                setEditOkConfirm(true);
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
        <div className={`app_pop_wrap password_pop${off ? " off" : ""}`}>
            <div className="dim" onClick={closePopHandler}></div>
            <div className="pop_cont">
                <div className="flex_center">
                    <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                </div>
                <div className="pop_tit">
                    <p className="tit"><strong>비밀번호 변경</strong></p>
                    <p className={`txt${errorPassword2 ? " alert_txt" : ""}`}>비밀번호는 알파벳과 숫자를 포함해야 하고 <br/>8자 이상이어야 합니다.</p>
                </div>
                <div className="scroll_wrap">
                    <ul>
                        <li className="bp15">
                            <div className={`custom_input2 pass_input flex${inputFocus.hasOwnProperty("now") && inputFocus.now ? " on" : ""}`}>
                                <input type={passView ? "text" : "password"} placeholder="현재 비밀번호" 
                                    onChange={(e)=>{
                                        setValPassword(e.currentTarget.value);
                                    }}
                                    onFocus={()=>{
                                        let data = {now:true};
                                        inputFocusHandler(data);
                                    }}
                                    onBlur={()=>{
                                        let data = {now:false};
                                        inputFocusHandler(data);
                                    }}
                                />
                                <button type="button" className={`btn_view${passView ? " on" : ""}`} onClick={()=>setPassView(!passView)}>비밀번호보기 버튼</button>
                            </div>
                        </li>
                        <li className="bp15">
                            <div className={`custom_input2 pass_input flex${inputFocus.hasOwnProperty("new") && inputFocus.new ? " on" : ""}`}>
                                <input type={pass2View ? "text" : "password"} placeholder="새 비밀번호" 
                                    onChange={(e)=>{
                                        setValPassword2(e.currentTarget.value);
                                    }}
                                    onFocus={()=>{
                                        let data = {new:true};
                                        inputFocusHandler(data);
                                    }}
                                    onBlur={()=>{
                                        let data = {new:false};
                                        inputFocusHandler(data);
                                    }}
                                />
                                <button type="button" className={`btn_view${pass2View ? " on" : ""}`} onClick={()=>setPass2View(!pass2View)}>비밀번호보기 버튼</button>
                            </div>
                        </li>
                        <li>
                            <div className={`custom_input2 pass_input flex${inputFocus.hasOwnProperty("newCheck") && inputFocus.newCheck ? " on" : ""}`}>
                                <input type={pass3View ? "text" : "password"} placeholder="새 비밀번호 확인" 
                                    onChange={(e)=>{
                                        setValPassword3(e.currentTarget.value);
                                    }} 
                                    onFocus={()=>{
                                        let data = {newCheck:true};
                                        inputFocusHandler(data);
                                    }}
                                    onBlur={()=>{
                                        let data = {newCheck:false};
                                        inputFocusHandler(data);
                                    }}
                                />
                                <button type="button" className={`btn_view${pass3View ? " on" : ""}`} onClick={()=>setPass3View(!pass3View)}>비밀번호보기 버튼</button>
                            </div>
                            {errorPassword3 && <p className="f_16 alert_txt tp8">비밀번호가 일치하지 않습니다.</p>}
                        </li>
                    </ul>
                </div>
                <div className="btn_box">
                    <button type="button" className="app_btn"
                        disabled={valPassword.length > 0 && valPassword2.length > 0 && valPassword3.length > 0 ? false : true}
                        onClick={changeBtnClickHandler}
                    >수정</button>
                </div>
            </div>
        </div>

        {/* 비밀번호수정완료 confirm팝업 */}
        {editOkConfirm && <ConfirmPop closePop="custom" onCloseHandler={closePopHandler} />}  

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default ChangePasswordPop;