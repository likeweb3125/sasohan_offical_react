import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Formik } from "formik";
import { PatternFormat } from "react-number-format";
import * as CF from "../config/function";
import { enum_api_uri } from "../config/enum";
import { confirmPop } from "../store/popupSlice";
import ConfirmPop from "../components/popup/ConfirmPop";
import logo from "../images/logo_big.svg";
import img_complete from "../images/apply_complete_img.svg";
import { useLocation } from "react-router-dom";


const Apply = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const policy_cont = enum_api_uri.policy_cont;
    const m_address = enum_api_uri.m_address;
    const m_address2 = enum_api_uri.m_address2;
    const date_apply = enum_api_uri.date_apply;
    const [confirm, setConfirm] = useState(false);
    const [terms, setTerms] = useState({});
    const [yearList, setYearList] = useState([]);
    const [montList, setMonthList] = useState([]);
    const [dayList, setDayList] = useState([]);
    const [addressList, setAddressList] = useState([]);
    const [addressList2, setAddressList2] = useState([]);
    const [addrSelectList, setAddrSelectList] = useState([]);
    const [step, setStep] = useState(1);
    const location = useLocation();
    const [applyIdx, setApplyIdx] = useState(null);


    //신청페이지 url 에서 idx 값 가져오기
    useEffect(()=>{
        let idx = location.search.replace("?idx=","");
        setApplyIdx(idx);
    },[location.search]);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);


    //나이 년도,월,일 구하기
    const getYearList = () => {
        const currentYear = new Date().getFullYear(); // 현재 년도 구하기
        const startYear = currentYear - 19; // 시작 년도 설정 (현재 년도에서 19를 뺍니다.)
        const endYear = 1963; // 종료 년도 설정
        
        const yearsArray = [];
        
        for (let i = startYear; i >= endYear; i--) {
            yearsArray.push(i.toString());
        }

        setYearList([...yearsArray]);

        //월 리스트 넣기
        const monthList = Array.from({ length: 12 }, (_, index) => {
            const month = (index + 1).toString().padStart(2, '0'); // 변환하고 0으로 채움
            return month;
        });
        setMonthList(monthList);

        //일 리스트 넣기
        const dayList = Array.from({ length: 31 }, (_, index) => {
            const day = (index + 1).toString().padStart(2, '0'); // 변환하고 0으로 채움
            return day;
        });
        setDayList(dayList);
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


    //약관내용 가져오기
    const getTerms = () => {
        axios.get(`${policy_cont.replace(":policy_type",3)}`)
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setTerms({...data});
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


    useEffect(()=>{
        getYearList();
        getAddress();
        getTerms();
    },[]);


    //선호지역 삭제하기
    const addrDeltHandler = (idx) => {
        // addrSelectList 배열에서 특정 인덱스의 값을 삭제하고 새로운 배열을 생성
        const updatedList = addrSelectList.filter((_, index) => index !== idx);

        // addrSelectList 상태를 새로운 배열로 업데이트
        setAddrSelectList(updatedList);
    };


    //신청서 제출하기
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
                confirmPopTxt:'생년월일을 선택해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }else if(!values.month){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'생년월일을 선택해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }else if(!values.day){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'생년월일을 선택해주세요.',
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
        }else if(addrSelectList.length < 3){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'선호지역은 최소 3개를 선택해주세요.',
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
            const year = values.year+"-"+values.month+"-"+values.day;
            let body = {
                name: values.name,
                year: year,
                gender: values.gender,
                address1: addrSelectList,
                tel: tel,
                idx: applyIdx
            };

            axios.post(`${date_apply}`,body)
            .then((res)=>{
                if(res.status === 200){
                    setStep(2);
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
        <div className="apply_wrap">
            <div className="top_banner">
                <div className="logo">
                    <img src={logo} alt="로고" />
                </div>
                <p>사람이 사람을 소개합니다.</p>
            </div>
            {step === 1 ? 
                <div className="cont_box">
                    <div className="inner">
                        <div className="top_tit_box tx_c">
                            <h5 className="title">간편 소개 신청서</h5>
                            <p className="sub_title">원활한 매칭을 위해 모든 항목은 필수 항목입니다. <br/>정확하게 입력해 주세요!</p>
                        </div>
                        <Formik
                            initialValues={{
                                name: "",
                                year: "",
                                month: "",
                                day: "",
                                gender: "",
                                tel: "",
                                address1: "",
                                address2: "",
                                agree: false
                            }}
                        >
                            {({values, handleChange, handleBlur, errors, touched, setFieldValue}) => (
                                <form>
                                    <ul className="form_ul">
                                        <li>
                                            <p className="tit">이름 <span className="color_point">*</span></p>
                                            <div className="input_box2">
                                                <input type={`text`} placeholder="이름을 입력해주세요." name="name" value={values.name} onChange={handleChange} />
                                            </div>
                                        </li>
                                        <li>
                                            <p className="tit">생년월일 <span className="color_point">*</span></p>
                                            <div className="year_input_box flex_between">
                                                <div className="input_box2">
                                                    <select 
                                                        name="year"
                                                        value={values.year}
                                                        onChange={handleChange}
                                                    >
                                                        <option value='' hidden>생년</option>
                                                        {yearList.map((cont,i)=>{
                                                            return(
                                                                <option value={cont} key={i}>{cont}</option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                                <div className="input_box2">
                                                    <select 
                                                        name="month"
                                                        value={values.month}
                                                        onChange={handleChange}
                                                    >
                                                        <option value='' hidden>월</option>
                                                        {montList.map((cont,i)=>{
                                                            return(
                                                                <option value={cont} key={i}>{cont}</option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                                <div className="input_box2">
                                                    <select 
                                                        name="day"
                                                        value={values.day}
                                                        onChange={handleChange}
                                                    >
                                                        <option value='' hidden>일</option>
                                                        {dayList.map((cont,i)=>{
                                                            return(
                                                                <option value={cont} key={i}>{cont}</option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <p className="tit">성별 <span className="color_point">*</span></p>
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
                                            <p className="tit">연락처 <span className="color_point">*</span></p>
                                            <div className="input_box2">
                                                <PatternFormat format="###-####-####" name="tel" value={values.tel} onChange={handleChange} placeholder="숫자만 입력해주세요." />
                                            </div>
                                        </li>
                                        <li className="bp0">
                                            <p className="tit">선호지역 <span className="color_point">*</span></p>
                                            <div className="address_box flex_between">
                                                <div className="input_box2">
                                                    <select 
                                                        name="address1" 
                                                        value={values.address1} 
                                                        onChange={(e)=>{
                                                            const code = e.target.options[e.target.selectedIndex].getAttribute("data-code");
                                                            handleChange(e);
                                                            getAddress2(code);

                                                            const val = e.currentTarget.value;
                                                            if(val == "세종특별자치시" && !addrSelectList.includes("세종")){
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
                                                        }}
                                                    >
                                                        <option value='' hidden disabled>시/도</option>
                                                        {addressList.map((cont, i)=>{
                                                            return(
                                                                <option value={cont.sido_gugun} key={i} data-code={cont.local_code}>{cont.sido_gugun}</option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                                <div className="input_box2">
                                                    <select 
                                                        name="address2" 
                                                        value={values.address2} 
                                                        onChange={(e)=>{
                                                            handleChange(e);

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
                                                                    const txt = address1_txt + " " + val;
                                                                    if(!addrSelectList.includes(txt)){
                                                                        const updatedList = [...addrSelectList];
                                                                            updatedList.push(txt);
                                                                        setAddrSelectList(updatedList);
                                                                    }
                                                                }
                                                            }  
                                                        }}
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
                                                {addrSelectList.length > 2 ? <p className="txt on">이제 소개팅을 받을 수 있어요! <br/>선호 지역을 더 많이 추가할 수록 폭넓은 소개팅을 받을 수 있어요.</p>
                                                    : <p className="txt">선호지역은 최소 3개를 선택해야 신청할 수 있습니다.</p>
                                                }
                                            </div>
                                        </li>
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
                                            <div className="txt">{terms.contents_p}</div>
                                        </div>
                                    </div>
                                    <button type="button" className="btn_apply" 
                                        onClick={()=>{
                                            submit(values);
                                        }}
                                    >간편 가입 신청할게요!</button>
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
                : 
                <div className="cont_box complete_box">
                    <div className="inner">
                        <div className="top_tit_box tx_c">
                            <h5 className="title">신청서 제출이 완료되었어요!</h5>
                            <div className="img">
                                <img src={img_complete} alt="이미지" />
                            </div>
                            <p className="sub_title">신청서를 제출해 주셔서 감사합니다. <br/>제출한 신청서가 확인될 때까지 기다려 주세요!</p>
                        </div>
                        <ul className="link_ul">
                            <li>
                                <a href="/" target="_blank"  rel="noopener noreferrer" >사소한 사이트 바로가기</a>
                            </li>
                            <li>
                                <a href="https://www.youtube.com/@user-sasohan" target="_blank" rel="noopener noreferrer" >사소한 공식 유튜브 바로가기</a>
                            </li>
                            <li>
                                <a href="https://blog.naver.com/sasohan_official" target="_blank" rel="noopener noreferrer" >사소한 공식 블로그 바로가기</a>
                            </li>
                            <li>
                                <a href="https://www.instagram.com/sasohan_official_/" target="_blank" rel="noopener noreferrer" >사소한 공식 인스타그램 바로가기</a>
                            </li>
                        </ul>
                    </div>
                </div>
            }
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default Apply;