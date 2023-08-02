import { useSelector } from "react-redux";
import { createPortal } from "react-dom";
import ManagerPop from "./ManagerPop";
import ImgPop from "./ImgPop";
import ReviewPop from "./ReviewPop";
import TermsPop from "./TermsPop";

const Popup = () => {
    const popup = useSelector((state)=>state.popup);

    return createPortal(
        <>
            {/* 챠밍매니저 팝업 */}
            {popup.managerPop && <ManagerPop />}

            {/* 이미지 팝업 */}
            {popup.imgPop && <ImgPop />}

            {/* 후기 팝업 */}
            {popup.reviewPop && <ReviewPop />}

            {/* 약관 팝업 */}
            {popup.termsPop && <TermsPop />}
        </>,
        document.getElementById('modal-root')
    );
};

export default Popup;