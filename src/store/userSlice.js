import { createSlice } from "@reduxjs/toolkit";

const user = createSlice({
    name: "user", //state 이름
    initialState: {
        signupData:{},
        profileData:{},
    },
    reducers:{
        signupData: (state, action) => {
            state.signupData = action.payload;
        },
        profileData: (state, action) => {
            state.profileData = action.payload;
        },
    },
});

export const { signupData, profileData } = user.actions;
export default user;