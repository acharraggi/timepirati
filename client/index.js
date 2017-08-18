/*
    ./client/index.js
    which is the webpack entry file
*/
import React from 'react';
import ReactDOM from 'react-dom';
//import { Router, Route} from 'react-router';
import {
  BrowserRouter,
  Route
} from 'react-router-dom';
import App from './components/App.jsx';
import {RootStore} from './RootStore';
import {useStrict} from 'mobx';
useStrict(true);

const rootStore = new RootStore();

ReactDOM.render(
  <BrowserRouter>
    <Route path="/" render={routeProps => <App {...routeProps} rootStore={rootStore}/>}>
    </Route>
  </BrowserRouter>,
  document.getElementById('root')
)
