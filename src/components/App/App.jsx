import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import ArticleList from '../ArticleList'
import ArticlePage from '../ArticlePage'
import CreateArticle from '../CreateArticle/CreateArticle'
import EditProfile from '../EditProfile/EditProfile'
import Header from '../Header'
import Login from '../Login'
import Registration from '../Registration'

import './App.scss'

const App = () => {
  return (
    <Router>
      <div className="container">
        <Header></Header>
        <main className="main">
          <Route path={'/'} exact component={ArticleList} />
          <Route path={'/articles'} exact component={ArticleList}></Route>
          <Route
            path={'/articles/:slug'}
            exact
            render={({ match }) => {
              return <ArticlePage slug={match.params.slug}></ArticlePage>
            }}
          ></Route>
          <Route path={'/sign-up'} component={Registration}></Route>
          <Route path={'/sign-in'} component={Login}></Route>
          <Route path={'/profile'} component={EditProfile}></Route>
          <Route path={'/new-article'} exact component={CreateArticle}></Route>
          <Route path={'/articles/:slug/edit'} component={CreateArticle}></Route>
        </main>
      </div>
    </Router>
  )
}

export default App
