import { NumericFormat, PatternFormat } from "react-number-format";


const InputBox = (props) => {

    return(
        <>
            {/* {props.numberOnly ? 
                <NumericFormat 
                    thousandSeparator="," 
                    decimalScale={0} 
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={props.onChangeHandler}
                    id={props.id}
                    maxLength={props.countMax}
                    className={props.className}
                />
                :   props.phone ? 
                    <PatternFormat 
                        format="###-####-####"
                        placeholder={props.placeholder}
                        value={props.value}
                        onChange={props.onChangeHandler}
                        id={props.id}
                        maxLength={props.countMax}
                        className={props.className}
                    />
                :   <input type={props.type} 
                        placeholder={props.placeholder}
                        value={props.value}
                        onChange={props.onChangeHandler}
                        id={props.id}
                        maxLength={props.countMax}
                        className={props.className}
                    />
            } */}

            <input type={props.type} 
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChangeHandler}
                id={props.id}
                onFocus={props.onFocusHandler}
                onBlur={props.onBlurHandler}
                onKeyDown={(e)=>{
                    if(e.key === 'Enter' && !e.nativeEvent.isComposing){
                        e.preventDefault();
                        props.onSearchHandler();
                    }
                }}
                maxLength={props.maxLength}
            />
        </>
    );
};

export default InputBox;