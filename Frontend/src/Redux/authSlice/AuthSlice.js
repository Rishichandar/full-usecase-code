import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: !!localStorage.getItem("user"),
  user: JSON.parse(localStorage.getItem("user")) || {},
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticate: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = {};
      localStorage.removeItem("user");
      localStorage.removeItem("Token");
    },
  },
});

export const { authenticate, logout } = AuthSlice.actions;

export default AuthSlice.reducer;
