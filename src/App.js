import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ConfirmPop from './components/popup/ConfirmPop';
import Popup from './components/popup/Popup';
import Layout from './components/layout/Layout';
import AppLayout from './components/layout/app/Layout';
import Main from './pages/Main';

import Login from './pages/member/Login';
import Signup from './pages/member/Signup';
import Signup2 from './pages/member/Signup2';
import Signup3 from './pages/member/Signup3';
import FindUser from './pages/member/FindUser';
import ResetPassword from './pages/member/ResetPassword';
import Mypage from './pages/member/Mypage';
import EditMyInfo from './pages/member/EditMyInfo';
import AllFeed from './pages/square/AllFeed';
import ManagerList from './pages/square/ManagerList';
import ManagerDetail from './pages/square/ManagerDetail';
import AboutVIP from './pages/AboutVIP';
import Ranking from './pages/Ranking';
import PasswordChange from './pages/PasswordChange';
import Terms from './pages/Terms';
import UserDelt from './pages/member/UserDelt';
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


    // 팝업이 열리면 배경 스크롤을 막음
    useEffect(() => {
        const hasOpenPop = Object.keys(popup).some(key => key.endsWith('Pop') && popup[key]);
    
        if (hasOpenPop) {
            document.body.style.cssText = 'overflow: hidden;';
        } else {
            document.body.style.cssText = '';
        }
    }, [popup]);  // popup 상태가 변경될 때마다 useEffect가 실행됩니다.


    return(
        <div id="wrap">
            <Routes>
                {/* 메인 */}
                <Route path="/" element={<Layout><Main /></Layout>} />

                {/* 로그인 */}
                <Route path="/member/login" element={<Layout><Login /></Layout>} />

                {/* 회원가입 - 약관동의 */}
                <Route path="/member/signup" element={<Layout><Signup /></Layout>} />
                {/* 회원가입 - 정보입력 */}
                <Route path="/member/signup2" element={<Layout><Signup2 /></Layout>} />
                {/* 회원가입 - 가입완료 */}
                <Route path="/member/signup3" element={<Layout><Signup3 /></Layout>} />

                {/* 아이디 / 비밀번호 찾기 */}
                <Route path="/member/find" element={<Layout><FindUser /></Layout>} />
                {/* 비밀번호 찾기 - 비밀번호변경 */}
                <Route path="/member/reset-password" element={<Layout><ResetPassword /></Layout>} />

                {/* 마이페이지 */}
                <Route path="/member/mypage" element={<Layout><Mypage /></Layout>} />
                {/* 마이페이지 - 기본정보수정 */}
                <Route path="/member/mypage/myinfo" element={<Layout><EditMyInfo /></Layout>} />

                {/* 회원정보 삭제 */}
                <Route path="/member/delete" element={<Layout><UserDelt /></Layout>} />


                {/* 스퀘어 -------------------*/}
                <Route path="/square" element={<Layout><Outlet/></Layout>}>
                    {/* 피드 스퀘어 */}
                    <Route path="all-feed" element={<AllFeed />} />

                    {/* 매니저 리스트 */}
                    <Route path="manager-list" element={<ManagerList />} />
                    {/* 매니저 리스트 - 상세 */}
                    <Route path="manager/:m_id" element={<ManagerDetail />} />
                </Route>


                {/* VIP 소개팅 */}
                <Route path="/about-vip" element={<Layout><AboutVIP /></Layout>} />

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

                    {/* 결제 완료 */}
                    <Route path="/app/point/success" element={<AppPoint2 />} />

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
