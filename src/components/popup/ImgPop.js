import { useDispatch, useSelector } from "react-redux";
import { imgPop, imgPopLink } from "../../store/popupSlice";

const ImgPop = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);

    //팝업닫기
    const closePopHandler = () => {
        dispatch(imgPop({imgPop:false,imgPopSrc:""}));
        dispatch(imgPopLink(null));
    };


    return(
        <div className="flex_center pop_wrap img_pop">
            <div className="dim" onClick={closePopHandler}></div>
            <div className="pop_cont">
                <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                <div className="scroll_wrap">
                    <div className={`img_box${popup.imgPopLink != null ? " link" : ""}`} 
                        onClick={()=>{
                            if(popup.imgPopLink != null){
                                window.open(popup.imgPopLink);
                            }
                        }}
                    >
                        <img src={popup.imgPopSrc} alt="이미지" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImgPop;