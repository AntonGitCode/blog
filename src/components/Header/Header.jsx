import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'

import { setEdited } from '../../store/editSlice'
import { setIsLogged } from '../../store/loginSlice'
import { getCurrentUser, setLogout, setUserData } from '../../store/userSlice'

import style from './Header.module.scss'

const Header = () => {
  const dispatch = useDispatch()
  const userState = useSelector((state) => state.user)
  const { isLogged, userData } = userState
  const { username, image } = userData
  const loginTrue = useSelector((state) => state.login.isLogged)
  const editState = useSelector((state) => state.edit)
  const { newUserData, edited } = editState
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (token) {
      dispatch(getCurrentUser(token))
    }
  }, [loginTrue])

  useEffect(() => {
    if (edited) {
      dispatch(setUserData(newUserData))
      dispatch(setEdited(false))
    }
  }, [newUserData])

  const onLogout = () => {
    localStorage.removeItem('token')
    dispatch(setIsLogged(false))
    dispatch(setLogout())
    return <Redirect to="/"></Redirect>
  }

  const actions = (state) => {
    if (!state) {
      return (
        <>
          <Link to="/sign-in" className={style.header__login}>
            Sign In
          </Link>
          <Link to="/sign-up" className={style.header__reg}>
            Sign Up
          </Link>
        </>
      )
    }
    return (
      <>
        <Link to="/new-article" className={style.header__create}>
          Create article
        </Link>
        <Link to="/profile" className={style.header__profile}>
          {username}
          <img className={style.header__avatar} src={image}></img>
        </Link>
        <button onClick={onLogout} className={style.header__logout}>
          Log Out
        </button>
      </>
    )
  }
  return (
    <div className={style.header}>
      <Link to="/" className={style.header__name}>
        Realworld Blog
      </Link>
      <div className={style.header__actions}>{actions(isLogged)}</div>
    </div>
  )
}

export default Header
