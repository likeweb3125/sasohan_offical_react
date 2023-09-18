import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { enum_api_uri } from "../../../config/enum";
import * as CF from "../../../config/function";
import { appProfileImgPop, confirmPop } from "../../../store/popupSlice";
import { profileImgs } from "../../../store/commonSlice";
import ConfirmPop from "../ConfirmPop";


const ProfileImgPop = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const common = useSelector((state)=>state.common);
    const m_img_add = enum_api_uri.m_img_add;
    const [off, setOff] = useState(false);
    const [confirm, setConfirm] = useState(false);
    

    //팝업닫기--------------
    const closePopHandler = () => {
        setOff(true);
    };

    useEffect(()=>{
        if(off){
            setTimeout(()=>{
                dispatch(appProfileImgPop({appProfileImgPop:false, appProfileImgPopIdx:null}));
            },500);
        }
    },[off]);


    //이미지 등록
    const imgUpHandler = (postData) => {
        const idx = popup.appProfileImgPopIdx;
        const formData = new FormData();
        formData.append("media", postData.target.files[0]);
        axios.post(`${m_img_add}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((res) => {
            if (res.status === 201) {
                let imgName = res.data.mediaUrls;
                let newList = [...common.profileImgs];
                    newList[idx] = imgName;
                dispatch(profileImgs(newList));

                setTimeout(()=>{
                    closePopHandler();
                },100);
            }else{
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt: "",
                    confirmPopBtn:1,
                }));
                setConfirm(true);
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


    return(<>
        <div className={`app_pop_wrap app_profile_img_pop${off ? " off" : ""}`}>
            <div className="dim" onClick={closePopHandler}></div>
            <div className="pop_cont">
                <div className="flex_center">
                    <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                </div>
                <div className="scroll_wrap">
                    <ul className="list_ul">
                        <li>
                            <label htmlFor="img">
                                <input type={`file`} accept={`image/*`} capture={`environment`} id="img"
                                    onChange={(e) => {
                                        imgUpHandler(e);
                                    }}
                                />
                                <span>카메라</span>
                            </label>
                        </li>
                        <li>
                            <label htmlFor="img2">
                                <input type={`file`} accept={`image/*`} id="img2"
                                    onChange={(e) => {
                                        imgUpHandler(e);
                                    }}
                                />
                                <span>갤러리</span>
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}  
    </>);
};

export default ProfileImgPop;