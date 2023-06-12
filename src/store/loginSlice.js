import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { BASE_URL } from '../constants'

const initialState = {
  userData: {},
  isLogged: false,
  loading: false,
  errorLogin: null,
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
      dispatch(setLoginErrorData(response.status))
      throw new Error('Registration error')
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
    clearError: (state) => {
      state.errorLogin = null
    },
    setLogin: (state, action) => {
      state.userData = action.payload
      state.isLogged = true
      state.errorLogin = null
    },
    setLoginErrorData: (state, action) => {
      state.errorLogin = action.payload
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
    },
  },
})

export const { setLogin, setLoginErrorData, setIsLogged } = loginSlice.actions

export default loginSlice.reducer
