const ListTopTitleBox = ({tit, txt, tipBox}) => {
    return(<>
        <div className="list_tit_box">
            <p className="tit">{tit}</p>
            <div className="flex_wrap">
                <p className="txt rp20">{txt}</p>
                {tipBox}
            </div>
        </div>
    </>);
};

export default ListTopTitleBox;