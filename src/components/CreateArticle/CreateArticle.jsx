import { Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useParams } from 'react-router-dom'

import { getPage, setEditedSlug, updateArticle } from '../../store/articlePageSlice'
import { createArticle, setCompleted } from '../../store/createArticleSlice'

import style from './CreateArticle.module.scss'

const CreateArticle = () => {
  const dispatch = useDispatch()
  const { articleData, completed, loading, error } = useSelector((state) => state.create)
  const { loading: editLoading } = useSelector((state) => state.articlePage)
  const { pageData, edited, confirm } = useSelector((state) => state.articlePage)
  const [complete, setComplete] = useState(false)
  const [prevArticleData, setPrevArticleData] = useState({ tagList: [{ value: '' }] })
  const { slug } = useParams()
  const auth = localStorage.getItem('token')

  useEffect(() => {
    if (slug) {
      if (!confirm) {
        dispatch(getPage(slug))
      } else {
        setPrevArticleData({
          title: pageData.title,
          description: pageData.description,
          body: pageData.body,
          tagList: pageData.tagList.map((el) => ({ value: el })),
        })
        setComplete(true)
      }
    }
  }, [confirm])

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    mode: 'onBlur',
    defaultValues: prevArticleData,
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tagList',
  })

  const onSubmit = (data) => {
    const { tagList } = data
    const formatTags = tagList.map((el) => el.value)
    if (slug) {
      dispatch(updateArticle({ ...data, tagList: formatTags, slug: slug }))
      return
    }
    dispatch(createArticle({ ...data, tagList: formatTags }))
  }

  const onAddTag = (index) => {
    if (index === 0 && !control._formValues.tagList[index]) {
      append({ value: '' })
    }
    if (control._formValues.tagList[index].value) {
      append({ value: '' })
    }
  }

  if (loading || editLoading || (slug && !complete)) {
    return <Spin style={{ marginTop: 300 }}></Spin>
  }

  if (!auth) {
    return <Redirect to="/login"></Redirect>
  }

  if (edited) {
    setTimeout(() => {
      dispatch(setEditedSlug(false))
    }, 1000)
    return <Redirect to={`/articles/${edited}/`}></Redirect>
  }

  if (completed) {
    setTimeout(() => {
      dispatch(setCompleted(false))
    }, 1000)
    return <Redirect to={`/articles/${articleData.slug}`}></Redirect>
  }

  return (
    <div className={style.create}>
      <span className={style.create__title}>{slug ? 'Edit article' : 'Create new article'}</span>
      <form className={style.create__form} onSubmit={handleSubmit(onSubmit)}>
        <label className={style.create__label} htmlFor="title">
          <span>Title</span>
          <input
            className={style.create__input}
            {...register('title', {
              required: 'Title field is required.',
            })}
            type="text"
            id="title"
            placeholder="Title"
          />
          <span className={style['create__error']}>
            {(errors?.title && errors?.title?.message) || (error?.title && `Title ${error?.title[0]}.`)}
          </span>
        </label>
        <label className={style.create__label} htmlFor="description">
          <span>Short description</span>
          <input
            className={style.create__input}
            {...register('description', {
              required: 'Description field is required.',
            })}
            type="text"
            id="description"
            placeholder="Short description"
          ></input>
          <span className={style['create__error']}>{errors?.description && errors?.description?.message}</span>
        </label>
        <label className={style.create__label} htmlFor="text">
          <span>Text</span>
          <textarea
            className={style['create__text-input']}
            {...register('body', {
              required: 'Text field is required.',
            })}
            type="text"
            id="body"
            placeholder="Text"
          ></textarea>
          <span className={style['create__error']}>{errors?.body && errors?.body?.message}</span>
        </label>

        <label className={style.create__label} htmlFor="tagList">
          <span>Tags</span>
          <div className={style.tags}>
            {!fields.length && (
              <button className={style.tags__add} onClick={() => onAddTag(0)} type="button">
                Add tag
              </button>
            )}
            {fields.map((field, index) => (
              <div key={field.id}>
                <div className={style.tags__tag}>
                  <input
                    className={style.tags__input}
                    {...register(`tagList.${index}.value`, {
                      required:
                        "Tag is required! If you don't want to provide the Tag, please delete the tag before sending form",
                      pattern: {
                        value: /^[a-zA-Z0-9]+$/,
                        message: 'You can use only english letters and digits without spaces and other symbols',
                      },
                    })}
                    type="text"
                    id={`tagList.${index}.value`}
                    placeholder="Tag"
                  />
                  <button className={style.tags__delete} type="button" onClick={() => remove(index)}>
                    Delete
                  </button>
                  {index + 1 === fields.length && (
                    <button className={style.tags__add} onClick={() => onAddTag(index)} type="button">
                      Add tag
                    </button>
                  )}
                </div>
                {errors.tagList && errors.tagList[index] && (
                  <span className={style['create__error']}>{errors.tagList[index].value.message}</span>
                )}
              </div>
            ))}
          </div>
        </label>
        <button className={style.create__submit} type="submit">
          {slug ? 'Send' : 'Create'}
        </button>
      </form>
    </div>
  )
}

export default CreateArticle
