import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { enum_api_uri } from "../config/enum";
import * as CF from "../config/function";
import { confirmPop } from "../store/popupSlice";
import ConfirmPop from "../components/popup/ConfirmPop";


const UserDelt = () => {
    const dispatch = useDispatch();
    const user_delt = enum_api_uri.user_delt;
    const popup = useSelector((state)=>state.popup);
    const [id, setId] = useState('');
    const [focusInput, setFocusInput] = useState({});
    const [error, setError] = useState(false);
    const [confirm, setConfirm] = useState(false);


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
        }
    },[popup.confirmPop]);


    //인풋 포커스
    const focusHandler = (e,val) => {
        const id = e.target.id;
        let newList = {...focusInput};
        newList[id] = val;
        
        setFocusInput(newList);
    };


    //회원 정보삭제하기
    const onDeltHandler = () => {
        if(id.length > 0){
            setError(false);
            
            const body = {
                m_id: id
            }
    
            axios.post(user_delt, body)
            .then((res)=>{
                if(res.status === 200){
                    dispatch(confirmPop({
                        confirmPop:true,
                        confirmPopTit:'알림',
                        confirmPopTxt:'회원정보 삭제 요청이 완료되었습니다.',
                        confirmPopBtn:1,
                    }));
                    setConfirm(true);

                    setId('');
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
        }else{
            setError(true);
        }
    };


    return(<>
        <div className="user_delt_wrap flex_center">
            <div className="round_box">
                <div className="tx_c">
                    <p className="tit">회원정보 삭제</p>
                    <p className="txt">삭제하실 회원님의 아이디를 입력해 주세요.</p>
                </div>
                <div className="tp60 bp60">
                    <p>아이디</p>
                    <div className={`input_box h_50${focusInput.id ? " on" : ""}`}>
                        <input type={`text`} 
                            value={id} 
                            placeholder="아이디를 입력해주세요."
                            id="id" 
                            onChange={(e)=>{
                                const val = e.currentTarget.value;
                                setId(val);
                            }}
                            onFocus={(e)=>{
                                focusHandler(e,true);
                            }}
                            onBlur={(e)=>{
                                focusHandler(e,false);
                            }}
                            maxLength={50}
                        />
                    </div>
                    {error && <p className="error_txt f_12">아이디를 입력해주세요.</p>}
                </div>
                <button type="button" className="btn" onClick={onDeltHandler}>전송</button>
            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default UserDelt;