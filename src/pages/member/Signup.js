import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { enum_api_uri } from "../../config/enum";
import { confirmPop, termsPop, termsCheckList } from "../../store/popupSlice";
import { tradeId } from "../../store/userSlice";
import StepBox from "../../components/component/StepBox";
import ConfirmPop from "../../components/popup/ConfirmPop";


const Signup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const m_realname_okurl = enum_api_uri.m_realname_okurl;
    const popup = useSelector((state)=>state.popup);
    const [confirm, setConfirm] = useState(false);
    const [tradeid, setTradeid] = useState("");
    const [isAllChecked, setIsAllChecked] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);


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


    //인증하기 버튼 클릭시
    const authBtnClickHandler = () => {
        if(!isAllChecked){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'전체약관에 동의해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }else{
            authHandler();
        }
    };


    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://auth.mobilians.co.kr/js/ext/ext_inc_comm.js';
        script.async = true;
    
        document.body.appendChild(script);
    
        return () => {
            document.body.removeChild(script);
        };
    }, []);


    //전체동의시 tradeid sessionStorage에 저장
    useEffect(()=>{
        if(isAllChecked){
            const time = moment().format("YYYYMMDDHHmmss");
            const num = Math.floor(Math.random() * 1000);
            const id = time+num;
            setTradeid(id);
            sessionStorage.setItem("tId",id);
            // dispatch(tradeId(id));
            console.log(id);
        }else{
            setTradeid('');
            sessionStorage.removeItem("tId");
            // dispatch(tradeId(''));
        }
    },[isAllChecked]);


    //본인인증하기
    const authHandler = () => {
        document.realnameForm.submit();
    };


    return(<>
        <div className="signup_wrap gray_wrap">
            <div className="cont2">
                <div className="form_cont">
                    <div className="tit_box">
                        <p className="tit">회원가입</p>
                        <StepBox onIdx={1} />
                    </div>
                    <div className="shadow_box">
                        <div className="terms_box">
                            <div className="top_box">
                                <div className="custom_check all_check">
                                    <label htmlFor="agreeAll">
                                        <input type={`checkbox`}
                                            onChange={(e)=>{
                                                allAgreeHandler(e.currentTarget.checked);
                                            }} 
                                            checked={isAllChecked}
                                            id="agreeAll"
                                        />
                                        <span className="check">체크박스</span>
                                        <span className="txt">모두 동의합니다 <br/><span>이용약관, 개인정보 수집 및 이용, 처리 위탁에 모두 동의합니다.</span></span>
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
                        </div>
                    </div>
                    <form name="realnameForm" acceptCharset='euc-kr' action="https://auth.mobilians.co.kr/goCashMain.mcash" method="POST">
                        <input type="hidden" name="CASH_GB" id="CASH_GB" value="CI"/>
                        <input type="hidden" name="CI_SVCID" id="CI_SVCID"  value="171228049209" />
                        <input type="hidden" name="Cryptyn" id="Cryptyn" value="Y"/>
                        <input type="hidden" name="Keygb" id="Keygb"  value="0" />
                        <input type="hidden" name="CALL_TYPE" id="CALL_TYPE" value="SELF"/>
                        <input type="hidden" name="LOGO_YN" id="LOGO_YN" value="N"/>
                        <input type="hidden" name="CI_Mode" id="CI_Mode" value="61"/>
                        <input type="hidden" name="DI_CODE" id="DI_CODE" value=""/>
                        <input type="hidden" name="Siteurl" id="Siteurl" value="www.jja-gg.com"/>
                        <input type="hidden" name="SUB_CPID" id="SUB_CPID" value=""/>
                        <input type="hidden" name="Callback" id="Callback" size="30" value=""/>
                        <input type="hidden" name="Smstext" id="Smstext" size="30" value=""/>
                        <input type="hidden" name="Lmstitle" id="Lmstitle" size="40" value=""/>
                        <input type="hidden" name="Lmstext" id="Lmstext" size="40" value=""/>
                        <input type="hidden" name="Tradeid" id="Tradeid" size="30" value={tradeid}/>
                        <input type="hidden" name="PAY_MODE" id="PAY_MODE" size="30" value="10"/>
                        <input type="hidden" name="Okurl" id="Okurl" size="30" value={m_realname_okurl}/>
                        <input type="hidden" name="Cryptokurl" id="Cryptokurl" size="30" value="Y"/>
                        <input type="hidden" name="CI_FIXCOMMID" id="CI_FIXCOMMID" size="30" value=""/>
                        <input type="hidden" name="Closeurl" id="Closeurl" size="30" value=""/>
                    </form>
                    <div className="flex_between btn_box">
                        <button type="button" className="btn_type4" onClick={()=>navigate(-1)}>이전 페이지로</button>
                        <button type="button" className="btn_type3" onClick={authBtnClickHandler}>본인인증 하기</button>
                    </div>
                </div>
            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default Signup;