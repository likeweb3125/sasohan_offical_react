import Header from "./Header";
import Footer from "./Footer";

const Layout = (props) => {

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