import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { BASE_URL } from '../constants'

const initialState = {
  userData: {},
  isLogged: false,
  loading: false,
  error: false,
}

export const loginAccount = createAsyncThunk('login/loginAccount', async (data, { rejectWithValue, dispatch }) => {
  try {
    const response = await fetch(`${BASE_URL}users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ user: data }),
    })

    if (!response.ok) {
      const error = await response.json()
      dispatch(setLoginErrorData(true))
      throw new Error('Registration error', error.status)
    }

    const user = await response.json()

    localStorage.setItem('token', user.user.token)

    dispatch(setLogin(user.user))
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.userData = action.payload
      state.isLogged = true
    },
    setLoginErrorData: (state, action) => {
      state.error = action.payload
    },
    setIsLogged: (state, action) => {
      state.isLogged = action.payload
    },
  },
  extraReducers: {
    [loginAccount.fulfilled]: (state) => {
      state.loading = false
    },
    [loginAccount.pending]: (state) => {
      state.loading = true
    },
    [loginAccount.rejected]: (state) => {
      state.loading = false
      state.error = true
    },
  },
})

export const { setLogin, setLoginErrorData, setIsLogged } = loginSlice.actions

export default loginSlice.reducer
