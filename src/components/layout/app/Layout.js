import Header from "./Header";


const Layout = (props) => {
    return(<>
        {/* <Header title={props.title} /> */}
        <div>{props.children}</div>
    </>);
};

export default Layout;