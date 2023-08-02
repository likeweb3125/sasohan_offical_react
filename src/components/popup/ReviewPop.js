import { useDispatch, useSelector } from "react-redux";
import { reviewPop } from "../../store/popupSlice";

const ReviewPop = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);

    //팝업닫기
    const closePopHandler = () => {
        dispatch(reviewPop(false));
    };

    return(
        <div className="flex_center pop_wrap review_pop">
            <div className="dim" onClick={closePopHandler}></div>
            <div className="pop_cont">
                <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                <div className="scroll_wrap">
                    <div className="top_box">
                        <h5>💌 93번째 커플 후기입니다!</h5>
                        <p>2023.06.17</p>
                    </div>
                    <div className="bottom_box">
                        저희 사소한을 방문해주신 여러분 감사합니다.
                        3월 1일(수) 부터 홈페이지를 리뉴얼했습니다!

                        이번 리뉴얼에서는 홈페이지를 방문하는 분들이 필요한 정보에 보다 
                        쉽게 접근하실 수 있도록 디자인을 전면적으로 개편하였습니다.

                        대표적인 리뉴얼 포인트는 '직관적인 페이지 레이아웃과 메뉴 간소화'입니다.
                        저희 사소한이 운영하며 정리한 피드들을 요약하여 게시글을 업로드하였고, 추후 더 많은 소식이 게재될 예정입니다.

                        또한 홈페이지를 리뉴얼함에 따라 기존 회원으로 등록해주신 분은
                        번거로우시겠지만, 새로운 홈페이지에 가입해주시길 바랍니다.

                        저희 기관은 앞으로도 다양한 콘텐츠 업로드로
                        방문자님에게 웹사이트를 통해 보다 유익한 정보를 드리겠습니다.
                        감사합니다.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewPop;