import { Spin } from 'antd'
import React, { useEffect } from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { getPage } from '../../store/articlePageSlice'
import Article from '../Article/Article'

import style from './ArticlePage.module.scss'

const ArticlePage = ({ slug }) => {
  const dispatch = useDispatch()
  const articleState = useSelector((state) => state.articlePage)
  const { pageData, loading, error, deleted, status } = articleState

  useEffect(() => {
    dispatch(getPage(slug))
  }, [])

  if (deleted === slug || status) {
    return <Redirect to="/"></Redirect>
  }

  if (loading && !error) {
    return <Spin style={{ marginTop: 300 }}></Spin>
  }

  return (
    <div className={style['article-page']}>
      <Article isPage={true} {...pageData}></Article>
      <ReactMarkdown className={style['article-page__body']}>{pageData.body}</ReactMarkdown>
    </div>
  )
}

export default ArticlePage
