import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import ConfirmPop from './components/popup/ConfirmPop';
import Popup from './components/popup/Popup';
import Layout from './components/layout/Layout';
import Main from './pages/Main';
import './css/reset.css';
import './css/main.css';
import './css/breakpoint.css';
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
            <Helmet>
                <title>SASOHAN</title>
                <meta property="og:title" content="사소한 채팅" /> 
                <meta property="og:description" content="사소한 채팅" /> 
                <meta property="og:type" content="website" /> 
                <meta property="og:url" content="https://www.sasohan.net/" /> 
                <meta property="og:image" content="./images/thumbnail.png" /> 
            </Helmet>
            <Routes>
                {/* 메인 */}
                <Route path="/" element={<Layout><Main /></Layout>} />
            </Routes>

            {/* 팝업 */}
            <Popup />

            {/* confirm팝업 */}
            {confirm && <ConfirmPop />}
        </div>
    );
}

export default App;
