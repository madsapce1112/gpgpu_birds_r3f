'use client'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 0
}

export const slideOverSlice = createSlice({
  name: 'slideOver',
  initialState,
  reducers: {
    setSlideOver: (state, actions) => {
      state.value = actions.payload
    }
  }
})

export const { setSlideOver } = slideOverSlice.actions
