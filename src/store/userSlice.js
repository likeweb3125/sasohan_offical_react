import { createSlice } from "@reduxjs/toolkit";

const user = createSlice({
    name: "user", //state 이름
    initialState: {
        signupCompletedName:'',
        userToken: '',
        userInfo: {},
        userRank: false,
        userRankData: {},
        tradeId:'',

        //앱----------------
        signupData:{},
        profileData:{},
        profileDataChange:false,
    },
    reducers:{
        signupCompletedName: (state, action) => {
            state.signupCompletedName = action.payload;
        },
        userToken: (state, action) => {
            state.userToken = action.payload;
        },
        userInfo: (state, action) => {
            state.userInfo = action.payload;
        },
        userRank: (state, action) => {
            state.userRank = action.payload.userRank;
            state.userRankData = action.payload.userRankData;
        },
        tradeId: (state, action) => {
            state.tradeId = action.payload;
        },

        //앱----------------
        signupData: (state, action) => {
            state.signupData = action.payload;
        },
        profileData: (state, action) => {
            state.profileData = action.payload;
        },
        profileDataChange: (state, action) => {
            state.profileDataChange = action.payload;
        },
    },
});

export const { 
    signupCompletedName,
    userToken,
    userInfo,
    userRank,
    tradeId,

    //앱----------------
    signupData, 
    profileData, 
    profileDataChange 
} = user.actions;
export default user;