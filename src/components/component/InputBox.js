import { NumericFormat, PatternFormat } from "react-number-format";


const InputBox = (props) => {

    return(
        <>
            {props.numberOnly ? 
                <NumericFormat 
                    thousandSeparator="," 
                    decimalScale={0} 
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={props.onChangeHandler}
                    id={props.id}
                    onFocus={props.onFocusHandler}
                    onBlur={props.onBlurHandler}
                    maxLength={props.countMax}
                />
                :   props.phone ? 
                    <PatternFormat 
                        format="###-####-####"
                        placeholder={props.placeholder}
                        value={props.value}
                        onChange={props.onChangeHandler}
                        id={props.id}
                        onFocus={props.onFocusHandler}
                        onBlur={props.onBlurHandler}
                        maxLength={props.countMax}
                    />
                :   <input type={props.type} 
                        placeholder={props.placeholder}
                        value={props.value}
                        onChange={props.onChangeHandler}
                        id={props.id}
                        onFocus={props.onFocusHandler}
                        onBlur={props.onBlurHandler}
                        onKeyDown={(e)=>{
                            if(props.onSearchHandler){
                                if(e.key === 'Enter' && !e.nativeEvent.isComposing){
                                    e.preventDefault();
                                    props.onSearchHandler();
                                }
                            }
                        }}
                        maxLength={props.maxLength}
                        disabled={props.disabled}
                    />
            }
        </>
    );
};

export default InputBox;