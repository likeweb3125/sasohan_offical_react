import { useSelector } from "react-redux";
import SearchBox from "../SearchBox";
import manager_tag from "../../../images/manager_tag.svg";
import manager_tag_c from "../../../images/manager_tag_c.svg";


const ListSearchBox = ({
    managerType,
    typeCheck,
    typeCheckHandler,
    sortTabOn, 
    sortTabClickHandler, 
    likeCheck, 
    likeCheckClickHandler, 
    searchValue, 
    searchInputChangeHandler, 
    searchHandler
}) => {
    const user = useSelector((state)=>state.user);

    return(<>
        <div className="list_search_box flex_between">
            <div className="flex_wrap">
                {managerType &&
                    <ul className="type_check_box flex">
                        <li className="custom_radio">
                            <label htmlFor="manager_type1">
                                <input type={`radio`}
                                    onChange={()=>{
                                        typeCheckHandler('C');
                                    }}
                                    checked={typeCheck == 'C' ? true : false}
                                    id="manager_type1"
                                    name="manager_type"
                                />
                                <div className="box flex">
                                    <img src={manager_tag_c} alt="매니저타입 아이콘"/><span>챠밍 매니저</span>
                                </div>
                            </label>
                        </li>
                        <li className="custom_radio">
                            <label htmlFor="manager_type2">
                                <input type={`radio`}
                                    onChange={()=>{
                                        typeCheckHandler('V');
                                    }}
                                    checked={typeCheck == 'V' ? true : false}
                                    id="manager_type2"
                                    name="manager_type"
                                />
                                <div className="box flex">
                                    <img src={manager_tag} alt="매니저타입 아이콘"/><span>VIP 매니저</span>
                                </div>
                            </label>
                        </li>
                    </ul>
                }
                <div className="flex">
                    <ul className="sort_ul flex">
                        <li className={sortTabOn == 1 ? 'on' : ''} onClick={()=>sortTabClickHandler(1)}>기본순</li>
                        <li className={sortTabOn == 2 ? 'on' : ''} onClick={()=>sortTabClickHandler(2)}>좋아요순</li>
                    </ul>
                    {user.userLogin && //로그인했을때만 노출
                        <div className="custom_check">
                            <label htmlFor="like_check">
                                <input type={`checkbox`}
                                    onChange={()=>{
                                        likeCheckClickHandler()
                                    }}
                                    checked={likeCheck}
                                    id="like_check"
                                />
                                <span className="check">체크박스</span>
                                <span className="txt">내가 누른 좋아요만 보기</span>
                            </label>
                        </div>
                    }
                </div>
            </div>
            <SearchBox 
                type="text"
                placeholder="검색어를 입력해주세요."
                className="search_box search_box2"
                inputClass="input_box2"
                value={searchValue}
                onChangeHandler={(e)=>{
                    const val = e.currentTarget.value;
                    searchInputChangeHandler(val);
                }}
                onSearchHandler={searchHandler}
            />
        </div>
    </>);
};

export default ListSearchBox;