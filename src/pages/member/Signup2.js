import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDropzone } from 'react-dropzone';
import axios from "axios";
import moment from "moment/moment";
import { enum_api_uri } from "../../config/enum";
import * as CF from "../../config/function";
import { heightList, visualList, mbtiList, smokList, drinkList } from "../../config/constants";
import { confirmPop, imgPop, loadingPop } from "../../store/popupSlice";
import { signupCompletedName } from "../../store/userSlice";
import { phoneLogin } from "../../store/commonSlice";
import StepBox from "../../components/component/StepBox";
import MyInfoForm from "../../components/component/MyInfoForm";
import MyProfileForm from "../../components/component/MyProfileForm";
import MyProfileForm2 from "../../components/component/MyProfileForm2";
import ConfirmPop from "../../components/popup/ConfirmPop";


const Signup2 = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const api_uri = enum_api_uri.api_uri;
    const m_realname = enum_api_uri.m_realname;
    const m_id_check = enum_api_uri.m_id_check;
    const m_nick_check = enum_api_uri.m_nick_check;
    const m_address = enum_api_uri.m_address;
    const m_address2 = enum_api_uri.m_address2;
    const m_select_list = enum_api_uri.m_select_list;
    const feed_profile_add = enum_api_uri.feed_profile_add;
    const feed_profile_delt = enum_api_uri.feed_profile_delt;
    const text_check = enum_api_uri.text_check;
    const m_join = enum_api_uri.m_join;
    const tradeid = sessionStorage.getItem("tId");
    const popup = useSelector((state)=>state.popup);
    const [confirm, setConfirm] = useState(false);
    const [authFailConfirm, setAuthFailConfirm] = useState(false);
    const [loginConfirm, setLoginConfirm] = useState(false);
    const [realData ,setRealData] = useState({});
    const [values, setValues] = useState({});
    const [passShow, setPassShow] = useState({"password":false,"password2":false});
    const [focusInput, setFocusInput] = useState({});
    const [error, setError] = useState({});
    const [id, setId] = useState('');
    const [nick, setNick] = useState('');
    const [idChecked, setIdChecked] = useState(true);
    const [nickChecked, setNickChecked] = useState(true);
    const [addressList, setAddressList] = useState([]);
    const [addressList2, setAddressList2] = useState([]);
    const [address, setAddress] = useState('');
    const [address2, setAddress2] = useState('');
    const [selectList, setSelectList] = useState({});
    const [visual, setVisual] = useState("");
    const [like, setLike] = useState([]);
    const [type, setType] = useState([]);
    const [smok, setSmok] = useState("");
    const [drink, setDrink] = useState("");
    const [date, setDate] = useState([]);
    const [visual2, setVisual2] = useState("");
    const [type2, setType2] = useState([]);
    const [smok2, setSmok2] = useState("");
    const [drink2, setDrink2] = useState("");
    const [imgNameList, setImgNameList] = useState([]);
    const [imgList, setImgList] = useState([]);
    const [feedImgNameList, setFeedImgNameList] = useState([]);
    const [feedImgList, setFeedImgList] = useState([]);
    const [sideTabOn, setSideTabOn] = useState(1);
    const box1Ref = useRef(null);
    const box2Ref = useRef(null);
    const box3Ref = useRef(null);
    const [allAreaCheck, setAllAreaCheck] = useState(true);
    const [areaList, setAreaList] = useState([]);
    const [areaList2, setAreaList2] = useState([]);
    const [area, setArea] = useState('');
    const [area2, setArea2] = useState('');
    const [areaSelectList, setAreaSelectList] = useState([]);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
            setAuthFailConfirm(false);
            setLoginConfirm(false);
        }
    },[popup.confirmPop]);



    //연락처로그인페이지로 이동하기
    const onLoginPageMove = () => {
        dispatch(phoneLogin(true));
        navigate('/member/login');
    };


    useEffect(()=>{
        if(tradeid){
            getRealData();
        }
    },[tradeid]);



    //실명인증한 회원정보 가져오기
    const getRealData = () => {
        console.log(tradeid);
        axios.get(`${m_realname.replace(':tradeid',tradeid)}`)
        .then((res)=>{
            dispatch(loadingPop(false));
            if(res.status === 200){
                let data = res.data;

                let info = {};

                let gender;
                if(data.Sex == "F"){
                    gender = "2";
                }else if(data.Sex == "M"){
                    gender = "1";
                }
                info.m_name = data.Name;
                info.m_born = data.Socialno;
                info.m_c_phone = data.M_C_Phone;
                info.m_gender = gender;
                setRealData(info);
            }
        })
        .catch((error) => {
            dispatch(loadingPop(false));
            const err_msg = CF.errorMsgHandler(error);
            if(error.response.status === 409){//이미가입되어있는 정보일경우 로그인페이지로 이동
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt: err_msg,
                    confirmPopBtn:1,
                }));
                setLoginConfirm(true);
            }else{
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt: err_msg,
                    confirmPopBtn:1,
                }));
                setAuthFailConfirm(true);
            }
        })
    };


    //주소 시,도 가져오기
    const getAddress = () => {
        axios.get(`${m_address}`)
        .then((res)=>{
            if(res.status === 200){
                const data = res.data;
                setAddressList(data);  //나의프로필 - 거주지
                setAreaList(data);     //이상형프로필 - 선호지역
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


    //주소 시,도 셀렉트박스 선택시 구,군 가져오기 (이상형프로필 - 선호지역)
    const getArea2 = (code) => {
        axios.get(`${m_address2.replace(':parent_local_code',code)}`)
        .then((res)=>{
            if(res.status === 200){
                setAreaList2(res.data);
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


    //맨처음
    useEffect(()=>{
        //실명인증한 회원정보 가져오기
        dispatch(loadingPop(true));
        // setTimeout(()=>{
        //     console.log('실명인증한 회원정보 가져오기');
            
        //     getRealData();
        // },500);

        //주소 시,도 가져오기
        console.log('주소 시,도 가져오기');
        getAddress();

        //select 리스트 가져오기
        console.log('select 리스트 가져오기');
        getSelectList();
    },[]);


    //스크롤시 오른쪽탭 on
    const scrollSideTabOn = () => {
        const scroll = window.scrollY;
        const box1 = box1Ref.current.offsetTop;
        const box2 = box2Ref.current.offsetTop;
        const box3 = box3Ref.current.offsetTop;

        if(scroll >= box1 && scroll < box2){
            setSideTabOn(1);
        }
        if(scroll >= (box2 - 80) && scroll < box3){
            setSideTabOn(2);
        }
        if(scroll >= (box3 - 80)){
            setSideTabOn(3);
        }
    };

    useEffect(()=>{
        window.addEventListener('scroll', scrollSideTabOn);

        return () => {
            window.removeEventListener('scroll', scrollSideTabOn);
        };
    },[]);


    //input값 변경시
    const onInputChangeHandler = (e) => {
        let val = e.target.value;
        const id = e.target.id;
        const regExp = /[^a-z0-9_]/gi;

        //아이디 영문,소문자,_ 만 입력가능
        if(id == 'm_id'){
            if (regExp.test(val)) {
                val = val.replace(regExp, ''); // 허용된 문자만 남김
            }
    
            val = val.toLowerCase(); // 소문자로 변경
            setId(val);
        }
        if(id == 'm_n_name'){
            setNick(val);
        }

        //나의 키  
        if(id == 'm_height'){
            if(val == 0){
                val = '149';
            }
        }

        if(id !== 'm_id' && id !== 'm_n_name'){
            const newValues = {...values};
            newValues[id] = val;
            setValues(newValues); 
        }

        const newError = {...error};
        if(val.length > 0){
            newError[id] = false;
            setError(newError);
        }
    };


    //input 포커스
    const focusHandler = (e,val) => {
        const id = e.target.id;
        let newList = {...focusInput};
        newList[id] = val;
        
        setFocusInput(newList);
    };


    //비밀번호보기버튼 클릭시 토글
    const passShowHandler = (id) => {
        const newData = {...passShow};
        newData[id] = !newData[id];
        setPassShow(newData);
    };


    //아이디 값 변경시
    useEffect(()=>{
        if(id.length > 3){
            setIdChecked(false);
        }else{
            setIdChecked(true);
        }
    },[id]);


    //닉네임 값 변경시
    useEffect(()=>{
        if(nick.length > 1){
            setNickChecked(false);
        }else{
            setNickChecked(true);
        }
    },[nick]);


    //거주지값 변경시
    useEffect(()=>{
        const newError = {...error};
        newError.address = false;
        setError(newError);
    },[address]);


    //이상형 선호지역 변경시
    useEffect(()=>{
        const newError = {...error};
        if(allAreaCheck){
            newError.area = false;
        }else if(!allAreaCheck && areaSelectList.length >= 3){
            newError.area = false;
        }

        setError(newError);
    },[allAreaCheck, areaSelectList]);


    //아이디 중복확인
    const idCheckHandler = () => {
        const newError = {...error};

        if(id.length < 4){
            newError.m_id = true;
        }else if(/[^\w]/.test(id)){
            newError.m_id = false;
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'특수 문자는 불가합니다.',
                confirmPopBtn:1,
            }));
        }else{
            newError.m_id = false;
            
            axios.get(`${m_id_check.replace(':m_id',id)}`)
            .then((res)=>{
                if(res.status === 200){
                    setIdChecked(true);

                    setConfirm(true);
                    dispatch(confirmPop({
                        confirmPop:true,
                        confirmPopTit:'알림',
                        confirmPopTxt:'사용 가능한 아이디입니다.',
                        confirmPopBtn:1,
                    }));
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
            });
        }

        setError(newError);
    };


    //닉네임 부적격 체크하기
    const nickNameCheckHandler = () => {
        dispatch(loadingPop(true));

        const body = {
            text : nick,
        };

        axios.post(text_check,body)
        .then((res)=>{
            if(res.status === 200){
                dispatch(loadingPop(false));

                const data = res.data.result;
                //result = [긍정적%,부정적%]
                //부정적이 50% 이상이면 닉네임사용 불가능
                if(data[1] >= 50){
                    dispatch(confirmPop({
                        confirmPop:true,
                        confirmPopTit:'알림',
                        confirmPopTxt:'죄송합니다. 해당 닉네임은 부적절합니다. <br/>다른 닉네임을 입력해주세요.',
                        confirmPopBtn:1,
                    }));
                    setConfirm(true);
                }else{
                    nickCheckHandler(); //통과하면 닉네임 중복확인
                }
            }
        })
        .catch((error) => {
            dispatch(loadingPop(false));

            const err_msg = CF.errorMsgHandler(error);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: err_msg,
                confirmPopBtn:1,
            }));
            setConfirm(true);
        });
    };


    //닉네임 중복확인
    const nickCheckHandler = () => {
        const newError = {...error};

        if(nick.length < 2){
            newError.m_n_name = true;
        }else{
            newError.m_n_name = false;
            
            axios.get(`${m_nick_check}?m_n_name=${nick}`)
            .then((res)=>{
                if(res.status === 200){
                    setNickChecked(true);

                    setConfirm(true);
                    dispatch(confirmPop({
                        confirmPop:true,
                        confirmPopTit:'알림',
                        confirmPopTxt:'사용 가능한 닉네임입니다.',
                        confirmPopBtn:1,
                    }));
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
            });
        }

        setError(newError);
    };


    //나의관심사 체크박스
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


    //타입 체크박스
    const typeCheck = (checked, value, myType) => {
        // 나의 타입 일때
        if(myType){
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
        //상대방 타입 일때
        else{
            if (checked) {
                if(type2.length > 2){
                    setConfirm(true);
                    dispatch(confirmPop({
                        confirmPop:true,
                        confirmPopTit:'알림',
                        confirmPopTxt:'최대 3개까지 선택가능합니다.',
                        confirmPopBtn:1,
                    }));

                    setType2(type2.filter((el) => el !== value));
                }else{
                    setType2([...type2, value]);
                }
            } else if (!checked && type2.includes(value)) {
                setType2(type2.filter((el) => el !== value));
            }
        }
       
    }


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


    //이미지 첨부-----------------------------------------
    // 프로필사진 등록
    const { getRootProps: getRootProps1, getInputProps: getInputProps1 } = useDropzone({
        accept: {
            'image/*': []
        },
        multiple: true, // 여러 개의 파일 선택 가능하도록 설정
        onDrop: acceptedFiles => {
            const files = acceptedFiles.length + imgList.length;

            if(acceptedFiles.length === 0){
                return;
            }else if(files > 9){
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'프로필 사진은 최대 9개까지 첨부 가능합니다.',
                    confirmPopBtn:1,
                }));
                setConfirm(true);
            }else{
                const formData = new FormData();
                acceptedFiles.forEach((item)=>{
                    formData.append("media", item);
                });
                
                axios.post(feed_profile_add, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((res) => {
                    if (res.status === 201) {
                        const mediaUrls = res.data.mediaUrls;
                        const newList = [...imgList, ...mediaUrls];
                        setImgList(newList);
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
        }
    });

    // 피드프로필사진 등록
    const { getRootProps: getRootProps2, getInputProps: getInputProps2 } = useDropzone({
        accept: {
            'image/*': []
        },
        multiple: false, // 여러 개의 파일 선택 불가능하도록 설정
        onDrop: acceptedFiles => {
            const files = acceptedFiles.length + feedImgList.length;

            if(acceptedFiles.length === 0){
                return;
            }else if(files > 1){
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'피드 프로필은 최대 1개까지 첨부 가능합니다.',
                    confirmPopBtn:1,
                }));
                setConfirm(true);
            }else{
                const formData = new FormData();
                acceptedFiles.forEach((item)=>{
                    formData.append("media", item);
                });
                
                axios.post(feed_profile_add, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((res) => {
                    if (res.status === 201) {
                        const mediaUrls = res.data.mediaUrls;
                        const newList = [...feedImgList, ...mediaUrls];
                        setFeedImgList(newList);
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
        }
    });
   

    //프로필, 피드 이미지 삭제
    const handleRemove = (idx, url, type) => {
        const filename = url.substring(url.lastIndexOf('/') + 1);

        axios.delete(feed_profile_delt.replace(':filename',filename))
        .then((res)=>{
            if(res.status === 200){
                if(type == 'profile'){
                    let newList = [...imgList];
                    newList.splice(idx,1);
                    setImgList(newList);
                }
                if(type == 'feed'){
                    let newList = [...feedImgList];
                    newList.splice(idx,1);
                    setFeedImgList(newList);
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
        });

    };

    
    // 프로필사진 미리보기 생성
    const profileImgs = imgList.map((url,i) => (
        <li key={i}>
            <div onClick={()=>dispatch(imgPop({imgPop:true,imgPopSrc:url}))}>
                <img
                    src={url}
                    alt="이미지"
                />
            </div>
            <button className="btn_delt" onClick={() => handleRemove(i, url, 'profile')}>삭제버튼</button>
        </li>
    ));
    
    // 피드프로필사진 미리보기 생성
    const feedImgs = feedImgList.map((url,i) => (
        <li key={i}>
            <div onClick={()=>dispatch(imgPop({imgPop:true,imgPopSrc:url}))}>
                <img
                    src={url}
                    alt="이미지"
                />
            </div>
            <button className="btn_delt" onClick={() => handleRemove(i, url, 'feed')}>삭제버튼</button>
        </li>
    ));


    //프로필사진 이미지이름만 배열로 
    useEffect(()=>{
        const newNameList = imgList.map(url => {
            let updatedUrl = url.substring(url.lastIndexOf('/') + 1);
            return updatedUrl;
        });
        setImgNameList(newNameList);
    },[imgList]);

    //피드프로필사진 이미지이름만 배열로 
    useEffect(()=>{
        const newNameList = feedImgList.map(url => {
            let updatedUrl = url.substring(url.lastIndexOf('/') + 1);
            return updatedUrl;
        });
        setFeedImgNameList(newNameList);
    },[feedImgList]);
    //이미지 첨부-----------------------------------------


    //이상형 프로필 선호지역 전지역체크박스 체크시
    const onAllAreaCheckHandler = (checked) => {
        if(checked){
            setAllAreaCheck(true);

            setArea('');
            setArea2('');
            setAreaSelectList([]); //선택한지역 리스트 삭제
        }else{
            setAllAreaCheck(false);
        }
    };


    //이상형 프로필 선호지역 시,도 변경시
    const onAreaChangeHandler = (e) => {
        const val = e.currentTarget.value;
        const code = e.target.options[e.target.selectedIndex].getAttribute("data-code");
        setArea(val);
        getArea2(code);

        setArea2('');

        if(val == "세종특별자치시" && !areaSelectList.includes("세종")){
            if(areaSelectList.length > 9){
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'선호지역은 최대 10개까지만 선택해주세요.',
                    confirmPopBtn:1,
                }));
                setConfirm(true);
            }else{
                const updatedList = [...areaSelectList];
                    updatedList.push("세종");
                setAreaSelectList(updatedList);
            }
        }
    };


    //이상형 프로필 선호지역 구,군 변경시
    const onArea2ChangeHandler = (e) => {
        const val = e.currentTarget.value;
        setArea2(val);

        let address1_txt = area;
        if(address1_txt === "강원도"){
            address1_txt = "강원";
        }
        if(address1_txt === "경기도"){
            address1_txt = "경기";
        }
        if(address1_txt === "경상남도"){
            address1_txt = "경남";
        }
        if(address1_txt === "경상북도"){
            address1_txt = "경북";
        }
        if(address1_txt === "전라남도"){
            address1_txt = "전남";
        }
        if(address1_txt === "전라북도"){
            address1_txt = "전북";
        }
        if(address1_txt === "충청남도"){
            address1_txt = "충남";
        }
        if(address1_txt === "충청북도"){
            address1_txt = "충북";
        }
        if(address1_txt.includes("광역시")){
            address1_txt = address1_txt.replace("광역시","");
        }
        if(address1_txt.includes("특별시")){
            address1_txt = address1_txt.replace("특별시","");
        }
        if(address1_txt.includes("특별자치시")){
            address1_txt = address1_txt.replace("특별자치시","");
        }
        if(address1_txt.includes("특별자치도")){
            address1_txt = address1_txt.replace("특별자치도","");
        }

        if(val.length > 0){
            if(areaSelectList.length > 9){
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'선호지역은 최대 10개까지만 선택해주세요.',
                    confirmPopBtn:1,
                }));
                setConfirm(true);
            }else{
                const txt = address1_txt + " " + val;
                if(!areaSelectList.includes(txt)){
                    const updatedList = [...areaSelectList];
                        updatedList.push(txt);
                    setAreaSelectList(updatedList);
                }
            }
        }  
    };


    //이상형 프로필 선호지역 삭제하기
    const onAreaDeltHandler = (idx) => {
        // areaSelectList 배열에서 특정 인덱스의 값을 삭제하고 새로운 배열을 생성
        const updatedList = areaSelectList.filter((_, index) => index !== idx);

        // areaSelectList 상태를 새로운 배열로 업데이트
        setAreaSelectList(updatedList);
    };


    //이상형 프로필 선호지역 값 변경시 전지역 체크박스값 변경
    useEffect(()=>{
        if(areaSelectList.length > 0){
            setAllAreaCheck(false);
        }
    },[areaSelectList]);


    //입력값 체크
    const errorCheck = () => {
        const newError = {...error};

        //기본정보
        if(id.length === 0){
            newError.m_id = true;
        }
        if(!idChecked){
            newError.m_id = false;
        }
        if(!values.password || values.password.length === 0){
            newError.password = true;
        }
        if(values.password){
            let pw = values.password;
            let num = pw.search(/[0-9]/g);
            let eng = pw.search(/[a-z]/ig);
            let spe = pw.search(/[!@#$%^&*()]/g);   //숫자키 1~0까지 있는 특수문자만 사용

            if(pw.length < 8 || pw.length > 13){
                newError.password = true;
            }else if(pw.search(/\s/) != -1){
                newError.password = true;
            }else if(num < 0 || eng < 0 || spe < 0){
                newError.password = true;
            }else {
                newError.password = false;
            }
        }
        if(!values.password2 || values.password2.length === 0){
            newError.password2 = true;
        }
        if(values.password2){
            let pw = values.password;
            let pw2 = values.password2;
            if(pw !== pw2){
                newError.password2 = true;
            }else{
                newError.password2 = false;
            }
        }
        if(nick.length === 0){
            newError.m_n_name = true;
        }
        if(!nickChecked){
            newError.m_n_name = false;
        }
        //내 프로필정보
        if(address.length === 0){
            newError.address = true;
        }
        if(!values.m_height || values.m_height.length === 0){
            newError.m_height = true;
        }
        if(!values.m_job || values.m_job.length === 0){
            newError.m_job = true;
        }
        if(!values.m_mbti || values.m_mbti.length === 0){
            newError.m_mbti = true;
        }
        if(!values.m_religion || values.m_religion.length === 0){
            newError.m_religion = true;
        }
        if(!values.m_motive || values.m_motive.length === 0){
            newError.m_motive = true;
        }
        //이상형 정보
        if(!allAreaCheck && areaSelectList.length < 3){
            newError.area = true;
        }
        if(!values.t_height1 || values.t_height1.length === 0){
            newError.t_height1 = true;
        }
        if(!values.t_job || values.t_job.length === 0){
            newError.t_job = true;
        }
        if(!values.t_mbti || values.t_mbti.length === 0){
            newError.t_mbti = true;
        }
        if(!values.t_religion || values.t_religion.length === 0){
            newError.t_religion = true;
        }

        setError(newError);
    };


    //회원가입 완료버튼 클릭시
    const signupBtnClickHandler = () => {
        errorCheck();

        let pw = '';
        if(values.password){
            pw = values.password;
        }
        let num = pw.search(/[0-9]/g);
        let eng = pw.search(/[a-z]/ig);
        let spe = pw.search(/[!@#$%^&*()]/g);   //숫자키 1~0까지 있는 특수문자만 사용

        //기본정보
        if(id.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'아이디를 입력해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(!idChecked){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'아이디 중복확인을 해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(!values.password || values.password.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'비밀번호를 입력해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(pw.length < 8 || pw.length > 13){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'비밀번호를 영문, 숫자, 특수문자를 포함하여 8~12자 까지 입력해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(pw.search(/\s/) != -1){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'비밀번호를 영문, 숫자, 특수문자를 포함하여 8~12자 까지 입력해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(num < 0 || eng < 0 || spe < 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'비밀번호를 영문, 숫자, 특수문자를 포함하여 8~12자 까지 입력해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(!values.password2 || values.password2.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'비밀번호를 재입력해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(pw !== values.password2){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'비밀번호를 재입력해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(nick.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'닉네임을 입력해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(!nickChecked){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'닉네임 중복확인을 해주세요.',
                confirmPopBtn:1,
            }));
        }
        //내 프로필정보
        else if(address.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'거주지를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(!values.m_height || values.m_height.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'나의 키를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(!values.m_job || values.m_job.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'나의 직업을 선택해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(visual.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'나의 외모점수를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(like.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'나의 관심사를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(!values.m_mbti || values.m_mbti.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'나의 MBTI를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(type.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'나의 타입을 선택해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(smok.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'나의 흡연 여부를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(drink.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'나의 음주 여부를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(!values.m_religion || values.m_religion.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'나의 종교를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(date.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'선호하는 데이트를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(!values.m_motive || values.m_motive.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'가입경로를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(imgList.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'프로필 사진을 등록해주세요.',
                confirmPopBtn:1,
            }));
        }
        //이상형 정보
        else if(!allAreaCheck && areaSelectList.length < 3){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'선호지역은 전지역 또는 최소 3개를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(!values.t_height1 || values.t_height1.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'상대방의 키를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(!values.t_job || values.t_job.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'상대방의 직업을 선택해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(visual2.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'상대방의 외모점수를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(!values.t_mbti || values.t_mbti.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'상대방의 MBTI를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(type2.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'상대방의 타입을 선택해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(smok2.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'상대방의 흡연 여부를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(drink2.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'상대방의 음주 여부를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(!values.t_religion || values.t_religion.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'상대방의 종교를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }else{
            signupHandler();
        }
    };


    //회원가입 하기
    const signupHandler = () => {
        let addr;
        if(address2.length > 0){
            addr = address + " " + address2;
        }else{
            addr = address;
        }

        let t_height = values.t_height1.split(',');
        let t_height1 = t_height[0];
        let t_height2 = t_height[1];

        let feedImg = '';
        if(feedImgNameList.length > 0){
            feedImg = feedImgNameList[0];
        }


        let address_detail = [];
        if(allAreaCheck){
            address_detail = ['전지역'];
        }else{
            address_detail = areaSelectList;
        }

        const body = {
            m_name: realData.m_name,
            m_born: realData.m_born,
            m_c_phone: realData.m_c_phone,
            m_gender: realData.m_gender,
            m_id: id,
            m_password: values.password,
            m_n_name: nick,
            m_address: addr,
            m_height: values.m_height,
            m_job: values.m_job,
            m_visual: visual,
            m_like: like,
            m_mbti: values.m_mbti,
            m_character: type,
            m_smok: smok,
            m_drink: drink,
            m_religion: values.m_religion,
            m_date: date,
            m_motive: values.m_motive,
            pic: imgNameList,
            t_height1: t_height1,
            t_height2: t_height2,
            t_job: values.t_job,
            t_visual: visual2,
            t_mbti: values.t_mbti,
            t_character: type2,
            t_smok: smok2,
            t_drink: drink2,
            t_religion: values.t_religion,
            app_token: "",
            feed_profile_image: feedImg,
            m_address_detail: address_detail
        };

        axios.post(`${m_join}`,body)
        .then((res)=>{
            if(res.status === 200){
                //회원가입완료한 회원이름 store 에 저장
                const name = res.data.m_name;
                dispatch(signupCompletedName(name));

                //회원가입 완료 페이지로 이동
                navigate('/member/signup3');

                //sessionStorage tradeid 삭제
                sessionStorage.removeItem("tId");
            }
        })
        .catch((error) => {
            let err_msg;
            if(error.response.status === 422){
                err_msg = error.response.data.errors[0].msg;
            }else{
                err_msg = CF.errorMsgHandler(error);
            }

            if(error.response.status === 409){//이미가입되어있는 정보일경우 로그인페이지로 이동
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt: err_msg,
                    confirmPopBtn:1,
                }));
                setLoginConfirm(true);
            }else{
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt: err_msg,
                    confirmPopBtn:1,
                }));
                setAuthFailConfirm(true);
            }
        }); 
    };


    return(<>
        <div className="signup_wrap signup_wrap2">
            <div className="cont">
                <div className="form_cont" id="box1" ref={box1Ref}>
                    <div className="tit_box">
                        <p className="tit">회원가입</p>
                        <StepBox onIdx={2} />
                    </div>
                    <ul className="side_tab_box mo_none">
                        <li className={sideTabOn === 1 ? 'on' : ''}><a href="#box1">1. 기본정보</a></li>
                        <li className={sideTabOn === 2 ? 'on' : ''}><a href="#box2">2. 내 프로필</a></li>
                        <li className={sideTabOn === 3 ? 'on' : ''}><a href="#box3">3. 이상형 정보</a></li>
                    </ul>
                    <div className="form_box">
                        <div className="box">
                            <p className="tit"><strong>1. 기본정보</strong>를 입력해 보세요.</p>
                            <div className="my_box">
                                <p>본인인증이 완료되었습니다!</p>
                                <div className="flex_between flex_wrap">
                                    <p className="txt flex"><strong>{realData.m_name}</strong><span>{realData.m_c_phone && realData.m_c_phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")}</span></p>
                                    <p className="txt2 flex"><span>{realData.m_born && moment(realData.m_born).format("YYYY.MM.DD")}</span><span className={realData.m_gender && realData.m_gender == 1 ? '' : 'w'}>{realData.m_gender && realData.m_gender == 1 ? '남' : '여'}</span></p>
                                </div>
                            </div>
                            <ul className="form_ul2">
                                <MyInfoForm 
                                    focusInput={focusInput}
                                    values={values}
                                    id={id}
                                    nick={nick}
                                    onInputChangeHandler={onInputChangeHandler}
                                    focusHandler={focusHandler}
                                    error={error}
                                    passShow={passShow}
                                    passShowHandler={passShowHandler}
                                    idChecked={idChecked}
                                    nickChecked={nickChecked}
                                    idCheckHandler={idCheckHandler}
                                    nickCheckHandler={nickNameCheckHandler}
                                    editId={true}
                                />
                            </ul>
                        </div>
                        <div className="box" id="box2" ref={box2Ref}>
                            <p className="tit"><strong>2. 내 프로필 정보</strong>로 어필해 보세요!</p>
                            <ul className="form_ul2">
                                <MyProfileForm
                                    values={values}
                                    onInputChangeHandler={onInputChangeHandler}
                                    error={error}
                                    address={address}
                                    setAddress={setAddress}
                                    address2={address2}
                                    setAddress2={setAddress2}
                                    getAddress2={getAddress2}
                                    addressList={addressList}
                                    addressList2={addressList2}
                                    heightList={heightList}
                                    selectList={selectList}
                                    visualList={visualList}
                                    visual={visual}
                                    setVisual={setVisual}
                                    like={like}
                                    likeCheck={likeCheck}
                                    mbtiList={mbtiList}
                                    type={type}
                                    typeCheck={typeCheck}
                                    smokList={smokList}
                                    smok={smok}
                                    setSmok={setSmok}
                                    drinkList={drinkList}
                                    drink={drink}
                                    setDrink={setDrink}
                                    date={date}
                                    dateCheck={dateCheck}
                                    profileImgs={profileImgs}
                                    getRootProps1={getRootProps1}
                                    getInputProps1={getInputProps1}
                                    feedImgs={feedImgs}
                                    getRootProps2={getRootProps2}
                                    getInputProps2={getInputProps2}
                                />
                            </ul>
                        </div>
                        <div className="box" id="box3" ref={box3Ref}>
                            <p className="tit"><strong>3. 이상형 정보</strong>를 입력해 보세요.</p>
                            <ul className="form_ul2">
                                <MyProfileForm2
                                    allAreaCheck={allAreaCheck}
                                    onAllAreaCheckHandler={onAllAreaCheckHandler}
                                    areaList={areaList}
                                    areaList2={areaList2}
                                    area={area}
                                    area2={area2}
                                    onAreaChangeHandler={onAreaChangeHandler}
                                    onArea2ChangeHandler={onArea2ChangeHandler}
                                    areaSelectList={areaSelectList}
                                    onAreaDeltHandler={onAreaDeltHandler}

                                    values={values}
                                    onInputChangeHandler={onInputChangeHandler}
                                    error={error}
                                    heightList={heightList}
                                    selectList={selectList}
                                    visualList={visualList}
                                    visual2={visual2}
                                    setVisual2={setVisual2}
                                    mbtiList={mbtiList}
                                    type2={type2}
                                    typeCheck={typeCheck}
                                    smokList={smokList}
                                    smok2={smok2}
                                    setSmok2={setSmok2}
                                    drinkList={drinkList}
                                    drink2={drink2}
                                    setDrink2={setDrink2}
                                />
                            </ul>
                        </div>
                        <div className="box">
                            <p className="txt">고생하셨어요! 좋은 결과가 있을 거예요.</p>
                            <button type="button" className="btn_type3" onClick={signupBtnClickHandler}>회원가입 완료</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 이미가입되어있는정보 - 로그인페이지이동 confirm팝업 */}
        {loginConfirm && <ConfirmPop closePop="custom" onCloseHandler={onLoginPageMove} />}

        {/* 실명인증 실패 confirm팝업 */}
        {authFailConfirm && <ConfirmPop closePop="custom" onCloseHandler={()=>navigate('/member/signup')} />}

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default Signup2;