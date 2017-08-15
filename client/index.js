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
import {TimerStore} from './TimerStore';
import {useStrict} from 'mobx';
useStrict(true);

const timerStore = new TimerStore();

ReactDOM.render(
  <BrowserRouter>
    <Route path="/" render={routeProps => <App {...routeProps} timerStore={timerStore}/>}>
    </Route>
  </BrowserRouter>,
  document.getElementById('root')
)
