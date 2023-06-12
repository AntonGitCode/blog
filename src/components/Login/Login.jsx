import { Spin } from 'antd'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'

import { loginAccount, loginSlice } from '../../store/loginSlice'
import Error from '../Error'

import style from './Login.module.scss'

const Login = () => {
  const dispatch = useDispatch()
  const loginState = useSelector((state) => state.login)
  const { isLogged, loading, errorLogin } = loginState

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: 'onBlur' })

  useEffect(() => {
    return () => {
      dispatch(loginSlice.actions.clearError())
    }
  }, [])

  const onSubmit = (data) => {
    dispatch(loginAccount(data))
  }

  if (isLogged) {
    return <Redirect to={'/'}></Redirect>
  }

  if (loading) {
    return <Spin style={{ marginTop: 300 }}></Spin>
  }

  const dataErr = errorLogin == 422 ? 'Email or password is invalid.' : null
  if (errorLogin && errorLogin !== 422) return <Error></Error>

  return (
    <div className={style.login}>
      <span className={style.login__title}>Sign In</span>
      {/* form */}
      <form className={style.login__form} onSubmit={handleSubmit(onSubmit)}>
        <label className={style.login__label} htmlFor="email">
          <span>Email address</span>
          <input
            className={style.login__input}
            {...register('email', {
              required: 'Email field is required.',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address.',
              },
            })}
            type="text"
            id="email"
            placeholder="email address"
          ></input>
          <span className={style['login__error']}>{errors?.email && errors?.email?.message}</span>
        </label>
        <label className={style.login__label} htmlFor="password">
          <span>Password</span>
          <input
            className={style.login__input}
            {...register('password', {
              required: 'Password field is required.',
            })}
            type="text"
            id="password"
            placeholder="Password"
          ></input>
          <span className={style['login__error']}>{errors?.password && errors?.password?.message}</span>
        </label>
        <span className={style['login__error']}>{dataErr}</span>
        <button className={style.login__submit} type="submit">
          Login
        </button>
      </form>
      <span className={style.login__reg}>
        Already have an account?{' '}
        <Link className={style['login__sign-up']} to={'/sign-up'}>
          Sign Up
        </Link>
        .
      </span>
    </div>
  )
}

export default Login
