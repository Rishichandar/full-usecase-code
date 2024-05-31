import { createSlice } from "@reduxjs/toolkit";

export const TimerSlice = createSlice({
  name: "timerState",
  initialState: { currentTimer: 0, timerActive: false, interval: null },
  reducers: {
    incrementTimer: (state, action) => {
      state.currentTimer += 1;
      state.interval = action.payload;
      // console.log(state.interval);
    },
    resetTimer: (state) => {
      state.currentTimer = 0;
      state.timerActive = false;
      clearInterval(state.interval);
    },
    startTimer: (state) => {
      state.timerActive = true;
    },
    endTimer: (state) => {
      state.timerActive = false;
      clearInterval(state.interval);
    },
    setCurrentTimer: (state, action) => {
      state.currentTimer = action.payload;
    },
  },
});

export const {
  incrementTimer,
  resetTimer,
  startTimer,
  endTimer,
  setCurrentTimer,
} = TimerSlice.actions;
export default TimerSlice.reducer;
