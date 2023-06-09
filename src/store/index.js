import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

import articlePageSlice from './articlePageSlice'
import articleSlice from './articleSlice'
import createArticleSlice from './createArticleSlice'
import editSlice from './editSlice'
import loginSlice from './loginSlice'
import registrSlice from './registrSlice'
import userSlice from './userSlice'

const middleware = getDefaultMiddleware({
  immutableCheck: false,
  serializableCheck: false,
  thunk: true,
})

const store = configureStore({
  reducer: {
    articles: articleSlice,
    articlePage: articlePageSlice,
    registr: registrSlice,
    login: loginSlice,
    user: userSlice,
    edit: editSlice,
    create: createArticleSlice,
  },
  middleware,
  devTools: process.env.NODE_ENV !== 'production',
})

export default store
