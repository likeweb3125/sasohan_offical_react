import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Scrollbar, Navigation, Grid } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import 'swiper/css/grid';
import axios from "axios";
import * as CF from "../config/function";
import { enum_api_uri } from "../config/enum";
import { confirmPop, vipApplyPop, applyPop, imgPop, imgPopLink } from "../store/popupSlice";
import { aboutVipScroll } from "../store/commonSlice";
import ConfirmPop from "../components/popup/ConfirmPop";
import main_txt_img from "../images/about_vip_main_txt.png";
import main_img from "../images/about_vip_main_img.png";
import vip_txt_img from "../images/sasohan_vip_txt.png";
import vip_sect2_txt_img from "../images/vip_sect2_txt_img.png";
import vip_sect2_txt_img_mo from "../images/vip_sect2_txt_img_mo.svg";
import vip_sect2_img from "../images/vip_sect2_img.png";
import sasohan_vip_txt2 from "../images/sasohan_vip_txt2.svg";
import vip_sect4_img1 from "../images/vip_sect4_img1.png";
import vip_sect4_img2 from "../images/vip_sect4_img2.png";
import vip_sect4_img3 from "../images/vip_sect4_img3.png";
import vip_sect4_img4 from "../images/vip_sect4_img4.png";
import vip_sect5_img1 from "../images/vip_sect5_img1.png";
import vip_sect5_img2 from "../images/vip_sect5_img2.png";
import vip_sect5_img3 from "../images/vip_sect5_img3.png";
import vip_sect5_img4 from "../images/vip_sect5_img4.png";
import about_img3 from "../images/about_img3.svg";
import about_img4 from "../images/about_img4.svg";
import about_img5 from "../images/about_img5.svg";
import dona_img1 from "../images/dona_img1.jpg";
import dona_img2 from "../images/dona_img2.jpg";
import dona_img3 from "../images/dona_img3.jpg";
import none_img from "../images/none_img.jpg";


const AboutVIP = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const popup = useSelector((state)=>state.popup);
    const user = useSelector((state)=>state.user);
    const common = useSelector((state)=>state.common);
    const vip_list = enum_api_uri.vip_list;
    const story_list = enum_api_uri.story_list;
    const license_list = enum_api_uri.license_list;
    const [confirm, setConfirm] = useState(false);
    const sect1Ref = useRef(null);
    const sect2Ref = useRef(null);
    const sect3Ref = useRef(null);
    const sect3_2Ref = useRef(null);
    const sect3_3Ref = useRef(null);
    const sect3_4Ref = useRef(null);
    const sect3_5Ref = useRef(null);
    const sect4Ref = useRef(null);
    const sect5Ref = useRef(null);
    const vipSliderRef = useRef();
    const [sect1On, setSect1On] = useState(false);
    const [sect2On, setSect2On] = useState(false);
    const [sect3On, setSect3On] = useState(false);
    const [sect3_2On, setSect3_2On] = useState(false);
    const [sect3_3On, setSect3_3On] = useState(false);
    const [sect3_4On, setSect3_4On] = useState(false);
    const [sect3_5On, setSect3_5On] = useState(false);
    const [sect4On, setSect4On] = useState(false);
    const [sect5On, setSect5On] = useState(false);
    const [vipList, setVipList] = useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [vipSwiperKey, setVipSwiperKey] = useState(0); // Swiper의 key를 상태로 관리
    const aboutTabList = ["금액","프로그램","환불"];
    const [aboutTab, setAboutTab] = useState(0);
    const [externalSliderActive,setExternalSliderActive] = useState(0);
    const [paperSliderActive,setPaperSliderActive] = useState(0);
    const [donaSliderActive, setDonaSliderActive] = useState(1);
    const [trustList, setTrustList] = useState([]);
    const [trustList2, setTrustList2] = useState([]);
    const trustSwiper = useRef();
    const trustSwiper2 = useRef();

    
    // Google tag
    useEffect(()=>{
        // Google Analytics 초기화
        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'AW-16615963599');
    },[]);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);


    //스크롤시 section on
    const scrollSectOn = () => {
        const scroll = window.scrollY;
        const sections = [
            { ref: sect1Ref, onSet: setSect1On },
            { ref: sect2Ref, onSet: setSect2On },
            { ref: sect3Ref, onSet: setSect3On },
            { ref: sect3_2Ref, onSet: setSect3_2On },
            { ref: sect3_3Ref, onSet: setSect3_3On },
            { ref: sect3_4Ref, onSet: setSect3_4On },
            { ref: sect3_5Ref, onSet: setSect3_5On },
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
        getVipList();
        getTrustList();

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


    useEffect(() => {
        // key 값을 변경하여 Swiper를 새로고침
        setVipSwiperKey(prevKey => prevKey + 1);
    }, [windowWidth]);


    //VIP 회원리스트 가져오기
    const getVipList = () => {
        axios.get(`${vip_list}`,
            {headers:{Authorization: `Bearer ${user.userToken}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                const data = res.data;
                setVipList(data);
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


    //헤더,푸터 소개팅신청,VIP지원 버튼클릭시 해당섹션으로 스크롤
    useEffect(() => {
        if (common.aboutVipScroll.length > 0) {
            const path = common.aboutVipScrollPath;
        
            setSect1On(true);
            setSect2On(true);
            setSect3On(true);
            setSect3_2On(true);
            setSect3_3On(true);
            setSect3_4On(true);
            setSect3_5On(true);
            setSect4On(true);
            setSect5On(true);
        
            const sectionId = common.aboutVipScroll;
            let time = 700;
            if (path === '/about') {
                time = 200;
            }
        
            const scrollToSection = (sectionRef) => {
                const scroll = () => {
                    if (sectionRef.current) {
                        const top = sectionRef.current.offsetTop;
                        window.scroll({
                            top: top,
                            behavior: 'smooth'
                        })
                        dispatch(aboutVipScroll({ aboutVipScroll: '', aboutVipScrollPath: '' }));
                    } else {
                        requestAnimationFrame(scroll);
                    }
                };
                scroll();
            };
        
            if (sectionId === 'vip_sect4') {
                setTimeout(() => {
                    scrollToSection(sect4Ref);
                }, time);
            }
            if (sectionId === 'vip_sect5') {
                setTimeout(() => {
                    scrollToSection(sect5Ref);
                }, time);
            }
        }
      }, [common.aboutVipScroll]);
    

    return(<> 
        <div className="about_vip_wrap">
            <div className="main_visual">
                <div className="cont4">
                    <div className="txt_box">
                        <img src={main_txt_img} alt="vip 소개팅" />
                        <p className="txt">사소한 1% 소개팅 서비스는 <br/><strong>선택 회원님과 1% 회원님</strong><br/>으로 구성되어 있습니다. </p>
                        <p className="txt2">두 유형의 회원님들은 매니저의 매칭을 통해 서로 소개팅을 주선받습니다. <br/><br/>
                            선택 회원은 매칭에 비용을 투자하여 <br/>
                            자신이 원하는 1% 회원을 선택, 소개를 받는 권리를 갖게 됩니다.<br/>
                            반면, 1% 회원은 자신의 매력을 인정받아 소개팅 시 매너베이트를 전달받는 혜택을 누리게 됩니다.</p>
                    </div>
                    <div className="img_box">
                        <img src={main_img} alt="vip 소개팅" />
                    </div>
                </div>
                <div className="scroll">
                    <strong>Scroll</strong>
                </div>
            </div>
            <div className={`vip_sect vip_sect1 ${sect1On ? "on" : ""}`} ref={sect1Ref}>
                <div className="tx_c tit">
                    <div><img src={vip_txt_img} alt="사소한 vip" /></div>
                    <p>사소한만의 <strong>1%회원</strong></p>
                </div>
                <div className="vip_slider_wrap">
                    <div className="cont4">
                        <Swiper 
                            key={vipSwiperKey} // key 속성을 변경하여 Swiper를 다시 렌더링
                            className={`vip_slider`}
                            slidesPerView={2}
                            grid={{
                                rows: 2,
                                fill: 'column'
                            }}
                            spaceBetween={10}
                            observer={true}
                            observeParents={true}
                            navigation={{nextEl: `.vip_slider_wrap .swiper-button-next`,prevEl: `.vip_slider_wrap .swiper-button-prev`}}
                            scrollbar={{draggable: true}}
                            ref={vipSliderRef}
                            modules={[Grid, Pagination, Scrollbar, Navigation]}
                            breakpoints={
                                {
                                    1420:{slidesPerView:4,spaceBetween:40},//width >= 1420
                                    1200:{slidesPerView:3,spaceBetween:40},//width >= 1200
                                    768:{slidesPerView:2,spaceBetween:40},//width >= 768
                                }
                            }
                        >
                            {vipList.map((cont,i)=>{
                                return(
                                    <SwiperSlide key={i}>
                                        <div className="img_box">
                                            <img src={cont.profile} alt="vip 회원" />
                                            {/* <p>실제 사소한 1% 회원입니다.</p> */}
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                            
                        </Swiper>
                        <div className="btn_box flex_between">
                            <div className="swiper-button-prev hover_btn"></div>
                            <div className="swiper-button-next hover_btn"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`vip_sect vip_sect2 ${sect2On ? "on" : ""}`} ref={sect2Ref}>
                <div className="cont4">
                    <div className="tx_c">
                        <div className="txt">위 프로필은 실제 사소한을 이용하고 있는 1% 회원으로, <br/>회원님들의 동의하에 사소한의 1% 회원 모델로 게시하고 있습니다.</div>
                        <div className="txt_box">
                            <div className="line"></div>
                            <div className="mo_none"><img src={vip_sect2_txt_img} alt="vip 소개팅" /></div>
                            <div className="mo_show">
                                <div className="bp10"><img src={vip_sect2_txt_img_mo} alt="상위 5%" /></div>
                                <p><strong>1% 회원과의 만남,</strong><br/>사소한에선 가능합니다!</p>
                            </div>
                        </div>
                    </div> 
                </div>
            </div>
            <div className={`vip_sect vip_sect3 ${sect3On ? "on" : ""}`} ref={sect3Ref}>
                <div className="cont4">
                    <div className="img_box">
                        <img src={vip_sect2_img} alt="이미지" />
                    </div>
                    <div className="txt_box">
                        <img src={sasohan_vip_txt2} alt="사소한 vip" />
                        <p className="txt">1% 소개팅의 장점</p>
                        <p className="txt2">우리 1% 회원님들은 직관적 평가 99.9%<br/><strong>“아름답습니다!”,  “잘생겼습니다!” </strong><br/>외적인 매력이 "상위 1%"입니다.</p>
                        <p className="txt3">단순하지만 비용을 지불하는 소개팅에 있어 본질적으로 최고의 장점입니다.<br/>
                            그간 비용을 지불하는 소개팅에서 원하지 않는 상대와의 매칭을 강요당한 경험이 있으신가요?<br/>
                            돈을 내는 소개팅에서는 최소한 <br/>
                            <span>자신이 원하는 상대를 받을 권리와 기회는 보장이 되어야 한다고 생각합니다.</span><br/>
                            그렇기에 사소한 1% 소개팅은 최대한 이상형에 가까운 1% 회원님들을 보여드립니다.<br/><br/>
                            그리고 만약 그 1% 회원님을 당신이 선택 한다면, <br/><br/>
                            언제라도 소개 테이블로 모셔와 두 분이 소개팅을 진행할 수 있는 서비스를 제공해 드리고 있습니다.<br/>
                            사소한은 지난 10년의 노하우로 그것을 가능케 하는 능력이 있습니다.</p>
                        <p className="txt4">사소한 1% 소개팅은 당신의 이상형에 대한 권리와 기회를 보장해 드리겠습니다!</p>
                    </div>
                </div>
            </div>
            <div className={`vip_sect vip_sect3_2 ${sect3_2On ? "on" : ""}`} ref={sect3_2Ref}>
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
                                <li className={aboutTab === 1 ? "on" : ""}>
                                    <h4>3박 4일 로맨스 프로그램</h4>
                                    <img src={about_img4} alt="일러스트이미지" />
                                    <p className="txt">사소한 소개팅은 오프라인 소개팅 서비스와는 달리, <strong>온라인 소개팅 서비스</strong>입니다.</p>
                                    <p className="txt2">사소한 소개팅 룰은 <span>3박4일 로맨스 프로그램</span>으로 <br/>
                                    두 사람이 3박 4일간 서로를 알아가고, 서로에 대한 호감이 깊어지는 설레임을 경험할 수 있는 프로그램입니다. <br/><br/>

                                    매칭이 되면 당신이 지목한 이성과, 당신을 위한 소개팅 테이블(채팅방)을 만들어드립니다. <br/>
                                    그리고 3박 4일 동안 서로를 더 알아가는 과정을 통해 참가자들은 보다 깊은 이해와 신뢰를 쌓아 갑니다. <br/><br/>

                                    또한, 3박 4일 로맨스 룰은 특별하게 상대방과 최소 한 번 이상의 통화를 필수적으로 보장하는 <span>통화 필수 보장 서비스</span>를 <br/>
                                    제공함으로써 소개팅 상대방과의 전화 통화를 중요한 원칙으로 지키고 있습니다. <br/><br/>

                                    그 후 <span>결정의 날</span>이 찾아오게 되면 당신은 상대방과의 운명을 확인할 수 있습니다. <br/>
                                    만약 두 사람 중 한 명이 만나지 않기로 결정하면 소개팅은 실패로 끝나 종료되지만, <br/>
                                    두 사람 모두 만남을 선택한다면 이제부터는 당신의 로맨스가 시작됩니다!</p>
                                </li>
                                <li className={aboutTab === 2 ? "on" : ""}>
                                    <h4>스마트 환불 시스템</h4>
                                    <img src={about_img5} alt="일러스트이미지" />
                                    <p className="txt"><strong>우리는 고객님의 만족을 최우선으로 생각합니다.</strong></p>
                                    <p className="txt2">만약 불만족스러운 상황이 발생할 경우, 저희는 고객님께서 결제한 금액 중 일부를 빠르고 간편하게 환불해드립니다. <br/>
                                    이는 사소한 소개팅이 자랑하는 스마트 환불 시스템이며 소개팅 서비스는 인간의 감정과 마음이 언제든 변할 수 있다는 <br/>
                                    특성을 고려하여 유연한 체계를 갖추어야 한다고 생각합니다. <br/>
                                    하여서, 고객님의 단순 변심일지언정 <span>고객님이 원할 때 언제든지 환불이 가능</span>합니다. <br/><br/>

                                    <span>스마트 환불 시스템의 체계는 아래와 같습니다. <br/>
                                    결제 당일 환불 : 80% <br/>
                                    소개팅 2일차 : 50% <br/>
                                    소개팅 3일차 : 20% <br/>
                                    결정의 날 : 환불 불가 </span><br/><br/>

                                    소개팅 서비스는 안심하고 이용할 수 있는 서비스입니다. <br/>
                                    고객님의 만족을 위해 최선을 다하는 저희와 함께 <br/>
                                    안정적이고 만족스러운 소개팅 경험을 누려보세요.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`vip_sect vip_sect3_3 ${sect3_3On ? "on" : ""}`} ref={sect3_3Ref}>
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
            </div>
            <div className={`vip_sect vip_sect3_4 ${sect3_4On ? "on" : ""}`} ref={sect3_4Ref}>
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
            </div>
            <div className={`vip_sect vip_sect3_5 ${sect3_5On ? "on" : ""}`} ref={sect3_5Ref}>
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
            </div>
            <div className={`vip_sect vip_sect4 ${sect4On ? "on" : ""}`} ref={sect4Ref}>
                <div className="cont4">
                    <div className="vip_apply_cont">
                        <div className="txt_box flex_top">
                            <p className="tit">선택 회원이란?</p>
                            <div>
                                <p className="txt"><strong>선택 회원님</strong>은 소개팅 과정을 주도하는 회원님입니다.</p>
                                <p className="txt2">비용을 지불하고 1% 회원님 중 마음에 드는 상대를 선택하여 매칭을 요청하실 수 있습니다. <br/>선택 회원님은 바쁜 일상에서 이성을 찾는 시간을 크게 절약하며 본인의 취향에 딱 맞는 이상형을 찾는 장점이 있습니다.</p>
                            </div>
                        </div>
                        <div className="box tx_c">
                            <p className="txt"><strong>선택회원님</strong>은 아래와 같은 서비스가 제공되고 있어요!</p>
                            <ul className="img_ul flex_between flex_wrap">
                                <li>
                                    <div><img src={vip_sect4_img1} alt="이미지" /></div>
                                    <p>선택한 1%와 <br/>확정적 소개팅 가능</p>
                                </li>
                                <li>
                                    <div><img src={vip_sect4_img2} alt="이미지" /></div>
                                    <p>3박 4일 <br/>소개팅 보장</p>
                                </li>
                                <li>
                                    <div><img src={vip_sect4_img3} alt="이미지" /></div>
                                    <p>소개팅 진행 중 <br/>상대방과 전화통화 필수 보장</p>
                                </li>
                                <li>
                                    <div><img src={vip_sect4_img4} alt="이미지" /></div>
                                    <p>만남 성공을 위한 종합 서포터 <br/>챠밍매니저 배정</p>
                                </li>
                            </ul>
                            <div className="btn_box">
                                <button type="button" className="btn_click" onClick={()=>dispatch(applyPop(true))}>소개팅을 신청해 보세요!</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`vip_sect vip_sect5 ${sect5On ? "on" : ""}`} ref={sect5Ref}>
                <div className="cont4">
                    <div className="vip_apply_cont">
                        <div className="txt_box flex_top">
                            <p className="tit">1% 회원이란?</p>
                            <div>
                                <p className="txt"><strong>1% 회원님</strong>은 이성에게 어필되는 매력이 상위 1%안에 드는 회원으로</p>
                                <p className="txt2">사이트모집, 스카웃, 추천 등을 통하여 선발 모집합니다. <br/>사소한 소개팅의 1% 회원은 특별한 매력을 인정받은 선별된 회원입니다.</p>
                            </div>
                        </div>
                        <div className="box tx_c">
                            <p className="txt"><strong>1%회원님</strong> 선정으로 아래와 같은 혜택을 받아보세요!</p>
                            <ul className="img_ul flex_between flex_wrap">
                                <li>
                                    <div><img src={vip_sect5_img1} alt="이미지" /></div>
                                    <p>소개팅 진행 시 선택 회원님께서 <br/>1만 원의 매너베이트 전달</p>
                                </li>
                                <li>
                                    <div><img src={vip_sect5_img2} alt="이미지" /></div>
                                    <p>1%회원으로 선정 시 <br/>20만원 상당의 특전 제공</p>
                                </li>
                                <li>
                                    <div><img src={vip_sect5_img3} alt="이미지" /></div>
                                    <p>전담 매니저가 배정되어 <br/>소개팅 스케줄 조정</p>
                                </li>
                                <li>
                                    <div><img src={vip_sect5_img4} alt="이미지" /></div>
                                    <p>1% 추천 시<br/>챠밍쉐어링 특전 제공</p>
                                </li>
                            </ul>
                            <div className="btn_box">
                                <button type="button" className="btn_click" onClick={()=>dispatch(vipApplyPop(true))}>1% 지원해 보세요!</button>
                            </div>
                        </div>
                    </div>
                    <div className="gray_box">
                        <p className="txt">아래의 사유 해당 시 1% 회원은 취소됩니다.</p>
                        <ul className="txt_ul flex_wrap">
                            <li><strong>1. </strong>솔로, 미혼이 아닌 경우</li>
                            <li><strong>2. </strong>프로필 정보가 사실과 다를 경우</li>
                            <li><strong>3. </strong>소개팅이 꽤 진행됐음에도 실제 만남이 일어나지 않은 경우</li>
                            <li><strong>4. </strong>진중한 목적이 아닌 혜택만이 목적일 경우</li>
                            <li><strong>5. </strong>매니저에게 대가성으로 추가 금액을 받은 경우</li>
                            <li><strong>6. </strong>그 외 "매너베이트" 이외의 금액을 편취한 경우</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default AboutVIP;