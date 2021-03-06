import React, { Suspense, useEffect } from 'react';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
// import logo from './logo.svg';
import './App.css';

import Layout from './components/UI/Layout/Layout';
import Auth from './containers/Auth/Auth';
import Spinner from 'react-bootstrap/Spinner';
import { connect } from 'react-redux';
import * as actions from './store/actions'
import ShoppingCartManager from './containers/ShoppingCartManager/ShoppingCartManager'
// const TaskManager = lazy(() => import('./containers/TaskManager/TaskManager'))

function App(props) {
  const { onAutoLogin } = props
  useEffect(() => {
    onAutoLogin()

  }, [onAutoLogin])

  return (

    <div className="App">
      <BrowserRouter>
        <Suspense fallback={Spinner}>
          <Layout isAuth={props.isAuth} logout={props.onLogout}>
            <Switch>
              <Route path='/auth' component={Auth} />
              <Route path='/supermarket' component={ShoppingCartManager} />
              {/* <Route path='/tasks' component={TaskManager} /> */}
              <Redirect from='/' to='/auth' />
            </Switch>
          </Layout>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}
const mapStateToProps = state => {
  return {
    isAuth: state.auth.token !== null
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onAutoLogin: () => dispatch(actions.autoLogin()),
    onLogout: () => dispatch(actions.logout())

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);