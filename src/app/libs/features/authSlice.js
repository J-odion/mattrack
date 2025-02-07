// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const isClient = typeof window !== "undefined"; // Check if running in browser

const initialState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      if (isClient) {
        localStorage.setItem("authToken", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (isClient) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
    },
    loadUser: (state) => {
        if (typeof window !== "undefined") {
          const user = JSON.parse(localStorage.getItem("user"));
          state.user = user || null;
        }
      },
  },
});

export const { login, logout, loadUser } = authSlice.actions;
export default authSlice.reducer;
