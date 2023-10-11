import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { appSignupCompletePop } from "../../../store/popupSlice";
import signup_complete_img from "../../../images/app/signup_complete_img.svg"; 


const SignupCompletePop = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const [off, setOff] = useState(false);

    //팝업닫기--------------
    const closePopHandler = () => {
        setOff(true);

        //앱에 회원가입완료 보내기
        const data = {}
        window.flutterSignup.postMessage(JSON.stringify(data));
    };

    useEffect(()=>{
        if(off){
            setTimeout(()=>{
                dispatch(appSignupCompletePop({appSignupCompletePop:false,appSignupCompletePopUser:null}));
            },500);
        }
    },[off]);


    return(
        <div className={`app_pop_wrap app_signup_complete_pop${off ? " off" : ""}`}>
            <div className="dim" onClick={closePopHandler}></div>
            <div className="pop_cont">
                <div className="flex_center">
                    <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                </div>
                <div className="txt_box">
                    <h5><strong>{popup.appSignupCompletePopUser} 님,</strong> <br/>가입을 축하합니다!</h5>
                    <p>사소한에서 새로운 만남을 시작하세요.</p>
                </div>
                <div className="btn_box">
                    <div className="img_box">
                        <img src={signup_complete_img} alt="일러스트이미지" />
                    </div>
                    <button type="button" className="app_btn4" onClick={closePopHandler}>좋아요!</button>
                </div>
            </div>
        </div>
    );
};

export default SignupCompletePop;