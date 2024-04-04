
const MyProfileForm2 = (
    {
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