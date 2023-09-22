import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { appTermsPop, appTermsCheckList, confirmPop } from "../../../store/popupSlice";
import { enum_api_uri } from "../../../config/enum";
import * as CF from "../../../config/function";
import ConfirmPop from "../ConfirmPop";


const TermsPop = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const policy_cont = enum_api_uri.policy_cont;
    const [off, setOff] = useState(false);
    const [terms, setTerms] = useState({});
    const [confirm, setConfirm] = useState(false);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);


    //팝업닫기--------------
    const closePopHandler = () => {
        setOff(true);
    };

    useEffect(()=>{
        if(off){
            setTimeout(()=>{
                dispatch(appTermsPop({appTermsPop:false,appTermsPopIdx:null}));
            },500);
        }
    },[off]);


    // 약관동의하기
    const agreeHandler = () => {
        setOff(true);

        //약관 동의체크하기
        const check = "agree_"+popup.appTermsPopIdx;
        const list = [...popup.appTermsCheckList];
        if(!list.includes(check)){
            const newList = list.concat([check]);
            dispatch(appTermsCheckList(newList));
        }
    };


    //약관내용 가져오기
    const getTerms = (idx) => {
        axios.get(`${policy_cont.replace(":policy_type",idx)}`)
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setTerms({...data});
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

    useEffect(()=>{
        getTerms(popup.appTermsPopIdx);
    },[]);


    return(<>
        <div className={`app_pop_wrap app_terms_pop${off ? " off" : ""}`}>
            <div className="dim" onClick={closePopHandler}></div>
            <div className="pop_cont">
                <div className="flex_center">
                    <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                </div>
                <div className="pop_tit">
                    <p className="tit"><strong>{terms.subject}</strong></p>
                </div>
                <div className="scroll_wrap">
                    <div className="txt">{terms.contents_p}</div>
                </div>
                <div className="btn_box">
                    <button type="button" className="app_btn" onClick={agreeHandler}>동의</button>
                </div>
            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default TermsPop;