import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import * as CF from '../../config/function';
import { enum_api_uri } from "../../config/enum";
import { appProfilePop, appProfilePop2, confirmPop, appChangePasswordPop, appProfileImgPop } from "../../store/popupSlice";
import { profileData, profileDataChange } from "../../store/userSlice";
import { feedProfileImg } from "../../store/commonSlice";
import ConfirmPop from "../../components/popup/ConfirmPop";


const EditProfile = () => {
    const dispatch = useDispatch();
    const user = useSelector((state)=>state.user);
    const popup = useSelector((state)=>state.popup);
    const common = useSelector((state)=>state.common);
    const m_profile_info = enum_api_uri.m_profile_info;
    const m_profile_modify = enum_api_uri.m_profile_modify;
    const m_nick_check = enum_api_uri.m_nick_check;
    const m_address = enum_api_uri.m_address;
    const feed_profile_delt = enum_api_uri.feed_profile_delt;
    const [confirm, setConfirm] = useState(false);
    const [editOkConfirm, setEditOkConfirm] = useState(false);
    const [tabOn, setTabOn] = useState(1);
    const token = Cookies.get("token");
    const [addressList, setAddressList] = useState([]);
    const [myInfo, setMyInfo] = useState({});
    const [myType, setMyType] = useState({});
    const [idealType, setIdealType] = useState({});
    const [inputFocus, setInputFocus] = useState({});
    const [valNickname, setValNickname] = useState("");
    const [valEmail, setValEmail] = useState("");
    const [usableNickname, setUsableNickname] = useState(true);
    const [usableEmail, setUsableEmail] = useState(true);
    const [errorNickname, setErrorNickname] = useState(false);
    const [address, setAddress] = useState("");
    const [address2, setAddress2] = useState("");
    const [height, setHeight] = useState("");
    const [height2, setHeight2] = useState(""); //상대방 키
    const [hasRunOnce, setHasRunOnce] = useState(false);
    const [feedImg, setFeedImg] = useState("");
    const [feedImgName, setFeedImgName] = useState("");
    const [deltImgList, setDeltImgList] = useState([]);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
            setEditOkConfirm(false);
        }
    },[popup.confirmPop]);


    // 탭클릭시 위치로 스크롤
    const scrollToBox = (boxNumber) => {
        const boxId = `box${boxNumber}`;
        const element = document.getElementById(boxId);
    
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
            });
        }
    };

    
    // 탭클릭 이벤트
    const tabClickHandler = (tabNumber) => {
        setTabOn(tabNumber); // 선택한 탭 활성화
        scrollToBox(tabNumber); // 해당 박스로 스크롤
    };


    //회원프로필정보 가져오기
    const getProfileInfo = () => {
        axios.get(`${m_profile_info}`,
            {headers:{Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;

                //나의 기본정보
                setMyInfo(data.my_info);

                //나의 프로필정보
                setMyType(data.my_type);

                //나의 피드프로필 사진
                dispatch(feedProfileImg(data.my_info.feed_profile_image));

                //나의 키
                if(data.my_type.hasOwnProperty("m_height")){
                    let h = data.my_type.m_height;
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

                //이상형 프로필정보
                setIdealType(data.ideal_type);

                //회원프로필정보 profileData store 값에 저장 (나의거주지 제외 m_address,m_address2,m_address_code)
                const infoData = {
                    m_n_name: data.my_info.m_n_name,
                    m_height: data.my_type.m_height,
                    m_job: data.my_type.m_job,
                    m_visual: data.my_type.m_visual,
                    m_like: data.my_type.m_like,
                    m_mbti: data.my_type.m_mbti,
                    m_character: data.my_type.m_character,
                    m_smok: data.my_type.m_smok,
                    m_drink: data.my_type.m_drink,
                    m_religion: data.my_type.m_religion,
                    m_date: data.my_type.m_date,
                    m_motive: data.my_type.m_motive,
                    t_height1: data.ideal_type.t_height1,
                    t_height2: data.ideal_type.t_height2,
                    t_job: data.ideal_type.t_job,
                    t_visual: data.ideal_type.t_visual,
                    t_mbti: data.ideal_type.t_mbti,
                    t_character: data.ideal_type.t_character,
                    t_smok: data.ideal_type.t_smok,
                    t_drink: data.ideal_type.t_drink,
                    t_religion: data.ideal_type.t_religion,
                };
                dispatch(profileData(infoData));

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


    //맨처음 token이 있고 getProfileInfo,getAddress 함수들이 한번도 실행안됐을때 회원프로필정보, 주소 시,도 가져오기
    useEffect(()=>{
        if (token && !hasRunOnce) {
            setTimeout(()=>{
                getProfileInfo();
                getAddress();
                setHasRunOnce(true);
            },500);
        }
    },[token]);


    //피드프로필사진 등록시
    useEffect(()=>{
        setFeedImg(common.feedProfileImg);
    },[common.feedProfileImg]);


    //피드프로필사진 이미지이름만 
    useEffect(()=>{
        const imgName = feedImg.substring(feedImg.lastIndexOf('/') + 1);
        setFeedImgName(imgName);
    },[feedImg]);


    //피드프로필사진 삭제시
    const feedImgDeltHandler = () => {
        const newDeltImgList = [...deltImgList];
        newDeltImgList.push(feedImgName);
        setDeltImgList(newDeltImgList);

        dispatch(feedProfileImg(''));
    };


    //회원 기본정보값 변경시 닉네임, 이메일값 변경
    useEffect(()=>{
        if(Object.keys(myInfo).length > 0){
            setValNickname(myInfo.m_n_name);
            setValEmail(myInfo.m_email);
        }
    },[myInfo]);


    //회원 나의프로필정보값 변경시 나의 거주지 설정
    useEffect(()=>{
        if(myType.hasOwnProperty("m_address_full")){
            let addrArray = [];
            let addr1 = "";
            let addr2 = "";
            if(myType.m_address_full.includes(" ")){
                addrArray = myType.m_address_full.split(" ");
                setAddress(addrArray[0]);
                setAddress2(addrArray[1]);
                addr1 = addrArray[0];
                addr2 = addrArray[1];
            }else{
                setAddress(myType.m_address_full);
                setAddress2("");
                addr1 = myType.m_address_full;
                addr2 = "";
            }

            const matchingItem = addressList.find(item => item.sido_gugun.includes(addr1));
            let code;
            if (matchingItem) {
                code = matchingItem.local_code;
            } else {
                code = "01";
            }

            let newData = {...user.profileData};
            newData.m_address = addr1;
            newData.m_address2 = addr2;
            newData.m_address_code = code;
            dispatch(profileData(newData)); //profileData store 값에 저장 (m_address, m_address2, m_address_code)
        }
    },[myType]);


    useEffect(()=>{
        console.log(user.profileData);

        //나의 거주지
        if(user.profileData.hasOwnProperty("m_address")){
            setAddress(user.profileData.m_address);
            setAddress2(user.profileData.m_address2);
        }else{
            setAddress("");
            setAddress2("");
        }

        //나의 키
        if(user.profileData.hasOwnProperty("m_height")){
            let h = user.profileData.m_height;
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
        if(user.profileData.hasOwnProperty("t_height1")){
            let h = user.profileData.t_height1;
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
        
    },[user.profileData]);


    //회원프로필 선택 팝업에서 값 변경시 변경한값으로 바꾸기
    useEffect(()=>{
        if(user.profileDataChange){
            dispatch(profileDataChange(false));

            //나의 프로필정보
            let addr = "";
            if(user.profileData.m_address2.length > 0){
                addr = user.profileData.m_address + " · " + user.profileData.m_address2;
            }else{
                addr = user.profileData.m_address;
            }
            const newMyType = {
                m_address: addr,
                m_height: user.profileData.m_height,
                m_job: user.profileData.m_job,
                m_visual: user.profileData.m_visual,
                m_like: user.profileData.m_like,
                m_mbti: user.profileData.m_mbti,
                m_character: user.profileData.m_character,
                m_smok: user.profileData.m_smok,
                m_drink: user.profileData.m_drink,
                m_religion: user.profileData.m_religion,
                m_date: user.profileData.m_date,
                m_motive: user.profileData.m_motive,
            };
            setMyType(newMyType);

            //이상형정보
            const newIdealType = {
                t_height1: user.profileData.t_height1,
                t_height2: user.profileData.t_height2,
                t_job: user.profileData.t_job,
                t_visual: user.profileData.t_visual,
                t_mbti: user.profileData.t_mbti,
                t_character: user.profileData.t_character,
                t_smok: user.profileData.t_smok,
                t_drink: user.profileData.t_drink,
                t_religion: user.profileData.t_religion,
            };
            setIdealType(newIdealType);

        }
    },[user.profileDataChange]);


    //닉네임, 이메일 인풋포커스 체크
    const inputFocusHandler = (data) => {
        setInputFocus((prevInputFocus) => {
            // 이전 상태를 복사
            const newInputFocus = { ...prevInputFocus };
        
            // data 객체를 반복하면서 값을 추가하거나 변경
            for (const key in data) {
                newInputFocus[key] = data[key];
            }
      
            return newInputFocus;
        });
    };


    // 닉네임 중복확인
    const nickCheckHandler = () => {
        if(valNickname.length < 2){
            setErrorNickname(true);
        }else{
            setErrorNickname(false);

            axios.get(`${m_nick_check}?m_n_name=${valNickname}`)
            .then((res)=>{
                if(res.status === 200){
                    setUsableNickname(true);

                    //닉네임 profileData store 값에 저장
                    let newData = {...user.profileData};
                    newData.m_n_name = valNickname;
                    dispatch(profileData(newData));
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


    //프로필 수정진행 -> 삭제할이미지 있으면 삭제후 프로필수정
    const editHandler = () => {
        if(deltImgList.length > 0){
            // 삭제할 이미지가 있는 경우 각 이미지를 순회하며 삭제
            deltImgList.forEach((imageName, index) => {
                feedProfileImgDelt(imageName, index === deltImgList.length - 1); // 각 이미지를 삭제하는 함수 호출
            });
        }else{
            profileEdit();
        }
    };


    //피드프로필 이미지 삭제하기
    const feedProfileImgDelt = (imageName, isLast) => {
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
    

    //프로필수정하기
    const profileEdit = () => {
        let addr = "";
        if(user.profileData.m_address2.length > 0){
            addr = user.profileData.m_address + " " + user.profileData.m_address2;
        }else{
            addr = user.profileData.m_address;
        }

        const body = {
            m_n_name: valNickname,
            m_address: addr,
            m_height: user.profileData.m_height,
            m_job: user.profileData.m_job,
            m_visual: user.profileData.m_visual,
            m_like: user.profileData.m_like,
            m_mbti: user.profileData.m_mbti,
            m_character: user.profileData.m_character,
            m_smok: user.profileData.m_smok,
            m_drink: user.profileData.m_drink,
            m_religion: user.profileData.m_religion,
            m_date: user.profileData.m_date,
            m_motive: user.profileData.m_motive,
            t_height1: user.profileData.t_height1,
            t_height2: user.profileData.t_height2,
            t_job: user.profileData.t_job,
            t_visual: user.profileData.t_visual,
            t_mbti: user.profileData.t_mbti,
            t_character: user.profileData.t_character,
            t_smok: user.profileData.t_smok,
            t_drink: user.profileData.t_drink,
            t_religion: user.profileData.t_religion,
            feed_profile_image: feedImgName
        };

        axios.post(`${m_profile_modify}`, body,
            {headers:{Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt: '프로필 수정이 완료되었습니다.',
                    confirmPopBtn:1,
                }));
                setEditOkConfirm(true);
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


    //프로필수정완료 팝업 확인클릭시
    const editOkHandler = () => {
        //앱에 프로필수정완료 보내기
        if(window.flutterEditProfile){
            const data = {};
            window.flutterEditProfile.postMessage(JSON.stringify(data));
        }
    };



    return(<>
        <div className="edit_profile_wrap">
            <ul className="top_tab flex_center">
                <li className={tabOn === 1 ? "on" : ""} onClick={()=>{tabClickHandler(1)}}>기본 정보</li>
                <li className={tabOn === 2 ? "on" : ""} onClick={()=>{tabClickHandler(2)}}>나의 프로필</li>
                <li className={tabOn === 3 ? "on" : ""} onClick={()=>{tabClickHandler(3)}}>이상형 프로필</li>
            </ul>
            <div className="inner_cont">
                <div className="line_box" id="box1">
                    <p className="top_tit">기본 정보</p>
                    <ul className="gray_box">
                        <li className="flex_between">
                            <p>아이디</p>
                            <p>{myInfo.m_id}</p>
                        </li>
                        <li className="flex_between">
                            <p>이름</p>
                            <p>{myInfo.m_name}</p>
                        </li>
                        <li className="flex_between">
                            <p>생년월일</p>
                            <p>{myInfo.birth}</p>
                        </li>
                        <li className="flex_between">
                            <p>휴대폰번호</p>
                            <p>{myInfo.phone}</p>
                        </li>
                        <li className="flex_between">
                            <p>성별</p>
                            <p>{myInfo.m_gender}</p>
                        </li>
                    </ul>
                    <ul className="form_ul">
                        <li>
                            <p className="input_tit bm12">비밀번호</p>
                            <button type="button" className="app_btn_s w_100 normal" onClick={()=>{dispatch(appChangePasswordPop(true))}}>비밀번호 변경</button>
                        </li>
                        <li>
                            <p className="input_tit">닉네임</p>
                            <div className={`input_check_box ${usableNickname ? " checked" : ""}`}>
                                <div className={`custom_input2${inputFocus.hasOwnProperty("nick") && inputFocus.nick ? " on" : ""}`}>
                                    <input type={"text"} placeholder="닉네임을 입력해주세요." 
                                        value={valNickname || ""}
                                        onChange={(e)=>{
                                            const val = e.currentTarget.value;
                                            setValNickname(val);
                                            if(val === myInfo.m_n_name){
                                                setUsableNickname(true);
                                            }else{
                                                setUsableNickname(false);
                                            }
                                        }}
                                        onFocus={()=>{
                                            let data = {nick:true};
                                            inputFocusHandler(data);
                                        }}
                                        onBlur={()=>{
                                            let data = {nick:false};
                                            inputFocusHandler(data);
                                        }}
                                    />
                                </div>
                                <button type="button" disabled={usableNickname ? true : false} onClick={nickCheckHandler}>중복 확인</button>
                            </div>
                            {errorNickname && <p className="alert_txt tp4">최소 2자 이상 입력하세요.</p>}
                        </li>
                        {/* <li>
                            <p className="input_tit">이메일</p>
                            <div className={`custom_input2${inputFocus.hasOwnProperty("email") && inputFocus.email ? " on" : ""}`}>
                                <input type={"text"} placeholder="이메일을 입력해주세요." 
                                    value={valEmail || ""}
                                    onChange={(e)=>{
                                        setValEmail(e.currentTarget.value);
                                        setUsableEmail(false);
                                    }}
                                    onFocus={()=>{
                                        let data = {email:true};
                                        inputFocusHandler(data);
                                    }}
                                    onBlur={(e)=>{
                                        let data = {email:false};
                                        inputFocusHandler(data);

                                        let regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
                                        if(regExp.test(e.currentTarget.value)){
                                            setUsableEmail(true);
                                        }else{
                                            setUsableEmail(false);
                                        }
                                    }}
                                />
                            </div>
                        </li> */}
                    </ul>
                </div>
                <div className="line_box" id="box2">
                    <p className="top_tit">나의 프로필</p>
                    <ul className="form_ul">
                        <li>
                            <p className="input_tit">나의 피드 프로필</p>
                            <ul className="profile_img_ul feed_profile_img_ul flex_wrap">
                                <li className={feedImg.length > 0 ? "on" : ""}>
                                    <div className="img"
                                        onClick={()=>{
                                            dispatch(appProfileImgPop({appProfileImgPop:true, appProfileImgPopIdx:0, appProfileImgPopFeed:true}));
                                        }}
                                    >
                                        {feedImg.length > 0 && <img src={feedImg} alt="피드프로필이미지"/>}
                                    </div>
                                    <button type="button" className="btn_delt" 
                                        onClick={feedImgDeltHandler}
                                    >삭제버튼</button>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <p className="input_tit">나의 거주지</p>
                            <div className="btn_sel_box2 flex_between">
                                <button type="button" className="btn_sel" 
                                    onClick={()=>{
                                        dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"거주지",appProfilePopEdit:true}));
                                    }}
                                ><span className="ellipsis">{address ? address : "선택"}</span></button>
                                <button type="button" className="btn_sel" 
                                    onClick={()=>{
                                        dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"거주지",appProfilePopEdit:true}));
                                    }}
                                ><span className="ellipsis">{address2 ? address2 : "선택"}</span></button>
                            </div>
                        </li>
                        <li>
                            <p className="input_tit">나의 키</p>
                            <button type="button" className="btn_sel" 
                                onClick={()=>{
                                    dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"키",appProfilePopEdit:true}));
                                }}
                            ><span className="ellipsis">{height ? height : "선택"}</span></button>
                        </li>
                        <li>
                            <p className="input_tit">나의 직업</p>
                            <button type="button" className="btn_sel" 
                                onClick={()=>{
                                    dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"직업",appProfilePopEdit:true}));
                                }}
                            ><span className="ellipsis">{myType.m_job ? myType.m_job : "선택"}</span></button>
                        </li>
                        <li>
                            <p className="input_tit">나의 외모 점수</p>
                            <button type="button" className="btn_sel" 
                                onClick={()=>{
                                    dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"외모 점수",appProfilePopEdit:true}));
                                }}
                            ><span className="ellipsis">{myType.m_visual ? myType.m_visual+"점" : "선택"}</span></button>
                        </li>
                        <li>
                            <p className="input_tit">나의 관심사</p>
                            <button type="button" className="btn_sel" 
                                onClick={()=>{
                                    dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"내 관심사",appProfilePopEdit:true}));
                                }}
                            ><span className="ellipsis">{myType.m_like && myType.m_like.length > 0 ? myType.m_like.join(", ") : "선택"}</span></button>
                        </li>
                        <li>
                            <p className="input_tit">나의 MBTI</p>
                            <button type="button" className="btn_sel" 
                                onClick={()=>{
                                    dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"MBTI",appProfilePopEdit:true}));
                                }}
                            ><span className="ellipsis">{myType.m_mbti ? myType.m_mbti : "선택"}</span></button>
                        </li>
                        <li>
                            <p className="input_tit">나의 타입</p>
                            <button type="button" className="btn_sel" 
                                onClick={()=>{
                                    dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"타입",appProfilePopEdit:true}));
                                }}
                            ><span className="ellipsis">{myType.m_character && myType.m_character.length > 0 ? myType.m_character.join(", ") : "선택"}</span></button>
                        </li>
                        <li>
                            <p className="input_tit">나는 흡연을</p>
                            <button type="button" className="btn_sel" 
                                onClick={()=>{
                                    dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"흡연 여부",appProfilePopEdit:true}));
                                }}
                            ><span className="ellipsis">{
                                myType.m_smok ?
                                    myType.m_smok == "1" ? "한다"
                                    :myType.m_smok == "2" ? "안 한다"
                                    :myType.m_smok == "3" && "가끔 한다"
                                : "선택"
                            }</span></button>
                        </li>
                        <li>
                            <p className="input_tit">나는 술을</p>
                            <button type="button" className="btn_sel" 
                                onClick={()=>{
                                    dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"음주 여부",appProfilePopEdit:true}));
                                }}
                                ><span className="ellipsis">{
                                    myType.m_drink ?
                                        myType.m_drink == "1" ? "한다"
                                        :myType.m_drink == "2" ? "가끔 한다"
                                        :myType.m_drink == "3" && "안 한다"
                                    : "선택"
                                }</span></button>
                        </li>
                        <li>
                            <p className="input_tit">나의 종교</p>
                            <button type="button" className="btn_sel" 
                                onClick={()=>{
                                    dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"종교",appProfilePopEdit:true}));
                                }}
                            ><span className="ellipsis">{myType.m_religion ? myType.m_religion : "선택"}</span></button>
                        </li>
                        <li>
                            <p className="input_tit">나의 선호하는 데이트</p>
                            <button type="button" className="btn_sel" 
                                onClick={()=>{
                                    dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"선호하는 데이트",appProfilePopEdit:true}));
                                }}
                            ><span className="ellipsis">{myType.m_date && myType.m_date.length > 0 ? myType.m_date.join(", ") : "선택"}</span></button>
                        </li>
                        <li>
                            <p className="input_tit">나의 가입경로</p>
                            <button type="button" className="btn_sel" 
                                onClick={()=>{
                                    dispatch(appProfilePop({appProfilePop:true,appProfilePopTit:"가입경로",appProfilePopEdit:true}));
                                }}
                            ><span className="ellipsis">{myType.m_motive ? myType.m_motive : "선택"}</span></button>
                        </li>
                    </ul>
                </div>
                <div className="line_box" id="box3">
                    <p className="top_tit">이상형 프로필</p>
                    <ul className="form_ul">
                        <li>
                            <p className="input_tit">상대방의 키</p>
                            <button type="button" className="btn_sel" 
                                onClick={()=>{
                                    dispatch(appProfilePop2({appProfilePop2:true,appProfilePopTit2:"키",appProfilePopEdit2:true}));
                                }}
                            ><span className="ellipsis">{height2 ? height2 : "선택"}</span></button>
                        </li>
                        <li>
                            <p className="input_tit">상대방의 직업</p>
                            <button type="button" className="btn_sel" 
                                onClick={()=>{
                                    dispatch(appProfilePop2({appProfilePop2:true,appProfilePopTit2:"직업",appProfilePopEdit2:true}));
                                }}
                            ><span className="ellipsis">{idealType.t_job ? idealType.t_job : "선택"}</span></button>
                        </li>
                        <li>
                            <p className="input_tit">상대방의 외모 점수</p>
                            <button type="button" className="btn_sel" 
                                onClick={()=>{
                                    dispatch(appProfilePop2({appProfilePop2:true,appProfilePopTit2:"외모 점수",appProfilePopEdit2:true}));
                                }}
                            ><span className="ellipsis">{idealType.t_visual ? idealType.t_visual+"점" : "선택"}</span></button>
                        </li>
                        <li>
                            <p className="input_tit">상대방의 MBTI</p>
                            <button type="button" className="btn_sel" 
                                onClick={()=>{
                                    dispatch(appProfilePop2({appProfilePop2:true,appProfilePopTit2:"MBTI",appProfilePopEdit2:true}));
                                }}
                            ><span className="ellipsis">{idealType.t_mbti ? idealType.t_mbti : "선택"}</span></button>
                        </li>
                        <li>
                            <p className="input_tit">상대방의 타입</p>
                            <button type="button" className="btn_sel" 
                                onClick={()=>{
                                    dispatch(appProfilePop2({appProfilePop2:true,appProfilePopTit2:"타입",appProfilePopEdit2:true}));
                                }}
                            ><span className="ellipsis">{idealType.t_character && idealType.t_character.length > 0 ? idealType.t_character.join(", ") : "선택"}</span></button>
                        </li>
                        <li>
                            <p className="input_tit">상대방은 흡연을</p>
                            <button type="button" className="btn_sel" 
                                onClick={()=>{
                                    dispatch(appProfilePop2({appProfilePop2:true,appProfilePopTit2:"흡연 여부",appProfilePopEdit2:true}));
                                }}
                            ><span className="ellipsis">{
                                idealType.t_smok ?
                                    idealType.t_smok == "1" ? "한다"
                                    :idealType.t_smok == "2" ? "안 한다"
                                    :idealType.t_smok == "3" && "가끔 한다"
                                : "선택"
                            }</span></button>
                        </li>
                        <li>
                            <p className="input_tit">상대방은 술을</p>
                            <button type="button" className="btn_sel" 
                                onClick={()=>{
                                    dispatch(appProfilePop2({appProfilePop2:true,appProfilePopTit2:"음주 여부",appProfilePopEdit2:true}));
                                }}
                                ><span className="ellipsis">{
                                    idealType.t_drink ?
                                        idealType.t_drink == "1" ? "한다"
                                        :idealType.t_drink == "2" ? "가끔 한다"
                                        :idealType.t_drink == "3" && "안 한다"
                                    : "선택"
                                }</span></button>
                        </li>
                        <li>
                            <p className="input_tit">상대방의 종교</p>
                            <button type="button" className="btn_sel" 
                                onClick={()=>{
                                    dispatch(appProfilePop2({appProfilePop2:true,appProfilePopTit2:"종교",appProfilePopEdit2:true}));
                                }}
                            ><span className="ellipsis">{idealType.t_religion ? idealType.t_religion : "선택"}</span></button>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="btn_box">
                <button type="button" className="app_btn2" 
                    onClick={()=>{
                        if(usableNickname && usableEmail){
                            editHandler();
                        }else if(!usableNickname){
                            setConfirm(true);
                            dispatch(confirmPop({
                                confirmPop:true,
                                confirmPopTit:'알림',
                                confirmPopTxt:'닉네임 중복확인을 해주세요.',
                                confirmPopBtn:1,
                            }));
                        }else if(!usableEmail){
                            setConfirm(true);
                            dispatch(confirmPop({
                                confirmPop:true,
                                confirmPopTit:'알림',
                                confirmPopTxt:'이메일을 입력해주세요.',
                                confirmPopBtn:1,
                            }));
                        }
                    }}
                >저장</button>
            </div>
        </div>

        {/* 프로필수정완료 confirm팝업 */}
        {editOkConfirm && <ConfirmPop onClickHandler={editOkHandler} />}  

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}  
    </>);
};

export default EditProfile;