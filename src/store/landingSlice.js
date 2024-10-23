import { createSlice } from "@reduxjs/toolkit";

const landing = createSlice({
    name: "landing", //state 이름
    initialState: {

        //선택회원신청 - 실제후기팝업
        storyPop: false,
        storyPopNo: null,
        storyPopList: [],

        //선택회원신청 - 약관팝업
        policyPop: false,
        policyPopIdx: null,
    },
    reducers:{
        storyPop: (state, action) => {
            state.storyPop = action.payload.storyPop;
            state.storyPopNo = action.payload.storyPopNo;
        },
        storyPopList: (state, action) => {
            state.storyPopList = action.payload;
        },
        policyPop: (state, action) => {
            state.policyPop = action.payload.policyPop;
            state.policyPopIdx = action.payload.policyPopIdx;
        },
    }
});

export const {
    storyPop,
    storyPopList,
    policyPop,
} = landing.actions;
export default landing;