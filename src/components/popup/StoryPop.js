import { useState, useEffect, useRef } from "react";
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
    const [data, setData] = useState({});
    const [img, setImg] = useState(null);
    const [prevBtn, setPrevBtn] = useState(null);
    const [nextBtn, setNextBtn] = useState(null);
    const contRef = useRef(null);


    //팝업닫기
    const closePopHandler = () => {
        dispatch(storyPop({storyPop:false,storyPopNo:null}));
    };


    //스토리 이미지 가져오기
    const getImg = (num) => {
        axios.get(`${story_view.replace(":list_no",num)}`)
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
        const list = popup.storyPopList;
        const idx = popup.storyPopNo;
        setData(list[idx]);

        const maxIdx = popup.storyPopList.length - 1;
        if(idx === 0){
            setPrevBtn(false);
        }else{
            setPrevBtn(true);
        }

        if(idx === maxIdx){
            setNextBtn(false);
        }else{
            setNextBtn(true);
        }

        contRef.current.scrollTop = 0; //스크롤항상 위
    },[popup.storyPopNo,popup.storyPopList]);


    useEffect(()=>{
        if(data && data.list_no){
            getImg(data.list_no);
        }
    },[data]);


    //다음버튼 클릭시
    const nextHandler = () => {
        const idx = popup.storyPopNo;
        let newStoryPop = {
            storyPop:true,
            storyPopNo:idx + 1
        };
        dispatch(storyPop(newStoryPop));
    };


    //이전버튼 클릭시
    const prevHandler = () => {
        const idx = popup.storyPopNo;
        let newStoryPop = {
            storyPop:true,
            storyPopNo:idx - 1
        };
        dispatch(storyPop(newStoryPop));
    };


    return(<>
        <div className="flex_center pop_wrap story_pop">
            <div className="dim" onClick={closePopHandler}></div>
            <div className="pop_cont">
                <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                <div className="scroll_wrap" ref={contRef}>
                    <div className="top_box flex">
                        <div className="img">
                            <img src={data.photo} alt="이미지" />
                        </div>
                        <div className="txt_box">
                            <p className="name flex flex_wrap"><strong>{data.manager_type_txt}</strong> <span>{data.manager_name}</span></p>
                            <p className="time">{data.w_date}</p>
                        </div>
                    </div>
                    <div className="img_box">
                        <img src={img} alt="이미지" />
                    </div>
                </div>
                {prevBtn && <button type="button" className="btn_prev" onClick={prevHandler}>이전버튼</button>}
                {nextBtn && <button type="button" className="btn_next" onClick={nextHandler}>다음버튼</button>}
            </div>
        </div>
    </>);
};

export default StoryPop;