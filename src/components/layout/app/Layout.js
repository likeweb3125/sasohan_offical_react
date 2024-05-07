import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";


const Layout = (props) => {
    const location = useLocation();


    //페이지이동시 스크롤탑으로 이동
    useEffect(()=>{
        window.scrollTo(0,0);
    },[location]);


    return(<>
        {/* <Header title={props.title} /> */}
        <div className="app_page">{props.children}</div>
    </>);
};

export default Layout;