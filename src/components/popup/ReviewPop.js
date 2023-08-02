import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import * as CF from "../../config/function";
import { enum_api_uri } from "../../config/enum";
import { reviewPop, confirmPop } from "../../store/popupSlice";
import ConfirmPop from "./ConfirmPop";

const ReviewPop = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const review_cont = enum_api_uri.review_cont;
    const [confirm, setConfirm] = useState(false);
    const [review, setReview] = useState({});

    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);

    //팝업닫기
    const closePopHandler = () => {
        dispatch(reviewPop({reviewPop:false,reviewPopNo:null}));
    };

    //후기내용 가져오기
    const getReview = () => {
        axios.get(`${review_cont.replace(":list_no",popup.reviewPopNo)}`)
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setReview({...data});
            }
        })
        .catch((error) => {
            const err_msg = CF.errorMsgHandler(error);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: err_msg,
                confirmPopBtn:1,
            }));
            setConfirm(true);
        });
    }

    useEffect(()=>{
        getReview();
    },[]);


    return(<>
        <div className="flex_center pop_wrap review_pop">
            <div className="dim" onClick={closePopHandler}></div>
            <div className="pop_cont">
                <div className="scroll_wrap">
                    <div className="top_box">
                        <h5>{review.subject}</h5>
                        <p>{review.w_date}</p>
                        <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                    </div>
                    <div className="bottom_box" dangerouslySetInnerHTML={{ __html: review.contents }}></div>
                </div>
            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default ReviewPop;