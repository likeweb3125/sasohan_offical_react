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

        //약관 팝업
        termsPop: false,
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
            state.reviewPop = action.payload;
        },
        termsPop: (state, action) => {
            state.termsPop = action.payload;
        },
    }
});

export const {
    confirmPop,
    managerPop,
    imgPop,
    reviewPop,
    termsPop
} = popup.actions;
export default popup;