const ListTopTitleBox = ({tit, onTitClickHandler}) => {
    return(<>
        <div className="list_tit_box">
            <button type="button" className="tit" onClick={onTitClickHandler}>{tit}</button>
        </div>
    </>);
};

export default ListTopTitleBox;