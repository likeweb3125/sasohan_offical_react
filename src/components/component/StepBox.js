import { useState } from "react";

const StepBox = ({onIdx}) => {
    const [list, setList] = useState(['약관 동의·본인인증','회원정보 입력']);

    return(
        <ul className="step_box flex_center flex_wrap">
            {list.map((txt,i)=>{
                const idx = i+1;
                return(
                    <li key={i} className={`flex${onIdx === idx ? ' on' : ''}`}><span className="num">{idx}</span><span>{txt}</span></li>
                );
            })}
        </ul>
    );
};

export default StepBox;