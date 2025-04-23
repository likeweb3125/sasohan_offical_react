import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { enum_api_uri } from "../config/enum";
import * as CF from "../config/function";
import { confirmPop } from "../store/popupSlice";
import ConfirmPop from "../components/popup/ConfirmPop";
import { Link, useParams } from "react-router-dom";
import terms_img from "../images/terms_img.jpg";

const Terms = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state) => state.popup);
    const policy_cont = enum_api_uri.policy_cont;
    const [tabOn, setTabOn] = useState(null);
    const [confirm, setConfirm] = useState(false);
    const [terms, setTerms] = useState({});
    const { terms_tit } = useParams();

    // Confirm팝업 닫힐때
    useEffect(() => {
        if (popup.confirmPop === false) {
            setConfirm(false);
        }
    }, [popup.confirmPop]);

    //약관내용 가져오기
    const getTerms = (idx) => {
        if (idx === 0) return;
        axios
            .get(`${policy_cont.replace(":policy_type", idx)}`)
            .then((res) => {
                if (res.status === 200) {
                    let data = res.data;
                    setTerms({ ...data });
                }
            })
            .catch((error) => {
                const err_msg = CF.errorMsgHandler(error);
                dispatch(
                    confirmPop({
                        confirmPop: true,
                        confirmPopTit: "알림",
                        confirmPopTxt: err_msg,
                        confirmPopBtn: 1,
                    })
                );
                setConfirm(true);
            });
    };

    useEffect(() => {
        let idx;
        if (terms_tit == "privacy-policy") {
            //개인정보 보호정책
            idx = 1;
        } else if (terms_tit == "personal-information-collection") {
            //개인정보수집
            idx = 3;
        } else if (terms_tit == "terms-of-use") {
            //이용약관
            idx = 4;
        } else if (terms_tit == "insurance-claim-procedure") {
            //보증보험증권에 의한 손해보상 청구절차
            idx = 0;
        }
        setTabOn(idx);
        getTerms(idx);
    }, [terms_tit]);

    return (
        <>
            <div className="sub_wrap terms_wrap">
                <div className="top_banner"></div>
                <div className="inner_cont">
                    <div className="tit_box">
                        <p className="tit">서비스 약관</p>
                    </div>
                    <div className="round_box">
                        <ul className="tab_box flex_wrap">
                            <li className={tabOn === 1 ? "on" : ""}>
                                <Link to={"/terms/privacy-policy"}>
                                    개인정보 보호정책
                                </Link>
                            </li>
                            <li className={tabOn === 3 ? "on" : ""}>
                                <Link
                                    to={
                                        "/terms/personal-information-collection"
                                    }
                                >
                                    개인정보수집
                                </Link>
                            </li>
                            <li className={tabOn === 4 ? "on" : ""}>
                                <Link to={"/terms/terms-of-use"}>이용약관</Link>
                            </li>
                            <li className={tabOn === 0 ? "on" : ""}>
                                <Link to={"/terms/insurance-claim-procedure"}>
                                    보증보험증권에 의한 손해보상 청구절차
                                </Link>
                            </li>
                        </ul>
                        {tabOn === 0 ? (
                            <div className="txt_box">
                                {`보증보험금 지급\r\n\r\n- 국내결혼중개업자는 결혼중개를 함에 있어서 고의 또는 과실로 인하여 결혼중개업 이용자(이하 이용자 라 함)에게 손해를 발생하게 한 때에는 그 손해를 배상할 책임이 있으며, 손해배상을 하지 아니한 경우에는 보증보험금의 지급을 청구할 수 있습니다.`}
                                <img src={terms_img} alt="보험금청구절차" />
                            </div>
                        ) : (
                            <div className="txt_box">{terms.contents_p}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* confirm팝업 */}
            {confirm && <ConfirmPop />}
        </>
    );
};

export default Terms;
