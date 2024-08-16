import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { enum_api_uri } from "../../config/enum";
import * as CF from "../../config/function";
import { detailPageBack, listPageData, scrollY } from "../../store/etcSlice";
import { confirmPop, loadingPop } from "../../store/popupSlice";
import ConfirmPop from "../../components/popup/ConfirmPop";
import ListTopTitleBox from "../../components/component/square/ListTopTitleBox";
import ListSearchBox from "../../components/component/square/ListSearchBox";
import ListCont from "../../components/component/square/ListCont";
import tip_box_img from "../../images/tip_box.svg";
import tip_box_img_mo from "../../images/tip_box_mo.svg";



const ManagerList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const manager_list = enum_api_uri.manager_list;
    const manager_favorite = enum_api_uri.manager_favorite;
    const popup = useSelector((state)=>state.popup);
    const user = useSelector((state)=>state.user);
    const common = useSelector((state)=>state.common);
    const etc = useSelector((state)=>state.etc);
    const [confirm, setConfirm] = useState(false);
    const [loginConfirm, setLoginConfirm] = useState(false);
    const [typeCheck, setTypeCheck] = useState('C');
    const [sortTabOn, setSortTabOn] = useState(1);
    const [likeCheck, setLikeCheck] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [managerList, setManagerList] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [moreBtn, setMoreBtn] = useState(false);
    const [scrollMove, setScrollMove] = useState(false);
    const [pageBack, setPageBack] = useState(false);
    const userLogin = Cookies.get('userLogin') === 'true'; // 'true' 문자열과 비교;
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get('page');
    const type = searchParams.get('type');
    const sort = searchParams.get('sort');
    const favorite = searchParams.get('favorite');
    const search = searchParams.get('search');
    const more = searchParams.get('more');


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
            setLoginConfirm(false);
        }
    },[popup.confirmPop]);


    //상세->목록으로 뒤로가기시 저장되었던 스크롤위치로 이동
    useEffect(()=>{
        if(scrollMove){
            const y = etc.scrollY;
            // window.scrollTo(0,y); 
        }
    },[scrollMove]);


    useEffect(()=>{
        const fetchData = async () => {
            for(let i = 1; i <= page; i++) {
                const isLast = i === page;
                await getManagerList(i,true,isLast);
            }
        };
        if(page && page > 1){
            fetchData();
        }else{
            getManagerList();
        }
    },[location]);


    useEffect(()=>{
        if(type){
            setTypeCheck(type);
        }else{
            setTypeCheck('C');
        }
    },[type]);


    useEffect(()=>{
        if(sort){
            setSortTabOn(sort);
        }else{
            setSortTabOn(1);
        }
    },[sort]);


    useEffect(()=>{
        if(favorite && favorite == 1){
            setLikeCheck(true);
        }else{
            setLikeCheck(false);
        }
    },[favorite]);


    useEffect(()=>{
        if(search){
            setSearchValue(search);
        }else{
            setSearchValue('');
        }
    },[search]);

    



    //매니저 리스트 가져오기
    const getManagerList = async (pageNum,more,isLast) => {
        dispatch(loadingPop(true));


        //내가누른 좋아요보기 체크시 or 로그인시에만 헤더값 넣기
        let headers = {};
        if(likeCheck || userLogin){
            headers = {
                Authorization: `Bearer ${user.userToken}`,
            }
        }

        try {
            const res = await axios.get(`${manager_list}?page_no=${pageNum ? pageNum : 1}${type ? '&type='+type : '&type=C'}${sort && sort == 2 ? '&sort=favorite' : ''}${favorite && favorite == 1 ? '&favorite=1' : ''}${search ? '&search='+search : ''}`,{
                headers: headers,
            });
            if(res.status === 200){
                dispatch(loadingPop(false));

                const data = res.data;
                //더보기버튼 클릭시에만 리스트 추가
                if(more){
                    setManagerList(prevManagerList => [...prevManagerList, ...data.result]);
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

                //상세페이지에서 뒤로가기시
                if(isLast){
                    // setScrollMove(true);
                    // dispatch(detailPageBack(false));
                }
            }
        } catch (error) {
            dispatch(loadingPop(false));
    
            const err_msg = CF.errorMsgHandler(error);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: err_msg,
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }
    };


    //매니저타입 체크시
    const typeCheckHandler = (type) => {
        setTypeCheck(type);
        setPageBack(false);
        if(type){
            searchParams.set('type',type);
        }else{
            searchParams.append('type',type);
        }
        searchParams.delete('page');
        setSearchParams(searchParams);
    };


    //정렬 탭 클릭시
    const sortTabClickHandler = (idx) => {
        setSortTabOn(idx);

        if(sort){
            searchParams.set('sort',idx);
        }else{
            searchParams.append('sort',idx);
        }
        setSearchParams(searchParams);
    };


    //내가 누른 좋아요만보기 체크박스 클릭시
    const likeCheckClickHandler = (checked) => {
        if(checked){
            setLikeCheck(true);
            if(favorite){
                searchParams.set('favorite',1);
            }else{
                searchParams.append('favorite',1);
            }
            if(page){
                searchParams.set('page',1);
            }else{
                searchParams.append('page',1);
            }
            setSearchParams(searchParams);
        }else{
            setLikeCheck(false);
            if(favorite){
                searchParams.set('favorite',0);
            }else{
                searchParams.append('favorite',0);
            }
            if(page){
                searchParams.set('page',1);
            }else{
                searchParams.append('page',1);
            }
            setSearchParams(searchParams);
        }
    };


    //검색어입력값 변경시
    const searchInputChangeHandler = (val) => {
        setSearchValue(val);
    };


    //검색하기버튼 클릭시
    const searchHandler = () => {
        if(searchValue.length > 0){
            if(search){
                searchParams.set('search',searchValue);
            }else{
                searchParams.append('search',searchValue);
            }
        }else{
            searchParams.delete('search');
        }
        setSearchParams(searchParams);
    };


    //더보기버튼 클릭시 다음페이지 리스트 가져오기
    const moreBtnHandler = () => {
        const pageNum = pageNo + 1;
        if(page){
            searchParams.set('page',pageNum);
        }else{
            searchParams.append('page',pageNum);
        }
        if(more){
            
        }
        setSearchParams(searchParams);
    };


    //매니저 좋아요하기
    const likeBtnClickHandler = (m_id) => {
        //로그인시에만 가능
        if(userLogin){
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


    //매니저클릭시 해당매니저상세페이지로 이동
    const managerClickHandler = (id) => {
        setPageBack(false);
        dispatch(scrollY(window.scrollY)); //현재스크롤위치 저장
        navigate('/square/manager/'+id);
    };


    
    return(<>
        <div className="square_list_wrap gray_wrap">
            <div className="cont4">
                <ListTopTitleBox
                    tit='사소한 매니저'
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