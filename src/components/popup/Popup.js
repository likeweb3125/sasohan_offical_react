import { useSelector } from "react-redux";
import { createPortal } from "react-dom";
import ManagerPop from "./ManagerPop";

const Popup = () => {
    const popup = useSelector((state)=>state.popup);

    return createPortal(
        <>
            {/* 챠밍매니저 팝업 */}
            {popup.managerPop && <ManagerPop />}
        </>,
        document.getElementById('modal-root')
    );
};

export default Popup;