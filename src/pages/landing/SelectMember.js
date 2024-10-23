import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Formik } from "formik";
import { PatternFormat } from "react-number-format";
import * as CF from "../../config/function";
import { enum_api_uri } from "../../config/enum";
import { confirmPop, termsPop, termsCheckList } from "../../store/popupSlice";
import { storyPop, storyPopList, policyPop } from "../../store/landingSlice";
import ConfirmPop from "../../components/popup/ConfirmPop";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';
import logo from "../../images/landing/select_member/logo.svg";
import main_video from "../../images/landing/select_member/main_video.mp4";
import arrow_right from "../../images/landing/select_member/arrow_right_white.svg";
import sect1_txt from "../../images/landing/select_member/sect1_txt.svg";
import sect1_img from "../../images/landing/select_member/sect1_img.png";
import sect1_img_mo from "../../images/landing/select_member/sect1_img_mo.png";
import sect2_member_img1 from "../../images/landing/select_member/sect2_member_img1.jpg";
import sect2_member_img2 from "../../images/landing/select_member/sect2_member_img2.jpg";
import sect2_member_img3 from "../../images/landing/select_member/sect2_member_img3.jpg";
import sect2_member_img4 from "../../images/landing/select_member/sect2_member_img4.jpg";
import sect3_img from "../../images/landing/select_member/sect3_img.svg";
import sect3_txt from "../../images/landing/select_member/sect3_txt.svg";
import sect4_auth1 from "../../images/landing/select_member/sect4_auth1.jpg";
import sect4_auth2 from "../../images/landing/select_member/sect4_auth2.jpg";
import sect4_auth3 from "../../images/landing/select_member/sect4_auth3.jpg";
import sect4_auth4 from "../../images/landing/select_member/sect4_auth4.jpg";
import form_heart_img from "../../images/landing/select_member/form_heart_img.svg";
import ic_male from "../../images/landing/select_member/ic_male.svg";
import ic_female from "../../images/landing/select_member/ic_female.svg";
import arrow_more from "../../images/landing/select_member/arrow_more.svg";



const memberImgs = [
    sect2_member_img1,
    sect2_member_img2,
    sect2_member_img3,
    sect2_member_img4
];

const authImgs = [
    sect4_auth1,
    sect4_auth2,
    sect4_auth3,
    sect4_auth4
];

const SelectMember = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const mainVideoRef = useRef();
    const memberSwiperRef = useRef();
    const authSwiperRef = useRef();
    const reviewSwiperRef = useRef();
    const site_info = enum_api_uri.site_info;
    const s_story_list = enum_api_uri.s_story_list;
    const m_address = enum_api_uri.m_address;
    const m_address2 = enum_api_uri.m_address2;
    const date_apply = enum_api_uri.date_apply;
    const [videoSound, setVideoSound] = useState(false);
    const [videoPlay, setVideoPlay] = useState(true);
    const [memberList] = useState([1,2,3,4]);
    const [authrList] = useState(["우수기술기업 인증서","상표등록증","법률자문 협약서","국내결혼중개업 신고필증"]);
    const [reviewList, setReviewList] = useState([]);
    const [memberSliderActive, setMemberSliderActive] = useState(0);
    const [authSliderActive, setauthSliderActive] = useState(0);
    const [confirm, setConfirm] = useState(false);
    const [submitConfirm, setSubmitConfirm] = useState(false);
    const [terms, setTerms] = useState({});
    const [yearList, setYearList] = useState([]);
    const [addressList, setAddressList] = useState([]);
    const [addressList2, setAddressList2] = useState([]);
    const [yearSelected, setYearSelected] = useState(false);
    const [addrSelected, setAddrSelected] = useState(false);
    const [addr2Selected, setAddr2Selected] = useState(false);
    const [addrSelectList, setAddrSelectList] = useState([]);
    const [allAddressCheck, setAllAddressCheck] = useState(false);
    const [info, setInfo] = useState({});
    const sect1Ref = useRef(null);
    const sect2Ref = useRef(null);
    const sect3Ref = useRef(null);
    const sect4Ref = useRef(null);
    const sect5Ref = useRef(null);
    const [sect1On, setSect1On] = useState(false);
    const [sect2On, setSect2On] = useState(false);
    const [sect3On, setSect3On] = useState(false);
    const [sect4On, setSect4On] = useState(false);
    const [sect5On, setSect5On] = useState(false);
    const [navOn, setNavOn] = useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const { apply_idx } = useParams();
    const [isAllChecked, setIsAllChecked] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
            setSubmitConfirm(false);
        }
    },[popup.confirmPop]);


    //스크롤시 헤더메뉴 on
    const scrollHeaderOn = () => {
        const scroll = window.scrollY;
        const sect1 = sect1Ref.current.offsetTop;
        const sect4 = sect4Ref.current.offsetTop;
        const sect5 = sect5Ref.current.offsetTop;

        if(scroll < sect1){
            setNavOn(0);
        }
        if(scroll >= sect4){
            setNavOn(4);
        }
        if(scroll >= sect5 - 200){
            setNavOn(5);
        }
    };

    //스크롤시 section on
    const scrollSectOn = () => {
        const scroll = window.scrollY;
        const sections = [
            { ref: sect1Ref, onSet: setSect1On },
            { ref: sect2Ref, onSet: setSect2On },
            { ref: sect3Ref, onSet: setSect3On },
            { ref: sect4Ref, onSet: setSect4On },
            { ref: sect5Ref, onSet: setSect5On },
        ];
      
        sections.forEach(({ ref, onSet }) => {
            const offsetTop = ref.current.offsetTop;
            if (scroll >= offsetTop - 500) {
                onSet(true);
            }
        });
    };

    useEffect(() => {    
        const handleWindowResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("scroll", scrollHeaderOn);
        window.addEventListener("scroll", scrollSectOn);
        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener("scroll", scrollHeaderOn);
            window.removeEventListener("scroll", scrollSectOn);
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);


    //후기리스트 가져오기
    const getReviewList = () => {
        axios.get(`${s_story_list}`)
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setReviewList([...data]);
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


    //나이 년도 구하기
    const getYearList = () => {
        const currentYear = new Date().getFullYear(); // 현재 년도 구하기
        const startYear = currentYear - 19; // 시작 년도 설정 (현재 년도에서 19를 뺍니다.)
        const endYear = 1963; // 종료 년도 설정
        
        const yearsArray = [];
        
        for (let i = startYear; i >= endYear; i--) {
            yearsArray.push(i.toString());
        }

        setYearList([...yearsArray]);
    };


    //주소 시,도 가져오기
    const getAddress = () => {
        axios.get(`${m_address}`)
        .then((res)=>{
            if(res.status === 200){
                const data = res.data;
                setAddressList(data);
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


    //주소 시,도 셀렉트박스 선택시 구,군 가져오기
    const getAddress2 = (code) => {
        axios.get(`${m_address2.replace(':parent_local_code',code)}`)
        .then((res)=>{
            if(res.status === 200){
                setAddressList2(res.data);
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


    //사이트정보 가져오기
    const geInfo = () => {
        axios.get(`${site_info}`)
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setInfo({...data});
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
        getReviewList();
        getYearList();
        getAddress();
        geInfo();
    },[]);


    //선택한 지역리스트 값 변경시 전지역 체크박스값 변경
    useEffect(()=>{
        if(addrSelectList.includes('전국')){
            setAllAddressCheck(true);
        }else{
            setAllAddressCheck(false);
        }
    },[addrSelectList]);


    //선호지역 삭제하기
    const addrDeltHandler = (idx) => {
        // addrSelectList 배열에서 특정 인덱스의 값을 삭제하고 새로운 배열을 생성
        const updatedList = addrSelectList.filter((_, index) => index !== idx);

        // addrSelectList 상태를 새로운 배열로 업데이트
        setAddrSelectList(updatedList);
    };


    //소개팅 신청하기
    const submit = (values) => {
        const tel = values.tel.replace(/[^0-9]/g, '');

        if(!values.name){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'이름을 입력해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }else if(!values.year){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'출생연도를 선택해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }else if(!allAddressCheck && addrSelectList.length < 3){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'지역은 최소 3개를 선택해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }else if(!tel || tel.length < 11){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'연락처를 입력해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }else if(!values.gender){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'성별을 선택해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }else if(!isAllChecked){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'모든약관에 동의해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }else{
            let addr = addrSelectList;
            if(allAddressCheck){
                addr = ['전지역'];
            }

            const body = {
                name: values.name,
                year: values.year,
                gender: values.gender,
                address1: addr,
                tel: tel,
                idx: apply_idx
            };

            axios.post(`${date_apply}`,body)
            .then((res)=>{
                if(res.status === 200){
                    dispatch(confirmPop({
                        confirmPop:true,
                        confirmPopTit:'알림',
                        confirmPopTxt:'소개팅신청이 완료되었습니다.',
                        confirmPopBtn:1,
                    }));
                    setSubmitConfirm(true);
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
    

    //후기팝업 열기
    const storyPopOpen = (idx) => {
        if(windowWidth < 768){
            dispatch(storyPop({storyPop:true,storyPopNo:idx}));
        }
    };


    //약관동의
    const agreeHandler = (checked, value) => {
        if (checked) {
            setCheckedItems([...checkedItems, value]);
        } else if (!checked && checkedItems.includes(value)) {
            setCheckedItems(checkedItems.filter((el) => el !== value));
        }
    }


    //약관동의 다하면 전체약관동의 체크박스 체크됨
    useEffect(() => {
        if (checkedItems.length == 2) {
            setIsAllChecked(true)
        } else {
            setIsAllChecked(false)
        }
        dispatch(termsCheckList(checkedItems));
    }, [checkedItems]);


    useEffect(()=>{
        setCheckedItems(popup.termsCheckList);
    },[popup.termsCheckList]);



    return(<>
        <div className="select_apply">
            <div className="header">
                <div className="inner">
                    <h1><img src={logo} alt="로고"/></h1>
                    <ul className="nav">
                        <li><a href="#main" className={navOn === 0 ? "on" : ""}>BJ 츄정 영상</a></li>
                        <li><a href="#sect4" className={navOn === 4 ? "on" : ""}>사소한 시스템</a></li>
                        <li><a href="#sect5" className={navOn === 5 ? "on" : ""}>후기 보기</a></li>
                    </ul>
                </div>
            </div>
            <div className="select_apply_wrap">
                <div className="inner" id="main">
                    <div className="cont_box">
                        <div className="main_video">
                            <div className="video_box">
                                <iframe width="100%" height="100%" 
                                src="https://www.youtube.com/embed/E96BX2Dm4qg?si=9lFR_NF5qtQ-5l2e&autoplay=1&mute=1&controls=1" 
                                title="YouTube video player" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                referrerpolicy="strict-origin-when-cross-origin" 
                                allowfullscreen></iframe>
                            </div>
                            {/* <div className="txt_box">
                                <p>BJ 츄정도 설렜다는 출시 10년차, <strong>외모 상위 1% 이성 선택 서비스</strong></p>
                                <h4>BJ 츄정, <br/>1% 회원으로 선택받다!</h4>
                            </div>
                            <button type="button" className={`btn_sound${videoSound ? ' on' : ''}`} onClick={videoToggleSound}>소리버튼</button>
                            <button type="button" className={`btn_play${videoPlay ? '' : ' pause'}`} onClick={()=>setVideoPlay(!videoPlay)}>{videoPlay ? '정지' : '재생'}</button> */}
                            <div className="link_box">
                                <a href="#form_box"><span>서비스 신청하기</span><span className="arrow"><img src={arrow_right} alt="화살표아이콘"/><img src={arrow_right} alt="화살표아이콘"/></span></a>
                            </div>
                        </div>
                        <div className={`sect sect1${sect1On ? ' on' : ''}`} ref={sect1Ref}>
                            <ul className="txt_box">
                                <li>
                                    <h5>나의 소개팅 상대는</h5>
                                    <div><h5>무조건</h5><img src={sect1_txt} alt="외모"/></div>
                                    <p>가 뛰어나야 된다.</p>
                                </li>
                                <li>
                                    <img src={sect1_img_mo} alt="회원이미지"/>
                                    <h6>나의 선택으로 시작되는 <br/>3박 4일 연애 프로그램</h6>
                                    <p>나의 외모? 집? 차? 연봉? NO NO NO! <br/>아무 조건 없이! <br/>내가 택한 외모 상위 1% 상대와의 연결</p>
                                </li>
                            </ul>
                            <div className="img_box">
                                <img src={sect1_img} alt="회원이미지"/>
                            </div>
                        </div>
                        <div className={`sect sect2${sect2On ? ' on' : ''}`} ref={sect2Ref}>
                            <div className="txt_box">
                                <h4 className="top_tit"><strong>1% 회원의 </strong><span>평균 외모</span></h4>
                                <h5>아래 인물들은<strong>사소한의 공식모델</strong>입니다.</h5>
                                <p>해당 모델은 1% 회원들의 외모 수준과 동일합니다.</p>
                                <h6>오직! <span>선택 회원</span> <strong>만이 1% 외모의 회원을 택할 수 있습니다.</strong></h6>
                            </div>
                            <div className="slider">
                                <ul className="img_ul flex">
                                    {memberList.map((_, i) => (
                                        <li key={i} className={memberSliderActive === i ? 'on' : ''}
                                            onClick={()=>{
                                                if (memberSwiperRef.current && memberSwiperRef.current.swiper) {
                                                    memberSwiperRef.current.swiper.slideToLoop(i);
                                                }
                                            }}
                                        >
                                            <img src={memberImgs[i]} alt="회원이미지" />
                                        </li>
                                    ))}
                                </ul>
                                <Swiper
                                    ref={memberSwiperRef}
                                    initialSlide={0}
                                    className="member_slider"
                                    slidesPerView={1}
                                    spaceBetween={0}
                                    observer={true}
                                    observeParents={true}
                                    loop={true}
                                    autoplay={{
                                        delay: 5000,
                                        disableOnInteraction: false,
                                    }}
                                    navigation={{nextEl: ".sect2 .slider .swiper-button-next",prevEl: ".sect2 .slider .swiper-button-prev"}}
                                    onSlideChange={(e)=>{
                                        const idx = e.realIndex;
                                        setMemberSliderActive(idx);
                                    }}
                                    modules={[Navigation, Autoplay]}
                                >
                                    {memberList.map((_, index) => (
                                        <SwiperSlide key={index}>
                                            <img src={memberImgs[index]} alt="회원이미지" />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <div className="btn_box flex_center">
                                    <div className="swiper-button-prev"></div>
                                    <div className="swiper-button-next"></div>
                                </div>
                            </div>
                        </div>
                        <div className={`sect sect3${sect3On ? ' on' : ''}`} ref={sect3Ref}>
                            <div className="box">
                                <p>신청과 동시에 당신은 선택 회원으로서</p>
                                <h6>설레는 연애 프로그램을 시작합니다.</h6>
                            </div>
                            <img src={sect3_img} alt="회원이미지"/>
                        </div>
                        <div className={`sect sect4${sect4On ? ' on' : ''}`} id="sect4" ref={sect4Ref}>
                            <div className="txt_box">
                                <h4 className="top_tit"><strong>믿을 수 있는 </strong><span>사소한 시스템</span></h4>
                                <h6>서비스 사소한 1%는 <strong>위법 행위 근절</strong>에 힘쓰고 있습니다.</h6>
                                <p>또한, 회원님들의 안전한 개인정보 보호를 위한 개인정보 교육을 수료하였으며, <br/>자발적인 비용을 지불하여 법률자문을 받음으로써 <br/>많은 신뢰와 사랑을 받고 있습니다.</p>
                                <div className="btn_box flex flex_between">
                                    <p className="txt">{authrList[authSliderActive]}</p>
                                    <div className="flex_between">
                                        <div className="swiper-button-prev"></div>
                                        <div className="swiper-pagination"></div>
                                        <div className="swiper-button-next"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="slider">
                                <Swiper
                                    ref={authSwiperRef}
                                    initialSlide={0}
                                    className="auth_slider"
                                    slidesPerView={1}
                                    spaceBetween={0}
                                    observer={true}
                                    observeParents={true}
                                    loop={true}
                                    effect="fade"
                                    navigation={{nextEl: ".sect4 .btn_box .swiper-button-next",prevEl: ".sect4 .btn_box .swiper-button-prev"}}
                                    pagination={{
                                        type: 'fraction',
                                        el: '.sect4 .btn_box .swiper-pagination',
                                    }}
                                    onSlideChange={(e)=>{
                                        const idx = e.realIndex;
                                        setauthSliderActive(idx);
                                    }}
                                    modules={[Navigation, Pagination, EffectFade]}
                                >
                                    {authrList.map((_, index) => (
                                        <SwiperSlide key={index}>
                                            <img src={authImgs[index]} alt="인증서이미지" />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                            <div className="mo_txt">{authrList[authSliderActive]}</div>
                        </div>
                        <div className={`sect sect5${sect5On ? ' on' : ''}`} id="sect5" ref={sect5Ref}>
                            <div className="tit_box flex">
                                <h4 className="top_tit"><strong>사소한 1% </strong><span>실제 후기</span></h4>
                                <div>
                                    <h5>진실된 후기로 증명해 드립니다.</h5>
                                    <p>만남이 이루어진 설레는 순간들을 지금 바로 확인하세요!</p>
                                </div>
                            </div>
                            <div className="slider">
                                <Swiper
                                    ref={reviewSwiperRef}
                                    initialSlide={0}
                                    className="review_slider"
                                    slidesPerView={1}
                                    spaceBetween={0}
                                    slidesPerGroup={1}
                                    observer={true}
                                    observeParents={true}
                                    loop={true}
                                    navigation={{nextEl: ".sect5 .btn_box .swiper-button-next",prevEl: ".sect5 .btn_box .swiper-button-prev"}}
                                    pagination={{
                                        type: 'fraction',
                                        el: '.sect5 .btn_box .swiper-pagination',
                                    }}
                                    breakpoints={
                                        {
                                            1200:{slidesPerView:'auto',spaceBetween:12},//width >= 1200
                                        }
                                    }
                                    modules={[Navigation, Pagination]}
                                >
                                    {reviewList.map((cont, i) => (
                                        <SwiperSlide key={i} onClick={()=>{storyPopOpen(i)}}>
                                            <div className="img_box"><img src={cont.photo} alt="후기이미지"/></div>
                                            <div className="txt_box">
                                                <div>
                                                    <h5>{cont.subject}</h5>
                                                    <p>{cont.subject}</p>
                                                </div>
                                                <button type="button" className="btn_more"
                                                    onClick={()=>{
                                                        dispatch(storyPop({storyPop:true,storyPopNo:i}));
                                                    }}
                                                ><span>더보기</span><img src={arrow_more} alt="화살표"/></button>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <div className="btn_box flex flex_between">
                                    <div className="swiper-button-prev"></div>
                                    <div className="swiper-pagination"></div>
                                    <div className="swiper-button-next"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form_box" id="form_box">
                        <div className="box">
                            <p className="tit"><strong>선택회원</strong> 간편 신청</p>
                            <img src={form_heart_img} alt="이미지" className="heart_img"/>
                            <Formik
                                initialValues={{
                                    name: "",
                                    year: "",
                                    gender: "",
                                    address1: "",
                                    address2: "",
                                    tel: "",
                                }}
                            >
                                {({values, handleChange, handleBlur, errors, touched, setFieldValue}) => (
                                    <form>
                                        <ul className="form_ul">
                                            <li>
                                                <p>이름</p>
                                                <div className="input_box5">
                                                    <input type={`text`} placeholder="이름을 입력해 주세요." name="name" value={values.name} onChange={handleChange} />
                                                </div>
                                            </li>
                                            <li>
                                                <p>출생연도</p>
                                                <div className="input_box5">
                                                    <select 
                                                        name="year"
                                                        value={values.year}
                                                        onChange={(e)=>{
                                                            handleChange(e);
                                                            setYearSelected(true);
                                                        }}
                                                        className={yearSelected ? "selected" : ""}
                                                    >
                                                        <option value='' hidden>출생연도를 선택해 주세요.</option>
                                                        {yearList.map((cont,i)=>{
                                                            return(
                                                                <option value={cont} key={i}>{cont} 년생</option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                            </li>
                                            <li className="addr_select_li bp0">
                                                <p>현재 <strong>선호지역</strong>을 선택해주세요! (택3)</p>
                                                <div>
                                                    <div className="address_box flex_between">
                                                        <div className="input_box5">
                                                            <select 
                                                                name="address1" 
                                                                value={values.address1} 
                                                                onChange={(e)=>{
                                                                    const code = e.target.options[e.target.selectedIndex].getAttribute("data-code");
                                                                    handleChange(e);
                                                                    setAddrSelected(true);
                                                                    getAddress2(code);

                                                                    setFieldValue("address2","");

                                                                    const val = e.currentTarget.value;
                                                                    if(val == "세종특별자치시" && !addrSelectList.includes("세종")){
                                                                        if(addrSelectList.includes("전국")){
                                                                            const updatedList = [...addrSelectList];
                                                                                updatedList.pop('전국');
                                                                                updatedList.push("세종");
                                                                            setAddrSelectList(updatedList);
                                                                        }else{
                                                                            if(addrSelectList.length > 9){
                                                                                dispatch(confirmPop({
                                                                                    confirmPop:true,
                                                                                    confirmPopTit:'알림',
                                                                                    confirmPopTxt:'선호지역은 최대 10개까지만 선택해주세요.',
                                                                                    confirmPopBtn:1,
                                                                                }));
                                                                                setConfirm(true);
                                                                            }else{
                                                                                const updatedList = [...addrSelectList];
                                                                                    updatedList.push("세종");
                                                                                setAddrSelectList(updatedList);
                                                                            }
                                                                        }
                                                                    }

                                                                    if(val == "전국"){
                                                                        dispatch(confirmPop({
                                                                            confirmPop:true,
                                                                            confirmPopTit:'알림',
                                                                            confirmPopTxt:'전국 선택시 다른지역은 선택불가합니다.',
                                                                            confirmPopBtn:1,
                                                                        }));
                                                                        setConfirm(true);

                                                                        const updatedList = ["전국"];
                                                                        setAddrSelectList(updatedList);
                                                                    }
                                                                }}
                                                                className={addrSelected ? "selected" : ""}
                                                            >
                                                                <option value='' hidden disabled>시/도</option>
                                                                <option value="전국">전국</option>
                                                                {addressList.map((cont, i)=>{
                                                                    return(
                                                                        <option value={cont.sido_gugun} key={i} data-code={cont.local_code}>{cont.sido_gugun}</option>
                                                                    );
                                                                })}
                                                            </select>
                                                        </div>
                                                        <div className="input_box5">
                                                            <select 
                                                                name="address2" 
                                                                value={values.address2} 
                                                                onChange={(e)=>{
                                                                    handleChange(e);
                                                                    setAddr2Selected(true);

                                                                    const val = e.currentTarget.value;

                                                                    let address1_txt = values.address1;
                                                                    if(address1_txt === "강원도"){
                                                                        address1_txt = "강원";
                                                                    }
                                                                    if(address1_txt === "경기도"){
                                                                        address1_txt = "경기";
                                                                    }
                                                                    if(address1_txt === "경상남도"){
                                                                        address1_txt = "경남";
                                                                    }
                                                                    if(address1_txt === "경상북도"){
                                                                        address1_txt = "경북";
                                                                    }
                                                                    if(address1_txt === "전라남도"){
                                                                        address1_txt = "전남";
                                                                    }
                                                                    if(address1_txt === "전라북도"){
                                                                        address1_txt = "전북";
                                                                    }
                                                                    if(address1_txt === "충청남도"){
                                                                        address1_txt = "충남";
                                                                    }
                                                                    if(address1_txt === "충청북도"){
                                                                        address1_txt = "충북";
                                                                    }
                                                                    if(address1_txt.includes("광역시")){
                                                                        address1_txt = address1_txt.replace("광역시","");
                                                                    }
                                                                    if(address1_txt.includes("특별시")){
                                                                        address1_txt = address1_txt.replace("특별시","");
                                                                    }
                                                                    if(address1_txt.includes("특별자치시")){
                                                                        address1_txt = address1_txt.replace("특별자치시","");
                                                                    }
                                                                    if(address1_txt.includes("특별자치도")){
                                                                        address1_txt = address1_txt.replace("특별자치도","");
                                                                    }

                                                                    if(val.length > 0){
                                                                        if(addrSelectList.length > 9){
                                                                            dispatch(confirmPop({
                                                                                confirmPop:true,
                                                                                confirmPopTit:'알림',
                                                                                confirmPopTxt:'선호지역은 최대 10개까지만 선택해주세요.',
                                                                                confirmPopBtn:1,
                                                                            }));
                                                                            setConfirm(true);
                                                                        }else{
                                                                            let updatedList = [...addrSelectList];
                                                                            const txt = address1_txt + " " + val;

                                                                            if(addrSelectList.includes('전국')){
                                                                                updatedList.pop('전국');
                                                                            }
                                                                            if(!addrSelectList.includes(txt)){
                                                                                updatedList.push(txt);
                                                                                setAddrSelectList(updatedList);
                                                                            }
                                                                            
                                                                        }
                                                                    }  
                                                                }}
                                                                className={addr2Selected ? "selected" : ""}
                                                            >
                                                                <option value='' hidden disabled>구</option>
                                                                {addressList2.map((cont, i)=>{
                                                                    return(
                                                                        <option value={cont.sido_gugun} key={i}>{cont.sido_gugun}</option>
                                                                    );
                                                                })}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="addr_li">
                                                <div className="addr_list_box">
                                                    <ul className="flex_wrap">
                                                        {addrSelectList.map((cont,i)=>{
                                                            return(
                                                                <li key={i}><span>{cont}</span><button type="button" className="btn_delt" onClick={()=>{addrDeltHandler(i)}}>삭제버튼</button></li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>
                                            </li>
                                            <li>
                                                <p>연락처</p>
                                                <div className="input_box5">
                                                    <PatternFormat format="###-####-####" name="tel" value={values.tel} onChange={handleChange} placeholder="연락처를 입력해주세요." />
                                                </div>
                                            </li>
                                            <li>
                                                <p>성별</p>
                                                <ul className="gender_ul flex_between">
                                                    <li>
                                                        <label>
                                                            <input type={`radio`} name="gender"
                                                                onChange={()=>{
                                                                    setFieldValue("gender","1");
                                                                }} 
                                                            />
                                                            <div className="box">
                                                                <img src={ic_male} alt="남성"/>
                                                                <span>남성</span>
                                                            </div>
                                                        </label>
                                                    </li>
                                                    <li>
                                                        <label>
                                                            <input type={`radio`} name="gender" 
                                                                onChange={()=>{
                                                                    setFieldValue("gender","2");
                                                                }}
                                                            />
                                                            <div className="box">
                                                                <img src={ic_female} alt="여성"/>
                                                                <span>여성</span>
                                                            </div>
                                                        </label>
                                                    </li>
                                                </ul>
                                            </li> 
                                        </ul>
                                        <div className="agree_box">
                                            <div className="custom_check3">
                                                <label>
                                                    <input type={`checkbox`} 
                                                        onChange={(e)=>{
                                                            agreeHandler(e.currentTarget.checked, e.currentTarget.id);
                                                        }} 
                                                        checked={checkedItems.includes('terms5') ? true : false}
                                                        id="terms5"
                                                    />
                                                    <span className="check">체크박스</span>
                                                    <p className="txt" onClick={()=>{dispatch(termsPop({termsPop:true, termsPopIdx:5}))}}><span>이용약관</span> 및 <span>개인정보 처리방침</span>에 동의합니다.</p>
                                                </label>
                                            </div>
                                            <div className="custom_check3">
                                                <label>
                                                    <input type={`checkbox`}
                                                        onChange={(e)=>{
                                                            agreeHandler(e.currentTarget.checked, e.currentTarget.id);
                                                        }} 
                                                        checked={checkedItems.includes('terms6') ? true : false}
                                                        id="terms6"
                                                    />
                                                    <span className="check">체크박스</span>
                                                    <p className="txt" onClick={()=>{dispatch(termsPop({termsPop:true, termsPopIdx:6}))}}><span>광고성 메시지 수신</span>에 동의합니다.</p>
                                                </label>
                                            </div>
                                            <div className="scroll_wrap">
                                                <div className="txt">{terms.contents_p}</div>
                                            </div>
                                        </div>
                                        <button type="button" className="btn_apply" 
                                            onClick={()=>{
                                                submit(values);
                                            }}
                                        >신청서 제출</button>
                                    </form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer">
                <div className="terms_box">
                    <ul className="inner flex">
                        <li><button type="button" onClick={()=>{dispatch(policyPop({policyPop:true, policyPopIdx:1}))}}>개인정보보호정책</button></li>
                        <li><button type="button" onClick={()=>{dispatch(policyPop({policyPop:true, policyPopIdx:3}))}}>개인정보수집</button></li>
                        <li><button type="button" onClick={()=>{dispatch(policyPop({policyPop:true, policyPopIdx:4}))}}>이용약관</button></li>
                    </ul>
                </div>
                <div className="bottom_box">
                    <div className="inner">
                        <div className="logo"><img src={logo} alt="로고" /></div>
                        <ul className="flex">
                            {info && info.site_address && <li>주소 : {info.site_address}</li>}
                            <li>개인정보책임관리자 및 대표 : 서정승</li>
                        </ul>
                        <ul className="flex">
                            {info && info.site_num && <li>사업자 번호 : {info.site_num}</li>}
                            <li>연락처 : 070-4355-6751</li>
                        </ul>
                        <div className="copy">COPYRIGHT© 2023 사소한 ALL RIGHTS RESERVED.</div>
                    </div> 
                    <div className="sns_box">
                        <p>SNS</p>
                        <ul className="flex">
                            <li><a href="https://www.youtube.com/@user-sasohan" target={'_blank'}>유튜브</a></li> 
                            <li><a href="https://www.instagram.com/sasohan1percent_official/" target={'_blank'}>인스타그램</a></li>
                            <li><a href="https://www.facebook.com/people/%EC%82%AC%EC%86%8C%ED%95%9C-1/61565280974906/" target={'_blank'}>페이스북</a></li>
                            <li><a href="https://www.tiktok.com/@sasohan_1" target={'_blank'}>틱톡</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}

        {/* 신청 완료 confirm팝업 */}
        {submitConfirm && <ConfirmPop closePop="custom" onCloseHandler={()=>window.location.reload()} />}
    </>);
};

export default SelectMember;