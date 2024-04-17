
import InputBox from "./InputBox";


const MyInfoForm = (
    {
        focusInput,
        values,
        id,
        nick,
        onInputChangeHandler,
        focusHandler,
        error,
        passShow,
        passShowHandler,
        idChecked,
        nickChecked,
        idCheckHandler,
        nickCheckHandler,
    }) => {

    return(<>
        <li>
            <p className="color_black2">아이디 <span className="color_point">*</span></p>
            <div className="input_btn_box">
                <div className={`input_box f_18 light${focusInput.m_id ? " on" : error.m_id ? " error" : ""}`}>
                    <InputBox 
                        type={'text'}
                        placeholder={`아이디를 입력해주세요.`}
                        value={id}
                        onChangeHandler={onInputChangeHandler}
                        id={`m_id`}
                        onFocusHandler={(e)=>{
                            focusHandler(e,true);
                        }}
                        onBlurHandler={(e)=>{
                            focusHandler(e,false);
                        }}
                    />
                </div>
                <button type="button" disabled={idChecked ? true : false} onClick={idCheckHandler}>중복확인</button>
            </div>
            {(focusInput.m_id || error.m_id) && <p className={`error_txt${focusInput.m_id ? ' color_point' : ''}`}>영문자, 소문자, _ 최소 4자 이상 입력해주세요!</p>}
        </li>
        <li>
            <p className="color_black2">비밀번호 <span className="color_point">*</span></p>
            <div className={`pass_input_box${passShow.password ? " on" : ""}`}>
                <div className={`input_box f_18 light${focusInput.password ? " on" : error.password ? " error" : ""}`}>
                    <InputBox 
                        type={passShow.password ? "text" : "password"}
                        placeholder={`비밀번호를 입력해주세요.`}
                        value={values.password || ""}
                        onChangeHandler={onInputChangeHandler}
                        id={`password`}
                        onFocusHandler={(e)=>{
                            focusHandler(e,true);
                        }}
                        onBlurHandler={(e)=>{
                            focusHandler(e,false);
                        }}
                        maxLength={12}
                    />
                </div>
                <button type="button" onClick={()=>passShowHandler("password")}>비밀번호보기 버튼</button>
            </div>
            {(focusInput.password || error.password) && <p className={`error_txt${focusInput.password ? ' color_point' : ''}`}>영문, 숫자, 특수문자를 포함하여 8~12자 까지 입력해주세요!</p>}
        </li>
        <li>
            <p className="color_black2">비밀번호 확인 <span className="color_point">*</span></p>
            <div className={`pass_input_box${passShow.password2 ? " on" : ""}`}>
                <div className={`input_box f_18 light${focusInput.password2 ? " on" : error.password2 ? " error" : ""}`}>
                    <InputBox 
                        type={passShow.password2 ? "text" : "password"}
                        placeholder={`비밀번호를 입력해주세요.`}
                        value={values.password2 || ""}
                        onChangeHandler={onInputChangeHandler}
                        id={`password2`}
                        onFocusHandler={(e)=>{
                            focusHandler(e,true);
                        }}
                        onBlurHandler={(e)=>{
                            focusHandler(e,false);
                        }}
                        maxLength={12}
                    />
                </div>
                <button type="button" onClick={()=>passShowHandler("password2")}>비밀번호보기 버튼</button>
            </div>
            {(focusInput.password2 || error.password2) && <p className={`error_txt${focusInput.password2 ? ' color_point' : ''}`}>비밀번호를 재입력해주세요!</p>}
        </li>
        <li>
            <p className="color_black2">닉네임 <span className="color_point">*</span></p>
            <div className="input_btn_box">
                <div className={`input_box f_18 light${focusInput.m_n_name ? " on" : error.m_n_name ? " error" : ""}`}>
                    <InputBox 
                        type={'text'}
                        placeholder={`닉네임을 입력해주세요.`}
                        value={nick}
                        onChangeHandler={onInputChangeHandler}
                        id={`m_n_name`}
                        onFocusHandler={(e)=>{
                            focusHandler(e,true);
                        }}
                        onBlurHandler={(e)=>{
                            focusHandler(e,false);
                        }}
                    />
                </div>
                <button type="button" disabled={nickChecked ? true : false} onClick={nickCheckHandler}>중복확인</button>
            </div>
            {(focusInput.m_n_name || error.m_n_name) && <p className={`error_txt${focusInput.m_n_name ? ' color_point' : ''}`}>호감갈 수 있는 멋진 닉네임을 지어볼까요? 최소 2자 이상 입력해주세요!</p>}
        </li>
    </>);
};

export default MyInfoForm;