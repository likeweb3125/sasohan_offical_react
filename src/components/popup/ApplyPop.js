import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Formik } from "formik";
import { PatternFormat } from "react-number-format";
import * as CF from "../../config/function";
import { enum_api_uri } from "../../config/enum";
import { applyPop, confirmPop } from "../../store/popupSlice";
import ConfirmPop from "./ConfirmPop";

const ApplyPop = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const policy_cont = enum_api_uri.policy_cont;
    const m_address = enum_api_uri.m_address;
    const m_address2 = enum_api_uri.m_address2;
    const date_apply = enum_api_uri.date_apply;
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
    const [allAddressCheck, setAllAddressCheck] = useState(true);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
            setSubmitConfirm(false);
        }
    },[popup.confirmPop]);


    //팝업닫기
    const closePopHandler = () => {
        dispatch(applyPop(false));
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


    //선택한 지역리스트 값 변경시 전지역 체크박스값 변경
    useEffect(()=>{
        if(addrSelectList.length > 0){
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
        }else if(!values.agree){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'개인 정보 수집 및 이용 동의 체크 해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }else{
            let addr = addrSelectList;
            if(allAddressCheck){
                addr = ['전지역'];
            }

            let body = {
                name: values.name,
                year: values.year,
                gender: values.gender,
                address1: addr,
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
        <div className="flex_center pop_wrap apply_pop">
            <div className="dim"></div>
            <div className="pop_cont">
                <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                <div className="inner_box">
                    <div className="tit_box">
                        <h4>간단하게 <br/><strong>소개팅을 신청하세요.</strong></h4>
                        <p>사소한의 매니저와 함께 새로운 인연을 만들어 보세요!</p>
                    </div>
                    <div className="form_box scroll_wrap">
                        <div className="tx_r">
                            <p><span className="color_point">*</span> 표시는 필수 입력 항목입니다.</p>
                        </div>
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
                                            <div className="input_box">
                                                <input type={`text`} placeholder="이름을 입력해주세요." name="name" value={values.name} onChange={handleChange} />
                                            </div>
                                        </li>
                                        <li>
                                            <p>나이 <span className="color_point">*</span></p>
                                            <div className="input_box">
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
                                        <li className="addr_select_li bp0">
                                            <p>선호지역 <span className="color_point">*</span></p>
                                            <div>
                                                <div className="custom_check">
                                                    <label>
                                                        <input type={`checkbox`}
                                                            onChange={(e)=>{
                                                                const checked = e.currentTarget.checked;
                                                                if(checked){
                                                                    setAllAddressCheck(true);

                                                                    setFieldValue("address1","");
                                                                    setFieldValue("address2","");
                                                                    setAddrSelectList([]); //선택한지역 리스트 삭제
                                                                }else{
                                                                    setAllAddressCheck(false);
                                                                }
                                                            }} 
                                                            checked={allAddressCheck}
                                                        />
                                                        <span className="check">체크박스</span>
                                                        <span className="txt">전지역</span>
                                                    </label>
                                                </div>
                                                <div className="address_box flex_between">
                                                    <div className="input_box">
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
                                                            className={addrSelected ? "selected" : ""}
                                                        >
                                                            <option value='' hidden disabled>시/도</option>
                                                            {addressList.map((cont, i)=>{
                                                                return(
                                                                    <option value={cont.sido_gugun} key={i} data-code={cont.local_code}>{cont.sido_gugun}</option>
                                                                );
                                                            })}
                                                        </select>
                                                    </div>
                                                    <div className="input_box">
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
                                                                        const txt = address1_txt + " " + val;
                                                                        if(!addrSelectList.includes(txt)){
                                                                            const updatedList = [...addrSelectList];
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
                                                {addrSelectList.length === 0 ? <p className="txt">&lt;전지역&gt;으로 필수 설정되어 있습니다. <br/>지역을 선택하여 만남을 진행하고 싶으시다면 지역을 선택해주세요!</p>
                                                    :   addrSelectList.length > 2 ? <p className="txt">선호 지역을 다 선택했어요! 이제 소개팅을 받을 수 있습니다.</p>
                                                    :   <p className="txt">선호지역은 최소 3개를 선택해야 신청할 수 있습니다.</p>
                                                }
                                            </div>
                                        </li>
                                        <li>
                                            <p>연락처 <span className="color_point">*</span></p>
                                            <div className="input_box">
                                                <PatternFormat format="###-####-####" name="tel" value={values.tel} onChange={handleChange} placeholder="숫자만 입력해주세요." />
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
                                    >소개팅 신청</button>
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
        {submitConfirm && <ConfirmPop closePop="custom" onCloseHandler={closePopHandler} />}
    </>);
};

export default ApplyPop;