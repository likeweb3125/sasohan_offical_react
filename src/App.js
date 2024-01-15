import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ConfirmPop from './components/popup/ConfirmPop';
import Popup from './components/popup/Popup';
import Layout from './components/layout/Layout';
import AppLayout from './components/layout/app/Layout';
import Main from './pages/Main';
import Ranking from './pages/Ranking';
import PasswordChange from './pages/PasswordChange';
import Terms from './pages/Terms';
import Apply from './pages/Apply';
import AppSignup from './pages/app/Signup';
import AppSignup2 from './pages/app/Signup2';
import AppPoint from './pages/app/Point';
import AppPoint2 from './pages/app/Point2';
import AppPoint3 from './pages/app/Point3';
import AppEditProfile from './pages/app/EditProfile';
import AppWithdraw from './pages/app/Withdraw';
import AppListDetail from './pages/app/ListDetail';
import AppImgTest from './pages/app/ImgTest';
import './css/reset.css';
import './css/main.css';
import './css/content.css';
import './css/breakpoint.css';
import './css/app.css';
import './css/common.css';

function App() {
    const popup = useSelector((state)=>state.popup);
    const location = useLocation();
    const [confirm, setConfirm] = useState();

    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);


    //페이지이동시 스크롤탑으로 이동
    useEffect(()=>{
        window.scrollTo(0,0);
    },[location]);


    return(
        <div id="wrap">
            <Routes>
                {/* 메인 */}
                <Route path="/" element={<Layout><Main /></Layout>} />

                {/* 랭킹 */}
                <Route path="/ranking" element={<Layout><Ranking /></Layout>} />

                {/* 비밀번호변경 */}
                <Route path="/reset/:token" element={<Layout><PasswordChange /></Layout>} />

                {/* 서비스약관 */}
                <Route path="/terms/:terms_tit" element={<Layout><Terms /></Layout>} />

                {/* 간편가입신청 */}
                <Route path="/apply" element={<Apply />} />


                {/* 앱 페이지-------------------------------------------- */}
                {/* 회원가입 - 약관동의 */}
                <Route path="/app/signup" element={<AppLayout><AppSignup /></AppLayout>} />

                {/* 회원가입 */}
                <Route path="/app/signup2" element={<AppLayout><AppSignup2 /></AppLayout>} />

                {/* 마이페이지 - 포인트충전 */}
                <Route path="/app/point" element={<AppLayout><Outlet /></AppLayout>}>
                    {/* 포인트충전 */}
                    <Route path="" element={<AppPoint />} />

                    {/* 결제 진행중,완료 */}
                    <Route path="/app/point/pending" element={<AppPoint2 />} />

                    {/* 결제실패 */}
                    <Route path="/app/point/failed" element={<AppPoint3 />} />
                </Route>

                {/* 마이페이지 - 프로필수정 */}
                <Route path="/app/edit_profile" element={<AppLayout><AppEditProfile /></AppLayout>} />

                {/* 마이페이지 - 회원탈퇴 */}
                <Route path="/app/withdraw" element={<AppLayout><AppWithdraw /></AppLayout>} />

                {/* 공지사항 - 상세 */}
                <Route path="/app/bbs/:list_no" element={<AppLayout><AppListDetail /></AppLayout>} />


                {/* 회원가입 프로필사진등록 테스트 */}
                <Route path="/app/img_test" element={<AppLayout><AppImgTest /></AppLayout>} />

            </Routes>

            {/* 팝업 */}
            <Popup />

            {/* confirm팝업 */}
            {confirm && <ConfirmPop />}
        </div>
    );
}

export default App;
