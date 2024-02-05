import Header from "./Header";
import Footer from "./Footer";
import { useEffect } from "react";

const Layout = (props) => {

    //Google tag 
    useEffect(() => {
        // Google Analytics 초기화
        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'AW-10879238974');
    }, []);

    return(
        <>
            <Header />
            <div className="content_wrap">
                {props.children}
            </div>
            <Footer />
        </>
    );
};

export default Layout;