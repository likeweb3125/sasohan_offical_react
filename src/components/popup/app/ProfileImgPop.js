import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { appProfileImgPop } from "../../../store/popupSlice";


const ProfileImgPop = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const [off, setOff] = useState(false);

    //팝업닫기--------------
    const closePopHandler = () => {
        setOff(true);
    };

    useEffect(()=>{
        if(off){
            setTimeout(()=>{
                dispatch(appProfileImgPop(false));
            },500);
        }
    },[off]);


    return(
        <div className={`app_pop_wrap app_profile_img_pop${off ? " off" : ""}`}>
            <div className="dim" onClick={closePopHandler}></div>
            <div className="pop_cont">
                <div className="flex_center">
                    <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                </div>
                <div className="scroll_wrap">
                    <ul className="list_ul">
                        <li>
                            <label>
                                <input type={`file`} accept={`image/*`} capture={`environment`} />
                                <span>카메라</span>
                            </label>
                        </li>
                        <li>
                            <label>
                                <input type={`file`} accept={`image/*`} />
                                <span>갤러리</span>
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProfileImgPop;