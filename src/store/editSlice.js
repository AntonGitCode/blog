import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { BASE_URL } from '../constants'

const initialState = {
  newUserData: {},
  edited: false,
  loading: false,
  error: false,
}

export const editAccount = createAsyncThunk('edit/editAccount', async (data, { rejectWithValue, dispatch }) => {
  const token = localStorage.getItem('token')
  try {
    const response = await fetch(`${BASE_URL}user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ user: data }),
    })

    if (!response.ok) {
      const error = await response.json()
      dispatch(setErrorData(true))
      throw new Error('Editing error', error.status)
    }

    const user = await response.json()

    localStorage.setItem('token', user.user.token)
    dispatch(setUserData(user.user))
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const editSlice = createSlice({
  name: 'edit',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.newUserData = action.payload
      state.edited = true
    },
    setEdited: (state, action) => {
      state.error = action.payload
    },
    setErrorData: (state, action) => {
      state.error = action.payload
    },
  },
  extraReducers: {
    [editAccount.fulfilled]: (state) => {
      state.loading = false
    },
    [editAccount.pending]: (state) => {
      state.loading = true
    },
    [editAccount.rejected]: (state) => {
      state.loading = false
      state.error = true
    },
  },
})

export const { setUserData, setEdited, setErrorData } = editSlice.actions

export default editSlice.reducer
