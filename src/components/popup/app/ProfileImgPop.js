import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { appProfileImgPop } from "../../../store/popupSlice";


function openCamera() {
    // getUserMedia API를 사용하여 웹캠 액세스 권한 요청
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        // 웹캠 스트림을 표시할 비디오 요소 생성
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
  
        // 비디오 요소를 DOM에 추가하여 웹캠 화면 표시
        document.body.appendChild(video);
    })
    .catch((error) => {
        console.error('웹캠 액세스 권한을 얻는 데 실패했습니다:', error);
    });
}


const ProfileImgPop = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const [off, setOff] = useState(false);

    //팝업닫기--------------
    const closePopHandler = () => {
        setOff(true);
    };

    useEffect(()=>{
        if(off){
            setTimeout(()=>{
                dispatch(appProfileImgPop(false));
            },500);
        }
    },[off]);


    const openCameraHandler = () => {
        openCamera();
        // 모바일 브라우저에서만 카메라 열기 함수 실행
        // if (
        //   /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        //     navigator.userAgent
        //   )
        // ) {
        //   openCamera();
        // } else {
        //   alert('카메라 기능은 모바일 디바이스에서만 지원됩니다.');
        // }
    };


    return(
        <div className={`app_pop_wrap app_profile_img_pop${off ? " off" : ""}`}>
            <div className="dim" onClick={closePopHandler}></div>
            <div className="pop_cont">
                <div className="flex_center">
                    <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                </div>
                <div className="scroll_wrap">
                    <ul className="list_ul">
                        <li className="on">대표 프로필 지정</li>
                        <li onClick={openCameraHandler}>카메라</li>
                        <li>갤러리</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProfileImgPop;