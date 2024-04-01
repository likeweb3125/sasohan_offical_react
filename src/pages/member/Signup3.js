import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { signupCompletedName } from "../../store/userSlice";
import txt_img from '../../images/signup_complete_txt_img.svg';


const Signup3 = () => {
    const dispatch = useDispatch();
    const user = useSelector((state)=>state.user);
    const [name, setName] = useState('');

    useEffect(()=>{
        setName(user.signupCompletedName);
    },[user.signupCompletedName]);

 

    return(<>
        <div className="signup_wrap signup_wrap3">
            <div className="cont2">
                <div className="form_cont">
                    <div className="tit_box">
                        <p className="tit">가입을 축하합니다.</p>
                        <p className="tp16">사소한에서 새로운 만남을 시작해 보세요!</p>
                    </div>
                    <div className="shadow_box">
                        <div className="tx_c">
                            <img src={txt_img} alt="사소한VIP소개팅" />
                            <p className="txt"><strong>{name} 님,</strong> 가입을 축하합니다. <br/>좋은 인연 사소한에서 만들어 드릴게요.</p>
                        </div>
                        <div className="flex_between btn_box">
                            <Link to='/' className="btn_type4">홈으로</Link>
                            <Link to='/member/login' className="btn_type3">로그인할래요!</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
};

export default Signup3;