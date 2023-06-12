import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { BASE_URL } from '../constants'

const initialState = {
  pageData: {},
  confirm: false,
  edited: false,
  loading: false,
  likeLoading: false,
  error: false,
  deleted: false,
  status: null,
}

export const getPage = createAsyncThunk('articlePage/getPage', async (slug, { rejectWithValue, dispatch }) => {
  const token = localStorage.getItem('token')
  try {
    if (token) {
      const response = await fetch(`${BASE_URL}articles/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Token ${token}`,
        },
      })

      if (!response.ok) {
        dispatch(setStatus(response.status))
        throw new Error('Get articles list error', response.status)
      }

      const article = await response.json()
      dispatch(setPageData(article.article))
    }
    if (!token) {
      const response = await fetch(`${BASE_URL}articles/${slug}`)

      if (!response.ok) {
        dispatch(setStatus(response.status))
        throw new Error('Get articles list error', response.status)
      }

      const article = await response.json()
      dispatch(setPageData(article.article))
    }
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const updateArticle = createAsyncThunk(
  'articlePage/updateArticle',
  async (data, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem('token')
    const { slug } = data

    try {
      const response = await fetch(`${BASE_URL}articles/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          article: { title: data.title, description: data.description, body: data.body, tagList: data.tagList },
        }),
      })

      if (!response.ok) {
        throw new Error('Get articles list error', response.status)
      }

      const article = await response.json()
      dispatch(setEditedSlug(article.article.slug))
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteArticle = createAsyncThunk(
  'articlePage/deleteArticle',
  async (slug, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}articles/${slug}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Token ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Delete article error', response.status)
      }

      dispatch(setDeletedSlug(slug))
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const likeArticle = createAsyncThunk('articlePage/likeArticle', async (slug, { rejectWithValue, dispatch }) => {
  const token = localStorage.getItem('token')
  try {
    const response = await fetch(`${BASE_URL}articles/${slug}/favorite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Token ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Like article error', response.status)
    }
    const article = await response.json()
    dispatch(setPageData(article.article))
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const unlikeArticle = createAsyncThunk(
  'articlePage/unlikeArticle',
  async (slug, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}articles/${slug}/favorite`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Token ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Unlike article error', response.status)
      }
      const article = await response.json()
      dispatch(setPageData(article.article))
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const articlePageSlice = createSlice({
  name: 'articlePage',
  initialState,
  reducers: {
    setPageData: (state, action) => {
      state.pageData = action.payload
    },
    setStatus: (state, action) => {
      state.status = action.payload
    },
    setEditedSlug: (state, action) => {
      state.edited = action.payload
    },
    setDeletedSlug: (state, action) => {
      state.deleted = action.payload
    },
  },
  extraReducers: {
    [getPage.fulfilled]: (state) => {
      state.confirm = true
      state.loading = false
    },
    [getPage.pending]: (state) => {
      state.loading = true
    },
    [getPage.rejected]: (state) => {
      state.loading = false
      state.error = true
    },
    [updateArticle.fulfilled]: (state) => {
      state.loading = false
    },
    [updateArticle.pending]: (state) => {
      state.loading = true
    },
    [updateArticle.rejected]: (state) => {
      state.loading = false
      state.error = true
    },
    [deleteArticle.fulfilled]: (state) => {
      state.deleted = true
      state.loading = false
    },
    [deleteArticle.pending]: (state) => {
      state.loading = true
    },
    [deleteArticle.rejected]: (state) => {
      state.loading = false
      state.error = true
    },
    [likeArticle.fulfilled]: (state) => {
      state.likeLoading = false
    },
    [likeArticle.pending]: (state) => {
      state.likeLoading = true
    },
    [likeArticle.rejected]: (state) => {
      state.likeLoading = false
      state.error = true
    },
    [unlikeArticle.fulfilled]: (state) => {
      state.deleted = true
      state.likeLoading = false
    },
    [unlikeArticle.pending]: (state) => {
      state.likeLoading = true
    },
    [unlikeArticle.rejected]: (state) => {
      state.likeLoading = false
      state.error = true
    },
  },
})

export const { setPageData, setStatus, setEditedSlug, setDeletedSlug } = articlePageSlice.actions

export default articlePageSlice.reducer
