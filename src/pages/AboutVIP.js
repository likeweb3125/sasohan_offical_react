import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
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
import { confirmPop, vipApplyPop, applyPop } from "../store/popupSlice";
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


const AboutVIP = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const user = useSelector((state)=>state.user);
    const vip_list = enum_api_uri.vip_list;
    const [confirm, setConfirm] = useState(false);
    const sect1Ref = useRef(null);
    const sect2Ref = useRef(null);
    const sect3Ref = useRef(null);
    const sect4Ref = useRef(null);
    const sect5Ref = useRef(null);
    const vipSliderRef = useRef();
    const [sect1On, setSect1On] = useState(false);
    const [sect2On, setSect2On] = useState(false);
    const [sect3On, setSect3On] = useState(false);
    const [sect4On, setSect4On] = useState(false);
    const [sect5On, setSect5On] = useState(false);
    const [vipList, setVipList] = useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [vipSwiperKey, setVipSwiperKey] = useState(0); // Swiper의 key를 상태로 관리


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


    
    

    return(<> 
        <div className="about_vip_wrap">
            <div className="main_visual">
                <div className="cont4">
                    <div className="txt_box">
                        <img src={main_txt_img} alt="vip 소개팅" />
                        <p className="txt">사소한 VIP 소개팅 서비스는 <br/><strong>결제 회원님과 VIP 회원님</strong><br/>으로 구성되어 있습니다. </p>
                        <p className="txt2">두 유형의 회원님들은 매니저의 매칭을 통해 서로 소개팅을 주선받습니다. <br/><br/>
                            결제 회원은 매칭에 비용을 투자하여 <br/ >
                            자신이 원하는 VIP회원을 선택, 소개를 받는 권리를 갖게 됩니다.<br/>
                            반면, VIP 회원은 자신의 매력을 인정받아 소개팅 시 매너베이트를 전달받는 혜택을 누리게 됩니다.</p>
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
                    <p>사소한만의 <strong>VIP회원</strong></p>
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
                                            {/* <p>실제 사소한 VIP 회원입니다.</p> */}
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
                        <div className="txt">위 프로필은 실제 사소한을 이용하고 있는 VIP 회원으로, <br/>회원님들의 동의하에 사소한의 VIP 회원 모델로 게시하고 있습니다.</div>
                        <div className="txt_box">
                            <div className="line"></div>
                            <div className="mo_none"><img src={vip_sect2_txt_img} alt="vip 소개팅" /></div>
                            <div className="mo_show">
                                <div className="bp10"><img src={vip_sect2_txt_img_mo} alt="상위 5%" /></div>
                                <p><strong>VIP 회원과의 만남,</strong><br/>사소한에선 가능합니다!</p>
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
                        <p className="txt">VIP 소개팅의 장점</p>
                        <p className="txt2">우리 VIP 회원님들은 직관적 평가 99.9%<br/><strong>“아름답습니다!”,  “잘생겼습니다!” </strong><br/>외적인 매력이 "상위 5%"입니다.</p>
                        <p className="txt3">단순하지만 비용을 지불하는 소개팅에 있어 본질적으로 최고의 장점입니다.<br/>
                            그간 비용을 지불하는 소개팅에서 원하지 않는 상대와의 매칭을 강요당한 경험이 있으신가요?<br/>
                            돈을 내는 소개팅에서는 최소한 <br/>
                            <span>자신이 원하는 상대를 받을 권리와 기회는 보장이 되어야 한다고 생각합니다.</span><br/>
                            그렇기에 사소한 VIP 소개팅은 최대한 이상형에 가까운 VIP 회원님들을 보여드립니다.<br/><br/>
                            그리고 만약 그 VIP 회원님을 당신이 선택 한다면, <br/><br/>
                            언제라도 소개 테이블로 모셔와 두 분이 소개팅을 진행할 수 있는 서비스를 제공해 드리고 있습니다.<br/>
                            사소한은 지난 10년의 노하우로 그것을 가능케 하는 능력이 있습니다.</p>
                        <p className="txt4">사소한 VIP 소개팅은 당신의 이상형에 대한 권리와 기회를 보장해 드리겠습니다!</p>
                    </div>
                </div>
            </div>

            <div className={`vip_sect vip_sect4 ${sect4On ? "on" : ""}`} ref={sect4Ref}>
                <div className="cont4">
                    <div className="vip_apply_cont">
                        <div className="txt_box flex_top">
                            <p className="tit">결제 회원이란?</p>
                            <div>
                                <p className="txt"><strong>결제 회원님</strong>은 소개팅 과정을 주도하는 회원님입니다.</p>
                                <p className="txt2">비용을 지불하고 VIP 회원님 중 마음에 드는 상대를 선택하여 매칭을 요청하실 수 있습니다. <br/>결제 회원님은 바쁜 일상에서 이성을 찾는 시간을 크게 절약하며 본인의 취향에 딱 맞는 이상형을 찾는 장점이 있습니다.</p>
                            </div>
                        </div>
                        <div className="box tx_c">
                            <p className="txt"><strong>결제회원님</strong>은 아래와 같은 서비스가 제공되고 있어요!</p>
                            <ul className="img_ul flex_between flex_wrap">
                                <li>
                                    <div><img src={vip_sect4_img1} alt="이미지" /></div>
                                    <p>선택한 VIP와 <br/>확정적 소개팅 가능</p>
                                </li>
                                <li>
                                    <div><img src={vip_sect4_img2} alt="이미지" /></div>
                                    <p>4박 5일 <br/>소개팅 보장</p>
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
                                <button type="button" onClick={()=>dispatch(applyPop(true))}>소개팅을 신청해 보세요!</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`vip_sect vip_sect5 ${sect5On ? "on" : ""}`} ref={sect5Ref}>
                <div className="cont4">
                    <div className="vip_apply_cont">
                        <div className="txt_box flex_top">
                            <p className="tit">VIP 회원이란?</p>
                            <div>
                                <p className="txt"><strong>VIP 회원님</strong>은 이성에게 어필되는 매력이 상위 5%안에 드는 회원으로</p>
                                <p className="txt2">사이트모집, 스카웃, 추천 등을 통하여 선발 모집합니다. <br/>사소한 소개팅의 VIP 회원은 특별한 매력을 인정받은 선별된 회원입니다.</p>
                            </div>
                        </div>
                        <div className="box tx_c">
                            <p className="txt"><strong>VIP회원님</strong> 선정으로 아래와 같은 혜택을 받아보세요!</p>
                            <ul className="img_ul flex_between flex_wrap">
                                <li>
                                    <div><img src={vip_sect5_img1} alt="이미지" /></div>
                                    <p>소개팅 진행 시 결제 회원님께서 <br/>1만 원의 매너베이트 전달</p>
                                </li>
                                <li>
                                    <div><img src={vip_sect5_img2} alt="이미지" /></div>
                                    <p>VIP회원으로 선정 시 <br/>20만원 상당의 특전 제공</p>
                                </li>
                                <li>
                                    <div><img src={vip_sect5_img3} alt="이미지" /></div>
                                    <p>전담 매니저가 배정되어 <br/>소개팅 스케줄 조정</p>
                                </li>
                                <li>
                                    <div><img src={vip_sect5_img4} alt="이미지" /></div>
                                    <p>VIP 추천 시<br/>챠밍쉐어링 특전 제공</p>
                                </li>
                            </ul>
                            <div className="btn_box">
                                <button type="button" onClick={()=>dispatch(vipApplyPop(true))}>VIP 지원해 보세요!</button>
                            </div>
                        </div>
                    </div>
                    <div className="gray_box">
                        <p className="txt">아래의 사유 해당 시 VIP 회원은 취소됩니다.</p>
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