import { useSelector } from "react-redux";
import EditBox from "./EditBox";
import WriteTextareaBox from "./WriteTextareaBox";
import none_profile from "../../../images/none_profile.jpg";


const ReplyBox = ({
    data,
    editBoxIdx, 
    editBoxOn, 
    editBox,
    onEditBoxClickHandler, 
    onEditHandler, 
    onDeltHandler, 
    btnGray, 
    editBtn,
    replyBoxOn,
    replyValue,
    onReplyChangeHandler,
    onReplyHandler,
    onReplyBoxClickHandler,
    commentEditOn,
    onFeedProfileClickHandler
}) => {
    const user = useSelector((state)=>state.user);

    return(<>
        <div className="reply_box">
            <p className="to_name_txt">{data.to_name}</p>
            <div className="comment">
                <div className="name_box flex_between">
                    <div className="flex pointer" onClick={()=>onFeedProfileClickHandler(data)}>
                        {data.user_level == 'U' ? //일반회원일때
                            <div className={`profile_img_box${data.rank ? ' class_'+data.class_number : ''}`}>
                                <div className='img'>
                                    <div><img src={data.photo && data.photo.length > 0 ? data.photo : none_profile} alt='프로필이미지' /></div>
                                </div>
                            </div>
                            :data.user_level == 'M' && <div className="img_box"><img src={data.photo && data.photo.length > 0 ? data.photo : none_profile} alt='프로필이미지' /></div>
                        }
                        <p className="name">{data.m_n_name}</p>
                    </div>
                    <EditBox 
                        editBoxIdx={editBoxIdx}
                        editBoxOn={editBoxOn}
                        editBox={editBox}
                        onEditBoxClickHandler={onEditBoxClickHandler}
                        onEditHandler={onEditHandler}
                        onDeltHandler={onDeltHandler}
                        btnGray={btnGray}
                        editBtn={editBtn}
                    />
                </div>
                <div className="txt_box">
                    <p className="txt">{data.content}</p>
                    <div className="flex">
                        <p className="date">{data.w_date}</p>
                        {(user.userLogin && user.userInfo.user_level == 'M') || (user.userLogin && user.userRank) && //로그인 && 랭킹있는 회원일때 or 매니저일때만 가능
                            <button type="button" className="btn_reply" 
                                onClick={()=>{
                                    onReplyBoxClickHandler(data.comment_idx);
                                }}
                            >{replyBoxOn !== data.comment_idx ? '답글쓰기' : '닫기'}</button>
                        }
                    </div>
                </div>
                {replyBoxOn === data.comment_idx &&
                    <WriteTextareaBox 
                        placeholder='답글을 달아보세요!'
                        value={replyValue}
                        onChangeHandler={onReplyChangeHandler}
                        btnTxt={commentEditOn === data.comment_idx ? '답글수정' : '답글쓰기'}
                        onEnterHandler={onReplyHandler}
                        reply={true}
                        replyToId={data.m_id}
                    />
                }
            </div>
        </div>
    </>);
};

export default ReplyBox;