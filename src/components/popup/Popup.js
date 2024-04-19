import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createPortal } from "react-dom";
import ManagerPop from "./ManagerPop";
import ImgPop from "./ImgPop";
import ReviewPop from "./ReviewPop";
import ApplyPop from "./ApplyPop";
import StoryPop from "./StoryPop";
import ProfileEditPop from "./ProfileEditPop";
import TermsPop from "./TermsPop";
import FeedPop from "./FeedPop";
import FeedAddPop from "./FeedAddPop";
import FeedProfilePop from "./FeedProfilePop";
import VipApplyPop from "./VipApplyPop";
import AppTermsPop from "./app/TermsPop";
import AppProfilePop from "./app/ProfilePop";
import AppProfileImgPop from "./app/ProfileImgPop";
import AppProfileImgPop2 from "./app/ProfileImgPop2";
import AppProfilePop2 from "./app/ProfilePop2";
import AppSignupCompletePop from "./app/SignupCompletePop";
import AppPointPop from "./app/PointPop";
import AppChangePasswordPop from "./app/ChangePasswordPop";
import LoadingPop from "./LoadingPop";


const Popup = () => {
    const popup = useSelector((state)=>state.popup);


    return createPortal(
        <>
            {/* 챠밍매니저 팝업 */}
            {popup.managerPop && <ManagerPop />}

            {/* 이미지 팝업 */}
            {popup.imgPop && <ImgPop />}

            {/* 후기 팝업 */}
            {popup.reviewPop && <ReviewPop />}

            {/* 소개팅신청하기 팝업 */}
            {popup.applyPop && <ApplyPop />}

            {/* 실시간만남스토리 팝업 */}
            {popup.storyPop && <StoryPop />}

            {/* 랭킹 프로필수정 팝업 */}
            {popup.profileEditPop && <ProfileEditPop />}

            {/* 스퀘어 - 피드상세 팝업 */}
            {popup.feedPop && <FeedPop />}

            {/* 스퀘어 - 피드작성,수정 팝업 */}
            {popup.feedAddPop && <FeedAddPop />}

            {/* 피드프로필 팝업 */}
            {popup.feedProfilePop && <FeedProfilePop />}

            {/* VIP회원 지원 팝업 */}
            {popup.vipApplyPop && <VipApplyPop />}

            {/* 앱 팝업----------------------------------------- */}
            {/* 회원가입 약관 팝업 */}
            {popup.appTermsPop && <AppTermsPop />}

            {/* 회원가입 프로필설정 팝업 */}
            {popup.appProfilePop && <AppProfilePop />}

            {/* 회원가입 프로필사진 팝업 */}
            {popup.appProfileImgPop && <AppProfileImgPop />}

            {popup.appProfileImgPop2 && <AppProfileImgPop2 />}

            {/* 회원가입 이상형정보설정 팝업 */}
            {popup.appProfilePop2 && <AppProfilePop2 />}

            {/* 회원가입 완료 팝업 */}
            {popup.appSignupCompletePop && <AppSignupCompletePop />}

            {/* 포인트충전완료 팝업 */}
            {popup.appPointPop && <AppPointPop />}

            {/* 마이페이지 - 프로필수정 - 비밀번호변경 팝업 */}
            {popup.appChangePasswordPop && <AppChangePasswordPop />}



            {/* 회원가입,VIP회원 지원팝업 - 약관 팝업 */}
            {popup.termsPop && <TermsPop />}

            {/* 로딩 팝업 */}
            {popup.loadingPop && <LoadingPop />}

        </>,
        document.getElementById('modal-root')
    );
};

export default Popup;