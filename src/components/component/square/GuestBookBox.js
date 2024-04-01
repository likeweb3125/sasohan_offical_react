import EditBox from "./EditBox";


const GuestBookBox = ({data, editBoxOn, editBox, onEditBoxClickHandler, onCommentEditHandler, onCommentDeltHandler, btnGray}) => {
    return(<>
        <div className='profile_img_box class_1'>
            <div className='img'>
                <div><img src={data.photo} alt="프로필 이미지"/></div>
            </div>
        </div>
        <div className="txt_box">
            <p className="name bold bp8">{data.m_n_name}</p>
            <div className="flex_bottom flex_wrap">
                <div className="txt">{data.content}</div>
                <div className="flex lp10">
                    <p className="date rm8">{data.w_date}</p>
                    <EditBox 
                        editBoxIdx={data.comment_idx}
                        editBoxOn={editBoxOn}
                        onEditBoxClickHandler={onEditBoxClickHandler}
                        onEditHandler={onCommentEditHandler}
                        onDeltHandler={onCommentDeltHandler}
                        btnGray={btnGray}
                    />
                </div>
            </div>
        </div>
    </>);
};

export default GuestBookBox;