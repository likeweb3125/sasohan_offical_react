import GuestBookComment from "./GuestBookComment";
import WriteTextareaBox from "./WriteTextareaBox";
import none_profile from "../../../images/none_profile2.jpg";


const GuestBookBox = ({
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
    replyBoxOn,
    replyValue,
    onReplyChangeHandler,
    onReplyHadler
}) => {
    return(<>
        <GuestBookComment
            data={data}
            editBoxOn={editBoxOn}
            editBox={editBox}
            onEditBoxClickHandler={onEditBoxClickHandler}
            onCommentEditHandler={onCommentEditHandler}
            onCommentDeltHandler={onCommentDeltHandler}
            btnGray={btnGray}
            onFeedProfileClickHandler={onFeedProfileClickHandler}
            replyBtn={replyBtn}
            onReplyClickHandler={onReplyClickHandler}
            replyBoxOn={replyBoxOn}
        />
        {/* 답글쓰기 */}
        {replyBoxOn === data.comment_idx &&
            <WriteTextareaBox 
                placeholder="답글을 달아보세요!"
                value={replyValue}
                onChangeHandler={(e)=>{
                    const val = e.currentTarget.value;
                    onReplyChangeHandler(val);
                }}
                btnTxt='보내기'
                onEnterHandler={()=>{
                    onReplyHadler(data.comment_idx);
                }}
            />
        }
        {/* 답댓글 */}
        {data.comments.length > 0 &&
        <ul className="reply_list">
            {data.comments.map((reply,i)=>{
                return(
                    <li key={i}>
                        <GuestBookComment
                            data={reply}
                            editBoxOn={editBoxOn}
                            editBox={editBox}
                            onEditBoxClickHandler={onEditBoxClickHandler}
                            onCommentEditHandler={onCommentEditHandler}
                            onCommentDeltHandler={onCommentDeltHandler}
                            btnGray={btnGray}
                            onFeedProfileClickHandler={onFeedProfileClickHandler}
                        />
                    </li>
                );
            })}
        </ul>
        }
    </>);
};

export default GuestBookBox;