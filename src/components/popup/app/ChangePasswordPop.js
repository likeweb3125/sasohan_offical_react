import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { enum_api_uri } from "../../../config/enum";
import { appChangePasswordPop } from "../../../store/popupSlice";


const ChangePasswordPop = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const [off, setOff] = useState(false);
    const m_change_password = enum_api_uri.m_change_password;
    const [valPassword, setValPassword] = useState("");
    const [valPassword2, setValPassword2] = useState("");
    const [usablePass, setUsablePass] = useState(false);
    const [passView, setPassView] = useState(false);
    const [pass2View, setPass2View] = useState(false);


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

    
    return(
        <div className={`app_pop_wrap password_pop${off ? " off" : ""}`}>
            <div className="dim" onClick={closePopHandler}></div>
            <div className="pop_cont">
                <div className="flex_center">
                    <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                </div>
                <div className="pop_tit">
                    <p className="tit"><strong>비밀번호 변경</strong></p>
                    <p className="txt">비밀번호는 알파벳과 숫자 및 특수문자를 포함해야 하고 8자 이상이어야 합니다.</p>
                </div>
                <div className="scroll_wrap">
                    <ul>
                        <li>
                            <div className="custom_input2 pass_input flex">
                                <input type={passView ? "text" : "password"} placeholder="비밀번호를 입력해주세요." 
                                    onChange={(e)=>{
                                        setValPassword(e.currentTarget.value);
                                        setUsablePass(false);
                                    }} 
                                />
                                <button type="button" className={`btn_view${passView ? " on" : ""}`} onClick={()=>setPassView(!passView)}>비밀번호보기 버튼</button>
                            </div>
                        </li>
                        <li>
                            <div className="custom_input2 pass_input flex">
                                <input type={pass2View ? "text" : "password"} placeholder="비밀번호 재확인" 
                                    onChange={(e)=>{
                                        setValPassword2(e.currentTarget.value);
                                        setUsablePass(false);
                                    }}
                                />
                                <button type="button" className={`btn_view${pass2View ? " on" : ""}`} onClick={()=>setPass2View(!pass2View)}>비밀번호보기 버튼</button>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="btn_box">
                    <button type="button" className="app_btn" onClick={closePopHandler}>확인</button>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPop;