import { Link } from "react-router-dom";

const ListTopTitleBox = ({tit, link, txt, tipBox}) => {
    return(<>
        <div className="list_tit_box">
            <Link to={link} className="tit">{tit}</Link>
            <div className="flex_wrap">
                <p className="txt rp20">{txt}</p>
                {tipBox}
            </div>
        </div>
    </>);
};

export default ListTopTitleBox;