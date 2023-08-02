import { useDispatch, useSelector } from "react-redux";
import { imgPop } from "../../store/popupSlice";

const ImgPop = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);

    //팝업닫기
    const closePopHandler = () => {
        dispatch(imgPop({imgPop:false,imgPopSrc:""}));
    };

    return(
        <div className="flex_center pop_wrap img_pop">
            <div className="dim" onClick={closePopHandler}></div>
            <div className="pop_cont">
                <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                <div className="img_box">
                    <img src={popup.imgPopSrc} alt="이미지" />
                </div>
            </div>
        </div>
    );
};

export default ImgPop;