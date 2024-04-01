import { useState } from "react";


const EditBox = ({
    editBoxIdx,
    editBoxId,
    editBoxOn,
    editBox,
    onEditBoxClickHandler,
    onEditHandler,
    onDeltHandler,
    btnGray, 
    editBtn,
}) => {
    const [position, setPosition] = useState([]);


    //수정,삭제버튼 클릭시 btn_ul 위치값 지정
    const editBoxClickHandler = (e) => {
        const element = e.currentTarget;
        let top = element.getBoundingClientRect().top;
        let left = element.getBoundingClientRect().left;
        setPosition([top+30,left-136]);

        onEditBoxClickHandler(true, editBoxIdx);
    };

    return(<>
        {editBox &&
            <div className={`edit_box${editBoxOn == editBoxIdx ? ' on' : ''}`}>
                <button type="button" className={`btn_edit${btnGray ? ' gray' : ''}`} onClick={editBoxClickHandler}>수정버튼</button>
                <div className="box">
                    <div className="dim" onClick={()=>onEditBoxClickHandler(false, editBoxIdx)}></div>
                    <ul className="btn_ul" style={{top:position[0],left:position[1]}}>
                        {editBtn && <li><button type="button" onClick={onEditHandler}>수정</button></li>}
                        <li><button type="button" onClick={onDeltHandler}>삭제</button></li>
                    </ul>
                </div>
            </div>
        }
    </>);
};

export default EditBox;