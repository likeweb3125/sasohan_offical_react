import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import history from "../../config/history";
import * as CF from "../../config/function";
import { feedProfilePop } from "../../store/popupSlice";
import none_profile from "../../images/none_profile2.jpg";


const FeedProfilePop = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [profile, setProfile] = useState({});
    const [imgPop, setImgPop] = useState(false);


    //화면사이즈 변경될때 width 체크---------
    useEffect(() => {
        const handleWindowResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    },[]);


    //팝업닫기
    const closePopHandler = () => {
        dispatch(feedProfilePop({feedProfilePop:false,feedProfilePopData:{}}));
    };


    //페이지 이동시 팝업닫기
    useEffect(() => {
        const listenBackEvent = () => {
            closePopHandler();
        };
    
        const unlistenHistoryEvent = history.listen(({ action }) => {
            if (action === "POP") {
                listenBackEvent();
            }
        });

        return unlistenHistoryEvent;
    },[]);


    //피드프로필 정보
    useEffect(()=>{
        const data = popup.feedProfilePopData;
        const rank = data.rank;
        const diff = data.diff_rank;
        let diff_num = data.diff_rank;
        let tag;

        //순위
        if(diff == 0){
            tag = "";
        }else{
            if(diff.includes("-")){
                tag = " down";
                diff_num = diff_num.replace("-","");
            }else{
                tag = " up";
            }
        }

        if(diff_num > 9999){
            diff_num = 9999;
        }

        let isClass = false;
        if(data.class_number > 0){
            isClass = true;
        }

        let myPhoto = false;
        if(data.m_f_photo.length > 0){
            myPhoto = true;
        }

        const newProfile = {...data};
        newProfile.rank = rank;
        newProfile.tag = tag;
        newProfile.diff_num = diff_num;
        newProfile.isClass = isClass;
        newProfile.myPhoto = myPhoto;
        setProfile(newProfile);
    },[popup.feedProfilePopData]);


    //피드이미지 있을때만 피드이미지 팝업 띄우기
    const onImgClickHandler = () => {
        if(profile.myPhoto){
            setImgPop(true);
        }
    };




    return(<>
        <div className="flex_center pop_wrap feed_profile_pop">
            <div className="dim" onClick={closePopHandler}></div>
            <div className="pop_cont">
                <button type="button" className="btn_close black" onClick={closePopHandler}>닫기버튼</button>
                <div className="pop_tit">
                    <div className="tit">{profile.m_n_name} 님의 피드 프로필</div>
                </div>
                <div className="scroll_wrap">
                    <div className={`img_box${profile.myPhoto ? ' pointer' : ''}`} onClick={onImgClickHandler}>
                        <img src={profile.myPhoto ? profile.m_f_photo : none_profile} alt="피드프로필" />
                    </div>
                    <div className="ranking_ul_box">
                        <ul className="top_ul">
                            <li>순위</li>
                            <li>{windowWidth > 767 ? "레벨" : "닉네임 / 클래스 / 레벨"}</li>
                            <li>닉네임</li>
                            <li>클래스</li>
                        </ul>
                        <ul className="list_ul">
                            {Object.keys(profile).length > 0 && 
                                <li>
                                    <div className="box rank_box flex_center">
                                        <div className="flex_center">
                                            <p>{CF.MakeIntComma(profile.rank)}<span>위</span></p>
                                        </div>
                                        <div className={`tag flex_center${profile.tag}`}><span>{profile.tag.length > 0 ? CF.MakeIntComma(profile.diff_num) : "-"}</span></div>
                                    </div>
                                    <div className="box name_box">
                                        <div className="inner_box flex_start flex_wrap">
                                            <div className="flex_top">
                                                <div className={`profile_img_box class_${profile.class_number}`}>   
                                                    <div className='img'>
                                                        <div>
                                                            <img src={profile.myPhoto ? profile.m_f_photo : none_profile} alt="피드프로필" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className={`name${profile.M_N_Name_modify === 1 ? ' color_black' : ''}`}>{profile.m_n_name}</p>
                                            </div>
                                        </div>
                                        <div className="mo_show">
                                            <ul className="flex_wrap">
                                                {profile.isClass && <li><img src={require(`../../images/class_img${profile.class_number}.png`)} alt="클래스이미지" /></li>}
                                                <li className="flex">
                                                    <span>LV.</span>
                                                    <p>{CF.MakeIntComma(profile.level)}</p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="box class_box flex_center">
                                        {profile.isClass && <img src={require(`../../images/class_img${profile.class_number}.png`)} alt="클래스이미지" />}
                                    </div>
                                    <div className="box level_box flex_center">
                                        <span>LV.</span>
                                        <p>{CF.MakeIntComma(profile.level)}</p>
                                    </div>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        
        {imgPop &&
            <div className="flex_center pop_wrap feed_profile_img_pop">
                <div className="dim" onClick={()=>setImgPop(false)}></div>
                <div className="img_box flex_top">
                    <div className="dim" onClick={()=>setImgPop(false)}></div>
                    <div className="img">
                        <img src={profile.m_f_photo} alt="피드프로필" />
                    </div>
                    <button type="button" className="btn_img_close" onClick={()=>setImgPop(false)}>닫기버튼</button>
                </div>
            </div>
        }
    </>);
};

export default FeedProfilePop;