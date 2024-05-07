import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import * as CF from "../../config/function";
import { enum_api_uri } from "../../config/enum";
import { userInfo, userToken, userRank } from "../../store/userSlice";
import { confirmPop } from "../../store/popupSlice";
import Header from "./Header";
import Footer from "./Footer";
import ConfirmPop from "../popup/ConfirmPop";


const Layout = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const api_uri = enum_api_uri.api_uri;
    const user_refresh = enum_api_uri.user_refresh;
    const common = useSelector((state)=>state.common);
    const popup = useSelector((state)=>state.popup);
    const user = useSelector((state)=>state.user);
    const etc = useSelector((state)=>state.etc);
    const [confirm, setConfirm] = useState(false);
    const userLogin = Cookies.get('userLogin');


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


    //페이지이동시 스크롤탑으로 이동 (상세->목록으로 뒤로가기시 && 소개팅신청 해당섹션으로 이동시 제외)
    useEffect(()=>{
        if(!common.detailPageBack && common.aboutVipScroll.length == 0){
            window.scrollTo(0,0);
        }
    },[location]);



    //로그아웃시 팝업띄우기
    useEffect(()=>{
        if(userLogin == 'false'){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'로그아웃되었습니다.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
            
            Cookies.remove('userLogin');
        }
        if(userLogin == undefined){
            dispatch(userInfo({}));
            dispatch(userToken(''));
            dispatch(userRank({userRank:false, userRankData:{}}));
            Cookies.remove('refreshT');
            localStorage.removeItem('expiresAt');

            // navigate('/');
        }
    },[userLogin]);


    //토큰 재발급
    useEffect(()=>{
        if(userLogin === true){
            const refreshToken = Cookies.get('refreshT');
            const expireAt = localStorage.getItem("expiresAt");
            
            if (expireAt) {
                const expiredTime = moment(expireAt);
                const currentTime = moment();
    
                // 토큰이 만료되었는지 확인
                if (currentTime.isAfter(expiredTime)) {
                    // 토큰 재발급 요청
                    axios.post(user_refresh, { refresh_token: refreshToken })
                    .then((res) => {
                        if (res.status === 200) {
                            const data = res.data;
                            // 토큰 재발급 성공
                            dispatch(userToken(data.accessToken));
                            Cookies.set('refreshT',data.refreshToken, {expires:1});

                            // 만료 시간 업데이트
                            localStorage.setItem(
                                "expiresAt",
                                moment().add(12, 'hours').format("yyyy-MM-DD HH:mm:ss")
                            );
                        }
                    })
                    .catch((error) => {
                        //로그아웃하기
                        dispatch(userInfo({}));
                        Cookies.set('userLogin',false);
                        dispatch(userToken(''));
                        dispatch(userRank({userRank:false, userRankData:{}}));
                        Cookies.remove('refreshT');
                        localStorage.removeItem('expiresAt');
                
                        navigate('/');
                    });
                }
            }
        }
    },[location]);



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