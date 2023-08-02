import ic_badge from "../../images/ic_badge2.svg";
import none_img from "../../images/none_img.jpg";

const ManagerBox = (props) => {
    return(
        <div className="manager_box">
            <div className="img_box">
                <img src={props.data.photo ? props.data.photo : none_img} alt="매니저프로필이미지" />
            </div>
            <div className="txt_box">
                <div className="name flex_wrap">
                    <strong>{props.data.manager_name}</strong>
                    <span>{props.data.manager_type_txt}</span>
                </div>
                <p className="ellipsis2">{props.data.txt}</p>
            </div>
            <div className="badge">
                <img src={ic_badge} alt="배지이미지" />
            </div>
        </div>
    );
};

export default ManagerBox;