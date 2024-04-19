import { createSlice } from "@reduxjs/toolkit";

const etc = createSlice({
    name: "etc", //state 이름
    initialState: {
        detailPageBack: false,
        listPageData: {},
        scrollY: null,
        logout:false,
    },
    reducers:{
        detailPageBack: (state, action) => {
            state.detailPageBack = action.payload;
        },
        listPageData: (state, action) => {
            state.listPageData = action.payload;
        },
        scrollY: (state, action) => {
            state.scrollY = action.payload;
        },
        logout: (state, action) => {
            state.logout = action.payload;
        },
    }
});

export const { 
    detailPageBack,
    listPageData,
    scrollY,
    logout,
} = etc.actions;
export default etc;