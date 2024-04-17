import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import history from "../../config/history";
import { enum_api_uri } from "../../config/enum";
import * as CF from "../../config/function";
import { profileEditPop, profileEditPopDone, confirmPop, loadingPop } from "../../store/popupSlice";
import { myPageRefresh } from "../../store/commonSlice";
import none_profile from "../../images/none_profile.jpg";
import InputBox from "../component/InputBox";
import ConfirmPop from "./ConfirmPop";


const ProfileEditPop = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const user = useSelector((state)=>state.user);
    const rank_profile_img = enum_api_uri.rank_profile_img;
    const rank_profile = enum_api_uri.rank_profile;
    const rank_profile_img_delt = enum_api_uri.rank_profile_img_delt;
    const text_check = enum_api_uri.text_check;
    const [confirm, setConfirm] = useState(false);
    const [errorConfirm, setErrorConfirm] = useState(false);
    const [name, setName] = useState("");
    const [nameInput, setNameInput] = useState(false);
    const [errorName, setErrorName] = useState(false);
    const [profileImg, setProfileImg] = useState("");
    const [profileImgName, setProfileImgName] = useState("");
    const [deltImgList, setDeltImgList] = useState([]);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
            setErrorConfirm(false);
        }
    },[popup.confirmPop]);


    //팝업닫기
    const closePopHandler = () => {
        dispatch(profileEditPop({profileEditPop:false,profileEditPopData:{}}));
    };

    //페이지 이동시 팝업닫기
    useEffect(() => {
        const listenBackEvent = () => {
            closePopHandler();
        };
    
        const unlistenHistoryEvent = history.listen(({ action }) => {
            if (action === "POP") {
                listenBackEvent();
            }
        });

        return unlistenHistoryEvent;
    },[]);


    //맨처음 프로필정보 가져오기
    useEffect(()=>{
        setName(popup.profileEditPopData.m_n_name || "");
        
        const imgUrl = popup.profileEditPopData.photo;
        let imgName = "";
        if(imgUrl){
            imgName = imgUrl.split('/');
            imgName = imgName[imgName.length - 1];
        }
        setProfileImg(imgUrl || "");
        setProfileImgName(imgName);
    },[]);


    //이미지 등록
    const imgUpHandler = (fileBlob, postData) => {
        const formData = new FormData();
        formData.append("media", postData.target.files[0]);
        axios.post(`${rank_profile_img}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((res) => {
            if (res.status === 201) {
                const url = res.data.mediaUrls[0];
                let imgName = url.split('/');
                    imgName = imgName[imgName.length - 1];
                setProfileImg(url);
                setProfileImgName(imgName);
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


    //이미지 삭제
    const imgDeltHandler = () => {
        setProfileImg("");
        setProfileImgName("");

        //삭제할 이미지 배열로 저장
        const newDeltImgList = [...deltImgList];
        newDeltImgList.push(profileImgName);
        console.log(newDeltImgList);  
        setDeltImgList(newDeltImgList);      
    };


    //수정하기버튼 클릭시
    const editBtnClickHandler = () => {
        if(name === null || name.trim().length < 2){
            setErrorName(true);
        }else if(profileImgName.length === 0){
            setErrorName(false);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'프로필사진을 등록해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }else{
            setErrorName(false);
            nickNameCheckHandler();
        }
    };


    //닉네임 부적격 체크하기
    const nickNameCheckHandler = () => {
        dispatch(loadingPop(true));

        const body = {
            text : name,
        };

        axios.post(text_check,body,{
            headers: {
                Authorization: `Bearer ${user.userToken}`,
            },
        })
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
                    editHandler();
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
        axios.delete(rank_profile_img_delt.replace(':filename',imageName))
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
        const body = {
            m_n_name: name,
            photo: [profileImgName],
        };

        axios.put(`${rank_profile}`, body,{
            headers: {
                Authorization: `Bearer ${user.userToken}`,
            },
        })
        .then((res) => {
            if (res.status === 200) {
                const data = {
                    m_n_name: name,
                    m_f_photo: profileImg 
                };
                dispatch(profileEditPopDone({profileEditPopDone:true,profileEditPopDoneData:data}));

                dispatch(myPageRefresh(true));

                closePopHandler();
            }
        })
        .catch((error) => {
            const err_msg = CF.errorMsgHandler(error);
            if(error.response.status === 401){//인증번호유효기간 지났을때 팝업닫기
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'인증번호유효기간이 만료되었습니다. 다시 인증번호를 전송해주세요.',
                    confirmPopBtn:1,
                }));
                setErrorConfirm(true);
            }else{
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt: err_msg,
                    confirmPopBtn:1,
                }));
                setConfirm(true);
            }
        });
    };


    return(<>
        <div className="flex_center pop_wrap profile_edit_pop">
            <div className="dim" onClick={closePopHandler}></div>
            <div className="pop_cont border">
                <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                <div className="pop_tit">
                    <div className="tit">프로필 수정</div>
                </div>
                <div className="scroll_wrap">
                    <div className="edit_box">
                        <ul>
                            <li className="flex">
                                <p>닉네임</p>
                                <div>
                                    <div className={`input_box h_50${nameInput ? " on" : ""}`}>
                                        <InputBox 
                                            type={`text`}
                                            placeholder={`닉네임을 입력해주세요.`}
                                            value={name}
                                            onChangeHandler={(e)=>{
                                                const val = e.currentTarget.value;
                                                setName(val);
                                            }}
                                            onFocusHandler={()=>setNameInput(true)}
                                            onBlurHandler={()=>setNameInput(false)}
                                            maxLength={7}
                                        />
                                    </div>
                                    {errorName && <p className="error_txt">닉네임은 최소 2자 이상 입력해주세요.</p>}
                                </div>
                            </li>
                            <li className="flex_top">
                                <p>피드 프로필<span>사소한에서 활동하면서 <br/>보여지는 프로필 이미지입니다.</span></p>
                                <div>
                                    <div className={`profile_up_box${profileImg ? " on" : ""}`}>
                                        <div className="img">
                                            {profileImg ? <img src={profileImg} alt="프로필이미지"/> :  <img src={none_profile} alt="프로필이미지"/>}
                                        </div>
                                        <div className="img_up">
                                            <input type="file" className="blind" id="profile_file" accept="image/*" 
                                                onChange={(e) => {
                                                    const file = e.currentTarget.files[0];
                                                    imgUpHandler(file, e);
                                                    e.currentTarget.value = '';
                                                }}
                                            />
                                            <label htmlFor="profile_file">이미지등록</label>
                                        </div>
                                        <button type="button" className="btn_delt" onClick={()=>{imgDeltHandler()}}>삭제버튼</button>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div>
                            <button type="button" className="btn_type2" onClick={editBtnClickHandler}>프로필 수정</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 인증번호유효시간지났을때 confirm팝업 */}
        {errorConfirm && <ConfirmPop closePop="custom" onCloseHandler={closePopHandler} />}

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default ProfileEditPop;