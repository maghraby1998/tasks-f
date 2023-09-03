import { createSlice } from "@reduxjs/toolkit";

export interface GeneralState {}

const initialState: GeneralState = {};

export const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {},
});

// Action creators are generated for each case reducer function
export const {} = generalSlice.actions;

export default generalSlice.reducer;
