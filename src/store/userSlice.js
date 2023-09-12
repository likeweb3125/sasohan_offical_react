import { createSlice } from "@reduxjs/toolkit";

const user = createSlice({
    name: "user", //state 이름
    initialState: {
        signupData:{},
    },
    reducers:{
        signupData: (state, action) => {
            state.signupData = action.payload;
        },
    },
});

export const { signupData } = user.actions;
export default user;