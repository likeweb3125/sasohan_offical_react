import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { enum_api_uri } from "../config/enum";
import * as CF from "../config/function";
import { detailPageBack, listPageData, scrollY, detailPageBackFeed } from "../store/etcSlice";
import { confirmPop, feedPop, loadingPop, storyPop, storyPopList } from "../store/popupSlice";
import { feedRefresh } from "../store/commonSlice";
import ConfirmPop from "../components/popup/ConfirmPop";
import ListTopTitleBox from "../components/component/square/ListTopTitleBox";
import ListSearchBox from "../components/component/square/ListSearchBox";
import ListCont from "../components/component/square/ListCont";
import m_visual_tag from "../images/main_visual_tag.svg";
import m_visual_img1 from "../images/main_visual_txt1.png";


const Main = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const manager_list = enum_api_uri.manager_list;
    const manager_favorite = enum_api_uri.manager_favorite;
    const feed_list = enum_api_uri.feed_list;
    const feed_favorite = enum_api_uri.feed_favorite;
    const story_list = enum_api_uri.story_list;
    const popup = useSelector((state)=>state.popup);
    const user = useSelector((state)=>state.user);
    const common = useSelector((state)=>state.common);
    const etc = useSelector((state)=>state.etc);
    const [confirm, setConfirm] = useState(false);
    const [loginConfirm, setLoginConfirm] = useState(false);
    const [typeCheck, setTypeCheck] = useState('');
    const [sortTabOn, setSortTabOn] = useState(1);
    const [likeCheck, setLikeCheck] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [managerList, setManagerList] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [moreBtn, setMoreBtn] = useState(false);
    const [scrollMove, setScrollMove] = useState(false);
    const [pageBack, setPageBack] = useState(false);
    const userLogin = Cookies.get('userLogin') === 'true'; // 'true' 문자열과 비교;
    const [feedList, setFeedList] = useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const sect2_2Ref = useRef(null);
    const [sect2_2On, setSect2_2On] = useState(false);
    const [storyList, setStoryList] = useState([]);
    const storySliderRef = useRef();


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
            setLoginConfirm(false);
        }
    },[popup.confirmPop]);


    //스크롤시 section on
    const scrollSectOn = () => {
        const scroll = window.scrollY;
        const sections = [
            { ref: sect2_2Ref, onSet: setSect2_2On },
        ];
      
        sections.forEach(({ ref, onSet }) => {
            const offsetTop = ref.current.offsetTop;
            if (scroll >= offsetTop - 500) {
                onSet(true);
            }
        });
    };
    
    useEffect(() => {    
        getStoryList();

        const handleWindowResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener("scroll", scrollSectOn);
        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener("scroll", scrollSectOn);
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);


    //스토리리스트 가져오기
    const getStoryList = () => {
        axios.get(`${story_list}`)
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setStoryList([...data]);
                dispatch(storyPopList(data));
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


    //스토리팝업 다음버튼,이전버튼으로 넘길때 스토리슬라이드 active 변경
    useEffect(()=>{
        if(popup.storyPopNo != null){
            const idx = popup.storyPopNo;
            storySliderRef.current.swiper.slideTo(idx);
        }
    },[popup.storyPopNo]);



    //상세->목록으로 뒤로가기시 저장되었던 스크롤위치로 이동
    useEffect(()=>{
        if(scrollMove){
            const y = etc.scrollY;
            window.scrollTo(0,y); 
        }
    },[scrollMove]);


    //상세->목록으로 뒤로가기시 저장되었던 값들로 매니저리스트 or 피드리스트 가져오기
    useEffect(()=>{
        const fetchData = async () => {
            if(etc.detailPageBack){
                dispatch(detailPageBack(false));
                setPageBack(true);

                if(etc.detailPageBackFeed){
                    dispatch(detailPageBackFeed(false));

                    for(let i = 1; i <= etc.listPageData.page; i++) {
                        const isLast = i === etc.listPageData.page;
                        await getAllFeed(i, true, isLast);
                    }
                }else{
                    for(let i = 1; i <= etc.listPageData.page; i++) {
                        const isLast = i === etc.listPageData.page;
                        await getManagerList(i, true, isLast);
                    }
                }
            }
        };

        fetchData();
    },[etc.detailPageBack, etc.detailPageBackFeed]);


    //맨처음 피드리스트 가져오기
    useEffect(()=>{
        if(!etc.detailPageBack){
            getAllFeed();
        }
    },[]);


    useEffect(()=>{
        console.log(etc.listPageData);
    },[etc.listPageData]);


    //매니저 리스트 가져오기
    const getManagerList = async (page, more, isLast) => {
        dispatch(loadingPop(true));

        let type = '';
        let sort;
        let favorite;
        let searchText = '';

        //상세페이지에서 뒤로가기시 저장된 리스트페이지 정보로 조회
        if(etc.detailPageBack){
            type = etc.listPageData.type;
            sort = etc.listPageData.sort;
            favorite = etc.listPageData.favorite;
            searchText = etc.listPageData.search;
        }else{
            type = typeCheck;
            sort = sortTabOn;
            favorite = likeCheck;
            searchText = searchValue;
        }

        //내가누른 좋아요보기 체크시 or 로그인시에만 헤더값 넣기
        let headers = {};
        if(likeCheck || userLogin){
            headers = {
                Authorization: `Bearer ${user.userToken}`,
            }
        }

        try {
            const res = await axios.get(`${manager_list}?page_no=${page ? page : 1}${'&type='+type}${sort === 2 ? '&sort=favorite' : sort === 3 ? '&sort=views' : ''}${favorite ? '&favorite=1' : ''}${searchText.length > 0 ? '&search='+searchText : ''}`,{
                headers: headers,
            });
            if(res.status === 200){
                dispatch(loadingPop(false));

                const data = res.data;
                //더보기버튼 클릭시에만 리스트 추가
                if(more){
                    setManagerList(prevManagerList => [...prevManagerList, ...data.result]);
                }else{
                    setManagerList(data.result);
                }

                // 현재페이지번호 저장
                setPageNo(data.current_page);

                //리스트가 더있으면 more 버튼 보이기
                if(data.current_page < data.end_page){
                    setMoreBtn(true);
                }else{
                    setMoreBtn(false);
                }

                //리스트페이지 조회 데이터저장
                let pageData = {
                    page: page ? page : 1,
                    type: type,
                    sort: sort,
                    favorite: favorite,
                    search: searchText,
                };
                dispatch(listPageData(pageData));

                //상세페이지에서 뒤로가기시
                if(isLast){
                    setSearchValue(searchText);
                    setTypeCheck(etc.listPageData.type);
                    setSortTabOn(etc.listPageData.sort);
                    setLikeCheck(etc.listPageData.favorite);

                    setScrollMove(true);
                    // dispatch(detailPageBack(false));

                    // setPageBack(true);
                }
            }
        } catch (error) {
            dispatch(loadingPop(false));
    
            const err_msg = CF.errorMsgHandler(error);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: err_msg,
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }
    };


    //피드 리스트 가져오기
    const getAllFeed = async (page, more, isLast) => {
        dispatch(loadingPop(true));

        let sort;
        let favorite;
        let searchText = '';

        //상세페이지에서 뒤로가기시 저장된 리스트페이지 정보로 조회
        if(etc.detailPageBack){
            sort = etc.listPageData.sort;
            favorite = etc.listPageData.favorite;
            searchText = etc.listPageData.search;
        }else{
            sort = sortTabOn;
            favorite = likeCheck;
            searchText = searchValue;
        }

        //내가누른 좋아요보기 체크시 or 로그인시에만 헤더값 넣기
        let headers = {};
        if(likeCheck || userLogin){
            headers = {
                Authorization: `Bearer ${user.userToken}`,
            }
        }

        try {
            const res = await axios.get(`${feed_list}?limit=40&page_no=${page ? page : 1}${sort === 2 ? '&sort=favorite' : sort === 3 ? '&sort=views' : ''}${favorite ? '&favorite=1' : ''}${searchText.length > 0 ? '&search='+searchText : ''}`,{
                headers: headers,
            });
            if(res.status === 200){
                dispatch(loadingPop(false));

                const data = res.data;
                //더보기버튼 클릭시에만 리스트 추가
                if(more){
                    setFeedList(prevFeedList => [...prevFeedList, ...data.result]);
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

                //리스트페이지 조회 데이터저장
                let pageData = {
                    page: page ? page : 1,
                    sort: sort,
                    favorite: favorite,
                    search: searchText,
                };
                dispatch(listPageData(pageData));

                //상세페이지에서 뒤로가기시
                if(isLast){
                    setSearchValue(searchText);
                    setSortTabOn(etc.listPageData.sort);
                    setLikeCheck(etc.listPageData.favorite);

                    setScrollMove(true);
                    // dispatch(detailPageBack(false));
                    // dispatch(detailPageBackFeed(false));

                    // setPageBack(true);
                }
            }
        } catch (error) {
            dispatch(loadingPop(false));
    
            const err_msg = CF.errorMsgHandler(error);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: err_msg,
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }
    };


    //피드리스트, 매니저 리스트 가져오기
    useEffect(()=>{
        if(!pageBack && !etc.detailPageBack){
            if(typeCheck){
                getManagerList();
            }else{
                getAllFeed();
            }
        }
    },[typeCheck, sortTabOn, likeCheck]);


    //매니저타입 체크시
    const typeCheckHandler = (type) => {
        setTypeCheck(type);
        setPageBack(false);
    };


    //정렬 탭 클릭시
    const sortTabClickHandler = (idx) => {
        setSortTabOn(idx);
        setPageBack(false);
    };


    //내가 누른 좋아요만보기 체크박스 클릭시
    const likeCheckClickHandler = () => {
        setLikeCheck(!likeCheck);
        setPageBack(false);
    };


    //검색어입력값 변경시
    const searchInputChangeHandler = (val) => {
        setSearchValue(val);
    };


    //검색하기버튼 클릭시
    const searchHandler = () => {   
        if(typeCheck){
            getManagerList(pageNo, false);
        }else{
            getAllFeed(pageNo, false);
        }
    };


    //더보기버튼 클릭시 다음페이지 리스트 가져오기
    const moreBtnHandler = () => {
        if(typeCheck){
            getManagerList(pageNo + 1, true);
        }else{
            getAllFeed(pageNo + 1, true);
        }
    };


    //매니저 좋아요하기
    const managerLikeBtnClickHandler = (m_id) => {
        //로그인시에만 가능
        if(userLogin){
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
                    const data = res.data;
                    const flag = data.flag;
                    let count;
                    const list = [...managerList];
                    const index = list.findIndex((item)=>item.manager_id == m_id);
                    const newManagerList = list;

                    if(flag){
                        count = newManagerList[index].fv_cnt+1;
                    }else{
                        count = newManagerList[index].fv_cnt-1;
                    }

                    newManagerList[index].fv_cnt = count;
                    newManagerList[index].fv_flag = flag;
                    setManagerList(newManagerList);
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


    //매니저클릭시 해당매니저상세페이지로 이동
    const managerClickHandler = (id) => {
        setPageBack(false);
        dispatch(scrollY(window.scrollY)); //현재스크롤위치 저장
        navigate('/square/manager/'+id);
    };


    //피드 삭제, 수정시 피드리스트 가져오기
    useEffect(()=>{
        if(common.feedRefresh){
            dispatch(feedRefresh(false));
            getAllFeed();
        }
    },[common.feedRefresh]);


    //피드 좋아요하기
    const feedLikeBtnClickHandler = (idx) => {
        //로그인시에만 가능
        if(userLogin){
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
        dispatch(feedPop({feedPop:true, feedPopNo:idx, feedPopId:null}));
    };


    //매니저프로필클릭시 매니저상세페이지로 이동
    const profileClickHandler = (id) => {
        setPageBack(false);
        dispatch(scrollY(window.scrollY)); //현재스크롤위치 저장
        dispatch(detailPageBackFeed(true));
        navigate(`/square/manager/${id}`);
    };


    //피드스퀘어 타이틀클릭시
    const onTitClickHandler = () => {
        setTypeCheck('');
        setSortTabOn(1);
        setLikeCheck(false);
        setPageNo(1);
        setPageBack(false);
    };


    
    return(<>
        <div className="main_visual_wrap">
            <div className="main_visual flex_center">
                <div className="tag_img">
                    <img src={m_visual_tag} alt="띠이미지" />
                </div>
                <div className="visual_txt">
                    <img src={m_visual_img1} alt="메인이미지" className="img1" />
                </div>
                <div className="scroll">
                    <strong>Scroll</strong>
                </div>
            </div>
        </div>
        <div className={`vip_sect vip_sect2_2 ${sect2_2On ? "on" : ""}`} ref={sect2_2Ref}>
            {storyList.length > 0 &&
            <div className="section_inner">
                <div className="tit_box">
                    <p className="tit">실시간 만남 <strong>스토리</strong></p>
                </div>
                <div className="story_wrap">
                    <Swiper 
                        className={`story_slider`}
                        slidesPerView={`auto`}
                        spaceBetween={8}
                        observer={true}
                        observeParents={true}
                        navigation={{nextEl: `.story_slider .swiper-button-next`,prevEl: `.story_slider .swiper-button-prev`}}
                        scrollbar={{draggable: true}}
                        breakpoints={
                            {
                                1200:{spaceBetween:80},//width >= 1200
                                768:{spaceBetween:50},//width >= 768
                            }
                        }
                        ref={storySliderRef}
                        modules={[Navigation,Scrollbar]}
                    >
                        {storyList.map((cont,i)=>{
                            return(
                                <SwiperSlide key={i} 
                                    onClick={()=>{
                                        dispatch(storyPop({storyPop:true,storyPopNo:i}));
                                    }}
                                >
                                    <div className="img_box"><img src={cont.photo} alt="프로필이미지" /></div>
                                    <div className="txt_box">
                                        <p className="name flex_center"><strong>{cont.manager_name}</strong>{cont.manager_type_txt}</p>
                                        <p className="time">{cont.w_date}</p>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                        <div className="btn_box flex_between mo_none">
                            <div className="swiper-button-prev hover_btn"></div>
                            <div className="swiper-button-next hover_btn"></div>
                        </div>
                    </Swiper>
                </div>
            </div>
            }
        </div>
        <div className="square_list_wrap gray_wrap" style={{'paddingTop':'100px'}}>
            <div className="cont4">
                <ListTopTitleBox
                    tit='피드 스퀘어'
                    onTitClickHandler={onTitClickHandler}
                />
                <ListSearchBox
                    managerType={true}
                    typeCheck={typeCheck}
                    typeCheckHandler={typeCheckHandler}
                    sortTabOn={sortTabOn}
                    sortTabClickHandler={sortTabClickHandler}
                    likeCheck={likeCheck}
                    likeCheckClickHandler={likeCheckClickHandler}
                    searchValue={searchValue}
                    searchInputChangeHandler={searchInputChangeHandler}
                    searchHandler={searchHandler}
                />
                {typeCheck ? //매니저리스트일때
                    <ListCont 
                        list={managerList}
                        moreBtn={moreBtn}
                        moreBtnHandler={moreBtnHandler}
                        moreBtnTxt='매니저'
                        likeBtnClickHandler={managerLikeBtnClickHandler}
                        managerClickHandler={managerClickHandler}
                    />
                : //피드리스트일때
                    <ListCont 
                        list={feedList}
                        moreBtn={moreBtn}
                        moreBtnHandler={moreBtnHandler}
                        moreBtnTxt='피드'
                        likeBtnClickHandler={feedLikeBtnClickHandler}
                        feedCont={true}
                        feedClickHandler={feedClickHandler}
                        profileClickHandler={profileClickHandler}
                    />
                }
                
            </div>
        </div>

        {/* 미로그인시 로그인 confirm팝업 */}
        {loginConfirm && <ConfirmPop onClickHandler={()=>navigate('/member/login')}/>}

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default Main;