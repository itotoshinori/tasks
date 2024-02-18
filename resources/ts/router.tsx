import React, { useEffect } from 'react'
import { TaskPage } from './pages/tasks/index'
import { LoginPage } from './pages/login/'
import { HelpPage } from './pages/help/'
import { TestPage } from './pages/testpage/'
import { TestPage2 } from './pages/testpage2/'
import { DetailPage } from './pages/tasks/detail'
import { HomePage } from './pages/home/'
import { useLogout, useUser } from './queries/AuthQuery'
import { useAuth } from './hooks/AuthContext';

import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";

const Router = () => {
  const logout = useLogout()
  const { isAuth, setIsAuth } = useAuth()
  const { isLoading, data: authUser } = useUser()

  useEffect(() => {
    if (authUser) {
      setIsAuth(true)
    }
  }, [authUser])

  const navigation = (
    <header className="global-head">
      <ul>
        <li><Link to="/login">ログイン</Link></li>
        <li><Link to="/help">Help</Link></li>
      </ul>
    </header>
  )

  const loginnavigation = (
    <header className="global-head">
      <ul>
        <li><a href="/">タスク</a></li>
        <li onClick={() => logout.mutate()} style={{ cursor: 'pointer' }}>ログアウト</li>
        <li><Link to="/help">Help</Link></li>
      </ul>
    </header>
  )
  const NotFoundPage = () => {
    return (
      <div className="align-center">
        <div className="login-page">
          <div>該当のURLは存在しません</div>
        </div>
      </div>
    );
  };
  return (
    <BrowserRouter>
      {isAuth ? loginnavigation : navigation}
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        <Route exact path="/">
          {isAuth ?
            <TaskPage />
            :
            <HomePage />
          }
        </Route>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        <Route exact path="/help">
          <HelpPage />
        </Route>
        <Route exact path="/testpage">
          <TestPage />
        </Route>
        <Route exact path="/testpage2">
          <TestPage2 />
        </Route>
        <Route path="/detail">
          <DetailPage />
        </Route>
        <Route path="*">
          <NotFoundPage />
        </Route>
      </Switch>
    </BrowserRouter >
  );
}

export default Router
