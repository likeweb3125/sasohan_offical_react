import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { enum_api_uri } from "../../../config/enum";
import * as CF from "../../../config/function";
import { appProfilePop, confirmPop } from "../../../store/popupSlice";
import { signupData } from "../../../store/userSlice";
import ConfirmPop from "../ConfirmPop";


const ProfilePop = () => {
    const dispatch = useDispatch();
    const user = useSelector((state)=>state.user);
    const popup = useSelector((state)=>state.popup);
    const m_address = enum_api_uri.m_address;
    const m_address2 = enum_api_uri.m_address2;
    const m_select_list = enum_api_uri.m_select_list;

    const [off, setOff] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [tit, setTit] = useState("");
    const [stepList, setStepList] = useState(["거주지","키","직업","외모 점수","내 관심사","MBTI","타입","흡연 여부","음주 여부","종교","선호하는 데이트","가입경로"]);
    const [step, setStep] = useState(null);
    

    const [addressList, setAddressList] = useState([]);
    const [addressList2, setAddressList2] = useState([]);
    const [addr2Check, setAddr2Check] = useState(null);
    const [heightList, setHeightList] = useState([{txt:"149cm 이하",val:"149"},{txt:"150cm ~ 154cm",val:"150"},{txt:"155cm ~ 159cm",val:"155"},{txt:"160cm ~ 164cm",val:"160"},{txt:"165cm ~ 169cm",val:"165"},{txt:"170cm ~ 174cm",val:"170"},{txt:"175cm ~ 179cm",val:"175"},{txt:"180cm ~ 184cm",val:"180"},{txt:"185cm ~ 189cm",val:"185"},{txt:"190cm ~ 194cm",val:"190"},{txt:"195cm ~ 200cm",val:"195"}]);
    const [selectList, setSelectList] = useState({});
    const [visualList, setVisualList] = useState(["1","2","3","4","5"]);
    const [mbtiList, setMbtiList] = useState(["ISTP","ISTJ","ISFP","ISFJ","INTP","INTJ","INFP","INFJ","ESTP","ESTJ","ESFP","ESFJ","ENTP","ENTJ","ENFP","ENFJ"]);

    const [address, setAddress] = useState("");
    const [height, setHeight] = useState("");
    const [job, setJob] = useState("");
    const [visual, setVisual] = useState("");
    const [like, setLike] = useState([]);
    const [mbti, setMbti] = useState("");
    const [type, setType] = useState([]);

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
                dispatch(appProfilePop({appProfilePop:false,appProfilePopTit:""}));
            },500);
        }
    },[off]);



    useEffect(()=>{
        //제목 설정
        setTit(popup.appProfilePopTit);

        //몇번째 step 인지 설정
        let idx = stepList.indexOf(popup.appProfilePopTit);
        setStep(idx);

        if(idx === 0){
            getAddress();
        }
    },[popup.appProfilePopTit]);

    
    //다음버튼 클릭시 다음스탭으로 넘어가기 or 마지막스탭일시 팝업닫기
    const nextStepHandler = () => {
        let idx = step + 1;
        if(idx > 11){
            closePopHandler();
        }else{
            setTit(stepList[idx]);
            setStep(idx);
        }

        if(step === 0){

        }
    };


    //주소 시,도 가져오기
    const getAddress = () => {
        axios.get(`${m_address}`)
        .then((res)=>{
            if(res.status === 200){
                setAddressList(res.data);
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
        })
    };


    //주소 시,도 셀렉트박스 선택시 구,군 가져오기
    const getAddress2 = (code) => {
        axios.get(`${m_address2.replace(':parent_local_code',code)}`)
        .then((res)=>{
            if(res.status === 200){
                setAddressList2(res.data);
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
        })
    };


    //select 리스트 가져오기 (직업,선호하는데이트,관심사,타입,가입경로,종교)
    const getSelectList = () => {
        axios.get(`${m_select_list}`)
        .then((res)=>{
            if(res.status === 200){
                setSelectList(res.data);
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
        })
    };


    //맨처음 select 리스트 가져오기
    useEffect(()=>{
        getSelectList();
    },[]);


    //내관심사 체크박스
    const likeCheck = (checked, value) => {
        if (checked) {
            if(like.length > 2){
                setConfirm(true);
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'최대 3개까지 선택가능합니다.',
                    confirmPopBtn:1,
                }));

                setLike(like.filter((el) => el !== value));
            }else{
                setLike([...like, value]);
            }
        } else if (!checked && like.includes(value)) {
            setLike(like.filter((el) => el !== value));
        }
    }

    useEffect(()=>{
        console.log(like);
    },[like]);





    return(<>
        <div className={`app_pop_wrap profile_pop${off ? " off" : ""}`}>
            <div className="dim" onClick={closePopHandler}></div>
            <div className="pop_cont">
                <div className="flex_center">
                    <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                </div>
                <div className="pop_tit">
                    <p className="tit">회원님의 <strong>{tit}</strong>를 선택해주세요.</p>
                    {step === 4 || step === 6 || step === 10 ? <p className="txt">아래 각 항목 중 3개씩 선택해주세요.</p> : null}
                </div>
                <div className="inner_box">

                    {/* 거주지 설정 */}
                    {step === 0 &&
                        <div className="address_box flex_top">
                            <div className="list_box scroll_wrap">
                                <ul>
                                    {addressList.map((cont,i)=>{
                                        return(
                                            <li key={i} className="custom_radio2">
                                                <label htmlFor={`addr_${cont.local_code}`}>
                                                    <input type={"radio"} id={`addr_${cont.local_code}`} name="addr_check" 
                                                        onChange={()=>{
                                                            getAddress2(cont.local_code);
                                                            setAddr2Check(null);
                                                        }} 
                                                    />
                                                    <span className="txt">{cont.sido_gugun}</span>
                                                </label>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            <div className="list_box scroll_wrap">
                                <ul>
                                    {addressList2.map((cont,i)=>{
                                        return(
                                            <li key={i} className="custom_radio3">
                                                <label htmlFor={`addr2_${cont.local_code}`}>
                                                    <input type={"radio"} id={`addr2_${cont.local_code}`} name="addr2_check" 
                                                        checked={cont.local_code === addr2Check} 
                                                        onChange={()=>{
                                                            setAddr2Check(cont.local_code);
                                                        }}
                                                    />
                                                    <span className="txt">{cont.sido_gugun}</span>
                                                </label>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    }

                    {/* 키 설정 */}
                    {step === 1 &&
                        <div className="scroll_wrap list_box">
                            <ul>
                                {heightList.map((cont,i)=>{
                                    return(
                                        <li key={i} className="custom_radio3">
                                            <label htmlFor={`height_${cont.val}`}>
                                                <input type={"radio"} id={`height_${cont.val}`} name="height_check" 
                                                    onChange={()=>{

                                                    }}
                                                />
                                                <span className="txt">{cont.txt}</span>
                                            </label>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    }

                    {/* 직업 설정 */}
                    {step === 2 &&
                        <div className="scroll_wrap list_box3">
                            <ul className="flex_wrap">
                                {selectList && selectList.job && selectList.job.map((cont,i)=>{
                                    return(
                                        <li key={i} className="custom_radio4">
                                            <label htmlFor={`job_${i}`}>
                                                <input type={"radio"} id={`job_${i}`} name="job_check" 
                                                    onChange={()=>{

                                                    }}
                                                />
                                                <span className="txt">{cont.name}</span>
                                            </label>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    }

                    {/* 외모점수 설정 */}
                    {step === 3 &&
                        <div className="scroll_wrap list_box5">
                            <div className="txt_line flex_between">
                                <p>별로다</p>
                                <p>보통이다</p>
                                <p>만족한다</p>
                            </div>
                            <ul className="flex_wrap">
                                {visualList.map((cont,i)=>{
                                    return(
                                        <li key={i} className="custom_radio4">
                                            <label htmlFor={`visual_${cont}`}>
                                                <input type={"radio"} id={`visual_${cont}`} name="visual_check" 
                                                    onChange={()=>{

                                                    }}
                                                />
                                                <span className="txt">{`${cont}점`}</span>
                                            </label>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    }

                    {/* 관심사 설정 */}
                    {step === 4 &&
                        <div className="scroll_wrap list_box3">
                            <ul className="flex_wrap">
                                {selectList && selectList.interest && selectList.interest.map((cont,i)=>{
                                    return(
                                        <li key={i} className="custom_radio4">
                                            <label htmlFor={`interest_${i}`}>
                                                <input type={"checkbox"} id={`interest_${i}`} 
                                                    onChange={(e)=>{
                                                        likeCheck(e.currentTarget.checked, cont.name);
                                                    }}
                                                    checked={like.includes(cont.name) ? true : false}
                                                />
                                                <span className="txt">{cont.name}</span>
                                            </label>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    }

                </div>
                <div className="btn_box">
                    <button type="button" className="app_btn" onClick={nextStepHandler}>{step < 11 ? "다음" : "확인"}</button>
                </div>
            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default ProfilePop;