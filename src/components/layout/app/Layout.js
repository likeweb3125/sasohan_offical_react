import Header from "./Header";


const Layout = (props) => {
    return(<>
        {/* <Header title={props.title} /> */}
        <div className="app_page">{props.children}</div>
    </>);
};

export default Layout;