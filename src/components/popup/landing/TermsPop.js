import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { enum_api_uri } from "../../../config/enum";
import * as CF from "../../../config/function";
import { confirmPop } from "../../../store/popupSlice";
import { termsPop } from "../../../store/landingSlice";
import ConfirmPop from "../ConfirmPop";

const TermsPop = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const landing = useSelector((state)=>state.landing);
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
        axios.get(`${policy_cont.replace(":policy_type",landing.termsPopIdx)}`)
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
    },[landing.termsPopIdx]);


    const onTabClickHandler = (idx) => {
        dispatch(termsPop({termsPop:true,termsPopIdx:idx}));
    };


    return(<>
        {Object.keys(terms).length > 0 &&
            <div className="flex_center pop_wrap terms_pop select_apply_pop">
                <div className="dim" onClick={closePopHandler}></div>
                <div className="pop_cont border">
                    <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                    <div className="pop_tit">
                        <div className="tit">{terms.subject} (필수)</div>
                    </div>
                    <div className="tab_box">
                        <ul className="flex">
                            <li className={landing.termsPopIdx === 1 ? 'on' : ''}><button type="button" onClick={()=>onTabClickHandler(1)}>개인정보보호정책</button></li>
                            <li className={landing.termsPopIdx === 3 ? 'on' : ''}><button type="button" onClick={()=>onTabClickHandler(3)}>개인정보수집</button></li>
                            <li className={landing.termsPopIdx === 4 ? 'on' : ''}><button type="button" onClick={()=>onTabClickHandler(4)}>이용약관</button></li>
                        </ul>
                    </div>
                    <div className="scroll_wrap">
                        <div className="txt_box">{terms.contents_p}</div>
                    </div>
                    <button type="button" className="btn_ok" onClick={closePopHandler}>확인</button>
                </div>
            </div>
        }

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default TermsPop;