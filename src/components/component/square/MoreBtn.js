import btn_more from "../../../images/btn_more.png";


const MoreBtn = ({onClickHandler, txt}) => {
    return(
        <div className="btn_more_box">
            <button type="button" className="btn_more flex" onClick={onClickHandler}><img src={btn_more} alt="더보기 아이콘"/><span>{txt} 더보기</span></button>
        </div>
    );
};

export default MoreBtn;