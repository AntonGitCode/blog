import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { BASE_URL } from '../constants'

const initialState = {
  articles: [],
  currPage: 1,
  loading: false,
  error: false,
}

export const getArticles = createAsyncThunk('articles/getArticles', async (page, { rejectWithValue, dispatch }) => {
  const token = localStorage.getItem('token')
  try {
    if (token) {
      page = page ? page : 1
      const offset = page === 1 ? 0 : page * 5 - 5

      const response = await fetch(`${BASE_URL}articles?limit=5&offset=${offset}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Token ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Get articles list error', response.status)
      }

      const articles = await response.json()
      dispatch(setArticles(articles.articles))
    }

    if (!token) {
      page = page ? page : 1
      const offset = page === 1 ? 0 : page * 5 - 5

      const response = await fetch(`${BASE_URL}articles?limit=5&offset=${offset}`)

      if (!response.ok) {
        throw new Error('Get articles list error', response.status)
      }

      const articles = await response.json()
      dispatch(setArticles(articles.articles))
    }
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const articleSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setArticles: (state, action) => {
      state.articles = action.payload
    },
    setPage: (state, action) => {
      state.currPage = action.payload
    },
  },
  extraReducers: {
    [getArticles.fulfilled]: (state) => {
      state.loading = false
    },
    [getArticles.pending]: (state) => {
      state.loading = true
    },
    [getArticles.rejected]: (state) => {
      state.loading = false
      state.error = true
    },
  },
})

export const { setPage, setArticles } = articleSlice.actions

export default articleSlice.reducer
