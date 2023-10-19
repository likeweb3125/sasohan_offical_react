import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { appTermsPop, confirmPop, appProfilePop, appProfileImgPop, appProfilePop2, appSignupCompletePop } from "../../store/popupSlice";
import { profileImgs } from "../../store/commonSlice";
import profile_img from "../../images/app/profile_img.jpg";

const ImgTest = () => {
    const [imgList, setImgList] = useState([1,2,3,4,5,6,7,8]);
    const [imgNameList, setImgNameList] = useState(["","","","","","","",""]);
    const dispatch = useDispatch();
    const common = useSelector((state)=>state.common);


    //프로필사진 등록시
    useEffect(()=>{
        setImgNameList(common.profileImgs);
    },[common.profileImgs]);


    //프로필사진 삭제
    const imgDeltHandler = (idx) => {
        let newNameList = [...common.profileImgs];
            newNameList[idx] = "";
        setImgNameList(newNameList);
        dispatch(profileImgs(newNameList));
    };


    return(
        <div className="signup_wrap">
            <div className="signup_cont scroll_wrap">
                <div className="signup_box">
                    <div className="gray_box">회원님의 프로필 사진을 등록해주세요!</div>
                    <div className="flex_top">
                        <div className="img_box">
                            <img src={profile_img} alt="이미지" />
                        </div>
                        <div className="txt_box">
                            <p className="name">사소한 매니저 하니</p>
                            <div className="inner_box">
                                <div className="tit_box">
                                    <p className="f_20 medium">본인의 얼굴이 잘보이는 사진을 <br/><strong>최소 1장</strong> 등록해주세요.</p>
                                </div>
                            </div>
                            <ul className="profile_img_ul flex_wrap">
                                {imgList.map((img,i)=>{
                                    return(
                                        <li key={`imgUp${i}`} className={imgNameList[i] ? "on" : ""}>
                                            <div className="img"
                                                onClick={()=>{
                                                    dispatch(appProfileImgPop({appProfileImgPop:true, appProfileImgPopIdx:i}));
                                                }}
                                            >
                                                {imgNameList[i] && <img src={imgNameList[i]} alt="프로필이미지"/>}
                                            </div>
                                            <button type="button" className="btn_delt" onClick={()=>{imgDeltHandler(i)}}>삭제버튼</button>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="flex_end tp10">
                                <button type="button" className="app_btn_s" >다음</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImgTest;