import { createSlice } from "@reduxjs/toolkit";

const common = createSlice({
    name: "common", //state 이름
    initialState: {
        headerMenuOn:null,
        profileImgs:["","","","","","","",""],
        termsTabOn:1,
    },
    reducers:{
        headerMenuOn: (state, action) => {
            state.headerMenuOn = action.payload;
        },
        profileImgs: (state, action) => {
            state.profileImgs = action.payload;
        },
        termsTabOn: (state, action) => {
            state.termsTabOn = action.payload;
        },
    }
});

export const { 
    headerMenuOn,
    profileImgs,
    termsTabOn
} = common.actions;
export default common;