import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { enum_api_uri } from "../../config/enum";
import * as CF from "../../config/function";
import { confirmPop } from "../../store/popupSlice";
import ConfirmPop from "../../components/popup/ConfirmPop";
import ListTopTitleBox from "../../components/component/square/ListTopTitleBox";
import ListSearchBox from "../../components/component/square/ListSearchBox";
import ListCont from "../../components/component/square/ListCont";
import tip_box_img from "../../images/tip_box.svg";
import tip_box_img_mo from "../../images/tip_box_mo.svg";


const ManagerList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const manager_list = enum_api_uri.manager_list;
    const manager_favorite = enum_api_uri.manager_favorite;
    const popup = useSelector((state)=>state.popup);
    const user = useSelector((state)=>state.user);
    const [confirm, setConfirm] = useState(false);
    const [loginConfirm, setLoginConfirm] = useState(false);
    const [typeCheck, setTypeCheck] = useState('C');
    const [sortTabOn, setSortTabOn] = useState(1);
    const [likeCheck, setLikeCheck] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [managerList, setManagerList] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [moreBtn, setMoreBtn] = useState(false);



    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
            setLoginConfirm(false);
        }
    },[popup.confirmPop]);


    //매니저 리스트 가져오기
    const getManagerList = (page, more, search) => {
        //내가누른 좋아요보기 체크시 or 로그인시에만 헤더값 넣기
        let headers = {};
        if(likeCheck || user.userLogin){
            headers = {
                Authorization: `Bearer ${user.userToken}`,
            }
        }

        axios.get(`${manager_list}?page_no=${page ? page : 1}${'&type='+typeCheck}${sortTabOn === 2 ? '&sort=favorite' : ''}${likeCheck ? '&favorite=1' : ''}${search ? '&search='+searchValue : ''}`,{
            headers: headers,
        })
        .then((res)=>{
            if(res.status === 200){
                const data = res.data;
                //더보기버튼 클릭시에만 리스트 추가
                if(more){
                    setManagerList([...managerList,...data.result]);
                }else{
                    setManagerList(data.result);
                }

                // 현재페이지번호 저장
                setPageNo(data.current_page);

                //리스트가 더있으면 more 버튼 보이기
                if(data.current_page < data.end_page){
                    setMoreBtn(true);
                }else{
                    setMoreBtn(false);
                }
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


    //매니저 리스트 가져오기
    useEffect(()=>{
        getManagerList();
    },[typeCheck, sortTabOn, likeCheck]);


    //매니저타입 체크시
    const typeCheckHandler = (type) => {
        setTypeCheck(type);
    };


    //정렬 탭 클릭시
    const sortTabClickHandler = (idx) => {
        setSortTabOn(idx);
    };


    //내가 누른 좋아요만보기 체크박스 클릭시
    const likeCheckClickHandler = () => {
        setLikeCheck(!likeCheck);
    };


    //검색어입력값 변경시
    const searchInputChangeHandler = (val) => {
        setSearchValue(val);
    };


    //검색하기버튼 클릭시
    const searchHandler = () => {
        if(searchValue.length > 0){
            getManagerList(pageNo, false, true);
        }else{
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'검색어를 입력해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }
    };


    //더보기버튼 클릭시 다음페이지 리스트 가져오기
    const moreBtnHandler = () => {
        getManagerList(pageNo + 1, true);
    };


    //매니저 좋아요하기
    const likeBtnClickHandler = (m_id) => {
        //로그인시에만 가능
        if(user.userLogin){
            const body = {
                m_id:m_id
            };
            axios.post(manager_favorite,body,{
                headers: {
                    Authorization: `Bearer ${user.userToken}`,
                },
            })
            .then((res)=>{
                if(res.status === 200){
                    const data = res.data;
                    const flag = data.flag;
                    let count;
                    const list = [...managerList];
                    const index = list.findIndex((item)=>item.manager_id == m_id);
                    const newManagerList = list;

                    if(flag){
                        count = newManagerList[index].fv_cnt+1;
                    }else{
                        count = newManagerList[index].fv_cnt-1;
                    }

                    newManagerList[index].fv_cnt = count;
                    newManagerList[index].fv_flag = flag;
                    setManagerList(newManagerList);
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
        }else{
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'로그인을 해주세요.',
                confirmPopBtn:2,
            }));
            setLoginConfirm(true);
        }
    };


    //페이지 제목안에 팁박스
    const tipBox =  <div className="tip_box tab_none">
                        <p className="tip_txt">매니저가 뭔가요?</p>
                        <div className="box">
                            <img src={tip_box_img} alt="말풍선이미지" className="mo_none" />
                            <img src={tip_box_img_mo} alt="말풍선이미지" className="mo_show" />
                        </div>
                    </div>;


    //매니저클릭시 해당매니저상세페이지로 이동
    const managerClickHandler = (id) => {
        navigate('/square/manager/'+id);
    };


    
    return(<>
        <div className="square_list_wrap gray_wrap">
            <div className="cont4">
                <ListTopTitleBox
                    tit='사소한 매니저'
                    txt='성공적인 만남을 위한 사소한 매니저들을 소개합니다!'
                    tipBox={tipBox}
                />
                <ListSearchBox
                    managerType={true}
                    typeCheck={typeCheck}
                    typeCheckHandler={typeCheckHandler}
                    sortTabOn={sortTabOn}
                    sortTabClickHandler={sortTabClickHandler}
                    likeCheck={likeCheck}
                    likeCheckClickHandler={likeCheckClickHandler}
                    searchValue={searchValue}
                    searchInputChangeHandler={searchInputChangeHandler}
                    searchHandler={searchHandler}
                />
                <ListCont 
                    list={managerList}
                    moreBtn={moreBtn}
                    moreBtnHandler={moreBtnHandler}
                    moreBtnTxt='매니저'
                    likeBtnClickHandler={likeBtnClickHandler}
                    managerClickHandler={managerClickHandler}
                />
            </div>
        </div>

        {/* 미로그인시 로그인 confirm팝업 */}
        {loginConfirm && <ConfirmPop onClickHandler={()=>navigate('/member/login')}/>}

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default ManagerList;