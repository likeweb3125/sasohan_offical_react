
import ic_badge from "../../images/ic_badge2.svg";


const ManagerBox = (props) => {
    return(
        <div className="manager_box">
            <div className="img_box">
                <img src={props.img} alt="매니저프로필이미지" />
            </div>
            <div className="txt_box">
                <div className="name flex">
                    <strong>김다은</strong>
                    <span>매칭매니저</span>
                </div>
                <p className="ellipsis2">재미있는 대화 상대 필요하시죠? 😋<br/>저를 찾아 주세요!</p>
            </div>
            <div className="badge">
                <img src={ic_badge} alt="배지이미지" />
            </div>
        </div>
    );
};

export default ManagerBox;