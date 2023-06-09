import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { Spin } from 'antd'

import { deleteArticle, likeArticle, unlikeArticle } from '../../store/articlePageSlice'
import heart from '../../assets/Vector.svg'
import heartSecond from '../../assets/path4.svg'
import warn from '../../assets/warn.svg'

import style from './Article.module.scss'

const Article = ({
  author,
  slug,
  createdAt,
  favorited,
  favoritesCount,
  description,
  tagList,
  title,
  isPage = false,
}) => {
  const dispatch = useDispatch()
  if (!author) {
    return null
  }

  const userName = useSelector((state) => state.user.userData.username)
  const [visibleWarn, setVisibleWarn] = useState(false)
  const likeLoading = useSelector((state) => state.articlePage.likeLoading)
  const auth = localStorage.getItem('token')
  const { image, username } = author

  const tags = tagList.map((el) => {
    return (
      <span key={el} className={style.article__tag}>
        {el}
      </span>
    )
  })

  const cutOverview = (string) => {
    if (string) {
      const arr = string.split(' ')
      const res = arr.reduce((acc, cur) => (acc.length < 230 ? acc + ' ' + cur : acc))
      return res.length < 230 ? res : res + ' ...'
    }
  }

  const onDelete = () => {
    setVisibleWarn(true)
  }

  const onLike = () => {
    if (favorited) {
      dispatch(unlikeArticle(slug))
      return
    }
    dispatch(likeArticle(slug))
  }

  const warnClassNames = classNames({ [style.warning]: visibleWarn }, { hidden: !visibleWarn })

  const formatDate = format(new Date(createdAt), 'MMMM d, yyyy')

  return (
    <div className={style.article}>
      <div className={style.article__wrap}>
        <div className={style['article__left-side']}>
          <div className={style['article__left-wrapper']}>
            {(!isPage && (
              <Link to={`/articles/${slug}`} className={style.article__title}>
                {title}
              </Link>
            )) || <span className={style.article__title}>{title}</span>}
            {likeLoading ? (
              <Spin className={style.article__likes} size="small" />
            ) : (
              <button className={style.article__likes} onClick={onLike} disabled={!auth && true}>
                <img src={favorited ? heartSecond : heart}></img>
                {favoritesCount}
              </button>
            )}
          </div>
          <div className={style.article__tags}>{tags}</div>
        </div>
        <div className={style['article__right-side']}>
          <div className={style['article__right-wrapper']}>
            <span className={style.article__name}>{username}</span>
            <span className={style.article__date}>{formatDate}</span>
          </div>
          <img className={style.article__img} src={image}></img>
        </div>
      </div>
      <div className={style['article__down-side']}>
        <span className={style.article__text}>{isPage ? description : cutOverview(description)}</span>
        {auth && isPage && userName === username && (
          <div className={style.article__actions}>
            <button className={style.article__delete} onClick={onDelete}>
              Delete
            </button>
            <div className={warnClassNames}>
              <div className={style.warning__info}>
                <img className={style.warning__img} src={warn}></img>
                <span className={style.warning__text}>Are you sure to delete this article?</span>
              </div>
              <div className={style.warning__actions}>
                <button className={style.warning__button} onClick={() => setVisibleWarn(false)}>
                  No
                </button>
                <button className={style.warning__button} onClick={() => dispatch(deleteArticle(slug))}>
                  Yes
                </button>
              </div>
            </div>
            <Link className={style.article__edit} to={`/articles/${slug}/edit`}>
              Edit
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Article
