import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { enum_api_uri } from "../../config/enum";
import * as CF from "../../config/function";
import { confirmPop, feedPop, feedAddPop, loadingPop } from "../../store/popupSlice";
import { feedRefresh } from "../../store/commonSlice";
import ListTopTitleBox from "../../components/component/square/ListTopTitleBox";
import GuestBookBox from "../../components/component/square/GuestBookBox";
import WriteTextareaBox from "../../components/component/square/WriteTextareaBox";
import ListCont from "../../components/component/square/ListCont";
import ConfirmPop from "../../components/popup/ConfirmPop";
import manager_tag from '../../images/manager_tag.svg';
import manager_tag_c from '../../images/manager_tag_c.svg';



const ManagerDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { m_id } = useParams();
    const manager_profile = enum_api_uri.manager_profile;
    const manager_feed_list = enum_api_uri.manager_feed_list;
    const guest_book_list = enum_api_uri.guest_book_list;
    const guest_book = enum_api_uri.guest_book;
    const guest_book_delt = enum_api_uri.guest_book_delt;
    const manager_favorite = enum_api_uri.manager_favorite;
    const feed_favorite = enum_api_uri.feed_favorite;
    const text_check = enum_api_uri.text_check;
    const popup = useSelector((state)=>state.popup);
    const user = useSelector((state)=>state.user);
    const common = useSelector((state)=>state.common);
    const msgListBoxRef = useRef(null);
    const [confirm, setConfirm] = useState(false);
    const [loginConfirm, setLoginConfirm] = useState(false);
    const [commentDeltConfirm, setCommentDeltConfirm] = useState(false);
    const [commentDeltOkConfirm, setCommentDeltOkConfirm] = useState(false);
    const [profile, setProfile] = useState({});
    const [feedList, setFeedList] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [moreBtn, setMoreBtn] = useState(false);
    const [commentList, setCommentList] = useState([]);
    const [editBoxOn, setEditOn] = useState(null);
    const [commentValue, setCommentValue] = useState('');
    const [feedAddBtn, setFeedAddBtn] = useState(false);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
            setLoginConfirm(false);
            setCommentDeltConfirm(false);
            setCommentDeltOkConfirm(false);
        }
    },[popup.confirmPop]);


    //스크롤시 editBoxOn = null 로 변경 (열려있는 방명록,댓글 수정창 닫기)
    const handleScroll = () => {
        setEditOn(null);
    };

    useEffect(() => {    
        const timer = setInterval(() => {
            window.addEventListener("scroll", handleScroll);
        }, 100);
        return () => {
            clearInterval(timer);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);


    //매니저프로필 가져오기
    const getProfile = () => {
        axios.get(`${manager_profile.replace(':m_id',m_id)}`,{
            headers: {
                Authorization: `Bearer ${user.userToken}`,
            },
        })
        .then((res)=>{
            if(res.status === 200){
                const data = res.data;
                setProfile(data);
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


    //피드 리스트 가져오기
    const getFeedList = (page, more) => {
        axios.get(`${manager_feed_list.replace(':m_id',m_id)}?page_no=${page ? page : 1}`,{
            headers: {
                Authorization: `Bearer ${user.userToken}`,
            },
        })
        .then((res)=>{
            if(res.status === 200){
                const data = res.data;
                //더보기버튼 클릭시에만 리스트 추가
                if(more){
                    setFeedList([...feedList,...data.result]);
                }else{
                    setFeedList(data.result);
                }

                // 현재페이지번호 저장
                setPageNo(data.current_page);

                //리스트가 더있으면 more 버튼 보이기
                if(data.current_page < data.end_page){
                    setMoreBtn(true);
                }else{
                    setMoreBtn(false);
                }
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


    //방명록 리스트 가져오기
    const getCommentList = () => {
        axios.get(`${guest_book_list.replace(':m_id',m_id)}`,{
            headers: {
                Authorization: `Bearer ${user.userToken}`,
            },
        })
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
        })
    };


    //맨처음
    useEffect(()=>{
        getProfile();       //매니저 프로필 가져오기
        getCommentList();   //방명록 리스트 가져오기
        getFeedList();      //피드 리스트 가져오기
    },[]);


    //피드 삭제, 수정시 피드리스트 가져오기
    useEffect(()=>{
        if(common.feedRefresh){
            dispatch(feedRefresh(false));
            getFeedList();
        }
    },[common.feedRefresh]);


    useEffect(()=>{
        //방명록리스트 맨밑으로 스크롤
        if (msgListBoxRef.current) {
            setTimeout(()=>{
                msgListBoxRef.current.scrollTop = msgListBoxRef.current.scrollHeight;
            },10);
        }
    },[commentList]);


    //매니저 좋아요하기
    const likeBtnClickHandler = () => {
        const body = {
            m_id:m_id
        };
        axios.post(manager_favorite,body,{
            headers: {
                Authorization: `Bearer ${user.userToken}`,
            },
        })
        .then((res)=>{
            if(res.status === 200){
                
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


    //피드작성 버튼 
    useEffect(()=>{
        if(user.userLogin){
            //로그인한 매니저계정일때만 노출
            if(user.userInfo.user_level == 'M' && user.userInfo.m_id === m_id){
                setFeedAddBtn(true);
            }else{
                setFeedAddBtn(false);
            }
        }
        //미로그인시 미노출
        else{
            setFeedAddBtn(false);
        }
    },[user.userLogin, user.userInfo]);


    //방명록  ------------------------------------
    //방명록 부적격 체크하기
    const onTextCheckHandler = () => {
        dispatch(loadingPop(true));
        const body = {
            text : commentValue,
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
                    onCommentHandler();
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

    //방명록 쓰기
    const onCommentHandler = () => {
        const body = {
            manager_id: m_id,
            content: commentValue
        };
        axios.post(guest_book,body,{
            headers: {
                Authorization: `Bearer ${user.userToken}`,
            },
        })
        .then((res)=>{
            if(res.status === 200){
                setCommentValue('');
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
        });
    };


    //방명록 수정,삭제버튼 클릭시
    const onEditBoxClickHandler = (boolean, idx) => {
        if(boolean){
            setEditOn(idx);
        }else{
            setEditOn(null);
        }
    };


    //방명록 수정버튼 클릭시
    const onCommentEditHandler = () => {

    };


    //방명록 삭제버튼 클릭시
    const onCommentDeltHandler = () => {
        dispatch(confirmPop({
            confirmPop:true,
            confirmPopTit:'알림',
            confirmPopTxt:'방명록을 삭제하시겠습니까?',
            confirmPopBtn:2,
        }));
        setCommentDeltConfirm(true);
    };


    //방명록 삭제하기
    const commentDeltHandler = () => {
        axios.delete(`${guest_book_delt.replace(':idx',editBoxOn)}`,{
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


    //피드  ------------------------------------
    //피드더보기버튼 클릭시 다음페이지 피드리스트 가져오기
    const moreBtnHandler = () => {
        getFeedList(pageNo + 1, true);
    };


    //피드 좋아요하기
    const feedLikeBtnClickHandler = (idx) => {
        //로그인시에만 가능
        if(user.userLogin){
            const body = {
                idx:idx
            };
            axios.post(feed_favorite,body,{
                headers: {
                    Authorization: `Bearer ${user.userToken}`,
                },
            })
            .then((res)=>{
                if(res.status === 200){
                    const list = [...feedList];
                    const index = list.findIndex((item)=>item.idx === idx);
                    const newFeedList = list;
                    newFeedList[index].fv_cnt = newFeedList[index].fv_cnt+1;
                    newFeedList[index].fv_flag = true;
                    setFeedList(newFeedList);
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
        }else{
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'로그인을 해주세요.',
                confirmPopBtn:2,
            }));
            setLoginConfirm(true);
        }
    };


    //피드 클릭시 피드상세팝업열기
    const feedClickHandler = (idx) => {
        dispatch(feedPop({feedPop:true, feedPopNo:idx}));
    };
    


    
    return(<>
        <div className="gray_wrap">
            <div className="cont4">
                <div className="manager_detail_cont flex_between flex_wrap flex_top">
                    <ListTopTitleBox tit='사소한 매니저' />
                    <div className="profile_box">
                        <div className="img_box">
                            <img src={profile.photo} alt="프로필사진" />
                            <div className={`manager_tag flex${profile.manager_type == 'C' ? ' charming' : ''}`}>
                                <img src={profile.manager_type == 'C' ? manager_tag_c : manager_tag} alt="매니저타입 아이콘" />
                                <p>{profile.manager_type == 'C' ? '챠밍 매니저' : 'VIP 매니저'}</p>
                            </div>
                        </div>
                        <div className="txt_box">
                            <ul className="count_ul flex_center">
                                <li className="flex"><div className="icon on"></div><p>{CF.MakeIntComma(profile.fv_cnt)}</p></li>
                                <li className="flex"><div className="icon"></div><p>{CF.MakeIntComma(profile.feed_cnt)}</p></li>
                            </ul>
                            <div>
                                <p className="name">{profile.manager_name}</p>
                                <p className="txt">{profile.txt}</p>
                            </div>
                        </div>
                    </div>
                    <div className="msg_feed_box">
                        <div className="box">
                            <p className="box_tit">케미라인</p>
                            <div className="msg_box">
                                <div className="msg_list_box">
                                    <div className="scroll_wrap" ref={msgListBoxRef}>
                                        {commentList.length > 0 ?
                                            <ul className="msg_list">
                                                {commentList.map((cont,i)=>{
                                                    return(
                                                        <li className="flex_between flex_top" key={i}>
                                                            <GuestBookBox 
                                                                data={cont}
                                                                editBoxOn={editBoxOn}
                                                                onEditBoxClickHandler={onEditBoxClickHandler}
                                                                onCommentEditHandler={onCommentEditHandler}
                                                                onCommentDeltHandler={onCommentDeltHandler}
                                                                btnGray={true}
                                                            />
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                            :<div className="none_data">방명록이 없습니다.</div>
                                        }
                                    </div>
                                </div>
                                <WriteTextareaBox 
                                    placeholder={user.userLogin ? '매니저님에게 방명록을 남겨 볼까요?' : '로그인을 해주세요.'}
                                    value={commentValue}
                                    onChangeHandler={(e)=>{
                                        const val = e.currentTarget.value;
                                        setCommentValue(val);
                                    }}
                                    btnTxt='보내기'
                                    onEnterHandler={onTextCheckHandler}
                                    disabled={user.userLogin ? false : true}
                                />
                            </div>
                        </div>
                        <div className="box">
                            <div className="box_tit flex_between">
                                <p>매니저 피드</p>
                                {feedAddBtn &&
                                    <button type="button" className="color_gray2 underline medium"
                                    onClick={()=>dispatch(feedAddPop({feedAddPop:true, feedAddPopNo:null}))}
                                >피드 작성</button>
                                }
                            </div>
                            <ListCont 
                                list={feedList}
                                moreBtn={moreBtn}
                                moreBtnHandler={moreBtnHandler}
                                moreBtnTxt='피드'
                                likeBtnClickHandler={feedLikeBtnClickHandler}
                                feedCont={true}
                                feedClickHandler={feedClickHandler}
                                myFeed={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 미로그인시 로그인 confirm팝업 */}
        {loginConfirm && <ConfirmPop onClickHandler={()=>navigate('/member/login')}/>}

        {/* 방명록삭제 confirm팝업 */}
        {commentDeltConfirm && <ConfirmPop onClickHandler={commentDeltHandler} />}

        {/* 방명록삭제 완료confirm팝업 */}
        {commentDeltOkConfirm && <ConfirmPop closePop="custom" onCloseHandler={()=>{}} />}

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default ManagerDetail;