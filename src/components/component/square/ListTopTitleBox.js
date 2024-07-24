const ListTopTitleBox = ({tit, txt, tipBox, onTitClickHandler}) => {
    return(<>
        <div className="list_tit_box">
            <button type="button" className="tit" onClick={onTitClickHandler}>{tit}</button>
            <div className="flex_wrap">
                <p className="txt rp20">{txt}</p>
                {tipBox}
            </div>
        </div>
    </>);
};

export default ListTopTitleBox;