import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { BASE_URL } from '../constants'

const initialState = {
  loading: false,
  error: false,
  errorData: {},
  currentUser: null,
}

export const registrAccount = createAsyncThunk(
  'registr/registrAccount',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`${BASE_URL}users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ user: data }),
      })

      if (!response.ok) {
        const error = await response.json()
        dispatch(setErrorData(error.errors))
        throw new Error('Registration error', error.status)
      }

      const user = await response.json()
      localStorage.setItem('token', user.user.token)
      return user
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const registrSlice = createSlice({
  name: 'registr',
  initialState,
  reducers: {
    setErrorData: (state, action) => {
      state.errorData = action.payload
    },
  },
  extraReducers: {
    [registrAccount.fulfilled]: (state, action) => {
      state.loading = false
      state.currentUser = action.payload.user
    },
    [registrAccount.pending]: (state) => {
      state.loading = true
    },
    [registrAccount.rejected]: (state) => {
      state.loading = false
      state.error = true
    },
  },
})

export const { setErrorData } = registrSlice.actions

export default registrSlice.reducer
