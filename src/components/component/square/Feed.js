import * as CF from "../../../config/function";
import none_profile from "../../../images/none_profile2.jpg";


const Feed = ({data, likeBtnClickHandler, feedClickHandler, myFeed, profileClickHandler}) => {
    return(
        <div className="feed_box">
            <div className="img_box" onClick={()=>feedClickHandler(data.idx)}>
                <img src={data.photo} alt="피드이미지" />
                <div className="box flex_center">
                    <p className="txt_comment">{CF.MakeIntComma(data.comment_cnt)}</p>
                    <p className="txt_like">{CF.MakeIntComma(data.fv_cnt)}</p>
                </div>
            </div>
            <div className="txt_box">
                {!myFeed &&
                    <div className={`name flex pointer${data.manager_type == 'C' ? ' charming' : data.manager_type == 'A' ? ' friend' : ''}`}
                        onClick={()=>profileClickHandler(data.manager_id)}
                    >
                        <div className="img">
                            <img src={data.profile ? data.profile : none_profile} alt="프로필이미지" />
                        </div>
                        <p>{data.manager_name}</p>
                    </div>
                }
                <p className="ellipsis2">{data.txt}</p>
                <p className="date">{data.w_date}</p>
                <button type="button" 
                    className={`btn_like${data.fv_flag ? ' on' : ''}`}
                    onClick={()=>{likeBtnClickHandler(data.idx)}}
                >좋아요 버튼</button>
            </div>
        </div>
    );
};

export default Feed;