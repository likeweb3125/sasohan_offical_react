import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Formik } from "formik";
import { PatternFormat } from "react-number-format";
import { useDropzone } from 'react-dropzone';
import * as CF from "../../config/function";
import { enum_api_uri } from "../../config/enum";
import { confirmPop, termsPop, termsCheckList } from "../../store/popupSlice";
import ConfirmPop from "../../components/popup/ConfirmPop";
import camera_img from "../../images/landing/one_percent/main_banner_camera.png";
import main_banner_top_txt from "../../images/landing/one_percent/main_banner_top_txt.svg";
import main_banner_txt from "../../images/landing/one_percent/main_banner_txt.svg";
import main_banner_txt_tab from "../../images/landing/one_percent/main_banner_txt_tab.svg";
import main_banner_txt_mo from "../../images/landing/one_percent/main_banner_txt_mo.svg";
import main_banner_img from "../../images/landing/one_percent/main_banner_img.png";
import main_banner_img_tab from "../../images/landing/one_percent/main_banner_img_tab.png";
import sect1_ic1 from "../../images/landing/one_percent/sect1_ic1.svg";
import sect1_ic2 from "../../images/landing/one_percent/sect1_ic2.svg";
import sect1_ic3 from "../../images/landing/one_percent/sect1_ic3.svg";
import sect1_ic4 from "../../images/landing/one_percent/sect1_ic4.svg";
import sect2_txt from "../../images/landing/one_percent/sect2_txt.svg";
import sect3_img from "../../images/landing/one_percent/sect3_img.svg";
import sect3_heart1 from "../../images/landing/one_percent/sect3_heart1.svg";
import sect3_heart2 from "../../images/landing/one_percent/sect3_heart2.svg";
import sect3_heart3 from "../../images/landing/one_percent/sect3_heart3.svg";
import sect3_heart4 from "../../images/landing/one_percent/sect3_heart4.svg";
import logo from "../../images/logo.svg";



const OnePercentApply = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const site_info = enum_api_uri.site_info;
    const date_apply = enum_api_uri.date_apply;
    const vip_apply_img = enum_api_uri.vip_apply_img;
    const vip_apply_img_delt = enum_api_uri.vip_apply_img_delt;
    const [confirm, setConfirm] = useState(false);
    const [applyOkConfirm, setApplyOkConfirm] = useState(false);
    const [yearList, setYearList] = useState([]);
    const [yearSelected, setYearSelected] = useState(false);
    const [imgNameList, setImgNameList] = useState([]);
    const [imgList, setImgList] = useState([]);
    const [isAllChecked, setIsAllChecked] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const sect3Ref = useRef(null);
    const [sect3On, setSect3On] = useState(false);
    const [info, setInfo] = useState({});
    const { apply_idx } = useParams();
    const termsList = [{value:1,txt:"개인정보 보호정책 동의"},{value:3,txt:"개인정보 수집 및 이용동의"},{value:4,txt:"이용약관 동의"},{value:6,txt:"광고성 메시지 수신 동의"}];


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
            setApplyOkConfirm(false);
        }
    },[popup.confirmPop]);


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

    useEffect(()=>{
        geInfo();
        getYearList();
    },[]);


    //스크롤시 section on
    const scrollSectOn = () => {
        const scroll = window.scrollY;
        const sections = [
            { ref: sect3Ref, onSet: setSect3On },
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
        window.addEventListener("scroll", scrollSectOn);
        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener("scroll", scrollSectOn);
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);
    


    //이미지 첨부-----------------------------------------
    // 프로필사진 등록
    const { getRootProps: getRootProps1, getInputProps: getInputProps1 } = useDropzone({
        accept: {
            'image/*': []
        },
        multiple: true, // 여러 개의 파일 선택 가능하도록 설정
        onDrop: acceptedFiles => {
            const files = acceptedFiles.length + imgList.length;

            if(acceptedFiles.length === 0){
                return;
            }else if(files > 5){
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'사진은 최대 5장까지 첨부 가능합니다.',
                    confirmPopBtn:1,
                }));
                setConfirm(true);
            }else{
                const formData = new FormData();
                acceptedFiles.forEach((item)=>{
                    formData.append("media", item);
                });
                
                axios.post(vip_apply_img, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((res) => {
                    if (res.status === 201) {
                        const mediaUrls = res.data.mediaUrls;
                        const newList = acceptedFiles.map((file, index) => ({
                            name: file.name,
                            url: mediaUrls[index]
                        }));
                        setImgList(prevList => [...prevList, ...newList]);
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
        }
    });


    //이미지 삭제
    const handleRemove = (idx, url) => {
        const filename = url.substring(url.lastIndexOf('/') + 1);

        axios.delete(vip_apply_img_delt.replace(':filename',filename))
        .then((res)=>{
            if(res.status === 200){
                let newList = [...imgList];
                newList.splice(idx,1);
                setImgList(newList);
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

    
    // 프로필사진 미리보기 생성
    const profileImgs = imgList.map((img,i) => (
        <li key={i} className="flex flex_top">
            <p className="ellipsis"><span>{img.name}</span></p>
            <button type="button" className="btn_delt" onClick={() => handleRemove(i, img.url)}>삭제</button>
        </li>
    ));


    //이미지이름만 배열로 
    useEffect(()=>{
        const newNameList = imgList.map(item => {
            // URL의 마지막 부분(파일 이름)만 추출
            return item.url.split('/').pop();
        });
        setImgNameList(newNameList);
    },[imgList]);
    //이미지 첨부-----------------------------------------


    //전체약관 동의
    const allAgreeHandler = (checked) => {
        const allTerms = ['terms1', 'terms3', 'terms4', 'terms6'];
        setIsAllChecked(checked);
        setCheckedItems(checked ? allTerms : []);
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
        setIsAllChecked(checkedItems.length === 4);
        dispatch(termsCheckList(checkedItems));
    }, [checkedItems]);


    useEffect(()=>{
        setCheckedItems(popup.termsCheckList);
    },[popup.termsCheckList]);


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
        }else if(!values.gender){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'성별을 선택해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }else if(!tel || tel.length < 11){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'전화번호를 입력해주세요.',
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
        }else if(imgList.length < 3){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'정면사진을 3장 첨부해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }else if(!isAllChecked){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'전체동의 체크 해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }else{
            const body = {
                name: values.name,
                year: values.year,
                gender: values.gender,
                tel: tel,
                is_photo: true,
                photo: imgNameList,
                is_not_address: true,
                idx: apply_idx
            };
            axios.post(`${date_apply}`,body)
            .then((res)=>{
                if(res.status === 200){
                    setApplyOkConfirm(true);
                    dispatch(confirmPop({
                        confirmPop:true,
                        confirmPopTit:'알림',
                        confirmPopTxt:'신청이 완료됐습니다.',
                        confirmPopBtn:1,
                    }));
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


    return(<>
    <div className="one_apply">
        <div className="main_banner">
            <img src={camera_img} alt="폴라로이드이미지" className="camera"/>
            <div className="txt_box">
                <img src={main_banner_top_txt} alt="외모상위1% 챌린지"/>
                <img src={main_banner_txt} alt="1% 폴라로이드를 찍어봐" className="img_pc"/>
                <img src={main_banner_txt_tab} alt="1% 폴라로이드를 찍어봐" className="img_tab"/>
                <img src={main_banner_txt_mo} alt="1% 폴라로이드를 찍어봐" className="img_mo"/>
            </div>
            <div className="img_box">
                <img src={main_banner_img} alt="회원이미지" className="img_pc"/>
                <img src={main_banner_img_tab} alt="회원이미지" className="img_tab"/>
            </div>
        </div>
        <div className="sect1">
            <ul>
                <li>
                    <div>
                        <h5>매너베이트 <br/>10,000원 전달</h5>
                        <p>내 짝을 찾을 때까지 쭉~! <br/>소개 1명 당 1만원의 매너베이트를 전달 받아보세요!</p>
                    </div>
                    <img src={sect1_ic1} alt="아이콘"/>
                </li>
                <li>
                    <div>
                        <h5>신규 특전 <br/>200,000원 지급</h5>
                        <p>신규 가입 시, 활발한 이용을 바라며 <br/>첫 이용 특전을 현금으로 제공합니다.</p>
                    </div>
                    <img src={sect1_ic2} alt="아이콘"/>
                </li>
                <li>
                    <div>
                        <h5>데이트 지원비 <br/>최대 70,000원 지급</h5>
                        <p>마음에 드는 상대와의 만남을 자유롭게 결정하고 <br/>데이트 지원금도 받아보세요!</p>
                    </div>
                    <img src={sect1_ic3} alt="아이콘"/>
                </li>
                <li>
                    <div>
                        <h5>지인 추천비 <br/>600,000원 지급</h5>
                        <p>상위 1% 외모의 지인을 추천해 주세요! <br/>지인과 함께 추천비 혜택을 누릴 수 있습니다.</p>
                    </div>
                    <img src={sect1_ic4} alt="아이콘"/>
                </li>
            </ul>
        </div>
        <div className="sect2">
            <img src={sect2_txt} alt="상위 1%의 외모"/>
            <p>이제 당신 차례입니다. 도전해보세요!</p>
        </div>
        <div className={`sect3${sect3On ? ' on' : ''}`} ref={sect3Ref}>
            <div className="inner">
                <img src={sect3_heart1} alt="하트이미지" className="heart_img heart_img1"/>
                <img src={sect3_heart2} alt="하트이미지" className="heart_img heart_img2"/>
                <img src={sect3_heart3} alt="하트이미지" className="heart_img heart_img3"/>
                <img src={sect3_heart4} alt="하트이미지" className="heart_img heart_img4"/>
                <div className="img_box">
                    <img src={sect3_img} alt="내가바로 상위1%"/>
                </div>
                <div className="form_box">
                    <h5 className="tit">사소한 1% 도전하기</h5>
                    <ul className="txt_ul">
                        <li>상위 1% 선정 시, 담당자가 검토 후 제공해주신 연락처로 개별 연락드릴 예정입니다.</li>
                        <li>상위 1% 미선정 시, 이상형의 프로필을 무제한 열람할 수 있도록 연락드릴 예정입니다.</li>
                    </ul>
                    <Formik
                            initialValues={{
                                name: "",
                                year: "",
                                gender: "",
                                tel: "",
                            }}
                        >
                        {({values, handleChange, handleBlur, errors, touched, setFieldValue}) => (
                            <form>
                                <ul className="form_ul">
                                    <li>
                                        <p>이름 <span className="color_point">*</span></p>
                                        <div className="input_box4">
                                            <input type={`text`} placeholder="이름을 입력해주세요." name="name" value={values.name} onChange={handleChange} />
                                        </div>
                                    </li>
                                    <li>
                                        <p>성별 <span className="color_point">*</span></p>
                                        <ul className="gender_ul flex_between">
                                            <li>
                                                <label>
                                                    <input type={`radio`} name="gender"
                                                        onChange={()=>{
                                                            setFieldValue("gender","1");
                                                        }} 
                                                    />
                                                    <div className="box"><span>남성</span></div>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type={`radio`} name="gender" 
                                                        onChange={()=>{
                                                            setFieldValue("gender","2");
                                                        }}
                                                    />
                                                    <div className="box"><span>여성</span></div>
                                                </label>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <p>전화번호 <span className="color_point">*</span></p>
                                        <div className="input_box4">
                                            <PatternFormat format="###-####-####" name="tel" value={values.tel} onChange={handleChange} placeholder="숫자만 입력해주세요." />
                                        </div>
                                    </li>
                                    <li>
                                        <p>출생연도 <span className="color_point">*</span></p>
                                        <div className="input_box4">
                                            <select 
                                                name="year"
                                                value={values.year}
                                                onChange={(e)=>{
                                                    handleChange(e);
                                                    setYearSelected(true);
                                                }}
                                                className={yearSelected ? "selected" : ""}
                                            >
                                                <option value='' hidden>나이를 선택해주세요.</option>
                                                {yearList.map((cont,i)=>{
                                                    return(
                                                        <option value={cont} key={i}>{cont} 년생</option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    </li>
                                    <li>
                                        <p>정면사진 <span className="color_point">*</span></p>
                                        <div className="img_drop_box2">
                                            <div {...getRootProps1({className: 'dropzone'})}>
                                                <input {...getInputProps1()} />
                                                <div className="box">
                                                    <div>사진을 첨부해주세요.</div>
                                                    <button type="button">사진 첨부</button>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </li>
                                    <li>
                                        <div className="img_list_box">
                                            <h5>사진은 꼭 3장 이상 첨부해주세요!</h5>
                                            {profileImgs.length > 0 &&
                                                <ul className='flex flex_wrap'>
                                                    {profileImgs}
                                                </ul>
                                            }
                                        </div>
                                    </li>
                                </ul>
                                <div className="terms_box">
                                    <div className="all_check custom_check2">
                                        <label htmlFor="agreeAll">
                                            <input type={`checkbox`}
                                                onChange={(e)=>{
                                                    allAgreeHandler(e.currentTarget.checked);
                                                }} 
                                                checked={isAllChecked}
                                                id="agreeAll"
                                            />
                                            <span className="check">체크박스</span>
                                            <span className="txt">전체동의 <span className="color_point">*</span></span>
                                        </label>
                                    </div>
                                    <ul className="terms_ul">
                                        {termsList.map((cont,i)=>(
                                            <li key={`terms_${i}`}>
                                                <div className="custom_check2">
                                                    <label htmlFor={`terms${cont.value}`}>
                                                        <input type={`checkbox`}
                                                            onChange={(e)=>{
                                                                agreeHandler(e.currentTarget.checked, e.currentTarget.id);
                                                            }} 
                                                            checked={checkedItems.includes(`terms${cont.value}`) ? true : false}
                                                            id={`terms${cont.value}`}
                                                        />
                                                        <span className="check">체크박스</span>
                                                        <span className="txt">{cont.txt}</span>
                                                    </label>
                                                </div>
                                                <button type="button" className="open_pop"
                                                    onClick={()=>{
                                                        dispatch(termsPop({termsPop:true, termsPopIdx:cont.value}))
                                                    }}
                                                >레이어 팝업 버튼</button>
                                            </li>
                                        ))}
                                    </ul>
                                    <button type="button" className="btn_apply" 
                                        onClick={()=>{
                                            submit(values);
                                        }}
                                    >신청하기</button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
        <div className="footer">
            <div className="top_box">
                <div className="logo"><img src={logo} alt="로고" /></div>
                <ul>
                    {info && info.site_num && <li>사업자 번호 : {info.site_num}</li>}
                    <li>대표자 명 : 서정승</li>
                </ul>
                <ul>
                    {info && info.site_address && <li>주소 : {info.site_address}</li>}
                    {info && info.site_tel && <li>고객센터 : {info.site_address}</li>}
                    <li>고객센터 운영 시간 : 13:00 - 21:30</li>
                </ul>
            </div>
            <div className="copy">COPYRIGHT© 2023 사소한 ALL RIGHTS RESERVED.</div>
        </div>
    </div>
    
    {/* confirm팝업 */}
    {confirm && <ConfirmPop />}

    {/* 신청완료 confirm팝업 */}
    {applyOkConfirm && <ConfirmPop closePop="custom" onCloseHandler={()=>window.location.reload()} />}
    </>);
};

export default OnePercentApply;