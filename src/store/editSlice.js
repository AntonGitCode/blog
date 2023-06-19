import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { BASE_URL } from '../constants'

const initialState = {
  newUserData: {},
  edited: false,
  loading: false,
  error: false,
  isCompleted: false,
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
    return user //
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
    setCompleted: (state, action) => {
      state.isCompleted = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(editAccount.fulfilled, (state) => {
        state.loading = false
        state.isCompleted = true
      })
      .addCase(editAccount.pending, (state) => {
        state.loading = true
      })
      .addCase(editAccount.rejected, (state) => {
        state.loading = false
        state.error = true
      })
  },
})

export const { setUserData, setEdited, setErrorData } = editSlice.actions

export default editSlice.reducer
