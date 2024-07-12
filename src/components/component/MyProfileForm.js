
const MyProfileForm = (
    {
        values,
        error,
        onInputChangeHandler,
        address,
        setAddress,
        address2,
        setAddress2,
        getAddress2,
        addressList,
        addressList2,
        heightList,
        selectList,
        visualList,
        visual,
        setVisual,
        like,
        likeCheck,
        mbtiList,
        type,
        typeCheck,
        smokList,
        smok,
        setSmok,
        drinkList,
        drink,
        setDrink,
        date,
        dateCheck,
        profileImgs,
        getRootProps1,
        getInputProps1,
        feedImgs,
        getRootProps2,
        getInputProps2,
    }
    ) => {
    return(<>
        <li>
            <p className="color_black2">거주지 <span className="color_point">*</span></p>
            <div className="address_box flex_between">
                <div className={`input_box f_18 light${error.address ? " error" : ""}`}>
                    <select 
                        value={address} 
                        onChange={(e)=>{
                            const val = e.currentTarget.value;
                            const code = e.target.options[e.target.selectedIndex].getAttribute("data-code");
                            getAddress2(code);
                            setAddress(val);
                            setAddress2('');
                        }}
                        className={address.length > 0 ? 'selected' : ''}
                    >
                        <option value='' hidden disabled>시/도</option>
                        {addressList.map((cont, i)=>{
                            return(
                                <option value={cont.sido_gugun} key={i} data-code={cont.local_code}>{cont.sido_gugun}</option>
                            );
                        })}
                    </select>
                </div>
                <div className={`input_box f_18 light${error.address ? " error" : ""}`}>
                    <select 
                        value={address2} 
                        onChange={(e)=>{
                            const val = e.currentTarget.value;
                            setAddress2(val);
                        }}
                        className={address2.length > 0 ? 'selected' : ''}
                    >
                        <option value='' hidden disabled>구</option>
                        {addressList2.map((cont, i)=>{
                            return(
                                <option value={cont.sido_gugun} key={i}>{cont.sido_gugun}</option>
                            );
                        })}
                    </select>
                </div>
            </div>
        </li>
        <li>
            <p className="color_black2">키 <span className="color_point">*</span></p>
            <div className={`input_box f_18 light${error.m_height ? " error" : ""}`}>
                <select 
                    value={values.m_height || ''} 
                    onChange={(e)=>{
                        onInputChangeHandler(e);
                    }}
                    className={values.m_height && values.m_height.length > 0 ? 'selected' : ''}
                    id={`m_height`}
                >
                    <option value='' hidden disabled>키를 선택해주세요.</option>
                    {heightList.map((cont, i)=>{
                        return(
                            <option value={cont.val[0]} key={i}>{cont.txt}</option>
                        );
                    })}
                </select>
            </div>
        </li>
        <li>
            <p className="color_black2">직업 <span className="color_point">*</span></p>
            <div className={`input_box f_18 light${error.m_job ? " error" : ""}`}>
                <select 
                    value={values.m_job || ''} 
                    onChange={(e)=>{
                        onInputChangeHandler(e);
                    }}
                    className={values.m_job && values.m_job.length > 0 ? 'selected' : ''}
                    id={`m_job`}
                >
                    <option value='' hidden disabled>직업을 선택해주세요.</option>
                    {selectList && selectList.job && selectList.job.map((cont, i)=>{
                        return(
                            <option value={cont.name} key={i}>{cont.name}</option>
                        );
                    })}
                </select>
            </div>
        </li>
        <li>
            <p className="color_black2">나의 외모 점수 <span className="color_point">*</span></p>
            <ul className="flex_wrap sel_list_box5 tp10">
                {visualList.map((cont,i)=>{
                    return(
                        <li key={i} className="custom_radio4">
                            <label htmlFor={`visual_${cont}`}>
                                <input type={"radio"} id={`visual_${cont}`}
                                    checked={cont == visual}
                                    onChange={()=>{
                                        setVisual(cont);
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
            <p className="color_black2">나의 관심사 <span className="color_point">*</span></p>
            <p className="f_14 color_gray tp10">아래 각 항목 중 <span className="color_point">3개씩</span> 선택해 볼까요?</p>
            <ul className="flex_wrap sel_list_box4 tp12">
                {selectList && selectList.interest && selectList.interest.map((cont,i)=>{
                    return(
                        <li key={i} className="custom_radio4">
                            <label htmlFor={`interest_${i}`}>
                                <input type={"checkbox"} id={`interest_${i}`} 
                                    checked={like.includes(cont.name) ? true : false}
                                    onChange={(e)=>{
                                        likeCheck(e.currentTarget.checked, cont.name);
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
            <p className="color_black2">나의 MBTI <span className="color_point">*</span></p>
            <div className={`input_box f_18 light${error.m_mbti ? " error" : ""}`}>
                <select 
                    value={values.m_mbti || ''} 
                    onChange={(e)=>{
                        onInputChangeHandler(e);
                    }}
                    className={values.m_mbti && values.m_mbti.length > 0 ? 'selected' : ''}
                    id={`m_mbti`}
                >
                    <option value='' hidden disabled>MBTI를 선택해주세요.</option>
                    {mbtiList.map((cont, i)=>{
                        return(
                            <option value={cont} key={i}>{cont}</option>
                        );
                    })}
                </select>
            </div>
        </li>
        <li>
            <p className="color_black2">나의 타입 <span className="color_point">*</span></p>
            <p className="f_14 color_gray tp10">아래 각 항목 중 <span className="color_point">3개씩</span> 선택해 볼까요?</p>
            <ul className="flex_wrap sel_list_box3 tp12">
                {selectList && selectList.character && selectList.character.map((cont,i)=>{
                    return(
                        <li key={i} className="custom_radio4">
                            <label htmlFor={`character_${i}`}>
                                <input type={"checkbox"} id={`character_${i}`} 
                                    checked={type.includes(cont.name) ? true : false}
                                    onChange={(e)=>{
                                        typeCheck(e.currentTarget.checked, cont.name, true);
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
                            <label htmlFor={`smok_${cont.val}`}>
                                <input type={"checkbox"} id={`smok_${cont.val}`} 
                                    checked={cont.val === smok}
                                    onChange={()=>{
                                        setSmok(cont.val);
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
                            <label htmlFor={`drink_${cont.val}`}>
                                <input type={"checkbox"} id={`drink_${cont.val}`} 
                                    checked={cont.val === drink}
                                    onChange={()=>{
                                        setDrink(cont.val);
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
            <div className={`input_box f_18 light${error.m_religion ? " error" : ""}`}>
                <select 
                    value={values.m_religion || ''} 
                    onChange={(e)=>{
                        onInputChangeHandler(e);
                    }}
                    className={values.m_religion && values.m_religion.length > 0 ? 'selected' : ''}
                    id={`m_religion`}
                >
                    <option value='' hidden disabled>종교를 선택해주세요.</option>
                    {selectList && selectList.religion && selectList.religion.map((cont, i)=>{
                        return(
                            <option value={cont.name} key={i}>{cont.name}</option>
                        );
                    })}
                </select>
            </div>
        </li>
        <li>
            <p className="color_black2">선호하는 데이트 <span className="color_point">*</span></p>
            <p className="f_14 color_gray tp10">아래 각 항목 중 <span className="color_point">3개씩</span> 선택해 볼까요?</p>
            <ul className="flex_wrap sel_list_box3 tp12">
                {selectList && selectList.i_date && selectList.i_date.map((cont,i)=>{
                    return(
                        <li key={i} className="custom_radio4">
                            <label htmlFor={`date_${i}`}>
                                <input type={"checkbox"} id={`date_${i}`} 
                                    checked={date.includes(cont.name) ? true : false}
                                    onChange={(e)=>{
                                        dateCheck(e.currentTarget.checked, cont.name);
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
            <p className="color_black2">가입경로 <span className="color_point">*</span></p>
            <div className={`input_box f_18 light${error.m_motive ? " error" : ""}`}>
                <select 
                    value={values.m_motive || ''} 
                    onChange={(e)=>{
                        onInputChangeHandler(e);
                    }}
                    className={values.m_motive && values.m_motive.length > 0 ? 'selected' : ''}
                    id={`m_motive`}
                >
                    <option value='' hidden disabled>가입경로를 선택해주세요.</option>
                    {selectList && selectList.ref_rul && selectList.ref_rul.map((cont, i)=>{
                        return(
                            <option value={cont.name} key={i}>{cont.name}</option>
                        );
                    })}
                </select>
            </div>
        </li>
        <li>
            <div className="flex_wrap">
                <p className="color_black2 rp10">프로필 사진 <span className="color_point">*</span></p>
                <p className="f_14 color_red">"소개팅 진행 시"에만 사용되는 사진입니다.</p>
            </div>
            <p className="f_14 color_gray tp10">본인의 얼굴이 잘 보이는 사진을 최소 <span className="color_point">1장</span> 등록해주세요. 9장까지 등록하실 수 있어요!</p>
            <div className="img_drop_box">
                {profileImgs.length < 9 &&
                    <div {...getRootProps1({className: 'dropzone'})}>
                        <input {...getInputProps1()} />
                        <div className="txt_box tx_c">
                            <div className="txt1">이미지 첨부</div>
                            <p className="txt2">이미지를 드래그 앤 드롭하여 첨부하세요!<span>파일 업로드는 jpg, jpeg, png, gif 형식만 첨부 가능</span></p>
                        </div>
                    </div>
                }
                {profileImgs.length > 0 &&
                    <div className="img_list_box scroll_wrap_x">
                        <ul className='flex tp12'>
                            {profileImgs}
                        </ul>
                    </div>
                }
            </div>
        </li>
        <li>
            <div className="flex_wrap">
                <p className="color_black2 rp10">피드 프로필</p>
                <p className="f_14 color_red">사이트에 노출되는 사진입니다.</p>
            </div>
            <p className="f_14 color_gray tp10">사소한에서 활동하면서 보여지는 프로필 이미지입니다. <span className="color_point">1장</span> 등록해주세요.</p>
            <div className="img_drop_box">
                {feedImgs.length === 0 &&
                    <div {...getRootProps2({className: 'dropzone'})}>
                        <input {...getInputProps2()} />
                        <div className="txt_box tx_c">
                            <div className="txt1">이미지 첨부</div>
                            <p className="txt2">이미지를 드래그 앤 드롭하여 첨부하세요!<span>파일 업로드는 jpg, jpeg, png, gif 형식만 첨부 가능</span></p>
                        </div>
                    </div>
                }
                {feedImgs.length > 0 &&
                    <div className="img_list_box scroll_wrap_x">
                        <ul className='flex tp12'>
                            {feedImgs}
                        </ul>
                    </div>
                }
            </div>
        </li>
    </>);
};

export default MyProfileForm;