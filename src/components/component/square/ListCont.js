import Feed from "./Feed";
import Manager from "./Manager";
import MoreBtn from "./MoreBtn";


const ListCont = ({list, moreBtn, moreBtnHandler, moreBtnTxt, likeBtnClickHandler, feedCont, feedClickHandler, managerClickHandler, myFeed, profileClickHandler}) => {


    return(<>
        <div className="square_list_cont">
            {list && list.length > 0 ?
                <ul className="flex_wrap flex_top">
                    {list.map((cont, i)=>{
                        return(
                            <li key={i}>
                                {feedCont ? //피드리스트일때
                                    <Feed 
                                        data={cont}
                                        likeBtnClickHandler={likeBtnClickHandler}
                                        feedClickHandler={feedClickHandler}
                                        myFeed={myFeed}
                                        profileClickHandler={profileClickHandler}
                                    />
                                    :<Manager 
                                        data={cont}
                                        likeBtnClickHandler={likeBtnClickHandler}
                                        managerClickHandler={managerClickHandler}
                                    />
                                }
                            </li>
                        );
                    })}
                </ul>
                : <div className="none_data">데이터가 없습니다.</div>
            }
            {moreBtn &&
                <MoreBtn 
                    txt={moreBtnTxt}
                    onClickHandler={moreBtnHandler}
                />
            }
        </div>
    </>);
};

export default ListCont;