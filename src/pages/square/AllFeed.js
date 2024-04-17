import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { enum_api_uri } from "../../config/enum";
import * as CF from "../../config/function";
import { confirmPop, feedPop, feedPopNoList, loadingPop } from "../../store/popupSlice";
import { feedRefresh } from "../../store/commonSlice";
import ConfirmPop from "../../components/popup/ConfirmPop";
import ListTopTitleBox from "../../components/component/square/ListTopTitleBox";
import ListSearchBox from "../../components/component/square/ListSearchBox";
import ListCont from "../../components/component/square/ListCont";


const AllFeed = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const feed_list = enum_api_uri.feed_list;
    const feed_favorite = enum_api_uri.feed_favorite;
    const popup = useSelector((state)=>state.popup);
    const user = useSelector((state)=>state.user);
    const common = useSelector((state)=>state.common);
    const [confirm, setConfirm] = useState(false);
    const [loginConfirm, setLoginConfirm] = useState(false);
    const [sortTabOn, setSortTabOn] = useState(1);
    const [likeCheck, setLikeCheck] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [feedList, setFeedList] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [moreBtn, setMoreBtn] = useState(false);



    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
            setLoginConfirm(false);
        }
    },[popup.confirmPop]);


    //피드 리스트 가져오기
    const getAllFeed = (page, more, search) => {
        dispatch(loadingPop(true));

        //내가누른 좋아요보기 체크시 or 로그인시에만 헤더값 넣기
        let headers = {};
        if(likeCheck || user.userLogin){
            headers = {
                Authorization: `Bearer ${user.userToken}`,
            }
        }

        axios.get(`${feed_list}?page_no=${page ? page : 1}${sortTabOn === 2 ? '&sort=favorite' : ''}${likeCheck ? '&favorite=1' : ''}${search ? '&search='+searchValue : ''}`,{
            headers: headers,
        })
        .then((res)=>{
            if(res.status === 200){
                dispatch(loadingPop(false));

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
            dispatch(loadingPop(false));
            
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
    useEffect(()=>{
        getAllFeed();
    },[sortTabOn, likeCheck]);


    //피드 삭제, 수정시 피드리스트 가져오기
    useEffect(()=>{
        if(common.feedRefresh){
            dispatch(feedRefresh(false));
            getAllFeed();
        }
    },[common.feedRefresh]);


    useEffect(()=>{
        //피드리스트에서 각각 피드 idx store에 배열로 저장
        let newFeedPopNoList = feedList.map(obj => obj.idx);
        dispatch(feedPopNoList([...newFeedPopNoList]));
    },[feedList]);


    //정렬 탭 클릭시
    const sortTabClickHandler = (idx) => {
        setSortTabOn(idx);
    };


    //내가 누른 좋아요만보기 체크박스 클릭시
    const likeCheckClickHandler = () => {
        setLikeCheck(!likeCheck);
    };


    //검색어입력값 변경시
    const searchInputChangeHandler = (val) => {
        setSearchValue(val);
    };


    //검색하기버튼 클릭시
    const searchHandler = () => {
        if(searchValue.length > 0){
            getAllFeed(pageNo, false, true);
        }else{
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'검색어를 입력해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }
    };


    //더보기버튼 클릭시 다음페이지 리스트 가져오기
    const moreBtnHandler = () => {
        getAllFeed(pageNo + 1, true);
    };


    //피드 좋아요하기
    const likeBtnClickHandler = (idx) => {
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
                    const data = res.data;
                    const flag = data.flag;
                    let count;
                    const list = [...feedList];
                    const index = list.findIndex((item)=>item.idx === idx);
                    const newFeedList = list;

                    if(flag){
                        count = newFeedList[index].fv_cnt+1;
                    }else{
                        count = newFeedList[index].fv_cnt-1;
                    }

                    newFeedList[index].fv_cnt = count;
                    newFeedList[index].fv_flag = flag;
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


    //매니저프로필클릭시 매니저상세페이지로 이동
    const profileClickHandler = (id) => {
        navigate(`/square/manager/${id}`);
    };

    
    return(<>
        <div className="square_list_wrap gray_wrap">
            <div className="cont4">
                <ListTopTitleBox
                    tit='피드 스퀘어'
                />
                <ListSearchBox
                    sortTabOn={sortTabOn}
                    sortTabClickHandler={sortTabClickHandler}
                    likeCheck={likeCheck}
                    likeCheckClickHandler={likeCheckClickHandler}
                    searchValue={searchValue}
                    searchInputChangeHandler={searchInputChangeHandler}
                    searchHandler={searchHandler}
                />
                <ListCont 
                    list={feedList}
                    moreBtn={moreBtn}
                    moreBtnHandler={moreBtnHandler}
                    moreBtnTxt='피드'
                    likeBtnClickHandler={likeBtnClickHandler}
                    feedCont={true}
                    feedClickHandler={feedClickHandler}
                    profileClickHandler={profileClickHandler}
                />
            </div>
        </div>

        {/* 미로그인시 로그인 confirm팝업 */}
        {loginConfirm && <ConfirmPop onClickHandler={()=>navigate('/member/login')}/>}

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default AllFeed;