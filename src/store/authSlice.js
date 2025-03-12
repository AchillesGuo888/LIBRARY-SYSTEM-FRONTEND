
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  userInfo: null,
  loading: false,
  error: null,
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo;
      state.isAuthenticated = true;
      state.loading = false;
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },


    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo;
      state.isAuthenticated = true;
      state.loading = false;
    },
    registerFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },


    logout: (state) => {
      state.token = null;
      state.userInfo = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    }
  }
});

export const { 
  loginStart, 
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout 
} = authSlice.actions;

export default authSlice.reducer;