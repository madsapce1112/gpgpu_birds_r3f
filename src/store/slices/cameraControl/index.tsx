'use client'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: { zoomIn: false, zoomOut: false }
}

export const cameraControlSlice = createSlice({
  name: 'cameraControl',
  initialState,
  reducers: {
    setCameraControl: (state, actions) => {
      state.value = { ...state.value, ...actions.payload }
    }
  }
})

export const { setCameraControl } = cameraControlSlice.actions
