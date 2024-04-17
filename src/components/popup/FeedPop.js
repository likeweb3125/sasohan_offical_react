import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import history from "../../config/history";
import axios from "axios";
import * as CF from "../../config/function";
import { enum_api_uri } from "../../config/enum";
import { feedPop, feedAddPop, confirmPop, loadingPop, feedProfilePop } from "../../store/popupSlice";
import { feedRefresh } from "../../store/commonSlice";
import EditBox from "../component/square/EditBox";
import Comment from "../component/square/Comment";
import WriteTextareaBox from "../component/square/WriteTextareaBox";
import ConfirmPop from "./ConfirmPop";


const FeedPop = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state)=>state.user);
    const popup = useSelector((state)=>state.popup);
    const common = useSelector((state)=>state.common);
    const feed_content = enum_api_uri.feed_content;
    const feed_favorite = enum_api_uri.feed_favorite;
    const feed_delt = enum_api_uri.feed_delt;
    const feed_comment_list = enum_api_uri.feed_comment_list;
    const feed_comment = enum_api_uri.feed_comment;
    const feed_comment_modify = enum_api_uri.feed_comment_modify;
    const feed_comment_delt = enum_api_uri.feed_comment_delt;
    const text_check = enum_api_uri.text_check;
    const [confirm, setConfirm] = useState(false);
    const [feedDeltConfirm, setFeedDeltConfirm] = useState(false);
    const [commentDeltConfirm, setCommentDeltConfirm] = useState(false);
    const [feedData, setFeedData] = useState({});
    const [imgList, setImgList] = useState([]);
    const [imgOn, setImgOn] = useState(0);
    const [imgPrevBtn, setImgPrevBtn] = useState(false);
    const [imgNextBtn, setImgNextBtn] = useState(false);
    const [commentList, setCommentList] = useState([]);
    const [editBoxOn, setEditBoxOn] = useState(null);
    const [commentValue, setCommentValue] = useState('');
    const [replyValue, setReplyValue] = useState('');
    const [replyBoxOn, setReplyBoxOn] = useState(null);
    const [commentEditOn, setCommentEditOn] = useState(null);
    const [feedEditBtn, setFeedEditBtn] = useState(false);
    const [commentEditBtn, setCommentEditBtn] = useState(false);
    const feedIdx = popup.feedPopNoList.indexOf(popup.feedPopNo);
    const [nextBtn, setNextBtn] = useState(false);
    const [prevBtn, setPrevBtn] = useState(false);
    const commentListBoxRef = useRef(null);


    // Confirm팝업 닫힐때
    useEffect(()=>{ 
        if(popup.confirmPop === false){
            setConfirm(false);
            setFeedDeltConfirm(false);
            setCommentDeltConfirm(false);
        }
    },[popup.confirmPop]);


    //팝업닫기
    const closePopHandler = () => {
        dispatch(feedPop({feedPop:false,feedPopNo:null}));
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


    //피드내용 가져오기
    const getFeed = () => {
        axios.get(`${feed_content.replace(":idx",popup.feedPopNo)}`)
        .then((res)=>{
            if(res.status === 200){
                const data = res.data;
                setFeedData({...data});
                setImgList([...data.photo]);
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


    //피드댓글리스트 가져오기
    const getCommentList = () => {
        axios.get(`${feed_comment_list.replace(":idx",popup.feedPopNo)}`)
        .then((res)=>{
            if(res.status === 200){
                const data = res.data;
                setCommentList(data);
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

    
    //피드내용, 댓글리스트 가져오기
    useEffect(()=>{
        getFeed();
        getCommentList();

        //피드 다음버튼
        if(feedIdx+1 < popup.feedPopNoList.length){
            setNextBtn(true);
        }else{
            setNextBtn(false);
        }
        
        //피드 이전버튼
        if(feedIdx === 0){
            setPrevBtn(false);
        }else{
            setPrevBtn(true);
        }
    },[popup.feedPopNo]);


    //피드 수정시 피드내용, 댓글리스트 가져오기
    useEffect(()=>{
        if(common.feedRefresh){
            getFeed();
            getCommentList();

            setEditBoxOn(null);
            setImgOn(0);
            dispatch(feedRefresh(false));
        }
    },[common.feedRefresh])


    //피드   ----------------------------------
    //피드 좋아요하기
    const likeBtnClickHandler = () => {
        const body = {
            idx:popup.feedPopNo
        };
        axios.post(feed_favorite,body,{
            headers: {
                Authorization: `Bearer ${user.userToken}`,
            },
        })
        .then((res)=>{
            if(res.status === 200){
                const newData = {...feedData};
                newData.fv_flag = true;
                newData.fv_cnt = newData.fv_cnt+1;
                setFeedData(newData);
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
        })
    };


    //피드이미지 이전,다음버튼 노출체크
    useEffect(()=>{
        if(imgList.length > 0){
            if(imgList.length > 1){
                if(imgOn === 0){
                    setImgPrevBtn(false);
                    setImgNextBtn(true);
                }else if(imgOn+1 === imgList.length){
                    setImgPrevBtn(true);
                    setImgNextBtn(false);
                }else{
                    setImgPrevBtn(true);
                    setImgNextBtn(true);
                }
            }else{
                setImgPrevBtn(false);
                setImgNextBtn(false);
            }
        }
    },[imgList, imgOn]);


    //피드이미지 이전,다음버튼 클릭시
    const imgBtnClickHandler = (arrow) => {
        const idx = imgOn;
        if(arrow == 'prev'){
            setImgOn(idx-1);
        }
        if(arrow == 'next'){
            setImgOn(idx+1);
        }
    };


    //다음버튼 클릭시
    const nextHandler = () => {
        dispatch(feedPop({feedPop:true,feedPopNo:popup.feedPopNoList[feedIdx+1]}));
        setImgOn(0);
    };

    //이전버튼 클릭시
    const prevHandler = () => {
        dispatch(feedPop({feedPop:true,feedPopNo:popup.feedPopNoList[feedIdx-1]}));
        setImgOn(0);
    };


    //피드 수정,삭제버튼 클릭시
    const onEditBoxClickHandler = (boolean, idx) => {
        if(boolean){
            setEditBoxOn(idx);
        }else{
            setEditBoxOn(null);
        }
    };


    //피드 수정버튼 클릭시 피드수정팝업열기
    const onFeedEditHandler = () => {
        dispatch(feedAddPop({feedAddPop:true, feedAddPopNo:feedData.idx}));
    };


    //피드 삭제버튼 클릭시
    const onFeedDeltHandler = () => {
        dispatch(confirmPop({
            confirmPop:true,
            confirmPopTit:'알림',
            confirmPopTxt:'피드를 삭제하시겠습니까?',
            confirmPopBtn:2,
        }));
        setFeedDeltConfirm(true);
    };

    //피드 삭제하기
    const feedDeltHandler = () => {
        axios.delete(`${feed_delt.replace(':idx',popup.feedPopNo)}`,{
            headers: {
                Authorization: `Bearer ${user.userToken}`,
            },
        })
        .then((res)=>{
            if(res.status === 200){
                dispatch(feedRefresh(true));
                closePopHandler();
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
        })
    };


    //댓글   ----------------------------------
    useEffect(()=>{
        //댓글리스트 맨밑으로 스크롤
        if (commentListBoxRef.current) {
            setTimeout(()=>{
                commentListBoxRef.current.scrollTop = commentListBoxRef.current.scrollHeight;
            },10);
        }
    },[commentList]);


    //댓글내용 부적격 체크하기
    const onTextCheckHandler = (reply, id) => {
        dispatch(loadingPop(true));

        let content = commentValue;

        //답글일때
        if(reply){
            content = replyValue;
        }

        const body = {
            text : content,
        };

        axios.post(text_check,body,{
            headers: {
                Authorization: `Bearer ${user.userToken}`,
            },
        })
        .then((res)=>{
            if(res.status === 200){
                dispatch(loadingPop(false));

                const data = res.data.result;
                //result = [긍정적%,부정적%]
                //부정적이 70% 이상이면 댓글작성 불가능
                if(data[1] >= 70){
                    dispatch(confirmPop({
                        confirmPop:true,
                        confirmPopTit:'알림',
                        confirmPopTxt:'존중과 이해를 바탕으로 한 대화를 장려합니다. <br/>귀하의 댓글을 수정해 주세요.',
                        confirmPopBtn:1,
                    }));
                    setConfirm(true);
                }else{
                    onCommentHandler(reply, id);
                }
            }
        })
        .catch((error) => {
            dispatch(loadingPop(false));

            const err_msg = CF.errorMsgHandler(error);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: err_msg,
                confirmPopBtn:1,
            }));
            setConfirm(true);
        });
    };


    //댓글, 답글쓰기
    const onCommentHandler = (reply, id) => {
        let comment_idx = 0;
        let content = commentValue;
        let to_id = '';

        //답글일때
        if(reply){
            comment_idx = replyBoxOn;
            content = replyValue;
            to_id = id;
        }

        //새로 등록일때
        if(commentEditOn === null){
            const body = {
                idx : popup.feedPopNo,
                comment_idx : comment_idx, // 상위댓글idx (대댓글 아닐 경우 0)
                content : content,
                to_id : to_id
            };
    
            axios.post(feed_comment,body,{
                headers: {
                    Authorization: `Bearer ${user.userToken}`,
                },
            })
            .then((res)=>{
                if(res.status === 200){
                    setCommentValue('');
                    getCommentList();
                    setReplyValue('');
                    setReplyBoxOn(null);
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
        //댓글, 답글 수정일때
        else{
            const body = {
                comment_idx : replyBoxOn,
                content : content
            };
    
            axios.put(feed_comment_modify,body,{
                headers: {
                    Authorization: `Bearer ${user.userToken}`,
                },
            })
            .then((res)=>{
                if(res.status === 200){
                    getCommentList();
                    setReplyValue('');
                    setReplyBoxOn(null);
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
    };


    //답글쓰기 버튼 클릭시
    const onReplyBoxClickHandler = (comment_idx) => {
        if(replyBoxOn === null || replyBoxOn !== comment_idx){
            setReplyBoxOn(comment_idx);
        }else{
            setReplyBoxOn(null);
        }
    };


    //댓글리스트중에 원하는 comment_idx 값 찾기
    function findObjectById(dataArray, targetId) {
        for (const item of dataArray) {
            // 현재 객체의 id를 비교하여 찾는다
            if (item.comment_idx == targetId) {
                return item;
            }
            
            // 현재 객체에 comments가 있는지 확인하고, 있을 경우 재귀적으로 검색한다
            if (item.comments) {
                const result = findObjectById(item.comments, targetId);
                if (result) {
                    return result;
                }
            }
        }
        
        // 찾지 못한 경우 null 반환
        return null;
    }


    //댓글 수정버튼 클릭시
    const onCommentEditHandler = () => {
        const editCommentData = findObjectById(commentList, editBoxOn);
        const editCommentId = editCommentData.comment_idx;
        const editComment = editCommentData.content;

        setCommentEditOn(editCommentId);//현재 수정할 댓글 comment_idx 저장
        setEditBoxOn(null);
        setReplyBoxOn(editCommentId);
        setReplyValue(editComment);
    };

    
    //댓글수정 or 답글입력창 닫으면 수정할 댓글 comment_idx -> commentEditOn = null 로 초기화
    useEffect(()=>{
        if(replyBoxOn === null){
            setCommentEditOn(null);
        }
    },[replyBoxOn]);



    //댓글 삭제버튼 클릭시
    const onCommentDeltHandler = () => {
        dispatch(confirmPop({
            confirmPop:true,
            confirmPopTit:'알림',
            confirmPopTxt:'댓글을 삭제하시겠습니까?',
            confirmPopBtn:2,
        }));
        setCommentDeltConfirm(true);
    };

    //댓글 삭제하기
    const commentDeltHandler = () => {
        axios.delete(`${feed_comment_delt.replace(':idx',editBoxOn)}`,{
            headers: {
                Authorization: `Bearer ${user.userToken}`,
            },
        })
        .then((res)=>{
            if(res.status === 200){
                getCommentList();
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
        })
    };



    useEffect(()=>{
        if(user.userLogin){
            //일반회원일때
            if(user.userInfo.user_level == 'U' && user.userInfo.m_id === feedData.manager_id){
                setCommentEditBtn(true);
            }
            //매니저일때
            else if(user.userInfo.user_level == 'M' && user.userInfo.m_id === feedData.manager_id){
                setFeedEditBtn(true);
            }else{
                setFeedEditBtn(false);
                setCommentEditBtn(false);
            }
        }
        //미로그인시 미노출
        else{
            setFeedEditBtn(false);
            setCommentEditBtn(false);
        }
    },[user.userLogin, user.userInfo, feedData]);

    

    //매니저프로필클릭시 매니저상세페이지로 이동
    const onManagerClickHandler = () => {
        closePopHandler();
        navigate(`/square/manager/${feedData.manager_id}`);
    };


    //댓글 프로필클릭시
    const onFeedProfileClickHandler = (info) => {
        //일반회원일때
        if(info.user_level == 'U'){
            const data = {
                m_n_name : info.m_n_name,
                m_f_photo: info.photo,
                M_N_Name_modify: info.M_N_Name_modify,
                rank: info.rank,
                level: info.level,
                class_number: info.class_number,
                class: info.class,
                diff_rank: info.diff_rank,
            };
            dispatch(feedProfilePop({feedProfilePop:true, feedProfilePopData:data}));
        }
        //매니저일때
        if(info.user_level == 'M'){
            closePopHandler();
            navigate(`/square/manager/${info.m_id}`);
        }
    };



    return(<>
        <div className="flex_center pop_wrap feed_pop">
            <div className="dim" onClick={closePopHandler}></div>
            <div className="pop_cont">
                <button type="button" className="btn_feed_close" onClick={closePopHandler}>피드팝업닫기버튼</button>
                <div className="btn_box tab_none">
                    {prevBtn && <button type="button" className="btn_prev" onClick={prevHandler}>이전글</button>}
                    {nextBtn && <button type="button" className="btn_next" onClick={nextHandler}>다음글</button>}
                </div>
                <div className="feed_con flex_between">
                    <div className="cont_box tab_show">
                        <div className="top_box">
                            <div className="profile_box flex_between flex_wrap">
                                <div className="flex">
                                    <div className="profile"><img src={feedData.profile} alt="프로필 이미지"/></div>
                                    <p className={`name${feedData.manager_type == 'C' ? ' charming' : ''}`}>{feedData.manager_name}</p>
                                </div>
                                <EditBox 
                                    editBoxIdx={0}
                                    editBoxOn={editBoxOn}
                                    editBox={feedEditBtn}
                                    onEditBoxClickHandler={onEditBoxClickHandler}
                                    onEditHandler={onFeedEditHandler}
                                    onDeltHandler={onFeedDeltHandler}
                                />
                            </div>
                            <div className="count_box flex_between flex_wrap">
                                <ul className="flex">
                                    {/* 피드좋아요기능 주석처리 */}
                                    {/* <li className={`flex like${feedData.fv_flag ? ' on' : ''}`}
                                        onClick={likeBtnClickHandler}
                                    ><div className="box"></div><p>{CF.MakeIntComma(feedData.fv_cnt)}</p></li> */}
                                    <li className="flex"><div className="box"></div><p>{CF.MakeIntComma(feedData.fv_cnt)}</p></li>
                                    <li className="flex"><div className="box"></div><p>{CF.MakeIntComma(feedData.comment_cnt)}</p></li>
                                    <li className="flex"><div className="box"></div><p>{CF.MakeIntComma(feedData.counter)}</p></li>
                                </ul>
                                <p className="date">{feedData.w_date}</p>
                            </div>
                        </div>
                    </div>
                    <div className="img_box">
                        <div className="img flex_center">{imgList.length > 0 && <img src={imgList[imgOn]} alt="피드 이미지"/>}</div>
                        <ul className="img_list flex_end">
                            {imgList.length > 1 && imgList.map((url,i)=>{
                                return(
                                    <li key={i} 
                                        className={imgOn === i ? 'on' : ''}
                                        onClick={()=>setImgOn(i)}
                                    ><img src={url} alt="피드 이미지"/></li>
                                );
                            })}
                        </ul>
                        {imgPrevBtn && <button type="button" className="btn_prev" onClick={()=>imgBtnClickHandler('prev')}>이전버튼</button>}
                        {imgNextBtn && <button type="button" className="btn_next" onClick={()=>imgBtnClickHandler('next')}>다음버튼</button>}
                    </div>
                    <div className="cont_box">
                        <div className="top_box tab_none">
                            <div className="profile_box flex_between flex_wrap">
                                <div className="flex pointer" onClick={onManagerClickHandler}>
                                    <div className="profile"><img src={feedData.profile} alt="프로필 이미지"/></div>
                                    <p className={`name${feedData.manager_type == 'C' ? ' charming' : ''}`}>{feedData.manager_name}</p>
                                </div>
                                <EditBox 
                                    editBoxIdx={0}
                                    editBoxOn={editBoxOn}
                                    editBox={feedEditBtn}
                                    onEditBoxClickHandler={onEditBoxClickHandler}
                                    onEditHandler={onFeedEditHandler}
                                    onDeltHandler={onFeedDeltHandler}
                                    editBtn={true}
                                />
                            </div>
                            <div className="count_box flex_between flex_wrap">
                                <ul className="flex">
                                    {/* 피드좋아요기능 주석처리 */}
                                    {/* <li className={`flex like${feedData.fv_flag ? ' on' : ''}`}
                                        onClick={likeBtnClickHandler}
                                    ><div className="box"></div><p>{CF.MakeIntComma(feedData.fv_cnt)}</p></li> */}
                                    <li className="flex"><div className="box"></div><p>{CF.MakeIntComma(feedData.fv_cnt)}</p></li>
                                    <li className="flex"><div className="box"></div><p>{CF.MakeIntComma(feedData.comment_cnt)}</p></li>
                                    <li className="flex"><div className="box"></div><p>{CF.MakeIntComma(feedData.counter)}</p></li>
                                </ul>
                                <p className="date">{feedData.w_date}</p>
                            </div>
                        </div>
                        <div className="content_box">
                            <div className="scroll_wrap gray">
                                <p>{feedData.txt}</p>
                            </div>
                        </div>
                        <div className="btn_box tab_show">
                            {prevBtn && <button type="button" className="btn_prev" onClick={prevHandler}>이전글</button>}
                            {nextBtn && <button type="button" className="btn_next" onClick={nextHandler}>다음글</button>}
                        </div>
                        <div className="comment_box">
                            <div className="scroll_wrap gray" ref={commentListBoxRef}>
                                {commentList.length > 0 ?
                                    <ul className="comment_list">
                                        {commentList.map((cont,i)=>{

                                            //댓글 수정,삭제버튼 노출
                                            let editBoxShow = false;
                                            if(user.userLogin){
                                                //일반회원일때
                                                if(user.userInfo.user_level == 'U' && user.userInfo.m_id === cont.m_id){
                                                    editBoxShow = true;
                                                }
                                                //매니저일때
                                                if(user.userInfo.user_level == 'M' && (user.userInfo.m_id === feedData.manager_id || user.userInfo.m_id === cont.m_id)){
                                                    editBoxShow = true;
                                                }
                                            }

                                            return(
                                                <li key={i}>
                                                    <Comment 
                                                        feedData={feedData}
                                                        data={cont}
                                                        editBoxOn={editBoxOn}
                                                        editBox={editBoxShow}
                                                        onEditBoxClickHandler={onEditBoxClickHandler}
                                                        onEditHandler={onCommentEditHandler}
                                                        onDeltHandler={onCommentDeltHandler}
                                                        btnGray={true}
                                                        onFeedProfileClickHandler={onFeedProfileClickHandler}
                                                        // editBtn={true} -> 댓글수정기능 없음
                                                        //답글
                                                        replyValue={replyValue}
                                                        onReplyChangeHandler={(e)=>{
                                                            const val = e.currentTarget.value;
                                                            setReplyValue(val);
                                                        }}
                                                        onReplyHandler={onTextCheckHandler}
                                                        replyBoxOn={replyBoxOn}
                                                        onReplyBoxClickHandler={onReplyBoxClickHandler}

                                                        //댓글,답글 수정
                                                        commentEditOn={commentEditOn}
                                                    />
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    :<div className="none_data">댓글이 없습니다.</div>
                                }
                            </div>
                        </div> 
                        <WriteTextareaBox 
                            placeholder={
                                (user.userLogin && user.userInfo.user_level == 'M') || (user.userLogin && user.userRank) ? '댓글을 달아보세요!' 
                                : user.userLogin && !user.userRank ? '댓글 작성 권한이 없는 회원입니다.' 
                                : '로그인을 해주세요.'
                            }
                            value={commentValue}
                            onChangeHandler={(e)=>{
                                const val = e.currentTarget.value;
                                setCommentValue(val);
                            }}
                            btnTxt='댓글쓰기'
                            onEnterHandler={onTextCheckHandler}
                            disabled={(user.userLogin && user.userInfo.user_level == 'M') || (user.userLogin && user.userRank) ? false : true}
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* 피드삭제 confirm팝업 */}
        {feedDeltConfirm && <ConfirmPop onClickHandler={feedDeltHandler} />}

        {/* 댓글삭제 confirm팝업 */}
        {commentDeltConfirm && <ConfirmPop onClickHandler={commentDeltHandler} />}

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default FeedPop;