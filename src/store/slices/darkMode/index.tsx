'use client'
import { createSlice } from '@reduxjs/toolkit'
// import { parseCookies } from 'nookies';
// import { setCookie } from '@/services/cookies';

const initialState = {
  // value: parseCookies().darkMode ?? 'light',
  value: false
}

export const darkModeSlice = createSlice({
  name: 'darkMode',
  initialState,
  reducers: {
    setDarkMode: (state, actions) => {
      state.value = actions.payload

      // setCookie('darkMode', state.value);
    }
  }
})

export const { setDarkMode } = darkModeSlice.actions
