import React from 'react';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
// import logo from './logo.svg';
import './App.css';

import Layout from './components/UI/Layout/Layout';
import ShoppingCartManager from './containers/ShoppingCartManager/ShoppingCartManager'
import TaskManager from './containers/TaskManager/TaskManager'
function App() {
  return (

    <div className="App">
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route path='/supermarket'>
              <ShoppingCartManager />
            </Route>
            <Route path='/tasks'>
              <TaskManager />
            </Route>
            <Redirect from='/' to='/supermarket' />
          </Switch>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
