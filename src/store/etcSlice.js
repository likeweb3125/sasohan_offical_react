import { createSlice } from "@reduxjs/toolkit";

const etc = createSlice({
    name: "etc", //state 이름
    initialState: {
        detailPageBack: false,
        detailPageBackFeed: false,
        listPageData: {},
        scrollY: null,
    },
    reducers:{
        detailPageBack: (state, action) => {
            state.detailPageBack = action.payload;
        },
        detailPageBackFeed: (state, action) => {
            state.detailPageBackFeed = action.payload;
        },
        listPageData: (state, action) => {
            state.listPageData = action.payload;
        },
        scrollY: (state, action) => {
            state.scrollY = action.payload;
        },
    }
});

export const { 
    detailPageBack,
    detailPageBackFeed,
    listPageData,
    scrollY,
} = etc.actions;
export default etc;