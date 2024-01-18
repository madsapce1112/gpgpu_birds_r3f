'use client'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: { angle: 0 }
}

export const obitControlSlice = createSlice({
  name: 'obitControl',
  initialState,
  reducers: {
    setObitControl: (state, actions) => {
      state.value = { ...state.value, ...actions.payload }
    }
  }
})

export const { setObitControl } = obitControlSlice.actions
