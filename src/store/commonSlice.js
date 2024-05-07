import { createSlice } from "@reduxjs/toolkit";

const common = createSlice({
    name: "common", //state 이름
    initialState: {
        headerMenuOn:null,
        profileImgs:["","","","","","","",""],
        feedProfileImg:"",
        payCheckData:{},
        resetPasswordToken:'', //비밀번호찾기 완료시 받은 토큰값 (비밀번호변경시에 필요)
        feedRefresh:false,
        myPageRefresh:false,
        phoneLogin:false,
        aboutVipScroll:'',
    },
    reducers:{
        headerMenuOn: (state, action) => {
            state.headerMenuOn = action.payload;
        },
        profileImgs: (state, action) => {
            state.profileImgs = action.payload;
        },
        feedProfileImg: (state, action) => {
            state.feedProfileImg = action.payload;
        },
        payCheckData: (state, action) => {
            state.payCheckData = action.payload;
        },
        resetPasswordToken: (state, action) => {
            state.resetPasswordToken = action.payload;
        },
        feedRefresh: (state, action) => {
            state.feedRefresh = action.payload;
        },
        myPageRefresh: (state, action) => {
            state.myPageRefresh = action.payload;
        },
        phoneLogin: (state, action) => {
            state.phoneLogin = action.payload;
        },
        aboutVipScroll: (state, action) => {
            state.aboutVipScroll = action.payload;
        },
    }
});

export const { 
    headerMenuOn,
    profileImgs,
    feedProfileImg,
    payCheckData,
    resetPasswordToken,
    feedRefresh,
    myPageRefresh,
    phoneLogin,
    aboutVipScroll,
} = common.actions;
export default common;