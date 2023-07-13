import { createSlice } from "@reduxjs/toolkit";

const common = createSlice({
    name: "common", //state 이름
    initialState: {
        headerMenuOn:null,
    },
    reducers:{
        headerMenuOn: (state, action) => {
            state.headerMenuOn = action.payload;
        },
    }
});

export const { 
    headerMenuOn,
} = common.actions;
export default common;