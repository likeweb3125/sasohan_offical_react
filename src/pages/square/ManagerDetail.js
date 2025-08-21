import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { enum_api_uri } from "../../config/enum";
import * as CF from "../../config/function";
import {
    confirmPop,
    feedPop,
    feedAddPop,
    loadingPop,
    feedProfilePop,
} from "../../store/popupSlice";
import { feedRefresh } from "../../store/commonSlice";
import { detailPageBack, listPageData } from "../../store/etcSlice";
import history from "../../config/history";
import ListTopTitleBox from "../../components/component/square/ListTopTitleBox";
import GuestBookBox from "../../components/component/square/GuestBookBox";
import WriteTextareaBox from "../../components/component/square/WriteTextareaBox";
import ListCont from "../../components/component/square/ListCont";
import ConfirmPop from "../../components/popup/ConfirmPop";
import manager_tag from "../../images/manager_tag.svg";
import manager_tag_c from "../../images/manager_tag_c.svg";
import friend_tag from "../../images/friend_tag.svg";
import none_profile from "../../images/none_profile2.jpg";

const ManagerDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { m_id, feed_idx } = useParams();
    const manager_profile = enum_api_uri.manager_profile;
    const manager_feed_list = enum_api_uri.manager_feed_list;
    const guest_book_list = enum_api_uri.guest_book_list;
    const guest_book = enum_api_uri.guest_book;
    const guest_book_delt = enum_api_uri.guest_book_delt;
    const guest_book_all_delt = enum_api_uri.guest_book_all_delt;
    const manager_favorite = enum_api_uri.manager_favorite;
    const feed_favorite = enum_api_uri.feed_favorite;
    const text_check = enum_api_uri.text_check;
    const feed_pin = enum_api_uri.feed_pin;
    const popup = useSelector((state) => state.popup);
    const user = useSelector((state) => state.user);
    const common = useSelector((state) => state.common);
    const msgListBoxRef = useRef(null);
    const [confirm, setConfirm] = useState(false);
    const [loginConfirm, setLoginConfirm] = useState(false);
    const [commentDeltConfirm, setCommentDeltConfirm] = useState(false);
    const [commentDeltOkConfirm, setCommentDeltOkConfirm] = useState(false);
    const [commentAllDeltConfirm, setCommentAllDeltConfirm] = useState(false);
    const [commentAllDeltOkConfirm, setCommentAllDeltOkConfirm] =
        useState(false);
    const [profile, setProfile] = useState({});
    const [feedList, setFeedList] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [moreBtn, setMoreBtn] = useState(false);
    const [commentList, setCommentList] = useState([]);
    const [editBoxOn, setEditOn] = useState(null);
    const [commentValue, setCommentValue] = useState("");
    const [myDetail, setMyDetail] = useState(false);
    const userLogin = Cookies.get("userLogin") === "true"; // 'true' 문자열과 비교;
    const [replyBoxOn, setReplyBoxOn] = useState(null);
    const [commentDisabled, setCommentDisabled] = useState(false);

    //상세페이지 뒤로가기
    useEffect(() => {
        const listenBackEvent = () => {
            dispatch(detailPageBack(true));
        };

        const unlistenHistoryEvent = history.listen(({ action }) => {
            if (action === "POP") {
                listenBackEvent();
            }
        });

        return unlistenHistoryEvent;
    }, []);

    // Confirm팝업 닫힐때
    useEffect(() => {
        if (popup.confirmPop === false) {
            setConfirm(false);
            setLoginConfirm(false);
            setCommentDeltConfirm(false);
            setCommentDeltOkConfirm(false);
        }
    }, [popup.confirmPop]);

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
        axios
            .get(`${manager_profile.replace(":m_id", m_id)}`)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    setProfile(data);
                }
            })
            .catch((error) => {
                const err_msg = CF.errorMsgHandler(error);
                dispatch(
                    confirmPop({
                        confirmPop: true,
                        confirmPopTit: "알림",
                        confirmPopTxt: err_msg,
                        confirmPopBtn: 1,
                    })
                );
                setConfirm(true);
            });
    };

    //방명록 리스트 가져오기
    const getCommentList = () => {
        //로그인했을때만 헤더값 넣기
        let headers = {};
        if (userLogin) {
            headers = {
                Authorization: `Bearer ${user.userToken}`,
            };
        }

        axios
            .get(`${guest_book_list.replace(":m_id", m_id)}`, {
                headers: headers,
            })
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    setCommentList(data);
                }
            })
            .catch((error) => {
                const err_msg = CF.errorMsgHandler(error);
                dispatch(
                    confirmPop({
                        confirmPop: true,
                        confirmPopTit: "알림",
                        confirmPopTxt: err_msg,
                        confirmPopBtn: 1,
                    })
                );
                setConfirm(true);
            });
    };

    //피드 리스트 가져오기
    const getFeedList = (page, more) => {
        //로그인했을때만 헤더값 넣기
        let headers = {};
        if (userLogin) {
            headers = {
                Authorization: `Bearer ${user.userToken}`,
            };
        }

        axios
            .get(
                `${manager_feed_list.replace(":m_id", m_id)}?page_no=${
                    page ? page : 1
                }`,
                {
                    headers: headers,
                }
            )
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    //더보기버튼 클릭시에만 리스트 추가
                    if (more) {
                        setFeedList((prevList) => [
                            ...prevList,
                            ...data.result,
                        ]);
                    } else {
                        setFeedList(data.result);
                    }

                    // 현재페이지번호 저장
                    setPageNo(data.current_page);

                    //리스트가 더있으면 more 버튼 보이기
                    if (data.current_page < data.end_page) {
                        setMoreBtn(true);
                    } else {
                        setMoreBtn(false);
                    }
                }
            })
            .catch((error) => {
                const err_msg = CF.errorMsgHandler(error);
                dispatch(
                    confirmPop({
                        confirmPop: true,
                        confirmPopTit: "알림",
                        confirmPopTxt: err_msg,
                        confirmPopBtn: 1,
                    })
                );
                setConfirm(true);
            });
    };

    //맨처음
    useEffect(() => {
        getProfile(); //매니저 프로필 가져오기
        getCommentList(); //방명록 리스트 가져오기
        getFeedList(); //피드 리스트 가져오기
    }, [m_id]);

    //url 에 feed_idx 값 있을때 피드팝업열기
    useEffect(() => {
        if (feed_idx) {
            feedClickHandler(feed_idx);
        }
    }, [feed_idx]);

    useEffect(() => {
        if (m_id === "sasohan") {
            if (
                userLogin &&
                user.userInfo.user_level === "M" &&
                user.userInfo.m_id === m_id
            ) {
                setCommentDisabled(false);
            } else {
                setCommentDisabled(true);
            }
        }
    }, [userLogin, user.userInfo, m_id]);

    //피드 삭제, 수정시 피드리스트 가져오기
    useEffect(() => {
        if (common.feedRefresh) {
            dispatch(feedRefresh(false));
            getFeedList();
        }
    }, [common.feedRefresh]);

    useEffect(() => {
        //방명록리스트 맨밑으로 스크롤
        if (msgListBoxRef.current) {
            setTimeout(() => {
                msgListBoxRef.current.scrollTop =
                    msgListBoxRef.current.scrollHeight;
            }, 10);
        }
    }, [commentList]);

    //매니저 좋아요하기
    const likeBtnClickHandler = () => {
        const body = {
            m_id: m_id,
        };
        axios
            .post(manager_favorite, body, {
                headers: {
                    Authorization: `Bearer ${user.userToken}`,
                },
            })
            .then((res) => {
                if (res.status === 200) {
                }
            })
            .catch((error) => {
                const err_msg = CF.errorMsgHandler(error);
                dispatch(
                    confirmPop({
                        confirmPop: true,
                        confirmPopTit: "알림",
                        confirmPopTxt: err_msg,
                        confirmPopBtn: 1,
                    })
                );
                setConfirm(true);
            });
    };

    //피드작성 버튼
    useEffect(() => {
        if (userLogin) {
            //로그인한 매니저계정일때만 노출
            if (
                user.userInfo.user_level == "M" &&
                user.userInfo.m_id === m_id
            ) {
                setMyDetail(true);
            } else {
                setMyDetail(false);
            }
        }
        //미로그인시 미노출
        else {
            setMyDetail(false);
        }
    }, [userLogin, user.userInfo, m_id]);

    //방명록  ------------------------------------
    //방명록 연속 작성인지 체크 (최대 2번까지만 가능)
    const onCommentCheckHandler = (comment_idx) => {
        if (user.userInfo.m_id === m_id) {
            onTextCheckHandler(comment_idx);
        } else {
            if (commentList.length > 1) {
                const last = commentList.length - 1;
                const last2 = last - 1;
                const lastId = commentList[last].m_id;
                const last2Id = commentList[last2].m_id;
                if (lastId === last2Id && lastId === user.userInfo.m_id) {
                    dispatch(
                        confirmPop({
                            confirmPop: true,
                            confirmPopTit: "알림",
                            confirmPopTxt:
                                "방명록은 연속해서 최대 2번까지만 작성이 가능합니다.",
                            confirmPopBtn: 1,
                        })
                    );
                    setConfirm(true);
                } else {
                    onTextCheckHandler(comment_idx);
                }
            } else {
                onTextCheckHandler(comment_idx);
            }
        }
    };

    //방명록 부적격 체크하기
    const onTextCheckHandler = (comment_idx) => {
        dispatch(loadingPop(true));

        let text = commentValue;
        if (comment_idx) {
            text = replyValue;
        }

        const body = {
            text: text,
        };

        axios
            .post(text_check, body, {
                headers: {
                    Authorization: `Bearer ${user.userToken}`,
                },
            })
            .then((res) => {
                if (res.status === 200) {
                    dispatch(loadingPop(false));

                    const data = res.data.result;
                    //result = [긍정적%,부정적%]
                    //부정적이 70% 이상이면 댓글작성 불가능
                    if (data[1] >= 70) {
                        dispatch(
                            confirmPop({
                                confirmPop: true,
                                confirmPopTit: "알림",
                                confirmPopTxt:
                                    "존중과 이해를 바탕으로 한 대화를 장려합니다. <br/>귀하의 댓글을 수정해 주세요.",
                                confirmPopBtn: 1,
                            })
                        );
                        setConfirm(true);
                    } else {
                        onCommentHandler(comment_idx);
                    }
                }
            })
            .catch((error) => {
                dispatch(loadingPop(false));

                const err_msg = CF.errorMsgHandler(error);
                dispatch(
                    confirmPop({
                        confirmPop: true,
                        confirmPopTit: "알림",
                        confirmPopTxt: err_msg,
                        confirmPopBtn: 1,
                    })
                );
                setConfirm(true);
            });
    };

    //방명록 쓰기
    const onCommentHandler = (comment_idx) => {
        //답글일때
        let idx = null;
        let content = commentValue;
        if (comment_idx) {
            idx = comment_idx;
            content = replyValue;
        }

        const body = {
            comment_idx: idx,
            manager_id: m_id,
            content: content,
        };
        axios
            .post(guest_book, body, {
                headers: {
                    Authorization: `Bearer ${user.userToken}`,
                },
            })
            .then((res) => {
                if (res.status === 200) {
                    setCommentValue("");
                    setReplyValue("");
                    setReplyBoxOn(null);
                    getCommentList();
                }
            })
            .catch((error) => {
                const err_msg = CF.errorMsgHandler(error);
                dispatch(
                    confirmPop({
                        confirmPop: true,
                        confirmPopTit: "알림",
                        confirmPopTxt: err_msg,
                        confirmPopBtn: 1,
                    })
                );
                setConfirm(true);
            });
    };

    //방명록 삭제버튼 클릭시
    const onEditBoxClickHandler = (boolean, idx) => {
        if (boolean) {
            setEditOn(idx);
        } else {
            setEditOn(null);
        }
    };

    //방명록 삭제버튼 클릭시
    const onCommentDeltHandler = () => {
        dispatch(
            confirmPop({
                confirmPop: true,
                confirmPopTit: "알림",
                confirmPopTxt: "방명록을 삭제하시겠습니까?",
                confirmPopBtn: 2,
            })
        );
        setCommentDeltConfirm(true);
    };

    //방명록 삭제하기
    const commentDeltHandler = () => {
        axios
            .delete(`${guest_book_delt.replace(":idx", editBoxOn)}`, {
                headers: {
                    Authorization: `Bearer ${user.userToken}`,
                },
            })
            .then((res) => {
                if (res.status === 200) {
                    getCommentList();
                }
            })
            .catch((error) => {
                const err_msg = CF.errorMsgHandler(error);
                dispatch(
                    confirmPop({
                        confirmPop: true,
                        confirmPopTit: "알림",
                        confirmPopTxt: err_msg,
                        confirmPopBtn: 1,
                    })
                );
                setConfirm(true);
            });
    };

    //방명록 전체삭제버튼 클릭시
    const onCommentAllDeltHandler = () => {
        dispatch(
            confirmPop({
                confirmPop: true,
                confirmPopTit: "알림",
                confirmPopTxt: "방명록을 전체 삭제하시겠습니까?",
                confirmPopBtn: 2,
            })
        );
        setCommentAllDeltConfirm(true);
    };

    //방명록 전체삭제하기
    const commentAllDeltHandler = () => {
        axios
            .delete(guest_book_all_delt, {
                headers: {
                    Authorization: `Bearer ${user.userToken}`,
                },
            })
            .then((res) => {
                if (res.status === 200) {
                    getCommentList();
                }
            })
            .catch((error) => {
                const err_msg = CF.errorMsgHandler(error);
                dispatch(
                    confirmPop({
                        confirmPop: true,
                        confirmPopTit: "알림",
                        confirmPopTxt: err_msg,
                        confirmPopBtn: 1,
                    })
                );
                setConfirm(true);
            });
    };

    //방명록 프로필클릭시
    const onFeedProfileClickHandler = (info) => {
        //일반회원일때
        if (info.user_level == "U") {
            const data = {
                m_n_name: info.m_n_name,
                m_f_photo: info.photo,
                M_N_Name_modify: info.M_N_Name_modify,
                rank: info.rank,
                level: info.level,
                class_number: info.class_number,
                class: info.class,
                diff_rank: info.diff_rank,
            };
            dispatch(
                feedProfilePop({
                    feedProfilePop: true,
                    feedProfilePopData: data,
                })
            );
        }
        //매니저일때
        if (info.user_level == "M") {
            navigate(`/square/manager/${info.m_id}`);
        }
    };

    //방명록 답글쓰기 버튼 클릭시 답글달기 영역 토글
    const onReplyClickHandler = (comment_idx) => {
        if (replyBoxOn === null || replyBoxOn !== comment_idx) {
            setReplyBoxOn(comment_idx);
        } else {
            setReplyBoxOn(null);
        }
    };

    const [replyValue, setReplyValue] = useState("");

    const onReplyChangeHandler = (val) => {
        setReplyValue(val);
    };

    //피드  ------------------------------------
    //피드더보기버튼 클릭시 다음페이지 피드리스트 가져오기
    const moreBtnHandler = () => {
        getFeedList(pageNo + 1, true);
    };

    //피드 좋아요하기
    const feedLikeBtnClickHandler = (idx) => {
        //로그인시에만 가능
        if (userLogin) {
            const body = {
                idx: idx,
            };
            axios
                .post(feed_favorite, body, {
                    headers: {
                        Authorization: `Bearer ${user.userToken}`,
                    },
                })
                .then((res) => {
                    if (res.status === 200) {
                        const data = res.data;
                        const flag = data.flag;
                        let count;
                        const list = [...feedList];
                        const index = list.findIndex(
                            (item) => item.idx === idx
                        );
                        const newFeedList = list;

                        if (flag) {
                            count = newFeedList[index].fv_cnt + 1;
                        } else {
                            count = newFeedList[index].fv_cnt - 1;
                        }

                        newFeedList[index].fv_cnt = count;
                        newFeedList[index].fv_flag = flag;
                        setFeedList(newFeedList);
                    }
                })
                .catch((error) => {
                    const err_msg = CF.errorMsgHandler(error);
                    dispatch(
                        confirmPop({
                            confirmPop: true,
                            confirmPopTit: "알림",
                            confirmPopTxt: err_msg,
                            confirmPopBtn: 1,
                        })
                    );
                    setConfirm(true);
                });
        } else {
            dispatch(
                confirmPop({
                    confirmPop: true,
                    confirmPopTit: "알림",
                    confirmPopTxt: "로그인을 해주세요.",
                    confirmPopBtn: 2,
                })
            );
            setLoginConfirm(true);
        }
    };

    //피드 클릭시 피드상세팝업열기
    const feedClickHandler = (idx) => {
        dispatch(feedPop({ feedPop: true, feedPopNo: idx, feedPopId: m_id }));
    };

    //피드 고정하기
    const pinCheckHandler = (idx) => {
        axios
            .put(feed_pin.replace(":idx", idx), null, {
                headers: {
                    Authorization: `Bearer ${user.userToken}`,
                },
            })
            .then((res) => {
                if (res.status === 200) {
                    dispatch(feedRefresh(true));
                }
            })
            .catch((error) => {
                const err_msg = CF.errorMsgHandler(error);
                dispatch(
                    confirmPop({
                        confirmPop: true,
                        confirmPopTit: "알림",
                        confirmPopTxt: err_msg,
                        confirmPopBtn: 1,
                    })
                );
                setConfirm(true);
            });
    };

    //제목클릭시 메인페이지 현재 매니저타입으로 리스트 불러오기
    const onTitClickHandler = () => {
        dispatch(detailPageBack(true));
        let pageData = {
            page: 1,
            type: profile.manager_type,
            sort: 1,
            favorite: false,
            search: "",
        };
        dispatch(listPageData(pageData));

        setTimeout(() => {
            navigate("/");
        }, 200);
    };

    return (
        <>
            <div className="gray_wrap">
                <div className="cont4">
                    <div className="manager_detail_cont flex_between flex_wrap flex_top">
                        <ListTopTitleBox
                            tit={
                                profile.manager_type === "V"
                                    ? "1% 매니저"
                                    : profile.manager_type_txt
                            }
                            onTitClickHandler={onTitClickHandler}
                        />
                        <div className="profile_box">
                            <div className="img_box">
                                <img
                                    src={
                                        profile.photo
                                            ? profile.photo
                                            : none_profile
                                    }
                                    alt="프로필사진"
                                />
                                <div
                                    className={`manager_tag flex${
                                        profile.manager_type == "C"
                                            ? " charming"
                                            : ""
                                    }`}
                                >
                                    <img
                                        src={
                                            profile.manager_type === "C"
                                                ? manager_tag_c
                                                : profile.manager_type === "V"
                                                ? manager_tag
                                                : friend_tag
                                        }
                                        alt="매니저타입 아이콘"
                                    />
                                    <p>
                                        {profile.manager_type === "C"
                                            ? "챠밍 매니저"
                                            : profile.manager_type === "V"
                                            ? "1% 매니저"
                                            : "1% 프렌즈"}
                                    </p>
                                </div>
                            </div>
                            <div className="txt_box">
                                <ul className="count_ul flex_center">
                                    <li className="flex">
                                        <div className="icon on"></div>
                                        <p>{CF.MakeIntComma(profile.fv_cnt)}</p>
                                    </li>
                                    <li className="flex">
                                        <div className="icon"></div>
                                        <p>
                                            {CF.MakeIntComma(profile.feed_cnt)}
                                        </p>
                                    </li>
                                </ul>
                                <div>
                                    <p className="name">
                                        {profile.manager_name}
                                    </p>
                                    <p className="txt">{profile.txt}</p>
                                </div>
                            </div>
                        </div>
                        <div className="msg_feed_box">
                            <div className="box">
                                <div className="box_tit flex_between">
                                    <p>케미라인</p>
                                    {myDetail && (
                                        <button
                                            type="button"
                                            className="color_gray2 underline medium"
                                            onClick={onCommentAllDeltHandler}
                                        >
                                            전체 삭제
                                        </button>
                                    )}
                                </div>
                                <div className="msg_box">
                                    <div
                                        className="msg_list_box"
                                        style={{
                                            paddingBottom: commentDisabled
                                                ? "16px"
                                                : "0",
                                        }}
                                    >
                                        <div
                                            className="scroll_wrap"
                                            ref={msgListBoxRef}
                                        >
                                            {commentList.length > 0 ? (
                                                <ul className="msg_list">
                                                    {commentList.map(
                                                        (cont, i) => {
                                                            //방명록 삭제버튼
                                                            let editBox = false;

                                                            //답글달기 버튼
                                                            let replyBtn = false;

                                                            if (userLogin) {
                                                                //일반회원일때
                                                                if (
                                                                    user
                                                                        .userInfo
                                                                        .user_level ==
                                                                        "U" &&
                                                                    user
                                                                        .userInfo
                                                                        .m_id ===
                                                                        cont.m_id
                                                                ) {
                                                                    editBox = true;
                                                                }
                                                                //매니저일때
                                                                if (
                                                                    user
                                                                        .userInfo
                                                                        .user_level ==
                                                                        "M" &&
                                                                    (user
                                                                        .userInfo
                                                                        .m_id ===
                                                                        m_id ||
                                                                        user
                                                                            .userInfo
                                                                            .m_id ===
                                                                            cont.m_id)
                                                                ) {
                                                                    editBox = true;
                                                                }

                                                                //매니저일때 본인매니저페이지일때 && 방명록 depth 가 0 일때만 답글달기 가능
                                                                if (
                                                                    user
                                                                        .userInfo
                                                                        .user_level ==
                                                                        "M" &&
                                                                    user
                                                                        .userInfo
                                                                        .m_id ===
                                                                        m_id &&
                                                                    cont.depth ===
                                                                        0
                                                                ) {
                                                                    replyBtn = true;
                                                                }
                                                            }

                                                            return (
                                                                <li key={i}>
                                                                    <GuestBookBox
                                                                        data={
                                                                            cont
                                                                        }
                                                                        editBoxOn={
                                                                            editBoxOn
                                                                        }
                                                                        editBox={
                                                                            editBox
                                                                        }
                                                                        onEditBoxClickHandler={
                                                                            onEditBoxClickHandler
                                                                        }
                                                                        onCommentDeltHandler={
                                                                            onCommentDeltHandler
                                                                        }
                                                                        btnGray={
                                                                            true
                                                                        }
                                                                        onFeedProfileClickHandler={
                                                                            onFeedProfileClickHandler
                                                                        }
                                                                        replyBtn={
                                                                            replyBtn
                                                                        }
                                                                        onReplyClickHandler={
                                                                            onReplyClickHandler
                                                                        }
                                                                        replyBoxOn={
                                                                            replyBoxOn
                                                                        }
                                                                        replyValue={
                                                                            replyValue
                                                                        }
                                                                        onReplyChangeHandler={
                                                                            onReplyChangeHandler
                                                                        }
                                                                        onReplyHadler={
                                                                            onCommentCheckHandler
                                                                        }
                                                                    />
                                                                </li>
                                                            );
                                                        }
                                                    )}
                                                </ul>
                                            ) : (
                                                <div className="none_data">
                                                    방명록이 없습니다.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {!commentDisabled && (
                                        <WriteTextareaBox
                                            placeholder={
                                                (userLogin &&
                                                    user.userInfo.user_level ==
                                                        "M") ||
                                                (userLogin && user.userRank)
                                                    ? "매니저님에게 방명록을 남겨 볼까요?"
                                                    : userLogin &&
                                                      !user.userRank
                                                    ? "방명록 작성 권한이 없는 회원입니다."
                                                    : "로그인을 해주세요."
                                            }
                                            value={commentValue}
                                            onChangeHandler={(e) => {
                                                const val =
                                                    e.currentTarget.value;
                                                setCommentValue(val);
                                            }}
                                            btnTxt="보내기"
                                            onEnterHandler={
                                                onCommentCheckHandler
                                            }
                                            disabled={
                                                (userLogin &&
                                                    user.userInfo.user_level ==
                                                        "M") ||
                                                (userLogin && user.userRank)
                                                    ? false
                                                    : true
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="box">
                                <div className="box_tit flex_between">
                                    <p>매니저 피드</p>
                                    {myDetail && (
                                        <button
                                            type="button"
                                            className="color_gray2 underline medium"
                                            onClick={() =>
                                                dispatch(
                                                    feedAddPop({
                                                        feedAddPop: true,
                                                        feedAddPopNo: null,
                                                    })
                                                )
                                            }
                                        >
                                            피드 작성
                                        </button>
                                    )}
                                </div>
                                <ListCont
                                    list={feedList}
                                    moreBtn={moreBtn}
                                    moreBtnHandler={moreBtnHandler}
                                    moreBtnTxt="피드"
                                    likeBtnClickHandler={
                                        feedLikeBtnClickHandler
                                    }
                                    feedCont={true}
                                    feedClickHandler={feedClickHandler}
                                    managerDetail={true}
                                    myDetail={myDetail}
                                    pinCheckHandler={pinCheckHandler}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 미로그인시 로그인 confirm팝업 */}
            {loginConfirm && (
                <ConfirmPop onClickHandler={() => navigate("/member/login")} />
            )}

            {/* 방명록삭제 confirm팝업 */}
            {(commentDeltConfirm || commentAllDeltConfirm) && (
                <ConfirmPop
                    onClickHandler={
                        commentDeltConfirm
                            ? commentDeltHandler
                            : commentAllDeltHandler
                    }
                />
            )}

            {/* 방명록삭제 완료confirm팝업 */}
            {(commentDeltOkConfirm || commentAllDeltOkConfirm) && (
                <ConfirmPop closePop="custom" onCloseHandler={() => {}} />
            )}

            {/* confirm팝업 */}
            {confirm && <ConfirmPop />}
        </>
    );
};

export default ManagerDetail;
