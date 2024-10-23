import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import axios from "axios";
import { enum_api_uri } from "../../config/enum";
import * as CF from "../../config/function";
import { confirmPop } from "../../store/popupSlice";
import ConfirmPop from "../../components/popup/ConfirmPop";


const ListDetail = () => {
    const { list_no } = useParams();
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const [confirm, setConfirm] = useState(false);
    const m_list_detail = enum_api_uri.m_list_detail;
    const [data, setData] = useState("");


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);


    //상세정보 가져오기
    const getData = () => {
        axios.get(m_list_detail.replace(":list_no",list_no))
        .then((res)=>{
            if(res.status === 200){
                setData(res.data.contents);
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


    useEffect(()=>{
        getData();
    },[list_no]);



    return(<>
        <div className="detail_wrap" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data) }}></div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}  
    </>);
};

export default ListDetail;