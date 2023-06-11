import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { BASE_URL } from '../constants'

const initialState = {
  userData: {},
  isLogged: false,
  error: false,
}

export const getCurrentUser = createAsyncThunk('login/getCurrentUser', async (token, { rejectWithValue, dispatch }) => {
  try {
    const response = await fetch(`${BASE_URL}user`, {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      dispatch(setError(true))
      throw new Error('Authorization error', error.status)
    }

    const user = await response.json()
    dispatch(setUserData(user.user))
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload
      state.isLogged = true
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setLogout: (state) => {
      state.userData = {}
      state.isLogged = false
    },
  },
  extraReducers: {
    [getCurrentUser.fulfilled]: (state) => {
      state.loading = false
    },
    [getCurrentUser.pending]: (state) => {
      state.loading = true
    },
    [getCurrentUser.rejected]: (state) => {
      state.loading = false
      state.error = true
    },
  },
})

export const { setUserData, setError, setLogout } = userSlice.actions

export default userSlice.reducer
