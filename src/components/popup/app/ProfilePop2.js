import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { enum_api_uri } from "../../../config/enum";
import * as CF from "../../../config/function";
import { appProfilePop2, confirmPop } from "../../../store/popupSlice";
import { signupData, profileData, profileDataChange } from "../../../store/userSlice";
import ConfirmPop from "../ConfirmPop";


const ProfilePop2 = () => {
    const dispatch = useDispatch();
    const user = useSelector((state)=>state.user);
    const popup = useSelector((state)=>state.popup);

    const m_select_list = enum_api_uri.m_select_list;
    const [off, setOff] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [tit, setTit] = useState("");
    const [stepList, setStepList] = useState(["키","직업","외모 점수","MBTI","타입","흡연 여부","음주 여부","종교"]);
    const [step, setStep] = useState(null);
    

    const [heightList, setHeightList] = useState([{txt:"149cm 이하",val:["0","149"]},{txt:"150cm ~ 154cm",val:["150","154"]},{txt:"155cm ~ 159cm",val:["155","159"]},{txt:"160cm ~ 164cm",val:["160","164"]},{txt:"165cm ~ 169cm",val:["165","169"]},{txt:"170cm ~ 174cm",val:["170","174"]},{txt:"175cm ~ 179cm",val:["175","179"]},{txt:"180cm ~ 184cm",val:["180","184"]},{txt:"185cm ~ 189cm",val:["185","189"]},{txt:"190cm ~ 194cm",val:["190","194"]},{txt:"195cm ~ 200cm",val:["195","200"]}]);
    const [selectList, setSelectList] = useState({});
    const [visualList, setVisualList] = useState(["1","2","3","4","5"]);
    const [mbtiList, setMbtiList] = useState(["ISTP","ISTJ","ISFP","ISFJ","INTP","INTJ","INFP","INFJ","ESTP","ESTJ","ESFP","ESFJ","ENTP","ENTJ","ENFP","ENFJ"]);
    const [smokList, setSmokList] = useState([{txt:"한다",val:"1"},{txt:"가끔 한다",val:"3"},{txt:"안 한다",val:"2"}]);
    const [drinkList, setDrinkList] = useState([{txt:"한다",val:"1"},{txt:"가끔 한다",val:"2"},{txt:"안 한다",val:"3"}]);

    const [height, setHeight] = useState("");
    const [job, setJob] = useState("");
    const [visual, setVisual] = useState("");
    const [mbti, setMbti] = useState("");
    const [type, setType] = useState([]);
    const [smok, setSmok] = useState("");
    const [drink, setDrink] = useState("");
    const [religion, setReligion] = useState("");


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
                dispatch(appProfilePop2({appProfilePop2:false,appProfilePopTit2:""}));
            },500);
        }
    },[off]);



    useEffect(()=>{
        //제목 설정
        setTit(popup.appProfilePopTit2);

        //몇번째 step 인지 설정
        let idx = stepList.indexOf(popup.appProfilePopTit2);
        setStep(idx);

    },[popup.appProfilePopTit2]);



    //맨처음
    useEffect(()=>{
        //select 리스트 가져오기
        getSelectList();

        //프로필수정일때
        if(popup.appProfilePopEdit2){
            //선택한 값들 있는지 체크-------------------------------
            if(user.profileData.hasOwnProperty("t_height2")){
                setHeight(user.profileData.t_height2);
            }

            if(user.profileData.hasOwnProperty("t_job")){
                setJob(user.profileData.t_job);
            }

            if(user.profileData.hasOwnProperty("t_visual")){
                setVisual(user.profileData.t_visual);
            }

            if(user.profileData.hasOwnProperty("t_mbti")){
                setMbti(user.profileData.t_mbti);
            }

            if(user.profileData.hasOwnProperty("t_character")){
                setType(user.profileData.t_character);
            }

            if(user.profileData.hasOwnProperty("t_smok")){
                setSmok(user.profileData.t_smok);
            }

            if(user.profileData.hasOwnProperty("t_drink")){
                setDrink(user.profileData.t_drink);
            }

            if(user.profileData.hasOwnProperty("t_religion")){
                setReligion(user.profileData.t_religion);
            }
        }
        //회원가입일때
        else{
            //선택한 값들 있는지 체크-------------------------------
            if(user.signupData.hasOwnProperty("t_height2")){
                setHeight(user.signupData.t_height2);
            }

            if(user.signupData.hasOwnProperty("t_job")){
                setJob(user.signupData.t_job);
            }

            if(user.signupData.hasOwnProperty("t_visual")){
                setVisual(user.signupData.t_visual);
            }

            if(user.signupData.hasOwnProperty("t_mbti")){
                setMbti(user.signupData.t_mbti);
            }

            if(user.signupData.hasOwnProperty("t_character")){
                setType(user.signupData.t_character);
            }

            if(user.signupData.hasOwnProperty("t_smok")){
                setSmok(user.signupData.t_smok);
            }

            if(user.signupData.hasOwnProperty("t_drink")){
                setDrink(user.signupData.t_drink);
            }

            if(user.signupData.hasOwnProperty("t_religion")){
                setReligion(user.signupData.t_religion);
            }
        }

    },[]);


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


    //타입 체크박스
    const typeCheck = (checked, value) => {
        if (checked) {
            if(type.length > 2){
                setConfirm(true);
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'최대 3개까지 선택가능합니다.',
                    confirmPopBtn:1,
                }));

                setType(type.filter((el) => el !== value));
            }else{
                setType([...type, value]);
            }
        } else if (!checked && type.includes(value)) {
            setType(type.filter((el) => el !== value));
        }
    }

    useEffect(()=>{
        selectHandler("t_character",type);
    },[type]);


    //선택시
    const selectHandler = (name,val,height1) => {
        //프로필수정일때 profileData store 값에 저장
        if(popup.appProfilePopEdit2){
            let newData = {...user.profileData};
            newData[name] = val;

            //상대방 키 선택시 t_height2 저장
            if(name == "t_height2"){
                newData.t_height1 = height1;
            }

            dispatch(profileData(newData));

            //프로필정보 변경 true
            dispatch(profileDataChange(true));
        }
        //회원가입일때 signupData store 값에 저장
        else{
            let newData = {...user.signupData};
            newData[name] = val;

            //상대방 키 선택시 t_height2 저장
            if(name == "t_height2"){
                newData.t_height1 = height1;
            }

            dispatch(signupData(newData));
        }
    };


    //다음버튼 클릭시 다음스탭으로 넘어가기 or 마지막스탭일시 팝업닫기
    const nextStepHandler = () => {
        let data;
        //프로필수정일때
        if(popup.appProfilePopEdit2){
            data = user.profileData;
        }
        //회원가입일때
        else{
            data = user.signupData;
        }

        let idx = step + 1;

        if(step === 0){
            if(data.hasOwnProperty("t_height1") && data.t_height1.length > 0){
                //프로필수정일때 팝업닫기
                if(popup.appProfilePopEdit2){
                    closePopHandler();
                }
                //회원가입일때 다음스탭으로 넘어가기
                else{
                    setTit(stepList[idx]);
                    setStep(idx);
                }
            }else{
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'키를 선택해주세요.',
                    confirmPopBtn:1,
                }));
                setConfirm(true);
            }
        }
        if(step === 1){
            if(data.hasOwnProperty("t_job") && data.t_job.length > 0){
                //프로필수정일때 팝업닫기
                if(popup.appProfilePopEdit2){
                    closePopHandler();
                }
                //회원가입일때 다음스탭으로 넘어가기
                else{
                    setTit(stepList[idx]);
                    setStep(idx);
                }
            }else{
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'직업을 선택해주세요.',
                    confirmPopBtn:1,
                }));
                setConfirm(true);
            }
        }
        if(step === 2){
            if(data.hasOwnProperty("t_visual") && data.t_visual.length > 0){
                //프로필수정일때 팝업닫기
                if(popup.appProfilePopEdit2){
                    closePopHandler();
                }
                //회원가입일때 다음스탭으로 넘어가기
                else{
                    setTit(stepList[idx]);
                    setStep(idx);
                }
            }else{
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'외모 점수를 선택해주세요.',
                    confirmPopBtn:1,
                }));
                setConfirm(true);
            }
        }
        if(step === 3){
            if(data.hasOwnProperty("t_mbti") && data.t_mbti.length > 0){
                //프로필수정일때 팝업닫기
                if(popup.appProfilePopEdit2){
                    closePopHandler();
                }
                //회원가입일때 다음스탭으로 넘어가기
                else{
                    setTit(stepList[idx]);
                    setStep(idx);
                }
            }else{
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'MBTI를 선택해주세요.',
                    confirmPopBtn:1,
                }));
                setConfirm(true);
            }
        }
        if(step === 4){
            if(type.length > 0){
                //프로필수정일때 팝업닫기
                if(popup.appProfilePopEdit2){
                    closePopHandler();
                }
                //회원가입일때 다음스탭으로 넘어가기
                else{
                    setTit(stepList[idx]);
                    setStep(idx);
                }
            }else{
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'타입을 선택해주세요.',
                    confirmPopBtn:1,
                }));
                setConfirm(true);
            }
        }
        if(step === 5){
            if(data.hasOwnProperty("t_smok") && data.t_smok.length > 0){
                //프로필수정일때 팝업닫기
                if(popup.appProfilePopEdit2){
                    closePopHandler();
                }
                //회원가입일때 다음스탭으로 넘어가기
                else{
                    setTit(stepList[idx]);
                    setStep(idx);
                }
            }else{
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'흡연여부를 선택해주세요.',
                    confirmPopBtn:1,
                }));
                setConfirm(true);
            }
        }
        if(step === 6){
            if(data.hasOwnProperty("t_drink") && data.t_drink.length > 0){
                //프로필수정일때 팝업닫기
                if(popup.appProfilePopEdit2){
                    closePopHandler();
                }
                //회원가입일때 다음스탭으로 넘어가기
                else{
                    setTit(stepList[idx]);
                    setStep(idx);
                }
            }else{
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'음주여부를 선택해주세요.',
                    confirmPopBtn:1,
                }));
                setConfirm(true);
            }
        }
        if(step === 7){
            if(data.hasOwnProperty("t_religion") && data.t_religion.length > 0){
                //프로필수정일때 팝업닫기
                if(popup.appProfilePopEdit2){
                    closePopHandler();
                }
                //회원가입일때 다음스탭으로 넘어가기
                else{
                    setTit(stepList[idx]);
                    setStep(idx);
                }
            }else{
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'종교를 선택해주세요.',
                    confirmPopBtn:1,
                }));
                setConfirm(true);
            }
        }
        if(idx > 7){
            closePopHandler();
        }
    };


    return(<>
        <div className={`app_pop_wrap app_profile_pop${off ? " off" : ""}`}>
            <div className="dim" onClick={closePopHandler}></div>
            <div className="pop_cont">
                <div className="flex_center">
                    <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                </div>
                <div className="pop_tit">
                    <p className="tit">상대방의 <strong>{tit}</strong>{step === 1 || step === 4 ? "을" : "를"} 선택해주세요.</p>
                    {step === 4 || step === 6 || step === 10 ? <p className="txt">아래 각 항목 중 3개씩 선택해주세요.</p> : null}
                </div>
                <div className="inner_box">

                    {/* 키 설정 */}
                    {step === 0 &&
                        <div className="scroll_wrap sel_list_box">
                            <ul>
                                {heightList.map((cont,i)=>{
                                    return(
                                        <li key={i} className="custom_radio3">
                                            <label htmlFor={`height_${cont.val[1]}`}>
                                                <input type={"radio"} id={`height_${cont.val[1]}`} name="height_check"
                                                    checked={cont.val[1] === height} 
                                                    onChange={()=>{
                                                        setHeight(cont.val[1]);
                                                        selectHandler("t_height2",cont.val[1],cont.val[0]);
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
                    {step === 1 &&
                        <div className="scroll_wrap sel_list_box3">
                            <ul className="flex_wrap">
                                {selectList && selectList.job && selectList.job.map((cont,i)=>{
                                    return(
                                        <li key={i} className="custom_radio4">
                                            <label htmlFor={`job_${i}`}>
                                                <input type={"radio"} id={`job_${i}`} name="job_check" 
                                                    checked={cont.name === job}
                                                    onChange={()=>{
                                                        setJob(cont.name);
                                                        selectHandler("t_job",cont.name);
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
                    {step === 2 &&
                        <div className="scroll_wrap sel_list_box5">
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
                                                    checked={cont === visual}
                                                    onChange={()=>{
                                                        setVisual(cont);
                                                        selectHandler("t_visual",cont);
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

                    {/* MBTI 설정 */}
                    {step === 3 &&
                        <div className="scroll_wrap sel_list_box3">
                            <ul className="flex_wrap">
                                {mbtiList.map((cont,i)=>{
                                    return(
                                        <li key={i} className="custom_radio4">
                                            <label htmlFor={`mbti_${cont}`}>
                                                <input type={"radio"} id={`mbti_${cont}`} name="mbti_check" 
                                                    checked={cont === mbti}
                                                    onChange={()=>{
                                                        setMbti(cont);
                                                        selectHandler("t_mbti",cont);
                                                    }}
                                                />
                                                <span className="txt">{cont}</span>
                                            </label>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    }

                    {/* 타입 설정 */}
                    {step === 4 &&
                        <div className="scroll_wrap sel_list_box3">
                            <ul className="flex_wrap">
                                {selectList && selectList.character && selectList.character.map((cont,i)=>{
                                    return(
                                        <li key={i} className="custom_radio4">
                                            <label htmlFor={`character_${i}`}>
                                                <input type={"checkbox"} id={`character_${i}`} 
                                                    checked={type.includes(cont.name) ? true : false}
                                                    onChange={(e)=>{
                                                        typeCheck(e.currentTarget.checked, cont.name);
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

                    {/* 흡연여부 설정 */}
                    {step === 5 &&
                        <div className="scroll_wrap sel_list_box3">
                            <ul className="flex_wrap">
                                {smokList.map((cont,i)=>{
                                    return(
                                        <li key={i} className="custom_radio4">
                                            <label htmlFor={`smok_${cont.val}`}>
                                                <input type={"radio"} id={`smok_${cont.val}`} name="smok_check" 
                                                    checked={cont.val === smok}
                                                    onChange={()=>{
                                                        setSmok(cont.val);
                                                        selectHandler("t_smok",cont.val);
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

                    {/* 음주여부 설정 */}
                    {step === 6 &&
                        <div className="scroll_wrap sel_list_box3">
                            <ul className="flex_wrap">
                                {drinkList.map((cont,i)=>{
                                    return(
                                        <li key={i} className="custom_radio4">
                                            <label htmlFor={`drink_${cont.val}`}>
                                                <input type={"radio"} id={`drink_${cont.val}`} name="drink_check" 
                                                    checked={cont.val === drink}
                                                    onChange={()=>{
                                                        setDrink(cont.val);
                                                        selectHandler("t_drink",cont.val);
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

                    {/* 종교 설정 */}
                    {step === 7 &&
                        <div className="scroll_wrap sel_list_box3">
                            <ul className="flex_wrap">
                                {selectList && selectList.religion && selectList.religion.map((cont,i)=>{
                                    return(
                                        <li key={i} className="custom_radio4">
                                            <label htmlFor={`religion_${i}`}>
                                                <input type={"radio"} id={`religion_${i}`} name="religion_check" 
                                                    checked={cont.name === religion}
                                                    onChange={()=>{
                                                        setReligion(cont.name);
                                                        selectHandler("t_religion",cont.name);
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

                </div>
                <div className="btn_box">
                    <button type="button" className="app_btn" onClick={nextStepHandler}>
                        {!popup.appProfilePopEdit2 ? step < 7 ? "다음" : "확인"
                            : popup.appProfilePopEdit2 && "닫기"
                        }
                    </button>
                </div>
            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default ProfilePop2;