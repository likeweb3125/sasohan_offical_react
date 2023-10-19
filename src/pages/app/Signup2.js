import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { enum_api_uri } from "../../config/enum";
import * as CF from "../../config/function";
import { appTermsPop, confirmPop, appProfilePop, appProfileImgPop, appProfilePop2, appSignupCompletePop } from "../../store/popupSlice";
import { profileImgs } from "../../store/commonSlice";
import { signupData } from "../../store/userSlice";
import ConfirmPop from "../../components/popup/ConfirmPop";
import profile_img from "../../images/app/profile_img.jpg";


const SignUp2 = () => {
    const dispatch = useDispatch();
    const user = useSelector((state)=>state.user);
    const popup = useSelector((state)=>state.popup);
    const common = useSelector((state)=>state.common);
    const navigate = useNavigate();
    const api_uri = enum_api_uri.api_uri;
    const m_realname = enum_api_uri.m_realname;
    const m_id_check = enum_api_uri.m_id_check;
    const m_nick_check = enum_api_uri.m_nick_check;
    const m_join = enum_api_uri.m_join;
    const tradeid = sessionStorage.getItem("tradeid");
    // const app_token = localStorage.getItem("app_token");
    const [confirm, setConfirm] = useState(false);
    const [agreeList, setAgreeList] = useState(["개인정보 보호정책","이메일 무단 수집 거부","개인정보수집","이용약관"]);
    const [step, setStep] = useState(1);
    const contRef = useRef();
    const [realData ,setRealData] = useState({});
    const [allData, setAllData] = useState({});
    const [address, setAddress] = useState("");
    const [address2, setAddress2] = useState("");
    const [height, setHeight] = useState("");
    const [height2, setHeight2] = useState(""); //상대방 키
    const [imgList, setImgList] = useState([1,2,3,4,5,6,7,8]);
    const [imgNameList, setImgNameList] = useState(["","","","","","","",""]);
    const [valId, setValId] = useState("");
    const [valPassword, setValPassword] = useState("");
    const [valPassword2, setValPassword2] = useState("");
    const [valNickname, setValNickname] = useState("");
    const [valEmail, setValEmail] = useState("");
    const [usableId, setUsableId] = useState(false);
    const [usablePass, setUsablePass] = useState(false);
    const [usableNickname, setUsableNickname] = useState(false);
    const [usableEmail, setUsableEmail] = useState(false);
    const [usableProfile, setUsableProfile] = useState(false);
    const [usableProfile2, setUsableProfile2] = useState(false);
    const [usableProfileImg, setUsableProfileImg] = useState(false);
    const [errorId, setErrorId] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorPassword2, setErrorPassword2] = useState(false);
    const [passView, setPassView] = useState(false);
    const [pass2View, setPass2View] = useState(false);
    const [errorNickname, setErrorNickname] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorAddress, setErrorAddress] = useState(false);
    const [errorHeight, setErrorHeight] = useState(false);
    const [errorHeight2, setErrorHeight2] = useState(false);
    const [errorJob, setErrorJob] = useState(false);
    const [errorJob2, setErrorJob2] = useState(false);
    const [errorVisual, setErrorVisual] = useState(false);
    const [errorVisual2, setErrorVisual2] = useState(false);
    const [errorLike, setErrorLike] = useState(false);
    const [errorMbti, setErrorMbti] = useState(false);
    const [errorMbti2, setErrorMbti2] = useState(false);
    const [errorType, setErrorType] = useState(false);
    const [errorType2, setErrorType2] = useState(false);
    const [errorSmok, setErrorSmok] = useState(false);
    const [errorSmok2, setErrorSmok2] = useState(false);
    const [errorDrink, setErrorDrink] = useState(false);
    const [errorDrink2, setErrorDrink2] = useState(false);
    const [errorReligion, setErrorReligion] = useState(false);
    const [errorReligion2, setErrorReligion2] = useState(false);
    const [errorDate, setErrorDate] = useState(false);
    const [errorRoute, setErrorRoute] = useState(false);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);


    useEffect(()=>{
        setAllData(user.signupData);

        console.log(user.signupData);

        //나의 거주지
        if(user.signupData.hasOwnProperty("m_address")){
            setAddress(user.signupData.m_address);
            setAddress2(user.signupData.m_address2);
        }else{
            setAddress("");
            setAddress2("");
        }

        //나의 키
        if(user.signupData.hasOwnProperty("m_height")){
            let h = user.signupData.m_height;
            if(h == "149"){
                setHeight("149cm 이하");
            }
            if(h == "150"){
                setHeight("150cm ~ 154cm");
            }
            if(h == "155"){
                setHeight("155cm ~ 159cm");
            }
            if(h == "160"){
                setHeight("160cm ~ 164cm");
            }
            if(h == "165"){
                setHeight("165cm ~ 169cm");
            }
            if(h == "170"){
                setHeight("170cm ~ 174cm");
            }
            if(h == "175"){
                setHeight("175cm ~ 179cm");
            }
            if(h == "180"){
                setHeight("180cm ~ 184cm");
            }
            if(h == "185"){
                setHeight("185cm ~ 189cm");
            }
            if(h == "190"){
                setHeight("190cm ~ 194cm");
            }
            if(h == "195"){
                setHeight("195cm ~ 200cm");
            }
        }else{
            setHeight("");
        }

        //이상형 키
        if(user.signupData.hasOwnProperty("t_height1")){
            let h = user.signupData.t_height1;
            if(h == "0"){
                setHeight2("149cm 이하");
            }
            if(h == "150"){
                setHeight2("150cm ~ 154cm");
            }
            if(h == "155"){
                setHeight2("155cm ~ 159cm");
            }
            if(h == "160"){
                setHeight2("160cm ~ 164cm");
            }
            if(h == "165"){
                setHeight2("165cm ~ 169cm");
            }
            if(h == "170"){
                setHeight2("170cm ~ 174cm");
            }
            if(h == "175"){
                setHeight2("175cm ~ 179cm");
            }
            if(h == "180"){
                setHeight2("180cm ~ 184cm");
            }
            if(h == "185"){
                setHeight2("185cm ~ 189cm");
            }
            if(h == "190"){
                setHeight2("190cm ~ 194cm");
            }
            if(h == "195"){
                setHeight2("195cm ~ 200cm");
            }
        }else{
            setHeight2("");
        }

        //회원 프로필 정보 모두 값있는지 체크
        if(user.signupData.hasOwnProperty("m_address") && user.signupData.m_address.length > 0 &&
            user.signupData.hasOwnProperty("m_height") && user.signupData.m_height.length > 0 &&
            user.signupData.hasOwnProperty("m_job") && user.signupData.m_job.length > 0 &&
            user.signupData.hasOwnProperty("m_visual") && user.signupData.m_visual.length > 0 &&
            user.signupData.hasOwnProperty("m_like") && user.signupData.m_like.length > 0 &&
            user.signupData.hasOwnProperty("m_mbti") && user.signupData.m_mbti.length > 0 &&
            user.signupData.hasOwnProperty("m_character") && user.signupData.m_character.length > 0 &&
            user.signupData.hasOwnProperty("m_smok") && user.signupData.m_smok.length > 0 &&
            user.signupData.hasOwnProperty("m_drink") && user.signupData.m_drink.length > 0 &&
            user.signupData.hasOwnProperty("m_religion") && user.signupData.m_religion.length > 0 &&
            user.signupData.hasOwnProperty("m_date") && user.signupData.m_date.length > 0 &&
            user.signupData.hasOwnProperty("m_motive") && user.signupData.m_motive.length > 0
        ){
            setUsableProfile(true);
        }else{
            setUsableProfile(false);
        }

        //이상형정보 모두 값있는지 체크
        if(user.signupData.hasOwnProperty("t_height1") && user.signupData.t_height1.length > 0 &&
            user.signupData.hasOwnProperty("t_job") && user.signupData.t_job.length > 0 &&
            user.signupData.hasOwnProperty("t_visual") && user.signupData.t_visual.length > 0 &&
            user.signupData.hasOwnProperty("t_mbti") && user.signupData.t_mbti.length > 0 &&
            user.signupData.hasOwnProperty("t_character") && user.signupData.t_character.length > 0 &&
            user.signupData.hasOwnProperty("t_smok") && user.signupData.t_smok.length > 0 &&
            user.signupData.hasOwnProperty("t_drink") && user.signupData.t_drink.length > 0 &&
            user.signupData.hasOwnProperty("t_religion") && user.signupData.t_religion.length > 0
        ){
            setUsableProfile2(true);
        }else{
            setUsableProfile2(false);
        }

    },[user.signupData]);


    //실명인증한 회원정보 가져오기
    const getRealData = () => {
        axios.get(`${m_realname.replace(':tradeid',tradeid)}`)
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setRealData(data);

                //본인인증 데이터 signupData store 값에 저장
                let m_gender;
                if(data.Sex == "F"){
                    m_gender = "2";
                }else if(data.Sex == "M"){
                    m_gender = "1";
                }
                let newData = {...user.signupData};
                newData.m_name = data.Name;
                newData.m_born = data.Socialno;
                newData.m_c_phone = data.M_C_Phone;
                newData.m_gender = m_gender;
                dispatch(signupData(newData));

                setStep(2);
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

    //맨처음 실명인증한 회원정보 가져오기
    useEffect(()=>{
        getRealData();
    },[]);

    
    //다음스탭으로 넘어가서 새로운스탭생길때마다 맨밑으로 스크롤
    useEffect(()=>{
        setTimeout(()=>{
            contRef.current.scrollTop = contRef.current.scrollHeight;
        },200);
    },[step]);


    //아이디 영문,소문자,_ 만 입력가능
    const idInputCheck = (event) => {
        const regExp = /[^a-z0-9_]/gi;
        const ele = event.target;
        if (regExp.test(ele.value)) {
            ele.value = ele.value.replace(regExp, ''); // 허용된 문자만 남김
        }

        ele.value = ele.value.toLowerCase(); // 소문자로 변경
    };


    //아이디 다음버튼 클릭시
    const idCheckHandler = () => {
        if(valId.length < 4){
            setErrorId(true);
        }else{
            setErrorId(false);
            
            axios.get(`${m_id_check.replace(':m_id',valId)}`)
            .then((res)=>{
                if(res.status === 200){
                    setUsableId(true);

                    //아이디 signupData store 값에 저장
                    let newData = {...user.signupData};
                    newData.m_id = valId;
                    dispatch(signupData(newData));

                    if(step < 4){
                        setStep(4);
                    }
                }
            })
            .catch((error) => {
                const err_msg = CF.errorMsgHandler(error);
                setConfirm(true);
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:err_msg,
                    confirmPopBtn:1,
                }));
                setUsableId(false);
            });
        }
    };


    //비밀번호 다음버튼 클릭시
    const passCheckHandler = () => {
        let pw = valPassword;
        let pw2 = valPassword2;
        let num = pw.search(/[0-9]/g);
        let eng = pw.search(/[a-z]/ig);

        if(pw.length < 8 || pw.length > 13){
            setErrorPassword(true);
            setUsablePass(false);
        }else if(pw.search(/\s/) != -1){
            setErrorPassword(true);
            setUsablePass(false);
        }else if(num < 0 || eng < 0 ){
            setErrorPassword(true);
            setUsablePass(false);
        }else {
            setErrorPassword(false);

            //비밀번호 확인같은지 확인
            if(pw !== pw2){
                setErrorPassword2(true);
                setUsablePass(false);
            }else{
                setErrorPassword2(false);

                //아이디 사용가능인지 확인
                if(usableId){
                    setUsablePass(true);

                    //비밀번호 signupData store 값에 저장
                    let newData = {...user.signupData};
                    newData.m_password = pw;
                    dispatch(signupData(newData));

                    if(step < 5){
                        setStep(5);
                    }
                }else{
                    if(valId.length < 4){
                        setErrorId(true);
                    }
                    setConfirm(true);
                    dispatch(confirmPop({
                        confirmPop:true,
                        confirmPopTit:'알림',
                        confirmPopTxt:'아이디 사용가능을 확인해주세요.',
                        confirmPopBtn:1,
                    }));
                }
            }
        }
    };


    // 닉네임 다음버튼 클릭시
    const nickCheckHandler = () => {
        if(valNickname.length < 2){
            setErrorNickname(true);
        }else{
            setErrorNickname(false);

            axios.get(`${m_nick_check}?m_n_name=${valNickname}`)
            .then((res)=>{
                if(res.status === 200){

                    //아이디랑 비밀번호 사용가능인지 확인
                    if(usableId && usablePass){
                        setUsableNickname(true);

                        //닉네임 signupData store 값에 저장
                        let newData = {...user.signupData};
                        newData.m_n_name = valNickname;
                        dispatch(signupData(newData));

                        if(step < 6){
                            setStep(6);
                        }
                    }else if(!usableId){
                        if(valId.length < 4){
                            setErrorId(true);
                        }

                        setConfirm(true);
                        dispatch(confirmPop({
                            confirmPop:true,
                            confirmPopTit:'알림',
                            confirmPopTxt:'아이디 사용가능을 확인해주세요.',
                            confirmPopBtn:1,
                        }));
                    }else if(!usablePass){
                        let num = valPassword.search(/[0-9]/g);
                        let eng = valPassword.search(/[a-z]/ig);
                        if(valPassword.length < 8 || valPassword.length > 13 || valPassword.search(/\s/) != -1 || num < 0 || eng < 0){
                            setErrorPassword(true);
                        }
                        if(valPassword !== valPassword2){
                            setErrorPassword2(true);
                        }

                        setConfirm(true);
                        dispatch(confirmPop({
                            confirmPop:true,
                            confirmPopTit:'알림',
                            confirmPopTxt:'비밀번호를 입력해주세요.',
                            confirmPopBtn:1,
                        }));
                    }
                }
            })
            .catch((error) => {
                const err_msg = CF.errorMsgHandler(error);
                setConfirm(true);
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:err_msg,
                    confirmPopBtn:1,
                }));
                setUsableNickname(false);
            })
        }
    };


    //이메일 다음버튼 클릭시
    const emailCheckHandler = () => {
        let regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        if(regExp.test(valEmail)){
            setErrorEmail(false);

            //아이디랑 비밀번호,닉네임 사용가능인지 확인
            if(usableId && usablePass && usableNickname){
                setUsableEmail(true);

                //이메일 signupData store 값에 저장
                let newData = {...user.signupData};
                newData.m_email = valEmail;
                dispatch(signupData(newData));

                if(step < 7){
                    setStep(7);
                }
            }else if(!usableId){
                if(valId.length < 4){
                    setErrorId(true);
                }

                setConfirm(true);
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'아이디 사용가능을 확인해주세요.',
                    confirmPopBtn:1,
                }));
            }else if(!usablePass){
                let num = valPassword.search(/[0-9]/g);
                let eng = valPassword.search(/[a-z]/ig);
                if(valPassword.length < 8 || valPassword.length > 13 || valPassword.search(/\s/) != -1 || num < 0 || eng < 0){
                    setErrorPassword(true);
                }
                if(valPassword !== valPassword2){
                    setErrorPassword2(true);
                }

                setConfirm(true);
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'비밀번호를 입력해주세요.',
                    confirmPopBtn:1,
                }));
            }else if(!usableNickname){
                if(valNickname.length < 2){
                    setErrorNickname(true);
                }

                setConfirm(true);
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'닉네임 사용가능을 확인해주세요.',
                    confirmPopBtn:1,
                }));
            }
        }else{
            setErrorEmail(true);
        }
    };


    //기본정보입력 다음버튼 클릭시
    const infoCheckHandler = () => {
        // if(step < 8){
        //     setStep(8);
        //     dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"거주지"}));
        // }

        //아이디랑 비밀번호,닉네임,이메일 사용가능인지 확인
        if(usableId && usablePass && usableNickname && usableEmail){
            if(step < 8){
                setStep(8);
            }
        }else if(!usableId){
            if(valId.length < 4){
                setErrorId(true);
            }

            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'아이디 사용가능을 확인해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!usablePass){
            let num = valPassword.search(/[0-9]/g);
            let eng = valPassword.search(/[a-z]/ig);
            if(valPassword.length < 8 || valPassword.length > 13 || valPassword.search(/\s/) != -1 || num < 0 || eng < 0){
                setErrorPassword(true);
            }
            if(valPassword !== valPassword2){
                setErrorPassword2(true);
            }

            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'비밀번호를 입력해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!usableNickname){
            if(valNickname.length < 2){
                setErrorNickname(true);
            }
            
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'닉네임 사용가능을 확인해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!usableEmail){
            let regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
            if(regExp.test(valEmail)){
                setErrorEmail(false);
            }else{
                setErrorEmail(true);
            }

            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'이메일을 입력해주세요.',
                confirmPopBtn:1,
            }));
        }
    };


    //프로필정보입력 다음버튼 클릭시
    const profileCheckHandler = () => {

        //아이디랑 비밀번호,닉네임,이메일,프로필정보 입력 확인
        if(usableId && usablePass && usableNickname && usableEmail && usableProfile){
            if(step < 9){
                setStep(9);
            }
        }else if(!usableProfile){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'프로필 정보를 모두 입력해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(!usableId){
            if(valId.length < 4){
                setErrorId(true);
            }

            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'아이디 사용가능을 확인해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!usablePass){
            let num = valPassword.search(/[0-9]/g);
            let eng = valPassword.search(/[a-z]/ig);
            if(valPassword.length < 8 || valPassword.length > 13 || valPassword.search(/\s/) != -1 || num < 0 || eng < 0){
                setErrorPassword(true);
            }
            if(valPassword !== valPassword2){
                setErrorPassword2(true);
            }

            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'비밀번호를 입력해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!usableNickname){
            if(valNickname.length < 2){
                setErrorNickname(true);
            }
            
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'닉네임 사용가능을 확인해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!usableEmail){
            let regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
            if(regExp.test(valEmail)){
                setErrorEmail(false);
            }else{
                setErrorEmail(true);
            }

            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'이메일을 입력해주세요.',
                confirmPopBtn:1,
            }));
        }

        if(user.signupData.hasOwnProperty("m_address") && user.signupData.m_address.length > 0){
            setErrorAddress(false);
        }else{
            setErrorAddress(true);
        }

        if(user.signupData.hasOwnProperty("m_height") && user.signupData.m_height.length > 0 ){
            setErrorHeight(false);
        }else{
            setErrorHeight(true);
        }

        if(user.signupData.hasOwnProperty("m_job") && user.signupData.m_job.length > 0 ){
            setErrorJob(false);
        }else{
            setErrorJob(true);
        }

        if(user.signupData.hasOwnProperty("m_visual") && user.signupData.m_visual.length > 0){
            setErrorVisual(false);
        }else{
            setErrorVisual(true);
        }

        if(user.signupData.hasOwnProperty("m_like") && user.signupData.m_like.length > 0){
            setErrorLike(false);
        }else{
            setErrorLike(true);
        }

        if(user.signupData.hasOwnProperty("m_mbti") && user.signupData.m_mbti.length > 0){
            setErrorMbti(false);
        }else{
            setErrorMbti(true);
        }

        if(user.signupData.hasOwnProperty("m_character") && user.signupData.m_character.length > 0){
            setErrorType(false);
        }else{
            setErrorType(true);
        }

        if(user.signupData.hasOwnProperty("m_smok") && user.signupData.m_smok.length > 0){
            setErrorSmok(false);
        }else{
            setErrorSmok(true);
        }

        if(user.signupData.hasOwnProperty("m_drink") && user.signupData.m_drink.length > 0){
            setErrorDrink(false);
        }else{
            setErrorDrink(true);
        }

        if(user.signupData.hasOwnProperty("m_religion") && user.signupData.m_religion.length > 0){
            setErrorReligion(false);
        }else{
            setErrorReligion(true);
        }

        if(user.signupData.hasOwnProperty("m_date") && user.signupData.m_date.length > 0){
            setErrorDate(false);
        }else{
            setErrorDate(true);
        }

        if(user.signupData.hasOwnProperty("m_motive") && user.signupData.m_motive.length > 0){
            setErrorRoute(false);
        }else{
            setErrorRoute(true);
        }
    };


    //프로필사진 1개이상 등록시 usableProfileImg = true
    useEffect(()=>{
        if(imgNameList.every((value) => value === "")){
            setUsableProfileImg(false);
        }else{
            setUsableProfileImg(true);

            //프로필사진 배열정렬후 signupData store 값에 저장
            const nonEmptyValues = imgNameList.filter(value => value !== '');
            const sortedArr = [...nonEmptyValues, ...Array(imgNameList.length - nonEmptyValues.length).fill('')];
            const updatedImgList = sortedArr.map(url => {
                let updatedUrl = url.replace(api_uri+"/upload/profile/user/", "");
                return updatedUrl;
            });

            let newData = {...user.signupData};
            newData.pic = updatedImgList;
            dispatch(signupData(newData));
        }
    },[imgNameList]);


    //프로필사진 등록시
    useEffect(()=>{
        setImgNameList(common.profileImgs);
    },[common.profileImgs]);


    //프로필사진 삭제
    const imgDeltHandler = (idx) => {
        let newNameList = [...common.profileImgs];
            newNameList[idx] = "";
        setImgNameList(newNameList);
        dispatch(profileImgs(newNameList));
    };


    //프로필사진등록 다음버튼 클릭시
    const profileImgCheckHandler = () => {
        console.log(usableProfileImg)
        // if(!usableProfileImg){
        //     setConfirm(true);
        //     dispatch(confirmPop({
        //         confirmPop:true,
        //         confirmPopTit:'알림',
        //         confirmPopTxt:'프로필 사진을 최소1장 등록해주세요.',
        //         confirmPopBtn:1,
        //     }));
        // }else{
        //     if(step < 10){
        //         setStep(10);
        //     }
        // }

        //아이디랑 비밀번호,닉네임,이메일,프로필정보,프로필사진 입력 확인
        if(usableId && usablePass && usableNickname && usableEmail && usableProfile && usableProfileImg){
            if(step < 10){
                setStep(10);
            }
        }else if(!usableProfileImg){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'프로필 사진을 최소1장 등록해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(!usableId){
            if(valId.length < 4){
                setErrorId(true);
            }

            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'아이디 사용가능을 확인해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!usablePass){
            let num = valPassword.search(/[0-9]/g);
            let eng = valPassword.search(/[a-z]/ig);
            if(valPassword.length < 8 || valPassword.length > 13 || valPassword.search(/\s/) != -1 || num < 0 || eng < 0){
                setErrorPassword(true);
            }
            if(valPassword !== valPassword2){
                setErrorPassword2(true);
            }

            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'비밀번호를 입력해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!usableNickname){
            if(valNickname.length < 2){
                setErrorNickname(true);
            }
            
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'닉네임 사용가능을 확인해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!usableEmail){
            let regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
            if(regExp.test(valEmail)){
                setErrorEmail(false);
            }else{
                setErrorEmail(true);
            }

            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'이메일을 입력해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!usableProfile){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'프로필 정보를 모두 입력해주세요.',
                confirmPopBtn:1,
            }));
        }

        // 프로필 정보 에러문구-----------
        if(user.signupData.hasOwnProperty("m_address") && user.signupData.m_address.length > 0){
            setErrorAddress(false);
        }else{
            setErrorAddress(true);
        }

        if(user.signupData.hasOwnProperty("m_height") && user.signupData.m_height.length > 0 ){
            setErrorHeight(false);
        }else{
            setErrorHeight(true);
        }

        if(user.signupData.hasOwnProperty("m_job") && user.signupData.m_job.length > 0 ){
            setErrorJob(false);
        }else{
            setErrorJob(true);
        }

        if(user.signupData.hasOwnProperty("m_visual") && user.signupData.m_visual.length > 0){
            setErrorVisual(false);
        }else{
            setErrorVisual(true);
        }

        if(user.signupData.hasOwnProperty("m_like") && user.signupData.m_like.length > 0){
            setErrorLike(false);
        }else{
            setErrorLike(true);
        }

        if(user.signupData.hasOwnProperty("m_mbti") && user.signupData.m_mbti.length > 0){
            setErrorMbti(false);
        }else{
            setErrorMbti(true);
        }

        if(user.signupData.hasOwnProperty("m_character") && user.signupData.m_character.length > 0){
            setErrorType(false);
        }else{
            setErrorType(true);
        }

        if(user.signupData.hasOwnProperty("m_smok") && user.signupData.m_smok.length > 0){
            setErrorSmok(false);
        }else{
            setErrorSmok(true);
        }

        if(user.signupData.hasOwnProperty("m_drink") && user.signupData.m_drink.length > 0){
            setErrorDrink(false);
        }else{
            setErrorDrink(true);
        }

        if(user.signupData.hasOwnProperty("m_religion") && user.signupData.m_religion.length > 0){
            setErrorReligion(false);
        }else{
            setErrorReligion(true);
        }

        if(user.signupData.hasOwnProperty("m_date") && user.signupData.m_date.length > 0){
            setErrorDate(false);
        }else{
            setErrorDate(true);
        }

        if(user.signupData.hasOwnProperty("m_motive") && user.signupData.m_motive.length > 0){
            setErrorRoute(false);
        }else{
            setErrorRoute(true);
        }
    };


    //이상형정보등록, 좋은결과, 회원가입 다음버튼 클릭시
    const signupHandler = (status) => {
        //아이디랑 비밀번호,닉네임,이메일,프로필정보,프로필사진,이상형정보 입력 확인
        if(usableId && usablePass && usableNickname && usableEmail && usableProfile && usableProfileImg && usableProfile2){

            //이상형정보등록 다음버튼 클릭일때
            if(status == "profileCheck"){
                if(step < 11){
                    setStep(11);
                }
            }
            //좋은결과 다음버튼 클릭일때
            if(status == "profileCheck2"){
                if(step < 12){
                    setStep(12);
                }
            }
            //회원가입 다음버튼 클릭일때 회원가입 진행
            if(status == "signup"){
                let address;
                if(user.signupData.hasOwnProperty("m_address2") && user.signupData.m_address2.length > 0){
                    address = user.signupData.m_address + " " + user.signupData.m_address2;
                }else{
                    address = user.signupData.m_address;
                }

                let body = {
                    m_name: user.signupData.m_name,
                    m_born: user.signupData.m_born,
                    m_c_phone: user.signupData.m_c_phone,
                    m_gender: user.signupData.m_gender,
                    m_id: user.signupData.m_id,
                    m_password: user.signupData.m_password,
                    m_n_name: user.signupData.m_n_name,
                    m_email: user.signupData.m_email,
                    m_address: address,
                    m_height: user.signupData.m_height,
                    m_job: user.signupData.m_job,
                    m_visual: user.signupData.m_visual,
                    m_like: user.signupData.m_like,
                    m_mbti: user.signupData.m_mbti,
                    m_character: user.signupData.m_character,
                    m_smok: user.signupData.m_smok,
                    m_drink: user.signupData.m_drink,
                    m_religion: user.signupData.m_religion,
                    m_date: user.signupData.m_date,
                    m_motive: user.signupData.m_motive,
                    pic: user.signupData.pic,
                    t_height1: user.signupData.t_height1,
                    t_height2: user.signupData.t_height2,
                    t_job: user.signupData.t_job,
                    t_visual: user.signupData.t_visual,
                    t_mbti: user.signupData.t_mbti,
                    t_character: user.signupData.t_character,
                    t_smok: user.signupData.t_smok,
                    t_drink: user.signupData.t_drink,
                    t_religion: user.signupData.t_religion,
                    app_token: "Y"
                };

                axios.post(`${m_join}`,body)
                .then((res)=>{
                    if(res.status === 200){
                        //메인페이지 이동, 회원가입완료 팝업 띄우기
                        navigate("/");
                        dispatch(appSignupCompletePop({appSignupCompletePop:true,appSignupCompletePopUser:user.signupData.m_name}));

                        //sessionStorage tradeid 삭제
                        sessionStorage.removeItem("tradeid");
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
            
        }else if(!usableProfile2){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'이상형 정보를 모두 입력해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(!usableId){
            if(valId.length < 4){
                setErrorId(true);
            }

            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'아이디 사용가능을 확인해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!usablePass){
            let num = valPassword.search(/[0-9]/g);
            let eng = valPassword.search(/[a-z]/ig);
            if(valPassword.length < 8 || valPassword.length > 13 || valPassword.search(/\s/) != -1 || num < 0 || eng < 0){
                setErrorPassword(true);
            }
            if(valPassword !== valPassword2){
                setErrorPassword2(true);
            }

            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'비밀번호를 입력해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!usableNickname){
            if(valNickname.length < 2){
                setErrorNickname(true);
            }
            
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'닉네임 사용가능을 확인해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!usableEmail){
            let regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
            if(regExp.test(valEmail)){
                setErrorEmail(false);
            }else{
                setErrorEmail(true);
            }

            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'이메일을 입력해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!usableProfile){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'프로필 정보를 모두 입력해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!usableProfileImg){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'프로필 사진을 최소1장 등록해주세요.',
                confirmPopBtn:1,
            }));
        }
        
        // 프로필 정보 에러문구-----------
        if(user.signupData.hasOwnProperty("m_address") && user.signupData.m_address.length > 0){
            setErrorAddress(false);
        }else{
            setErrorAddress(true);
        }

        if(user.signupData.hasOwnProperty("m_height") && user.signupData.m_height.length > 0 ){
            setErrorHeight(false);
        }else{
            setErrorHeight(true);
        }

        if(user.signupData.hasOwnProperty("m_job") && user.signupData.m_job.length > 0 ){
            setErrorJob(false);
        }else{
            setErrorJob(true);
        }

        if(user.signupData.hasOwnProperty("m_visual") && user.signupData.m_visual.length > 0){
            setErrorVisual(false);
        }else{
            setErrorVisual(true);
        }

        if(user.signupData.hasOwnProperty("m_like") && user.signupData.m_like.length > 0){
            setErrorLike(false);
        }else{
            setErrorLike(true);
        }

        if(user.signupData.hasOwnProperty("m_mbti") && user.signupData.m_mbti.length > 0){
            setErrorMbti(false);
        }else{
            setErrorMbti(true);
        }

        if(user.signupData.hasOwnProperty("m_character") && user.signupData.m_character.length > 0){
            setErrorType(false);
        }else{
            setErrorType(true);
        }

        if(user.signupData.hasOwnProperty("m_smok") && user.signupData.m_smok.length > 0){
            setErrorSmok(false);
        }else{
            setErrorSmok(true);
        }

        if(user.signupData.hasOwnProperty("m_drink") && user.signupData.m_drink.length > 0){
            setErrorDrink(false);
        }else{
            setErrorDrink(true);
        }

        if(user.signupData.hasOwnProperty("m_religion") && user.signupData.m_religion.length > 0){
            setErrorReligion(false);
        }else{
            setErrorReligion(true);
        }

        if(user.signupData.hasOwnProperty("m_date") && user.signupData.m_date.length > 0){
            setErrorDate(false);
        }else{
            setErrorDate(true);
        }

        if(user.signupData.hasOwnProperty("m_motive") && user.signupData.m_motive.length > 0){
            setErrorRoute(false);
        }else{
            setErrorRoute(true);
        }

        
        // 이상형 정보 에러문구-----------
        if(user.signupData.hasOwnProperty("t_height1") && user.signupData.t_height1.length > 0 ){
            setErrorHeight2(false);
        }else{
            setErrorHeight2(true);
        }

        if(user.signupData.hasOwnProperty("t_job") && user.signupData.t_job.length > 0 ){
            setErrorJob2(false);
        }else{
            setErrorJob2(true);
        }

        if(user.signupData.hasOwnProperty("t_visual") && user.signupData.t_visual.length > 0){
            setErrorVisual2(false);
        }else{
            setErrorVisual2(true);
        }

        if(user.signupData.hasOwnProperty("t_mbti") && user.signupData.t_mbti.length > 0){
            setErrorMbti2(false);
        }else{
            setErrorMbti2(true);
        }

        if(user.signupData.hasOwnProperty("t_character") && user.signupData.t_character.length > 0){
            setErrorType2(false);
        }else{
            setErrorType2(true);
        }

        if(user.signupData.hasOwnProperty("t_smok") && user.signupData.t_smok.length > 0){
            setErrorSmok2(false);
        }else{
            setErrorSmok2(true);
        }

        if(user.signupData.hasOwnProperty("t_drink") && user.signupData.t_drink.length > 0){
            setErrorDrink2(false);
        }else{
            setErrorDrink2(true);
        }

        if(user.signupData.hasOwnProperty("t_religion") && user.signupData.t_religion.length > 0){
            setErrorReligion2(false);
        }else{
            setErrorReligion2(true);
        }
    };


    return(<>
        <div className="signup_wrap">
            <ul className="step_ul flex_between">
                <li className="on"></li>
                <li className={step > 2 ? "on" : ""}></li>
                <li className={step > 7 ? "on" : ""}></li>
                <li></li>
            </ul>
            <div className="signup_cont scroll_wrap" ref={contRef}>

                {/* 약관동의 */}
                <div className="signup_box flex_top done">
                    <div className="img_box">
                        <img src={profile_img} alt="이미지" />
                    </div>
                    <div className="txt_box">
                        <p className="name">사소한 매니저 하니</p>
                        <div className="inner_box">
                            <div className="tit_box">
                                <p className="f_20 medium"><span className="f_18">안녕하세요. <br/>
                                    저는 사소한 매니저 "하니" 입니다! <br/>
                                    지금부터 회원 가입을 도와드릴게요. :D <br/></span>
                                    <strong>회원 가입 약관동의</strong>를 진행해주세요</p>
                            </div>
                            <div className="agree_box">
                                <div className="all_check custom_check">
                                    <label htmlFor="all_agree">
                                        <input type={"checkbox"} id="all_agree" 
                                            checked={true} 
                                            disabled={true}
                                        />
                                        <span className="check">체크</span>
                                        <span className="txt">전체 동의</span>
                                    </label>
                                </div>
                                <ul>
                                    {agreeList.map((txt,i)=>{
                                        const idx = i+1;
                                        const val = "agree_"+(i+1);
                                        return(
                                            <li key={i} className="flex">
                                                <div className="custom_check">
                                                    <label htmlFor={val}>
                                                        <input type={"checkbox"} id={val} value={val}
                                                            checked={true}
                                                            disabled={true}
                                                        />
                                                        <span className="check">체크</span>
                                                    </label>
                                                </div>
                                                <button type="button" onClick={()=>{dispatch(appTermsPop({appTermsPop:true,appTermsPopIdx:idx}))}}>{txt}</button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div className="flex_end tp10">
                            <button type="button" className="app_btn_s" disabled={true} >다음</button>
                        </div>
                    </div>
                </div>

                {/* 본인인증 */}
                {step > 1 &&
                    <div className="signup_box flex_top">
                        <div className="img_box">
                            <img src={profile_img} alt="이미지" />
                        </div>
                        <div className="txt_box">
                            <p className="name">사소한 매니저 하니</p>
                            <div className="inner_box">
                                <div className="tit_box">
                                    <p className="f_20 medium">좋아요! <br/>회원님의 <strong>본인인증</strong>이 완료되었습니다</p>
                                </div>
                                <ul className="txt_ul">
                                    <li className="flex_between flex_wrap">
                                        <p>이름</p>
                                        <p>{realData.Name}</p>
                                    </li>
                                    <li className="flex_between flex_wrap">
                                        <p>생년월일</p>
                                        <p>{realData.Socialno && moment(realData.Socialno).format("YYYY년 MM월 DD일")}</p>
                                    </li>
                                    <li className="flex_between flex_wrap">
                                        <p>휴대폰번호</p>
                                        <p>{realData.M_C_Phone && realData.M_C_Phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1 - $2 - $3")}</p>
                                    </li>
                                    <li className="flex_between flex_wrap">
                                        <p>성별</p>
                                        <p>{realData.Sex == "F" ? "여성" : realData.Sex == "M" && "남성"}</p>
                                    </li>
                                </ul>
                            </div>
                            <div className="flex_end tp10">
                                <button type="button" className="app_btn_s" 
                                    disabled={step > 2 ? true : false}
                                    onClick={()=>setStep(3)}
                                >다음</button>
                            </div>
                        </div>
                    </div>
                }

                {/* 아이디 입력 - 기본정보입력 시작 */}
                {step > 2 &&
                    <div className="signup_box">
                        <div className="gray_box">회원님의 기본 정보를 입력해주세요!</div>
                        <div className="flex_top">
                            <div className="img_box">
                                <img src={profile_img} alt="이미지" />
                            </div>
                            <div className="txt_box">
                                <p className="name">사소한 매니저 하니</p>
                                <div className="inner_box">
                                    <div className="tit_box">
                                        <p className="f_20 medium">회원님의 <strong>아이디</strong>를 입력해주세요 <br/></p>
                                        <p className={`f_17 tp4${errorId ? " alert_txt" : ""}`}>영문자, 소문자, _만 입력 가능. <br/>최소 4자 이상 입력하세요.</p>
                                    </div>
                                    <div className={`custom_input${usableId ? " val_check" : ""}`}>
                                        <input type={"text"} placeholder="아이디를 입력해주세요." 
                                            onChange={(e)=>{
                                                setValId(e.currentTarget.value);
                                                setUsableId(false);
                                            }}
                                            onKeyUp={(e)=>{idInputCheck(e)}} 
                                        />
                                    </div>
                                </div>
                                <div className="flex_end tp10">
                                    <button type="button" className="app_btn_s" 
                                        onClick={idCheckHandler}
                                        disabled={step > 3 && usableId ? true : false}
                                    >다음</button>
                                </div>
                            </div> 
                        </div>
                    </div>
                }

                {/* 비밀번호 입력 */}
                {step > 3 &&
                    <div className="signup_box flex_top">
                        <div className="img_box">
                            <img src={profile_img} alt="이미지" />
                        </div>
                        <div className="txt_box">
                            <p className="name">사소한 매니저 하니</p>
                            <div className="inner_box">
                                <div className="tit_box">
                                    <p className="f_20 medium"><strong>비밀번호</strong>를 입력해주세요 <br/></p>
                                    <p className={`f_17 tp4${errorPassword ? " alert_txt" : ""}`}>영문, 숫자를 포함하여 <br/>8~12자까지 입력 필수.</p>
                                    {errorPassword2 && <p className="f_17 medium alert_txt">비밀번호가 일치하지 않습니다.</p>}
                                </div>
                                <div className="custom_input pass_input flex">
                                    <input type={passView ? "text" : "password"} placeholder="비밀번호를 입력해주세요." 
                                        onChange={(e)=>{
                                            setValPassword(e.currentTarget.value);
                                            setUsablePass(false);
                                        }} 
                                    />
                                    <button type="button" className={`btn_view${passView ? " on" : ""}`} onClick={()=>setPassView(!passView)}>비밀번호보기 버튼</button>
                                </div>
                                <div className="custom_input pass_input flex">
                                    <input type={pass2View ? "text" : "password"} placeholder="비밀번호 재확인" 
                                        onChange={(e)=>{
                                            setValPassword2(e.currentTarget.value);
                                            setUsablePass(false);
                                        }}
                                    />
                                    <button type="button" className={`btn_view${pass2View ? " on" : ""}`} onClick={()=>setPass2View(!pass2View)}>비밀번호보기 버튼</button>
                                </div>
                            </div>
                            <div className="flex_end tp10">
                                <button type="button" className="app_btn_s"
                                    onClick={passCheckHandler}
                                    disabled={step > 4 && usablePass ? true : false}
                                >다음</button>
                            </div>
                        </div> 
                    </div>
                }

                {/* 닉네임 입력 */}
                {step > 4 &&
                    <div className="signup_box flex_top">
                        <div className="img_box">
                            <img src={profile_img} alt="이미지" />
                        </div>
                        <div className="txt_box">
                            <p className="name">사소한 매니저 하니</p>
                            <div className="inner_box">
                                <div className="tit_box">
                                    <p className="f_20 medium">회원님의 닉네임을 정해주세요 :)</p>
                                    <p className={`f_17 tp4${errorNickname ? " alert_txt" : ""}`}>최소 2자 이상 입력하세요.</p>
                                </div>
                                <div className={`custom_input${usableNickname ? " val_check" : ""}`}>
                                    <input type={"text"} placeholder="닉네임을 입력해주세요." 
                                        onChange={(e)=>{
                                            setValNickname(e.currentTarget.value);
                                            setUsableNickname(false);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="flex_end tp10">
                                <button type="button" className="app_btn_s"
                                    onClick={nickCheckHandler}
                                    disabled={step > 5 && usableNickname ? true : false}
                                >다음</button>
                            </div>
                        </div> 
                    </div>
                }

                {/* 이메일 입력 */}
                {step > 5 &&
                    <div className="signup_box flex_top">
                        <div className="img_box">
                            <img src={profile_img} alt="이미지" />
                        </div>
                        <div className="txt_box">
                            <p className="name">사소한 매니저 하니</p>
                            <div className="inner_box">
                                <div className="tit_box">
                                    <p className="f_20 medium">회원님의 이메일도 입력해주세요 :D</p>
                                    <p className={`f_17 tp4${errorEmail ? " alert_txt" : ""}`}>올바른 이메일 주소를 입력하세요.</p>
                                </div>
                                <div className={`custom_input${usableEmail ? " val_check" : ""}`}>
                                    <input type={"text"} placeholder="이메일을 입력해주세요." 
                                        onChange={(e)=>{
                                            setValEmail(e.currentTarget.value);
                                            setUsableEmail(false);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="flex_end tp10">
                                <button type="button" className="app_btn_s"
                                    onClick={emailCheckHandler}
                                    disabled={step > 6 && usableEmail ? true : false}
                                >다음</button>
                            </div>
                        </div> 
                    </div>
                }

                {/* 기본정보입력 완료 */}
                {step > 6 &&
                    <div className="signup_box flex_top">
                        <div className="img_box">
                            <img src={profile_img} alt="이미지" />
                        </div>
                        <div className="txt_box">
                            <p className="name">사소한 매니저 하니</p>
                            <div className="inner_box">
                                <div className="tit_box">
                                    <p className="f_20 medium">회원님의 개인정보를 모두 입력했어요 🎉</p>
                                    <p className="f_17 tp4">다음 단계로 이동할까요?</p>
                                </div>
                            </div>
                            <div className="flex_end tp10">
                                <button type="button" className="app_btn_s"
                                    onClick={infoCheckHandler}
                                    disabled={step > 7 ? true : false}
                                >다음</button>
                            </div>
                        </div> 
                    </div>
                }

                {/* 프로필정보 입력 */}
                {step > 7 &&
                    <div className="signup_box">
                        <div className="gray_box">회원님의 프로필 정보를 입력해주세요!</div>
                        <div className="flex_top">
                            <div className="img_box">
                                <img src={profile_img} alt="이미지" />
                            </div>
                            <div className="txt_box">
                                <p className="name">사소한 매니저 하니</p>
                                <div className="inner_box">
                                    <div className="tit_box">
                                        <p className="f_20 medium">회원님의 <strong>프로필 정보</strong>를 <br/>입력해볼까요?</p>
                                    </div>
                                    <ul className="form_ul">
                                        <li>
                                            <p className="input_tit">나의 거주지</p>
                                            {errorAddress && <p className="alert_txt">나의 거주지를 입력하세요.</p>}
                                            <div className="btn_sel_box2 flex_between">
                                                <button type="button" className="btn_sel" 
                                                    onClick={()=>{
                                                        dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"거주지"}));
                                                    }}
                                                ><span className="ellipsis">{address ? address : "선택"}</span></button>
                                                <button type="button" className="btn_sel" 
                                                    onClick={()=>{
                                                        dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"거주지"}));
                                                    }}
                                                ><span className="ellipsis">{address2 ? address2 : "선택"}</span></button>
                                            </div>
                                        </li>
                                        <li>
                                            <p className="input_tit">나의 키</p>
                                            {errorHeight && <p className="alert_txt">나의 키를 입력하세요.</p>}
                                            <button type="button" className="btn_sel" 
                                                onClick={()=>{
                                                    dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"키"}));
                                                }}
                                            ><span className="ellipsis">{height ? height : "선택"}</span></button>
                                        </li>
                                        <li>
                                            <p className="input_tit">나의 직업</p>
                                            {errorJob && <p className="alert_txt">나의 직업을 입력하세요.</p>}
                                            <div className="w_50">
                                                <button type="button" className="btn_sel" 
                                                    onClick={()=>{
                                                        dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"직업"}));
                                                    }}
                                                ><span className="ellipsis">{allData.m_job ? allData.m_job : "선택"}</span></button>
                                            </div>
                                        </li>
                                        <li>
                                            <p className="input_tit">나의 외모 점수</p>
                                            {errorVisual && <p className="alert_txt">나의 외모 점수를 입력하세요.</p>}
                                            <div className="w_50">
                                                <button type="button" className="btn_sel" 
                                                    onClick={()=>{
                                                        dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"외모 점수"}));
                                                    }}
                                                ><span className="ellipsis">{allData.m_visual ? allData.m_visual+"점" : "선택"}</span></button>
                                            </div>
                                        </li>
                                        <li>
                                            <p className="input_tit">나의 관심사</p>
                                            {errorLike && <p className="alert_txt">나의 관심사를 입력하세요.</p>}
                                            <button type="button" className="btn_sel" 
                                                onClick={()=>{
                                                    dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"내 관심사"}));
                                                }}
                                            ><span className="ellipsis">{allData.m_like && allData.m_like.length > 0 ? allData.m_like.join(", ") : "선택"}</span></button>
                                        </li>
                                        <li>
                                            <p className="input_tit">나의 MBTI</p>
                                            {errorMbti && <p className="alert_txt">나의 MBTI를 입력하세요.</p>}
                                            <div className="w_50">
                                                <button type="button" className="btn_sel" 
                                                    onClick={()=>{
                                                        dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"MBTI"}));
                                                    }}
                                                ><span className="ellipsis">{allData.m_mbti ? allData.m_mbti : "선택"}</span></button>
                                            </div>
                                        </li>
                                        <li>
                                            <p className="input_tit">나의 타입</p>
                                            {errorType && <p className="alert_txt">나의 타입을 입력하세요.</p>}
                                            <button type="button" className="btn_sel" 
                                                onClick={()=>{
                                                    dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"타입"}));
                                                }}
                                            ><span className="ellipsis">{allData.m_character && allData.m_character.length > 0 ? allData.m_character.join(", ") : "선택"}</span></button>
                                        </li>
                                        <li>
                                            <p className="input_tit">나는 흡연을</p>
                                            {errorSmok && <p className="alert_txt">나의 흡연여부를 입력하세요.</p>}
                                            <div className="w_50">
                                                <button type="button" className="btn_sel" 
                                                    onClick={()=>{
                                                        dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"흡연 여부"}));
                                                    }}
                                                ><span className="ellipsis">{
                                                    allData.m_smok ?
                                                        allData.m_smok == "1" ? "한다"
                                                        :allData.m_smok == "2" ? "안 한다"
                                                        :allData.m_smok == "3" && "가끔 한다"
                                                    : "선택"
                                                }</span></button>
                                            </div>
                                        </li>
                                        <li>
                                            <p className="input_tit">나는 술을</p>
                                            {errorDrink && <p className="alert_txt">나의 음주여부를 입력하세요.</p>}
                                            <div className="w_50">
                                                <button type="button" className="btn_sel" 
                                                    onClick={()=>{
                                                        dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"음주 여부"}));
                                                    }}
                                                    ><span className="ellipsis">{
                                                        allData.m_drink ?
                                                            allData.m_drink == "1" ? "한다"
                                                            :allData.m_drink == "2" ? "가끔 한다"
                                                            :allData.m_drink == "3" && "안 한다"
                                                        : "선택"
                                                    }</span></button>
                                            </div>
                                        </li>
                                        <li>
                                            <p className="input_tit">나의 종교</p>
                                            {errorReligion && <p className="alert_txt">나의 종교를 입력하세요.</p>}
                                            <div className="w_50">
                                                <button type="button" className="btn_sel" 
                                                    onClick={()=>{
                                                        dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"종교"}));
                                                    }}
                                                ><span className="ellipsis">{allData.m_religion ? allData.m_religion : "선택"}</span></button>
                                            </div>
                                        </li>
                                        <li>
                                            <p className="input_tit">나의 선호하는 데이트</p>
                                            {errorDate && <p className="alert_txt">나의 선호하는 데이트를 입력하세요.</p>}
                                            <button type="button" className="btn_sel" 
                                                onClick={()=>{
                                                    dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"선호하는 데이트"}));
                                                }}
                                            ><span className="ellipsis">{allData.m_date && allData.m_date.length > 0 ? allData.m_date.join(", ") : "선택"}</span></button>
                                        </li>
                                        <li>
                                            <p className="input_tit">나의 가입경로</p>
                                            {errorRoute && <p className="alert_txt">나의 가입경로를 입력하세요.</p>}
                                            <div className="w_50">
                                                <button type="button" className="btn_sel" 
                                                    onClick={()=>{
                                                        dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"가입경로"}));
                                                    }}
                                                ><span className="ellipsis">{allData.m_motive ? allData.m_motive : "선택"}</span></button>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="flex_end tp10">
                                    <button type="button" className="app_btn_s"
                                        onClick={profileCheckHandler}
                                        disabled={step > 8 && usableProfile ? true : false}
                                    >다음</button>
                                </div>
                            </div> 
                        </div>
                    </div>
                }

                {/* 프로필사진 등록 */}
                {step > 8 &&
                    <div className="signup_box">
                        <div className="gray_box">회원님의 프로필 사진을 등록해주세요!</div>
                        <div className="flex_top">
                            <div className="img_box">
                                <img src={profile_img} alt="이미지" />
                            </div>
                            <div className="txt_box">
                                <p className="name">사소한 매니저 하니</p>
                                <div className="inner_box">
                                    <div className="tit_box">
                                        <p className="f_20 medium">본인의 얼굴이 잘보이는 사진을 <br/><strong>최소 1장</strong> 등록해주세요.</p>
                                    </div>
                                </div>
                                <ul className="profile_img_ul flex_wrap">
                                    {imgList.map((img,i)=>{
                                        return(
                                            <li key={`imgUp${i}`} className={imgNameList[i] ? "on" : ""}>
                                                <div className="img"
                                                    onClick={()=>{
                                                        dispatch(appProfileImgPop({appProfileImgPop:true, appProfileImgPopIdx:i}));
                                                    }}
                                                >
                                                    {imgNameList[i] && <img src={imgNameList[i]} alt="프로필이미지"/>}
                                                </div>
                                                <button type="button" className="btn_delt" onClick={()=>{imgDeltHandler(i)}}>삭제버튼</button>
                                            </li>
                                        );
                                    })}
                                </ul>
                                <div className="flex_end tp10">
                                    <button type="button" className="app_btn_s"
                                        onClick={profileImgCheckHandler}
                                        disabled={step > 9 && usableProfileImg ? true : false}
                                    >다음</button>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {/* 이상형정보 입력 */}
                {step > 9 &&
                    <div className="signup_box">
                        <div className="gray_box">회원님의 이상형 정보를 입력해주세요!</div>
                        <div className="flex_top">
                            <div className="img_box">
                                <img src={profile_img} alt="이미지" />
                            </div>
                            <div className="txt_box">
                                <p className="name">사소한 매니저 하니</p>
                                <div className="inner_box">
                                    <div className="tit_box">
                                        <p className="f_20 medium">회원님의 <strong>이상형 정보</strong>를 <br/>입력해볼까요?</p>
                                    </div>
                                    <ul className="form_ul">
                                        <li>
                                            <p className="input_tit">상대방의 키</p>
                                            {errorHeight2 && <p className="alert_txt">상대방의 키를 입력하세요.</p>}
                                            <button type="button" className="btn_sel" 
                                                onClick={()=>{
                                                    dispatch(appProfilePop2({appProfilePop2:true,appProfilePopTit2:"키"}));
                                                }}
                                            ><span className="ellipsis">{height2 ? height2 : "선택"}</span></button>
                                        </li>
                                        <li>
                                            <p className="input_tit">상대방의 직업</p>
                                            {errorJob2 && <p className="alert_txt">상대방의 직업을 입력하세요.</p>}
                                            <div className="w_50">
                                                <button type="button" className="btn_sel" 
                                                    onClick={()=>{
                                                        dispatch(appProfilePop2({appProfilePop2:true,appProfilePopTit2:"직업"}));
                                                    }}
                                                ><span className="ellipsis">{allData.t_job ? allData.t_job : "선택"}</span></button>
                                            </div>
                                        </li>
                                        <li>
                                            <p className="input_tit">상대방의 외모 점수</p>
                                            {errorVisual2 && <p className="alert_txt">상대방의 외모 점수를 입력하세요.</p>}
                                            <div className="w_50">
                                                <button type="button" className="btn_sel" 
                                                    onClick={()=>{
                                                        dispatch(appProfilePop2({appProfilePop2:true,appProfilePopTit2:"외모 점수"}));
                                                    }}
                                                ><span className="ellipsis">{allData.t_visual ? allData.t_visual+"점" : "선택"}</span></button>
                                            </div>
                                        </li>
                                        <li>
                                            <p className="input_tit">상대방의 MBTI</p>
                                            {errorMbti2 && <p className="alert_txt">상대방의 MBTI를 입력하세요.</p>}
                                            <div className="w_50">
                                                <button type="button" className="btn_sel" 
                                                    onClick={()=>{
                                                        dispatch(appProfilePop2({appProfilePop2:true,appProfilePopTit2:"MBTI"}));
                                                    }}
                                                ><span className="ellipsis">{allData.t_mbti ? allData.t_mbti : "선택"}</span></button>
                                            </div>
                                        </li>
                                        <li>
                                            <p className="input_tit">상대방의 타입</p>
                                            {errorType2 && <p className="alert_txt">상대방의 타입을 입력하세요.</p>}
                                            <button type="button" className="btn_sel" 
                                                onClick={()=>{
                                                    dispatch(appProfilePop2({appProfilePop2:true,appProfilePopTit2:"타입"}));
                                                }}
                                            ><span className="ellipsis">{allData.t_character && allData.t_character.length > 0 ? allData.t_character.join(", ") : "선택"}</span></button>
                                        </li>
                                        <li>
                                            <p className="input_tit">상대방은 흡연을</p>
                                            {errorSmok2 && <p className="alert_txt">상대방의 흡연여부를 입력하세요.</p>}
                                            <div className="w_50">
                                                <button type="button" className="btn_sel" 
                                                    onClick={()=>{
                                                        dispatch(appProfilePop2({appProfilePop2:true,appProfilePopTit2:"흡연 여부"}));
                                                    }}
                                                ><span className="ellipsis">{
                                                    allData.t_smok ?
                                                        allData.t_smok == "1" ? "한다"
                                                        :allData.t_smok == "2" ? "안 한다"
                                                        :allData.t_smok == "3" && "가끔 한다"
                                                    : "선택"
                                                }</span></button>
                                            </div>
                                        </li>
                                        <li>
                                            <p className="input_tit">상대방은 술을</p>
                                            {errorDrink2 && <p className="alert_txt">상대방의 음주여부를 입력하세요.</p>}
                                            <div className="w_50">
                                                <button type="button" className="btn_sel" 
                                                    onClick={()=>{
                                                        dispatch(appProfilePop2({appProfilePop2:true,appProfilePopTit2:"음주 여부"}));
                                                    }}
                                                    ><span className="ellipsis">{
                                                        allData.t_drink ?
                                                            allData.t_drink == "1" ? "한다"
                                                            :allData.t_drink == "2" ? "가끔 한다"
                                                            :allData.t_drink == "3" && "안 한다"
                                                        : "선택"
                                                    }</span></button>
                                            </div>
                                        </li>
                                        <li>
                                            <p className="input_tit">상대방의 종교</p>
                                            {errorReligion2 && <p className="alert_txt">상대방의 종교를 입력하세요.</p>}
                                            <div className="w_50">
                                                <button type="button" className="btn_sel" 
                                                    onClick={()=>{
                                                        dispatch(appProfilePop2({appProfilePop2:true,appProfilePopTit2:"종교"}));
                                                    }}
                                                ><span className="ellipsis">{allData.t_religion ? allData.t_religion : "선택"}</span></button>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="flex_end tp10">
                                    <button type="button" className="app_btn_s"
                                        onClick={()=>signupHandler("profileCheck")}
                                        disabled={step > 10 && usableProfile2 ? true : false}
                                    >다음</button>
                                </div>
                            </div> 
                        </div>
                    </div>
                }

                {/* 좋은결과 */}
                {step > 10 &&
                    <div className="signup_box">
                        <div className="flex_top">
                            <div className="img_box">
                                <img src={profile_img} alt="이미지" />
                            </div>
                            <div className="txt_box">
                                <p className="name">사소한 매니저 하니</p>
                                <div className="inner_box">
                                    <div className="tit_box">
                                        <p className="f_20 medium">고생하셨습니다! <br/>좋은 결과가 있을 거예요 :D</p>
                                    </div>
                                </div>
                                <div className="flex_end tp10">
                                    <button type="button" className="app_btn_s"
                                        onClick={()=>signupHandler("profileCheck2")}
                                        disabled={step > 11 ? true : false}
                                    >네!</button>
                                </div>
                            </div> 
                        </div>
                    </div>
                }

                {/* 회원가입 */}
                {step > 11 &&
                    <div className="signup_box">
                        <div className="flex_top">
                            <div className="img_box">
                                <img src={profile_img} alt="이미지" />
                            </div>
                            <div className="txt_box">
                                <p className="name">사소한 매니저 하니</p>
                                <div className="inner_box">
                                    <div className="tit_box">
                                        <p className="f_20 medium">감사합니다! <br/>사소한 매니저 "하니" 였습니다 :D <br/>행복한 하루 되세요!</p>
                                    </div>
                                </div>
                                <div className="flex_end tp10">
                                    <button type="button" className="app_btn_s"
                                        onClick={()=>signupHandler("signup")}
                                        disabled={step > 12 ? true : false}
                                    >다음</button>
                                </div>
                            </div> 
                        </div>
                    </div>
                }

            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}  
    </>);
};

export default SignUp2;