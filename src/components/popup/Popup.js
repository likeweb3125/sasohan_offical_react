import { useSelector } from "react-redux";
import { createPortal } from "react-dom";
import ManagerPop from "./ManagerPop";
import ImgPop from "./ImgPop";
import ReviewPop from "./ReviewPop";
import TermsPop from "./TermsPop";
import AppTermsPop from "./app/TermsPop";
import AppProfilePop from "./app/ProfilePop";
import AppProfileImgPop from "./app/ProfileImgPop";
import AppPointPop from "./app/PointPop";


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


            {/* 앱 팝업----------------------------------------- */}
            {/* 회원가입 약관 팝업 */}
            {popup.appTermsPop && <AppTermsPop />}

            {/* 회원가입 프로필설정 팝업 */}
            {popup.appProfilePop && <AppProfilePop />}

            {/* 회원가입 프로필사진 팝업 */}
            {popup.appProfileImgPop && <AppProfileImgPop />}

            {/* 포인트충전완료 팝업 */}
            {popup.appPointPop && <AppPointPop />}

        </>,
        document.getElementById('modal-root')
    );
};

export default Popup;