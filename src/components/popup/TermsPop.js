import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import * as CF from "../../config/function";
import { enum_api_uri } from "../../config/enum";
import { termsPop, confirmPop } from "../../store/popupSlice";
import ConfirmPop from "./ConfirmPop";

const TermsPop = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const policy_cont = enum_api_uri.policy_cont;
    const [tab, setTab] = useState(["개인정보 보호정책","이메일 무단 수집 거부","개인정보수집","이용약관"]);
    const [tabOn, setTabOn] = useState(1);
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
        dispatch(termsPop({termsPop:false,termsPopTab:null}));
    };

    useEffect(()=>{
        setTabOn(popup.termsPopTab);
    },[popup.termsPopTab]);


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
        getTerms(popup.termsPopTab);
    },[]);

    useEffect(()=>{
        getTerms(tabOn);
    },[tabOn]);

    return(<>
        <div className="flex_center pop_wrap terms_pop">
            <div className="dim" onClick={closePopHandler}></div>
            <div className="pop_cont">
                <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                <div className="pop_tit">
                    <div className="tit">서비스 약관</div>
                </div>
                <div className="scroll_wrap">
                    <div className="tab_box">
                        <ul className="flex">
                            {tab.map((cont,i)=>{
                                return(
                                    <li 
                                        key={i} 
                                        onClick={()=>{setTabOn(i+1)}}
                                        className={`${tabOn === i+1 ? "on" : ""}`}
                                    >{cont}</li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="txt_box">{terms.contents_p}</div>
                </div>
            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default TermsPop;