import { createSlice } from "@reduxjs/toolkit";

const popup = createSlice({
    name: "popup", //state 이름
    initialState: {
        //안내,알림 팝업
        confirmPop: false,
        confirmPopTit: "",
        confirmPopTxt: "",
        confirmPopBtn: "",

        //챠밍매니저 팝업
        managerPop: false,

        //이미지 팝업
        imgPop: false,
        imgPopSrc: "",

        //후기 팝업
        reviewPop: false,
        reviewPopNo: null,

        //약관 팝업
        termsPop: false,
        termsPopTab: null,
        
        // 앱 팝업------------------------------------
        //회원가입 - 약관동의 팝업
        appTermsPop: false,
        appTermsPopIdx: null,
        appTermsCheckList: [],
        
        //회원가입 - 회원프로필설정 팝업
        appProfilePop: false,
        appProfilePopTit: "",
        
        //포인트충전완료 팝업
        appPointPop: false,
    },
    reducers:{
        // 공통 -----------------------------------
        confirmPop: (state, action) => {
            state.confirmPop = action.payload.confirmPop;
            state.confirmPopTit = action.payload.confirmPopTit;
            state.confirmPopTxt = action.payload.confirmPopTxt;
            state.confirmPopBtn = action.payload.confirmPopBtn;
        },
        managerPop: (state, action) => {
            state.managerPop = action.payload;
        },
        imgPop: (state, action) => {
            state.imgPop = action.payload.imgPop;
            state.imgPopSrc = action.payload.imgPopSrc;
        },
        reviewPop: (state, action) => {
            state.reviewPop = action.payload.reviewPop;
            state.reviewPopNo = action.payload.reviewPopNo;
        },
        termsPop: (state, action) => {
            state.termsPop = action.payload.termsPop;
            state.termsPopTab = action.payload.termsPopTab;
        },
        // 앱 팝업------------------------------------
        appTermsPop: (state, action) => {
            state.appTermsPop = action.payload.appTermsPop;
            state.appTermsPopIdx = action.payload.appTermsPopIdx;
        },
        appTermsCheckList: (state, action) => {
            state.appTermsCheckList = action.payload;
        },
        appProfilePop: (state, action) => {
            state.appProfilePop = action.payload.appProfilePop;
            state.appProfilePopTit = action.payload.appProfilePopTit;
        },
        appPointPop: (state, action) => {
            state.appPointPop = action.payload;
        },
    }
});

export const {
    confirmPop,
    managerPop,
    imgPop,
    reviewPop,
    termsPop,
    appTermsPop,
    appTermsCheckList,
    appProfilePop,
    appPointPop,
} = popup.actions;
export default popup;