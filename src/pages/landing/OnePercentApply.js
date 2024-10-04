import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Formik } from "formik";
import { PatternFormat } from "react-number-format";
import { useDropzone } from 'react-dropzone';
import * as CF from "../../config/function";
import { enum_api_uri } from "../../config/enum";
import { confirmPop, termsPop, termsCheckList } from "../../store/popupSlice";
import ConfirmPop from "../../components/popup/ConfirmPop";

import camera_img from "../../images/landing/one_percent/main_banner_camera.png";
import main_banner_top_txt from "../../images/landing/one_percent/main_banner_top_txt.png";
import main_banner_txt from "../../images/landing/one_percent/main_banner_txt.png";
import main_banner_img from "../../images/landing/one_percent/main_banner_img.png";
import sect1_ic1 from "../../images/landing/one_percent/sect1_ic1.svg";
import sect1_ic2 from "../../images/landing/one_percent/sect1_ic2.svg";
import sect1_ic3 from "../../images/landing/one_percent/sect1_ic3.svg";
import sect1_ic4 from "../../images/landing/one_percent/sect1_ic4.svg";
import sect2_txt from "../../images/landing/one_percent/sect2_txt.svg";
import sect3_img from "../../images/landing/one_percent/sect3_img.svg";


const OnePercentApply = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const date_apply = enum_api_uri.date_apply;
    const vip_apply_img = enum_api_uri.vip_apply_img;
    const vip_apply_img_delt = enum_api_uri.vip_apply_img_delt;
    const [confirm, setConfirm] = useState(false);
    const [submitConfirm, setSubmitConfirm] = useState(false);
    const [values, setValues] = useState({});
    const [yearList, setYearList] = useState([]);
    const [yearSelected, setYearSelected] = useState(false);
    const [imgNameList, setImgNameList] = useState([]);
    const [imgList, setImgList] = useState([]);
    const [isAllChecked, setIsAllChecked] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);
    const [applyBtn, setApplyBtn] = useState(false);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
            setSubmitConfirm(false);
        }
    },[popup.confirmPop]);


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
        getYearList();
    },[]);


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
            }else if(files > 3){
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'사진은 최대 3개까지 첨부 가능합니다.',
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
                        const newList = [...imgList, ...mediaUrls];
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
            }
        }
    });


    //프로필, 피드 이미지 삭제
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
    const profileImgs = imgNameList.map((img,i) => (
        <li key={i} className="flex">
            <p>{img}</p>
            <button className="btn_delt" onClick={() => handleRemove(i, img)}>삭제</button>
        </li>
    ));


    //프로필사진 이미지이름만 배열로 
    useEffect(()=>{
        const newNameList = imgList.map(url => {
            let updatedUrl = url.substring(url.lastIndexOf('/') + 1);
            return updatedUrl;
        });
        setImgNameList(newNameList);
    },[imgList]);
    //이미지 첨부-----------------------------------------


    //전체약관 동의
    const allAgreeHandler = (checked) => {
        setIsAllChecked(!isAllChecked)
        if (checked) {
          setCheckedItems(['terms1', 'terms3', 'terms4']);
        } else if ((!checked && checkedItems.includes('terms1')) || (!checked && checkedItems.includes('terms3')) || (!checked && checkedItems.includes('terms4'))) {
          setCheckedItems([]);
        }
    }


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
        if (checkedItems.length == 3) {
            setIsAllChecked(true)
        } else {
            setIsAllChecked(false)
        }
        dispatch(termsCheckList(checkedItems));
    }, [checkedItems]);


    useEffect(()=>{
        setCheckedItems(popup.termsCheckList);
    },[popup.termsCheckList]);



    useEffect(()=>{
        // if(values.age && values.age.length > 0 && values.phone && values.phone.length > 0 && imgList.length > 0 && isAllChecked){
        //     setApplyBtn(true);
        // }else{
        //     setApplyBtn(false);
        // }
    },[values, imgList, isAllChecked]);


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
                confirmPopTxt:'나이를 선택해주세요.',
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
                confirmPopTxt:'연락처를 입력해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }else if(!values.agree){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'개인 정보 수집 및 이용 동의 체크 해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }else{


            let body = {
                name: values.name,
                year: values.year,
                gender: values.gender,
                tel: tel,
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


    return(<>
    <div className="one_apply">
        <div className="main_banner">
            <img src={camera_img} alt="폴라로이드이미지" className="camera"/>
            <div className="txt_box">
                <img src={main_banner_top_txt} alt="외모상위1% 챌린지"/>
                <img src={main_banner_txt} alt="1% 폴라로이드를 찍어봐"/>
            </div>
            <div className="img_box">
                <img src={main_banner_img} alt="회원이미지"/>
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
        <div className="sect3">
            <div className="inner">
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
                                address1: "",
                                address2: "",
                                tel: "",
                                agree: false
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
                                    {profileImgs.length > 0 &&
                                        <li>
                                            <div className="img_list_box">
                                                <h5>사진은 꼭 3장 이상 첨부해주세요!</h5>
                                                <ul className='flex flex_wrap'>
                                                    {profileImgs}
                                                </ul>
                                            </div>
                                        </li>
                                    }
                                </ul>
                                <div className="agree_box">
                                    <div className="all_check custom_check">
                                        <label>
                                            <input type={`checkbox`} name="agree" value={values.agree} onChange={handleChange} />
                                            <span className="check">체크박스</span>
                                            <span className="txt">개인 정보 수집 및 이용 동의 <strong className="color_point">*</strong></span>
                                        </label>
                                    </div>
                                    <div className="scroll_wrap">
                                        <div className="txt"></div>
                                    </div>
                                </div>
                                <button type="button" className="btn_apply" 
                                    onClick={()=>{
                                        submit(values);
                                    }}
                                >신청하기</button>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    </div>
    
    {/* confirm팝업 */}
    {confirm && <ConfirmPop />}

    {/* 소개팅신청 완료 confirm팝업 */}
    {submitConfirm && <ConfirmPop closePop="custom" onCloseHandler={()=>{}} />}
    </>);
};

export default OnePercentApply;