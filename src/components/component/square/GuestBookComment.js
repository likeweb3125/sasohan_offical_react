import EditBox from "./EditBox";
import none_profile from "../../../images/none_profile2.jpg";


const GuestBookComment = ({
    data, 
    editBoxOn, 
    editBox, 
    onEditBoxClickHandler, 
    onCommentEditHandler, 
    onCommentDeltHandler, 
    btnGray, 
    onFeedProfileClickHandler,
    replyBtn,
    onReplyClickHandler,
    replyBoxOn
}) => {
    return(<>
        <div className="flex_between flex_top">
            {data.user_level == 'U' ? //일반회원일때
                <div className={`profile_img_box pointer${data.rank ? ' class_'+data.class_number : ''}`}
                    onClick={()=>onFeedProfileClickHandler(data)}
                >
                    <div className='img'>
                        <div><img src={data.photo && data.photo.length > 0 ? data.photo : none_profile} alt='프로필이미지' /></div>
                    </div>
                </div>
                : data.user_level == 'M' && <div className="img_box pointer" onClick={()=>onFeedProfileClickHandler(data)}><img src={data.photo && data.photo.length > 0 ? data.photo : none_profile} alt='프로필이미지' /></div>
            }
            <div className="txt_box">
                <p className="name bold bp8">{data.m_n_name == '탈퇴한 회원' ? '익명' : data.m_n_name}</p>
                <div className="flex_bottom flex_wrap">
                    <div className="txt">{data.content}</div>
                    <div className="flex lp10">
                        <div className="flex rm8">
                            <p className="date">{data.w_date}</p>
                            {replyBtn &&
                                <button type="button" className="btn_reply"
                                    onClick={()=>{
                                        onReplyClickHandler(data.comment_idx);
                                    }}
                                >{replyBoxOn !== data.comment_idx ? '답글쓰기' : '닫기'}</button>
                            }
                        </div>
                        <EditBox 
                            editBoxIdx={data.comment_idx}
                            editBoxOn={editBoxOn}
                            editBox={editBox}
                            onEditBoxClickHandler={onEditBoxClickHandler}
                            onEditHandler={onCommentEditHandler}
                            onDeltHandler={onCommentDeltHandler}
                            btnGray={btnGray}
                        />
                    </div>
                </div>
            </div>
        </div>
    </>);
};

export default GuestBookComment;