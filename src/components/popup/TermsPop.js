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
        //사소한 1% 도전하기 - 개인정보수집
        if(popup.termsPopIdx === 5){
            const newTerms = {
                subject: '개인정보수집 동의서',
                contents_p: `사소한 개인정보 처리방침

                사소한(이하 ‘회사’라 합니다)은 개인정보 보호법 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리지침을 수립,공개합니다.
                
                제1조(개인정보의 처리목적) 회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                
                1. 홈페이지 회원 가입 및 관리
                회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별,인증, 회원자격 유지,관리, 제한적 본인확인제 시행에 따른 본인확인, 서비스 부정이용 방지, 만 14세 미만 아동의 개인정보 처리시 법정대리인의 동의여부 확인, 각종 고지,통지, 고충처리 등을 목적으로 개인정보를 처리합니다.
                2. 재화 또는 서비스 제공
                서비스 제공, 계약서,청구서 발송, 콘텐츠 제공, 맞춤서비스 제공, 본인인증, 연령인증, 요금결제,정산, 채권추심 등을 목적으로 개인정보를 처리합니다.
                3. 고충처리
                민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락,통지, 처리결과 통보 등의 목적으로 개인정보를 처리합니다.
                
                제2조(개인정보의 처리 및 보유기간) ① 회사는 법령에 따른 개인정보 보유,이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의 받은 개인정보 보유,이용기간 내에서 개인정보를 처리,보유합니다.
                
                ② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
                
                1. 애플리케이션 회원 가입 및 관리 : ‘사소한’ 탈퇴시까지
                다만, 다음의 사유에 해당하는 경우에는 해당 사유 종료시까지
                1) 관계 법령 위반에 따른 수사,조사 등이 진행 중인 경우에는 해당 수사,조사 종료 시까지
                2) 홈페이지 이용에 따른 채권,채무관계 잔존 시에는 해당 채권,채무관계 정산 시까지
                
                2. 재화 또는 서비스 제공 : 재화,서비스 공급완료 및 요금결제,정산 완료시까지
                다만, 다음의 사유에 해당하는 경우에는 해당 기간 종료 시까지
                1) 「전자상거래 등에서의 소비자 보호에 관한 법률」에 따른 표시,광고, 계약내용 및 이행 등 거래에 관한 기록
                - 표시,광고에 관한 기록 : 6월
                - 계약 또는 청약철회, 대금결제, 재화 등의 공급기록 : 5년
                - 소비자 불만 또는 분쟁처리에 관한 기록 : 3년
                2)「통신비밀보호법시행령」에 따른 통신사실확인자료 보관
                - 가입자 전기통신일시, 개시,종료시간, 상대방 가입자번호, 사용도수, 발신기지국 위치추적자료 : 1년
                - 컴퓨터통신, 인터넷 로그기록자료, 접속지 추적자료 : 3개월
                
                제3조(개인정보의 제3자 제공) ① 회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
                ② 회사는 다음과 같이 개인정보를 제3자에게 제공하고 있습니다.
                1. 휴대폰 통신사 및 대리점
                - 개인정보를 제공받는 자 : 휴대폰 통신사 및 대리점
                - 개인정보 이용목적 : 회원이 가입 시 기재한 성명 및 전화번호가 통신사에 등록된 성명 및 전화번호와 일치하는지 여부를 판단하기 위함
                - 제공하는 개인정보 항목 : 성명, 전화번호
                - 제공받는 자의 보유,이용기간 : 1달
                
                2. 애플리케이션을 이용하는 다른 회원
                - 개인정보를 제공받는 자 : 애플리케이션을 이용하는 다른 회원
                - 개인정보 이용목적 : 애플리케이션을 이용하는 다른 이성회원에게 성명, 사진, 주소, 전화번호 등의 정보를 제공하여 소개팅을 성사시키기 위함
                - 제공하는 개인정보 항목 : 성명, 사진, 주소, 전화번호, 직업, 취미
                - 제공받는 자의 보유,이용기간 : 회원 탈퇴 시까지
                
                제4조(정보주체의 권리,의무 및 행사방법) ① 정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
                1. 개인정보 열람요구
                2. 오류 등이 있을 경우 정정 요구
                3. 삭제요구
                4. 처리정지 요구
                ② 제1항에 따른 권리 행사는 회사에 대해 서면, 전화, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체없이 조치하겠습니다.
                ③ 정보주체가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한 경우에는 회사는 정정 또는 삭제를 완료할 때까지 당해 개인정보를 이용하거나 제공하지 않습니다.
                ④ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우 개인정보 보호법 시행규칙 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.
                ⑤ 정보주체는 개인정보 보호법 등 관계법령을 위반하여 회사가 처리하고 있는 정보주체 본인이나 타인의 개인정보 및 사생활을 침해하여서는 아니 됩니다.
                
                제5조(처리하는 개인정보 항목) 회사는 다음의 개인정보 항목을 처리하고 있습니다.
                1. 애플리케이션 회원 가입 및 관리
                ,필수항목 : 성명, 전화번호, 성별, 주소, 직업, 사진, 취미
                
                
                2. 재화 또는 서비스 제공
                ,필수항목 : 성명, 전화번호, 성별, 직업, 신용카드번호, 은행계좌정보 등 결제정보
                ,선택항목 : 관심분야, 과거 구매내역
                
                3. 애플리케이션 서비스 이용과정에서 아래 개인정보 항목이 자동으로 생성되어 수집될 수 있습니다.
                IP주소, 쿠키, MAC주소, 서비스 이용기록, 방문기록, 불량 이용기록 등
                
                제6조(개인정보의 파기) ① 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.
                ② 정보주체로부터 동의 받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관 장소를 달리하여 보존합니다.
                ③ 개인정보 파기의 절차 및 방법은 다음과 같습니다.
                1. 파기절차
                회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.
                2. 파기방법
                회사는 전자적 파일 형태로 기록,저장된 개인정보는 기록을 재생할 수 없도록 로우레밸포멧(Low Level Format) 등의 방법을 이용하여 파기하며, 종이 문서에 기록,저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.
                
                제7조(개인정보의 안전성 확보조치) 회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
                1. 관리적 조치 : 내부관리계획 수립,시행, 정기적 직원 교육 등
                2. 기술적 조치 : 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치
                3. 물리적 조치 : 전산실, 자료보관실 등의 접근통제
                
                제8조(개인정보 자동 수집 장치의 설치,운영 및 거부에 관한 사항) 회사는 정보주체의 이용정보를 저장하고 수시로 불러오는 ‘쿠키(cookie)’를 사용하지 않습니다.`
            };
            setTerms(newTerms);
        }
        //사소한 1% 도전하기 - 광고성수신
        else if(popup.termsPopIdx === 6){
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