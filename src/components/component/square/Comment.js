import { useSelector } from "react-redux";
import EditBox from "./EditBox";
import WriteTextareaBox from "./WriteTextareaBox";
import ReplyBox from "./ReplyBox";
import none_profile from "../../../images/none_profile.jpg";


const Comment = ({
    data, 
    editBoxOn, 
    editBox,
    onEditBoxClickHandler, 
    onEditHandler, 
    onDeltHandler, 
    btnGray, 
    editBtn,
    replyValue,
    onReplyChangeHandler,
    onReplyHandler,
    replyBoxOn,
    onReplyBoxClickHandler,
    commentEditOn,
}) => {
    const user = useSelector((state)=>state.user);
    
    return(<>
        <div className="comment">
            <div className="name_box flex_between">
                <div className="flex">
                    <div className={`profile_img_box${data.rank ? ' class_'+data.class_number : ''}`}>
                        <div className='img'>
                            <div><img src={data.photo && data.photo.length > 0 ? data.photo : none_profile} alt='프로필이미지' /></div>
                        </div>
                    </div>
                    <p className="name">{data.m_n_name}</p>
                </div>
                <EditBox 
                    editBoxIdx={data.comment_idx}
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
                    {user.userLogin && //로그인시에만 노출
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
                    placeholder={commentEditOn === data.comment_idx ? '댓글을 달아보세요!' : '답글을 달아보세요!'}
                    value={replyValue}
                    onChangeHandler={onReplyChangeHandler}
                    btnTxt={commentEditOn === data.comment_idx ? '댓글수정' : '답글쓰기'}
                    onEnterHandler={onReplyHandler}
                    reply={true}
                    replyToId={data.m_id}
                />
            }
        </div>
        {/* 답댓글 */}
        <ul className="reply_list">
            {data.comments.map((cont,i)=>{
                return(
                    <li key={i}>
                        <ReplyBox 
                            data={cont}
                            editBoxIdx={cont.comment_idx}
                            editBoxOn={editBoxOn}
                            editBox={editBox}
                            onEditBoxClickHandler={onEditBoxClickHandler}
                            onEditHandler={onEditHandler}
                            onDeltHandler={onDeltHandler}
                            btnGray={btnGray}
                            editBtn={editBtn}
                            //답글쓰기
                            replyBoxOn={replyBoxOn}
                            replyValue={replyValue}
                            onReplyChangeHandler={onReplyChangeHandler}
                            onReplyHandler={onReplyHandler}
                            onReplyBoxClickHandler={onReplyBoxClickHandler}
                            //수정
                            commentEditOn={commentEditOn}
                        />
                    </li>
                );
            })}
        </ul>
        
    </>);
};

export default Comment;