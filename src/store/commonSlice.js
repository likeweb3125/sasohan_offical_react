import { createSlice } from "@reduxjs/toolkit";

const common = createSlice({
    name: "common", //state 이름
    initialState: {
        headerMenuOn:null,
        profileImgs:["","","","","","","",""],
        payCheckData:{},
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
    }
});

export const { 
    headerMenuOn,
    profileImgs,
    payCheckData
} = common.actions;
export default common;