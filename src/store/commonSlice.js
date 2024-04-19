import { createSlice } from "@reduxjs/toolkit";

const common = createSlice({
    name: "common", //state 이름
    initialState: {
        headerMenuOn:null,
        profileImgs:["","","","","","","",""],
        payCheckData:{},
        resetPasswordToken:'', //비밀번호찾기 완료시 받은 토큰값 (비밀번호변경시에 필요)
        feedRefresh:false,
        myPageRefresh:false,
    },
    reducers:{
        headerMenuOn: (state, action) => {
            state.headerMenuOn = action.payload;
        },
        profileImgs: (state, action) => {
            state.profileImgs = action.payload;
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
    }
});

export const { 
    headerMenuOn,
    profileImgs,
    payCheckData,
    resetPasswordToken,
    feedRefresh,
    myPageRefresh,
} = common.actions;
export default common;