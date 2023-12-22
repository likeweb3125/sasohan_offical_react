import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { PatternFormat } from "react-number-format";
import moment from "moment";
import { enum_api_uri } from "../config/enum";
import * as CF from "../config/function";
import util from "../config/util";
import { confirmPop, loadingPop, profileEditPop, profileEditPopDone } from "../store/popupSlice";
import InputBox from "../components/component/InputBox";
import SearchBox from "../components/component/SearchBox";
import ConfirmPop from "../components/popup/ConfirmPop";
import ranking_tip_box from "../images/ranking_tip_box.svg";
import ranking_tip_box_mo from "../images/ranking_tip_box_mo.svg";
import more_view from "../images/more_view.png";

const Ranking = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const rank_list = enum_api_uri.rank_list;
    const rank_sms = enum_api_uri.rank_sms;
    const rank_done = enum_api_uri.rank_done;
    const rank_token = enum_api_uri.rank_token;
    const [confirm, setConfirm] = useState(false);
    const [tel, setTel] = useState("");
    const [code, setCode] = useState("");
    const [focusInput, setFocusInput] = useState({});
    const [authStep, setAuthStep] = useState(1);
    const [selectList, setSelectList] = useState([{name:"X클래스",val:1},{name:"S클래스",val:2},{name:"A클래스",val:3},{name:"B클래스",val:4},{name:"C클래스",val:5}]);
    const [rank, setRank] = useState("");
    const [listData, setListData] = useState({});
    const [list, setList] = useState([]);
    const [moreBtn, setMoreBtn] = useState(false);
    const [currentPage, setCurrentPage] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [date, setDate] = useState("");
    const [codeBtn, setCodeBtn] = useState(false);
    const [doneBtn, setDoneBtn] = useState(false);
    const [minutes, setMinutes] = useState(3);
    const [seconds, setSeconds] = useState(0);
    const formatTime = (time) => time.toString().padStart(2, '0');
    const [myData, setMyData] = useState(false);
    const [authMyData, setAuthMyData] = useState({});
    const [appPage, setAppPage] = useState(false);
    const token = util.getCookie("token");
    const [searchValue, setSearchValue] = useState("");
    const [classCount, setClassCount] = useState([]);


    // 앱인지 쿠키에있는 토큰값으로 확인하기
    useEffect(()=>{
        if(token){
            setAppPage(true);
        }else{
            setAppPage(false);
        }
    },[token]);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);


    //화면사이즈 변경될때 width 체크---------
    useEffect(() => {
        const handleWindowResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    },[]);


    //인풋 포커스
    const focusHandler = (e,val) => {
        const id = e.target.id;
        let newList = {...focusInput};
        newList[id] = val;
        
        setFocusInput(newList);
    };


    // 랭킹리스트 가져오기
    const getList = (page) => {
        setMyData(false);
        dispatch(loadingPop(true));

        axios.get(`${rank_list}?page_no=${page}${rank && "&rank="+rank}${searchValue && "&m_n_name="+searchValue}`)
        .then((res)=>{
            if(res.status === 200){
                dispatch(loadingPop(false));

                let data = res.data;
                let resultList = data.result;
                setListData(data);

                //첫번째 페이지리스트일때는 값그대로
                if(page === 1){
                    setList(resultList);
                }else{//더보기버튼클릭시 기존리스트값에 새리스트값 추가
                    setList([...list,...resultList]);
                }

                //뒤에 리스트 더있을때만 더보기버튼 노출
                if(data.current_page < data.last_page){
                    setMoreBtn(true);
                }else{
                    setMoreBtn(false);
                }

                //현재페이지번호 저장
                setCurrentPage(data.current_page);

                //랭킹 인원수
                setClassCount(data.class_cnt);
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

    
    //셀렉트값 변경시 랭킹리스트 가져오기
    useEffect(()=>{
        getList(1);

        //현재시간 마지막업데이트시간
        let newDate = new Date();
        newDate = moment(newDate).format("yyyy.MM.DD hh:mm");
        setDate(newDate);
    },[rank]);


    //더보기버튼 클릭시
    const moreHandler = () => {
        //현재페이지번호에 +1 저장
        const num = currentPage+1;
        setCurrentPage(num);

        getList(num);
    };


    //인증번호전송
    const codeSendHandler = () => {
        const body = {
            phone: tel
        }

        axios.post(rank_sms, body)
        .then((res)=>{
            if(res.status === 200){
                setAuthStep(2);
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


    //인증번호확인 타이머
    useEffect(() => {
        if (authStep === 2) {
            const countdown = setInterval(() => {
                setSeconds(prevSeconds => {
                    let updatedSeconds = prevSeconds > 0 ? prevSeconds - 1 : 59;
                    if (updatedSeconds === 59) {
                        setMinutes(prevMinutes => (prevMinutes > 0 ? prevMinutes - 1 : 0));
                    }
    
                    if (updatedSeconds === 0 && minutes === 0) {
                        clearInterval(countdown);

                        setAuthStep(1);
                        setMinutes(3);
                        setSeconds(0);
    
                        dispatch(confirmPop({
                            confirmPop:true,
                            confirmPopTit:'알림',
                            confirmPopTxt:'인증번호 입력시간이 지났습니다. 다시 인증번호를 전송해주세요.',
                            confirmPopBtn:1,
                        }));
                        setConfirm(true);
                    }
    
                    return updatedSeconds;
                });
            }, 1000);
            return () => clearInterval(countdown);
        }
    }, [authStep, minutes]);
    

    //인증완료하기
    const doneHandler = () => {
        dispatch(loadingPop(true));

        const body = {
            phone: tel,
            m_code: code
        }

        axios.post(rank_done, body)
        .then((res)=>{
            if(res.status === 200){
                dispatch(loadingPop(false));

                let data = res.data;
                setList([data]);

                setMyData(true);

                setAuthStep(1);
                setMinutes(3);
                setSeconds(0);
                setCode("");

                //인증한데이터저장
                const authData = {
                    phone: tel,
                    m_code: code,
                    m_n_name: data.m_n_name,
                    photo: data.m_f_photo
                };
                setAuthMyData(authData);
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


    //프로필수정 버튼 클릭시 팝업열기
    const editPopOpenHandler = () => {
        dispatch(profileEditPop({profileEditPop:true,profileEditPopData:authMyData}));
    };


    //프로필수정완료했을때 정보 변경
    useEffect(()=>{
        if(popup.profileEditPopDone){
            const newList = [...list];
            newList[0].m_n_name = popup.profileEditPopDoneData.m_n_name;
            newList[0].m_f_photo = popup.profileEditPopDoneData.m_f_photo;
            setList(newList);

            const newAuthMyData = {...authMyData};
            newAuthMyData.m_n_name = popup.profileEditPopDoneData.m_n_name;
            newAuthMyData.photo = popup.profileEditPopDoneData.m_f_photo;
            setAuthMyData(newAuthMyData);

            dispatch(profileEditPopDone({profileEditPopDone:false,profileEditPopDoneData:{}}));
        }
    },[popup.profileEditPopDone]);


    //앱일때 나의랭킹보기버튼 클릭시
    const myRankHandler = () => {
        dispatch(loadingPop(true));

        const body = {token: token};

        axios.post(rank_token, body)
        .then((res)=>{
            if(res.status === 200){
                dispatch(loadingPop(false));

                let data = res.data;
                setList([data]);

                setMyData(true);
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


    //닉네임 검색하기
    const searchHandler = () => {
        getList(1);
    };

    

    return(<>
        <div className="sub_wrap rankin_wrap">
            <div className="top_banner"></div>
            <div className="inner_cont">
                <div className="tit_box flex_between flex_bottom">
                    <div>
                        <p className="tit">사소한 랭킹</p>
                        <p className="txt">사소한 회원분들의 <br className="mo_show" /><strong>1년 동안의 총 매칭 건수</strong>를 합산하여 <br className="mo_none" />등록된 <strong>사소한 회원만의 특별한 랭킹 시스템</strong>입니다.</p>
                    </div>
                    <div className="tip_box">
                        <p className="tip_txt">사소한 랭킹 산정은 어떻게 하나요?</p>
                        <div className="box">
                            <img src={ranking_tip_box} alt="말풍선이미지" className="tab_none" />
                            <img src={ranking_tip_box_mo} alt="말풍선이미지" className="tab_show" />
                        </div>
                    </div>
                </div>
                {/* 앱아닐때만 노출 */}
                {!appPage &&
                    <div className="auth_box flex_between flex_top">
                        <div className="txt_box">
                            <p className="txt1">회원님의 랭킹이 <br/>궁금하신가요?</p>
                            <p className="txt2">회원가입 시 입력한 연락처 정보를 통해 <br/>회원님의 랭킹을 확인할 수 있습니다.</p>
                        </div>
                        <div className="form_box">
                            <ul>
                                <li className="flex_between">
                                    <p>연락처</p>
                                    <div className="input_btn_box">
                                        <div className={`input_box h_50${focusInput.tel ? " on" : ""}`}>
                                            <PatternFormat format="###-####-####" value={tel} placeholder="숫자만 입력해주세요."
                                                id="tel" 
                                                onChange={(e)=>{
                                                    let val = e.currentTarget.value;
                                                    val = val.replace(/-/g, '');
                                                    val = val.trim();
                                                    setTel(val);

                                                    if(val.length > 10){
                                                        setCodeBtn(true);
                                                    }else{
                                                        setCodeBtn(false);
                                                    }
                                                }}
                                                onFocus={(e)=>{
                                                    focusHandler(e,true);
                                                }}
                                                onBlur={(e)=>{
                                                    focusHandler(e,false);
                                                }}
                                            />
                                        </div>
                                        <button type="button" disabled={codeBtn ? false : true} onClick={codeSendHandler}>인증번호 전송</button>
                                    </div>
                                </li>
                                {authStep === 2 &&
                                    <li className="flex_between">
                                        <p>인증번호</p>
                                        <div className="input_time_box">
                                            <div className={`input_box h_50${focusInput.code ? " on" : ""}`}>
                                                <input type={`text`} value={code} placeholder="인증번호를 입력해주세요."
                                                    id="code" 
                                                    onChange={(e)=>{
                                                        const val = e.currentTarget.value;
                                                        setCode(val);

                                                        if(val.length > 0){
                                                            setDoneBtn(true);
                                                        }else{
                                                            setDoneBtn(false);
                                                        }
                                                    }}
                                                    onFocus={(e)=>{
                                                        focusHandler(e,true);
                                                    }}
                                                    onBlur={(e)=>{
                                                        focusHandler(e,false);
                                                    }}
                                                />
                                            </div>
                                            <span className="time">{formatTime(minutes)}:{formatTime(seconds)}</span>
                                        </div>
                                    </li>
                                }
                            </ul>
                            {authStep === 2 &&
                                <button type="button" className="btn_type1" disabled={doneBtn ? false : true} onClick={doneHandler}>인증완료</button>
                            }
                        </div>
                    </div>
                }
                <div className="rank_box">
                    <p className="tit">사소한 랭킹 클래스</p>
                    <ul className="flex_between">
                        <li>
                            <div className="img_box"><img src={require(`../images/class_img1.png`)} alt="클래스이미지" /></div>
                            <div className="txt_box flex_between">
                                <p><strong>상위 1</strong>%</p>
                                {classCount[0] && <p>{CF.MakeIntComma(classCount[0])} 명</p>}
                            </div>
                        </li>
                        <li>
                            <div className="img_box"><img src={require(`../images/class_img2.png`)} alt="클래스이미지" /></div>
                            <div className="txt_box flex_between">
                                <p>상위 <strong>10</strong>%</p>
                                {classCount[1] && <p>{CF.MakeIntComma(classCount[1])} 명</p>}
                            </div>
                        </li>
                        <li>
                            <div className="img_box"><img src={require(`../images/class_img3.png`)} alt="클래스이미지" /></div>
                            <div className="txt_box flex_between">
                                <p>상위 <strong>30</strong>%</p>
                                {classCount[2] && <p>{CF.MakeIntComma(classCount[2])} 명</p>}
                            </div>
                        </li>
                        <li>
                            <div className="img_box"><img src={require(`../images/class_img4.png`)} alt="클래스이미지" /></div>
                            <div className="txt_box flex_between">
                                <p>상위 <strong>60</strong>%</p>
                                {classCount[3] && <p>{CF.MakeIntComma(classCount[3])} 명</p>}
                            </div>
                        </li>
                        <li>
                            <div className="img_box"><img src={require(`../images/class_img5.png`)} alt="클래스이미지" /></div>
                            <div className="txt_box flex_between">
                                <p>상위 <strong>100</strong>%</p>
                                {classCount[4] && <p>{CF.MakeIntComma(classCount[4])} 명</p>}
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="list_box">
                    <div className="top_box flex_between">
                        <p>Last Update <span>{date}</span></p>
                        <div className="sel_box flex">
                            {/* 앱일때만 노출 */}
                            {appPage &&
                                <button type="button" className="s_btn_type1 rm10" onClick={myRankHandler}>나의 랭킹 보기</button>
                            }
                            <div className="flex">
                                <div className="input_box3">
                                    <select 
                                        value={rank}
                                        onChange={(e)=>{
                                            const val = e.currentTarget.value;
                                            setRank(val);
                                        }}
                                    >
                                        <option value=''>클래스 전체</option>
                                        {selectList.map((cont,i)=>{
                                            return(
                                                <option value={cont.val} key={i}>{cont.name}</option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <SearchBox 
                                    type="text"
                                    placeholder="닉네임을 검색하세요."
                                    inputClass="input_box2 h_50"
                                    value={searchValue}
                                    onChangeHandler={(e)=>{
                                        const val = e.currentTarget.value;
                                        setSearchValue(val);
                                    }}
                                    onSearchHandler={searchHandler}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="ul_box">
                        <ul className="top_ul">
                            <li>순위</li>
                            <li>{windowWidth > 767 ? "레벨" : "닉네임 / 클래스 / 레벨"}</li>
                            <li>닉네임</li>
                            <li>클래스</li>
                        </ul>
                        <ul className="list_ul">
                            {list.map((cont,i)=>{
                                const rank = cont.rank;
                                const diff = cont.diff_rank;
                                let diff_num = cont.diff_rank;
                                let tag;

                                //순위
                                if(diff == 0){
                                    tag = "";
                                }else{
                                    if(diff.includes("-")){
                                        tag = " down";
                                        diff_num = diff_num.replace("-","");
                                    }else{
                                        tag = " up";
                                    }
                                }

                                if(diff_num > 9999){
                                    diff_num = 9999;
                                }

                                let isClass = false;
                                if(cont.class_number > 0){
                                    isClass = true;
                                }

                                let myPhoto = false;
                                if(cont.m_f_photo != null){
                                    myPhoto = true;
                                }

                                return(
                                    <li key={i} className={`${rank < 4 ? "top" : ""}`}>
                                        <div className="box rank_box flex_center">
                                            <div className="flex_center">
                                                {rank < 4 && <img src={require(`../images/medal_${rank}.svg`)} alt="메달이미지" />}
                                                <p>{CF.MakeIntComma(rank)}<span>위</span></p>
                                            </div>
                                            <div className={`tag flex_center${tag}`}><span>{tag.length > 0 ? CF.MakeIntComma(diff_num) : "-"}</span></div>
                                        </div>
                                        <div className={`box name_box${myData ? " my_data" : ""}`}>
                                            <div className="inner_box flex_start flex_wrap">
                                                <div className="flex_top">
                                                    <div className="img">
                                                        {myData && myPhoto ?
                                                            <img src={cont.m_f_photo} alt="프로필이미지" />
                                                            :<img src={require(`../images/random_profile${cont.profile_num}.svg`)} alt="랜덤프로필이미지" />
                                                        }
                                                    </div>
                                                    <p className={`name${cont.M_N_Name_modify === 1 ? ' color_black' : ''}`}>{cont.m_n_name}</p>
                                                </div>
                                                {myData &&
                                                    <div className="flex_between">
                                                        <div className="my_box flex_wrap">
                                                            <p>{cont.m_name}</p>
                                                            <p>{cont.m_address} / {cont.birth}</p>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                            <div className="mo_show">
                                                <ul className="flex_wrap">
                                                    {isClass && <li><img src={require(`../images/class_img${cont.class_number}.png`)} alt="클래스이미지" /></li>}
                                                    <li className="flex">
                                                        <span>LV.</span>
                                                        <p>{CF.MakeIntComma(cont.level)}</p>
                                                    </li>
                                                </ul>
                                                {myData && !token && <button type="button" className="btn_edit tm5" onClick={editPopOpenHandler}>프로필 수정</button>}
                                            </div>
                                            {myData && !token && <button type="button" className="btn_edit mo_none" onClick={editPopOpenHandler}>프로필 수정</button>}
                                        </div>
                                        <div className="box class_box flex_center">
                                            {isClass && <img src={require(`../images/class_img${cont.class_number}.png`)} alt="클래스이미지" />}
                                        </div>
                                        <div className="box level_box flex_center">
                                            <span>LV.</span>
                                            <p>{CF.MakeIntComma(cont.level)}</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    {!myData && moreBtn &&
                        <div className="btn_box">
                            <button type="button"><img src={more_view} alt="이미지" onClick={moreHandler} /></button>
                        </div>
                    }
                </div>
            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default Ranking;