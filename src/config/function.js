
//숫자형 콤마넣기
export function MakeIntComma (intVal){
    intVal *= 1; //숫자형 변경
    const option = {
        maximumFractionDigits: 4 //최대 소수점 자리
      };
    const result = intVal.toLocaleString('ko-KR', option);
        
    return result
}
//숫자형 콤마넣기

//api 에러메시지
export function errorMsgHandler (error) {  
    let errorMsg = '';
    let errorType = '';
  
    if(error.hasOwnProperty('message')){
      errorType = "javascript-api";
    }
  
    if(error.hasOwnProperty('response') && error.response.hasOwnProperty('data')){ // 일반 에러 객체 처리
      errorType = "custom";
    }
    
    if(error.hasOwnProperty('response') && error.response.hasOwnProperty('data') && error.response.data.hasOwnProperty('error')){ // 일반 에러 객체 처리
      errorType = "express-validator";
    };
  
    if(errorType === "javascript-api"){ // 일반 에러 객체 처리
      errorMsg = error.message;
    }else if(errorType === "custom"){ // 일반 에러 객체 처리
      errorMsg = error.response.data.msg;
    }else if(errorType === "express-validator"){ // validatior 에러 객체 처리
      errorMsg = error.response.data.error.errors[0].msg;
    }else{
      errorMsg = '알 수 없는 오류가 발생했습니다.';
    }
    return errorMsg
}

//확장자 확인
export const isVideo = (url) => {
    const videoExtensions = ['mp4', 'webm', 'ogg']; // 비디오 확장자 목록
    const extension = url.split('.').pop().toLowerCase(); // URL에서 확장자 추출
    return videoExtensions.includes(extension);
};