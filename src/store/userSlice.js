import { createSlice } from "@reduxjs/toolkit";
// import { PURGE } from "redux-persist";

const user = createSlice({
    name: "user", //state 이름
    initialState: {
        //로그인한 회원프로필조회시 받는 회원정보
        loginUser:{},
        //마이프로필수정할때 받는 회원정보
        userInfo:{},
    },
    reducers:{
        loginUser: (state, action) => {
            state.loginUser = action.payload;
        },
        userInfo: (state, action) => {
            state.userInfo = action.payload;
        },
    },
});

export const { loginUser, userInfo } = user.actions;
export default user;