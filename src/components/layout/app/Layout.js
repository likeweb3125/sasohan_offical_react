import Header from "./Header";


const Layout = (props) => {
    return(<>
        <Header />
        <div>{props.children}</div>
    </>);
};

export default Layout;