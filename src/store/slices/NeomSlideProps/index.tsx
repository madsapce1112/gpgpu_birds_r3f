'use client'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: { open: false, showArea: true }
}

export const neomSlideSlice = createSlice({
  name: 'neomSlide',
  initialState,
  reducers: {
    setNeomSlide: (state, actions) => {
      state.value = { ...state.value, ...actions.payload }
    }
  }
})

export const { setNeomSlide } = neomSlideSlice.actions
