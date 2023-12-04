import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { PatternFormat } from "react-number-format";

import { enum_api_uri } from "../config/enum";
import * as CF from "../config/function";
import { confirmPop } from "../store/popupSlice";
import ConfirmPop from "../components/popup/ConfirmPop";

import ranking_tip_box from "../images/ranking_tip_box.svg";
import ranking_tip_box_mo from "../images/ranking_tip_box_mo.svg";
import more_view from "../images/more_view.png";

const Ranking = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const rank_list = enum_api_uri.rank_list;
    const [confirm, setConfirm] = useState(false);
    const [tel, setTel] = useState("");
    const [number, setNumber] = useState("");
    const [focusInput, setFocusInput] = useState({});
    const [authStep, setAuthStep] = useState(1);
    const [selectList, setSelectList] = useState([{name:"X클래스",val:1},{name:"SS클래스",val:2},{name:"S클래스",val:3},{name:"A클래스",val:4},{name:"B클래스",val:5}]);
    const [rank, setRank] = useState("");
    const [listData, setListData] = useState({});
    const [list, setList] = useState([]);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);


    //인풋 포커스
    const focusHandler = (e,val) => {
        const id = e.target.id;
        let newList = {...focusInput};
        newList[id] = val;
        
        setFocusInput(newList);
    };


    const getList = () => {
        axios.get(rank_list)
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                let list = data.result;
                setListData(data);
                setList(list);
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

    
    useEffect(()=>{
        getList();
    },[]);



    return(<>
        <div className="rankin_wrap">
            <div className="top_banner"></div>
            <div className="inner_cont">
                <div className="tit_box flex_between flex_bottom">
                    <div>
                        <p className="tit">사소한 랭킹</p>
                        <p className="txt">사소한 회원분들의 <strong>1년 동안의 총 매칭 건수</strong>를 합산하여 <br/>등록된 <strong>사소한 회원만의 특별한 랭킹 시스템</strong>입니다.</p>
                    </div>
                    <div className="tip_box">
                        <p className="tip_txt">사소한 랭킹 산정은 어떻게 하나요?</p>
                        <div className="box">
                            <img src={ranking_tip_box} alt="말풍선이미지" className="mo_none" />
                            <img src={ranking_tip_box_mo} alt="말풍선이미지" className="mo_show" />
                        </div>
                    </div>
                </div>
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
                                    <div className={`input_box${focusInput.tel ? " on" : ""}`}>
                                        <PatternFormat format="###-####-####" value={tel} placeholder="숫자만 입력해주세요."
                                            id="tel" 
                                            onChange={(e)=>{
                                                const val = e.currentTarget.value;
                                                setTel(val);
                                            }}
                                            onFocus={(e)=>{
                                                focusHandler(e,true);
                                            }}
                                            onBlur={(e)=>{
                                                focusHandler(e,false);
                                            }}
                                        />
                                    </div>
                                    <button type="button" disabled>인증번호 전송</button>
                                </div>
                            </li>
                            {authStep === 2 &&
                                <li className="flex_between">
                                    <p>인증번호</p>
                                    <div className="input_time_box">
                                        <div className={`input_box${focusInput.number ? " on" : ""}`}>
                                            <input type={`text`} value={number} placeholder="인증번호를 입력해주세요."
                                                id="number" 
                                                onChange={(e)=>{
                                                    const val = e.currentTarget.value;
                                                    setNumber(val);
                                                }}
                                                onFocus={(e)=>{
                                                    focusHandler(e,true);
                                                }}
                                                onBlur={(e)=>{
                                                    focusHandler(e,false);
                                                }}
                                            />
                                        </div>
                                        <span className="time">05:00</span>
                                    </div>
                                </li>
                            }
                        </ul>
                        {authStep === 2 &&
                            <button type="button" className="btn_type1" disabled>인증완료</button>
                        }
                    </div>
                </div>
                <div className="list_box">
                    <div className="top_box flex_between">
                        <p>Last Update <span>2023.11.29 11:34:01</span></p>
                        <div className="input_box3">
                            <select 
                                value={rank}
                                onChange={(e)=>{
                                    const val = e.currentTarget.value;
                                    setRank(val);
                                }}
                            >
                                <option value='' hidden>나이를 선택해주세요.</option>
                                {selectList.map((cont,i)=>{
                                    return(
                                        <option value={cont.val} key={i}>{cont.name}</option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="table_box">
                        <table>
                            <colgroup>
                                <col style={{"width":"auto"}} />
                                <col style={{"width":"20px"}} />
                                <col style={{"width":"auto"}} />
                                <col style={{"width":"20px"}} />
                                <col style={{"width":"auto"}} />
                                <col style={{"width":"20px"}} />
                                <col style={{"width":"auto"}} />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>순위</th>
                                    <th></th>
                                    <th>레벨</th>
                                    <th></th>
                                    <th>닉네임</th>
                                    <th></th>
                                    <th>클래스</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map((cont,i)=>{
                                    const rank = cont.rank;
                                    return(
                                        <tr key={i}>
                                            <td className={`rank_td${rank < 4 ? " top" : ""}`}>
                                                <div className="flex_center">
                                                    {rank < 4 && <img src={require(`../images/medal_${rank}.svg`)} alt="메달이미지" />}
                                                    <p>{rank} 위</p>
                                                    <span>-</span>
                                                </div>
                                            </td>
                                            <td></td>
                                            <td className="level_td">
                                                <div className="flex_center">
                                                    <span>LV.</span>
                                                    <p>900</p>
                                                </div>
                                            </td>
                                            <td></td>
                                            <td className="name_td">
                                                <div className="flex">
                                                    <img src="" alt="성별이미지" />
                                                    <p>라이크웹</p>
                                                </div>
                                            </td>
                                            <td></td>
                                            <td>
                                                <div>
                                                    <img src="" alt="클래스이미지" />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="btn_box">
                        <button type="button"><img src={more_view} alt="이미지" /></button>
                    </div>
                </div>
            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default Ranking;