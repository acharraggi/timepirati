/*
    ./client/index.js
    which is the webpack entry file
*/
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import {TimerStore} from './TimerStore';
import {useStrict} from 'mobx';
useStrict(true);

const timerStore = new TimerStore();

ReactDOM.render(
    <App timerStore={timerStore}/>,
    document.getElementById('root'));
