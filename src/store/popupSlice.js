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
        managerPopData: {},

        //이미지 팝업
        imgPop: false,
        imgPopSrc: "",

        //후기 팝업
        reviewPop: false,
        reviewPopNo: null,

        //약관 팝업
        termsPop: false,
        termsPopTab: null,

        //소개팅신청하기 팝업
        applyPop: false,

        //실시간만남스토리 팝업
        storyPop: false,
        storyPopNo: null,
        
        // 앱 팝업------------------------------------
        //회원가입 - 약관동의 팝업
        appTermsPop: false,
        appTermsPopIdx: null,
        appTermsCheckList: [],
        
        //회원가입 - 회원프로필설정 팝업
        appProfilePop: false,
        appProfilePopTit: "",
        appProfilePopEdit: false,

        //회원가입 - 회원프로필사진 팝업
        appProfileImgPop: false,
        appProfileImgPopIdx: null,

        //회원가입 - 이상형정보설정 팝업
        appProfilePop2: false,
        appProfilePopTit2: "",
        appProfilePopEdit2: false,
        
        //회원가입 - 완료 팝업
        appSignupCompletePop: false,
        appSignupCompletePopUser: null,

        //포인트충전완료 팝업
        appPointPop: false,
        appPointPopData: {},

        //마이페이지 - 프로필수정 - 비밀번호변경 팝업
        appChangePasswordPop: false,
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
            state.managerPop = action.payload.managerPop;
            state.managerPopData = action.payload.managerPopData;
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
        applyPop: (state, action) => {
            state.applyPop = action.payload;
        },
        storyPop: (state, action) => {
            state.storyPop = action.payload.storyPop;
            state.storyPopNo = action.payload.storyPopNo;
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
            state.appProfilePopEdit = action.payload.appProfilePopEdit;
        },
        appProfileImgPop: (state, action) => {
            state.appProfileImgPop = action.payload.appProfileImgPop;
            state.appProfileImgPopIdx = action.payload.appProfileImgPopIdx;
        },
        appProfilePop2: (state, action) => {
            state.appProfilePop2 = action.payload.appProfilePop2;
            state.appProfilePopTit2 = action.payload.appProfilePopTit2;
            state.appProfilePopEdit2 = action.payload.appProfilePopEdit2;
        },
        appSignupCompletePop: (state, action) => {
            state.appSignupCompletePop = action.payload.appSignupCompletePop;
            state.appSignupCompletePopUser = action.payload.appSignupCompletePopUser;
        },
        appPointPop: (state, action) => {
            state.appPointPop = action.payload.appPointPop;
            state.appPointPopData = action.payload.appPointPopData;
        },
        appChangePasswordPop: (state, action) => {
            state.appChangePasswordPop = action.payload;
        },
    }
});

export const {
    confirmPop,
    managerPop,
    imgPop,
    reviewPop,
    termsPop,
    applyPop,
    storyPop,
    appTermsPop,
    appTermsCheckList,
    appProfilePop,
    appProfileImgPop,
    appProfilePop2,
    appSignupCompletePop,
    appPointPop,
    appChangePasswordPop,
} = popup.actions;
export default popup;