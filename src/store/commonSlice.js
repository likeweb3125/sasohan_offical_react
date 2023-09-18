import { createSlice } from "@reduxjs/toolkit";

const common = createSlice({
    name: "common", //state 이름
    initialState: {
        headerMenuOn:null,
        profileImgs:["","","","","","","",""],
    },
    reducers:{
        headerMenuOn: (state, action) => {
            state.headerMenuOn = action.payload;
        },
        profileImgs: (state, action) => {
            state.profileImgs = action.payload;
        },
    }
});

export const { 
    headerMenuOn,
    profileImgs
} = common.actions;
export default common;