import { createSlice } from "@reduxjs/toolkit";

const landing = createSlice({
    name: "landing", //state 이름
    initialState: {

        //선택회원신청 - 실제후기팝업
        storyPop: false,
        storyPopNo: null,
        storyPopList: [],

        //선택회원신청 - 약관팝업
        termsPop: false,
        termsPopIdx: null,
    },
    reducers:{
        storyPop: (state, action) => {
            state.storyPop = action.payload.storyPop;
            state.storyPopNo = action.payload.storyPopNo;
        },
        storyPopList: (state, action) => {
            state.storyPopList = action.payload;
        },
        termsPop: (state, action) => {
            state.termsPop = action.payload.termsPop;
            state.termsPopIdx = action.payload.termsPopIdx;
        },
    }
});

export const {
    storyPop,
    storyPopList,
    termsPop,
} = landing.actions;
export default landing;