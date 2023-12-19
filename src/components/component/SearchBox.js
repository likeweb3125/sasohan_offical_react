import InputBox from "./InputBox";

const SearchBox = (props) => {
    return(<>
        <div className="search_box">
            <div className={props.inputClass}>
                <InputBox 
                    type={props.type}
                    placeholder={props.placeholder}
                    value={props.value}
                    onChangeHandler={props.onChangeHandler}
                    onSearchHandler={props.onSearchHandler}
                />
            </div>
            <button type="button" onClick={props.onSearchHandler}>검색버튼</button>
        </div>
    </>);
};

export default SearchBox;