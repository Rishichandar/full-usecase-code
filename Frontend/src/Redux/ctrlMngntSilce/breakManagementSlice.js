import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLunchIn: false,
  isBreakIn: false,
};

export const breakManagementSlice = createSlice({
  name: "breakManagement",
  initialState,
  reducers: {
    toggleLunch: (state) => {
      state.isLunchIn = !state.isLunchIn;
    },
    toggleBreak: (state) => {
      state.isBreakIn = !state.isBreakIn;
    },
    setLunch: (state, action) => {
      state.isLunchIn = action.payload;
    },
    setBreak: (state, action) => {
      state.isBreakIn = action.payload;
    },
  },
});

export const { toggleLunch, toggleBreak, setLunch, setBreak } =
  breakManagementSlice.actions;

export default breakManagementSlice.reducer;
