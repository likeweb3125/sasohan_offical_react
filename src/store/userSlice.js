import { createSlice } from "@reduxjs/toolkit";

const user = createSlice({
    name: "user", //state 이름
    initialState: {
        signupData:{},
        profileData:{},
        profileDataChange:false,
    },
    reducers:{
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

export const { signupData, profileData, profileDataChange } = user.actions;
export default user;