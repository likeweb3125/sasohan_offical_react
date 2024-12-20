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
        //랜딩 사소한 1%, 소개팅신청 - 광고성 수신 동의서
        if(popup.termsPopIdx === 6){
            const newTerms = {
                subject: '광고성 수신 동의서',
                contents_p: `[선택]광고성 메시지 수신 동의서
                사소한 (이하 "회사")
                
                고객 동의서
                
                수집 및 이용 목적
                
                회사는 고객에게 데이팅 서비스와 관련된 다양한 정보 및 혜택을 제공하기 위해 광고성 메시지를 발송합니다.
                광고성 메시지는 카카오톡,카카오 채널, SMS, 이메일, 앱 푸시 알림 등의 방법으로 전달될 수 있습니다.
                수집 항목
                
                ▪️ 수집항목
                성명, 생년월일, 성별, 휴대전화번호, 지역,서비스 이용 기록
                이용 기간
                
                광고성 메시지 수신 동의일로부터 고객의 수신 거부 의사 표시 시까지
                동의 거부 권리
                
                고객은 언제든지 광고성 메시지 수신을 거부할 수 있습니다.
                수신 거부를 원하는 경우, SMS 내 수신 거부 링크를 클릭하거나 고객센터로 연락하시면 됩니다.
                수신 거부 이후에도 서비스 관련 필수 공지사항은 별도로 발송될 수 있습니다.
                동의 여부`
            };
            setTerms(newTerms);
        }
        else{
            getTerms();
        }
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