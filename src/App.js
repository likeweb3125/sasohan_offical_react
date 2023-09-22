import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ConfirmPop from './components/popup/ConfirmPop';
import Popup from './components/popup/Popup';
import Layout from './components/layout/Layout';
import AppLayout from './components/layout/app/Layout';
import Main from './pages/Main';
import AppSignup from './pages/app/Signup';
import AppSignup2 from './pages/app/Signup2';
import AppPoint from './pages/app/Point';
import './css/reset.css';
import './css/main.css';
import './css/breakpoint.css';
import './css/app.css';
import './css/common.css';

function App() {
    const popup = useSelector((state)=>state.popup);
    const [confirm, setConfirm] = useState();

    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);

    return(
        <div id="wrap">
            <Routes>
                {/* 메인 */}
                <Route path="/" element={<Layout><Main /></Layout>} />


                {/* 앱 페이지-------------------------------------------- */}
                {/* 회원가입 - 약관동의 */}
                <Route path="/app/signup" element={<AppLayout title="회원가입"><AppSignup /></AppLayout>} />

                {/* 회원가입 */}
                <Route path="/app/signup2" element={<AppLayout title="회원가입"><AppSignup2 /></AppLayout>} />

                {/* 마이페이지 - 포인트충전 */}
                <Route path="/app/point" element={<AppLayout title="포인트 충전"><AppPoint /></AppLayout>} />

            </Routes>

            {/* 팝업 */}
            <Popup />

            {/* confirm팝업 */}
            {confirm && <ConfirmPop />}
        </div>
    );
}

export default App;
