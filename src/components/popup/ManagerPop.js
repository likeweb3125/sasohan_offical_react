import { useDispatch } from "react-redux";
import { managerPop } from "../../store/popupSlice";
import manager_img from "../../images/sample/manager0.png";

const ManagerPop = () => {
    const dispatch = useDispatch();

    //팝업닫기
    const closePopHandler = () => {
        dispatch(managerPop(false));
    };

    return(
        <div className="flex_center pop_wrap manager_pop">
            <div className="dim"></div>
            <div className="pop_cont">
                <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                <div className="pop_tit mo_none">
                    <div className="tit">챠밍매니저</div>
                </div>
                <div className="mo_img_box mo_show">
                    <img src={manager_img} alt="매니저프로필이미지" />
                </div>
                <div className="scroll_wrap">
                    <div className="top_box flex">
                        <div className="img_box mo_none">
                            <img src={manager_img} alt="매니저프로필이미지" />
                        </div>
                        <div className="txt_box">
                            <p className="name flex">김다은<span className="mo_show">챠밍매니저</span></p>
                            <p className="txt">안녕하세요! 
                            저는 여러분들의 멋진 인연을 만들기 위해 최선을 다하는 
                            챠밍매니저 이유정입니다.

                            저는 여러분들과 진심을 다해 대화하고 이야기를 공유할 준비가 되어 있습니다. 
                            만나서 반갑습니다. 😁</p>
                        </div>
                    </div>
                    <div className="bottom_box">
                        <div className="id_box flex_center">
                            <a href="/" rel="noopener noreferrer" className="flex_wrap">
                                <span>sasohan.0605</span>
                                <span>팔로워 2.6만</span>
                            </a>
                        </div>
                        <ul className="insta_list flex_wrap">
                            <li>
                                <a href="/" rel="noopener noreferrer">
                                    <img src={manager_img} alt="인스타피드 이미지" />
                                </a>
                            </li>
                            <li>
                                <a href="/" rel="noopener noreferrer">
                                    <img src={manager_img} alt="인스타피드 이미지" />
                                </a>
                            </li>
                            <li>
                                <a href="/" rel="noopener noreferrer">
                                    <img src={manager_img} alt="인스타피드 이미지" />
                                </a>
                            </li>
                            <li>
                                <a href="/" rel="noopener noreferrer">
                                    <img src={manager_img} alt="인스타피드 이미지" />
                                </a>
                            </li>
                            <li>
                                <a href="/" rel="noopener noreferrer">
                                    <img src={manager_img} alt="인스타피드 이미지" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerPop;