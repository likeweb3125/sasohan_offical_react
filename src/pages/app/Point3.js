import pay_check_img from "../../images/app/pay_check_img.svg";


const Point2 = () => {

    return(
        <div className="point_wrap2 flex_center">
            <div className="box tx_c">
                <img src={pay_check_img} alt="결제아이콘" />
                <p>결제가 실패했습니다.</p>
                <button type="button" className="app_btn"
                    onClick={()=>{
                        //앱에 포인트사용내역이동 보내기
                        window.flutter_inappwebview.callHandler('flutterPointChargeComplete');
                    }}
                >확인</button>
            </div>
        </div>
    );
};

export default Point2;