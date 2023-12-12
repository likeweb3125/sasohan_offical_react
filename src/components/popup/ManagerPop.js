import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { managerPop } from "../../store/popupSlice";
import none_img from "../../images/none_img.jpg";

const ManagerPop = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const [feedList, setFeedList] = useState([]);

    //팝업닫기
    const closePopHandler = () => {
        dispatch(managerPop({managerPop:false,managerPopData:{}}));
    };


    // useEffect(()=>{
    //     axios.get(`https://graph.instagram.com/${process.env.REACT_APP_INSTAGRAM_USER_ID}/media?fields=id,media_type,media_url,permalink,thumbnail_url,username,caption&access_token=${process.env.REACT_APP_INSTAGRAM_ACCESS_TOKEN}`)
    //     .then((res)=>{
    //         if(res.status === 200){
    //             let data = res.data;
    //             setFeedList(data.data);
    //         }
    //     })
    //     .catch((error) => {

    //     });


    //     axios.get(`https://graph.instagram.com/me?fields=username,account_type,media_count&access_token=${process.env.REACT_APP_INSTAGRAM_ACCESS_TOKEN}`)
    //     .then((res)=>{
    //         if(res.status === 200){
    //             let data = res.data;
    //         }
    //     })
    //     .catch((error) => {

    //     }); 

    // },[]);


    return(
        <div className="flex_center pop_wrap manager_pop">
            <div className="dim"></div>
            <div className="pop_cont border">
                <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                <div className="pop_tit mo_none">
                    <div className="tit">{popup.managerPopData.manager_type_txt}</div>
                </div>
                <div className="mo_img_box mo_show">
                    <img src={popup.managerPopData.photo ? popup.managerPopData.photo : none_img} alt="매니저프로필이미지" />
                </div>
                <div className="scroll_wrap">
                    <div className="top_box flex_top">
                        <div className="img_box mo_none">
                            <img src={popup.managerPopData.photo ? popup.managerPopData.photo : none_img} alt="매니저프로필이미지" />
                        </div>
                        <div className="txt_box">
                            <p className="name flex">{popup.managerPopData.manager_name}<span className="mo_show">챠밍매니저</span></p>
                            <p className="txt" dangerouslySetInnerHTML={{ __html: popup.managerPopData.txt }}></p>
                        </div>
                    </div>
                    {/* {popup.managerPopData.manager_type == "C" &&
                        <div className="bottom_box">
                            <div className="id_box flex_center">
                                <a href="https://www.instagram.com/sasohan_official_/" rel="noopener noreferrer" target="_blank" className="flex_wrap">
                                    <span>sasohan_official_</span>
                                    <span>팔로워 2.6만</span>
                                </a>
                            </div>
                            <ul className="insta_list flex_wrap">
                                {feedList.length > 0 && feedList.slice(0, 8).map((cont,i)=>{
                                    return(
                                        <li key={i}>
                                            <a href={cont.permalink} rel="noopener noreferrer" target="_blank">
                                                <img src={cont.media_url} alt="인스타피드 이미지" />
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    } */}
                </div>
            </div>
        </div>
    );
};

export default ManagerPop;