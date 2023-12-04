

import { useState } from "react";
import { PatternFormat } from "react-number-format";
import ranking_tip_box from "../images/ranking_tip_box.svg";
import ranking_tip_box_mo from "../images/ranking_tip_box_mo.svg";

const Ranking = () => {
    const [tel, setTel] = useState("");
    const [number, setNumber] = useState("");
    const [focusInput, setFocusInput] = useState({});
    const [authStep, setAuthStep] = useState(1);
    const [selectList, setSelectList] = useState([{name:"X클래스",val:1},{name:"SS클래스",val:2},{name:"S클래스",val:3},{name:"A클래스",val:4},{name:"B클래스",val:5}]);
    const [rank, setRank] = useState(null);
    const [listData, setListData] = useState({});
    const [list, setList] = useState([]);

    const focusHandler = (e,val) => {
        const id = e.target.id;
        let newList = {...focusInput};
        newList[id] = val;
        
        setFocusInput(newList);
    };




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
                    <div>
                        <table>
                            <colgroup>
                                <col style={{"width":"auto"}} />
                                <col style={{"width":"auto"}} />
                                <col style={{"width":"auto"}} />
                                <col style={{"width":"auto"}} />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>순위</th>
                                    <th>레벨</th>
                                    <th>닉네임</th>
                                    <th>클래스</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="flex">
                                            <p>1 위</p>
                                            <span>-</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </>);
};

export default Ranking;