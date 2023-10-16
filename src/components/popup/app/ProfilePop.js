import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { enum_api_uri } from "../../../config/enum";
import * as CF from "../../../config/function";
import { appProfilePop, confirmPop } from "../../../store/popupSlice";
import { signupData, profileData } from "../../../store/userSlice";
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
    const [heightList, setHeightList] = useState([{txt:"149cm 이하",val:"149"},{txt:"150cm ~ 154cm",val:"150"},{txt:"155cm ~ 159cm",val:"155"},{txt:"160cm ~ 164cm",val:"160"},{txt:"165cm ~ 169cm",val:"165"},{txt:"170cm ~ 174cm",val:"170"},{txt:"175cm ~ 179cm",val:"175"},{txt:"180cm ~ 184cm",val:"180"},{txt:"185cm ~ 189cm",val:"185"},{txt:"190cm ~ 194cm",val:"190"},{txt:"195cm ~ 200cm",val:"195"}]);
    const [selectList, setSelectList] = useState({});
    const [visualList, setVisualList] = useState(["1","2","3","4","5"]);
    const [mbtiList, setMbtiList] = useState(["ISTP","ISTJ","ISFP","ISFJ","INTP","INTJ","INFP","INFJ","ESTP","ESTJ","ESFP","ESFJ","ENTP","ENTJ","ENFP","ENFJ"]);
    const [smokList, setSmokList] = useState([{txt:"한다",val:"1"},{txt:"가끔 한다",val:"3"},{txt:"안 한다",val:"2"}]);
    const [drinkList, setDrinkList] = useState([{txt:"한다",val:"1"},{txt:"가끔 한다",val:"2"},{txt:"안 한다",val:"3"}]);

    const [address, setAddress] = useState("");
    const [address2, setAddress2] = useState("");
    const [height, setHeight] = useState("");
    const [job, setJob] = useState("");
    const [visual, setVisual] = useState("");
    const [like, setLike] = useState([]);
    const [mbti, setMbti] = useState("");
    const [type, setType] = useState([]);
    const [smok, setSmok] = useState("");
    const [drink, setDrink] = useState("");
    const [religion, setReligion] = useState("");
    const [date, setDate] = useState([]);
    const [route, setRoute] = useState("");


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


    //주소 시,도 가져오기
    const getAddress = () => {
        axios.get(`${m_address}`)
        .then((res)=>{
            if(res.status === 200){
                setAddressList(res.data);
                
                //선택한 거주지정보없으면 리스트 맨첫번째 checked
                if(popup.appProfilePopEdit){ //프로필수정일때
                    if(!user.profileData.hasOwnProperty("m_address_code")){
                        let sido = res.data[0].sido_gugun;
                        setAddress(sido);
                    }
                }else{ //회원가입일때
                    if(!user.signupData.hasOwnProperty("m_address_code")){
                        let sido = res.data[0].sido_gugun;
                        setAddress(sido);
                    }
                }
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


    //맨처음
    useEffect(()=>{
        //select 리스트 가져오기
        getSelectList();
        
        //프로필수정일때
        if(popup.appProfilePopEdit){
            //선택한 거주지 시,도 값있는지 체크
            if(user.profileData.hasOwnProperty("m_address_code")){
                getAddress2(user.profileData.m_address_code);
            }else{
                getAddress2("01");
            }

            //선택한 값들 있는지 체크-------------------------------
            if(user.profileData.hasOwnProperty("m_address")){
                setAddress(user.profileData.m_address);
            }

            if(user.profileData.hasOwnProperty("m_address2")){
                setAddress2(user.profileData.m_address2);
            }

            if(user.profileData.hasOwnProperty("m_height")){
                setHeight(user.profileData.m_height);
            }

            if(user.profileData.hasOwnProperty("m_job")){
                setJob(user.profileData.m_job);
            }

            if(user.profileData.hasOwnProperty("m_visual")){
                setVisual(user.profileData.m_visual);
            }

            if(user.profileData.hasOwnProperty("m_like")){
                setLike(user.profileData.m_like);
            }

            if(user.profileData.hasOwnProperty("m_mbti")){
                setMbti(user.profileData.m_mbti);
            }

            if(user.profileData.hasOwnProperty("m_character")){
                setType(user.profileData.m_character);
            }

            if(user.profileData.hasOwnProperty("m_smok")){
                setSmok(user.profileData.m_smok);
            }

            if(user.profileData.hasOwnProperty("m_drink")){
                setDrink(user.profileData.m_drink);
            }

            if(user.profileData.hasOwnProperty("m_religion")){
                setReligion(user.profileData.m_religion);
            }

            if(user.profileData.hasOwnProperty("m_date")){
                setDate(user.profileData.m_date);
            }

            if(user.profileData.hasOwnProperty("m_motive")){
                setRoute(user.profileData.m_motive);
            }
        }
        //회원가입일때
        else{
            //선택한 거주지 시,도 값있는지 체크
            if(user.signupData.hasOwnProperty("m_address_code")){
                getAddress2(user.signupData.m_address_code);
                
            }else{
                getAddress2("01");
            }

            //선택한 값들 있는지 체크-------------------------------
            if(user.signupData.hasOwnProperty("m_address")){
                setAddress(user.signupData.m_address);
            }

            if(user.signupData.hasOwnProperty("m_address2")){
                setAddress2(user.signupData.m_address2);
            }

            if(user.signupData.hasOwnProperty("m_height")){
                setHeight(user.signupData.m_height);
            }

            if(user.signupData.hasOwnProperty("m_job")){
                setJob(user.signupData.m_job);
            }

            if(user.signupData.hasOwnProperty("m_visual")){
                setVisual(user.signupData.m_visual);
            }

            if(user.signupData.hasOwnProperty("m_like")){
                setLike(user.signupData.m_like);
            }

            if(user.signupData.hasOwnProperty("m_mbti")){
                setMbti(user.signupData.m_mbti);
            }

            if(user.signupData.hasOwnProperty("m_character")){
                setType(user.signupData.m_character);
            }

            if(user.signupData.hasOwnProperty("m_smok")){
                setSmok(user.signupData.m_smok);
            }

            if(user.signupData.hasOwnProperty("m_drink")){
                setDrink(user.signupData.m_drink);
            }

            if(user.signupData.hasOwnProperty("m_religion")){
                setReligion(user.signupData.m_religion);
            }

            if(user.signupData.hasOwnProperty("m_date")){
                setDate(user.signupData.m_date);
            }

            if(user.signupData.hasOwnProperty("m_motive")){
                setRoute(user.signupData.m_motive);
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
        selectHandler("m_like",like);
    },[like]);


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
        selectHandler("m_character",type);
    },[type]);


    //선호하는데이트 체크박스
    const dateCheck = (checked, value) => {
        if (checked) {
            if(date.length > 2){
                setConfirm(true);
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'최대 3개까지 선택가능합니다.',
                    confirmPopBtn:1,
                }));

                setDate(date.filter((el) => el !== value));
            }else{
                setDate([...date, value]);
            }
        } else if (!checked && date.includes(value)) {
            setDate(date.filter((el) => el !== value));
        }
    }

    useEffect(()=>{
        selectHandler("m_date",date);
    },[date]);


    //선택시 signupData store 값에 저장
    const selectHandler = (name,val,addrCode) => {
        //프로필수정일때
        if(popup.appProfilePopEdit){
            let newData = {...user.profileData};
            newData[name] = val;
    
            //거주지 주소선택시 시,도 코드저장 && 주소 구군 값 지우기
            if(addrCode){
                newData.m_address_code = addrCode;
                newData.m_address2 = "";
            }
    
            //m_address 없을때 m_address2 선택시 거주지 시도 리스트 맨처음값 m_address에 넣기
            if(name == "m_address2"){
                if(!user.profileData.hasOwnProperty("m_address")){
                    newData.m_address = addressList[0].sido_gugun;
                }
            }
    
            dispatch(profileData(newData));
        }
        //회원가입일때
        else{
            let newData = {...user.signupData};
            newData[name] = val;

            //거주지 주소선택시 시,도 코드저장 && 주소 구군 값 지우기
            if(addrCode){
                newData.m_address_code = addrCode;
                newData.m_address2 = "";
            }

            //m_address 없을때 m_address2 선택시 거주지 시도 리스트 맨처음값 m_address에 넣기
            if(name == "m_address2"){
                if(!user.signupData.hasOwnProperty("m_address")){
                    newData.m_address = addressList[0].sido_gugun;
                }
            }

            dispatch(signupData(newData));
        }
    };


    //다음버튼 클릭시 다음스탭으로 넘어가기 or 마지막스탭일시 팝업닫기
    const nextStepHandler = () => {
        let data;
        //프로필수정일때
        if(popup.appProfilePopEdit){
            data = user.profileData;
        }
        //회원가입일때
        else{
            data = user.signupData;
        }

        let idx = step + 1;

        if(step === 0){
            if(data.hasOwnProperty("m_address") && data.m_address.length > 0){
                //프로필수정일때 팝업닫기
                if(popup.appProfilePopEdit){
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
                    confirmPopTxt:'거주지를 선택해주세요.',
                    confirmPopBtn:1,
                }));
                setConfirm(true);
            }
        }
        if(step === 1){
            if(data.hasOwnProperty("m_height") && data.m_height.length > 0){
                //프로필수정일때
                if(popup.appProfilePopEdit){
                    closePopHandler();
                }
                //회원가입일때
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
        if(step === 2){
            if(data.hasOwnProperty("m_job") && data.m_job.length > 0){
                //프로필수정일때
                if(popup.appProfilePopEdit){
                    closePopHandler();
                }
                //회원가입일때
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
        if(step === 3){
            if(data.hasOwnProperty("m_visual") && data.m_visual.length > 0){
                //프로필수정일때
                if(popup.appProfilePopEdit){
                    closePopHandler();
                }
                //회원가입일때
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
        if(step === 4){
            if(like.length > 0){
                //프로필수정일때
                if(popup.appProfilePopEdit){
                    closePopHandler();
                }
                //회원가입일때
                else{
                    setTit(stepList[idx]);
                    setStep(idx);
                }
            }else{
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'관심사를 선택해주세요.',
                    confirmPopBtn:1,
                }));
                setConfirm(true);
            }
        }
        if(step === 5){
            if(data.hasOwnProperty("m_mbti") && data.m_mbti.length > 0){
                //프로필수정일때
                if(popup.appProfilePopEdit){
                    closePopHandler();
                }
                //회원가입일때
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
        if(step === 6){
            if(type.length > 0){
                //프로필수정일때
                if(popup.appProfilePopEdit){
                    closePopHandler();
                }
                //회원가입일때
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
        if(step === 7){
            if(data.hasOwnProperty("m_smok") && data.m_smok.length > 0){
                //프로필수정일때
                if(popup.appProfilePopEdit){
                    closePopHandler();
                }
                //회원가입일때
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
        if(step === 8){
            if(data.hasOwnProperty("m_drink") && data.m_drink.length > 0){
                //프로필수정일때
                if(popup.appProfilePopEdit){
                    closePopHandler();
                }
                //회원가입일때
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
        if(step === 9){
            if(data.hasOwnProperty("m_religion") && data.m_religion.length > 0){
                //프로필수정일때
                if(popup.appProfilePopEdit){
                    closePopHandler();
                }
                //회원가입일때
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
        if(step === 10){
            if(data.hasOwnProperty("m_date") && data.m_date.length > 0){
                //프로필수정일때
                if(popup.appProfilePopEdit){
                    closePopHandler();
                }
                //회원가입일때
                else{
                    setTit(stepList[idx]);
                    setStep(idx);
                }
            }else{
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'선호하는 데이트를 선택해주세요.',
                    confirmPopBtn:1,
                }));
                setConfirm(true);
            }
        }
        if(step === 11){
            if(data.hasOwnProperty("m_motive") && data.m_motive.length > 0){
                //프로필수정일때
                if(popup.appProfilePopEdit){
                    closePopHandler();
                }
                //회원가입일때
                else{
                    setTit(stepList[idx]);
                    setStep(idx);
                }
            }else{
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'가입경로를 선택해주세요.',
                    confirmPopBtn:1,
                }));
                setConfirm(true);
            }
        }
        if(idx > 11){
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
                    <p className="tit">회원님의 <strong>{tit}</strong>{step === 2 || step === 6 ? "을" : "를"} 선택해주세요.</p>
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
                                                        checked={cont.sido_gugun === address} 
                                                        onChange={()=>{
                                                            setAddress(cont.sido_gugun);
                                                            setAddress2("");
                                                            getAddress2(cont.local_code);
                                                            selectHandler("m_address",cont.sido_gugun,cont.local_code);
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
                                                        checked={cont.sido_gugun === address2} 
                                                        onChange={()=>{
                                                            setAddress2(cont.sido_gugun);
                                                            selectHandler("m_address2",cont.sido_gugun);
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
                                                    checked={cont.val === height} 
                                                    onChange={()=>{
                                                        setHeight(cont.val);
                                                        selectHandler("m_height",cont.val);
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
                                                    checked={cont.name === job}
                                                    onChange={()=>{
                                                        setJob(cont.name);
                                                        selectHandler("m_job",cont.name);
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
                                                    checked={cont === visual}
                                                    onChange={()=>{
                                                        setVisual(cont);
                                                        selectHandler("m_visual",cont);
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
                                                    checked={like.includes(cont.name) ? true : false}
                                                    onChange={(e)=>{
                                                        likeCheck(e.currentTarget.checked, cont.name);
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

                    {/* MBTI 설정 */}
                    {step === 5 &&
                        <div className="scroll_wrap list_box3">
                            <ul className="flex_wrap">
                                {mbtiList.map((cont,i)=>{
                                    return(
                                        <li key={i} className="custom_radio4">
                                            <label htmlFor={`mbti_${cont}`}>
                                                <input type={"radio"} id={`mbti_${cont}`} name="mbti_check" 
                                                    checked={cont === mbti}
                                                    onChange={()=>{
                                                        setMbti(cont);
                                                        selectHandler("m_mbti",cont);
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
                    {step === 6 &&
                        <div className="scroll_wrap list_box3">
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
                    {step === 7 &&
                        <div className="scroll_wrap list_box3">
                            <ul className="flex_wrap">
                                {smokList.map((cont,i)=>{
                                    return(
                                        <li key={i} className="custom_radio4">
                                            <label htmlFor={`smok_${cont.val}`}>
                                                <input type={"radio"} id={`smok_${cont.val}`} name="smok_check" 
                                                    checked={cont.val === smok}
                                                    onChange={()=>{
                                                        setSmok(cont.val);
                                                        selectHandler("m_smok",cont.val);
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
                    {step === 8 &&
                        <div className="scroll_wrap list_box3">
                            <ul className="flex_wrap">
                                {drinkList.map((cont,i)=>{
                                    return(
                                        <li key={i} className="custom_radio4">
                                            <label htmlFor={`drink_${cont.val}`}>
                                                <input type={"radio"} id={`drink_${cont.val}`} name="drink_check" 
                                                    checked={cont.val === drink}
                                                    onChange={()=>{
                                                        setDrink(cont.val);
                                                        selectHandler("m_drink",cont.val);
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
                    {step === 9 &&
                        <div className="scroll_wrap list_box3">
                            <ul className="flex_wrap">
                                {selectList && selectList.religion && selectList.religion.map((cont,i)=>{
                                    return(
                                        <li key={i} className="custom_radio4">
                                            <label htmlFor={`religion_${i}`}>
                                                <input type={"radio"} id={`religion_${i}`} name="religion_check" 
                                                    checked={cont.name === religion}
                                                    onChange={()=>{
                                                        setReligion(cont.name);
                                                        selectHandler("m_religion",cont.name);
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

                    {/* 선호하는데이트 설정 */}
                    {step === 10 &&
                        <div className="scroll_wrap list_box3">
                            <ul className="flex_wrap">
                                {selectList && selectList.i_date && selectList.i_date.map((cont,i)=>{
                                    return(
                                        <li key={i} className="custom_radio4">
                                            <label htmlFor={`date_${i}`}>
                                                <input type={"checkbox"} id={`date_${i}`} 
                                                    checked={date.includes(cont.name) ? true : false}
                                                    onChange={(e)=>{
                                                        dateCheck(e.currentTarget.checked, cont.name);
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

                    {/* 가입경로 설정 */}
                    {step === 11 &&
                        <div className="scroll_wrap list_box3">
                            <ul className="flex_wrap">
                                {selectList && selectList.ref_rul && selectList.ref_rul.map((cont,i)=>{
                                    return(
                                        <li key={i} className="custom_radio4">
                                            <label htmlFor={`ref_${i}`}>
                                                <input type={"radio"} id={`ref_${i}`} name="ref_check" 
                                                    checked={cont.name === route}
                                                    onChange={()=>{
                                                        setRoute(cont.name);
                                                        selectHandler("m_motive",cont.name);
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
                        {!popup.appProfilePopEdit ? step < 11 ? "다음" : "확인"
                            : popup.appProfilePopEdit && "닫기"
                        }
                    </button>
                </div>
            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default ProfilePop;