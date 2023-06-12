import { Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'

import { registrAccount } from '../../store/registrSlice'
import { loginAccount } from '../../store/loginSlice'

import style from './Registration.module.scss'

const Registration = () => {
  const dispatch = useDispatch()
  const serverState = useSelector((state) => state.registr)
  const { errorData, loading, currentUser } = serverState
  const loginState = useSelector((state) => state.login)
  const { isLogged } = loginState
  const shouldRedirect = !loading && currentUser && isLogged
  const [redirecting, setRedirecting] = useState(false)

  const {
    register,
    watch,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({ mode: 'onBlur' })

  const history = useHistory()
  const onSubmit = async (data) => {
    const { password, email } = data
    setRedirecting(true)
    await dispatch(registrAccount(data))
    await dispatch(loginAccount({ email, password }))
    setRedirecting(false)
  }

  useEffect(() => {
    if (shouldRedirect && !redirecting) history.push('/')
  }, [redirecting])

  if (loading || redirecting) {
    return <Spin style={{ marginTop: 300 }}></Spin>
  }

  const userNameErr = errorData.username ? 'Username ' + errorData.username : null
  const emailErr = errorData.email ? 'Email ' + errorData.email : null

  return (
    <div className={style.registr}>
      <span className={style.registr__title}>Create new account</span>
      <form className={style.registr__form} onSubmit={handleSubmit(onSubmit)}>
        <label className={style.registr__label} htmlFor="username">
          <span>Username</span>
          <input
            className={style.registr__input}
            {...register('username', {
              required: 'Username field is required.',
              minLength: { value: 3, message: 'Your username needs to be at least 3 characters.' },
              maxLength: { value: 20, message: 'Your username needs to be no more 20 characters.' },
            })}
            type="text"
            id="username"
            placeholder="Username"
          ></input>
          <span className={style.registr__error}>{(errors?.username && errors?.username?.message) || userNameErr}</span>
        </label>
        <label className={style.registr__label} htmlFor="email">
          <span>Email address</span>
          <input
            className={style.registr__input}
            {...register('email', {
              required: 'Email field is required.',
              pattern: {
                value: /^[a-z0-9._%+-]+@[a-z0-9-.]+\.[a-z0-9-.]+$/,
                message: 'Invalid email address.',
              },
            })}
            type="text"
            id="email"
            placeholder="Email address"
          ></input>
          <span className={style.registr__error}>{(errors?.email && errors?.email?.message) || emailErr}</span>
        </label>
        <label className={style.registr__label} htmlFor="password">
          <span>Password</span>
          <input
            className={style.registr__input}
            {...register('password', {
              required: 'Password field is required.',
              minLength: { value: 6, message: 'Your password needs to be at least 6 characters.' },
              maxLength: { value: 40, message: 'Your password needs to be no more 40 characters.' },
            })}
            type="text"
            id="password"
            placeholder="Password"
          ></input>
          <span className={style.registr__error}>{errors?.password && errors?.password?.message}</span>
        </label>
        <label className={style.registr__label} htmlFor="repeatPass">
          <span>Repeat Password</span>
          <input
            className={style.registr__input}
            {...register('repeatPass', {
              required: 'Repeat password field is required.',
              validate: (value) => {
                if (watch('password') != value) {
                  return 'Passwords must match.'
                }
              },
            })}
            type="text"
            id="repeatPass"
            placeholder="Repeat Password"
          ></input>
          <span className={style.registr__error}>{errors?.repeatPass && errors?.repeatPass?.message}</span>
        </label>
        <div className={style.registr__line}></div>
        <label className={style.registr__political} htmlFor="political">
          <input
            className={style['registr__check-box']}
            {...register('political', {
              required: 'You needs accept our terms.',
            })}
            id="political"
            type="checkbox"
          ></input>
          <span className={style['registr__custom-checkbox']}></span>
          <span>I agree to the processing of my personal information</span>
        </label>
        <span className={style['registr__terms-error']}>{errors?.political && errors?.political?.message}</span>
        <button
          className={isValid ? style.registr__submit : style.registr__submitDisabled}
          type="submit"
          disabled={!isValid}
        >
          Create
        </button>
      </form>
      <span className={style.registr__login}>
        Already have an account?{' '}
        <Link className={style['registr__sign-in']} to={'/sign-in'}>
          Sign In
        </Link>
        .
      </span>
    </div>
  )
}

export default Registration
