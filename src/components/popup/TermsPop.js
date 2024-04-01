import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { enum_api_uri } from "../../config/enum";
import * as CF from "../../config/function";
import { termsPop, confirmPop, termsCheckList } from "../../store/popupSlice";
import ConfirmPop from "./ConfirmPop";


const TermsPop = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const policy_cont = enum_api_uri.policy_cont;
    const [confirm, setConfirm] = useState(false);
    const [terms, setTerms] = useState({});


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);


    //팝업닫기
    const closePopHandler = () => {
        dispatch(termsPop({termsPop:false,termsPopIdx:null}));
    };


    //약관내용 가져오기
    const getTerms = () => {
        axios.get(`${policy_cont.replace(":policy_type",popup.termsPopIdx)}`)
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
        getTerms();
    },[popup.termsPopIdx]);


    //약관동의 체크
    const termsCheckHandler = () => {
        let check = "";
            check = "terms"+popup.termsPopIdx;
        if(!popup.termsCheckList.includes('terms'+popup.termsPopIdx)){
            dispatch(termsCheckList([...popup.termsCheckList,check]));
        }
        closePopHandler();
    };



    return(<>
        {Object.keys(terms).length > 0 &&
            <div className="flex_center pop_wrap terms_pop">
                <div className="dim" onClick={closePopHandler}></div>
                <div className="pop_cont">
                    <button type="button" className="btn_close black" onClick={closePopHandler}>닫기버튼</button>
                    <div className="pop_tit">
                        <div className="tit">{terms.subject} (필수)</div>
                    </div>
                    <div className="scroll_wrap">
                        <div className="txt_box">{terms.contents_p}</div>
                    </div>
                    <button type="button" className="btn_type3" onClick={termsCheckHandler}>동의</button>
                </div>
            </div>
        }

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default TermsPop;