import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import history from "../../../config/history";
import { confirmPop } from "../../../store/popupSlice";
import { storyPop } from "../../../store/landingSlice";
import { enum_api_uri } from "../../../config/enum";
import * as CF from "../../../config/function";

const StoryPop = () => {
    const dispatch = useDispatch();
    const landing = useSelector((state)=>state.landing);
    const story_view = enum_api_uri.s_story_view;
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
        const list = landing.storyPopList;
        const idx = landing.storyPopNo;
        setData(list[idx]);

        const maxIdx = landing.storyPopList.length - 1;
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
    },[landing.storyPopNo,landing.storyPopList]);


    useEffect(()=>{
        if(data && data.list_no){
            getImg(data.list_no);
        }
    },[data]);


    //다음버튼 클릭시
    const nextHandler = () => {
        const idx = landing.storyPopNo;
        let newStoryPop = {
            storyPop:true,
            storyPopNo:idx + 1
        };
        dispatch(storyPop(newStoryPop));
    };


    //이전버튼 클릭시
    const prevHandler = () => {
        const idx = landing.storyPopNo;
        let newStoryPop = {
            storyPop:true,
            storyPopNo:idx - 1
        };
        dispatch(storyPop(newStoryPop));
    };


    return(<>
        <div className="flex_center pop_wrap story_pop select_apply_story_pop">
            <div className="dim" onClick={closePopHandler}></div>
            <div className="pop_cont border">
                <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                <div className="scroll_wrap" ref={contRef}>
                    <div className="img_box">
                        {img && <img src={img} alt="이미지" />}
                    </div>
                </div>
                {prevBtn && <button type="button" className="btn_prev" onClick={prevHandler}>이전버튼</button>}
                {nextBtn && <button type="button" className="btn_next" onClick={nextHandler}>다음버튼</button>}
            </div>
        </div>
    </>);
};

export default StoryPop;