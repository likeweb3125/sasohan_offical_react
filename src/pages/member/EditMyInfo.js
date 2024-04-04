import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment/moment";
import { enum_api_uri } from "../../config/enum";
import * as CF from "../../config/function";
import { confirmPop, loadingPop } from "../../store/popupSlice";
import MyInfoForm from "../../components/component/MyInfoForm";
import ConfirmPop from "../../components/popup/ConfirmPop";


const EditMyInfo = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const all_profile = enum_api_uri.all_profile;
    const basic_profile_modify = enum_api_uri.basic_profile_modify;
    const m_id_check = enum_api_uri.m_id_check;
    const m_nick_check = enum_api_uri.m_nick_check;
    const text_check = enum_api_uri.text_check;
    const popup = useSelector((state)=>state.popup);
    const user = useSelector((state)=>state.user);
    const [confirm, setConfirm] = useState(false);
    const [okConfirm, setOkConfirm] = useState(false);
    const [info ,setInfo] = useState({});
    const [values, setValues] = useState({});
    const [passShow, setPassShow] = useState({"password":false,"password2":false});
    const [focusInput, setFocusInput] = useState({});
    const [error, setError] = useState({});
    const [id, setId] = useState('');
    const [nick, setNick] = useState('');
    const [idChecked, setIdChecked] = useState(true);
    const [nickChecked, setNickChecked] = useState(true);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
            setOkConfirm(false);
        }
    },[popup.confirmPop]);


    //전체회원정보 가져오기
    const getAllProfile = () => {
        axios.get(all_profile,{
            headers: {
                Authorization: `Bearer ${user.userToken}`,
            },
        })
        .then((res)=>{
            if(res.status === 200){
                const data = res.data.my_info;
                setInfo(data);

                //자신이 직접가입한 회원만
                if(data.modify_flag){
                    setId(data.m_id);
                }
                setNick(data.m_n_name);
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


    //맨처음 전체회원정보 가져오기
    useEffect(()=>{
        getAllProfile();
    },[]);


    //input값 변경시
    const onInputChangeHandler = (e) => {
        let val = e.target.value;
        const id = e.target.id;

        if(id == 'm_id'){
            setId(val);
        }
        if(id == 'm_n_name'){
            setNick(val);
        }

        if(id !== 'm_id' && id !== 'm_n_name'){
            const newValues = {...values};
            newValues[id] = val;
            setValues(newValues); 
        }

        const newError = {...error};
        if(val.length > 0){
            newError[id] = false;
            setError(newError);
        }
    };


    //input 포커스
    const focusHandler = (e,val) => {
        const id = e.target.id;
        let newList = {...focusInput};
        newList[id] = val;
        
        setFocusInput(newList);
    };


    //비밀번호보기버튼 클릭시 토글
    const passShowHandler = (id) => {
        const newData = {...passShow};
        newData[id] = !newData[id];
        setPassShow(newData);
    };


    //아이디 값 변경시
    useEffect(()=>{
        if(id == info.m_id){
            setIdChecked(true);
        }else{
            if(id.length > 3){
                setIdChecked(false);
            }else{
                setIdChecked(true);
            }
        }
    },[id]);


    //닉네임 값 변경시
    useEffect(()=>{
        if(nick == info.m_n_name){
            setNickChecked(true);
        }else{
            if(nick.length > 1){
                setNickChecked(false);
            }else{
                setNickChecked(true);
            }
        }
    },[nick]);


    //아이디 중복확인
    const idCheckHandler = () => {
        const newError = {...error};

        if(id.length < 4){
            newError.m_id = true;
        }else{
            newError.m_id = false;
            
            axios.get(`${m_id_check.replace(':m_id',id)}`)
            .then((res)=>{
                if(res.status === 200){
                    setIdChecked(true);

                    setConfirm(true);
                    dispatch(confirmPop({
                        confirmPop:true,
                        confirmPopTit:'알림',
                        confirmPopTxt:'사용 가능한 아이디입니다.',
                        confirmPopBtn:1,
                    }));
                }
            })
            .catch((error) => {
                const err_msg = CF.errorMsgHandler(error);
                setConfirm(true);
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:err_msg,
                    confirmPopBtn:1,
                }));
            });
        }

        setError(newError);
    };


    //닉네임 부적격 체크하기
    const nickNameCheckHandler = () => {
        dispatch(loadingPop(true));

        const body = {
            text : nick,
        };

        axios.post(text_check,body,{
            headers: {
                Authorization: `Bearer ${user.userToken}`,
            },
        })
        .then((res)=>{
            if(res.status === 200){
                dispatch(loadingPop(false));

                const data = res.data.result;
                //result = [긍정적%,부정적%]
                //부정적이 50% 이상이면 닉네임사용 불가능
                if(data[1] >= 50){
                    dispatch(confirmPop({
                        confirmPop:true,
                        confirmPopTit:'알림',
                        confirmPopTxt:'죄송합니다. 해당 닉네임은 부적절합니다. <br/>다른 닉네임을 입력해주세요.',
                        confirmPopBtn:1,
                    }));
                    setConfirm(true);
                }else{
                    nickCheckHandler(); //통과하면 닉네임 중복확인
                }
            }
        })
        .catch((error) => {
            dispatch(loadingPop(false));

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


    //닉네임 중복확인
    const nickCheckHandler = () => {
        const newError = {...error};

        if(nick.length < 2){
            newError.m_n_name = true;
        }else{
            newError.m_n_name = false;
            
            axios.get(`${m_nick_check}?m_n_name=${nick}`)
            .then((res)=>{
                if(res.status === 200){
                    setNickChecked(true);

                    setConfirm(true);
                    dispatch(confirmPop({
                        confirmPop:true,
                        confirmPopTit:'알림',
                        confirmPopTxt:'사용 가능한 닉네임입니다.',
                        confirmPopBtn:1,
                    }));
                }
            })
            .catch((error) => {
                const err_msg = CF.errorMsgHandler(error);
                setConfirm(true);
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:err_msg,
                    confirmPopBtn:1,
                }));
            });
        }

        setError(newError);
    };


    


    //입력값 체크
    const errorCheck = () => {
        const newError = {...error};

        //기본정보
        if(id.length === 0){
            newError.m_id = true;
        }
        if(!idChecked){
            newError.m_id = false;
        }
        if(!values.password || values.password.length === 0){
            newError.password = true;
        }
        if(values.password){
            let pw = values.password;
            let num = pw.search(/[0-9]/g);
            let eng = pw.search(/[a-z]/ig);
            let spe = pw.search(/[!@#$%^&*()]/g);   //숫자키 1~0까지 있는 특수문자만 사용

            if(pw.length < 8 || pw.length > 13){
                newError.password = true;
            }else if(pw.search(/\s/) != -1){
                newError.password = true;
            }else if(num < 0 || eng < 0 || spe < 0){
                newError.password = true;
            }else {
                newError.password = false;
            }
        }
        if(!values.password2 || values.password2.length === 0){
            newError.password2 = true;
        }
        if(values.password2){
            let pw = values.password;
            let pw2 = values.password2;
            if(pw !== pw2){
                newError.password2 = true;
            }else{
                newError.password2 = false;
            }
        }
        if(nick.length === 0){
            newError.m_n_name = true;
        }
        if(!nickChecked){
            newError.m_n_name = false;
        }

        setError(newError);
    };


    //기본정보 수정버튼 클릭시
    const editBtnClickHandler = () => {
        errorCheck();

        let pw = '';
        if(values.password){
            pw = values.password;
        }
        let num = pw.search(/[0-9]/g);
        let eng = pw.search(/[a-z]/ig);
        let spe = pw.search(/[!@#$%^&*()]/g);   //숫자키 1~0까지 있는 특수문자만 사용

        //기본정보
        if(id.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'아이디를 입력해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(!idChecked){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'아이디 중복확인을 해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(!values.password || values.password.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'비밀번호를 입력해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(pw.length < 8 || pw.length > 13){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'비밀번호를 영문, 숫자, 특수문자를 포함하여 8~12자 까지 입력해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(pw.search(/\s/) != -1){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'비밀번호를 영문, 숫자, 특수문자를 포함하여 8~12자 까지 입력해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(num < 0 || eng < 0 || spe < 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'비밀번호를 영문, 숫자, 특수문자를 포함하여 8~12자 까지 입력해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(!values.password2 || values.password2.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'비밀번호를 재입력해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(pw !== values.password2){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'비밀번호를 재입력해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(nick.length === 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'닉네임을 입력해주세요.',
                confirmPopBtn:1,
            }));
        }
        else if(!nickChecked){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'닉네임 중복확인을 해주세요.',
                confirmPopBtn:1,
            }));
        }
        else{
            editHandler();
        }
    };


    //기본정보 수정하기
    const editHandler = () => {
        const body = {
            m_id: id,
            m_password: values.password,
            m_n_name: nick,
        };

        axios.put(basic_profile_modify,body,{
            headers: {
                Authorization: `Bearer ${user.userToken}`,
            },
        })
        .then((res)=>{
            if(res.status === 200){
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'기본정보가 수정되었습니다.',
                    confirmPopBtn:1,
                }));
                setOkConfirm(true);
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
        <div className="signup_wrap signup_wrap2">
            <div className="cont">
                <div className="form_cont">
                    <div className="tit_box">
                        <p className="tit">기본정보 수정</p>
                    </div>
                    <div className="form_box">
                        <div className="box">
                            <div className="my_box">
                                <p>본인인증이 완료되었습니다!</p>
                                <div className="flex_between flex_wrap">
                                    <p className="txt flex"><strong>{info.m_name}</strong><span>{info.phone}</span></p>
                                    <p className="txt2 flex"><span>{info.birth}</span><span className={info.m_gender && info.m_gender == '남성' ? '' : 'w'}>{info.m_gender && info.m_gender == '남성' ? '남' : '여'}</span></p>
                                </div>
                            </div>
                            <ul className="form_ul2">
                                <MyInfoForm 
                                    focusInput={focusInput}
                                    values={values}
                                    id={id}
                                    nick={nick}
                                    onInputChangeHandler={onInputChangeHandler}
                                    focusHandler={focusHandler}
                                    error={error}
                                    passShow={passShow}
                                    passShowHandler={passShowHandler}
                                    idChecked={idChecked}
                                    nickChecked={nickChecked}
                                    idCheckHandler={idCheckHandler}
                                    nickCheckHandler={nickNameCheckHandler}
                                />
                            </ul>
                        </div>
                        <div className="box">
                            <button type="button" className="btn_type3" onClick={editBtnClickHandler}>기본정보 수정</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 기본정보 수정완료 confirm팝업 */}
        {okConfirm && <ConfirmPop closePop="custom" onCloseHandler={()=>{navigate('/member/mypage')}}/>}

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default EditMyInfo;