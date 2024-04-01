const WriteTextareaBox = ({
    placeholder,
    value,
    onChangeHandler,
    btnTxt,
    onEnterHandler,
    disabled,
    reply,
    replyToId
}) => {
    return(<>
        <div className="msg_write_box">
            <div className="custom_textarea">
                <textarea 
                    placeholder={placeholder}
                    value={value}
                    onChange={onChangeHandler}
                    disabled={disabled}
                />
                <button type="button"
                    disabled={value && value.length > 0 ? false : true}
                    onClick={()=>{
                        onEnterHandler(reply, replyToId);
                    }}
                >{btnTxt}</button>
            </div>
        </div>
    </>);
};

export default WriteTextareaBox;