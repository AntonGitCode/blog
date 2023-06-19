import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Pagination, Spin } from 'antd'

import { getArticles, setPage } from '../../store/articleSlice'
import Article from '../Article'

const ArticleList = () => {
  const dispatch = useDispatch()
  const articlesState = useSelector((state) => state.articles)
  const { articles, loading, error, currPage } = articlesState
  const likeLoading = useSelector((state) => state.articlePage.likeLoading)

  useEffect(() => {
    const savedPage = localStorage.getItem('blogpage')
    if (savedPage) {
      dispatch(setPage(parseInt(savedPage)))
      dispatch(getArticles(parseInt(savedPage)))
    } else {
      dispatch(getArticles())
    }
  }, [likeLoading])

  if (loading) {
    return <Spin style={{ marginTop: 300 }}></Spin>
  }

  if (error) {
    return () => dispatch(getArticles())
  }

  return (
    <>
      {articles.map(({ slug, ...data }) => {
        return <Article key={slug} slug={slug} {...data} />
      })}
      <Pagination
        style={{ marginLeft: 'auto', marginRight: 'auto', marginBottom: 20 }}
        defaultCurrent={currPage}
        onChange={(page) => {
          localStorage.setItem('blogpage', page)
          dispatch(setPage(page))
          dispatch(getArticles(page))
        }}
        total={50}
      ></Pagination>
    </>
  )
}

export default ArticleList
