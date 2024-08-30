import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import * as CF from '../../config/function';
import { enum_api_uri } from "../../config/enum";
import Cookies from "js-cookie";
import { confirmPop } from "../../store/popupSlice";
import { profileData, profileDataChange } from "../../store/userSlice";
import ConfirmPop from "../../components/popup/ConfirmPop";


const Withdraw = () => {
    const dispatch = useDispatch();
    const user = useSelector((state)=>state.user);
    const popup = useSelector((state)=>state.popup);
    const m_leave_info = enum_api_uri.m_leave_info;
    const m_leave = enum_api_uri.m_leave;
    const [confirm, setConfirm] = useState(false);
    const [withdrawConfirm, setWithdrawConfirm] = useState(false);
    const [withdrawOkConfirm, setWithdrawOkConfirm] = useState(false);
    const token = Cookies.get("token");
    const [valPassword, setValPassword] = useState("");
    const [valReason, setValReason] = useState("");
    const [passView, setPassView] = useState(false);
    const [inputFocus, setInputFocus] = useState({});
    const [agreeCheck, setAgreeCheck] = useState(false);
    const [step, setStep] = useState(1);
    const [info, setInfo] = useState({});



    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
            setWithdrawConfirm(false);
            setWithdrawOkConfirm(false);
        }
    },[popup.confirmPop]);



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


    //회원탈퇴 비밀번호 입력하기
    const checkPasswordHandler = () => {
        const body = {
            m_password: valPassword,
        };
        axios.post(`${m_leave_info}`, body,
            {headers:{Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                const data = res.data;
                setInfo(data);
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
    };


    //회원탈퇴 취소시 마이페이지로 이동
    const cancelHandler = () => {
        //앱에 회원탈퇴취소 보내기
        if(window.flutterMyPage){
            const data = {};
            window.flutterMyPage.postMessage(JSON.stringify(data));
        }
    };


    //회원탈퇴 버튼 클릭시
    const withdrawBtnClickHandler = () => {
        if(valReason.length > 0 && agreeCheck){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: '회원탈퇴를 하시겠습니까?',
                confirmPopBtn:2,
            }));
            setWithdrawConfirm(true);
        }else if(valReason.length === 0){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: '탈퇴 사유를 80자 이내로 작성해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }else if(!agreeCheck){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: '탈퇴 동의에 체크해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }
    };


    //회원탈퇴하기
    const withdrawHandler = () => {
        const body = {
            reason: valReason,
        };
        axios.post(`${m_leave}`, body,
            {headers:{Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt: '탈퇴되었습니다!',
                    confirmPopBtn:1,
                }));
                setWithdrawOkConfirm(true);
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


    //회원탈퇴 완료 팝업 확인버튼클릭시 마이페이지로 이동
    const withdrawOkHandler = () => {
        //앱에 회원탈퇴완료 보내기
        if(window.flutterWithdraw){
            const data = {};
            window.flutterWithdraw.postMessage(JSON.stringify(data));
        }
    };



    return(<>
        <div className="withdraw_wrap">
            {step === 1 ?
                <div className="inner_cont">
                    <div className="tit_box bp80">
                        <h5>회원탈퇴를 위해 <br/>비밀번호를 입력해주세요.</h5>
                        <p>입력한 정보는 본인 인증을 위해서만 사용됩니다.</p>
                    </div>
                    <ul>
                        <li>
                            <p className="input_tit">비밀번호</p>
                            <div className={`custom_input2 pass_input flex${inputFocus.hasOwnProperty("password") && inputFocus.password ? " on" : ""}`}>
                                <input type={passView ? "text" : "password"} placeholder="현재 비밀번호" 
                                    onChange={(e)=>{
                                        setValPassword(e.currentTarget.value);
                                    }}
                                    onFocus={()=>{
                                        let data = {password:true};
                                        inputFocusHandler(data);
                                    }}
                                    onBlur={()=>{
                                        let data = {password:false};
                                        inputFocusHandler(data);
                                    }}
                                />
                                <button type="button" className={`btn_view${passView ? " on" : ""}`} onClick={()=>setPassView(!passView)}>비밀번호보기 버튼</button>
                            </div>
                        </li>
                    </ul>
                    <div className="btn_box">
                        <button type="button" className="app_btn2"
                            disabled={valPassword.length > 0 ? false : true}
                            onClick={checkPasswordHandler}
                        >다음</button>
                    </div>
                </div>
                : step === 2 &&
                <div className="inner_cont">
                    <div className="tit_box bp60">
                        <h5>사소한을 탈퇴하시겠어요?</h5>
                        <p>회원탈퇴 전 내용을 확인해주세요.</p>
                    </div>
                    <ul>
                        <li>
                            <p className="input_tit">회원탈퇴 사유</p>
                            <div className={`custom_input2${inputFocus.hasOwnProperty("reason") && inputFocus.reason ? " on" : ""}`}>
                                <input type={`text`} placeholder="탈퇴 사유를 적어주세요." maxLength={80}
                                    value={valReason}
                                    onChange={(e)=>{
                                        setValReason(e.currentTarget.value);
                                    }}
                                    onFocus={()=>{
                                        let data = {reason:true};
                                        inputFocusHandler(data);
                                    }}
                                    onBlur={()=>{
                                        let data = {reason:false};
                                        inputFocusHandler(data);
                                    }}
                                />
                            </div>
                        </li>
                    </ul>
                    <div className="info_box">
                        <p className="txt"><strong>{info.m_name} 님</strong>의 활동 내역이 모두 사라져요!</p>
                        <ul className="info_ul">
                            <li className="flex_between">
                                <p>잔여포인트</p>
                                <h6><strong>{CF.MakeIntComma(info.point)}</strong> 포인트</h6>
                            </li>
                            <li className="flex_between">
                                <p>소개팅 주선 대화방 수</p>
                                <h6><strong>{CF.MakeIntComma(info.room_cnt)}</strong> 개</h6>
                            </li>
                        </ul>
                        <ul className="txt_ul">
                            <li>회원탈퇴 시 계정과 관련된 정보는 복구가 불가능합니다.</li>
                            <li><span>현재 보유 중인 포인트, 소개팅 주선 대화방은 모두 소멸</span>되며 재가입 후에도 복구할 수 없습니다.</li>
                            <li>기존 아이디로 <span>재가입이 불가능</span>합니다.</li>
                            <li>회원 탈퇴를 신청하시면 해당 아이디는 즉시 탈퇴 처리되며, 이후 영구적으로 사용이 중지되므로 새로운 아이디로만 재가입이 가능 합니다.</li>
                        </ul>
                    </div>
                    <div className="all_check custom_check">
                        <label htmlFor="all_agree">
                            <input type={"checkbox"} id="all_agree" 
                                onChange={() => setAgreeCheck(!agreeCheck)} 
                                checked={agreeCheck} 
                            />
                            <span className="check">체크</span>
                            <span className="txt">위 내용에 모두 동의합니다.</span>
                        </label>
                    </div>
                    <div className="btn_box flex_between">
                        <button type="button" className="app_btn2" onClick={cancelHandler}>계속 사용할래요!</button>
                        <button type="button" className="app_btn5" onClick={withdrawBtnClickHandler}>회원탈퇴</button>
                    </div>
                </div>
            }
        </div>

        {/* 회원탈퇴 confirm팝업 */}
        {withdrawConfirm && <ConfirmPop onClickHandler={withdrawHandler} />}  

        {/* 회원탈퇴완료 confirm팝업 */}
        {withdrawOkConfirm && <ConfirmPop closePop="custom" onCloseHandler={withdrawOkHandler} />}  

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}  
    </>);
};

export default Withdraw;