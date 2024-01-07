import React, { useEffect } from 'react'
import { TaskPage } from './pages/tasks/index'
import { LoginPage } from './pages/login/'
import { HelpPage } from './pages/help/'
import { TestPage } from './pages/testpage/'
import { DetailPage } from './pages/tasks/detail'
import { HomePage } from './pages/home/'
import { useLogout, useUser } from './queries/AuthQuery'
import { AuthProvider, useAuth } from './hooks/AuthContext';

import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  RouteProps,
  Redirect
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

  const GuardRoute = (props: RouteProps) => {
    if (!isAuth) return <Redirect to="login" />
    return <Route {...props} />
  }

  const LoginRoute = (props: RouteProps) => {
    if (isAuth) return <Redirect to="/tasks" />
    return <Route {...props} />
  }

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
        <li><Link to="/tasks">タスク</Link></li>
        <li onClick={() => logout.mutate()} style={{ cursor: 'pointer' }}>ログアウト</li>
        <li><Link to="/help">Help</Link></li>
        <li><Link to="/testpage">テストページ</Link></li>
      </ul>
    </header>
  )
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
        <Route path="/tasks">
          {isAuth ?
            <TaskPage />
            :
            <HomePage />
          }
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/help">
          <HelpPage />
        </Route>
        <Route path="/testpage">
          <TestPage />
        </Route>
        <Route path="/detail">
          <DetailPage />
        </Route>
      </Switch>
    </BrowserRouter >
  );
}

export default Router
