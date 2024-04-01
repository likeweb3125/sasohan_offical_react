const TextareaBox = ({placeholder, value, onChangeHandler, disabled}) => {
    return(<>
        <div className="custom_textarea">
            <textarea 
                placeholder={placeholder}
                value={value}
                onChange={onChangeHandler}
                disabled={disabled}
            />
        </div>
    </>);
};

export default TextareaBox;