import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Scrollbar, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { headerMenuOn } from "../store/commonSlice";
import { managerPop, confirmPop, imgPop, storyPop, storyPopList, imgPopLink } from "../store/popupSlice";
import ManagerBox from "../components/component/ManagerBox";
import ConfirmPop from "../components/popup/ConfirmPop";
import MainFixMenu from "../components/layout/MainFixMenu";
import { enum_api_uri } from "../config/enum";
import * as CF from "../config/function";
import util from "../config/util";
import m_visual_tag from "../images/main_visual_tag.svg";
import m_visual_img1 from "../images/main_visual_txt1.png";
import tip_box_img from "../images/tip_box.svg";
import tip_box_img_mo from "../images/tip_box_mo.svg";
import ic_badge from "../images/ic_badge.svg";
import about_img2 from "../images/about_img2.svg";
import about_img2_mo from "../images/about_img2_mo.svg";
import about_img3 from "../images/about_img3.svg";
import about_img4 from "../images/about_img4.svg";
import about_img5 from "../images/about_img5.svg";
import dona_img1 from "../images/dona_img1.jpg";
import dona_img2 from "../images/dona_img2.jpg";
import dona_img3 from "../images/dona_img3.jpg";
import none_img from "../images/none_img.jpg";


const Main = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const [confirm, setConfirm] = useState(false);
    const sect1Ref = useRef(null);
    const sect2Ref = useRef(null);
    const sect2_2Ref = useRef(null);
    const sect3Ref = useRef(null);
    const sect4Ref = useRef(null);
    const sect5Ref = useRef(null);
    const sect5_2Ref = useRef(null);
    const sect5_3Ref = useRef(null);
    const sect6Ref = useRef(null);
    const [sect1On, setSect1On] = useState(false);
    const [sect2On, setSect2On] = useState(false);
    const [sect2_2On, setSect2_2On] = useState(false);
    const [sect3On, setSect3On] = useState(false);
    const [sect4On, setSect4On] = useState(false);
    const [sect5On, setSect5On] = useState(false);
    const [sect5_2On, setSect5_2On] = useState(false);
    const [sect5_3On, setSect5_3On] = useState(false);
    const [sect6On, setSect6On] = useState(false);
    const [managerSwiperActive, setManagerSwiperActive] = useState(false);
    const aboutTabList = ["원조","비교","금액","프로그램","환불"];
    const [aboutTab, setAboutTab] = useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [blogSwiperActive, setBlogSwiperActive] = useState(false);
    const [blogOn, setBlogOn] = useState(0);
    const [trustTab,setTrustTab] = useState(0);
    const m_list = enum_api_uri.m_list;
    const story_list = enum_api_uri.story_list;
    const blog_list = enum_api_uri.blog_list;
    const ytb_list = enum_api_uri.ytb_list;
    const review_list = enum_api_uri.review_list;
    const user_count = enum_api_uri.user_count;
    const license_list = enum_api_uri.license_list;
    const [managerList, setManagerList] = useState([]);
    const [storyList, setStoryList] = useState([]);
    const [blogList, setBlogList] = useState([]);
    const [ytbList, setYtbList] = useState([]);
    const [ytbOn, setYtbOn] = useState(0);
    const [reviewList, setReviewList] = useState([]);
    const [count, setCount] = useState(0);
    const charmingSliderRef = useRef();
    const storySliderRef = useRef();
    const ref_browser = util.getCookie("ref_browser");
    const [externalSliderActive,setExternalSliderActive] = useState(0);
    const [paperSliderActive,setPaperSliderActive] = useState(0);
    const [donaSliderActive, setDonaSliderActive] = useState(1);
    const [trustList, setTrustList] = useState([]);
    const [trustList2, setTrustList2] = useState([]);
    const trustSwiper = useRef();
    const trustSwiper2 = useRef();


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);

    //화면사이즈 변경될때 width 체크---------
    useEffect(() => {
        const handleWindowResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    },[]);

    useEffect(() => {
        setManagerSwiperActive(windowWidth < 768);
        setBlogSwiperActive(windowWidth < 1200);
    }, [windowWidth]);


    //스크롤시 헤더메뉴 on
    const scrollHeaderOn = () => {
        const scroll = window.scrollY;
        const sect1 = sect1Ref.current.offsetTop;
        const sect2 = sect2Ref.current.offsetTop;
        const sect2_2 = sect2_2Ref.current.offsetTop;
        const sect3 = sect3Ref.current.offsetTop;
        const sect5 = sect5Ref.current.offsetTop;
        const sect6 = sect6Ref.current.offsetTop;

        if(scroll >= sect1 && scroll < sect2){
            dispatch(headerMenuOn(1));
        }
        if(scroll >= sect2 && scroll < sect2_2 && scroll < sect3){
            dispatch(headerMenuOn(2));
        }
        if(scroll >= sect3 && scroll < sect5){
            dispatch(headerMenuOn(3));
        }
        if(scroll >= sect5 && scroll < sect6){
            dispatch(headerMenuOn(4));
        }
        if(scroll >= sect6){
            dispatch(headerMenuOn(5));
        }
        if(scroll < sect1){
            dispatch(headerMenuOn(null));
        }
    };

    //스크롤시 section on
    const scrollSectOn = () => {
        const scroll = window.scrollY;
        const sections = [
            { ref: sect1Ref, onSet: setSect1On },
            { ref: sect2Ref, onSet: setSect2On },
            { ref: sect2_2Ref, onSet: setSect2_2On },
            { ref: sect3Ref, onSet: setSect3On },
            { ref: sect4Ref, onSet: setSect4On },
            { ref: sect5Ref, onSet: setSect5On },
            { ref: sect5_2Ref, onSet: setSect5_2On },
            { ref: sect5_3Ref, onSet: setSect5_3On },
            { ref: sect6Ref, onSet: setSect6On }
        ];
      
        sections.forEach(({ ref, onSet }) => {
            const offsetTop = ref.current.offsetTop;
            if (scroll >= offsetTop - 500) {
                onSet(true);
            }
        });
    };

    useEffect(() => {    
        window.addEventListener("scroll", scrollHeaderOn);
        window.addEventListener("scroll", scrollSectOn);

        return () => {
            window.removeEventListener("scroll", scrollHeaderOn);
            window.removeEventListener("scroll", scrollSectOn);
        };
    }, []);


    //매니저리스트 가져오기
    const getManagerList = () => {
        axios.get(`${m_list}`)
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setManagerList(data);
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


    //블로그리스트 가져오기
    const getBlogList = () => {
        axios.get(`${blog_list}`)
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setBlogList([...data]);
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


    //유튜브리스트 가져오기
    const getYtbList = () => {
        axios.get(`${ytb_list}`)
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setYtbList([...data]);
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


    //신뢰리스트 가져오기
    const getTrustList = () => {
        axios.get(license_list.replace(":idx",1))
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;

                // data의 길이가 6보다 작을 때만 6개까지 복사 (슬라이드 루프때문)
                while (data.length < 6) {
                    data = data.concat([...data]);
                }

                setTrustList(data);
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

        axios.get(license_list.replace(":idx",2))
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;

                // data의 길이가 6보다 작을 때만 6개까지 복사 (슬라이드 루프때문)
                while (data.length < 6) {
                    data = data.concat([...data]);
                }

                setTrustList2(data);
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


    //후기리스트 가져오기
    const getReviewList = () => {
        axios.get(`${review_list}`)
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setReviewList([...data]);
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


    //사용자 수 가져오기
    const getCount = () => {
        axios.get(`${user_count}`)
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setCount(data.user_cnt);
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


    useEffect(()=>{
        getManagerList();
        getStoryList();
        getBlogList();
        getYtbList();
        getTrustList();
        getReviewList();
        getCount();
    },[]);


    //모바일 매니저슬라이드 더보기버튼 클릭시 슬라이드
    const slideMoreHandler = () => {
        charmingSliderRef.current.swiper.slideNext();
    };


    //앱일때 링크이동 클릭시 
    const appLinkHandler = (url,site) => {
        if(ref_browser == "app"){
            const data = {
                url: url,
                site: site
            }
            window.outlink.postMessage(JSON.stringify(data));
        }
    };


    //스토리팝업 다음버튼,이전버튼으로 넘길때 스토리슬라이드 active 변경
    useEffect(()=>{
        if(popup.storyPopNo != null){
            const idx = popup.storyPopNo;
            storySliderRef.current.swiper.slideTo(idx);
        }
    },[popup.storyPopNo]);

   
    //사소한의 신뢰 슬라이드부분-------
    useEffect(() => {
        if (trustList.length > 0 && trustSwiper.current && trustSwiper.current.swiper) {
            trustSwiper.current.swiper.slideTo(0);
            setExternalSliderActive(0);
        }
    }, [trustList]);

    useEffect(() => {
        if (trustList2.length > 0 && trustSwiper2.current && trustSwiper2.current.swiper) {
            trustSwiper2.current.swiper.slideTo(0);
            setPaperSliderActive(0);
        }
    }, [trustList2]);


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
        
        <section className={`section section1 ${sect1On ? "on" : ""}`} id="sect1" ref={sect1Ref}>
            {managerList.length > 0 &&
            <div className="section_inner">
                <div className="title_box">
                    <p className="tit"><strong>매니저와 함께 </strong><br/>새로운 <br className="mo_show"/>인연을 만들어 보세요!</p>
                    <div className="tip_box tm16">
                        <p className="tip_txt">매니저가 뭔가요?</p>
                        <div className="box">
                            <img src={tip_box_img} alt="말풍선이미지" className="mo_none" />
                            <img src={tip_box_img_mo} alt="말풍선이미지" className="mo_show" />
                        </div>
                    </div>
                </div>

                <div className="manager_wrap">
                    <Swiper 
                        className="charming_slider"
                        slidesPerView={1}
                        observer={true}
                        observeParents={true}
                        navigation={{nextEl: ".manager_wrap .swiper-button-next.manager_btn",prevEl: ".manager_wrap .swiper-button-prev.manager_btn"}}
                        loop={true}
                        pagination={{
                            el: ".manager_wrap .swiper-pagination.manager_pagin",
                            type: 'fraction',
                            formatFractionCurrent: function (number) {
                                return number;
                            },
                            formatFractionTotal: function (number) {
                                return number;
                            },
                            renderFraction: function (currentClass, totalClass) {
                                return '<span class="' + currentClass + '"></span>' +
                                       ' / ' +
                                       '<span class="' + totalClass + '"></span>';
                            }
                        }}
                        ref={charmingSliderRef}
                        modules={[Navigation,Pagination]}
                    >
                        {managerList.map((data,i)=>{
                            return(
                                <SwiperSlide key={i}>
                                    <div className="inner_box flex_bottom flex_between">
                                        <div className="charming" onClick={()=>{dispatch(managerPop({managerPop:true,managerPopData:data}))}}>
                                        {/* <div className="charming"> */}
                                            <div className="img">
                                                <img src={data.photo ? data.photo : none_img} alt="매니저프로필이미지" />
                                            </div>
                                            <div className="txt_box">
                                                <div className="name flex_wrap">
                                                    <strong>{data.manager_name}</strong>
                                                    <span>{data.manager_type_txt}</span>
                                                </div> 
                                                <p className="ellipsis2">{data.txt}</p>
                                            </div>
                                            <div className="badge">
                                                <img src={ic_badge} alt="배지이미지" />
                                            </div>
                                        </div>
                                        {data.matching_manager.length > 0 &&
                                            <Swiper 
                                                className={`manager_slider manager_slider_${i+1}`}
                                                slidesPerView={2.3}
                                                spaceBetween={8}
                                                observer={true}
                                                observeParents={true}
                                                navigation={{nextEl: `.manager_slider_${i+1} .swiper-button-next`,prevEl: `.manager_slider_${i+1} .swiper-button-prev`}}
                                                scrollbar={{draggable: true}}
                                                breakpoints={
                                                    {
                                                        1420:{slidesPerView:4,spaceBetween:24},//width >= 1420
                                                        768:{slidesPerView:2,spaceBetween:8},//width >= 768
                                                    }
                                                }
                                                modules={[Scrollbar, Navigation]}
                                            >
                                                {data.matching_manager.map((data,i)=>{
                                                    return(
                                                        <SwiperSlide key={i} onClick={()=>{dispatch(managerPop({managerPop:true,managerPopData:data}))}}>
                                                            <ManagerBox data={data}/>
                                                        </SwiperSlide>
                                                    );
                                                })}
                                                <div className="swiper-button-prev"></div>
                                                <div className="swiper-button-next"></div>
                                            </Swiper>
                                        }
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                        
                    </Swiper>
                    <div className="btn_box flex_between">
                        <div className="swiper-button-prev hover_btn manager_btn"></div>
                        <div className="swiper-pagination manager_pagin"></div>
                        <div className="swiper-button-next hover_btn manager_btn"></div>
                        <button type="button" className="more_btn" onClick={slideMoreHandler}></button>
                    </div>
                </div>
            </div>
            }
        </section>

        <section className={`section section2 ${sect2On ? "on" : ""}`} id="sect2" ref={sect2Ref}>
            <div className="section_inner">
                <div className="about_wrap flex_top">
                    <div className="title_box">
                        <p className="tit"><strong>사소한에 대해 </strong><br/>알려드릴게요!</p>
                    </div>
                    <div className="txt_box">
                        <div className="tab_ul">
                            <ul className="flex">
                                {aboutTabList.map((txt,i)=>{
                                    return(
                                        <li key={i} className={`flex_center${aboutTab === i ? " on" : ""}`}  onClick={()=>{setAboutTab(i)}}><strong>0{i+1}</strong>{txt}</li>
                                        );
                                    })}
                            </ul>
                        </div>
                        <ul className="txt_ul">
                            <li className={aboutTab === 0 ? "on" : ""}>
                                <h4>매니저를 통한 온라인 소개팅의 원조</h4>
                                <p className="txt"><strong>{"<국내 최초 사람이 해주는 매니저 소개> <카카오톡 신개념 소개팅>"}</strong> 등 <br/>
                                사소한이 매니저를 통한 온라인 소개팅의 원조라는 사실을 알고 계셨나요?</p>
                                <p className="txt2">최근 몇 년 사이 <br/>
                                사소한의 인기에 힘입어 매니저 소개팅을 내세우며 유사한 서비스를 출시하는 회사들이 많이 생겼습니다. <br/>
                                그러나 이러한 개념의 서비스가 <span>처음 도입된 것은 사소한</span>이었습니다. <br/><br/>

                                사소한 소개팅은 2015년 4월 출시 이래로 이미 <span>10년의 역사</span>를 가지고 있으며, <br/>
                                <span>매니저를 통한 온라인 소개팅 서비스를 선보인 최초의 회사</span>입니다. <br/>
                                비슷한 개념의 다른 소개팅 업체를 찾아 보아도, 저희 회사가 압도적으로 오래된 것은 부인할 수 없는 사실입니다. <br/>
                                추가로, 사소한을 모방한 회사들 중 70% 이상은 사소한의 전직원 출신으로 구성됐음을 알려드립니다. <br/>
                                직원 출신 회사의 직원이 또 모방하여 차린 회사도 있습니다. <br/>
                                하지만 모방은 혁신적인 면에서 결코 창조를 이길 수 없습니다. <br/><br/>

                                결국 사소한은 뿌리이자 다른 아류 서비스들과는 다르게 <br/>
                                오랜 기간 동안 수많은 회원들의 신뢰와 성원을 받으며 쌓인 노하우를 기반으로 <br/>
                                <span>근본적이며 보다 안전한 서비스를 제공</span>하고 있습니다. <br/>
                                이용해보신다면 차별화된 서비스의 가치를 직접 경험하실 수 있을 것입니다. <br/><br/>

                                <span>이러한 자부심을 이야기 할 수 있는 건 오직 사소한 하나뿐입니다.</span></p>
                            </li>
                            <li className={aboutTab === 1 ? "on" : ""}>
                                <h4>사소한이어야 하는 이유</h4>
                                <img src={about_img2} alt="일러스트이미지" className="mo_none" />
                                <img src={about_img2_mo} alt="일러스트이미지" className="mo_show" />
                            </li>
                            <li className={aboutTab === 2 ? "on" : ""}>
                                <h4>매너베이트 시스템</h4>
                                <img src={about_img3} alt="일러스트이미지" />
                                <p className="txt">사소한 소개팅 서비스는 <strong>소개팅 진행시</strong> 비용을 한 쪽에서만 부담을 하는 <strong>단방향 결제 소개팅 시스템</strong>입니다.</p>
                                <p className="txt2">이 과정에서,사소한은 소개팅을 유료로 진행한 결제자님에게 소개팅 비용 99,000원을 받고, <br/>
                                상대 이성에게 1만 원을 따로 빼서 전달하게 됩니다. <br/>
                                이 1만원을 <span>매너베이트</span>라고 부르며, 매너베이트는 <span>manner(예의) + bait(미끼) 의 합성어</span> 입니다. <br/><br/>

                                매너는 '태도와 예의'를 뜻하는 단어로, 상대 이성이 소개팅에 진지한 자세와 태도로 임함을 뜻하며, <br/>
                                베이트는 '미끼' 라는 뜻으로, <span>유료 결제자님의 상대 이성을 유도하여 소개팅 테이블로 모셔오는 역할</span>을 합니다. <br/><br/>

                                즉 <span>매너베이트</span>는 소개팅 파트너를 진지한 태도로 소개팅에 참여하게 하고 책임감을 부여하며, <br/>
                                파트너를 유연하게 소개팅에 참여할 수 있도록 유도하는 보상입니다. <br/><br/>

                                사소한은 매너베이트를 활용하여 유료 결제자님에게 <span>확실한 이상형 선택의 기회를 제공</span>합니다. <br/>
                                매너 베이트 시스템은 사소한 만이 진행하는 독창적인 시스템입니다. <br/><br/>

                                비록 소개팅 비용에 있어서는 유료결제와, 매너베이트 사이의 비평등함이 존재하지만, <br/>
                                오히려 놀랍게도 이를 통해 더 많은 이상형을 <br/>
                                <span>매칭 받을 수 있는 기회의 평등함이 제공됩니다. </span><br/><br/>

                                따라서 매너베이트 시스템을 이용한 소개팅은 소개팅 경험에 대한 <br/>
                                만족도가 높아질 것이며 더 적합한 이상형과 만날 수 있는 가능성도 높아집니다.</p>
                            </li>
                            <li className={aboutTab === 3 ? "on" : ""}>
                                <h4>4박 5일 로맨스 프로그램</h4>
                                <img src={about_img4} alt="일러스트이미지" />
                                <p className="txt">사소한 소개팅은 오프라인 소개팅 서비스와는 달리, <strong>온라인 소개팅 서비스</strong>입니다.</p>
                                <p className="txt2">사소한 소개팅 룰은 <span>4박5일 로맨스 프로그램</span>으로 <br/>
                                두 사람이 4박 5일간 서로를 알아가고, 서로에 대한 호감이 깊어지는 설레임을 경험할 수 있는 프로그램입니다. <br/><br/>

                                매칭이 되면 당신이 지목한 이성과, 당신을 위한 소개팅 테이블(채팅방)을 만들어드립니다. <br/>
                                그리고 4박 5일 동안 서로를 더 알아가는 과정을 통해 참가자들은 보다 깊은 이해와 신뢰를 쌓아 갑니다. <br/><br/>

                                또한, 4박 5일 로맨스 룰은 특별하게 상대방과 최소 한 번 이상의 통화를 필수적으로 보장하는 <span>통화 필수 보장 서비스</span>를 <br/>
                                제공함으로써 소개팅 상대방과의 전화 통화를 중요한 원칙으로 지키고 있습니다. <br/><br/>

                                그 후 <span>결정의 날</span>이 찾아오게 되면 당신은 상대방과의 운명을 확인할 수 있습니다. <br/>
                                만약 두 사람 중 한 명이 만나지 않기로 결정하면 소개팅은 실패로 끝나 종료되지만, <br/>
                                두 사람 모두 만남을 선택한다면 이제부터는 당신의 로맨스가 시작됩니다!</p>
                            </li>
                            <li className={aboutTab === 4 ? "on" : ""}>
                                <h4>스마트 환불 시스템</h4>
                                <img src={about_img5} alt="일러스트이미지" />
                                <p className="txt"><strong>우리는 고객님의 만족을 최우선으로 생각합니다.</strong></p>
                                <p className="txt2">만약 불만족스러운 상황이 발생할 경우, 저희는 고객님께서 결제한 금액 중 일부를 빠르고 간편하게 환불해드립니다. <br/>
                                이는 사소한 소개팅이 자랑하는 스마트 환불 시스템이며 소개팅 서비스는 인간의 감정과 마음이 언제든 변할 수 있다는 <br/>
                                특성을 고려하여 유연한 체계를 갖추어야 한다고 생각합니다. <br/>
                                하여서, 고객님의 단순 변심일지언정 <span>고객님이 원할 때 언제든지 환불이 가능</span>합니다. <br/><br/>

                                <span>스마트 환불 시스템의 체계는 아래와 같습니다. <br/>
                                결제 당일 환불 : 80% <br/>
                                소개팅 2일차 : 60% <br/>
                                소개팅 3일차 : 40% <br/>
                                소개팅 4일차 : 20% <br/>
                                결정의 날 : 환불 불가 </span><br/><br/>

                                소개팅 서비스는 안심하고 이용할 수 있는 서비스입니다. <br/>
                                고객님의 만족을 위해 최선을 다하는 저희와 함께 <br/>
                                안정적이고 만족스러운 소개팅 경험을 누려보세요.</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <section className={`section section2_2 ${sect2_2On ? "on" : ""}`} id="sect2_2" ref={sect2_2Ref}>
            {storyList.length > 0 &&
            <div className="section_inner">
                <div className="tit_box">
                    <p className="tit">실시간 만남 <strong>스토리</strong></p>
                    <p className="txt">정확하고 빠른 사소한만의 <br className="mo_show" />실시간 매칭 만남을 확인하세요! </p>
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
                            <div className="swiper-button-prev hover_btn_w"></div>
                            <div className="swiper-button-next hover_btn_w"></div>
                        </div>
                    </Swiper>
                </div>
            </div>
            }
        </section>

        <section className={`section section3 ${sect3On ? "on" : ""}`} id="sect3" ref={sect3Ref}>
            {/* {blogList.length > 0 &&
            <div className="section_inner">
                <div className="title_box flex_between flex_bottom">
                    <p className="tit">사소한의 <br/><strong>새로운 소식이에요.</strong></p>
                    <a className="btn_link" href="https://blog.naver.com/sasohan_official" target="_blank" rel="noopener noreferrer">사소한 블로그 바로가기</a>
                </div>
                <div className="blog_wrap">
                    {blogSwiperActive ? 
                        <Swiper 
                            className="blog_slider"
                            slidesPerView={1.3}
                            spaceBetween={28}
                            pagination={{ el: ".blog_slider .swiper-pagination", clickable: true }}
                            loop={true}
                            speed={400}
                            centeredSlides={true}
                            observer={true}
                            observeParents={true}
                            breakpoints={
                                //width >= 767
                                {767:{slidesPerView:1.3,spaceBetween:34}}
                            }
                            modules={[Pagination]}
                        >
                            {blogList.map((data,i)=>{
                                return(
                                    <SwiperSlide className="slide_box" key={i}>
                                        <a href={data.link} target="_blank" rel="noopener noreferrer"
                                            onClick={()=>{appLinkHandler(data.link,"naver")}}
                                        >
                                            <img src={data.image} alt="배경이미지" />
                                            <div className="txt_box">
                                                <div>
                                                    <h5 className="ellipsis2">{data.subject}</h5>
                                                    <p className="date">{data.w_date}</p>
                                                </div>
                                                <p className="txt ellipsis4">{data.contents}</p>
                                            </div>
                                        </a>
                                    </SwiperSlide>
                                );
                            })}
                            <div className="swiper-pagination"></div>
                        </Swiper>
                        : 
                        <ul className="blog_ul flex">
                            {blogList.map((data,i)=>{
                                return(
                                    <li 
                                        className={`slide_box ${blogOn === i ? "on" : ""}`} 
                                        onClick={()=>{setBlogOn(i)}} 
                                        key={i}
                                    >
                                        <a href={data.link} target="_blank" rel="noopener noreferrer"
                                            onClick={()=>{appLinkHandler(data.link,"naver")}}
                                        >
                                            <img src={data.image} alt="배경이미지" />
                                            <div className="txt_box">
                                                <p className="tit ellipsis2">{data.subject}</p>
                                                <div>
                                                    <h5 className="ellipsis2">{data.subject}</h5>
                                                    <p className="date">{data.w_date}</p>
                                                </div>
                                                <p className="txt ellipsis4">{data.contents}</p>
                                            </div>
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    }
                </div>
            </div>
            } */}
        </section>

        <section className={`section section4 ${sect4On ? "on" : ""}`} ref={sect4Ref}>
            {ytbList.length > 0 &&
            <div className="section_inner">
                <div className="youtube_wrap">
                    <div className="top_box flex_between flex_top">
                        <div className="title_box">
                            <p className="tit">오직, <br/><strong>사소한에서만.</strong></p>
                            <div className="flex_between">
                                <a className="btn_link ytb" href="https://www.youtube.com/@user-sasohan" target="_blank" rel="noopener noreferrer"
                                    onClick={()=>{appLinkHandler("https://www.youtube.com/@user-sasohan","youtube")}}
                                >유튜브 채널 바로가기</a>
                                {ytbList.length > 1 &&
                                <div className="btn_box flex">
                                    <div className="swiper-button-prev hover_btn"></div>
                                    <div className="swiper-button-next hover_btn"></div>
                                </div>
                                }
                            </div>
                        </div>
                        <div className="video_box">
                            <a
                                className="btn_play"
                                href={ytbList[ytbOn].link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img src={ytbList[ytbOn].image} alt="유튜브이미지" />
                                <div className="play"></div>
                            </a>
                        </div>
                    </div>
                    {ytbList.length > 1 &&
                    <Swiper 
                        className="youtube_slider"
                        slidesPerView={"auto"}
                        spaceBetween={8}
                        navigation={{nextEl: ".youtube_wrap .swiper-button-next",prevEl: ".youtube_wrap .swiper-button-prev"}}
                        scrollbar={{draggable: true}}
                        slideToClickedSlide={true}
                        breakpoints={
                            {
                                1200:{slidesPerView:4,spaceBetween:30}, //width >= 1200
                                767:{slidesPerView:4,spaceBetween:7},  //width >= 767
                            }
                        }
                        modules={[Navigation,Scrollbar]}
                    >
                        {ytbList.map((data,i)=>{
                            return(
                                <SwiperSlide key={i} onClick={()=>{setYtbOn(i)}}>
                                    <div className="img_box"><img src={data.image} alt="유튜브이미지" /></div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                    }
                </div>
            </div>
            }
        </section>

        <section className={`section section5_1 ${sect5On ? "on" : ""}`} id="sect5" ref={sect5Ref}>
            <div className="section_inner">
                <div className="title_box">
                    <p className="tit">회원님들을 위한 <br/><strong>사소한의 신뢰</strong></p>
                </div>
                <div className="trust_cont_inner">
                    <h5 className="top_tit">외부 평가</h5>
                    <div className="slider_box external_slider_box flex_end">
                        <ul className="slider_big">
                            {trustList.map((cont,i)=>{
                                return(
                                    <li key={i} className={externalSliderActive === i ? "on" : ""}>
                                        <div className="box flex">
                                            <div className="img_box" onClick={()=>{dispatch(imgPop({imgPop:true,imgPopSrc:cont.image}))}}>
                                                <img src={cont.thumbnail} alt="이미지" />
                                            </div>
                                            <div className="txt_box">
                                                <p className="txt">{cont.subject.replace(/\\n/g, '\n')}</p>
                                                <p className={`txt2${cont.link ? " link" : ""}`} 
                                                    onClick={()=>{
                                                        if(cont.link){
                                                            window.open(cont.link);
                                                        }
                                                    }}
                                                >{cont.link ? "링크이동 ->" : cont.sub_subject.replace(/\\n/g, '\n')}</p>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="slider">
                            <Swiper
                                ref={trustSwiper}
                                initialSlide={0}
                                key={`swiper-instance-${trustList.length}`}//키값 변경시 해당컴포넌트 새로 마운트됨
                                className="external_slider"
                                slidesPerView={1.7}
                                spaceBetween={0}
                                centeredSlides={true}
                                observer={true}
                                observeParents={true}
                                loop={true}
                                slidesPerGroup={1}
                                navigation={{nextEl: ".external_slider_box .swiper-button-next",prevEl: ".external_slider_box .swiper-button-prev"}}
                                onSlideChange={(e)=>{
                                    const idx = e.realIndex;
                                    setExternalSliderActive(idx);
                                }}
                                breakpoints={
                                    {
                                        1421:{slidesPerView:3,spaceBetween:60,centeredSlides:false},//width >= 1421
                                        1200:{slidesPerView:3,spaceBetween:0,centeredSlides:true},//width >= 1200
                                        900:{slidesPerView:2.5,spaceBetween:0,centeredSlides:true},//width >= 900
                                        //768:{slidesPerView:1.7,spaceBetween:0,centeredSlides:true},//width >= 768
                                    }
                                }
                                modules={[Navigation]}
                            >
                                {trustList.map((cont,i)=>{
                                    return(
                                        <SwiperSlide key={i}
                                            onClick={()=>{
                                                dispatch(imgPop({imgPop:true,imgPopSrc:cont.image}));
                                                if(cont.link){
                                                    dispatch(imgPopLink(cont.link));
                                                }
                                            }}
                                        >
                                            <div className="box">
                                                <div className="img_box">
                                                    <img src={cont.thumbnail} alt="이미지" />
                                                </div>
                                                <div className="txt_box">
                                                    <p className="txt">{cont.subject.replace(/\\n/g, '\n')}</p>
                                                    <p className="txt2" 
                                                        onClick={()=>{
                                                            if(cont.link){
                                                                window.open(cont.link);
                                                            }
                                                        }}
                                                    >{cont.link ? "링크이동 ->" : cont.sub_subject.replace(/\\n/g, '\n')}</p>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        </div>
                        <div className="btn_box flex_between">
                            <div className="swiper-button-prev hover_btn"></div>
                            <div className="swiper-button-next hover_btn"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className={`section section5_2 ${sect5_2On ? "on" : ""}`} ref={sect5_2Ref}>
            <div className="section_inner">
                <div className="trust_cont_inner">
                    <h5 className="top_tit">인허가서류</h5>
                    <div className="slider_box paper_slider_box flex_end">
                        <ul className="slider_big">
                            {trustList2.map((cont,i)=>{
                                return(
                                    <li key={i} className={paperSliderActive === i ? "on" : ""}>
                                        <div className="box flex">
                                            <div className="img_box" onClick={()=>{dispatch(imgPop({imgPop:true,imgPopSrc:cont.image}))}}>
                                                <img src={cont.thumbnail} alt="이미지" />
                                            </div>
                                            <div className="txt_box">
                                                <p className="txt">{cont.subject.replace(/\\n/g, '\n')}</p>
                                                <p className={`txt2${cont.link ? " link" : ""}`} 
                                                    onClick={()=>{
                                                        if(cont.link){
                                                            window.open(cont.link);
                                                        }
                                                    }}
                                                >{cont.link ? "링크이동 ->" : cont.sub_subject.replace(/\\n/g, '\n')}</p>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="slider">
                            <Swiper
                                ref={trustSwiper2}
                                initialSlide={0}
                                key={`swiper-instance-${trustList2.length}`}//키값 변경시 해당컴포넌트 새로 마운트됨
                                className="paper_slider"
                                slidesPerView={1.7}
                                spaceBetween={0}
                                centeredSlides={true}
                                observer={true}
                                observeParents={true}
                                loop={true}
                                navigation={{nextEl: ".paper_slider_box .swiper-button-next",prevEl: ".paper_slider_box .swiper-button-prev"}}
                                onSlideChange={(e)=>{
                                    const idx = e.realIndex;
                                    setPaperSliderActive(idx);
                                }}
                                breakpoints={
                                    {
                                        1421:{slidesPerView:3,spaceBetween:60,centeredSlides:false},//width >= 1421
                                        1200:{slidesPerView:3,spaceBetween:0,centeredSlides:true},//width >= 1200
                                        900:{slidesPerView:2.5,spaceBetween:0,centeredSlides:true},//width >= 900
                                        //768:{slidesPerView:1.7,spaceBetween:0,centeredSlides:true},//width >= 768
                                    }
                                }
                                modules={[Navigation]}
                            >
                                {trustList2.map((cont,i)=>{
                                    return(
                                        <SwiperSlide key={i}
                                            onClick={()=>{
                                                dispatch(imgPop({imgPop:true,imgPopSrc:cont.image}));
                                                if(cont.link){
                                                    dispatch(imgPopLink(cont.link));
                                                }
                                            }}
                                        >
                                            <div className="box">
                                                <div className="img_box">
                                                    <img src={cont.thumbnail} alt="이미지" />
                                                </div>
                                                <div className="txt_box">
                                                    <p className="txt">{cont.subject.replace(/\\n/g, '\n')}</p>
                                                    <p className="txt2" 
                                                        onClick={()=>{
                                                            if(cont.link){
                                                                window.open(cont.link);
                                                            }
                                                        }}
                                                    >{cont.link ? "링크이동 ->" : cont.sub_subject.replace(/\\n/g, '\n')}</p>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        </div>
                        <div className="btn_box flex_between">
                            <div className="swiper-button-prev hover_btn"></div>
                            <div className="swiper-button-next hover_btn"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className={`section section5_3 ${sect5_3On ? "on" : ""}`} ref={sect5_3Ref}>
            <div className="section_inner">
                <div className="tit_box">
                    <p>정기적인 기부</p>
                </div>
                <ul className="left_txt_box">
                    <li className={donaSliderActive == 1 ? "on" : ""}>
                        <h6>밀알복지재단 후원</h6>
                        <p>사소한은 정기적인 기부를 진행하고 있습니다.</p>
                    </li>
                    <li className={donaSliderActive == 2 ? "on" : ""}>
                        <h6>Save the Children</h6>
                        <p>사소한은 정기적인 기부를 진행하고 있습니다.</p>
                    </li>
                    <li className={donaSliderActive == 3 ? "on" : ""}>
                        <h6>World Vision</h6>
                        <p>사소한은 정기적인 기부를 진행하고 있습니다.</p>
                    </li>
                </ul>
            </div>
            <div className="donation_slider_box flex_end">
                <div className="slider_box">
                    <Swiper
                        className="donation_slider"
                        slidesPerView={1.7}
                        spaceBetween={0}
                        centeredSlides={true}
                        navigation={{nextEl: ".donation_slider_box .swiper-button-next",prevEl: ".donation_slider_box .swiper-button-prev"}}
                        loop={true}
                        onSlideChange={(swiper)=>{
                            const activeSlide = swiper.slides[swiper.activeIndex];
                            const activeSlideClassNames = activeSlide.className.split(' ');
                            let idx = activeSlideClassNames.find(className => className.startsWith('slide_'));
                                idx = idx.replace("slide_","");
                            setDonaSliderActive(idx);
                        }}
                        breakpoints={
                            {
                                1421:{slidesPerView:`auto`,spaceBetween:50,centeredSlides:false},//width >= 1421
                                1200:{slidesPerView:3,spaceBetween:0,centeredSlides:true},//width >= 1200
                                900:{slidesPerView:2.5,spaceBetween:0,centeredSlides:true},//width >= 900
                                //768:{slidesPerView:1.7,spaceBetween:0,centeredSlides:true},//width >= 768
                            }
                        }
                        modules={[Navigation]}
                    >
                        <SwiperSlide className="slide_1">
                            <div className="img_box" onClick={()=>{dispatch(imgPop({imgPop:true,imgPopSrc:dona_img1}))}}>
                                <img src={dona_img1} alt="이미지" />
                            </div>
                            <div className="txt_box">
                                <p className="txt">밀알복지재단 후원</p>
                                <p className="txt2">사소한은 정기적인 기부를 진행하고 있습니다.</p>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide className="slide_2">
                            <div className="img_box" onClick={()=>{dispatch(imgPop({imgPop:true,imgPopSrc:dona_img2}))}}>
                                <img src={dona_img2} alt="이미지" />
                            </div>
                            <div className="txt_box">
                                <p className="txt">Save the Children</p>
                                <p className="txt2">사소한은 정기적인 기부를 진행하고 있습니다.</p>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide className="slide_3">
                            <div className="img_box" onClick={()=>{dispatch(imgPop({imgPop:true,imgPopSrc:dona_img3}))}}>
                                <img src={dona_img3} alt="이미지" />
                            </div>
                            <div className="txt_box">
                                <p className="txt">World Vision</p>
                                <p className="txt2">사소한은 정기적인 기부를 진행하고 있습니다.</p>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide className="slide_1">
                            <div className="img_box" onClick={()=>{dispatch(imgPop({imgPop:true,imgPopSrc:dona_img1}))}}>
                                <img src={dona_img1} alt="이미지" />
                            </div>
                            <div className="txt_box">
                                <p className="txt">밀알복지재단 후원</p>
                                <p className="txt2">사소한은 정기적인 기부를 진행하고 있습니다.</p>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide  className="slide_2">
                            <div className="img_box" onClick={()=>{dispatch(imgPop({imgPop:true,imgPopSrc:dona_img2}))}}>
                                <img src={dona_img2} alt="이미지" />
                            </div>
                            <div className="txt_box">
                                <p className="txt">Save the Children</p>
                                <p className="txt2">사소한은 정기적인 기부를 진행하고 있습니다.</p>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide className="slide_3">
                            <div className="img_box" onClick={()=>{dispatch(imgPop({imgPop:true,imgPopSrc:dona_img3}))}}>
                                <img src={dona_img3} alt="이미지" />
                            </div>
                            <div className="txt_box">
                                <p className="txt">World Vision</p>
                                <p className="txt2">사소한은 정기적인 기부를 진행하고 있습니다.</p>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
                <div className="btn_box">
                    <div className="inner flex">
                        <div className="swiper-button-prev hover_btn"></div>
                        <div className="num_box"><span>{donaSliderActive}</span>&nbsp;&nbsp;/&nbsp;&nbsp;3</div>
                        <div className="swiper-button-next hover_btn"></div>
                    </div>
                </div>
            </div>
        </section>
        
        <section className={`section section6 ${sect6On ? "on" : ""} ${reviewList.length > 0 ? "" : "none"}`} id="sect6" ref={sect6Ref}>
            {reviewList.length > 0 &&
            <div className="section_inner">
                <div className="review_wrap flex_between flex_top">
                    <div className="tit_cont">
                        <div className="title_box">
                            <p className="tit"><strong>사소한의 후기가 </strong><br/>증명합니다.</p>
                        </div>
                        <div className="btn_box flex mo_none">
                            <div className="swiper-button-prev hover_btn"></div>
                            <div className="swiper-button-next hover_btn"></div>
                        </div>
                        <div className="alert_txt_box">
                            <p className="txt">소비자에게 혼동을 주는 <strong>조작된 후기는 <br/>표시광고법 위반</strong>으로 엄연한 위법입니다.</p>
                            <p className="txt2">사소한 공식 홈페이지의 후기는 모두 진실된 후기입니다.</p>
                        </div>
                    </div>
                    <Swiper
                        className="review_slider"
                        slidesPerView="auto"
                        slidesPerGroup={1}
                        navigation={{nextEl: ".review_wrap .swiper-button-next",prevEl: ".review_wrap .swiper-button-prev"}}
                        scrollbar={{draggable: true}}
                        breakpoints={
                            //width >= 1420
                            {1420:{slidesPerView:3,slidesPerGroup:3}}
                        }
                        modules={[Navigation,Scrollbar]}
                    >
                        {reviewList.map((data,i)=>{
                            return(
                                <SwiperSlide key={i}
                                    onClick={()=>{
                                        appLinkHandler(data.link,"insta");
                                        window.open(data.link);
                                    }} 
                                >
                                    <div className="img_box">
                                        <img src={data.thumb ? data.thumb : none_img} alt="이미지" />
                                    </div>
                                    {/* <div className="txt_box">
                                        <p className="txt ellipsis">{data.subject}</p>
                                        <p className="date">{data.w_date}</p>
                                    </div> */}
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                    <div className="alert_txt_box bottom">
                        <p className="txt">소비자에게 혼동을 주는 <strong>조작된 후기는 <br/>표시광고법 위반</strong>으로 엄연한 위법입니다.</p>
                        <p className="txt2">사소한 공식 홈페이지의 후기는 모두 진실된 후기입니다.</p>
                    </div>
                </div>
            </div>
            }
        </section>

        <div className="app_wrap">
            <div className="section_inner flex_between">
                <p className="txt">지금 사소한을 이용하면, <br/><strong>{CF.MakeIntComma(count)}명의 사람</strong><span>을 만날 수 있어요.</span></p>
                <div className="app_box">
                    <ul className="flex">
                        <li>
                            <a
                                href="/"
                                // target="_blank"
                                rel="noopener noreferrer"
                            >Google Play
                            </a>
                        </li>
                        <li>
                            <a
                                href="/"
                                // target="_blank"
                                rel="noopener noreferrer"
                            >App Store
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <MainFixMenu />

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default Main;