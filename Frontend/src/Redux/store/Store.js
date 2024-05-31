import { configureStore } from "@reduxjs/toolkit";
import { AuthSlice } from "../authSlice/AuthSlice";
import { TimerSlice } from "../timerSlice/TimerSlice";
import { breakManagementSlice } from "../ctrlMngntSilce/breakManagementSlice";

export const Store = configureStore({
  reducer: {
    auth: AuthSlice.reducer,
    timerState: TimerSlice.reducer,
    breakManagementSlice: breakManagementSlice.reducer,
  },
});
