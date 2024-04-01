const ListTopTitleBox = ({tit, txt, tipBox}) => {
    return(<>
        <div className="list_tit_box">
            <p className="tit">{tit}</p>
            <div className="flex_between">
                <p className="txt">{txt}</p>
                {tipBox}
            </div>
        </div>
    </>);
};

export default ListTopTitleBox;