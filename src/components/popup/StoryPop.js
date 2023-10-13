import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { storyPop, confirmPop } from "../../store/popupSlice";
import { enum_api_uri } from "../../config/enum";
import * as CF from "../../config/function";

const StoryPop = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const story_view = enum_api_uri.story_view;
    const [confirm, setConfirm] = useState(false);
    const [img, setImg] = useState(null);

    //팝업닫기
    const closePopHandler = () => {
        dispatch(storyPop({storyPop:false,storyPopNo:null}));
    };


    //스토리이미지 가져오기
    const getImg = () => {
        axios.get(`${story_view.replace(":list_no",popup.storyPopNo)}`)
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setImg(data.photo);
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

    
    useEffect(()=>{
        getImg();
    },[]);


    return(<>
        {img &&
            <div className="flex_center pop_wrap img_pop">
                <div className="dim" onClick={closePopHandler}></div>
                <div className="pop_cont">
                    <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                    <div className="img_box">
                        <img src={img} alt="이미지" />
                    </div>
                </div>
            </div>
        }
    </>);
};

export default StoryPop;