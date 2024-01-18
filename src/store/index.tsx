import { configureStore } from '@reduxjs/toolkit'

import { cameraControlSlice } from './slices/cameraControl'
import { darkModeSlice } from './slices/darkMode'
import { neomSlideSlice } from './slices/NeomSlideProps'
import { obitControlSlice } from './slices/obitControl'
import { slideOverSlice } from './slices/slideOver'

export const store = configureStore({
  reducer: {
    [darkModeSlice.name]: darkModeSlice.reducer,
    [slideOverSlice.name]: slideOverSlice.reducer,
    [cameraControlSlice.name]: cameraControlSlice.reducer,
    [obitControlSlice.name]: obitControlSlice.reducer,
    [neomSlideSlice.name]: neomSlideSlice.reducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
