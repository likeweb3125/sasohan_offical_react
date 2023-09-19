import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { appTermsPop, appTermsCheckList } from "../../../store/popupSlice";


const TermsPop = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const [off, setOff] = useState(false);

    //팝업닫기--------------
    const closePopHandler = () => {
        setOff(true);

        //약관 동의체크하기
        const check = "agree_"+popup.appTermsPopIdx;
        const list = [...popup.appTermsCheckList];
        if(!list.includes(check)){
            const newList = list.concat([check]);
            dispatch(appTermsCheckList(newList));
        }
    };

    useEffect(()=>{
        if(off){
            setTimeout(()=>{
                dispatch(appTermsPop({appTermsPop:false,appTermsPopIdx:null}));
            },500);
        }
    },[off]);


    return(
        <div className={`app_pop_wrap app_terms_pop${off ? " off" : ""}`}>
            <div className="dim" onClick={closePopHandler}></div>
            <div className="pop_cont">
                <div className="flex_center">
                    <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                </div>
                <div className="pop_tit">
                    <p className="tit"><strong>개인정보취급방침 동의</strong></p>
                </div>
                <div className="scroll_wrap">
                    <div className="txt">{`<제 1 장 총칙>

                    제 1 조 (목적)
                    이 약관은 주식회사 피플벤처스(이하 "회사"라고 함)가 인터넷 사이트 (http://xn--9m1b26woog.com/thesaju/mobile/login , 이하 "홈페이지"라고 합니다.)와 모바일 사이트(http://m.hongcafe.com) 및 스마트폰 등 이동통신기기를 통해 제공되는 어플리케이션 “홍카페” 모바일 어플리케이션(이하 "모바일 서비스"라고 합니다.)을 통하여 제공하는 서비스 및 제반 서비스의 이용과 관련하여 회사와 이용고객간의 권리와 의무, 책임사항 및 이용고객의 서비스 이용절차에 관한 사항을 규정함을 목적으로 합니다.

                    제 2 조 (약관의 명시, 효력 및 변경)
                    ① 회사는 이 약관을 서비스를 이용하고자 하는 자와 이용고객이 알 수 있도록 서비스가 제공되는 홈페이지와 모바일 서비스에 게시하며, 회원가입을 위해 회원정보를 제출하거나 회사의 고지와 안내 멘트를 듣고 회사의 서비스를 이용하는 자는 이 약관에 동의하는 것을 의미합니다.
                    ② 이 약관에 동의하는 것은 정기적으로 홈페이지와 모바일 서비스에 방문하여 약관의 변경 사항을 확인하는 것에 동의하는 것을 의미합니다.
                    ③ 회사는 필요한 경우 이 약관을 변경할 수 있습니다. 회사는 약관이 변경되는 경우에 변경된 약관의 내용과 시행일을 정하여, 그 시행일로부터 7일전 홈페이지와 모바일 서비스에 게시합니다. 다만, 이용자에게 불리하게 약관내용을 변경하는 `}</div>
                </div>
                <div className="btn_box">
                    <button type="button" className="app_btn" onClick={closePopHandler}>동의</button>
                </div>
            </div>
        </div>
    );
};

export default TermsPop;