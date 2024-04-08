
const MyProfileForm2 = (
    {
        allAreaCheck,
        onAllAreaCheckHandler,
        areaList,
        areaList2,
        area,
        area2,
        onAreaChangeHandler,
        onArea2ChangeHandler,
        areaSelectList,
        onAreaDeltHandler,
        values,
        error,
        onInputChangeHandler,
        heightList,
        selectList,
        visualList,
        visual2,
        setVisual2,
        mbtiList,
        type2,
        typeCheck,
        smokList,
        smok2,
        setSmok2,
        drinkList,
        drink2,
        setDrink2,
    }
    ) => {
    return(<>
        <li>
            <p className="color_black2 bp10">선호 지역 <span className="color_point">*</span></p>
            <div className="custom_check">
                <label>
                    <input type={`checkbox`}
                        onChange={(e)=>{
                            const checked = e.currentTarget.checked;
                            onAllAreaCheckHandler(checked);
                        }} 
                        checked={allAreaCheck}
                    />
                    <span className="check">체크박스</span>
                    <span className="txt f_16 medium">전지역</span>
                </label>
            </div>
            <div className="address_box flex_between">
                <div className={`input_box f_18 light${error.area ? " error" : ""}`}>
                    <select 
                        value={area} 
                        onChange={(e)=>{
                            onAreaChangeHandler(e);
                        }}
                        className={area.length > 0 ? 'selected' : ''}
                    >
                        <option value='' hidden disabled>시/도</option>
                        {areaList.map((cont, i)=>{
                            return(
                                <option value={cont.sido_gugun} key={i} data-code={cont.local_code}>{cont.sido_gugun}</option>
                            );
                        })}
                    </select>
                </div>
                <div className={`input_box f_18 light${error.area ? " error" : ""}`}>
                    <select 
                        value={area2} 
                        onChange={(e)=>{
                            onArea2ChangeHandler(e);
                        }}
                        className={area2.length > 0 ? 'selected' : ''}
                    >
                        <option value='' hidden disabled>구</option>
                        {areaList2.map((cont, i)=>{
                            return(
                                <option value={cont.sido_gugun} key={i}>{cont.sido_gugun}</option>
                            );
                        })}
                    </select>
                </div>
            </div>
            <div className="addr_list_box">
                <ul className="flex_wrap">
                    {areaSelectList.map((cont,i)=>{
                        return(
                            <li key={i}><span>{cont}</span><button type="button" className="btn_delt" onClick={()=>{onAreaDeltHandler(i)}}>삭제버튼</button></li>
                        );
                    })}
                </ul>
                {areaSelectList.length === 0 ? <p className="txt">&lt;전지역&gt;으로 필수 설정되어 있습니다. <br/>지역을 선택하여 만남을 진행하고 싶으시다면 지역을 선택해주세요!</p>
                    :   areaSelectList.length > 2 ? <p className="txt">선호 지역을 다 선택했어요!</p>
                    :   <p className="txt">선호지역은 최소 3개를 선택해주세요.</p>
                }
            </div>
        </li>
        <li>
            <p className="color_black2">키 <span className="color_point">*</span></p>
            <div className={`input_box f_18 light${error.t_height1 ? " error" : ""}`}>
                <select 
                    value={values.t_height1 || ''} 
                    onChange={(e)=>{
                        onInputChangeHandler(e);
                    }}
                    className={values.t_height1 && values.t_height1.length > 0 ? 'selected' : ''}
                    id={`t_height1`}
                >
                    <option value='' hidden disabled>상대방의 키를 선택해주세요.</option>
                    {heightList.map((cont, i)=>{
                        return(
                            <option value={cont.val} key={i}>{cont.txt}</option>
                        );
                    })}
                </select>
            </div>
        </li>
        <li>
            <p className="color_black2">직업 <span className="color_point">*</span></p>
            <div className={`input_box f_18 light${error.t_job ? " error" : ""}`}>
                <select 
                    value={values.t_job || ''} 
                    onChange={(e)=>{
                        onInputChangeHandler(e);
                    }}
                    className={values.t_job && values.t_job.length > 0 ? 'selected' : ''}
                    id={`t_job`}
                >
                    <option value='' hidden disabled>상대방의 직업을 선택해주세요.</option>
                    {selectList && selectList.job && selectList.job.map((cont, i)=>{
                        return(
                            <option value={cont.name} key={i}>{cont.name}</option>
                        );
                    })}
                </select>
            </div>
        </li>
        <li>
            <p className="color_black2">상대방 외모 점수 <span className="color_point">*</span></p>
            <ul className="flex_wrap sel_list_box5 tp10">
                {visualList.map((cont,i)=>{
                    return(
                        <li key={i} className="custom_radio4">
                            <label htmlFor={`visual2_${cont}`}>
                                <input type={"radio"} id={`visual2_${cont}`}
                                    checked={cont == visual2}
                                    onChange={()=>{
                                        setVisual2(cont);
                                    }}
                                />
                                <span className="txt">{`${cont}점`}</span>
                            </label>
                        </li>
                    );
                })}
            </ul>
        </li>
        <li>
            <p className="color_black2">상대방의 MBTI <span className="color_point">*</span></p>
            <div className={`input_box f_18 light${error.t_mbti ? " error" : ""}`}>
                <select 
                    value={values.t_mbti || ''} 
                    onChange={(e)=>{
                        onInputChangeHandler(e);
                    }}
                    className={values.t_mbti && values.t_mbti.length > 0 ? 'selected' : ''}
                    id={`t_mbti`}
                >
                    <option value='' hidden disabled>상대방의 MBTI를 선택해주세요.</option>
                    {mbtiList.map((cont, i)=>{
                        return(
                            <option value={cont} key={i}>{cont}</option>
                        );
                    })}
                </select>
            </div>
        </li>
        <li>
            <p className="color_black2">상대방의 타입 <span className="color_point">*</span></p>
            <p className="f_14 color_gray tp10">아래 각 항목 중 <span className="color_point">3개씩</span> 선택해 볼까요?</p>
            <ul className="flex_wrap sel_list_box3 tp12">
                {selectList && selectList.character && selectList.character.map((cont,i)=>{
                    return(
                        <li key={i} className="custom_radio4">
                            <label htmlFor={`character2_${i}`}>
                                <input type={"checkbox"} id={`character2_${i}`} 
                                    checked={type2.includes(cont.name) ? true : false}
                                    onChange={(e)=>{
                                        typeCheck(e.currentTarget.checked, cont.name, false);
                                    }}
                                />
                                <span className="txt">{cont.name}</span>
                            </label>
                        </li>
                    );
                })}
            </ul>
        </li>
        <li>
            <p className="color_black2">흡연 여부 <span className="color_point">*</span></p>
            <ul className="flex_between tp18 bp18">
                {smokList.map((cont,i)=>{
                    return(
                        <li key={i} className="custom_radio5">
                            <label htmlFor={`smok2_${cont.val}`}>
                                <input type={"checkbox"} id={`smok2_${cont.val}`} 
                                    checked={cont.val === smok2}
                                    onChange={()=>{
                                        setSmok2(cont.val);
                                    }}
                                />
                                <span className="box"></span>
                                <span className="txt">{cont.txt}</span>
                            </label>
                        </li>
                    );
                })}
            </ul>
        </li>
        <li>
            <p className="color_black2">음주 여부 <span className="color_point">*</span></p>
            <ul className="flex_between tp18 bp18">
                {drinkList.map((cont,i)=>{
                    return(
                        <li key={i} className="custom_radio5">
                            <label htmlFor={`drink2_${cont.val}`}>
                                <input type={"checkbox"} id={`drink2_${cont.val}`} 
                                    checked={cont.val === drink2}
                                    onChange={()=>{
                                        setDrink2(cont.val);
                                    }}
                                />
                                <span className="box"></span>
                                <span className="txt">{cont.txt}</span>
                            </label>
                        </li>
                    );
                })}
            </ul>
        </li>
        <li>
            <p className="color_black2">종교 <span className="color_point">*</span></p>
            <div className={`input_box f_18 light${error.t_religion ? " error" : ""}`}>
                <select 
                    value={values.t_religion || ''} 
                    onChange={(e)=>{
                        onInputChangeHandler(e);
                    }}
                    className={values.t_religion && values.t_religion.length > 0 ? 'selected' : ''}
                    id={`t_religion`}
                >
                    <option value='' hidden disabled>상대방의 종교를 선택해주세요.</option>
                    {selectList && selectList.religion && selectList.religion.map((cont, i)=>{
                        return(
                            <option value={cont.name} key={i}>{cont.name}</option>
                        );
                    })}
                </select>
            </div>
        </li>
    </>);
};

export default MyProfileForm2;