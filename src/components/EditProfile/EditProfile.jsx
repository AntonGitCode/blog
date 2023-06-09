import { Spin } from 'antd'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { editAccount } from '../../store/editSlice'
import Error from '../Error'

import style from './EditProfile.module.scss'

const EditProfile = () => {
  const dispatch = useDispatch()
  const isLogged = useSelector((state) => state.user.isLogged)
  const editState = useSelector((state) => state.edit)
  const { loading, error } = editState

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: 'onBlur' })

  const onSubmit = (data) => {
    dispatch(editAccount(data))
  }

  if (loading) {
    return <Spin style={{ marginTop: 300 }}></Spin>
  }

  if (error) {
    return <Error></Error>
  }

  if (!isLogged) {
    return <Redirect to="/login"></Redirect>
  }

  return (
    <div className={style.edit}>
      <span className={style.edit__title}>Edit Profile</span>
      <form className={style.edit__form} onSubmit={handleSubmit(onSubmit)}>
        <label className={style.edit__label} htmlFor="username">
          <span>Username</span>
          <input
            className={style.edit__input}
            {...register('username', {
              required: 'Username field is required.',
              minLength: { value: 3, message: 'Your username needs to be at least 3 characters.' },
              maxLength: { value: 20, message: 'Your username needs to be no more 20 characters.' },
            })}
            type="text"
            id="username"
            placeholder="Username"
          ></input>
          <span className={style.edit__error}>{errors?.username && errors?.username?.message}</span>
        </label>
        <label className={style.edit__label} htmlFor="email">
          <span>Email address</span>
          <input
            className={style.edit__input}
            {...register('email', {
              required: 'Email field is required.',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address.',
              },
            })}
            type="text"
            id="email"
            placeholder="Email address"
          ></input>
          <span className={style.edit__error}>{errors?.email && errors?.email?.message}</span>
        </label>
        <label className={style.edit__label} htmlFor="newPassword">
          <span>New password</span>
          <input
            className={style.edit__input}
            {...register('newPassword', {
              minLength: { value: 6, message: 'Your password needs to be at least 6 characters.' },
              maxLength: { value: 40, message: 'Your password needs to be no more 40 characters.' },
            })}
            type="text"
            id="newPassword"
            placeholder="New password"
          ></input>
          <span className={style.edit__error}>{errors?.newPassword && errors?.newPassword?.message}</span>
        </label>
        <label className={style.edit__label} htmlFor="avatar">
          <span>Avatar image (url)</span>
          <input
            className={style.edit__input}
            {...register('avatar', {
              pattern: {
                value:
                  // eslint-disable-next-line no-useless-escape
                  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi,
                message: 'Invalid url address.',
              },
            })}
            type="text"
            id="avatar"
            placeholder="Avatar image"
          ></input>
          <span className={style.edit__error}>{errors?.avatar && errors?.avatar?.message}</span>
        </label>
        <button className={style.edit__submit} type="submit">
          Save
        </button>
      </form>
    </div>
  )
}

export default EditProfile
