import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useDropzone } from 'react-dropzone';
import axios from "axios";
import Cookies from 'js-cookie';
import { enum_api_uri } from "../../config/enum";
import { heightList, visualList, mbtiList, smokList, drinkList } from "../../config/constants";
import * as CF from "../../config/function";
import { confirmPop, loadingPop, profileEditPop, imgPop } from "../../store/popupSlice";
import { myPageRefresh } from "../../store/commonSlice";
import { userInfo, userToken, userRank } from "../../store/userSlice";
import ConfirmPop from "../../components/popup/ConfirmPop";
import MyProfileForm from "../../components/component/MyProfileForm";
import MyProfileForm2 from "../../components/component/MyProfileForm2";
import none_profile from "../../images/none_profile2.jpg";
import feed_tip_box_img from "../../images/feed_tip_box_img.svg";
import profile_tip_box_img from "../../images/profile_tip_box_img.svg";


const Mypage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const all_profile = enum_api_uri.all_profile;
    const rank_token = enum_api_uri.rank_token;
    const m_address = enum_api_uri.m_address;
    const m_address2 = enum_api_uri.m_address2;
    const m_select_list = enum_api_uri.m_select_list;
    const feed_profile_add = enum_api_uri.feed_profile_add;
    const feed_profile_delt = enum_api_uri.feed_profile_delt;
    const profile_modify = enum_api_uri.profile_modify;
    const profile2_modify = enum_api_uri.profile2_modify;
    const popup = useSelector((state)=>state.popup);
    const user = useSelector((state)=>state.user);
    const common = useSelector((state)=>state.common);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [confirm, setConfirm] = useState(false);
    const [tabOn, setTabOn] = useState(1);
    const [myInfo, setMyInfo] = useState({});
    const [feedProfile, setFeedProfile] = useState({});
    const [profile, setProfile] = useState({});
    const [profile2, setProfile2] = useState({});
    const [userClassNum, setUserClassNum] = useState(null);
    const [values, setValues] = useState({});
    const [error, setError] = useState({});
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
    const [getRank, setGetRank] = useState(false);
    const [myBasicInfo, setMyBasicInfo] = useState(false);
    const [deltImgList, setDeltImgList] = useState([]);
    const [allAreaCheck, setAllAreaCheck] = useState(false);
    const [areaList, setAreaList] = useState([]);
    const [areaList2, setAreaList2] = useState([]);
    const [area, setArea] = useState('');
    const [area2, setArea2] = useState('');
    const [areaSelectList, setAreaSelectList] = useState([]);

    

    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);


    //화면사이즈 변경될때 width 체크---------
    useEffect(() => {
        const handleWindowResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    },[]);


    //전체 회원정보 가져오기
    const getAllProfile = () => {
        axios.get(all_profile,{
            headers: {
                Authorization: `Bearer ${user.userToken}`,
            },
        })
        .then((res)=>{
            if(res.status === 200){
                const data = res.data;
                const my_info = data.my_info;
                const my_type = data.my_type;
                const ideal_type = data.ideal_type;
                setMyInfo(my_info);
                setProfile(my_type);
                setProfile2(ideal_type);

                //기본정보값 있는지 없는지
                setMyBasicInfo(my_info.modify_flag);

                const newUserInfo = {...user.userInfo};
                newUserInfo.m_id = my_info.m_id;
                newUserInfo.m_n_name = my_info.m_n_name;
                newUserInfo.m_address_origin = my_type.m_address_origin;
                newUserInfo.m_address_full = my_type.m_address_full;
                newUserInfo.m_address = my_type.m_address;
                newUserInfo.m_f_photo = my_info.feed_profile;
                dispatch(userInfo(newUserInfo));
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


    //회원 피드프로필 가져오기
    const getFeddProfile = () => {
        dispatch(loadingPop(true));
        setGetRank(false);

        const body = {
            token: user.userToken
        };
        axios.post(rank_token,body)
        .then((res)=>{
            if(res.status === 200){
                dispatch(loadingPop(false));
                setGetRank(true);

                let data = res.data;
                let feedData = {};
                if(data.flag){
                    let diff_num = data.diff_rank;
                    let tag;

                    //순위
                    if(data.diff_rank == 0){
                        tag = "";
                    }else{
                        if(data.diff_rank.includes("-")){
                            tag = " down";
                            diff_num = diff_num.replace("-","");
                        }else{
                            tag = " up";
                        }
                    }

                    if(diff_num > 9999){
                        diff_num = 9999;
                    }

                    let isClass = false;
                    if(data.class_number > 0){
                        isClass = true;
                    }

                    let myPhoto = false;
                    if(data.m_f_photo.length > 0){
                        myPhoto = true;
                    }

                    data.tag = tag;
                    data.diff_num = diff_num;
                    data.isClass = isClass;
                    data.myPhoto = myPhoto;
                    feedData = data;
                }

                setFeedProfile(feedData);

                //회원랭킹정보 store 에 저장
                const resultData = res.data;
                let rank = false;
                let rankData = {};
                if(resultData.flag){
                    rank = true;
                    rankData = data;
                }
                dispatch(userRank({userRank:rank, userRankData:rankData}));
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


    //주소 시,도 셀렉트박스 선택시 구,군 가져오기 (나의프로필 - 거주지)
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
        //주소 시,도 가져오기
        getAddress();

        //select 리스트 가져오기
        getSelectList();

        //모든회원정보 가져오기
        getAllProfile();

        //회원피드프로필 가져오기
        getFeddProfile();
    },[]);


    //회원정보 변경시 정보 다시가져오기
    useEffect(()=>{
        if(common.myPageRefresh){
            dispatch(myPageRefresh(false));
            getAddress();
            getSelectList();
            getAllProfile();
            getFeddProfile();
        }
    },[common.myPageRefresh]);

    
    useEffect(()=>{
        if(profile.m_address){
            let addr = '';
            if(profile.m_address.includes('·')){
                addr = profile.m_address.replace('·','');
            }else{
                addr = profile.m_address;
            }
            profile.m_address = addr;
            setProfile(profile);
        }
    },[profile]);


    //회원 랭킹정보 - 클래스번호 값 가져오기
    useEffect(()=>{
        if(user.userRank){
            const num = user.userRankData.class_number;
            setUserClassNum(num);
        }else{
            setUserClassNum(null);
        }
    },[user.userRank, user.userRankData]);


    //나의프로필, 이상형프로필 정보 값 가져왔을때 적용
    useEffect(()=>{
        let newValues = {...values};

        //나의 키
        if(profile.m_height){
            newValues.m_height = profile.m_height;
        }
        //나의 직업
        if(selectList.job && profile.m_job){
            newValues.m_job = profile.m_job;
        }
        //나의 외모점수
        if(profile.m_visual){
            setVisual(profile.m_visual);
        }
        //나의 관심사
        if(selectList.interest && profile.m_like){
            setLike(profile.m_like);
        }
        //나의 MBTI
        if(profile.m_mbti){
            newValues.m_mbti = profile.m_mbti;
        }
        //나의 타입
        if(selectList.character && profile.m_character){
            setType(profile.m_character);
        }
        //나의 흡연여부
        if(profile.m_smok){
            setSmok(profile.m_smok);
        }
        //나의 음주여부
        if(profile.m_drink){
            setDrink(profile.m_drink);
        }
        //나의 종교
        if(profile.m_religion){
            newValues.m_religion = profile.m_religion;
        }
        //나의 선호하는데이트
        if(profile.m_date){
            setDate(profile.m_date);
        }
        //나의 가입경로
        if(profile.m_motive){
            newValues.m_motive = profile.m_motive;
        }

        //이상형 선호지역
        if(profile.m_address_detail && profile.m_address_detail.length > 0){
            if(profile.m_address_detail.includes('전지역')){
                setAllAreaCheck(true);
            }else{
                setAllAreaCheck(false);
                setAreaSelectList([...profile.m_address_detail]);
            }
        }

        //이상형 키
        if(profile2.t_height1 && profile2.t_height2){
            let t_height = profile2.t_height1+','+profile2.t_height2;
            newValues.t_height1 = t_height;
        }
        //이상형 직업
        if(selectList.job && profile2.t_job){
            newValues.t_job = profile2.t_job;
        }
        //이상형 외모점수
        if(profile2.t_visual){
            setVisual2(profile2.t_visual);
        }
        //이상형 MBTI
        if(profile2.t_mbti){
            newValues.t_mbti = profile2.t_mbti;
        }
        //이상형 타입
        if(selectList.character && profile2.t_character){
            setType2(profile2.t_character);
        }
        //이상형 흡연여부
        if(profile2.t_smok){
            setSmok2(profile2.t_smok);
        }
        //이상형 음주여부
        if(profile2.t_drink){
            setDrink2(profile2.t_drink);
        }
        //이상형 종교
        if(profile2.t_religion){
            newValues.t_religion = profile2.t_religion;
        }

        setValues(newValues);
    },[profile, profile2, selectList]);


    //나의프로필정보 거주지 주소 시,도 값 있을때
    useEffect(()=>{
        if(addressList.length > 0 && profile.m_address_full){
            let addrArray = [];
            let addr1 = "";
        
            if(profile.m_address_full.includes(" ")){
                addrArray = profile.m_address_full.split(" ");
                addr1 = addrArray[0];
                setAddress(addr1);

                const matchingItem = addressList.find(item => item.sido_gugun == addr1);
                let code;
                if (matchingItem) {
                    code = matchingItem.local_code;
                } 
                getAddress2(code);
            }else{
                addr1 = profile.m_address_full;
                setAddress(addr1);
            }
        }
    },[addressList, profile]);

    //나의프로필정보 거주지 주소 구,군 값 있을때
    useEffect(()=>{
        if(addressList2.length > 0 && profile.m_address_full){
            let addrArray = [];

            if(profile.m_address_full.includes(" ")){
                addrArray = profile.m_address_full.split(" ");
                setAddress2(addrArray[1]);
            }
        }
    },[addressList2, profile]);


    //회원 기본정보값 가져왔을때 프로필,피드 이미지 적용
    useEffect(()=>{
        if(myInfo.my_profile){
            const newImgList = myInfo.my_profile.filter(item => item.length > 0);
            setImgList(newImgList);
        }
        if(myInfo.feed_profile){
            setFeedImgList([myInfo.feed_profile]);
        }
    },[myInfo]);
    
    
    //input값 변경시
    const onInputChangeHandler = (e) => {
        let val = e.target.value;
        const id = e.target.id;

        //나의 키  
        if(id == 'm_height'){
            if(val == 0){
                val = '149';
            }
        }

        const newValues = {...values};
        newValues[id] = val;
        setValues(newValues); 

        const newError = {...error};
        if(val.length > 0){
            newError[id] = false;
            setError(newError);
        }
    };


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
                        const newList = [ ...mediaUrls];
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
    const handleRemove = (idx, type) => {
        const newDeltImgList = [...deltImgList];
        let imgName = '';

        if(type == 'profile'){
            let newList = [...imgList];
            newList.splice(idx,1);
            setImgList(newList);

            imgName = imgNameList[idx];
        }
        if(type == 'feed'){
            let newList = [...feedImgList];
            newList.splice(idx,1);
            setFeedImgList(newList);

            imgName = feedImgNameList[idx];
        }

        //삭제할 이미지 배열로 저장
        newDeltImgList.push(imgName);
        setDeltImgList(newDeltImgList);  
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
            <button className="btn_delt" onClick={() => handleRemove(i, 'profile')}>삭제버튼</button>
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
            <button className="btn_delt" onClick={() => handleRemove(i, 'feed')}>삭제버튼</button>
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

        //내 프로필정보
        if(tabOn === 1){
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
        }

        //이상형 정보
        if(tabOn === 2){
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
        }

        setError(newError);
    };


    //프로필수정 버튼 클릭시
    const editBtnClickHandler = () => {
        errorCheck();

        let tab = tabOn;
        //내 프로필정보
        if(address.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'거주지를 선택해주세요.',
                confirmPopBtn:1,
            }));
            tab = 1;
        }
        else if(!values.m_height || values.m_height.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'나의 키를 선택해주세요.',
                confirmPopBtn:1,
            }));
            tab = 1;
        }
        else if(!values.m_job || values.m_job.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'나의 직업을 선택해주세요.',
                confirmPopBtn:1,
            }));
            tab = 1;
        }
        else if(visual.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'나의 외모점수를 선택해주세요.',
                confirmPopBtn:1,
            }));
            tab = 1;
        }
        else if(like.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'나의 관심사를 선택해주세요.',
                confirmPopBtn:1,
            }));
            tab = 1;
        }
        else if(!values.m_mbti || values.m_mbti.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'나의 MBTI를 선택해주세요.',
                confirmPopBtn:1,
            }));
            tab = 1;
        }
        else if(type.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'나의 타입을 선택해주세요.',
                confirmPopBtn:1,
            }));
            tab = 1;
        }
        else if(smok.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'나의 흡연 여부를 선택해주세요.',
                confirmPopBtn:1,
            }));
            tab = 1;
        }
        else if(drink.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'나의 음주 여부를 선택해주세요.',
                confirmPopBtn:1,
            }));
            tab = 1;
        }
        else if(!values.m_religion || values.m_religion.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'나의 종교를 선택해주세요.',
                confirmPopBtn:1,
            }));
            tab = 1;
        }
        else if(date.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'선호하는 데이트를 선택해주세요.',
                confirmPopBtn:1,
            }));
            tab = 1;
        }
        else if(!values.m_motive || values.m_motive.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'가입경로를 선택해주세요.',
                confirmPopBtn:1,
            }));
            tab = 1;
        }
        else if(imgList.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'프로필 사진을 등록해주세요.',
                confirmPopBtn:1,
            }));
            tab = 1;
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
            tab = 2;
        }
        else if(!values.t_height1 || values.t_height1.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'상대방의 키를 선택해주세요.',
                confirmPopBtn:1,
            }));
            tab = 2;
        }
        else if(!values.t_job || values.t_job.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'상대방의 직업을 선택해주세요.',
                confirmPopBtn:1,
            }));
            tab = 2;
        }
        else if(visual2.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'상대방의 외모점수를 선택해주세요.',
                confirmPopBtn:1,
            }));
            tab = 2;
        }
        else if(!values.t_mbti || values.t_mbti.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'상대방의 MBTI를 선택해주세요.',
                confirmPopBtn:1,
            }));
            tab = 2;
        }
        else if(type2.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'상대방의 타입을 선택해주세요.',
                confirmPopBtn:1,
            }));
            tab = 2;
        }
        else if(smok2.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'상대방의 흡연 여부를 선택해주세요.',
                confirmPopBtn:1,
            }));
            tab = 2;
        }
        else if(drink2.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'상대방의 음주 여부를 선택해주세요.',
                confirmPopBtn:1,
            }));
            tab = 2;
        }
        else if(!values.t_religion || values.t_religion.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'상대방의 종교를 선택해주세요.',
                confirmPopBtn:1,
            }));
            tab = 2;
        }else{
            editHandler();
        }

        setTabOn(tab);
    };

    
    //프로필 수정진행 -> 삭제할이미지 있으면 삭제후 프로필수정
    const editHandler = () => {
        if(deltImgList.length > 0){
            // 삭제할 이미지가 있는 경우 각 이미지를 순회하며 삭제
            deltImgList.forEach((imageName, index) => {
                profileImgDelt(imageName, index === deltImgList.length - 1); // 각 이미지를 삭제하는 함수 호출
            });
        }else{
            profileEdit();
        }
    };


    //프로필 이미지 삭제하기
    const profileImgDelt = (imageName, isLast) => {
        axios.delete(feed_profile_delt.replace(':filename',imageName))
        .then((res)=>{
            if(res.status === 200){
                if (isLast) {
                    // 마지막 이미지 삭제 후 프로필 수정 함수 호출
                    profileEdit();
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


    //나의 프로필수정하기
    const profileEdit = () => {
        let addr;
        if(address2.length > 0){
            addr = address + " " + address2;
        }else{
            addr = address;
        }

        const body = {
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
            photo: imgNameList,
            feed_photo: feedImgNameList,
        };

        axios.put(`${profile_modify}`,body,
            {headers:{Authorization: `Bearer ${user.userToken}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                profile2Edit(); //나의프로필 수정완료후 이상형프로필수정하기
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


    //이상형프로필 수정하기
    const profile2Edit = () => {
        let t_height = values.t_height1.split(',');
        let t_height1 = t_height[0];
        let t_height2 = t_height[1];

        let address_detail = [];
        if(allAreaCheck){
            address_detail = ['전지역'];
        }else{
            address_detail = areaSelectList;
        }

        const body = {
            t_height1: t_height1,
            t_height2: t_height2,
            t_job: values.t_job,
            t_visual: visual2,
            t_mbti: values.t_mbti,
            t_character: type2,
            t_smok: smok2,
            t_drink: drink2,
            t_religion: values.t_religion,
            m_address_detail: address_detail
        };

        axios.put(`${profile2_modify}`,body,
            {headers:{Authorization: `Bearer ${user.userToken}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                setConfirm(true);
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'프로필이 수정되었습니다.',
                    confirmPopBtn:1,
                }));

                dispatch(myPageRefresh(true));
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


    //피드 프로필 프로필수정 버튼 클릭시
    const feedProfileEditHandler = () => {
        const data = {
            m_n_name: feedProfile.m_n_name,
            photo: feedProfile.m_f_photo
        };
        dispatch(profileEditPop({profileEditPop:true,profileEditPopData:data}));
    };


    //로그아웃하기
    const logoutHandler = () => {
        dispatch(userInfo({}));
        Cookies.set('userLogin',false);
        dispatch(userToken(''));
        dispatch(userRank({userRank:false, userRankData:{}}));
        Cookies.remove('refreshT');
        localStorage.removeItem('expiresAt');

        navigate('/');
    };



    return(<>
        <div className="gray_wrap">
            <div className="cont3">
                <div className="mypage_cont flex_top flex_between flex_wrap">
                    <p className="top_tit"><strong>{myInfo.m_n_name} 님,</strong> 반가워요!</p>
                    <div className="info_box shadow_box">
                        <div className="profile_box">
                            <div className={`profile_img_box${user.userRank ? ' class_'+userClassNum : ''}`}>
                                <div className='img'>
                                    <div><img src={imgList.length > 0 ? imgList[0] : none_profile} alt='프로필이미지' /></div>
                                </div>
                            </div>
                            <div className="txt_box">
                                <p className="txt1">{myInfo.m_n_name}</p>
                                <p className="txt2">{myInfo.m_id}</p>
                                <ul className='gray_name_box flex_wrap'>
                                    <li>{myInfo.m_name}</li>
                                    <li>{profile.m_address} / {user.userInfo.birth}</li>
                                </ul>
                            </div>
                        </div>
                        <div className="btn_box tx_c">
                            <Link to='/member/mypage/myinfo' className="btn_edit">기본정보 수정</Link>
                            <button type="button" className="btn_logout" onClick={logoutHandler}>로그아웃</button>
                        </div>
                    </div>  
                    <div className="feed_profile_box">
                        <div className="box">
                            <div className="box_tit flex_between">
                                <p>피드 프로필</p>
                                <div className="tip_box tip_box2">
                                    <p className="tip_txt">피드프로필이란?</p>
                                    <div className="box">
                                        <img src={feed_tip_box_img} alt="말풍선이미지" />
                                    </div>
                                </div>
                            </div>
                            <div className="ranking_ul_box">
                                <ul className="top_ul">
                                    <li>순위</li>
                                    <li>{windowWidth > 767 ? "레벨" : "닉네임 / 클래스 / 레벨"}</li>
                                    <li>닉네임</li> 
                                    <li>클래스</li>
                                </ul>
                                {Object.keys(feedProfile).length > 0 ?
                                    <ul className="list_ul">
                                        <li>
                                            <div className="box rank_box flex_center">
                                                <div className="flex_center">
                                                    {feedProfile.rank < 4 && <img src={require(`../../images/medal_${feedProfile.rank}.svg`)} alt="메달이미지" />}
                                                    <p>{CF.MakeIntComma(feedProfile.rank)}<span>위</span></p>
                                                </div>
                                                <div className={`tag flex_center${feedProfile.tag}`}><span>{feedProfile.tag.length > 0 ? CF.MakeIntComma(feedProfile.diff_num) : "-"}</span></div>
                                            </div>
                                            <div className="box name_box my_data">
                                                <div className="inner_box flex_start flex_wrap">
                                                    <div className="flex_top">
                                                        <div className={`profile_img_box class_${feedProfile.class_number}`}>   
                                                            <div className='img'>
                                                                <div>
                                                                    {feedProfile.myPhoto ?
                                                                        <img src={feedProfile.m_f_photo} alt="프로필이미지" />
                                                                        :<img src={none_profile} alt="프로필이미지" />
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className={`name${feedProfile.M_N_Name_modify === 1 ? ' color_black' : ''}`}>{feedProfile.m_n_name}</p>
                                                    </div>
                                                </div>
                                                <div className="mo_show">
                                                    <ul className="flex_wrap">
                                                        {feedProfile.isClass && <li><img src={require(`../../images/class_img${feedProfile.class_number}.png`)} alt="클래스이미지" /></li>}
                                                        <li className="flex">
                                                            <span>LV.</span>
                                                            <p>{CF.MakeIntComma(feedProfile.level)}</p>
                                                        </li>
                                                    </ul>
                                                    <button type="button" className="btn_edit tm5" onClick={feedProfileEditHandler}>프로필 수정</button>
                                                </div>
                                                <button type="button" className="btn_edit mo_none" onClick={feedProfileEditHandler}>프로필 수정</button>
                                            </div>
                                            <div className="box class_box flex_center">
                                                {feedProfile.isClass && <img src={require(`../../images/class_img${feedProfile.class_number}.png`)} alt="클래스이미지" />}
                                            </div>
                                            <div className="box level_box flex_center">
                                                <span>LV.</span>
                                                <p>{CF.MakeIntComma(feedProfile.level)}</p>
                                            </div>
                                        </li>
                                    </ul>
                                    : getRank && <div className="none_data">랭킹 정보를 찾을 수 없습니다. <br/>이는 서비스를 한 번도 이용하지 않았거나, <br/>마지막 소개 이후 1년 이상 경과한 회원에게 해당됩니다.</div>
                                }
                            </div>
                        </div>
                        <div className="box profile_box">
                            <div className="box_tit flex_between">
                                <p>소개팅 프로필</p>
                                <div className="tip_box tip_box2">
                                    <p className="tip_txt">소개팅프로필이란?</p>
                                    <div className="box">
                                        <img src={profile_tip_box_img} alt="말풍선이미지" />
                                    </div>
                                </div>
                            </div>
                            <div className="shadow_box">
                                <ul className="tab_type1 flex">
                                    <li className={tabOn === 1 ? 'on' : ''} onClick={()=>setTabOn(1)}>나의 프로필</li>
                                    <li className={tabOn === 2 ? 'on' : ''} onClick={()=>setTabOn(2)}>이상형 프로필</li>
                                </ul>
                                <div className="cont">
                                    <div className="inner">
                                        {!myBasicInfo ? 
                                            <div className="none_info_box tx_c">
                                                <p className="top_tit"><strong>기본 정보를 입력해 주세요.</strong></p>
                                                <p className="txt">기본정보를 입력하면 소개팅 프로필을 입력하실 수 있어요. <br/>더 좋은 인연과의 만남을 위해 기본정보를 수정해 주세요.</p>
                                                <Link to={`/member/mypage/myinfo`} className="btn_type4">기본정보 수정</Link>
                                            </div>
                                        : myBasicInfo && tabOn === 1 ? //나의 프로필일때
                                            <>
                                                <p className="top_tit"><strong>내 프로필 정보</strong>로 어필해 보세요!</p>
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
                                            </>
                                        : myBasicInfo && tabOn === 2 && //이상형 프로필일때
                                            <>
                                                <p className="top_tit"><strong>이상형 정보</strong>를 입력해 보세요.</p>
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
                                            </>
                                        }
                                        {myBasicInfo &&
                                            <div className="tm40">
                                                <button type="button" className="btn_type3" onClick={editBtnClickHandler}>프로필 수정</button>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default Mypage;