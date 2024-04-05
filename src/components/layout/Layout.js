import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/commonSlice";
import { confirmPop } from "../../store/popupSlice";
import Header from "./Header";
import Footer from "./Footer";
import ConfirmPop from "../popup/ConfirmPop";


const Layout = (props) => {
    const dispatch = useDispatch();
    const common = useSelector((state)=>state.common);
    const popup = useSelector((state)=>state.popup);
    const [confirm, setConfirm] = useState(false);


    //Google tag 
    useEffect(() => {
        // Google Analytics 초기화
        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'AW-10879238974');
    }, []);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);


    //로그아웃시 팝업띄우기
    useEffect(()=>{
        if(common.logout){
            dispatch(logout(false));

            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'로그아웃되었습니다.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }
    },[common.logout]);


    return(
        <>
            <Header />
            <div className="content_wrap">
                {props.children}
            </div>
            <Footer />

            {/* confirm팝업 */}
            {confirm && <ConfirmPop />}
        </>
    );
};

export default Layout;