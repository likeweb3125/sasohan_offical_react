import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from 'react-dropzone';
import axios from "axios";
import * as CF from "../../config/function";
import { enum_api_uri } from "../../config/enum";
import { vipApplyPop, confirmPop, termsPop, termsCheckList } from "../../store/popupSlice";
import InputBox from "../component/InputBox";
import ConfirmPop from "./ConfirmPop";


const VipApplyPop = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const user = useSelector((state)=>state.user);
    const api_uri = enum_api_uri.api_uri;
    const vip_apply = enum_api_uri.vip_apply;
    const vip_apply_img = enum_api_uri.vip_apply_img;
    const vip_apply_img_delt = enum_api_uri.vip_apply_img_delt;
    const [confirm, setConfirm] = useState(false);
    const [applyOkConfirm, setApplyOkConfirm] = useState(false);
    const [values, setValues] = useState({});
    const [imgNameList, setImgNameList] = useState([]);
    const [imgList, setImgList] = useState([]);
    const [isAllChecked, setIsAllChecked] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);
    const [applyBtn, setApplyBtn] = useState(false);



    // Confirm팝업 닫힐때
    useEffect(()=>{ 
        if(popup.confirmPop === false){
            setConfirm(false);
            setApplyOkConfirm(false);
        }
    },[popup.confirmPop]);


    //팝업닫기
    const closePopHandler = () => {
        dispatch(vipApplyPop(false));
    };


    //input값 변경시
    const onInputChangeHandler = (e) => {
        let val = e.target.value;
        const id = e.target.id;

        if(id === 'phone'){
            val = val.replace(/-/g, '');
            val = val.trim();
        }

        const newValues = {...values};
        newValues[id] = val;
        setValues(newValues); 
    };


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
    const profileImgs = imgList.map((url,i) => (
        <li key={i}>
            <img
                src={url}
                alt="이미지"
            />
            <button className="btn_delt" onClick={() => handleRemove(i, url)}>삭제버튼</button>
        </li>
    ));


    //프로필사진 이미지이름만 배열로 
    useEffect(()=>{
        const newNameList = imgList.map(url => {
            let updatedUrl = url.replace(api_uri+"/upload/profile/user/", "");
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
        if(values.age && values.age.length > 0 && values.phone && values.phone.length > 0 && imgList.length > 0 && isAllChecked){
            setApplyBtn(true);
        }else{
            setApplyBtn(false);
        }
    },[values, imgList, isAllChecked]);


    //신청하기 버튼 클릭시
    const applyBtnClickHandler = () => {
        if(values.age.length === 0){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'나이를 입력해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }else if(values.phone.length < 11){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'연락처를 입력해주세요.',
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
                confirmPopTxt:'약관에 모두 동의해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }else{
            applyHandler();
        }
    };


    //신청하기
    const applyHandler = () => {
        const body = {
            age: values.age,
            phone: values.phone,
            photo: imgNameList,
        };
        axios.post(`${vip_apply}`,body)
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
    };


    return(<>
        <div className="flex_center pop_wrap vip_apply_pop">
            <div className="dim"></div>
            <div className="pop_cont">
                <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                <div className="apply_cont">
                    <div className="tit">사소한 VIP 회원 지원하기</div>
                    <div className="form_box scroll_wrap">
                        <ul className="form_ul flex_between flex_wrap">
                            <li>
                                <p>나이 <span className="color_point">*</span></p>
                                <div className="input_box">
                                    <InputBox 
                                        type={'text'}
                                        placeholder={`나이를 입력해주세요.`}
                                        value={values.age}
                                        onChangeHandler={onInputChangeHandler}
                                        id={`age`}
                                        numberOnly={true}
                                        countMax={3}
                                    />
                                </div>
                            </li>
                            <li>
                                <p>연락처 <span className="color_point">*</span></p>
                                <div className="input_box">
                                    <InputBox 
                                        type={'text'}
                                        placeholder={`숫자만 입력해주세요.`}
                                        value={values.phone}
                                        onChangeHandler={onInputChangeHandler}
                                        id={`phone`}
                                        phone={true}
                                    />
                                </div>
                            </li>
                            <li>
                                <p>정면사진 (3장 첨부 필수) <span className="color_point">*</span></p>
                                <div className="img_drop_box">
                                    <div {...getRootProps1({className: 'dropzone'})}>
                                        <input {...getInputProps1()} />
                                        <div className="txt_box tx_c">
                                            <div className="txt1">이미지 첨부</div>
                                            <p className="txt2">이미지를 드래그 앤 드롭하여 첨부하세요!<span>파일 업로드는 jpg, jpeg, png, gif 형식만 첨부 가능</span></p>
                                        </div>
                                    </div>
                                    {profileImgs.length > 0 &&
                                        <div className="img_list_box scroll_wrap_x">
                                            <ul className='flex tp12'>
                                                {profileImgs}
                                            </ul>
                                        </div>
                                    }
                                </div>
                            </li>
                        </ul>
                        <div className="terms_box">
                            <div className="top_box">
                                <div className="custom_check">
                                    <label htmlFor="agreeAll">
                                        <input type={`checkbox`}
                                            onChange={(e)=>{
                                                allAgreeHandler(e.currentTarget.checked);
                                            }} 
                                            checked={isAllChecked}
                                            id="agreeAll"
                                        />
                                        <span className="check">체크박스</span>
                                        <span className="txt f_18">모두 동의합니다. <span className="color_point">*</span></span>
                                    </label>
                                </div>
                            </div>
                            <ul className="terms_ul">
                                <li>
                                    <div className="custom_check">
                                        <label htmlFor="terms1">
                                            <input type={`checkbox`}
                                                onChange={(e)=>{
                                                    agreeHandler(e.currentTarget.checked, e.currentTarget.id);
                                                }} 
                                                checked={checkedItems.includes('terms1') ? true : false}
                                                id="terms1"
                                            />
                                            <span className="check">체크박스</span>
                                            <span className="txt">개인정보 보호정책 동의 (필수)</span>
                                        </label>
                                    </div>
                                    <button type="button" className="open_pop"
                                        onClick={()=>{
                                            dispatch(termsPop({termsPop:true, termsPopIdx:1}))
                                        }}
                                    >레이어 팝업 버튼</button>
                                </li>
                                <li>
                                    <div className="custom_check">
                                        <label htmlFor="terms3">
                                            <input type={`checkbox`}
                                                onChange={(e)=>{
                                                    agreeHandler(e.currentTarget.checked, e.currentTarget.id);
                                                }} 
                                                checked={checkedItems.includes('terms3') ? true : false}
                                                id="terms3"
                                            />
                                            <span className="check">체크박스</span>
                                            <span className="txt">개인정보 수집 및 이용동의 (필수)</span>
                                        </label>
                                    </div>
                                    <button type="button" className="open_pop"
                                        onClick={()=>{
                                            dispatch(termsPop({termsPop:true, termsPopIdx:3}))
                                        }}
                                    >레이어 팝업 버튼</button>
                                </li>
                                <li>
                                    <div className="custom_check">
                                        <label htmlFor="terms4">
                                            <input type={`checkbox`}
                                                onChange={(e)=>{
                                                    agreeHandler(e.currentTarget.checked, e.currentTarget.id);
                                                }} 
                                                checked={checkedItems.includes('terms4') ? true : false}
                                                id="terms4"
                                            />
                                            <span className="check">체크박스</span>
                                            <span className="txt">이용약관 동의 (필수)</span>
                                        </label>
                                    </div>
                                    <button type="button" className="open_pop"
                                        onClick={()=>{
                                            dispatch(termsPop({termsPop:true, termsPopIdx:4}))
                                        }}
                                    >레이어 팝업 버튼</button>
                                </li>
                            </ul>
                            <div className="btn_box">
                                <p>담당자가 지원서 검토 후, 제공해 주신 연락처로 개별 연락드릴 예정입니다. <br/>내부 심사 기준에 적합하지 않을 시 별도의 연락을 드리지 않고 있습니다.</p>
                                <button type="button" className="btn_type3" 
                                    disabled={applyBtn ? false : true}
                                    onClick={applyBtnClickHandler}
                                >신청하기</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 신청완료 confirm팝업 */}
        {applyOkConfirm && <ConfirmPop closePop="custom" onCloseHandler={closePopHandler} />}

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default VipApplyPop;